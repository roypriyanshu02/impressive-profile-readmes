import { readFile, writeFile, readdir, unlink, cp } from 'fs/promises';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import markdownToJSONConverter from './lib/utility/markdown-to-json-converter.js';
import captureScreenshot from './lib/utility/capture-screenshot.js';
import { detectMultipleProfiles } from './lib/utility/github-utils.js';

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

// Read the list of files in the screenshots directory
const readScreenshotFiles = async () => {
	const dirPath = resolve(__dirname, '..', 'screenshots');
	try {
		const files = await readdir(dirPath, { withFileTypes: true });
		// Filter out only the files (not directories), and remove the ".webp" extension from the filenames
		const screenshotList = files
			.filter((file) => file.isFile())
			.map((file) => file.name.replace(/\.webp$/g, ''));
		console.log(`Successfully extracted the list of screenshots`);
		return screenshotList;
	} catch (error) {
		console.error(`Failed to read the screenshot files: ${error.message}`);
		throw error;
	}
};

// Extract the list of profile names from the JSON structure produced by the markdownToJSONConverter
const readProfilesList = async (json) => {
	try {
		const { children } = json.contents;
		const profilesList = [];
		for (let i = 0; i < children.length; i++) {
			const item = children[i];
			if (item.tag === 'h4') {
				children[i + 1].children.forEach((child) => {
					if (!child.children) return;
					const children = child.children[0];
					if (!children.children[0]) return;
					profilesList.push(children.children[0].value.toLowerCase());
				});
				i++;
			}
		}
		console.log('Successfully extracted the list of profiles');
		return profilesList;
	} catch (error) {
		console.error(`Failed to extract the list of profiles: ${error.message}`);
		throw error;
	}
};

// Write the JSON data to the "README.json" file in the "static" directory
const writeJsonFile = async (json) => {
	const filePath = resolve(__dirname, 'static', 'README.json');
	try {
		await writeFile(filePath, JSON.stringify(json));
		console.log(`Successfully wrote the "README.json" file`);
		return;
	} catch (error) {
		console.error(`Failed to write the "README.json" file: ${error.message}`);
		throw error;
	}
};

// Compare the list of profile names to the list of existing screenshots, and capture or delete screenshots as necessary
const handleScreenshots = async (profilesList, screenshotList) => {
	const screenshotSet = new Set(screenshotList);
	const profileSet = new Set(profilesList);

	const refreshAll = process.env.REFRESH_ALL_SCREENSHOTS === 'true';
	const added = refreshAll
		? [...profileSet]
		: [...profileSet].filter((profile) => !screenshotSet.has(profile));
	const removed = [...screenshotSet].filter((profile) => !profileSet.has(profile));

	const failedProfiles = [];
	let animatedDetectionResults = [];
	if (added.length > 0) {
		// Detect animated content for profiles to be added
		console.log('Detecting animated content for profiles to be added...');
		animatedDetectionResults = await detectMultipleProfiles(added, 500);

		// Launch a single browser instance to be shared across concurrent screenshot tasks
		console.log('Launching browser for screenshot capturing...');
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox']
		});

		try {
			// Helper to run tasks with a concurrency limit
			const runWithLimit = async (tasks, limit) => {
				const executing = new Set();
				const results = [];
				for (const task of tasks) {
					const p = Promise.resolve().then(() => task());
					results.push(p);
					executing.add(p);
					const clean = () => executing.delete(p);
					p.then(clean, clean);
					if (executing.size >= limit) {
						await Promise.race(executing);
					}
				}
				return Promise.all(results);
			};

			const tasks = added.map((profile, i) => async () => {
				const detectionResult = animatedDetectionResults[i];
				const isAnimated = detectionResult?.isAnimated || false;
				if (typeof isAnimated !== 'boolean') {
					console.warn(`Unexpected detection result for ${profile}, assuming static`);
				}
				console.log(
					`Capturing ${profile}'s profile screenshot${isAnimated ? ' (animated)' : ''}...`
				);
				try {
					await captureScreenshot(
						resolve(__dirname, '..', 'screenshots'),
						profile,
						isAnimated,
						browser
					);
					console.log(
						`Successfully captured ${profile}'s profile ${isAnimated ? 'animated' : 'static'} screenshot`
					);
				} catch (error) {
					console.error(
						`Failed to capture the screenshot for the profile: "${profile}" ${isAnimated ? '(animated)' : ''}: ${error.message}`
					);
					failedProfiles.push({ profile, error: error.message });
					try {
						await unlink(resolve(__dirname, '..', 'screenshots', `${profile}.webp`));
						console.log(`Deleted screenshot for broken profile: ${profile}`);
					} catch {
						// Ignore if file didn't exist
					}
				}
			});

			// Execute screenshot tasks concurrently (limit: 3)
			await runWithLimit(tasks, 3);
		} finally {
			await browser.close().catch(() => {});
			if (failedProfiles.length > 0) {
				console.log('\n=== Failed Profiles Summary ===');
				failedProfiles.forEach(({ profile, error }) => {
					console.log(`- ${profile}: ${error}`);
				});
				console.log('===============================\n');
			}
		}
	}

	for (const profile of removed) {
		if (profile === '.gitkeep') continue;
		try {
			await unlink(resolve(__dirname, '..', 'screenshots', `${profile}.webp`));
			console.log(`Successfully deleted ${profile}'s profile screenshot`);
		} catch (error) {
			console.error(`Failed to delete ${profile}'s profile screenshot: ${error.message}`);
			throw error;
		}
	}

	// Log summary of animated content detection
	if (added.length > 0) {
		const animatedCount = animatedDetectionResults.filter((r) => r.isAnimated).length;
		console.log(`\n=== Animated Content Detection Summary ===`);
		console.log(`Total profiles detected: ${added.length}`);
		console.log(`Animated profiles found: ${animatedCount}`);
		console.log(`Static profiles found: ${added.length - animatedCount}`);
	}

	return failedProfiles.map((p) => p.profile.toLowerCase());
};

