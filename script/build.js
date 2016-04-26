"use strict";

var fsx = require("fs-extra"),
	assembly = require("../src/assembly"),
	config = require("../src/config.json");

(function () {
	fsx.emptyDir(config.targetDirectory, function (err) {
		var arrayOfSources;

		if (err) {
			throw err;
		}

		arrayOfSources = [
			"assembly.parser.js",
			"assembly.reader.js",
			"assembly.widget.js",
			"assembly.uglify.js",
			"assembly.js"
		];

		assembly.assemblyFromArrayOfSources(arrayOfSources, function () {
			console.log("Ready");
		});
	});
}());
