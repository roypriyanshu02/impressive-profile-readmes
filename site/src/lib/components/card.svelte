<script>
	import { formatNumber } from '$lib/utility/ui-utils.js';
	import { afterUpdate } from 'svelte';

	// Export the props
	export let screenshot, username, category, starCount;

	// Destructure properties from $$props
	let { cardRef, cardFooterRef, imageRef } = $$props;

	// Keep track of the number of images that are still loading
	let waiting = 0;

	// Calculate and set the --image-translateY CSS variable
	const setImageTranslateY = () => {
		// Calculate the height of the card, card footer, and image
		const totalCardHeight = cardRef.offsetHeight;
		const cardFooterHeight = cardFooterRef.offsetHeight;
		const imageHeight = imageRef.height;
		const calc = totalCardHeight - cardFooterHeight - imageHeight;

		imageRef.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		});

		// Set the --image-translateY CSS variable to position the image
		if (calc < -20) {
			imageRef.style.setProperty('--image-translateY', `${calc}px`);
		} else {
			imageRef.style.setProperty('--image-translateY', `0px`);
		}
	};

	// Run the following code when the image finishes loading
	const handleImageLoad = (el) => {
		waiting++;
		el.addEventListener(
			'load',
			() => {
				waiting--;
				if (waiting === 0) {
					setImageTranslateY();
				}
			},
			{ once: true }
		);
	};

	// Run the following code after the component is updated
	afterUpdate(() => {
		setImageTranslateY();
	});
</script>

<div class="card" bind:this={cardRef}>
	<div class="image-container">
		<img
			src={screenshot}
			loading="lazy"
			alt={`${username}'s Github profile screenshot`}
			bind:this={imageRef}
			use:handleImageLoad
		/>
	</div>
	<div class="footer" bind:this={cardFooterRef}>
		<span class="category">{category}</span>
		<div class="details">
			<a class="username" href={`https://github.com/${username}`}>
				{username}
			</a>
			<div class="star">
				<svg role="img" viewBox="0 0 576 512">
					<path
						d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
					/>
				</svg>
				{formatNumber(starCount)}
			</div>
		</div>
	</div>
</div>

<style>
	.card {
		background: var(--color-foreground);
		border: var(--border-size) solid var(--color-foreground);
		border-radius: 0.5rem;
		height: auto;
		overflow: hidden;
		user-select: none;
		width: 100%;
	}
	.card .image-container {
		background-size: contain;
		background-color: white;
		height: 12.5rem;
		object-fit: cover;
		overflow: hidden;
		width: 100%;
	}
	@media (max-width: 480px) {
		.card .image-container {
			height: 12rem;
		}
	}
	.card .image-container img {
		transition: transform 1.75s;
		width: 100%;
		user-select: none;
	}
	.card .image-container:hover img {
		transform: translateY(var(--image-translateY));
		transition-delay: var(--transition-default);
		transition-timing-function: ease-in-out;
	}
	.card .footer {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 0.75rem 1rem;
	}
	.card .footer .category {
		color: var(--color-on-background);
		font-size: 0.875rem;
		width: 100%;
	}
	.card .footer .details {
		align-items: center;
		display: flex;
		flex: auto;
		height: auto;
		justify-content: space-between;
		padding: 0.375rem 0;
		width: 100%;
	}
	.card .footer .username {
		color: var(--color-on-foreground);
		font-size: 1rem;
		font-weight: 500;
		height: auto;
		line-height: 1.5rem;
		width: 75%;
		word-wrap: break-word;
	}
	.card:hover .footer .username {
		color: var(--color-primary-hover);
	}
	.card:hover {
		background: var(--color-white);
		border-color: var(--color-primary-hover);
	}
	.card .footer .star {
		align-items: center;
		color: var(--color-primary-hover);
		column-gap: 0.25rem;
		display: flex;
		fill: var(--color-primary-hover);
		flex-direction: row;
		font-size: 0.75rem;
		font-weight: 600;
		justify-content: center;
	}
	.card .footer .star svg {
		height: 1rem;
	}
</style>
