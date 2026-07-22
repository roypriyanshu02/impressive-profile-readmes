# Expected output contracts

Spelunk commands output structured JSON payloads inside the `structuredContent` field of their responses. Use these schemas to build custom agents or integrate output.

---

## Table of Contents

- [`spelunk_find`](#spelunk_find)
- [`spelunk_outline`](#spelunk_outline)
- [`spelunk_deps`](#spelunk_deps)
- [`spelunk_explain`](#spelunk_explain)
- [`spelunk_diff`](#spelunk_diff)
- [`spelunk_export`](#spelunk_export)
- [`spelunk_scan`](#spelunk_scan)
- [`spelunk_status`](#spelunk_status)
- [`spelunk_query`](#spelunk_query)
- [System Circuit Breakers & Thresholds](#system-circuit-breakers--thresholds)

---

## `spelunk_find`

Defined in [find.mjs](../scripts/find.mjs). Returns files matching a symbol query.

```json
{
  "files": [
    {
      "path": "src/services/db.ts",
      "parsed": true,
      "reason": null,
      "hash": "4a7b...",
      "exports": ["SpelunkDB", "FileRecord"],
      "imports": ["node:sqlite", "fs", "path"],
      "summary": "Manages SQLite initialization and CRUD operations.",
      "summary_hash": "4a7b...",
      "mtime": 1721160000000,
      "size": 19719
    }
  ],
  "limit": 50,
  "offset": 0,
  "total_count": 1,
  "has_more": false
}
```

---

## `spelunk_outline`

Defined in [outline.mjs](../scripts/outline.mjs). Outlines imports and exports for a specific file.

```json
{
  "files": [
    {
      "path": "src/services/db.ts",
      "parsed": true,
      "reason": null,
      "hash": "4a7b...",
      "exports": ["SpelunkDB", "FileRecord"],
      "imports": ["node:sqlite", "fs", "path"],
      "summary": "Manages SQLite initialization and CRUD operations.",
      "summary_hash": "4a7b...",
      "mtime": 1721160000000,
      "size": 19719
    }
  ]
}
```

---

## `spelunk_deps`

Defined in [deps.mjs](../scripts/deps.mjs). Traces dependency chains forward or backward.

```json
{
  "files": [
    {
      "path": "src/services/db.ts",
      "parsed": true,
      "reason": null,
      "hash": "4a7b...",
      "exports": ["SpelunkDB", "FileRecord"],
      "imports": ["node:sqlite", "fs", "path"],
      "summary": "Manages SQLite initialization and CRUD operations.",
      "summary_hash": "4a7b...",
      "mtime": 1721160000000,
      "size": 19719,
      "rank": 1
    }
  ],
  "limit": 50,
  "offset": 0,
  "total_count": 1,
  "has_more": false
}
```

---

## `spelunk_explain`

Defined in [explain.mjs](../scripts/explain.mjs). Sets or returns structural file summaries.

```json
{
  "path": "src/services/db.ts",
  "summary": "Terse structural summary of the file.",
  "stale": false
}
```

---

## `spelunk_diff`

Defined in [diff.mjs](../scripts/diff.mjs). Compares two versions of a file to detect changes in imports and exports.

```json
{
  "fileA": "src/old.ts",
  "fileB": "src/new.ts",
  "exports": {
    "added": ["NewExport"],
    "removed": ["OldExport"]
  },
  "imports": {
    "added": [],
    "removed": ["fs"]
  }
}
```

---

## `spelunk_export`

Defined in [export.mjs](../scripts/export.mjs). Exports the full codebase index in JSON or Markdown.

### JSON Format

```json
{
  "files": [
    {
      "path": "src/services/db.ts",
      "parsed": true,
      "reason": null,
      "hash": "4a7b...",
      "exports": ["SpelunkDB", "FileRecord"],
      "imports": ["node:sqlite", "fs", "path"],
      "summary": "Manages SQLite initialization and CRUD operations.",
      "summary_hash": "4a7b...",
      "mtime": 1721160000000,
      "size": 19719
    }
  ]
}
```

### Markdown Format

```markdown
# Spelunk Codemap Export

## src/services/db.ts

- **Parsed**: true
- **Exports**:
  - `SpelunkDB`
  - `FileRecord`
- **Imports**:
  - `node:sqlite`
  - `fs`
  - `path`
```

---

## `spelunk_scan`

Defined in [scan.mjs](../scripts/scan.mjs). Triggers a codebase scan and returns file statistics.

```json
{
  "fileCount": 10,
  "parsedCount": 2,
  "skippedCount": 1,
  "unchangedCount": 7,
  "metrics": {
    "durationMs": 120.5,
    "filesPerSecond": 83.0,
    "cacheHitRatio": 0.7,
    "memoryUsageMb": 45.2
  }
}
```

---

## `spelunk_status`

Defined in [status.mjs](../scripts/status.mjs). Returns workspace index status and cache freshness.

```json
{
  "upToDate": true,
  "reason": "Git HEAD matches last scan and working directory is clean."
}
```

---

## `spelunk_query`

Defined in [query.mjs](../scripts/query.mjs). Executes custom read-only SQL queries against `.spelunk/data.db`.

```json
[
  {
    "path": "src/services/db.ts",
    "parsed": 1,
    "size": 19719
  }
]
```

---

## System Circuit Breakers & Thresholds

| Mechanism                  | Threshold                             | Behavior when Triggered                                              |
| :------------------------- | :------------------------------------ | :------------------------------------------------------------------- |
| **Max File Size**          | 1,048,576 bytes (1MB)                 | AST parsing bypassed; `parsed = 0`, `reason = "exceeds size limit"`. |
| **Max Files Scanned**      | 50,000 files                          | Scan traversal stops cleanly at 50,000 files.                        |
| **Directory Depth**        | 100 levels                            | Halts recursion to prevent symlink loops.                            |
| **Binary File Detection**  | Null byte (`\0`) in first 1KB         | `parsed = 0`, `reason = "binary file"`.                              |
| **Read-Only Query Safety** | `SELECT`, `WITH`, `PRAGMA`, `EXPLAIN` | Any `INSERT`, `UPDATE`, `DELETE`, `DROP` rejected with error code 1. |
