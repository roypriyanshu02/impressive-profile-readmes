import dotenv from 'dotenv';
dotenv.config();

/**
 * A function that fetches the total count of stargazers for a given GitHub user's repository
 * @param {String} username - The GitHub username of the user whose stargazer count to fetch
 * @return {Promise<Number>} - The total count of stargazers, or null if an error occurred
 */
const fetchRepoStar = async (username) => {
	// Define the GraphQL query to fetch the stargazer count for the user's repository
	const query = `query { repository(owner: "${username}", name: "${username}") { stargazers { totalCount } } }`;
	// Prepare the HTTP request to the GitHub Graphql API
	const request = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // use the provided API token for authentication
			'Content-Type': 'application/json' // set the content type to JSON
		},
		body: JSON.stringify({ query }) // stringify the query
	};
	try {
		// Send the request to the GitHub API and retrieve the result
		const response = await fetch('https://api.github.com/graphql', request);
		const result = await response.json();
		// Extract the total count of stargazers from the response
		const starCount = result.data.repository.stargazers.totalCount;
		return starCount;
	} catch (error) {
		// In case of error, return null
		console.error(error);
		return 0;
	}
};

export default fetchRepoStar;
