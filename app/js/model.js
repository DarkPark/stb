/**
 * @module stb/model
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter');


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
 * @event module:stb/model#clear
 *
 * @type {Object}
 * @property {Object} data old model attributes
 */


/**
 * Remove all attributes from the model.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/model#clear
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
 * @event Model#init
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
 * @fires Model#clear
 * @fires Model#init
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
 * @event Model#change
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
 * @fires Model#change
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
 * @fires Model#change
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
