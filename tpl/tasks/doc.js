/**
 * Open STB documentation in the default web browser.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


gulp.task('doc', function () {
	require('open')('file://' + process.env.STB + '/doc/index.html');
});
