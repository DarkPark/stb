/**
 * Compile all CommonJS modules into a single js file.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
	util    = require('util'),
	gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	webpack = require('gulp-webpack'),
	report  = require('../lib/report').webpack,
	del     = require('del'),
	mtrBase = process.env.STB + '/config/metrics.js',
	mtrUser = process.env.CWD + '/config/metrics.js';


gulp.task('webpack:clean:develop', function ( done ) {
	del(['./build/develop/app.js', './build/develop/app.js.map'], done);
});


gulp.task('webpack:clean:release', function ( done ) {
	del(['./build/release/app.js'], done);
});


gulp.task('webpack:clean', ['webpack:clean:develop', 'webpack:clean:release']);


gulp.task('webpack:develop', function () {
	return gulp
		.src(process.env.STB + '/app/js/develop/main.js')
		.pipe(plumber())
		.pipe(webpack({
			//entry: 'develop/main.js',
			output: {
				//path: './build/develop/',
				filename: 'app.js',
				pathinfo: true,
				sourcePrefix: '\t\t\t'
			},
			resolve: {
				root: process.env.STB + '/app/js/',
				extensions:['', '.js'],
				alias: {
					stb: process.env.STB + '/app/js/',
					app: process.env.CWD + '/app/js/',
					metrics: fs.existsSync(mtrUser) ? mtrUser : mtrBase
				}
			},
			devtool: 'source-map',
			node: {
				console: false,
				process: true,
				global: false,
				buffer: false,
				__filename: true,
				__dirname: true
			},
			debug: true,
			cache: false,
			//watch: true,
			//watchDelay: 300,
			plugins: [
				// fix compilation persistence
				new webpack.webpack.optimize.OccurenceOrderPlugin(true),
				// global constants
				new webpack.webpack.DefinePlugin({
					DEBUG: true
				})
			]
		}, null, report))
		.pipe(gulp.dest('./build/develop/'));
});


gulp.task('webpack:release', function () {
	var appInfo = require(process.env.CWD + '/package.json'),
		stbInfo = require(process.env.STB + '/package.json'),
		wpkInfo = require(process.env.STB + '/node_modules/gulp-webpack/node_modules/webpack/package.json');

	return gulp
		.src('./app/js/main.js')
		.pipe(plumber())
		.pipe(webpack({
			output: {
				//path: './build/release/',
				filename: 'app.js'
			},
			resolve: {
				extensions:['', '.js'],
				alias: {
					stb: process.env.STB + '/app/js/',
					metrics: fs.existsSync(mtrUser) ? mtrUser : mtrBase
				}
			},
			debug: false,
			cache: false,
			plugins: [
				// fix compilation persistence
				new webpack.webpack.optimize.OccurenceOrderPlugin(true),
				// global constants
				new webpack.webpack.DefinePlugin({
					DEBUG: false
				}),
				// obfuscation
				new webpack.webpack.optimize.UglifyJsPlugin({
					// this option prevents name changing
					// use in case of strange errors
					// mangle: false,
					output: {
						comments: false
					},
					/*eslint camelcase:0 */
					compress: {
						warnings: true,
						unused: true,
						dead_code: true,
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['debug.assert', 'debug.log', 'debug.info', 'debug.inspect', 'debug.event', 'debug.stab']
					}
				}),
				// add comment to the top of app.js
				new webpack.webpack.BannerPlugin(util.format(
					'%s: v%s (stb: v%s, webpack: v%s)',
					appInfo.name, appInfo.version, stbInfo.version, wpkInfo.version
				))
			]
		}, null, report))
		.pipe(gulp.dest('./build/release/'));
});


gulp.task('webpack', ['webpack:develop', 'webpack:release']);
