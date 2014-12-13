STB framework command-line tools
================================

## Getting Started

Install `stb-cli` globally:

```bash
npm install -g stb-cli
```

## Usage

Create a new folder for your project and move to it:

```bash
mkdir myapp
cd myapp
```

Run the generator from within the new folder:

```bash
stb-cli init
```

This will create all necessary files and folders (with smart conflict resolution mechanism
in case there are already some files in the current directory) and install all necessary package dependencies.

To start working with a project it's necessary to make initial build and start all servers:

```bash
stb-cli serve
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
 lint              | analyse JavaScript code for potential errors and problems
 logger            | WebSocket server to translate log messages from STB to a desktop console
 serve             | main entry point - rebuild everything, start all watchers and servers
 static            | serve files in the build directory
 weinre            | WEb INspector REmote debugger server


## Contribution

If you have any problem or suggestion please open an issue [here](https://github.com/DarkPark/stb-cli/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs) and included [ESLint](http://eslint.org/) rules.


## License

`stb-cli` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
