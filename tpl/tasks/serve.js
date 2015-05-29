/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


// start all services
gulp.task('serve', ['static', 'weinre', 'proxy', 'watch'/*, 'logger'*/, 'repl']);


// entry point
gulp.task('default', ['build', 'serve']);
