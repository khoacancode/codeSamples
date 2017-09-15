describe("Rewrite Tests", function () {
	var ptor,
		bDriver,
		baseUrl = 'http://localhost:57280';

    // create before conditions for each test
    beforeEach(function () {
    	ptor = protractor.getInstance();
    	bDriver = browser.driver;
    	bDriver.ignoreSynchronization = true;
        //each test case will have a its own fresh page of the widget
    });
    function getUrl(Url) {
    	bDriver.get(baseUrl + Url);
    	ptor.sleep(300);
    }
    //first checks to make sure that the title of the page is correct
    it('should always take you to experian.com/lp landing page', function () {
    	getUrl('/default.aspx');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/tripleadvantage/default.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/tripleadvantage/default.aspx?PageTypeID=HomePageX&sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/tripleadvantage/default.aspx?PageTypeID=HomePageX&sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/tripleadvantage/default.aspx?sc=XXXXXX&hmgpid=X&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/tripleadvantage/');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/tripleadvantage?sc=XXXXXX&hmgpid=X&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/credit/default.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/credit/default.aspx?PageTypeID=HomePageX&sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/credit/default.aspx?sc=XXXXXX&hmgpid=X&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/credit/credit/default.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/credit/credit/default.aspx?sc=XXXXXX&hmgpid=X&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/credit/credit/default.aspx?PageTypeID=HomePageX&sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    	getUrl('/');
    	expect(bDriver.getCurrentUrl()).toContain('www.experian.com/lp/');
    });
    it('should always take you to the sign in page', function () {
    	getUrl('/tripleadvantage/login.aspx');
    	expect(bDriver.getCurrentUrl()).toContain('credit#/signin');
    	getUrl('/credit/login.aspx');
    	expect(bDriver.getCurrentUrl()).toContain('credit#/signin');
    	getUrl('/login.aspx');
    	expect(bDriver.getCurrentUrl()).toContain('credit#/signin');
    	getUrl('/credit/credit/login.aspx');
    	expect(bDriver.getCurrentUrl()).toContain('credit#/signin');
    });
    it('should always take you to the Order 1 page', function () {
    	getUrl('/tripleadvantage/order1.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/');
    	getUrl('/credit/order1.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/');
    	getUrl('/credit/credit/order1.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/');
    	getUrl('/order1.aspx?sc=XXXXXX&bcd=');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/');
    });
    it('/credit should give you the Order 1 page', function () {
    	getUrl('/credit');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/');
    	expect(element.all(by.css('[ng-controller="orderFunnelLayoutCtrl as lvm"]')).count()).toBe(1);
    });
    it('/credit should take you to the sign in page', function () {
    	getUrl('/Message.aspx?PageTypeID=CreditToolsSummary');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/signin');
    	getUrl('/Message.aspx?PageTypeID=Privacy');
    	expect(bDriver.getCurrentUrl()).toContain('/credit#/signin');
    });
});