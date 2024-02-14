<script>
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

	// JavaScript that converts a number to a shorter, human-readable format with suffixes 'k' (thousands), 'm' (millions), and 'b' (billions)
	const formatNumber = (num) => {
		// Check if the number is greater than or equal to 1 billion
		if (num >= 1e9) {
			return (num / 1e9).toFixed(1).replace(/\.0+$/, '') + 'B';
		}
		// Check if the number is greater than or equal to 1 million
		if (num >= 1e6) {
			return (num / 1e6).toFixed(1).replace(/\.0+$/, '') + 'M';
		}
		// Check if the number is greater than or equal to 1 thousand
		if (num >= 1e3) {
			return (num / 1e3).toFixed(1).replace(/\.0+$/, '') + 'K';
		}
		// Return the number rounded to zero decimal places
		return Number(num).toFixed(0);
	};

	// Run the following code after the component is updated
	afterUpdate(() => {
		setImageTranslateY();
	});
</script>

<a
	href={`https://github.com/${username}`}
	class="card"
	bind:this={cardRef}
	target="_blank"
	rel="noopener noreferrer"
>
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
		<span class="category">#{category}</span>
		<div class="details">
			<span class="username">
				@{username}
			</span>
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
</a>

<style>
	.card {
		display: block;
		height: auto;
		overflow: hidden;
		background: var(--color-foreground);
		border: var(--border-size) solid transparent;
		border-radius: 0.5rem;
		user-select: none;
	}
	.card .image-container {
		background-color: white;
		overflow: hidden;
		aspect-ratio: 16 / 9;
	}
	.card .image-container img {
		transition: transform 1.75s;
		user-select: none;
		width: 100%;
	}
	.card .image-container:hover img {
		transform: translateY(var(--image-translateY));
		transition-delay: var(--transition-default);
		transition-timing-function: ease-in-out;
	}
	.card .footer {
		padding: 0.75rem 1rem;
	}
	.card .footer .category {
		display: block;
		font-size: 0.875rem;
		color: var(--color-on-background);
	}
	.card .footer .details {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0.375rem 0;
	}
	.card .footer .username {
		color: var(--color-on-foreground);
		font-size: 1.1rem;
		font-weight: 500;
		line-height: 1.5rem;
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
		display: flex;
		align-items: center;
		justify-content: center;
		column-gap: 0.25rem;
		fill: var(--color-primary-hover);
		color: var(--color-primary-hover);
		font-size: 0.75rem;
		font-weight: 600;
	}
	.card .footer .star svg {
		height: 1rem;
	}
</style>
