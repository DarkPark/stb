/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var //util = require('util'),
	path = require('path'),
	gulp = require('gulp');


// watch and rebuild develop
gulp.task('develop', ['lint', 'img', 'jade:develop', 'less:develop', 'webpack:develop', 'static', 'weinre', 'proxy', 'logger'], function () {
	// build and watch
	gulp.watch([path.join(global.paths.app, 'img',  '**',      '*')], ['img:develop']);
	gulp.watch([path.join(global.paths.app, 'js',   '**',   '*.js')], ['webpack:develop']);
	gulp.watch([path.join(global.paths.app, 'jade', '**', '*.jade')], ['jade:develop']);
	gulp.watch([path.join(global.paths.app, 'less', '**', '*.less')], ['less:develop']);
});


// rebuild release
gulp.task('release', ['lint', 'img', 'jade:release', 'less:release', 'webpack:release']);


// build everything and open main entry page
gulp.task('serve', ['develop', 'release'], function () {
	//var command = require('../lib/cli/program').currCommnand;

	// popup browser if not prevented
	//if ( command.open !== false ) {
	//	// read http port from config
	//	require('open')(util.format('http://localhost:%s/', require(path.join(process.env.CWD, 'config', 'static')).port));
	//}

	// connect to STB
	//require('../lib/ssh');
});
