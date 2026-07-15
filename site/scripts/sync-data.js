import { existsSync } from 'fs';
import { setTimeout } from 'timers/promises';
import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import sharp from 'sharp';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const readmePath = resolve(__dirname, '..', '..', 'README.md');
const screenshotsDir = resolve(__dirname, '..', 'src', 'lib', 'screenshots');
const staticDir = resolve(__dirname, '..', 'static');

if (process.platform === 'linux') {
	const userHome = process.env.HOME || process.env.USERPROFILE || '';
	const localLibPath = resolve(userHome, '.local', 'lib', 'usr', 'lib', 'x86_64-linux-gnu');
	if (existsSync(localLibPath)) {
		if (!process.env.LD_LIBRARY_PATH) {
			process.env.LD_LIBRARY_PATH = localLibPath;
		} else if (!process.env.LD_LIBRARY_PATH.includes(localLibPath)) {
			process.env.LD_LIBRARY_PATH = `${localLibPath}:${process.env.LD_LIBRARY_PATH}`;
		}
	}
}

/** Get authenticated GitHub API headers */
function getGitHubHeaders() {
	const headers = { 'User-Agent': 'awesome-github-profile-readme' };
	if (process.env.GITHUB_TOKEN) {
		headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
	}
	return headers;
}

/** Get target repository (owner/repo) from environment or fallback */
function getRepositorySlug() {
	return process.env.GITHUB_REPOSITORY || 'roypriyanshu02/awesome-github-profile-readme';
}

/** Minimal tag-based logger */
function log(tag, message) {
	const stream = tag === 'err' ? console.error : tag === 'warn' ? console.warn : console.log;
	stream(`[${tag}] ${message}`);
}

/** Fetch helper with exponential backoff and GitHub rate-limit retry handling */
async function fetchWithRetry(url, options = {}, retries = 2, initialDelay = 1000) {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url, options);
			const isRateLimited = res.status === 429 || (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0');
			
			if (isRateLimited && attempt < retries) {
				const retryAfter = res.headers.get('retry-after');
				let waitMs = initialDelay * Math.pow(2, attempt);
				if (retryAfter) {
					waitMs = Math.max(waitMs, parseInt(retryAfter, 10) * 1000);
				}
				await setTimeout(waitMs);
				continue;
			}
			return res;
		} catch (err) {
			if (attempt === retries) throw err;
			await setTimeout(initialDelay * Math.pow(2, attempt));
		}
	}
}

/** Utility for concurrency limiting */
async function mapConcurrent(items, limit, fn) {
	const results = Array.from({ length: items.length });
	let index = 0;

	const worker = async () => {
		while (index < items.length) {
			const currentIndex = index++;
			results[currentIndex] = await fn(items[currentIndex], currentIndex);
		}
	};

	const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
	await Promise.all(workers);
	return results;
}

