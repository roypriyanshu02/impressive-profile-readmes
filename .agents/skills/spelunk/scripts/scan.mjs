#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { c as scanDirectory, l as watchDirectory, u as runCliCommand } from "./common.mjs";
//#region src/commands/scan.ts
const scanCommand = {
	name: "scan",
	skipUpToDateCheck: true,
	positionalDirIndex: 0,
	options: {
		concurrency: { type: "string" },
		watch: {
			type: "boolean",
			short: "w"
		}
	},
	validate: (opts) => {
		if (opts.concurrency) {
			const parsed = parseInt(opts.concurrency, 10);
			if (isNaN(parsed) || parsed <= 0) return "Concurrency limit must be a positive integer.";
		}
		return true;
	},
	execute: (dbPath, opts, positionals) => {
		const rootDir = opts.dir || positionals[0] || process.cwd();
		const concurrency = opts.concurrency ? parseInt(opts.concurrency, 10) : void 0;
		const offline = opts["no-download"];
		const forceFallback = opts["force-fallback"];
		if (opts.watch) return watchDirectory({
			rootDir,
			dbPath,
			concurrency,
			offline,
			forceFallback
		});
		return scanDirectory({
			rootDir,
			dbPath,
			concurrency,
			offline,
			forceFallback
		});
	},
	formatMarkdown: (res) => {
		const duration = res.metrics ? `${(res.metrics.durationMs / 1e3).toFixed(2)}s` : "N/A";
		const speed = res.metrics ? `${res.metrics.filesPerSecond.toFixed(1)} files/s` : "N/A";
		return [
			"### Spelunk Scan Completed",
			`- **Total files found**: ${res.fileCount}`,
			`- **Parsed (new or changed)**: ${res.parsedCount}`,
			`- **Unchanged (cached)**: ${res.unchangedCount}`,
			`- **Skipped / Parse errors**: ${res.skippedCount}`,
			`- **Scan duration**: ${duration} (${speed})`
		].join("\n");
	}
};
runCliCommand(scanCommand);
//#endregion
export { scanCommand };

//# sourceMappingURL=scan.mjs.map