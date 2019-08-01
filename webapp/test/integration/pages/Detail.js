sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/matchers/Properties',
	'sap/ui/test/actions/Press',
	'sap/ui/test/actions/EnterText',
	'sap/ui/test/matchers/AggregationLengthEquals',
	'sap/ui/test/matchers/I18NText',
	"sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Properties, Press, EnterText, AggregationLengthEquals, I18NText, PropertyStrictEquals) {
		"use strict";
		var sViewName = "Detail";
		Opa5.createPageObjects({
			onTheDetailPage: {
				actions: {
					iPressOnProcessorButton: function(){
						return this.waitFor({
							id: "employee",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "The processor button is not existing"
						});
					},
					
					iPressOnShippingButton: function(){
						return this.waitFor({
							id: "ship",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "The shipping button is not existing"
						});
					},
					
					iPressOnScreenButton: function(sId){
						return this.waitFor({
							id: sId,
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "The" + sId + " button is not existing."
						});
					}
				
				},
				assertions: {
					theTitleShouldDisplayTheName: function (sName) {
						return this.waitFor({
							success: function () {
								return this.waitFor({
									id: "objectHeader",
									viewName: sViewName,
									matchers: new Properties({
										text: sName
									}),
									success: function (oPage) {
										Opa5.assert.ok(true, "was on the remembered detail page");
									},
									errorMessage: "The Post " + sName + " is not shown"
								});
							}
						});
					},
					
					theListShouldHavePagination: function () {
						return this.waitFor({
							id: "listTable",
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "items",
								length: 5
							}),
							success: function () {
								Opa5.assert.ok(true, "The list has 5 items");
							},
							errorMessage: "The list does not contain all items."
						});
					},
					
					theTitleShouldDisplayTheTotalAmountOfItems: function () {
						return this.waitFor({
							id: "tableHeader",
							viewName: sViewName,
							matchers: new I18NText({
								key: "lineItemTitleCount",
								propertyName: "text",
								parameters: [5]
							}),
							success: function () {
								Opa5.assert.ok(true, "The list header has 5 items");
							},
							errorMessage: "The List's header does not container the number of items: 5"
						});
					},
					
					theProcessorInforDisplay: function(){
						return this.waitFor({
							id: "Processor",
							viewName: sViewName,
							success: function(){
								Opa5.assert.ok(true, "The processor form displays");
							},
							errorMessage: "The processor form cannot display."
						});
					},
					
					theShippingInforDisplay: function(){
						return this.waitFor({
							id: "ShippingInfo",
							viewName: sViewName,
							success: function(){
								Opa5.assert.ok(true, "The shipping form displays");
							},
							errorMessage: "The shipping form cannot display."
						});
					},
					
					theLayoutShouldChange: function(sLayout){
						return this.waitFor({
							viewName: "App",
							id: "layout",
							matchers: new PropertyStrictEquals({name: "layout", value: sLayout}),
							success: function(){
								Opa5.assert.ok(true, "The layout is full screen");
							},
							errorMessage: "The layout is not full screen."
						});
					},
					theExitFullScreenButtonShouldDisplay: function(){
						return this.waitFor({
							viewName: sViewName,
							id: "exitFullScreen",
							success: function(){
								Opa5.assert.ok(true, "The exit full screen button is shown");
							},
							errorMessage: "Can not see the exit full screen button."
						});
					}
				}
			}
		});
	});