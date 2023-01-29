import { promises as fs } from 'fs';

// Define the root directory for file operations
const rootDir = `${process.cwd()}/..`;

/**
 * A function that reads the contents of a file and returns it as a string
 * @param {String} fileName - The name of the file to read
 * @return {Promise<String>}
 */
const readFile = async (fileName) => {
	try {
		// Read the contents of the file
		const data = await fs.readFile(`${rootDir}/${fileName}`, 'utf8');
		// Return the contents of the file
		return data;
	} catch (error) {
		// Throw the error if it occurs
		throw error;
	}
};

/**
 * A function that writes data to a file
 * @param {String} fileName - The name of the file to write to
 * @param {String} data - The data to write to the file
 */
const writeFile = async (fileName, data) => {
	try {
		// Write the data to the file
		await fs.writeFile(`${rootDir}/${fileName}`, data);
	} catch (error) {
		// Throw the error if it occurs
		throw error;
	}
};

/**
 * A function that deletes a file
 * @param {String} fileName - The name of the file to delete
 */
const deleteFile = async (fileName) => {
	try {
		// Delete the file
		await fs.unlink(`${rootDir}/${fileName}`);
	} catch (error) {
		// Throw the error if it occurs
		throw error;
	}
};

/**
 * A function that reads the contents of a directory and returns the file names
 * @param {String} directory - The name of the directory to read
 * @return {Promise<Array>}
 */
const readDir = async (directory) => {
	try {
		// Read the contents of the directory
		const fileNames = await fs.readdir(`${rootDir}/${directory}`, { withFileTypes: true });
		// Return the file names
		return fileNames;
	} catch (error) {
		// Throw the error if it occurs
		throw error;
	}
};

// Export the functions
export { rootDir, readDir, readFile, writeFile, deleteFile };
