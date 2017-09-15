describe("Order Two tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/');


        input = {};
        //Order one info
        input.orderOne = {};
        input.orderOne.firstName = element(by.model('input.firstName'));
        input.orderOne.middleInitial = element(by.model('input.middleInitial'));
        input.orderOne.lastName = element(by.model('input.lastName'));
        input.orderOne.generation = element(by.model('input.generation'));
        input.orderOne.emailAddress = element(by.model('input.emailAddress'));
        input.orderOne.yesSendInfo = element(by.model('input.yesSendInfo'));
        input.orderOne.currentStreetAddress = element(by.model('input.currentStreetAddress'));
        input.orderOne.currentApartment = element(by.model('input.currentApartment'));
        input.orderOne.currentZipCode = element(by.model('input.currentZipCode'));
        input.orderOne.currentCity = element(by.model('input.currentCity'));
        input.orderOne.currentState = element(by.model('input.currentState'));
        input.orderOne.hasPreviousAddress = element.all(by.model('input.hasPreviousAddress'));
        input.orderOne.previousStreetAddress = element(by.model('input.previousStreetAddress'));
        input.orderOne.previousApartment = element(by.model('input.previousApartment'));
        input.orderOne.previousZipCode = element(by.model('input.previousZipCode'));
        input.orderOne.previousCity = element(by.model('input.previousCity'));
        input.orderOne.previousState = element(by.model('input.previousState'));
        input.orderOne.signUpReason = element(by.model('input.signUpReason'));
        input.orderOne.otherText = element(by.model('input.otherText'));
        input.orderOne.submitData = element(by.css('[ng-click="submitButtonClicked()"]'));

        //OrderTwo info
        input.SSN1 = element(by.model('input.SSN1'));
        input.SSN2 = element(by.model('input.SSN2'));
        input.SSN3 = element(by.model('input.SSN3'));
        input.dateOfBirthMonth = element(by.model('input.dateOfBirthMonth'));
        input.dateOfBirthDay = element(by.model('input.dateOfBirthDay'));
        input.dateOfBirthYear = element(by.model('input.dateOfBirthYear'));
        input.userName = element(by.model('input.userName'));
        input.password = element(by.model('input.password'));
        input.confirmPassword = element(by.model('input.confirmPassword'));
        input.ccNumber = element(by.model('input.ccNumber'));
        input.ccExpMonth = element(by.model('input.ccExpMonth'));
        input.ccExpYear = element(by.model('input.ccExpYear'));
        input.submitData = element(by.css('[ng-click="submitDataClicked()"]'));

        error = {};
        error.SSN1Required = element(by.css('[ng-bind="sanitized.config.SSN1ReqMsg"]'));
        error.SSN2Required = element(by.css('[ng-bind="sanitized.config.SSN2ReqMsg"]'));
        error.SSN3Required = element(by.css('[ng-bind="sanitized.config.SSN3ReqMsg"]'));
        error.dateOfBirthMonthRequired = element(by.css('[ng-bind="sanitized.config.dateOfBirthMonthReqMsg"]'));
        error.dateOfBirthDayRequired = element(by.css('[ng-bind="sanitized.config.dateOfBirthDayReqMsg"]'));
        error.dateOfBirthYearRequired = element(by.css('[ng-bind="sanitized.config.dateOfBirthYearReqMsg"]'));
        error.userNameRequired = element(by.css('[ng-bind="sanitized.config.userNameReqMsg"]'));
        error.passwordRequired = element(by.css('[ng-bind="sanitized.config.passwordReqMsg"]'));
        error.confirmPasswordRequired = element(by.css('[ng-bind="sanitized.config.confirmPasswordReqMsg"]'));
        error.ccNumberRequired = element(by.css('[ng-bind="sanitized.config.ccNumberReqMsg"]'));
        error.ccExpMonthRequired = element(by.css('[ng-bind="sanitized.config.ccExpMonthReqMsg"]'));
        error.ccExpYearRequired = element(by.css('[ng-bind="sanitized.config.ccExpYearReqMsg"]'));

        error.SSN1Error = element(by.css('[ng-bind="sanitized.config.SSN1ErrMsg"]'));
        error.SSN2Error = element(by.css('[ng-bind="sanitized.config.SSN2ErrMsg"]'));
        error.SSN3Error = element(by.css('[ng-bind="sanitized.config.SSN3ErrMsg"]'));
        error.dateOfBirthMonthError = element(by.css('[ng-bind="sanitized.config.dateOfBirthMonthErrMsg"]'));
        error.dateOfBirthDayError = element(by.css('[ng-bind="sanitized.config.dateOfBirthDayErrMsg"]'));
        error.dateOfBirthYearError = element(by.css('[ng-bind="sanitized.config.dateOfBirthYearErrMsg"]'));
        error.userNameError = element(by.css('[ng-bind="sanitized.config.userNameErrMsg"]'));
        error.passwordError = element(by.css('[ng-bind="sanitized.config.passwordErrMsg"]'));
        error.confirmPasswordError = element(by.css('[ng-show="orderTwoForm.confirmPassword.$error.ecsCompareDir"]'));
        error.ccNumberError = element(by.css('[ng-bind="sanitized.config.ccNumberErrMsg"]'));
        error.ccExpMonthError = element(by.css('[ng-bind="sanitized.config.ccExpMonthErrMsg"]'));
        error.ccExpYearError = element(by.css('[ng-bind="sanitized.config.ccExpYearErrMsg"]'));

        validated = {};
        validated.userNameValid = element(by.css('[ng-bind="sanitized.config.userNameSucRmtMsg"]'));
        validated.userNameNoValid = element(by.css('[ng-bind="sanitized.config.userNameProgRmtMsg"]'));
        validated.confirmPasswordNoValid = element(by.css('[ng-show="orderTwoForm.confirmPassword.$error.ecsCompareDir"]'));


        //Order one Happy Path
        input.orderOne.firstName.sendKeys('Edgar');
        input.orderOne.middleInitial.sendKeys('D');
        input.orderOne.lastName.sendKeys('Monge');
        input.orderOne.emailAddress.sendKeys('edgar@experian.com');
        input.orderOne.currentStreetAddress.sendKeys('123 current st');
        input.orderOne.currentZipCode.sendKeys('92626');
        ptor.sleep(2000);
        input.orderOne.submitData.click();
        ptor.sleep(2000);
       
        
    });
    it('Test Validation for all input', function () {
        input.SSN1.sendKeys('@');
        expect(error.SSN1Error.isDisplayed()).toBe(true);
        input.SSN1.clear();
        expect(error.SSN1Error.isDisplayed()).toBe(false);
        input.SSN2.sendKeys('@');
        expect(error.SSN2Error.isDisplayed()).toBe(true);
        input.SSN2.clear();
        expect(error.SSN2Error.isDisplayed()).toBe(false);
        input.SSN3.sendKeys('@');
        expect(error.SSN3Error.isDisplayed()).toBe(true);
        input.SSN3.clear();
        expect(error.SSN3Error.isDisplayed()).toBe(false);
        input.userName.sendKeys('@');
        expect(error.userNameError.isDisplayed()).toBe(true);
        input.userName.clear();
        expect(error.userNameError.isDisplayed()).toBe(false);
        input.password.sendKeys('@');
        expect(error.passwordError.isDisplayed()).toBe(true);
        input.password.clear();
        expect(error.passwordError.isDisplayed()).toBe(false);
        //input.confirmPassword.sendKeys('@@');
        //expect(error.confirmPasswordRequired.isDisplayed()).toBe(true);
        ////input.confirmPassword.clear();
        ////expect(error.confirmPasswordRequired.isDisplayed()).toBe(true);
        input.ccNumber.sendKeys('@');
        expect(error.ccNumberError.isDisplayed()).toBe(true);
        input.ccNumber.clear();
        expect(error.ccNumberError.isDisplayed()).toBe(false);
    });

    it('submit with no input', function () {
        input.submitData.click();
        expect(error.SSN1Required.isDisplayed()).toBe(true);
        expect(error.SSN2Required.isDisplayed()).toBe(true);
        expect(error.SSN3Required.isDisplayed()).toBe(true);
        expect(error.dateOfBirthMonthRequired.isDisplayed()).toBe(true);
        expect(error.dateOfBirthDayRequired.isDisplayed()).toBe(true);
        expect(error.dateOfBirthYearRequired.isDisplayed()).toBe(true);
        expect(error.userNameRequired.isDisplayed()).toBe(true);
        expect(error.passwordRequired.isDisplayed()).toBe(true);
        expect(error.confirmPasswordRequired.isDisplayed()).toBe(true);
        expect(error.ccNumberRequired.isDisplayed()).toBe(true);
        expect(error.ccExpMonthRequired.isDisplayed()).toBe(true);
        expect(error.ccExpYearRequired.isDisplayed()).toBe(true);
    });

    it('Check userName availability', function () {
        input.userName.sendKeys('thisisausername');
        ptor.sleep(2000);
        expect(validated.userNameValid.isDisplayed()).toBe(true);
        
        //input.userName.clear();
        //input.userName.sendKeys('PFFRANCESREESESF');
        //ptor.sleep(2000);
        //expect(validated.userNameNoValid.isDisplayed()).toBe(true);
    });

    it('verify that password match', function () {
        input.password.sendKeys('password');
        input.confirmPassword.sendKeys('pass');
        expect(error.confirmPasswordRequired.isDisplayed()).toBe(true);
        expect(validated.confirmPasswordNoValid.isDisplayed()).toBe(true);
        input.confirmPassword.clear();
        input.confirmPassword.sendKeys('password');
        expect(error.confirmPasswordRequired.isDisplayed()).toBe(false);
        expect(validated.confirmPasswordNoValid.isDisplayed()).toBe(false);
       
    });

    it('Order page Two happy path', function () {
        input.SSN1.sendKeys('123');
        input.SSN2.sendKeys('45');
        input.SSN3.sendKeys('6789');
        input.dateOfBirthMonth.$('[value="2"]').click();
        input.dateOfBirthDay.$('[value="11"]').click();
        input.dateOfBirthYear.$('[value="1960"]').click();
        input.userName.sendKeys('edgar123');
        input.password.sendKeys('password');
        input.confirmPassword.sendKeys('password');
        input.ccNumber.sendKeys('123456789');
        input.ccExpMonth.$('[value="7"]').click();
        input.ccExpYear.$('[value="2017"]').click();
        input.submitData.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('outofwallet');
     });

     
   
    

});