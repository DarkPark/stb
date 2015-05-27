/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


// build everything and open main entry page
gulp.task('serve', ['static', 'weinre', 'proxy', 'logger', 'watch'], function () {
	// read-eval-print loop
	var repl = require('gulp-repl');

	// no unnecessary prompts
	repl.setPrompt('');

	// Ctrl+C was pressed
	repl.on('SIGINT', function () {
		process.exit();
	});
});


// entry point
gulp.task('default', ['build', 'serve']);
