describe("Interstital Tests", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/OrderThankYou');

        input = {};
    });

    //first checks to make sure that the title of the page is correct
    it('should display default content on the page', function () {
        ptor.sleep(2000);
        element(by.css('[ng-click="returnValue(false, $event)"]')).click();
        expect(ptor.getCurrentUrl()).toContain('member');

    })
});