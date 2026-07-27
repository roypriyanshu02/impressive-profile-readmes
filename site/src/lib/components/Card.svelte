<script>
	import File16 from './icons/File16.svelte';
	import Star16 from './icons/Star16.svelte';

	export let screenshot;
	export let username;
	export let category;
	export let starCount;

	const formatNumber = (num) => {
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
	let imgRef;
	let containerRef;
	let scrollDistance = 0;
	let canScroll = false;

	const calculateScroll = () => {
		if (imgRef && containerRef) {
			const imgHeight = imgRef.offsetHeight;
			const containerHeight = containerRef.offsetHeight;
			if (imgHeight > containerHeight + 20) {
				scrollDistance = imgHeight - containerHeight;
				canScroll = true;
			} else {
				canScroll = false;
				scrollDistance = 0;
			}
		}
	};
</script>

<a
	href={`https://github.com/${username}`}
	class="card"
	target="_blank"
	rel="noopener noreferrer"
	on:mouseenter={calculateScroll}
>
	<div class="card-file-header">
		<File16 width={14} height={14} class="file-icon" />
		<span class="file-name"><span class="user-prefix">{username}</span> / README.md</span>
	</div>

	<div class="image-container" bind:this={containerRef}>
		{#if screenshot}
			<img
				bind:this={imgRef}
				src={screenshot}
				loading="lazy"
				decoding="async"
				fetchpriority="low"
				width="640"
				height="400"
				alt={`${username}'s GitHub profile screenshot`}
				role="presentation"
				on:load={calculateScroll}
				on:contextmenu|preventDefault
				style={canScroll ? `--scroll-y: -${scrollDistance}px` : ''}
				class:is-scrollable={canScroll}
			/>
		{:else}
			<div class="placeholder-img">
				<span>@{username}</span>
			</div>
		{/if}
	</div>
	<div class="footer">
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
		background: var(--color-surface-translucent);
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		display: flex;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		gap: 0.375rem;
		padding: 0.4rem 0.75rem;
		transition: background-color var(--transition-default);
	}
	.card:hover .card-file-header {
		background: var(--color-surface-hover);
	}
	:global(.file-icon) {
		color: var(--color-text-secondary);
		flex-shrink: 0;
		transition: color var(--transition-default);
	}
	.card:hover :global(.file-icon) {
		color: var(--color-text-primary);
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
		transition: color var(--transition-default);
	}
	.card:hover .user-prefix {
		color: var(--color-link-hover);
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
		transition: transform 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
		user-select: none;
		width: 100%;
		height: auto;
		object-fit: cover;
		object-position: top;
	}
	.card:hover .image-container :global(img.is-scrollable) {
		transform: translateY(var(--scroll-y, 0px));
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
		transition: background-color var(--transition-default);
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
		transition:
			border-color var(--transition-default),
			background-color var(--transition-default);
	}
	.card:hover .topic-pill {
		border-color: var(--color-link);
	}
	.star-badge {
		align-items: center;
		color: var(--color-text-secondary);
		display: flex;
		font-size: 0.75rem;
		font-weight: 500;
		gap: 0.25rem;
		transition: color var(--transition-default);
	}
	.card:hover .star-badge {
		color: var(--color-text-primary);
	}
	:global(.star-icon) {
		color: var(--color-star);
		transition: transform var(--transition-default);
	}
</style>
