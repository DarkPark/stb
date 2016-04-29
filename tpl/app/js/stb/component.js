/**
 * @module stb/component
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('./emitter'),
    router  = require('./router'),
    counter = 0;


/**
 * Base component implementation.
 *
 * Visual element that can handle sub-components.
 * Each component has a DOM element container $node with a set of classes:
 * "component" and some specific component class names depending on the hierarchy, for example "page".
 * Each component has a unique ID given either from $node.id or from data.id. If not given will generate automatically.
 *
 * @constructor
 * @extends Emitter
 *
 * @param {Object} [config={}] init parameters
 * @param {Element} [config.id] component unique identifier (generated if not set)
 * @param {string} [config.className] space-separated list of classes for "className" property of this.$node
 * @param {Element} [config.$node] DOM element/fragment to be a component outer container
 * @param {Element} [config.$body] DOM element/fragment to be a component inner container (by default is the same as $node)
 * @param {Component} [config.parent] link to the parent component which has this component as a child
 * @param {Array.<Component>} [config.children=[]] list of components in this component
 * @param {Object.<string, function>} [config.events={}] list of event callbacks
 * @param {boolean} [config.visible=true] component initial visibility state flag
 * @param {boolean} [config.focusable=true] component can accept focus or not
 * @param {boolean} [config.propagate=false] allow to emit events to the parent component
 *
 * @fires module:stb/component~Component#click
 *
 * @example
 * var component = new Component({
 *     $node: document.getElementById(id),
 *     className: 'bootstrap responsive',
 *     events: {
 *         click: function () { ... }
 *     }
 * });
 * component.add( ... );
 * component.focus();
 */
function Component ( config ) {
    // current execution context
    var self = this,
        name;

    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.id        && typeof config.id !== 'string'         ) { throw new Error(__filename + ': wrong or empty config.id'); }
        if ( config.className && typeof config.className !== 'string'  ) { throw new Error(__filename + ': wrong or empty config.className'); }
        if ( config.$node     && !(config.$node instanceof Element)    ) { throw new Error(__filename + ': wrong config.$node type'); }
        if ( config.$body     && !(config.$body instanceof Element)    ) { throw new Error(__filename + ': wrong config.$body type'); }
        if ( config.parent    && !(config.parent instanceof Component) ) { throw new Error(__filename + ': wrong config.parent type'); }
        if ( config.children  && !Array.isArray(config.children)       ) { throw new Error(__filename + ': wrong config.children type'); }
    }

    /**
     * Component visibility state flag.
     *
     * @readonly
     * @type {boolean}
     */
    this.visible = true;

    /**
     * Component can accept focus or not.
     *
     * @type {boolean}
     */
    this.focusable = true;

    /**
     * DOM outer handle.
     *
     * @type {Element}
     */
    this.$node = null;

    /**
     * DOM inner handle.
     * In simple cases is the same as $node.
     *
     * @type {Element}
     */
    this.$body = null;

    /**
     * Link to the parent component which has this component as a child.
     *
     * @type {Component}
     */
    this.parent = null;

    /**
     * List of all children components.
     *
     * @type {Component[]}
     */
    this.children = [];

    /**
     * allow to emit events to the parent component
     *
     * @readonly
     * @type {boolean}
     */
    this.propagate = !!config.propagate;

    // parent constructor call
    Emitter.call(this, config.data);

    // outer handle - empty div in case nothing is given
    this.$node = config.$node || document.createElement('div');

    // inner handle - the same as outer handler in case nothing is given
    this.$body = config.$body || this.$node;

    // set CSS class names
    this.$node.className += ' component ' + (config.className || '');

    // apply component id if given, generate otherwise
    this.id = config.id || this.$node.id || 'cid' + counter++;

    // apply hierarchy
    if ( config.parent ) {
        // add to parent component
        config.parent.add(this);
    }

    // apply given visibility
    if ( config.visible === false ) {
        // default state is visible
        this.hide();
    }

    // apply focus handling method
    if ( config.focusable === false ) {
        // can't accept focus
        this.focusable = false;
    }

    // a descendant defined own events
    if ( this.defaultEvents ) {
        // sanitize
        config.events = config.events || {};

        if ( DEBUG ) {
            if ( typeof config.events !== 'object' ) { throw new Error(__filename + ': wrong config.events type'); }
            if ( typeof this.defaultEvents !== 'object' ) { throw new Error(__filename + ': wrong this.defaultEvents type'); }
        }

        for ( name in this.defaultEvents ) {
            // overwrite default events with user-defined
            config.events[name] = config.events[name] || this.defaultEvents[name];
        }
    }

    // apply given events
    if ( config.events ) {
        // apply
        this.addListeners(config.events);
    }

    // apply the given children components
    if ( config.children ) {
        // apply
        this.add.apply(this, config.children);
    }

    // component activation by mouse
    this.$node.addEventListener('click', function ( event ) {
        // left mouse button
        if ( event.button === 0 ) {
            // activate if possible
            self.focus();

            // there are some listeners
            if ( self.events['click'] ) {
                /**
                 * Mouse click event.
                 *
                 * @event module:stb/component~Component#click
                 *
                 * @type {Object}
                 * @property {Event} event click event data
                 */
                self.emit('click', {event: event});
            }
        }

        if ( DEBUG ) {
            // middle mouse button
            if ( event.button === 1 ) {
                debug.inspect(self, 0);
                debug.info('"window.link" or "' + self.id + '.component"', 'this component is now available in global scope');
                window.link = self;
                self.$node.classList.toggle('wired');
            }
        }

        event.stopPropagation();
    });

    if ( DEBUG ) {
        // expose inner ID to global scope
        window[self.id] = self.$node;

        // expose a link
        this.$node.component = this.$body.component = this;
        this.$node.title = 'component ' + this.constructor.name + '.' + this.id + ' (outer)';
        this.$body.title = 'component ' + this.constructor.name + '.' + this.id + ' (inner)';
    }
}


