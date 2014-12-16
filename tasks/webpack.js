/**
 * Compile all CommonJS modules into a single js file.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
	gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	webpack = require('gulp-webpack'),
	report  = require('../lib/report').webpack,
	mtrBase = process.env.STB + '/config/metrics.js',
	mtrUser = process.env.CWD + '/config/metrics.js';


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
				new webpack.webpack.optimize.OccurenceOrderPlugin(true)
			]
		}, null, report))
		.pipe(gulp.dest('./build/develop/'));
});


gulp.task('webpack:release', function () {
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
				new webpack.webpack.optimize.UglifyJsPlugin({
					// this option prevents name changing
					// use in case of strange errors
					// mangle: false,
					compress: {
						warnings: true,
						unused: true,
						dead_code: true,
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['debug.assert', 'debug.log', 'debug.info', 'debug.inspect', 'debug.event', 'debug.stab']
					}
				})
			]
		}, null, report))
		.pipe(gulp.dest('./build/release/'));
});


gulp.task('webpack', ['webpack:develop', 'webpack:release']);
