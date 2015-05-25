/**
 * Compile all Less files into a set of css files with maps.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path     = require('path'),
	//util     = require('util'),
	gulp     = require('gulp'),
	//fs       = require('fs'),
	//log      = require('../lib/log'),
	//log      = require('gulp-util').log,
	less     = require('gulp-less'),
	plumber  = require('gulp-plumber'),
	rename   = require('gulp-rename'),
	//requirem = require('requirem'),
	//mkdirp   = require('mkdirp'),
	del      = require('del'),
	sourceMaps = require('gulp-sourcemaps'),
	minifyCSS  = require('gulp-minify-css')
	//title    = 'less    '.inverse,

	// main less options
	//defaults = {},

	// config for all modes
	// with all dimensions
	//options = {};
	;


//function prepare () {
//	// main less options
//	defaults = {
//		develop: {
//			relativeUrls     : true,
//			//paths            : [process.env.STB + '/app/less', process.env.CWD + '/app/less'],
//			paths            : ['.'],
//			rootpath         : './build/develop/' + process.env.target,
//			outpath          : './build/develop/' + process.env.target + '/css/',
//			//filename         : process.env.STB + '/app/less/entry.develop.less',
//			filename         : process.env.STB + '/app/less/develop.less',
//			//filename         : [process.env.STB + '/app/less/develop.less', process.env.CWD + '/app/less/main.less'],
//			compress         : false,
//			cleancss         : false,
//			ieCompat         : false,
//			sourceMap        : true,
//			outputSourceFiles: true,
//			sourceMapBasepath: 'build',
//			sourceMapRootpath: '.'
//		},
//		release: {
//			relativeUrls: true,
//			//paths       : [/*process.env.STB, process.env.CWD + '/app/less'*/],
//			paths       : ['.'],
//			rootpath    : './build/release/' + process.env.target,
//			outpath     : './build/release/' + process.env.target + '/css/',
//			filename    : process.env.STB + '/app/less/main.less',
//			compress    : true,
//			cleancss    : true,
//			ieCompat    : false,
//			sourceMap   : false
//		}
//	};
//
//	// prepare options sets for all dimensions
//	Object.keys(defaults).forEach(function ( mode ) {
//		var metrics = requirem(process.env.CWD + '/config/metrics.js', {reload: true});
//
//		options[mode] = {};
//
//		Object.keys(metrics).forEach(function ( height ) {
//			var conf = options[mode][height] = Object.create(defaults[mode]),
//				vars = conf.globalVars = metrics[height];
//
//			// safe zone dimension
//			// base dimension minus safe zone margins
//			vars.availHeight = vars.height - vars.availTop  - vars.availBottom;
//			vars.availWidth  = vars.width  - vars.availLeft - vars.availRight;
//
//			vars.pathApp = '"' + path.relative(process.env.STB + '/app/less', process.env.CWD + '/app/') + '"';
//
//			conf.cssFile = conf.outpath + height + '.css';
//
//			if ( conf.sourceMap ) {
//				// more preparations
//				conf.sourceMapFile  = conf.outpath + height + '.map';
//				conf.sourceMapURL   = height + '.map';
//				//conf.writeSourceMap = function ( map ) {
//				//	fs.writeFileSync(conf.sourceMapFile, map, {encoding:'utf8'});
//				//	log(title, '\t' + map.length + '\t' + conf.sourceMapFile.replace(/\//g, '/'.grey));
//				//};
//			}
//		});
//	});
//}
//
//
///**
// * Generate css files for all dimensions for the given mode.
// *
// * @param {string} mode one of task modes: "develop" or "release"
// * @param {Function} done callback to indicate task finishing
// */
//function build ( mode, done ) {
//	var less = require('less'),
//		dataBase = fs.readFileSync(defaults[mode].filename, {encoding:'utf8'}),
//		//dataUser = fs.readFileSync(process.env.CWD + '/app/less/main.less', {encoding:'utf8'}),
//		//data     = dataBase + dataUser,
//		//data     = util.format('@import "%s";\n@import "%s";', process.env.STB + '/app/less/main.less', process.env.CWD + '/app/less/main.less'),
//		keys = Object.keys(options[mode]),
//		tick = 0;
//
//	log(title, '\tSize\tName'.grey);
//
//	// dimensions
//	keys.forEach(function ( height ) {
//		var varsFileBase = process.env.STB + '/app/less/vars/' + height + '.js',
//			varsFileUser = process.env.CWD + '/app/less/vars/' + height + '.js',
//			vars, name;
//
//		// base
//		vars = requirem(varsFileBase, {reload: true});
//		// extend with less vars
//		for ( name in vars ) {
//			if ( vars.hasOwnProperty(name) ) {
//				options[mode][height].globalVars[name] = vars[name];
//			}
//		}
//
//		// user
//		if ( fs.existsSync(varsFileUser) ) {
//			vars = requirem(varsFileUser, {reload: true});
//			// extend with less vars
//			for ( name in vars ) {
//				if ( vars.hasOwnProperty(name) ) {
//					options[mode][height].globalVars[name] = vars[name];
//				}
//			}
//		}
//
//		less.render(dataBase, options[mode][height], function ( error, data ) {
//			var cssFile = options[mode][height].cssFile,
//				mapFile = options[mode][height].sourceMapFile;
//
//			//console.log(error);
//			//console.log(data);
//
//			if ( error ) {
//				log(title, '\t0\t' + cssFile.red + '\t(' + error.message + ' in ' + error.filename + ' ' + error.line + ':' + error.column + ')');
//			} else {
//				if ( options[mode][height].sourceMap ) {
//					data.css += util.format('\n/*# sourceMappingURL=%s */\n', options[mode][height].sourceMapURL);
//					fs.writeFileSync(mapFile, data.map, {encoding:'utf8'});
//				}
//				fs.writeFileSync(cssFile, data.css, {encoding:'utf8'});
//				log(title, '\t' + data.css.length + '\t' + cssFile.replace(/\//g, '/'.grey));
//			}
//
//			tick++;
//			// notify gulp
//			if ( tick === keys.length ) { done(); }
//		});
//	});
//}
//
//
//gulp.task('less:clean:develop', function ( done ) {
//	del(['./build/develop/' + process.env.target + '/css/*.css', './build/develop/' + process.env.target + '/css/*.map'], done);
//});
//
//
//gulp.task('less:clean:release', function ( done ) {
//	del(['./build/release/' + process.env.target + '/css/*.css', './build/release/' + process.env.target + '/css/*.map'], done);
//});
//
//
//gulp.task('less:clean', ['less:clean:develop', 'less:clean:release']);
//
//
//gulp.task('less:develop', function ( done ) {
//	prepare();
//	mkdirp.sync('./build/develop/' + process.env.target + '/css');
//	build('develop', done);
//});
//
//
//gulp.task('less:release', function ( done ) {
//	prepare();
//	mkdirp.sync('./build/release/' + process.env.target + '/css');
//	build('release', done);
//});
//
//
//gulp.task('less', ['less:develop', 'less:release']);


