$(document).ready(function () {

    const $carouselCourse = $("#carouselCourse");
    const $carouselContainer = $(".carousel-inner");
    const $progressBarContainer = $("#progress_bar_container");
    const $carouselControls = $(".carousel-control");
    const $prevControlButton = $(".carousel-control-prev");
    const $nextControlButton = $(".carousel-control-next");
    var $questionCard = $carouselContainer.find(".active #question-card");
    var $checkboxesAndRadios = $questionCard.find(".front .form-check-input");
    var $answersCheckboxesAndRadios = $questionCard.find(".back .form-check-input");
    var $backSortingFields = $questionCard.find(".back .draggable-item");
    var $submitButton = $questionCard.find("#summitButton");
    const updateProgressBar_url = "update_progress_bar/?direction=";
    const changeSlide_url = "change_slide/?direction=";

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function processCheckboxSelection() {
        const nbCorrectQuestions = $questionCard.find(".back .form-check-input").filter(':checked').length;
        const $checkedCheckboxes = $checkboxesAndRadios.filter(':checkbox:checked');
        const $uncheckedCheckboxes = $checkboxesAndRadios.not(':checkbox:checked');

        $submitButton.prop("disabled", !$checkboxesAndRadios.is(":checked"));
        $uncheckedCheckboxes.prop('disabled', $checkedCheckboxes.length === nbCorrectQuestions);

    }

    function initializeFlipForCard() {
        $questionCard.flip({ trigger: 'manual', autoSize: false });
    }

    function checkAndFlipQuestionCards() {
        $checkboxesAndRadios = $questionCard.find(".front .form-check-input");
        $backSortingFields = $questionCard.find(".back .draggable-item");
        $sortingQuestionAnswered = $questionCard.find(".front .question_answered");
        if ($checkboxesAndRadios.is(":checked")) {
            if ($checkboxesAndRadios.length > 0) {
                checkSingleAndMultipleAnswers();
            }

            $nextControlButton.removeClass('control_disabled')
            $questionCard.flip(true);
        }

        if ($backSortingFields.length > 0 && $sortingQuestionAnswered.length >0) {
            checkSortingAnswers();
            $nextControlButton.removeClass('control_disabled')
            $questionCard.flip(true);
        }
    }

    function delegateSummitButtonClick() {
        $submitButton = $questionCard.find("#summitButton");
        $submitButton.on("click", function (e) {
            e.preventDefault();
            const csrftoken = getCookie('csrftoken');
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

    function update_progress_bar(event, direction) {
        let carouselLength = $carouselCourse.find(".carousel-item").length
        const $updateProgressBar = $('<div class="course-progress-bar align-items-center pe-3"></div>');
        $updateProgressBar.load(updateProgressBar_url + direction, function () {
            $progressBarContainer.find('.course-progress-bar').remove()
            $progressBarContainer.append($updateProgressBar)
            if (direction === "next" && event.to === carouselLength - 1
                || direction === "prev" && event.to === 0) {
                loadSlide(direction)
            }
        });
    }

    function loadSlide(direction) {
        $carouselControls.addClass('control_blocked')
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
        $answersCheckboxesAndRadios = $questionCard.find(".back .form-check-input")
        const checkedValues = $checkboxesAndRadios.filter(':checked').map(function () {
            return this.value;
        }).get();

        $answersCheckboxesAndRadios.each(function () {
            if (checkedValues.includes(this.value)) {
                $(this)
                    .addClass('wrong-answer')
                    .prop('checked', true);
                return checkedValues.includes(this.value);
            } else if (this.checked && this.type === 'checkbox') {
                $(this).addClass('not-checked')
            }
        });
    }

    initializeFlipForCard();
    delegateSummitButtonClick()
    delegateInputClick()
    checkAndFlipQuestionCards()

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
            }
        }
        update_progress_bar(event, direction)
    })
});
