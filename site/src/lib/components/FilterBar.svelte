<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Search16, Tasklist16, ChevronDown16, X16 } from 'svelte-octicons';

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
		class="action-icon-btn category-btn"
		class:active={isDropdownVisible}
		on:click={toggleDropdown}
		aria-expanded={isDropdownVisible}
		title="Categories & Search"
	>
		<Tasklist16 width={14} height={14} />
		<span class="selected-badge">{selectedFilter}</span>
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
		display: inline-block;
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
		gap: 0.35rem;
		text-decoration: none;
		transition: all var(--transition-default);
	}
	.action-icon-btn:hover,
	.action-icon-btn.active {
		background: rgba(110, 118, 129, 0.15);
		color: var(--color-text-primary);
	}
	.selected-badge {
		background: var(--color-topic-bg);
		color: var(--color-topic-text);
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 0.05rem 0.45rem;
		border-radius: 2em;
	}
	.category-dropdown-popover {
		background: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-card);
		min-width: 16rem;
		padding: 0.5rem;
		position: absolute;
		top: calc(100% + 0.4rem);
		right: 0;
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
	}
	.dropdown-search-box:focus-within {
		border-color: var(--color-link);
		box-shadow: 0 0 0 2px rgba(47, 129, 247, 0.3);
	}
	:global(.search-icon) {
		color: var(--color-text-secondary);
		flex-shrink: 0;
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
	}
	.clear-btn:hover {
		color: var(--color-text-primary);
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
		transition: var(--transition-default);
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
		background: rgba(110, 118, 129, 0.2);
		border-radius: 10px;
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		padding: 0.1rem 0.45rem;
	}
</style>


