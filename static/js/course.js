$(document).ready(function () {
    const $checkboxesAndRadios = $(".form-check-input");
    const $submitButton = $("#summitButton");
    const $carouselCourse = $("#carouselCourse");
    const $progressBar = $(".course-progress-bar");
    const $changeSlideButton = $(".change_slide");
    const updateProgressBar_url = "update_progress_bar/";
    const changeSlide_url = "change_slide/"+"?direction=";
    const fadeOutDelay = 500;
    const fadeInDelay = 0;


    function processCheckboxSelection () {
        $submitButton.prop("disabled", !$checkboxesAndRadios.is(":checked"));
    }

    function loadSlide (button) {
        const $button = $(button);
        $carouselCourse.load(changeSlide_url + $button.data("bs-slide"), function () {
            $progressBar.fadeOut(fadeOutDelay);
            $progressBar.load(updateProgressBar_url);
            $progressBar.fadeIn(fadeInDelay);
        });
    }

    if ($checkboxesAndRadios.length > 0) {
        processCheckboxSelection($checkboxesAndRadios.filter(':checked').first());
    }

    $checkboxesAndRadios.on("click", function () {
        processCheckboxSelection();
    });

    $changeSlideButton.on("click", function () {
        loadSlide($(this));
    });
});
