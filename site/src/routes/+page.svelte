<script>
	import { onMount } from 'svelte';
	import FilterBar from '$lib/components/filter-bar.svelte';
	import CardSection from '$lib/components/card-section.svelte';
	import IntersectionObserver from '$lib/components/intersection-observer.svelte';
	import Card from '$lib/components/card.svelte';

	export let data;

	let filteredData = {
		category: '',
		profiles: [],
		totalCount: 0
	};

	const updateFilteredData = (selectedCategory) => {
		filteredData.category = selectedCategory;
		if (selectedCategory == 'All') {
			filteredData.profiles = data.profiles.sort(() => Math.random() - 0.5);
		} else if (selectedCategory == 'Most starred') {
			filteredData.profiles = data.profiles.sort((a, b) => b.starCount - a.starCount);
		} else {
			filteredData.profiles = data.profiles.filter(
				(profile) => profile.category === selectedCategory
			);
		}
		filteredData.totalCount = filteredData.profiles.length;
	};

	onMount(() => {
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
	{#each filteredData.profiles as profile, index}
		<IntersectionObserver let:intersecting once>
			{#if intersecting}
				<Card
					screenshot={`./screenshots/${profile.username.toLowerCase()}.webp`}
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
