import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { resolve } from 'path';
import markdownToJSONConverter from './lib/utility/markdown-to-json-converter.js';
import captureScreenshot from './lib/utility/capture-screenshot.js';

const __dirname = process.cwd();

// Read the contents of the README.md file and return it as a string
const readMarkdownFile = async () => {
	const filePath = resolve(__dirname, '..', 'README.md');
	return await readFile(filePath, 'utf-8');
};

// Read the list of files in the screenshots directory
const readScreenshotFiles = async () => {
	const dirPath = resolve(__dirname, '..', 'screenshots');
	const files = await readdir(dirPath, { withFileTypes: true });
	// Filter out only the files (not directories), and remove the ".webp" extension from the filenames
	return files.filter((file) => file.isFile()).map((file) => file.name.replace(/\.webp$/g, ''));
};

// Extract the list of profile names from the JSON structure produced by the markdownToJSONConverter
const readProfilesList = async (json) => {
	const { contents } = json;
	const children = contents.children;
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
	return profilesList;
};

// Write the JSON data to the "README.json" file in the "static" directory
const writeJsonFile = async (json) => {
	const filePath = resolve(__dirname, 'static', 'README.json');
	return await writeFile(filePath, JSON.stringify(json));
};

// Compare the list of profile names to the list of existing screenshots, and capture or delete screenshots as necessary
const handleScreenshots = async (profilesList, screenshotList) => {
	const screenshotSet = new Set(screenshotList);
	const profileSet = new Set(profilesList);
	const added = [...profileSet].filter((profile) => !screenshotSet.has(profile));
	const removed = [...screenshotSet].filter((profile) => !profileSet.has(profile));
	for (const profile of added) {
		try {
			await captureScreenshot(resolve(__dirname, '..', 'screenshots'), profile);
		} catch (error) {
			console.error(`Failed to capture screenshot for profile "${profile}": ${error.message}`);
		}
	}
	for (const profile of removed) {
		if (profile === '.gitkeep') continue;
		try {
			await unlink(resolve(__dirname, '..', 'screenshots', `${profile}.webp`));
		} catch (error) {
			console.error(`Failed to delete screenshot for profile "${profile}": ${error.message}`);
		}
	}
};

(async () => {
	try {
		const markdown = await readMarkdownFile();
		const json = await markdownToJSONConverter(markdown);
		await writeJsonFile(json);
		const screenshotList = await readScreenshotFiles();
		const profilesList = await readProfilesList(json);
		await handleScreenshots(profilesList, screenshotList);
	} catch (error) {
		console.error(`An error occurred: ${error.message}`);
	}
})();
