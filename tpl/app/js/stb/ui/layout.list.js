/**
 *
 * @author Aleynikov Boris <alynikov.boris@gmail.com>.
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
 *
 * list = new LayoutList({
 *     propagate: true,
 *     size: 7,
 *     focusIndex: 0,
 *     data: [
 *         [
 *             {
 *                 className: 'star'
 *             },
 *             'Some text'
 *         ],
 *         ['Hello world',
 *             {
 *                 value: 'hi',
 *                 className: 'status'
 *             },
 *             'text',
 *             'label'
 *
 *         ],
 *         [
 *             {
 *                 className: 'big',
 *                 value: ' Some'
 *             },
 *             {
 *                 value: new Input()
 *             }
 *         ],
 *         [
 *             new Button({value: 'Ok'}),
 *             new Button({value: 'Cancel'}),
 *             new Button({value: 'Exit'})
 *
 *         ]
 *     ]
 * })
 */
function LayoutList ( config ) {
    var self = this;

    config.className = config.className || '' + ' layoutList';

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
LayoutList.prototype.renderItemDefault = function ( $item, data ) {
    var layout;

    layout = new Layout({
        focusable:false,
        data:data
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

};


LayoutList.prototype.renderItem = LayoutList.prototype.renderItemDefault;


module.exports = LayoutList;
