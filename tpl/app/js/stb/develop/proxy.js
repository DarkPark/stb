/**
 * STB calls relay.
 *
 * @module stb/develop/proxy
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint new-cap: 0 */

var host   = require('../app').data.host,
    util   = require('util'),
    config = require('../../../../config/proxy');


/**
 * Proxy host activation
 */
function initHost () {
    var ProxyHost = require('code-proxy/client/host');

    // init and export to globals
    window.proxy = new ProxyHost({
        name: config.name,
        host: location.hostname,
        port: config.portWs
    });

    // redefine logging
    window.proxy.log = function log ( type, time, status, message, params ) {
        gSTB.Debug(util.format('[%s]\t%s\t%s\t%s\t%s',
            type.grey,
            config.name.magenta,
            time.toString().grey,
            (status ? message.green : message.red),
            (params ? JSON.stringify(params).grey : '')
        ));
    };
}

/**
 * Proxy guest activation
 */
function initGuest () {
    var ProxyGuest = require('code-proxy/client/guest'),
        stbNames   = ['dvbManager', 'gSTB', 'pvrManager', 'stbDownloadManager', 'stbStorage', 'stbUpdate', 'stbWebWindow', 'stbWindowMgr', 'timeShift'],
        skipKeys   = ['objectName', 'destroyed', 'deleteLater'];

    // init and export to globals
    window.proxy = new ProxyGuest({
        name: config.name,
        host: location.hostname,
        port: config.portHttp
    });

    // create local stb objects
    stbNames.forEach(function forEachStbNames ( stbObjName ) {
        // prepare
        var stbObj = window[stbObjName] = {},
            // for each global stb object get all its properties
            keysCode = util.format('Object.keys(%s)', stbObjName),
            stbObjKeys;

        // get data from cache if no connection
        if ( !window.proxy.active && config.cache ) {
            stbObjKeys = JSON.parse(localStorage.getItem('proxy:eval:' + keysCode));
            console.log('proxy cache: ', keysCode);
        } else {
            stbObjKeys = window.proxy.eval(keysCode);
            localStorage.setItem('proxy:eval:' + keysCode, JSON.stringify(stbObjKeys));
        }

        // valid list of keys
        if ( stbObjKeys && Array.isArray(stbObjKeys) ) {

            stbObjKeys.forEach(function forEachStbObjKeys ( stbObjKey ) {
                // strip signature
                stbObjKey = stbObjKey.split('(')[0];
                // get rid of system fields
                if ( skipKeys.indexOf(stbObjKey) === -1 ) {
                    // wrap each method with proxy call
                    stbObj[stbObjKey] = (function stbCallWrapper ( name, method ) {
                        return function stbCallBody () {
                            var code = name + '.' + method,
                                data;

                            // get data from cache if no connection
                            if ( !window.proxy.active && config.cache ) {
                                data = JSON.parse(localStorage.getItem('proxy:call:' + code));
                                console.log('proxy cache: ', code);
                            } else {
                                data = window.proxy.call(code, Array.prototype.slice.call(arguments), name) || null;
                                localStorage.setItem('proxy:call:' + code, JSON.stringify(data));
                            }
                            return data;
                        };
                    }(stbObjName, stbObjKey));
                }
            });
        }
    });
}


// init
if ( config.active ) {
    if ( host ) {
        initHost();
    } else {
        initGuest();
    }
}
