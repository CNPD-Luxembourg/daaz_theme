$(document).ready(function () {

    const $carouselCourse = $("#carouselCourse");
    const $carouselContainer = $(".carousel-inner");
    const $progressBarContainer = $("#progress_bar_container");
    const $carouselControls = $(".carousel-control");
    const $prevControlButton = $(".carousel-control-prev");
    const $nextControlButton = $(".carousel-control-next");
    var $downloadReportButton = $("#download-report-button");
    var $questionCard = $carouselContainer.find(".active #question-card");
    var $checkboxesAndRadios = $questionCard.find(".front .form-check-input");
    var $answersCheckboxesAndRadios = $questionCard.find(".back .form-check-input");
    var $backSortingFields = $questionCard.find(".back .draggable-item");
    var $submitButton = $questionCard.find("#summitButton");
    const updateProgressBar_url = "update_progress_bar/?direction=";
    const changeSlide_url = "change_slide/?direction=";

    function processCheckboxSelection() {
        const nbCorrectQuestions = $questionCard.find(".back .form-check-input").filter(':checked').length;
        const $checkedCheckboxes = $checkboxesAndRadios.filter(':checkbox:checked');
        const $uncheckedCheckboxes = $checkboxesAndRadios.not(':checkbox:checked');

        $submitButton.prop("disabled", !$checkboxesAndRadios.is(":checked"));
        if (nbCorrectQuestions > 0) {
            $uncheckedCheckboxes.prop('disabled', $checkedCheckboxes.length === nbCorrectQuestions);
        }
    }

    function initializeFlipForCard() {
        $questionCard.flip({ trigger: 'manual', autoSize: false });
    }

    function checkAndFlipQuestionCards() {
        $checkboxesAndRadios = $questionCard.find(".front .form-check-input");
        $backSortingFields = $questionCard.find(".back .draggable-item");
        $sortingQuestionAnswered = $questionCard.find(".front .question_answered");
        if ($checkboxesAndRadios.is(":checked")) {
            if ($checkboxesAndRadios.length > 0) checkSingleAndMultipleAnswers();
            $nextControlButton.removeClass('control_disabled')
            $questionCard.flip(true);
        }

        if ($sortingQuestionAnswered.length > 0) {
            if ($backSortingFields.length > 0) checkSortingAnswers();
            $nextControlButton.removeClass('control_disabled')
            $questionCard.flip(true);
        }

    }

    function delegateSummitButtonClick() {
        $submitButton = $questionCard.find("#summitButton");
        $submitButton.on("click", function (e) {
            e.preventDefault();
            const $frontSortingFields = $(".active .front .draggable-item");
            let formdata = $questionCard.find("#question-form").serialize();

            $.ajax({
                type: "POST",
                url: "/course",
                data: formdata,
                headers: {
                    "X-CSRFToken": csrftoken
                },
                traditional: true,
                success: function (data) {
                },
                error: function (error) {
                }
            });

            if ($backSortingFields.length > 0) checkSortingAnswers()
            if ($checkboxesAndRadios.length > 0) checkSingleAndMultipleAnswers()

            $questionCard.flip('true');
            $nextControlButton.removeClass('control_disabled')

        });
    }

    function delegateInputClick() {
        $checkboxesAndRadios = $questionCard.find(".front .form-check-input");

        $checkboxesAndRadios.on("click", function () {
            processCheckboxSelection();
        });

        if ($checkboxesAndRadios.length > 0) processCheckboxSelection();
    }

    function delegateDownloadReport() {
        $downloadReportButton = $("#download-report-button");
        if ($downloadReportButton.length) {
            $downloadReportButton.on("click", function () {
                $("#download-label").hide();
                $("#download-spinner").show();
                $downloadReportButton.addClass('disabled')

                setTimeout(function () {
                    $("#download-spinner").hide();
                    $("#download-label").show();
                    $downloadReportButton.removeClass('disabled')
                }, 16000);
            });
        }

    }
    function update_progress_bar(event, direction) {
        $carouselControls.addClass('control_blocked')
        let carouselLength = $carouselCourse.find(".carousel-item").length
        const $updateProgressBar = $('<div class="course-progress-bar align-items-center pe-3"></div>');
        $updateProgressBar.load(updateProgressBar_url + direction, function (response, status, xhr) {
            if (status === 'error') {
                window.location.href = "/";
            } else {
                $progressBarContainer.find('.course-progress-bar').remove()
                $progressBarContainer.append($updateProgressBar)
                if (direction === "next" && event.to === carouselLength - 1
                    || direction === "prev" && event.to === 0) {
                    loadSlide(direction)
                } else {
                    $carouselControls.removeClass('control_blocked')
                }
            }
        });
    }

    function loadSlide(direction) {
        const $newSlide = $('<div class="carousel-item pb-sm-2 h-90"></div>');
        $newSlide.load(changeSlide_url + direction, function () {
            const isEmptySlide = $newSlide.find('.empty-slide').length > 0;
            if (isEmptySlide) {
                if (direction === "prev") $prevControlButton.addClass('control_disabled')
                if (direction === "next") $nextControlButton.addClass('control_disabled')
            } else {
                if (direction === "next") $carouselContainer.append($newSlide);
                if (direction === "prev") $carouselContainer.prepend($newSlide);
            }
            $carouselControls.removeClass('control_blocked')
        });
    }

    function checkSortingAnswers() {
        const $frontSortingFields = $questionCard.find(".front .draggable-item");
        $frontSortingFields.each(function (index, frontField) {
            const frontValue = $(frontField).attr("value");
            const backField = $backSortingFields.get(index);
            if (frontValue !== $(backField).attr("value")) {
                $(backField).addClass('border-danger bg-light-red');
                $(backField).children().last().addClass('text-danger');
            } else {
                $(backField).addClass('border-success bg-light-green');
                $(backField).children().last().addClass('text-success');
            }
        });
    }

    function checkSingleAndMultipleAnswers() {
        const nbCorrectQuestions = $questionCard.find(".back .form-check-input").not(".neutral-answer").filter(':checked').length;
        $answersCheckboxesAndRadios = $questionCard.find(".back .form-check-input")
        let checkedValues = $questionCard.find(".front .form-check-input").filter(':checked').map(function () {
            return this.value;
        }).get();

        $answersCheckboxesAndRadios.each(function () {
            if (checkedValues.includes(this.value)) {
                if (nbCorrectQuestions > 0) {
                    $(this).addClass('wrong-answer')
                } else {
                    $(this).addClass('neutral-answer')
                }
                $(this).prop('checked', true);

            } else if (this.checked && this.type === 'checkbox') {
                $(this).addClass('not-checked')
            }
        });
    }

    initializeFlipForCard();
    delegateSummitButtonClick()
    delegateInputClick()
    checkAndFlipQuestionCards()
    delegateDownloadReport()

    if ($carouselContainer.find(".active #question-card").length > 0
        && $carouselContainer.find(".active #question-card").data("flip-model")
        && !$carouselContainer.find(".active #question-card").data("flip-model").isFlipped) {
        $nextControlButton.addClass('control_disabled')
    }

    $carouselCourse.on('slide.bs.carousel', function (event) {
        let $activeSlide = $(event.relatedTarget)
        let direction = event.direction === "left" ? "next" : "prev"

        $carouselControls.removeClass('control_disabled')

        if ($activeSlide.find("#question-card").length > 0) {
            $questionCard = $activeSlide.find("#question-card")
            $nextControlButton.addClass('control_disabled')
            dataFlip = $questionCard.data("flip-model")
            if (!dataFlip) {
                initializeFlipForCard()
                delegateSummitButtonClick()
                delegateInputClick()
                checkAndFlipQuestionCards()
            }

            if (dataFlip && dataFlip.isFlipped) {
                checkAndFlipQuestionCards()
                $nextControlButton.removeClass('control_disabled')
            }
        }
        delegateDownloadReport()
        update_progress_bar(event, direction)
    })
});
