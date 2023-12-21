import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

export default {
	plugins: [
		autoprefixer({ remove: true, add: true, cascade: false, supports: true, flexbox: false }),
		cssnano({ preset: 'default' }),
		// postcss-variable-compress
	],
};
