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
 * @param {string} directory
 * @param {Array.<string>} sources
 * @return {Array.<string>}
 */
function updateSourcePath(directory, sources) {
	var array = [];

	sources.forEach(function (filename) {
		array.push(path.join(directory, filename));
	});
	return array;
}

/**
 * Assembly JavaScript from an array of source files.
 * @param {Array.<string>} sources
 * @param {function} callback
 */
function assembly(sources, callback) {
	var assembledJS = config.assembledJS,
		source = config.source,
		directory = source.directory,
		targetDirectory = config.targetDirectory;

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
}

/**
 * Assembly JavaScript file from src attributes, uglify and invoke callback when finished.
 * @param {function} callback
 */
module.exports.assemblyFromHtml = function (callback) {
	parser.parseHtmlAndReadScripts(config.source.html, function (sources) {
		assembly(sources, callback);
	});
};

/**
 * Assembly JavaScript file from an array of source files.
 * @param {Array.<string>} sources
 * @param {function} callback
 */
module.exports.assemblyFromArrayOfSources = function (sources, callback) {
	assembly(sources, callback);
};
