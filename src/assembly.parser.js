"use strict";

var htmlParser = require("htmlparser2"),
	fs = require("fs");

/**
 * Returns true when string ends with the suffix.
 * @param {string} str
 * @param {string} suffix
 * @return {boolean}
 */
function endsWith(str, suffix) {
	return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Returns true when file or directory has to be excluded.
 * @param {string} state
 * @returns {boolean}
 */
function isExcluded(state) {
	return state && state.toLowerCase() === "true";
}

/**
 * Returns true if the script is
 * @param {string} type
 * @param {string} src
 * @return {boolean}
 */
function isJavaScript(type, src) {
	return type === "text/javascript" && src || endsWith(src, ".js");
}

/**
 * Returns reader of script tags.
 * @param {function(string)} appendScriptCallback
 * @return {object}
 */
function getScriptTagReader(appendScriptCallback) {
	return {
		onopentag: function (name, attributes) {
			var src = attributes.src,
				excluded = isExcluded(attributes["data-excluded"]),
				javaScript = isJavaScript(attributes.type, attributes.src);

			if (name === "script" && javaScript && !excluded) {
				appendScriptCallback(src);
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
	fs.readFile(filename, {encoding: "UTF-8", flag: "r"}, function (err, data) {
		if (err) {
			throw err;
		}
		callback(data);
	});
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
			appendScript = function (filename) {
				scripts.push(filename);
			};

		parser = getHtmlParser(appendScript);
		parser.write(html);
		parser.end();

		callback(scripts);
	});
};
