describe("Swap Offer - Ordercomplete Thank You tests", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/CreditCardRecovery');

        input = {};
        input.cardNumber = element(by.model('input.cardNumber'));
        input.expMonth = element(by.model('input.expDateMonth'));
        input.expYear = element(by.model('input.expDateYear'));
        input.submit = element(by.css('[ng-click="submitButtonClicked()"]'));
        input.cancel = element(by.css('[ng-click="cancelButtonClicked()"]'));

        validation = {};
        validation.cardNumberReq = element(by.binding('sanitized.config.cardNumberReqMsg'));
        validation.cardNumberErr = element(by.binding('sanitized.config.cardNumberErrMsg'));

    });

    //first checks to make sure that the title of the page is correct
    //it('should display the correct page title', function () {
    //expect(ptor.getTitle()).toBe('Experian Configurator');
    //});

    // check to make sure if submit nothing, there should be no value in any of the output
    it(' - (1) - submit with no input', function () {
        input.submit.click();
        expect(validation.cardNumberReq.isDisplayed()).toBeTruthy();
        expect(validation.cardNumberErr.isDisplayed()).toBeFalsy();
    });
    // submit invalid card number and check that the data is not submitted
    it(' - (2) - submit with invalid card number and check that error validation is displayed', function () {
        input.cardNumber.sendKeys('foobar');
        input.submit.click();
        expect(validation.cardNumberErr.isDisplayed()).toBeTruthy();
        expect(validation.cardNumberReq.isDisplayed()).toBeFalsy();
    });

    // check correct form fill for all fields
    it(' - (3) - submit correct input all fields, expect no validation messages displayed', function () {
        input.cardNumber.sendKeys('411111111111111')
        input.expMonth.$('[value="10"]').click();
        input.expYear.$('[value="2016"]').click();
        input.submit.click();
        expect(validation.cardNumberReq.isDisplayed()).toBeFalsy();
        expect(validation.cardNumberErr.isDisplayed()).toBeFalsy();
    });

});