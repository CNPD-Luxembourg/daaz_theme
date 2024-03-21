$(document).ready(function () {
    $('.start').click(function() {
        var $popup = $("#start");
        var popup_url = '/start/';

        $(".modal-dialog", $popup).load(popup_url, function () {
            $popup.modal("show");
        });
    });


    $('.navbar .nav-link').click(function() {
      if ($(this).attr('href') !== undefined) {
          divId = $(this).attr('href').split("#").pop();
          $('html, body').animate({
            scrollTop: $("#" + divId).offset().top - 110
          }, 100);
      }
    });

    $('.navbar .navbar-brand').click(function() {
      if ($(this).attr('href') !== undefined) {
          divId = $(this).attr('href').split("#").pop();
          $('html, body').animate({
            scrollTop: $("#" + divId).offset().top - 110
          }, 100);
      }
    });
});
