/// <reference types="vitest" />
import { URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	appType: 'spa',
	envPrefix: 'APP_',
	resolve: {
		alias: {
			'@': new URL('./src', import.meta.url).pathname,
			'@test': new URL('./test', import.meta.url).pathname,
		},
	},
	build: {
		// Produce a better css output size, since most of the styles are defined in
		// the global and token files, which reduce the style duplication for each page.
		// https://vitejs.dev/config/build-options.html#build-csscodesplit
		cssCodeSplit: false,
		// rollupOptions: {
		// 	output: {
		// 		inlineDynamicImports: true,
		// 		entryFileNames: '[name].js',
		// 		assetFileNames: '[name].[ext]',
		// 	},
		// },
	},
	server: {
		port: 3000,
		strictPort: true,
		host: '0.0.0.0',
		open: false,
	},
	preview: {
		port: 8080,
		host: '0.0.0.0',
		open: false,
	},
	test: {
		globals: false,
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
		},
	},
});
