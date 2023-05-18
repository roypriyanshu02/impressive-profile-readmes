<script>
	import { onMount } from 'svelte';
	import NavLinks from './nav-links.svelte';
	let windowMob = false;

	onMount(() => {
		function checkWindow() {
			// Get width of the window
			windowMob = document.documentElement.clientWidth <= 480 ? true : false;
		}

		// Attaching the event listener function to window's resize event
		window.addEventListener('resize', checkWindow);

		// Check window for the first time
		checkWindow();
	});
</script>

<header class="header">
	<div class="header-container">
		<div>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a href="/" class="brand">
				<span class="highlight">Impressive</span><br />
				Profile READMEs
			</a>
		</div>
		<nav>
			{#if !windowMob}
				<NavLinks />
			{/if}
			<div class="icons">
				<a href="https://t.me/+ClkvicPF4D0xNzE1" target="_blank" rel="noreferrer">
					<svg role="img" viewBox="0 0 24 24">
						<title>Telegram</title>
						<path
							d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
						/>
					</svg>
				</a>
				<a href="https://github.com/roypriyanshu02/impressive-profile-readmes" target="_blank">
					<svg role="img" viewBox="0 0 24 24">
						<title>GitHub</title>
						<path
							d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
						/>
					</svg>
				</a>
			</div>
		</nav>
	</div>

	{#if windowMob}
		<nav class="mob-nav-links">
			<NavLinks />
		</nav>
	{/if}
</header>

<style>
	.header {
		padding: 1.25rem 0 0;
	}
	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}
	.header .brand {
		color: var(--color-on-background);
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		line-height: 1.5rem;
		white-space: nowrap;
	}
	.header .brand .highlight {
		color: var(--color-primary);
		font-size: 1.5rem;
		font-weight: 700;
	}
	.header .brand:hover .highlight {
		color: var(--color-primary-hover);
	}
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		font-weight: 500;
	}
	.icons {
		display: flex;
		justify-content: center;
	}
	.icons > a {
		fill: var(--color-primary);
		height: 1.8rem;
		width: 1.8rem;
		margin: 0 0.2rem;
	}
	.icons > a:hover {
		cursor: pointer;
		fill: var(--color-primary-hover);
	}
	@media (max-width: 480px) {
		.mob-nav-links {
			display: block;
			margin: 1.5rem 0 0.5rem;
		}
	}
</style>
