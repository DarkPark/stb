/**
 * Tasks to remove and copy all font files.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
    gulp    = require('gulp'),
    plumber = require('gulp-plumber'),
    del     = require('del');


// remove all font files
gulp.task('font:clean', function () {
    return del([path.join(global.paths.build, 'font', '**', '*')]);
});


// remove and copy
gulp.task('font', ['font:clean'], function () {
    return gulp
        .src([
            path.join(global.paths.app, 'font', '**', '*'),
            '!' + path.join(global.paths.app, 'font', 'readme.md')
        ])
        .pipe(plumber())
        .pipe(gulp.dest(path.join(global.paths.build, 'font')));
});
