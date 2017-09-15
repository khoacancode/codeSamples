var Q = require('C:\\Users\\emonge\\AppData\\Roaming\\npm\\node_modules\\q\\q.js');

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
        input.orderOne.submitOrder1 = element(by.css('[ng-click="submitButtonClicked()"]'));

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
        input.submitOrder2 = element(by.css('[ng-click="submitDataClicked()"]'));

        //OutofWallet info
        input.set1 = {};
        input.set2 = {};

        input.set1.no1 = element(by.id('1_question_0'));
        input.set1.no2 = element(by.id('1_question_1'));
        input.set1.no3 = element(by.id('1_question_2'));
        input.set1.no4 = element(by.id('1_question_3'));
        input.set1.no5 = element(by.id('1_question_4'));

        input.set2.no1 = element(by.id('2_question_0'));
        input.set2.no2 = element(by.id('2_question_1'));
        input.set2.no3 = element(by.id('2_question_2'));
        input.set2.no4 = element(by.id('2_question_3'));
        input.set2.no5 = element(by.id('2_question_4'));

        input.submitAuth = element(by.css('[ng-click="submitData(sanitized.response)"]'));

        //Account setup page
        input.securityQuestion = element(by.model('input.securityQuestion'));
        input.securityQuestionAnswer = element(by.model('input.securityQuestionAnswer'));
        input.phoneNumber1 = element(by.model('input.phoneNumber1'));
        input.phoneNumber2 = element(by.model('input.phoneNumber2'));
        input.phoneNumber3 = element(by.model('input.phoneNumber3'));
        input.mothersMaidenName = element(by.model('input.mothersMaidenName'));
        input.submitAccSetupPage = element(by.css('[ng-click="submitData()"]'));

        //orderCompleteThankYou page
        input.primaryButton = element(by.css('[ng-class="sanitized.data.buttons.primary.cssClass"]'));
        input.secondaryButton = element(by.css('[ng-class="sanitized.data.buttons.secondary.cssClass"]'));


    });
    it('Order Funnel Happy Path', function () {

        //order1
        input.orderOne.firstName.sendKeys('Nathaniel');
        input.orderOne.lastName.sendKeys('Baker');
        input.orderOne.emailAddress.sendKeys('viper@consumerinfo.com');
        input.orderOne.currentStreetAddress.sendKeys('2551 buttermilk pike');
        input.orderOne.currentZipCode.sendKeys('41017');
        input.orderOne.currentCity.sendKeys('villa hills');
        input.orderOne.currentState.sendKeys('KY');
        input.orderOne.submitOrder1.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('orderpage2');

        //order2
        input.SSN1.sendKeys('666');
        input.SSN2.sendKeys('13');
        input.SSN3.sendKeys('9218');
        input.dateOfBirthMonth.$('[value="2"]').click();
        input.dateOfBirthDay.$('[value="11"]').click();
        input.dateOfBirthYear.$('[value="1960"]').click();
        input.userName.sendKeys('nathanielBK1');
        input.password.sendKeys('password');
        input.confirmPassword.sendKeys('password');
        input.ccNumber.sendKeys('4111111111111111');
        input.ccExpMonth.$('[value="7"]').click();
        input.ccExpYear.$('[value="2017"]').click();
        input.submitOrder2.click();
        ptor.sleep(5000);
        expect(ptor.getCurrentUrl()).toContain('outofwallet');

        //outofwallet
        element.all(By.binding('answer')).then(function(arr) {
            var promisesId = [];
            var promisesAnswer = [];
            for (var i = 0; i < arr.length; i++) {
                promisesId.push(arr[i].getAttribute('for'));
                promisesAnswer.push(arr[i].getText());
            }
            Q.all(promisesId).done(function() {
                Q.all(promisesAnswer).done(function() {
                    //var oowAnswers = user.OOWAnswers;
                    var oowAnswers = 'KENTON|AUDI A6|TOYOTA CAMRY';
                    for (var i=0; i<promisesAnswer.length; i++) {
                        if (oowAnswers.indexOf(promisesAnswer[i]) > -1) {
                            //console.log('...Found Answer: ' + promisesAnswer[i]);
                            element(By.id(promisesId[i])).click();   // select answer found
                        }
                    }
                });
            });
        });


        input.submitAuth.click();
        ptor.sleep(5000);
        expect(ptor.getCurrentUrl()).toContain('accountsetup');

        //accountsetup page
        input.securityQuestion.$('[value="12"]').click();
        input.securityQuestionAnswer.sendKeys('Main');
        input.phoneNumber1.sendKeys('555');
        input.phoneNumber2.sendKeys('555');
        input.phoneNumber3.sendKeys('5555');
        input.mothersMaidenName.sendKeys('maiden');
        input.submitAccSetupPage.click();

        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('orderCompleteThankYou');

        //ordercompletethankyou
        ptor.sleep(2000);
        input.secondaryButton.click();

        expect(ptor.getCurrentUrl()).toContain('member');



    });

    

});