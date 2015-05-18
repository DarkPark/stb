/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var util = require('util'),
	path = require('path'),
	gulp = require('gulp');


gulp.task('develop', [
	'lint', 'img:develop', 'jade:develop', 'less:develop', 'webpack:develop', 'static', 'weinre', 'proxy', 'logger'
], function () {
	// build and watch
	gulp.watch(['./app/img/**/*'], ['img:develop']);
	gulp.watch(['./app/js/**/*.js', process.env.STB + '/app/js/**/*.js'], ['webpack:develop']);
	gulp.watch(['./app/jade/**/*.jade'], ['jade:develop']);
	gulp.watch([
		'./app/less/**/*.less', './app/less/vars/*.js', './config/*.js',
		process.env.STB + '/app/less/**/*.less',
		process.env.STB + '/app/less/vars/*.js'
	], ['less:develop']);
});


gulp.task('release', ['lint', 'img:release', 'jade:release', 'less:release', 'webpack:release']);


// build everything and open main entry page
gulp.task('serve', ['develop', 'release'], function () {
	var command = require('../lib/cli/program').currCommnand;

	// popup browser if not prevented
	if ( command.open !== false ) {
		// read http port from config
		require('open')(util.format('http://localhost:%s/', require(path.join(process.env.CWD, 'config', 'static')).port));
	}

	// connect to STB
	require('../lib/ssh');
});