// Copy all screenshots to the static directory so SvelteKit serves them statically
const copyScreenshotsToStatic = async () => {
	const srcDir = resolve(__dirname, '..', 'screenshots');
	const destDir = resolve(__dirname, 'static', 'screenshots');
	try {
		await cp(srcDir, destDir, { recursive: true });
		console.log('Successfully copied screenshots to static/screenshots');
	} catch (error) {
		console.error('Failed to copy screenshots to static directory:', error.message);
		throw error;
	}
};

// Filter out failed profiles from the JSON contents
const filterFailedProfiles = (json, failedUsernamesSet) => {
	if (failedUsernamesSet.size === 0) return json;
	if (!json || !json.contents || !json.contents.children) return json;

	const children = json.contents.children;
	const newChildren = [];

	for (let i = 0; i < children.length; i++) {
		const section = children[i];

		if (section.tag === 'h4') {
			const nextSection = children[i + 1];
			if (nextSection && nextSection.tag === 'ul') {
				const filteredList = nextSection.children.filter((profile) => {
					const username = profile?.children?.[0]?.children?.[0]?.value?.toLowerCase();
					return username && !failedUsernamesSet.has(username);
				});

				if (filteredList.length > 0) {
					newChildren.push(section);
					newChildren.push({
						tag: 'ul',
						children: filteredList
					});
				}
				i++;
			} else {
				newChildren.push(section);
			}
		} else {
			newChildren.push(section);
		}
	}

	json.contents.children = newChildren;
	return json;
};

// Filter out failed profiles and empty categories from the source README.md file
const filterMarkdownFile = async (filePath, failedUsernamesSet) => {
	if (failedUsernamesSet.size === 0) return;
	try {
		const content = await readFile(filePath, 'utf-8');
		const lines = content.split('\n');
		const newLines = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			// Match patterns like "- [username]"
			const match = line.match(/^-\s*\[([^\]]+)\]/);
			if (match) {
				const username = match[1].toLowerCase();
				if (failedUsernamesSet.has(username)) {
					console.log(`Removing ${username} from README.md`);
					continue;
				}
			}
			newLines.push(lines[i]);
		}

		// Clean up empty category headers (h4 followed by no list items)
		const finalLines = [];
		for (let i = 0; i < newLines.length; i++) {
			const line = newLines[i];
			if (line.startsWith('#### ')) {
				let hasItems = false;
				for (let j = i + 1; j < newLines.length; j++) {
					const nextLine = newLines[j].trim();
					if (
						nextLine.startsWith('#### ') ||
						nextLine.startsWith('## ') ||
						nextLine.startsWith('---')
					) {
						break;
					}
					if (nextLine.startsWith('- ')) {
						hasItems = true;
						break;
					}
				}
				if (!hasItems) {
					console.log(`Removing empty category header: ${line.trim()}`);
					// Skip empty lines/spacing around the removed header if any
					while (i + 1 < newLines.length && newLines[i + 1].trim() === '') {
						i++;
					}
					continue;
				}
			}
			finalLines.push(line);
		}

		await writeFile(filePath, finalLines.join('\n'), 'utf-8');
		console.log('Successfully cleaned up README.md');
	} catch (error) {
		console.error(`Failed to clean up README.md: ${error.message}`);
	}
};

(async () => {
	const markdown = await readMarkdownFile();
	const json = await markdownToJSONConverter(markdown);
	const screenshotList = await readScreenshotFiles();
	const profilesList = await readProfilesList(json);
	const failedUsernames = await handleScreenshots(profilesList, screenshotList);

	const failedSet = new Set(failedUsernames);
	const filteredJson = filterFailedProfiles(json, failedSet);

	await writeJsonFile(filteredJson);
	await filterMarkdownFile(resolve(__dirname, '..', 'README.md'), failedSet);
	await copyScreenshotsToStatic();
})();
