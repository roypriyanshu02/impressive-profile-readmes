<script>
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import BackToTop from '$lib/components/back-to-top.svelte';
	import Footer from '$lib/components/footer.svelte';
	export let data;
	const updateAt = data.lastModified;
	export const prerender = true;
</script>

<Header />
<main>
	<slot />
	<BackToTop />
</main>
<Footer {updateAt} />
