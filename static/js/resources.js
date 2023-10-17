$(document).ready(function () {
    $('.go-to-download').click(function() {
        var $popup = $("#resources_download");
        var popup_url = 'resources_download/';
        if ($(this).data("level-id")){
            var popup_url = 'resources_download/' + '?level='+ $(this).data("level-id");
        }
        if ($(this).data("rt-id")){
            var popup_url = 'resources_download/' + '?resource_type='+ $(this).data("rt-id");
        }

        $(".modal-body", $popup).load(popup_url, function () {
            $popup.modal("show");
        });
    });


    $('#CheckAll').change(function (e) {
        if (e.currentTarget.checked) {
            $('.option').find('input[type="checkbox"]').not(":disabled").prop('checked', true);
        } else {
            $('.option').find('input[type="checkbox"]').not(":disabled").prop('checked', false);
        }
    });
});
