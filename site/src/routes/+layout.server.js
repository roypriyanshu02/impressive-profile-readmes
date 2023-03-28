import { readFile } from 'fs/promises';
import { join } from 'path';

export const load = async () => {
	try {
		// Read the contents of README.json file
		const filePath = join(process.cwd(), 'static', 'README.json');
		const fileContents = await readFile(filePath, 'utf-8');
		const result = JSON.parse(fileContents);

		// Extract relevant information from README.json
		const lastModified = new Date(result.lastModified)
			.toLocaleString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
			.toUpperCase();

		// Return extracted information
		return {
			lastModified
		};
	} catch (error) {
		// If an error occurs, log it and return an error object
		const lastModified = new Date(Date.now())
			.toLocaleString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
			.toUpperCase();
		console.error(error);
		return {
			lastModified: lastModified,
			error: error
		};
	}
};

export const prerender = true;
