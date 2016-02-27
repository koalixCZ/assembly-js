"use strict";

var parser = require("../src/assembly.parser");

describe("Parsing of HTML file", function () {
	it("returns an array of sources from script elements", function (done) {
		parser.parseHtmlAndReadScripts("spec/sample/index.html", function (scripts) {
			expect(scripts).toEqual(["1.js", "2.js", "3.js", "4.js", "5.js"]);
			done();
		});
	});
});
