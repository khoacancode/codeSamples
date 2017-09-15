describe("WelcomeBack2 Test", function () {
    var ptor, input, output, baseURL;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/signin');
        //ptor.ignoreSynchronization = true;

        input = {};
        //Sign-In
        input.signin = {};
        input.signin.userName = element(by.model('input.userName'));
        input.signin.password = element(by.model('input.password'));
        input.signin.submitLogin = element(by.css('[ng-click="submitDataClicked()"]'));

        //SSN Verification
        input.SSN1 = element(by.model('input.ssn'));
        input.submitSSN = element(by.css('[ng-click="submitDataClicked()"]'));

        //WelcomeBack 2
        input.primaryButton = element(by.css('[ng-class="sanitized.data.buttons.primary.cssClass"]'));
        input.secondaryButton = element(by.css('[ng-class="sanitized.data.buttons.secondary.cssClass"]'));
        dynamic = {};
        dynamic.name = element(by.css("#welcome"));
    });

    //check to see if sign-in process redirects to WelcomeBack2 and customer clicks yes
    it('sign in, verify ssn, go to welcomeback2, click yes', function () {
        //sign in
        input.signin.userName.sendKeys('PFWILBURTSF');
        input.signin.password.sendKeys('password');
        input.signin.submitLogin.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('ssnverificationform');

        //ssn verification
        input.SSN1.sendKeys('9538');
        input.submitSSN.click();
        ptor.sleep(2000);
        expect(ptor.getCurrentUrl()).toContain('welcomeback2');

        // checks H1 content
        var header = element(by.css("H1"));
        expect(header.getText()).toEqual("Congratulations! You are eligible for another 7-day $1 trial membership.");

        // checks H2 content
        var header = element(by.css("H2"));
        expect(header.getText()).toEqual("See your most recent Credit Report & FICO® Score.");

        // check banner content #1
        var header = element(by.css("#monitor H3"));
        expect(header.getText()).toEqual("Monitor Your Credit");
        var header = element(by.css("#monitor P"));
        expect(header.getText()).toEqual("Know when your credit unexpectedly changes with daily credit monitoring and alerts, backed by best-in-class fraud resolution support.");

        // check banner content #2
        var header = element(by.css("#information H3"));
        expect(header.getText()).toEqual("Information You Can Use");
        var header = element(by.css("#information P"));
        expect(header.getText()).toEqual("Get your Credit Report and FICO® Score, powered by Experian, and see the same kind of information banks and lenders see.");

        // check banner content #3
        var header = element(by.css("#learn H3"));
        expect(header.getText()).toEqual("Learn How Your Credit Works");
        var header = element(by.css("#learn P"));
        expect(header.getText()).toEqual("You have goals in life, having a better grasp on your credit may help you get to them sooner.");

        //check to see if the customer name is displayed
        expect(dynamic.name.getText()).toEqual("Welcome WIL.");

        //check that primary button text is displayed
        expect(input.primaryButton.getText()).toEqual("NO THANKS, TAKE ME TO MY ACCOUNT");

        //check that secondary button text is displayed
        expect(input.secondaryButton.getText()).toEqual("YES! SEE MY EXPERIAN REPORT & FICO® SCORE!");

        //check to see if Yes button redirects to reorder page with right pkgid and areaID
        input.secondaryButton.click();
        expect(ptor.getCurrentUrl()).toContain('credit#/reorder?pkgid=E2NHZ&areaid=28');

        //check to see if No button redirects to member center
        ptor.get('/credit#/welcomeback2');
        ptor.sleep(2000);
        input.primaryButton.click();
        expect(ptor.getCurrentUrl()).toContain('member');

    });

});