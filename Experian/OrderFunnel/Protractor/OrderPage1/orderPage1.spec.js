describe("Order One tests", function () {

    var ptor, input, output, baseURL;

    beforeEach(function () {
        // initialize protractor 
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/');
        ptor.ignoreSynchronization = true
        input = {};
        input.firstName = element(by.model('input.firstName'));
        input.middleInitial = element(by.model('input.middleInitial'));
        input.lastName = element(by.model('input.lastName'));
        input.generation = element(by.model('input.generation'));
        input.emailAddress = element(by.model('input.emailAddress'));
        input.yesSendInfo = element(by.model('input.yesSendInfo'));
        input.currentStreetAddress = element(by.model('input.currentStreetAddress'));
        input.currentApartment = element(by.model('input.currentApartment'));
        input.currentZipCode = element(by.model('input.currentZipCode'));
        input.currentCity = element(by.model('input.currentCity'));
        input.currentState = element(by.model('input.currentState'));
        input.hasPreviousAddress = element.all(by.model('input.hasPreviousAddress'));
        input.previousStreetAddress = element(by.model('input.previousStreetAddress'));
        input.previousApartment = element(by.model('input.previousApartment'));
        input.previousZipCode = element(by.model('input.previousZipCode'));
        input.previousCity = element(by.model('input.previousCity'));
        input.previousState = element(by.model('input.previousState'));
        input.signUpReason = element(by.model('input.signUpReason'));
        input.otherText = element(by.model('input.otherText'));
        input.submitData = element(by.css('[ng-click="submitButtonClicked()"]'));

        error = {};
        error.firstNameRequired = element(by.css('[ng-bind="sanitized.config.firstNameReqMsg"]'));
        error.firstNameError = element(by.css('[ng-bind="sanitized.config.firstNameErrMsg"]'));
        error.middleInitialError = element(by.css('[ng-bind="sanitized.config.middleNameErrMsg"]'));
        error.lastNameRequired = element(by.css('[ng-bind="sanitized.config.lastNameReqMsg"]'));
        error.lastNameError = element(by.css('[ng-bind="sanitized.config.lastNameErrMsg"]'));
        error.emailRequired = element(by.css('[ng-bind="sanitized.config.emailReqMsg"]'));
        error.emailError = element(by.css('[ng-bind="sanitized.config.emailErrMsg"]'));
        error.currentStreetAddressRequired = element(by.css('[ng-bind="sanitized.config.streetReqMsg"]'));
        error.currentStreetAddressError = element(by.css('[ng-bind="sanitized.config.streetErrMsg"]'));
        error.currentApartmentError = element(by.css('[ng-bind="sanitized.config.aptNoErrMsg"]'));
        error.currentZipCodeRequired = element(by.css('[ng-bind="sanitized.config.zipCodeReqMsg"]'));
        error.currentZipCodeError = element(by.css('[ng-bind="sanitized.config.zipCodeErrMsg"]'));
        error.currentCityRequired = element(by.css('[ng-bind="sanitized.config.cityReqMsg"]'));
        error.currentCityError = element(by.css('[ng-bind="sanitized.config.cityErrMsg"]'));
        error.currentStateRequired = element(by.css('[ng-bind="sanitized.config.stateReqMsg"]'));
        error.previousStreetAddressRequired = element(by.css('[ng-bind="sanitized.config.previousStreetReqMsg"]'));
        error.previousStreetAddressError = element(by.css('[ng-bind="sanitized.config.previousStreetErrMsg"]'));
        error.previousApartmentError = element(by.css('[ng-bind="sanitized.config.previousAptNoErrMsg"]'));
        error.previousZipCodeRequired = element(by.css('[ng-bind="sanitized.config.previousZipCodeReqMsg"]'));
        error.previousZipCodeError = element(by.css('[ng-bind="sanitized.config.previousZipCodeErrMsg"]'));
        error.previousCityRequired = element(by.css('[ng-bind="sanitized.config.previousCityReqMsg"]'));
        error.previousCityError = element(by.css('[ng-bind="sanitized.config.previousCityErrMsg"]'));
        error.previousStateRequired = element(by.css('[ng-bind="sanitized.config.previousStateReqMsg"]'));

    });

    //first checks to make sure that the title of the page is correct
    //it('should display the correct page title', function () {
    //    expect(ptor.gettitle()).tobe('experian configurator');
    //});
   
    it('test pattern validation on all', function () {
        input.firstName.sendKeys('@');
        expect(error.firstNameError.isDisplayed()).toBe(true);
        input.firstName.clear();
        expect(error.firstNameError.isDisplayed()).toBe(false);
        input.middleInitial.sendKeys('@');
        expect(error.middleInitialError.isDisplayed()).toBe(true);
        input.middleInitial.clear();
        expect(error.middleInitialError.isDisplayed()).toBe(false);
        input.lastName.sendKeys('@');
        expect(error.lastNameError.isDisplayed()).toBe(true);
        input.lastName.clear();
        expect(error.lastNameError.isDisplayed()).toBe(false);
        input.emailAddress.sendKeys('*');
        expect(error.emailError.isDisplayed()).toBe(true);
        input.emailAddress.clear();
        expect(error.emailError.isDisplayed()).toBe(false);
        input.currentStreetAddress.sendKeys('*');
        expect(error.currentStreetAddressError.isDisplayed()).toBe(true);
        input.currentStreetAddress.clear();
        expect(error.currentStreetAddressError.isDisplayed()).toBe(false);
        input.currentApartment.sendKeys('*');
        expect(error.currentApartmentError.isDisplayed()).toBe(true);
        input.currentApartment.clear();
        expect(error.currentApartmentError.isDisplayed()).toBe(false);

        input.currentZipCode.sendKeys('*');
        expect(error.currentZipCodeError.isDisplayed()).toBe(true);
        input.currentCity.sendKeys('*');
        expect(error.currentCityError.isDisplayed()).toBe(true);
        input.currentCity.clear();
        expect(error.currentCityError.isDisplayed()).toBe(false);
        input.currentZipCode.clear();
        expect(error.currentZipCodeError.isDisplayed()).toBe(false);

        input.hasPreviousAddress.last().click();

        input.previousStreetAddress.sendKeys('*');
        expect(error.previousStreetAddressError.isDisplayed()).toBe(true);
        input.previousStreetAddress.clear();
        expect(error.previousStreetAddressError.isDisplayed()).toBe(false);
        input.previousApartment.sendKeys('*');
        expect(error.previousApartmentError.isDisplayed()).toBe(true);
        input.previousApartment.clear();
        expect(error.previousApartmentError.isDisplayed()).toBe(false);

        input.previousZipCode.sendKeys('*');
        expect(error.previousZipCodeError.isDisplayed()).toBe(true);
        input.previousCity.sendKeys('*');
        expect(error.previousCityError.isDisplayed()).toBe(true);
        input.previousCity.clear();
        expect(error.previousCityError.isDisplayed()).toBe(false);
        input.previousZipCode.clear();
        expect(error.previousZipCodeError.isDisplayed()).toBe(false);

    });

    it('submit with no input', function () {
        expect(input.currentCity.isDisplayed()).toBe(false);
        expect(input.currentState.isDisplayed()).toBe(false);
        input.submitData.click();
        expect(error.firstNameRequired.isDisplayed()).toBe(true);
        expect(error.lastNameRequired.isDisplayed()).toBe(true);
        expect(error.emailRequired.isDisplayed()).toBe(true);
        expect(error.currentStreetAddressRequired.isDisplayed()).toBe(true);
        expect(error.currentZipCodeRequired.isDisplayed()).toBe(true);
    });
   
    it('submit with no input but 99999 as zipcode', function () {
        input.currentZipCode.sendKeys('99999');
        expect(input.currentCity.isDisplayed()).toBe(true);
        expect(input.currentState.isDisplayed()).toBe(true);
        input.submitData.click();
        expect(error.firstNameRequired.isDisplayed()).toBe(true);
        expect(error.lastNameRequired.isDisplayed()).toBe(true);
        expect(error.emailRequired.isDisplayed()).toBe(true);
        expect(error.currentStreetAddressRequired.isDisplayed()).toBe(true);
        expect(error.currentZipCodeRequired.isDisplayed()).toBe(false);
    });

    it('submit with no input with hasPreviousAddress', function () {
        input.hasPreviousAddress.last().click();
        expect(input.previousCity.isDisplayed()).toBe(false);
        expect(input.previousState.isDisplayed()).toBe(false);
        input.submitData.click();
        expect(error.firstNameRequired.isDisplayed()).toBe(true);
        expect(error.lastNameRequired.isDisplayed()).toBe(true);
        expect(error.emailRequired.isDisplayed()).toBe(true);
        expect(error.currentStreetAddressRequired.isDisplayed()).toBe(true);
        expect(error.currentZipCodeRequired.isDisplayed()).toBe(true);
        expect(error.previousStreetAddressRequired.isDisplayed()).toBe(true);
    });
    
    it('submit with no input with hasPreviousAddress but 99999 as previous zipcode', function () {
        input.hasPreviousAddress.last().click();
        input.previousZipCode.sendKeys('99999');
        expect(input.previousCity.isDisplayed()).toBe(true);
        expect(input.previousState.isDisplayed()).toBe(true);
        input.submitData.click();
        expect(error.firstNameRequired.isDisplayed()).toBe(true);
        expect(error.lastNameRequired.isDisplayed()).toBe(true);
        expect(error.emailRequired.isDisplayed()).toBe(true);
        expect(error.currentStreetAddressRequired.isDisplayed()).toBe(true);
        expect(error.currentZipCodeRequired.isDisplayed()).toBe(true);
        expect(error.previousStreetAddressRequired.isDisplayed()).toBe(true);
        expect(error.previousCityRequired.isDisplayed()).toBe(true);
        expect(error.previousStateRequired.isDisplayed()).toBe(true);
    });
    

    it('test Zipcode lookup API', function() {
        input.currentZipCode.sendKeys('92626');
        ptor.sleep(2000);
        expect(input.currentCity.getAttribute('value')).toBe('Costa Mesa');
        //expect(input.currentState.getText()).toBe('CA');

    });

    it('Happy path #1: no previous address', function () {
        input.firstName.sendKeys('Kanate');
        input.middleInitial.sendKeys('KU');
        input.lastName.sendKeys('Ung');
        input.emailAddress.sendKeys('vyper@consumerinfo.com');
        input.currentStreetAddress.sendKeys('123 current st');
        input.currentZipCode.sendKeys('92626');
        ptor.sleep(2000);
        input.submitData.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('orderpage2');
    });

    it('Happy path #2: with previous address', function () {
        input.firstName.sendKeys('Kanate');
        input.middleInitial.sendKeys('KU');
        input.lastName.sendKeys('Ung');
        input.emailAddress.sendKeys('vyper@consumerinfo.com');
        input.currentStreetAddress.sendKeys('123 current st');
        input.currentZipCode.sendKeys('92626');
        ptor.sleep(2000);
        input.hasPreviousAddress.last().click();
        input.previousStreetAddress.sendKeys('234 previous st');
        input.previousZipCode.sendKeys('92648');
        ptor.sleep(2000);

        input.submitData.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('orderpage2');

    });

});