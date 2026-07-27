import { readFile } from 'fs/promises';
import { join } from 'path';

export const load = async () => {
	try {
		// Read the contents of README.json file
		const filePath = join(process.cwd(), 'static', 'README.json');
		const fileContents = await readFile(filePath, 'utf-8');
		const result = JSON.parse(fileContents);

		// Extract relevant information from README.json
		const lastModified = result.lastModified;

		let repoStats = { stars: 184, open_issues: 1, open_prs: 0, forks: 32 };
		try {
			const statsPath = join(process.cwd(), 'static', 'repo_stats.json');
			const statsContents = await readFile(statsPath, 'utf-8');
			const parsed = JSON.parse(statsContents);
			if (typeof parsed.stars === 'number') {
				repoStats = {
					stars: parsed.stars,
					open_issues: parsed.open_issues ?? 0,
					open_prs: parsed.open_prs ?? 0,
					forks: parsed.forks ?? 0
				};
			} else if (parsed.repoStats && typeof parsed.repoStats.stars === 'number') {
				repoStats = {
					stars: parsed.repoStats.stars,
					open_issues: parsed.repoStats.open_issues ?? 0,
					open_prs: parsed.repoStats.open_prs ?? 0,
					forks: parsed.repoStats.forks ?? 0
				};
			}
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			console.warn('Could not read static/repo_stats.json, using default stats:', msg);
		}

		return {
			lastModified,
			repoStats
		};
	} catch (error) {
		const lastModified = Date.now();
		console.error(error);
		return {
			lastModified,
			repoStats: { stars: 184, open_issues: 1, open_prs: 0, forks: 32 },
			error
		};
	}
};

export const prerender = true;
