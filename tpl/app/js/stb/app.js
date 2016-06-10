/**
 * @module stb/app
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Model    = require('./model'),
    router   = require('./router'),
    keys     = require('./keys'),
    metrics  = require('../../../config/metrics'),
    keyCodes = {},
    app, key, linkCSS, linkThemeCSS;


require('./shims');

window.core = window.parent.getCoreInstance(window);
window.core.once('load', function () {
    if ( app.data.time.load ) {
        app.defaultEvents.load({type: 'load'});
    }
});

// inside frame/iframe
if ( window.parent && window.parent.gSTB ) {
    // link to the outer global objects
    window.dvbManager         = window.parent.dvbManager;
    window.epgManager         = window.parent.epgManager;
    window.gSTB               = window.parent.gSTB;
    window.pvrManager         = window.parent.pvrManager;
    window.stbDownloadManager = window.parent.stbDownloadManager;
    window.stbStorage         = window.parent.stbStorage;
    window.stbUpdate          = window.parent.stbUpdate;
    window.stbUPnP            = window.parent.stbUPnP;
    window.stbWebWindow       = window.parent.stbWebWindow;
    window.stbWindowMgr       = window.parent.stbWindowMgr;
    window.timeShift          = window.parent.timeShift;
}


/**
 * @instance
 * @type {Model}
 */
app = new Model({
    /**
     * Enable logging and debugging flag set by debug module at runtime.
     *
     * @type {boolean}
     */
    debug: false,

    /**
     * True if executed on the STB device, set by debug module at runtime.
     *
     * @type {boolean}
     */
    host: true,

    /**
     * Screen geometry and margins.
     *
     * @type {Object}
     * @property {number} height Total screen height
     * @property {number} width Total screen width
     * @property {number} availTop top safe zone margin
     * @property {number} availRight right safe zone margin
     * @property {number} availBottom bottom safe zone margin
     * @property {number} availLeft left safe zone margin
     * @property {number} availHeight safe zone height
     * @property {number} availWidth safe zone width
     */
    screen: null,

    /**
     * Timestamps data.
     *
     * @type {Object}
     * @property {number} init application initialization time (right now)
     * @property {number} load document onload event
     * @property {number} done onload event sent and processed
     */
    time: {
        init: +new Date(),
        load: 0,
        done: 0
    }
});


/**
 * Set crops, total, content size and link the corresponding CSS file.
 *
 * @param {Object} metrics screen params specific to resolution
 *
 * @return {boolean} operation status
 */
app.setScreen = function ( metrics ) {
    if ( DEBUG ) {
        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
    }

    if ( metrics ) {
        if ( DEBUG ) {
            if ( typeof metrics !== 'object' ) { throw new Error(__filename + ': wrong metrics type'); }
        }

        // calculate and extend
        metrics.availHeight = metrics.height - (metrics.availTop + metrics.availBottom);
        metrics.availWidth  = metrics.width - (metrics.availLeft + metrics.availRight);

        // set max browser window size
        window.moveTo(0, 0);
        window.resizeTo(metrics.width, metrics.height);


        // already was initialized
        if ( linkCSS && linkCSS instanceof HTMLLinkElement ) {
            // remove all current CSS styles
            document.head.removeChild(linkCSS);
        }

        // already was initialized
        if ( linkThemeCSS && linkThemeCSS instanceof HTMLLinkElement ) {
            // remove all current CSS styles
            document.head.removeChild(linkThemeCSS);
        }

        linkThemeCSS = document.createElement('link');
        linkThemeCSS.rel  = 'stylesheet';
        linkThemeCSS.href = window.core.theme.path + metrics.height + '.css?' + +new Date();
        document.head.appendChild(linkThemeCSS);

        // load CSS file base on resolution
        linkCSS = document.createElement('link');
        linkCSS.rel  = 'stylesheet';
        linkCSS.href = 'css/' + (DEBUG ? 'develop.' : 'release.') + metrics.height + '.css?' + +new Date();
        document.head.appendChild(linkCSS);

        // provide global access
        this.data.metrics = metrics;

        return true;
    }

    // nothing has applied
    return false;
};


// apply screen size, position and margins
app.setScreen(metrics[screen.height] || metrics[720]);


// extract key codes
for ( key in keys ) {
    if ( key === 'volumeUp' || key === 'volumeDown' ) {
        continue;
    }
    // no need to save key names
    keyCodes[keys[key]] = true;
}


