/**
 * Load and merge base and user config files.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


// public export
module.exports = function ( name, path ) {
	var data = {},
		cfgBase, cfgUser,
		uriBase, uriUser;

	// apply path if given
	path = path || '/config/';

	// get absolute paths to config files
	uriBase = process.env.STB + path + name;
	uriUser = process.env.CWD + path + name;

	// clear previously filled data
	delete require.cache[uriBase];
	delete require.cache[uriUser];

	// base config should always be present
	cfgBase = require(uriBase);

	try {
		// try to load user config file
		cfgUser = require(uriUser);
	} catch ( e ) {}

	// get user values if possible
	Object.keys(cfgBase).forEach(function ( key ) {
		data[key] = cfgUser && cfgUser[key] || cfgBase[key];
	});

	return data;
};
