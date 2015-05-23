/**
 * Initial creation of all necessary files and folders.
 * Has smart conflict resolution mechanism.
 * Installs all necessary package dependencies.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp     = require('gulp'),
	conflict = require('gulp-conflict'),
	files    = [
		process.env.STB + '/tpl/**',
		process.env.STB + '/license.md',
		process.env.STB + '/.gitattributes',
		process.env.STB + '/.eslintrc',
		process.env.STB + '/.editorconfig'
	];


gulp.task('init', function () {
	// copy template files to the current dir
	gulp.src(files, {dot: true})
		.pipe(conflict('./'))
		.pipe(gulp.dest('./'));
});