// inheritance
Component.prototype = Object.create(Emitter.prototype);
Component.prototype.constructor = Component;


/**
 * List of all default event callbacks.
 *
 * @type {Object.<string, function>}
 */
Component.prototype.defaultEvents = null;


/**
 * Add a new component as a child.
 *
 * @param {...Component} [child] variable number of elements to append
 *
 * @files Component#add
 *
 * @example
 * panel.add(
 *     new Button( ... ),
 *     new Button( ... )
 * );
 */
Component.prototype.add = function ( child ) {
    var i;

    // walk through all the given elements
    for ( i = 0; i < arguments.length; i++ ) {
        child = arguments[i];

        if ( DEBUG ) {
            if ( !(child instanceof Component) ) { throw new Error(__filename + ': wrong child type'); }
        }

        // apply
        this.children.push(child);
        child.parent = this;

        // correct DOM parent/child connection if necessary
        if ( child.$node && child.$node.parentNode === null ) {
            this.$body.appendChild(child.$node);
        }

        // there are some listeners
        if ( this.events['add'] ) {
            /**
             * A child component is added.
             *
             * @event module:stb/component~Component#add
             *
             * @type {Object}
             * @property {Component} item new component added
             */
            this.emit('add', {item: child});
        }

        debug.log('component ' + this.constructor.name + '.' + this.id + ' new child: ' + child.constructor.name + '.' + child.id);
    }
};


/* @todo: consider activation in future */
///**
// * Insert component into the specific position.
// *
// * @param {Component} child component instance to insert
// * @param {number} index insertion position
// */
//Component.prototype.insert = function ( child, index ) {
//    var prevIndex = this.children.indexOf(child);
//
//    if ( DEBUG ) {
//        if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
//        if ( !(child instanceof Component) ) { throw new Error(__filename + ': wrong child type'); }
//    }
//
//    if ( prevIndex !== -1 ) {
//        this.children.splice(prevIndex, 1);
//        this.$body.removeChild(child.$node);
//    }
//
//    if ( index === this.children.length ) {
//        this.$body.appendChild(child.$node);
//    } else {
//        this.$body.insertBefore(child.$node, this.$body.children[index]);
//    }
//    this.children.splice(index, 0, child);
//
//    if ( !child.parent ) {
//        child.parent = this;
//    }
//};


