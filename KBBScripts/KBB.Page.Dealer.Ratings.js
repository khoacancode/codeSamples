var KBB = KBB || {};
KBB.Page = KBB.Page || {};
KBB.Page.Dealer = KBB.Page.Dealer || {};

KBB.Page.Dealer.Ratings = (function () {
    'use strict';

    var populate = function ($container) {
        $container.find('.thermo-light').each(function () {
            var valueRatio = $(this).data('value').split('/');
            var value = parseFloat(valueRatio[0]);
            var total = parseInt(valueRatio[1]);

            $(this).empty();
            $(this).append('<span class="rating-value">' + (value < 0.05 ? 'N/A' : value.toFixed(1)) + '</span>');

            var ratings = KBB.Ratings.determineRating(value, total);

            $(this).append(ratings);
        });
    };

    return {
        init: function () {
            populate($(document));
        },

        populate: function ($container) {
            populate($container);
        },

        determineRating: function (value, total) {
            return KBB.Ratings.determineRating(value, total);
        }
    };
}());


KBB.Page.Dealer.Ratings.init();
