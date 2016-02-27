"use strict";

var reader = require("../src/assembly.reader");

describe("Read source file", function () {

	it("returns one source code", function (done) {
		var sourceFiles = [
				"spec/sample/1.js",
				"spec/sample/2.js"
			],
			expectedResult = "var a = 1;\nvar b = 2;";

		reader.readScripts(sourceFiles, function (code) {
			expect(code).toEqual(expectedResult);
			done();
		});
	});

	it("returns and empty when there is no source file", function (done) {
		reader.readScripts([], function (code) {
			expect(code).toEqual("");
			done();
		});
	});
});
