/**
 * Remote STB device connection configuration.
 *
 * Available template variables:
 *     {host} - client ip where this gulp task is running
 *     {port} - client port where this gulp task is running
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// public
module.exports = {
	// turn on/off
	active: false,

	// default config used as a base
	// options from profiles redefine these values
	defaults: {
		host: '',
		port: 22,
		username: 'root',
		password: '930920'
	},

	// set of named configs
	// each profile will create a corresponding gulp task
	// e.g. profile "reboot" -> gulp task "ssh:reboot"
	profiles: {
		// restart device
		reboot: {
			exec: 'reboot'
		},

		// stbapp process info
		status: {
			exec: 'cat /proc/$(pidof stbapp)/status'
		},

		// force stop stbapp process
		kill: {
			exec: 'killall -9 stbapp'
		},

		// paint black the screen
		clear: {
			exec: 'fbdump -c'
		},

		// usual stb start
		test: {
			exec: 'killall stbapp; /test.sh'
		},

		// direct internal portal start
		portal: {
			exec: 'killall stbapp; /usr/share/qt-4.6.0/stbapp -qws -display directfb "/home/web/services.html"'
		},

		// extends the default config
		develop: {
			exec: 'killall stbapp; /usr/share/qt-4.6.0/stbapp -qws -display directfb http://%host%:%port%/develop.html'
		},

		// extends the default config
		release: {
			exec: 'killall stbapp; /usr/share/qt-4.6.0/stbapp -qws -display directfb http://%host%:%port%/index.html'
		}
	}
};
