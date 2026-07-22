#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { n as runDiff, u as runCliCommand } from "./common.mjs";
import path from "node:path";
import { pathToFileURL } from "node:url";
//#region src/commands/diff.ts
const diffCommand = {
	name: "diff",
	positionalFileIndices: [0, 1],
	options: {
		"file-a": { type: "string" },
		"file-b": { type: "string" }
	},
	validate: (opts, positionals) => {
		const fileA = opts["file-a"] || positionals[0];
		const fileB = opts["file-b"] || positionals[1];
		return !!fileA && !!fileB || "Provide both file-a and file-b paths to compare.";
	},
	execute: (dbPath, opts, positionals) => {
		return runDiff(opts["file-a"] || positionals[0], opts["file-b"] || positionals[1], dbPath);
	},
	formatMarkdown: (res, opts) => {
		const rootDir = opts?.rootDir || process.cwd();
		const urlA = pathToFileURL(path.resolve(rootDir, res.fileA)).toString();
		const urlB = pathToFileURL(path.resolve(rootDir, res.fileB)).toString();
		return [
			`### Spelunk Structural Diff`,
			`- **File A**: [${res.fileA}](${urlA})`,
			`- **File B**: [${res.fileB}](${urlB})`,
			"",
			"#### Exports Changes",
			res.exports.added.length > 0 ? `- **Added**: ${res.exports.added.map((x) => `\`${x}\``).join(", ")}` : "- **Added**: _None_",
			res.exports.removed.length > 0 ? `- **Removed**: ${res.exports.removed.map((x) => `\`${x}\``).join(", ")}` : "- **Removed**: _None_",
			"",
			"#### Imports Changes",
			res.imports.added.length > 0 ? `- **Added**: ${res.imports.added.map((x) => `\`${x}\``).join(", ")}` : "- **Added**: _None_",
			res.imports.removed.length > 0 ? `- **Removed**: ${res.imports.removed.map((x) => `\`${x}\``).join(", ")}` : "- **Removed**: _None_"
		].join("\n");
	}
};
runCliCommand(diffCommand);
//#endregion
export { diffCommand };

//# sourceMappingURL=diff.mjs.map