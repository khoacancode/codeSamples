describe("ThankYouReorder Page Tests", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/ThankYouReorder');
        ptor.ignoreSynchronization = true;

        input = {};
        input.primaryButton = element(by.css('.primaryButton'));
        input.secondaryButton = element(by.css('.secondaryButton'));

        dynamic = {};
        dynamic.name = element(by.css(".customerName"));
        dynamic.price = element(by.css(".discountPrice"));
        dynamic.offerText = element(by.css(".offerText"));
    });

    //check to see if the customer name is displayed
    it(' - (1) - check to see if customer name is displayed', function () {
        ptor.sleep(2000);

        expect(dynamic.name.getText()).toBeTruthy();
    });

    //check to see that price is displayed
    it(' - (2) - check to see that price is displayed', function () {
        ptor.sleep(2000);

        expect(dynamic.price.getText()).toBeTruthy();
    });

    //check to see the offer text is displayed
    it(' - (3) - check to see that offer text is displayed', function () {
        ptor.sleep(2000);

        expect(dynamic.offerText.getText()).toBeTruthy();
    });

    //check that primary button text is displayed
    it(' - (4) - check that primary button text is displayed', function () {
        ptor.sleep(2000);

        expect(input.primaryButton.getText()).toBeTruthy();
    });

    //check that secondary button text is displayed
    it(' - (5) - check that secondary button text is displayed', function () {
        ptor.sleep(2000);

        expect(input.secondaryButton.getText()).toBeTruthy();
    });

    //check to see if click to order 3B3S works
    it(' - (6) - click on the primary button and expect go to 3B3S order', function () {
        ptor.sleep(2000);
        input.primaryButton.click();

        expect(ptor.getCurrentUrl()).toContain('member');//make this the url for the thankyou page
    });

    //check to see if click through to member page works
    it(' - (7) - click on the secondary button and expect go to member center', function () {
        ptor.sleep(2000);
        input.secondaryButton.click();

        expect(ptor.getCurrentUrl()).toContain('member');
    });
});
