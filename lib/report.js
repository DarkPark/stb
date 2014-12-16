/**
 * Custom reporters.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gutil = require('gulp-util');

/**
 * Callback to output the statistics.
 *
 * @param {Object} err problem description structure if any
 * @param {Object} stats data to report
 */
function webpack ( err, stats ) {
	var json  = stats.toJson({source:false}),
		title = 'webpack:';

	if ( err ) {
		gutil.log(title, gutil.colors.red('FATAL ERROR'), err);
	} else {
		// general info
		gutil.log(title, 'hash:',    gutil.colors.bold(json.hash));
		gutil.log(title, 'version:', gutil.colors.bold(json.version));
		gutil.log(title, 'time:',    gutil.colors.bold(json.time));

		// title and headers
		gutil.log(title, gutil.colors.green('ASSETS'));
		gutil.log(title, gutil.colors.grey('\tSize\tName'));
		// data
		json.assets.forEach(function ( asset ) {
			gutil.log(title, '\t' + asset.size + '\t' + gutil.colors.bold(asset.name));
		});

		// title and headers
		gutil.log(title, gutil.colors.green('MODULES'));
		gutil.log(title, gutil.colors.grey('\tNo\tID\tSize\tErrs\tWarns\tName'));

		// sort modules by name (not always is necessary)
		//json.modules.sort(function ( a, b ) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });

		// data
		json.modules.forEach(function ( module, index ) {
			gutil.log(title, '\t' +
				(index + 1) + '\t' +
				module.id + '\t' +
				module.size + '\t' +
				(module.errors > 0 ? gutil.colors.red(module.errors) : '0') + '\t' +
				(module.warnings > 0 ? gutil.colors.yellow(module.warnings) : '0') + '\t' +
				(module.name.indexOf('(webpack)') === 0 || module.name[0] === '/' ? gutil.colors.grey(module.name) : module.name.replace(/\//g, gutil.colors.grey('/')))
			);
		});

		json.errors.forEach(function ( error, errorIndex ) {
			gutil.log(title, gutil.colors.red('ERROR #' + errorIndex));
			error.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					gutil.log(title, gutil.colors.bold(line));
				} else {
					gutil.log(title, '\t' + gutil.colors.grey(line));
				}
			});
		});

		json.warnings.forEach(function ( warning, warningIndex ) {
			gutil.log(title, gutil.colors.yellow('WARNING #' + warningIndex));
			warning.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					gutil.log(title, gutil.colors.bold(line));
				} else {
					gutil.log(title, '\t' + gutil.colors.grey(line));
				}
			});
		});
	}
}


// public export
module.exports = {
	webpack: webpack
};
