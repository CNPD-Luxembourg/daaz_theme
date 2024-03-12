
$(document).ready(function () {
    let usersBydate = JSON.parse(document.getElementById('users_by_date').textContent);
    let usersByLevel = JSON.parse(document.getElementById('users_by_level').textContent);
    let scoreBylevel = JSON.parse(document.getElementById('avg_score_by_level').textContent);
    let progressBylevel = JSON.parse(document.getElementById('avg_progress_by_level').textContent);

    let user_levels = usersByLevel.map(user => user.current_level__index)
    let user_levels_values = usersByLevel.map(user => user.count)
    let score_levels_values = scoreBylevel.map(user => user.avg_score/100)
    let progress_levels_values = progressBylevel.map(user => user.avg_progress/100)

    const users_by_level_ctx = document.getElementById('users_by_level_chart');
    const users_and_score_by_level_ctx = document.getElementById('users_and_score_by_level_chart');
    const users_and_progress_by_level_ctx = document.getElementById('users_and_progress_by_level_chart');


    $('#surveys-activity').github_graph({
        data: usersBydate ,
        texts: ['user','users'],
      });


    drawSingleAxisChart(
        'bar',
        users_by_level_ctx,
        user_levels,
        user_levels_values
    )

    drawMultipleAxisChart(
        'bar',
        users_and_score_by_level_ctx,
        user_levels,
        'Users',
        user_levels_values,
        'Average score',
        score_levels_values
    )
    drawMultipleAxisChart(
        'bar',
        users_and_progress_by_level_ctx,
        user_levels,
        'Users',
        user_levels_values,
        'Average progress',
        progress_levels_values
    )

    function drawSingleAxisChart(chartType,ctx,labels, values, typeXaxis = 'category') {
        new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
                scales: {
                    x: {
                        type: typeXaxis,
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        }
                    }
                },
            },
        });
    }

    function drawMultipleAxisChart(chartType, ctx, labels,  legendYaxis, valuesYaxis, legendY2axis, valuesY2axis, typeXaxis = 'category') {
        new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [
                    {
                        label: legendYaxis,
                        data: valuesYaxis,
                        yAxisID: 'y',
                        order: 1
                    },
                    {
                        label: legendY2axis,
                        data: valuesY2axis,
                        yAxisID: 'y2',
                        type: 'line',
                        order: 0
                    },
                ]
            },
            options: {
                plugins: {
                },
                responsive: true,
                scales: {
                    x: {
                        type: typeXaxis,
                    },
                    y: {
                        type: 'linear',
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        }
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        suggestedMax: 1,
                        suggestedMin: 0,
                        beginAtZero: true,
                        ticks: {
                            format: {
                                style: 'percent',
                                minimumFractionDigits:0
                            },
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
            },
        });
    }
});
