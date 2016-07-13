'use strict';

if ( !HTMLElement.prototype.addEventListener ) {
    HTMLElement.prototype.addEventListener = function (name, callback) {
        require('add-event-listener').addEventListener(this, name, callback);
    };
}

if ( !HTMLElement.prototype.removeEventListener ) {
    HTMLElement.prototype.removeEventListener = function (name, callback) {
        require('add-event-listener').removeEventListener(this, name, callback);
    };
}

if ( typeof window['JSON'] == 'undefined' ) {
    require('json3');
} else if ( typeof JSON.stringify == 'undefined' || typeof JSON.parse == 'undefined' ) {
    require('json3');
}

if ( typeof Object.prototype.defineProperty === 'undefined' ) {
    Object.prototype.defineProperty = require('define-property');
}

if ( typeof Object.prototype.create === 'undefined' ) {
    Object.prototype.defineProperty = require('object-create');
}

if ( typeof Array.prototype.isArray === 'undefined' ) {
    Array.prototype.isArray = require('isarray')
}

(function () {
    var realXhr = window.XMLHttpRequest;

    window.XMLHttpRequest = function () {
        var xhr = new realXhr();
        xhr.onreadystatechange = function () {
            if ( xhr.readyState === 4 ) {
                if ( typeof(xhr.onload) === 'function' ) {
                    xhr.onload.call(xhr);
                }
            }
        };
        return xhr;
    };
})()
