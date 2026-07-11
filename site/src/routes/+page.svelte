<script lang="ts">
	import FilterBar from '$lib/components/FilterBar.svelte';
	import CardSection from '$lib/components/CardSection.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { PageData } from './$types';

	// Load all screenshots dynamically using Vite's glob import
	const rawScreenshots = import.meta.glob('$lib/screenshots/*.webp', {
		query: { enhanced: true, quality: '60' },
		import: 'default',
		eager: true
	});

	// Normalize keys: maps lowercase username to the enhanced image object
	const screenshotMap = new Map<string, any>();
	for (const [path, img] of Object.entries(rawScreenshots)) {
		const match = path.match(/\/([^/]+)\.webp$/);
		if (match) {
			screenshotMap.set(match[1].toLowerCase(), img);
		}
	}

	export let data: PageData;

	let selectedCategory = 'All';

	// Compute categoryMap reactively
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

	// Filter and sort profiles reactively
	$: filteredProfiles = (() => {
		if (selectedCategory === 'All') {
			return data.profiles;
		} else if (selectedCategory === 'Most starred') {
			return [...data.profiles].sort((a, b) => b.starCount - a.starCount);
		} else {
			return categoryMap.get(selectedCategory) || [];
		}
	})();

	const updateFilteredData = (category: string) => {
		selectedCategory = category;
	};
</script>

<FilterBar
	filterItems={data.categories}
	selectedFilter={selectedCategory}
	totalCardsCount={filteredProfiles.length}
	updateFilteredDataCallback={updateFilteredData}
/>

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