/**
 * Get all vars and merge them in a single list to import in less.
 *
 * @param {number} resolution window height
 *
 * @return {Object} var list
 */
function prepare ( resolution ) {
	var mName   = path.join(global.paths.root, 'config', 'metrics.js'),
		vName   = path.join(global.paths.app, 'less', 'vars', resolution + '.js'),
		metrics = require(mName)[resolution],
		stbVars = require(vName);

	// clear cache
	delete require.cache[mName];
	delete require.cache[vName];

	// safe zone dimension
	// base dimension minus safe zone margins
	metrics.availHeight = metrics.height - metrics.availTop  - metrics.availBottom;
	metrics.availWidth  = metrics.width  - metrics.availLeft - metrics.availRight;

	// extend with stb vars
	Object.keys(stbVars).forEach(function ( name ) {
		metrics[name] = stbVars[name];
	});

	// application paths
	metrics.pathApp     = '"' + global.paths.app + '"';
	metrics.pathImg     = '"../img/' + resolution + '"';
	metrics.pathImgFull = '"' + path.join(global.paths.app, 'img', resolution.toString()) + '"';

	return metrics;
}


/**
 * Generate develop css files for the given graphical mode.
 *
 * @param {number} resolution window height
 *
 * @return {Object} result stream
 */
function develop ( resolution ) {
	var vars = prepare(resolution);

	// additional vars
	vars.mode = 'develop';

	return gulp.src(path.join(global.paths.app, 'less', resolution + '.less'))
		.pipe(plumber())
		.pipe(sourceMaps.init())
		.pipe(less({
			ieCompat: false,
			globalVars: vars
			//paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(rename('develop.' + resolution + '.css'))
		.pipe(sourceMaps.write('./'))
		.pipe(gulp.dest(path.join(global.paths.build, 'css')));
}


/**
 * Generate release css files for the given graphical mode.
 *
 * @param {number} resolution window height
 *
 * @return {Object} result stream
 */
function release ( resolution ) {
	var vars = prepare(resolution);

	// additional vars
	vars.mode = 'release';

	return gulp.src(path.join(global.paths.app, 'less', resolution + '.less'))
		.pipe(plumber())
		.pipe(less({
			ieCompat: false,
			globalVars: vars
			//paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(rename('release.' + resolution + '.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(path.join(global.paths.build, 'css')));
}


// remove all css files
gulp.task('less:clean', function ( done ) {
	del([path.join(global.paths.build, 'css', '**')], done);
});

// generate develop css files
gulp.task('less:develop:480',  function () { return develop( 480); });
gulp.task('less:develop:576',  function () { return develop( 576); });
gulp.task('less:develop:720',  function () { return develop( 720); });
gulp.task('less:develop:1080', function () { return develop(1080); });

// generate release css files
gulp.task('less:release:480',  function () { return release( 480); });
gulp.task('less:release:576',  function () { return release( 576); });
gulp.task('less:release:720',  function () { return release( 720); });
gulp.task('less:release:1080', function () { return release(1080); });

// generate all css files
gulp.task('less:develop', ['less:develop:480', 'less:develop:576', 'less:develop:720', 'less:develop:1080']);
gulp.task('less:release', ['less:release:480', 'less:release:576', 'less:release:720', 'less:release:1080']);

// generate all css files
gulp.task('less', ['less:develop', 'less:release']);
