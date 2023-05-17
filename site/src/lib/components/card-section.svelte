<section class="card-container">
	<slot />
</section>

<style>
	.card-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1rem;
		min-height: calc(75vh - 100px);
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
