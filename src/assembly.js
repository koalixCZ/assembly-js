"use strict";

var fs = require("fs"),
	path = require("path"),
	parser = require("./assembly.parser"),
	reader = require("./assembly.reader"),
	uglify = require("./assembly.uglify"),
	widget = require("./assembly.widget"),
	config = require("./config.json");

/**
 * Writes a file.
 * @param {string} filename
 * @param {string} data
 * @param {function} callback
 */
function writeFile(filename, data, callback) {
	fs.writeFile(filename, data, "UTF-8", function (err) {
		if (err) {
			throw err;
		}
		callback();
	});
}

/**
 * Formats pat to the target directory.
 * @param {string} filename
 * @param {string} directory
 * @return {string}
 */
function pathToTargetDirectory(filename, directory) {
	return path.join(directory, filename);
}

/**
 * Updates path of source files.
 * @param {string} path
 * @param {Array.<string>} sources
 * @return {Array.<string>}
 */
function updateSourcePath(path, sources) {
	var array = [];

	sources.forEach(function (filename) {
		array.push(path + filename);
	});
	return array;
}

/**
 * Assembly JavaScript file from src attributes, uglify and invoke callback when finished.
 * @param {function} callback
 */
module.exports.assembly = function (callback) {
	var assembledJS = config.assembledJS,
		source = config.source,
		htmlFile = source.html,
		directory = source.directory,
		targetDirectory = config.targetDirectory;

	parser.parseHtmlAndReadScripts(htmlFile, function (sources) {
		reader.readScripts(updateSourcePath(directory, sources), function (sourceCode) {
			var compressed = uglify.uglify(sourceCode),
				assembledJSPath = pathToTargetDirectory(assembledJS, targetDirectory),
				sourceMapPath = pathToTargetDirectory(widget.getSourceMapName(), targetDirectory),
				waiting = 2,
				finish = function () {
					waiting -= 1;

					if (waiting === 0 && callback && typeof callback === "function") {
						callback();
					}
				};

			writeFile(assembledJSPath, compressed.code, finish);
			writeFile(sourceMapPath, compressed.sourceMap, finish);
		});
	});
};
