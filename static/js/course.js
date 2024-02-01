$(document).ready(function () {
    const $checkboxesAndRadios = $(".front .form-check-input");
    const $backSlide = $(".back");
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
    const $buttonsRadioOptions = $(".option-button-radio")

    if (document.getElementById('is_question_answered')) {
        var is_question_answered = JSON.parse(document.getElementById('is_question_answered').textContent);
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    function processCheckboxSelection() {
        $submitButton.prop("disabled", !$checkboxesAndRadios.is(":checked"));
    }

    function loadSlide(button) {
        const $button = $(button);
        $backSlide.addClass('d-none');
        $carouselCourse.load(changeSlide_url + $button.data("bs-slide"), function () {
            $progressBar.fadeOut(fadeOutDelay);
            $progressBar.load(updateProgressBar_url);
            $progressBar.fadeIn(fadeInDelay);
            $backSlide.removeClass('d-none');
        });
    }

    function checkSortingAnswers() {
        const $frontSortingFields = $(".front .draggable-item");
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
        if ($filteredAnswers.hasClass('option-button-radio') && !$filteredAnswers.hasClass('correct-answer')) {
            $filteredAnswers.siblings().addClass('border-danger bg-light-red');
        }
    }

    $questionCard.flip({ trigger: 'manual' });

    if (!is_question_answered) {
        if ($checkboxesAndRadios.length > 0) {
            checkSingleAndMultipleAnswers()
        }

        if ($backSortingFields.length > 0) {
            checkSortingAnswers()
        }
        $nextControlButton
            .removeClass('control_disabled')
            .find("i")
            .removeClass('text-secondary')
            .addClass('text-primary');

        $questionCard.flip(true);
    }


    if ($checkboxesAndRadios.length > 0) {
        processCheckboxSelection($checkboxesAndRadios.filter(':checked').first());
    }

    if ($buttonsRadioOptions.length > 0) {
        $buttonsRadioOptions.each(function () {
            $(this).on('change', function () {
                $('#id_' + $(this).attr('name') + ' .btn').removeClass('active');
                if (this.checked) {
                    $(this).siblings().addClass('active text-light');
                }
            });
        })
    }


    $checkboxesAndRadios.on("click", function () {
        processCheckboxSelection();
    });

    $changeSlideButton.on("click", function () {
        loadSlide($(this));
    });

    $submitButton.on("click", function (e) {
        e.preventDefault();
        const csrftoken = getCookie('csrftoken');
        const $frontSortingFields = $(".active .front .draggable-item");
        let formdata = $("#question-form").serialize();

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
    });

    $flipButton.on("click", function () {
        if ($backSortingFields.length > 0) {
            checkSortingAnswers()
        }
        if ($checkboxesAndRadios.length > 0) {
            checkSingleAndMultipleAnswers()
        }

        $nextControlButton
            .removeClass('control_disabled')
            .find("i")
            .removeClass('text-secondary')
            .addClass('text-primary');

        $questionCard.flip('toggle');
    });
});
