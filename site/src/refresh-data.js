import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { resolve } from 'path';
import markdownToJSONConverter from './lib/utility/markdown-to-json-converter.js';

// Configuration
const CONFIG = {
	requestTimeout: 10000, // 10 seconds timeout for link checking
	maxRetries: 2, // Number of retries for failed requests
	retryDelay: 1000, // Delay between retries in ms
	screenshotDir: resolve(process.cwd(), '..', 'screenshots'),
	gitkeepFile: '.gitkeep'
};

// Utility functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Read the contents of the README.md file and return it as a string
const readMarkdownFile = async () => {
	const filePath = resolve(process.cwd(), '..', 'README.md');
	try {
		const data = await readFile(filePath, 'utf-8');
		console.log('✓ Successfully read README.md file');
		return data;
	} catch (error) {
		console.error(`✗ Failed to read README.md file: ${error.message}`);
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
				const nextItem = children[i + 1];
				if (!nextItem || !nextItem.children) continue;

				nextItem.children.forEach((child) => {
					if (!child.children) return;
					const anchor = child.children[0];
					if (!anchor || !anchor.props) return;
					if (!anchor.children || !anchor.children[0]) return;

					// Extract username from href (github.com/username)
					const href = anchor.props.href;
					const match = href.match(/https?:\/\/github\.com\/([^/]+)/);
					if (match) {
						// Check if username is lowercase (consistent with our format)
						if (match[1] === match[1].toLowerCase()) {
							// Regular link
							linkList.push({
								type: 'link',
								href: href,
								title: anchor.children[0].value
							});
						} else {
							// GitHub profile username (for checking)
							linkList.push({
								type: 'profile',
								username: match[1]
							});
						}
					}
				});
				i++;
			}
		}

		console.log(`✓ Successfully extracted ${linkList.length} items`);
		return linkList;
	} catch (error) {
		console.error(`✗ Failed to extract links: ${error.message}`);
		throw error;
	}
};

// Check if a single link is working with retries
const checkLinkWithRetry = async (link, retries = CONFIG.maxRetries) => {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

			const response = await fetch(link.href, {
				signal: controller.signal,
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; RefreshDataBot/1.0)'
				}
			});

			clearTimeout(timeoutId);

			if (response.status >= 400 && response.status < 600) {
				console.log(`✗ Link "${link.title}" is broken (${response.status} ${response.statusText})`);
				return { link, status: 'broken', statusCode: response.status };
			} else {
				console.log(`✓ Link "${link.title}" is working (${response.status})`);
				return { link, status: 'working', statusCode: response.status };
			}
		} catch (error) {
			if (attempt < retries) {
				console.log(`⚠ Retry ${attempt + 1}/${retries} for "${link.title}": ${error.message}`);
				await sleep(CONFIG.retryDelay);
			} else {
				console.error(`✗ Failed to check link "${link.href}": ${error.message}`);
				return { link, status: 'error', error: error.message };
			}
		}
	}
};

