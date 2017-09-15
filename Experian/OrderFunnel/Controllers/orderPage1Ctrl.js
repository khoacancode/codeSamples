(function () {
    'use strict';

    angular.module('ectOrderFunnel').controller('orderPage1Ctrl', ctrl);
    ctrl.$inject = ['ectLogFty', 'ectInjector.orderOne', 'ectOrderInj', 'ectPageTransitionFty', 'ectSpinnerFty', 'ectRedirectFty', '$modal', 'ectPreloadFty', 'ectDataConfig', 'ectCommonFty', 'ectSessionFty', 'ectAnalyticsFty', 'ectBrandFty', 'ectUrlFty', 'ectOfferContentFty', 'loggingConstants', 'ectSiteConfigInj', 'ectIdFty'];

    function ctrl(ectLogFty, ectInjectorOrderOne, ectOrderInj, ectPageTransitionFty, ectSpinnerFty, ectRedirectFty, $modal, ectPreloadFty, ectDataConfig, ectCommonFty, ectSessionFty, ectAnalyticsFty, ectBrandFty, ectUrlFty, ectOfferContentFty, loggingConstants, ectSiteConfigInj, ectIdFty) {
        var vm = this;
        var submitData;

        activate();

        // #region Initialization Methods
        function initializeForm() {
            // Initialize basic data
            vm.siteData = {};
            vm.siteData.config = {};
            vm.data = {};
            vm.siteData.offer = {};
            vm.siteData.offer.offerCode = "";
            vm.siteData.offerData = {
                title: "&nbsp;",
                mobileTitle: "Secure Checkout Step 1 of 2",
                feature: {}
            };

            vm.idConstants = ectIdFty.getIdConstants();

            //get templates for op1 and the order one directive
            vm.config = { template: ectUrlFty.templates.getOrderOneDirective() };
            vm.op1Template = ectUrlFty.templates.getOrderPageOne();

            // Initialize data for Customer Care Widget 
            vm.customerCare = {};
            vm.customerCare.data = {
                'classes': 'hidden-mobile side-bar-box-curved ' + vm.idConstants.customerCare,
                'phoneText': 'Call us toll-free at',
                'phoneNumber': '',
                'hours': []
            };

            // Initialize the data for the Seals Widget
            vm.seals = {};
            vm.seals.data = {
                'classes': 'hidden-mobile'
            };

            // Initialize variables for email validation
            vm.validation = {
                emailAddress: '',
                isEmailValidated: false
            };

            // Initialize the request information
            vm.request = {
                uri: ectCommonFty.getSiteDomain(),
                pkgid: ectPageTransitionFty.getParameters().pkgid || 'E2NHZ',
                areaid: ectPageTransitionFty.getParameters().areaid || 22,
                sc: ectPageTransitionFty.getParameters().sc || ectBrandFty.getBrand().getDefaultSourceCode(),
                prepop: ectPageTransitionFty.getParameters().prepop || "no",
                custStatusTypeId: '3'
            };

            if (ectPageTransitionFty.getParameters().view == "CCT") {
                vm.request.pkgid = 'CT2FM';
            }

            vm.reportImage = ectCommonFty.getOrderPageImage(vm.request.pkgid, "OP1");

            // Setup Functions
            vm.zipCodeLookup = ectInjectorOrderOne.getZipCodeLookupApi340;
            vm.submit = submit;

            ectOfferContentFty.getOfferContentCtrl(vm.request.pkgid).then(
                 function success(offerPackage) {
                     if (!offerPackage) {
                         //if offer does not exist redirect to homepage
                         catchAllFail('activate:getOfferContent', loggingConstants.errorMsgs.APIERROR, 'No Data');
                     }
                     vm.siteData.offerData.feature = offerPackage.offerFeatures;
                     vm.siteData.offerData.title = offerPackage.pageTitle;
                     vm.siteData.offerData.pageSecurityText = offerPackage.pageSecurityText;
                     vm.siteData.offerData.importantInformation = offerPackage.importantInformation;
                     vm.siteData.offerData.bannerText = offerPackage.bannerText;
                 },
                 function error(err) {
                     catchAllFail('activate:getOfferContent', loggingConstants.errorMsgs.APIERROR, err);
                 }).catch(
                function catchFail(msg) {
                    catchAllFail('activate:getOfferContent', loggingConstants.errorMsgs.CATCHFAIL, msg);
                });
        }

        function activate() {
            try {
                var promiseArray = [];

                // Fire off a check on the client token
                if (!sessionStorage["ClientTokenObject"]) {
                    catchAllFail('activate', 'Token Error', 'No Client Token Present');
                    return;
                }

                // Initialize the form
                initializeForm();

                // Retrieve Prepop data
                if (vm.request.prepop === "yes") {
                    promiseArray.push(ectInjectorOrderOne.getPrePopData().then(
                        function success(value) {
                            vm.data.prePopData = value.data;
                        },
                        function error(err) {
                            catchAllFail("activate:getPrePopData", loggingConstants.errorMsgs.APIERROR, err);
                        }).catch(
                        function catchFail(msg) {
                            catchAllFail("activate:getPrePopData", loggingConstants.errorMsgs.CATCHFAIL, msg);
                        }));
                }

                // Retrieve the Site Config
                promiseArray.push(ectSiteConfigInj.getSiteConfigApi343({
                    'uri': vm.request.uri,
                    'sourcecode': vm.request.sc
                }).then(getSiteConfigApi343Success,
                    function error(err) {
                        catchAllFail("activate:getSiteConfigApi343", loggingConstants.errorMsgs.APIERROR, err);
                    }).catch(
                    function catchFail(msg) {
                        catchAllFail("activate:getSiteConfigApi343", loggingConstants.errorMsgs.CATCHFAIL, msg);
                    }));

                // Retrieve the Offer Information
                promiseArray.push(ectOrderInj.getOfferApi360({
                    'offerCode': vm.request.pkgid,
                    'areaId': vm.request.areaid,
                    'custStatusTypeId': vm.request.custStatusTypeId
                }).then(getOfferApi360Success,
                    function error(err) {
                        catchAllFail("activate:getSiteConfigApi360", loggingConstants.errorMsgs.APIERROR, err);
                    }).catch(
                    function catchFail(msg) {
                        catchAllFail("activate:getSiteConfigApi360", loggingConstants.errorMsgs.CATCHFAIL, msg);
                    }));

                // Kick off the page
                ectSpinnerFty.spinForPromises(promiseArray);
            }
            catch (e) {
                catchAllFail('activate', 'Syntax Error', e);
            }
        };

        // #endregion

        function preloadOP2() {
            // Call the preload factory
            // Preload 343
            ectPreloadFty.executePromiseGet(ectDataConfig.apiInfo.ectApi343, {
                uri: ectCommonFty.getSiteDomain(),
                sourcecode: ectAnalyticsFty.getField('SourceCode')
            });
        }

        function submit(data) {
            submitData = data;

            // Check to see if we need to validate
            if (vm.validation.emailAddress !== data.emailAddress) {
                vm.validation.emailAddress = data.emailAddress;
                vm.validation.isEmailValidated = false;
            }

            // If we have already validated just submit and return
            if (vm.validation.isEmailValidated) {
                submitOrderOne(submitData);
                return;
            }

            // Validate the email
            var emailValidation = ectInjectorOrderOne.postValidateEmailApi520(vm.validation.emailAddress).then(getEmailValidationApi520Success, getEmailValidationApi520Fail).catch(function catchFail(msg) { catchAllFail("submit:postValidateEmailApi520", loggingConstants.errorMsgs.CATCHFAIL, msg); });
            ectSpinnerFty.spinForPromises([emailValidation], 'Processing your request.', 'Please do not navigate away from this page.');
        }

        function submitOrderOne(data) {
            // Save all of the Order Page data in cache
            ectInjectorOrderOne.saveOrderPageData({ config: vm.siteData.config, input: data, offer: vm.siteData.offer }).then(
            function success(value) {
                // Save all of the marketing info
                var marketingInfo = {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email_address: data.emailAddress,
                    get_promo_email: data.yesSendInfo,
                    address: data.currentStreetAddress,
                    city: data.currentCity,
                    state: data.currentState,
                    zip_code: data.currentZipCode,
                    source_code: vm.request.sc,
                    banner_code: ectAnalyticsFty.getField('BannerCode'),
                    package_id: vm.request.pkgid
                }
                var marketingInfoPromise = ectInjectorOrderOne.postSaveMarketingInfoApi103(marketingInfo).then(postSaveMarketingInfoApi103Success, null).catch(function catchFail(msg) { catchAllFail("orderPage1Ctrl-submitOrderOne:postSaveMarketingInfoApi103", loggingConstants.errorMsgs.CATCHFAIL, msg); });
                ectSpinnerFty.spinForPromises([marketingInfoPromise], 'Processing your request.', 'Please do not navigate away from this page.');
            }, function error(err) { catchAllFail("submitOrderOne:saveOrderPageData", "Session Data Save", "Failed to save data") }).catch(function catchFail(msg) { catchAllFail("submitOrderOne:saveOrderPageData", loggingConstants.errorMsgs.CATCHFAIL, msg);
    });
        }

        // #region Promise Callback Methods
        function getAttributeApi341Success(value) {
            vm.customerCare.data.phoneNumber = value[0].value;
            vm.customerCare.data.hours.push(value[1].value);
        }

        function getSiteConfigApi343Success(value) {
            // Save the value
            vm.siteData.config = value;

            // Populate the ECD Object
            ectAnalyticsFty.setField('SourceCode', value.source_code);
            ectAnalyticsFty.setField('SiteID', value.site_id);
            ectAnalyticsFty.setField('SiteVersionID', value.site_version_id);

            // Start preloading OP2 now that we have the new Source Code
            preloadOP2();

            // Populate Attributes
            ectSiteConfigInj.getAttributeApi341({ 'siteVersionId': ectAnalyticsFty.getField('SiteVersionID'), 'attributes': ['CCPhone', 'CCHours'] }).then(getAttributeApi341Success, null).catch(
                function catchFail(msg) {
                    catchAllFail("getSiteConfigApi343Success", loggingConstants.errorMsgs.CATCHFAIL, msg);
                });
        }

        function getOfferApi360Success(value) {
            vm.siteData.offer = value;

            vm.offerPackage = { trialDays: value.initData.trialDuration };
            vm.offerPackage.priceInfo = { originalPrice: value.initData.price, processingFeeAmount: 1 };

            ectAnalyticsFty.setField('CartAreaID', value.areaId);
            ectAnalyticsFty.setField('CartPackageID', value.offerCode);
        }

        function postSaveMarketingInfoApi103Success(value) {
            ectRedirectFty.pageRedirect("orderpage2", false, "credit");
        }

        function getEmailValidationApi520Success(value) {
            vm.validation.isEmailValidated = true;

            // Email has passed validation, submit the form
            if (value.is_valid_email) {
                submitOrderOne(submitData);
            }
            else {
                // Open up the popup
                var modalInstance = $modal.open({
                    templateUrl: 'hermesModal',
                    controller: 'hermesModalCtrl',
                    backdrop: 'static',
                    resolve: {
                        emailAddress: function () {
                            return vm.validation.emailAddress;
                        }
                    }
                });

                // Setup the modal button
                modalInstance.result.then(
                    function okButton() {
                        submitOrderOne(submitData);
                    });
            }
        }

        function getEmailValidationApi520Fail(err) {
            ectLogFty.logException(err, null, { errorType: 'Email Validation Fail', moduleName: 'orderPage1Ctrl', methodName: 'getEmailValidationApi520' });
            submitOrderOne(submitData);
        }

        function catchAllFail(method, errorType, errorMsg) {
            ectLogFty.logException(errorMsg, null, { errorType: errorType, moduleName: 'orderPage1Ctrl', methodName: method });
            ectRedirectFty.pageRedirect("errorcallcc", true, "credit");
        }
        // #endregion
    }
})();