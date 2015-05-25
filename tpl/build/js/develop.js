/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************************!*\
  !*** ./app/js/stb/develop/main.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Main module to setup development environment.
			 *
			 * @module stb/develop/main
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var app     = __webpack_require__(/*! ../app */ 1),
				storage = __webpack_require__(/*! ./storage */ 2),
				metrics = __webpack_require__(/*! ../../../../config/metrics */ 7);
			
			
			// export to globals for easy debugging
			window.app    = app;
			window.router = __webpack_require__(/*! ../router */ 3);
			
			// set global mode
			app.data.debug = true;
			
			// STB device or emulation?
			app.data.host = (window.gSTB !== undefined);
			
			// platform?
			if ( app.data.host ) {
				// web inspector
				__webpack_require__(/*! ./weinre */ 19);
			}
			
			// apply screen size, position, margins and styles
			app.setScreen(
				metrics[storage.get('screen.height')] ||
				metrics[screen.height] ||
				metrics[720]
			);
			
			
			// additional dev modules
			__webpack_require__(/*! ./shims */ 17);
			__webpack_require__(/*! ./static */ 18);
			__webpack_require__(/*! ./proxy */ 16);
			__webpack_require__(/*! ./events */ 14);
			__webpack_require__(/*! ./debug */ 13);
			
			// the application itself
			__webpack_require__(/*! ../../main */ 9);


/***/ },
/* 1 */
/*!***************************!*\
  !*** ./app/js/stb/app.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @module stb/app
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var Model    = __webpack_require__(/*! ./model */ 21),
				router   = __webpack_require__(/*! ./router */ 3),
				keys     = __webpack_require__(/*! ./keys */ 20),
				keyCodes = {},
				app, key;
			
			
			__webpack_require__(/*! ./shims */ 23);
			
			
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
			
				if ( true ) {
					if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
				}
			
				if ( metrics ) {
					if ( true ) {
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
					linkCSS.href = 'css/' + metrics.height + '.css';
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
			app.setScreen(__webpack_require__(/*! ../../../config/metrics */ 7)[screen.height]);
			
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
				var path;
			
				debug.event(event);
			
				// time mark
				app.data.time.load = event.timeStamp;
			
				// require device event listener for stb target
				//require('./targets/stb/events');
			
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
			
				// go to the given page if set
				if ( location.hash ) {
					path = router.parse(location.hash);
					router.navigate(path.name, path.data);
				}
			
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
			
			
			function globalEventListenerKeydown ( event ) {
				var page = router.current;
			
				if ( true ) {
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
			}
			
			
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
			window.addEventListener('keydown', globalEventListenerKeydown);
			
			
			/**
			 * The keypress event is fired when press a printable character.
			 * Delivers the event only to activeComponent at active page.
			 *
			 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
			 *
			 * @param {Event} event generated object with event data
			 * @param {string} event.char entered character
			 */
			window.addEventListener('keypress', function ( event ) {
				var page = router.current;
			
				if ( true ) {
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
			
				if ( false ) {
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
			
			
			// public
			module.exports = app;


/***/ },
/* 2 */
/*!***************************************!*\
  !*** ./app/js/stb/develop/storage.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Save/restore data depending on the execution device.
			 *
			 * @module stb/develop/storage
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var data = __webpack_require__(/*! ../app */ 1).data;
			
			
			// public
			module.exports = {
				get: function ( name ) {
					var value;
			
					if ( data.host ) {
						value = stbStorage.getItem(name);
					} else {
						value = localStorage.getItem(name);
					}
			
					return value ? JSON.parse(value) : null;
				},
			
				set: function ( name, value ) {
					value = JSON.stringify(value);
			
					if ( data.host ) {
						stbStorage.setItem(name, value);
					} else {
						localStorage.setItem(name, value);
					}
				}
			};


/***/ },
/* 3 */
/*!******************************!*\
  !*** ./app/js/stb/router.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Singleton for page navigation with history.
			 *
			 * All page modules should be in the directory `app/js/pages`.
			 * Page module name and the corresponding file name should be the same.
			 *
			 * Include module to start working:
			 *
			 * ```js
			 * var router = require('stb/router');
			 * ```
			 *
			 * Init with page modules:
			 *
			 * ```js
			 * router.data([
			 *     require('./pages/init'),
			 *     require('./pages/main'),
			 *     require('./pages/help')
			 * ]);
			 * ```
			 *
			 * Each page has its ID. The same ID should be used in HTML.
			 *
			 * Make some page active/visible by its ID:
			 *
			 * ```js
			 * router.navigate('pageMain');
			 * ```
			 *
			 * This will hide the current page, activate the `pageMain` page and put it in the tail of the history list.
			 *
			 * All subscribers of the current and `pageMain` page will be notified with `show/hide` events.
			 *
			 * Also the router emits `navigate` event to all subscribers.
			 *
			 *
			 * To get to the previous active page use:
			 *
			 * ```js
			 * router.back();
			 * ```
			 *
			 * The module also has methods to parse location hash address and serialize it back:
			 *
			 * ```js
			 * router.parse('#pageMain/some/additional/data');
			 * router.stringify('pageMain', ['some', 'additional', 'data']);
			 * ```
			 *
			 * Direct modification of the URL address should be avoided.
			 * The methods `router.navigate` and `router.back` should be used instead.
			 *
			 * @module stb/router
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var Emitter = __webpack_require__(/*! ./emitter */ 6),
				router;
			
			
			/**
			 * @instance
			 * @type {Emitter}
			 */
			router = new Emitter();
			
			
			/**
			 * Current active/visible page.
			 *
			 * @readonly
			 * @type {Page}
			 */
			router.current = null;
			
			
			/**
			 * List of all visited pages.
			 *
			 * @readonly
			 * @type {Page[]}
			 */
			router.history = [];
			
			
			/**
			 * List of all stored pages.
			 *
			 * @readonly
			 * @type {Page[]}
			 */
			router.pages = [];
			
			
			/**
			 * Hash table of all pages ids with links to pages.
			 *
			 * @readonly
			 * @type {Object.<string, Page>}
			 */
			router.ids = {};
			
			
			/**
			 * Set router data event.
			 *
			 * @event module:stb/router#init
			 *
			 * @type {Object}
			 * @property {Page[]} pages new page list
			 */
			
			/**
			 * Clear and fill the router with the given list of pages.
			 *
			 * @param {Page[]} pages list of pages to add
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/router#init
			 */
			router.init = function ( pages ) {
				var i, l, item;
			
				if ( pages !== undefined ) {
					if ( true ) {
						if ( !Array.isArray(pages) ) { throw 'wrong pages type'; }
					}
			
					// reset page list
					this.pages = [];
			
					// apply list
					this.pages = pages;
			
					// extract ids
					for ( i = 0, l = pages.length; i < l; i++ ) {
						item = pages[i];
						this.ids[item.id] = item;
			
						// find the currently active page
						if ( item.active ) {
							this.current = item;
						}
					}
			
					// there are some listeners
					if ( this.events['init'] !== undefined ) {
						// notify listeners
						this.emit('init', {pages: pages});
					}
			
					return true;
				}
			
				return false;
			};
			
			
			/**
			 * Extract the page name and data from url hash.
			 *
			 * @param {string} hash address hash part to parse
			 *
			 * @return {{name: string, data: string[]}} parsed data
			 *
			 * @example
			 * router.parse('#main/some/additional/data');
			 * // execution result
			 * {name: 'main', data: ['some', 'additional', 'data']}
			 */
			router.parse = function ( hash ) {
				var page = {
						name : '',
						data : []
					};
			
				// get and decode all parts
				page.data = hash.split('/').map(decodeURIComponent);
				// the first part is a page id
				// everything else is optional path
				page.name = page.data.shift().slice(1);
			
				return page;
			};
			
			
			/**
			 * Convert the given page name and its data to url hash.
			 *
			 * @param {string} name page name
			 * @param {string[]} [data=[]] page additional parameters
			 *
			 * @return {string} url hash
			 *
			 * @example
			 * router.stringify('main', ['some', 'additional', 'data']);
			 * // execution result
			 * '#main/some/additional/data'
			 */
			router.stringify = function ( name, data ) {
				// validation
				data = Array.isArray(data) ? data : [];
			
				// encode all parts
				name = encodeURIComponent(name);
				data = data.map(encodeURIComponent);
				// add encoded name to the beginning
				data.unshift(name);
			
				// build an uri
				return data.join('/');
			};
			
			
			/**
			 * Make the given inactive/hidden page active/visible.
			 * Pass some data to the page and trigger the corresponding event.
			 *
			 * @param {Page} page item to show
			 * @param {*} [data] data to send to page
			 *
			 * @return {boolean} operation status
			 */
			router.show = function ( page, data ) {
				// page available and can be hidden
				if ( page && !page.active ) {
					// apply visibility
					page.$node.classList.add('active');
					page.active  = true;
					this.current = page;
			
					// there are some listeners
					if ( page.events['show'] !== undefined ) {
						// notify listeners
						page.emit('show', {page: page, data: data});
					}
			
					debug.log('component ' + page.constructor.name + '.' + page.id + ' show', 'green');
			
					return true;
				}
			
				// nothing was done
				return false;
			};
			
			
			/**
			 * Make the given active/visible page inactive/hidden and trigger the corresponding event.
			 *
			 * @param {Page} page item to hide
			 *
			 * @return {boolean} operation status
			 */
			router.hide = function ( page ) {
				// page available and can be hidden
				if ( page && page.active ) {
					// apply visibility
					page.$node.classList.remove('active');
					page.active  = false;
					this.current = null;
			
					// there are some listeners
					if ( page.events['hide'] !== undefined ) {
						// notify listeners
						page.emit('hide', {page: page});
					}
			
					debug.log('component ' + page.constructor.name + '.' + page.id + ' hide', 'grey');
			
					return true;
				}
			
				// nothing was done
				return false;
			};
			
			
			/**
			 * Browse to a page with the given name.
			 * Do nothing if the name is invalid. Otherwise hide the current, show new and update history.
			 *
			 * @param {string} name page id
			 * @param {Array} [data] options to pass to the page on show
			 *
			 * @return {boolean} operation status
			 */
			router.navigate = function ( name, data ) {
				var pageFrom = this.current,
					pageTo   = this.ids[name];
			
				if ( true ) {
					if ( router.pages.length > 0 ) {
						if ( !pageTo || typeof pageTo !== 'object' ) { throw 'wrong pageTo type'; }
						if ( !('active' in pageTo) ) { throw 'missing field "active" in pageTo'; }
					}
				}
			
				// valid not already active page
				if ( pageTo && !pageTo.active ) {
					debug.log('router.navigate: ' + name, pageTo === pageFrom ? 'grey' : 'green');
			
					// update url
					location.hash = this.stringify(name, data);
			
					// apply visibility
					this.hide(this.current);
					this.show(pageTo, data);
			
					// there are some listeners
					if ( this.events['navigate'] !== undefined ) {
						// notify listeners
						this.emit('navigate', {from: pageFrom, to: pageTo});
					}
			
					// store
					this.history.push(pageTo);
			
					return true;
				}
			
				debug.log('router.navigate: ' + name, 'red');
			
				// nothing was done
				return false;
			};
			
			
			/**
			 * Go back one step in the history.
			 * If there is no previous page, does nothing.
			 *
			 * @return {boolean} operation status
			 */
			router.back = function () {
				var pageFrom, pageTo;
			
				debug.log('router.back', this.history.length > 1 ? 'green' : 'red');
			
				// there are some pages in the history
				if ( this.history.length > 1 ) {
					// remove the current
					pageFrom = this.history.pop();
			
					// new tail
					pageTo = this.history[this.history.length - 1];
			
					// valid not already active page
					if ( pageTo && !pageTo.active ) {
						// update url
						location.hash = pageTo.id;
			
						// apply visibility
						this.hide(this.current);
						this.show(pageTo);
			
						// there are some listeners
						if ( this.events['navigate'] !== undefined ) {
							// notify listeners
							this.emit('navigate', {from: pageFrom, to: pageTo});
						}
			
						return true;
					}
				}
			
				// nothing was done
				return false;
			};
			
			
			// public
			module.exports = router;


/***/ },
/* 4 */
/*!****************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/util/util.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

			/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
			//
			// Permission is hereby granted, free of charge, to any person obtaining a
			// copy of this software and associated documentation files (the
			// "Software"), to deal in the Software without restriction, including
			// without limitation the rights to use, copy, modify, merge, publish,
			// distribute, sublicense, and/or sell copies of the Software, and to permit
			// persons to whom the Software is furnished to do so, subject to the
			// following conditions:
			//
			// The above copyright notice and this permission notice shall be included
			// in all copies or substantial portions of the Software.
			//
			// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
			// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
			// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
			// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
			// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
			// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
			// USE OR OTHER DEALINGS IN THE SOFTWARE.
			
			var formatRegExp = /%[sdj%]/g;
			exports.format = function(f) {
			  if (!isString(f)) {
			    var objects = [];
			    for (var i = 0; i < arguments.length; i++) {
			      objects.push(inspect(arguments[i]));
			    }
			    return objects.join(' ');
			  }
			
			  var i = 1;
			  var args = arguments;
			  var len = args.length;
			  var str = String(f).replace(formatRegExp, function(x) {
			    if (x === '%%') return '%';
			    if (i >= len) return x;
			    switch (x) {
			      case '%s': return String(args[i++]);
			      case '%d': return Number(args[i++]);
			      case '%j':
			        try {
			          return JSON.stringify(args[i++]);
			        } catch (_) {
			          return '[Circular]';
			        }
			      default:
			        return x;
			    }
			  });
			  for (var x = args[i]; i < len; x = args[++i]) {
			    if (isNull(x) || !isObject(x)) {
			      str += ' ' + x;
			    } else {
			      str += ' ' + inspect(x);
			    }
			  }
			  return str;
			};
			
			
			// Mark that a method should not be used.
			// Returns a modified function which warns once by default.
			// If --no-deprecation is set, then it is a no-op.
			exports.deprecate = function(fn, msg) {
			  // Allow for deprecating things in the process of starting up.
			  if (isUndefined(global.process)) {
			    return function() {
			      return exports.deprecate(fn, msg).apply(this, arguments);
			    };
			  }
			
			  if (process.noDeprecation === true) {
			    return fn;
			  }
			
			  var warned = false;
			  function deprecated() {
			    if (!warned) {
			      if (process.throwDeprecation) {
			        throw new Error(msg);
			      } else if (process.traceDeprecation) {
			        console.trace(msg);
			      } else {
			        console.error(msg);
			      }
			      warned = true;
			    }
			    return fn.apply(this, arguments);
			  }
			
			  return deprecated;
			};
			
			
			var debugs = {};
			var debugEnviron;
			exports.debuglog = function(set) {
			  if (isUndefined(debugEnviron))
			    debugEnviron = process.env.NODE_DEBUG || '';
			  set = set.toUpperCase();
			  if (!debugs[set]) {
			    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
			      var pid = process.pid;
			      debugs[set] = function() {
			        var msg = exports.format.apply(exports, arguments);
			        console.error('%s %d: %s', set, pid, msg);
			      };
			    } else {
			      debugs[set] = function() {};
			    }
			  }
			  return debugs[set];
			};
			
			
			/**
			 * Echos the value of a value. Trys to print the value out
			 * in the best way possible given the different types.
			 *
			 * @param {Object} obj The object to print out.
			 * @param {Object} opts Optional options object that alters the output.
			 */
			/* legacy: obj, showHidden, depth, colors*/
			function inspect(obj, opts) {
			  // default options
			  var ctx = {
			    seen: [],
			    stylize: stylizeNoColor
			  };
			  // legacy...
			  if (arguments.length >= 3) ctx.depth = arguments[2];
			  if (arguments.length >= 4) ctx.colors = arguments[3];
			  if (isBoolean(opts)) {
			    // legacy...
			    ctx.showHidden = opts;
			  } else if (opts) {
			    // got an "options" object
			    exports._extend(ctx, opts);
			  }
			  // set default options
			  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
			  if (isUndefined(ctx.depth)) ctx.depth = 2;
			  if (isUndefined(ctx.colors)) ctx.colors = false;
			  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
			  if (ctx.colors) ctx.stylize = stylizeWithColor;
			  return formatValue(ctx, obj, ctx.depth);
			}
			exports.inspect = inspect;
			
			
			// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
			inspect.colors = {
			  'bold' : [1, 22],
			  'italic' : [3, 23],
			  'underline' : [4, 24],
			  'inverse' : [7, 27],
			  'white' : [37, 39],
			  'grey' : [90, 39],
			  'black' : [30, 39],
			  'blue' : [34, 39],
			  'cyan' : [36, 39],
			  'green' : [32, 39],
			  'magenta' : [35, 39],
			  'red' : [31, 39],
			  'yellow' : [33, 39]
			};
			
			// Don't use 'blue' not visible on cmd.exe
			inspect.styles = {
			  'special': 'cyan',
			  'number': 'yellow',
			  'boolean': 'yellow',
			  'undefined': 'grey',
			  'null': 'bold',
			  'string': 'green',
			  'date': 'magenta',
			  // "name": intentionally not styling
			  'regexp': 'red'
			};
			
			
			function stylizeWithColor(str, styleType) {
			  var style = inspect.styles[styleType];
			
			  if (style) {
			    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
			           '\u001b[' + inspect.colors[style][1] + 'm';
			  } else {
			    return str;
			  }
			}
			
			
			function stylizeNoColor(str, styleType) {
			  return str;
			}
			
			
			function arrayToHash(array) {
			  var hash = {};
			
			  array.forEach(function(val, idx) {
			    hash[val] = true;
			  });
			
			  return hash;
			}
			
			
			function formatValue(ctx, value, recurseTimes) {
			  // Provide a hook for user-specified inspect functions.
			  // Check that value is an object with an inspect function on it
			  if (ctx.customInspect &&
			      value &&
			      isFunction(value.inspect) &&
			      // Filter out the util module, it's inspect function is special
			      value.inspect !== exports.inspect &&
			      // Also filter out any prototype objects using the circular check.
			      !(value.constructor && value.constructor.prototype === value)) {
			    var ret = value.inspect(recurseTimes, ctx);
			    if (!isString(ret)) {
			      ret = formatValue(ctx, ret, recurseTimes);
			    }
			    return ret;
			  }
			
			  // Primitive types cannot have properties
			  var primitive = formatPrimitive(ctx, value);
			  if (primitive) {
			    return primitive;
			  }
			
			  // Look up the keys of the object.
			  var keys = Object.keys(value);
			  var visibleKeys = arrayToHash(keys);
			
			  if (ctx.showHidden) {
			    keys = Object.getOwnPropertyNames(value);
			  }
			
			  // IE doesn't make error fields non-enumerable
			  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
			  if (isError(value)
			      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
			    return formatError(value);
			  }
			
			  // Some type of object without properties can be shortcutted.
			  if (keys.length === 0) {
			    if (isFunction(value)) {
			      var name = value.name ? ': ' + value.name : '';
			      return ctx.stylize('[Function' + name + ']', 'special');
			    }
			    if (isRegExp(value)) {
			      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
			    }
			    if (isDate(value)) {
			      return ctx.stylize(Date.prototype.toString.call(value), 'date');
			    }
			    if (isError(value)) {
			      return formatError(value);
			    }
			  }
			
			  var base = '', array = false, braces = ['{', '}'];
			
			  // Make Array say that they are Array
			  if (isArray(value)) {
			    array = true;
			    braces = ['[', ']'];
			  }
			
			  // Make functions say that they are functions
			  if (isFunction(value)) {
			    var n = value.name ? ': ' + value.name : '';
			    base = ' [Function' + n + ']';
			  }
			
			  // Make RegExps say that they are RegExps
			  if (isRegExp(value)) {
			    base = ' ' + RegExp.prototype.toString.call(value);
			  }
			
			  // Make dates with properties first say the date
			  if (isDate(value)) {
			    base = ' ' + Date.prototype.toUTCString.call(value);
			  }
			
			  // Make error with message first say the error
			  if (isError(value)) {
			    base = ' ' + formatError(value);
			  }
			
			  if (keys.length === 0 && (!array || value.length == 0)) {
			    return braces[0] + base + braces[1];
			  }
			
			  if (recurseTimes < 0) {
			    if (isRegExp(value)) {
			      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
			    } else {
			      return ctx.stylize('[Object]', 'special');
			    }
			  }
			
			  ctx.seen.push(value);
			
			  var output;
			  if (array) {
			    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
			  } else {
			    output = keys.map(function(key) {
			      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
			    });
			  }
			
			  ctx.seen.pop();
			
			  return reduceToSingleString(output, base, braces);
			}
			
			
			function formatPrimitive(ctx, value) {
			  if (isUndefined(value))
			    return ctx.stylize('undefined', 'undefined');
			  if (isString(value)) {
			    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
			                                             .replace(/'/g, "\\'")
			                                             .replace(/\\"/g, '"') + '\'';
			    return ctx.stylize(simple, 'string');
			  }
			  if (isNumber(value))
			    return ctx.stylize('' + value, 'number');
			  if (isBoolean(value))
			    return ctx.stylize('' + value, 'boolean');
			  // For some reason typeof null is "object", so special case here.
			  if (isNull(value))
			    return ctx.stylize('null', 'null');
			}
			
			
			function formatError(value) {
			  return '[' + Error.prototype.toString.call(value) + ']';
			}
			
			
			function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
			  var output = [];
			  for (var i = 0, l = value.length; i < l; ++i) {
			    if (hasOwnProperty(value, String(i))) {
			      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
			          String(i), true));
			    } else {
			      output.push('');
			    }
			  }
			  keys.forEach(function(key) {
			    if (!key.match(/^\d+$/)) {
			      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
			          key, true));
			    }
			  });
			  return output;
			}
			
			
			function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
			  var name, str, desc;
			  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
			  if (desc.get) {
			    if (desc.set) {
			      str = ctx.stylize('[Getter/Setter]', 'special');
			    } else {
			      str = ctx.stylize('[Getter]', 'special');
			    }
			  } else {
			    if (desc.set) {
			      str = ctx.stylize('[Setter]', 'special');
			    }
			  }
			  if (!hasOwnProperty(visibleKeys, key)) {
			    name = '[' + key + ']';
			  }
			  if (!str) {
			    if (ctx.seen.indexOf(desc.value) < 0) {
			      if (isNull(recurseTimes)) {
			        str = formatValue(ctx, desc.value, null);
			      } else {
			        str = formatValue(ctx, desc.value, recurseTimes - 1);
			      }
			      if (str.indexOf('\n') > -1) {
			        if (array) {
			          str = str.split('\n').map(function(line) {
			            return '  ' + line;
			          }).join('\n').substr(2);
			        } else {
			          str = '\n' + str.split('\n').map(function(line) {
			            return '   ' + line;
			          }).join('\n');
			        }
			      }
			    } else {
			      str = ctx.stylize('[Circular]', 'special');
			    }
			  }
			  if (isUndefined(name)) {
			    if (array && key.match(/^\d+$/)) {
			      return str;
			    }
			    name = JSON.stringify('' + key);
			    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
			      name = name.substr(1, name.length - 2);
			      name = ctx.stylize(name, 'name');
			    } else {
			      name = name.replace(/'/g, "\\'")
			                 .replace(/\\"/g, '"')
			                 .replace(/(^"|"$)/g, "'");
			      name = ctx.stylize(name, 'string');
			    }
			  }
			
			  return name + ': ' + str;
			}
			
			
			function reduceToSingleString(output, base, braces) {
			  var numLinesEst = 0;
			  var length = output.reduce(function(prev, cur) {
			    numLinesEst++;
			    if (cur.indexOf('\n') >= 0) numLinesEst++;
			    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
			  }, 0);
			
			  if (length > 60) {
			    return braces[0] +
			           (base === '' ? '' : base + '\n ') +
			           ' ' +
			           output.join(',\n  ') +
			           ' ' +
			           braces[1];
			  }
			
			  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
			}
			
			
			// NOTE: These type checking functions intentionally don't use `instanceof`
			// because it is fragile and can be easily faked with `Object.create()`.
			function isArray(ar) {
			  return Array.isArray(ar);
			}
			exports.isArray = isArray;
			
			function isBoolean(arg) {
			  return typeof arg === 'boolean';
			}
			exports.isBoolean = isBoolean;
			
			function isNull(arg) {
			  return arg === null;
			}
			exports.isNull = isNull;
			
			function isNullOrUndefined(arg) {
			  return arg == null;
			}
			exports.isNullOrUndefined = isNullOrUndefined;
			
			function isNumber(arg) {
			  return typeof arg === 'number';
			}
			exports.isNumber = isNumber;
			
			function isString(arg) {
			  return typeof arg === 'string';
			}
			exports.isString = isString;
			
			function isSymbol(arg) {
			  return typeof arg === 'symbol';
			}
			exports.isSymbol = isSymbol;
			
			function isUndefined(arg) {
			  return arg === void 0;
			}
			exports.isUndefined = isUndefined;
			
			function isRegExp(re) {
			  return isObject(re) && objectToString(re) === '[object RegExp]';
			}
			exports.isRegExp = isRegExp;
			
			function isObject(arg) {
			  return typeof arg === 'object' && arg !== null;
			}
			exports.isObject = isObject;
			
			function isDate(d) {
			  return isObject(d) && objectToString(d) === '[object Date]';
			}
			exports.isDate = isDate;
			
			function isError(e) {
			  return isObject(e) &&
			      (objectToString(e) === '[object Error]' || e instanceof Error);
			}
			exports.isError = isError;
			
			function isFunction(arg) {
			  return typeof arg === 'function';
			}
			exports.isFunction = isFunction;
			
			function isPrimitive(arg) {
			  return arg === null ||
			         typeof arg === 'boolean' ||
			         typeof arg === 'number' ||
			         typeof arg === 'string' ||
			         typeof arg === 'symbol' ||  // ES6 symbol
			         typeof arg === 'undefined';
			}
			exports.isPrimitive = isPrimitive;
			
			exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ 33);
			
			function objectToString(o) {
			  return Object.prototype.toString.call(o);
			}
			
			
			function pad(n) {
			  return n < 10 ? '0' + n.toString(10) : n.toString(10);
			}
			
			
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
			              'Oct', 'Nov', 'Dec'];
			
			// 26 Feb 16:19:34
			function timestamp() {
			  var d = new Date();
			  var time = [pad(d.getHours()),
			              pad(d.getMinutes()),
			              pad(d.getSeconds())].join(':');
			  return [d.getDate(), months[d.getMonth()], time].join(' ');
			}
			
			
			// log is just a thin wrapper to console.log that prepends a timestamp
			exports.log = function() {
			  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
			};
			
			
			/**
			 * Inherit the prototype methods from one constructor into another.
			 *
			 * The Function.prototype.inherits from lang.js rewritten as a standalone
			 * function (not on Function.prototype). NOTE: If this file is to be loaded
			 * during bootstrapping this function needs to be rewritten using some native
			 * functions as prototype setup using normal JavaScript does not work as
			 * expected during bootstrapping (see mirror.js in r114903).
			 *
			 * @param {function} ctor Constructor function which needs to inherit the
			 *     prototype.
			 * @param {function} superCtor Constructor function to inherit prototype from.
			 */
			exports.inherits = __webpack_require__(/*! inherits */ 32);
			
			exports._extend = function(origin, add) {
			  // Don't do anything if add isn't an object
			  if (!add || !isObject(add)) return origin;
			
			  var keys = Object.keys(add);
			  var i = keys.length;
			  while (i--) {
			    origin[keys[i]] = add[keys[i]];
			  }
			  return origin;
			};
			
			function hasOwnProperty(obj, prop) {
			  return Object.prototype.hasOwnProperty.call(obj, prop);
			}
			
			/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/~/node-libs-browser/~/process/browser.js */ 31)))

