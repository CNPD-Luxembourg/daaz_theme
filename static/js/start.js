$(document).ready(function () {
    $('.create_new_user').click(function() {
        var $popup = $("#new_user");
        var popup_url = 'new_user/';

        $(".modal-dialog", $popup).load(popup_url, function () {
            $popup.modal("show");
        });
    });
});
