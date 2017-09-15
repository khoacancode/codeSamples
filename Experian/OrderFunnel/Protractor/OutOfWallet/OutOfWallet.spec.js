describe("Rhino Boot Thank You: ", function () {
    var ptor, input, button, errors;

    // create before conditions for each test
    beforeEach(function () {
        ptor = protractor.getInstance();
        //each test case will have a its own fresh page of the widget
        ptor.get('/credit#/outOfWallet');

        input = {};
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

        button = {};
        button.submitAuth = element(by.css('[ng-click="submitData(response)"]'));

        errors = element.all(by.css(".label-danger"));

        ptor.sleep(5000);
    });

    it('Various contents should be present on the screen', function () {
    	expect(element(by.css(".header-bar-text")).getText()).toBe("Verify Your Identity");
    	expect(element(by.css("h4.blueH4")).getText()).toBe("Please complete within 10 minutes");
    	expect(element(by.css("h5")).getText()).toBe("Authentication Questions");
    	expect(element.all(by.css("button.btn-submit")).count()).toEqual(1);
    	expect(element.all(by.css("div.bb-logo a img")).count()).toEqual(1);
    	expect(element.all(by.css("div.oowQuestions div")).count()).toBeGreaterThan(0);
    });
    it('Questions should be visible on the page', function () {
    	expect(element.all(by.css(".oowQuestion p")).count()).toBeGreaterThan(0);
    });
    it('Questions should have radio buttons choices', function () {
    	expect(element.all(by.css(".oowQuestion input")).count()).toBeGreaterThan(0);
    });
    it("Submit form with no selections should display errors", function () {
    	button.submitAuth.click();
    	expect(errors.count()).toEqual(2);
    });
    it("Select from First set of questions and submit should return error for question set 2", function () {
    	input.set1.no1.click();
    	button.submitAuth.click();
    	expect(errors.count()).toEqual(1);
    	expect(errors.getText()).toContain("Please answer question 2");
    });
    it("Select from Second set of questions and submit should return error for question set 1", function () {
    	input.set2.no1.click();
    	button.submitAuth.click();
    	expect(errors.count()).toEqual(1);
    	expect(errors.getText()).toContain("Please answer question 1");
    });
   /* it("Select both sets of questions and page should process", function () {
    	input.set1.no1.click();
    	input.set2.no1.click();
    	button.add.submitAuth.click();
    	expect(errors.count()).toEqual(0);
    });		*/
});