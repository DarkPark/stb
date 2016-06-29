/**
 * @module stb/collection
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter');


/**
 * Base collection implementation
 *
 * @constructor
 *
 * @param {Model[]} [data=[]] init model list
 */
function Collection ( data ) {
    var model, i;

    // parent constructor call
    Emitter.call(this);

    /**
     * list of all stored data
     * @private
     */
    this.data = [];

    /**
     * hash table of all model ids
     * @private
     */
    this.ids = {};

    // extract ids
    for ( i = 0; i < this.data.length; i++ ) {
        model = this.data[i];
        this.ids[model.id || model.data[model.idName]] = model;
    }

    // apply list of items
    if ( data ) {
        if ( DEBUG ) {
            if ( !Array.isArray(data) ) { throw new Error(__filename + ': wrong data type'); }
        }

        this.data = data;
    }

    // public attributes
    //this.model = Model;
    //this.url = null;
    // which of data fields is primary
    //this.idName = 'id';
}


// inheritance
Collection.prototype = Object.create(Emitter.prototype);
Collection.prototype.constructor = Collection;


/**
 * Remove all models from the collection event.
 *
 * @event module:stb/collection~Collection#clear
 *
 * @type {Object}
 * @property {Model[]} data old model list
 */


/**
 * Remove all models from the collection.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/collection~Collection#clear
 */
Collection.prototype.clear = function () {
    var data, i;

    // is there any data?
    if ( this.data.length > 0 ) {
        // clone the model list
        data = this.data.slice();

        // remove all associated handlers
        for ( i = 0; i < this.data.length; i++ ) {
            this.remove(this.data[0]);
        }

        // reset
        this.data = [];
        this.ids  = {};

        // notify listeners
        this.emit('clear', {data: data});

        return true;
    }

    return false;
};


/**
 * Set collection data event.
 *
 * @event module:stb/collection~Collection#init
 *
 * @type {Object}
 * @property {Model[]} data new model list
 */


/**
 * Clear and fill the collection with the given list of models.
 *
 * @param {Model[]} data model list
 * @return {boolean} operation status
 *
 * @fires module:stb/collection~Collection#clear
 * @fires module:stb/collection~Collection#init
 */
Collection.prototype.init = function ( data ) {
    var i, model;

    if ( Array.isArray(data) ) {
        // reset data
        this.clear();

        // apply list
        this.data = data;

        // extract ids
        for ( i = 0; i < data.length; i++ ) {
            model = data[i];
            this.ids[model.id || model.data[model.idName]] = model;
        }

        // notify listeners
        this.emit('init', {data: data});

        return true;
    }

    return false;
};


/**
 * Append the given model to the collection event.
 *
 * @event module:stb/collection~Collection#add
 *
 * @type {Object}
 * @property {Model} item new model object
 * @property {number} index model position in the list
 */


/**
 * Append the given model to the collection.
 *
 * @param {Model} model object to add
 *
 * @fires module:stb/collection~Collection#add
 */
Collection.prototype.add = function ( model ) {
    // data
    this.ids[model.id || model.data[model.idName]] = model;
    this.data.push(model);

    // notify listeners
    this.emit('add', {item: model, index: this.data.length - 1});
};


/**
 * Insert the given model to some place in the collection
 *
 * @param {Model} model model object
 * @param {number} index model position in the list
 *
 * @fires module:stb/collection~Collection#add
 */
Collection.prototype.insert = function ( model, index ) {
    // data
    this.ids[model.id || model.data[model.idName]] = model;
    this.data.splice(index, 0, model);

    // notify listeners
    this.emit('add', {item: model, index: index});
};


/**
 * Remove the given model from the collection event.
 *
 * @event module:stb/collection~Collection#remove
 *
 * @type {Object}
 * @property {Model} item removed model object
 * @property {number} index model position in the list
 */


/**
 * Delete the given model from the collection.
 *
 * @param {Model} model object to remove
 *
 * @fires module:stb/collection~Collection#remove
 */
Collection.prototype.remove = function ( model ) {
    var index = this.data.indexOf(model);

    if ( index > -1 ) {
        model.removeAllListeners();
        this.data.splice(index, 1);
        delete this.ids[model.id || model.data[model.idName]];
        this.emit('remove', {item: model, index: index});
    }
};


/**
 * Check if the given object is present in the collection.
 *
 * @param {Model} item model to look for
 * @return {boolean} search status
 */
Collection.prototype.has = function ( item ) {
    return this.data.indexOf(item) >= 0;
};


/**
 * Get a model by the given index in the collection.
 *
 * @param {number} index model position in the list
 * @return {Model|null} model or null if fail to find
 */
Collection.prototype.at = function ( index ) {
    return this.data[index] || null;
};


/**
 * Get a model by its id.
 *
 * @param {String|Number} id unique identifier
 * @return {Model|null} model or null if fail to find
 */
Collection.prototype.get = function ( id ) {
    return this.ids[id] || null;
};


// extending with base methods
['filter', 'forEach', 'every', 'map', 'some'].forEach(function forEachMethods ( name ) {
    Collection.prototype[name] = function methodWrapper () {
        return Array.prototype[name].apply(this.data, arguments);
    };
});


/**
 * Apply the custom sort method for all models in the collection event.
 *
 * @event module:stb/collection~Collection#sort
 */


/**
 * Apply the custom sort method for all models in the collection.
 *
 * @param {function} comparator custom callback to provide sorting algorithm
 *
 * @fires module:stb/collection~Collection#sort
 */
Collection.prototype.sort = function ( comparator ) {
    // valid method
    if ( comparator && typeof comparator === 'function' ) {
        this.data.sort(comparator);
        this.emit('sort');
    }
};


///**
// * Collect models from a server
// */
//Collection.prototype.fetch = function () {
//    var self = this, i;
//    if ( this.model && this.url ) {
//        // collect data
//        io.ajax(this.url, {
//            // request params
//            method   : 'get',
//            onload   : function ( data ) {
//                data = self.parse(data);
//                // create models from response and add
//                if ( Array.isArray(data) && self.model ) {
//                    for ( i = 0; i < data.length; i++ ) {
//                        // create a model from received data
//                        self.add(new (self.model)(data[i]));
//                    }
//                }
//                self.emit('fetch', true);
//            },
//            // error handlers
//            onerror  : this.fetchFailure,
//            ontimeout: this.fetchFailure
//        });
//    }
//};
//
//
///**
// * Error handler while model data fetch
// */
//Collection.prototype.fetchFailure = function () {
//    this.emit('fetch', false);
//};
//
//
///**
// * Convert received data from a server to a model list
// * @param {string} response
// * @return {Array}
// */
//Collection.prototype.parse = function ( response ) {
//    var data = [];
//    try {
//        data = JSON.parse(response).data;
//    } catch ( e ) {
//        console.log(e);
//    }
//    return data;
//};


Object.defineProperty(Collection.prototype, 'length', {
    get: function () {
        return this.data.length;
    }
});


// public
module.exports = Collection;
