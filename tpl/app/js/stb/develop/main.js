/**
 * Main module to setup development environment.
 *
 * @module stb/develop/main
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var app     = require('../app'),
    storage = require('./storage'),
    metrics = require('../../../../config/metrics');


window.localStorage = window.localStorage || window.stbStorage || (window.parent !== window ? window.parent.localStorage || window.parent.stbStorage : null);

// set global mode
app.data.debug = true;

// STB device or emulation?
app.data.host = !!(window.gSTB || (window.parent && (window.parent.gSTB || window.parent.host)));

// platform?
if ( app.data.host ) {
    // web inspector
    require('./weinre');
}

// apply screen size, position, margins and styles
if ( localStorage && localStorage.getItem('screen.height') ) {
    app.setScreen(metrics[localStorage.getItem('screen.height')]);
} else {
    app.setScreen(
        metrics[screen.height] ||
        metrics[720]
    );
}


// additional dev modules
require('./shims');
require('./static');
require('./proxy');
require('./events');
require('./debug');
require('./overrides');

// the application itself
require('../../main');
