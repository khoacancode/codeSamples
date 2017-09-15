(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('changePasswordCtrl', changePasswordCtrl);
    changePasswordCtrl.$inject = ['$q', '$location', '$scope', 'ectDataContextFty', 'ectInjector.changePassword', 'ectPageTransitionFty', 'ecsValidationFty', 'ectRedirectFty', 'ectSpinnerFty', 'ectMembershipExperienceFty', 'ectPreloadFty'];

    function changePasswordCtrl($q, $location, $scope, ectDataContextFty, ectInjectorChangePassword, ectPageTransitionFty, ecsValidationFty, ectRedirectFty, ectSpinnerFty, ectMembershipExperienceFty, ectPreloadFty) {
        var vm = this;

        vm.signInData = ectPageTransitionFty.getSecureParameter('signInData');
        ectPageTransitionFty.clearSecureParameters();
        if (!vm.signInData) {
            // shouldn't be here
            ectRedirectFty.pageRedirect('login');
        }

        vm.config = {
            headerText: 'Please choose a password that is 6 to 35 characters. Your password may not contain spaces and the following characters: < > " \' ` %',
            confirmPasswordWrapperClass: 'col-sm-4 col-sm-push-5',
            userNameWrapperClass: 'col-sm-4',
            userName: vm.signInData.username,
            newUserNameWrapperClass: 'hidden',
            passwordWrapperClass: 'col-sm-4 col-sm-offset-1'
        }
        vm.verifyUserName = function (data) {
            return false;
        };

        /*API 112*/
        vm.submit = function (data) {
            ectSpinnerFty.showSpinner('Processing your request.', 'Please do not navigate away from this page.');
            var api112data = {
                current_password: vm.signInData.password,
                new_password: data.password,
                confirm_password: data.password,
                is_edit_profile_page: false
            }
            ectInjectorChangePassword.changePassword(api112data).then(
            function success(value) {
                ectInjectorChangePassword.getNextStep().then(
                    function success(value) {
                        ectSpinnerFty.hideSpinner();
                        ectRedirectFty.processFlowRedirect(value);
                    },
                    function errorCallback(error) {
                        ectSpinnerFty.hideSpinner();
                        ectRedirectFty.pageRedirect('errorcallcc');
                    });
            },
            function errorCallback(error) {
                ectSpinnerFty.hideSpinner();
                ectRedirectFty.pageRedirect('errorcallcc');
            });
        };

    }
})();
