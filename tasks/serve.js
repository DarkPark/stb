/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp'),
	log  = require('../lib/log');


gulp.task('develop', [
	'lint', 'img:develop', 'jade:develop', 'less:develop', 'webpack:develop', 'static', 'weinre', 'proxy', 'logger'
], function () {
	// build and watch
	gulp.watch(['./app/img/**/*'], ['img:develop']);
	gulp.watch(['./app/js/**/*.js', process.env.STB + '/app/js/**/*.js'], ['webpack:develop']);
	gulp.watch(['./app/jade/**/*.jade'], ['jade:develop']);
	gulp.watch([
		'./app/less/**/*.less', './app/less/vars/*.js', './config/metrics.js',
		process.env.STB + '/app/less/**/*.less', process.env.STB + '/app/less/vars/*.js', process.env.STB + '/config/metrics.js'
	], ['less:develop']);
});


gulp.task('release', ['lint', 'img:release', 'jade:release', 'less:release', 'webpack:release']);


// build everything and open main entry page
gulp.task('serve', ['develop', 'release'], function () {
	var command = require('../lib/cli/program').currCommnand;

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
	if ( command.open !== false ) {
		require('open')('http://localhost:8000/');
	}

	// connect to STB
	require('../lib/ssh');
});
