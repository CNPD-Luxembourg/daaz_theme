$(document).ready(function () {
    $('.start').click(function() {
        var $popup = $("#start");
        var popup_url = 'start/';

        $(".modal-dialog", $popup).load(popup_url, function () {
            $popup.modal("show");
        });
    });
});
