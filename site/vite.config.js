import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	// Optimize dependency pre-bundling
	optimizeDeps: {
		include: ['svelte', '@sveltejs/kit'],
		exclude: ['@sveltejs/kit/ssr']
	}
};

export default config;
