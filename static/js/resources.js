$(document).ready(function () {
    $('#CheckAll').change(function (e) {
        if (e.currentTarget.checked) {
            $('.option').find('input[type="checkbox"]').prop('checked', true);
        } else {
            $('.option').find('input[type="checkbox"]').prop('checked', false);
        }
    });
});
