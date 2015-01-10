/**
 * Main command-line entry point.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path = require('path');


// set env vars for current working dir
// and the dir with this stb package
process.env.CWD = process.cwd();
process.env.STB = path.join(__dirname, '..', '..');


// enable colors in console
require('tty-colors');

// setup gulp tasks
require('./gulp');

// parse arguments and run
require('./program');
