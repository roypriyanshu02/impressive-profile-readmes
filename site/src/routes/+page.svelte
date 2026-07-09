<script>
	import { onMount } from 'svelte';
	import FilterBar from '$lib/components/filter-bar.svelte';
	import CardSection from '$lib/components/card-section.svelte';
	import IntersectionObserver from '$lib/components/intersection-observer.svelte';
	import Card from '$lib/components/card.svelte';

	export let data;

	// Dynamically import all screenshots at compile-time using Vite glob & SvelteKit enhanced-img query
	const screenshots = import.meta.glob('../../../screenshots/*.webp', {
		eager: true,
		query: { enhanced: true }
	});

	let filteredData = {
		category: '',
		profiles: [],
		totalCount: 0
	};

	// Build category map for O(1) filtering
	let categoryMap = new Map();

	const updateFilteredData = (selectedCategory) => {
		filteredData.category = selectedCategory;

		if (selectedCategory === 'All') {
			// Create a copy and shuffle for randomness
			filteredData.profiles = [...data.profiles].sort(() => Math.random() - 0.5);
		} else if (selectedCategory === 'Most starred') {
			// Sort by star count (descending)
			filteredData.profiles = [...data.profiles].sort((a, b) => b.starCount - a.starCount);
		} else {
			// Use pre-computed category map for O(1) lookup
			filteredData.profiles = categoryMap.get(selectedCategory) || [];
		}

		filteredData.totalCount = filteredData.profiles.length;
	};

	onMount(() => {
		// Build category map once on mount
		data.profiles.forEach((profile) => {
			if (!categoryMap.has(profile.category)) {
				categoryMap.set(profile.category, []);
			}
			categoryMap.get(profile.category).push(profile);
		});

		updateFilteredData('All');
	});
</script>

<FilterBar
	filterItems={data.categories}
	selectedFilter={filteredData.category}
	totalCardsCount={filteredData.totalCount}
	updateFilteredDataCallback={updateFilteredData}
/>

<CardSection>
	{#each filteredData.profiles as profile (profile.username)}
		<IntersectionObserver let:intersecting once>
			{#if intersecting}
				<Card
					screenshot={screenshots[`../../../screenshots/${profile.username.toLowerCase()}.webp`]
						?.default}
					username={profile.username}
					category={profile.category}
					starCount={profile.starCount}
				/>
			{/if}
		</IntersectionObserver>
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
		content="Get inspired to make your GitHub profile stand out! Browse our collection of Impressive Profile READMEs and take your profile to the next level."
	/>
	<meta name="twitter:url" content="https://roypriyanshu02.github.io/impressive-profile-readmes/" />
	<meta
		name="twitter:image"
		content="https://roypriyanshu02.github.io/impressive-profile-readmes/meta.webp"
	/>
</svelte:head>
