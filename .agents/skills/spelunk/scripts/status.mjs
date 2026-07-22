#!/usr/bin/env node
/**
* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
*/
import { s as isUpToDate, u as runCliCommand } from "./common.mjs";
//#region src/commands/status.ts
const statusCommand = {
	name: "status",
	skipUpToDateCheck: true,
	positionalDirIndex: 0,
	options: {},
	validate: () => true,
	execute: async (dbPath, opts, positionals) => {
		const res = await isUpToDate({
			rootDir: opts.dir || positionals[0] || process.cwd(),
			dbPath
		});
		if (!res.upToDate) process.exitCode = 1;
		return res;
	},
	formatMarkdown: (res) => {
		if (res.upToDate) return `### Spelunk Index Status\n- **Status**: Up-to-date\n- **Details**: ${res.reason}`;
		else return `### Spelunk Index Status\n- **Status**: Stale (Out-of-date)\n- **Details**: ${res.reason}`;
	},
	formatJson: (res) => res
};
runCliCommand(statusCommand);
//#endregion
export { statusCommand };

//# sourceMappingURL=status.mjs.map