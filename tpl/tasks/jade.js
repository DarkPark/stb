/**
 * Compile HTML files from Jade sources.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
    gulp    = require('gulp'),
    jade    = require('gulp-jade'),
    plumber = require('gulp-plumber'),
    rename  = require('gulp-rename'),
    del     = require('del'),
    pkgInfo = require(path.join(global.paths.root, 'package.json')),
    ip      = require('ip').address(),

    weinreConfig = require(path.join(global.paths.config, 'weinre')),
    staticConfig = require(path.join(global.paths.config, 'static'));


// remove all html files
gulp.task('jade:clean', function () {
    return del([
        path.join(global.paths.app, 'index.html'),
        path.join(global.paths.app, 'develop.html')
    ]);
});


// generate html files
gulp.task('jade:develop', function () {
    return gulp
        .src(path.join(global.paths.src, 'jade', 'main.jade'))
        .pipe(plumber())
        .pipe(jade({
            pretty: '\t',
            locals: {
                develop: true,
                title:   '[develop] ' + pkgInfo.name,
                version: pkgInfo.version,
                weinre: weinreConfig.active,
                weinreSrc: 'http://' + ip + ':' + weinreConfig.port + '/target/target-script-min.js#' + weinreConfig.name,
                livereload: 'http://' + ip + ':' + (staticConfig.livereload === true ? 35729 : staticConfig.livereload) + '/livereload.js'
            }
        }))
        .pipe(rename('develop.html'))
        .pipe(gulp.dest(global.paths.root));
});


// generate html files
gulp.task('jade:release', function () {
    return gulp
        .src(path.join(global.paths.src, 'jade', 'main.jade'))
        .pipe(plumber())
        .pipe(jade({
            pretty: false,
            locals: {
                develop: false,
                livereload: false,
                weinre: false,
                title:   '[release] ' + pkgInfo.name,
                version: pkgInfo.version
            }
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(global.paths.root));
});


// generate all html files
gulp.task('jade', ['jade:develop', 'jade:release']);
