/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var //path    = require('path'),
	gulp    = require('gulp'),
	log     = require('../lib/log'),
	//config = require(path.join(__dirname, '..', 'lib', 'config'))('static'),
	cliParams = require('minimist')(process.argv.slice(2));
	//plumber = require('gulp-plumber'),
	//del     = require('del')


gulp.task('develop', [
	'lint', 'img:develop', 'jade:develop', 'less:develop', 'webpack:develop', 'static', 'weinre', 'proxy', 'logger'
], function () {
	// build and watch
	gulp.watch(['./app/img/**/*'], ['img:develop']);
	gulp.watch(['./app/js/**/*.js'], ['webpack:develop']);
	gulp.watch(['./app/jade/**/*.jade'], ['jade:develop']);
	gulp.watch(['./app/less/**/*.less', './app/less/vars/*.js', './config/metrics.js'], ['less:develop']);
});


gulp.task('release', ['lint', 'img:release', 'jade:release', 'less:release', 'webpack:release']);


// build everything and open main entry page
gulp.task('serve', ['develop', 'release'], function () {
	// manage gulp from command line
	//var runtime = require('gulp-runtime');
	//runtime.setPrompt('');
    //
	//// runtime reload of changed tasks
	//gulp.watch([__filename, './tasks/**/*.js'], function ( file ) {
	//	// clear cache
	//	runtime.require(file.path, {reload: true});
	//	log('runtime:', gutil.colors.green('reloaded ') + file.path);
	//});

	// popup browser if not prevented
	if ( !cliParams.noopen ) {
		require('open')('http://localhost:8000/');
		// report
		log('runtime '.inverse,
			'Root page was opened in the default browser. Use "' + 'gulp --noopen'.green + '" to prevent this.');
	}

	// connect to STB
	require('../lib/ssh');
});
