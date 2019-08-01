sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/matchers/Properties',
	'sap/ui/test/actions/EnterText'
], function (Opa5, Properties, EnterText) {
		"use strict";
		var sViewName = "ResourceNotFound";
		Opa5.createPageObjects({
			onTheNotFoundPage: {
				assertions: {
					theNotFoundPageShouldDisplay: function () {
	
						return this.waitFor({
							id: "page",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, "the not found page is display");
							},
							errorMessage: "can not find the not found page"
						});
							
					}
				}
			}
		});
	});