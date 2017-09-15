describe("Reorder: ", function () {
    var ptor, input, button, errors;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/reorder');

        input = {}, error = {};

        input.primaryButton = element(by.css('[ng-class="sanitized.data.buttons.primary.cssClass"]'));
        input.secondaryButton = element(by.css('[ng-class="sanitized.data.buttons.secondary.cssClass"]'));

        input.newCCRadio = element.all(by.model("input.updateCC"));
        input.ccNum = element(by.css('[name="ccNumber"]'));


        //input.newCCRadio = element.all(by.css('[value="1"]'));
        //button.submitAuth = element(by.css('[ng-click="submitData(response)"]'));
        //errors = element.all(by.css(".label-danger"));
        error.ccNumReq = element(by.css('[ng-bind="sanitized.config.ccNumberReqMsg"]'));
        error.ccNumErr = element(by.css('[ng-bind="sanitized.config.ccNumberErrMsg"]'));

        //element(by.cssContainingText('option', 'Visa')).click();


        ptor.sleep(1000);
    });


    it('Various contents should be present on the screen', function () {
        expect(element(by.css(".personalInfo h3")).getText()).toBe("Personal Information");
        expect(element(by.css(".creditCardInfo h3")).getText()).toBe("Credit/Debit Card");

        //expect(element(by.css(".leftCol .ng-binding")).getText()).toBe("Experian Credit Tracker with FICO® Score");
        //expect(element(by.css(".product .rightCol")).getText()).toBe("$0");

        expect(element.all(by.css(".btn-interstitial")).count()).toEqual(2);
        expect(input.primaryButton.getText()).toEqual("NO THANKS, TAKE ME BACK TO MY ACCOUNT");
        expect(input.secondaryButton.getText()).toEqual("SUBMIT SECURE ORDER");
    });

    it('validate credit card fields', function () {
        input.newCCRadio.last().click();
        input.secondaryButton.click();
        expect(element(by.css('[ng-bind="sanitized.config.ccNumberReqMsg"]')).getText()).toBe("Please enter your credit card number.");
        element(by.cssContainingText('option', 'Visa')).click();
        input.ccNum.sendKeys('1234565546546');
        element(by.cssContainingText('option', 'February')).click();
        element(by.cssContainingText('option', '2017')).click();

        expect(error.ccNumErr.isDisplayed()).toBe(true);
        ptor.sleep(2000);
        input.secondaryButton.click();
        input.ccNum.clear();
        input.ccNum.sendKeys('4716975877634352'); //good cc num
        expect(error.ccNumErr.isDisplayed()).toBe(false);
    });

    it('Enter valid credit card and submit', function () {

        element(by.cssContainingText('option', 'Visa')).click();
        input.ccNum.clear();
        input.ccNum.sendKeys('4716975877634352');
        element(by.cssContainingText('option', 'February')).click();
        element(by.cssContainingText('option', '2017')).click();

        input.secondaryButton.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('thankyoureorder');
    });

});

