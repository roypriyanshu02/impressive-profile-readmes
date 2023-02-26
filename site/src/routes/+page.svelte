<script>
	import { onMount } from 'svelte';
	import FilterBar from '$lib/components/filter-bar.svelte';
	import CardSection from '$lib/components/card-section.svelte';
	import IntersectionObserver from '$lib/components/intersection-observer.svelte';
	import Card from '$lib/components/card.svelte';
	import fetchRepoStar from '$lib/utility/fetch-repo-stars.js';

	export let data;

	let filteredData = {
		category: '',
		profiles: [],
		totalCount: 0
	};

	const updateFilteredData = (selectedCategory) => {
		filteredData.category = selectedCategory;
		if (selectedCategory == 'All') {
			filteredData.profiles = data.profiles;
		} else {
			filteredData.profiles = data.profiles.filter(
				(profile) => profile.category === selectedCategory
			);
		}
		filteredData.totalCount = filteredData.profiles.length;
	};

	const fetchStarCount = async (username) => {
		const starCount = await fetchRepoStar(username);
		return starCount;
	};

	const onCardVisible = (profile, index) => {
		if ('starCount' in profile && profile.starCount !== null) {
			return;
		}
		fetchStarCount(profile.username).then((count) => {
			filteredData.profiles[index].starCount = count;
		});
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
					screenshot={`https://raw.githubusercontent.com/roypriyanshu02/impressive-profile-readmes/main/screenshots/${profile.username}.webp`}
					username={profile.username}
					category={profile.category}
					starCount={profile.starCount}
					loadStarCount={() => onCardVisible(profile, index)}
				/>
			{/if}
		</IntersectionObserver>
	{/each}
</CardSection>
