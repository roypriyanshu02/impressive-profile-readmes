import dimerappMarkdown from '@dimerapp/markdown'; // importing the dimerapp markdown library for converting markdown to JSON

/**
 * A function that converts Markdown to JSON
 * @param {String} markdown - The markdown string to be converted
 * @return {Promise<Object>} - The JSON object resulting from the markdown conversion
 */
const markdownToJsonConverter = async (markdown) => {
	const markdownLib = new dimerappMarkdown(markdown);
	return await markdownLib.toJSON();
};

export default markdownToJsonConverter;
