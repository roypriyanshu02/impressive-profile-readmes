import { readFile, writeFile, readDir, rootDir, deleteFile } from './lib/utility/file-io.js';
import markdownToJSONConverter from './lib/utility/markdown-to-json-converter.js';
import captureScreenshot from './lib/utility/capture-screenshot.js';

(async () => {
	try {
		// Read the contents of README.md file
		const markdown = await readFile('README.md');
		// Convert markdown to json
		const json = await markdownToJSONConverter(markdown);
		// Write the json to README.json file
		await writeFile('README.json', JSON.stringify(json));

		// Extract the data from json
		const children = json.contents.children;
		let profilesList = [];
		for (let i = 0; i < children.length; i++) {
			let item = children[i];
			if (item.tag === 'h4') {
				profilesList = profilesList.concat(
					children[i + 1].children.map((child) => {
						const children = child.children[0];
						return children.children[0].value.toLowerCase();
					})
				);
				i++;
			}
		}

		// Read the contents of the 'screenshots' directory
		const screenshotsList = await readDir('screenshots');
		// Filter the file names and remove the '.webp' extension
		const screenshotsListFilenames = screenshotsList
			.filter((dirent) => dirent.isFile())
			.map((dirent) => dirent.name)
			.map((element) => element.replace(/.webp/g, ''));

		// Create sets for the profiles and screenshots data
		const screenshotSet = new Set(screenshotsListFilenames);
		const profileSet = new Set(profilesList);

		// Find the added and removed items from the sets
		const added = Array.from(new Set([...profileSet].filter((x) => !screenshotSet.has(x))));
		const removed = Array.from(new Set([...screenshotSet].filter((x) => !profileSet.has(x))));

		// Capture screenshots for the added items
		await Promise.all(
			added.map(async (userName) => {
				await captureScreenshot(`${rootDir}/screenshots`, userName);
			})
		);

		// Delete the removed items from the 'screenshots' directory
		await Promise.all(
			removed.map(async (fileName) => {
				if (fileName === '.gitkeep') {
					return;
				}
				await deleteFile(`screenshots/${fileName}.webp`);
			})
		);
	} catch (error) {
		throw error;
	}
})();
