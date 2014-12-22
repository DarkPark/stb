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
/*!******************!*\
  !*** multi main ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

			__webpack_require__(/*! /home/dp/Projects/web/stb/tests/units/dom.js */4);
			__webpack_require__(/*! /home/dp/Projects/web/stb/tests/units/emitter.js */5);
			module.exports = __webpack_require__(/*! /home/dp/Projects/web/stb/tests/units/model.js */6);


/***/ },
/* 1 */
/*!***************************!*\
  !*** ./app/js/emitter.js ***!
  \***************************/
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
					// @ifdef DEBUG
					if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
					if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
					if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
					// @endif
			
					// valid input
					if ( name && typeof callback === 'function' ) {
						// initialization may be required
						this.events[name] = this.events[name] || [];
						// append this new event to the list
						this.events[name].push(callback);
					}
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
			
					// @ifdef DEBUG
					if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
					if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
					if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
					// @endif
			
					// valid input
					if ( name && typeof callback === 'function' ) {
						// initialization may be required
						this.events[name] = this.events[name] || [];
						// append this new event to the list
						this.events[name].push(function onceWrapper ( data ) {
							callback(data);
							self.removeListener(name, onceWrapper);
						});
					}
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
			
					// @ifdef DEBUG
					if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
					if ( typeof callbacks !== 'object' ) { throw 'wrong callbacks type'; }
					if ( Object.keys(callbacks).length === 0 ) { throw 'no callbacks given'; }
					// @endif
			
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
					// @ifdef DEBUG
					if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
					if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
					if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
					// @endif
			
					// the event exists and should have some callbacks
					if ( Array.isArray(this.events[name]) ) {
						// rework the callback list to exclude the given one
						this.events[name] = this.events[name].filter(function callbacksFilter ( fn ) { return fn !== callback; });
						// event has no more callbacks so clean it
						if ( this.events[name].length === 0 ) {
							delete this.events[name];
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
					// @ifdef DEBUG
					if ( arguments.length !== 0 && (typeof name !== 'string' || name.length === 0) ) { throw 'wrong or empty name'; }
					// @endif
			
					// check input
					if ( arguments.length === 0 ) {
						// no arguments so remove everything
						this.events = {};
					} else if ( name ) {
						// @ifdef DEBUG
						if ( this.events[name] !== undefined ) { throw 'event is not removed'; }
						// @endif
			
						// only name is given so remove all callbacks for the given event
						delete this.events[name];
					}
				},
			
			
				/**
				 * Execute each of the listeners in order with the supplied arguments.
				 *
				 * @param {string} name event identifier
				 * @param {Object} [data] options to send
				 *
				 * @example
				 * obj.emit('init');
				 * obj.emit('click', {src:panel1, dst:panel2});
				 */
				emit: function ( name, data ) {
					var event = this.events[name],
						i;
			
					// @ifdef DEBUG
					if ( arguments.length < 1 ) { throw 'wrong arguments number'; }
					if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
					// @endif
			
					// the event exists and should have some callbacks
					if ( event !== undefined ) {
						// @ifdef DEBUG
						if ( !Array.isArray(event) ) { throw 'wrong event type'; }
						// @endif
			
						for ( i = 0; i < event.length; i++ ) {
							// @ifdef DEBUG
							if ( typeof event[i] !== 'function' ) { throw 'wrong event callback type'; }
							// @endif
			
							// invoke the callback with parameters
							event[i](data);
						}
					}
				}
			};
			
			
			// public export
			module.exports = Emitter;


