var KBB = KBB || {};
KBB.Page = KBB.Page || {};
KBB.Page.Dealer = KBB.Page.Dealer || {};

KBB.Page.Dealer.Overview = (function () {
    'use strict';

    var contactSellerModal;

    var bindBIRFAccordion = function () {
        KBB.Page.Classifieds.DetailPageHelper.birfHelper.logImpressionGroup('.js-vehicle-listing', 'kbb_mdot_sp_lstg');

        $('#aboutTheDealership').on('change.vdp', function () {
            if (this.checked) {
                KBB.Page.Classifieds.DetailPageHelper.birfHelper.logClickEvent('kbb_mdot_abt_dlr_exc');
            }
        });
    };

    // Note: This is done so the page can be responsive and not adaptive
    // It would be more straightforward if the contact form wasn't in a modal.
    // Future devs should see if UX and product is willing to revisit how this form appears
    var bindLeadForm = function () {
        // modal with call / email seller
        $(document).on('click.dealerOverview', '.js-contact-seller', function () {
            contactSellerModal = KBB.Modal.display('#contactSeller');
        });

        // open modal with lead form to contact seller
        $(document).on('click.dealerOverview', '.js-email-seller', function () {
            KBB.Modal.display('#emailSellerModal', 'EmailSellerModal');

            KBB.Modal.close(contactSellerModal);

            //append form
            $('#leadFormModalTarget').html($('#leadForm'));

            // re-init lead form
            KBB.Page.Classifieds.EmailSeller.init();
        });

        // move form back to right rail ...
        $(document).on('click.dealerOverview', '.js-close-lead-form', function () {
            $('#leadFormRightRail').html($('#leadFormModalTarget').html());

            // re-init lead form
            KBB.Page.Classifieds.EmailSeller.init();
        });
    };

    var bindPhotosModal = function () {
        // open modal with lead form to contact seller
        $(document).on('click.dealerOverview', '.js-dealer-photos', function () {
            KBB.Modal.display('#photosModal', 'DealerPhotosModal');
        });
    };

    var init = function () {
        bindBIRFAccordion();
        bindLeadForm();
        bindPhotosModal();
    };

    return {
        init: init
    };
})();

KBB.Page.Dealer.Overview.init();