// Check if a GitHub profile readme still exists
const checkGitHubProfile = async (username) => {
	const profileUrl = `https://github.com/${username}`;
	const readmeUrl = `https://raw.githubusercontent.com/${username}/${username}/README.md`;

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

		const profileResponse = await fetch(profileUrl, {
			signal: controller.signal,
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RefreshDataBot/1.0)' }
		});

		clearTimeout(timeoutId);

		if (profileResponse.status === 404) {
			console.log(`✗ GitHub profile "${username}" not found (404)`);
			return { username, status: 'not-found' };
		}

		if (profileResponse.status >= 400 && profileResponse.status < 600) {
			console.log(`✗ GitHub profile "${username}" error (${profileResponse.status})`);
			return { username, status: 'error', statusCode: profileResponse.status };
		}

		// Check if README.md exists in the profile
		try {
			const readmeController = new AbortController();
			const readmeTimeoutId = setTimeout(() => readmeController.abort(), CONFIG.requestTimeout);

			const readmeResponse = await fetch(readmeUrl, {
				signal: readmeController.signal,
				headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RefreshDataBot/1.0)' }
			});

			clearTimeout(readmeTimeoutId);

			if (readmeResponse.status === 404) {
				console.log(`✗ GitHub profile "${username}" has no README.md (404)`);
				return { username, status: 'readme-not-found' };
			} else if (readmeResponse.status < 400) {
				console.log(`✓ GitHub profile "${username}" and README.md exist`);
				return { username, status: 'exists' };
			} else {
				console.log(`✗ GitHub profile "${username}" README check error (${readmeResponse.status})`);
				return { username, status: 'readme-error', statusCode: readmeResponse.status };
			}
		} catch (readmeError) {
			console.error(`✗ Failed to check README.md for "${username}": ${readmeError.message}`);
			return { username, status: 'readme-error', error: readmeError.message };
		}
	} catch (error) {
		console.error(`✗ Failed to check GitHub profile "${username}": ${error.message}`);
		return { username, status: 'error', error: error.message };
	}
};

// Check if links are still working or not with parallel processing
const handleLinks = async (linkList) => {
	console.log(`Checking ${linkList.length} links...`);

	const results = await Promise.all(linkList.map((link) => checkLinkWithRetry(link)));

	const brokenLinks = results.filter((r) => r.status === 'broken');
	const errorLinks = results.filter((r) => r.status === 'error');
	const workingLinks = results.filter((r) => r.status === 'working');

	console.log(`\n=== Link Check Results ===`);
	console.log(`✓ Working: ${workingLinks.length}`);
	console.log(`✗ Broken: ${brokenLinks.length}`);
	console.log(`⚠ Errors: ${errorLinks.length}`);

	if (brokenLinks.length > 0) {
		console.log(`\nBroken links:`);
		brokenLinks.forEach((r) => console.log(`  - ${r.link.title} (${r.statusCode})`));
	}

	if (errorLinks.length > 0) {
		console.log(`\nError links:`);
		errorLinks.forEach((r) => console.log(`  - ${r.link.title}: ${r.error}`));
	}

	return {
		broken: brokenLinks.map((r) => r.link.title),
		working: workingLinks.map((r) => r.link.title),
		errors: errorLinks.map((r) => ({ title: r.link.title, error: r.error }))
	};
};

// Remove broken links from the README file with improved regex
const removeBrokenLinks = async (brokenLinkTitles, data) => {
	let newData = data;
	let removedCount = 0;

	for (const linkTitle of brokenLinkTitles) {
		// Escape special regex characters in the title
		const escapedTitle = linkTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&');
		// Match both with and without trailing newlines
		const regex = new RegExp(`^- \\[${escapedTitle}\\]\\\\([^)]*\\\\)\\\\s*\\\\n?`, 'gm');
		const matches = newData.match(regex);
		if (matches) {
			removedCount += matches.length;
			newData = newData.replace(regex, '');
		}
	}

	console.log(`✓ Removed ${removedCount} broken link entries`);
	return { newData, removedCount };
};

// Rewrite the README file with the new data
const rewriteReadmeFile = async (newMarkdown) => {
	const filePath = resolve(process.cwd(), '..', 'README.md');
	try {
		await writeFile(filePath, newMarkdown);
		console.log('✓ Successfully updated README.md file');
		return;
	} catch (error) {
		console.error(`✗ Failed to write README.md file: ${error.message}`);
		throw error;
	}
};

// Clear the screenshots directory except for the .gitkeep file
const clearScreenshotDirectory = async () => {
	try {
		const files = await readdir(CONFIG.screenshotDir);
		let deletedCount = 0;

		for (const file of files) {
			if (file !== CONFIG.gitkeepFile) {
				const filePath = resolve(CONFIG.screenshotDir, file);
				await unlink(filePath);
				console.log(`  - Deleted ${file}`);
				deletedCount++;
			}
		}

		console.log(`✓ Cleared ${deletedCount} screenshot files`);
		return deletedCount;
	} catch (error) {
		console.log(`⚠ Failed to clear screenshots directory: ${error.message}`);
		return 0;
	}
};

