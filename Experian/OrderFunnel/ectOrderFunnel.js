(function () {
    'use strict';

    var app = angular.module('ectOrderFunnel', 
	[
		// Angular modules 
		'ngAnimate',        // animations
		'ngRoute',          // routing
        'ngSanitize',       // sanitize HTML
        'ngCookies',

		// Custom modules 
		'ectCommon',
		'ectData',
        'ectShared',
		'ecsWidgets',

		// 3rd Party Modules
	]);
    app.run(function () {
    });

})();