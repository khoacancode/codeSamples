var KBB = KBB || {}; // eslint-disable-line no-use-before-define
KBB.Page = KBB.Page || {};
KBB.Page.Home = KBB.Page.Home || {};
KBB.Page.Home.Fdpq = (function (dataLayerInfo) {
    'use strict';

    var contentArea = document.getElementById('pageContent'),
        form = document.getElementById('fdpqForm'),
        makeApiUrl = form ? form.getAttribute('data-make-api') : null,
        modelApiUrl = form ? form.getAttribute('data-model-api') + '&makeid=' : null,
        $makeSelect = $('#fdpqMake'),
        $modelSelect = $('#fdpqModel'),
        $fdpqGetQuote = $('#fdpqGetQuote'),
        $fdpqGetQuoteSimple = $('#fdpqGetQuoteSimple');

    var resetAll = function () {
        $modelSelect
            .attr('disabled', '')
            .empty()
            .append($('<option></option>')
                .attr('value', '')
                .text('Select Model'));
    };

    var populateModel = function (data) {
        $modelSelect
            .attr('disabled', '')
            .empty()
            .append($('<option></option>')
                .attr('value', '')
                .text('Select Model'));

        for (var i = 0; i < data.length; i++) {
            $modelSelect
                .append($('<option></option>')
                .attr('value', data[i].name.replace('&', '-'))
                .attr('id', data[i].id)
                .text(data[i].name))
                .removeAttr('disabled');
        }
    };

    var getModel = function (id, onSuccess) {
        $.ajax({
            url: modelApiUrl + id,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                populateModel(data);

                if (onSuccess !== undefined) {
                    onSuccess();
                }
            }
        });
    };

    //If we are on a page that has make model preselect them here.
    var preselectMakeModel = function () {
        var pageMakeId = dataLayerInfo.manufacturer.id,
            pageModelId = dataLayerInfo.model.id;
        var makeSelectValue;

        if (pageMakeId !== '') {
            makeSelectValue = $makeSelect.find('#' + pageMakeId).val();
            if (makeSelectValue) {
                $makeSelect.val(makeSelectValue);

                getModel($makeSelect.find('option:selected').attr('id'), function () {
                    if (pageModelId !== '') {
                        $modelSelect.val($modelSelect.find('#' + pageModelId).val());
                    }
                });
            }
        }
    };

    var populateMake = function (data) {

        $makeSelect
            .removeAttr('disabled');

        for (var i = 0; i < data.length; i++) {
            $makeSelect
                .append($('<option></option>')
                .attr('value', data[i].name)
                .attr('id', data[i].id)
                .text(data[i].name));
        }

        $makeSelect.on('change', function () {
            if (this.value === '') {
                resetAll();
            } else {
                getModel($(this).find('option:selected').attr('id'));
            }
        });

        preselectMakeModel();
    };

    var getMake = function () {
        $.ajax({
            url: makeApiUrl,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                populateMake(data);
            }
        });
    };

    var init = function () {
        // run only if form is present
        if (contentArea.contains(form)) {
            resetAll();
            getMake();
            $fdpqGetQuoteSimple.on('click', function () {
                $fdpqGetQuote.trigger('click');
            });
        }
    };

    return {
        init: init
    };

})(KBB.DataLayer[0].info);


KBB.Page.Home.Fdpq.init();
