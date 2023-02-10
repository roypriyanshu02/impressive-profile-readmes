<script>
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import BackToTop from '$lib/components/back-to-top.svelte';
</script>

<Header />
<main>
	<slot />
	<BackToTop />
</main>
