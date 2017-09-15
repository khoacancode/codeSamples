(function () {
    'use strict';

    angular.module('ecsWidgets').factory('ecsHelpersFty', ecsHelpersFty);
    ecsHelpersFty.$inject = ['ecsValidationFty'];

    function ecsHelpersFty(ecsValidationFty) {
        var helper = {           
            buildDefaultObject: buildDefaultObject,
            buildWithValidPropertiesOrDefaults: buildWithValidPropertiesOrDefaults,
            getCssStyle: getCssStyle,
            getDateFromParts: getDateFromParts,
            propertyListBuilder: propertyListBuilder,
        };

        return helper;

        function buildDefaultObject(defaults) {
        	var props = propertyListBuilder(defaults);
        	var obj = {};
        	for (var i = 0; i < props.length; i++) {
        		obj[props[i]] = defaults[props[i]].value;
        	}
        	return obj;
        }

        function buildWithValidPropertiesOrDefaults(obj, defaults) {
            var props = propertyListBuilder(defaults);
            for (var i = 0; i < props.length; i++) {
            	obj[props[i]] = ecsValidationFty.isValueType(defaults[props[i]].type, obj[props[i]]) ? obj[props[i]] : defaults[props[i]].value;
            }
            return obj;
        }

        function getCssStyle(style, selector) {
        	// http://stackoverflow.com/questions/16965515/how-to-get-a-style-attribute-from-a-css-class-by-javascript-jquery
        	var sheets = document.styleSheets;
        	for (var i = 0; i < sheets.length; i++) {
        		var sheet = sheets[i];
        		for (var j = 0; j < sheet.cssRules.length; j++) {
        			var rule = sheet.cssRules[j];
        			if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
        				return rule.style[style];
        			}
        		}
        	}
        	return null;
        }

        function getDateFromParts(day, month, year) {

        	//returns valid date object given ints of each part of date
        	//usefull for birthday drop downs where user can input a bad date like Feb 31 2011

        	var today = new Date();
        	var newYear = today.getUTCFullYear();
        	var newMonth = today.getUTCMonth();
        	var newDay = today.getUTCDate();
        	if (ecsValidationFty.isNumeric(year)) {
        		newYear = year;
        	}
        	if (ecsValidationFty.isNumeric(month)) {
        		newMonth = month;
        	}
        	if (ecsValidationFty.isNumeric(day)) {
        		newDay = day;
        	}
        	return new Date(Date.UTC(newYear, newMonth, newDay));
        }

        function propertyListBuilder(data) {
        	var propList = [];
        	if (data != null && data != "undefined" && typeof Object(data)) {
        		for (var propertyName in data) {
        			if (propertyName != "undefined")
        				propList.push(propertyName);
        		}
        		return propList;
        	}
        	return null;
        }

	}
})();
