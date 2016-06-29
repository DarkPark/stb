/**
 * Monitor files and rebuild.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint no-unused-vars: 0 */

var path  = require('path'),
    gulp  = require('gulp'),
    watch = require('gulp-watch');


// rebuild everything on file changes
// done callback should be present to show gulp that task is not over
gulp.task('watch', function ( done ) {
    // img
    watch([
        path.join(global.paths.src, 'img', '**', '*')
    ], function () {
        gulp.start('img');
    });

    // font
    watch([
        path.join(global.paths.src, 'font', '**', '*')
    ], function () {
        gulp.start('font');
    });

    // webpack
    watch([
        path.join(global.paths.src, 'js', '**', '*.js'),
        path.join(global.paths.config, 'app[.]js'),
        path.join(global.paths.config, 'metrics[.]js')
    ], function () {
        gulp.start('webpack:develop');
    });

    // jade
    watch([
        path.join(global.paths.src, 'jade', '**', '*.jade')
    ], function () {
        gulp.start('jade:develop');
    });

    // less
    watch([
        path.join(global.paths.src, 'less', '**', '*.{less,js}'),
        path.join(global.paths.config, 'metrics[.]js')
    ], function () {
        gulp.start('less:develop');
    });
});