/**
 * Delete this component and clear all associated events.
 *
 * @fires module:stb/component~Component#remove
 */
Component.prototype.remove = function () {
    // really inserted somewhere
    if ( this.parent ) {
        if ( DEBUG ) {
            if ( !(this.parent instanceof Component) ) { throw new Error(__filename + ': wrong this.parent type'); }
        }

        // active at the moment
        if ( router.current.activeComponent === this ) {
            this.blur();
            this.parent.focus();
        }
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
    }

    // remove all children
    this.children.forEach(function ( child ) {
        if ( DEBUG ) {
            if ( !(child instanceof Component) ) { throw new Error(__filename + ': wrong child type'); }
        }

        child.remove();
    });

    this.removeAllListeners();
    this.$node.parentNode.removeChild(this.$node);

    // there are some listeners
    if ( this.events['remove'] ) {
        /**
         * Delete this component.
         *
         * @event module:stb/component~Component#remove
         */
        this.emit('remove');
    }

    debug.log('component ' + this.constructor.name + '.' + this.id + ' remove', 'red');
};


/**
 * Activate the component.
 * Notify the owner-page and apply CSS class.
 *
 * @param {Object} [data] custom data which passed into handlers
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#focus
 */
Component.prototype.focus = function ( data ) {
    var activePage = router.current,
        activeItem = activePage.activeComponent;

    // this is a visual component on a page
    // not already focused and can accept focus
    if ( this.focusable && this !== activeItem ) {
        // notify the current active component
        if ( activeItem ) { activeItem.blur(); }

        /* eslint consistent-this: 0 */

        // apply
        activePage.activeComponent = activeItem = this;
        activeItem.$node.classList.add('focus');

        // there are some listeners
        if ( activeItem.events['focus'] ) {
            /**
             * Make this component focused.
             *
             * @event module:stb/component~Component#focus
             */
            activeItem.emit('focus', data);
        }

        debug.log('component ' + this.constructor.name + '.' + this.id + ' focus');

        return true;
    }

    // nothing was done
    return false;
};


/**
 * Remove focus.
 * Change page.activeComponent and notify subscribers.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#blur
 */
Component.prototype.blur = function () {
    var activePage = router.current,
        activeItem = activePage.activeComponent;

    // apply visuals anyway
    this.$node.classList.remove('focus');

    // this is the active component
    if ( this === activeItem ) {
        activePage.activeComponent = null;

        // there are some listeners
        if ( this.events['blur'] ) {
            /**
             * Remove focus from this component.
             *
             * @event module:stb/component~Component#blur
             */
            this.emit('blur');
        }

        debug.log('component ' + this.constructor.name + '.' + this.id + ' blur', 'grey');

        return true;
    }

    debug.log('component ' + this.constructor.name + '.' + this.id + ' attempt to blur without link to a page', 'red');

    // nothing was done
    return false;
};


/**
 * Make the component visible and notify subscribers.
 *
 * @param {Object} [data] custom data which passed into handlers
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#show
 */
Component.prototype.show = function ( data ) {
    // is it hidden
    if ( !this.visible ) {
        // correct style
        this.$node.classList.remove('hidden');
        // flag
        this.visible = true;

        // there are some listeners
        if ( this.events['show'] ) {
            /**
             * Make the component visible.
             *
             * @event module:stb/component~Component#show
             */
            this.emit('show', data);
        }

        return true;
    }

    // nothing was done
    return true;
};


/**
 * Make the component hidden and notify subscribers.
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/component~Component#hide
 */
Component.prototype.hide = function () {
    // is it visible
    if ( this.visible ) {
        // correct style
        this.$node.classList.add('hidden');
        // flag
        this.visible = false;

        // there are some listeners
        if ( this.events['hide'] ) {
            /**
             * Make the component hidden.
             *
             * @event module:stb/component~Component#hide
             */
            this.emit('hide');
        }

        return true;
    }

    // nothing was done
    return true;
};


if ( DEBUG ) {
    // expose to the global scope
    window.Component = Component;
}


// public
module.exports = Component;
