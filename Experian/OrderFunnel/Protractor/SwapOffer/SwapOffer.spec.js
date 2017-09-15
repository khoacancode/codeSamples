describe("Swap Offer Tests", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/SwapOffer');
    });

    //checks to make sure that content on page is correct
    it('should display correct content on the page', function () {
        ptor.sleep(2000);

        // checks page url
        expect(ptor.getCurrentUrl()).toContain('SwapOffer');

        // checks H1 content
        var header = element(by.css("H1"));
        expect(header.getText()).toEqual("See your most recent Credit Report & FICO® Score!");

        // checks H2 content
        var header = element(by.css("H2"));
        expect(header.getText()).toEqual("Re-activate your membership for only $4.95 for the first month.");

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
    })
});