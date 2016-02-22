/**
 * @module stb/ui/radio.list
 * @author Aleynikov Boris <alynikov.boris@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var List = require('../ui/list'),
    CheckBox = require('../ui/check.box'),
    counter = 0;


/**
 * Base radio list implementation
 *
 * @constructor
 * @extends List
 *
 * @param {Object}   [config={}]          init parameters (all inherited from the parent)
 *
 * @example
 * var RadioList = require('../stb/ui/radio.list'),
 *     rList = new RadioList({
 *         focusIndex:0,
 *         data:[
 *            {state:false, title:'Some title', value:'string'},
 *            {state:true, title:'Some title 1', value:'number'},
 *            {state:false, title:'Some title 2', value:'object'}
 *         ]
 *     });
 */
function RadioList ( config ) {

    /**
     * Checkbox group name
     *
     * @type {string}
     */
    this.group = 'group ' +  counter++;

    /**
     * Link to checked item
     *
     * @type {Element}
     */
    this.$checked = null;

    config.className = config.className || '' + ' radioList';

    List.call(this, config);

    this.addListener('click:item', function ( event ) {
        var item = event.$item;

        item.checkBox.set(!item.checkBox.value);
        item.state = item.checkBox.value;
    });

}


RadioList.prototype = Object.create(List.prototype);
RadioList.prototype.constructor = RadioList;

RadioList.prototype.group = 0;

/**
 * Default render function
 *
 * @param {Element} $item in list
 * @param {array} data to render layout element
 * @param {string} [data.title] title of checkbox
 * @param {boolean} [data.state] state of checkbox: checked or not
 * @param {string} [data.value] special value of item
 */
RadioList.prototype.renderItemDefault = function ( $item, data ) {
    var table = document.createElement('table'),
        tr = document.createElement('tr'),
        td = document.createElement('td'),
        check = new CheckBox({
            group: this.group
        });

    $item.innerHTML = '';

    // set state with set function to prevent multiple true values
    if ( data.state ) {
        check.set(true);
        // set link to checked item
        this.$checked = $item;
    }

    table.appendChild(tr);

    td.appendChild(check.$node);
    td.className = 'checkBoxWrapper';
    tr.appendChild(td);

    td = document.createElement('td');
    td.className = 'title';
    td.innerText = data.title || '';
    tr.appendChild(td);

    $item.checkBox = check;

    $item.state = check.value;
    $item.value = data.value;


    $item.appendChild(table);

};


RadioList.prototype.renderItem = RadioList.prototype.renderItemDefault;


module.exports = RadioList;

