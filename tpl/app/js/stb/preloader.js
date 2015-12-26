/**
 * Singleton for url links pre-loading.
 *
 * @module stb/preloader
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter   = require('./emitter'),
    preloader = new Emitter(),
    queueSize = 0,
    groups    = {},
    verbose   = false;


/**
 * One of the links is loaded.
 *
 * @event module:stb/preloader#link
 *
 * @type {Object}
 * @property {string} url link address
 * @property {string} group group name
 */

/**
 * The whole group of links is loaded.
 *
 * @event module:stb/preloader#group
 *
 * @type {Object}
 * @property {string} name group name
 */

/**
 * Everything is loaded.
 *
 * @event module:stb/preloader#done
 */


/**
 * Handler of image loading process.
 *
 * @param {Event} event load event
 *
 * @fires module:stb/preloader#link
 * @fires module:stb/preloader#group
 * @fires module:stb/preloader#done
 */
function handler ( event ) {
    // report
    if ( event.type === 'error' ) {
        debug.log('[preloader] group "' + this.group + '" link "' + this.src + '"', 'red');
    } else {
        if ( verbose ) {
            debug.log('[preloader] group "' + this.group + '" link "' + this.src + '" (' + this.width + 'x' + this.height + ')');
        }
    }

    queueSize--;
    groups[this.group]--;

    // one link is done
    if ( preloader.events['link'] ) {
        // notify listeners
        preloader.emit('link', {url: this.src, group: this.group});
    }

    // the whole group is done
    if ( groups[this.group] === 0 ) {
        debug.log('[preloader] group "' + this.group + '" loaded');
        // one link is done
        if ( preloader.events['group'] ) {
            // notify listeners
            preloader.emit('group', {name: this.group});
        }
    }

    // everything is done
    if ( queueSize === 0 ) {
        debug.log('[preloader] done');
        // all links are done
        if ( preloader.events['done'] ) {
            // notify listeners
            preloader.emit('done');
        }
    }
}


/**
 * Clear and fill the router with the given list of pages.
 *
 * @param {Array} links list of urls to load
 *
 * @example
 * preloader.addListener('link', function ( data ) { console.log(data.url, data.group); });
 * preloader.addListener('group', function ( data ) { console.log(data.name); });
 * preloader.addListener('done', function () { console.log('ok'); });
 *
 * preloader.add([
 *     'http://pic.uuhy.com/uploads/2011/09/01/Painting-Of-Nature.png',
 *     'https://perishablepress.com/wp/wp-content/themes/wire/img/jeff-starr.jpg',
 *     {url: 'http://www.phpied.com/files/reflow/dyna1.png', group:'qwe'},
 *     {url: 'http://www.phpied.com/files/reflow/dyna3.png', group:'qwe'},
 *     'http://www.phpied.com/files/reflow/render.wrong.extension'
 * ]);
 */
preloader.add = function ( links ) {
    if ( DEBUG ) {
        if ( !Array.isArray(links) ) { throw new Error(__filename + ': wrong argument links'); }
    }

    // walk through all the given links
    links.forEach(function ( item ) {
        var img   = new Image(),
            url   = item.url   || item,
            group = item.group || '';

        if ( DEBUG ) {
            if ( typeof url !== 'string' ) { throw new Error(__filename + ': wrong url type'); }
            if ( typeof group !== 'string' ) { throw new Error(__filename + ': wrong group type'); }
            if ( url.trim() === '' ) { throw new Error(__filename + ': empty url'); }
        }

        // increase counters
        queueSize++;
        groups[group] = groups[group] === undefined ? 1 : groups[group] + 1;

        // build tag
        img.src    = url;
        img.group  = group;
        img.onload = img.onerror = img.ontimeout = handler;
    });

};


if ( DEBUG ) {
    // expose to the global scope
    window.preloader = preloader;
}


// public
module.exports = preloader;