/** Parse README markdown natively into legacy V3 JSON AST structure & profiles list */
function parseReadmeMarkdown(markdown) {
	const children = [];
	const profilesList = [];
	const linkItems = [];
	const seen = new Set();

	const sectionLines = {
		header: [],
		toc: [],
		article: [],
		tools: [],
		featuredProjects: [],
		faq: [],
		contribute: [],
		license: []
	};

	let currentSection = 'header';
	const lines = markdown.split(/\r?\n/);
	let currentCategory = null;
	let currentList = [];

	const flushCategory = () => {
		if (currentCategory && currentList.length > 0) {
			children.push({
				tag: 'h4',
				children: [{}, { type: 'text', value: currentCategory }]
			});
			children.push({
				tag: 'ul',
				children: currentList
			});
		}
		currentList = [];
	};

	for (const line of lines) {
		const trimmed = line.trim();

		const sectionMatch = trimmed.match(/^##\s+(.+)$/i);
		if (sectionMatch) {
			const heading = sectionMatch[1].toLowerCase();
			if (heading.startsWith('table of content')) {
				currentSection = 'toc';
				continue;
			}
			if (heading === 'categories') {
				currentSection = 'categories';
				continue;
			}
			if (heading === 'articles') {
				flushCategory();
				currentSection = 'article';
				continue;
			}
			if (heading === 'tools') {
				currentSection = 'tools';
				continue;
			}
			if (heading.startsWith('featured project')) {
				currentSection = 'featuredProjects';
				continue;
			}
			if (heading === 'faq' || heading.startsWith('frequently asked question')) {
				currentSection = 'faq';
				continue;
			}
			if (heading === 'contribute') {
				currentSection = 'contribute';
				continue;
			}
			if (heading === 'license') {
				currentSection = 'license';
				continue;
			}
		}

		if (currentSection === 'header') {
			sectionLines.header.push(line);
		} else if (currentSection === 'categories') {
			const hMatch = line.match(/^#{3,4}\s+(.+)$/);
			if (hMatch) {
				flushCategory();
				currentCategory = hMatch[1].trim();
				continue;
			}

			const liMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
			if (liMatch && currentCategory) {
				const username = liMatch[1].trim();
				const href = liMatch[2].trim();
				const lowerUser = username.toLowerCase();

				if (seen.has(lowerUser)) {
					throw new Error(`Duplicate profile in README.md: "${username}"`);
				}
				seen.add(lowerUser);
				profilesList.push(lowerUser);
				linkItems.push({ href, title: username });

				currentList.push({
					children: [
						{
							children: [{ value: username }],
							props: { href }
						}
					]
				});
			}
		} else if (sectionLines[currentSection] && trimmed) {
			sectionLines[currentSection].push(line);
		}
	}
	flushCategory();

	const jsonAst = {
		contents: { children },
		readmeContent: Object.fromEntries(
			Object.entries(sectionLines).map(([k, v]) => [k, v.join('\n').trim()])
		),
		lastModified: Date.now()
	};

	return { jsonAst, profilesList, linkItems };
}

/** Check profile animated status via raw GitHub content */
async function checkIsAnimated(profile) {
	try {
		const readmeRes = await fetchWithRetry(
			`https://raw.githubusercontent.com/${profile}/${profile}/README.md`,
			{ headers: getGitHubHeaders() }
		);
		if (readmeRes && readmeRes.ok) {
			const text = await readmeRes.text();
			return /\.gif(?:\?|#|"|'|\)|\s|$)/i.test(text) || /<img[^>]+src=["'][^"']*\.gif/i.test(text);
		}
	} catch {
		// Ignore failed raw README fetch
	}
	return false;
}

/** Capture profile README screenshot & scrape star count via Puppeteer */
async function captureScreenshot(path, userName, isAnimated = false, browserInstance = null, maxRetries = 2) {
	const browser =
		browserInstance ||
		(await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		}));
	const url = `https://github.com/${userName}`;
	const captureTimeout = isAnimated ? 90000 : 60000;
	const viewportWidth = isAnimated ? 1920 : 1400;
	const domSelector = 'div.profile-readme';

	let page;
	try {
		page = await browser.newPage();

		let readmeElement = null;
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const waitUntilMode = attempt === 0 ? 'networkidle2' : 'domcontentloaded';
				await page.goto(url, { waitUntil: waitUntilMode, timeout: captureTimeout });
				await page.setViewport({
					width: viewportWidth,
					height: isAnimated ? 8000 : 5000
				});

				readmeElement = await page.$(domSelector);
				if (readmeElement) break;
				if (attempt < maxRetries) {
					await setTimeout(2000);
				}
			} catch (navError) {
				if (navError.message.includes('timeout') || navError.message.includes('Navigation')) {
					log('warn', `Navigation timeout: ${userName} (attempt ${attempt + 1}), retrying with domcontentloaded`);
					if (attempt < maxRetries) {
						await setTimeout(2000);
						continue;
					}
				}
				throw navError;
			}
		}

		if (!readmeElement) {
			const currentUrl = page.url();
			if (currentUrl && currentUrl.includes('github.com')) {
				return { missingReadme: true, username: userName };
			}
			throw new Error(`Failed to navigate to GitHub profile page for ${userName}`);
		}

		const pageData = await page.evaluate(
			(selector, user) => {
				const readme = document.querySelector(selector);
				const domHeight = readme ? readme.getBoundingClientRect().bottom : 0;
				let stars = 0;
				const repoLink = document.querySelector(
					`a[href$="/${user}/${user}"], a[href$="/${user}/${user}/stargazers"]`
				);
				if (repoLink) {
					const counter =
						repoLink.querySelector('.Counter') || repoLink.parentElement?.querySelector('.Counter');
					if (counter) {
						stars = parseInt(counter.textContent.trim().replace(/,/g, ''), 10) || 0;
					}
				}
				return { domHeight, stars };
			},
			domSelector,
			userName
		);

		const windowMinHeight = isAnimated ? 2000 : 1000;
		const windowMaxHeight = isAnimated ? 15000 : 5000;
		const windowHeight = Math.min(Math.max(pageData.domHeight, windowMinHeight), windowMaxHeight);

		await page.setViewport({
			width: viewportWidth,
			height: Math.ceil(windowHeight)
		});

		if (isAnimated) {
			await setTimeout(2000);
		}

		// GitHub profile page crop offset: skip top navigation (83px), clip domHeight minus bottom margin (54px)
		const screenshotBuffer = await page.screenshot({
			clip: {
				width: viewportWidth,
				height: windowHeight - 54,
				x: 0,
				y: 83
			}
		});

		const result = await sharp(screenshotBuffer)
			.resize(800, null, {
				kernel: 'lanczos3',
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({
				quality: isAnimated ? 85 : 65,
				effort: 6,
				nearLossless: true,
				alphaQuality: 80,
				smartSubsample: true,
				reductionEffort: 6,
				animated: isAnimated
			})
			.toFile(`${path}/${userName}.webp`);

		return {
			...result,
			username: userName,
			stars: pageData.stars
		};
	} catch (error) {
		log('err', `Screenshot failed: ${userName} - ${error.message}`);
		throw error;
	} finally {
		if (page) await page.close().catch(() => {});
		if (!browserInstance && browser) await browser.close().catch(() => {});
	}
}

/** Check profile links in parallel, filter broken ones with double-check verification & circuit breaker */
async function cleanBrokenLinks(markdown, linkItems) {
	const brokenTitles = new Set();
	let rateLimitedCount = 0;
	let completed = 0;
	const total = linkItems.length;
	const headers = getGitHubHeaders();
	const concurrencyLimit = process.env.GITHUB_TOKEN ? 10 : 5;

	log('info', `Checking ${total} links for broken URLs (concurrency: ${concurrencyLimit})...`);

	await mapConcurrent(linkItems, concurrencyLimit, async (link) => {
		try {
			const res = await fetchWithRetry(link.href, { method: 'HEAD', headers });
			completed++;
			if (!res) return;

			if (res.status === 404 || res.status === 410) {
				await setTimeout(1500);
				const doubleCheckRes = await fetchWithRetry(link.href, { method: 'GET', headers });
				if (doubleCheckRes && (doubleCheckRes.status === 404 || doubleCheckRes.status === 410)) {
					brokenTitles.add(link.title);
					log('warn', `[${completed}/${total}] Broken link verified: ${link.title} (${doubleCheckRes.status})`);
				}
			} else if (res.status === 429) {
				rateLimitedCount++;
			}
		} catch (err) {
			completed++;
			log('err', `[${completed}/${total}] Link check failed [${link.href}]: ${err.message}`);
		}
	});

	if (rateLimitedCount > 0) {
		log('warn', `Rate limited on ${rateLimitedCount} link checks (HTTP 429) - keeping profiles intact`);
	}

	if (brokenTitles.size === 0) {
		log('info', `Completed checking ${total} links - 0 broken links found.`);
		return markdown;
	}

	const MASS_DELETION_LIMIT = 15;
	if (brokenTitles.size > MASS_DELETION_LIMIT) {
		log(
			'warn',
			`Circuit breaker triggered: ${brokenTitles.size} broken links detected (exceeds safety limit of ${MASS_DELETION_LIMIT}). Skipping auto-delete.`
		);
		return markdown;
	}

	const cleanedMarkdown = markdown
		.split(/\r?\n/)
		.filter((line) => {
			const match = line.match(/^-\s+\[([^\]]+)\]\(/);
			return !(match && brokenTitles.has(match[1].trim()));
		})
		.join('\n');

	await writeFile(readmePath, cleanedMarkdown);
	log('info', `Cleaned ${brokenTitles.size} broken links from README.md`);
	return cleanedMarkdown;
}

/** Fetch current repository stats via GitHub API */
async function fetchRepoStats() {
	let fallbackStats = { stars: 184, open_issues: 1, open_prs: 0, forks: 32 };
	try {
		const existing = await readFile(resolve(staticDir, 'repo_stats.json'), 'utf-8');
		const parsed = JSON.parse(existing);
		const s = typeof parsed.stars === 'number' ? parsed : (parsed.repoStats || {});
		if (typeof s.stars === 'number' && s.stars > 0) {
			fallbackStats = {
				stars: s.stars,
				open_issues: s.open_issues ?? 0,
				open_prs: s.open_prs ?? 0,
				forks: s.forks ?? 0
			};
		}
	} catch {
		// Ignore missing or unparseable file
	}

	const repoSlug = getRepositorySlug();
	const headers = getGitHubHeaders();

	try {
		const [repoRes, prsRes] = await Promise.all([
			fetchWithRetry(`https://api.github.com/repos/${repoSlug}`, { headers }),
			fetchWithRetry(`https://api.github.com/repos/${repoSlug}/pulls?state=open`, { headers })
		]);

		if (!repoRes || !repoRes.ok) {
			log('warn', `GitHub API returned ${repoRes ? repoRes.status : 'no response'}. Using cached repo stats.`);
			return fallbackStats;
		}

		const repoData = await repoRes.json();
		const openPrsCount = prsRes && prsRes.ok ? (await prsRes.json()).length : 0;

		return {
			stars: repoData.stargazers_count ?? fallbackStats.stars,
			open_issues: Math.max(0, (repoData.open_issues_count ?? 0) - openPrsCount),
			open_prs: openPrsCount,
			forks: repoData.forks_count ?? fallbackStats.forks
		};
	} catch (err) {
		log('warn', `Failed to fetch repo stats: ${err.message}. Using cached repo stats.`);
		return fallbackStats;
	}
}

/** Sync screenshots & return star counts map with concurrent worker pool */
async function syncScreenshots(profilesList, forceRebuild = false) {
	const files = await readdir(screenshotsDir, { withFileTypes: true });
	const existing = new Set(
		files.filter((f) => f.isFile()).map((f) => f.name.replace(/\.webp$/, ''))
	);
	const target = new Set(profilesList);

	let existingStars = {};
	try {
		const data = await readFile(resolve(staticDir, 'repo_stats.json'), 'utf-8');
		const parsed = JSON.parse(data);
		existingStars = parsed.starsMap || {};
	} catch {
		// Ignore missing or invalid repo_stats.json file
	}

	const failedProfiles = new Set();
	const added = forceRebuild ? profilesList : [...target].filter((p) => !existing.has(p));
	const removed = forceRebuild
		? []
		: [...existing].filter((p) => p !== '.gitkeep' && !target.has(p));

	if (added.length > 0) {
		let browser = null;
		try {
			browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox']
			});
		} catch (err) {
			log('warn', `Puppeteer browser launch skipped: ${err.message}`);
		}

		if (forceRebuild && browser) {
			log('info', 'Force rebuild active: clearing existing screenshots');
			for (const file of files) {
				if (file.name !== '.gitkeep' && file.isFile()) {
					await unlink(resolve(screenshotsDir, file.name));
				}
			}
			existing.clear();
		} else if (forceRebuild && !browser) {
			log('warn', 'Force rebuild requested but Puppeteer launch failed. Preserving existing screenshots.');
		}

		if (browser) {
			try {
				let processedCount = 0;
				log('info', `Capturing screenshots for ${added.length} profiles...`);
				await mapConcurrent(added, 3, async (profile) => {
					const isAnimated = await checkIsAnimated(profile);
					try {
						const res = await captureScreenshot(screenshotsDir, profile, isAnimated, browser);
						processedCount++;
						if (res && res.missingReadme) {
							failedProfiles.add(profile.toLowerCase());
							log('warn', `[${processedCount}/${added.length}] Missing README element: ${profile}`);
						} else if (res && res.stars !== undefined) {
							existingStars[profile] = res.stars;
							log('info', `[${processedCount}/${added.length}] Captured: ${profile} (${res.stars} stars)`);
						}
					} catch (err) {
						processedCount++;
						log('err', `[${processedCount}/${added.length}] Failed profile ${profile}: ${err.message}`);
					}
				});
			} finally {
				await browser.close().catch(() => {});
			}
		}
	} else {
		log('info', 'Screenshots up to date. 0 new screenshots needed.');
	}

	const DOM_MISSING_LIMIT = 20;
	if (failedProfiles.size > 0 && failedProfiles.size <= DOM_MISSING_LIMIT) {
		const markdownContent = await readFile(readmePath, 'utf-8');
		const cleanedMarkdown = markdownContent
			.split(/\r?\n/)
			.filter((line) => {
				const m = line.match(/^-\s+\[([^\]]+)\]\((https?:\/\/github\.com\/([^)/]+))\/?\)/);
				return !(m && failedProfiles.has(m[3].toLowerCase()));
			})
			.join('\n');
		await writeFile(readmePath, cleanedMarkdown);
		log('info', `Cleaned ${failedProfiles.size} profiles with missing README element`);
	} else if (failedProfiles.size > DOM_MISSING_LIMIT) {
		log(
			'warn',
			`Circuit breaker triggered: ${failedProfiles.size} missing DOM selectors detected (exceeds safety limit of ${DOM_MISSING_LIMIT}). Skipping auto-delete.`
		);
		failedProfiles.clear();
	}

	for (const profile of [...removed, ...failedProfiles]) {
		const safeName = profile.replace(/[^a-zA-Z0-9_-]/g, '');
		if (safeName) {
			await unlink(resolve(screenshotsDir, `${safeName}.webp`)).catch(() => {});
			delete existingStars[safeName];
			log('info', `Removed stale screenshot: ${safeName}.webp`);
		}
	}

	const prunedStars = {};
	for (const profile of profilesList) {
		if (!failedProfiles.has(profile.toLowerCase())) {
			prunedStars[profile] = existingStars[profile] ?? 0;
		}
	}

	return prunedStars;
}

