# Assembly-js
## What is is?
It's a set of scripts for assembly of one JavaScript file from many files mentioned in a html file.
## How it can be useful for me?
If you don't use any kind of dependency loading in your project and all your source files are 
mentioned in one html file, you will probably have:

	1. similar script
	2. problem and yet another list of source files
	
##How it works?
The script reads source files from an html file and puts them together. The result file is minified via 
[UglifyJS2](https://github.com/mishoo/UglifyJS2). If you need to skip a source file, simply add 
```data-excluded="true"``` attribute to the corresponding script element. 
 
##How to configure
All parameters are stored in the src/config.json.

* **assembledJS** - the result JS file name
* **targetDirectory** - a directory where the assembled JS file and a source map file will be saved
* **source.html** - an html file with mentioned sources
* **source.directory** - a relative path of source files to the html file

##How to run?
You can run the script from the command line: 

> node ./src/assembly

## What next?
If you have a problem, write me.
