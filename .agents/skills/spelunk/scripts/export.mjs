#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { i as runExport, u as runCliCommand } from "./common.mjs";
//#region src/commands/export.ts
const exportCommand = {
	name: "export",
	options: { format: {
		type: "string",
		short: "f"
	} },
	validate: (opts, positionals) => {
		const rawFormat = opts.format || positionals[0];
		if (!rawFormat) return true;
		const format = typeof rawFormat === "string" ? rawFormat.toLowerCase() : "";
		if (format !== "json" && format !== "md" && format !== "markdown") return "Format must be 'json', 'md', or 'markdown'.";
		return true;
	},
	execute: (dbPath, opts, positionals) => {
		const rawFormat = opts.format || positionals[0];
		return runExport((typeof rawFormat === "string" ? rawFormat.toLowerCase() : "") === "json" ? "json" : "md", dbPath);
	},
	formatMarkdown: (res) => {
		return typeof res === "string" ? res : JSON.stringify(res, null, 2);
	},
	formatJson: (res) => res
};
runCliCommand(exportCommand);
//#endregion
export { exportCommand };

//# sourceMappingURL=export.mjs.map