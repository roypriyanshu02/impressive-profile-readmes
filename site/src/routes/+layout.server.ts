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
			repoStats = JSON.parse(statsContents);
		} catch (e) {
			console.warn('Could not read static/repo_stats.json, using default stats:', e.message);
		}

		return {
			lastModified,
			repoStats
		};
	} catch (error) {
		const lastModified = Date.now();
		console.error(error);
		return {
			lastModified: lastModified,
			repoStats: { stars: 184, open_issues: 1, open_prs: 0, forks: 32 },
			error: error
		};
	}
};

export const prerender = true;
