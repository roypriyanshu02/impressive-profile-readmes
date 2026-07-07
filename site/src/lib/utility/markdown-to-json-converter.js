import { MarkdownFile } from '@dimerapp/markdown';

/**
 * A function that converts Markdown to a JSON structure compatible with the old v3 API
 * @param {String} markdown - The markdown string to be converted
 * @return {Object} - The JSON object with { contents: { children: [...] } } structure
 */
const markdownToJsonConverter = async (markdown) => {
	const file = new MarkdownFile();
	file.contents = markdown;
	await file.process();

	const children = [];

	for (let i = 0; i < file.ast.children.length; i++) {
		const node = file.ast.children[i];

		if (node.type === 'element' && node.tagName === 'h4') {
			const categoryName = node.children?.find((c) => c.type === 'text')?.value;
			if (!categoryName) continue;

			children.push({
				tag: 'h4',
				children: [{}, { type: 'text', value: categoryName }]
			});

			// Find the next UL element
			const ulNode = file.ast.children
				.slice(i + 1)
				.find((n) => n.type === 'element' && n.tagName === 'ul');

			if (ulNode) {
				const listChildren = ulNode.children
					.filter((li) => li.type === 'element' && li.tagName === 'li')
					.map((li) => {
						const anchor = li.children?.find((c) => c.type === 'element' && c.tagName === 'a');
						if (!anchor) return null;

						const username = anchor.children?.find((c) => c.type === 'text')?.value;
						const href = anchor.properties?.href;
						if (!username || !href) return null;

						return {
							children: [
								{
									children: [{ value: username }],
									props: { href }
								}
							]
						};
					})
					.filter(Boolean);

				children.push({
					tag: 'ul',
					children: listChildren
				});

				// Skip the UL node in the loop
				i += file.ast.children.slice(i + 1).indexOf(ulNode) + 1;
			}
		}
	}

	return {
		contents: {
			children
		},
		lastModified: Date.now()
	};
};

export default markdownToJsonConverter;
