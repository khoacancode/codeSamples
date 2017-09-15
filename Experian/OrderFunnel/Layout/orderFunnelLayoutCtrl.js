(function () {
	'use strict';

	angular.module('ectOrderFunnel').controller('orderFunnelLayoutCtrl', ctrl);
	ctrl.$inject = ['$scope', '$rootScope', 'config', 'ectPageTransitionFty', '$location', 'ectAnalyticsFty', 'ectModalNavigationFty', 'ectBrandFty', 'ectOfferContentFty', 'ectUrlFty', 'ectLayoutFty', 'ectSiteConfigInj'];

	function ctrl($scope, $rootScope, config, ectPageTransitionFty, $location, ectAnalyticsFty, ectModalNavigationFty, ectBrandFty, ectOfferContentFty, ectUrlFty, ectLayoutFty, ectSiteConfigInj) {
		/* jshint validthis:true */
	    var vm = this;

	    activate();

	    function activate() {
	        initializeForm();
	    }

	    function initializeForm() {
	        // Variables
	        // Common Variables
	        vm.modalTemplate = null;
	        vm.showNav = true;
	        vm.displayOrderFunnelLayout = true;
	        vm.displayHybrid1 = false;
	        vm.displayHybrid2 = false;
	        vm.currentYear = new Date().getFullYear();
	        vm.hostName = $location.host();

            // Brand Variables
	        var brand = ectBrandFty.getBrand();
	        vm.logo = brand.getLogo();
	        vm.logoLink = brand.getLogoLink();
	        vm.logoAltTag = brand.getLogoAltTag();
	        vm.headerLogoClass = brand.getHeaderLogoClass();
	        vm.isECT = brand.getDomain() == "ECT" ? true : false;
	        vm.favicon = brand.getFavicon();
	        vm.footerHomeLink = brand.getFooterLink();
	        vm.footerTemplate = ectUrlFty.templates.getOrderFunnelFooter(!vm.showNav);

            // Smart Banner Variables
	        vm.isMobileSmartBannerVisible = false;
	        vm.setIsMobileSmartBannerVisible = function (visible) {
	            vm.isMobileSmartBannerVisible = visible;
	        }
	        vm.showMobileSmartBanner = ectLayoutFty.showMobileSmartBanner();
	        
	        vm.mobileSmartBanner = {
	            data: {
	                androidUrl: 'https://145070.api-01.com/serve?action=click&publisher_id=145070&site_id=86980&sub_ad=smart-banner',
	                iosUrl: 'https://145070.api-01.com/serve?action=click&publisher_id=145070&site_id=86946&sub_ad=smart-banner'
	            }
	        };

	        

	        ectPageTransitionFty.extractParameters();
	        var pkgid = ectPageTransitionFty.getParameters().pkgid;
	        if (pkgid == "FWZ1Y") {
	            $scope.background = 'url(/Images/OrderFunnel/orderFunnelCard_3B_130x71.png) no-repeat'
	        }
	        else {
	            $scope.background = 'url(/Images/OrderFunnel/orderFunnelCard_1B_167x71.png) no-repeat'
	        }

	        if (pkgid) {
	        	ectOfferContentFty.getOfferContent(pkgid).then(	// *** US11186 ***
					function (offerPackage) {
						vm.title = offerPackage.packageDescription;
					}
				);
			}
	        else {
	        	vm.title = '';
	        }

	        vm.optOutLink = "";

            // Function Variables
	        vm.navigatePage = navigatePage;
	        vm.optOut = optOut;
	        vm.showModalDialog = showModalDialog;
	        
	        // Wire up Events
	        $scope.$on("$locationChangeStart", locationChangeStart);
	        $scope.$on('$viewContentLoaded', viewContentLoaded);
	        $rootScope.$on(config.events.modalSpinnerToggle, modalSpinnerToggle);
	        $rootScope.$on(config.events.modalDialogToggle, modalDialogToggle);
	        $rootScope.$on(config.events.modalMessageToggle, modalMessageToggle);
	        $rootScope.$on('updateBrand', updateBrand);
	    }
		
	    // #region Event Handling Methods
	    function locationChangeStart(event, nextLocation, currentLocation) {
	            if (vm.showMobileSmartBanner == true) {
	                vm.showMobileSmartBanner = ectLayoutFty.showMobileSmartBanner();
	                vm.showMobileAdDisclaimer = ectLayoutFty.showMobileAdDisclaimer();
	            }
	            vm.showNav = true;
	            vm.displayOrderFunnelLayout = true;
	            vm.showMobileSmartBanner = (nextLocation.toLowerCase().indexOf('/signin') != -1) && ectBrandFty.getBrand().getDomain() == 'ECT';

                // Hybrid 1 Pages
	            var hybrid1 = [
                    'updatepayment',
                    'updatepaymentthankyou',
                    'oneb_thankyoureorder',
                    'welcomeback1',
                    'welcomeback2',
                    //'swapoffer',
                    'orderthankyou',
                    'ordercomplete',
                    'signin',
                    'signout',
                    'timeout',
                    'ssnverificationform',
                    'reorder',
                    'interstitial',
                    'memberinterstitial',
                    'migrationinterstitial',
                    '3bonfile',
                    'error',
                    'changepassword',
                    'createpassword',
                    'upgrade',
                    'pacform'
	            ];

                // Hybrid 2 Pages
	            var hybrid2 = [
                    'forgotsignin',
                    'confirmpassword',
                    'createnewpassword',
                    'forgotsigninsecurity',
                    'acceptterms'
	            ];

	            // Check Hybrid 1
	            for (var location in hybrid1) {
	                if (nextLocation.toLowerCase().indexOf("/" + hybrid1[location]) != -1) {
	                    vm.showNav = false;
	                    vm.displayOrderFunnelLayout = false;
	                    vm.displayHybrid1 = true;
	                    vm.displayHybrid2 = false;
	                }
	            }

	            // Check Hybrid 2
	            for (var location in hybrid2) {
	                if (nextLocation.toLowerCase().indexOf("/" + hybrid2[location]) != -1) {
	                    vm.showNav = false;
	                    vm.displayOrderFunnelLayout = false;
	                    vm.displayHybrid1 = false;
	                    vm.displayHybrid2 = true;
	                }
	            }

	            // Set the correct footer
	            vm.footerTemplate = ectUrlFty.templates.getOrderFunnelFooter(!vm.showNav);

	        }

	        // Modal spinner being requested from page controller calling ectSpinnerFty.showSpinner
	        function modalSpinnerToggle(event, data) {
	            vm.isModalSpinnerVisible = data.show;
	            if (vm.isModalSpinnerVisible) {
	                vm.modalSpinnerData = {
	                    title: data.title,
	                    message: data.message,
	                    loaderOptions: {
	                        radius: 130,
	                        speed: (1 / 10),
	                        baseClass: "ecsSpinner-baseCircle",
	                        fillClass: "ecsSpinner-rotateCircle"
	                    },
	                };
	            }
	        }

	        // Modal dialog being requested from page controller calling ectModalFty.showDialog
	        //	- Modal can access layout viewmodel as lvm and page viewmodel as lvm.pvm
	        function modalDialogToggle(event, data) {
	            if ((data.show) && (data.trackingId)) {
	                var trackingAttrGroup = 'orderFunnelLayoutModal';
	                var trackingAttrName = data.trackingId + ':modalOpen';
	                ectAnalyticsFty.setUserInteractionData(trackingAttrGroup, trackingAttrName);
	            }
	            vm.modalDialogData = {
	                cssClass: data.cssClass,
	                allowClose: true,
	                showCloseInFooter: data.showCloseInFooter,
	            };
	            vm.modalDialogTemplateUrl = data.templateUrl;
	            vm.pvm = data.pageViewModel;
	            vm.isModalDialogVisible = data.show;
	        }

	        // Modal message being requested from page controller calling ectModalFty.showMessage
	        function modalMessageToggle(event, data) {
	            vm.modalMessageData = {
	                title: data.title,
	                message: data.message,
	                showCloseInFooter: false,
	            };
	            vm.isModalMessageVisible = data.show;
	        }

	        function viewContentLoaded() {
	            $(".ect-first-load-cloak").removeClass("ect-first-load-cloak");
	            //show disclaimer on sign in page
	            vm.isSignInPage = (ectAnalyticsFty.getField('PageID') === "11_13_0") ? true : false;
	            vm.isSSNPage = (ectAnalyticsFty.getField('PageID') === "11_15_0") ? true : false;
	            if (!vm.isSignInPage && !vm.isSSNPage) {
	                ectSiteConfigInj.getAttributeApi341({ 'siteVersionId': ectAnalyticsFty.getField('SiteVersionID'), 'attributes': ['CCPhone', 'CCHours', 'CCEmail'] }).then(function (value) {
	                    vm.phoneNumber = value[0].value;
	                    vm.phoneNumberLink = value[0].value.replace(/-/g, "");
	                    vm.CCHours = value[1].value;
	                    vm.CCEmail = value[2].value;
	                    vm.CCEmailMailTo = "mailto:" + value[2].value;
	                    vm.helpIconData = {
	                        title: 'Have questions about your FICO® Score? ',
	                        subtitle: "Learn more",
	                        subtitleUrl: ectUrlFty.buildTrackingUrlParameter('#/Education/FicoContent', 'ficoScore', 'linkClick'),
	                        buttonClosedImgUrl: '/Images/ExperianWidgets/HelpIcon/closedIcon.png',
	                        buttonOpenImgUrl: '/Images/ExperianWidgets/HelpIcon/openIcon.png',
	                    };
	                });
	            }	            
	        }

	        function updateBrand(event, args) {
	            var brand = ectBrandFty.getBrand();
	            vm.logo = brand.getLogo();
	            vm.headerLogoClass = brand.getHeaderLogoClass();
	            vm.favicon = brand.getFavicon();
	        }
        // #endregion

	    // #region General Methods
	        
	        function navigatePage(modalId, pagePath, external) {
	            vm.isModalDialogVisible = false;
	            ectModalNavigationFty.navigate(modalId, pagePath, external);
	        };

	        function optOut() {
	            vm.optOutLink = "http://d.audienceiq.com/r/optout?type=setOptOut";
	        }

	        // Modal dialog being requested from injected page markup calling lvm.showModalDialog
	        //	- Modal can access layout viewmodel as lvm and page viewmodel as vm
	        function showModalDialog(cssClass, templateUrl, trackingId) {
	            if (trackingId) {
	                ectAnalyticsFty.setUserInteractionData('orderFunnelLayoutModal', trackingId + ':modalOpen');
	            }
	            vm.modalDialogData = {
	                cssClass: cssClass,
	                allowClose: true,
	            };
	            vm.modalDialogTemplateUrl = templateUrl;
	            vm.isModalDialogVisible = true;
	        };
        // #endregion

	}
})();
