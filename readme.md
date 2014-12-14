STB single page application framework
=====================================

## Getting Started

Install `stb` globally:

```bash
npm install -g stb
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

Full list of available commands:

 Name              | Description
-------------------|-------------
 init              | initial creation of all necessary files and folders
 code-proxy        | proxy js code execution from a desktop browser to STB
 jade              | compile all HTML files from Jade sources
 jade:develop      | compile develop HTML files from Jade sources
 jade:release      | compile release HTML files from Jade sources
 img               | execute all the tasks to remove and copy all images
 img:clean         | remove all images
 img:clean:develop | remove develop images
 img:clean:release | remove release images
 img:develop       | remove and copy develop images
 img:release       | remove and copy release images
 less              | compile all Less files into a set of css files with maps
 less:develop      | compile develop Less files into a set of css files with maps
 less:release      | compile release Less files into a set of css files with maps
 lint              | analyse JavaScript code for potential errors and problems
 logger            | WebSocket server to translate log messages from STB to a desktop console
 serve             | main entry point - rebuild everything, start all watchers and servers
 static            | serve files in the build directory
 webpack           | compile all CommonJS modules into a single js file
 webpack:develop   | compile develop version of all CommonJS modules into a single js file
 webpack:release   | compile release version of all CommonJS modules into a single js file
 weinre            | WEb INspector REmote debugger server


## Contribution

If you have any problem or suggestion please open an issue [here](https://github.com/DarkPark/stb/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs) and included [ESLint](http://eslint.org/) rules.


## License

`stb` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
