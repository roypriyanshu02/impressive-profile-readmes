# Spelunk

Give your coding agent a map of your codebase.

Spelunk is an AST-powered codebase indexer skill for coding agents. It parses your codebase with Tree-sitter and builds a local SQLite index to help your agent navigate files much faster.

Ever watched your AI agent run `cat` and `grep` on dozens of files just to find where a single function is defined?

Spelunk uses Tree-sitter to parse your codebase and caches files, exports, imports, and dependencies in a local SQLite database. Instead of reading whole files over and over, your agent queries this index to find definitions under 100ms, saving up to 90% on token costs.

## Typical agent & human workflow

```text
  [ status.mjs ] ── (Index stale / missing?) ──► [ scan.mjs ]
        │                                              │
        └───────────────────┬──────────────────────────┘
                            ▼
     ┌──────────────────────┼──────────────────────┐
     │                      │                      │
     ▼                      ▼                      ▼
[ find.mjs ]           [ deps.mjs ]          [ outline.mjs ]
(Locate symbols)    (Trace import graphs)   (File structure)
```

## How to use

Ask your agent questions in plain English. The agent automatically queries the SQLite index instead of scanning files manually:

- **Check status:** _"Check if the index is up to date."_
- **Build index:** _"Scan the codebase and build the index."_
- **Locate definitions:** _"Where is the Router class?"_ or _"Find parseRoute."_
- **Trace dependencies:** _"Show what imports index.ts."_ or _"Find files using database.ts."_
- **Outline files:** _"List imports and exports for database.ts."_
- **Summarize structure:** _"Summarize router.ts structural outline."_
- **Compare versions:** _"Compare parser.ts structural diff between version A and B."_
- **Export map:** _"Export the codebase map."_
- **Custom queries:** _"Run custom SQL query on the index."_

