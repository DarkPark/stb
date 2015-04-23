STB single page application framework
=====================================

[![NPM version](https://img.shields.io/npm/v/stb.svg?style=flat-square)](https://www.npmjs.com/package/stb)
[![Dependencies Status](https://img.shields.io/david/darkpark/stb.svg?style=flat-square)](https://david-dm.org/darkpark/stb)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/stb)

Provides development environment and base components in a form of [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) modules
for [set-top box](http://en.wikipedia.org/wiki/Set-top_box) software production.

This framework is targeted on the client side and requires a building stage with [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/).


## Getting Started

[Node.js](http://nodejs.org/) and [NPM](https://www.npmjs.com/) should be installed beforehand.
Please follow the official [instruction](http://nodejs.org/download/).

`stb` is available as an [npm package](https://www.npmjs.org/package/stb) and should be installed globally:

```bash
npm install -g stb
```

In Linux this can be done as a root:

```bash
sudo npm install -g stb
```


## Usage

Create a new folder for your project and move to it:

```bash
mkdir myapp
cd myapp
```

Run the generator from within the new folder:

```bash
stb init
```

This will create all necessary files and folders (with smart conflict resolution mechanism
in case there are already some files in the current directory) and install all necessary package dependencies.

To start working with a project it's necessary to make initial build and start all servers:

```bash
stb serve
```

General way of usage:

```bash
stb <command> [options]
```

**Full list of available commands:**

 Name    | Description
---------|-------------
 doc     | open STB documentation in the default web browser
 init    | initial creation of all necessary files and folders
 serve   | main entry point - rebuild everything, start all watchers and servers
 develop | run all development tasks
 release | run all production tasks
 lint    | analyse JavaScript code for potential errors and problems
 static  | serve files in the build directory
 proxy   | proxy js code execution from a desktop browser to STB
 logger  | WebSocket server to translate log messages from STB to a desktop console
 weinre  | WEb INspector REmote debugger server
 img     | execute all the tasks to remove and copy all images
 jade    | compile all HTML files from Jade sources
 less    | compile all Less files into a set of css files with maps
 webpack | compile all CommonJS modules into a single js file


After the `stb serve` command the [start page](http://localhost:8000/) should open in the default browser.
This page should be accessible remotely on the STB device via <http://external_ip_address:8000/> address.

It's possible to suppress a browser opening with

```bash
stb serve --no-open
```

In case remote access to STB device is enabled and configured in application `./config/ssh.js` it's possible to activate one of the profiles:

```bash
stb serve --ssh [profile_name]
```

where `profile_name` is one of the following:

 Name              | Description
-------------------|-------------
 root              | open index file in the root of the started HTTP server
 develop (default) | open debug develop build
 release           | open final release build

For example command `stb serve --ssh` will build and serve as usual but also connect to the STB device by SSH protocol and starts there a web browser with the debug version of application.

It's also possible to customize some commands execution with additional flags e.g. `--clean`, `--develop`, `--release` and so on.
Full list of available options can be provided by the `stb` application:

```bash
stb --help
stb <command> --help
```


At runtime the development mode has a set of useful function available via keyboard shortcuts:

 Keys     | Description
----------|-------------
 Numpad . | reload the page CSS
 Numpad 0 | reload the page in the current resolution
 Numpad 1 | reload the page in NTSC
 Numpad 2 | reload the page in PAL
 Numpad 3 | reload the page in 720p
 Numpad 4 | reload the page in 1080p
 Numpad 5 | draw debug grid with indicators
 Numpad 6 | stress-testing based on gremlins.js for the emulation mode
 Numpad 7 | SpyJS tracing/debugging/profiling activation and deactivation
 Numpad 8 | FireBug Lite console activation


Illustrations of most approaches and components can be found in the [demo application](https://github.com/DarkPark/stb-demo).

Help files generated from JSDocs comments in framework modules are available [online](http://darkpark.github.io/stb/).

## Structure

 Path   | Description
--------|-------------
 app    | contains all framework JavaScript modules and associated Less files
 bin    | main command-line script available globally
 config | base config files for all servers
 lib    | modules required to framework work
 tasks  | gulp tasks to provide all the functionality
 test   | QUnit tests files (units and static)
 tpl    | a new application directory structure and base files


## Technologies

* [Node.js](http://nodejs.org/)
* [Gulp](http://gulpjs.com/)
* [Webpack](http://webpack.github.io/)
* [UglifyJs](http://lisperator.net/uglifyjs/)
* [Jade](http://jade-lang.com/)
* [Qunit](http://qunitjs.com/)
* [Less](http://lesscss.org/)
* [ESLint](http://eslint.org/)
* [weinre](https://www.npmjs.org/package/weinre/)
* [code-proxy](https://github.com/DarkPark/code-proxy/)
* [gremlins.js](https://github.com/marmelab/gremlins.js)


## Contribution

If you have any problem or suggestion please open an issue [here](https://github.com/DarkPark/stb/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs) and included [ESLint](http://eslint.org/) rules.


## License

`stb` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
