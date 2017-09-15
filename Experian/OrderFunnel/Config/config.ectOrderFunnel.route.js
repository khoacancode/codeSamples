(function () {
    'use strict';

    // Retrieves the angular module and sets it to a local variable
    var app = angular.module('ectOrderFunnel');

    // Configure the routes and route resolvers
    app.config(routeConfigurator);
    routeConfigurator.$inject = ['$routeProvider', '$locationProvider', 'urlConstants'];
    function routeConfigurator($routeProvider, $locationProvider, urlConstants) {
        var moduleRoutes = getRoutes(urlConstants);

        moduleRoutes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes(urlConstants) {
        return [
            {
                url: '/',
                config: {
                    title: 'Order Page 1',
                    templateUrl: function (params) {
                        return '/AppViews/CreditViews/OrderPage1.html'
                    },
                    resolve: {
                        retrieveClientToken: retrieveClientToken,
                        redirectUnauthorizedAccess: redirectUnauthorizedAccess
                    }
                }                
            },
            {
                url: '/:area*\/:page',
                config: {
                    templateUrl: function (params) {
                        if (urlConstants.sharedUrls.indexOf(params.page.toLowerCase()) > -1) {
                            return '/AppViews/SharedViews/' + params.page + '.html';
                        }
                        else {
                            return '/AppViews/CreditViews/' + params.area + '/' + params.page + '.html';
                        }
                    },
                    resolve: {
                        retrieveClientToken: retrieveClientToken,
                        redirectUnauthorizedAccess: redirectUnauthorizedAccess
                    }
                }
            },
            {
                url: '/:page',
                config: {
                    templateUrl: function (params) {
                        if (urlConstants.sharedUrls.indexOf(params.page.toLowerCase()) > -1) {
                            return '/AppViews/SharedViews/' + params.page + '.html';
                        }
                        else {
                            return '/AppViews/CreditViews/' + params.page + '.html';
                        }
                    },
                    resolve: {
                        retrieveClientToken: retrieveClientToken,
                        redirectUnauthorizedAccess: redirectUnauthorizedAccess
                    }
                }
            }
        ];
    }

    redirectUnauthorizedAccess.$inject = ['ectRedirectFty']
    function redirectUnauthorizedAccess(ectRedirectFty)
    {
        //Redirect users without proper authorization
        ectRedirectFty.redirectUnauthorizedAccess();
    }

    //If the client token is not already in the session, we will retrieve it for the use of any of the Order Funnel pages
    retrieveClientToken.$inject = ['ectDataContextFty','$location','$q', 'urlConstants']
    function retrieveClientToken(ectDataContextFty, $location, $q, urlConstants)
    {        
        var q = $q.defer();
        var locationPath = $location.$$path.toLowerCase();
        // Limit client token retrieval to only kick in on certain pages
        if (!sessionStorage["ClientTokenObject"] && (urlConstants.clientTokenRequireUrls.indexOf(locationPath) > -1 || locationPath == '/')) {
            ectDataContextFty.ectApi180.getClientAuthenticationToken().then(function(val){
                q.resolve();
            },
            function(val){
                q.resolve();
            }
            )

        }else{
            q.resolve();
        }

        return q.promise
     
    }

})();
