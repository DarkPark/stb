STB framework command-line tools
================================

## Getting Started

Install `stb-cli` globally:

```bash
npm install -g stb-cli
```

## Usage

Create a new folder for your project:

```bash
mkdir myapp
```

Run the generator from within the new folder:

```bash
cd myapp
stb-cli init
```

Available commands:

 Name              | Description
-------------------|-------------
 init              | initial creation of all necessary files and folders
 img               | execute all the tasks to remove and copy all images
 img:clean         | remove all images
 img:clean:develop | remove develop images
 img:clean:release | remove release images
 img:develop       | remove and copy develop images
 img:release       | remove and copy release images
 lint              | analyse JavaScript code for potential errors and problems


## Contributing

See the [CONTRIBUTING Guidelines](https://...)


## Support
If you have any problem or suggestion please open an issue [here](https://.../issues).


## License
