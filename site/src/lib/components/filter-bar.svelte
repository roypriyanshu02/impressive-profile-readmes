<script>
	import { onMount } from 'svelte';

	// Export component props
	export let filterItems;
	export let selectedFilter;
	export let updateFilteredDataCallback;

	// Define click event handler
	let handleFilterClick = (newSelectedFilter) => {
		if (newSelectedFilter === selectedFilter) {
			return;
		}
		selectedFilter = newSelectedFilter;
		updateFilteredDataCallback(newSelectedFilter);
	};

	// Arrow btns: filterBar scroll function
	let filterBar, isArrowVisible;
	let scroll = (move) => {
		let scrollDistance = (document.documentElement.clientWidth || window.innerWidth) / 3; // Calculate the scroll distance
		if (move === 'left') filterBar.scrollLeft -= scrollDistance;
		if (move === 'right') filterBar.scrollLeft += scrollDistance;
	};

	onMount(() => {
		function checkWindow() {
			// Get width of the window
			isArrowVisible = document.documentElement.clientWidth >= 480 ? true : false;
		}

		// Attaching the event listener function to window's resize event
		window.addEventListener('resize', checkWindow);

		// Check window for the first time
		checkWindow();
	});
</script>

<section class="filter-bar">
	{#if isArrowVisible}
		<button on:click={() => scroll('left')}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
				><path
					d="M4.83594 12.0001L11.043 18.2072L12.4573 16.793L7.66436 12.0001L12.4573 7.20718L11.043 5.79297L4.83594 12.0001ZM10.4858 12.0001L16.6929 18.2072L18.1072 16.793L13.3143 12.0001L18.1072 7.20718L16.6929 5.79297L10.4858 12.0001Z"
				/></svg
			>
		</button>
	{/if}
	<ul class="filter-list" bind:this={filterBar}>
		{#each filterItems as item}
			<li>
				<a
					href={`#${item.categoryTitle.replace(/\s+/g, '-').toLowerCase()}`}
					class="filter-item {selectedFilter === item.categoryTitle ? 'active' : ''}"
					on:click|preventDefault={handleFilterClick(item.categoryTitle)}
				>
					{item.categoryTitle}
					<span>
						{item.totalProfileCount}
					</span>
				</a>
			</li>
		{/each}
	</ul>
	{#if isArrowVisible}
		<button on:click={() => scroll('right')}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
				><path
					d="M19.1643 12.0001L12.9572 5.79297L11.543 7.20718L16.3359 12.0001L11.543 16.793L12.9572 18.2072L19.1643 12.0001ZM13.5144 12.0001L7.30728 5.79297L5.89307 7.20718L10.686 12.0001L5.89307 16.793L7.30728 18.2072L13.5144 12.0001Z"
				/></svg
			>
		</button>
	{/if}
</section>

<style>
	.filter-bar {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-top: 1rem;
		margin-bottom: 1rem;
		background-color: var(--color-background);
		z-index: 10;
	}
	.filter-list {
		position: relative;
		display: flex;
		list-style-type: none;
		overflow-y: hidden;
		scrollbar-width: none;
	}
	.filter-list::-webkit-scrollbar {
		display: none;
	}
	.filter-list .filter-item {
		position: relative;
		display: block;
		padding: 0.75rem 1.5rem;
		color: var(--color-on-foreground);
		border-bottom: 2px solid var(--color-gray);
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
	}
	@media (min-width: 480px) {
		.filter-list .filter-item:hover {
			color: var(--color-primary-hover);
			padding-right: 2rem;
			border-bottom: 2px solid var(--color-primary-hover);
		}
	}
	.filter-list .filter-item:active {
		color: var(--color-primary-hover); /* visible on small screen devices */
	}
	.filter-list .filter-item.active {
		color: var(--color-primary);
		padding-right: 2rem;
		border-bottom: 2px solid var(--color-primary);
	}
	.filter-list .filter-item.active:hover {
		pointer-events: none;
	}
	.filter-item span {
		display: none;
		margin-left: 0.25rem;
		color: var(--color-on-background);
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.filter-list .filter-item.active span {
		display: inline-block;
		position: absolute;
		top: 0.75rem;
	}
	.filter-bar button {
		all: unset;
	}
	.filter-bar svg {
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		fill: var(--color-on-foreground);
	}
</style>
