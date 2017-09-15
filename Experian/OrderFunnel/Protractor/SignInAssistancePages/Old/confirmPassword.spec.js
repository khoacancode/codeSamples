describe("SignInAssistanceConfirmPassword tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/SignInAssistanceConfirmPassword');

        input = {};
        input.password = element(by.model('input.password'));
        input.submit = element(by.css('[ng-click="submitButtonClicked()"]'));

        error = {};
        error.passwordReq = element(by.binding('sanitized.config.passwordReqMsg'));

    });

    //first checks to make sure that the title of the page is correct
    //it('should display the correct page title', function () {
    //    expect(ptor.gettitle()).tobe('experian configurator');
    //});


    // check to make sure if submit nothing, there should be no value in any of the output
    it('submit with no input', function () {
        expect(error.passwordReq.isDisplayed()).toBe(false);
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(true);
    });

    it('submit with password', function () {
        expect(error.passwordReq.isDisplayed()).toBe(false);
        input.password.sendKeys('kanate password');
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(false);
    });

});