> [!NOTE]
> On the first scan, Spelunk builds a `.spelunk/data.db` database in your project root. Future queries reuse this cached index for instant lookups. Everything runs locally on your machine with zero telemetry. Read [SECURITY.md](https://github.com/roypriyanshu02/spelunk/blob/main/SECURITY.md) for details.

## Running scripts manually

Your agent runs these scripts automatically. If you want to test them manually, run the commands from your workspace root:

| Task              | Command                                                                                                                                                                    | Example                                                               |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| Check status      | `node <skill-path>/scripts/status.mjs [<dir>] [--dir <dir>]`                                                                                                               | `node skills/spelunk/scripts/status.mjs`                              |
| Build index       | `node <skill-path>/scripts/scan.mjs [<dir>] [--dir <dir>] [--concurrency <number>] [--watch\|-w]`                                                                          | `node skills/spelunk/scripts/scan.mjs`                                |
| Find symbol       | `node <skill-path>/scripts/find.mjs <query> \| --query\|-q <query> [--limit\|-l <limit>] [--offset\|-o <offset>]`                                                          | `node skills/spelunk/scripts/find.mjs Router`                         |
| Trace imports     | `node <skill-path>/scripts/deps.mjs <path> <in\|out> [<depth>] \| --file <path> --direction <in\|out> [--depth\|-d <depth>] [--limit\|-l <limit>] [--offset\|-o <offset>]` | `node skills/spelunk/scripts/deps.mjs src/index.ts out`               |
| Outline file      | `node <skill-path>/scripts/outline.mjs <path> \| --file <path>`                                                                                                            | `node skills/spelunk/scripts/outline.mjs src/router.ts`               |
| Get / Set summary | `node <skill-path>/scripts/explain.mjs <path> \| --file <path> [--set-summary "<text>"]`                                                                                   | `node skills/spelunk/scripts/explain.mjs src/db.ts`                   |
| Compare files     | `node <skill-path>/scripts/diff.mjs <fileA> <fileB> \| --file-a <fileA> --file-b <fileB>`                                                                                  | `node skills/spelunk/scripts/diff.mjs src/old.ts src/new.ts`          |
| Export map        | `node <skill-path>/scripts/export.mjs [<format>] \| [--format\|-f <json\|md\|markdown>]`                                                                                   | `node skills/spelunk/scripts/export.mjs json`                         |
| Query index       | `node <skill-path>/scripts/query.mjs "<sql>" [<args>...]`                                                                                                                  | `node skills/spelunk/scripts/query.mjs "SELECT COUNT(*) FROM files;"` |

> [!NOTE]
> `<skill-path>` refers to the directory containing this skill, such as `skills/spelunk`. Commands support both named flags and positional parameters where applicable.

### Global options and environment variables

All Spelunk scripts accept the following global command-line flags and environment variable overrides:

- **Global Flags:**
  - `--format <json|markdown>` (`-f`): Format output payload as structured JSON or human-readable Markdown. (`export` script also accepts `md`).
  - `--dir <dir>`: Set target workspace directory.
  - `--no-download`: Prevent fetching WASM grammars over HTTP (forces offline parsing mode).
  - `--force-fallback`: Force regex extraction mode, bypassing Tree-sitter AST parsing.
  - `--clear-wasm-cache`: Clear downloaded WASM files from local cache.

- **Environment Variables:**
  - `SPELUNK_DB_PATH`: Override SQLite database file location (default: `.spelunk/data.db`).
  - `SPELUNK_WASM_DIR`: Custom directory for WASM grammar files (default: `$XDG_CACHE_HOME/spelunk/wasm`, `~/.cache/spelunk/wasm/`, or `%LOCALAPPDATA%\spelunk\wasm`).
  - `SPELUNK_OFFLINE`: Set to `1` or `true` to enable offline mode (default: `0` / unset).
  - `SPELUNK_FORCE_FALLBACK`: Set to `1` or `true` to force regex extraction (default: `0` / unset).

## Supported languages and frameworks

Spelunk parses structural elements (imports, exports, classes, functions, interfaces) across 30+ programming languages and web frameworks:

- **AST Parsers (Tree-sitter):** JavaScript, TypeScript, Python, Java, C++, C#, C, Go, Rust, PHP, Ruby, Swift, Kotlin, SQL, HTML, CSS, Bash, JSON, YAML, TOML, Vue, Svelte, Astro, Lua, Elixir, Zig, Scala, Objective-C, OCaml, Solidity, ReScript, Emacs Lisp, EJS/ERB, TLA+, and SystemRDL.
- **Framework Support:** Full structural indexing for React, Next.js, Vue, Nuxt, SvelteKit, Remix, and Astro via JSX, TSX, Vue, and Svelte parsers.
- **Regex Fallbacks:** Specialized regex parsers extract structure from Dockerfiles, Makefiles, Terraform, PowerShell, Assembly, CSV, and package manifests.

## How it works

Instead of searching raw text, Spelunk parses the structure of your code.

1. **AST Parsing:** When files change, Spelunk uses Tree-sitter to extract imports, exports, classes, and function definitions into a syntax tree. It ignores raw source code, keeping the database tiny.
2. **Local Caching:** Spelunk writes these components to a local SQLite database (`.spelunk/data.db`) using Node's native `node:sqlite` module. You do not need to install `node-gyp` or compile any native addons. Database uses Write-Ahead Logging (`journal_mode = WAL`), foreign keys, five normalized tables (`files`, `file_imports`, `file_exports`, `file_raw_imports`, `metadata`), and an FTS5 trigram virtual table (`files_fts`) for fast fuzzy searches.
3. **Safety Guards:** To keep things fast, the scanner ignores files larger than 1MB, skips binary files, and scans folders up to a maximum depth of 100 directories. It caps indexing at 50,000 files per run and respects `.gitignore` and `.spelunkignore` rules, skipping sensitive credential files automatically.
4. **Queries:** Your agent runs targeted SQL queries against the index to trace dependency paths or find symbols in milliseconds.
5. **Offline & Air-gapped Execution:** Core `tree-sitter.wasm` runtime is pre-bundled inside `scripts/tree-sitter.wasm`. Language grammars (`tree-sitter-<lang>.wasm`) download automatically on first scan to `~/.cache/spelunk/wasm/`. When network access is disabled, Spelunk automatically falls back to regex extraction or pre-seeded grammars specified via `SPELUNK_WASM_DIR`.
6. **Privacy & Transparency:** The indexer runs locally on your machine with zero telemetry or tracking. Build artifacts include sourcemaps (`common.mjs.map`) for complete security auditability.

## Output JSON formats

When using `--format json` (or `-f json`), scripts return structured, predictable JSON payloads:

- **File Records (`FileRecord`):** Contains `path`, `parsed` (boolean), `reason` (string or null), `hash` (SHA-256 string or null), `exports` (string array), `imports` (string array), `summary` (string or null), `summary_hash` (string or null), `mtime` (integer timestamp), and `size` (bytes). Graph nodes returned by `deps` include `rank` indicating depth.
- **Paginated lookups (`find`, `deps`):** Returns `{ "files": [...], "limit": number, "offset": number, "total_count": number, "has_more": boolean }`.
- **File outlines & Map export (`outline`, `export`):** Returns `{ "files": [...] }`.
- **File summaries (`explain`):** Returns `{ "path": string, "summary": string, "stale": boolean }`.
- **Structural diffs (`diff`):** Returns `{ "fileA": string, "fileB": string, "exports": { "added": [], "removed": [] }, "imports": { "added": [], "removed": [] } }`.
- **Scan statistics (`scan`):** Returns `{ "fileCount": number, "parsedCount": number, "skippedCount": number, "unchangedCount": number, "metrics": { ... } }`.
- **Index status (`status`):** Returns `{ "upToDate": boolean, "reason": string }` (exits with code `1` when `upToDate` is `false`).
- **Custom SQL queries (`query`):** Validates read-only statements (`SELECT`, `WITH`, `PRAGMA`, `EXPLAIN`) and returns an array of row objects `[ { ... } ]`.
- **Error outputs:** Prints `{ "isError": true, "message": string }` and exits with code `1`.

For complete schema details, check out [JSON contracts](references/contracts.md) and [Database schema](references/database.md).

## FAQ

### Why use Spelunk instead of plain grep or text search?

`grep` matches plain text, so it cannot distinguish between a class, variable, comment, or string. A search for `Router` returns every single text occurrence. Spelunk understands the syntax tree, so querying `Router` returns the exact file where it is defined or exported, skipping comments and strings.

### Does Spelunk store raw source code in the database?

No. Spelunk indexes structural metadata only (imports, exports, symbols, summaries). Raw source code is never copied into SQLite, which keeps database size tiny (typically under 2MB for large projects).

### How does Spelunk work in offline or air-gapped environments?

Spelunk bundles `tree-sitter.wasm` out of the box. Language grammars download once to `~/.cache/spelunk/wasm/`. When network access is disabled, Spelunk automatically uses offline regex fallback mode or pre-seeded grammars via `SPELUNK_WASM_DIR`.

## Requirements

- **Node.js:** Spelunk requires Node.js version **>= 24.18.0** for native `node:sqlite` database support.
- **Setup:** Initial AST parser downloads require internet access to fetch WASM grammars to `~/.cache/spelunk/wasm/`. Subsequent runs work offline. Offline mode can also be forced with `--no-download` or fallback parsing with `--force-fallback`.

## Read more

We keep extra details in these files if you want to dig deeper:

- [SKILL.md](SKILL.md): Agent schemas and parameters.
- [Database schema](references/database.md) & [JSON contracts](references/contracts.md): Table definitions and JSON response shapes.
- [Main repository](https://github.com/roypriyanshu02/spelunk): Performance benchmarks and documentation.
- [Security guidelines](https://github.com/roypriyanshu02/spelunk/blob/main/SECURITY.md): Local privacy details and offline configuration.

---

_If Spelunk helps you out, we would love a star on [GitHub](https://github.com/roypriyanshu02/spelunk)!_
