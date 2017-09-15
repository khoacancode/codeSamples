describe("Rhino Boot Thank You: ", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/UpdatePaymentThankYou');

        input = {};
    });

    //first checks to make sure that the title of the page is correct
   /* it('Click No - should go to Member', function () {
    	ptor.sleep(2000);
    	element(by.css('[ng-click="returnValue(false, $event)"]')).click();
    	expect(ptor.getCurrentUrl()).toContain('member');

    });	*/

    it('Page Title with the text "Thank you for updating your payment information!" should appear', function () {
    	expect(element(by.css("h2")).getText()).toBe("Thank you for updating your payment information!");
    });
    it('Various contents should be present on the screen', function () {
        expect(element(by.css("h3.rhGreenText")).getText()).toContain("SAVE $10 when you order your 3 Bureau Report & FICO®");
    	expect(element.all(by.css(".interstitial-content div img")).count()).toBe(2);
    	expect(element.all(by.css(".saveInfo ul li")).count()).toBe(4);
    });
    it('Page should contain two buttons', function () {
    	expect(element.all(by.css("button")).count()).toEqual(2);
    });
    it('Button Text should be correctly displayed', function () {
        expect(element(by.css("[ng-if='sanitized.data.buttons.primary.text'] button")).getText()).toBe("YES! GET MY 3 BUREAU REPORT & FICO® SCORES");
    	expect(element(by.css("[ng-if='sanitized.data.buttons.secondary.text'] button")).getText()).toBe("NO THANKS, PROCEED TO MY MEMBERSHIP");
    });
    it("Order Help should be displayed on the screen", function () {
    	expect(element(by.css("h3.ohGrayText")).getText()).toBe("ORDER HELP");
    });
    it("Payment Information should be visible", function () {
    	expect(element(by.css("p.paymentInfo strong")).getText()).toBe("Payment Information");
    })
});