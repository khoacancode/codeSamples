describe("SignInAssistanceNewPassword tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/SignInAssistanceNewPassword');

        input = {};
        input.password = element(by.model('input.password'));
        input.confirmPassword = element(by.model('input.confirmPassword'));
        input.newUserName = element(by.model('input.newUserName'));
        input.submit = element(by.css('[ng-click="submitButtonClicked()"]'));

        error = {};
        error.passwordReq = element(by.binding('sanitized.config.passwordReqMsg'));
        error.confirmPasswordReq = element(by.binding('sanitized.config.confirmPasswordReqMsg'));

    });

    //first checks to make sure that the title of the page is correct
    //it('should display the correct page title', function () {
    //    expect(ptor.gettitle()).tobe('experian configurator');
    //});


    // check to make sure if submit nothing, there should be no value in any of the output
    it('submit with no input', function () {
        expect(error.passwordReq.isDisplayed()).toBe(false);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(false);
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(true);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(true);
    });

    it('submit with 1 password', function () {
        expect(error.passwordReq.isDisplayed()).toBe(false);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(false);
        input.password.sendKeys('kanatePassword');
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(false);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(true);
    });
    it('submit with just confirmpassword', function () {
        expect(error.passwordReq.isDisplayed()).toBe(false);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(false);
        input.confirmPassword.sendKeys('kanatePassword');
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(true);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(true);
    });

    it('submit with both confirmpassword', function () {
        expect(error.passwordReq.isDisplayed()).toBe(false);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(false);
        input.password.sendKeys('kanatePassword');
        input.confirmPassword.sendKeys('kanatePassword');
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(false);
        expect(error.confirmPasswordReq.isDisplayed()).toBe(false);

    });

});