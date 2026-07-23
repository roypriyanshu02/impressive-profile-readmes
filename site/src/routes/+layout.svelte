<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data;
</script>

<Header repoStats={data.repoStats} />
<main class="main-container">
	<slot />
	<BackToTop />
</main>
<Footer updateAt={data.lastModified} />

<style>
	.main-container {
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 0.75rem;
		width: 100%;
	}
</style>
