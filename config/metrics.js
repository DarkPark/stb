/**
 * Application geometry options for js/less.
 *
 * @namespace
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */
module.exports = {
	480 : {
		// screen base dimension
		height: 480,
		width : 720,
		// safe zone margins
		availTop   : 24,
		availBottom: 24,
		availRight : 32,
		availLeft  : 48
	},

	576 : {
		// screen base dimension
		height: 576,
		width : 720,
		// safe zone margins
		availTop   : 24,
		availBottom: 24,
		availRight : 28,
		availLeft  : 54
	},

	720 : {
		// screen base dimension
		height: 720,
		width : 1280,
		// safe zone margins
		availTop   : 30,
		availBottom: 30,
		availRight : 40,
		availLeft  : 40
	},

	1080: {
		// screen base dimension
		height: 1080,
		width : 1920,
		// safe zone margins
		availTop   : 40,
		availBottom: 40,
		availRight : 50,
		availLeft  : 50
	}
};