/***/ },
/* 5 */
/*!***************************!*\
  !*** ./app/js/stb/dom.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * HTML elements low-level handling.
			 *
			 * @module stb/dom
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			/**
			 * DOM manipulation module
			 */
			var dom = {};
			
			
			/**
			 * Create a new HTML element.
			 *
			 * @param {string} tagName mandatory tag name
			 * @param {Object|null} [attrList] element attributes
			 * @param {...*} [content] element content (primitive value/values or other nodes)
			 * @return {Node|null} HTML element or null on failure
			 *
			 * @example
			 * dom.tag('table');
			 * dom.tag('div', {}, 'some text');
			 * dom.tag('div', {className:'top'}, dom.tag('span'), dom.tag('br'));
			 * dom.tag('link', {rel:'stylesheet', type:'text/css', href:'http://some.url/'});
			 */
			dom.tag = function ( tagName, attrList, content ) {
				var node = null,
					i, name;
			
				// minimal param is given
				if ( tagName ) {
					// empty element
					node = document.createElement(tagName);
			
					// optional attribute list is given
					if ( attrList && typeof attrList === 'object' ) {
						for ( name in attrList ) {
							// extend a new node with the given attributes
							node[name] = attrList[name];
						}
					}
			
					// content (arguments except the first two)
					for ( i = 2; i < arguments.length; i++ ) {
						// some data is given
						if ( arguments[i] ) {
							// regular HTML tag or plain data
							node.appendChild(
								typeof arguments[i] === 'object' ?
								arguments[i] :
								document.createTextNode(arguments[i])
							);
						}
					}
			
				}
			
				return node;
			};
			
			
			/**
			 * Create a new DocumentFragment filled with the given non-empty elements if any.
			 *
			 * @param {...*} [node] fragment content (primitive value/values or other nodes)
			 * @return {DocumentFragment} new placeholder
			 *
			 * @example
			 * // gives an empty fragment element
			 * dom.fragment();
			 * // gives a fragment element with 3 div element inside
			 * dom.fragment(dom.tag('div'), div2, div3);
			 * // mixed case
			 * dom.fragment('some text', 123, div3);
			 */
			dom.fragment = function ( node ) {
				// prepare placeholder
				var i, fragment = document.createDocumentFragment();
			
				// walk through all the given elements
				for ( i = 0; i < arguments.length; i++ ) {
					node = arguments[i];
					// some data is given
					if ( node ) {
						// regular HTML tag or plain data
						fragment.appendChild(typeof node === 'object' ? node : document.createTextNode(node));
					}
				}
			
				return fragment;
			};
			
			
			/**
			 * Add the given non-empty data (HTML element/text or list) to the destination element.
			 *
			 * @param {Node} tagDst element to receive children
			 * @param {...*} [content] element content (primitive value/values or other nodes)
			 * @return {Node|null} the destination element - owner of all added data
			 *
			 * @example
			 * // simple text value
			 * add(some_div, 'Hello world');
			 * // single DOM Element
			 * add(some_div, some_other_div);
			 * // DOM Element list
			 * add(some_div, div1, div2, div3);
			 * // mixed case
			 * add(some_div, div1, 'hello', 'world');
			 */
			dom.add = function ( tagDst, content ) {
				var i;
			
				// valid HTML tag as the destination
				if ( tagDst instanceof Node ) {
					// append all except the first one
					for ( i = 1; i < arguments.length; i++ ) {
						// some data is given
						if ( arguments[i] ) {
							// regular HTML tag or plain data
							tagDst.appendChild(
								typeof arguments[i] === 'object' ?
								arguments[i] :
								document.createTextNode(arguments[i])
							);
						}
					}
					return tagDst;
				}
			
				return null;
			};
			
			
			/**
			 * Remove the given elements from the DOM.
			 *
			 * @param {...Node} [nodes] element to be removed
			 * @return {boolean} operation status (true - all given elements removed)
			 *
			 * @example
			 * dom.remove(document.querySelector('div.test'));
			 * dom.remove(div1, div2, div3);
			 */
			dom.remove = function ( nodes ) {
				var count = 0,  // amount of successfully removed nodes
					i;
			
				// walk through all the given elements
				for ( i = 0; i < arguments.length; i++ ) {
					// valid non-empty tag
					if ( arguments[i] && arguments[i].parentNode ) {
						if ( arguments[i].parentNode.removeChild(arguments[i]) === arguments[i] ) {
							count++;
						}
					}
				}
			
				return arguments.length > 0 && count === arguments.length;
			};
			
			
			// public
			module.exports = dom;


/***/ },
/* 6 */
/*!*******************************!*\
  !*** ./app/js/stb/emitter.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @module stb/emitter
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			
			/**
			 * Base Events Emitter implementation.
			 *
			 * @see http://nodejs.org/api/events.html
			 * @constructor
			 */
			function Emitter () {
				/**
				 * Inner hash table for event names and linked callbacks.
				 * Manual editing should be avoided.
				 *
				 * @member {Object.<string, function[]>}
				 *
				 * @example
				 * {
				 *     click: [
				 *         function click1 () { ... },
				 *         function click2 () { ... }
				 *     ],
				 *     keydown: [
				 *         function () { ... }
				 *     ]
				 * }
				 **/
				this.events = {};
			}
			
			
			Emitter.prototype = {
				/**
				 * Bind an event to the given callback function.
				 * The same callback function can be added multiple times for the same event name.
				 *
				 * @param {string} name event identifier
				 * @param {function} callback function to call on this event
				 *
				 * @example
				 * var obj = new Emitter();
				 * obj.addListener('click', function ( data ) { ... });
				 * // one more click handler
				 * obj.addListener('click', function ( data ) { ... });
				 */
				addListener: function ( name, callback ) {
					if ( true ) {
						if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
						if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
						if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
					}
			
					// initialization may be required
					this.events[name] = this.events[name] || [];
					// append this new event to the list
					this.events[name].push(callback);
				},
			
			
				/**
				 * Add a one time listener for the event.
				 * This listener is invoked only the next time the event is fired, after which it is removed.
				 *
				 * @param {string} name event identifier
				 * @param {function} callback function to call on this event
				 */
				once: function ( name, callback ) {
					// current execution context
					var self = this;
			
					if ( true ) {
						if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
						if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
						if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
					}
			
					// initialization may be required
					this.events[name] = this.events[name] || [];
					// append this new event to the list
					this.events[name].push(function onceWrapper ( data ) {
						callback(data);
						self.removeListener(name, onceWrapper);
					});
				},
			
			
				/**
				 * Apply multiple listeners at once.
				 *
				 * @param {Object} callbacks event names with callbacks
				 *
				 * @example
				 * var obj = new Emitter();
				 * obj.addListeners({click: function ( data ) {}, close: function ( data ) {}});
				 */
				addListeners: function ( callbacks ) {
					var name;
			
					if ( true ) {
						if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
						if ( typeof callbacks !== 'object' ) { throw 'wrong callbacks type'; }
						if ( Object.keys(callbacks).length === 0 ) { throw 'no callbacks given'; }
					}
			
					// valid input
					if ( typeof callbacks === 'object' ) {
						for ( name in callbacks ) {
							if ( callbacks.hasOwnProperty(name) ) {
								this.addListener(name, callbacks[name]);
							}
						}
					}
				},
			
			
				/**
				 * Remove all instances of the given callback.
				 *
				 * @param {string} name event identifier
				 * @param {function} callback function to remove
				 *
				 * @example
				 * obj.removeListener('click', func1);
				 */
				removeListener: function ( name, callback ) {
					if ( true ) {
						if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
						if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
						if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
						if ( this.events[name] && !Array.isArray(this.events[name]) ) { throw 'corrupted inner data'; }
					}
			
					// the event exists and should have some callbacks
					if ( this.events[name] !== undefined ) {
						// rework the callback list to exclude the given one
						this.events[name] = this.events[name].filter(function callbacksFilter ( fn ) { return fn !== callback; });
						// event has no more callbacks so clean it
						if ( this.events[name].length === 0 ) {
							// as if there were no listeners at all
							this.events[name] = undefined;
						}
					}
				},
			
			
				/**
				 * Remove all callbacks for the given event name.
				 * Without event name clears all events.
				 *
				 * @param {string} [name] event identifier
				 *
				 * @example
				 * obj.removeAllListeners('click');
				 * obj.removeAllListeners();
				 */
				removeAllListeners: function ( name ) {
					if ( true ) {
						if ( arguments.length !== 0 && (typeof name !== 'string' || name.length === 0) ) { throw 'wrong or empty name'; }
					}
			
					// check input
					if ( arguments.length === 0 ) {
						// no arguments so remove everything
						this.events = {};
					} else if ( name ) {
						if ( true ) {
							if ( this.events[name] !== undefined ) { throw 'event is not removed'; }
						}
			
						// only name is given so remove all callbacks for the given event
						// but object structure modification should be avoided
						this.events[name] = undefined;
					}
				},
			
			
				/**
				 * Execute each of the listeners in the given order with the supplied arguments.
				 *
				 * @param {string} name event identifier
				 * @param {Object} [data] options to send
				 *
				 * @todo consider use context
				 *
				 * @example
				 * obj.emit('init');
				 * obj.emit('click', {src:panel1, dst:panel2});
				 *
				 * // it's a good idea to emit event only when there are some listeners
				 * if ( this.events['click'] !== undefined ) {
				 *     this.emit('click', {event: event});
				 * }
				 */
				emit: function ( name, data ) {
					var event = this.events[name],
						i;
			
					if ( true ) {
						if ( arguments.length < 1 ) { throw 'wrong arguments number'; }
						if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
					}
			
					// the event exists and should have some callbacks
					if ( event !== undefined ) {
						if ( true ) {
							if ( !Array.isArray(event) ) { throw 'wrong event type'; }
						}
			
						for ( i = 0; i < event.length; i++ ) {
							if ( true ) {
								if ( typeof event[i] !== 'function' ) { throw 'wrong event callback type'; }
							}
			
							// invoke the callback with parameters
							// http://jsperf.com/function-calls-direct-vs-apply-vs-call-vs-bind/6
							event[i].call(this, data);
						}
					}
				}
			};
			
			
			// public
			module.exports = Emitter;


/***/ },
/* 7 */
/*!***************************!*\
  !*** ./config/metrics.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Application geometry options for js/less.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			// public
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
					availTop   : 10,
					availBottom: 10,
					availRight : 10,
					availLeft  : 10
				},
			
				1080: {
					// screen base dimension
					height: 1080,
					width : 1920,
					// safe zone margins
					availTop   : 15,
					availBottom: 15,
					availRight : 15,
					availLeft  : 15
				}
			};


/***/ },
/* 8 */
/*!*******************************!*\
  !*** ./app/js/stb/ui/page.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Page is the main component to build user interface.
			 * Page is an area filling the whole screen.
			 * There can be only one active page visible at the same time.
			 *
			 * Active/visible state of a page is managed by the `router` module.
			 *
			 * A page can contain other components.
			 *
			 * @module stb/ui/page
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var Component = __webpack_require__(/*! ../component */ 12);
			
			
			/**
			 * Base page implementation.
			 *
			 * A full-screen top-level layer that can operate as an independent separate entity.
			 * It is added to the document body on creation if not already linked.
			 *
			 * @constructor
			 * @extends Component
			 *
			 * @param {Object} [config={}] init parameters (all inherited from the parent)
			 *
			 * @example
			 * var Page = require('stb/ui/page'),
			 *     page = new Page({
			 *         $node: document.getElementById(id)
			 *     });
			 *
			 * page.addListener('show', function show () {
			 *     // page is visible now
			 * });
			 */
			function Page ( config ) {
				/**
				 * Page visibility/active state flag.
				 *
				 * @readonly
				 * @type {boolean}
				 */
				this.active = false;
			
				/**
				 * Link to the currently active component with focus.
				 *
				 * @readonly
				 * @type {Component}
				 */
				this.activeComponent = null;
			
				// sanitize
				config = config || {};
			
				// parent init
				Component.call(this, config);
			
				// correct CSS class names
				this.$node.classList.add('page');
			
				// state flag
				this.active = this.$node.classList.contains('active');
			
				// correct DOM parent/child connection if necessary
				if ( this.$node.parentNode === null ) {
					document.body.appendChild(this.$node);
				}
			
				// always itself
				this.page = this;
			}
			
			
			// inheritance
			Page.prototype = Object.create(Component.prototype);
			Page.prototype.constructor = Page;
			
			
			// public
			module.exports = Page;


/***/ },
/* 9 */
/*!************************!*\
  !*** ./app/js/main.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Main application entry point.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var app    = __webpack_require__(/*! ./stb/app */ 1),
				router = __webpack_require__(/*! ./stb/router */ 3);
			
			
			app.addListeners({
				// all resources are loaded
				load: function load () {
					// set pages
					router.init([
						__webpack_require__(/*! ./pages/init */ 10),
						__webpack_require__(/*! ./pages/main */ 11)
					]);
				},
			
				// everything is ready
				done: function done () {
					// go to the main page when necessary
					router.navigate('pageMain');
				}
			});


/***/ },
/* 10 */
/*!******************************!*\
  !*** ./app/js/pages/init.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Loading page implementation.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var id   = 'pageInit',
				Page = __webpack_require__(/*! ../stb/ui/page */ 8),
				page = new Page({$node: document.getElementById(id)});
			
			
			// public
			module.exports = page;


/***/ },
/* 11 */
/*!******************************!*\
  !*** ./app/js/pages/main.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Main page implementation.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var id   = 'pageMain',
				Page = __webpack_require__(/*! ../stb/ui/page */ 8),
				page = new Page({$node: document.getElementById(id)});
			
			
			// public
			module.exports = page;


