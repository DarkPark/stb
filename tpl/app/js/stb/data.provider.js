/**
 * Basic data provider template
 *
 * @author Aleynikov Boris <alynikov.boris@gmail.com>.
 */

'use strict';

var Emitter = require('./emitter');


/**
 * Data provider
 *
 * @param {Object} config init parameters
 * @constructor
 */
function DataProvider ( config ) {
    config = config || {};

    Emitter.call(this);

}

DataProvider.prototype = Object.create(Emitter.prototype);
DataProvider.prototype.constructor = DataProvider;


/**
 * Callback after success getting data
 *
 * @callback getCallback
 * @param {Object} error object contains error information
 * @param {array} data to return
 */


/**
 * Get next part of data
 *
 * @param {number=null} direction to get data
 * @param {getCallback} callback after getting data
 * @return {boolean} state of present data in cache, true if provider will make a request for new data
 */
DataProvider.prototype.get = function ( direction, callback ) {

    return true;
};

module.exports = DataProvider;
