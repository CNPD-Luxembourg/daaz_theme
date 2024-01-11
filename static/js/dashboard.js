
$(document).ready(function () {
    let progress = JSON.parse(document.getElementById('progress-data').textContent);

    const doughnutLabel = {
        id: 'doughnutLabel',
        beforeDraw(chart){
            let width = chart.width;
            let height = chart.height + 10;
            let {ctx, data} = chart;
            let fontSize = (height/100).toFixed(2);
            ctx.font = `bold ${fontSize}em Inter`;
            ctx.textBaseline = "middle";

            let text = `${data.datasets[0].data[0]}%`,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();

        },
    }

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
                maintainAspectRatio: false,
                cutout: "75%",
                plugins: {
                    tooltip: {
                        enabled: false
                    }
                },
            },
            plugins:[doughnutLabel]
        });
    });

});
