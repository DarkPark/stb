Information for magsdk applications
===================================

## App configuration (package.json)

Each app must have package.json in the root.
Each app must be one of the available types (config.type):

 Name    | Description
---------|-------------
 app     | applications with limited access
 system  | system application with advanced access rights
 theme   | system theme
 core    | system core


package.json app example:

```json
{
    "name": "youtube.com",
    "description": "2015.05.26",
    "version": "1.5.6",
    "config": {
        "type": "app",
        "category": "media",
        "backgroundColor": "#c12226",
        "icons": {
            "paths": {
                "480": "img/480/",
                "576": "img/576/",
                "720": "img/720/",
                "1080": "img/1080/"
            },
            "states": {
                "normal": "normal.png",
                "active": "active.png"
            }
        },
        "permissions": [
            "storage.fs",
            "network.smb",
            "network.nfs",
            "network.upnp"
        ]
    }
}
```


## Core API

Each app have global object 'core' i.e. window.core

This object contains special methods:

 Name        | Description
-------------|-------------
 call        | create 'intent' to core with parameters
 addListener | add event listener handler (inherited from Emitter)

Examples:

```
/**
 * Invoked when task is finished.
 *
 * @param {boolean} error operation error status
 * @param {boolean} [result] operation result
 *
 */
var callback = function ( error, result ) {
    if ( !error ) {
       // success
    }

    console.log(result);
}

core.call('show', null, callback);  // app try to show yourself
core.call('hide', null, callback);  // app try to hide yourself
core.call('exit', null, callback); // app try to close yourself
core.call('player.play', {uri: '...', loop: false}, callback); // try to start playback
```

## App advanced features

Advanced features which are available in stb/app.js (ONLY for this branch!)

Methods:

 Name    | Description
---------|-------------
 show    | show app, call it when app is ready to show
 hide    | hide app
 exit    | close app


Examples:

```
var app = require('./stb/app');
app.show();

setTimeout(function () {
   app.hide();
}, 5000);

setTimeout(function () {
   app.exit();
}, 50000);
```

Events:

 Name    | Description
---------|-------------
 show    | called before app will show
 hide    | called before app will hide
 exit    | called before app will exit

Examples:

```
var app = require('./stb/app');
app.addListener('show', function () {
   // maybe need update view
});

app.addListener('hide', function () {
    // maybe need save app state
});

app.addListener('exit', function () {
    // maybe need save app state
});
```
