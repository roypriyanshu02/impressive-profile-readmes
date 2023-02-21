<script>
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import BackToTop from '$lib/components/back-to-top.svelte';
	export const prerender = true;
</script>

<Header />
<main>
	<slot />
	<BackToTop />
</main>
