import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { resolve } from 'path';
import markdownToJSONConverter from './lib/utility/markdown-to-json-converter.js';

const __dirname = process.cwd();

// Read the contents of the README.md file and return it as a string
const readMarkdownFile = async () => {
	const filePath = resolve(__dirname, '..', 'README.md');
	try {
		const data = await readFile(filePath, 'utf-8');
		console.log(`Successfully read "README.md" file`);
		return data;
	} catch (error) {
		console.error(`Failed to read "README.md" file: ${error.message}`);
		throw error;
	}
};

// Extract the list of links from the JSON structure produced by the markdownToJSONConverter
const extractLinkList = async (json) => {
	try {
		const { contents } = json;
		const children = contents.children;
		const linkList = [];
		for (let i = 0; i < children.length; i++) {
			const item = children[i];
			if (item.tag === 'h4') {
				children[i + 1].children.forEach((child) => {
					if (!child.children) return;
					const children = child.children[0];
					if (!children.children[0]) return;
					linkList.push({ href: children.props.href, title: children.children[0].value });
				});
				i++;
			}
		}
		console.log('Successfully extracted the list of links');
		return linkList;
	} catch (error) {
		console.error(`Failed to extract the list of links: ${error.message}`);
		throw error;
	}
};

// Check if links are still working or not
const handleLinks = async (linkList) => {
	const brokenLinkList = [];
	for (const link of linkList) {
		try {
			const response = await fetch(link.href);
			if (response.status >= 400 && response.status < 600) {
				console.log(`Link "${link.title}" is broken (${response.status} ${response.statusText})`);
				brokenLinkList.push(link.title);
			} else {
				console.log(`Link "${link.title}" is working`);
			}
		} catch (error) {
			console.error(`Failed to check link: "${link.href}": ${error.message}`);
		}
	}
	if (brokenLinkList.length > 0) {
		console.log(`Found ${brokenLinkList.length} broken links`);
	} else {
		console.log('All links are working fine');
	}
	return brokenLinkList;
};

// Remove broken links from the README file
const removeBrokenLinks = async (brokenLinkList, data) => {
	let newData = data;
	for (const linkTitle of brokenLinkList) {
		const regex = new RegExp(`^- \\[${linkTitle}\\]\\(.*\\)$\n?`, 'gm');
		newData = newData.replace(regex, '');
	}
	return newData;
};

// Rewrite the README file with the new data
const rewriteReadmeFile = async (newMarkdown) => {
	const filePath = resolve(__dirname, '..', 'README.md');
	try {
		await writeFile(filePath, newMarkdown);
		console.log(`Successfully wrote the "README.md" file`);
		return;
	} catch (error) {
		console.error(`Failed to write the "README.md" file: ${error.message}`);
		throw error;
	}
};

// Clear the screenshots directory except for the .gitkeep file
const clearScreenshotDirectory = async () => {
	const dirPath = resolve(__dirname, '..', 'screenshots');
	try {
		const files = await readdir(dirPath);
		for (const file of files) {
			if (file !== '.gitkeep') {
				await unlink(resolve(dirPath, file));
				console.log(`Successfully deleted the ${file} file`);
			}
		}
	} catch (error) {
		console.log(`Failed to delete : ${error.message}`);
	}
};

(async () => {
	const markdown = await readMarkdownFile();
	const json = await markdownToJSONConverter(markdown);
	const linkList = await extractLinkList(json);
	const brokenLinkList = await handleLinks(linkList);
	if (brokenLinkList.length !== 0) {
		const newMarkdown = await removeBrokenLinks(brokenLinkList, markdown);
		await rewriteReadmeFile(newMarkdown);
	}
	await clearScreenshotDirectory();
})();
