(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('orderPageCtrl', Ctrl);
    Ctrl.$inject = ['ectInjector.orderTwo', 'ectInjector.orderOne', 'ectOrderInj', 'ectOfferContentFty', 'ectCommonFty', 'ectPageTransitionFty', 'ectLogFty', 'loggingConstants', 'ectRedirectFty', 'ectAutomationFty', 'ectSpinnerFty', 'ectAnalyticsFty', 'ectDataConfig', '$modal', 'ectBrandFty', 'ectSiteConfigInj'];

    function Ctrl(ectInjectorOrderTwo, ectInjectorOrderOne, ectOrderInj, ectOfferContentFty, ectCommonFty, ectPageTransitionFty, ectLogFty, loggingConstants, ectRedirectFty, ectAutomationFty, ectSpinnerFty, ectAnalyticsFty, ectDataConfig, $modal, ectBrandFty, ectSiteConfigInj) {
        var vm = this;

        activate();

        function init() {
            vm.freeCustomer = (ectAnalyticsFty.getField("TrulyFreeCustomer") || ectAnalyticsFty.getField("FreePlusScoreUser"));
            vm.userInfo = {};
            vm.submit = submit;
            vm.checkUserName = checkName;
            vm.offerPackage = {
                submitButtonText: 'SUBMIT SECURE ORDER'
            };
            vm.ccInfo = {};
            vm.contactInfo = {};
            vm.signInInfo = {};

            vm.signInConfig = {};

            vm.accessorCCInfo = {};
            vm.accessorContactInfo = {};
            vm.accessorSignInInfo = {};

            vm.shoppingCart = {};
            vm.legal = {};

            vm.customerCare = {};
            vm.customerCare.data = {
                'classes': 'hidden-mobile side-bar-box-curved', // set class for this widget to be hidden on mobile
                'phoneText': 'Call us toll-free at',
                'phoneNumber': '',
                'hours': []
            };

            // Initialize Seals Data
            vm.seals = {};
            vm.seals.data = {
                'classes': 'hidden-mobile' // set class for this widget to be hidden on mobile
            };

            // Defauls Values for Shopping Cart
            vm.shoppingCart = {
                orderDetailHeader: 'Your Order',
                orderDetailOffer: '',
                orderDetailOfferPrice: '',
                orderDetailOfferPromo: '',
                orderDetailOfferPromoPrice: '',
                orderDetailOfferTotal: '',
                orderDetailDisclaimer: '',
                orderDetailShowTax: false
            };

            vm.siteInfo = {
                uri: ectCommonFty.getSiteDomain(),
                pkgid: ectPageTransitionFty.getParameters().pkgid || 'E2NHZ',
                areaid: ectPageTransitionFty.getParameters().areaid || 22,
                sc: ectPageTransitionFty.getParameters().sc || ectBrandFty.getBrand().getDefaultSourceCode(),
                prepop: ectPageTransitionFty.getParameters().prepop || "no",
                custStatusTypeId: '3'
            };

            ectOfferContentFty.getOfferContentCtrl(vm.siteInfo.pkgid).then(
                function (offerPackage) {
                    vm.feature = offerPackage.offerFeatures;
                    vm.title = offerPackage.pageTitle;
                    vm.pageSecurityText = offerPackage.pageSecurityText;
            });
        }
        
        function activate() {
            init();
            var promiseArray = [];
            
            //if (!sessionStorage["ClientTokenObject"]) {
            //    ectLogFty.logException('No ClientToken present on Order Page 1');
            //    ectRedirectFty.pageRedirect("errorcallcc", true, "credit");
            //    return;
            //}
            // Retrieve Prepop data
            if (vm.siteInfo.prepop === "yes") {
                promiseArray.push(ectInjectorOrderOne.getPrePopData().then(
                    function success(value) {
                        vm.siteInfo.prePopData = value.data;
                    }, null).catch(catchFail));
            }

            // Retrieve the Site Config
            promiseArray.push(ectSiteConfigInj.getSiteConfigApi343({
                'uri': vm.siteInfo.uri,
                'sourcecode': vm.siteInfo.sc
            }).then(function (value) {
                vm.siteInfo.config = value;

                // Populate the ECD Object
                ectAnalyticsFty.setField('SourceCode', value.source_code);
                ectAnalyticsFty.setField('SiteID', value.site_id);
                ectAnalyticsFty.setField('SiteVersionID', value.site_version_id);

                // Build Tax Info Promise
                var getTaxInfoPromise = buildTaxInfoPromise({
                    area_id: vm.siteInfo.areaid,
                    offer_code: vm.siteInfo.pkgid,
                    city: "Rocky Hill", //This should be data from NCAC
                    state: "CT", //This should be data from NCAC
                    zip_code: "06067", //This should be data from NCAC
                    sourceCode: value.source_code
                });

                // Build Tax Info Promise for offer 533 Area 102
                if (vm.siteInfo.pkgid == 'E3FDZ') {
                    var get533TaxInfoPromise = build533TaxInfoPromise({
                        area_id: 102,
                        offer_code: 'E3NHZ',
                        city: "Rocky Hill", //This should be data from NCAC
                        state: "CT", //This should be data from NCAC
                        zip_code: "06067", //This should be data from NCAC
                        sourceCode:value.source_code
                    });
                }
                // Start preloading OP2 now that we have the new Source Code
                //ectPreloadFty.executePromiseGet(ectDataConfig.apiInfo.ectApi343, {
                //    uri: ectCommonFty.getSiteDomain(),
                //    sourcecode: value.source_code
                //});

                // Populate Attributes
                ectSiteConfigInj.getAttributeApi341({
                    'siteVersionId': value.site_version_id,
                    'attributes': ['CCPhone', 'CCHours']
                }).then(function (value) {
                    vm.customerCare.data.phoneNumber = value[0].value;
                    vm.customerCare.data.hours.push(value[1].value);
                }, null).catch(catchFail);

            }, null).catch(catchFail));

            // Retrieve the Offer Information
            promiseArray.push(ectOrderInj.getOfferApi360({
                'offerCode': vm.siteInfo.pkgid,
                'areaId': vm.siteInfo.areaid,
                'custStatusTypeId': vm.siteInfo.custStatusTypeId
            }).then(function (value) {
                ectAnalyticsFty.setField('CartAreaID', value.areaId);
                ectAnalyticsFty.setField('CartPackageID', value.offerCode);
            }, null).catch(catchFail));

            // Kick off the page
            ectSpinnerFty.spinForPromises(promiseArray);

        }

        function checkName(value) {   
            ectInjectorOrderTwo.postUserNameLookupApi108(value).then(function (val) {
                vm.signInConfig.validUserName = true;
                vm.signInConfig.checkingName = false;
            }, function (reason) {
                vm.signInConfig.validUserName = false;
                vm.signInConfig.checkingName = false;
            });
        }
        
        function submit() {
            //Are all forms valid? if so get the data
            vm.signInInfo = vm.accessorSignInInfo.getData();
            vm.ccInfo = vm.accessorCCInfo.getData();
            vm.contactInfo = vm.accessorContactInfo.getData();

            if (vm.signInInfo.isValid && (vm.ccInfo.isValid || vm.freeCustomer) && vm.contactInfo.isValid) {
                var data = {

                    //SigninForm
                    userInfo: {
                        userName: vm.signInInfo.userName,
                        password: vm.signInInfo.password,
                        confirmPassword: vm.signInInfo.confirmPassword,
                    },
                    

                    //ContactForm
                    contactInfo: {
                        emailAddress: vm.contactInfo.emailAddress,
                        yesSendInfo: vm.contactInfo.yesSendInfo,
                    }
                    

                }
                if (!vm.freeCustomer) {
                    //CreditCardForm
                    data.ccInfo = {
                        ccNumber: vm.ccInfo.ccNumber,
                        ccExpMonth: vm.ccInfo.ccExpMonth,
                        ccExpYear: vm.ccInfo.ccExpYear
                    }                   
                }
                //DATA FROM NCAC TO POPULATE THE REST
                /*var customerInfo = {
                customer_profile: {
                    first_name: vm.siteData.orderOneData.input.firstName,
                    middle_name: vm.siteData.orderOneData.input.middleInitial,
                    last_name: vm.siteData.orderOneData.input.lastName,
                    social_security_number: vm.input.SSN,
                    date_of_birth: vm.input.DOB,
                    generation: vm.siteData.orderOneData.input.generation,
                    email_address: vm.siteData.orderOneData.input.emailAddress,
                    addresses: [{
                        line1: vm.siteData.orderOneData.input.currentStreetAddress,
                        line2: vm.siteData.orderOneData.input.currentApartment,
                        city: vm.siteData.orderOneData.input.currentCity,
                        state: vm.siteData.orderOneData.input.currentState,
                        postal_code: vm.siteData.orderOneData.input.currentZipCode
                    }],
                },
                customer_account: {
                    username: vm.input.userName,
                    site_id: vm.siteData.orderOneData.config.site_id,
                    entity_id: vm.siteData.orderOneData.config.entity_id,
                    opt_email: vm.siteData.orderOneData.input.yesSendInfo,
                    credit_cards: [{
                        card_number: vm.input.ccNumber,
                        card_expiration_date: vm.input.expirationDate
                    }]

                },
                lived_more_than_six_months: !vm.siteData.orderOneData.input.hasPreviousAddress,
                confirm_social_security_number: vm.input.SSN,
                password: vm.input.password,
                confirm_password: vm.input.confirmPassword,
                black_box: vm.blackBox,
                customer_ip_address: vm.ip

            }
            if (vm.siteData.orderOneData.input.hasPreviousAddress) {
                customerInfo.customer_profile.addresses.push({
                    line1: vm.siteData.orderOneData.input.previousStreetAddress,
                    line2: vm.siteData.orderOneData.input.previousApartment,
                    city: vm.siteData.orderOneData.input.previousCity,
                    state: vm.siteData.orderOneData.input.previousState,
                    postal_code: vm.siteData.orderOneData.input.previousZipCode
                });

            }

            if (vm.offerPackage.trulyFreeExperience) {
                var customerAccount = {
                    username: vm.input.userName,
                    site_id: vm.siteData.orderOneData.config.site_id,
                    entity_id: vm.siteData.orderOneData.config.entity_id,
                    opt_email: vm.siteData.orderOneData.input.yesSendInfo                   
                };
                customerInfo.customer_account = customerAccount;
            }
            createCustomer(data);
            */

            }
            else {

            }
            
        }

        vm.reportImage = ectCommonFty.getOrderPageImage(vm.siteInfo.pkgid, "OP");
        

        ectOfferContentFty.getOfferContentCtrl(vm.siteInfo.pkgid).then(	// *** US11186 ***
				function (offerPackage) {
				    vm.legal = {
				        privacyPolicyNotice: offerPackage.privacy, //add NY disclaimer once we know how data is arriving  [vm.legal.privacyPolicyNotice = vm.legal.privacyPolicyNotice + (offerPackage.nyStateDisclaimer ? offerPackage.nyStateDisclaimer : "");]
				        paymentInformation: offerPackage.paymentInformation,
				        secureOrderNotice: offerPackage.submitText
				    }
				    vm.shoppingCart.orderDetailOffer = offerPackage.packageDescription;
				    vm.shoppingCart.orderDetailDisclaimer = offerPackage.shoppingCartDisclaimer;				   
				}
			);

        function createCustomer(data) {
            return ectInjectorOrderTwo.createCustomer(data).then(
            function success(value) {
                var homeComing = false;
                if (value.processFlowStep === "HomecomingNonTrial" || value.processFlowStep == "HomecomingTrial") {
                    homeComing = true;
                };
                if (value.processFlowStep === "HomecomingNonTrial") {
                    ectRedirectFty.pageRedirect("swapoffer", false, "credit");
                } else {
                    ectRedirectFty.pageRedirect("processing", false, "credit");
                };
            },
            function errorCallback(error) {
                var homeComingErrorSteps = ['Login', 'HomecomingTrial', 'HomecomingNonTrial'];
                var step = error[0].processFlowStep;
                if ($.inArray(step, homeComingErrorSteps) !== -1) {
                    step = 'login-existinguser';
                    ectRedirectFty.pageRedirect(step);
                }
                else {
                    ectRedirectFty.pageRedirect('errorCallCC');
                }
            });
        }

        function catchFail(msg) {
            ectLogFty.logException(msg);
        }

        function buildTaxInfoPromise(data) {
            return ectOrderInj.getTaxRateApi143(data, { cache: false }).then(
                    function success(value) {
                        // Set value from promise

                        // For some reason if you don't use initdata here, you get an error.
                        vm.offerPackage.priceInfo = value.initData;
                        vm.shoppingCart.priceInfo = value.initData;

                        var totalPrice = parseFloat(vm.offerPackage.priceInfo.totalPrice, 10).toFixed(2);
                        var totalProcessingFee = 0;

                        //get tax payment information
                        ectOfferContentFty.getOfferContentCtrl(vm.siteInfo.pkgid).then(	// *** US11186 ***
							function (offerPackage) {
							    if (parseFloat(vm.offerPackage.priceInfo.finalPriceTaxAmount, 10) > 0) {
							        vm.offerPackage.paymentInfo = offerPackage.salesTaxPaymentInformation;
							        vm.shoppingCart.orderDetailShowTax = true;
							        //taxAmount is overriding processfee for $1 offer... fix later in refactor
							        var taxAmount = vm.offerPackage.priceInfo.processingFeeAmount == '1' ? vm.offerPackage.priceInfo.processingFeeTaxAmount : vm.offerPackage.priceInfo.finalPriceTaxAmount;
							        vm.shoppingCart.orderDetailTax = '$' + parseFloat(taxAmount, 10).toFixed(2);
							    }
							    else {
							        vm.offerPackage.paymentInfo = offerPackage.paymentInformation;
							    };
							}
						);

                        if (vm.offerPackage.priceInfo.processingFeeAmount == '1') {
                            vm.shoppingCart.orderDetailOfferPrice = '$' + parseFloat(vm.offerPackage.priceInfo.processingFeeAmount, 10).toFixed(2);
                            totalProcessingFee = (parseFloat(vm.offerPackage.priceInfo.processingFeeAmount, 10) + parseFloat(vm.offerPackage.priceInfo.processingFeeTaxAmount, 10));
                            vm.shoppingCart.orderDetailOfferTotal = '$' + parseFloat(totalProcessingFee, 10).toFixed(2);
                            vm.shoppingCart.orderDetailTax = '$' + parseFloat(vm.offerPackage.priceInfo.processingFeeTaxAmount, 10);
                        }
                        else {
                            if (vm.siteInfo.pkgid == 'E3FDZ') {
                                vm.shoppingCart.orderDetailOfferPromo = 'Complete Access to your Experian credit report and FICO® score!';
                                vm.shoppingCart.orderDetailOfferPromoPrice = '$' + parseFloat(vm.offerPackage.priceInfo.originalPrice, 10).toFixed(2) + '/first month';
                            }
                            else if (vm.siteInfo.pkgid == 'E3NHZ') {
                                vm.shoppingCart.orderDetailOfferPromo = 'Complete Access to your Experian credit report and FICO® score!';
                                vm.shoppingCart.orderDetailOfferPromoPrice = '$' + parseFloat(vm.offerPackage.priceInfo.originalPrice, 10).toFixed(2) + '/month';
                            }
                            else {
                                vm.shoppingCart.orderDetailOfferPrice = '$' + parseFloat(vm.offerPackage.priceInfo.originalPrice, 10).toFixed(2);
                            }
                            vm.shoppingCart.orderDetailOfferTotal = '$' + totalPrice;
                        }

                        if (vm.offerPackage.priceInfo.discountApplied) {
                            vm.shoppingCart.orderDetailOfferPromoPrice = '$' + parseFloat(vm.offerPackage.priceInfo.discountAmount).toFixed(2);
                        }
                    }
                );
        }

        function build533TaxInfoPromise(data) {
            return ectOrderInj.getTaxRateApi143(data, { cache: false }).then(
                    function success(value) {
                        // Set value from promise
                        vm.offerPackage.price533Info = value;
                        vm.shoppingCart.price533Info = value;
                    }
                );
        }
    }

})();