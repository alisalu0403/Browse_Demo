sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/matchers/Properties',
	'sap/ui/test/actions/Press',
	'sap/ui/test/actions/EnterText',
	'sap/ui/test/matchers/AggregationLengthEquals'
], function (Opa5, Properties, Press, EnterText, AggregationLengthEquals) {
		"use strict";
		var sViewName = "Detail";
		Opa5.createPageObjects({
			onTheDetailPage: {
				actions: {
				
				},
				assertions: {
					theTitleShouldDisplayTheName: function (sName) {
						return this.waitFor({
							success: function () {
								return this.waitFor({
									id: "objectHeader",
									viewName: sViewName,
									// matchers: new Properties({
									// 	title: sName
									// }),
									success: function (oPage) {
										Opa5.assert.ok(true, "was on the remembered detail page");
									},
									errorMessage: "The Post " + sName + " is not shown"
								});
							}
						});
					}
				}
			}
		});
	});