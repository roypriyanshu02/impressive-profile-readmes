<script>
	import { onMount } from 'svelte';
	let prevScrollPos = 0;

	// Select the header element
	let header;

	// On component mount
	onMount(() => {
		// Get the height of the header element
		let headerHeight = header.offsetHeight;

		// Handle scroll event
		const handleScroll = () => {
			// Get current scroll position
			const currentScrollPos = window.pageYOffset;

			// Check if user is scrolling up
			if (prevScrollPos > currentScrollPos) {
				// If header is hidden, show it
				if (header.style.top === `-${headerHeight}px`) {
					header.style.top = '0';
				}
			} else {
				// If user is scrolling down, hide header
				header.style.top = `-${headerHeight}px`;
			}

			// Update prevScrollPos with current scroll position
			prevScrollPos = currentScrollPos;
		};

		// Attach scroll event listener to window
		window.addEventListener('scroll', handleScroll);
	});
</script>

<header class="header" bind:this={header}>
	<div>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#" class="brand">
			<span class="highlight">Impressive</span><br />
			Profile READMEs
		</a>
	</div>
	<nav>
		<a href="https://github.com/roypriyanshu02/impressive-profile-readmes">
			<svg class="github-icon" role="img" viewBox="0 0 24 24">
				<title>GitHub</title>
				<path
					d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				/>
			</svg>
		</a>
	</nav>
</header>

<style>
	.header {
		align-items: center;
		background-color: var(--color-background);
		display: flex;
		justify-content: space-between;
		padding: 1.25rem 0;
		position: sticky;
		top: 0;
		transition: top var(--transition-default);
		width: 100%;
		z-index: 10;
	}
	.header .brand {
		color: var(--color-on-background);
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.5rem;
		text-decoration: none;
	}
	.header .brand:hover .highlight {
		color: var(--color-primary-hover);
	}
	.header .brand .highlight {
		color: var(--color-primary);
		font-size: 1.5rem;
		font-weight: 700;
	}
	.github-icon {
		fill: var(--color-primary);
		height: 1.5rem;
		width: 1.5rem;
	}
	.github-icon:hover {
		cursor: pointer;
		fill: var(--color-primary-hover);
	}
</style>