/***/ },
/* 12 */
/*!*********************************!*\
  !*** ./app/js/stb/component.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @module stb/component
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var Emitter = __webpack_require__(/*! ./emitter */ 6),
				router  = __webpack_require__(/*! ./router */ 3),
				counter = 0;
			
			
			/**
			 * Base component implementation.
			 *
			 * Visual element that can handle sub-components.
			 * Each component has a DOM element container $node with a set of classes:
			 * "component" and some specific component class names depending on the hierarchy, for example "page".
			 * Each component has a unique ID given either from $node.id or from data.id. If not given will generate automatically.
			 *
			 * @constructor
			 * @extends Emitter
			 *
			 * @param {Object} [config={}] init parameters
			 * @param {Element} [config.id] component unique identifier (generated if not set)
			 * @param {Element} [config.$node] DOM element/fragment to be a component outer container
			 * @param {Element} [config.$body] DOM element/fragment to be a component inner container (by default is the same as $node)
			 * @param {Element} [config.$content] DOM element/fragment to be appended to the $body
			 * @param {Component} [config.parent] link to the parent component which has this component as a child
			 * @param {Array.<Component>} [config.children=[]] list of components in this component
			 * @param {Object.<string, function>} [config.events={}] list of event callbacks
			 * @param {boolean} [config.visible=true] component initial visibility state flag
			 * @param {boolean} [config.focusable=true] component can accept focus or not
			 *
			 * @fires module:stb/component~Component#click
			 *
			 * @example
			 * var component = new Component({
			 *     $node: document.getElementById(id),
			 *     events: {
			 *         click: function () { ... }
			 *     }
			 * });
			 * component.add( ... );
			 * component.focus();
			 */
			function Component ( config ) {
				// current execution context
				var self = this;
			
				/**
				 * Component visibility state flag.
				 *
				 * @readonly
				 * @type {boolean}
				 */
				this.visible = true;
			
				/**
				 * Component can accept focus or not.
				 *
				 * @type {boolean}
				 */
				this.focusable = true;
			
				/**
				 * DOM outer handle.
				 *
				 * @type {Element}
				 */
				this.$node = null;
			
				/**
				 * DOM inner handle.
				 * In simple cases is the same as $node.
				 *
				 * @type {Element}
				 */
				this.$body = null;
			
				if ( true ) {
					/**
					 * Link to the page owner component.
					 * It can differ from the direct parent.
					 * Should be used only in debug.
					 *
					 * @type {Page}
					 */
					//this.page = null;
				}
			
				/**
				 * Link to the parent component which has this component as a child.
				 *
				 * @type {Component}
				 */
				this.parent = null;
			
				/**
				 * List of all children components.
				 *
				 * @type {Component[]}
				 */
				this.children = [];
			
			
				// sanitize
				config = config || {};
			
				if ( true ) {
					if ( typeof config !== 'object' ) { throw 'wrong config type'; }
				}
			
				// parent init
				Emitter.call(this, config.data);
			
				// outer handle
				if ( config.$node !== undefined ) {
					if ( true ) {
						if ( !(config.$node instanceof Element) ) { throw 'wrong config.$node type'; }
					}
					// apply
					this.$node = config.$node;
				} else {
					// empty div in case nothing is given
					this.$node = document.createElement('div');
				}
			
				// inner handle
				if ( config.$body !== undefined ) {
					if ( true ) {
						if ( !(config.$body instanceof Element) ) { throw 'wrong config.$body type'; }
					}
					// apply
					this.$body = config.$body;
				} else {
					// inner and outer handlers are identical
					this.$body = this.$node;
				}
			
				// inject given content into inner component part
				if ( config.$content !== undefined ) {
					if ( true ) {
						if ( !(config.$content instanceof Element) ) { throw 'wrong config.$content type'; }
					}
					// apply
					this.$body.appendChild(config.$content);
				}
			
				// correct CSS class names
				this.$node.classList.add('component');
			
				// apply hierarchy
				if ( config.parent !== undefined ) {
					if ( true ) {
						if ( !(config.parent instanceof Component) ) { throw 'wrong config.parent type'; }
					}
					// apply
					config.parent.add(this);
				}
			
				// set link to the page owner component
				//if ( config.page !== undefined ) {
				//	if ( DEBUG ) {
				//		if ( !(config.page instanceof Component) ) { throw 'wrong config.page type'; }
				//	}
			    //	// apply
				//	this.page = config.page;
				//}
			
				// apply given visibility
				if ( config.visible === false ) {
					// default state is visible
					this.hide();
				}
			
				// can't accept focus
				if ( config.focusable === false ) {
					this.focusable = false;
				}
			
				// apply given events
				if ( config.events !== undefined ) {
					// no need in assert here (it is done inside the addListeners)
					this.addListeners(config.events);
				}
			
				// apply component id if given, generate otherwise
				this.id = config.id || this.$node.id || 'id' + counter++;
			
				// apply the given children components
				if ( config.children ) {
					if ( true ) {
						if ( !Array.isArray(config.children) ) { throw 'wrong config.children type'; }
					}
					// apply
					this.add.apply(this, config.children);
				}
			
				// component activation by mouse
				this.$node.addEventListener('click', function ( event ) {
					// left mouse button
					if ( event.button === 0 ) {
						// activate if possible
						self.focus();
			
						// there are some listeners
						if ( self.events['click'] !== undefined ) {
							/**
							 * Mouse click event.
							 *
							 * @event module:stb/component~Component#click
							 *
							 * @type {Object}
							 * @property {Event} event click event data
							 */
							self.emit('click', {event: event});
						}
			
						// not prevented
						//if ( !event.stop ) {
						//	// activate if possible
						//	self.focus();
						//}
					}
			
					if ( true ) {
						// middle mouse button
						if ( event.button === 1 ) {
							debug.inspect(self);
							debug.log('this component is now available by window.link');
							window.link = self;
						}
					}
			
					event.stopPropagation();
				});
			
				if ( true ) {
					// expose a link
					this.$node.component = this.$body.component = this;
					this.$node.title = 'component ' + this.constructor.name + '.' + this.id + ' (outer)';
					this.$body.title = 'component ' + this.constructor.name + '.' + this.id + ' (inner)';
				}
			
				// @todo remove or implement
				// navigation by keyboard
				//this.addListener('keydown', this.navigateDefault);
			}
			
			
			// inheritance
			Component.prototype = Object.create(Emitter.prototype);
			Component.prototype.constructor = Component;
			
			
			/**
			 * Default method to move focus according to pressed keys.
			 *
			 * @todo remove or implement
			 *
			 * @param {Event} event generated event source of movement
			 */
			/*Component.prototype.navigateDefault = function ( event ) {
				switch ( event.code ) {
					case keys.up:
					case keys.down:
					case keys.right:
					case keys.left:
						// notify listeners
						this.emit('overflow');
						break;
				}
			};*/
			
			
			/**
			 * Current active method to move focus according to pressed keys.
			 * Can be redefined to provide custom navigation.
			 *
			 * @todo remove or implement
			 *
			 * @type {function}
			 */
			/*Component.prototype.navigate = Component.prototype.navigateDefault;*/
			
			
			/**
			 * Add a new component as a child.
			 *
			 * @param {...Component} [child] variable number of elements to append
			 *
			 * @files Component#add
			 *
			 * @example
			 * panel.add(
			 *     new Button( ... ),
			 *     new Button( ... )
			 * );
			 */
			Component.prototype.add = function ( child ) {
				var i;
			
				// walk through all the given elements
				for ( i = 0; i < arguments.length; i++ ) {
					child = arguments[i];
			
					if ( true ) {
						if ( !(child instanceof Component) ) { throw 'wrong child type'; }
					}
			
					// apply
					this.children.push(child);
					child.parent = this;
			
					//if ( DEBUG ) {
					//	// apply page for this and all children recursively
					//	child.setPage(this.page);
					//}
			
					// correct DOM parent/child connection if necessary
					if ( child.$node !== undefined && child.$node.parentNode === null ) {
						this.$body.appendChild(child.$node);
					}
			
					// there are some listeners
					if ( this.events['add'] !== undefined ) {
						/**
						 * A child component is added.
						 *
						 * @event module:stb/component~Component#add
						 *
						 * @type {Object}
						 * @property {Component} child new component added
						 */
						this.emit('add', {item: child});
					}
			
					debug.log('component ' + this.constructor.name + '.' + this.id + ' new child: ' + child.constructor.name + '.' + child.id);
				}
			};
			
			
			//if ( DEBUG ) {
			//	Component.prototype.setPage = function ( page ) {
			//		this.page = page;
			//
			//		this.children.forEach(function ( child ) {
			//			child.setPage(page);
			//		});
			//	};
			//}
			
			
			/**
			 * Delete this component and clear all associated events.
			 *
			 * @fires module:stb/component~Component#remove
			 */
			Component.prototype.remove = function () {
				var page = router.current;
			
				// really inserted somewhere
				if ( this.parent ) {
					if ( true ) {
						if ( !(this.parent instanceof Component) ) { throw 'wrong this.parent type'; }
					}
			
					// active at the moment
					if ( page.activeComponent === this ) {
						this.blur();
						this.parent.focus();
					}
					this.parent.children.splice(this.parent.children.indexOf(this), 1);
				}
			
				// remove all children
				this.children.forEach(function ( child ) {
					if ( true ) {
						if ( !(child instanceof Component) ) { throw 'wrong child type'; }
					}
			
					child.remove();
				});
			
				this.removeAllListeners();
				this.$node.parentNode.removeChild(this.$node);
			
				// there are some listeners
				if ( this.events['remove'] !== undefined ) {
					/**
					 * Delete this component.
					 *
					 * @event module:stb/component~Component#remove
					 */
					this.emit('remove');
				}
			
				debug.log('component ' + this.constructor.name + '.' + this.id + ' remove', 'red');
			};
			
			
			/**
			 * Activate the component.
			 * Notify the owner-page and apply CSS class.
			 *
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/component~Component#focus
			 */
			Component.prototype.focus = function () {
				var activePage = router.current,
					activeItem = activePage.activeComponent;
			
				//if ( DEBUG ) {
				//	if ( this.page !== activePage ) {
				//		console.log(this, this.page, activePage);
				//		throw 'attempt to focus an invisible component';
				//	}
				//}
			
				// this is a visual component on a page
				// not already focused and can accept focus
				if ( this.focusable && this !== activeItem ) {
					// notify the current active component
					if ( activeItem ) { activeItem.blur(); }
			
					// apply
					activePage.activeComponent = activeItem = this;
					activeItem.$node.classList.add('focus');
			
					// there are some listeners
					if ( activeItem.events['focus'] !== undefined ) {
						/**
						 * Make this component focused.
						 *
						 * @event module:stb/component~Component#focus
						 */
						activeItem.emit('focus');
					}
			
					debug.log('component ' + this.constructor.name + '.' + this.id + ' focus');
			
					return true;
				}
			
				// nothing was done
				return false;
			};
			
			
			/**
			 * Remove focus.
			 * Change page.activeComponent and notify subscribers.
			 *
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/component~Component#blur
			 */
			Component.prototype.blur = function () {
				var activePage = router.current,
					activeItem = activePage.activeComponent;
			
				// this is the active component
				if ( this === activeItem ) {
					this.$node.classList.remove('focus');
					activePage.activeComponent = null;
			
					// there are some listeners
					if ( this.events['blur'] !== undefined ) {
						/**
						 * Remove focus from this component.
						 *
						 * @event module:stb/component~Component#blur
						 */
						this.emit('blur');
					}
			
					debug.log('component ' + this.constructor.name + '.' + this.id + ' blur', 'grey');
			
					return true;
				}
			
				// nothing was done
				return false;
			};
			
			
			/**
			 * Make the component visible and notify subscribers.
			 *
			 * @param {Object} data custom data which passed into handlers
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/component~Component#show
			 */
			Component.prototype.show = function ( data ) {
				// is it hidden
				if ( !this.visible ) {
					// correct style
					this.$node.classList.remove('hidden');
					// flag
					this.visible = true;
			
					// there are some listeners
					if ( this.events['show'] !== undefined ) {
						/**
						 * Make the component visible.
						 *
						 * @event module:stb/component~Component#show
						 */
						this.emit('show', data);
					}
			
					return true;
				}
			
				// nothing was done
				return true;
			};
			
			
			/**
			 * Make the component hidden and notify subscribers.
			 *
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/component~Component#hide
			 */
			Component.prototype.hide = function () {
				// is it visible
				if ( this.visible ) {
					// correct style
					this.$node.classList.add('hidden');
					// flag
					this.visible = false;
			
					// there are some listeners
					if ( this.events['hide'] !== undefined ) {
						/**
						 * Make the component hidden.
						 *
						 * @event module:stb/component~Component#hide
						 */
						this.emit('hide');
					}
			
					return true;
				}
			
				// nothing was done
				return true;
			};
			
			
			// public
			module.exports = Component;


/***/ },
/* 13 */
/*!*************************************!*\
  !*** ./app/js/stb/develop/debug.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Logger.
			 *
			 * @module stb/develop/debug
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var host   = __webpack_require__(/*! ../app */ 1).data.host,
				config = __webpack_require__(/*! ../../../../config/logger */ 24),
				util   = __webpack_require__(/*! util */ 4),
				buffer = [],
				/**
				 * Storage for timers (time, timeEnd).
				 */
				timeCounters = {},
				socket;
			
			
			// enable colors in console
			__webpack_require__(/*! tty-colors */ 34);
			
			
			(function connect () {
				if ( !config.active || !host ) {
					return;
				}
			
				socket = new WebSocket('ws://' + location.hostname + ':' + config.port);
			
				socket.onclose = function () {
					setTimeout(function () {
						connect();
					}, 5000);
				};
			})();
			
			
			/**
			 * Wrapper to dump message locally and remotely.
			 *
			 * @param {string} message data to output and send
			 */
			function log ( message ) {
				gSTB.Debug(message);
				buffer.push(message);
				if ( socket && socket.readyState === socket.OPEN ) {
					socket.send(JSON.stringify(buffer));
					buffer = [];
				}
			}
			
			
			/**
			 * Global object to output logs
			 * @namespace
			 * @global
			 */
			module.exports = window.debug = {
			
				/**
				 * Check condition and warn if not match.
				 *
				 * @param {boolean} condition should be true if okay
				 * @param {string} title description of the problem
				 */
				assert: function ( condition, title ) {
					if ( !condition ) {
						if ( host ) {
							log(('Assertion failed: ' + title).red);
						} else {
							console.assert(condition, title);
						}
					}
				},
			
			
				/**
				 * Print a plain colored string.
				 *
				 * @param {*} message data to output
				 * @param {string} [color='black'] colour to set
				 */
				log: function ( message, color ) {
					message = (message + '') || '(empty message)';
					if ( host ) {
						log(message[color || 'white']);
					} else {
						console.log('%c%s', 'color:' + (color || 'black'), message);
					}
				},
			
			
				/**
				 * Print the given var with caption.
				 *
				 * @param {*} data data to output
				 * @param {string} [title] optional caption
				 */
				info: function ( data, title ) {
					var type = Object.prototype.toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase(),
						args;
			
					if ( host ) {
						// prepare
						if ( data instanceof Object || Array.isArray(data) ) {
							// complex object
							data = data.nodeName ? data.outerHTML : JSON.stringify(data, null, 4);
						}
						// combine all together and print result
						log((type === 'error' ? type.red : type.green) + '\t' + (title ? title.bold + ':\t'.green : '') + data);
					} else {
						args = ['color:' + (type === 'error' ? 'red' : 'green'), type];
						if ( title ) {
							args.unshift('%c%s\t%c%s\t');
							args.push('color:grey');
							args.push(title);
						} else {
							args.unshift('%c%s\t');
						}
						args.push(data);
						// output
						console.log.apply(console, args);
					}
				},
			
			
				/**
				 * Print the given complex var with level restriction.
				 *
				 * @param {*} data data to output
				 * @param {number} [depth=0] amount of sub-levels to print
				 */
				inspect: function ( data, depth ) {
					if ( host ) {
						log('inspect:\n' + util.inspect(data, {depth: depth || 0, colors: true}));
					} else {
						console.log(data);
					}
				},
			
			
				/**
				 * Print the given event object in some special way.
				 *
				 * @param {Event} data event object
				 */
				event: function ( data ) {
					var type  = data.type.toUpperCase(),
						color = type === 'ERROR' ? 'red' : 'green',
						text  = ('Event ' + type[color]).bold;
			
					if ( host ) {
						switch ( type ) {
							case 'KEYDOWN':
								text = text +
								'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
								' alt'  [data.altKey   ? 'green' : 'grey'] +
								' shift'[data.shiftKey ? 'green' : 'grey'] +
								'\t' + data.keyCode + '\t' + data.code + '\t' + (data.keyIdentifier || '').green;
								break;
							case 'KEYPRESS':
								text = text +
								'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
								' alt'  [data.altKey   ? 'green' : 'grey'] +
								' shift'[data.shiftKey ? 'green' : 'grey'] +
								'\t' + data.keyCode + '\t' + (data.keyIdentifier || '').green + '\t' + String.fromCharCode(data.keyCode);
								break;
							case 'MOUSEMOVE':
								text = text +
								'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
								' alt'  [data.altKey   ? 'green' : 'grey'] +
								' shift'[data.shiftKey ? 'green' : 'grey'] +
								'\t' + data.x + ':' + data.y;
								break;
							case 'CLICK':
								text = text +
								'\tctrl' [data.ctrlKey  ? 'green' : 'grey'] +
								' alt'  [data.altKey   ? 'green' : 'grey'] +
								' shift'[data.shiftKey ? 'green' : 'grey'] +
								'\t' + data.x + ':' + data.y;
								break;
							case 'ERROR':
								text = text +
									'\t' + data.filename +
									' (' + data.lineno + ':' + data.colno + ')' +
									' ' + data.message;
								break;
						}
						log(text);
					} else {
						switch ( type ) {
							case 'KEYDOWN':
							case 'KEYPRESS':
								console.log('%o\t%c%s %c%s %c%s %c%s %c%s\t%s\t%c%s', data, 'color:' + color + ';font-weight:bold', type,
									'color:' + (data.ctrlKey  ? 'green' : 'lightgrey'), 'ctrl',
									'color:' + (data.altKey   ? 'green' : 'lightgrey'), 'alt',
									'color:' + (data.shiftKey ? 'green' : 'lightgrey'), 'shift',
									'color:black', data.keyCode, data.code || '', 'color:green', data.keyIdentifier
								);
								break;
							default:
								console.log('%o\t%c%s', data, 'color:' + color + ';font-weight:bold', type);
						}
					}
				},
			
			
				/**
				 * Use to do some development-specific actions which are removed in release mode.
				 *
				 * @param {function} cb callback to execute
				 *
				 * @example
				 * debug.stub(function () {
				 *     alert('This is visible only in debug mode!');
				 * });
				 * // it's also possible to use simple expression:
				 * // link the current scope var with global
				 * // useful for dev only
				 * debug.stub(window.app = this);
				 */
				stub: function ( cb ) {
					if ( typeof cb === 'function' ) {
						cb();
					}
				},
			
			
				/**
				 * Start specific timer.
				 * Use to calculate time of some actions.
				 *
				 * @param {string} name timer name
				 *
				 * @example
				 * debug.time('function1');
				 * // some processing...
				 * debug.timeEnd('function1');
				 * // print time execution, like 'function1: 934ms'
				 */
				time: function ( name ) {
					var time, key;
			
					if ( host ) {
						if ( !name ) {
							return;
						}
			
						time = new Date().getTime();
			
						key = 'KEY:' + name;
			
						timeCounters[key] = time;
					} else {
						console.time(name);
					}
				},
			
			
				/**
				 * End specific timer.
				 * Use to calculate time of some actions.
				 *
				 * @param {string} name timer name
				 *
				 * @example
				 * debug.time('function1');
				 * // some processing...
				 * debug.timeEnd('function1');
				 * // print time execution, like 'function1: 934ms'
				 */
				timeEnd: function ( name ) {
					var key, diff, timeCounter;
			
					if ( host ) {
						if ( !name ) {
							return;
						}
			
						key = 'KEY:' + name;
						timeCounter = timeCounters[key];
			
						if ( timeCounter ) {
							diff = +new Date() - timeCounter;
							timeCounters[key] = null;
							diff += 'ms';
							log(name + ':\t' + diff.bgBlue);
						} else {
							throw 'no started timer for "' + name + '"';
						}
			
						return diff;
					} else {
						console.timeEnd(name);
					}
				}
			
			};


