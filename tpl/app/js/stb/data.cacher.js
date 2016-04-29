/**
 * Created by harry on 23.03.16.
 */

'use strict';

var keys = require('./keys'),
	blocked = false,
    delta = 0;

/**
 * Data cacher
 *
 * Caches data in a predetermined range
 *
 * @constructor
 *
 * @param {Object}   config          		init parameters (all inherited from the parent)
 * @param {function} config.getter      	method to get data for cache
 * @param {object}   [config.request={}]    request params for getter
 * @param {number}   config.pageSize=5  	amount of items on a page
 * @param {number}   [config.stepSize=5]  	step size (default 1)
 * @param {number}   [config.cacheSize=2]  	amount of cached pages (default 1)
 * @param {number}   [config.count=100]    	length of cached list
 *
 * @example
 * var Provider = require('stb/data.cacher'),
 *		provider =  new Provider({
 *			pageSize: 7,
 *			cacheSize: 2,
 *			request: {},
 *			getter: function ( callback, config ) {}
 *		});
 *
 */

function DataCacher ( config ) {
	config = config || {};
	this.size = config.pageSize;
	this.stepSize = config.stepSize || 1;
	this.data = [];
	this.head = 0;
	this.tail = 0;
	this.pos = 0;
	this.cacheSize = ( config.cacheSize || 2 ) * this.size;
	this.config = config.request || {};
	this.botEmptyLine = false;
	this.maxCount = config.count;
    this.headItem = config.headItem;

	this.getter = config.getter;
}

DataCacher.prototype.constructor = DataCacher;


/**
 * Get part of data
 *
 * @param {number} direction to get data
 * @param {function} callback after getting data
 */
DataCacher.prototype.get = function ( direction, callback ) {
	var self = this,
		error = false,
		receivedData = [];


	switch ( direction ) {
		case null:
			blocked = true;
            this.config.offset = this.pos;
			this.config.limit = this.cacheSize;
			this.getter(function ( e, data ) {
				if ( !e ) {
					self.data = data;
                    if ( self.headItem ) {
                        self.data.unshift(self.headItem);
                        delta = 1;
                    }
					self.tail = data.length;
					receivedData = self.data.slice(self.pos, self.pos + self.size);
					blocked = false;
					self.checkNext();
				}
				callback(e, receivedData);
			}, this.config);
			break;
		case keys.right:
		case keys.down:
			if ( blocked ) {
				break;
			}
			this.pos += this.stepSize;
			if ( this.pos + this.size < this.data.length ) {
				receivedData = this.data.slice(this.pos, this.pos + this.size);
				callback(error, receivedData);
				this.checkNext();
			} else {
				this.checkNext(callback);
			}
			break;
		case keys.pageDown:
			if ( blocked ) {
				break;
			}
			this.pos += this.size - 1;
			if ( this.pos + this.size < this.data.length ) {
				receivedData = this.data.slice(this.pos, this.pos + this.size);
				callback(error, receivedData);
				this.checkNext();
			} else {
				this.checkNext(callback);
			}
			break;
		case keys.left:
		case keys.up:
			if ( blocked ) {
				break;
			}
			this.pos -= this.stepSize;
			if ( this.pos >= 0 ) {
				receivedData = this.data.slice(this.pos, this.pos + this.size);
				callback(error, receivedData);
				this.checkPrev();
			} else {
				this.checkPrev(callback);
			}
			break;
		case keys.pageUp:
			if ( blocked ) {
				break;
			}
			this.pos -= this.size - 1;
			if ( this.pos > 0 ) {
				receivedData = this.data.slice(this.pos, this.pos + this.size);
				callback(error, receivedData);
				this.checkPrev();
			} else {
				this.checkPrev(callback);
			}
			break;
		case keys.home:
			if ( blocked ) {
				break;
			}
			if ( this.head === 0 ) {
				this.pos = 0;
				receivedData = this.data.slice(this.pos, this.pos + this.size);
				callback(error, receivedData);
			} else {
				blocked = true;
				this.pos = 0;
				this.config.limit = this.cacheSize;
				this.getter(function ( e, data ) {
					if ( !e ) {
						self.data = data;
						self.tail = data.length;
						receivedData = self.data.slice(self.pos, self.pos + self.size);
						blocked = false;
						self.botEmptyLine = false;
					}
					callback(e, receivedData);
				}, this.config);
				break;
			}
			break;
		case keys.end:
			if ( blocked ) {
				break;
			}
			if ( this.maxCount ) {
				if ( this.tail === this.maxCount ) {
					self.pos = self.data.length - self.size;
					if ( self.pos < 0 ) {
						self.pos = 0;
					}
					receivedData = self.data.slice(self.pos, self.pos + self.size);
					self.botEmptyLine = true;
					callback(error, receivedData);
				} else {
					blocked = true;
					this.head = this.maxCount - 2 * this.cacheSize;
					if ( this.head < 0 ) {
						this.head = 0;
					}
					this.tail = this.maxCount;
					this.config.offset = this.head;
					this.config.limit = 2 * this.cacheSize;
					this.getter(function ( e, data ) {
						if ( !e ) {
							self.data = data;
							self.pos = self.data.length - self.size;
							if ( self.pos < 0 ) {
								self.pos = 0;
							}
							receivedData = self.data.slice(self.pos, self.pos + self.size);
							self.botEmptyLine = true;
							blocked = false;
						}
						callback(e, receivedData);
					}, this.config);
				}
			} else {
				callback(true);
			}
			break;
	}
};


