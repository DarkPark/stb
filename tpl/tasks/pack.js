/**
 * Pack a specific build into zip archive.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
    util    = require('util'),
    gulp    = require('gulp'),
    log     = require('gulp-util').log,
    plumber = require('gulp-plumber'),
    zip     = require('gulp-zip'),
    del     = require('del'),
    pkgInfo = require(path.join(global.paths.root, 'package.json')),
    zipName = 'build.%s.%s.%s.zip',
    title   = 'pack    '.inverse;


// remove all pack zip files
gulp.task('pack:clean', function () {
    return del([path.join(global.paths.root, util.format(zipName, '*', '*', '*'))]);
});


// create archive
gulp.task('pack:develop', function () {
    var outName = util.format(zipName, pkgInfo.name, pkgInfo.version, 'develop');

    log(title, 'create archive: ' + outName.bold);

    return gulp.src([
        path.join(global.paths.app, 'font', '**', '*'),
        path.join(global.paths.app, 'img', '**', '*'),
        path.join(global.paths.app, 'css', 'develop.*'),
        path.join(global.paths.app, 'js', 'develop.*'),
        path.join(global.paths.app, 'develop.html')
    ], {base: global.paths.app})
        .pipe(plumber())
        .pipe(zip(outName))
        .pipe(gulp.dest(global.paths.root));
});


// create archive
gulp.task('pack:release', function () {
    var outName = util.format(zipName, pkgInfo.name, pkgInfo.version, 'release');

    log(title, 'create archive: ' + outName.bold);

    return gulp.src([
        path.join(global.paths.app, 'font', '**', '*'),
        path.join(global.paths.app, 'img', '**', '*'),
        path.join(global.paths.app, 'css', 'release.*'),
        path.join(global.paths.app, 'js', 'release.*'),
        path.join(global.paths.app, 'index.html')
    ], {base: global.paths.app})
        .pipe(plumber())
        .pipe(zip(outName))
        .pipe(gulp.dest(global.paths.root));
});


// create all archives
gulp.task('pack', ['pack:develop', 'pack:release']);
