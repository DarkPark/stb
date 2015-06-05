/**
 * Read-eval-print loop task.
 * The module exports a readline instance.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


// start loop
gulp.task('repl', function ( done ) {
	var repl = require('gulp-repl');

	// no unnecessary prompts
	repl.setPrompt('');

	// Ctrl+C was pressed
	repl.on('SIGINT', function () {
		process.exit();

		done();
	});
});
