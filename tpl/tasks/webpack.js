/**
 * Compile all CommonJS modules into a single js file.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path     = require('path'),
	util     = require('util'),
	gulp     = require('gulp'),
	plumber  = require('gulp-plumber'),
	webpack  = require('gulp-webpack'),
	log      = require('gulp-util').log,
	del      = require('del'),
	pkgInfo  = require(path.join(global.paths.root, 'package.json')),
	wpkInfo  = require(path.join(global.paths.root, 'node_modules', 'gulp-webpack', 'node_modules', 'webpack', 'package.json')),
	warnings = false;


/**
 * Callback to output the statistics.
 *
 * @param {Object} err problem description structure if any
 * @param {Object} stats data to report
 */
function report ( err, stats ) {
	var json  = stats.toJson({source:false}),
		title = 'webpack '.inverse;

	if ( err ) {
		log(title, 'FATAL ERROR'.red, err);
	} else {
		// general info
		log(title, '********************************'.grey);
		log(title, 'hash:\t'    + json.hash.bold);
		log(title, 'version:\t' + json.version.bold);
		log(title, 'time:\t'    + json.time.toString().bold + ' ms');
		log(title, '********************************'.grey);

		// title and headers
		log(title, 'ASSETS'.green);
		log(title, '\tSize\tName'.grey);
		// data
		json.assets.forEach(function ( asset ) {
			log(title, '\t' + asset.size + '\t' + asset.name.bold);
		});

		// title and headers
		log(title, 'MODULES'.green);
		log(title, '\tID\tSize\tErrs\tWarns\tName'.grey);

		// sort modules by name (not always is necessary)
		//json.modules.sort(function ( a, b ) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });

		// data
		json.modules.forEach(function ( module ) {
			log(title, '\t' +
				module.id + '\t' +
				module.size + '\t' +
				(module.errors > 0 ? module.errors.toString().red : '0') + '\t' +
				(module.warnings > 0 ? module.warnings.toString().yellow : '0') + '\t' +
				(module.name.indexOf('./') === 0 ? module.name.replace(/\//g, '/'.grey) : module.name.grey)
			);
		});

		json.errors.forEach(function ( error, errorIndex ) {
			log(title, ('ERROR #' + errorIndex).red);
			error.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					log(title, line.bold);
				} else {
					log(title, '\t' + line.grey);
				}
			});
		});

		if ( warnings ) {
			json.warnings.forEach(function ( warning, warningIndex ) {
				log(title, ('WARNING #' + warningIndex).yellow);
				warning.split('\n').forEach(function ( line, lineIndex ) {
					if ( lineIndex === 0 ) {
						log(title, line.bold);
					} else {
						log(title, '\t' + line.grey);
					}
				});
			});
		}
	}
}


// remove all js and map files
gulp.task('webpack:clean', function ( done ) {
	del([
		path.join(global.paths.build, 'js', 'release.*'),
		path.join(global.paths.build, 'js', 'develop.*')
	], done);
});


// generate js files
gulp.task('webpack:develop', function () {
	return gulp
		.src(path.join(global.paths.app, 'js', 'stb', 'develop', 'main.js'))
		.pipe(plumber())
		.pipe(webpack({
			output: {
				filename: 'develop.js',
				pathinfo: true,
				sourcePrefix: '\t\t\t'
			},
			resolve: {
				//root: path.join(global.paths.app, 'js'),
				extensions:['', '.js']
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
			plugins: [
				// fix compilation persistence
				new webpack.webpack.optimize.OccurenceOrderPlugin(true),
				// global constants
				new webpack.webpack.DefinePlugin({
					DEBUG: true
				})
			]
		}, null, report))
		.pipe(gulp.dest(path.join(global.paths.build, 'js')));
});


// generate js files
gulp.task('webpack:release', function () {
	return gulp
		.src(path.join(global.paths.app, 'js', 'main.js'))
		.pipe(plumber())
		.pipe(webpack({
			output: {
				filename: 'release.js'
			},
			resolve: {
				extensions:['', '.js']
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
						pure_funcs: ['debug.assert', 'debug.log', 'debug.info', 'debug.inspect', 'debug.event', 'debug.stub', 'debug.time', 'debug.timeEnd']
					}
				}),
				// add comment to the top of app.js
				new webpack.webpack.BannerPlugin(util.format(
					'%s: v%s (webpack: v%s)',
					pkgInfo.name, pkgInfo.version, wpkInfo.version
				))
			]
		}, null, report))
		.pipe(gulp.dest(path.join(global.paths.build, 'js')));
});


// generate all js files
gulp.task('webpack', ['webpack:develop', 'webpack:release']);