app.defaultEvents = {
    /**
     * The load event is fired when a resource and its dependent resources have finished loading.
     *
     * Control flow:
     *   1. Global handler.
     *   2. Each page handler.
     *   3. Application DONE event.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
     *
     * @param {Event} event generated object with event data
     */
    load: function ( event ) {
        debug.event(event);
        debug.log('app loaded', 'green');

        // time mark
        app.data.time.load = event.timeStamp;

        if ( window.core.ready ) {
            // global handler
            // there are some listeners
            if ( app.events[event.type] ) {
                // notify listeners
                app.emit(event.type, event);
            }
            // local handler on each page
            router.pages.forEach(function forEachPages ( page ) {
                debug.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');

                // there are some listeners
                if ( page.events[event.type] ) {
                    // notify listeners
                    page.emit(event.type, event);
                }
            });

            // time mark
            app.data.time.done = +new Date();
            // everything is ready
            // and there are some listeners
            if ( app.events['done'] ) {
                // notify listeners
                app.emit('done', event);
            }
        }
    },

    /**
     * The unload event is fired when the document or a child resource is being unloaded.
     *
     * Control flow:
     *   1. Each page handler.
     *   2. Global handler.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
     *
     * @param {Event} event generated object with event data
     */
    unload: function ( event ) {
        debug.event(event);

        // global handler
        // there are some listeners
        if ( app.events[event.type] ) {
            // notify listeners
            app.emit(event.type, event);
        }

        // local handler on each page
        router.pages.forEach(function forEachPages ( page ) {
            debug.log('component ' + page.constructor.name + '.' + page.id + ' unload', 'red');

            // there are some listeners
            if ( page.events[event.type] ) {
                // notify listeners
                page.emit(event.type, event);
            }
        });
    },

    /**
     * The error event is fired when a resource failed to load.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
     *
     * @param {Event} event generated object with event data
     */
    error: function ( event ) {
        debug.event(event);
    },

    /**
     * The keydown event is fired when a key is pressed down.
     * Set event.stop to true in order to prevent bubbling.
     *
     * Control flow:
     *   1. Current active component on the active page.
     *   2. Current active page itself.
     *   3. Application.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
     *
     * @param {Event} event generated object with event data
     */
    keydown: function ( event ) {
        var page = router.current,
            activeComponent,
            eventData = { // native event won't work in desktop browser because of operations with code field
                keyCode: event.keyCode,
                stop: event.stop,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                type: event.type,
                native: event
            };

        if ( DEBUG ) {
            if ( !page ) { throw new Error(__filename + ': app should have at least one page'); }
        }

        // filter phantoms
        if ( eventData.keyCode === 0 ) { return; }

        // combined key code
        eventData.code = eventData.keyCode;

        // apply key modifiers
        if ( eventData.shiftKey ) { eventData.code += 1000; }
        if ( eventData.altKey )   { eventData.code += 2000; }

        debug.event(eventData);

        // page.activeComponent can be set to null in event handles
        activeComponent = page.activeComponent;

        // current component handler
        if ( activeComponent && activeComponent !== page ) {
            // component is available and not page itself
            if ( activeComponent.events[eventData.type] ) {
                // there are some listeners
                activeComponent.emit(eventData.type, eventData);
            }

            // bubbling
            if (
                !eventData.stop &&
                activeComponent.propagate &&
                activeComponent.parent &&
                activeComponent.parent.events[eventData.type]
            ) {
                activeComponent.parent.emit(eventData.type, eventData);
            }
        }

        // page handler
        if ( !eventData.stop ) {
            // not prevented
            if ( page.events[eventData.type] ) {
                // there are some listeners
                page.emit(eventData.type, eventData);
            }

            // global app handler
            if ( !eventData.stop ) {
                // not prevented
                if ( app.events[eventData.type] ) {
                    // there are some listeners
                    app.emit(eventData.type, eventData);
                }
            }
        }

        // suppress non-printable keys in stb device (not in your browser)
        if ( app.data.host && keyCodes[eventData.code] ) {
            event.preventDefault();
        }
    },

    /**
     * The keypress event is fired when press a printable character.
     * Delivers the event only to activeComponent at active page.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
     *
     * @param {Event} event generated object with event data
     * @param {string} event.char entered character
     */
    keypress: function ( event ) {
        var page = router.current;

        if ( DEBUG ) {
            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
        }

        //debug.event(event);

        // current component handler
        if ( page.activeComponent && page.activeComponent !== page ) {
            // component is available and not page itself
            if ( page.activeComponent.events[event.type] ) {
                // there are some listeners
                page.activeComponent.emit(event.type, event);
            }
        }
    },

    /**
     * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
     *
     * @param {Event} event generated object with event data
     */
    click: function ( event ) {
        debug.event(event);
    },

    /**
     * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
     * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
     * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
     *
     * @param {Event} event generated object with event data
     */
    contextmenu: function ( event ) {
        //var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));

        debug.event(event);

        //kbEvent.type    = 'keydown';
        //kbEvent.keyCode = 8;

        //debug.log(kbEvent.type);

        //globalEventListenerKeydown(kbEvent);
        //var event = document.createEvent('KeyboardEvent');
        //event.initEvent('keydown', true, true);

        //document.dispatchEvent(kbEvent);

        if ( !DEBUG ) {
            // disable right click in release mode
            event.preventDefault();
        }
    },

    /**
     * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
     *
     * @param {Event} event generated object with event data
     */
    mousewheel: function ( event ) {
        var page = router.current;

        if ( DEBUG ) {
            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
        }

        debug.event(event);

        // current component handler
        if ( page.activeComponent && page.activeComponent !== page ) {
            // component is available and not page itself
            if ( page.activeComponent.events[event.type] ) {
                // there are some listeners
                page.activeComponent.emit(event.type, event);
            }
        }

        // page handler
        if ( !event.stop ) {
            // not prevented
            if ( page.events[event.type] ) {
                // there are some listeners
                page.emit(event.type, event);
            }
        }
    }
};


