import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import * as glob from 'glob';

const OUTPUT_DIR = 'build/test';

/** @type {import('rollup').RollupOptions} */
const buildOptions = {
	input: makeInput(),
	plugins: [
		typescript({
			include: ['src/**/*.ts'],
			outDir: OUTPUT_DIR,
		}),
	],
	output: {
		dir: OUTPUT_DIR,
		entryFileNames: '[name].js',
		sourcemap: true,
		format: 'es',
	},
};

/**
 * @returns {Record<string, string>}
 */
function makeInput() {
	return Object.fromEntries(
		glob.sync('src/**/*.test.ts').map(file => [makeTestFilename(file), file])
	);
}

/**
 * @param {string} file
 * @returns {string}
 */
function makeTestFilename(file) {
	return path
		.relative('src', file.slice(0, file.length - path.extname(file).length))
		.replace(/\//g, '-');
}

export default buildOptions;
