(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('orderPage2Ctrl', ctrl);
    ctrl.$inject = ['$q', 'ectLogFty', 'ectLocationFty', 'ectInjector.orderTwo', 'ectOrderInj', 'ectDataContextFty', 'ectPageTransitionFty', 'ectSpinnerFty', 'ectRedirectFty', 'ectCommonFty', '$timeout', 'ectOfferContentFty', 'ectAnalyticsFty', 'ectPromotionalsFty', 'loggingConstants', 'ectSiteConfigInj', 'ectIdFty'];

    function ctrl($q, ectLogFty, ectLocationFty, ectInjectorOrderTwo, ectOrderInj, ectDataContextFty, ectPageTransitionFty, ectSpinnerFty, ectRedirectFty, ectCommonFty, $timeout, ectOfferContentFty, ectAnalyticsFty, ectPromotionalsFty, loggingConstants, ectSiteConfigInj, ectIdFty) {
        var vm = this;
        vm.blackBox = 'blackBoxValue';

        // Activate the form
        activate();

        function initializeForm() {
            // Initialize General Data
            ectPageTransitionFty.clearSecureParameters();
            vm.redirect = {};
            vm.siteData = {};
            vm.data = {};
            vm.data.priceInfo = {};
            vm.siteData.offerContent = {};
            vm.ip = "";
            vm.data.usernamePlaceHolder = '';
            vm.data.trulyFreeExperience = ectAnalyticsFty.getField('TrulyFreeCustomer') || ectAnalyticsFty.getField('FreePlusScoreUser');
            vm.orderTwo = {};
            vm.orderTwo.data = {};
            vm.ip = ectCommonFty.getIP();
            vm.showShoppingCart = true;
            vm.promoCode = "";
            vm.idConstants = ectIdFty.getIdConstants();

            // Initialize Offer Data
            vm.siteData.offerData = {
                title: "&nbsp;",
                mobileTitle: "&nbsp;",
                privacy: '',
                paymentInfo: '',
                submitInfo: ''
            };

            // Initialize Customer Care Widget Data  
            vm.customerCare = {};
            ectSiteConfigInj.getAttributeApi341({ 'siteVersionId': ectAnalyticsFty.getField('SiteVersionID'), 'attributes': ['CCPhone', 'CCHours'] }).then(function (value) {
                vm.customerCare.data = {
                    'classes': 'hidden-mobile side-bar-box-curved ' + vm.idConstants.customerCare, // set class for this widget to be hidden on mobile
                    'phoneText': 'Call us Toll-Free at',
                    'hourText': 'Phone & Chat Hours (PST)',
                    'phoneNumber': "",
                    'hours': []
                };
            });

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
                orderDetailShowTax: false,
                idConstants: vm.idConstants
            };
            vm.data.promo = {
                promoValid: true,
                promoStatus: '',
                discountPercent: 0,
            };
            vm.data.isPromotional = false;

            // Setup Function calls
            vm.validatePromo = validatePromo;
            vm.userNameLookUp = ectInjectorOrderTwo.postUserNameLookupApi108;
            vm.submitData = submitData;
        }

        function activate() {
            try {
                // Initialize the form
                initializeForm();

                // Process the black box
                processBlackBox(0);

                ectInjectorOrderTwo.getOrderPageData().then(getOrderPageDataSuccess,
                function error(err) { orderPage2Fail('getOrderPageData', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                function catchFail(msg) { orderPage2Fail('getOrderPageData', loggingConstants.errorMsgs.CATCHFAIL, msg); });
            } catch (e) {
                orderPage2Fail('activate', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }        
        }

        // #region Promise Callback Methods
        function getOrderPageDataSuccess(orderPageData) {
            // Check to ensure that we are pulling back all of the relevant site data
            if (!orderPageData || !orderPageData.EctOpDataConfig || !orderPageData.EctOpDataInput || !orderPageData.EctOpDataOffer) {
                orderPage2Fail('getOrderPageDataSuccess', loggingConstants.errorMsgs.APIERROR, 'No Order Page One Data', 'orderpage1');
                return;
            }

            // Setup OrderOneData
            vm.siteData.orderOneData = {};
            vm.siteData.orderOneData.config = orderPageData.EctOpDataConfig;
            vm.siteData.orderOneData.input = orderPageData.EctOpDataInput;
            vm.siteData.orderOneData.offer = orderPageData.EctOpDataOffer;

            // Grab Username
            vm.data.usernamePlaceHolder = vm.siteData.orderOneData.input.emailAddress;

            // Check for promotional
            vm.data.isPromotional = ectPromotionalsFty.getIsPromotional(vm.siteData.orderOneData.config.site_version_id);
            vm.showShoppingCart = !vm.data.isPromotional;

            // Update Report Image
            vm.reportImage = ectCommonFty.getOrderPageImage(vm.siteData.orderOneData.offer.offerCode, "OP2");

            var promises = [];

            // Build all of our promises
            promises.push(ectOrderInj.getTaxRateApi143(
                {
                    area_id: vm.siteData.orderOneData.offer.areaId,
                    offer_code: vm.siteData.orderOneData.offer.offerCode,
                    city: vm.siteData.orderOneData.input.currentCity,
                    state: vm.siteData.orderOneData.input.currentState,
                    zip_code: vm.siteData.orderOneData.input.currentZipCode,
                    sourceCode: vm.siteData.orderOneData.config.source_code
                }, { cache: false }).then(getTaxRateApi143Success,
                function error(err) { orderPage2Fail('spinnerOrderPageDataSuccess:getTaxRateApi143', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                function catchFail(msg) { orderPage2Fail('spinnerOrderPageDataSuccess:getTaxRateApi143', loggingConstants.errorMsgs.CATCHFAIL, msg); }));

            promises.push(ectSiteConfigInj.getSiteConfigApi343(
                {
                    uri: ectCommonFty.getSiteDomain(),
                    sourcecode: vm.siteData.orderOneData.config.source_code
                }).then(getSiteConfigApi343Success,
                function error(err) { orderPage2Fail('spinnerOrderPageDataSuccess:getSiteConfigApi343', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                function catchFail(msg) { orderPage2Fail('spinnerOrderPageDataSuccess:getSiteConfigApi343', loggingConstants.errorMsgs.CATCHFAIL, msg); }));

            promises.push(ectSiteConfigInj.getAttributeApi341(
                {
                    siteVersionId: vm.siteData.orderOneData.config.site_version_id,
                    attributes: ['CCPhone', 'CCHours']
                }).then(getAttributeApi341Success,
                function error(err) { orderPage2Fail('spinnerOrderPageDataSuccess:getAttributeApi341', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                function catchFail(msg) { orderPage2Fail('spinnerOrderPageDataSuccess:getAttributeApi341', loggingConstants.errorMsgs.CATCHFAIL, msg); }));

            if (vm.siteData.orderOneData.offer.offerCode == 'E3FDZ') {
                promises.push(ectOrderInj.getTaxRateApi143(
                    {
                        area_id: 102,
                        offer_code: 'E3NHZ',
                        city: vm.siteData.orderOneData.input.currentCity,
                        state: vm.siteData.orderOneData.input.currentState,
                        zip_code: vm.siteData.orderOneData.input.currentZipCode,
                        sourceCode: vm.siteData.orderOneData.config.source_code
                    }, { cache: false }).then(get533TaxRateApi143Success,
                    function error(err) { orderPage2Fail('spinnerOrderPageDataSuccess:get533TaxRateApi143', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                    function catchFail(msg) { orderPage2Fail('spinnerOrderPageDataSuccess:get533TaxRateApi143', loggingConstants.errorMsgs.CATCHFAIL, msg); }));
            }
            else if (vm.siteData.orderOneData.offer.offerCode == 'E3FNT') {
                promises.push(ectOrderInj.getTaxRateApi143(
                    {
                        area_id: 22,
                        offer_code: 'E3FEX',
                        city: vm.siteData.orderOneData.input.currentCity,
                        state: vm.siteData.orderOneData.input.currentState,
                        zip_code: vm.siteData.orderOneData.input.currentZipCode,
                        sourceCode: vm.siteData.orderOneData.config.source_code
                    }, { cache: false }).then(get533TaxRateApi143Success,
                    function error(err) { orderPage2Fail('spinnerOrderPageDataSuccess:get533TaxRateApi143', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                    function catchFail(msg) { orderPage2Fail('spinnerOrderPageDataSuccess:get533TaxRateApi143', loggingConstants.errorMsgs.CATCHFAIL, msg); }));
            }

            // Spin for promises
            ectSpinnerFty.spinForPromises(promises,
                                            'Processing your request.',
                                            'Please do not navigate away from this page.',
                                            spinnerAPI143Api343Api341Success,
                                            function error(err) { orderPage2Fail('spinnerOrderPageDataSuccess:spinForPromises', loggingConstants.errorMsgs.APIERROR, err, 'errorCallCC'); },
                                            true);
        }

        function getTaxRateApi143Success(value) {
            try {
                // For some reason if you don't use initdata here, you get an error.
                vm.data.priceInfo = value.initData;
                vm.shoppingCart.priceInfo = value.initData;
            } catch (e) {
                orderPage2Fail('getTaxRateApi143Success', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }
        }

        function get533TaxRateApi143Success(value) {
            try {
                vm.data.price533Info = value.initData;
                vm.shoppingCart.price533Info = value.initData;
            } catch (e) {
                orderPage2Fail('get533TaxRateApi143Success', logging.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }
        }

        function getSiteConfigApi343Success(value) {
            try {
                vm.siteData.config = value;
            } catch (e) {
                orderPage2Fail('getSiteConfigApi343Success', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }            
        }

        function getAttributeApi341Success(value) {
            try {
                vm.customerCare.data.phoneNumber = value[0].value;
                vm.customerCare.data.hours.push(value[1].value);
            } catch (e) {
                orderPage2Fail('getAttributeApi341Success', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }
        }

        function spinnerAPI143Api343Api341Success(value) {
            try {
                ectInjectorOrderTwo.getOp2OfferContentNoApi({
                    offer: vm.siteData.orderOneData.offer,
                    priceInfo: vm.data.priceInfo,
                    input: vm.siteData.orderOneData.input,
                    trulyFreeExperience: vm.data.trulyFreeExperience,
                    privacy: vm.data.privacy
                }).then(getOp2OfferContentNoApiSuccess,
                function error(err) { orderPage2Fail('spinnerAPI143Api343Api341Success:getOp2OfferContentNoApi', loggingConstants.errorMsgs.APIERROR, err); }).catch(
                function catchFail(msg) { orderPage2Fail('spinnerAPI143Api343Api341Success:getOp2OfferContentNoApi', loggingConstants.errorMsgs.CATCHFAIL, msg); });
            } catch (e) {
                orderPage2Fail('spinnerAPI143Api343Api341Success', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }           
        }

        function getOp2OfferContentNoApiSuccess(value) {
            try {
                if (!value) {
                    orderPage2Fail('getOp2OfferContentNoApiSuccess', loggingConstants.errorMsgs.APIERROR, 'No Data Returned');
                    return;
                }

                vm.shoppingCart.orderDetailOffer = value.offerPackage.packageDescription;
                vm.shoppingCart.orderDetailDisclaimer = value.offerPackage.shoppingCartDisclaimer;
                vm.shoppingCart.trialDays = value.trialDays;
                vm.shoppingCart.orderDetailOfferPrice = value.shoppingCart.orderDetailOfferPrice;
                vm.shoppingCart.orderDetailOfferTotal = value.shoppingCart.orderDetailOfferTotal;
                vm.shoppingCart.orderDetailShowTax = value.shoppingCart.orderDetailShowTax;
                vm.shoppingCart.orderDetailTax = value.shoppingCart.orderDetailTax;
                vm.siteData.offerData.title = value.offerPackage.pageTitle;
                vm.siteData.sideDisclaimer = value.siteData.sideDisclaimer;
                vm.data.privacy = value.privacy;
                vm.data.submitInfo = value.offerPackage.submitText;
                vm.data.trialDays = value.trialDays;
                vm.siteData.offerData.pageSecurityText = value.offerPackage.pageSecurityText;
                vm.data.VerificationInfoText = value.offerPackage.VerificationInfoText;
                vm.data.SignInInfoText = value.offerPackage.SignInInfoText;
                vm.data.paymentInfo = value.paymentInfo;
                vm.shoppingCart.orderDetailOfferPromo = value.shoppingCart.orderDetailOfferPromo
                vm.shoppingCart.orderDetailOfferPromoPrice = value.shoppingCart.orderDetailOfferPromoPrice;
            } catch (e) {
                orderPage2Fail('getOp2OfferContentNoApiSuccess', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }           
        }

        function getPromoInfoApi144Success(data, value) {
            try {
                if (value.is_valid && value.discount_percentage == "100") {
                    vm.data.promo.promoValid = true;
                    vm.data.promo.promoStatus = 'Valid Code';
                    vm.promoCode = data.promotion_code;
                    vm.submitData();
                } else {
                    ectSpinnerFty.hideSpinner();
                    vm.data.promo.disableSubmit = false;
                    vm.data.promo.promoValid = false;
                }
            } catch (e) {
                vm.data.promo.disableSubmit = false;
                vm.data.promo.promoValid = false;
                orderPage2Fail('getPromoInfoApi144Success', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }        
        }

        function postCreateCustomerApi100Success(value) {
            try {
                var homeComing = false;
                if (value.processFlowStep === "HomecomingNonTrial" || value.processFlowStep == "HomecomingTrial") {
                    homeComing = true;
                };
                var orderTwoData = {
                    offer: vm.siteData.orderOneData.offer,
                    config: vm.siteData.orderOneData.config,
                    loginInfo: {
                        userName: vm.input.userName,
                        password: vm.input.password,
                        firstName: vm.siteData.orderOneData.input.firstName,
                        lastFourDigitSsn: vm.input.SSN.slice(-4)
                    },
                    taxInfo: {
                        city: vm.siteData.orderOneData.input.currentCity,
                        state: vm.siteData.orderOneData.input.currentState,
                        zipCode: vm.siteData.orderOneData.input.currentZipCode,
                        sourceCode: vm.siteData.orderOneData.config.source_code
                    },
                    homeComing: homeComing,
                    promoCode: vm.promoCode,
                    signUpReason: vm.siteData.orderOneData.input.signUpReason,
                    customerIntentId: vm.siteData.orderOneData.input.customerIntentId,
                };
                ectPageTransitionFty.setSecureParameter('orderTwoData', orderTwoData);

                if (value.processFlowStep === "HomecomingNonTrial") {
                    //ectRedirectFty.pageRedirect("swapoffer", false, "credit");
                    ectRedirectFty.pageRedirect('errorCallCC', false, "credit");
                } else {
                    ectRedirectFty.pageRedirect("processing", false, "credit");
                };
            } catch (e) {
                orderPage2Fail('postCreateCustomerApi100Success', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }
            
        }
        // #endregion

        // #region Promise Fails
        function orderPage2Fail(method, errorType, err, pageRedirect) {
            ectSpinnerFty.hideSpinner();
            ectLogFty.logException(err, null, { errorType: errorType, moduleName: 'orderPage2Ctrl', methodName: method });

            if (pageRedirect) {
                if (pageRedirect === 'orderpage1') {
                    if (ectLocationFty.hasPreviousLocation('orderpage1')) {
                        ectRedirectFty.redirectToSpecificUrl(ectLocationFty.getPreviousLocation('orderpage1'));
                    }
                    else {
                        window.location = "/";
                    }
                }
                else {
                    ectRedirectFty.pageRedirect(pageRedirect);
                }
            }
        }

        function postCreateCustomerApi100Error(err) {
            orderPage2Fail('submitData', loggingConstants.errorMsgs.APIERROR, err, 'errorCallCC');
            //var homeComingErrorSteps = ['Login', 'HomecomingTrial', 'HomecomingNonTrial'];
            var homeComingErrorSteps = ['Login', 'HomecomingTrial'];
            var step = err[0].processFlowStep;
            if ($.inArray(step, homeComingErrorSteps) !== -1) {
                step = 'login-existinguser';
                ectRedirectFty.pageRedirect(step);
            }
            else {
                ectRedirectFty.pageRedirect('errorCallCC');
            }
        }
        // #endregion

        // #region Function Calls
        function validatePromo(inputCode) {
            try {
                // Setup the data
                var data = {
                    source_code: ectAnalyticsFty.getField('SourceCode'),
                    promotion_code: inputCode,
                    area_id: vm.siteData.orderOneData.offer.areaId,
                    offer_code: vm.siteData.orderOneData.offer.offerCode,
                };

                // Spin for promises
                var getPromoInfoApi144Promise = ectInjectorOrderTwo.getPromoInfoApi144(data).then(
                                                function (value) {
                                                    getPromoInfoApi144Success(data, value);
                                                },
                                                function error(err) {
                                                    vm.data.promo.disableSubmit = false;
                                                    vm.data.promo.promoStatus = 'Invalid Code';
                                                    orderPage2Fail('validatePromo', loggingConstants.errorMsgs.APIERROR, err, 'errorCallCC');
                                                }).catch(
                                                function catchFail(msg) {
                                                    vm.data.promo.disableSubmit = false;
                                                    vm.data.promo.promoStatus = 'Invalid Code';
                                                    orderPage2Fail('validatePromo', loggingConstants.errorMsgs.CATCHFAIL, msg);
                                                });

                ectSpinnerFty.spinForPromises([getPromoInfoApi144Promise], 'Processing your request.', 'Please do not navigate away from this page.', null, null, true);
            } catch (e) {
                orderPage2Fail('validatePromo', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }          
        }

        function submitData() {
            try {
                var customerInfo = {
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
                    customer_ip_address: vm.ip,
                    offer_ordered: vm.siteData.orderOneData.offer.offerCode,
                    offer_ordered_area_id: vm.siteData.orderOneData.offer.areaId,
                    source_code: vm.siteData.orderOneData.config.source_code
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

                if (vm.data.trulyFreeExperience || vm.data.isPromotional) {
                    var customerAccount = {
                        username: vm.input.userName,
                        site_id: vm.siteData.orderOneData.config.site_id,
                        entity_id: vm.siteData.orderOneData.config.entity_id,
                        opt_email: vm.siteData.orderOneData.input.yesSendInfo                   
                    };
                    customerInfo.customer_account = customerAccount;
                }
            
       


                // Spin for promises
                var postCreateCustomerApi100 = ectInjectorOrderTwo.postCreateCustomerApi100(customerInfo).then(postCreateCustomerApi100Success,
                                                postCreateCustomerApi100Error).catch(
                                                function catchFail(msg) { orderPage2Fail('submitData', loggingConstants.errorMsgs.CATCHFAIL, msg); });

                ectSpinnerFty.spinForPromises([postCreateCustomerApi100], 'Processing your request.', 'Please do not navigate away from this page.', null, null, true);
            } catch (e) {
                orderPage2Fail('submitData', loggingConstants.errorMsgs.SYNTAXERROR, e, 'errorCallCC');
            }           
        }

        function processBlackBox(bb_count) {
            var io_install_stm = false;
            var io_exclude_stm = 12;
            var io_install_flash = false;
            var io_enable_rip = true;
            try {
                var bb_data = ioGetBlackbox();
                if (bb_data.finished || bb_count > 10) {
                    vm.blackBox = bb_data.blackbox;
                    return;
                }
                $timeout(function () { processBlackBox(bb_count + 1); }, 250);
            }
            catch (ex) {
                orderPage2Fail('processBlackBox', loggingConstants.errorMsgs.SYNTAXERROR, ex, 'errorCallCC');
            }
        }
        // #endregion

    }
})();
