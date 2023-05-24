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
	<a href="#" class="back-to-top-container" transition:fly={{ y: 50, duration: 300 }}>
		<div class="back-to-top">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<title>Up arrow</title>
				<path
					d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
				/>
			</svg>
		</div>
	</a>
{/if}

<style>
	.back-to-top-container {
		bottom: 1rem;
		position: fixed;
		right: 1rem;
		text-decoration: none;
		user-select: none;
		z-index: 1;
	}
	.back-to-top {
		background-color: var(--color-foreground);
		border: var(--border-size) solid var(--color-gray);
		border-radius: var(--border-radius);
		color: var(--color-on-foreground);
		cursor: pointer;
		display: grid;
		font-size: 1.5rem;
		height: 2.75rem;
		place-content: center;
		transition: visibility var(--transition-slower);
		width: 2.75rem;
	}
	.back-to-top:hover {
		border-color: var(--color-primary-hover);
	}
	.back-to-top svg {
		fill: var(--color-on-background);
		height: 0.75rem;
		width: 0.75rem;
	}
	.back-to-top:hover svg {
		fill: var(--color-primary-hover);
	}
</style>
