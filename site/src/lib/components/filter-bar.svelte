<script>
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
</script>

<section class="filter-bar">
	<ul class="filter-list">
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
</section>

<style>
	.filter-bar {
		position: sticky;
		top: 0;
		display: block;
		align-items: center;
		margin-bottom: 1rem;
		background-color: var(--color-background);
		z-index: 10;
	}
	.filter-list {
		display: flex;
		list-style-type: none;
		margin-top: 0.5rem;
		padding: 0.5rem 0.5rem 0;
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
		border-bottom: 2px solid rgba(000, 000, 0, 0.1);
		font-size: 1rem;
		font-weight: 600;
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
</style>
