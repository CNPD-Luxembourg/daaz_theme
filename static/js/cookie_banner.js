document.addEventListener("DOMContentLoaded", function () {
    window.onload = () => {
        $('#cookiebannerModal').modal('show');
    }

    $(".cookiebannerSubmit").click(function (e) {
        let enable_cookies;
        if (this.name === 'enable_all') {
            enable_cookies = cookiegroups.map((x) => x.id);
        } else {
            let serialized_form = $("#cookiebannerForm").serializeArray();
            let checked_cookiegroups = serialized_form.map((x) => x.name);
            enable_cookies = cookiegroups
                .filter((x) => {
                    return checked_cookiegroups.includes(x.id) ? x : !x.optional;
                })
                .map((x) => x.id);
        }

        // set the temporal cookie.
        let secure = window.location.hostname === 'localhost' ? "" : "secure";
        document.cookie = `cookiebanner=__temp__${encodeURIComponent(enable_cookies)}; path=/; ${secure}`;
        location.reload();
    })
});
