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
		title = 'webpack '.inverse;

	if ( err ) {
		gutil.log(title, 'FATAL ERROR'.red, err);
	} else {
		// general info
		gutil.log(title, 'hash:\t'    + json.hash.bold);
		gutil.log(title, 'version:\t' + json.version.bold);
		gutil.log(title, 'time:\t'    + json.time.toString().bold + ' ms');

		// title and headers
		gutil.log(title, 'ASSETS'.green);
		gutil.log(title, '\tSize\tName'.grey);
		// data
		json.assets.forEach(function ( asset ) {
			gutil.log(title, '\t' + asset.size + '\t' + asset.name.bold);
		});

		// title and headers
		gutil.log(title, 'MODULES'.green);
		gutil.log(title, '\tID\tSize\tErrs\tWarns\tName'.grey);

		// sort modules by name (not always is necessary)
		//json.modules.sort(function ( a, b ) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });

		// data
		json.modules.forEach(function ( module ) {
			gutil.log(title, '\t' +
				module.id + '\t' +
				module.size + '\t' +
				(module.errors > 0 ? module.errors.toString().red : '0') + '\t' +
				(module.warnings > 0 ? module.warnings.toString().yellow : '0') + '\t' +
				(module.name.indexOf('./') === 0 ? module.name.replace(/\//g, '/'.grey) : module.name.grey)
			);
		});

		json.errors.forEach(function ( error, errorIndex ) {
			gutil.log(title, ('ERROR #' + errorIndex).red);
			error.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					gutil.log(title, line.bold);
				} else {
					gutil.log(title, '\t' + line.grey);
				}
			});
		});

		json.warnings.forEach(function ( warning, warningIndex ) {
			gutil.log(title, ('WARNING #' + warningIndex).yellow);
			warning.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					gutil.log(title, line.bold);
				} else {
					gutil.log(title, '\t' + line.grey);
				}
			});
		});
	}
}


// public export
module.exports = {
	webpack: webpack
};
