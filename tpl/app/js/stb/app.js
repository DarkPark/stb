/**
 * @module stb/app
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Model    = require('./model'),
	router   = require('./router'),
	keys     = require('./keys'),
	keyCodes = {},
	app, key;


require('./shims');


/**
 * @instance
 * @type {Model}
 */
app = new Model({
	/**
	 * Enable logging and debugging flag set by debug module at runtime.
	 *
	 * @type {boolean}
	 */
	debug: false,

	/**
	 * True if executed on the STB device, set by debug module at runtime.
	 *
	 * @type {boolean}
	 */
	host: true,

	/**
	 * Screen geometry and margins.
	 *
	 * @type {Object}
	 * @property {number} height Total screen height
	 * @property {number} width Total screen width
	 * @property {number} availTop top safe zone margin
	 * @property {number} availRight right safe zone margin
	 * @property {number} availBottom bottom safe zone margin
	 * @property {number} availLeft left safe zone margin
	 * @property {number} availHeight safe zone height
	 * @property {number} availWidth safe zone width
	 */
	screen: null,

	/**
	 * Timestamps data.
	 *
	 * @type {Object}
	 * @property {number} init application initialization time (right now)
	 * @property {number} load document onload event
	 * @property {number} done onload event sent and processed
	 */
	time: {
		init: +new Date(),
		load: 0,
		done: 0
	}
});


/**
 * Set crops, total, content size and link the corresponding CSS file.
 *
 * @param {Object} metrics screen params specific to resolution
 *
 * @return {boolean} operation status
 */
app.setScreen = function ( metrics ) {
	var linkCSS;

	if ( DEBUG ) {
		if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
	}

	if ( metrics ) {
		if ( DEBUG ) {
			if ( typeof metrics !== 'object' ) { throw 'wrong metrics type'; }
		}

		// calculate and extend
		metrics.availHeight = metrics.height - (metrics.availTop + metrics.availBottom);
		metrics.availWidth  = metrics.width - (metrics.availLeft + metrics.availRight);

		// set max browser window size
		window.moveTo(0, 0);
		window.resizeTo(metrics.width, metrics.height);

		// get the link tag
		linkCSS = document.querySelector('link[rel=stylesheet]');

		// already was initialized
		if ( linkCSS && linkCSS instanceof HTMLLinkElement ) {
			// remove all current CSS styles
			document.head.removeChild(linkCSS);
		}

		// load CSS file base on resolution
		linkCSS = document.createElement('link');
		linkCSS.rel  = 'stylesheet';
		linkCSS.href = 'css/' + (DEBUG ? 'develop.' : 'release.') + metrics.height + '.css?' + +new Date();
		document.head.appendChild(linkCSS);

		// provide global access
		this.data.screen = metrics;

		return true;
	}

	// nothing has applied
	return false;
};

// define events constants

/**
 * The player reached the end of the media content or detected a discontinuity of the stream
 *
 * @const {number} EVENT_END_OF_FILE
 * @default 1
 */
app.EVENT_END_OF_FILE = 1;

/**
 * Information on audio and video tracks of the media content is received. It's now possible to call gSTB.GetAudioPIDs etc.
 *
 * @const {number} EVENT_GET_MEDIA_INFO
 * @default 2
 */
app.EVENT_GET_MEDIA_INFO = 2;

/**
 * Video and/or audio playback has begun
 *
 * @const {number} EVENT_PLAYBACK_BEGIN
 * @default 4
 */
app.EVENT_PLAYBACK_BEGIN = 4;

/**
 * Error when opening the content: content not found on the server or connection with the server was rejected
 *
 * @const {number} EVENT_CONTENT_ERROR
 * @default 5
 */
app.EVENT_CONTENT_ERROR = 5;

/**
 * Detected DualMono AC-3 sound
 *
 * @const {number} EVENT_DUAL_MONO_DETECT
 * @default 6
 */
app.EVENT_DUAL_MONO_DETECT = 6;

/**
 * The decoder has received info about the content and started to play. It's now possible to call gSTB.GetVideoInfo
 *
 * @const {number} EVENT_INFO_GET
 * @default 7
 */
app.EVENT_INFO_GET = 7;

