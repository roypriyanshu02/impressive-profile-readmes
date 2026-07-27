<script>
	import { onMount } from 'svelte';
	import { scale, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import Card from '$lib/components/Card.svelte';
	import CardSection from '$lib/components/CardSection.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import Pencil16 from '$lib/components/icons/Pencil16.svelte';
	import Search16 from '$lib/components/icons/Search16.svelte';
	import RepoForked16 from '$lib/components/icons/RepoForked16.svelte';
	import { marked } from 'marked';
	import {
		renderMarkdownLinks,
		parseMarkdownHeader,
		parseMarkdownList
	} from '$lib/utility/markdown';

	export let data;

	const renderer = {
		link({ href, title, text }) {
			if (href.includes('CONTRIBUTING.md')) {
				return `<a href="#contributing" class="tab-switch-link" data-tab="contributing"${title ? ` title="${title}"` : ''}>${text}</a>`;
			}
			if ((href.includes('LICENSE') || href.includes('license')) && !href.startsWith('http')) {
				return `<a href="#license" class="tab-switch-link" data-tab="license"${title ? ` title="${title}"` : ''}>${text}</a>`;
			}
			if (href.includes('roypriyanshu02.github.io/awesome-github-profile-readme')) {
				return `<a href="#" class="scroll-link" data-scroll="categories"${title ? ` title="${title}"` : ''}>${text}</a>`;
			}
			if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
				return `<span>${text}</span>`;
			}
			return `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`;
		}
	};
	marked.use({ renderer });

	const cleanContributingMarkdown = (md) => {
		if (!md) return '';
		return md.replace(/## Table of contents[\s\S]*?(?=## Pull request guidelines)/i, '');
	};

	$: parsedContributingHtml = data.contributingContent
		? marked.parse(cleanContributingMarkdown(data.contributingContent))
		: '';
	$: parsedLicenseHtml = data.licenseContent ? marked.parse(data.licenseContent) : '';
	$: parsedFaqHtml = data.readmeContent?.faq ? marked.parse(data.readmeContent.faq) : '';
	$: parsedReadmeContributeHtml = data.readmeContent?.contribute
		? marked.parse(data.readmeContent.contribute)
		: '';
	$: parsedReadmeLicenseHtml = data.readmeContent?.license
		? marked.parse(data.readmeContent.license)
		: '';

	const screenshots = import.meta.glob('$lib/screenshots/*.webp', { eager: true, import: 'default' });
	const getScreenshotUrl = (username) => {
		const key = `/src/lib/screenshots/${username.toLowerCase()}.webp`;
		return screenshots[key] || `/screenshots/${username.toLowerCase()}.webp`;
	};

	let selectedCategory = 'All';
	let searchQuery = '';
	let activeTab = 'readme';

	const handleGlobalClick = (e) => {
		const target = e.target.closest('a');
		if (target) {
			const href = target.getAttribute('href') || '';
			const dataTab = target.getAttribute('data-tab');
			const dataScroll = target.getAttribute('data-scroll');
			if (href.includes('CONTRIBUTING.md') || dataTab === 'contributing') {
				e.preventDefault();
				e.stopPropagation();
				activeTab = 'contributing';
				window.scrollTo({ top: 0, behavior: 'smooth' });
			} else if ((href.includes('LICENSE') || href.includes('license') || dataTab === 'license') && !href.startsWith('http')) {
				e.preventDefault();
				e.stopPropagation();
				activeTab = 'license';
				window.scrollTo({ top: 0, behavior: 'smooth' });
			} else if (
				href.includes('roypriyanshu02.github.io/awesome-github-profile-readme') ||
				href === '#categories' ||
				dataScroll === 'categories'
			) {
				e.preventDefault();
				e.stopPropagation();
				activeTab = 'readme';
				const catElem = document.getElementById('categories');
				if (catElem) {
					catElem.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const cat = params.get('category');
		const q = params.get('q');
		if (cat && data.categories.some((c) => c.categoryTitle === cat)) {
			selectedCategory = cat;
		}
		if (q) {
			searchQuery = q;
		}

		window.addEventListener('click', handleGlobalClick, true);
		return () => window.removeEventListener('click', handleGlobalClick, true);
	});

	const syncUrlParams = (cat, q) => {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (cat && cat !== 'All') {
			url.searchParams.set('category', cat);
		} else {
			url.searchParams.delete('category');
		}
		if (q.trim()) {
			url.searchParams.set('q', q.trim());
		} else {
			url.searchParams.delete('q');
		}
		window.history.replaceState({}, '', url.toString());
	};

	$: syncUrlParams(selectedCategory, searchQuery);

	$: itemListSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Awesome GitHub Profile README Examples',
		description: 'A curated list of impressive GitHub Profile README examples and templates.',
		numberOfItems: data.profiles.length,
		itemListElement: data.profiles.map((p, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: `${p.username}'s GitHub Profile README`,
			url: `https://github.com/${p.username}`
		}))
	});

	$: headerInfo = parseMarkdownHeader(data.readmeContent?.header);

	$: categoryMap = (() => {
		const map = new Map();
		data.profiles.forEach((profile) => {
			if (!map.has(profile.category)) {
				map.set(profile.category, []);
			}
			map.get(profile.category).push(profile);
		});
		return map;
	})();

	$: filteredProfiles = (() => {
		let list = data.profiles;
		if (selectedCategory === 'Most starred') {
			list = [...data.profiles].sort((a, b) => b.starCount - a.starCount);
		} else if (selectedCategory !== 'All') {
			list = categoryMap.get(selectedCategory) || [];
		}

		if (searchQuery.trim() !== '') {
			const q = searchQuery.toLowerCase().trim();
			list = list.filter(
				(p) => p.username.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
			);
		}
		return list;
	})();

	const updateFilteredData = (category) => {
		selectedCategory = category;
	};

	const clearFilters = () => {
		selectedCategory = 'All';
		searchQuery = '';
	};
