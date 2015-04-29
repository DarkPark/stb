/**
 * stbEvent wrapper component
 *
 * @module stb/targets/stb/event
 * @author Aleynikov Boris <alynikov.boris@gmail.com>.
 */

'use strict';

var	Emitter = require('stb/emitter'),
	app		= require('stb/app'),
	event;

/**
 * @instance
 * @type {Emitter}
 */
event = new Emitter();


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
 * @property {object} data recived from window
 */



/**
 * Fires stb device media events
 *
 * @param e
 * @fires module:stb/app#media
 */
stbEvent.onEvent = function ( e ) {
	e = parseInt(e, 10);
	app.emit('media', {code: e});
};


/**
 * Fires event on broadcast messages from a window
 *
 * @param windowId
 * @param message
 * @param data
 * @fires module:/stb/app#message
 */
stbEvent.onBroadcastMessage = function ( windowId, message, data ) {
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
 * @param windowId
 * @param message
 * @param data
 * @fires module:/stb/app#message
 */
stbEvent.onMessage = function ( windowId, message, data ) {
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
 * @param state
 * @fires module:/stb/app#mount
 */
stbEvent.onMount = function ( state ) {
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
stbEvent.onMediaAvailable = function () {
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
 * @param state
 * @fires module:/stb/app#internet:state
 */
stbEvent.onNetworkStateChange = function ( state ) {
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
 * @param p
 * fires module:/stb/app#browser:progress
 */
stbEvent.onWebBrowserProgress = function ( p ) {
	app.emit('browser:progress', {progress: p});
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
stbEvent.onWindowActivated = function () {
	app.emit('window:focus');
};


module.exports = event;
