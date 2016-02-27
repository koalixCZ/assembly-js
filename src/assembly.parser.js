"use strict";

var htmlParser = require("htmlparser2"),
	fs = require("fs");

/**
 * Returns true when file or directory has to be excluded.
 * @param {string} state
 * @returns {boolean}
 */
function isExcluded(state) {
	return !state ? false : state.toLowerCase() === "true";
}

/**
 * Returns reader of script tags.
 * @param {function(string)} appendScriptCallback
 * @return {object}
 */
function getScriptTagReader(appendScriptCallback) {
	return {
		onopentag: function (name, attrs) {
			var isNotExcluded,
				src;

			if (name === "script" && attrs.type === "text/javascript") {
				isNotExcluded = !isExcluded(attrs["data-excluded"]);
				src = attrs.src;

				if (isNotExcluded && src) {
					appendScriptCallback(src);
				}
			}
		}
	};
}

/**
 * Returns an instance of the parser.
 * @param {function(string)} callback
 * @return {htmlParser.Parser}
 */
function getHtmlParser(callback) {
	return new htmlParser.Parser(getScriptTagReader(callback));
}

/**
 * @param {string} filename
 * @param {function(string)} callback
 */
function readSourceHtml(filename, callback) {
	fs.readFile(filename, {encoding: "UTF-8", flag: "r"}, callback);
}

/**
 * Parses the given html file and returns an array of scripts' elements sources in to the callback function.
 * @param {string} htmlFile
 * @param {function(Array.<string>)} callback
 */
module.exports.parseHtmlAndReadScripts = function (htmlFile, callback) {
	readSourceHtml(htmlFile, function (html) {
		var parser,
			scripts = [],
			appendScript = function (fileName) {
				scripts.push(fileName);
			};

		parser = getHtmlParser(appendScript);
		parser.write(html);
		parser.end();

		callback(scripts);
	});
};
