/**
 * @module stb/ui/layout.list
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var List = require('./list'),
    Layout = require('./layout');

/**
 *  Layout list contains array of layout components
 *
 * @constructor
 * @extends List
 *
 * @param {object} config object
 *
 *
 * @example
 * var CheckList = require('../stb/ui/layout.list'),
 *     list = new LayoutList({
 *         propagate: true,
 *         size: 7,
 *         focusIndex: 0,
 *         data: [
 *             {
 *             data: [
 *                 {
 *                     data: [
 *                         {
 *                             className: 'star'
 *                         },
 *                         'Some text'
 *                     ],
 *                     click: function () {
 *                         // do something
 *                     }
 *                 },
 *                 {
 *                     data: [
 *                         'Hello world',
 *                         {
 *                             value: 'hi',
 *                             className: 'status'
 *                         }
 *                     ],
 *                     click: someHandler
 *                 },
 *                 {
 *                     data: [
 *                         {
 *                             className: 'big',
 *                             value: ' Some'
 *                         },
 *                         {
 *                             value: new Input()
 *                         }
 *                     ]
 *                 },
 *                 {
 *                     data: [
 *                         new Button({value: 'Ok'}),
 *                         new Button({value: 'Cancel'}),
 *                         new Button({value: 'Exit'})
 *                     ]
 *                 }
 *             ]
 * });
 */
function LayoutList ( config ) {
    var self = this;

    /**
     * Elements handlers
     */
    this.handlers = {};

    config.className = 'layoutList ' + (config.className || '');

    config.propagate = config.propagate || true;

    List.call(this, config);

    // add handler to focus inner layout
    this.addListener('click:item', function ( event ) {
        // focus inner layout of item
        if ( event.$item.layout.children.length && !event.inner ) {
            event.$item.layout.children[event.$item.layout.focusIndex].focus();
        }

        // only focus item if we click mouse
        if ( event.inner ) {
            self.focus();
            self.focusItem(event.$item);
        }
        // do click callback if it present
        if ( self.handlers[event.$item.index] ) {
            self.handlers[event.$item.index]();
        }
    });
}


LayoutList.prototype = Object.create(List.prototype);
LayoutList.prototype.constructor = LayoutList;


/**
 * Default render function
 *
 * @param {Element} $item in list
 * @param {array} data to render layout element
 */
LayoutList.prototype.renderItemDefault = function ( $item, config ) {
    var layout;

    $item.innerHTML = '';

    layout = new Layout({
        focusable:false,
        data:config.data
    });

    $item.appendChild(layout.$node);
    $item.layout = layout;
    layout.parent = this;
    layout.$parentItem = $item;

    // focus layoutList if click on layout
    layout.addListener('click', function () {
        // add inner property to set that event comes from inner component
        this.parent.emit('click:item', {$item:$item, inner:true});
    });

    if ( config.click ) {
        this.handlers[$item.index] = config.click;
    }

};


LayoutList.prototype.renderItem = LayoutList.prototype.renderItemDefault;


module.exports = LayoutList;
