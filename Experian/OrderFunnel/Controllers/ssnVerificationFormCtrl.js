(function() {
    'use strict';

    angular.module('ectOrderFunnel').controller('ssnVerificationFormCtrl', ssnVerificationForm);
    ssnVerificationForm.$inject = ['ectCommonFty', 'ectRedirectFty', 'ectInjector.ssnVerification', 'ectSpinnerFty', 'ectPageTransitionFty', '$q', 'ectPreloadFty', 'ectInjector.login', 'ectSessionFty', 'ectMembershipExperienceFty', 'ectAnalyticsFty', 'ectBrandFty', 'urlConstants'];
    function ssnVerificationForm(ectCommonFty, ectRedirectFty, ectInjectorSsnVerification, ectSpinnerFty, ectPageTransitionFty, $q, ectPreloadFty, ectInjectorLogin, ectSessionFty, ectMembershipExperienceFty, ectAnalyticsFty, ectBrandFty, urlConstants) {
        var vm = this;
        vm.maxAttempt = 2;
        vm.numberOfAttempt = 0;
        vm.input = {
            ssn: ''
        };
        vm.submitLoginData = submitLoginData;
        vm.data = {
            image: "/Images/ExperianWidgets/SsnVerificationForm/lock.png"
        };

        if (!ectSessionFty.getValue('ValidationTokenObject')) {
            ectRedirectFty.pageRedirect('Login', true);
        }

        // Migrated User Info Alert
        var api180data = ectSessionFty.getValue('EctApi180Context');
        if (api180data) {
            JSON.parse(api180data).EctApi180Entities.forEach(function (api180) {
                if (api180.migrated_brand) {
                    vm.isMigrated = true;
                    ectAnalyticsFty.setField('MigratedBrand', api180.migrated_brand);
                }
            });
        }

        function submitLoginData(data) {
            var ssn = data.ssn;
            //IF NEW VALIDATION TOKEN AUTHENTICATION METHOD
            var validateSSNPromise = ectInjectorLogin.validateSSN(ssn);

            ectSpinnerFty.showSpinner('Verifying your sign-in information.', 'Please do not navigate away from this page.');

            validateSSNPromise.then(
                function ssnValidated(data) {
                    //SSN was validated
                    ectInjectorSsnVerification.authenticate(ssn).then(
                        function processCustomerStatus(value) {                            
                            ectSpinnerFty.hideSpinner();
                            ectRedirectFty.processFlowRedirect(value);
                        },
                        function customerStatusError(errorArray) {
                            // Error in validating SSN
                            ectSpinnerFty.hideSpinner();
                            vm.data.errorMsg = 'Could Not Get Customer Info';
                            errorArray.forEach(function(error) {
                                if (error.processFlowStep != null && error.processFlowStep != '') {
                                    ectRedirectFty.pageRedirect(error.processFlowStep, true);
                                }
                            });
                        });                  
                },
                function ssnError(errorArray) {
                    // Error in validating SSN
                    ectSpinnerFty.hideSpinner();
                    vm.data.errorMsg = 'Invalid Login Credentials';
                    vm.numberOfAttempt++;
                    if (vm.numberOfAttempt == vm.maxAttempt) {
                        ectRedirectFty.pageRedirect("accountlocked");

                    }
                    errorArray.forEach(function(error) {
                        if (error.processFlowStep != null && error.processFlowStep != '') {
                            ectRedirectFty.pageRedirect(error.processFlowStep, true);
                        }
                    });
                }
            );
        }
    }
})();