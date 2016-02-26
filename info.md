Information for magsdk applications
===================================


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

