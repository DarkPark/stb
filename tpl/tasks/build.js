/**
 * Rebuild everything.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


// rebuild develop and release
gulp.task('build:develop', ['lint', 'font', 'img', 'jade:develop', 'less:develop', 'webpack:develop']);
gulp.task('build:release', ['lint', 'font', 'img', 'jade:release', 'less:release', 'webpack:release']);


// full rebuild
gulp.task('build', ['build:develop', 'build:release']);
