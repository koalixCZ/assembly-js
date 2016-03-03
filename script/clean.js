"use strict";

var fs = require("fs");

/**
 * Removes the directory.
 * @param {string} path
 * @param {function} callback
 */
function removeDirectory(path, callback) {
	fs.readdir(path, function (error, files) {
		var wait = files.length,
			count = 0,
			done = function (err) {
				count += 1;
				if (count >= wait || err) {
					fs.rmdir(path, callback);
				}
			};

		if (error) {
			callback(error, []);
			return;
		}
		if (!wait) {
			done();
			return;
		}

		path = path.replace(/\/+$/, "");
		files.forEach(function (file) {
			var currentPath = path + "/" + file;

			fs.lstat(currentPath, function (err, stats) {
				if (err) {
					callback(err, []);
					return;
				}
				if (stats.isDirectory()) {
					removeDirectory(currentPath, done);
				} else {
					fs.unlink(currentPath, done);
				}
			});
		});
	});
}

module.exports.removeDirectory = removeDirectory;