/***/ },
/* 14 */
/*!**************************************!*\
  !*** ./app/js/stb/develop/events.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Additional dev events.
			 *
			 * @module stb/develop/events
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var util    = __webpack_require__(/*! util */ 4),
				app     = __webpack_require__(/*! ../app */ 1),
				request = __webpack_require__(/*! ../request */ 22),
				dom     = __webpack_require__(/*! ../dom */ 5),
				grid    = __webpack_require__(/*! ./grid */ 15),
				storage = __webpack_require__(/*! ./storage */ 2);
			
			
			// additional top-level key handler
			window.addEventListener('load', function developEventListenerLoad () {
				// export to globals div for develop HTML elements
				window.$develop = document.body.appendChild(document.createElement('div'));
				window.$develop.className = 'develop';
			
				grid.init();
			
				if ( storage.get('grid.active') ) {
					grid.show();
				}
			
				// stress-testing
				window.gremlins = __webpack_require__(/*! gremlins.js/gremlins.min.js */ 30);
				window.horde    = window.gremlins.createHorde();
			});
			
			
			// additional top-level key handler
			window.addEventListener('keydown', function developEventListenerKeydown ( event ) {
				switch ( event.keyCode ) {
					// numpad 0
					case 96:
						debug.log('full document reload', 'red');
						location.hash = '';
						location.reload();
						break;
			
					// numpad 1
					case 97:
						// NTSC
						changeScreenDimension(720, 480);
						break;
			
					// numpad 2
					case 98:
						// PAL
						changeScreenDimension(720, 576);
						break;
			
					// numpad 3
					case 99:
						// 720p
						changeScreenDimension(1280, 720);
						break;
			
					// numpad 4
					case 100:
						// 1080p
						changeScreenDimension(1920, 1080);
						break;
			
					// numpad 5
					case 101:
						// debug grid
						if ( grid.active ) {
							grid.hide();
						} else {
							grid.show();
						}
						debug.log('show grid: ' + grid.active, 'red');
						storage.set('grid.active', grid.active);
						break;
			
					// numpad 6
					case 102:
						// stress-testing for emulation
						window.horde.unleash({nb: 500});
						break;
			
					// numpad 7
					case 103:
						if ( !app.data.host ) {
							debug.log('SpyJS in this mode is available only on STB devices.', 'red');
						} else {
							// SpyJS enable/disable
							if ( !storage.get('spyjs.active') ) {
								// try to "ping" proxy server
								request.ajax(document.location.protocol + '//' + location.hostname + ':3546', {
									method: 'get',
									onload: function () {
										// proxy seems ready
										//isSpyJs = true;
										storage.set('spyjs.active', true);
										debug.log('SpyJS: enable', 'red');
										debug.log('SpyJS: set proxy to ' + location.hostname + ':' + 3546);
			
										gSTB.SetWebProxy(location.hostname, 3546, '', '', '');
										location.reload();
									},
									onerror: function () {
										debug.log('SpyJS: no connection (check SpyJS is started on the server)', 'red');
									}
								});
							} else {
								//isSpyJs = false;
								storage.set('spyjs.active', false);
								gSTB.ResetWebProxy();
								debug.log('SpyJS: disable', 'red');
								location.reload();
							}
						}
						break;
			
					// numpad 8
					case 104:
						// FireBug Lite
						debug.log('firebug-lite activation', 'red');
						document.head.appendChild(dom.tag('script', {
							type: 'text/javascript',
							src: 'http://getfirebug.com/firebug-lite.js#startOpened',
							onload: function () {
								debug.log('firebug-lite ready ...', 'green');
							},
							onerror: function ( error ) {
								debug.inspect(error);
							}
						}));
						break;
			
					// numpad .
					case 110:
						// CSS reload
						debug.log('CSS reload', 'red');
						// get through all css links
						Array.prototype.slice.call(document.head.getElementsByTagName('link')).forEach(function forEachLink ( tag ) {
							// get base name, modify and apply
							tag.href = tag.href.split('?')[0] + '?' + (+new Date());
						});
						break;
				}
			});
			
			
			/**
			 * Apply the given screen geometry and reload the page.
			 *
			 * @param {number} width screen param
			 * @param {number} height screen param
			 */
			function changeScreenDimension ( width, height ) {
				// check if it's necessary
				if ( Number(storage.get('screen.height')) !== height ) {
					// yes
					debug.log(util.format('switch to %sx%s', width, height), 'red');
			
					// save in case of document reload
					storage.set('screen.height', height);
					storage.set('screen.width',  width);
			
					// hide content to avoid raw HTML blinking
					document.body.style.display = 'none';
			
					// apply new metrics
					app.setScreen(__webpack_require__(/*! ../../../../config/metrics */ 7)[height]);
			
					// restore visibility
					document.body.style.display = '';
				} else {
					// not really
					debug.log('no resolution change: new and current values are identical', 'red');
				}
			}


/***/ },
/* 15 */
/*!************************************!*\
  !*** ./app/js/stb/develop/grid.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Visual grid with cursor.
			 *
			 * @module stb/develop/grid
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var data    = __webpack_require__(/*! ../app */ 1).data,
				storage = __webpack_require__(/*! ./storage */ 2);
			
			
			// public
			module.exports = window.grid = {
			
				/** @type {HTMLElement} */
				$canvas: null,
			
				/** @type {CanvasRenderingContext2D} */
				ctx: null,
			
				lineWidth: 0.9,
			
				// content middle point
				centerX: 0,
				centerY: 0,
			
				// last click point
				lastX: 0,
				lastY: 0,
			
				// mouse pointer
				cursorX: 0,
				cursorY: 0,
			
				// list of click points
				points: storage.get('grid.points') || [],
			
				// points to snap
				snaps: [],
			
				// visible or not
				active: false,
			
			
				init: function () {
					// current execution context
					var self = this;
			
					this.$canvas = window.$develop.appendChild(document.createElement('canvas'));
					this.ctx = this.$canvas.getContext('2d');
			
					// apply size
					this.ctx.canvas.width  = data.screen.width;
					this.ctx.canvas.height = data.screen.height;
			
					// safe zone center
					this.centerX = data.screen.availWidth  / 2 + data.screen.availLeft;
					this.centerY = data.screen.availHeight / 2 + data.screen.availTop;
			
					this.snaps.push({x: data.screen.availLeft,  y: data.screen.availTop});
					this.snaps.push({x: data.screen.width - data.screen.availRight, y: data.screen.height - data.screen.availBottom});
					this.snaps.push({x: this.centerX, y: this.centerY});
			
					this.ctx.lineWidth = this.lineWidth;
					this.ctx.font = '14px Ubuntu';
			
					this.$canvas.addEventListener('contextmenu', function ( event ) {
						event.preventDefault();
					});
			
					this.$canvas.addEventListener('mousedown', function ( event ) {
						self.mousedown(event);
					});
			
					this.$canvas.addEventListener('mousemove', function ( event ) {
						self.mousemove(event);
					});
				},
			
			
				mousemove: function ( event ) {
					// current execution context
					var self = this;
			
					this.cursorX = event.x;
					this.cursorY = event.y;
			
					this.repaint();
			
					if ( event.shiftKey ) {
						// snap to the point divisible by 10
						this.cursorX = Math.round(event.x / 10) * 10;
						this.cursorY = Math.round(event.y / 10) * 10;
					} else if ( !event.ctrlKey ) {
						// snap to the nearest line
						this.points.concat(this.snaps).some(function ( point ) {
							if ( Math.abs(point.x - self.cursorX) <= 10 ) {
								self.cursorX = point.x;
							}
							if ( Math.abs(point.y - self.cursorY) <= 10 ) {
								self.cursorY = point.y;
							}
						});
					}
			
					this.drawPointer();
				},
			
			
				mousedown: function ( event ) {
					var matchPoint = null,
						self       = this,  // current execution context
						point;
			
					// all clicked crosses
					this.points.forEach(function ( point ) {
						if ( self.cursorX === point.x && self.cursorY === point.y ) {
							matchPoint = point;
						}
					});
			
					if ( event.button === 0 ) {
						// left mouse button
						if ( matchPoint === null ) {
							this.points.push({x: this.cursorX, y: this.cursorY});
						}
						this.lastX = this.cursorX;
						this.lastY = this.cursorY;
					} else if ( event.button === 1 ) {
						// middle mouse button
						this.points.pop();
						point = this.points[this.points.length - 1];
						if ( point ) {
							this.lastX = point.x;
							this.lastY = point.y;
						} else {
							this.lastX = 0;
							this.lastY = 0;
						}
					} else if ( event.button === 2 ) {
						// right mouse button
						if ( matchPoint !== null ) {
							this.points.splice(this.points.indexOf(matchPoint), 1);
							point = this.points[this.points.length - 1];
							if ( point ) {
								this.lastX = point.x;
								this.lastY = point.y;
							} else {
								this.lastX = 0;
								this.lastY = 0;
							}
						} else {
							this.lastX = 0;
							this.lastY = 0;
						}
					}
					this.repaint();
					this.drawPointer();
					storage.set('grid.points', this.points);
				},
			
			
				show: function () {
					this.active = true;
					this.$canvas.classList.add('active');
					this.repaint();
				},
			
			
				hide: function () {
					this.active = false;
					this.$canvas.classList.remove('active');
				},
			
			
				repaint: function () {
					var ctx  = this.ctx,
						self = this;  // current execution context
			
					// remove all
					ctx.clearRect(0, 0, data.screen.width, data.screen.height);
			
					// safe zone center
					this.drawCross({x: this.centerX, y: this.centerY}, {color: 'grey'});
			
					// draw safe zone borders
					ctx.strokeStyle = 'red';
					ctx.strokeRect(data.screen.availLeft, data.screen.availTop, data.screen.availWidth, data.screen.availHeight);
			
					// all clicked crosses
					this.points.forEach(function ( point ) {
						self.drawCross(point, {color:'green', mark: 5});
					});
				},
			
			
				drawPointer: function () {
					var ctx    = this.ctx,
						height = 16,
						width, dx, dy, angle, title;
			
					title = this.cursorX + ' : ' + this.cursorY;
			
					// there were some clicks
					if ( this.lastX || this.lastY ) {
						// distance by X and Y from last point
						dx = this.cursorX - this.lastX;
						dy = this.cursorY - this.lastY;
						title = title + ' [' + (dx > 0 ? '+' : '') + dx + ', ' + (dy > 0 ? '+' : '') + dy + ']';
			
						// angle of the line connecting the cursor and the last point
						angle = Math.atan2(dy, dx) * 180 / Math.PI;
						title = title + ' ' + angle.toFixed(2) + '°';
			
						// not perpendicular
						if ( dx && dy ) {
							// distance between the cursor and the last point
							title = title + ' len: ' + Math.sqrt(Math.pow(Math.abs(dx), 2) + Math.pow(Math.abs(dy), 2)).toFixed(2);
						}
			
						// angle line
						ctx.beginPath();
						// show by color if 45°
						ctx.strokeStyle = [-135, 135, -45, 45].indexOf(angle) !== -1 ? 'yellow' : 'grey';
						ctx.moveTo(this.lastX, this.lastY);
						ctx.lineTo(this.cursorX, this.cursorY);
						ctx.stroke();
					}
			
					// pointer itself
					this.drawCross({x: this.cursorX, y: this.cursorY});
			
					title = ' ' + title + ' ';
					width = ctx.measureText(title).width;
			
					// title background
					ctx.fillStyle = 'yellow';
					ctx.fillRect(
						this.cursorX > this.centerX ? this.cursorX - width  : this.cursorX,
						this.cursorY > this.centerY ? this.cursorY - height : this.cursorY,
						width, height
					);
			
					// title itself
					ctx.fillStyle    = 'black';
					ctx.textBaseline = this.cursorY > this.centerY ? 'bottom' : 'top';
					ctx.textAlign    = this.cursorX > this.centerX ? 'right'  : 'left';
					ctx.fillText(title, this.cursorX, this.cursorY);
				},
			
			
				drawCross: function ( point, options ) {
					var ctx = this.ctx;
			
					// defaults
					options = options || {};
			
					// apply style options
					ctx.lineWidth   = options.width || this.lineWidth;
					ctx.strokeStyle = options.color || 'yellow';
			
					ctx.beginPath();
					// horizontal line
					ctx.moveTo(0, point.y);
					ctx.lineTo(data.screen.width, point.y);
					// vertical line
					ctx.moveTo(point.x, 0);
					ctx.lineTo(point.x, data.screen.height);
					// draw
					ctx.stroke();
			
					// center mark
					if ( options.mark ) {
						ctx.lineWidth = 1.5;
						ctx.beginPath();
						// horizontal line
						ctx.moveTo(point.x - options.mark, point.y);
						ctx.lineTo(point.x + options.mark, point.y);
						// vertical line
						ctx.moveTo(point.x, point.y - options.mark);
						ctx.lineTo(point.x, point.y + options.mark);
						// draw
						ctx.stroke();
						ctx.lineWidth = this.lineWidth;
					}
				}
			
			};


/***/ },
/* 16 */
/*!*************************************!*\
  !*** ./app/js/stb/develop/proxy.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * STB calls relay.
			 *
			 * @module stb/develop/proxy
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var host   = __webpack_require__(/*! ../app */ 1).data.host,
				util   = __webpack_require__(/*! util */ 4),
				config = __webpack_require__(/*! ../../../../config/proxy */ 25);
			
			
			/**
			 * Proxy host activation
			 */
			function initHost () {
				var ProxyHost = __webpack_require__(/*! code-proxy/client/host */ 29);
			
				// init and export to globals
				window.proxy = new ProxyHost({
					name: config.name,
					host: location.hostname,
					port: config.portWs
				});
			
				// redefine logging
				window.proxy.log = function log ( type, time, status, message, params ) {
					gSTB.Debug(util.format('[%s]\t%s\t%s\t%s\t%s',
						type.grey,
						config.name.magenta,
						time.toString().grey,
						(status ? message.green : message.red),
						(params ? JSON.stringify(params).grey : '')
					));
				};
			}
			
			/**
			 * Proxy guest activation
			 */
			function initGuest () {
				var ProxyGuest = __webpack_require__(/*! code-proxy/client/guest */ 28),
					stbNames   = ['dvbManager', 'gSTB', 'pvrManager', 'stbDownloadManager', 'stbStorage', 'stbUpdate', 'stbWebWindow', 'stbWindowMgr', 'timeShift'],
					skipKeys   = ['objectName', 'destroyed', 'deleteLater'];
			
				// init and export to globals
				window.proxy = new ProxyGuest({
					name: config.name,
					host: location.hostname,
					port: config.portHttp
				});
			
				// create local stb objects
				stbNames.forEach(function forEachStbNames ( stbObjName ) {
					// prepare
					var stbObj = window[stbObjName] = {},
						// for each global stb object get all its properties
						keysCode = util.format('Object.keys(%s)', stbObjName),
						stbObjKeys;
			
					// get data from cache if no connection
					if ( !window.proxy.active && config.cache ) {
						stbObjKeys = JSON.parse(localStorage.getItem('proxy:eval:' + keysCode));
						console.log('proxy cache: ', keysCode);
					} else {
						stbObjKeys = window.proxy.eval(keysCode);
						localStorage.setItem('proxy:eval:' + keysCode, JSON.stringify(stbObjKeys));
					}
			
					// valid list of keys
					if ( stbObjKeys && Array.isArray(stbObjKeys) ) {
			
						stbObjKeys.forEach(function forEachStbObjKeys ( stbObjKey ) {
							// strip signature
							stbObjKey = stbObjKey.split('(')[0];
							// get rid of system fields
							if ( skipKeys.indexOf(stbObjKey) === -1 ) {
								// wrap each method with proxy call
								stbObj[stbObjKey] = (function stbCallWrapper ( name, method ) {
									return function stbCallBody () {
										var code = name + '.' + method,
											data;
			
										// get data from cache if no connection
										if ( !window.proxy.active && config.cache ) {
											data = JSON.parse(localStorage.getItem('proxy:call:' + code));
											console.log('proxy cache: ', code);
										} else {
											data = window.proxy.call(code, Array.prototype.slice.call(arguments), name) || null;
											localStorage.setItem('proxy:call:' + code, JSON.stringify(data));
										}
										return data;
									};
								}(stbObjName, stbObjKey));
							}
						});
					}
				});
			}
			
			
			// init
			if ( config.active ) {
				if ( host ) {
					initHost();
				} else {
					initGuest();
				}
			}


/***/ },
/* 17 */
/*!*************************************!*\
  !*** ./app/js/stb/develop/shims.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
			 */
			
			'use strict';
			
			
			if ( !Function.prototype.bind ) {
				Function.prototype.bind = function ( oThis ) {
					if ( typeof this !== 'function' ) {
						// closest thing possible to the ECMAScript 5
						// internal IsCallable function
						throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
					}
			
					var aArgs = Array.prototype.slice.call(arguments, 1),
						fToBind = this,
						fNOP = function () {},
						fBound = function () {
							return fToBind.apply(this instanceof fNOP && oThis
									? this
									: oThis,
								aArgs.concat(Array.prototype.slice.call(arguments)));
						};
			
					fNOP.prototype = this.prototype;
					fBound.prototype = new fNOP();
			
					return fBound;
				};
			}
			
			
			if ( !window.requestAnimationFrame ) {
				// shim layer with setTimeout fallback
				window.requestAnimationFrame =
					window.mozRequestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function ( callback ) {
						window.setTimeout(callback, 1000 / 60);
					};
			}


/***/ },
/* 18 */
/*!**************************************!*\
  !*** ./app/js/stb/develop/static.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Static files reload on change.
			 *
			 * @module stb/develop/static
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var dom    = __webpack_require__(/*! ../dom */ 5),
				config = __webpack_require__(/*! ../../../../config/static */ 26);
			
			
			// livereload activation
			if ( config.livereload ) {
				// load external script
				document.head.appendChild(dom.tag('script', {
					type: 'text/javascript',
					src: '//' + location.hostname + ':35729/livereload.js'
				}));
			}


/***/ },
/* 19 */
/*!**************************************!*\
  !*** ./app/js/stb/develop/weinre.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Web Inspector Remote.
			 *
			 * @module stb/develop/weinre
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var dom     = __webpack_require__(/*! ../dom */ 5),
				util    = __webpack_require__(/*! util */ 4),
				storage = __webpack_require__(/*! ./storage */ 2),
				config  = __webpack_require__(/*! ../../../../config/weinre */ 27);
			
			
			// web inspector is allowed only without SpyJS
			if ( config.active && !storage.get('spyjs.active') ) {
				// load external script
				document.head.appendChild(dom.tag('script', {
					type: 'text/javascript',
					src: util.format('//%s:%s/target/target-script-min.js#%s', location.hostname, config.port, config.name)
				}));
			}