/**
 * Error occurred while loading external subtitles
 *
 * @const {number} EVENT_SUBTITLE_LOAD_ERROR
 * @default 8
 */
app.EVENT_SUBTITLE_LOAD_ERROR = 8;

/**
 * Found new teletext subtitles in stream
 *
 * @const {number} EVENT_SUBTITLE_FIND
 * @default 9
 */
app.EVENT_SUBTITLE_FIND = 9;

/**
 * HDMI device has been connected
 *
 * @const {number} EVENT_HDMI_CONNECT
 * @default 32
 */
app.EVENT_HDMI_CONNECT = 32;

/**
 * HDMI device has been disconnected
 *
 * @const {number} EVENT_HDMI_DISCONNECT
 * @default 33
 */
app.EVENT_HDMI_DISCONNECT = 33;

/**
 * Recording task has been finished successfully. See Appendix 13. JavaScript API for PVR subsystem
 *
 * @const {number} EVENT_RECORD_FINISH_SUCCESSFULL
 * @default 34
 */
app.EVENT_RECORD_FINISH_SUCCESSFULL = 34;

/**
 * Recording task has been finished with error. See Appendix 13. JavaScript API for PVR subsystem
 *
 * @const {number} EVENT_RECORD_FINISH_ERROR
 * @default 35
 */
app.EVENT_RECORD_FINISH_ERROR = 35;

/**
 * Scanning DVB Channel in progress
 *
 * @const {number} EVENT_DVB_SCANING
 * @default 40
 */
app.EVENT_DVB_SCANING = 40;

/**
 * Scanning DVB Channel found
 *
 * @const {number} EVENT_DVB_FOUND
 * @default 41
 */
app.EVENT_DVB_FOUND = 41;

/**
 * DVB Channel EPG update
 *
 * @const {number} EVENT_DVB_CHANELL_EPG_UPDATE
 * @default 42
 */
app.EVENT_DVB_CHANELL_EPG_UPDATE = 42;

/**
 * DVB antenna power off
 *
 * @const {number} EVENT_DVB_ANTENNA_OFF
 * @default 43
 */
app.EVENT_DVB_ANTENNA_OFF = 43;


// apply screen size, position and margins
app.setScreen(require('../../../config/metrics')[screen.height]);


// extract key codes
for ( key in keys ) {
	if ( key === 'volumeUp' || key === 'volumeDown' ) {
		continue;
	}
	// no need to save key names
	keyCodes[keys[key]] = true;
}


/**
 * The load event is fired when a resource and its dependent resources have finished loading.
 *
 * Control flow:
 *   1. Global handler.
 *   2. Each page handler.
 *   3. Application DONE event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('load', function globalEventListenerLoad ( event ) {
	//var path;

	debug.event(event);

	// time mark
	app.data.time.load = event.timeStamp;

	// global handler
	// there are some listeners
	if ( app.events[event.type] !== undefined ) {
		// notify listeners
		app.emit(event.type, event);
	}

	// local handler on each page
	router.pages.forEach(function forEachPages ( page ) {
		debug.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');

		// there are some listeners
		if ( page.events[event.type] !== undefined ) {
			// notify listeners
			page.emit(event.type, event);
		}
	});

	/* disable as nobody uses this and it works not as desired
	// go to the given page if set
	if ( location.hash ) {
		path = router.parse(location.hash);
		router.navigate(path.name, path.data);
	}/**/

	// time mark
	app.data.time.done = +new Date();

	// everything is ready
	// and there are some listeners
	if ( app.events['done'] !== undefined ) {
		// notify listeners
		app.emit('done', event);
	}
});


