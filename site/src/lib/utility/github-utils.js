import { AbortController } from 'node:abort-controller';

/**
 * A function to detect if a GitHub user's profile README contains animated content (GIFs)
 * @param {String} username - The GitHub username to check
 * @return {Promise<Object>} - Detection result with isAnimated flag and metadata
 */
const detectGIFsInREADME = async (username) => {
	const rawReadmeUrl = `https://raw.githubusercontent.com/${username}/${username}/README.md`;
	const profileUrl = `https://github.com/${username}`;

	try {
		// Check profile exists
		const profileController = new AbortController();
		const profileTimeoutId = setTimeout(() => profileController.abort(), 10000);

		const profileResponse = await fetch(profileUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; ImpressiveProfileBot/1.0)'
			},
			signal: profileController.signal
		});

		clearTimeout(profileTimeoutId);

		if (profileResponse.status === 404) {
			return {
				username,
				isAnimated: false,
				status: 'not-found',
				message: 'GitHub profile not found'
			};
		}

		// Fetch raw README.md to check for animated content
		const readmeController = new AbortController();
		const readmeTimeoutId = setTimeout(() => readmeController.abort(), 15000);

		const readmeResponse = await fetch(rawReadmeUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; ImpressiveProfileBot/1.0)'
			},
			signal: readmeController.signal
		});

		clearTimeout(readmeTimeoutId);

		if (readmeResponse.status === 404) {
			return {
				username,
				isAnimated: false,
				status: 'readme-not-found',
				message: 'No README.md found in profile'
			};
		}

		const markdown = await readmeResponse.text();
		const isAnimated = detectAnimatedContent(markdown);

		return {
			username,
			isAnimated,
			status: 'success',
			hasReadme: true,
			message: isAnimated
				? 'Profile contains animated content (GIFs)'
				: 'Profile contains static content only'
		};

	} catch (error) {
		console.error(`Error detecting animated content for ${username}:`, error.message);
		return {
			username,
			isAnimated: false,
			status: 'error',
			error: error.message,
			message: 'Failed to detect animated content'
		};
	}
};

/**
 * Detect animated content in README markdown
 * @param {String} markdown - The markdown content to analyze
 * @return {Boolean} - true if animated content detected, false otherwise
 */
const detectAnimatedContent = (markdown) => {
	if (!markdown) return false;

	// Patterns that indicate animated content
	const animatedPatterns = [
		// Image extensions that suggest animation
		/\!\[.*?\]\((https?:\/\/.*?)\.(gif|gifv|webp|gifs?)\s*[)\s]/gi,
		// HTML img tags with animated extensions
		/<img\s+[^>]*src=["'](https?:\/\/.*?\.(gif|gifv|webp|apng)["']\s*[^>]*>/gi,
		// Base64 encoded GIFs
		/data:image\/gif;base64,/gi,
		// GIF-specific HTML5 video tags (rare in READMEs)
		/<video\s+[^>]*>(.*?)<\/video>/gi,
		// Markdown with image references for animation
		/\[!\[.*?\]\]\(.*?(gif|gifv|webp)[^)\s]*\)/gi,
		// Animated emoji shortcodes (common patterns)
		/:\w+gif:/gi,
		// Alt text indicating animation
		/alt=["']*?(animated|gif|moving|loop|auto)["']?/gi,
		// Inline styles suggesting animation
		/style=["']*?(animation| autoplay|loop)["']?/gi
	];

	// Check each pattern
	for (const pattern of animatedPatterns) {
		if (pattern.test(markdown)) {
			return true;
		}
	}

	// Look for multiple image patterns in sequence (indicative of animation)
	const imageCount = (markdown.match(/\!\[.*?\]/g) || []).length;
	const htmlImageCount = (markdown.match(/<img\s+/g) || []).length;
	
	if (imageCount > 1 || htmlImageCount > 1) {
		// Multiple images in same README suggest potential animation
		return true;
	}

	return false;
};

/**
 * Batch detect animated content for multiple profiles with rate limiting
 * @param {Array<String>} usernames - Array of GitHub usernames to check
 * @param {Number} delay - Delay between requests in ms
 * @return {Promise<Array<Object>>} - Detection results for all profiles
 */
const detectMultipleProfiles = async (usernames, delay = 1000) => {
	const results = [];

	for (let i = 0; i < usernames.length; i++) {
		const username = usernames[i];
		const result = await detectGIFsInREADME(username);
		results.push(result);

		// Add delay to avoid rate limiting (GitHub allows ~60 requests/hour)
		if (i < usernames.length - 1) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}

	return results;
};

export default detectGIFsInREADME;
export { detectMultipleProfiles, detectAnimatedContent };