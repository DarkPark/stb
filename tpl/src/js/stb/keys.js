/**
 * Global list of non-printable control key codes.
 *
 * WARNING!!! All codes in this file (exclude 'volumeUp', 'volumeDown')
 * uses in window 'keydown' handler to prevent wrong 'keypress' firings.
 * If u add code into this file, 'keypress' event with this code will never fires.
 *
 *  Value | Description
 * -------|-------------
 *  +1000 | shift key pressed
 *  +2000 | alt key pressed
 *
 * @module stb/keys
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint quote-props: 0 */

// public
module.exports = {
    num1        : 101,
    num2        : 98,
    num3        : 6,
    num4        : 8,
    num5        : 9,
    num6        : 10,
    num7        : 12,
    num8        : 13,
    num9        : 14,
    num0        : 17,
    preCh        : 259,

    volumeUp     : 7,
    volumeDown   : 11,
    channelPrev  : 68,
    channelNext  : 65,
    mute         : 27,
    channelList  : 84,
    menu         : 262,

    tools        : 75,
    info         : 31,
    back         : 88,
    'return'     : 88,    //alias
    exit         : 45,
    up           : 29460,
    down         : 29461,
    left         : 4,
    right        : 5,
    ok           : 29443,
    enter        : 29443, //alias

    f1           : 108,
    f2           : 20,
    f3           : 21,
    f4           : 22,
    red          : 108,   // alias
    green        : 20,    // alias
    blue         : 21,    // alias
    yellow       : 22,    // alias
    a            : 108,   // alias
    b            : 20,    // alias
    c            : 21,    // alias
    d            : 22,    // alias

    rewind       : 69,
    forward      : 72,
    play         : 71,
    pause        : 74,
    stop         : 70,
    record       : 192,

    power        : 76
};