/***/ },
/* 20 */
/*!****************************!*\
  !*** ./app/js/stb/keys.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Global list of non-printable control key codes.
			 *
			 * WARNING!!! All codes in this file (exclude 'volumeUp', 'volumeDown')
			 * uses in window 'keydown' handler to prevent wrong 'keypress' firings.
			 * If u add code into this file, 'keypress' event with this code will never fires.
			 *
			 *  Value | Description
			 * -------|-------------
			 *  +1000 | shift key pressed
			 *  +2000 | alt key pressed
			 *
			 * @module stb/keys
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			
			// public
			module.exports = {
				back         : 8,    // Backspace
				'delete'     : 46,
				channelPrev  : 1009, // Shift+Tab
				channelNext  : 9,    // Tab
				ok           : 13,   // Enter
				exit         : 27,   // Esc
				up           : 38,   // UP ARROW
				down         : 40,   // DOWN ARROW
				left         : 37,   // LEFT ARROW
				right        : 39,   // RIGHT ARROW
				pageUp       : 33,   // Page Up
				pageDown     : 34,   // Page Down
				end          : 35,
				home         : 36,
				volumeUp     : 107,  // NUMPAD +
				volumeDown   : 109,  // NUMPAD -
				f1           : 112,  // F1
				f2           : 113,  // F2
				f3           : 114,  // F3
				f4           : 115,  // F4
				refresh      : 116,  // F5
				frame        : 117,  // F6
				phone        : 119,  // F8
				set          : 120,  // F9
				tv           : 121,  // F10
				menu         : 122,  // F11
				web          : 123,  // F12
				mic          : 2032,
				rewind       : 2066, // Alt+B
				forward      : 2070, // Alt+F
				app          : 2076, // Alt+L
				usbMounted   : 2080, // Alt+P
				usbUnmounted : 2081, // Alt+Q
				playPause    : 2082, // Alt+R
				stop         : 2083, // Alt+S
				power        : 2085, // Alt+U
				record       : 2087, // Alt+W
				info         : 2089, // Alt+Y
				mute         : 2192,
				clock        : 2032,
				audio        : 2071, // Alt+G
				keyboard     : 2076  // Alt+L
			};


/***/ },
/* 21 */
/*!*****************************!*\
  !*** ./app/js/stb/model.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @module stb/model
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var Emitter = __webpack_require__(/*! ./emitter */ 6);
			
			
			/**
			 * Base model implementation.
			 *
			 * Represents domain-specific data or information that an application will be working with.
			 * A typical example is a user account (e.g name, avatar, e-mail) or a music track (e.g title, year, album).
			 * Holds information, but don’t handle behaviour and don’t format information or influence how data appears.
			 *
			 * @constructor
			 * @extends Emitter
			 *
			 * @param {Object} [data={}] init attributes
			 */
			function Model ( data ) {
				if ( true ) {
					if ( data !== undefined && typeof data !== 'object' ) { throw 'wrong data type'; }
				}
			
				// parent init
				Emitter.call(this);
			
				/**
				 * Model attributes with given data or empty hash table.
				 *
				 * @member {Object.<string, *>}
				 **/
				this.data = data || {};
			}
			
			
			// inheritance
			Model.prototype = Object.create(Emitter.prototype);
			Model.prototype.constructor = Model;
			
			
			// which of data fields is primary
			Model.prototype.idName = 'id';
			
			
			/**
			 * Remove all attributes from the model event.
			 *
			 * @event module:stb/model~Model#clear
			 *
			 * @type {Object}
			 * @property {Object} data old model attributes
			 */
			
			
			/**
			 * Remove all attributes from the model.
			 *
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/model~Model#clear
			 */
			Model.prototype.clear = function () {
				var data = this.data;
			
				if ( true ) {
					if ( typeof data !== 'object' ) { throw 'wrong data type'; }
				}
			
				// is there any data?
				if ( Object.keys(data).length > 0 ) {
					// reset
					this.data = {};
			
					// there are some listeners
					if ( this.events['clear'] !== undefined ) {
						// notify listeners
						this.emit('clear', {data: data});
					}
			
					return true;
				}
			
				return false;
			};
			
			
			/**
			 * Set model data event.
			 *
			 * @event module:stb/model~Model#init
			 *
			 * @type {Object}
			 * @property {Object} data new model attributes
			 */
			
			
			/**
			 * Clear and set model data.
			 *
			 * @param {Object} data attributes
			 * @return {boolean} operation status
			 *
			 * @fires module:stb/model~Model#clear
			 * @fires module:stb/model~Model#init
			 */
			Model.prototype.init = function ( data ) {
				if ( true ) {
					if ( typeof data !== 'object' ) { throw 'wrong data type'; }
				}
			
				// valid input
				if ( data ) {
					// reset data
					this.clear();
			
					// init with given data
					this.data = data;
			
					// there are some listeners
					if ( this.events['init'] !== undefined ) {
						// notify listeners
						this.emit('init', {data: data});
					}
			
					return true;
				}
			
				return false;
			};
			
			
			/**
			 * Check an attribute existence.
			 *
			 * @param {string} name attribute
			 *
			 * @return {boolean} attribute exists or not
			 */
			Model.prototype.has = function ( name ) {
				if ( true ) {
					if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				}
			
				// hasOwnProperty method is not available directly in case of Object.create(null)
				//return Object.hasOwnProperty.call(this.data, name);
				return this.data.hasOwnProperty(name);
			};
			
			/**
			 * Get the model attribute by name.
			 *
			 * @param {string} name attribute
			 *
			 * @return {*} associated value
			 */
			Model.prototype.get = function ( name ) {
				if ( true ) {
					if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				}
			
				return this.data[name];
			};
			
			
			/**
			 * Update or create a model attribute event.
			 *
			 * @event module:stb/model~Model#change
			 *
			 * @type {Object}
			 * @property {string} name attribute name
			 * @property {*} [prev] old/previous attribute value (can be absent on attribute creation)
			 * @property {*} [curr] new/current attribute value (can be absent on attribute removal)
			 */
			
			
			/**
			 * Update or create a model attribute.
			 *
			 * @param {string} name attribute
			 * @param {*} value associated value
			 * @return {boolean} operation status (true - attribute value was changed/created)
			 *
			 * @fires module:stb/model~Model#change
			 */
			Model.prototype.set = function ( name, value ) {
				var isAttrSet = name in this.data,
					emitData  = {name: name, curr: value};
			
				if ( true ) {
					if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				}
			
				if ( isAttrSet ) {
					// update
					emitData.prev = this.data[name];
					// only if values are different
					if ( value !== emitData.prev ) {
						this.data[name] = value;
			
						// there are some listeners
						if ( this.events['change'] !== undefined ) {
							// notify listeners
							this.emit('change', emitData);
						}
			
						return true;
					}
				} else {
					// create
					this.data[name] = value;
			
					// there are some listeners
					if ( this.events['change'] !== undefined ) {
						// notify listeners
						this.emit('change', emitData);
					}
			
					return true;
				}
			
				return false;
			};
			
			
			/**
			 * Delete the given attribute by name.
			 *
			 * @param {string} name attribute
			 * @return {boolean} operation status (true - attribute was deleted)
			 *
			 * @fires module:stb/model~Model#change
			 */
			Model.prototype.unset = function ( name ) {
				var isAttrSet = name in this.data,
					emitData;
			
				if ( true ) {
					if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				}
			
				if ( isAttrSet ) {
					emitData = {name: name, prev: this.data[name]};
					delete this.data[name];
			
					// there are some listeners
					if ( this.events['change'] !== undefined ) {
						// notify listeners
						this.emit('change', emitData);
					}
			
					return true;
				}
			
				return false;
			};
			
			
			///**
			// * Extends the model with the given attribute list
			// * @param {Object} data
			// */
			//Model.prototype.attributes = function ( data ) {
			//	var index   = 0,
			//		keyList = data && typeof data === 'object' ? Object.keys(data) : [];
			//	for ( ; index < keyList.length; index++ ) {
			//		this.set(keyList[index], data[keyList[index]]);
			//	}
			//};
			
			
			///**
			// * Prepare all data for sending to a server
			// * @return {Object}
			// */
			//Model.prototype.pack = function () {
			//	return this._data;
			//};
			
			
			///**
			// * Restores the received data from a server to a model data
			// * @param {Object} data
			// * @return {Object}
			// */
			//Model.prototype.unpack = function ( data ) {
			//	return data;
			//};
			
			
			///**
			// * Sync model to a server
			// */
			//Model.prototype.save = function () {
			//	var self = this;
			//	if ( this.url ) {
			//		// collect data
			//		io.ajax(this.url, {
			//			// request params
			//			method: self._data[self.idName] ? 'put' : 'post',
			//			data  : self.pack(),
			//			onload: function ( data ) {
			//				data = self.unpack(self.parse(data));
			//				self.attributes(data);
			//				console.log(data);
			//				self.emit('save', true);
			//			},
			//			// error handlers
			//			onerror:   this.saveFailure,
			//			ontimeout: this.saveFailure
			//		});
			//	}
			//};
			
			
			///**
			// * Error handler while model data fetch
			// */
			//Model.prototype.saveFailure = function () {
			//	this.emit('save', false);
			//};
			
			
			///**
			// * Converts received data from a server to a model attributes
			// * @param {string} response
			// * @return {Object}
			// */
			//Model.prototype.parse = function ( response ) {
			//	var data = {};
			//	try {
			//		data = JSON.parse(response).data;
			//	} catch(e){ console.log(e); }
			//	return data;
			//};
			
			
			// public
			module.exports = Model;


/***/ },
/* 22 */
/*!*******************************!*\
  !*** ./app/js/stb/request.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Ajax request wrapper.
			 *
			 * @module stb/request
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var request = {},
				defaults = {
					method    : 'GET',  // HTTP method to use, such as "GET", "POST", "PUT", "DELETE", etc.
					async     : true,   // whether or not to perform the operation asynchronously
					headers   : {},     // list of HTTP request headers
					type      : 'text', // "", "arraybuffer", "blob", "document", "json", "text"
					data      : null,   // data to send (plain object)
					timeout   : 30000,  // amount of milliseconds a request can take before being terminated
					onload    : null,   // callback when the request has successfully completed
					onerror   : null,   // callback when the request has failed
					ontimeout : null    // callback when the author specified timeout has passed before the request could complete
				},
				defaultsKeys = Object.keys(defaults);
			
			
			/**
			 * Main method to send ajax requests.
			 *
			 * @param {string} url address
			 * @param {Object} options Plain object with call parameters
			 * @return {XMLHttpRequest|Boolean} false in case of wrong params
			 *
			 * @example
			 * TODO: add
			 */
			request.ajax = function ( url, options ) {
				var i, headersKeys, client;
			
				// init
				options = options || {};
				// valid non-empty string
				if ( url && (typeof url === 'string' || url instanceof String) && url.length > 0 ) {
					// plain object is given as param
					if ( options && typeof options === 'object') {
						// extend with default options
						for ( i = 0 ; i < defaultsKeys.length ; i++ ) {
							// in case not redefined
							if ( options[defaultsKeys[i]] === undefined ) {
								options[defaultsKeys[i]] = defaults[defaultsKeys[i]];
							}
						}
					}
			
					client = new XMLHttpRequest();
					// init a request
					client.open(options.method, url, options.async);
			
					// apply the given headers
					if ( options.headers && typeof options.headers === 'object') {
						headersKeys = Object.keys(options.headers);
						for ( i = 0; i < headersKeys.length; i++ ) {
							client.setRequestHeader(headersKeys[i], options.headers[headersKeys[i]]);
						}
					}
			
					// set response type and timeout
					client.responseType = options.type;
					client.timeout      = options.timeout;
			
					// callbacks
					if ( options.onload && typeof options.onload === 'function' ) {
						client.onload = function onload () {
							options.onload.call(this, this.response || this.responseText, this.status);
						};
					}
					client.onerror   = options.onerror;
					client.ontimeout = options.ontimeout;
			
					// actual request
					//client.send(this.encode(options.data));
					client.send(options.data ? JSON.stringify(options.data) : null);
			
					return client;
				}
				return false;
			};
			
			
			/**
			 * Serializes the given data for sending to the server via ajax call.
			 *
			 * @param {Object} data Plain object to serialize
			 * @return {string} null if no data to encode
			 *
			 * @example
			 * TODO: add
			 */
			request.encode = function ( data ) {
				var result = [],
					i, keys;
			
				// input plain object validation
				if ( data && typeof data === 'object') {
					keys = Object.keys(data);
					// apply encoding
					for ( i = 0; i < keys.length; i++ ) {
						result.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(data[keys[i]]));
					}
					// build the list of params
					if ( result.length > 0 ) {
						return result.join('&');
					}
				}
				return null;
			};
			
			
			// public
			module.exports = request;


/***/ },
/* 23 */
/*!*****************************!*\
  !*** ./app/js/stb/shims.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			
			if ( !('classList' in document.documentElement) ) {
				var prototype = Array.prototype,
					indexOf = prototype.indexOf,
					slice = prototype.slice,
					push = prototype.push,
					splice = prototype.splice,
					join = prototype.join;
			
				window.DOMTokenList = function ( el ) {
					this._element = el;
					if (el.className !== this._classCache) {
						this._classCache = el.className;
						if (!this._classCache) { return; }
						var classes = this._classCache.replace(/^\s+|\s+$/g,'').split(/\s+/),
							i;
						for (i = 0; i < classes.length; i++) {
							push.call(this, classes[i]);
						}
					}
				};
				window.DOMTokenList.prototype = {
					add: function ( token ) {
						if(this.contains(token)) { return; }
						push.call(this, token);
						this._element.className = slice.call(this, 0).join(' ');
					},
					contains: function ( token ) {
						return indexOf.call(this, token) !== -1;
					},
					item: function ( index ) {
						return this[index] || null;
					},
					remove: function ( token ) {
						var i = indexOf.call(this, token);
						if (i === -1) {
							return;
						}
						splice.call(this, i, 1);
						this._element.className = slice.call(this, 0).join(' ');
					},
					toString: function () {
						return join.call(this, ' ');
					},
					toggle: function ( token ) {
						if (!this.contains(token)) {
							this.add(token);
						} else {
							this.remove(token);
						}
						return this.contains(token);
					}
				};
			
				Object.defineProperty(Element.prototype, 'classList',{
					get: function () {
						return new window.DOMTokenList(this);
					}
				});
			}


/***/ },
/* 24 */
/*!**************************!*\
  !*** ./config/logger.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * WebSocket logging server configuration.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			// public
			module.exports = {
				// turn on/off server
				active: false,
			
				// listening port
				port: 8010
			};


/***/ },
/* 25 */
/*!*************************!*\
  !*** ./config/proxy.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Code-proxy server configuration.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			// public
			module.exports = {
				// turn on/off server
				active: true,
			
				// listening HTTP port to serve proxy files
				portHttp: 8800,
			
				// listening WebSocket port to serve requests
				portWs: 8900,
			
				// time between connection/sending attempts (in ms)
				retryDelay: 100,
			
				// amount of connection/sending attempts before give up
				retryLimit: 30,
			
				// full logging
				logging: false,
			
				// session name
				name: 'anonymous',
			
				// use localStorage to get/save requests data
				cache: true
			};


/***/ },
/* 26 */
/*!**************************!*\
  !*** ./config/static.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * HTTP static server configuration.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			// public
			module.exports = {
				// turn on/off server
				active: true,
			
				// listening HTTP port to serve project files
				port: 8000,
			
				// static file server cache activation
				// false to disable of amount of seconds to cache
				cache: false,
			
				// full logging
				logging: true,
			
				// enable automatic reload on file changes mode
				livereload: true
			};


/***/ },
/* 27 */
/*!**************************!*\
  !*** ./config/weinre.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * WEb INspector REmote debugger server configuration.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			// public
			module.exports = {
				// turn on/off server
				active: true,
			
				// listening HTTP port to provide client interface
				port: 8080,
			
				// address to listen
				host: '-all-',
			
				// full logging
				logging: false,
			
				// debug servers session id
				name: 'anonymous'
			};


/***/ },
/* 28 */
/*!**************************************!*\
  !*** ./~/code-proxy/client/guest.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Client-side guest part.
			 *
			 * @author DarkPark
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			/**
			 * @constructor
			 *
			 * @param {Object} [options] set of initialization parameters (host, port, name)
			 */
			function ProxyGuest ( options ) {
				// prepare
				var name;
			
				// connection with server
				this.active = false;
			
				/**
				 * proxy instance configuration
				 * @namespace
				 */
				this.config = {
					// node.js server address
					host: '127.0.0.1',
			
					// http server port
					port: 8800,
			
					// session name
					name: 'anonymous',
			
					// cached url for posting requests
					urlPost: '',
			
					// cached url for info collecting
					urlInfo: ''
				};
			
				// single ajax object for performance
				this.xhr = new XMLHttpRequest();
			
				// validate and iterate input
				if ( options && typeof options === 'object' ) {
					for ( name in options ) {
						// rewrite defaults
						if ( options.hasOwnProperty(name) ) {
							this.config[name] = options[name];
						}
					}
				}
			
				// there may be some special chars
				name = encodeURIComponent(this.config.name);
			
				// cache final request urls
				this.config.urlPost = 'http://' + this.config.host + ':' + this.config.port + '/' + name;
				this.config.urlInfo = 'http://' + this.config.host + ':' + this.config.port + '/info/' + name;
			
				// check initial connection status
				this.active = this.info().active;
			
				console.log('%c[core]\t%c%s\t%c0\t%cconnection to the host %c(%s:%s): %c%s',
					'color:grey',
					'color:purple', this.config.name,
					'color:grey',
					'color:black',
					'color:grey', this.config.host, this.config.port,
					'color:' + (this.active ? 'green' : 'red'), this.active ? 'available' : 'not available'
				);
			}
			
			
			/**
			 * Sends a synchronous request to the host system.
			 *
			 * @param {Object} request JSON data to send
			 * @return {*} execution result from the host
			 */
			ProxyGuest.prototype.send = function ( request ) {
				// prepare
				var time = +new Date(),
					response;
			
				// mandatory init check
				if ( !this.config.urlPost ) {
					return false;
				}
			
				// make request
				this.xhr.open('post', this.config.urlPost, false);
				this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
				this.xhr.send(JSON.stringify(request));
			
				// proceed the result
				try {
					response = JSON.parse(this.xhr.responseText);
				} catch ( e ) {
					response = {error: e};
				}
			
				// update connection status
				this.active = !response.error;
			
				// detailed report
				console.groupCollapsed('%c[%s]\t%c%s\t%c%s\t%c%s',
					'color:grey;font-weight:normal', request.type,
					'color:purple;font-weight:normal', this.config.name,
					'color:grey;font-weight:normal', +new Date() - time,
					'color:' + (response.error ? 'red' : 'green'), request.method || request.code
				);
				if ( request.params !== undefined ) { console.log('%c%s:\t', 'font-weight:bold', 'Params', request.params); }
				if ( response.data  !== undefined ) { console.log('%c%s:\t', 'font-weight:bold', 'Result', response.data); }
				if ( response.error !== undefined ) { console.error(response.error); }
				console.groupEnd();
			
				// ready
				return response.data;
			};
			
			
			/**
			 * Wrapper to send a line of js code to eval on the host.
			 *
			 * @param {String} code javascript source code to execute on the device
			 * @return {*} execution result from the host
			 */
			ProxyGuest.prototype.eval = function ( code ) {
				return this.send({
					type: 'eval',
					code: code
				});
			};
			
			
			/**
			 * Wrapper to send one function of js code with arguments to eval on the host.
			 *
			 * @param {String} method javascript function name (like "encodeURIComponent")
			 * @param {Array} params list of the function arguments
			 * @param {String} [context=window] remote call context
			 * @return {*} execution result from the host
			 */
			ProxyGuest.prototype.call = function ( method, params, context ) {
				return this.send({
					type:    'call',
					method:  method,
					params:  params,
					context: context
				});
			};
			
			
			/**
			 * Wrapper to send a var name to get json.
			 *
			 * @param {String} name javascript var name to serialize
			 * @return {*} execution result from the host
			 */
			ProxyGuest.prototype.json = function ( name ) {
				var data = this.send({
					type: 'json',
					code: name
				});
			
				return data ? JSON.parse(data) : null;
			};
			
			
			/**
			 * Gets the detailed info about the current connection.
			 *
			 * @return {{active:Boolean, count:Number}|{active:Boolean}|Boolean} info
			 */
			ProxyGuest.prototype.info = function () {
				// mandatory init check
				if ( !this.config.urlInfo ) {
					return false;
				}
			
				// make request
				this.xhr.open('get', this.config.urlInfo, false);
				this.xhr.send();
			
				return JSON.parse(this.xhr.responseText || false);
			};
			
			
			// CommonJS modules support
			if ( typeof module !== 'undefined' && module.exports ) {
				module.exports = ProxyGuest;
			}


/***/ },
/* 29 */
/*!*************************************!*\
  !*** ./~/code-proxy/client/host.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Client-side host part.
			 *
			 * @author DarkPark
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			/**
			 * @constructor
			 *
			 * @param {Object} [options] set of initialization parameters (host, port, name)
			 */
			function ProxyHost ( options ) {
				// prepare
				var name;
			
			    // connection with server
			    this.active = false;
			
				/**
				 * proxy instance configuration
				 * @namespace
				 */
				this.config = {
					/** proxy server address */
					host : '127.0.0.1',
			
					/** proxy server websocket port */
					port : 8900,
			
					/** session name */
					name : 'anonymous',
			
					/** automatically try to restore connection on disconnect */
					reconnect : true,
			
					/** time between connection attempts (5s) */
					reconnectInterval : 5000
				};
			
				/**
				 * @type {WebSocket}
				 */
				this.socket = null;
			
				// validate and iterate input
				if ( options && typeof options === 'object' ) {
					for ( name in options ) {
						// rewrite defaults
						if ( options.hasOwnProperty(name) ) { this.config[name] = options[name]; }
					}
				}
			
				// try to establish connection
				this.connect();
			}
			
			
			/**
			 * Connect to the proxy server
			 */
			ProxyHost.prototype.connect = function () {
				// prepare
				var self = this;
			
				// establish the connection
				// there may be some special chars in name
				this.socket = new WebSocket('ws://' + this.config.host + ':' + this.config.port + '/' + encodeURIComponent(this.config.name));
			
				/**
				 * event hook
				 * @callback
				 */
				this.socket.onopen = function(){
					self.log('core', 0, true, 'connection established');
			
			        self.active = true;
				};
			
				/**
				 * event hook
				 * @callback
				 */
				this.socket.onclose = function(){
					self.log('core', 0, false, 'no connection');
			
			        self.active = false;
			
					if ( self.config.reconnect ) {
						setTimeout(function () {
							self.connect();
						}, self.config.reconnectInterval);
					}
				};
			
				/**
				 * Message from a desktop browser.
				 *
				 * @callback
				 */
				this.socket.onmessage = function ( message ) {
					// prepare
					var response = {time:+new Date()},
						request, context;
			
					// proceed the message
					try {
						request = JSON.parse(message.data || false);
						switch ( request.type ) {
							case 'call':
								context = request.context ? eval(request.context) : window;
								response.data = eval(request.method).apply(context, request.params);
								break;
							case 'eval':
								response.data = eval(request.code);
								break;
							case 'json':
								response.data = JSON.stringify(eval(request.code));
								break;
							default:
								response.error = 'invalid incoming request';
						}
					} catch ( e ) {
						response.error = e.toString();
					}
			
					// time taken
					response.time = +new Date() - response.time;
					// wrap and send back
					this.send(JSON.stringify(response));
			
					// detailed report
					self.log(request.type, response.time, !response.error, request.method || request.code, request.params);
				};
			};
			
			
			/**
			 * Finish the connection and strop reconnection if any.
			 */
			ProxyHost.prototype.disconnect = function () {
				// stop auto connection
				this.config.reconnect = false;
				this.socket.close();
			};
			
			
			/**
			 * Logging wrapper.
			 *
			 * @param {String} type
			 * @param {Number} time
			 * @param {Boolean} status
			 * @param {String} message
			 * @param {*} [params]
			 */
			ProxyHost.prototype.log = function ( type, time, status, message, params ) {
				console.log('%c[%s]\t%c%s\t%c%s\t%c%s\t',
					'color:grey', type,
					'color:purple', this.config.name,
					'color:grey', time,
					'color:' + (status ? 'green' : 'red'), message,
					params || ''
				);
			};
			
			
			// CommonJS modules support
			if ( typeof module !== 'undefined' && module.exports ) {
				module.exports = ProxyHost;
			}


