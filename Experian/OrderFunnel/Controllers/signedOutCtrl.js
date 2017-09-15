(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('signedOutCtrl', ctrl);
    ctrl.$inject = ['ectInjector.signedOut', '$location', '$anchorScroll', 'ectModalFty', 'ectUrlFty', 'ectAnalyticsFty'];

    function ctrl(ectInjectorSignedOut, $location, $anchorScroll, ectModalFty, ectUrlFty, ectAnalyticsFty) {

        var vm = this;

        activate();

        //#region Activation Functions
        function activate() {
            initializeForm();
            processForm();
        }

        function initializeForm() {
            vm.interstitialTmpl = ectUrlFty.templates.getSignInInterstitial();

        }

        var _currentView = 'credit';
        var _showFilters = true;


        var upsaleTracking = ectAnalyticsFty.getField('BannerCode') === "TimeOut" ? "&cid=10085" : "&cid=10086";
        vm.links = {
            signedOut: ectUrlFty.buildTrackingUrlParameter("/credit#/signIn", 'signInAgainLink', 'linkClicked'),
            advertiserDisclosure: ectUrlFty.buildTrackingUrlParameter("", 'advertiserDisclosureLink', 'linkClicked'),
            upsale: ectUrlFty.buildTrackingUrlParameter(ectUrlFty.get3bOrder() + upsaleTracking + "&skipInt=true", 'advertiserDisclosureLink', 'linkClicked'),
        }

        vm.showDetails = function (data) {
        	vm.creditCardOfferData = data.details;
        	ectModalFty.showDialog('AppViews/SharedViews/Templates/ModalTemplates/creditCardOfferDetails.html', vm, 'modal-lg', false);
        }

        vm.gotoAnchor = function () {
            $location.hash('disclaimerText');
            $anchorScroll();

            return false;
        }

        vm.widgets = null;

        vm.widgets = {
            savingCenterAutoLoans: false,
            savingCenterBusinessLoans: false,
            savingCenterCreditCards: true,
            savingCenterDebtConsolidationLoans: false,
            savingCenterMortgageLoans: false,
            savingCenterPersonalLoans: false
        };


        vm.title = "Savings Center";
        vm.view = "credit";

        vm.CurrentView = 'credit';
        vm.numCards = null;
        vm.numAutoLoans = null;
        vm.numMortgageLoans = null;
        vm.numPersonalLoans = null;
        vm.numBusinessLoans = null;
        vm.numDebtConsolidationLoans = null;
        vm.filteredCards = null;
        //#endregion

        //#region Widget data containers

        vm.cards = null;
        vm.autoLoans = null;
        vm.mortgageLoans = null;
        vm.personalLoans = null;
        vm.businessLoans = null;
        vm.debtConsolidationLoans = null;

        //#endregion

        //#region Credit Card Filters

        vm.filteredCards = null;
        vm.riskFilter = "All";
        vm.featureFilters = ["All"];

        vm.filterObject = {
            risk: vm.riskFilter,
            filters: vm.featureFilters,
            dataSource: vm.cards
        }

        //#endregion

        //#region ViewModel functions

        vm.setCurrentView = setCurrentView;
        vm.isCurrentView = isCurrentView;
        vm.toggleFilters = toggleFilters;
        vm.isShowFilters = isShowFilters;
        vm.addRemoveFilter = addRemoveFilter;

        //#endregion

        //#region Controller Functions

        var cardPromise = ectInjectorSignedOut.contextCreditCardOffer.data().then(function (value) {
            vm.cards = value;
            vm.filteredCards = vm.cards;
            vm.numCards = vm.filteredCards.length;
        });

        function toggleFilters() {
            if (_showFilters) {
                _showFilters = false;
            } else {
                _showFilters = true;
            }
        }

        function isShowFilters() {
            return _showFilters;

        }

        function setCurrentView(view) {
            _currentView = view;
            vm.view = _currentView;
            $('#viewSelect').val(view);
            $location.path('offers', false).search('view', _currentView);
            $location.path('offers', false).search('attrGroup', 'topNav');
            $location.path('offers', false).search('attrName', _currentView);
		}

        function isCurrentView(view) {
            return (_currentView == view);
        }

        //#endregion

        //#region Filter Logic

        function addRemoveFilter(item) {

            var index = vm.featureFilters.indexOf(item);
            vm.filterObject.risk = vm.riskFilter;

            if (index > -1) {
                if (item != "" && item != "All") {
                    vm.featureFilters.splice(index, 1)
                }
                vm.filterObject.risk = vm.riskFilter;
                if (item == "All") {
                    vm.featureFilters = ["All"];
                }
                vm.filterObject.filters = vm.featureFilters;
                var filterPromise = ectInjectorSignedOut.contextCreditCardOffer.data(vm.filterObject).then(function (value) {
                    if (value) {
                        vm.filteredCards = value;
                        updateCounts();
                        item == "All" ? updateFilters(true) : updateFilters(false);

                    }
                });
            }
            else if (item != null && item != "undefined") {
                if (item != "" && item != "All") {
                    vm.featureFilters.push(item);
                }
                vm.filterObject.risk = vm.riskFilter;
                if (item == "All") {
                    vm.featureFilters = ["All"];
                }
                vm.filterObject.filters = vm.featureFilters;
                var filterPromise = ectInjectorSignedOut.contextCreditCardOffer.data(vm.filterObject).then(function (value) {
                    if (value) {
                        vm.filteredCards = value;
                        updateCounts();
                        item == "All" ? updateFilters(true) : updateFilters(false);
                    }
                });
            }

        }

        function updateFilters(reset) {

            if (vm.featureFilters.indexOf("All") == -1 && $("#allFilter").is(':checked')) {
                $('#allFilter').prop('checked', false);
            }
            if (vm.featureFilters.length >= 1 && vm.featureFilters.indexOf("All") > -1 && !reset) {
                $('#allFilter').prop('checked', false);
            }
            if (vm.featureFilters.length == 0) {
                $('#allFilter').prop('checked', true);
                vm.featureFilters = ["All"];
            }
            if (reset) {
                $('input:checkbox').removeAttr('checked');
                $('#allFilter').prop('checked', true);
                vm.featureFilters = ["All"];
            }
        }

        function updateCounts() {

            if (vm.filteredCards) {
                vm.numCards = vm.filteredCards.length;
            }

        }
        //#endregion
    };

})();
