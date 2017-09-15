/**
 * @name
 *  ecsValidationFty
 *
 * @version
 *  1.0
 *
 @description
 *  This class is the compilation of validation checks used by ecs widgets.
 */
(function() {
	'use strict';

	angular
		.module('ecsWidgets')
		.factory('ecsValidationFty', ecsValidationFty);

	ecsValidationFty.$inject = ['REGEX_PATTERNS'];

	// The functions in this factory should be maintained in alphabetical order

	function ecsValidationFty(REGEX_PATTERNS) {
		var service = {
			fileExists: fileExists,
			hasProperties: hasProperties,
			hasProperty: hasProperty,
			isArray: isArray,
			isBoolean: isBoolean,
			isBooleanString: isBooleanString,
			isDate: isDate,
			isDateMatch: isDateMatch,
			isEmailAddress: isEmailAddress,
			isHexaColor: isHexaColor,
			isImageUrl: isImageUrl,
			isNumeric: isNumeric,
			isNumericMonth: isNumericMonth,
			isNumericYear: isNumericYear,
			isPositiveNegativeIndicator: isPositiveNegativeIndicator,
			isString: isString,
			isStringMatch: isStringMatch,
			isSubstringMatch: isSubstringMatch,
			isUnderAge: isUnderAge,
			isUrl: isUrl,
			isValidCreditCardDate: isValidCreditCardDate,
			isValidCreditCardNumber: isValidCreditCardNumber,
			isYesNoString: isYesNoString,
			isAlphaNumeric: isAlphaNumeric,
		};

		return service;

		function fileExists(urlToFile) {
			// validates a file path to resolve properly
			if (!urlToFile) {
				return false;
			}
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', urlToFile, false);
			try {
				xhr.send();
			} catch (e) {
				return false;
			}
			return (xhr.status !== "404");
		}

		function hasProperties(correctPropertyNames, value) {
			if (value != null && value != "undefined") {
				for (var i = 0; i < correctPropertyNames.length; i++) {
					if ($.inArray(correctPropertyNames[i], Object.keys(value)) === -1)
						return false;
				}
				return true;
			}
			return false;

		}

		function hasProperty(correctPropertyName, value) {
			// Returns true when the input array contains the key within
			if (value != null && value != "undefined") {
				return hasProperties([correctPropertyName], value);
			}
			return false;
		}

		function isArray(value) {
			return angular.isArray(value);
		}

		function isBoolean(value) {
			return (typeof value === "boolean");
		}

		function isBooleanString(value) {
			return isString(value) && (value === 'true' || value === 'false');
		}

		function isDate(value) {
			//Returns true only if the value passed in is a Date object. String representations of a date will return false. 
			return Object.prototype.toString.call(value) === '[object Date]' && value != 'Invalid Date';
		}

		function isDateMatch(dateA, dateB) {
			if (!dateA || !dateB) {
				return false;
			}
			dateA = new Date(dateA);
			dateB = new Date(dateB);

			if(dateA.getMonth() == dateB.getMonth() && dateA.getFullYear() == dateB.getFullYear()){
				return true;
			}
			else{
				return false;
			}

		}

		function isEmailAddress(email) {
			var re = REGEX_PATTERNS.email;
			return re.test(email);
		}

		function isHexaColor(value) {
			if (value == null || value == "undefined") {
				return false;
			} else {
				var sNum = value.replace('#', '');
				return (typeof sNum === "string") && sNum.length === 6 && !isNaN(parseInt(sNum, 16));
			}
		}

		function isImageUrl(url) {
			if (url) {
				if ((REGEX_PATTERNS.urlImage).test(url)) {
					return true;
				}
			}
			return false;
		}

		function isNumeric(value) {
			return jQuery.isNumeric(value);
		}

		function isNumericMonth(value) {
			return isNumeric(value) && value >= 1 && value <= 12;
		}

		function isNumericYear(value) {
			return isNumeric(value) && value >= 1900 && value <= 9999;
		}

		function isPositiveNegativeIndicator(indicator) {
			if (indicator) {
				if (indicator == "positive" || indicator == "negative") {
					return true;
				}
			}
			return false;
		}

		function isString(value) {
			return (typeof value === 'string' || value instanceof String);
		}

		function isStringMatch(stringA, stringB) {
			if (!stringA || !stringB) {
				return false;
			}
			if (stringA == '' || stringB == '') {
				return false;
			}
			return (stringA.toLowerCase() == stringB.toLowerCase());
		}

		function isSubstringMatch(stringA, stringB) {
			if (!stringA || !stringB) {
				return false;
			}
			if (stringA == '' || stringB == '') {
				return false;
			}

			if (stringA.toLowerCase().indexOf(stringB.toLowerCase()) > -1 || stringB.toLowerCase().indexOf(stringA.toLowerCase()) > -1) {
				return true;
			} else {
				return false;
			}
		}
		function isUnderAge(birthday, underAge) {
			//returns true if given date is under given age based on todays date
			var today = new Date();

			var age = today.getUTCFullYear() - birthday.getUTCFullYear();

			//if birthday month is after this month, they are 1 year less older
			//ie, today 9/20/2014 vs 10/20/1996, 9 < 10, therefor instead of 18 (2014-1996) they are 17
			if (today.getUTCMonth() < birthday.getUTCMonth()) {
				age--;
			}
			//similarly if we are in the current month, birth month=today month
			//and the today < birthday then they are 1 year less older
			//ie today 9/20/2014 vs 9/21/1996, 9=9 and 20<21 so instead of 18 (2014-1996) they are 17
			else if (birthday.getUTCMonth() === today.getUTCMonth() && today.getUTCDate() < birthday.getUTCDate()) {
				age--;
			}
			return age < underAge;
		}

		function isUrl(url) {
			if (url) {
				if ((REGEX_PATTERNS.url).test(url) || (REGEX_PATTERNS.relativeUrl).test(url)) {
					return true;
				}
			}
			return false;
		}

		function isValidCreditCardDate(y, m) {
		    var date = new Date();
			var actualDate = new Date(date.getFullYear(), date.getMonth());
			var d = new Date(y, m);
			if (actualDate <= d) {
				return d
			} else {
				return false
			}
		}

		function isValidCreditCardNumber(number) {
		    var regex = REGEX_PATTERNS.creditCard;
			if (!regex.test(number))
				return false;

			return luhnCheck(number);

			function luhnCheck(luhn) {
			    var len = luhn.length,
                mul = 0,
                prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
                sum = 0;

			    while (len--) {
			        sum += prodArr[mul][parseInt(luhn.charAt(len), 10)];
			        mul ^= 1;
			    }

			    return sum % 10 === 0 && sum > 0;
			}
		}

		function isYesNoString(value) {
			return isString(value) && (value === 'yes' || value === 'no');
		}

		function isAlphaNumeric(str) {
			var code, i, len;

			for (i = 0, len = str.length; i < len; i++) {
				code = str.charCodeAt(i);
				if (!(code > 47 && code < 58) && // numeric (0-9)
					!(code > 64 && code < 91) && // upper alpha (A-Z)
					!(code > 96 && code < 123)) { // lower alpha (a-z)
					return false;
				}
			}
			return true;
		}
	}
})();