/**
 * The unload event is fired when the document or a child resource is being unloaded.
 *
 * Control flow:
 *   1. Each page handler.
 *   2. Global handler.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('unload', function globalEventListenerUnload ( event ) {
	debug.event(event);

	// global handler
	// there are some listeners
	if ( app.events[event.type] !== undefined ) {
		// notify listeners
		app.emit(event.type, event);
	}

	// local handler on each page
	router.pages.forEach(function forEachPages ( page ) {
		// there are some listeners
		if ( page.events[event.type] !== undefined ) {
			// notify listeners
			page.emit(event.type, event);
		}
	});
});


///**
// * The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol).
// * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/hashchange
// */
//window.addEventListener('hashchange', function globalEventListenerHashChange ( event ) {
//	//var page, data;
//
//	console.log(event);
//	router.emit('change');
//
//	//debug.event(event);
//	//debug.inspect(event);
//    //
//	//app.emit(event.type, event);
//
//	//app.parseHash();
//
////	data = document.location.hash.split('/');
////
////	// the page is given
////	if ( data.length > 0 && (page = decodeURIComponent(data.shift().slice(1))) ) {
////		// the page params are given
////		if ( data.length > 0 ) {
////			data = data.map(decodeURIComponent);
////		}
////
////		app.emit(event.type, {page: page, data: data});
////	}
//});


/**
 * The error event is fired when a resource failed to load.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('error', function globalEventListenerError ( event ) {
	debug.event(event);
});


/**
 * The keydown event is fired when a key is pressed down.
 * Set event.stop to true in order to prevent bubbling.
 *
 * Control flow:
 *   1. Current active component on the active page.
 *   2. Current active page itself.
 *   3. Application.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('keydown', function globalEventListenerKeydown ( event ) {
	var page = router.current;

	if ( DEBUG ) {
		if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
	}

	// filter phantoms
	if ( event.keyCode === 0 ) { return; }

	// combined key code
	event.code = event.keyCode;

	// apply key modifiers
	if ( event.shiftKey ) { event.code += 1000; }
	if ( event.altKey )   { event.code += 2000; }

	debug.event(event);

	// current component handler
	if ( page.activeComponent && page.activeComponent !== page ) {
		// component is available and not page itself
		if ( page.activeComponent.events[event.type] !== undefined ) {
			// there are some listeners
			page.activeComponent.emit(event.type, event);
		}
	}

	// page handler
	if ( !event.stop ) {
		// not prevented
		if ( page.events[event.type] !== undefined ) {
			// there are some listeners
			page.emit(event.type, event);
		}
	}

	// global app handler
	if ( !event.stop ) {
		// not prevented
		if ( app.events[event.type] !== undefined ) {
			// there are some listeners
			app.emit(event.type, event);
		}
	}

	// suppress non-printable keys in stb device (not in your browser)
	if ( app.data.host && keyCodes[event.code] ) {
		event.preventDefault();
	}
});


/**
 * The keypress event is fired when press a printable character.
 * Delivers the event only to activeComponent at active page.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
 *
 * @param {Event} event generated object with event data
 * @param {string} event.char entered character
 */
window.addEventListener('keypress', function globalEventListenerKeypress ( event ) {
	var page = router.current;

	if ( DEBUG ) {
		if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
	}

	//debug.event(event);

	// current component handler
	if ( page.activeComponent && page.activeComponent !== page ) {
		// component is available and not page itself
		if ( page.activeComponent.events[event.type] !== undefined ) {
			// there are some listeners
			page.activeComponent.emit(event.type, event);
		}
	}
});


/**
 * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('click', function globalEventListenerClick ( event ) {
	debug.event(event);
});


/**
 * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
 * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
 * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('contextmenu', function globalEventListenerContextmenu ( event ) {
	//var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));

	debug.event(event);

	//kbEvent.type    = 'keydown';
	//kbEvent.keyCode = 8;

	//debug.log(kbEvent.type);

	//globalEventListenerKeydown(kbEvent);
	//var event = document.createEvent('KeyboardEvent');
	//event.initEvent('keydown', true, true);

	//document.dispatchEvent(kbEvent);

	if ( !DEBUG ) {
		// disable right click in release mode
		event.preventDefault();
	}
});


///**
// * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
// * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
// */
//window.addEventListener('wheel', function globalEventListenerWheel ( event ) {
//	var page = router.current;
//
//	debug.event(event);
//
//	event.preventDefault();
//	event.stopPropagation();
//
//	// local handler
//	if ( page ) {
//		if ( page.activeComponent && page.activeComponent !== page ) {
//			page.activeComponent.emit(event.type, event);
//		}
//
//		if ( !event.stop ) {
//			// not prevented
//			page.emit(event.type, event);
//		}
//	}
//});


