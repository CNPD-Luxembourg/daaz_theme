$(document).ready(function () {
    var checkboxesAndRadios = $(".form-check-input");
    var submitButton = $("#summitButton");

    if (checkboxesAndRadios.length > 0) {
        processCheckboxSelection(checkboxesAndRadios.filter(':checked').first());
    }

    checkboxesAndRadios.click(function() {
        processCheckboxSelection($(this));
    });


    function processCheckboxSelection (checkbox) {
        submitButton.attr("disabled", !checkboxesAndRadios.is(":checked"));
    }

    $('.previous_slide').click(function () {
        var $divId = $("#carouselCourse");
        var $progress_bar_id = $(".course-progress-bar");
        var url = 'previous_slide/';
        $($divId).load(url, function () {
            $($progress_bar_id).fadeOut(500)
            $($progress_bar_id).load("update_progress_bar/")
            $($progress_bar_id).fadeIn(100);
        });
    });

    $('.next_slide').click(function () {
        var $divId = $("#carouselCourse");
        var $progress_bar_id = $(".course-progress-bar");
        var url = 'next_slide/';
        $($divId).load(url, function () {
            $($progress_bar_id).fadeOut(500)
            $($progress_bar_id).load("update_progress_bar/")
            $($progress_bar_id).fadeIn(100);
        });
    });
});
