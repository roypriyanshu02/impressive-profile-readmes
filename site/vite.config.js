import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [enhancedImages(), sveltekit()],
	// Optimize dependency pre-bundling
	optimizeDeps: {
		include: ['svelte', '@sveltejs/kit'],
		exclude: ['@sveltejs/kit/ssr']
	}
};

export default config;
