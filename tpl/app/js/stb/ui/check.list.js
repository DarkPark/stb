/**
 *
 * @author Aleynikov Boris <alynikov.boris@gmail.com>.
 */

'use strict';

var List = require('../ui/list'),
    CheckBox = require('../ui/check.box');


/**
 * Base check list implementation
 *
 * @constructor
 * @extends List
 *
 * @param {Object}   [config={}]          init parameters (all inherited from the parent)
 *
 * @example
 * new CheckList({
 *    focusIndex:0,
 *    data:[
 *        {state:false, title:'Some title', value:'string'},
 *        {state:true, title:'Some title 1', value:'number'},
 *        {state:false, title:'Some title 2', value:'object'}
 *    ]
 * })
 */
function CheckList ( config ) {

    config.className = config.className || '' + ' checkList';

    List.call(this, config);

    this.addListener('click:item', function ( event ) {
        var item = event.$item;

        item.checkBox.set(!item.checkBox.value);
        item.state = item.checkBox.value;

    });

}


CheckList.prototype = Object.create(List.prototype);
CheckList.prototype.constructor = CheckList;

/**
 * Default render function
 *
 * @param {Element} $item in list
 * @param {array} data to render layout element
 * @param {string} [data.title] title of checkbox
 * @param {boolean} [data.state] state of checkbox: checked or not
 * @param {string} [data.value] special value of item
 */
CheckList.prototype.renderItemDefault = function ( $item, data ) {
    var table = document.createElement('table'),
        tr = document.createElement('tr'),
        td = document.createElement('td'),
        check = new CheckBox({
            value: data.state || false
        });

    $item.innerHTML = '';

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

CheckList.prototype.renderItem = CheckList.prototype.renderItemDefault;


module.exports = CheckList;

