/**
 * https://github.com/taylorhakes/promise-polyfill
 *
 * @module stb/promise
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint-disable */

/**
 * Base Promise implementation.
 *
 * @param {function} fn function executor with two arguments resolve and reject
 *
 * @constructor
 *
 * @example
 * var p = new Promise(function ( resolve, reject ) {
 *     // do a thing, possibly async, then ...
 *     if ( everything_turned_out_fine ) {
 *         resolve('ok');
 *     } else {
 *         reject(new Error('failure'));
 *     }
 * });
 */
function Promise ( fn ) {
	if ( DEBUG ) {
		if ( typeof this !== 'object' ) { throw new Error(__filename + ': must be constructed via new'); }
		if ( typeof fn !== 'function' ) { throw new Error(__filename + ': argument should be a function'); }
	}

	this.state = null;
	this.value = null;
	this.deferreds = [];
	//this.executor  = fn;

	doResolve(fn, bind(resolve, this), bind(reject, this));
}


/*Promise.prototype = {
	then: function ( onFulfilled, onRejected ) {
		var self = this;

		return new Promise(function ( resolve, reject ) {
			handle.call(self, new Handler(onFulfilled, onRejected, resolve, reject));
		});
	}
};*/


// Polyfill for Function.prototype.bind
function bind ( fn, thisArg ) {
	return function () {
		fn.apply(thisArg, arguments);
	};
}


function handle ( deferred ) {
	var self = this;

	if ( this.state === null ) {
		this.deferreds.push(deferred);
		return;
	}
	setTimeout(function () {
		var cb = self.state ? deferred.onFulfilled : deferred.onRejected,
			ret;

		if ( cb === null ) {
			(self.state ? deferred.resolve : deferred.reject)(self.value);
			return;
		}

		try {
			ret = cb(self.value);
		} catch ( e ) {
			deferred.reject(e);
			return;
		}

		deferred.resolve(ret);
	});
}


function resolve ( newValue ) {
	try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
		if ( newValue === this ) { throw new TypeError('A promise cannot be resolved with itself.'); }
		if ( newValue && (typeof newValue === 'object' || typeof newValue === 'function') ) {
			var then = newValue.then;

			if ( typeof then === 'function' ) {
				doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
				return;
			}
		}
		this.state = true;
		this.value = newValue;
		finale.call(this);
	} catch ( e ) {
		reject.call(this, e);
	}
}


function reject ( newValue ) {
	this.state = false;
	this.value = newValue;
	finale.call(this);
}


function finale () {
	var i, len;

	for ( i = 0, len = this.deferreds.length; i < len; i++ ) {
		handle.call(this, this.deferreds[i]);
	}
	this.deferreds = null;
}


function Handler ( onFulfilled, onRejected, resolve, reject ) {
	this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	this.resolve = resolve;
	this.reject = reject;
}


/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve ( fn, onFulfilled, onRejected ) {
	var done = false;

	try {
		fn(function ( value ) {
			if ( done ) { return; }
			done = true;
			onFulfilled(value);
		}, function ( reason ) {
			if ( done ) { return; }
			done = true;
			onRejected(reason);
		});
	} catch ( ex ) {
		if ( done ) { return; }
		done = true;
		onRejected(ex);
	}
}


Promise.prototype['catch'] = function ( onRejected ) {
	return this.then(null, onRejected);
};


Promise.prototype.then = function ( onFulfilled, onRejected ) {
	var self = this;

	return new Promise(function ( resolve, reject ) {
		handle.call(self, new Handler(onFulfilled, onRejected, resolve, reject));
	});
};


Promise.all = function () {
	var args = Array.prototype.slice.call(arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments);

	return new Promise(function ( resolve, reject ) {
		var remaining = args.length,
			i;

		if ( args.length === 0 ) { return resolve([]); }

		function res ( i, val ) {
			try {
				if ( val && (typeof val === 'object' || typeof val === 'function') ) {
					var then = val.then;

					if ( typeof then === 'function' ) {
						then.call(val, function ( val ) {
							res(i, val);
						}, reject);
						return;
					}
				}
				args[i] = val;
				if ( --remaining === 0 ) {
					resolve(args);
				}
			} catch ( ex ) {
				reject(ex);
			}
		}

		for ( i = 0; i < args.length; i++ ) {
			res(i, args[i]);
		}
	});
};


Promise.resolve = function ( value ) {
	if ( value && typeof value === 'object' && value.constructor === Promise ) {
		return value;
	}

	return new Promise(function ( resolve ) {
		resolve(value);
	});
};


Promise.reject = function ( value ) {
	return new Promise(function ( resolve, reject ) {
		reject(value);
	});
};


Promise.race = function ( values ) {
	return new Promise(function ( resolve, reject ) {
		for ( var i = 0, len = values.length; i < len; i++ ) {
			values[i].then(resolve, reject);
		}
	});
};


// public
module.exports = window.Promise || Promise;
