<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import ArrowUp16 from './icons/ArrowUp16.svelte';

	let visibility = false;

	onMount(() => {
		const handleScroll = () => {
			const currentScroll = window.scrollY;
			const totalHeight = document.documentElement.scrollHeight;
			const viewportHeight = window.innerHeight;
			const distanceToBottom = totalHeight - (currentScroll + viewportHeight);

			if (distanceToBottom < 60) {
				visibility = false;
			} else {
				visibility = currentScroll > 250;
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

{#if visibility}
	<button
		class="back-to-top-btn"
		transition:fly={{ y: 15, duration: 250 }}
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
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		height: 2.5rem;
		justify-content: center;
		position: fixed;
		right: 1.25rem;
		transition: all var(--transition-default);
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
