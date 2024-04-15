$(document).ready(function () {
    $('.go-to-download').click(function() {
        $('#CheckAll').prop('checked', false);
        $('#CheckAll').prop('disabled', false);
        $('#CheckAll').parent().show();
        var $popup = $("#resources_download");
        var popup_url = 'resources_download/';
        if ($(this).data("level-id")){
            var popup_url = 'resources_download/' + '?level='+ $(this).data("level-id");
        }
        if ($(this).data("rt-id")){
            var popup_url = 'resources_download/' + '?resource_type='+ $(this).data("rt-id");
        }

        $(".modal-body", $popup).load(popup_url, function (response,status, xhr) {
            if (status === 'error') {
                window.location.href = "/";
            } else {
                $popup.modal("show");
            }
        });
    });

});
