<div class="card-container">
	<slot />
</div>

<style>
	.card-container {
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: repeat(4, 1fr);
	}
	@media (max-width: 1024px) {
		.card-container {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 480px) {
		.card-container {
			grid-template-columns: 1fr;
		}
	}
</style>
