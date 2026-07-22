---
name: spelunk
description: AST-powered codebase indexer using SQLite and Tree-sitter. Caches imports, exports, symbols, and dependency graphs. Traces dependency trees, locates symbol definitions, outlines files, calculates structural diffs, and maps codebase architecture. Trigger whenever the user asks about codebase structure, file dependencies, import/export outlines, call graphs, architecture maps, or symbol definitions. Exclude small repositories (fewer than 15 files) or single-file text grep searches.
compatibility: node >= 24.18.0 (native node:sqlite)
metadata:
  argument-hint: "[find|deps|outline|explain|diff|scan|query] [options]"
  repository: https://github.com/roypriyanshu02/spelunk
---

# Spelunk

Spelunk indexes codebases into local SQLite via Tree-sitter. Querying the index replaces slow file scans (`cat`/`grep`) and saves up to 90% of token budget.

## Database persistence

`.spelunk/data.db` (or `SPELUNK_DB_PATH`) persists across agent sessions. Index status and metadata are durable. Re-verify index freshness only on command failure or file modifications. Do not check environment or rescan on session start.

## Guidelines

### 🚀 Environment & Index Lifecycle

- **Check Before Scanning**: Run `scan.mjs` only when `.spelunk/data.db` is missing/empty or on initial workspace setup.
- **Incremental Updates**: Limit rescans to modified files when stderr indicates the index is out of date.

### 🔍 Search & Dependency Resolution

- **Symbol & Dependency Lookups**: Use `deps.mjs` to trace import chains down or up the tree instead of reading files line-by-line. Use `find.mjs` to locate symbol definitions.
- **Fuzzy Search**: Query `files_fts` table via `query.mjs` for trigram search when exact symbol lookups fail.
- **Refactor Impact**: Run `diff.mjs` after modifying imports/exports to verify downstream dependencies before committing changes.

### 🛡️ Safety & Security

- **Read-Only SQL**: `query.mjs` strictly permits read-only statements (`SELECT`, `WITH`, `PRAGMA`, `EXPLAIN`). Always parameterize dynamic inputs with `?` placeholders.
- **Credential Protection**: Credential files (`.env`, `.pem`, SSH keys) are automatically excluded during scans.
- **Gitignore Hygiene**: Ensure `.spelunk/` is present in your workspace `.gitignore`.

### ⚡ Performance & Batching

- **Token Efficiency**: Default to `--format json` for intermediate agent reasoning to save tokens. Reserve `--format markdown` for final user presentation.
- **Batching Queries**: Combine sequential SQL lookups into a single `query.mjs` call to avoid Node process startup overhead (~100–300ms per invocation).
- **Scoping Flags**: Use `--limit`, `--file`, and `--query` to keep returned payloads targeted.

### 🪜 Resolution Ladder (Stop at first matching rung)

1. **Rung 1**: Query existing SQLite index (`.spelunk/data.db`).
2. **Rung 2**: Run `scan.mjs` incrementally for modified files if index is stale.
3. **Rung 3**: Fall back to regex parsing (`--force-fallback`) if WASM grammars fail offline.
4. **Rung 4**: Fall back to text search (`grep`/`cat`) as last resort for single-file lookups.

### ⚠️ System Limitations

- **File Size & Type**: Files >1MB and binary files are skipped from AST parsing.
- **Dynamic Constructs**: Dynamic `import()`, reflection, and C/C++ preprocessor macros are not evaluated statically.

## Script usage

Run scripts from workspace root using Node.js. Replace `<skill-path>` with the absolute skill path. Global flags: `--format <json|markdown>` (`-f`), `--dir <dir>`, `--no-download`, `--force-fallback`.

Quick example: `node <skill-path>/scripts/find.mjs Router`

- `node <skill-path>/scripts/status.mjs [<dir>]`
- `node <skill-path>/scripts/query.mjs "<sql>" [<args>...]`
- `node <skill-path>/scripts/scan.mjs [<dir>] [--concurrency <n>] [-w|--watch]`
- `node <skill-path>/scripts/find.mjs <query>|--query|-q <query> [-l <limit>] [-o <offset>]`
- `node <skill-path>/scripts/outline.mjs <filepath>|--file <filepath>`
- `node <skill-path>/scripts/deps.mjs <filepath>|--file <filepath> <in|out>|--direction <in|out> [<depth>|-d <depth>] [-l <limit>] [-o <offset>]`
- `node <skill-path>/scripts/explain.mjs <filepath>|--file <filepath> [--set-summary "<text>"]`
- `node <skill-path>/scripts/export.mjs [<format>]`
- `node <skill-path>/scripts/diff.mjs <fileA>|--file-a <fileA> <fileB>|--file-b <fileB>`

> [!IMPORTANT]
> WASM grammars fetch to `~/.cache/spelunk/wasm/` on first run. Force offline mode with `--no-download` (`SPELUNK_OFFLINE=1`), force fallback with `--force-fallback` (`SPELUNK_FORCE_FALLBACK=1`), or set custom grammars via `SPELUNK_WASM_DIR`. Credential files (`.env`, `.pem`, SSH keys) are automatically skipped. Ensure `.spelunk/` is listed in `.gitignore`.

## Database schema

Inspect [references/database.md](./references/database.md) for full DDL, indexes, and triggers.

- **`files`**: Primary records (`path`, `parsed`, `reason`, `hash`, `exports`, `imports`, `summary`, `summary_hash`, `mtime`, `size`).
- **`file_imports`**: Resolved dependency links (`file_path`, `imported_path`).
- **`file_exports` & `file_raw_imports`**: Flat symbol name indexes (`file_path`, `name`).
- **`metadata`**: Workspace configuration (`key`, `value`). Known keys: `rootDir`, `scanStatus`, `scanPid`, `lastScanTime`, `lastGitCommit`.
- **`files_fts`**: Virtual FTS5 trigram search table auto-synced with `files`.

## Reference payloads & SQL examples

Inspect Level 3 reference documentation for detailed contracts and schemas:

- [references/examples.md](./references/examples.md): Full JSON output payloads, error schemas, and SQL query examples.
- [references/database.md](./references/database.md): Deep-dive SQLite schema specs, index definitions, and trigram FTS configuration.
- [references/contracts.md](./references/contracts.md): Script invocation contracts and output interface definitions.
- [references/codemap.v1.json](./references/codemap.v1.json): JSON Schema (Draft-07) validation spec for codemap payloads.