/***/ },
/* 2 */
/*!***********************!*\
  !*** ./app/js/dom.js ***!
  \***********************/
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
				/* jshint unused:vars */
			
				var node = null,
					i, name;
			
				// minimal param is given
				if ( tagName ) {
					// empty element
					node = document.createElement(tagName);
			
					// optional attribute list is given
					if ( attrList && typeof attrList === 'object' ) {
						/* jshint forin:false */
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
				/* jshint unused:vars */
			
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
				/* jshint unused:vars */
			
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
			
			
			// public export
			module.exports = dom;


/***/ },
/* 3 */
/*!*************************!*\
  !*** ./app/js/model.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @module stb/model
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			var Emitter = __webpack_require__(/*! ./emitter */ 1);
			
			
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
				// @ifdef DEBUG
				if ( data !== undefined && typeof data !== 'object' ) { throw 'wrong data type'; }
				// @endif
			
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
			
				// @ifdef DEBUG
				if ( typeof data !== 'object' ) { throw 'wrong data type'; }
				// @endif
			
				// is there any data?
				if ( Object.keys(data).length > 0 ) {
					// reset
					this.data = {};
			
					// notify listeners
					this.emit('clear', {data: data});
			
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
				// @ifdef DEBUG
				if ( typeof data !== 'object' ) { throw 'wrong data type'; }
				// @endif
			
				// valid input
				if ( data ) {
					// reset data
					this.clear();
			
					// init with given data
					this.data = data;
			
					// notify listeners
					this.emit('init', {data: data});
			
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
				// @ifdef DEBUG
				if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				// @endif
			
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
				// @ifdef DEBUG
				if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				// @endif
			
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
			
				// @ifdef DEBUG
				if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				// @endif
			
				if ( isAttrSet ) {
					// update
					emitData.prev = this.data[name];
					// only if values are different
					if ( value !== emitData.prev ) {
						this.data[name] = value;
			
						// notify listeners
						this.emit('change', emitData);
			
						return true;
					}
				} else {
					// create
					this.data[name] = value;
			
					// notify listeners
					this.emit('change', emitData);
			
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
			
				// @ifdef DEBUG
				if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
				// @endif
			
				if ( isAttrSet ) {
					emitData = {name: name, prev: this.data[name]};
					delete this.data[name];
			
					// notify listeners
					this.emit('change', emitData);
			
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
			
			
			// public export
			module.exports = Model;


/***/ },
/* 4 */
/*!****************************!*\
  !*** ./tests/units/dom.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			/* jshint undef:false */
			
			// dependencies
			var dom = __webpack_require__(/*! dom */ 2);
			
			
			// declare named module
			QUnit.module('dom');
			
			
			test('tag', function testTag () {
				var a, t;
			
				a = dom.tag('');
				strictEqual(a, null, 'empty element');
			
				a = dom.tag('qwe');
				strictEqual(a.tagName, 'QWE', 'not existing element');
			
				a = dom.tag('a');
				strictEqual(a.tagName, 'A', 'link element');
				strictEqual(a instanceof HTMLAnchorElement, true, 'link element type');
				strictEqual(a instanceof Node, true, 'link element type');
			
				a = dom.tag('a', {className:'bold'});
				strictEqual(a.className, 'bold', 'link element class');
			
				a = dom.tag('a', {data:123});
				strictEqual(a.data, 123, 'link element custom attribute data');
				strictEqual(a.outerHTML, '<a></a>', 'link element custom attribute html');
			
				a = dom.tag('a', {className:'bold'}, 'some text');
				strictEqual(a.outerHTML, '<a class="bold">some text</a>', 'link element outer html');
			
				a = dom.tag('a', {}, '');
				strictEqual(a.innerHTML, '', 'link element empty html');
			
				a = dom.tag('a', {}, '', '', '', null, undefined, false);
				strictEqual(a.innerHTML, '', 'link element empty complex html');
			
				a = dom.tag('a', {}, 'qwe');
				strictEqual(a.innerHTML, 'qwe', 'link element html');
			
				a = dom.tag('a', {}, 'qwe', 'rty');
				strictEqual(a.children.length, 0, 'text sub-elements nodes');
				strictEqual(a.childNodes.length, 2, 'text sub-elements texts');
				strictEqual(a.innerHTML, 'qwerty', 'link element html');
			
				a = dom.tag('a', {}, dom.tag('div', {}, 'qwe'));
				strictEqual(a.innerHTML, '<div>qwe</div>', 'link nested element');
				strictEqual(a.children.length, 1, 'link nested element size');
			
				a = dom.tag('a', {}, dom.tag('div'), dom.tag('div'), dom.tag('div'));
				strictEqual(a.innerHTML, '<div></div><div></div><div></div>', 'nested element list');
				strictEqual(a.children.length, 3, 'nested element list size');
			
				a = dom.tag('a', {}, dom.tag('div', {}, dom.tag('div', {}, dom.tag('div'))));
				strictEqual(a.innerHTML, '<div><div><div></div></div></div>', 'nested elements');
			
				t = dom.tag('table', {},
					dom.tag('tr', {},
						dom.tag('td', {}, 1),
						dom.tag('td', {}, 2)
					),
					dom.tag('tr', {},
						dom.tag('td', {colSpan:2}, 12)
					)
				);
				strictEqual(t.rows.length, 2, 'table element rows');
				strictEqual(t.rows[1].cells.length, 1, 'table element cells');
				strictEqual(t.rows[1].cells[0].colSpan, 2, 'table element colls');
			});
			
			
			test('fragment', function testFragment () {
				var f;
			
				f = dom.fragment();
				strictEqual(f instanceof DocumentFragment, true, 'empty fragment');
				strictEqual(f.hasChildNodes(), false, 'empty fragment');
			
				f = dom.fragment('', null, undefined, false);
				strictEqual(f.childNodes.length, 0, 'fragment with 4 items');
			
				f = dom.fragment('text');
				strictEqual(f.childNodes.length, 1, 'fragment with 1 text item');
			
				f = dom.fragment(dom.tag('div'));
				strictEqual(f.childNodes.length, 1, 'fragment with 1 node item');
			
				var el0 = '1',
					el1 = 'abc',
					el2 = dom.tag('div'),
					el3 = dom.tag('a', {className:'bold'}, 'some text');
				f = dom.fragment(el0, el1, el2, el3);
				strictEqual(f.childNodes.length, 4, 'fragment with 4 items');
				strictEqual(f.childNodes[0].nodeValue, el0, 'fragment with 4 items');
				strictEqual(f.childNodes[1].nodeValue, el1, 'fragment with 4 items');
				strictEqual(f.childNodes[2], el2, 'fragment with 4 items');
				strictEqual(f.childNodes[3], el3, 'fragment with 4 items');
			});
			
			
			test('add', function testAdd () {
				var a, d;
			
				strictEqual(dom.add(),        null, 'empty addition');
				strictEqual(dom.add(''),      null, 'empty addition');
				strictEqual(dom.add('123'),   null, 'empty addition');
				strictEqual(dom.add(null),    null, 'empty addition');
				strictEqual(dom.add(false),   null, 'empty addition');
				strictEqual(dom.add(true),    null, 'empty addition');
				strictEqual(dom.add(123),     null, 'empty addition');
				strictEqual(dom.add([1,2,3]), null, 'empty addition');
			
				a = dom.add(dom.tag('div'));
				strictEqual(a.nodeName, 'DIV', 'no addition but creation');
				strictEqual(a.childNodes.length, 0, 'no addition but creation');
			
				a = dom.add(dom.tag('div'), dom.tag('a'));
				strictEqual(a.childNodes.length, 1, 'addition and creation');
				strictEqual(a.firstChild.nodeName, 'A', 'addition and creation');
			
				var el0 = '1',
					el1 = 'abc',
					el2 = dom.tag('div'),
					el3 = dom.tag('a', {className:'bold'}, 'some text');
				d = dom.tag('div');
				a = dom.add(d, el0, el1, el2, el3);
				strictEqual(a.childNodes.length, 4, 'element list addition');
				strictEqual(a.innerHTML, '1abc<div></div><a class="bold">some text</a>', 'element list addition');
			});
			
			
			test('remove', function testRemove () {
				var d1, d2, d3;
			
				strictEqual(dom.remove(),     false, 'empty');
				strictEqual(dom.remove(null), false, 'null');
				strictEqual(dom.remove(true), false, 'boolean');
				strictEqual(dom.remove(''),   false, 'string');
				strictEqual(dom.remove({}),   false, 'object');
				strictEqual(dom.remove(34),   false, 'number');
				strictEqual(dom.remove([]),   false, 'array');
			
				d1 = dom.tag('div', {}, 'qwe1');
				d2 = dom.tag('div', {}, 'qwe2');
				d3 = dom.tag('div', {}, 'qwe3');
				dom.add(document.body, d1, d2, d3);
				strictEqual(dom.remove(d1), true, 'simple node');
				strictEqual(dom.remove(d2, d3), true, 'two nodes');
				strictEqual(dom.remove(d1), false, 'already removed node');
			
				d1 = dom.tag('div', {}, 'qwe1');
				strictEqual(dom.remove(d1), false, 'detached element');
			});


/***/ },
/* 5 */
/*!********************************!*\
  !*** ./tests/units/emitter.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			/* jshint undef:false */
			
			// dependencies
			var Emitter = __webpack_require__(/*! emitter */ 1);
			
			
			// declare named module
			QUnit.module('emitter');
			
			
			test('constructor', function testConstructor () {
				var em;
			
				em = new Emitter();
				strictEqual(typeof em.events, 'object', 'type');
				strictEqual(em.events.constructor, Object, 'constructor type');
				strictEqual(Object.keys(em.events).length, 0, 'keys');
			});
			
			
			test('addListener', function testAddListener () {
				var f1 = function () {},
					f2 = function () {},
					em;
			
				em = new Emitter();
				em.addListener();
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
				em.addListener('click');
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
				em.addListener('click', 123);
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em = new Emitter();
				em.addListener('click', f1);
				strictEqual(Object.keys(em.events).length, 1, 'one event');
				strictEqual(Array.isArray(em.events.click), true, 'event list type');
				strictEqual(em.events.click.length, 1, 'callbacks amount');
				strictEqual(typeof em.events.click[0], 'function', 'new callback type');
				strictEqual(em.events.click[0], f1, 'new callback link');
			
				em.addListener('click', f2);
				strictEqual(em.events.click.length, 2, 'callbacks amount');
				strictEqual(typeof em.events.click[1], 'function', 'new callback type 2');
				strictEqual(em.events.click[1], f2, 'new callback link 2');
			
				em = new Emitter();
				em.addListener('click', f1);
				em.addListener('click', f1);
				em.addListener('click', f1);
				strictEqual(em.events.click.length, 3, 'callbacks duplicates');
			});
			
			
			test('addListeners', function testAddListeners () {
				var f1 = function () {},
					f2 = function () {},
					em;
			
				em = new Emitter();
				em.addListeners();
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners([]);
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners('');
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners(true);
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners(false);
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners(undefined);
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({});
				strictEqual(Object.keys(em.events).length, 0, 'empty add');
			
				em.addListeners({click:123});
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({click:[]});
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({click:false});
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({click:null});
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({click:undefined});
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({click:'123'});
				strictEqual(Object.keys(em.events).length, 0, 'wrong add');
			
				em.addListeners({click:f1});
				strictEqual(Object.keys(em.events).length, 1, 'normal add');
				strictEqual(em.events.click.length, 1, 'callbacks amount');
			
				em.addListeners({click:f1});
				strictEqual(Object.keys(em.events).length, 1, 'double add');
				strictEqual(em.events.click.length, 2, 'callbacks amount');
			
				em = new Emitter();
				em.addListeners({click:f1, close:f2, ok:f1});
				strictEqual(Object.keys(em.events).length, 3, 'double add');
				strictEqual(em.events.click.length, 1, 'callbacks amount');
				strictEqual(em.events.close.length, 1, 'callbacks amount');
				strictEqual(em.events.ok.length, 1, 'callbacks amount');
				strictEqual(em.events.click[0], f1, 'callback link');
				strictEqual(em.events.close[0], f2, 'callback link');
				strictEqual(em.events.ok[0], f1, 'callback link');
			});
			
			
			test('removeListener', function testRemoveListener () {
				var f1 = function () {},
					f2 = function () {},
					f3 = function () {},
					em;
			
				em = new Emitter();
				em.addListeners({click:f1, close:f2, ok:f1});
				strictEqual(Object.keys(em.events).length, 3, 'add 3 events');
			
				em.removeListener('click', f2);
				strictEqual(Object.keys(em.events).length, 3, 'wrong removal');
				strictEqual(em.events.click.length, 1, 'callbacks amount');
			
				em.removeListener('click', f3);
				strictEqual(Object.keys(em.events).length, 3, 'wrong removal');
				strictEqual(em.events.click.length, 1, 'callbacks amount');
			
				em.removeListener('click', f1);
				strictEqual(Object.keys(em.events).length, 2, 'normal removal');
				strictEqual(em.events.click, undefined, 'no event name');
			
				em = new Emitter();
				em.addListener('click', f1);
				em.addListener('click', f1);
				em.addListener('click', f1);
				strictEqual(em.events.click.length, 3, 'callbacks duplicates');
				em.removeListener('click', f1);
				strictEqual(em.events.click, undefined, 'callbacks duplicates');
				em.removeListener('click', f1);
				strictEqual(em.events.click, undefined, 'double removal');
			});
			
			
			test('removeAllListeners', function testRemoveAllListeners () {
				var f1 = function () {},
					f2 = function () {},
					em;
			
				em = new Emitter();
				em.addListener('click', f1);
				em.addListener('click', f2);
				strictEqual(em.events.click.length, 2, 'init');
				em.removeAllListeners('click');
				strictEqual(em.events.click, undefined, 'removal');
			
				em = new Emitter();
				em.addListener('click', f1);
				em.addListener('click', f2);
				em.addListener('close', f1);
				em.addListener('close', f2);
				strictEqual(em.events.click.length, 2, 'init');
				strictEqual(em.events.close.length, 2, 'init');
				em.removeAllListeners('click');
				em.removeAllListeners('close');
				strictEqual(em.events.click, undefined, 'removal');
				strictEqual(em.events.close, undefined, 'removal');
				em.removeAllListeners('click');
				em.removeAllListeners('close');
				strictEqual(em.events.click, undefined, 'double removal');
				strictEqual(em.events.close, undefined, 'double removal');
			
				em = new Emitter();
				em.addListener('click', f1);
				em.addListener('click', f2);
				em.addListener('close', f1);
				em.addListener('close', f2);
				strictEqual(Object.keys(em.events).length, 2, 'init');
				strictEqual(em.events.click.length, 2, 'init');
				strictEqual(em.events.close.length, 2, 'init');
				em.removeAllListeners();
				strictEqual(Object.keys(em.events).length, 0, 'removal');
				em.removeAllListeners();
				strictEqual(Object.keys(em.events).length, 0, 'double removal');
			});
			
			
			test('emit', function testEmit () {
				var em;
			
				expect(9);
			
				em = new Emitter();
				em.addListener('e1', function ( data ) {
					strictEqual(data, undefined, 'emit without data');
				});
				em.addListener('e2', function ( data ) {
					strictEqual(data, 123, 'emit with data');
				});
				em.addListener('e3', function ( data ) {
					propEqual(data, {a:1,b:2,c:3}, 'emit with complex data');
				});
				strictEqual(em.events.e1.length, 1, 'init');
				strictEqual(em.events.e2.length, 1, 'init');
				strictEqual(em.events.e3.length, 1, 'init');
			
				em.emit('e1');
				em.emit('e2', 123);
				em.emit('e3', {a:1,b:2,c:3});
			
				em.emit('e1');
				em.emit('e2', 123);
				em.emit('e3', {a:1,b:2,c:3});
			
				em.emit();
				em.emit(null);
				em.emit(false);
				em.emit(undefined);
			
				em.removeAllListeners();
				em.emit('e1');
				em.emit('e2', 123);
				em.emit('e3', {a:1,b:2,c:3});
			});
			
			
			test('once', function testOnce () {
				var em;
			
				expect(7);
			
				em = new Emitter();
				em.once('e1', function ( data ) {
					strictEqual(data, undefined, 'emit without data');
				});
				em.once('e2', function ( data ) {
					strictEqual(data, 123, 'emit with data');
				});
				em.once('e3', function ( data ) {
					propEqual(data, {a:1,b:2,c:3}, 'emit with complex data');
				});
				strictEqual(em.events.e1.length, 1, 'init');
				strictEqual(em.events.e2.length, 1, 'init');
				strictEqual(em.events.e3.length, 1, 'init');
			
				em.emit('e1');
				em.emit('e2', 123);
				em.emit('e3', {a:1,b:2,c:3});
			
				em.emit('e1');
				em.emit('e2', 123);
				em.emit('e3', {a:1,b:2,c:3});
			
				strictEqual(Object.keys(em.events).length, 0, 'no events');
			});


/***/ },
/* 6 */
/*!******************************!*\
  !*** ./tests/units/model.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

			/**
			 * @author Stanislav Kalashnik <sk@infomir.eu>
			 * @license GNU GENERAL PUBLIC LICENSE Version 3
			 */
			
			'use strict';
			
			/* jshint undef:false */
			
			// dependencies
			var Model = __webpack_require__(/*! model */ 3);
			
			
			// declare named module
			QUnit.module('model');
			
			
			test('constructor', function testConstructor () {
				var m;
			
				m = new Model();
				strictEqual(typeof m.data, 'object', 'type');
				strictEqual(typeof m.events, 'object', 'type');
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model(null);
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model(undefined);
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model(123);
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model('qwe');
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model(true);
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model([]);
				strictEqual(m.data.constructor, Array, 'constructor type');
				strictEqual(Object.keys(m.data).length, 0, 'keys');
			
				m = new Model({a:1});
				strictEqual(m.data.constructor, Object, 'constructor type');
				strictEqual(Object.keys(m.data).length, 1, 'keys');
			});
			
			
			test('data', function testData () {
				var m;
			
				expect(16);
			
				m = new Model();
				strictEqual(m.init(), false, 'wrong param');
				strictEqual(m.init(''), false, 'wrong param');
				strictEqual(m.init('qwe'), false, 'wrong param');
				strictEqual(m.init(null), false, 'wrong param');
				strictEqual(m.init(undefined), false, 'wrong param');
				strictEqual(m.init(123), false, 'wrong param');
				strictEqual(m.init(12.3), false, 'wrong param');
				strictEqual(m.init(true), false, 'wrong param');
				strictEqual(m.init(false), false, 'wrong param');
				strictEqual(m.init(1,1,1,1), false, 'wrong param');
				strictEqual(m.init([]), true, 'wrong array param');
			
				strictEqual(m.init({}), true, 'normal param');
			
				m.init({a:1,b:2});
				propEqual(m.data, {a:1,b:2}, 'normal param');
			
				m.addListener('init', function ( event ) {
					propEqual(event.data, {a:123}, 'init event');
				});
				m.addListener('clear', function ( event ) {
					propEqual(event.data, {a:1,b:2}, 'clear event');
					propEqual(m.data, {}, 'clear event check');
				});
				m.init();
				m.init({a:123});
			});
			
			
			test('clear', function testClear () {
				var m;
			
				expect(5);
			
				m = new Model({a:1,b:2});
				propEqual(m.data, {a:1,b:2}, 'normal init');
			
				m.addListener('clear', function ( event ) {
					propEqual(event.data, {a:1,b:2}, 'clear event');
					propEqual(m.data, {}, 'clear event check');
				});
				ok(m.clear(), 'do clear');
				ok(!m.clear(), 'do clear again');
			});
			
			
			test('has', function testHas () {
				var m;
			
				m = new Model({a:1,b:2});
				propEqual(m.data, {a:1,b:2}, 'normal init');
			
				ok(m.has('a'), 'present');
				ok(m.has('b'), 'present');
				ok(!m.has('c'), 'not present');
				ok(!m.has(''), 'not present');
				ok(!m.has(null), 'not present');
				ok(!m.has(), 'not present');
				ok(!m.has(123), 'not present');
				ok(!m.has(undefined), 'not present');
				ok(!m.has(false), 'not present');
				ok(!m.has(true), 'not present');
				ok(!m.has([]), 'not present');
				ok(!m.has({}), 'not present');
			
				m.clear();
				ok(!m.has('a'), 'not present');
			});
			
			
			test('get', function testGet () {
				var m;
			
				m = new Model({a:1,b:2});
				propEqual(m.data, {a:1,b:2}, 'normal init');
			
				strictEqual(m.get('a'), 1, 'one attr');
				strictEqual(m.get('c'), undefined, 'missing attr');
				strictEqual(m.get(123), undefined, 'missing attr');
				strictEqual(m.get(null), undefined, 'missing attr');
				strictEqual(m.get(true), undefined, 'missing attr');
				strictEqual(m.get(false), undefined, 'missing attr');
				strictEqual(m.get(undefined), undefined, 'missing attr');
				strictEqual(m.get({}), undefined, 'missing attr');
				strictEqual(m.get([]), undefined, 'missing attr');
			});
			
			
			test('set', function testSet () {
				var m;
			
				expect(14);
			
				m = new Model();
				m.addListener('change', function ( event ) {
					strictEqual(event.name, 'a', 'create: name');
					strictEqual('prev' in event, false, 'create: prev');
					strictEqual('curr' in event, true, 'create: curr');
					strictEqual(event.curr, 123, 'create: curr data');
				});
				ok(m.set('a', 123), 'set operation');
				propEqual(m.data, {a:123}, 'check');
			
				m = new Model({a:0});
				m.addListener('change', function ( event ) {
					strictEqual(event.name, 'a', 'update: name');
					strictEqual('prev' in event, true, 'update: prev');
					strictEqual('curr' in event, true, 'update: curr');
					strictEqual(event.curr, 222, 'update: curr data');
				});
				ok(m.set('a', 222), 'set operation');
				propEqual(m.data, {a:222}, 'check');
			
				m = new Model({a:0});
				m.addListener('change', function () {
					ok(false, 'should not be called');
				});
				ok(!m.set('a', 0), 'set operation');
				propEqual(m.data, {a:0}, 'check');
			});
			
			
			test('unset', function testUnset () {
				var m;
			
				expect(11);
			
				m = new Model();
				propEqual(m.data, {}, 'normal init');
				m.addListener('change', function () {
					ok(false, 'should not be called');
				});
				ok(!m.unset('qwe'), 'nothing to remove');
			
				m = new Model({a:1,b:2});
				propEqual(m.data, {a:1,b:2}, 'normal init');
			
				m.addListener('change', function ( event ) {
					strictEqual(event.name, 'a', 'removal: name');
					strictEqual('prev' in event, true, 'removal: prev');
					strictEqual('curr' in event, false, 'removal: curr');
					strictEqual(event.prev, 1, 'removal: prev data');
					propEqual(m.data, {b:2}, 'result');
				});
				ok(m.unset('a'), 'do removal');
				ok(!m.unset('a'), 'do removal again');
				ok(!m.unset('qwe'), 'nothing to remove');
			});


/***/ }
/******/ ])
//# sourceMappingURL=build.js.map