/**
 * Less variables specific for this resolution.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var vars = require('./720');

// multiply by 1.5 all vars
Object.keys(vars).forEach(function ( name ) {
	vars[name] = vars[name] * 1.5;
});

// public export
module.exports = vars;