// apply events
for ( key in app.defaultEvents ) {
    window.addEventListener(key, app.defaultEvents[key]);
}


/**
 * Show app.
 */
app.show = function () {
    if ( this.events['show'] ) {
        this.emit('show');
    }

    window.core.call('app:ready');
};


/**
 * Exit from app.
 * Destroy all application instance.
 * If callback function provided, and callback returns boolean 'true', application will stay alive.
 *
 * @fires module:/stb/app#exit
 *
 * @param [callback] provide callback if u want to handle exit result, or cancel it
 */
app.exit = function ( callback ) {
    var ModalMessage = require('./ui/modal.message'),
        LayoutList   = require('./ui/layout.list'),
        previousFocus = router.current.activeComponent,
        exitModal;

    router.current.add(exitModal = new ModalMessage({
        title: gettext('Exit'),
        events:{
            show: function () {
                this.children[0].focus();
            },
            hide: function () {
                previousFocus.focus();
            }
        },
        children:[
            new LayoutList({
                size:2,
                focusIndex:0,
                data:[
                    {
                        items: [
                            {
                                value: gettext('Exit')
                            }
                        ],
                        click: function () {
                            if ( typeof callback === 'function' ) {
                                if ( callback(true) ) {
                                    exitModal.hide();
                                    exitModal.remove();
                                    return;
                                }
                            }
                            if ( app.events['exit'] ) {
                                app.emit('exit');
                            }

                            exitModal.hide();
                            exitModal.remove();
                            core.call('exit');
                        }
                    },
                    {
                        items: [
                            {
                                value: gettext('Cancel')
                            }
                        ],
                        click: function () {
                            if ( typeof callback === 'function' ) {
                                callback(false);
                            }
                            exitModal.hide();
                            exitModal.remove();
                        }
                    }
                ],
                events: {
                    keydown: function ( event ) {
                        LayoutList.prototype.defaultEvents.keydown.call(this, event);
                        if ( event.code === keys.back ) {
                            event.stop = true;
                            if ( typeof callback === 'function' ) {
                                callback(false);
                            }
                            exitModal.hide();
                            exitModal.remove();
                        }
                    }
                }
            })
        ]
    }));

    exitModal.show();
    exitModal.focus();
};


// new way of string handling
// all strings are in UTF-16
// since stbapp 2.18
if ( window.gSTB && gSTB.SetNativeStringMode ) {
    /* eslint new-cap: 0 */

    gSTB.SetNativeStringMode(true);
}


// public
module.exports = app;