DataCacher.prototype.checkNext = function ( cb ) {
	var count = this.cacheSize + this.pos - this.data.length,
		self = this;

	if ( this.botEmptyLine ) {
		if ( this.pos > this.data.length - this.size ) {
			this.pos = this.data.length - this.size;
		}
		if ( cb ) {
			cb(false, this.data.slice(this.pos, this.pos + this.size));
		}

		return;
	}

	if ( count >= this.size ) {
		if ( this.maxCount && count + this.tail > this.maxCount ) {
			count = this.maxCount - this.tail;
			if ( count <= 0 ) {
				if ( self.pos > self.data.length - self.size ) {
					self.pos = self.data.length - self.size;
				}
				if ( cb ) {
					cb(false, self.data.slice(self.pos, self.pos + self.size));
				}
				this.botEmptyLine = true;
				return;
			}
		}
		this.config.limit = count;
        this.config.offset = this.tail - delta;
		if ( cb ) {
			blocked = true;
		}
		this.getter(function ( e, data ) {
			if ( !e ) {
				if ( data.length < count ) {
					self.botEmptyLine = true;
				}
				if ( data.length ) {
					self.data = self.data.concat(data);
					count = self.data.length - 2 * self.cacheSize;
					self.tail += data.length;
					if ( count > 0 ) {
						self.data.splice(0, count);
						self.pos -= count;
						self.head += count;
					}
				}
				if ( self.pos > self.data.length - self.size ) {
					self.pos = self.data.length - self.size;
				}
			}
			if ( cb ) {
				cb(e, self.data.slice(self.pos, self.pos + self.size));
			}
			blocked = false;
		}, this.config);
	}

};

DataCacher.prototype.checkPrev = function ( cb ) {
	var count = this.cacheSize - this.pos,
		self = this;

	if ( this.head > 0 ) {
		if ( count >= this.size ) {
			if ( count > this.head ) {
				count = this.head;
			}
            this.config.offset = this.head - count - delta;
            if ( this.config.offset < 0 ) {
                this.config.offset = 0;
                count -= delta;
            }
			this.config.limit = count;
			if ( cb ) {
				blocked = true;
			}
			this.getter(function ( e, data ) {
				if ( !e ) {
					self.data = data.concat(self.data);
                    if ( self.config.offset === 0 && self.headItem && self.data[0] !== self.headItem ) {
                        self.data.unshift(self.headItem);
                    }
					self.tail -= data.length;
					self.pos += data.length;
					count = self.data.length - 2 * self.cacheSize;
					self.head -= count;
					if ( count > 0 ) {
						self.data.splice(-count);
						self.botEmptyLine = false;
					}
				}
				if ( cb ) {
					cb(e, self.data.slice(self.pos, self.pos + self.size));
				}
				blocked = false;
			}, this.config);
		}
	} else {
        if ( this.headItem && this.data[0] !== this.headItem ) {
            this.data.unshift(this.headItem);
        }

        if ( this.pos < 0 ) {
            this.pos = 0;
        }
        if ( cb ) {
            cb(false, self.data.slice(self.pos, self.pos + self.size));
        }
	}
};

module.exports = DataCacher;