// Creating stbEvent instance
window.stbEvent = {};


/**
 * Device media events.
 *
 * @event module:stb/app#media
 * @type object
 * @property {number} code of event
 */


/**
 * Event on messages from a window.
 *
 * @event module:stb/app#message
 * @type object
 * @property {boolean} broadcast message flag
 * @property {string} message received from window
 * @property {object} data received from window
 */


/**
 * Fires stb device media events.
 *
 * @param {number} event code
 */
window.stbEvent.onEvent = function ( event ) {
	// there are some listeners
	if ( app.events['media'] !== undefined ) {
		// notify listeners
		app.emit('media', {code: parseInt(event, 10)});
	}
};


/**
 * Fires event on broadcast messages from a window.
 *
 * @param {number} windowId that sent message
 * @param {string} message text
 * @param {object} data in sent message
 * @fires module:/stb/app#message
 */
window.stbEvent.onBroadcastMessage = function ( windowId, message, data ) {
	if ( app.events['message'] !== undefined ) {
		// notify listeners
		app.emit('message', {
			broadcast: true,
			windowId: windowId,
			message: message,
			data: data
		});
	}
};


/**
 * Fires event on messages from a window.
 *
 * @param {number} windowId that sent message
 * @param {string} message text
 * @param {object} data in sent message
 * @fires module:/stb/app#message
 */
window.stbEvent.onMessage = function ( windowId, message, data ) {
	if ( app.events['message'] !== undefined ) {
		// notify listeners
		app.emit('message', {
			broadcast: false,
			windowId: windowId,
			message: message,
			data: data
		});
	}
};


/**
 * Event on device mount state.
 *
 * @event module:stb/app#mount
 * @type object
 * @property {boolean} state of mount device
 */


/**
 * Fires device mount state event.
 *
 * @param {boolean} state of mount device
 * @fires module:/stb/app#mount
 */
window.stbEvent.onMount = function ( state ) {
	if ( app.events['device:mount'] !== undefined ) {
		// notify listeners
		app.emit('device:mount', {state: state});
	}
};


/**
 * Event on callback on internet browser link clicked.
 *
 * @event module:stb/app#media:available
 */


/**
 * Fires event of callback on internet browser link clicked to ask user what to do with link: play or download.
 *
 * @fires module:/stb/app#media:available
 */
window.stbEvent.onMediaAvailable = function () {
	if ( app.events['media:available'] !== undefined ) {
		// notify listeners
		app.emit('media:available');
	}
};


/**
 * Event on internet connection state.
 *
 * @event module:stb/app#internet:state
 * @type object
 * @property {boolean} state of internet connection
 */


/**
 * Fires new internet connection state event.
 *
 * @param {boolean} state of internet connection
 * @fires module:/stb/app#internet:state
 */
window.stbEvent.onNetworkStateChange = function ( state ) {
	if ( app.events['internet:state'] !== undefined ) {
		// notify listeners
		app.emit('internet:state', {state: state});
	}
};


/**
 * Event on document loading progress changes.
 *
 * @event module:stb/app#browser:progress
 * @type object
 * @property {number} progress of document loading
 */


/**
 * Fires document loading progress changes event.
 *
 * @param {number} progress of document loading
 * fires module:/stb/app#browser:progress
 */
window.stbEvent.onWebBrowserProgress = function ( progress ) {
	if ( app.events['browser:progress'] !== undefined ) {
		// notify listeners
		app.emit('browser:progress', {progress: progress});
	}
};


/**
 * Event on browser web window activation event.
 *
 * @event module:stb/app#window:focus
 */


/**
 * Fires browser web window activation event.
 *
 * fires module:/stb/app#window:focus
 */
window.stbEvent.onWindowActivated = function () {
	if ( app.events['window:focus'] !== undefined ) {
		// notify listeners
		app.emit('window:focus');
	}
};


// new way of string handling
// all strings are in UTF-16
// since stbapp 2.18
if ( window.gSTB && gSTB.SetNativeStringMode ) {
	/* eslint new-cap: 0 */

	gSTB.SetNativeStringMode(true);
}


// public
module.exports = app;
