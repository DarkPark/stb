/**
 * stbEvent wrapper component
 *
 * @module stb/targets/stb/event
 * @author Aleynikov Boris <alynikov.boris@gmail.com>.
 */

'use strict';

var app = require('../../app'),
	event = {};

/**
 * @instance
 * @type {Emitter}
 */


// Creating stbEvent instance
window.stbEvent = {};


/**
 * Device media events
 *
 * @event module:stb/app#media
 * @type object
 * @property {number} code of event
 */

/**
 * Event on messages from a window
 *
 * @event module:stb/app#message
 * @type object
 * @property {boolean} broadcast message flag
 * @property {string} message received from window
 * @property {object} data received from window
 */


/**
 * Fires stb device media events
 *
 * @param {number} event code
 */
window.stbEvent.onEvent = function ( event ) {
	app.emit('media', {code: parseInt(event, 10)});
};


/**
 * Fires event on broadcast messages from a window
 *
 * @param {number} windowId that sent message
 * @param {string} message text
 * @param {object} data in sent message
 * @fires module:/stb/app#message
 */
window.stbEvent.onBroadcastMessage = function ( windowId, message, data ) {
	app.emit('message', {
		broadcast: true,
		windowId: windowId,
		message: message,
		data: data
	});
};


/**
 * Fires event on messages from a window
 *
 * @param {number} windowId that sent message
 * @param {string} message text
 * @param {object} data in sent message
 * @fires module:/stb/app#message
 */
window.stbEvent.onMessage = function ( windowId, message, data ) {
	app.emit('message', {
		broadcast: false,
		windowId: windowId,
		message: message,
		data: data
	});
};

/**
 * Event on device mount state
 *
 * @event module:stb/app#mount
 * @type object
 * @property {boolean} state of mount device
 */


/**
 * Fires device mount state event
 *
 * @param {boolean} state of mount device
 * @fires module:/stb/app#mount
 */
window.stbEvent.onMount = function ( state ) {
	app.emit('device:mount', {state: state});
};


/**
 * Event on callback on internet browser link clicked
 *
 * @event module:stb/app#media:available
 */

/**
 * Fires event of callback on internet browser link clicked to ask user what to do with link: play or download
 *
 * @fires module:/stb/app#media:available
 */
window.stbEvent.onMediaAvailable = function () {
	app.emit('media:available');
};


/**
 * Event on internet connection state
 *
 * @event module:stb/app#internet:state
 * @type object
 * @property {boolean} state of internet connection
 */

/**
 * FIres new internet connection state event
 *
 * @param {boolean} state of internet connection
 * @fires module:/stb/app#internet:state
 */
window.stbEvent.onNetworkStateChange = function ( state ) {
	app.emit('internet:state', {state: state});
};


/**
 * Event on document loading progress changes
 *
 * @event module:stb/app#browser:progress
 * @type object
 * @property {number} progress of document loading
 */


/**
 * Fires document loading progress changes event
 *
 * @param {number} progress of document loading
 * fires module:/stb/app#browser:progress
 */
window.stbEvent.onWebBrowserProgress = function ( progress ) {
	app.emit('browser:progress', {progress: progress});
};


/**
 * Event on browser web window activation event
 *
 * @event module:stb/app#window:focus
 */


/**
 * Fires browser web window activation event
 *
 * fires module:/stb/app#window:focus
 */
window.stbEvent.onWindowActivated = function () {
	app.emit('window:focus');
};


module.exports = event;
