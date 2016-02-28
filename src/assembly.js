"use strict";

var UglifyJS = require("uglify-js"),
	fs = require("fs"),
	parser = require("./assembly.parser"),
	reader = require("./assembly.reader"),
	rectify = require("./assembly.rectify.js"),
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
		htmlFile = config.sourceHtml,
		directory = config.directory;

	parser.parseHtmlAndReadScripts(htmlFile, function (sources) {
		reader.readScripts(updateSourcePath(directory, sources), function (sourceCode) {
			writeFile(assembledJS, sourceCode, callback);
		});
	});
};
