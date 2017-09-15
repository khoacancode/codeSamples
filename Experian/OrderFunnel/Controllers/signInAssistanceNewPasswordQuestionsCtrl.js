(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('signInAssistanceNewPasswordQuestionsCtrl', signInAssistanceNewPasswordQuestionsCtrl);

    signInAssistanceNewPasswordQuestionsCtrl.$inject = ['$q', '$location', '$scope', 'ectDataContextFty', 'ectInjector.signInAssistance', 'ectPageTransitionFty', 'ecsValidationFty', 'ectRedirectFty', 'ectSpinnerFty', 'ectMembershipExperienceFty', 'ectPreloadFty', 'ecsLookupFty', 'ectAnalyticsFty', 'ectSiteConfigInj'];

    function signInAssistanceNewPasswordQuestionsCtrl($q, $location, $scope, ectDataContextFty, ectInjectorSignInAssistance, ectPageTransitionFty, ecsValidationFty, ectRedirectFty, ectSpinnerFty, ectMembershipExperienceFty, ectPreloadFty, ecsLookupFty, ectAnalyticsFty, ectSiteConfigInj) {
        var vm = this;

        vm.config = {
            headerText: 'Please choose a password that is 6 to 35 characters. Your password may not contain spaces and the following characters: < > " \' ` %',
            footerText: 'As always, your security and privacy are of the utmost importance to us. We do not sell your personal information to third parties.',
            confirmPasswordWrapperClass: 'col-sm-4 col-sm-push-5',
            userNameWrapperClass: 'col-sm-4',
            userName: null,
            newUserNameWrapperClass: 'col-sm-4 col-sm-pull-4',
            passwordWrapperClass: 'col-sm-4 col-sm-offset-1',
            securityQuestionOptions: []
        }

        vm.api240data = null;
        vm.api241data = null;
        vm.siteConfig = {
            siteId: null
        };



        // Load security question options from lookup factory...when account data is ready
        vm.config.securityQuestionOptions = ecsLookupFty.getSecurityQuestions();

        /* get previous flow data */
        vm.api240data = ectPageTransitionFty.getSecureParameter('api240data');
        vm.api241data = ectPageTransitionFty.getSecureParameter('api241data');
        if (!vm.api240data || !vm.api241data) {
            /* no previous flow, redirect user back to Step 1 */
            ectRedirectFty.pageRedirect('ForgotSignIn');
            return false;
        }
        vm.config.userName = vm.api241data.result.username;
        /* ==========
             Get Authentication and start calling API 
          ==========*/
        if (sessionStorage["ClientTokenObject"]) {

            /* get site config 
            should already be in session, pass in no value */
            var promise_getSiteConfig = ectSiteConfigInj.getAttributeApi343({ 'data': ectAnalyticsFty.getField('SourceCode') }).then(function (value) {
                if (value instanceof Array) {
                    vm.siteConfig = value[0];
                }
                else {
                    vm.siteConfig = value;
                }
                ectPreloadFty.preload();
            },
            function (error) {
                /* user is not supposed to be here */
                ectRedirectFty.pageRedirect('ForgotSignIn');
                return false;
            });
            ectSpinnerFty.spinForPromises([promise_getSiteConfig], 'Processing your request.', 'Please do not navigate away from this page.');

        }
        else {
            /* authentication error goes here */
        }
        /* =========== End API Calls and postAPI events */

        /* ====================
         SUBMIT
         ==================== */
        vm.submit = function (data) {

            var apiData = {}
            var birthDate;
            if(vm.api240data && vm.api241data && vm.siteConfig.site_id) {
                /* change birthdate from 1970-1-1 to 1/1/1970 */
                birthDate = vm.api240data.postData.date_of_birth.split('-');
                birthDate = birthDate[1] + '/' + birthDate[2] + '/' + birthDate[0];
                /* prepare data for API */
                apiData = {
                    new_password: data.password,
                    challenge: {
                        answer: vm.api241data.postData.Answer,
                        customer_number: vm.api240data.result.customer_number,
                        mothers_maiden_name: vm.api241data.postData.Mothers_Maiden_Name,
                        question: {
                            question_id: vm.api240data.result.question.question_id
                        }
                    },
                    customer_login_help: {
                        date_of_birth: birthDate,
                        site_id: vm.api240data.postData.site_id,
                        first_name: vm.api240data.postData.first_name,
                        last_name: vm.api240data.postData.last_name,
                        last_four_digit_ssn: vm.api240data.postData.last_four_digit_ssn
                    }
                }


                /* API 242 reset password */
                resetPassword(apiData).then(
                    function success(result) {

                        

                        /* Password is updated */
                        /* Log User in with new password */
                        var promise_customerSignIn= customerSignIn({
                            userName: vm.config.userName,
                            password: data.password,
                            lastFourDigitSsn: vm.api240data.postData.last_four_digit_ssn
                        }).then(
                            function success(signInResult) {
                                /* Signed in */
                                /* Change username if any */
                                if (data.newUserName) {
                                    var promise_updateCustomer = updateCustomer({
                                        customer_number: vm.api241data.result.customer_number,
                                        username: data.newUserName
                                    }).then(
                                        function success(changeUserNameResult) {
                                            /* Username updated, take user to member area */
                                            /* clear flow data */
                                            ectPageTransitionFty.clearSecureParameters();
                                            ectPageTransitionFty.setSecureParameter('api113data', signInResult);
                                            /* go to process flow step */
                                            ectRedirectFty.processFlowRedirect(signInResult);
                                            //ectRedirectFty.pageRedirect(signInResult.process_flow_step);
                                        },
                                        function error(reason) {
                                            /* Failed to update username */
                                        }
                                    );
                                    ectSpinnerFty.spinForPromises([promise_updateCustomer], 'Processing your request.', 'Please do not navigate away from this page.');
                                }
                                else {
                                    /* No new username, take user to member area */
                                    /* clear flow data */
                                    ectPageTransitionFty.clearSecureParameters();
                                    ectPageTransitionFty.setSecureParameter('api113data', signInResult);
                                    /* go to process flow step */
                                    ectRedirectFty.processFlowRedirect(signInResult);
                                    //ectRedirectFty.pageRedirect(signInResult.process_flow_step);
                                }
                            },
                            function error(reason) {
                                /* Failed Sign In */
                            }
                        );
                        ectSpinnerFty.spinForPromises([promise_customerSignIn], 'Processing your request.', 'Please do not navigate away from this page.');
                    },
                    function error(reason) {
                        /* Cannot update Password */
                    }
                );
            }
        };

        /* ====================
         Verify UserName API 108
         ==================== */
        vm.verifyUserName = function (username) {
            var q = $q.defer();
            ectInjectorSignInAssistance.contextCustomer.verifyUserName(username).then(function (value) {
                q.resolve();

            }, function (error) {
                q.reject();
            });
            return q.promise;
        };

        /* ====================
           Get Attribute API 110
           ==================== */
        function updateCustomer(data) {
            var q = $q.defer();
            /* validation */
            ectInjectorSignInAssistance.contextCustomer.updateInfo(data).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }


        /* ====================
             Get Attribute API 180 & 221
             ==================== */
        function customerSignIn(data) {
            var q = $q.defer();
            /* validation */
            ectInjectorSignInAssistance.contextCustomer.signIn(data).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }

        /* ====================
            Get Attribute API 240
            ==================== */
        function retrieveSecurityQuestions(data) {
            var q = $q.defer();
            ectInjectorSignInAssistance.contextCustomer.retrieveSecurityQuestions(data).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }

        /* ====================
           Get Attribute API 241
           ==================== */
        function validateSecurityAnswers(data) {
            var q = $q.defer();
            ectInjectorSignInAssistance.contextCustomer.validateSecurityAnswers(data).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }

        /* ====================
           Get Attribute API 242
           ==================== */
        function resetPassword(data) {
            var q = $q.defer();
            ectInjectorSignInAssistance.contextCustomer.resetPassword(data).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }

        /* ====================
            Get Attribute API 341 
            ==================== */
        function getAttribute(attr) {
            var q = $q.defer();
            ectInjectorSignInAssistance.contextSiteConfig.getAttribute({
                siteVersionId: vm.siteConfig.site_version_id,
                attributeName: attr
            }).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }

        /* ====================
           Get Site Config API 343 
           ==================== */
        function getSiteConfig(data) {
            var q = $q.defer();
            ectInjectorSignInAssistance.contextSiteConfig.getSiteConfig(data).then(
                function success(value) {
                    q.resolve(value);
                },
                function errorCallback(error) {
                    q.reject(error);
                }
             );
            return q.promise;
        }
    }
})();
