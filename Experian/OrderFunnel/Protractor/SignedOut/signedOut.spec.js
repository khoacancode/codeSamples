describe("Signed Out Test: ", function () {
    var ptor, input;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/signedOut');

        input = {};
    });



    it('H2 with the text "You Have Sucessfully Signed Out!" should appear', function () {
        expect(element(by.css("h2")).getText()).toBe("You Have Sucessfully Signed Out!");
    });


    it('p with the text "Before you go, be sure to check out these exciting offers below! Or SIGN IN again." should appear', function () {
        expect(element(by.css("p")).getText()).toBe("Before you go, be sure to check out these exciting offers below! Or SIGN IN again.");
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