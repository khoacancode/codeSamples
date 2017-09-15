describe("Timed Out Test: ", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/timedOut');

        input = {};
    });



    it("H2 with the text For Your Security We've Signed You Out. should appear", function () {
        expect(element(by.css("h2")).getText()).toBe("For Your Security We've Signed You Out.");
    });


    it('p should match text', function () {
        expect(element(by.css("p")).getText()).toBe("Your page was inactive. To keep your essential information secure you've been automatically signed out. If you wish to continue, please SIGN IN again.");
    });


    it('Page should contain two buttons', function () {
        expect(element.all(by.css(".btn-type3")).count()).toBe(2);

    });

    it('Page should contain two buttons', function () {
        expect(element.all(by.css(".btn-type3")).count()).toBe(2);

    });


    it('Page should contain seven radio buttons', function () {
        expect(element.all(by.css(".radio")).count()).toBe(7);

    });

    it('Page should contain 15 checkbox buttons', function () {
        expect(element.all(by.css(".checkbox")).count()).toBe(12);

    });

    it('Page should contain 1 id of disclaimer text', function () {
        expect(element.all(by.css("#disclaimerText")).count()).toBe(1);

    });


});