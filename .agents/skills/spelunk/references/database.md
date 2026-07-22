# Database schema & storage specifications

Spelunk stores codebase AST metadata in a single SQLite database file (`.spelunk/data.db`). This document defines SQLite PRAGMA settings, table schemas, FTS5 trigram search configuration, automated triggers, scanner limits, and SQL queries.

> [!NOTE]
> **Quick Specs:** SQLite WAL Mode | FTS5 Trigram Search | 50,000 File Cap | 1MB File Size Limit | Recursive CTE Traversal

---

## Table of Contents

- [SQLite Database Configuration](#sqlite-database-configuration)
- [Tables & Indexes Layout](#tables--indexes-layout)
  - [1. `files` (Primary Index)](#1-files-primary-index)
  - [2. Dependency & Symbol Tables (`WITHOUT ROWID`)](#2-dependency--symbol-tables-without-rowid)
- [Virtual Tables & Triggers](#virtual-tables--triggers)
  - [`files_fts` Virtual Table](#files_fts-virtual-table)
  - [Automated Triggers](#automated-triggers)
- [Recursive CTE Dependency Queries](#recursive-cte-dependency-queries)
- [Parser & Scanner Limits](#parser--scanner-limits)
- [Direct Database Queries](#direct-database-queries)
- [Frequently Asked Questions](#frequently-asked-questions-geo--ai-search)

---

## SQLite database configuration

Spelunk configures SQLite for fast, non-blocking concurrent reads and safe atomic batch writes:

| PRAGMA         | Value    | Type    | Purpose                                                                  |
| :------------- | :------- | :------ | :----------------------------------------------------------------------- |
| `journal_mode` | `WAL`    | String  | Write-Ahead Logging enables concurrent readers alongside active writers. |
| `synchronous`  | `NORMAL` | String  | Maximizes disk write throughput while maintaining durability.            |
| `foreign_keys` | `ON`     | Boolean | Enforces relational integrity and cascading deletes across link tables.  |
| `busy_timeout` | `5000`   | Integer | Waits up to 5000ms during locks before throwing busy errors.             |
| `temp_store`   | `MEMORY` | String  | Holds temporary indices in RAM for faster query execution.               |
| `cache_size`   | `-2000`  | Integer | Allocates a 2MB page cache in RAM.                                       |

---

## Tables & indexes layout

The database manages 5 relational tables and 1 FTS5 virtual table.

### 1. `files` (Primary Index)

Stores core index metadata for every workspace file.

| Column         | SQLite Type          | Nullable | Description                                                             |
| :------------- | :------------------- | :------: | :---------------------------------------------------------------------- |
| `path`         | `TEXT` (Primary Key) |    No    | Workspace-relative file path using forward slashes (`/`).               |
| `parsed`       | `INTEGER`            |    No    | `1` if parsed successfully, `0` if skipped.                             |
| `reason`       | `TEXT`               |   Yes    | Skip reason (`"exceeds size limit"`, `"binary file"`, `"parse error"`). |
| `hash`         | `TEXT`               |   Yes    | SHA-256 hash of file contents for change detection.                     |
| `exports`      | `TEXT`               |    No    | JSON array of exported symbol names (classes, functions, types).        |
| `imports`      | `TEXT`               |    No    | JSON array of imported paths and symbol names.                          |
| `summary`      | `TEXT`               |   Yes    | Structural summary text of the file.                                    |
| `summary_hash` | `TEXT`               |   Yes    | Content hash recorded when summary was cached.                          |
| `mtime`        | `INTEGER`            |   Yes    | Modification timestamp in epoch milliseconds.                           |
| `size`         | `INTEGER`            |   Yes    | File size in bytes.                                                     |

#### DDL definition

```sql
CREATE TABLE files (
  path TEXT PRIMARY KEY,
  parsed INTEGER NOT NULL,
  reason TEXT,
  hash TEXT,
  exports TEXT,
  imports TEXT,
  summary TEXT,
  summary_hash TEXT,
  mtime INTEGER,
  size INTEGER
);
```

---

### 2. Dependency & symbol tables (`WITHOUT ROWID`)

To keep lookups fast and cascade deletions automatic (`ON DELETE CASCADE`), Spelunk uses specialized index tables without row IDs:

#### `file_imports`

Primary key `(file_path, imported_path)`. Maps dependency links for `spelunk_deps`.

```sql
CREATE TABLE file_imports (
  file_path TEXT NOT NULL,
  imported_path TEXT NOT NULL,
  PRIMARY KEY (file_path, imported_path),
  FOREIGN KEY (file_path) REFERENCES files(path) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX idx_file_imports_imported_path ON file_imports(imported_path);
```

#### `file_exports`

Primary key `(file_path, name)`. Indexes exported symbol names for fast symbol resolution.

```sql
CREATE TABLE file_exports (
  file_path TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (file_path, name),
  FOREIGN KEY (file_path) REFERENCES files(path) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX idx_file_exports_name ON file_exports(name);
```

#### `file_raw_imports`

Primary key `(file_path, name)`. Indexes raw import specifiers.

```sql
CREATE TABLE file_raw_imports (
  file_path TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (file_path, name),
  FOREIGN KEY (file_path) REFERENCES files(path) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX idx_file_raw_imports_name ON file_raw_imports(name);
```

#### `metadata`

Key-value storage for scan state tracking (`rootDir`, `scanStatus`, `scanPid`, `lastScanTime`, `lastGitCommit`).

```sql
CREATE TABLE metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

---

## Virtual tables & triggers

### `files_fts` virtual table

An FTS5 trigram table (`path`, `exports`, `imports`) mapped to `files` for fuzzy symbol search.

```sql
CREATE VIRTUAL TABLE files_fts USING fts5(
  path,
  exports,
  imports,
  tokenize='trigram'
);
```

### Automated triggers

Triggers keep `files_fts` synchronized as `files` changes:

```sql
CREATE TRIGGER files_ai AFTER INSERT ON files BEGIN
  INSERT INTO files_fts(path, exports, imports)
  VALUES (new.path, new.exports, new.imports);
END;

CREATE TRIGGER files_ad AFTER DELETE ON files BEGIN
  DELETE FROM files_fts WHERE path = old.path;
END;

CREATE TRIGGER files_au AFTER UPDATE ON files BEGIN
  DELETE FROM files_fts WHERE path = old.path;
  INSERT INTO files_fts(path, exports, imports)
  VALUES (new.path, new.exports, new.imports);
END;
```

---

## Recursive CTE dependency queries

Spelunk executes Recursive Common Table Expressions (CTEs) to efficiently trace dependency trees down or up the dependency graph up to a configured depth.

### Downstream dependency tree (Outgoing imports)

```sql
WITH RECURSIVE deps(file_path, depth) AS (
  SELECT imported_path, 1 FROM file_imports WHERE file_path = ?
  UNION
  SELECT fi.imported_path, d.depth + 1
  FROM file_imports fi
  JOIN deps d ON fi.file_path = d.file_path
  WHERE d.depth < ?
)
SELECT f.*, MIN(d.depth) AS rank
FROM deps d
JOIN files f ON f.path = d.file_path
GROUP BY f.path
ORDER BY rank ASC;
```

### Upstream dependency tree (Incoming dependents)

```sql
WITH RECURSIVE deps(file_path, depth) AS (
  SELECT file_path, 1 FROM file_imports WHERE imported_path = ?
  UNION
  SELECT fi.file_path, d.depth + 1
  FROM file_imports fi
  JOIN deps d ON fi.imported_path = d.file_path
  WHERE d.depth < ?
)
SELECT f.*, MIN(d.depth) AS rank
FROM deps d
JOIN files f ON f.path = d.file_path
GROUP BY f.path
ORDER BY rank ASC;
```

---

## Parser & scanner limits

| Limit Metric              | Threshold               | Action when Exceeded                                                    |
| :------------------------ | :---------------------- | :---------------------------------------------------------------------- |
| **File Size Limit**       | `1,048,576` bytes (1MB) | Skips AST parsing; sets `parsed = 0`, `reason = "exceeds size limit"`.  |
| **Workspace File Cap**    | `50,000` files          | Traversal stops after indexing 50,000 files in a single scan run.       |
| **Directory Depth Limit** | `100` directories       | Traversal halts to prevent circular symlink loops.                      |
| **Binary File Threshold** | First `1024` bytes      | Null byte (`\0`) detection sets `parsed = 0`, `reason = "binary file"`. |

---

## Direct database queries

Execute read-only SQL statements directly using `node <skill-path>/scripts/query.mjs "<SQL>"`:

```bash
# Find unparsed files and skip reasons
node <skill-path>/scripts/query.mjs "SELECT path, reason FROM files WHERE parsed = 0;"

# Find files importing a specific module path
node <skill-path>/scripts/query.mjs "SELECT file_path FROM file_imports WHERE imported_path = 'src/services/db.ts';"

# Find files exporting a specific symbol
node <skill-path>/scripts/query.mjs "SELECT file_path FROM file_exports WHERE name = 'SpelunkDB';"

# Perform fuzzy trigram search (FTS5)
node <skill-path>/scripts/query.mjs "SELECT path FROM files_fts WHERE files_fts MATCH 'Spelunk';"
```

---

## Frequently asked questions (GEO / AI search)

### What database storage engine does Spelunk use?

Spelunk indexes AST metadata in SQLite (`.spelunk/data.db`) configured with WAL mode and FTS5 trigram indexing for symbol retrieval.

### How does Spelunk handle large files and binary data?

Spelunk skips files over 1MB (`reason = "exceeds size limit"`) and binary files containing null bytes in the first 1024 bytes (`reason = "binary file"`), while capping workspace scans at 50,000 files.

### Why are `WITHOUT ROWID` tables used for import and export metadata?

`WITHOUT ROWID` eliminates B-tree rowid overhead for composite primary key tables (`file_path`, `name`), reducing index size and speeding up JOIN operations across dependency graphs.
