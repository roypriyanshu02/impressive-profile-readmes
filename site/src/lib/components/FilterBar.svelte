<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Search16 from './icons/Search16.svelte';
	import X16 from './icons/X16.svelte';

	export let filterItems;
	export let selectedFilter;
	export let searchQuery = '';
	export let updateFilteredDataCallback;

	let isDropdownVisible = false;
	let wrapperRef;
	let searchInputRef;

	let handleFilterClick = (newSelectedFilter) => {
		isDropdownVisible = false;
		if (newSelectedFilter === selectedFilter) {
			return;
		}
		selectedFilter = newSelectedFilter;
		updateFilteredDataCallback(newSelectedFilter);
	};

	const toggleDropdown = () => {
		isDropdownVisible = !isDropdownVisible;
		if (isDropdownVisible) {
			setTimeout(() => searchInputRef?.focus(), 50);
		}
	};

	onMount(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') isDropdownVisible = false;
			if (
				e.key === '/' &&
				document.activeElement?.tagName !== 'INPUT' &&
				document.activeElement?.tagName !== 'TEXTAREA'
			) {
				e.preventDefault();
				if (!isDropdownVisible) isDropdownVisible = true;
				setTimeout(() => searchInputRef?.focus(), 50);
			}
		};
		const handleClickOutside = (e) => {
			if (wrapperRef && !wrapperRef.contains(e.target)) {
				isDropdownVisible = false;
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('click', handleClickOutside);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="dropdown-wrapper" bind:this={wrapperRef}>
	<button
		class="categories-h2-btn"
		class:active={isDropdownVisible}
		on:click={toggleDropdown}
		aria-expanded={isDropdownVisible}
		title="Click to select category or search"
	>
		<span class="markdown-hash">##</span>
		<span class="heading-text">Categories</span>
		<span class="category-separator">-</span>
		<span class="selected-category-name">{selectedFilter}</span>
	</button>

	{#if isDropdownVisible}
		<div class="category-dropdown-popover" transition:fly={{ y: -6, duration: 120 }}>
			<!-- Live Search Field Inside Category Dropdown -->
			<div class="dropdown-search-box">
				<Search16 width={14} height={14} class="search-icon" />
				<input
					type="text"
					bind:value={searchQuery}
					bind:this={searchInputRef}
					placeholder="Filter profiles..."
					class="dropdown-search-input"
					aria-label="Filter profiles"
				/>
				{#if searchQuery}
					<button class="clear-btn" on:click={() => (searchQuery = '')} aria-label="Clear search">
						<X16 width={14} height={14} class="clear-svg" />
					</button>
				{/if}
			</div>

			<ul class="filter-list">
				{#each filterItems as item (item.categoryTitle)}
					<li>
						<a
							href={`#${item.categoryTitle.replace(/\s+/g, '-').toLowerCase()}`}
							class="filter-item"
							class:active={selectedFilter === item.categoryTitle}
							on:click|preventDefault={() => handleFilterClick(item.categoryTitle)}
						>
							<span class="item-title">{item.categoryTitle}</span>
							<span class="item-count">{item.totalProfileCount}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.dropdown-wrapper {
		position: relative;
		display: block;
		width: 100%;
		margin-top: 1.5rem;
		margin-bottom: 1.25rem;
	}
	.categories-h2-btn {
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-primary);
		cursor: pointer;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0 0 0.35rem 0;
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		font-family: inherit;
		text-align: left;
		gap: 0.5rem;
	}
	.markdown-hash {
		color: var(--color-text-secondary);
		user-select: none;
		font-weight: 600;
	}
	.heading-text {
		color: var(--color-text-primary);
		font-weight: 600;
	}
	.category-separator {
		color: var(--color-text-secondary);
		font-weight: 400;
		user-select: none;
	}
	.selected-category-name {
		color: var(--color-text-secondary);
		font-weight: 500;
		font-size: 1.05rem;
		transition: color 0.25s ease;
	}
	.categories-h2-btn:hover .selected-category-name {
		color: var(--color-text-primary);
	}
	.category-dropdown-popover {
		background: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		min-width: 16rem;
		padding: 0.5rem;
		position: absolute;
		top: calc(100% + 0.4rem);
		left: 0;
		z-index: 100;
	}
	.dropdown-search-box {
		align-items: center;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		display: flex;
		gap: 0.35rem;
		padding: 0.35rem 0.5rem;
		margin-bottom: 0.5rem;
		transition: border-color 0.2s ease;
	}
	.dropdown-search-box:focus-within {
		border-color: var(--color-link);
	}

	:global(.search-icon) {
		color: var(--color-text-secondary);
		flex-shrink: 0;
		transition: color 0.2s ease;
	}
	.dropdown-search-box:focus-within :global(.search-icon) {
		color: var(--color-link);
	}
	.dropdown-search-input {
		background: transparent;
		border: none;
		color: var(--color-text-primary);
		font-size: 0.8125rem;
		outline: none;
		width: 100%;
	}
	.dropdown-search-input::placeholder {
		color: var(--color-text-secondary);
	}
	.clear-btn {
		align-items: center;
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		justify-content: center;
		padding: 0 0.2rem;
		transition:
			color 0.2s ease,
			transform 0.2s ease;
	}
	.clear-btn:hover {
		color: var(--color-text-primary);
		transform: scale(1.1);
	}
	:global(.clear-svg) {
		fill: currentColor;
	}
	.filter-list {
		list-style: none;
		max-height: 16rem;
		overflow-y: auto;
		padding: 0;
		margin: 0;
	}
	.filter-item {
		align-items: center;
		border-radius: var(--border-radius);
		color: var(--color-text-primary);
		display: flex;
		font-size: 0.8125rem;
		justify-content: space-between;
		padding: 0.4rem 0.65rem;
		text-decoration: none;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}
	.filter-item:hover {
		background: var(--color-surface-hover);
		color: var(--color-link);
		text-decoration: none;
	}
	.filter-item.active {
		background: var(--color-topic-bg);
		color: var(--color-topic-text);
		font-weight: 600;
	}
	.item-count {
		background: var(--color-surface-translucent);
		border-radius: 10px;
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		padding: 0.1rem 0.45rem;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}
	.filter-item:hover .item-count {
		background: var(--color-topic-bg);
		color: var(--color-link);
	}
</style>
