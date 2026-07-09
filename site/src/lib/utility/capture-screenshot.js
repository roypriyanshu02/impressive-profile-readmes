import sharp from 'sharp';
import puppeteer from 'puppeteer';

/**
 * A function that captures a screenshot of a GitHub user's profile README and saves it as a static or animated webp file
 * @param {String} path - The file path to save the screenshot to
 * @param {String} userName - The GitHub username of the user whose README to capture
 * @param {Boolean} isAnimated - Whether to capture animated content (GIFs)
 * @return {Promise<Object>} - The result of the screenshot saving process
 */
const captureScreenshot = async (path, userName, isAnimated = false) => {
	// Define browser and page variables
	const browser = await puppeteer.launch({
		headless: true, // run in headless mode
		args: ['--no-sandbox'] // disable sandboxing for safety
	});
	const url = `https://github.com/${userName}`;

	// Dynamic viewport and timing based on content type
	const config = isAnimated
		? {
				viewportWidth: 1920,
				viewportHeight: 8000, // Larger viewport for full page capture
				windowWidth: 1920,
				windowMinHeight: 2000,
				windowMaxHeight: 15000,
				captureTimeout: 90000, // 90 seconds for animations
				waitTime: 5000, // 5 seconds for animations
				domSelector: 'div.profile-readme', // Standard selector
				navbarOffset: 83,
				pageOffset: 0
			}
		: {
				viewportWidth: 1400,
				viewportHeight: 5000,
				windowWidth: 1400,
				windowMinHeight: 1000,
				windowMaxHeight: 5000,
				captureTimeout: 60000,
				waitTime: 2000,
				domSelector: 'div.profile-readme',
				navbarOffset: 54,
				pageOffset: 54
			};

	// Create new page and navigate to the user's GitHub profile
	const page = await browser.newPage();
	try {
		await page.goto(url, { waitUntil: 'networkidle0', timeout: config.captureTimeout });
	} catch (error) {
		console.error(error);
		throw error;
	}

	// Set the viewport height
	await page.setViewport({
		width: config.viewportWidth,
		height: config.viewportHeight
	});

	// For animated capture, take full page screenshot
	let screenshotBuffer;
	if (isAnimated) {
		// Wait for animations to complete
		await new Promise((resolve) => setTimeout(resolve, config.waitTime));

		// Take full page screenshot using page.screenshot with fullPage option
		screenshotBuffer = await page.screenshot({
			fullPage: true,
			type: 'png' // Use PNG for better animation quality
		});
	} else {
		// For static capture, use optimized clip-based screenshot
		// Get the README DOM height
		let domHeight = await page.evaluate(() => {
			const readme = document.querySelector(config.domSelector);
			return readme ? readme.getBoundingClientRect().bottom : 0;
		});

		// Ensure window height captures entire README
		const windowHeight = Math.min(
			Math.max(domHeight, config.windowMinHeight),
			config.windowMaxHeight
		);

		// Take screenshot of README
		screenshotBuffer = await page.screenshot({
			clip: {
				width: config.windowWidth,
				height: windowHeight - config.navbarOffset,
				x: 0,
				y: config.pageOffset
			}
		});
	}

	// Convert to webp with animated support
	let result;
	if (isAnimated) {
		// For animated content, create animated WebP
		result = await sharp(screenshotBuffer)
			.resize(800, null, {
				kernel: 'lanczos3',
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({
				quality: 85,
				effort: 6,
				nearLossless: true,
				alphaQuality: 80,
				smartSubsample: true,
				reductionEffort: 6,
				animated: true // Enable animated WebP
			})
			.toFile(`${path}/${userName}.webp`);
	} else {
		// For static content, use existing optimized settings
		result = await sharp(screenshotBuffer)
			.resize(800, null, {
				kernel: 'lanczos3',
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({
				quality: 65,
				effort: 6,
				nearLossless: true,
				alphaQuality: 80,
				smartSubsample: true,
				reductionEffort: 6
			})
			.toFile(`${path}/${userName}.webp`);
	}

	// Wait additional time based on animation type
	await new Promise((resolve) => setTimeout(resolve, config.waitTime));

	// Close the page and browser
	await page.close();
	await browser.close();

	// Return enhanced result with metadata
	return {
		...result,
		username: userName,
		isAnimated,
		screenshotPath: `${path}/${userName}.webp`,
		captureMetadata: {
			animated: isAnimated,
			quality: isAnimated ? 85 : 65,
			size: result.size,
			format: result.format
		}
	};
};

export default captureScreenshot;
