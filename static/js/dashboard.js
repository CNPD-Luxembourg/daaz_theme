
$(document).ready(function () {
    let progressValues = JSON.parse(document.getElementById('progress-data').textContent);
    let successValues = JSON.parse(document.getElementById('success-data').textContent);

    progressValues.forEach((value, i) => {
        let index = i + 1;
        let progress_sm_ctx = document.getElementById('progress_sm' + index);
        doughnutChart(progress_sm_ctx, value, false)
    });

    successValues.forEach((value, i) => {
        let index = i + 1;
        let success_ctx = document.getElementById('success' + index);
        doughnutChart(success_ctx, value)

        let success_sm_ctx = document.getElementById('success_sm' + index);
        doughnutChart(success_sm_ctx, value, false)
    });

    function doughnutChart(ctx, value, responsive = true) {
        const doughnutLabel = {
            id: 'doughnutLabel',
            beforeDraw(chart) {
                let width = chart.width;
                let height = chart.height + 10;
                let { ctx, data } = chart;
                let fontSize = (height / 100).toFixed(2);
                ctx.font = `bold ${fontSize}em Inter`;
                ctx.textBaseline = "middle";

                let text = `${Math.round(data.datasets[0].data[0])}%`,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                ctx.fillText(text, textX, textY);
                ctx.save();

            },
        }
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [value, value - 100],
                    backgroundColor: ['#0099FF', '#ECF6FF'],
                    borderWidth: 0,
                    borderRadius: [(value < 100) ? 10 : 0, 0],
                }]
            },
            options: {
                responsive: responsive,
                maintainAspectRatio: false,
                cutout: "75%",
                events: [],
                plugins: {
                    tooltip: {
                        enabled: false
                    }
                },
            },
            plugins: [doughnutLabel]
        });

    }

});
