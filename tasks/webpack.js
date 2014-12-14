/**
 * Compile all CommonJS modules into a single js file.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	webpack = require('webpack'),
	title   = 'webpack:';


// enable colors in console
//require('tinycolor');


gulp.task('webpack:develop', function () {
	webpack({
//		entry: process.env.STB + '/app/js/develop/main.js',
		entry: 'develop/main.js',
		output: {
			path: './build/develop/',
			filename: 'app.js',
			pathinfo: true,
			sourcePrefix: '\t\t\t'
		},
		resolve: {
			root: process.env.STB + '/app/js/',
			extensions:['', '.js'],
			alias: {
				stb: process.env.STB + '/app/js/',
				app: process.env.CWD + '/app/js/'
			}
		},
		devtool: 'source-map',
		node: {
			console: false,
			process: false,
			global: false,
			buffer: false,
			__filename: true,
			__dirname: true
		},
		debug: true,
		cache: false,
		watch: true,
		watchDelay: 300,
		plugins: [
			// fix compilation persistence
			new webpack.optimize.OccurenceOrderPlugin(true)
		]
	}, handler);
});


gulp.task('webpack:release', function () {
	webpack({
		entry: './app/js/main.js',
		output: {
			path: './build/release/',
			filename: 'app.js'
		},
		resolve: {
			extensions:['', '.js'],
			alias: {
				stb: process.env.STB + '/app/js/',
			}
		},
		debug: false,
		cache: false,
		plugins: [
			// fix compilation persistence
			new webpack.optimize.OccurenceOrderPlugin(true),
			new webpack.optimize.UglifyJsPlugin({
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
	}, handler);
});


gulp.task('webpack', ['webpack:develop', 'webpack:release']);


/**
 * Callback to output the statistics.
 *
 * @param {Object} err problem description structure if any
 * @param {Object} stats data to report
 */
function handler ( err, stats ) {
	var json = stats.toJson({source:false});

	if ( err ) {
		gutil.log(title, gutil.colors.red('FATAL ERROR'), err);
	} else {
		// general info
		gutil.log(title, 'hash:',    gutil.colors.bold(json.hash));
		gutil.log(title, 'version:', gutil.colors.bold(json.version));
		gutil.log(title, 'time:',    gutil.colors.bold(json.time));

		// title and headers
		gutil.log(title, gutil.colors.green('ASSETS'));
		gutil.log(title, gutil.colors.grey('\tSize\tName'));
		// data
		json.assets.forEach(function ( asset ) {
			gutil.log(title, '\t' + asset.size + '\t' + gutil.colors.bold(asset.name));
		});

		// title and headers
		gutil.log(title, gutil.colors.green('MODULES'));
		gutil.log(title, gutil.colors.grey('\tNo\tID\tSize\tErrs\tWarns\tName'));

		// sort modules by name (not always is necessary)
		//json.modules.sort(function ( a, b ) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });

		// data
		json.modules.forEach(function ( module, index ) {
			gutil.log(title, '\t' +
				(index + 1) + '\t' +
				module.id + '\t' +
				module.size + '\t' +
				(module.errors > 0 ? gutil.colors.red(module.errors) : '0') + '\t' +
				(module.warnings > 0 ? gutil.colors.yellow(module.warnings) : '0') + '\t' +
				(module.name.indexOf('(webpack)') === 0 ? gutil.colors.grey(module.name) : module.name.replace(/\//g, gutil.colors.grey('/')))
			);
		});

		json.errors.forEach(function ( error, errorIndex ) {
			gutil.log(title, gutil.colors.red('ERROR #' + errorIndex));
			error.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					gutil.log(title, gutil.colors.bold(line));
				} else {
					gutil.log(title, '\t' + gutil.colors.grey(line));
				}
			});
		});

		json.warnings.forEach(function ( warning, warningIndex ) {
			gutil.log(title, gutil.colors.yellow('WARNING #' + warningIndex));
			warning.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					gutil.log(title, gutil.colors.bold(line));
				} else {
					gutil.log(title, '\t' + gutil.colors.grey(line));
				}
			});
		});
	}
}
