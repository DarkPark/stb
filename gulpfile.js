/**
 * Gulp main entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
	gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	eslint  = require('gulp-eslint'),
	webpack = require('webpack-stream'),
	log     = require('gulp-util').log;


// enable colors in console
require('tty-colors');


// check for potential errors and problems
gulp.task('lint', function () {
	return gulp
		.src([
			'./bin/**/*.js',
			'./tpl/**/*.js'
		])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format('stylish', function ( result ) {
			// make nice output
			result.split('\n').forEach(function ( line ) {
				log('eslint  '.bgRed, line + ''.reset);
			});
		}));
});


// build source files
gulp.task('webpack', function () {
	return gulp
		.src('tests/units/**/*.js')
		.pipe(plumber())
		.pipe(webpack({
			output: {
				filename: 'build.js',
				pathinfo: true,
				sourcePrefix: '\t\t\t'
			},
			resolve: {
				root: path.join(__dirname, 'app', 'js')
			},
			devtool: 'source-map',
			plugins: [
				// fix compilation persistence
				new webpack.webpack.optimize.OccurenceOrderPlugin(true),
				// global constants
				new webpack.webpack.DefinePlugin({
					DEBUG: false
				})
			]
		}, null/*, report*/))
		.pipe(gulp.dest('tests'));
});


// build documentation
gulp.task('jsdoc', function ( done ) {
	// run process
	var child = require('child_process').spawn(
		'./node_modules/.bin/jsdoc',
		['--recurse', '--configure', 'jsdoc.json', '--destination', '../stb-pages/', 'tpl/app/js/stb/', 'readme.md']
	);

	child.on('close', done);
	child.on('error', function reportError () {
		console.log('FATAL ERROR: JSDoc failed to start!');
	});

	child.stderr.on('data', function reportStdErr ( data ) {
		console.log(data);
	});
	child.stdout.on('data', function reportStdOut ( data ) {
		console.log(data);
	});
});


// entry point
gulp.task('default', ['webpack', 'jsdoc'], function () {
	gulp.watch(['./app/js/**/*.js', './tests/units/**/*.js'], ['webpack']);
	gulp.watch(['./app/js/**/*.js'], ['jsdoc']);
});
