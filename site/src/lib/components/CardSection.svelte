<div class="card-container">
	<slot />
</div>

<style>
	.card-container {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(4, 1fr);
		margin-bottom: 2rem;
	}
	@media (max-width: 1200px) {
		.card-container {
			grid-template-columns: repeat(3, 1fr);
			gap: 1rem;
		}
	}
	@media (max-width: 850px) {
		.card-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}
	@media (max-width: 550px) {
		.card-container {
			grid-template-columns: 1fr;
			gap: 0.875rem;
		}
	}
</style>
