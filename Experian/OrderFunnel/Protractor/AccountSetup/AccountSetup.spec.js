describe("Account Setup tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/Credit#/AccountSetup');
        ptor.ignoreSynchronization = true;

        input = {};
        input.securityQuestion = element(by.model('input.securityQuestion'));
        input.securityQuestionAnswer = element(by.model('input.securityQuestionAnswer'));
        input.phoneNumber1 = element(by.model('input.phoneNumber1'));
        input.phoneNumber2 = element(by.model('input.phoneNumber2'));
        input.phoneNumber3 = element(by.model('input.phoneNumber3'));
        input.mothersMaidenName = element(by.model('input.mothersMaidenName'));
        input.submitData = element(by.css('[ng-click="submitData()"]'));

        validation = {};
        //Security Question
        validation.securityQuestionErrMsg = element(by.binding('sanitized.config.securityQuestionErrMsg'));
        validation.securityQuestionReqMsg = element(by.binding('sanitized.config.securityQuestionReqMsg'));

        //Security Answer
        validation.securityAnswerErrMsg = element(by.binding('sanitized.config.securityAnswerErrMsg'));
        validation.securityAnswerReqMsg = element(by.binding('sanitized.config.securityAnswerReqMsg'));

        //Phone Number
        validation.phone1ErrMsq = element(by.binding('sanitized.config.phone1ErrMsg'));
        validation.phone1ReqMsq = element(by.binding('sanitized.config.phone1ReqMsg'));
        //
        validation.phone2ErrMsq = element(by.binding('sanitized.config.phone2ErrMsg'));
        validation.phone2ReqMsq = element(by.binding('sanitized.config.phone2ReqMsg'));
        //
        validation.phone3ErrMsq = element(by.binding('sanitized.config.phone3ErrMsg'));
        validation.phone3ReqMsq = element(by.binding('sanitized.config.phone3ReqMsg'));

        //Mother's Maiden Name
        validation.mothersMaidenNameErrMsg = element(by.binding('sanitized.config.mothersMaidenNameErrMsg'));
        validation.mothersMaidenNameReqMsg = element(by.binding('sanitized.config.mothersMaidenNameReqMsg'));
    });

    // check to make sure if submit nothing, the page does not submit

    it(' - (1) - submit with no input confirm page does not redirect to OTY and that Required validation messages are displayed.', function () {

        input.submitData.click();

        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('AccountSetup');

        // Show required messages
        //// Security Question
        expect(validation.securityQuestionReqMsg.isDisplayed()).toBeTruthy();
        expect(validation.securityQuestionReqMsg.getText()).toContain('Please select a security question.');
        //// Security Answer
        expect(validation.securityAnswerReqMsg.isDisplayed()).toBeTruthy();
        expect(validation.securityAnswerReqMsg.getText()).toContain('Please enter an answer to your reminder phrase.');
        //// Phone Number 1
        expect(validation.phone1ReqMsq.isDisplayed()).toBeTruthy();
        expect(validation.phone1ReqMsq.getText()).toContain('Please enter your Area Code.');
        //// Phone Number 2
        expect(validation.phone2ReqMsq.isDisplayed()).toBeTruthy();
        expect(validation.phone2ReqMsq.getText()).toContain('Please enter your Phone Number Prefix.');
        //// Phone Number 3
        expect(validation.phone3ReqMsq.isDisplayed()).toBeTruthy();
        expect(validation.phone3ReqMsq.getText()).toContain('Please enter the last four digits of your phone number.');
        //Mother's Maiden Name
        expect(validation.mothersMaidenNameReqMsg.isDisplayed()).toBeTruthy();
        expect(validation.mothersMaidenNameReqMsg.getText()).toContain('Please enter your Mother\'s Maiden Name.');

        //
        //
        //Don't show error mesages
        //// Security Question
        expect(validation.securityQuestionErrMsg.isDisplayed()).toBeFalsy();
        //// Security Answer
        expect(validation.securityAnswerErrMsg.isDisplayed()).toBeFalsy();
        //// Phone Number 1
        expect(validation.phone1ErrMsq.isDisplayed()).toBeFalsy();
        //// Phone Number 2
        expect(validation.phone2ErrMsq.isDisplayed()).toBeFalsy();
        //// Phone Number 3
        expect(validation.phone3ErrMsq.isDisplayed()).toBeFalsy();
        //// Mother's Maiden Name
        expect(validation.mothersMaidenNameErrMsg.isDisplayed()).toBeFalsy();

    });

    // check to make sure if I submit partial phone number using the first input field, there is no output for phone number

    it(' - (2) - submit invalid data, expect page not to submit and validation error messages to be displayed', function () {
        input.securityQuestion.$('[value="12"]').click();
        input.securityQuestionAnswer.sendKeys('!');
        input.phoneNumber1.sendKeys('abc');
        input.phoneNumber2.sendKeys('def');
        input.phoneNumber3.sendKeys('ghij');
        input.mothersMaidenName.sendKeys(5);

        // Don't Show required messages
        //// Security Question
        expect(validation.securityQuestionReqMsg.isDisplayed()).toBeFalsy();
        //// Security Answer
        expect(validation.securityAnswerReqMsg.isDisplayed()).toBeFalsy();
        //// Phone Number 1
        expect(validation.phone1ReqMsq.isDisplayed()).toBeFalsy();
        //// Phone Number 2 - Should be displayed
        expect(validation.phone2ReqMsq.isDisplayed()).toBeFalsy();
        //// Phone Number 3 - Should be displayed
        expect(validation.phone3ReqMsq.isDisplayed()).toBeFalsy();
        //Mother's Maiden Name
        expect(validation.mothersMaidenNameReqMsg.isDisplayed()).toBeFalsy();

        //
        //
        //Don't show error mesages
        //// Security Question - don't show
        expect(validation.securityQuestionErrMsg.isDisplayed()).toBeFalsy();
        //// Security Answer
        expect(validation.securityAnswerErrMsg.isDisplayed()).toBeTruthy();
        expect(validation.securityAnswerErrMsg.getText()).toContain('Your reminder answer may not contain the following characters');
        //// Phone Number 1
        expect(validation.phone1ErrMsq.isDisplayed()).toBeTruthy();
        expect(validation.phone1ErrMsq.getText()).toContain('Your Area Code may contain numbers only. Please omit all other characters.');
        //// Phone Number 2 - Should not be displayed
        expect(validation.phone2ErrMsq.isDisplayed()).toBeTruthy();
        expect(validation.phone2ErrMsq.getText()).toContain('The Phone Number Prefix may only contain numbers. Please omit all other characters.');
        //// Phone Number 3 - should Not be displayed
        expect(validation.phone3ErrMsq.isDisplayed()).toBeTruthy();
        expect(validation.phone3ErrMsq.getText()).toContain('Your Phone Number may only contain numbers. Please omit all other characters.');
        //// Mother's Maiden Name
        expect(validation.mothersMaidenNameErrMsg.isDisplayed()).toBeTruthy();
        expect(validation.mothersMaidenNameErrMsg.getText()).toContain('Your Mother\'s Maiden Name may only contain letters and a single dash or space. Please omit all other characters or enter a 4 digit PIN Number.');

    });

    // check to make sure if I submit phone number containing non-digits using the first input field, there is no output for phone number
    /*
    it(' - (3) - submit with first phone field 94955512aa, expect no output for phonenumber', function () {
        input.phoneNumber1.sendKeys('94955512aa');
        input.submitData.click();
        expect(output.securityQuestion.getText()).toBe('');
        expect(output.securityQuestionAnswer.getText()).toBe('');
        expect(output.phoneNumber.getText()).toBe('');
        expect(output.mothersMaidenName.getText()).toBe('');
    });
    */
    // check correct form fill for all fields
    it(' - (3) - submit correct input all fields, expect redirect to OTY', function () {
        input.securityQuestion.$('[value="12"]').click();
        input.securityQuestionAnswer.sendKeys('Main');
        input.phoneNumber1.sendKeys('9495551212');
        input.mothersMaidenName.sendKeys('maiden');

        expect(validation.securityAnswerReqMsg.getText()).toBe('');

        input.submitData.click();

        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('orderthankyou');
    });
    // check correct form fill for all fields, another case for the select list
    it(' - (4) - submit correct input all fields, expect redirect to OTY', function () {
        input.securityQuestion.$('[value="14"]').click();
        input.securityQuestionAnswer.sendKeys('LeJune');
        input.phoneNumber1.sendKeys('9495551212');
        input.mothersMaidenName.sendKeys('maiden');

        expect(validation.securityAnswerReqMsg.getText()).toBe('');

        input.submitData.click();

        ptor.sleep(4000);
        expect(ptor.getCurrentUrl()).toContain('orderthankyou');
    });
});