describe("SignInAssistancePersonalInformation tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/ForgotSign-In');
        ptor.ignoreSynchronization = true;

        input = {};
        input.firstName = element(by.model('input.firstName'));
        input.lastName = element(by.model('input.lastName'));
        input.dateOfBirthMonth = element(by.model('input.dateOfBirthMonth'));
        input.dateOfBirthDay = element(by.model('input.dateOfBirthDay'));
        input.dateOfBirthYear = element(by.model('input.dateOfBirthYear'));
        input.ssn = element(by.model('input.ssn'));
        input.submit = element(by.css('[ng-click="submitButtonClicked()"]'));

        input.firstAnswer = element(by.model('input.firstAnswer'));
        input.secondAnswer = element(by.model('input.secondAnswer'));

        input.password = element(by.model('input.password'));
        input.confirmPassword = element(by.model('input.confirmPassword'));
        input.confirmPasswordLink = element(by.css('.next-step-link'));
        input.newUserName = element(by.model('input.newUserName'));
        error = {};
        error.firstNameReq = element(by.binding('sanitized.config.firstNameReqMsg'));
        error.lastNameReq = element(by.binding('sanitized.config.lastNameReqMsg'));
        error.dateOfBirthMonthReq = element(by.binding('sanitized.config.dateOfBirthMonthReqMsg'));
        error.dateOfBirthDayReq = element(by.binding('sanitized.config.dateOfBirthDayReqMsg'));
        error.dateOfBirthYearReq = element(by.binding('sanitized.config.dateOfBirthYearReqMsg'));
        error.ssnReq = element(by.binding('sanitized.config.SSNReqMsg'));
        error.personalInfoFailMessage = element(by.css('[ng-if="vm.failCount < vm.attribute.maxRetry"]'));

        error.firstAnswerReq = element(by.binding('sanitized.config.firstSecurityQuestionReqMsg'));
        error.secondAnswerReq = element(by.binding('sanitized.config.secondSecurityQuestionReqMsg'));
        error.securityQuestionsFailMessage = element(by.css('[ng-if="vm.hasAttributes && vm.failCount"]'));

        error.passwordReq = element(by.binding('sanitized.config.passwordReqMsg'));
        error.confirmPasswordFailMessage = element(by.css('[ng-if="vm.failCount"]'));
        
        
           

    });

    //first checks to make sure that the title of the page is correct
    //it('should display the correct page title', function () {
    //    expect(ptor.gettitle()).tobe('experian configurator');
    //});


    // check to make sure if submit nothing, there should be no value in any of the output
    it('submit with no input', function () {
        ptor.sleep(2000);
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);
        input.submit.click();
        expect(error.firstNameReq.isDisplayed()).toBe(true);
        expect(error.lastNameReq.isDisplayed()).toBe(true);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(true);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(true);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(true);
        expect(error.ssnReq.isDisplayed()).toBe(true);
    });
    
    it('go to Security Question', function () {
        ptor.sleep(2000);
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);
        // wrong info
        input.firstName.sendKeys('Kanate');
        input.lastName.sendKeys('Ung');
        element(by.cssContainingText('option', 'November')).click();
        element(by.cssContainingText('option', '13')).click();
        element(by.cssContainingText('option', '1978')).click();
        input.ssn.sendKeys('1234');
        input.submit.click();
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);
        expect(error.personalInfoFailMessage.isDisplayed()).toBe(true);

        // good info
        input.firstName.clear();
        input.firstName.sendKeys('Dan');
        input.lastName.clear();
        input.lastName.sendKeys('Etler');
        element(by.cssContainingText('option', 'January')).click();
        element(by.cssContainingText('option', '1')).click();
        element(by.cssContainingText('option', '1970')).click();
        input.ssn.clear();
        input.ssn.sendKeys('1416');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ForgotSign-InSecurity');
    });


    it('go to Confirm Password', function () {
        ptor.sleep(2000);
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);

        // good info
        input.firstName.clear();
        input.firstName.sendKeys('Dan');
        input.lastName.clear();
        input.lastName.sendKeys('Etler');
        element(by.cssContainingText('option', 'January')).click();
        element(by.cssContainingText('option', '1')).click();
        element(by.cssContainingText('option', '1970')).click();
        input.ssn.clear();
        input.ssn.sendKeys('1416');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ForgotSign-InSecurity');
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        input.submit.click();
        expect(error.firstAnswerReq.isDisplayed()).toBe(true);
        expect(error.secondAnswerReq.isDisplayed()).toBe(true);
        // wrong answers
        input.firstAnswer.sendKeys('test1');
        input.secondAnswer.sendKeys('test2');
        input.submit.click();
        ptor.sleep(2000);
        expect(error.securityQuestionsFailMessage.isDisplayed()).toBe(true);
        // good info
        input.firstAnswer.clear();
        input.firstAnswer.sendKeys('maiden');
        input.secondAnswer.clear();
        input.secondAnswer.sendKeys('von karman');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('Confirm-Password');
    });
    
    it('go to Confirm Password', function () {
        ptor.sleep(2000);
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);

        // good info
        input.firstName.clear();
        input.firstName.sendKeys('Dan');
        input.lastName.clear();
        input.lastName.sendKeys('Etler');
        element(by.cssContainingText('option', 'January')).click();
        element(by.cssContainingText('option', '1')).click();
        element(by.cssContainingText('option', '1970')).click();
        input.ssn.clear();
        input.ssn.sendKeys('1416');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ForgotSign-InSecurity');
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        // good info
        input.firstAnswer.clear();
        input.firstAnswer.sendKeys('maiden');
        input.secondAnswer.clear();
        input.secondAnswer.sendKeys('von karman');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('Confirm-Password');
        expect(error.passwordReq.isDisplayed()).toBe(false);
        input.submit.click();
        expect(error.passwordReq.isDisplayed()).toBe(true);
        // wrong password
        input.password.sendKeys('123456');
        input.submit.click();
        ptor.sleep(2000);
        expect(error.confirmPasswordFailMessage.isDisplayed()).toBe(true);
        // good password
        input.password.clear();
        input.password.sendKeys('password');
        input.submit.click();
        //ptor.sleep(2000);
        //expect(ptor.getCurrentUrl()).toContain('Member');
    });


    it('go to Confirm Password', function () {
        ptor.sleep(2000);
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);

        // good info
        input.firstName.clear();
        input.firstName.sendKeys('Dan');
        input.lastName.clear();
        input.lastName.sendKeys('Etler');
        element(by.cssContainingText('option', 'January')).click();
        element(by.cssContainingText('option', '1')).click();
        element(by.cssContainingText('option', '1970')).click();
        input.ssn.clear();
        input.ssn.sendKeys('1416');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ForgotSign-InSecurity');
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        // good info
        input.firstAnswer.clear();
        input.firstAnswer.sendKeys('maiden');
        input.secondAnswer.clear();
        input.secondAnswer.sendKeys('von karman');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('Confirm-Password');
        input.confirmPasswordLink.click();
        expect(ptor.getCurrentUrl()).toContain('CreateNewPassword');
        input.password.sendKeys('password');
        input.confirmPassword.sendKeys('password');
        input.submit.click();
        // check if not createnewpassword anymore
    });

    it('go to Confirm Password', function () {
        ptor.sleep(2000);
        expect(error.firstNameReq.isDisplayed()).toBe(false);
        expect(error.lastNameReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthMonthReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthDayReq.isDisplayed()).toBe(false);
        expect(error.dateOfBirthYearReq.isDisplayed()).toBe(false);
        expect(error.ssnReq.isDisplayed()).toBe(false);

        // good info
        input.firstName.clear();
        input.firstName.sendKeys('Dan');
        input.lastName.clear();
        input.lastName.sendKeys('Etler');
        element(by.cssContainingText('option', 'January')).click();
        element(by.cssContainingText('option', '1')).click();
        element(by.cssContainingText('option', '1970')).click();
        input.ssn.clear();
        input.ssn.sendKeys('1416');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ForgotSign-InSecurity');
        expect(error.firstAnswerReq.isDisplayed()).toBe(false);
        expect(error.secondAnswerReq.isDisplayed()).toBe(false);
        // good info
        input.firstAnswer.clear();
        input.firstAnswer.sendKeys('maiden');
        input.secondAnswer.clear();
        input.secondAnswer.sendKeys('von karman');
        input.submit.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('Confirm-Password');
        input.confirmPasswordLink.click();
        expect(ptor.getCurrentUrl()).toContain('CreateNewPassword');
        input.password.sendKeys('password');
        input.confirmPassword.sendKeys('password');
        input.newUserName.sendKeys('danetler');
        input.submit.click();
        // check if not createnewpassword anymore
    });
});