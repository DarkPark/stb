'use strict';

var Component = require('../stb/component');

function Clock ( config ) {
    // sanitize
    config = config || {};

    // can't accept focus
    config.focusable = false;
    // set default className if classList property empty or undefined
    config.className = 'clock ' + (config.className || '');
    // hide by default
    config.visible = config.visible || true;
    // create centered div
    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    var elem = document.createElement('div');
    // insert bar line

    function setTime () {
        var time  = new Date(),
            year  = time.getFullYear(),
            month = time.getMonth() + 1,
            date  = time.getDate(),
            hours = time.getHours(),
            mins  = time.getMinutes();

        elem.textContent = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins);
        //pmDate.innerText = (date > 9 ? date : '0' + date) + '.' + (month > 9 ? month : '0' + month) + '.' + year;
    }

    setTime();
    setInterval(setTime, 1000);

    this.$node.appendChild(elem);
}

// inheritance
Clock.prototype = Object.create(Component.prototype);
Clock.prototype.constructor = Clock;

module.exports = Clock;
