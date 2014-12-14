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
