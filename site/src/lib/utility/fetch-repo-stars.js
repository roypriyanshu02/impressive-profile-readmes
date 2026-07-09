import dotenv from 'dotenv';
dotenv.config();

// Cache for storing star counts to avoid redundant API calls
// Using standard Map for performance (module-level cache)
const starCountCache = new Map();

/**
 * A function that fetches the total count of stargazers for a given GitHub user's repository
 * @param {String} username - The GitHub username of the user whose stargazer count to fetch
 * @return {Promise<Number>} - The total count of stargazers, or 0 if an error occurred
 */
const fetchRepoStar = async (username) => {
	// Check cache first
	if (starCountCache.has(username)) {
		return starCountCache.get(username);
	}

	if (!process.env.GITHUB_TOKEN) {
		// Log warning once if token is missing to avoid spamming the log
		if (!global.__githubTokenWarningLogged) {
			console.warn(
				'⚠ GITHUB_TOKEN environment variable is not defined. GraphQL API calls will be skipped.'
			);
			global.__githubTokenWarningLogged = true;
		}
		return 0;
	}

	// Define the GraphQL query to fetch the stargazer count for the user's repository
	const query = `query { repository(owner: "${username}", name: "${username}") { stargazers { totalCount } } }`;

	// Prepare the HTTP request to the GitHub GraphQL API
	const request = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query })
	};

	try {
		// Add timeout to prevent hanging requests
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		// Send the request to the GitHub API and retrieve the result
		const response = await fetch('https://api.github.com/graphql', {
			...request,
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`GitHub API request failed: ${response.status}`);
		}

		const result = await response.json();

		// Extract the total count of stargazers from the response
		const starCount = result.data?.repository?.stargazers?.totalCount ?? 0;

		// Cache the result
		starCountCache.set(username, starCount);

		return starCount;
	} catch (error) {
		// In case of error, return 0
		console.error(`Error fetching star count for ${username}:`, error.message);
		return 0;
	}
};

export default fetchRepoStar;
