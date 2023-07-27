<script>
	export let updateAt;
	updateAt = new Date(updateAt)
		.toLocaleString('default', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		})
		.toUpperCase();
</script>

<footer>
	<div class="container">
		<ul class="links">
			<li class="link">
				<a
					href="https://github.com/roypriyanshu02/impressive-profile-readmes/blob/main/CONTRIBUTING.md#to-add-remove-or-update-github-profile-readmes-"
				>
					Add or Remove Profile READMEs
				</a>
			</li>
			<li class="link">
				<a
					href="https://github.com/roypriyanshu02/impressive-profile-readmes/blob/main/CONTRIBUTING.md#to-fix-a-bug-add-an-improvement-or-new-feature-%EF%B8%8F"
				>
					Improve or Add Feature Site
				</a>
			</li>
			<li class="link">
				<a
					href="https://github.com/roypriyanshu02/impressive-profile-readmes/blob/main/CONTRIBUTING.md#issues-guidelines-"
				>
					Report Issue or Request Feature
				</a>
			</li>
		</ul>
		<div class="icons">
			<a
				href="https://github.com/roypriyanshu02/impressive-profile-readmes"
				target="_blank"
				rel="noreferrer"
			>
				<svg class="icon" role="img" viewBox="0 0 24 24">
					<title>GitHub</title>
					<path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					/>
				</svg>
			</a>
		</div>
	</div>
	<div class="update-at">Updated at <span class="highlight">{updateAt}</span></div>
</footer>

<style>
	footer .container {
		align-items: center;
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 10fr 2fr;
	}
	footer .links {
		display: flex;
		font-size: 1rem;
		gap: 1.25rem;
		justify-content: flex-start;
		line-height: 1.5rem;
		padding: 1rem;
	}
	@media (max-width: 480px) {
		footer .links {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
	footer .links .link {
		color: var(--color-primary);
		text-decoration: none;
	}
	footer .links .link::marker {
		color: var(--color-on-background);
	}
	footer .links .link:hover {
		color: var(--color-primary-hover);
	}
	footer .icons {
		align-items: center;
		display: flex;
		gap: 0.75rem;
		grid-column: 2 / -1;
		justify-content: flex-end;
		padding: 1rem 0;
	}
	footer .icons .icon {
		fill: var(--color-primary);
		height: 1.5rem;
		transition: fill 0.3s ease-out;
		width: 1.5rem;
	}
	footer .icons .icon:hover {
		cursor: pointer;
		fill: var(--color-primary-hover);
	}
	footer .update-at {
		color: var(--color-on-background);
		font-size: 1rem;
		padding: 0.5rem 0;
		text-align: center;
	}
	footer .update-at .highlight {
		font-style: italic;
	}
</style>
