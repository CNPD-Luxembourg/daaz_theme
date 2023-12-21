
$(document).ready(function () {
    let progress = JSON.parse(document.getElementById('progress-data').textContent);

    progress.forEach((el, i) => {
        let index = i + 1;
        let progress = el;
        let progress_ctx = document.getElementById('progress' + index)
        new Chart(progress_ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [progress, progress - 100],
                    backgroundColor: ['#0099FF', '#FFFFFF'],
                    borderWidth: 0,
                    borderRadius: 10,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: "75%",
                plugins: {
                    tooltip: {
                        enabled: false
                    }
                },
            }
        });
    });

});
