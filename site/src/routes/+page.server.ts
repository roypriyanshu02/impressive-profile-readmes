import { readFile } from 'fs/promises';
import { join } from 'path';

export const load = async () => {
	try {
		// Read the contents of README.json file
		const filePath = join(process.cwd(), 'static', 'README.json');
		const fileContents = await readFile(filePath, 'utf-8');
		const result = JSON.parse(fileContents);

		// Read the contents of stars.json file
		let starsMap: Record<string, number> = {};
		try {
			const starsPath = join(process.cwd(), 'static', 'stars.json');
			const starsContents = await readFile(starsPath, 'utf-8');
			starsMap = JSON.parse(starsContents);
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			console.warn('⚠ Could not read static/stars.json, fallback to 0 stars:', msg);
		}

		// Extract relevant information from README.json
		const sections = result.contents?.children ?? [];
		const categories = [];
		const profiles = [];

		// Iterate over sections to extract categories and profiles
		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];

			// If current section is a category, extract profiles for that category
			if (section.tag === 'h4') {
				const categoryName = section.children[1]?.value;
				const profilesForCategory = sections[i + 1]?.children
					?.map((profile) => {
						const username = profile?.children?.[0]?.children?.[0]?.value;
						if (!username) return null;
						return {
							username,
							category: categoryName,
							starCount: starsMap[username] ?? 0
						};
					})
					.filter(Boolean);

				// If there are profiles in this category, add them to profiles list and category information to categories list
				if (profilesForCategory?.length) {
					profiles.push(...profilesForCategory);
					categories.push({
						categoryTitle: categoryName,
						totalProfileCount: profilesForCategory.length
					});
				}
				i++;
			}
		}

		// Add "Most starred" and "All" category to categories list
		categories.unshift({ categoryTitle: 'Most starred', totalProfileCount: profiles.length });
		categories.unshift({ categoryTitle: 'All', totalProfileCount: profiles.length });

		// Deduplicate profiles by username and sort
		const uniqueProfiles = Array.from(
			new Map(profiles.map((p) => [p.username.toLowerCase(), p])).values()
		);
		uniqueProfiles.sort((a, b) => a.username.localeCompare(b.username));
		let contributingContent = '';
		let licenseContent = '';
		try {
			contributingContent = await readFile(join(process.cwd(), '..', 'CONTRIBUTING.md'), 'utf-8');
		} catch {}
		try {
			licenseContent = await readFile(join(process.cwd(), '..', 'LICENSE'), 'utf-8');
		} catch {}

		return {
			categories,
			profiles: uniqueProfiles,
			readmeContent: result.readmeContent ?? {},
			contributingContent,
			licenseContent,
			lastModified: result.lastModified ?? Date.now()
		};
	} catch (error) {
		// If an error occurs, log it and return an error object
		console.error(error);
		return {
			categories: [{ categoryTitle: 'All', totalProfileCount: 0 }],
			profiles: [],
			error
		};
	}
};

