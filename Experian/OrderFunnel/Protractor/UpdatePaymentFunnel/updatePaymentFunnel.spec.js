describe("Rhino Boot tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/signin');


        input = {};

        //Sgin-In info
        input.signIn = {};
        input.signIn.userName = element(by.model('input.userName'));
        input.signIn.password = element(by.model('input.password'));
        input.signIn.submitUserPsswd = element(by.css('[ng-click="submitDataClicked()"]'));

        // SSN info
        input.signIn.ssn = element(by.model('input.ssn'));
        input.signIn.submitSSN = element(by.css('[ng-click="submitDataClicked()"]'));

        // Update info

        input.signIn.cardType = element(by.model('input.cardType'));
        input.signIn.ccNumber = element(by.model('input.ccNumber'));
        input.signIn.ccExpMonth = element(by.model('input.ccExpMonth'));
        input.signIn.ccExpYear = element(by.model('input.ccExpYear'));
        input.signIn.submitUpdate = element(by.css('[ng-click="submitDataClicked()"]'));

        // Update Thank You
        input.signIn.submitYes = element(by.css('.primaryButton'));
        input.signIn.submitNo = element(by.css('.secondaryButton'));

        // One B Thank You
        input.signIn.ViewReport = element(by.css('.primaryButton'));



    });


    it('Rhino Boot Funnel Happy Path', function () {

        // username and password
        input.signIn.userName.sendKeys('adamjbird1079');
        input.signIn.password.sendKeys('password1');

        input.signIn.submitUserPsswd.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ssnverificationform');

        // ssn
        input.signIn.ssn.sendKeys('4776');

        input.signIn.submitSSN.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('updatepayment');

        // update payment
        input.signIn.cardType.sendKeys('Visa');
        input.signIn.ccNumber.sendKeys('4111111111111111');
        input.signIn.ccExpMonth.sendKeys('February');
        input.signIn.ccExpYear.sendKeys('2017');

        input.signIn.submitUpdate.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('updatepaymentthankyou');
        

        // update payment thank you
        input.signIn.submitNo.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('oneb_thankyoureorder');


        // one b thank you report
        input.signIn.ViewReport.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('reports/reports?bureau=Experian&view=summary');

    });

    

});