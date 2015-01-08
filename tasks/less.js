/**
 * Compile all Less files into a set of css files with maps.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

//TODO: fix source maps
//TODO: rework metrics processing

var path     = require('path'),
	util     = require('util'),
	gulp     = require('gulp'),
	fs       = require('fs'),
	log      = require('../lib/log'),
	requirem = require('requirem'),
	del      = require('del'),
	cfgBase  = process.env.STB + '/config/metrics.js',
	cfgUser  = process.env.CWD + '/config/metrics.js',
	title    = 'less    '.inverse,


	// main less options
	defaults = {
		develop: {
			relativeUrls     : true,
			//paths            : [process.env.STB + '/app/less', process.env.CWD + '/app/less'],
			paths            : ['.'],
			rootpath         : './build/develop/',
			outpath          : './build/develop/css/',
			//filename         : process.env.STB + '/app/less/entry.develop.less',
			filename         : process.env.STB + '/app/less/develop.less',
			//filename         : [process.env.STB + '/app/less/develop.less', process.env.CWD + '/app/less/main.less'],
			compress         : false,
			cleancss         : false,
			ieCompat         : false,
			sourceMap        : true,
			outputSourceFiles: true,
			sourceMapBasepath: 'build',
			sourceMapRootpath: '.'
		},
		release: {
			relativeUrls: true,
			//paths       : [/*process.env.STB, process.env.CWD + '/app/less'*/],
			paths       : ['.'],
			rootpath    : './build/release/',
			outpath     : './build/release/css/',
			filename    : process.env.STB + '/app/less/main.less',
			compress    : true,
			cleancss    : true,
			ieCompat    : false,
			sourceMap   : false
		}
	},
	// config for all modes
	// with all dimensions
	options = {};


function prepare () {
	// prepare options sets for all dimensions
	Object.keys(defaults).forEach(function ( mode ) {
		var metrics = requirem(fs.existsSync(cfgUser) ? cfgUser : cfgBase, {reload: true});

		options[mode] = {};

		Object.keys(metrics).forEach(function ( height ) {
			var conf = options[mode][height] = Object.create(defaults[mode]),
				vars = conf.globalVars = metrics[height];

			// safe zone dimension
			// base dimension minus safe zone margins
			vars.availHeight = vars.height - vars.availTop  - vars.availBottom;
			vars.availWidth  = vars.width  - vars.availLeft - vars.availRight;

			vars.pathApp = '"' + path.relative(process.env.STB + '/app/less', process.env.CWD + '/app/less') + '"';

			conf.cssFile = conf.outpath + height + '.css';

			if ( conf.sourceMap ) {
				// more preparations
				conf.sourceMapFile  = conf.outpath + height + '.map';
				conf.sourceMapURL   = height + '.map';
				//conf.writeSourceMap = function ( map ) {
				//	fs.writeFileSync(conf.sourceMapFile, map, {encoding:'utf8'});
				//	log(title, '\t' + map.length + '\t' + conf.sourceMapFile.replace(/\//g, '/'.grey));
				//};
			}
		});
	});
}


/**
 * Generate css files for all dimensions for the given mode.
 *
 * @param {string} mode one of task modes: "develop" or "release"
 * @param {Function} done callback to indicate task finishing
 */
function build ( mode, done ) {
	var less = require('less'),
		dataBase = fs.readFileSync(defaults[mode].filename, {encoding:'utf8'}),
		//dataUser = fs.readFileSync(process.env.CWD + '/app/less/main.less', {encoding:'utf8'}),
		//data     = dataBase + dataUser,
		//data     = util.format('@import "%s";\n@import "%s";', process.env.STB + '/app/less/main.less', process.env.CWD + '/app/less/main.less'),
		keys = Object.keys(options[mode]),
		tick = 0;

	log(title, '\tSize\tName'.grey);

	// dimensions
	keys.forEach(function ( height ) {
		var varsFileBase = process.env.STB + '/app/less/vars/' + height + '.js',
			varsFileUser = process.env.CWD + '/app/less/vars/' + height + '.js',
			vars, name;

		// base
		vars = requirem(varsFileBase, {reload: true});
		// extend with less vars
		for ( name in vars ) {
			if ( vars.hasOwnProperty(name) ) {
				options[mode][height].globalVars[name] = vars[name];
			}
		}

		// user
		if ( fs.existsSync(varsFileUser) ) {
			vars = requirem(varsFileUser, {reload: true});
			// extend with less vars
			for ( name in vars ) {
				if ( vars.hasOwnProperty(name) ) {
					options[mode][height].globalVars[name] = vars[name];
				}
			}
		}

		less.render(dataBase, options[mode][height], function ( error, data ) {
			var cssFile = options[mode][height].cssFile,
				mapFile = options[mode][height].sourceMapFile;

			//console.log(error);
			//console.log(data);

			if ( error ) {
				log(title, '\t0\t' + cssFile.red + '\t(' + error.message + ' in ' + error.filename + ' ' + error.line + ':' + error.column + ')');
			} else {
				if ( options[mode][height].sourceMap ) {
					data.css += util.format('\n/*# sourceMappingURL=%s */\n', options[mode][height].sourceMapURL);
					fs.writeFileSync(mapFile, data.map, {encoding:'utf8'});
				}
				fs.writeFileSync(cssFile, data.css, {encoding:'utf8'});
				log(title, '\t' + data.css.length + '\t' + cssFile.replace(/\//g, '/'.grey));
			}

			tick++;
			// notify gulp
			if ( tick === keys.length ) { done(); }
		});
	});
}


gulp.task('less:clean:develop', function ( done ) {
	del(['./build/develop/css/*.css', './build/develop/css/*.map'], done);
});


gulp.task('less:clean:release', function ( done ) {
	del(['./build/release/css/*.css', './build/release/css/*.map'], done);
});


gulp.task('less:clean', ['less:clean:develop', 'less:clean:release']);


gulp.task('less:develop', function ( done ) {
	prepare();
	build('develop', done);
});


gulp.task('less:release', function ( done ) {
	prepare();
	build('release', done);
});


gulp.task('less', ['less:develop', 'less:release']);
