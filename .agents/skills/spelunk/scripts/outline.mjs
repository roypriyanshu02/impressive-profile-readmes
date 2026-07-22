#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { o as runOutline, u as runCliCommand } from "./common.mjs";
import path from "node:path";
import { pathToFileURL } from "node:url";
//#region src/commands/outline.ts
const outlineCommand = {
	name: "outline",
	positionalFileIndices: [0],
	options: { file: { type: "string" } },
	validate: (opts, positionals) => {
		return !!opts.file || !!positionals[0] || "Provide a file path to generate its outline.";
	},
	execute: (dbPath, opts, positionals) => {
		return runOutline(opts.file || positionals[0], dbPath);
	},
	formatMarkdown: (res, opts, positionals) => {
		const filePath = opts.file || positionals[0];
		if (!res.files || res.files.length === 0) return `### File not found or not indexed: \`${filePath}\``;
		const record = res.files[0];
		const rootDir = opts?.rootDir || process.cwd();
		const fileUrl = pathToFileURL(path.resolve(rootDir, record.path)).toString();
		const lines = [`### Spelunk Outline for [${record.path}](${fileUrl})`, `- **Parsed**: ${record.parsed ? "Yes" : "No"}`];
		if (record.reason) lines.push(`- **Skip Reason**: ${record.reason}`);
		if (record.hash) lines.push(`- **Content Hash**: \`${record.hash}\``);
		const exportsStr = record.exports.length > 0 ? record.exports.map((e) => `\`${e}\``).join(", ") : "_None_";
		lines.push(`- **Exports**: ${exportsStr}`);
		const importsStr = record.imports.length > 0 ? record.imports.map((i) => `\`${i}\``).join(", ") : "_None_";
		lines.push(`- **Imports**: ${importsStr}`);
		if (record.summary) lines.push(`- **Cached Summary**: ${record.summary}`);
		return lines.join("\n");
	}
};
runCliCommand(outlineCommand);
//#endregion
export { outlineCommand };

//# sourceMappingURL=outline.mjs.map