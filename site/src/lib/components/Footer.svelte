<script>
	import GithubIcon from './GithubIcon.svelte';

	export let updateAt;
	const formattedDate = updateAt
		? new Date(updateAt)
				.toLocaleString('default', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				})
				.toUpperCase()
		: '';
</script>

<footer class="github-footer">
	<div class="footer-container">
		<div class="footer-left">
			<a
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme"
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub Repository"
				class="octocat-brand"
			>
				<GithubIcon width={20} height={20} class="octocat-icon" />
			</a>
			<span class="copyright">Awesome GitHub Profile README</span>
		</div>

		<nav class="footer-links">
			<a
				class="footer-link"
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme/blob/main/CONTRIBUTING.md#to-add-remove-or-update-github-profile-readmes-"
				target="_blank"
				rel="noreferrer"
			>
				Add Profile
			</a>
			<a
				class="footer-link"
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme/blob/main/CONTRIBUTING.md#to-fix-a-bug-add-an-improvement-or-new-feature-%EF%B8%8F"
				target="_blank"
				rel="noreferrer"
			>
				Contribute
			</a>
			<a
				class="footer-link"
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme/blob/main/CONTRIBUTING.md#issues-guidelines-"
				target="_blank"
				rel="noreferrer"
			>
				Report Issue
			</a>
			<a
				class="footer-link"
				href="https://github.com/roypriyanshu02/awesome-github-profile-readme"
				target="_blank"
				rel="noreferrer"
			>
				GitHub Repo
			</a>
			{#if formattedDate}
				<span class="update-tag">Updated {formattedDate}</span>
			{/if}
		</nav>
	</div>
</footer>

<style>
	.github-footer {
		border-top: 1px solid var(--color-border);
		margin-top: 1.5rem;
		padding: 1.25rem 0.75rem 1.5rem 0.75rem;
		width: 100%;
	}
	.footer-container {
		align-items: center;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		max-width: 1536px;
		margin: 0 auto;
	}
	@media (max-width: 550px) {
		.footer-container {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
		.footer-links {
			justify-content: center;
			gap: 0.5rem;
		}
	}
	.footer-left {
		align-items: center;
		display: flex;
		gap: 0.625rem;
	}
	.octocat-brand {
		align-items: center;
		color: var(--color-text-secondary);
		display: inline-flex;
		transition: color var(--transition-default);
	}
	.octocat-brand:hover {
		color: var(--color-text-primary);
	}
	:global(.github-footer .octocat-icon) {
		display: inline-block;
		vertical-align: middle;
	}
	.copyright {
		color: var(--color-text-secondary);
		font-size: 0.75rem;
	}
	.footer-links {
		align-items: center;
		display: flex;
		gap: 0.625rem;
		flex-wrap: wrap;
	}
	.footer-link {
		align-items: center;
		background: rgba(110, 118, 129, 0.1);
		border: 1px solid var(--color-border);
		border-radius: 2em;
		color: var(--color-text-secondary);
		display: inline-flex;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		text-decoration: none;
		transition: all var(--transition-default);
	}
	.footer-link:hover {
		background: rgba(110, 118, 129, 0.2);
		border-color: var(--color-text-secondary);
		color: var(--color-text-primary);
		text-decoration: none;
	}
	.update-tag {
		align-items: center;
		background: rgba(110, 118, 129, 0.05);
		border: 1px dashed var(--color-border);
		border-radius: 2em;
		color: var(--color-text-secondary);
		display: inline-flex;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		padding: 0.25rem 0.65rem;
	}
</style>
