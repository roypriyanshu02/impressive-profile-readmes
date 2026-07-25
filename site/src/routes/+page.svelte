<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import CardSection from '$lib/components/CardSection.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { Pencil16, Tasklist16, Search16, RepoForked16 } from 'svelte-octicons';
	import type { PageData } from './$types';

	const screenshots = import.meta.glob('$lib/screenshots/*.webp', {
		eager: true,
		import: 'default'
	});

	const screenshotMap = new Map<string, any>();
	for (const path in screenshots) {
		const match = path.match(/\/([^/]+)\.webp$/);
		if (match) {
			screenshotMap.set(match[1].toLowerCase(), screenshots[path]);
		}
	}

	export let data: PageData;

	let selectedCategory = 'All';
	let searchQuery = '';
	let activeTab: 'readme' | 'contributing' | 'license' = 'readme';

	$: categoryMap = (() => {
		const map = new Map<string, typeof data.profiles>();
		data.profiles.forEach((profile) => {
			if (!map.has(profile.category)) {
				map.set(profile.category, []);
			}
			map.get(profile.category)!.push(profile);
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

	const updateFilteredData = (category: string) => {
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
				MIT license
			</button>
		</nav>

		<div class="header-actions">
			{#if activeTab === 'readme'}
				<a
					href="https://github.com/roypriyanshu02/impressive-profile-readmes/edit/main/README.md"
					target="_blank"
					rel="noopener noreferrer"
					class="action-icon-btn edit-btn-with-label"
					title="Add Profile / Edit README.md on GitHub"
				>
					<Pencil16 width={14} height={14} class="btn-icon-align" />
					<span class="btn-label">Add Profile</span>
				</a>
				<!-- Category Selector Button and Dropdown -->
				<FilterBar
					filterItems={data.categories}
					selectedFilter={selectedCategory}
					bind:searchQuery
					updateFilteredDataCallback={updateFilteredData}
				/>
			{:else if activeTab === 'contributing'}
				<a
					href="https://github.com/roypriyanshu02/impressive-profile-readmes/edit/main/CONTRIBUTING.md"
					target="_blank"
					rel="noopener noreferrer"
					class="action-icon-btn edit-btn-with-label"
					title="Edit CONTRIBUTING.md on GitHub"
				>
					<Pencil16 width={14} height={14} class="btn-icon-align" />
					<span class="btn-label">Edit Contributing</span>
				</a>
				<a
					href="https://github.com/roypriyanshu02/impressive-profile-readmes/fork"
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
				<span class="markdown-hash">#</span> Impressive Profile READMEs
			</h1>
			<p class="markdown-desc">
				Get inspired to make your GitHub Profile stand out! Explore our gallery of community-curated Profile READMEs.
			</p>

			{#if filteredProfiles.length > 0}
				<CardSection>
					{#each filteredProfiles as profile (profile.username)}
						<Card
							screenshot={screenshotMap.get(profile.username.toLowerCase())}
							username={profile.username}
							category={profile.category}
							starCount={profile.starCount}
						/>
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
		{:else if activeTab === 'contributing'}
			<div class="doc-container">
				<h1 class="markdown-h1">
					<span class="markdown-hash">#</span> Contributing Guidelines 🗒️
				</h1>
				<p class="markdown-desc">
					Hi! We're really excited that you're interested in contributing to our project! Before submitting your contribution, please take a moment to read through the guidelines below:
				</p>

				<section class="doc-section">
					<h2 class="doc-h2"><span class="markdown-hash">##</span> Pull Request Guidelines 🔧</h2>
					<p class="doc-p">If you're interested in making changes, follow the steps below before submitting a pull request:</p>

					<h3 class="doc-h3"><span class="markdown-hash">###</span> To Add, Remove, or Update GitHub Profile READMEs 📊</h3>
					<ol class="doc-list">
						<li>Fork this repository on GitHub.</li>
						<li>Clone your new repository to your system.</li>
						<li>Add, remove, or update your profile entry in <code>README.md</code> in alphabetical order under the correct category heading.</li>
						<li>Commit changes and push to your fork repository using: <code>[Add/Remove/Update] [username] profile</code>.</li>
						<li>Open and submit a pull request.</li>
					</ol>

					<h3 class="doc-h3"><span class="markdown-hash">###</span> To Fix a Bug, Add an Improvement, or New Feature 🐛🛠️🚀</h3>
					<ol class="doc-list">
						<li>Fork this repository and clone it locally.</li>
						<li>Make your changes and verify functionality.</li>
						<li>Commit with a descriptive message and submit a pull request.</li>
					</ol>
				</section>
			</div>
		{:else if activeTab === 'license'}
			<div class="doc-container">
				<h1 class="markdown-h1">
					<span class="markdown-hash">#</span> MIT License
				</h1>
				<pre class="license-block">MIT License

Copyright (c) 2023-present Priyanshu Roy and Rakesh Chowdhury

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
			</div>
		{/if}
	</article>
</div>

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
	}
	.tab-link {
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		font-family: inherit;
		font-size: 0.8125rem;
		font-weight: 500;
		padding: 0.5rem 0.25rem 0.6rem 0.25rem;
		transition: color var(--transition-default);
		white-space: nowrap;
	}
	.tab-link:hover {
		color: var(--color-text-primary);
	}
	.tab-link.active {
		border-bottom-color: var(--color-active-tab);
		color: var(--color-text-primary);
		font-weight: 600;
	}
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-bottom: 0.4rem;
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
		padding: 0.35rem;
		text-decoration: none;
		transition: all var(--transition-default);
		line-height: 1;
	}
	.action-icon-btn:hover {
		background: rgba(110, 118, 129, 0.15);
		color: var(--color-text-primary);
	}
	:global(.btn-icon-align) {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
	}
	.edit-btn-with-label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.35rem 0.5rem;
		line-height: 1;
	}
	.btn-label {
		display: inline-flex;
		align-items: center;
		font-size: 0.8125rem;
		font-weight: 500;
		color: inherit;
		line-height: 1;
	}
	.markdown-body {
		padding: 1.25rem;
	}
	.markdown-h1 {
		color: var(--color-text-primary);
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.25;
		margin-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 0.35rem;
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
		margin-bottom: 1.25rem;
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
	.doc-section {
		margin-top: 1.5rem;
	}
	.doc-h2 {
		color: var(--color-text-primary);
		font-size: 1.15rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 0.25rem;
	}
	.doc-h3 {
		color: var(--color-text-primary);
		font-size: 1rem;
		font-weight: 600;
		margin: 1rem 0 0.5rem 0;
	}
	.doc-p {
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}
	.doc-list {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.6;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}
	.doc-list li {
		margin-bottom: 0.35rem;
	}
	.doc-list code {
		background: rgba(110, 118, 129, 0.15);
		border-radius: 4px;
		color: var(--color-text-primary);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		padding: 0.15rem 0.35rem;
	}
	.license-block {
		background: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		color: var(--color-text-primary);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
		padding: 1.25rem;
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>


<svelte:head>
	<meta name="theme-color" content="var(--color-background)" />
	<title>Impressive Profile READMEs</title>
	<meta
		name="description"
		content="Get inspired to make your GitHub Profile stand out! Check out our gallery of Impressive Profile READMEs and take your profile to the next level."
	/>
	<link rel="canonical" href="https://roypriyanshu02.github.io/impressive-profile-readmes/" />
	<meta name="author" content="Contributors" />
	<meta name="robots" content="index, follow" />
	<!-- Meta Tags For Open Graph / Facebook -->
	<meta property="og:type" content="Website" />
	<meta property="og:title" content="Impressive Profile READMEs" />
	<meta
		property="og:description"
		content="Get inspired to make your GitHub Profile stand out! Check out our gallery of Impressive Profile READMEs and take your profile to the next level."
	/>
	<meta property="og:url" content="https://roypriyanshu02.github.io/impressive-profile-readmes/" />
	<meta
		property="og:image"
		content="https://roypriyanshu02.github.io/impressive-profile-readmes/meta.webp"
	/>
	<!-- Meta Tags For Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Impressive Profile READMEs" />
	<meta
		name="twitter:description"
		content="Get inspired to make your GitHub Profile stand out! Check out our gallery of Impressive Profile READMEs and take your profile to the next level."
	/>
	<meta
		name="twitter:image"
		content="https://roypriyanshu02.github.io/impressive-profile-readmes/meta.webp"
	/>
</svelte:head>
