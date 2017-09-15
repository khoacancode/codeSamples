/*global  $ VehicleDropdown */
var KBB = KBB || {};
KBB.CombinedSlp = (function () {
    'use strict';

    var $vehicleClassInput = $('#vehicleClassInput'),
        $filterByCpoInput = $('#filterByCpoInput'),
        $intentDropdown = $('#intentDropdown'),
        $yearDropdown = $('#yearDropdown'),
        $makeDropdown = $('#makeDropdown'),
        $modelDropdown = $('#modelDropdown'),
        $styleDropdown = $('#styleDropdown'),
        $nextButton = $('#startMyResearchBtn'),
        $selectedCars = $('.vehicles-wrapper'),
        $dropdownsSet = $('#dropdownsSet'),
        $btnAddAnother = $('#btnAddAnother'),
        $addAnotherText = $('.addAnotherText'),
        storageKey = 'selected-cars',
        maxAllowedSelected = 3;


    var nextIntent = null;
    var nextYear = null;
    var nextMake = null;
    var nextModel = null;
    var nextStyle = null;

    var fetchApiUrl = $('#vehicleDropdownForm').attr('data-fetch-api');
    var selectedVehiclesList = JSON.parse(KBB.storage.getFromLocalStorage(storageKey)) || [];

    var vehicleDropdown = new VehicleDropdown({
        defaultDropdownOrder: 'YMM',
        preselectYear: true,
        preselectStyle: true,
        showOnlyCpo: $('#vehicleClassOptionCpo').is(':selected'),

        showOnlyCpoCheck: 'cpo-check-box',
        submitButton: 'submitButton'
    });

    var onAddAnother = function () {
        $dropdownsSet.removeClass('hidden');

        $addAnotherText.removeClass('hidden');
        $btnAddAnother.addClass('hidden');
    };

    var onIntentChangeEvent = function (e) {
        nextIntent = $intentDropdown.val();
        $vehicleClassInput.val(nextIntent === 'buy-new' ? 'NewCar' : 'UsedCar');
        $filterByCpoInput.val(nextIntent === 'buy-cpo' ? 'true' : 'false');
        if (nextIntent === 'buy-new') {
            $yearDropdown.removeAttr('data-kbb-ajax').toggleClass('hidden', true);
        } else {
            $yearDropdown.attr('data-kbb-ajax', $yearDropdown.attr('data-kbb-ajax-url')).toggleClass('hidden', false);
        }
        KBB.DropDown.resetDropDowns();
    };

    var initIntents = function () {
        if ($intentDropdown !== null && $intentDropdown.length > 0) {
            if (KBB.DataLayer[0].omniture.intent === 'buynew') {
                $yearDropdown.removeAttr('data-kbb-ajax').toggleClass('hidden', true);
            }

            $intentDropdown.on('change', onIntentChangeEvent);
        }
    };
    var deleteCar = function (index) {
        selectedVehiclesList.splice(index - 1, 1);

        for (var i = 1; i <= selectedVehiclesList.length; i++) {
            selectedVehiclesList[i - 1].index = i;
            selectedVehiclesList[i - 1].isFirst = (i === 1) ? 'active' : '';
        }
        KBB.storage.saveToLocalStorage(storageKey, JSON.stringify(selectedVehiclesList));

        injectSelectedVehicle(selectedVehiclesList);

        if (selectedVehiclesList.length > 0) {
            $nextButton.attr('href', selectedVehiclesList[0].link).removeClass('disabled');
        }

        if (selectedVehiclesList.length < maxAllowedSelected) {
            $btnAddAnother.removeClass('hidden');
        }

        if (selectedVehiclesList.length === 0) {
            $dropdownsSet.removeClass('hidden');
            $nextButton.addClass('disabled');
            $btnAddAnother.addClass('hidden');
            $selectedCars.addClass('hidden');
            $addAnotherText.addClass('hidden');
        }
    };

    var bindRemoveButtons = function () {
        $('.remove-btn').on('click', function () {
            deleteCar($(this).attr('data-index')); //base 1
        });
    };

    var injectSelectedVehicle = function (list) {
        var d = {
            'SelectedVehicle': list
        };
        var template = $('#selectedVehicleTmp').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, d);
        $('#selectedVehlist').html(rendered);

        bindRemoveButtons();
    };

    var addSelectedVehicle = function () {
        if (selectedVehiclesList.length < 3) {
            var data = { modelid: nextModel, bodystyle: nextStyle };
            if (nextIntent) {
                data.intent = nextIntent;
            }

            $.ajax({
                method: 'POST',
                url: fetchApiUrl,
                data: data
            }).done(function (results) {
                var selectedCar = JSON.parse(results);
                selectedVehiclesList = JSON.parse(KBB.storage.getFromLocalStorage(storageKey)) || [];

                selectedCar.isFirst = selectedVehiclesList.length < 1 ? 'active' : '';
                selectedCar.intent = selectedCar.vehicleClass === 'NewCar' ? 'New' : 'Used';
                selectedCar.year = selectedCar.year;
                selectedCar.index = selectedVehiclesList.length + 1; //base 1
                selectedVehiclesList.push(selectedCar);

                KBB.storage.saveToLocalStorage(storageKey, JSON.stringify(selectedVehiclesList));
                if (selectedVehiclesList.length === 1) {
                    $nextButton.attr('href', selectedVehiclesList[0].link).removeClass('disabled');
                }

                injectSelectedVehicle(selectedVehiclesList);

                $selectedCars.removeClass('hidden');
                $dropdownsSet.addClass('hidden');

                KBB.DropDown.resetDropDowns();

                if (selectedVehiclesList.length >= maxAllowedSelected) {
                    $btnAddAnother.addClass('hidden');
                }
                else {
                    $btnAddAnother.removeClass('hidden');
                }
            //fire omniture tag here
                var tagInfo = {
                    tag: {
                        type: 'click',
                        tag: function () {
                            return 'addtolist_' + s.prop2 + '_advisor';
                        }
                    },
                    el: null,
                    trigger: null,
                    type: 'click',
                    target: null
                };
                KBB.Omniture.fireTag(tagInfo);
            });
        }
    };

    var handleMakeChosen = function (data) {
        nextMake = data.id;
    };

    var handleModelChosen = function (data) {
        nextModel = data.id;

    };

    var handleStyleChosen = function (data) {
        nextStyle = data.id;
        addSelectedVehicle(nextStyle);
    };

    var prepareYearData = function (element) {
        return { vehicleClass: $vehicleClassInput.val(), filterByCpo: $filterByCpoInput.val() };
    };

    var prepareMakeData = function (element) {
        return { vehicleClass: $vehicleClassInput.val(), yearid: nextYear || 0, filterByCpo: $filterByCpoInput.val() };
    };

    var prepareModelData = function (element) {
        return { makeid: nextMake };
    };

    var prepareStyleData = function (element) {
        return { modelid: nextModel };
    };
    var handleYearChosen = function (data) {
        nextYear = data.id;
        //title = data.id;
    };

    var init = function () {
        var selects = ($styleDropdown && $styleDropdown.length) ? [$yearDropdown, $makeDropdown, $modelDropdown] : [$yearDropdown, $makeDropdown];
        $.each(selects, function () {
            this.change(function () {
                $nextButton.addClass('disabled');
            });
        });
        
        //load vehicle list from local storage
        selectedVehiclesList = JSON.parse(KBB.storage.getFromLocalStorage(storageKey)) || [];
        if (selectedVehiclesList.length > 0) {
            injectSelectedVehicle(selectedVehiclesList);
            $selectedCars.removeClass('hidden');
            $nextButton.attr('href', selectedVehiclesList[0].link).removeClass('disabled');

            $dropdownsSet.addClass('hidden');

            if (selectedVehiclesList.length >= maxAllowedSelected) {
                $btnAddAnother.addClass('hidden');
                //$dropdownsSet.addClass('hidden');
            }
        }

        KBB.DropDown.initializeDropDowns();
        $btnAddAnother.on('click', onAddAnother);
        initIntents();
    };

    return {
        init: init,
        vehicleDropdown: vehicleDropdown,
        handleYearChosen: handleYearChosen,
        prepareYearData: prepareYearData,
        handleMakeChosen: handleMakeChosen,
        prepareMakeData: prepareMakeData,
        handleModelChosen: handleModelChosen,
        prepareModelData: prepareModelData,
        handleStyleChosen: handleStyleChosen,
        prepareStyleData: prepareStyleData
    };
}());

KBB.CombinedSlp.init();
