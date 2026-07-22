#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { u as runCliCommand } from "./common.mjs";
import { DatabaseSync } from "node:sqlite";
//#region src/commands/query.ts
const queryCommand = {
	name: "query",
	options: {},
	validate: (opts, positionals) => {
		if (positionals.length === 0) return "Provide a SQL query statement to run.";
		const sql = positionals[0];
		if (!/^\s*(select|with|pragma|explain)\b/i.test(sql)) return "Only read-only queries (SELECT, WITH, PRAGMA, EXPLAIN) are allowed.";
		return true;
	},
	execute: (dbPath, opts, positionals) => {
		const sql = positionals[0];
		const params = positionals.slice(1);
		const db = new DatabaseSync(dbPath, { readOnly: true });
		try {
			return db.prepare(sql).all(...params);
		} finally {
			db.close();
		}
	},
	formatMarkdown: (res) => {
		if (!Array.isArray(res) || res.length === 0) return "No results found.";
		const headers = Object.keys(res[0]);
		return [
			`| ${headers.join(" | ")} |`,
			`| ${headers.map(() => "---").join(" | ")} |`,
			...res.map((row) => {
				return `| ${headers.map((h) => {
					const val = row[h];
					if (val === null || val === void 0) return "";
					if (typeof val === "object") return JSON.stringify(val);
					return String(val);
				}).join(" | ")} |`;
			})
		].join("\n");
	},
	formatJson: (res) => res
};
runCliCommand(queryCommand);
//#endregion
export { queryCommand };

//# sourceMappingURL=query.mjs.map