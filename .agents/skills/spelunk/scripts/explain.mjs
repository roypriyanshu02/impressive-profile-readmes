#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { r as runExplain, u as runCliCommand } from "./common.mjs";
//#region src/commands/explain.ts
const explainCommand = {
	name: "explain",
	positionalFileIndices: [0],
	options: {
		file: { type: "string" },
		"set-summary": { type: "string" }
	},
	validate: (opts, positionals) => {
		return !!opts.file || !!positionals[0] || "Provide a file path to get or set its summary.";
	},
	execute: (dbPath, opts, positionals) => {
		const filePath = opts.file || positionals[0];
		const agentSummary = opts["set-summary"];
		return runExplain(filePath, !!agentSummary, dbPath, agentSummary);
	},
	formatMarkdown: (res) => {
		return res.summary;
	},
	formatJson: (res) => res
};
runCliCommand(explainCommand);
//#endregion
export { explainCommand };

//# sourceMappingURL=explain.mjs.map