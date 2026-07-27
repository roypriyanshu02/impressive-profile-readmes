export interface MarkdownLinkPart {
	type: 'text' | 'link';
	content?: string;
	text?: string;
	href?: string;
}

export interface MarkdownHeaderInfo {
	title: string;
	desc: string;
	tip: string;
	intro: string;
	intros: string[];
}

export interface MarkdownListItem {
	title: string;
	href: string;
	desc: string;
}

export const renderMarkdownLinks = (text?: string): MarkdownLinkPart[] => {
	if (!text) return [];
	const parts: MarkdownLinkPart[] = [];
	const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
		}
		parts.push({ type: 'link', text: match[1], href: match[2] });
		lastIndex = regex.lastIndex;
	}

	if (lastIndex < text.length) {
		parts.push({ type: 'text', content: text.slice(lastIndex) });
	}
	return parts;
};

export const parseMarkdownHeader = (headerText?: string): MarkdownHeaderInfo => {
	if (!headerText) return { title: 'Awesome GitHub Profile README', desc: '', tip: '', intro: '', intros: [] };
	const lines = headerText.split('\n');
	let title = 'Awesome GitHub Profile README';
	let desc = '';
	let tip = '';
	const intros: string[] = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith('<h1') || trimmed.startsWith('# ')) {
			const m = trimmed.match(/#\s+(.+)$/) || trimmed.match(/>([^<]+)<\/h1>/);
			if (m) title = m[1].trim();
		} else if (trimmed.includes('Get inspired')) {
			const m = trimmed.match(/<em>(.*?)<\/em>/);
			desc = m ? m[1].trim() : trimmed;
		} else if (trimmed.startsWith('Remember to give')) {
			tip = trimmed;
		} else if (
			trimmed &&
			!trimmed.startsWith('<') &&
			!trimmed.startsWith('---') &&
			!trimmed.startsWith('[!') &&
			!trimmed.startsWith('!') &&
			!trimmed.includes('Categories')
		) {
			intros.push(trimmed);
		}
	}
	return { title, desc, tip, intro: intros[0] || '', intros };
};

export const parseMarkdownList = (markdownText?: string): MarkdownListItem[] => {
	if (!markdownText) return [];
	return markdownText
		.split('\n')
		.map((line) => {
			const match = line.match(/^-\s+(?:\*\*)?\[([^\]]+)\]\(([^)]+)\)(?:\*\*)?(?:\s*(.*?))?$/);
			if (match) {
				let desc = (match[3] || '').trim();
				if (desc.startsWith('_- ') && desc.endsWith('_')) {
					desc = '— ' + desc.slice(3, -1).trim();
				} else if (desc.startsWith('_') && desc.endsWith('_')) {
					desc = desc.slice(1, -1).trim();
				}
				return { title: match[1], href: match[2], desc };
			}
			return null;
		})
		.filter((item): item is MarkdownListItem => item !== null);
};
