describe("SignInAssistanceSecurityQuestions tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/SignInAssistanceSecurityQuestions');

        input = {};
        input.firstAnswer = element(by.model('input.firstAnswer'));
        input.secondAnswer = element(by.model('input.secondAnswer'));
        input.submit = element(by.css('[ng-click="submitButtonClicked()"]'));

        error = {};
        error.firstAnswerReq = element(by.binding('sanitized.config.firstSecurityQuestionReqMsg'));
        error.secondAnswerReq = element(by.binding('sanitized.config.secondSecurityQuestionReqMsg'));

     });

    //first checks to make sure that the title of the page is correct
    //it('should display the correct page title', function () {
    //    expect(ptor.gettitle()).tobe('experian configurator');
    //});


    // check to make sure if submit nothing, there should be no value in any of the output
    it('submit with no input', function () {
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        input.submit.click();
        expect(error.firstAnswerReq.isDisplayed()).toBe(true);
        expect(error.secondAnswerReq.isDisplayed()).toBe(true);
    });

    it('submit with 1st input', function () {
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        input.firstAnswer.sendKeys('test 1st');
        input.submit.click();
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(true);
    });


    it('submit with 2nd input', function () {
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        input.secondAnswer.sendKeys('test 2nd');
        input.submit.click();
        expect(error.firstAnswerReq.isDisplayed()).toBe(true);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
    });

    it('submit all input', function () {
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        input.firstAnswer.sendKeys('test 1st');
        input.secondAnswer.sendKeys('test 2nd');
        input.submit.click();
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
    });

});