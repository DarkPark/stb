/**
 * Initial creation of all necessary files and folders.
 * Has smart conflict resolution mechanism.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 */

'use strict';

var gulp = require('gulp');


gulp.task('init', function () {
	// copy template files to the current dir
	return gulp.src(__dirname + '/../tpl/**')
		.pipe(require('gulp-conflict')('./'))
		.pipe(gulp.dest('./'))
});
