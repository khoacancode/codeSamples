describe("Legal pages tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/Credit#/orderpage1');
        ptor.ignoreSynchronization = true;

        input = {};
        input.termsLink = element(by.css('[data-target="#termsAndConditionsContent"]'));
        input.privacyLink = element(by.css('[data-target="#privacyPolicyContent"]'));
        input.adTargetingLink = element(by.css('[data-target="#adTargetingPolicyContent"]'));

        modal = {};
        modal.termsContainer = element(by.id('termsAndConditionsContent'));
        modal.privacyContainer = element(by.id('privacyPolicyContent'));
        modal.adTargetingContainer = element(by.id('adTargetingPolicyContent'));

        container = {};
        container.termsHeading = element(by.id('termsHeading'));
        container.privacyHeading = element(by.id('privacyHeading'));
        container.adTargetingHeading = element(by.id('adTargetingHeading'));

    });

    // load order1 page and expect that modals do not display.

    it(' - (1) - load order1 page and expect that modals do not display.', function () {

        ptor.sleep(2000);
        expect(modal.termsContainer.isDisplayed()).toBeFalsy();
        expect(modal.privacyContainer.isDisplayed()).toBeFalsy();
        expect(modal.adTargetingContainer.isDisplayed()).toBeFalsy();

    });

    // click on Terms and Conditions link in footer and expect modal to be visible.

    it(' - (2) - click on Terms and Conditions link in footer and expect modal to be visible, and other modals not visible.', function () {

        //open the modal
        input.termsLink.click();

        ptor.sleep(2000);
        expect(modal.termsContainer.isDisplayed()).toBeTruthy();
        expect(modal.privacyContainer.isDisplayed()).toBeFalsy();
        expect(modal.adTargetingContainer.isDisplayed()).toBeFalsy();

        //Check content
        expect(container.termsHeading.isDisplayed()).toBeTruthy();
        expect(container.termsHeading.getText()).toContain('Terms And Conditions');

        //close the modal
        ptor.sleep(2000);
        modal.termsContainer.$('.close').click();
        ptor.sleep(1000);
        expect(modal.termsContainer.isDisplayed()).toBeFalsy();

    });

    // click on Privacy Policy link in footer and expect modal to be visible.

    it(' - (3) - click on privacy policy link in footer and expect modal to be visible, and other modals not visible.', function () {

        //open the modal
        input.privacyLink.click();

        ptor.sleep(2000);
        expect(modal.privacyContainer.isDisplayed()).toBeTruthy();
        expect(modal.termsContainer.isDisplayed()).toBeFalsy();
        expect(modal.adTargetingContainer.isDisplayed()).toBeFalsy();

        //Check content
        expect(container.privacyHeading.isDisplayed()).toBeTruthy();
        expect(container.privacyHeading.getText()).toContain('Privacy Policy');

        //close the modal
        ptor.sleep(2000);
        modal.privacyContainer.$('.close').click();
        ptor.sleep(1000);
        expect(modal.privacyContainer.isDisplayed()).toBeFalsy();

    });

    // click on Ad Targeting Policy link in footer and expect modal to be visible.

    it(' - (4) - click on ad targeting policy link in footer and expect modal to be visible, and other modals not visible.', function () {

        input.adTargetingLink.click();

        ptor.sleep(2000);
        expect(modal.adTargetingContainer.isDisplayed()).toBeTruthy();
        expect(modal.termsContainer.isDisplayed()).toBeFalsy();
        expect(modal.privacyContainer.isDisplayed()).toBeFalsy();

        //Check content
        expect(container.adTargetingHeading.isDisplayed()).toBeTruthy();
        expect(container.adTargetingHeading.getText()).toContain('Ad Targeting Policy');

        //close the modal
        ptor.sleep(2000);
        modal.adTargetingContainer.$('.close').click();
        ptor.sleep(1000);
        expect(modal.adTargetingContainer.isDisplayed()).toBeFalsy();

    });

});