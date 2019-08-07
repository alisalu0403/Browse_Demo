sap.ui.define([
		"sap/ui/test/Opa5"
	],
	function (Opa5) {
		"use strict";

		function getFrameUrl(sHash, sUrlParameters) {
			var sHashTemp = sHash || "";
			var sUrl = jQuery.sap.getResourcePath("sap/ui/demo/bulletinboard/app", ".html");

			if (sUrlParameters) {
				var sUrlParametersTemp = "?" + sUrlParameters;
			}

			return sUrl + sUrlParametersTemp + "#" + sHashTemp;
		}

		return Opa5.extend("sap.ui.demo.bulletinboard.test.integration.pages.Common", {

			constructor: function (oConfig) {
				Opa5.apply(this, arguments);

				this._oConfig = oConfig;
			},

			iStartMyApp: function (oOptions) {
				var sUrlParameters;
				var oOptionsTemp = oOptions || { delay: 0 };

				sUrlParameters = "serverDelay=" + oOptionsTemp.delay;

				this.iStartMyAppInAFrame(getFrameUrl(oOptionsTemp.hash, sUrlParameters));
			},

			iLookAtTheScreen: function () {
				return this;
			}

		});
	});
