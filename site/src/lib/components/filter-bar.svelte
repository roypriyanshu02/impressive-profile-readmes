<script>
	import { fly } from 'svelte/transition';

	// Export the props
	export let filters = [];
	export let totalCards = 0;
	export let selectedFilter = filters[0] || '';

	// Define a flag to show or hide the filter
	let showFilter = false;
</script>

<section class="filter-bar">
	<div class="filter-container">
		<div class="dropdown-menu">
			<button
				class="filter-dropdown"
				class:active={showFilter}
				on:click={() => (showFilter = !showFilter)}
			>
				<span>{selectedFilter}</span>
				<svg role="img" viewBox="0 0 512 512">
					<path
						d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
					/>
				</svg>
			</button>
			{#if showFilter}
				<ul class="filter-list" transition:fly={{ y: -50, duration: 200 }}>
					{#each filters as option}
						<li
							class="filter-item"
							on:click={() => {
								selectedFilter = option;
								showFilter = false;
							}}
						>
							<span class="filter">{option}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
	<div class="total-result-container">
		Results
		<span class="total-cards-count">{totalCards}</span>
	</div>
</section>

<style>
	.filter-bar {
		align-items: center;
		background-color: var(--color-background);
		display: flex;
		justify-content: space-between;
		margin-bottom: 1.25rem;
		top: 0;
		z-index: 10;
	}

	.filter-container {
		align-items: center;
		display: flex;
	}

	.total-result-container {
		align-items: center;
		color: var(--color-on-background);
		display: flex;
		font-size: 0.75rem;
		font-weight: 500;
		gap: 0.5rem;
	}

	.total-cards-count {
		background-color: var(--color-foreground);
		border-radius: var(--border-radius);
		color: var(--color-on-foreground);
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.5rem 0.75rem;
		white-space: nowrap;
	}

	.filter-dropdown {
		align-items: center;
		background: var(--color-foreground);
		border: var(--border-size) solid var(--color-foreground);
		border-radius: var(--border-radius);
		color: var(--color-on-foreground);
		cursor: pointer;
		display: flex;
		font-size: 1rem;
		font-weight: 400;
		justify-content: space-between;
		min-width: 12rem;
		overflow: hidden;
		padding: 0.75rem 1.5rem;
		transition: background var(--transition-default);
		user-select: none;
	}

	.filter-dropdown:hover {
		background: var(--color-white);
		border-color: var(--color-primary-hover);
	}

	.filter-dropdown svg {
		fill: var(--color-on-foreground);
		height: 1rem;
		margin-left: 0.75rem;
		transition: transform var(--transition-default);
		width: 1rem;
	}

	.filter-dropdown.active,
	.filter-dropdown.active svg {
		border-color: var(--color-on-primary-hover);
		color: var(--color-gray);
		fill: var(--color-gray);
	}

	.filter-dropdown.active svg {
		transform: rotate(180deg);
	}

	.filter-list {
		background: var(--color-foreground);
		border: var(--border-size) solid var(--color-primary-hover);
		border-radius: var(--border-radius);
		margin-top: 0.5rem;
		min-width: 12rem;
		overflow: auto;
		padding: 0.5rem;
		position: absolute;
		z-index: 10;
	}

	.filter-list::-webkit-scrollsection {
		display: none;
	}

	.filter-list .filter-item {
		align-items: center;
		border-radius: var(--border-radius);
		cursor: pointer;
		display: flex;
		font-weight: 400;
		padding: 0.75rem 1rem;
		transition: background var(--transition-default);
	}

	.filter-list .filter-item:hover {
		background: var(--color-white);
		color: var(--color-primary-hover);
	}

	.filter-list .option .filter {
		color: var(--color-on-foreground);
		font-size: 1rem;
	}
</style>
