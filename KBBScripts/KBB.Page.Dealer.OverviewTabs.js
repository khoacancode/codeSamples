var KBB = KBB || {};
KBB.Page = KBB.Page || {};
KBB.Page.Classifieds = KBB.Page.Classifieds || {};

KBB.Page.Classifieds.VehicleDetailsTabs = (function () {
    'use strict';

    var dataLayer = KBB.Page.getDataLayer();
    var defaultTabName = 'overview';
    var overviewTabButton;
    var mapTabButton;
    var subheader;

    var overviewContent;
    var mapContent;

    var currentTabName;

    var getCurrentTabName = function () {
        return currentTabName;
    };

    var setCurrentTabName = function (tabName) {
        currentTabName = tabName;
    };

    var updateUrlParameter = function (tabName) {
        window.history.pushState({ isTab: true },
            null,
            KBB.helpers.replaceUrlParameter(window.location.href, 'tab', tabName)
        );
    };

    // checks if tab state object was set otherwise allow to navigate to the last page
    var handlePopstate = function (e) {
        if (e.originalEvent.state && e.originalEvent.state.isTab === true) {
            e.preventDefault();
            setCurrentTabName(KBB.helpers.getUrlParameters(window.location.search).tab || defaultTabName);
        }
    };

    var omnitureTab = function (tabTarget) {
        if (tabTarget === 'overview') {
            dataLayer.classifiedsinfo.tab = 'tab';
        }
        else if (tabTarget === 'map') {
            dataLayer.classifiedsinfo.tab = 'mapviewtab';
        }
    };

    var highlightTab = function (e) {
        var node = e.target;
        var tabTarget = node.getAttribute('data-tab');

        $('.js-dealer-tabs .selected').removeClass('selected');
        $('.js-dealer-tab-content').addClass('hidden-tab-content');

        if (tabTarget === 'overview') {
            overviewTabButton.addClass('selected');
            overviewContent.classList.remove('hidden-tab-content');
            subheader.innerHTML = 'Dealer Overview';
        }
        else if (tabTarget === 'map') {
            mapTabButton.addClass('selected');
            mapContent.classList.remove('hidden-tab-content');
            subheader.innerHTML = 'Dealer Map';
        }

        omnitureTab(tabTarget);

        setTimeout(function () {
            //Fire the page call.  The timeout is to ensure that this happens after all the
            //event handlers are completed
            KBB.Page.trigger(KBB.Page.Events.DealerOverviewTab);
        });

        setCurrentTabName(tabTarget);
        updateUrlParameter(getCurrentTabName());
    };

    var bindEvents = function () {
        overviewTabButton.on('click.dealerOverview', function (e) {
            highlightTab(e);
        });

        mapTabButton.on('click.dealerOverview', function (e) {
            highlightTab(e);
        });

        //Update state according to URL parameter on navigation
        $(window).on('popstate.dealerOverview', handlePopstate);
    };

    var init = function (container) {
        overviewTabButton = $('.js-overview-tab-button');
        mapTabButton = $('.js-map-tab-button');

        overviewContent = document.getElementById('overviewContent');
        mapContent = document.getElementById('mapContent');
        subheader = document.getElementById('classifiedsSubhead');

        setCurrentTabName(defaultTabName);

        bindEvents();
    };

    return {
        init: init,
        getCurrentTabName: getCurrentTabName,
        setCurrentTabName: setCurrentTabName
    };
})();

KBB.Page.Classifieds.VehicleDetailsTabs.init();