/***/ },
/* 30 */
/*!***************************************!*\
  !*** ./~/gremlins.js/gremlins.min.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
			 * This file is generated. Don't modify it directly. (c)
			 */
			
			/**
			 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
			 * Available via the MIT or new BSD license.
			 * see: http://github.com/jrburke/almond for details
			 */
			
			//  Chance.js 0.5.4
			//  http://chancejs.com
			//  (c) 2013 Victor Quinn
			//  Chance may be freely distributed or modified under the MIT license.
			
			/**
			 * gremlins.js 0.1.0 Copyright (c) 2014, marmelab
			 * Available via the MIT license.
			 * see: http://github.com/marmelab/gremlins.js for details
			 */
			
			(function(e,t){true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (t), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):typeof exports=="object"?module.exports=t():e.gremlins=t()})(this,function(){var e,t,n;return function(r){function d(e,t){return h.call(e,t)}function v(e,t){var n,r,i,s,o,u,a,f,c,h,p=t&&t.split("/"),d=l.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(f=0;f<e.length;f+=1){h=e[f];if(h===".")e.splice(f,1),f-=1;else if(h===".."){if(f===1&&(e[2]===".."||e[0]===".."))break;f>0&&(e.splice(f-1,2),f-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(f=n.length;f>0;f-=1){r=n.slice(0,f).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=f;break}}}if(s)break;!u&&v&&v[r]&&(u=v[r],a=f)}!s&&u&&(s=u,o=a),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function m(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function g(e){return function(t){return v(t,e)}}function y(e){return function(t){a[e]=t}}function b(e){if(d(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!d(a,e)&&!d(c,e))throw new Error("No "+e);return a[e]}function w(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function E(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice;o=function(e,t){var n,r=w(e),i=r[0];return e=r[1],i&&(i=v(i,t),n=b(i)),i?n&&n.normalize?e=n.normalize(e,g(t)):e=v(e,t):(e=v(e,t),r=w(e),i=r[0],e=r[1],i&&(n=b(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return m(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:E(e)}}},i=function(e,t,n,i){var s,l,h,p,v,g=[],w;i=i||e;if(typeof n=="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(v=0;v<t.length;v+=1){p=o(t[v],i),l=p.f;if(l==="require")g[v]=u.require(e);else if(l==="exports")g[v]=u.exports(e),w=!0;else if(l==="module")s=g[v]=u.module(e);else if(d(a,l)||d(f,l)||d(c,l))g[v]=b(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,m(i,!0),y(l),{}),g[v]=a[l]}}h=n.apply(a[e],g);if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!w)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){return typeof e=="string"?u[e]?u[e](t):b(o(e,t).f):(e.splice||(l=e,t.splice?(e=t,t=n,n=null):e=r),t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s)},s.config=function(e){return l=e,l.deps&&s(l.deps,l.callback),s},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!d(a,e)&&!d(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("../src/vendor/almond.js",function(){}),function(){function a(e,t){e||(e={});if(!t)return e;for(var n in t)typeof e[n]=="undefined"&&(e[n]=t[n]);return e}function f(e,t){if(e)throw new RangeError(t)}var e=9007199254740992,t=-e,r="0123456789",i="abcdefghijklmnopqrstuvwxyz",s=i.toUpperCase(),o=r+"abcdef",u=function(e){e!==undefined&&(typeof e=="function"?this.random=e:this.seed=e),typeof this.random=="undefined"&&(this.mt=this.mersenne_twister(e),this.random=function(){return this.mt.random(this.seed)})};u.prototype.bool=function(e){return e=a(e,{likelihood:50}),f(e.likelihood<0||e.likelihood>100,"Chance: Likelihood accepts values from 0 to 100."),this.random()*100<e.likelihood},u.prototype.character=function(e){e=a(e);var t="!@#$%^&*()[]",n,o;return f(e.alpha&&e.symbols,"Chance: Cannot specify both alpha and symbols."),e.casing==="lower"?n=i:e.casing==="upper"?n=s:n=i+s,e.pool?o=e.pool:e.alpha?o=n:e.symbols?o=t:o=n+r+t,o.charAt(this.natural({max:o.length-1}))},u.prototype.floating=function(t){var n,r;t=a(t,{fixed:4});var i=Math.pow(10,t.fixed);f(t.fixed&&t.precision,"Chance: Cannot specify both fixed and precision.");var s=e/i,o=-s;f(t.min&&t.fixed&&t.min<o,"Chance: Min specified is out of range with fixed. Min should be, at least, "+o),f(t.max&&t.fixed&&t.max>s,"Chance: Max specified is out of range with fixed. Max should be, at most, "+s),t=a(t,{min:o,max:s}),n=this.integer({min:t.min*i,max:t.max*i});var u=(n/i).toFixed(t.fixed);return parseFloat(u)},u.prototype.integer=function(n){var r,i;n=a(n,{min:t,max:e}),i=Math.max(Math.abs(n.min),Math.abs(n.max));do r=this.natural({max:i}),r=this.bool()?r:r*-1;while(r<n.min||r>n.max);return r},u.prototype.natural=function(t){return t=a(t,{min:0,max:e}),f(t.min>t.max,"Chance: Min cannot be greater than Max."),Math.floor(this.random()*(t.max-t.min+1)+t.min)},u.prototype.normal=function(e){e=a(e,{mean:0,dev:1});var t,n,r,i,s=e.mean,o=e.dev;do n=this.random()*2-1,r=this.random()*2-1,t=n*n+r*r;while(t>=1);return i=n*Math.sqrt(-2*Math.log(t)/t),o*i+s},u.prototype.string=function(e){e=a(e);var t=e.length||this.natural({min:5,max:20}),n="",r=e.pool;for(var i=0;i<t;i++)n+=this.character({pool:r});return n},u.prototype.capitalize=function(e){return e.charAt(0).toUpperCase()+e.substr(1)},u.prototype.mixin=function(e){var t=this;for(var n in e)u.prototype[n]=e[n];return this},u.prototype.pick=function(e,t){return!t||t===1?e[this.natural({max:e.length-1})]:this.shuffle(e).slice(0,t)},u.prototype.shuffle=function(e){var t=e.slice(0),n=[],r=0,i=Number(t.length);for(var s=0;s<i;s++)r=this.natural({max:t.length-1}),n[s]=t[r],t.splice(r,1);return n},u.prototype.paragraph=function(e){e=a(e);var t=e.sentences||this.natural({min:3,max:7}),n=[];for(var r=0;r<t;r++)n.push(this.sentence());return n.join(" ")},u.prototype.sentence=function(e){e=a(e);var t=e.words||this.natural({min:12,max:18}),n,r=[];for(var i=0;i<t;i++)r.push(this.word());return n=r.join(" "),n=this.capitalize(n)+".",n},u.prototype.syllable=function(e){e=a(e);var t=e.length||this.natural({min:2,max:3}),n="bcdfghjklmnprstvwz",r="aeiou",i=n+r,s="",o;for(var u=0;u<t;u++)u===0?o=this.character({pool:i}):n.indexOf(o)===-1?o=this.character({pool:n}):o=this.character({pool:r}),s+=o;return s},u.prototype.word=function(e){e=a(e),f(e.syllables&&e.length,"Chance: Cannot specify both syllables AND length.");var t=e.syllables||this.natural({min:1,max:3}),n="";if(e.length){do n+=this.syllable();while(n.length<e.length);n=n.substring(0,e.length)}else for(var r=0;r<t;r++)n+=this.syllable();return n},u.prototype.age=function(e){e=a(e);var t;switch(e.type){case"child":t=this.natural({min:1,max:12});break;case"teen":t=this.natural({min:13,max:19});break;case"adult":t=this.natural({min:18,max:120});break;case"senior":t=this.natural({min:65,max:120});break;default:t=this.natural({min:1,max:120})}return t},u.prototype.birthday=function(e){return e=a(e,{year:(new Date).getFullYear()-this.age(e)}),this.date(e)};var l=["Sophia","Emma","Isabella","Jacob","Mason","Ethan","Noah","Olivia","William","Liam","Jayden","Michael","Ava","Alexander","Aiden","Daniel","Matthew","Elijah","Emily","James","Anthony","Benjamin","Abigail","Joshua","Andrew","David","Joseph","Logan","Jackson","Mia","Christopher","Gabriel","Madison","Samuel","Ryan","Lucas","John","Nathan","Isaac","Dylan","Caleb","Elizabeth","Chloe","Christian","Landon","Jonathan","Carter","Ella","Luke","Owen","Brayden","Avery","Gavin","Wyatt","Addison","Isaiah","Aubrey","Henry","Eli","Hunter","Lily","Jack","Natalie","Evan","Sofia","Jordan","Nicholas","Tyler","Aaron","Charlotte","Zoey","Jeremiah","Julian","Cameron","Grace","Hannah","Amelia","Harper","Levi","Lillian","Brandon","Angel","Austin","Connor","Adrian","Robert","Samantha","Charles","Evelyn","Victoria","Thomas","Brooklyn","Sebastian","Zoe","Colton","Jaxon","Layla","Kevin","Zachary","Ayden","Dominic","Blake","Jose","Hailey","Oliver","Justin","Bentley","Leah","Jason","Chase","Ian","Kaylee","Anna","Aaliyah","Gabriella","Josiah","Allison","Parker","Xavier","Nevaeh","Alexis","Adam","Audrey","Cooper","Savannah","Sarah","Alyssa","Claire","Taylor","Riley","Camila","Nathaniel","Arianna","Ashley","Grayson","Jace","Brianna","Carson","Sophie","Peyton","Nolan","Tristan","Luis","Brody","Bella","Khloe","Genesis","Alexa","Juan","Hudson","Serenity","Kylie","Aubree","Scarlett","Bryson","Carlos","Stella","Maya","Easton","Katherine","Julia","Damian","Alex","Kayden","Ryder","Lucy","Madelyn","Jesus","Cole","Autumn","Makayla","Kayla","Mackenzie","Micah","Vincent","Max","Lauren","Jaxson","Gianna","Eric","Ariana","Asher","Hayden","Faith","Alexandra","Melanie","Sydney","Bailey","Caroline","Naomi","Morgan","Kennedy","Ellie","Jasmine","Eva","Skylar","Diego","Kimberly","Violet","Molly","Miles","Steven","Aria","Ivan","Jocelyn","Trinity","Elias","Aidan","Maxwell","London","Bryce","Lydia","Madeline","Antonio","Giovanni","Reagan","Timothy","Bryan","Piper","Andrea","Santiago","Annabelle","Maria","Colin","Richard","Braxton","Kaleb","Brooke","Kyle","Kaden","Preston","Payton","Miguel","Jonah","Paisley","Paige","Lincoln","Ruby","Nora","Riley","Mariah","Leo","Victor","Brady","Jeremy","Mateo","Brian","Jaden","Ashton","Patrick","Rylee","Declan","Lilly","Brielle","Sean","Joel","Gael","Sawyer","Alejandro","Jade","Marcus","Destiny","Leonardo","Jesse","Caden","Jake","Kaiden","Nicole","Mila","Wesley","Kendall","Liliana","Camden","Kaitlyn","Natalia","Sadie","Edward","Brantley","Jordyn","Roman","Vanessa","Mary","Mya","Penelope","Isabelle","Alice","Axel","Silas","Jude","Grant","Reese","Gabrielle","Hadley","Katelyn","Angelina","Rachel","Isabel","Eleanor","Cayden","Emmanuel","George","Clara","Brooklynn","Jessica","Maddox","Malachi","Bradley","Alan","Weston","Elena","Gage","Aliyah","Vivian","Laila","Sara","Amy","Devin","Eliana","Greyson","Lyla","Juliana","Kenneth","Mark","Oscar","Tanner","Rylan","Valeria","Adriana","Nicolas","Makenzie","Harrison","Elise","Mckenzie","Derek","Quinn","Delilah","Peyton","Ezra","Cora","Kylee","Tucker","Emmett","Avery","Cody","Rebecca","Gracie","Izabella","Calvin","Andres","Jorge","Abel","Paul","Abraham","Kai","Josephine","Alaina","Michelle","Jennifer","Collin","Theodore","Ezekiel","Eden","Omar","Jayce","Valentina","Conner","Bennett","Aurora","Catherine","Stephanie","Trevor","Valerie","Eduardo","Peter","Maximus","Jayla","Jaiden","Willow","Jameson","Seth","Daisy","Alana","Melody","Hazel","Kingston","Summer","Melissa","Javier","Margaret","Travis","Kinsley","Kinley","Garrett","Everett","Ariel","Lila","Graham","Giselle","Ryleigh","Xander","Haley","Julianna","Ivy","Alivia","Cristian","Brynn","Damien","Ryker","Griffin","Keira","Daniela","Aniyah","Angela","Kate","Londyn","Corbin","Myles","Hayden","Harmony","Adalyn","Luca","Zane","Francisco","Ricardo","Alexis","Stephen","Zayden","Megan","Allie","Gabriela","Iker","Drake","Alayna","Lukas","Presley","Charlie","Spencer","Zion","Erick","Jenna","Josue","Alexandria","Ashlyn","Adrianna","Jada","Jeffrey","Trenton","Fiona","Chance","Norah","Paxton","Elliot","Emery","Fernando","Maci","Miranda","Keegan","Landen","Ximena","Amaya","Manuel","Amir","Shane","Cecilia","Raymond","Andre","Ana","Shelby","Katie","Hope","Callie","Jordan","Luna","Leilani","Eliza","Mckenna","Angel","Genevieve","Makenna","Isla","Lola","Danielle","Chelsea","Leila","Tessa","Adelyn","Camille","Mikayla","Adeline","Adalynn","Sienna","Esther","Jacqueline","Emerson","Arabella","Maggie","Athena","Lucia","Lexi","Ayla"];u.prototype.first=function(){return this.pick(l)},u.prototype.gender=function(){return this.pick(["Male","Female"])};var c=["Smith","Johnson","Williams","Jones","Brown","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Rodriguez","Lewis","Lee","Walker","Hall","Allen","Young","Hernandez","King","Wright","Lopez","Hill","Scott","Green","Adams","Baker","Gonzalez","Nelson","Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards","Collins","Stewart","Sanchez","Morris","Rogers","Reed","Cook","Morgan","Bell","Murphy","Bailey","Rivera","Cooper","Richardson","Cox","Howard","Ward","Torres","Peterson","Gray","Ramirez","James","Watson","Brooks","Kelly","Sanders","Price","Bennett","Wood","Barnes","Ross","Henderson","Coleman","Jenkins","Perry","Powell","Long","Patterson","Hughes","Flores","Washington","Butler","Simmons","Foster","Gonzales","Bryant","Alexander","Russell","Griffin","Diaz","Hayes","Myers","Ford","Hamilton","Graham","Sullivan","Wallace","Woods","Cole","West","Jordan","Owens","Reynolds","Fisher","Ellis","Harrison","Gibson","McDonald","Cruz","Marshall","Ortiz","Gomez","Murray","Freeman","Wells","Webb","Simpson","Stevens","Tucker","Porter","Hunter","Hicks","Crawford","Henry","Boyd","Mason","Morales","Kennedy","Warren","Dixon","Ramos","Reyes","Burns","Gordon","Shaw","Holmes","Rice","Robertson","Hunt","Black","Daniels","Palmer","Mills","Nichols","Grant","Knight","Ferguson","Rose","Stone","Hawkins","Dunn","Perkins","Hudson","Spencer","Gardner","Stephens","Payne","Pierce","Berry","Matthews","Arnold","Wagner","Willis","Ray","Watkins","Olson","Carroll","Duncan","Snyder","Hart","Cunningham","Bradley","Lane","Andrews","Ruiz","Harper","Fox","Riley","Armstrong","Carpenter","Weaver","Greene","Lawrence","Elliott","Chavez","Sims","Austin","Peters","Kelley","Franklin","Lawson","Fields","Gutierrez","Ryan","Schmidt","Carr","Vasquez","Castillo","Wheeler","Chapman","Oliver","Montgomery","Richards","Williamson","Johnston","Banks","Meyer","Bishop","McCoy","Howell","Alvarez","Morrison","Hansen","Fernandez","Garza","Harvey","Little","Burton","Stanley","Nguyen","George","Jacobs","Reid","Kim","Fuller","Lynch","Dean","Gilbert","Garrett","Romero","Welch","Larson","Frazier","Burke","Hanson","Day","Mendoza","Moreno","Bowman","Medina","Fowler","Brewer","Hoffman","Carlson","Silva","Pearson","Holland","Douglas","Fleming","Jensen","Vargas","Byrd","Davidson","Hopkins","May","Terry","Herrera","Wade","Soto","Walters","Curtis","Neal","Caldwell","Lowe","Jennings","Barnett","Graves","Jimenez","Horton","Shelton","Barrett","Obrien","Castro","Sutton","Gregory","McKinney","Lucas","Miles","Craig","Rodriquez","Chambers","Holt","Lambert","Fletcher","Watts","Bates","Hale","Rhodes","Pena","Beck","Newman","Haynes","McDaniel","Mendez","Bush","Vaughn","Parks","Dawson","Santiago","Norris","Hardy","Love","Steele","Curry","Powers","Schultz","Barker","Guzman","Page","Munoz","Ball","Keller","Chandler","Weber","Leonard","Walsh","Lyons","Ramsey","Wolfe","Schneider","Mullins","Benson","Sharp","Bowen","Daniel","Barber","Cummings","Hines","Baldwin","Griffith","Valdez","Hubbard","Salazar","Reeves","Warner","Stevenson","Burgess","Santos","Tate","Cross","Garner","Mann","Mack","Moss","Thornton","Dennis","McGee","Farmer","Delgado","Aguilar","Vega","Glover","Manning","Cohen","Harmon","Rodgers","Robbins","Newton","Todd","Blair","Higgins","Ingram","Reese","Cannon","Strickland","Townsend","Potter","Goodwin","Walton","Rowe","Hampton","Ortega","Patton","Swanson","Joseph","Francis","Goodman","Maldonado","Yates","Becker","Erickson","Hodges","Rios","Conner","Adkins","Webster","Norman","Malone","Hammond","Flowers","Cobb","Moody","Quinn","Blake","Maxwell","Pope","Floyd","Osborne","Paul","McCarthy","Guerrero","Lindsey","Estrada","Sandoval","Gibbs","Tyler","Gross","Fitzgerald","Stokes","Doyle","Sherman","Saunders","Wise","Colon","Gill","Alvarado","Greer","Padilla","Simon","Waters","Nunez","Ballard","Schwartz","McBride","Houston","Christensen","Klein","Pratt","Briggs","Parsons","McLaughlin","Zimmerman","French","Buchanan","Moran","Copeland","Roy","Pittman","Brady","McCormick","Holloway","Brock","Poole","Frank","Logan","Owen","Bass","Marsh","Drake","Wong","Jefferson","Park","Morton","Abbott","Sparks","Patrick","Norton","Huff","Clayton","Massey","Lloyd","Figueroa","Carson","Bowers","Roberson","Barton","Tran","Lamb","Harrington","Casey","Boone","Cortez","Clarke","Mathis","Singleton","Wilkins","Cain","Bryan","Underwood","Hogan","McKenzie","Collier","Luna","Phelps","McGuire","Allison","Bridges","Wilkerson","Nash","Summers","Atkins"];u.prototype.last=function(){return this.pick(c)},u.prototype.name=function(e){e=a(e);var t=this.first(),n=this.last(),r;return e.middle?r=t+" "+this.first()+" "+n:e.middle_initial?r=t+" "+this.character({alpha:!0,casing:"upper"})+". "+n:r=t+" "+n,e.prefix&&(r=this.prefix()+" "+r),r},u.prototype.name_prefixes=function(){return[{name:"Doctor",abbreviation:"Dr."},{name:"Miss",abbreviation:"Miss"},{name:"Misses",abbreviation:"Mrs."},{name:"Mister",abbreviation:"Mr."}]},u.prototype.prefix=function(e){return this.name_prefix(e)},u.prototype.name_prefix=function(e){return e=a(e),e.full?this.pick(this.name_prefixes()).name:this.pick(this.name_prefixes()).abbreviation},u.prototype.color=function(e){function t(e,t){return[e,e,e].join(t||"")}e=a(e,{format:this.pick(["hex","shorthex","rgb"]),grayscale:!1});var n=e.grayscale;if(e.format==="hex")return"#"+(n?t(this.hash({length:2})):this.hash({length:6}));if(e.format==="shorthex")return"#"+(n?t(this.hash({length:1})):this.hash({length:3}));if(e.format==="rgb")return n?"rgb("+t(this.natural({max:255}),",")+")":"rgb("+this.natural({max:255})+","+this.natural({max:255})+","+this.natural({max:255})+")";throw new Error('Invalid format provided. Please provide one of "hex", "shorthex", or "rgb"')},u.prototype.domain=function(e){return e=a(e),this.word()+"."+(e.tld||this.tld())},u.prototype.email=function(e){return e=a(e),this.word()+"@"+(e.domain||this.domain())},u.prototype.fbid=function(){return parseInt("10000"+this.natural({max:1e11}),10)},u.prototype.hashtag=function(){return"#"+this.word()},u.prototype.ip=function(){return this.natural({max:255})+"."+this.natural({max:255})+"."+this.natural({max:255})+"."+this.natural({max:255})},u.prototype.ipv6=function(){var e="";for(var t=0;t<8;t++)e+=this.hash({length:4})+":";return e.substr(0,e.length-1)},u.prototype.klout=function(){return this.natural({min:1,max:99})},u.prototype.tlds=function(){return["com","org","edu","gov","co.uk","net","io"]},u.prototype.tld=function(){return this.pick(this.tlds())},u.prototype.twitter=function(){return"@"+this.word()},u.prototype.address=function(e){return e=a(e),this.natural({min:5,max:2e3})+" "+this.street(e)},u.prototype.areacode=function(e){e=a(e,{parens:!0});var t=this.natural({min:2,max:9}).toString()+this.natural({min:0,max:8}).toString()+this.natural({min:0,max:9}).toString();return e.parens?"("+t+")":t},u.prototype.city=function(){return this.capitalize(this.word({syllables:3}))},u.prototype.coordinates=function(e){return e=a(e),this.latitude(e)+", "+this.longitude(e)},u.prototype.latitude=function(e){return e=a(e,{fixed:5}),this.floating({min:-90,max:90,fixed:e.fixed})},u.prototype.longitude=function(e){return e=a(e,{fixed:5}),this.floating({min:0,max:180,fixed:e.fixed})},u.prototype.phone=function(e){e=a(e,{formatted:!0}),e.formatted||(e.parens=!1);var t=this.areacode(e).toString(),n=this.natural({min:2,max:9}).toString()+this.natural({min:0,max:9}).toString()+this.natural({min:0,max:9}).toString(),r=this.natural({min:1e3,max:9999}).toString();return e.formatted?t+" "+n+"-"+r:t+n+r},u.prototype.postal=function(){var e=this.character({pool:"XVTSRPNKLMHJGECBA"}),t=e+this.natural({max:9})+this.character({alpha:!0,casing:"upper"}),n=this.natural({max:9})+this.character({alpha:!0,casing:"upper"})+this.natural({max:9});return t+" "+n},u.prototype.provinces=function(){return[{name:"Alberta",abbreviation:"AB"},{name:"British Columbia",abbreviation:"BC"},{name:"Manitoba",abbreviation:"MB"},{name:"New Brunswick",abbreviation:"NB"},{name:"Newfoundland and Labrador",abbreviation:"NL"},{name:"Nova Scotia",abbreviation:"NS"},{name:"Ontario",abbreviation:"ON"},{name:"Prince Edward Island",abbreviation:"PE"},{name:"Quebec",abbreviation:"QC"},{name:"Saskatchewan",abbreviation:"SK"},{name:"Northwest Territories",abbreviation:"NT"},{name:"Nunavut",abbreviation:"NU"},{name:"Yukon",abbreviation:"YT"}]},u.prototype.province=function(e){return e&&e.full?this.pick(this.provinces()).name:this.pick(this.provinces()).abbreviation},u.prototype.radio=function(e){e=a(e,{side:"?"});var t="";switch(e.side.toLowerCase()){case"east":case"e":t="W";break;case"west":case"w":t="K";break;default:t=this.character({pool:"KW"})}return t+this.character({alpha:!0,casing:"upper"})+this.character({alpha:!0,casing:"upper"})+this.character({alpha:!0,casing:"upper"})},u.prototype.state=function(e){return e&&e.full?this.pick(this.states()).name:this.pick(this.states()).abbreviation},u.prototype.states=function(){return[{name:"Alabama",abbreviation:"AL"},{name:"Alaska",abbreviation:"AK"},{name:"American Samoa",abbreviation:"AS"},{name:"Arizona",abbreviation:"AZ"},{name:"Arkansas",abbreviation:"AR"},{name:"Armed Forces Europe",abbreviation:"AE"},{name:"Armed Forces Pacific",abbreviation:"AP"},{name:"Armed Forces the Americas",abbreviation:"AA"},{name:"California",abbreviation:"CA"},{name:"Colorado",abbreviation:"CO"},{name:"Connecticut",abbreviation:"CT"},{name:"Delaware",abbreviation:"DE"},{name:"District of Columbia",abbreviation:"DC"},{name:"Federated States of Micronesia",abbreviation:"FM"},{name:"Florida",abbreviation:"FL"},{name:"Georgia",abbreviation:"GA"},{name:"Guam",abbreviation:"GU"},{name:"Hawaii",abbreviation:"HI"},{name:"Idaho",abbreviation:"ID"},{name:"Illinois",abbreviation:"IL"},{name:"Indiana",abbreviation:"IN"},{name:"Iowa",abbreviation:"IA"},{name:"Kansas",abbreviation:"KS"},{name:"Kentucky",abbreviation:"KY"},{name:"Louisiana",abbreviation:"LA"},{name:"Maine",abbreviation:"ME"},{name:"Marshall Islands",abbreviation:"MH"},{name:"Maryland",abbreviation:"MD"},{name:"Massachusetts",abbreviation:"MA"},{name:"Michigan",abbreviation:"MI"},{name:"Minnesota",abbreviation:"MN"},{name:"Mississippi",abbreviation:"MS"},{name:"Missouri",abbreviation:"MO"},{name:"Montana",abbreviation:"MT"},{name:"Nebraska",abbreviation:"NE"},{name:"Nevada",abbreviation:"NV"},{name:"New Hampshire",abbreviation:"NH"},{name:"New Jersey",abbreviation:"NJ"},{name:"New Mexico",abbreviation:"NM"},{name:"New York",abbreviation:"NY"},{name:"North Carolina",abbreviation:"NC"},{name:"North Dakota",abbreviation:"ND"},{name:"Northern Mariana Islands",abbreviation:"MP"},{name:"Ohio",abbreviation:"OH"},{name:"Oklahoma",abbreviation:"OK"},{name:"Oregon",abbreviation:"OR"},{name:"Pennsylvania",abbreviation:"PA"},{name:"Puerto Rico",abbreviation:"PR"},{name:"Rhode Island",abbreviation:"RI"},{name:"South Carolina",abbreviation:"SC"},{name:"South Dakota",abbreviation:"SD"},{name:"Tennessee",abbreviation:"TN"},{name:"Texas",abbreviation:"TX"},{name:"Utah",abbreviation:"UT"},{name:"Vermont",abbreviation:"VT"},{name:"Virgin Islands, U.S.",abbreviation:"VI"},{name:"Virginia",abbreviation:"VA"},{name:"Washington",abbreviation:"WA"},{name:"West Virginia",abbreviation:"WV"},{name:"Wisconsin",abbreviation:"WI"},{name:"Wyoming",abbreviation:"WY"}]},u.prototype.street=function(e){e=a(e);var t=this.word({syllables:2});return t=this.capitalize(t),t+=" ",t+=e.short_suffix?this.street_suffix().abbreviation:this.street_suffix().name,t},u.prototype.street_suffix=function(){return this.pick(this.street_suffixes())},u.prototype.street_suffixes=function(){return[{name:"Avenue",abbreviation:"Ave"},{name:"Boulevard",abbreviation:"Blvd"},{name:"Center",abbreviation:"Ctr"},{name:"Circle",abbreviation:"Cir"},{name:"Court",abbreviation:"Ct"},{name:"Drive",abbreviation:"Dr"},{name:"Extension",abbreviation:"Ext"},{name:"Glen",abbreviation:"Gln"},{name:"Grove",abbreviation:"Grv"},{name:"Heights",abbreviation:"Hts"},{name:"Highway",abbreviation:"Hwy"},{name:"Junction",abbreviation:"Jct"},{name:"Key",abbreviation:"Key"},{name:"Lane",abbreviation:"Ln"},{name:"Loop",abbreviation:"Loop"},{name:"Manor",abbreviation:"Mnr"},{name:"Mill",abbreviation:"Mill"},{name:"Park",abbreviation:"Park"},{name:"Parkway",abbreviation:"Pkwy"},{name:"Pass",abbreviation:"Pass"},{name:"Path",abbreviation:"Path"},{name:"Pike",abbreviation:"Pike"},{name:"Place",abbreviation:"Pl"},{name:"Plaza",abbreviation:"Plz"},{name:"Point",abbreviation:"Pt"},{name:"Ridge",abbreviation:"Rdg"},{name:"River",abbreviation:"Riv"},{name:"Road",abbreviation:"Rd"},{name:"Square",abbreviation:"Sq"},{name:"Street",abbreviation:"St"},{name:"Terrace",abbreviation:"Ter"},{name:"Trail",abbreviation:"Trl"},{name:"Turnpike",abbreviation:"Tpke"},{name:"View",abbreviation:"Vw"},{name:"Way",abbreviation:"Way"}]},u.prototype.tv=function(e){return this.radio(e)},u.prototype.zip=function(e){var t="";for(var n=0;n<5;n++)t+=this.natural({max:9}).toString();if(e&&e.plusfour===!0){t+="-";for(n=0;n<4;n++)t+=this.natural({max:9}).toString()}return t},u.prototype.ampm=function(){return this.bool()?"am":"pm"},u.prototype.date=function(e){var t=this.month({raw:!0}),n;e=a(e,{year:parseInt(this.year(),10),month:t.numeric-1,day:this.natural({min:1,max:t.days}),hour:this.hour(),minute:this.minute(),second:this.second(),millisecond:this.millisecond(),american:!0,string:!1});var r=new Date(e.year,e.month,e.day,e.hour,e.minute,e.second,e.millisecond);return e.american?n=r.getMonth()+1+"/"+r.getDate()+"/"+r.getFullYear():n=r.getDate()+"/"+(r.getMonth()+1)+"/"+r.getFullYear(),e.string?n:r},u.prototype.hammertime=function(e){return this.date(e).getTime()},u.prototype.hour=function(e){e=a(e);var t=e.twentyfour?24:12;return this.natural({min:1,max:t})},u.prototype.millisecond=function(){return this.natural({max:999})},u.prototype.minute=u.prototype.second=function(){return this.natural({max:59})},u.prototype.month=function(e){e=a(e);var t=this.pick(this.months());return e.raw?t:t.name},u.prototype.months=function(){return[{name:"January",short_name:"Jan",numeric:"01",days:31},{name:"February",short_name:"Feb",numeric:"02",days:28},{name:"March",short_name:"Mar",numeric:"03",days:31},{name:"April",short_name:"Apr",numeric:"04",days:30},{name:"May",short_name:"May",numeric:"05",days:31},{name:"June",short_name:"Jun",numeric:"06",days:30},{name:"July",short_name:"Jul",numeric:"07",days:31},{name:"August",short_name:"Aug",numeric:"08",days:31},{name:"September",short_name:"Sep",numeric:"09",days:30},{name:"October",short_name:"Oct",numeric:"10",days:31},{name:"November",short_name:"Nov",numeric:"11",days:30},{name:"December",short_name:"Dec",numeric:"12",days:31}]},u.prototype.second=function(){return this.natural({max:59})},u.prototype.timestamp=function(){return this.natural({min:1,max:parseInt((new Date).getTime()/1e3,10)})},u.prototype.year=function(e){return e=a(e,{min:(new Date).getFullYear()}),e.max=typeof e.max!="undefined"?e.max:e.min+100,this.natural(e).toString()},u.prototype.cc=function(e){e=a(e);var t,n,r,i;t=e.type?this.cc_type({name:e.type,raw:!0}):this.cc_type({raw:!0}),n=t.prefix.split(""),r=t.length-t.prefix.length-1;for(var s=0;s<r;s++)n.push(this.integer({min:0,max:9}));return n.push(this.luhn_calculate(n.join(""))),n.join("")},u.prototype.cc_types=function(){return[{name:"American Express",short_name:"amex",prefix:"34",length:15},{name:"Bankcard",short_name:"bankcard",prefix:"5610",length:16},{name:"China UnionPay",short_name:"chinaunion",prefix:"62",length:16},{name:"Diners Club Carte Blanche",short_name:"dccarte",prefix:"300",length:14},{name:"Diners Club enRoute",short_name:"dcenroute",prefix:"2014",length:15},{name:"Diners Club International",short_name:"dcintl",prefix:"36",length:14},{name:"Diners Club United States & Canada",short_name:"dcusc",prefix:"54",length:16},{name:"Discover Card",short_name:"discover",prefix:"6011",length:16},{name:"InstaPayment",short_name:"instapay",prefix:"637",length:16},{name:"JCB",short_name:"jcb",prefix:"3528",length:16},{name:"Laser",short_name:"laser",prefix:"6304",length:16},{name:"Maestro",short_name:"maestro",prefix:"5018",length:16},{name:"Mastercard",short_name:"mc",prefix:"51",length:16},{name:"Solo",short_name:"solo",prefix:"6334",length:16},{name:"Switch",short_name:"switch",prefix:"4903",length:16},{name:"Visa",short_name:"visa",prefix:"4",length:16},{name:"Visa Electron",short_name:"electron",prefix:"4026",length:16}]},u.prototype.cc_type=function(e){e=a(e);var t=this.cc_types(),n=null;if(e.name){for(var r=0;r<t.length;r++)if(t[r].name===e.name||t[r].short_name===e.name){n=t[r];break}if(n===null)throw new Error("Credit card type '"+e.name+"'' is not suppoted")}else n=this.pick(t);return e.raw?n:n.name},u.prototype.dollar=function(e){e=a(e,{max:1e4,min:0});var t=this.floating({min:e.min,max:e.max,fixed:2}).toString(),n=t.split(".")[1];return n===undefined?t+=".00":n.length<2&&(t+="0"),t<0?"-$"+t.replace("-",""):"$"+t},u.prototype.exp=function(e){e=a(e);var t={};return t.year=this.exp_year(),t.year===(new Date).getFullYear()?t.month=this.exp_month({future:!0}):t.month=this.exp_month(),e.raw?t:t.month+"/"+t.year},u.prototype.exp_month=function(e){e=a(e);var t,n;if(e.future){do t=this.month({raw:!0}).numeric,n=parseInt(t,10);while(n<(new Date).getMonth())}else t=this.month({raw:!0}).numeric;return t},u.prototype.exp_year=function(){return this.year({max:(new Date).getFullYear()+10})},u.prototype.d4=function(){return this.natural({min:1,max:4})},u.prototype.d6=function(){return this.natural({min:1,max:6})},u.prototype.d8=function(){return this.natural({min:1,max:8})},u.prototype.d10=function(){return this.natural({min:1,max:10})},u.prototype.d12=function(){return this.natural({min:1,max:12})},u.prototype.d20=function(){return this.natural({min:1,max:20})},u.prototype.d30=function(){return this.natural({min:1,max:30})},u.prototype.d100=function(){return this.natural({min:1,max:100})},u.prototype.rpg=function(e,t){t=a(t);if(e===null)throw new Error("A type of die roll must be included");var n=e.toLowerCase().split("d"),r=[];if(n.length!==2||!parseInt(n[0],10)||!parseInt(n[1],10))throw new Error("Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");for(var i=n[0];i>0;i--)r[i-1]=this.natural({min:1,max:n[1]});return typeof t.sum!="undefined"&&t.sum?r.reduce(function(e,t){return e+t}):r},u.prototype.guid=function(e){e=e||{version:5};var t="ABCDEF1234567890",n="AB89",r=this.string({pool:t,length:8})+"-"+this.string({pool:t,length:4})+"-"+e.version+this.string({pool:t,length:3})+"-"+this.string({pool:n,length:1})+this.string({pool:t,length:3})+"-"+this.string({pool:t,length:12});return r},u.prototype.hash=function(e){e=a(e,{length:40,casing:"lower"});var t=e.casing==="upper"?o.toUpperCase():o;return this.string({pool:t,length:e.length})},u.prototype.luhn_check=function(e){var t=e.toString(),n=+t.substring(t.length-1);return n===this.luhn_calculate(+t.substring(0,t.length-1))},u.prototype.luhn_calculate=function(e){var t=e.toString().split("").reverse(),n=0;for(var r=0,i=t.length;i>r;++r){var s=+t[r];r%2===0&&(s*=2,s>9&&(s-=9)),n+=s}return n*9%10},u.prototype.mersenne_twister=function(e){return new h(e)},u.prototype.VERSION="0.5.4";var h=function(e){e===undefined&&(e=(new Date).getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,this.init_genrand(e)};h.prototype.init_genrand=function(e){this.mt[0]=e>>>0;for(this.mti=1;this.mti<this.N;this.mti++)e=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(((e&4294901760)>>>16)*1812433253<<16)+(e&65535)*1812433253+this.mti,this.mt[this.mti]>>>=0},h.prototype.init_by_array=function(e,t){var n=1,r=0,i,s;this.init_genrand(19650218),i=this.N>t?this.N:t;for(;i;i--)s=this.mt[n-1]^this.mt[n-1]>>>30,this.mt[n]=(this.mt[n]^(((s&4294901760)>>>16)*1664525<<16)+(s&65535)*1664525)+e[r]+r,this.mt[n]>>>=0,n++,r++,n>=this.N&&(this.mt[0]=this.mt[this.N-1],n=1),r>=t&&(r=0);for(i=this.N-1;i;i--)s=this.mt[n-1]^this.mt[n-1]>>>30,this.mt[n]=(this.mt[n]^(((s&4294901760)>>>16)*1566083941<<16)+(s&65535)*1566083941)-n,this.mt[n]>>>=0,n++,n>=this.N&&(this.mt[0]=this.mt[this.N-1],n=1);this.mt[0]=2147483648},h.prototype.genrand_int32=function(){var e,t=new Array(0,this.MATRIX_A);if(this.mti>=this.N){var n;this.mti===this.N+1&&this.init_genrand(5489);for(n=0;n<this.N-this.M;n++)e=this.mt[n]&this.UPPER_MASK|this.mt[n+1]&this.LOWER_MASK,this.mt[n]=this.mt[n+this.M]^e>>>1^t[e&1];for(;n<this.N-1;n++)e=this.mt[n]&this.UPPER_MASK|this.mt[n+1]&this.LOWER_MASK,this.mt[n]=this.mt[n+(this.M-this.N)]^e>>>1^t[e&1];e=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^e>>>1^t[e&1],this.mti=0}return e=this.mt[this.mti++],e^=e>>>11,e^=e<<7&2636928640,e^=e<<15&4022730752,e^=e>>>18,e>>>0},h.prototype.genrand_int31=function(){return this.genrand_int32()>>>1},h.prototype.genrand_real1=function(){return this.genrand_int32()*(1/4294967295)},h.prototype.random=function(){return this.genrand_int32()*(1/4294967296)},h.prototype.genrand_real3=function(){return(this.genrand_int32()+.5)*(1/4294967296)},h.prototype.genrand_res53=function(){var e=this.genrand_int32()>>>5,t=this.genrand_int32()>>>6;return(e*67108864+t)*(1/9007199254740992)},typeof exports!="undefined"&&(typeof module!="undefined"&&module.exports&&(exports=module.exports=u),exports.Chance=u),typeof n=="function"&&n.amd&&n("vendor/chance",[],function(){return u}),typeof window=="object"&&typeof window.document=="object"&&(window.Chance=u,window.chance=new u)}(),n("utils/configurable",["require"],function(e){function t(e,t){for(var n in t)(function(n){e[n]=function(r){return arguments.length?(t[n]=r,e):t[n]}})(n)}return t}),n("species/clicker",["require","../utils/configurable","../vendor/chance"],function(e){var t=e("../utils/configurable"),n=e("../vendor/chance");return function(){function f(){var t,n,r,i,s=0;do{t=a.positionSelector(),n=t[0],r=t[1],i=e.elementFromPoint(n,r),s++;if(s>a.maxNbTries)return!1}while(!i||!a.canClick(i));var o=e.createEvent("MouseEvents"),u=a.randomizer.pick(a.clickTypes);o.initMouseEvent(u,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),i.dispatchEvent(o),typeof a.showAction=="function"&&a.showAction(n,r,u),typeof a.logger.log=="function"&&a.logger.log("gremlin","clicker   ",u,"at",n,r)}var e=window.document,r=e.body,i=["click","click","click","click","click","click","dblclick","dblclick","mousedown","mouseup","mouseover","mouseover","mouseover","mousemove","mouseout"],s=function(){return[a.randomizer.natural({max:e.documentElement.clientWidth-1}),a.randomizer.natural({max:e.documentElement.clientHeight-1})]},o=function(t,n){var i=e.createElement("div");i.style.border="3px solid red",i.style["border-radius"]="50%",i.style.width="40px",i.style.height="40px",i.style["box-sizing"]="border-box",i.style.position="absolute",i.style.webkitTransition="opacity 1s ease-out",i.style.mozTransition="opacity 1s ease-out",i.style.transition="opacity 1s ease-out",i.style.left=t-20+"px",i.style.top=n-20+"px";var s=r.appendChild(i);setTimeout(function(){r.removeChild(s)},1e3),setTimeout(function(){s.style.opacity=0},50)},u=function(){return!0},a={clickTypes:i,positionSelector:s,showAction:o,canClick:u,maxNbTries:10,logger:{},randomizer:new n};return t(f,a),f}}),n("species/formFiller",["require","../utils/configurable","../vendor/chance"],function(e){var t=e("../utils/configurable"),n=e("../vendor/chance");return function(){function u(){var t=[],n=d();for(var r in o.elementMapTypes)o.elementMapTypes.hasOwnProperty(r)&&t.push(r);var i,s=0;do{var u=e.querySelectorAll(t.join(","));if(u.length===0)return!1;i=o.randomizer.pick(u),s++;if(s>o.maxNbTries)return!1}while(!i||!o.canFillElement(i));var a=null;for(var f in o.elementMapTypes)if(i[n](f)){a=f;break}var l=o.elementMapTypes[a](i);typeof o.showAction=="function"&&o.showAction(i),typeof o.logger.log=="function"&&o.logger.log("gremlin","formFiller","input",l,"in",i)}function a(e){var t=o.randomizer.character();return e.value+=t,t}function f(e){var t=o.randomizer.character({pool:"0123456789"});return e.value+=t,t}function l(e){var t=e.querySelectorAll("option"),n=o.randomizer.pick(t);for(var r=0,i=t.length;r<i;r++){var s=t[r];s.selected=s.value==n.value}return n.value}function c(t){var n=e.createEvent("MouseEvents");return n.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),t.dispatchEvent(n),t.value}function h(t){var n=e.createEvent("MouseEvents");return n.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),t.dispatchEvent(n),t.value}function p(e){var t=o.randomizer.email();return e.value=t,t}function d(){var t=e.querySelector("body");return(t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector||t.webkitMatchesSelector).name}var e=window.document,r={'input[type="text"]':a,'input[type="password"]':a,'input[type="number"]':f,select:l,'input[type="radio"]':c,'input[type="checkbox"]':h,'input[type="email"]':p,"input:not([type])":a},i=function(e){typeof e.attributes["data-old-border"]=="undefined"&&(e.attributes["data-old-border"]=e.style.border);var t=e.attributes["data-old-border"];e.style.border="1px solid red",setTimeout(function(){e.style.border=t},500)},s=function(){return!0},o={elementMapTypes:r,showAction:i,canFillElement:s,maxNbTries:10,logger:{},randomizer:new n};return t(u,o),u}}),n("species/scroller",["require","../utils/configurable","../vendor/chance"],function(e){var t=e("../utils/configurable"),n=e("../vendor/chance");return function(){function a(){var e=u.positionSelector(),t=e[0],n=e[1];window.scrollTo(t,n),typeof u.showAction=="function"&&u.showAction(t,n),typeof u.logger.log=="function"&&u.logger.log("gremlin","scroller  ","scroll to",t,n)}var e=window.document,r=e.documentElement,i=e.body,s=function(){var e=Math.max(i.scrollWidth,i.offsetWidth,r.scrollWidth,r.offsetWidth,r.clientWidth),t=Math.max(i.scrollHeight,i.offsetHeight,r.scrollHeight,r.offsetHeight,r.clientHeight);return[u.randomizer.natural({max:e-r.clientWidth}),u.randomizer.natural({max:t-r.clientHeight})]},o=function(t,n){var s=e.createElement("div");s.style.border="3px solid red",s.style.width=r.clientWidth-25+"px",s.style.height=r.clientHeight-25+"px",s.style.position="absolute",s.style.webkitTransition="opacity 1s ease-out",s.style.mozTransition="opacity 1s ease-out",s.style.transition="opacity 1s ease-out",s.style.left=t+10+"px",s.style.top=n+10+"px";var o=i.appendChild(s);setTimeout(function(){i.removeChild(o)},1e3),setTimeout(function(){o.style.opacity=0},50)},u={positionSelector:s,showAction:o,logger:{},randomizer:new n};return t(a,u),a}}),n("species/typer",["require","../utils/configurable","../vendor/chance"],function(e){var t=e("../utils/configurable"),n=e("../vendor/chance");return function(){function a(){var t=Math.max(i.scrollWidth,i.offsetWidth,r.scrollWidth,r.offsetWidth,r.clientWidth),n=Math.max(i.scrollHeight,i.offsetHeight,r.scrollHeight,r.offsetHeight,r.clientHeight),s=e.createEvent("KeyboardEvent"),o=typeof s.initKeyboardEvent!="undefined"?"initKeyboardEvent":"initKeyEvent",a=u.randomizer.natural({max:360}),f=u.randomizer.natural({max:r.clientWidth-1}),l=u.randomizer.natural({max:r.clientHeight-1}),c=e.elementFromPoint(f,l);s[o](u.randomizer.pick(u.eventTypes),!0,!0,c,!1,!1,!1,!1,a,0),c.dispatchEvent(s),typeof u.showAction=="function"&&u.showAction(c,f,l,a),typeof u.logger.log=="function"&&u.logger.log("gremlin","typer       type",a,"at",f,l)}var e=window.document,r=e.documentElement,i=e.body,s=["keypress","keyup","keydown"],o=function(t,n,r,s){var o=e.createElement("div");o.style.border="3px solid orange",o.style["border-radius"]="50%",o.style.width="40px",o.style.height="40px",o.style["box-sizing"]="border-box",o.style.position="absolute",o.style.webkitTransition="opacity 1s ease-out",o.style.mozTransition="opacity 1s ease-out",o.style.transition="opacity 1s ease-out",o.style.left=n+"px",o.style.top=r+"px",o.style.textAlign="center",o.style.paddingTop="7px",o.innerHTML=String.fromCharCode(s);var u=i.appendChild(o);setTimeout(function(){i.removeChild(u)},1e3),setTimeout(function(){u.style.opacity=0},50)},u={eventTypes:s,showAction:o,logger:{},randomizer:new n};return t(a,u),a}}),n("mogwais/alert",["require","../utils/configurable","../vendor/chance"],function(e){var t=e("../utils/configurable"),n=e("../vendor/chance");return function(){function l(){o.watchEvents.indexOf("alert")!==-1&&(window.alert=function(e){o.logger.warn("mogwai ","alert     ",e,"alert")}),o.watchEvents.indexOf("confirm")!==-1&&(window.confirm=function(e){o.confirmResponse(),o.logger.warn("mogwai ","alert     ",e,"confirm")}),o.watchEvents.indexOf("prompt")!==-1&&(window.prompt=function(e){o.promptResponse(),o.logger.warn("mogwai ","alert     ",e,"prompt")})}var e=["alert","confirm","prompt"],r=function(){return o.randomizer.bool()},i=function(){return o.randomizer.sentence()},s={warn:function(){}},o={watchEvents:e,confirmResponse:r,promptResponse:i,logger:s,randomizer:new n},u=window.alert,a=window.confirm,f=window.prompt;return l.cleanUp=function(){return window.alert=u,window.confirm=a,window.prompt=f,l},t(l,o),l}}),n("mogwais/fps",["require","../utils/configurable"],function(e){var t=e("../utils/configurable");return function(){function o(e){e-i>r.delay&&(u(e),i=e);if(!s)return;window.requestAnimationFrame(o)}function u(){function t(t){e=t,window.requestAnimationFrame(n)}function n(t){var n=t-e<16?60:1e3/(t-e),i=r.levelSelector(n);r.logger[i]("mogwai ","fps       ",n)}var e;window.requestAnimationFrame(t)}function a(){s=!0,window.requestAnimationFrame(o)}var e={log:function(){},warn:function(){},error:function(){}},n=function(e){return e<10?"error":e<20?"warn":"log"},r={delay:500,levelSelector:n,logger:e},i=-Infinity,s;return a.cleanUp=function(){return s=!1,a},t(a,r),a}}),n("mogwais/gizmo",["require","../utils/configurable"],function(e){var t=e("../utils/configurable");return function(){function s(){function s(){e++,e==n.maxErrors&&(t.stop(),window.setTimeout(function(){n.logger.warn("mogwai ","gizmo     ","stopped test execution after ",n.maxErrors,"errors")},4))}var e=0,t=this;r=window.onerror,window.onerror=function(e,t,n){return s(),r?r(e,t,n):!1},i=n.logger.error,n.logger.error=function(){s(),i.apply(n.logger,arguments)}}var e={warn:function(){}},n={maxErrors:10,logger:e},r,i;return s.cleanUp=function(){return window.onerror=r,n.logger.error=i.bind(n.logger),s},t(s,n),s}}),n("utils/executeInSeries",["require"],function(e){function t(e,t,n,r){var i=t.length;e=e.slice(0);var s=function(e,t){if(!e.length)return typeof r=="function"?r():!0;var o=e.shift();o.apply(n,t),o.length===i&&s(e,t,r)};t.push(function(){s(e,t,r)}),s(e,t,r)}return t}),n("strategies/allTogether",["require","../utils/executeInSeries","../utils/configurable"],function(e){var t=e("../utils/executeInSeries"),n=e("../utils/configurable");return function(){function s(n,s,u){function l(e){t(n,[],f,e)}function c(t){if(r)return;if(t>=a)return o();l(function(){setTimeout(function(){c(++t)},e.delay)})}var a=s&&s.nb?s.nb:e.nb,f=this;r=!1,i=u,c(0)}function o(){typeof i=="function"&&i(),i=null}var e={delay:10,nb:100},r,i;return s.stop=function(){r=!0,setTimeout(o,4)},n(s,e),s}}),n("strategies/bySpecies",["require","../utils/executeInSeries","../utils/configurable"],function(e){var t=e("../utils/executeInSeries"),n=e("../utils/configurable");return function(){function s(n,s,u){function l(n,i,s){if(r)return;if(i>=a)return s();t([n],[],f,function(){setTimeout(function(){l(n,++i,s)},e.delay)})}function c(){if(r)return;if(n.length===0)return o();l(n.shift(),0,c)}var a=s&&s.nb?s.nb:e.nb,n=n.slice(0),f=this;r=!1,i=u,c()}function o(){typeof i=="function"&&i(),i=null}var e={delay:10,nb:100},r,i;return s.stop=function(){r=!0,setTimeout(o,4)},n(s,e),s}}),n("strategies/distribution",["require","../utils/executeInSeries","../utils/configurable","../vendor/chance"],function(e){var t=e("../utils/executeInSeries"),n=e("../utils/configurable"),r=e("../vendor/chance");return function(){function o(n,r,o){function p(r,s,o){if(i)return;if(s>=l)return f();t([r],[],h,function(){setTimeout(function(){p(a(n,c),++s,o)},e.delay)})}var l=r&&r.nb?r.nb:e.nb,n=n.slice(0),c=e.distribution.length===0?u(n):e.distribution,h=this;if(l===0)return o();i=!1,s=o,p(a(n,c),0,p)}function u(e){var t=e.length;if(t===0)return[];var n=[],r=1/t;for(var i=0;i<t;i++)n.push(r);return n}function a(t,n){var r=0,i=e.randomizer.floating({min:0,max:1});for(var s=0,o=t.length;s<o;s++){r+=n[s];if(i<=r)return t[s]}return function(){}}function f(){typeof s=="function"&&s(),s=null}var e={distribution:[],delay:10,nb:100,randomizer:new r},i,s;return o.stop=function(){i=!0,setTimeout(f,4)},n(o,e),o}}),n("main",["require","./vendor/chance","./species/clicker","./species/formFiller","./species/scroller","./species/typer","./mogwais/alert","./mogwais/fps","./mogwais/gizmo","./strategies/allTogether","./strategies/bySpecies","./strategies/distribution","./utils/executeInSeries"],function(e){function s(e,t){for(var n=0,r=t.length;n<r;n++)for(var i in e)typeof t[n][i]=="function"&&t[n][i](e[i])}var t=e("./vendor/chance"),n={species:{clicker:e("./species/clicker"),formFiller:e("./species/formFiller"),scroller:e("./species/scroller"),typer:e("./species/typer")},mogwais:{alert:e("./mogwais/alert"),fps:e("./mogwais/fps"),gizmo:e("./mogwais/gizmo")},strategies:{allTogether:e("./strategies/allTogether"),bySpecies:e("./strategies/bySpecies"),distribution:e("./strategies/distribution")}},r=e("./utils/executeInSeries"),i=function(){this._gremlins=[],this._mogwais=[],this._strategies=[],this._beforeCallbacks=[],this._afterCallbacks=[],this._logger=console,this._randomizer=new t};return i.prototype.gremlin=function(e){return this._gremlins.push(e),this},i.prototype.allGremlins=function(){for(var e in n.species)this.gremlin(n.species[e]());return this},i.prototype.mogwai=function(e){return this._mogwais.push(e),this},i.prototype.allMogwais=function(){for(var e in n.mogwais)this.mogwai(n.mogwais[e]());return this},i.prototype.strategy=function(e){return this._strategies.push(e),this},i.prototype.before=function(e){return this._beforeCallbacks.push(e),this},i.prototype.after=function(e){return this._afterCallbacks.push(e),this},i.prototype.logger=function(e){return arguments.length?(this._logger=e,this):this._logger},i.prototype.log=function(e){this._logger.log(e)},i.prototype.randomizer=function(e){return arguments.length?(this._randomizer=e,this):this._randomizer},i.prototype.seed=function(e){return this._randomizer=new t(e),this},i.prototype.unleash=function(e,t){this._gremlins.length===0&&this.allGremlins(),this._mogwais.length===0&&this.allMogwais(),this._strategies.length===0&&this.strategy(n.strategies.distribution());var i=[].concat(this._gremlins,this._mogwais),o=i.concat(this._strategies,this._beforeCallbacks,this._afterCallbacks);s({logger:this._logger,randomizer:this._randomizer},o);var u=this._beforeCallbacks;u=u.concat(this._mogwais);var a=this._afterCallbacks;for(var f=0,l=i.length;f<l;f++)typeof i[f].cleanUp=="function"&&a.push(i[f].cleanUp);var c=this;r(u,[],c,function(){r(c._strategies,[c._gremlins,e],c,function(){r(a,[],c,function(){typeof t=="function"&&t()})})})},i.prototype.stop=function(){var e=this._strategies;for(var t=0,n=e.length;t<n;t++)e[t].stop()},n.createHorde=function(){return new i},n}),t(["main"]),t("main")});

/***/ },
/* 31 */
/*!**********************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/process/browser.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

			// shim for using process in browser
			
			var process = module.exports = {};
			var queue = [];
			var draining = false;
			
			function drainQueue() {
			    if (draining) {
			        return;
			    }
			    draining = true;
			    var currentQueue;
			    var len = queue.length;
			    while(len) {
			        currentQueue = queue;
			        queue = [];
			        var i = -1;
			        while (++i < len) {
			            currentQueue[i]();
			        }
			        len = queue.length;
			    }
			    draining = false;
			}
			process.nextTick = function (fun) {
			    queue.push(fun);
			    if (!draining) {
			        setTimeout(drainQueue, 0);
			    }
			};
			
			process.title = 'browser';
			process.browser = true;
			process.env = {};
			process.argv = [];
			process.version = ''; // empty string to avoid regexp issues
			process.versions = {};
			
			function noop() {}
			
			process.on = noop;
			process.addListener = noop;
			process.once = noop;
			process.off = noop;
			process.removeListener = noop;
			process.removeAllListeners = noop;
			process.emit = noop;
			
			process.binding = function (name) {
			    throw new Error('process.binding is not supported');
			};
			
			// TODO(shtylman)
			process.cwd = function () { return '/' };
			process.chdir = function (dir) {
			    throw new Error('process.chdir is not supported');
			};
			process.umask = function() { return 0; };


/***/ },
/* 32 */
/*!***************************************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/util/~/inherits/inherits_browser.js ***!
  \***************************************************************************/
/***/ function(module, exports, __webpack_require__) {

			if (typeof Object.create === 'function') {
			  // implementation from standard node.js 'util' module
			  module.exports = function inherits(ctor, superCtor) {
			    ctor.super_ = superCtor
			    ctor.prototype = Object.create(superCtor.prototype, {
			      constructor: {
			        value: ctor,
			        enumerable: false,
			        writable: true,
			        configurable: true
			      }
			    });
			  };
			} else {
			  // old school shim for old browsers
			  module.exports = function inherits(ctor, superCtor) {
			    ctor.super_ = superCtor
			    var TempCtor = function () {}
			    TempCtor.prototype = superCtor.prototype
			    ctor.prototype = new TempCtor()
			    ctor.prototype.constructor = ctor
			  }
			}


/***/ },
/* 33 */
/*!***********************************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/util/support/isBufferBrowser.js ***!
  \***********************************************************************/
/***/ function(module, exports, __webpack_require__) {

			module.exports = function isBuffer(arg) {
			  return arg && typeof arg === 'object'
			    && typeof arg.copy === 'function'
			    && typeof arg.fill === 'function'
			    && typeof arg.readUInt8 === 'function';
			}

/***/ },
/* 34 */
/*!*******************************!*\
  !*** ./~/tty-colors/index.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * Extend strings with ANSI escape codes for styling strings in the terminal.
			 *
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var styles = {
					reset:     [0,   0],
					bold:      [1,  22],
					dim:       [2,  22],
					italic:    [3,  23],
					underline: [4,  24],
					inverse:   [7,  27],
					hidden:    [8,  28],
					strike:    [9,  29],
					black:     [30, 39],
					red:       [31, 39],
					green:     [32, 39],
					yellow:    [33, 39],
					blue:      [34, 39],
					magenta:   [35, 39],
					cyan:      [36, 39],
					white:     [37, 39],
					grey:      [90, 39],
					bgBlack:   [40, 49],
					bgRed:     [41, 49],
					bgGreen:   [42, 49],
					bgYellow:  [43, 49],
					bgBlue:    [44, 49],
					bgMagenta: [45, 49],
					bgCyan:    [46, 49],
					bgWhite:   [47, 49]
				};
			
			
			// apply all styles to String prototype
			Object.keys(styles).forEach(function ( name ) {
				// rework values to avoid unnecessary concatenations
				styles[name][0] = '\u001b[' + styles[name][0] + 'm';
				styles[name][1] = '\u001b[' + styles[name][1] + 'm';
			
				// add getter by style name
				Object.defineProperty(String.prototype, name, {
					get: function () {
						return styles[name][0] + this + styles[name][1];
					},
					// hide from iteration
					enumerable: false,
					// allow to change or remove this property
					configurable: true
				});
			});


/***/ }
/******/ ]);
//# sourceMappingURL=develop.js.map