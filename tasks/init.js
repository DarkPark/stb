/**
 * Initial creation of all necessary files and folders.
 * Has smart conflict resolution mechanism.
 * Installs all necessary package dependencies.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs    = require('fs'),
	npm   = require('npm'),
	path  = require('path'),
	gulp  = require('gulp'),
	gutil = require('gulp-util');


gulp.task('init', function () {
	console.log(gutil.colors.green('project structure cloning ...'));
	// copy template files to the current dir
	gulp.src([__dirname + '/../tpl/**', path.join(__dirname, '..', '.eslintrc')])
		.pipe(require('gulp-conflict')('./'))
		.pipe(gulp.dest('./'))
		.on('end', function () {
			// copy config files to the current dir
			gulp.src(__dirname + '/../config/**', {base: path.join(__dirname, '..')})
				.pipe(require('gulp-conflict')('./'))
				.pipe(gulp.dest('./'))
				.on('end', function () {
					console.log(gutil.colors.green('done'));

					fs.mkdirSync('./build/develop');
					fs.mkdirSync('./build/release');
					fs.mkdirSync('./build/develop/css');
					fs.mkdirSync('./build/release/css');

					npm.load({loaded: false}, function ( error ) {
						var config = require(path.join(process.env.CWD, 'package.json')),
							pkgSet = [];

						if ( error ) {
							console.log(error);
							return;
						}

						// section is present
						if ( typeof config.dependencies === 'object' ) {
							// build package name@version list
							Object.keys(config.dependencies).forEach(function ( name ) {
								pkgSet.push(name + '@' + config.dependencies[name]);
							});

							// there are some packages to install
							if ( pkgSet.length > 0 ) {
								console.log(gutil.colors.green('\ninstalling dependencies ...'));

								// do the installation
								npm.commands.install(pkgSet, function ( error ) {
									if ( error ) {
										console.log(error);
									} else {
										console.log(gutil.colors.green('done'));
									}
								});
								npm.on('log', function ( message ) {
									// log the progress of the installation
									console.log(message);
								});
							}
						}
					});
				});
		});
});
