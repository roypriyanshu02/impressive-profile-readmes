#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { a as runFind, u as runCliCommand } from "./common.mjs";
import path from "node:path";
import { pathToFileURL } from "node:url";
//#region src/commands/find.ts
const findCommand = {
	name: "find",
	options: {
		query: {
			type: "string",
			short: "q"
		},
		limit: {
			type: "string",
			short: "l",
			default: "50"
		},
		offset: {
			type: "string",
			short: "o",
			default: "0"
		}
	},
	validate: (opts, positionals) => {
		return !!opts.query || !!positionals[0] || "Provide a search query to find files or exports.";
	},
	execute: (dbPath, opts, positionals) => {
		const query = opts.query || positionals[0];
		const parsedLimit = parseInt(opts.limit, 10);
		const limit = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 50 : parsedLimit;
		const parsedOffset = parseInt(opts.offset, 10);
		return runFind(query, dbPath, limit, Number.isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset);
	},
	formatMarkdown: (res, opts, positionals) => {
		if (res.files.length === 0) return "_No matching files or symbols found._";
		const query = opts.query || positionals[0];
		const rootDir = opts?.rootDir || process.cwd();
		const rangeStr = `Showing results ${res.offset + 1} to ${res.offset + res.files.length} of ${res.total_count}.`;
		const hasMoreStr = res.has_more ? " Use --limit or --offset to page through results." : "";
		const header = [
			`### Spelunk Find Results for \`${query}\``,
			`*${rangeStr}${hasMoreStr}*`,
			"",
			"| File Path | Exports | Summary |",
			"| :--- | :--- | :--- |"
		];
		const rows = res.files.map((f) => {
			const fileUrl = pathToFileURL(path.resolve(rootDir, f.path)).toString();
			const exportsStr = f.exports.length > 0 ? f.exports.map((e) => `\`${e}\``).join(", ") : "_None_";
			const summaryStr = f.summary || "_No summary available_";
			return `| [${f.path}](${fileUrl}) | ${exportsStr} | ${summaryStr} |`;
		});
		return [...header, ...rows].join("\n");
	}
};
runCliCommand(findCommand);
//#endregion
export { findCommand };

//# sourceMappingURL=find.mjs.map