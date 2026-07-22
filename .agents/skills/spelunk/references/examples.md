# Spelunk Reference Payloads & SQL Examples

## Standard File Record Schema

```json
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
```

## SQL Query Examples

Run queries via `node <skill-path>/scripts/query.mjs`. Always parameterize dynamic inputs using placeholders (`?`).

- **Unparsed files**:
  `node <skill-path>/scripts/query.mjs "SELECT path, reason FROM files WHERE parsed = 0"`

- **Symbol exporter**:
  `node <skill-path>/scripts/query.mjs "SELECT file_path FROM file_exports WHERE name = ?" "SpelunkDB"`

- **Symbol exports using JSON helpers**:
  `node <skill-path>/scripts/query.mjs "SELECT path FROM files, json_each(files.exports) WHERE json_each.value = ?" "SpelunkDB"`

- **Fuzzy search across exports**:
  `node <skill-path>/scripts/query.mjs "SELECT path FROM files_fts WHERE exports MATCH ?" "Router"`

## Command Output Payloads (`--format json`)

### Find command (`node <skill-path>/scripts/find.mjs Router --format json`)

```json
{
  "files": [/* Standard File Record Object */],
  "limit": 50,
  "offset": 0,
  "total_count": 1,
  "has_more": false
}
```

### Outline command (`node <skill-path>/scripts/outline.mjs src/services/db.ts --format json`)

```json
{
  "files": [/* Standard File Record Object */]
}
```

### Dependency command (`node <skill-path>/scripts/deps.mjs src/services/db.ts in --format json`)

```json
{
  "files": [
    {
      "path": "src/index.ts",
      "parsed": true,
      "reason": null,
      "hash": "4a7b...",
      "exports": [],
      "imports": ["./services/db"],
      "summary": "Application entry point.",
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

### Explain command (`node <skill-path>/scripts/explain.mjs src/services/db.ts --format json`)

```json
{
  "path": "src/services/db.ts",
  "summary": "Manages SQLite initialization and CRUD operations.",
  "stale": false
}
```

### Diff command (`node <skill-path>/scripts/diff.mjs src/old.ts src/new.ts --format json`)

```json
{
  "fileA": "src/old.ts",
  "fileB": "src/new.ts",
  "exports": {
    "added": ["NewExport"],
    "removed": ["OldExport"]
  },
  "imports": {
    "added": ["path"],
    "removed": ["fs"]
  }
}
```

### Export command (`node <skill-path>/scripts/export.mjs json`)

```json
{
  "files": [/* Standard File Record Array */]
}
```

### Scan command (`node <skill-path>/scripts/scan.mjs --format json`)

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

### Status command (`node <skill-path>/scripts/status.mjs --format json`)

```json
{
  "upToDate": true,
  "reason": "Git HEAD matches last scan and working directory is clean."
}
```

### Query command (`node <skill-path>/scripts/query.mjs "SELECT path, parsed, size FROM files WHERE parsed = 1" --format json`)

```json
[
  {
    "path": "src/services/db.ts",
    "parsed": 1,
    "size": 19719
  }
]
```

### Standard Error Payload

```json
{
  "isError": true,
  "message": "Error description message."
}
```
