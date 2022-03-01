/**
 * 2.5.0
 */

import * as path from 'path';
import * as webpack from 'webpack';
import * as entry from 'webpack-glob-entry';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import BrowserSync from 'browser-sync-webpack-plugin';
import { key, cert } from './local-config';

const devMode = 'development' === process.env.NODE_ENV;

class NonJsEntryCleanupPlugin {
	options: {
		context: string;
		extension: string;
	};

	constructor(options: { context: string; extension: string }) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.thisCompilation.tap('cleanupPlugin', (compilation) => {
			const { Compilation } = webpack;

			compilation.hooks.processAssets.tap(
				{
					name: 'cleanupPlugin',

					// Using one of the later asset processing stages to ensure
					// that all assets were already added to the compilation by other plugins.
					stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
				},
				(assets) => {
					const { context, extension } = this.options;
					const pattern = RegExp(`/?${context}\/.*\.${extension}.?`);

					Object.keys(assets)
						.filter((asset) => asset.match(pattern))
						.forEach((asset) => delete assets[asset]);
				}
			);
		});
	}
}

function getPublicPath(folder) {
	const entity = path.basename(path.resolve(__dirname + '/..'));
	const name = path.basename(path.resolve(__dirname));
	return `/wp-content/${entity}/${name}/${folder}/`;
}

const config: webpack.Configuration = {
	mode: process.env.NODE_ENV as 'development' | 'production',
	entry: entry.default(
		(filePath: string) => {
			return filePath
				.replace('resources/', '')
				.replace('.scss', '')
				.replace('.jsx', '')
				.replace('.tsx', '')
				.replace('.js', '')
				.replace('.ts', '');
		},
		`./resources/scripts/**/!(_)*.ts?(x)`,
		`./resources/scripts/**/!(_)*.js?(x)`,
		`./resources/images/**/*.*`,
		`./resources/styles/**/!(_)*.scss`
	),
	externals: {
		lodash: 'lodash',
	},
	output: {
		path: path.resolve('assets'),
		publicPath: getPublicPath('assets'),
		filename: '[name].js',
		clean: true,
	},
	devtool: devMode ? 'source-map' : false,
	performance: {
		maxAssetSize: 1000000,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	stats: {
		assets: false,
		children: true,
		colors: true,
		entrypoints: false,
		env: devMode,
		errors: true,
		// errorDetails: false,
		errorStack: false,
		// loggingTrace: false,
		modules: false,
		moduleTrace: false,
		source: false,
		warnings: devMode,
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: devMode,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							// ident: 'postcss',
							sourceMap: devMode,
							postcssOptions: {
								plugins: ['postcss-import'],
								config: path.resolve(__dirname, 'postcss.config.js'),
							},
						},
					},
					{ loader: 'resolve-url-loader', options: { sourceMap: devMode } }, // Fixes relative scss imports, as they should be relative to the dev environment ONLY, and not the final output.
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true, // Must always be true.
							implementation: require('sass'),
						},
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		!devMode &&
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							['gifsicle', { interlaced: true }],
							['jpegtran', { progressive: true }],
							['optipng', { optimizationLevel: 5 }],
							[
								'svgo',
								{
									plugins: [
										{
											name: 'removeViewBox',
											active: false,
										},
									],
								},
							],
						],
					},
				},
			}),
		devMode &&
			new BrowserSync(
				{
					ignore: ['node_modules', 'webpack.config.js', 'config.js'],
					files: ['assets/styles/**/*.css', 'assets/scripts/**/*.js', '**/*.php', '**/*.html'],
					port: 3100,
					https: key && cert ? { key, cert } : false,
					open: false,
					logLevel: 'silent',
					notify: true,
				},
				{
					injectCss: true,
					// reload: false,
				}
			),
		new NonJsEntryCleanupPlugin({
			context: 'styles',
			extension: 'js',
		}),
		new NonJsEntryCleanupPlugin({
			context: 'images',
			extension: 'js',
		}),
	].filter(Boolean),
};

export default config;
