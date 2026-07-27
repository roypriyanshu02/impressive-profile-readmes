<script>
	import { onMount } from 'svelte';
	import Star16 from './icons/Star16.svelte';
	import Code16 from './icons/Code16.svelte';
	import IssueOpened16 from './icons/IssueOpened16.svelte';
	import GitPullRequest16 from './icons/GitPullRequest16.svelte';
	import GithubIcon from './GithubIcon.svelte';

	export let repoStats = {
		stars: 184,
		open_issues: 1,
		open_prs: 0,
		forks: 32
	};

	let prevScrollPos = 0;
	let header;

	onMount(() => {
		const headerHeight = header.offsetHeight;
		const handleScroll = () => {
			const currentScrollPos = window.scrollY;
			if (prevScrollPos > currentScrollPos || currentScrollPos < 50) {
				header.style.transform = 'translateY(0)';
			} else {
				header.style.transform = `translateY(-${headerHeight + 20}px)`;
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header class="github-header" bind:this={header}>
	<div class="header-main">
		<div class="repo-info">
			<GithubIcon width={16} height={16} class="octocat-icon" />
			<a
				href="https://github.com/roypriyanshu02"
				target="_blank"
				rel="noopener noreferrer"
				class="owner">roypriyanshu02</a
			>
			<span class="slash">/</span>
			<a
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme"
				target="_blank"
				rel="noopener noreferrer"
				class="repo-title">awesome-github-profile-readme</a
			>
			<span class="badge-public">Public</span>
		</div>

		<div class="repo-actions">
			<a
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-star"
			>
				<Star16 width={14} height={14} class="star-icon" />
				<span>Star</span>
				{#if repoStats.stars !== undefined}
					<span class="btn-count">{repoStats.stars}</span>
				{/if}
			</a>
		</div>
	</div>

	<nav class="repo-nav">
		<a href="/" class="nav-tab active" data-sveltekit-reload>
			<Code16 width={16} height={16} class="nav-icon" />
			<span>Code</span>
		</a>
		<a
			href="https://github.com/roypriyanshu02/awesome-github-profile-readme/issues"
			target="_blank"
			rel="noopener noreferrer"
			class="nav-tab"
		>
			<IssueOpened16 width={16} height={16} class="nav-icon" />
			<span>Issues</span>
			{#if repoStats.open_issues !== undefined}
				<span class="counter-badge">{repoStats.open_issues}</span>
			{/if}
		</a>
		<a
			href="https://github.com/roypriyanshu02/awesome-github-profile-readme/pulls"
			target="_blank"
			rel="noopener noreferrer"
			class="nav-tab"
		>
			<GitPullRequest16 width={16} height={16} class="nav-icon" />
			<span>Pull requests</span>
			{#if repoStats.open_prs !== undefined}
				<span class="counter-badge">{repoStats.open_prs}</span>
			{/if}
		</a>
	</nav>
</header>

<style>
	.github-header {
		background: var(--color-foreground);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		transition: transform var(--transition-default);
		width: 100%;
		margin-bottom: 1.5rem;
		z-index: 50;
	}
	.header-main {
		align-items: center;
		display: flex;
		justify-content: space-between;
		padding: 0.65rem 0.75rem 0.5rem 0.75rem;
		gap: 0.75rem;
		flex-wrap: wrap;
		max-width: 1536px;
		margin: 0 auto;
		min-height: 2.75rem;
	}
	@media (max-width: 550px) {
		.header-main {
			flex-direction: column;
			align-items: stretch;
		}
		.repo-info {
			justify-content: center;
		}
		.repo-actions {
			justify-content: center;
		}
	}
	.repo-info {
		align-items: center;
		display: flex;
		font-size: 1rem;
		gap: 0.35rem;
		flex-wrap: wrap;
	}
	:global(.octocat-icon) {
		color: var(--color-text-primary);
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.25rem;
		flex-shrink: 0;
	}
	.owner,
	.repo-title {
		color: var(--color-link);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}
	.owner:hover,
	.repo-title:hover {
		text-decoration: underline;
	}
	.owner {
		font-weight: 400;
	}
	.repo-title {
		font-weight: 600;
	}
	.slash {
		color: var(--color-text-secondary);
	}
	.badge-public {
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: 2em;
		color: var(--color-text-secondary);
		display: inline-flex;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.05rem 0.5rem;
		margin-left: 0.35rem;
		line-height: 1.2;
	}
	.repo-actions {
		align-items: center;
		display: flex;
	}
	.btn-star {
		align-items: center;
		background-color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		color: var(--color-text-primary);
		display: inline-flex;
		font-size: 0.8125rem;
		font-weight: 600;
		gap: 0.375rem;
		line-height: 1;
		padding: 0.35rem 0.75rem;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}
	.btn-star:hover {
		background-color: var(--color-surface-hover);
		border-color: var(--color-star);
		text-decoration: none;
	}

	:global(.star-icon) {
		color: var(--color-star);
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
		transition: transform 0.4s ease-in-out;
	}
	.btn-star:hover :global(.star-icon) {
		transform: rotate(72deg);
	}
	.btn-count {
		align-items: center;
		background: rgba(110, 118, 129, 0.15);
		border-radius: 2em;
		color: var(--color-text-primary);
		display: inline-flex;
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1;
		padding: 0.15rem 0.45rem;
		margin-left: 0.2rem;
		transition: background-color 0.25s ease;
	}
	.btn-star:hover .btn-count {
		background: rgba(234, 179, 8, 0.15);
	}

	.counter-badge {
		background: rgba(110, 118, 129, 0.2);
		border-radius: 2em;
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.05rem 0.45rem;
		line-height: 1.2;
	}
	.repo-nav {
		align-items: center;
		display: flex;
		gap: 0.5rem;
		padding: 0 0.75rem;
		overflow-x: auto;
		max-width: 1536px;
		margin: 0 auto;
	}
	.nav-tab {
		align-items: center;
		border-bottom: 2px solid transparent;
		color: var(--color-text-secondary);
		display: flex;
		font-size: 0.875rem;
		font-weight: 400;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		text-decoration: none;
		white-space: nowrap;
	}
	.nav-tab:hover {
		color: var(--color-text-primary);
		text-decoration: none;
	}
	.nav-tab.active {
		border-bottom-color: var(--color-active-tab);
		color: var(--color-text-primary);
		font-weight: 600;
	}
	:global(.nav-icon) {
		color: var(--color-text-secondary);
	}
	.nav-tab.active :global(.nav-icon) {
		color: var(--color-text-primary);
	}
</style>
