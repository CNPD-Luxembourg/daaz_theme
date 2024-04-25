function toggleSidebar() {
    $('#sidebar .switching-item').toggleClass('d-sm-inline');
    $('#sidebar .switching-item').toggleClass('d-sm-none');
    $('#sidebar').toggleClass('minimized');

}

$(document).ready(function () {
    let windowsWidth = $(window).width();
    let sidebarState = JSON.parse(document.getElementById('sidebarState').textContent);
    const tooltips =  $('[data-toggle="tooltip"]')
    tooltips.tooltip({placement: 'auto'})

    $('#sidebarToggle').on("click", function () {
        let newSidebarState = (sidebarState === 'expanded') ? 'minimized' : 'expanded';
        toggleSidebar();
        $.ajax({
            type: "POST",
            url: 'sidebar_state/?state=' + newSidebarState,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function (data) {
                sidebarState = data.state
            },
            error: function (data) {
                console.log(data);
            }
        });
    });

    $(window).on('resize', function(){
        var win = $(this);
        if (win.width() <= 992 && sidebarState === 'expanded') {
            toggleSidebar();
        }else if (win.width() > 992 && sidebarState === 'minimized'){
            toggleSidebar();
        }
    });

    if (windowsWidth <= 992 && sidebarState === 'expanded'){
        toggleSidebar();
    }
});
