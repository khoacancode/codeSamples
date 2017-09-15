(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('acceptTermsCtrl', acceptTermsCtrl);

    acceptTermsCtrl.$inject = ['$q', '$location', '$scope', 'ectDataContextFty', 'ectCustomerInj', '$window', 'ecsValidationFty', 'ectRedirectFty', 'ectSpinnerFty', 'ectCommonFty', 'ectPageTransitionFty', 'ectAnalyticsFty'];

    function acceptTermsCtrl($q, $location, $scope, ectDataContextFty, ectCustomerInj,  $window, ecsValidationFty, ectRedirectFty, ectSpinnerFty, ectCommonFty, ectPageTransitionFty, ectAnalyticsFty) {

        var vm = this;
        vm.data = {
            member: {
                name: "",
                introText: ""
            },
            buttons: {
                primary: {
                    text: "I have read and accept the Terms and Conditions and the Privacy Policy",
                    cssClass: "btn btn-block btn-interstitial btn-upsell",
                    wrapperCssClass: "form-group col-xs-12 col-sm-6"
                }
            }
        };
        vm.output = {};

        vm.api240data = null;
        vm.api241data = null;
        vm.siteConfig = {
            siteId: null
        };

        vm.customer_number = '';


        /* ====================
          Upsell option from Widget's directive
          ==================== */
        vm.getUpsellOption = function (option) {
            ectSpinnerFty.showSpinner();

            var angulerPublicECDObject = angular.fromJson(sessionStorage.getItem("ECDObjectBackup"));
            var is3B3S = angulerPublicECDObject.Active3B3S;

            var custIP = ectCommonFty.getIP();
            var cusp_ip_validated = '';

            if (custIP == '::1')
                cusp_ip_validated = '12.1.1.123';
            else
                cusp_ip_validated = custIP;

            var promise_customerSignIn = ectCustomerInj.postCreateCustomerApi703({
                ip_address: cusp_ip_validated,
                accept_tc: true,
                accept_privacy: true
            }).then(
            function success(signInResult) {

                ectSpinnerFty.hideSpinner();

                if (is3B3S)
                    ectRedirectFty.pageRedirect('3b_thankyoureorder');
                else
                    ectRedirectFty.pageRedirect('ordercompletethankyoupage');

            },
            function error(reason) {
                /* Failed Sign In */
                ectSpinnerFty.hideSpinner();
                ectRedirectFty.pageRedirect('default');
                console.log(reason);

            }
        );
            //ectSpinnerFty.spinForPromises([promise_customerSignIn], 'Processing your request.', 'Please do not navigate away from this page.');

        };
    };
})();
