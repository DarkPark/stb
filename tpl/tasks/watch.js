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
        path.join(global.paths.app, 'img', '**', '*')
    ], function () {
        gulp.start('img');
    });

    // font
    watch([
        path.join(global.paths.app, 'font', '**', '*')
    ], function () {
        gulp.start('font');
    });

    // webpack
    watch([
        path.join(global.paths.app, 'js', '**', '*.js'),
        path.join(global.paths.config, 'app[.]js'),
        path.join(global.paths.config, 'metrics[.]js')
    ], function () {
        gulp.start('webpack:develop');
    });

    // jade
    watch([
        path.join(global.paths.app, 'jade', '**', '*.jade')
    ], function () {
        gulp.start('jade:develop');
    });

    // less
    watch([
        path.join(global.paths.app, 'less', '**', '*.{less,js}'),
        path.join(global.paths.config, 'metrics[.]js')
    ], function () {
        gulp.start('less:develop');
    });
});
