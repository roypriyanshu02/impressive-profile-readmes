import { readFile } from 'fs/promises';
import { join } from 'path';

export const load = async () => {
	const filePath = join(process.cwd(), 'static', 'README.json');
	const fileContents = await readFile(filePath, 'utf-8');
	const result = JSON.parse(fileContents);
	const lastModified = new Date(result.lastModified).toLocaleString();
	const sections = result.contents.children;
	const categories = [];
	const profiles = [];
	for (let i = 0; i < sections.length; i++) {
		let section = sections[i];
		if (section.tag === 'h4') {
			const categoryName = section.children[1].value;
			const profilesForCategory = sections[i + 1].children.map((profile) => {
				const username = profile.children[0].children[0].value;
				return {
					username,
					category: categoryName
				};
			});
			profiles.push(...profilesForCategory);
			categories.push({
				categoryTitle: categoryName,
				totalProfileCount: profilesForCategory.length
			});
			i++;
		}
	}
	categories.unshift({ categoryTitle: 'All', totalProfileCount: profiles.length });
	profiles.sort((a, b) => a.username.localeCompare(b.username));
	return {
		lastModified,
		categories,
		profiles
	};
};
