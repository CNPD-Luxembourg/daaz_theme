$(document).ready(function () {
    const checkboxes = $(".form-check-input:not(#CheckAll)");
    const downloadButton = $("#downloadButton");
    const checkboxesDisabled = checkboxes.filter(':disabled');
    const checkAllInput = $("#CheckAll");

    function updateCheckAll() {
        checkAllInput.prop('checked', checkboxes.not(":disabled").length === checkboxes.not(":disabled").filter(":checked").length);
    }

    function processCheckboxSelection(checkbox) {
        downloadButton.prop("disabled", !checkboxes.is(":checked"));
    }

    checkboxes.on("change", function () {
        updateCheckAll();
        processCheckboxSelection($(this));
    });

    checkAllInput.on("change", function () {
        const isChecked = this.checked;
        checkboxes.not(":disabled").prop('checked', isChecked);
        downloadButton.prop("disabled", !isChecked);
    });

    if (checkboxes.length > 0) {
        processCheckboxSelection(checkboxes.filter(':checked').first());
    } else {
        checkAllInput.parent().hide();
    }

    if (checkboxesDisabled.length === checkboxes.length) {
        checkAllInput.prop('disabled', true);
    }
});
