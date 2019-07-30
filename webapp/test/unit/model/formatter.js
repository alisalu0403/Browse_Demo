/*global QUnit*/

sap.ui.define([
	"sap/ui/demo/bulletinboard/model/formatter"
], function (formatter) {
	"use strict";

	QUnit.module("Number unit");
	
	// unit test of deliveryState
	function deliveryStateTestCase(assert, sRequiredDate, sShippedDate, fExpectedResult){
		//var sRequiredDateTime = new Date(sRequiredDate).getTime();
		//var sShippedDateTime = new Date(sShippedDate).getTime();
		//var fResult = formatter.deliveryState(sRequiredDateTime, sShippedDateTime);
		var fResult = formatter.deliveryState(sRequiredDate, sShippedDate);
		assert.strictEqual(fResult, fExpectedResult, "The calculation of delivery state was correct");
	}
	
	QUnit.test("Should print success when the require date is lager than 7 days comparing the ship date", function(assert){
		
		deliveryStateTestCase.call(this, assert, new Date("7/30/2019").getTime(), new Date("7/1/2019").getTime(), "Success");
	});
	
	QUnit.test("Should print Warning when the require date is less than 7 days but larger than 0 days comparing the ship date", function(assert){
		
		deliveryStateTestCase.call(this, assert, new Date("7/30/2019").getTime(), new Date("7/26/2019").getTime(), "Warning");
	});
	
	QUnit.test("Should print Error when the require date is less than 0 days comparing the ship date", function(assert){
		
		deliveryStateTestCase.call(this, assert, new Date("7/30/2019").getTime(), new Date("8/1/2019").getTime(), "Error");
	});
	
	QUnit.test("Should print None when the the ship date is null", function(assert){
		
		deliveryStateTestCase.call(this, assert, new Date("7/30/2019").getTime(), null, "None");
	});



	// unit test of deliveryText
	function deliveryTextTestCase(assert, sRequiredDate, sShippedDate, fExpectedResult){
		//var sRequiredDateTime = new Date(sRequiredDate).getTime();
		//var sShippedDateTime = new Date(sShippedDate).getTime();
		//var fResult = formatter.deliveryState(sRequiredDateTime, sShippedDateTime);
		var fResult = formatter.deliveryText(sRequiredDate, sShippedDate);
		assert.strictEqual(fResult, fExpectedResult, "The calculation of delivery state was correct");
	}
	
	QUnit.test("Should print In time when the require date is lager than 7 days comparing the ship date", function(assert){
		
		deliveryTextTestCase.call(this, assert, new Date("7/30/2019").getTime(), new Date("7/1/2019").getTime(), "In time");
	});
	
	QUnit.test("Should print Urgent when the require date is less than 7 days but larger than 0 days comparing the ship date", function(assert){
		
		deliveryTextTestCase.call(this, assert, new Date("7/30/2019").getTime(), new Date("7/26/2019").getTime(), "Urgent");
	});
	
	QUnit.test("Should print Too late when the require date is less than 0 days comparing the ship date", function(assert){
		
		deliveryTextTestCase.call(this, assert, new Date("7/30/2019").getTime(), new Date("8/1/2019").getTime(), "Too late");
	});
	
	QUnit.test("Should print None when the the ship date is null", function(assert){
		
		deliveryTextTestCase.call(this, assert, new Date("7/30/2019").getTime(), null, "None");
	});
	
	
	// unit test of numberUnit
	function numberUnitValueTestCase(assert, sValue, fExpectedNumber) {
		// Act
		var fNumber = formatter.numberUnit(sValue);

		// Assert
		assert.strictEqual(fNumber, fExpectedNumber, "The rounding and format was correct");
	}

	QUnit.test("Should round down a 3 digit number", function (assert) {
		numberUnitValueTestCase.call(this, assert, "3.123", "3.12");
	});

	QUnit.test("Should round up a 3 digit number", function (assert) {
		numberUnitValueTestCase.call(this, assert, "3.128", "3.13");
	});

	QUnit.test("Should round a negative number", function (assert) {
		numberUnitValueTestCase.call(this, assert, "-3", "-3.00");
	});

	QUnit.test("Should round an empty string", function (assert) {
		numberUnitValueTestCase.call(this, assert, "", "");
	});

	QUnit.test("Should round a zero", function (assert) {
		numberUnitValueTestCase.call(this, assert, "0", "0.00");
	});
	
	// test the formatter of 123456.233
	QUnit.test("Should split the value with comma", function(assert){
		numberUnitValueTestCase.call(this, assert, "123456.233", "123,456.23");
		
	});
	
	
	// unit test of calculatePriceTotal
	function calculatePriceTotalTestCase(assert, sQuantity, sPrice, fExpectedNumber){
		var fNumber = formatter.calculatePriceTotal(sQuantity, sPrice);
		assert.strictEqual(fNumber, fExpectedNumber, "the calculation was correct");
	}
	
	QUnit.test("Should calculate 2 positive number", function (assert) {
		calculatePriceTotalTestCase.call(this, assert, "1.23", "2.58", "3.17");
	});
	
	QUnit.test("Should calculate 0", function (assert) {
		calculatePriceTotalTestCase.call(this, assert, "1.23", "0", "0.00");
	});
	
	QUnit.test("Should calculate 2 negative number", function (assert) {
		calculatePriceTotalTestCase.call(this, assert, "-1234.23", "-2.58", "3,184.31");
	});
	
	QUnit.test("Should calculate 1 positive number and 1 negative number", function (assert) {
		calculatePriceTotalTestCase.call(this, assert, "100", "-12", "-1,200.00");
	});
	

});