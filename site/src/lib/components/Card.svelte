<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { File16, Star16 } from 'svelte-octicons';

	export let screenshot: any;
	export let username: string;
	export let category: string;
	export let starCount: number;

	let cardRef: HTMLAnchorElement;
	let cardFooterRef: HTMLDivElement;
	let imageRef: HTMLImageElement;

	const setImageTranslateY = () => {
		if (!cardRef || !cardFooterRef || !imageRef) return;

		const totalCardHeight = cardRef.offsetHeight;
		const cardFooterHeight = cardFooterRef.offsetHeight;
		const imageHeight = imageRef.height;
		const calc = totalCardHeight - cardFooterHeight - imageHeight;

		if (calc < -20) {
			imageRef.style.setProperty('--image-translateY', `${calc}px`);
		} else {
			imageRef.style.setProperty('--image-translateY', `0px`);
		}
	};

	const handleImageLoad = () => {
		setImageTranslateY();
	};

	const formatNumber = (num: number) => {
		if (num >= 1e9) {
			return (num / 1e9).toFixed(1).replace(/\.0+$/, '') + 'B';
		}
		if (num >= 1e6) {
			return (num / 1e6).toFixed(1).replace(/\.0+$/, '') + 'M';
		}
		if (num >= 1e3) {
			return (num / 1e3).toFixed(1).replace(/\.0+$/, '') + 'K';
		}
		return Number(num).toFixed(0);
	};

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
	<div class="card-file-header">
		<File16 width={14} height={14} class="file-icon" />
		<span class="file-name"><span class="user-prefix">{username}</span> / README.md</span>
	</div>

	<div class="image-container">
		{#if screenshot}
			<enhanced:img
				src={screenshot}
				loading="lazy"
				alt={`${username}'s Github profile screenshot`}
				role="presentation"
				bind:this={imageRef}
				on:load={handleImageLoad}
				on:contextmenu|preventDefault
			/>
		{:else}
			<div class="placeholder-img">
				<span>@{username}</span>
			</div>
		{/if}
	</div>
	<div class="footer" bind:this={cardFooterRef}>
		<div class="top-row">
			<span class="topic-pill">#{category}</span>
			<div class="star-badge">
				<Star16 width={14} height={14} class="star-icon" />
				<span>{formatNumber(starCount)}</span>
			</div>
		</div>
	</div>
</a>

<style>
	.card {
		background: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: border-color var(--transition-default);
		user-select: none;
		text-decoration: none;
		height: 100%;
	}
	.card:hover {
		border-color: var(--color-border-hover);
		text-decoration: none;
	}
	.card-file-header {
		align-items: center;
		background: rgba(110, 118, 129, 0.1);
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		display: flex;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		gap: 0.375rem;
		padding: 0.4rem 0.75rem;
	}
	:global(.file-icon) {
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}
	.file-name {
		color: var(--color-text-primary);
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.user-prefix {
		color: var(--color-link);
		font-weight: 600;
	}
	.card:hover .user-prefix {
		text-decoration: underline;
	}
	.image-container {
		aspect-ratio: 16 / 10;
		background-color: var(--color-background);
		overflow: hidden;
		position: relative;
		border-bottom: 1px solid var(--color-border);
	}
	.image-container :global(img) {
		display: block;
		transition: transform 1.2s ease-in-out;
		user-select: none;
		width: 100%;
	}
	.card:hover .image-container :global(img) {
		transform: translateY(var(--image-translateY));
		transition-delay: 0.1s;
	}
	.placeholder-img {
		align-items: center;
		color: var(--color-text-secondary);
		display: flex;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		height: 100%;
		justify-content: center;
	}
	.footer {
		display: flex;
		flex-direction: column;
		padding: 0.6rem 0.75rem;
		background: var(--color-foreground);
	}
	.top-row {
		align-items: center;
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.topic-pill {
		background: var(--color-topic-bg);
		border: 1px solid var(--color-topic-border);
		border-radius: var(--border-radius-pill);
		color: var(--color-topic-text);
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.1rem 0.5rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 75%;
	}
	.star-badge {
		align-items: center;
		color: var(--color-text-secondary);
		display: flex;
		font-size: 0.75rem;
		font-weight: 500;
		gap: 0.25rem;
	}
	:global(.star-icon) {
		color: var(--color-star);
	}
</style>



