sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NotFoundJourney",
	"./MasterJourney",
	 "./DetailJourney"
	
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "sap.ui.demo.bulletinboard.view.",
		autoWait: true
	});
});