<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { ArrowUp16 } from 'svelte-octicons';

	let visibility = false;

	onMount(() => {
		const handleScroll = () => {
			let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
			let totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			let viewportHeight = document.documentElement.clientHeight || window.innerHeight;
			let distanceToBottom = totalHeight - (currentScroll + viewportHeight);

			if (distanceToBottom < 60) {
				visibility = false;
			} else {
				visibility = currentScroll > 250;
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

{#if visibility}
	<button
		class="back-to-top-btn"
		transition:fly={{ y: 15, duration: 150 }}
		on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
		aria-label="Scroll back to top of page"
		title="Scroll to top"
	>
		<ArrowUp16 width={16} height={16} class="arrow-icon" />
	</button>
{/if}

<style>
	.back-to-top-btn {
		align-items: center;
		background: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		bottom: 1.25rem;
		box-shadow: var(--shadow-card);
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		height: 2.5rem;
		justify-content: center;
		position: fixed;
		right: 1.25rem;
		transition: var(--transition-default);
		width: 2.5rem;
		z-index: 99;
	}
	.back-to-top-btn:hover {
		background: var(--color-surface-hover);
		border-color: var(--color-border-hover);
		color: var(--color-text-primary);
	}
	:global(.arrow-icon) {
		fill: currentColor;
	}
</style>


