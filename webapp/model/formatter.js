sap.ui.define([
	"sap/ui/model/type/Currency"], function (Currency) {
	"use strict";

	return {
		deliveryState: function (oRequiredDate, oShippedDate) {
			if(oShippedDate === null)
				return "None";
			
			if(oRequiredDate < oShippedDate)
			{
				return "Error";
			}
			else if(oRequiredDate - oShippedDate > 24*60*60*1000*7)// threadshead is 7 days
			{
				return "Success";
			}
			else
			{
				return "Warning";
			}
		},
		
		deliveryText: function (oRequiredDate, oShippedDate) {
			if(oShippedDate === null)
				return "None";
			
			if(oRequiredDate < oShippedDate)
			{
				return "Too late";
			}
			else if(oRequiredDate - oShippedDate > 24*60*60*1000*7)// threadshead is 7 days
			{
				return "In time";
			}
			else
			{
				return "Urgent";
			}
		},
		
		numberUnit: function (sValue) {
			var oCurrency = new Currency({showMeasure: false});
			if (!sValue) {
				return "";
			}
			return oCurrency.formatValue([parseFloat(sValue).toFixed(2), "EUR"], "string");
		},
		
		calculatePriceTotal: function(iQuantity, fPrice){
			var oCurrency = new Currency({showMeasure: false});
			var fTotal = iQuantity * fPrice;
			return oCurrency.formatValue([parseFloat(fTotal).toFixed(2), "EUR"], "string");
			
			//return this.numberUnit(fTotal);
		}

	};

});