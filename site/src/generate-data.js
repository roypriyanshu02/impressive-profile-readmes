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

		const failedProfiles = [];

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

(async () => {
	const markdown = await readMarkdownFile();
	const json = await markdownToJSONConverter(markdown);
	await writeJsonFile(json);
	const screenshotList = await readScreenshotFiles();
	const profilesList = await readProfilesList(json);
	await handleScreenshots(profilesList, screenshotList);
	await copyScreenshotsToStatic();
})();
