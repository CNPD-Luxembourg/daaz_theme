
$(document).ready(function () {
    let usersData = JSON.parse(document.getElementById('users-data').textContent);


    let users_ctx = document.getElementById('users_stats');
    let users_data = [10,5,10,5,5,2,1];
    barChart(users_ctx,users_data)

    function barChart(ctx,values) {
        const labels = ["jan", "feb", "mar", "apr", "may", "jun", "jul"];
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
            },
        });
    }

    function doughnutChart(ctx, value, responsive = true) {
        const value_rounded = Math.round(value);
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
                    data: [value_rounded, value_rounded - 100],
                    backgroundColor: ['#0099FF', '#ECF6FF'],
                    borderWidth: 0,
                    borderRadius: [(value_rounded < 100) ? 10 : 0, 0],
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
