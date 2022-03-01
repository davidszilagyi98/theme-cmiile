/**
 * Version 1.3.0
 *
 * @param {*} param
 */
module.exports = ({ file, env }) => ({
	plugins: {
		'postcss-sort-media-queries': {},
		autoprefixer: {},
		'postcss-import': { root: file.dirname },
		'postcss-preset-env': {},
		cssnano: 'development' === env ? false : { preset: ['default', { discardComments: { removeAll: true } }] },
		pixrem: { atrules: true },
	},
});
