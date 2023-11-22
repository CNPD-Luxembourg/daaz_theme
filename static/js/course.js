$(document).ready(function () {
    const $checkboxesAndRadios = $(".front .form-check-input");
    const $answersCheckboxesAndRadios = $(".back .form-check-input");
    const $backSortingFields = $(".back .draggable-item");

    const $submitButton = $("#summitButton");
    const $carouselCourse = $("#carouselCourse");
    const $progressBar = $(".course-progress-bar");
    const $questionCard = $("#question-card");
    const $flipButton = $(".flip");
    const $changeSlideButton = $(".change_slide");
    const $prevControlButton = $(".carousel-control-prev");
    const $nextControlButton = $(".carousel-control-next");
    const updateProgressBar_url = "update_progress_bar/";
    const changeSlide_url = "change_slide/" + "?direction=";
    const fadeOutDelay = 500;
    const fadeInDelay = 0;


    function processCheckboxSelection() {
        $submitButton.prop("disabled", !$checkboxesAndRadios.is(":checked"));
    }

    function loadSlide(button) {
        const $button = $(button);
        $carouselCourse.load(changeSlide_url + $button.data("bs-slide"), function () {
            $progressBar.fadeOut(fadeOutDelay);
            $progressBar.load(updateProgressBar_url);
            $progressBar.fadeIn(fadeInDelay);
        });
    }

    function checkSortingAnswers() {
        const $frontSortingFields = $(".front .draggable-item");
        $frontSortingFields.each(function (index, frontField) {
            const frontValue = $(frontField).attr("value");
            const backField = $backSortingFields.get(index);
            if (frontValue !== $(backField).attr("value")) {
                $(backField).addClass('border-danger');
                $(backField).children().even().addClass('text-danger');
            }
        });
    }

    function checkSingleAndMultipleAnswers() {
        const checkedValues = $checkboxesAndRadios.filter(':checked').map(function () {
            return this.value;
        }).get();

        const $filteredAnswers = $answersCheckboxesAndRadios.filter(function () {
            if (checkedValues.includes(this.value)) {
            }
            return checkedValues.includes(this.value);
        });

        $filteredAnswers.prop('checked', true);
        $filteredAnswers.addClass('wrong-answer');
    }

    $questionCard.flip({ trigger: 'manual' });


    if ($checkboxesAndRadios.length > 0) {
        processCheckboxSelection($checkboxesAndRadios.filter(':checked').first());
    }
    $questionCard.flip({ trigger: 'manual' });

    $checkboxesAndRadios.on("click", function () {
        processCheckboxSelection();
    });

    $changeSlideButton.on("click", function () {
        loadSlide($(this));
    });

    $flipButton.on("click", function () {
        if ($backSortingFields.length > 0) {
            checkSortingAnswers()
        }
        if ($checkboxesAndRadios.length > 0) {
            checkSingleAndMultipleAnswers()
        }

        $prevControlButton.addClass('control_disabled');
        $nextControlButton.removeClass('control_disabled');
        $questionCard.flip('toggle');
    });
});
