'use strict';

var Component = require('../component'),
    setTime,
    timerId;


function Clock ( config ) {
    var body = document.createElement('div');

    // sanitize
    config = config || {};

    // can't accept focus
    config.focusable = false;
    // set default className if classList property empty or undefined
    config.className = 'clock ' + (config.className || '');
    // hide by default
    config.visible = config.visible || true;

    // parent constructor call
    Component.call(this, config);

    setTime = function () {
        var time  = new Date(),
            year  = time.getFullYear(),
            month = time.getMonth() + 1,
            date  = time.getDate(),
            hours = time.getHours(),
            mins  = time.getMinutes();

        body.innerText = (hours > 9 ? hours : '0' + hours) + ':' + (mins > 9 ? mins : '0' + mins);
    };

    setTime();
    timerId = setInterval(setTime, 1000);

    this.$node.appendChild(body);
}


core.addListeners({
    hide: function () {
        clearInterval(timerId);
    },
    'hide:auto': function () {
        clearInterval(timerId);
    },
    maximize: function () {
        setTime();
        timerId = setInterval(setTime, 1000);
    }
});


Clock.prototype = Object.create(Component.prototype);
Clock.prototype.constructor = Clock;

module.exports = Clock;
