/**
 * Web Inspector Remote.
 *
 * @module stb/develop/weinre
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var dom     = require('../dom'),
    util    = require('util'),
    storage = require('./storage'),
    config  = require('../../../../config/weinre');


// web inspector is allowed only without SpyJS
if ( config.active && !storage.get('spyjs.active') ) {
    // load external script
    document.head.appendChild(dom.tag('script', {
        type: 'text/javascript',
        src: util.format('//%s:%s/target/target-script-min.js#%s', location.hostname, config.port, config.name)
    }));
}
