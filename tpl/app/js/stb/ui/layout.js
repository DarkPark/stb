/**
 * @module stb/ui/layout
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
    keys      = require('../keys');


/**
 * Layout component implementation
 *
 * @constructor
 * @extends Component
 *
 * @param {Object}   [config={}]          init parameters (all inherited from the parent)
 * @param {Array} [config.data] array of items to add to layout
 *
 * @example
 * var Layout = require ('../stb/ui/layout'),
 *     layout = new Layout({
 *         data:[
 *             'Some text'
 *             {
 *                 className: 'icon star',
 *             },
 *             {
 *                 value: new Input()
 *             },
 *             new Button({'value:'Ok'})
 *             ]
 *         });
 */
function Layout ( config ) {

    /**
     * Index of focused child component
     * @type {number}
     */
    this.focusIndex = 0;

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
    }

    config.className = 'layout ' + (config.className || '');

    Component.call(this, config);

    this.init(config);

    // add listener to move focus between children
    this.addListener('keydown', function ( event ) {
        switch ( event.code ) {
            case keys.right:
                if ( this.children.length && this.focusIndex < this.children.length - 1 ) {
                    this.children[++this.focusIndex].focus();
                }
                break;
            case keys.left:
                if ( this.children.length && this.focusIndex > 0 ) {
                    this.children[--this.focusIndex].focus();
                }
                break;
            case keys.back:
                // focus parent
                this.parent.focus();

                // focus parent focused item if parent is layout list
                if ( this.parent &&  this.$parentItem ) {
                    this.parent.focusItem(this.$parentItem);
                }
                break;
        }
    });

}


Layout.prototype = Object.create(Component.prototype);
Layout.prototype.constructor = Layout;


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
Layout.prototype.init = function ( config ) {
    var self = this,
        data = normalize(config.data),
        item, $wrapper, i;

    // clear element if reinit
    while (this.$node.firstChild) {
        this.$node.removeChild(this.$node.firstChild);
    }

    for ( i = 0; i < data.length; i++ ) {
        item = data[i];
        // plain text
        if ( typeof item.value === 'string' ) {
            $wrapper = document.createElement('div');
            $wrapper.textContent = item.value;
            if ( item.className ) { $wrapper.className = item.className; }
            this.$node.appendChild($wrapper);
        } else if ( item.value instanceof HTMLElement ) {
            // HTML Element

            // if with wrapper
            if ( item.wrap ) {
                $wrapper = document.createElement('div');
                if ( item.className ) { $wrapper.className = item.className; }
                $wrapper.appendChild(item.value);
                this.$node.appendChild($wrapper);
            } else {
                // without wrapper
                this.$node.appendChild(item.value);
            }
        } else if ( item.value instanceof Component ) {
            // component
            // force propagate events
            item.value.propagate = true;

            // set index to current component
            item.value.index = this.children.length;

            // change layout focus index if click component
            item.value.addListener('click', function () {
                self.focusIndex = this.index;
            });

            // append component
            if ( item.wrap ) {
                // with wrapper
                $wrapper = document.createElement('div');
                if ( item.className ) { $wrapper.className = item.className; }
                $wrapper.appendChild(item.value.$node);
                this.$node.appendChild($wrapper);
                this.children.push(item.value);
                item.value.parent = this;
            } else {
                // without wrapper
                this.add(item.value);
            }
        }
    }
};


/**
 * Make all the data items identical.
 * Wrap to objects if necessary.
 *
 * @param {Array} data incoming array
 * @return {Array} reworked incoming data
 */
function normalize ( data ) {
    var i, item;

    if ( DEBUG ) {
        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
        if ( !Array.isArray(data) ) { throw new Error(__filename + ': wrong data type'); }
    }

    // rows
    for ( i = 0; i < data.length; i++ ) {
        // cell value
        item = data[i];
        // plain text
        if ( typeof item !== 'object' ) {
            // wrap with defaults
            data[i] = {
                value: data[i],
                wrap : true
            };
        } else {
            // HTML element or component
            if ( item instanceof Component || item instanceof HTMLElement ) {
                data[i] = {
                    value: item,
                    wrap : false
                };
            } else {
                data[i].wrap = true;
            }
        }
    }
    return data;
}


module.exports = Layout;
