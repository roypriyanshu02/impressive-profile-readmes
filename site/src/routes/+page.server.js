import { readFile } from 'fs/promises';
import { join } from 'path';
import fetchRepoStar from '$lib/utility/fetch-repo-stars';

export const load = async () => {
	try {
		// Read the contents of README.json file
		const filePath = join(process.cwd(), 'static', 'README.json');
		const fileContents = await readFile(filePath, 'utf-8');
		const result = JSON.parse(fileContents);

		// Extract relevant information from README.json
		const lastModified = new Date(result.lastModified).toLocaleString();
		const sections = result.contents?.children ?? [];
		const categories = [];
		const profiles = [];

		// Iterate over sections to extract categories and profiles
		for (let i = 0; i < sections.length; i++) {
			let section = sections[i];

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
							starCount: 0
						};
					})
					.filter(Boolean);

				// If there are profiles in this category, add them to profiles list and category information to categories list
				if (profilesForCategory) {
					profiles.push(...profilesForCategory);
					categories.push({
						categoryTitle: categoryName,
						totalProfileCount: profilesForCategory.length
					});
				}
				i++;
			}
		}

		// Add "All" category to categories list and fetch star count for each profile
		categories.unshift({ categoryTitle: 'All', totalProfileCount: profiles.length });
		for (const profile of profiles) {
			profile.starCount = await fetchRepoStar(profile.username);
		}

		// Sort profiles by username and return extracted information
		profiles.sort((a, b) => a.username.localeCompare(b.username));
		return {
			lastModified,
			categories,
			profiles
		};
	} catch (error) {
		// If an error occurs, log it and return an error object
		const lastModified = new Date(Date.now()).toLocaleString();
		console.error(error);
		return {
			lastModified: lastModified,
			categories: [{ categoryTitle: 'All', totalProfileCount: 0 }],
			profiles: {},
			error: error
		};
	}
};

export const prerender = true;
