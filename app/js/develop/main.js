/**
 * Main module to setup development environment.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app     = require('../app'),
	storage = require('./storage'),
	metrics = require('../../../config/metrics');


// export to globals for easy debugging
window.app    = app;
window.router = require('../router');

// set global mode
app.data.debug = true;

// STB device or emulation?
app.data.host = (window.gSTB !== undefined);

// platform?
if ( app.data.host ) {
	// web inspector
	require('./weinre');
}

// apply screen size, position and margins
app.setScreen(
	metrics[storage.get('screen.height')] ||
	metrics[screen.height] ||
	metrics[720]
);


// additional dev modules
require('./static');
require('./proxy');
require('./events');
require('./debug');

// the application itself
require('app/main');