</script>

<div class="readme-box">
	<div class="readme-header">
		<nav class="readme-tabs">
			<button
				type="button"
				class="tab-link"
				class:active={activeTab === 'readme'}
				on:click={() => (activeTab = 'readme')}
			>
				README
			</button>
			<button
				type="button"
				class="tab-link"
				class:active={activeTab === 'contributing'}
				on:click={() => (activeTab = 'contributing')}
			>
				Contributing
			</button>
			<button
				type="button"
				class="tab-link"
				class:active={activeTab === 'license'}
				on:click={() => (activeTab = 'license')}
			>
				License
			</button>
		</nav>

		<div class="header-actions">
			{#if activeTab === 'readme'}
				<a
					href="https://github.com/roypriyanshu02/awesome-github-profile-readme/edit/main/README.md"
					target="_blank"
					rel="noopener noreferrer"
					class="action-icon-btn edit-btn-with-label"
					title="Add Profile / Edit README.md on GitHub"
				>
					<Pencil16 width={14} height={14} class="btn-icon-align" />
					<span class="btn-label">Add Profile</span>
				</a>
			{:else if activeTab === 'contributing'}
				<a
					href="https://github.com/roypriyanshu02/awesome-github-profile-readme/fork"
					target="_blank"
					rel="noopener noreferrer"
					class="action-icon-btn edit-btn-with-label"
					title="Fork repository on GitHub"
				>
					<RepoForked16 width={14} height={14} class="btn-icon-align" />
					<span class="btn-label">Fork</span>
				</a>
			{/if}
		</div>
	</div>

	<article class="markdown-body">
		{#if activeTab === 'readme'}
			<h1 class="markdown-h1">
				<span class="markdown-hash">#</span>
				{headerInfo.title}
			</h1>
			<p class="markdown-desc">
				{#each renderMarkdownLinks(headerInfo.desc) as part}
					{#if part.type === 'text'}
						{part.content}
					{:else if part.type === 'link'}
						{#if part.href.includes('CONTRIBUTING.md')}
							<a href="#contributing" data-tab="contributing">{part.text}</a>
						{:else if (part.href.includes('LICENSE') || part.href.includes('license')) && !part.href.startsWith('http')}
							<a href="#license" data-tab="license">{part.text}</a>
						{:else if part.href.includes('roypriyanshu02.github.io/awesome-github-profile-readme')}
							<a href="#" data-scroll="categories">{part.text}</a>
						{:else}
							<a href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
						{/if}
					{/if}
				{/each}
			</p>
			{#if headerInfo.intros && headerInfo.intros.length > 0}
				{#each headerInfo.intros as introParagraph}
					<p class="markdown-intro">
						{#each renderMarkdownLinks(introParagraph) as part}
							{#if part.type === 'text'}
								{part.content}
							{:else if part.type === 'link'}
								{#if part.href.includes('CONTRIBUTING.md')}
									<a href="#contributing" data-tab="contributing">{part.text}</a>
								{:else if (part.href.includes('LICENSE') || part.href.includes('license')) && !part.href.startsWith('http')}
									<a href="#license" data-tab="license">{part.text}</a>
								{:else if part.href.includes('roypriyanshu02.github.io/awesome-github-profile-readme')}
									<a href="#" data-scroll="categories">{part.text}</a>
								{:else}
									<a href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
								{/if}
							{/if}
						{/each}
					</p>
				{/each}
			{/if}
			<div class="readme-badges">
				<img
					src="https://img.shields.io/github/stars/roypriyanshu02/awesome-github-profile-readme?color=dfb317&style=for-the-badge"
					alt="Stars"
				/>
				<img
					src="https://img.shields.io/github/issues/roypriyanshu02/awesome-github-profile-readme?color=0284c7&style=for-the-badge"
					alt="Issues"
				/>
				<img
					src="https://img.shields.io/github/issues-pr/roypriyanshu02/awesome-github-profile-readme?color=8b5cf6&style=for-the-badge"
					alt="Pull requests"
				/>
				<a href="#" data-scroll="categories">
					<img
						src="https://img.shields.io/badge/showcase-live_gallery-black?style=for-the-badge"
						alt="Showcase"
					/>
				</a>
			</div>

			<!-- Category Selector replacing ## Categories heading -->
			<div class="categories-filter-wrapper" id="categories">
				<FilterBar
					filterItems={data.categories}
					selectedFilter={selectedCategory}
					bind:searchQuery
					updateFilteredDataCallback={updateFilteredData}
				/>
			</div>

			{#if filteredProfiles.length > 0}
				<CardSection>
					{#each filteredProfiles as profile (profile.username)}
						<div
							transition:scale={{ duration: 250, start: 0.96, easing: quintOut }}
							animate:flip={{ duration: 350, easing: quintOut }}
							class="card-wrapper"
						>
							<Card
								screenshot={getScreenshotUrl(profile.username)}
								username={profile.username}
								category={profile.category}
								starCount={profile.starCount}
							/>
						</div>
					{/each}
				</CardSection>
			{:else}
				<div class="blankslate">
					<Search16 width={32} height={32} class="blankslate-icon" />
					<h3 class="blankslate-heading">No matching profile READMEs found</h3>
					<p class="blankslate-text">
						No profiles match your search term "{searchQuery}" under category "{selectedCategory}".
					</p>
					<button class="btn-clear" on:click={clearFilters}>Clear filters</button>
				</div>
			{/if}

			<!-- Article Section dynamically loaded from README -->
			{#if data.readmeContent?.article}
				<section class="readme-dynamic-section">
					<h2 class="doc-h2" id="article">
						<span class="markdown-hash">##</span> Article
					</h2>
					<ul class="doc-list">
						{#each parseMarkdownList(data.readmeContent.article) as item}
							<li>
								<a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}</a>
								{#if item.desc}
									<span class="item-desc">
										{#each renderMarkdownLinks(item.desc) as part}
											{#if part.type === 'text'}
												{part.content}
											{:else if part.type === 'link'}
												<a href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
											{/if}
										{/each}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Tools Section dynamically loaded from README -->
			{#if data.readmeContent?.tools}
				<section class="readme-dynamic-section">
					<h2 class="doc-h2" id="tools">
						<span class="markdown-hash">##</span> Tools
					</h2>
					<ul class="doc-list">
						{#each parseMarkdownList(data.readmeContent.tools) as item}
							<li>
								<a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}</a>
								{#if item.desc}
									<span class="item-desc">
										{#each renderMarkdownLinks(item.desc) as part}
											{#if part.type === 'text'}
												{part.content}
											{:else if part.type === 'link'}
												<a href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
											{/if}
										{/each}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Featured Projects Section dynamically loaded from README -->
			{#if data.readmeContent?.featuredProjects}
				<section class="readme-dynamic-section">
					<h2 class="doc-h2" id="featured-projects">
						<span class="markdown-hash">##</span> Featured Projects
					</h2>
					<ul class="doc-list">
						{#each parseMarkdownList(data.readmeContent.featuredProjects) as item}
							<li>
								<a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}</a>
								{#if item.desc}
									<span class="item-desc">
										{#each renderMarkdownLinks(item.desc) as part}
											{#if part.type === 'text'}
												{part.content}
											{:else if part.type === 'link'}
												<a href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>
											{/if}
										{/each}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Frequently Asked Questions (FAQ) Section -->
			{#if data.readmeContent?.faq}
				<section class="readme-dynamic-section">
					<h2 class="doc-h2" id="faq">
						<span class="markdown-hash">##</span> Frequently Asked Questions (FAQ)
					</h2>
					<div class="markdown-rendered">
						{@html parsedFaqHtml}
					</div>
				</section>
			{/if}

			<!-- Contribute Section -->
			{#if data.readmeContent?.contribute}
				<section class="readme-dynamic-section">
					<h2 class="doc-h2" id="contribute">
						<span class="markdown-hash">##</span> Contribute
					</h2>
					<div class="markdown-rendered">
						{@html parsedReadmeContributeHtml}
					</div>
				</section>
			{/if}

			<!-- License Section -->
			{#if data.readmeContent?.license}
				<section class="readme-dynamic-section">
					<h2 class="doc-h2" id="license">
						<span class="markdown-hash">##</span> License
					</h2>
					<div class="markdown-rendered">
						{@html parsedReadmeLicenseHtml}
					</div>
				</section>
			{/if}
		{:else if activeTab === 'contributing'}
			<div class="doc-container markdown-rendered">
				{#if parsedContributingHtml}
					{@html parsedContributingHtml}
				{:else}
					<p class="doc-p">No contributing guidelines found.</p>
				{/if}
			</div>
		{:else if activeTab === 'license'}
			<div class="doc-container markdown-rendered">
				{#if parsedLicenseHtml}
					{@html parsedLicenseHtml}
				{:else}
					<p class="doc-p">This project is dual-licensed under MIT and CC BY 4.0.</p>
				{/if}
			</div>
		{/if}
	</article>
</div>

<svelte:head>
	<meta name="theme-color" content="var(--color-background)" />
	<title>Awesome GitHub Profile README</title>
	<meta
		name="description"
		content="Get inspired to make your GitHub Profile stand out! Check out our gallery of Impressive Profile READMEs and take your profile to the next level."
	/>
	<link rel="canonical" href="https://roypriyanshu02.github.io/awesome-github-profile-readme/" />
	<meta name="author" content="Contributors" />
	<meta name="robots" content="index, follow" />
	<!-- Meta Tags For Open Graph / Facebook -->
	<meta property="og:type" content="Website" />
	<meta property="og:title" content="Awesome GitHub Profile README" />
	<meta
		property="og:description"
		content="Get inspired to make your GitHub Profile stand out! Check out our gallery of Impressive Profile READMEs and take your profile to the next level."
	/>
	<meta
		property="og:url"
		content="https://roypriyanshu02.github.io/awesome-github-profile-readme/"
	/>
	<meta
		property="og:image"
		content="https://roypriyanshu02.github.io/awesome-github-profile-readme/meta.webp"
	/>
	<!-- Meta Tags For Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Awesome GitHub Profile README" />
	<meta
		name="twitter:description"
		content="Get inspired to make your GitHub Profile stand out! Check out our gallery of Impressive Profile READMEs and take your profile to the next level."
	/>
	<meta
		name="twitter:image"
		content="https://roypriyanshu02.github.io/awesome-github-profile-readme/meta.webp"
	/>
	{@html '<script type="application/ld+json">' + itemListSchema + '</script>'}
</svelte:head>

<style>
	.readme-box {
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		overflow: hidden;
		margin-bottom: 1rem;
	}
	.readme-header {
		align-items: center;
		background: var(--color-foreground);
		border-bottom: 1px solid var(--color-border);
		display: flex;
		justify-content: space-between;
		padding: 0.35rem 1rem 0 1rem;
		gap: 0.75rem;
		flex-wrap: wrap;
		position: relative;
	}
	.readme-tabs {
		display: flex;
		gap: 1.25rem;
		align-items: center;
		overflow-x: auto;
		margin-bottom: -1px;
		position: relative;
	}
	.tab-link {
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		font-family: inherit;
		font-size: 0.8125rem;
		font-weight: 500;
		padding: 0.5rem 0.25rem 0.6rem 0.25rem;
		transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
		position: relative;
	}
	.tab-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-active-tab);
		border-radius: 2px;
		transform: scaleX(0);
		opacity: 0;
		transition:
			transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.3s ease;
	}
	.tab-link:hover {
		color: var(--color-text-primary);
	}
	.tab-link:hover::after {
		transform: scaleX(0.5);
		opacity: 0.5;
	}
	.tab-link.active {
		color: var(--color-text-primary);
		font-weight: 600;
	}
	.tab-link.active::after {
		transform: scaleX(1);
		opacity: 1;
	}
	.markdown-body {
		padding: 1.25rem;
		animation: fadeInTab 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes fadeInTab {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: -1px;
		align-self: center;
	}
	.action-icon-btn {
		background: transparent;
		border: none;
		border-radius: var(--border-radius);
		color: var(--color-text-secondary);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem 0.6rem;
		text-decoration: none;
		transition: all var(--transition-default);
		font-size: 0.8125rem;
		font-weight: 500;
		gap: 0.35rem;
	}
	.action-icon-btn:hover {
		background: var(--color-surface-translucent);
		color: var(--color-text-primary);
	}
	.action-icon-btn :global(svg) {
		display: block;
		flex-shrink: 0;
	}
	.btn-label {
		color: inherit;
		line-height: 1;
	}
	.markdown-body {
		padding: 1.25rem;
	}
	.markdown-h1,
	:global(.markdown-rendered h1) {
		color: var(--color-text-primary);
		font-size: 2rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.25;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 0.4rem;
	}
	.markdown-hash {
		color: var(--color-text-secondary);
		margin-right: 0.2rem;
		user-select: none;
	}
	.markdown-desc {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		line-height: 1.5;
		margin-bottom: 0.75rem;
	}
	.markdown-intro {
		color: var(--color-text-primary);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 1.25rem;
	}
	.readme-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.readme-badges img {
		height: 28px;
	}
	.markdown-tip {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 1.5rem;
	}
	.inline-badge {
		height: 20px;
		vertical-align: middle;
	}
	.readme-dynamic-section {
		margin-top: 2rem;
	}
	.item-desc {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		margin-left: 0.25rem;
	}
	.blankslate {
		align-items: center;
		border: 1px dashed var(--color-border);
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		justify-content: center;
		padding: 2rem 1rem;
		text-align: center;
		margin: 1rem 0;
	}
	:global(.blankslate-icon) {
		color: var(--color-text-secondary);
		margin-bottom: 0.5rem;
	}
	.blankslate-heading {
		color: var(--color-text-primary);
		font-size: 1.125rem;
		font-weight: 600;
	}
	.blankslate-text {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		max-width: 25rem;
	}
	.btn-clear {
		background: var(--color-surface-hover);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		color: var(--color-text-primary);
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 500;
		padding: 0.4rem 0.85rem;
		margin-top: 0.75rem;
		transition: var(--transition-default);
	}
	.btn-clear:hover {
		background: var(--color-border);
		border-color: var(--color-border-hover);
	}

	.doc-container {
		color: var(--color-text-primary);
	}
	.doc-h2,
	:global(.markdown-rendered h2) {
		color: var(--color-text-primary);
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.25;
		margin: 1.5rem 0 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 0.35rem;
	}
	:global(.markdown-rendered h3) {
		color: var(--color-text-primary);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1.25rem 0 0.5rem 0;
	}
	:global(.markdown-rendered h4) {
		color: var(--color-text-primary);
		font-size: 1rem;
		font-weight: 600;
		margin: 1rem 0 0.5rem 0;
	}
	:global(.markdown-rendered p) {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}
	.doc-list {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		line-height: 1.6;
		list-style-type: disc;
		margin-bottom: 1.5rem;
		padding-left: 1.75rem;
	}
	.doc-list li {
		margin-bottom: 0.5rem;
	}
	.item-desc {
		color: var(--color-text-secondary);
		margin-left: 0.35rem;
		font-style: italic;
	}

	:global(.markdown-rendered ul),
	:global(.markdown-rendered ol) {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.6;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}
	:global(.markdown-rendered li) {
		margin-bottom: 0.35rem;
	}
	:global(.markdown-rendered code) {
		background: var(--color-surface-translucent);
		border-radius: 4px;
		color: var(--color-text-primary);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		padding: 0.15rem 0.35rem;
	}
	:global(.markdown-rendered pre) {
		background: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: 0.75rem 1rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}
	:global(.markdown-rendered pre code) {
		background: none;
		padding: 0;
	}
	:global(.markdown-rendered a) {
		color: var(--color-link);
		text-decoration: underline;
		transition: color var(--transition-default);
	}
	:global(.markdown-rendered a:hover) {
		color: var(--color-link-hover);
	}
	.doc-p {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}
</style>