// Main execution function
const main = async () => {
	try {
		console.log('=== Starting Refresh Data Process ===\\n');

		// Step 1: Read README.md
		console.log('Step 1: Reading README.md...');
		const markdown = await readMarkdownFile();

		// Step 2: Convert to JSON
		console.log('\\nStep 2: Converting markdown to JSON...');
		const json = await markdownToJSONConverter(markdown);

		// Step 3: Extract links
		console.log('\\nStep 3: Extracting links...');
		const linkList = await extractLinkList(json);

		if (linkList.length === 0) {
			console.log('No links found to check. Exiting.');
			return;
		}

		// Separate profiles from regular links
		const profileLinks = linkList.filter((item) => item.type === 'profile');
		const regularLinks = linkList.filter((item) => item.type === 'link');

		// Step 4a: Check GitHub profiles
		console.log('\\nStep 4a: Checking GitHub profiles...');
		const profileResults = await Promise.all(
			profileLinks.map((link) => checkGitHubProfile(link.username))
		);

		const notFoundProfiles = profileResults.filter((r) => r.status === 'not-found');
		const readmeNotFoundProfiles = profileResults.filter((r) => r.status === 'readme-not-found');
		const errorProfiles = profileResults.filter(
			(r) => r.status === 'error' || r.status === 'readme-error'
		);
		const existingProfiles = profileResults.filter((r) => r.status === 'exists');

		console.log(`\\n=== Profile Check Results ===`);
		console.log(`✓ Valid profiles: ${existingProfiles.length}`);
		console.log(`✗ Not found: ${notFoundProfiles.length}`);
		console.log(`⚠ README not found: ${readmeNotFoundProfiles.length}`);
		console.log(`⚠ Errors: ${errorProfiles.length}`);

		// Step 4b: Check regular links (external links)
		console.log('\\nStep 4b: Checking external links...');
		const results = await handleLinks(regularLinks);

		// Step 5: Remove invalid profiles and broken links if any
		const hasInvalidItems =
			notFoundProfiles.length > 0 || readmeNotFoundProfiles.length > 0 || results.broken.length > 0;

		if (hasInvalidItems) {
			console.log('\\nStep 5: Removing invalid items...');

			// Remove not found profiles from README.md
			const allInvalidTitles = [
				...notFoundProfiles.map((p) => p.username),
				...readmeNotFoundProfiles.map((p) => p.username)
			];

			if (allInvalidTitles.length > 0) {
				const { newData, removedCount } = await removeBrokenLinks(allInvalidTitles, markdown);
				console.log(`Removed ${removedCount} invalid profile entries`);
				await rewriteReadmeFile(newData);
			}

			// Remove broken links if any
			if (results.broken.length > 0) {
				const { newData } = await removeBrokenLinks(results.broken, markdown);
				await rewriteReadmeFile(newData);
			}

			console.log('\\n=== Summary ===');
			console.log(`Total profiles checked: ${profileLinks.length}`);
			console.log(`Valid GitHub profiles: ${existingProfiles.length}`);
			console.log(
				`Invalid profiles removed: ${notFoundProfiles.length + readmeNotFoundProfiles.length}`
			);
			console.log(
				`External links checked: ${results.working.length + results.broken.length + results.errors.length}`
			);
			console.log(`Working external links: ${results.working.length}`);
			console.log(`Broken external links removed: ${results.broken.length}`);
			console.log(`Error external links: ${results.errors.length}`);
		} else {
			console.log('\\nNo invalid items found. Skipping removal.');
		}

		// Step 6: Clear screenshots directory
		console.log('\\nStep 6: Clearing screenshots directory...');
		await clearScreenshotDirectory();

		console.log('\\n=== Refresh Data Process Completed Successfully ===');
	} catch (error) {
		console.error('\\n=== Refresh Data Process Failed ===');
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

// Execute main function
main();
