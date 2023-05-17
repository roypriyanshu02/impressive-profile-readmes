<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	// A variable to store the visibility state
	let visibility = false;

	// Call onMount to run this code when the component is mounted
	onMount(() => {
		// Listen for the 'scroll' event on the window
		window.addEventListener('scroll', () => {
			// Get the current scroll position
			let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

			// Get the total height of the document
			let totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

			// Get the height of the viewport
			let viewportHeight = document.documentElement.clientHeight || window.innerHeight;

			// Calculate the distance from the bottom of the viewport to the bottom of the document
			let distanceToBottom = totalHeight - (currentScroll + viewportHeight);

			// Check if the distance to the bottom is less than 90 pixels
			if (distanceToBottom < 80) {
				visibility = false;
			} else {
				// Set the visibility state based on the current scroll position
				visibility = currentScroll > 250;
			}
		});
	});
</script>

{#if visibility}
	<!-- svelte-ignore a11y-invalid-attribute -->
	<a href="#" class="back-to-top" transition:fly={{ y: 150, duration: 300 }}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
			<title>Up arrow</title>
			<path
				d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
			/>
		</svg>
	</a>
{/if}

<style>
	.back-to-top {
		position: fixed;
		display: grid;
		place-content: center;
		height: 2.75rem;
		width: 2.75rem;
		bottom: 2rem;
		right: 2rem;
		background-color: var(--color-foreground);
		border: var(--border-size) solid var(--color-gray);
		border-radius: 0.5rem;
		user-select: none;
		cursor: pointer;
		z-index: 5;
	}
	.back-to-top svg {
		height: 0.75rem;
		width: 0.75rem;
		fill: var(--color-on-background);
	}
	.back-to-top:hover {
		border-color: var(--color-primary-hover);
	}
	.back-to-top:hover svg {
		fill: var(--color-primary-hover);
	}
</style>
