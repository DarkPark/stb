/**
 * Rebuild everything.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


// rebuild develop and release
gulp.task('build:develop', ['lint', 'img', 'jade:develop', 'less:develop', 'webpack:develop']);
gulp.task('build:release', ['lint', 'img', 'jade:release', 'less:release', 'webpack:release']);


// full rebuild
gulp.task('build', ['build:develop', 'build:release']);
