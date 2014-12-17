/**
 * Remote STB device connection configuration.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public export
module.exports = {
	// turn on/off
	active: false,

	// default config
	defaults: {
		host: '192.168.1.*',
		port: 22,
		user: 'root',
		pass: '930920',
		key:  '',
		url:  '',
		exec: 'killall stbapp; /usr/share/qt-4.6.0/stbapp -qws -display directfb http://%s:%s/%s'
	},

	// set of named configs
	profiles: {
		// extends the base profile
		develop: {
			url: 'develop/'
		},

		// extends the base profile
		release: {
			url: 'release/'
		}
	}
};