// Pipeline entrypoint
(async () => {
	const startTime = Date.now();
	const shouldCheckLinks = process.argv.includes('--check-links');
	const forceRebuild = process.argv.includes('--force-screenshots');

	log('step', '1/4 Parse README');
	let markdown = await readFile(readmePath, 'utf-8');
	let { jsonAst, profilesList, linkItems } = parseReadmeMarkdown(markdown);
	log('info', `${profilesList.length} profiles, ${linkItems.length} links`);

	log('step', '2/4 Link check');
	if (shouldCheckLinks) {
		markdown = await cleanBrokenLinks(markdown, linkItems);
		({ jsonAst, profilesList } = parseReadmeMarkdown(markdown));
	} else {
		log('info', 'Skipped (use --check-links)');
	}

	log('step', '3/4 Sync screenshots');
	const starsMap = await syncScreenshots(profilesList, forceRebuild);

	log('step', '4/4 Write data');
	const repoStats = await fetchRepoStats();

	const combinedData = {
		...jsonAst,
		starsMap,
		repoStats
	};

	await writeFile(resolve(staticDir, 'README.json'), JSON.stringify(combinedData, null, '\t'));
	await writeFile(resolve(staticDir, 'repo_stats.json'), JSON.stringify({ ...repoStats, starsMap }, null, 2));

	const todayIso = new Date().toISOString().split('T')[0];
	const [owner, repo] = getRepositorySlug().split('/');
	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${owner}.github.io/${repo}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
	await writeFile(resolve(staticDir, 'sitemap.xml'), sitemapContent);
	const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
	log('done', `Complete in ${elapsedSec}s`);
})();
