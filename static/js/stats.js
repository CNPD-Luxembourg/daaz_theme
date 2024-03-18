$(document).ready(function () {
    const nbQuestions = 20;

    let usersBydate = JSON.parse(document.getElementById('users_by_date').textContent);
    let usersByLevel = JSON.parse(document.getElementById('users_by_level').textContent);
    let scoreBylevel = JSON.parse(document.getElementById('avg_score_by_level').textContent);
    let progressBylevel = JSON.parse(document.getElementById('avg_progress_by_level').textContent);
    let questionsSuccessRate = JSON.parse(document.getElementById('questions_success_rate').textContent);

    let aggregatedUsersBydate = aggregateByYear(usersBydate);
    let successRateByQuestion = aggregateByLevel(questionsSuccessRate);
    let questionLabels = getQuestionLabels(successRateByQuestion, nbQuestions);
    let user_dates_values = Object.values(aggregatedUsersBydate);
    let user_dates = Object.keys(aggregatedUsersBydate);
    let user_levels = usersByLevel.map(user => `Level ${user.level_index}: ${user.level_name}`)
    let user_levels_values = usersByLevel.map(user => user.count)
    let score_levels_values = scoreBylevel.map(user => user.avg_score / 100)
    let progress_levels_values = progressBylevel.map(user => user.avg_progress / 100)

    const users_by_year_ctx = document.getElementById('users_by_year_chart');
    const users_by_level_ctx = document.getElementById('users_by_level_chart');
    const users_and_score_by_level_ctx = document.getElementById('users_and_score_by_level_chart');
    const users_and_progress_by_level_ctx = document.getElementById('users_and_progress_by_level_chart');
    const success_rate_by_question_ctx = document.getElementById('success_rate_by_question_chart');


    drawMatrixActivityChart(usersBydate);

    drawSingleAxisChart(
        'bar',
        users_by_year_ctx,
        user_dates,
        user_dates_values,
        'time'
    );

    drawSingleAxisChart(
        'bar',
        users_by_level_ctx,
        user_levels,
        user_levels_values
    );

    drawMultipleAxisChart(
        'bar',
        users_and_score_by_level_ctx,
        user_levels,
        'Users',
        user_levels_values,
        'Average score',
        score_levels_values
    );

    drawMultipleAxisChart(
        'bar',
        users_and_progress_by_level_ctx,
        user_levels,
        'Users',
        user_levels_values,
        'Average progress',
        progress_levels_values
    );

    drawRadarChart(success_rate_by_question_ctx, questionLabels, successRateByQuestion, nbQuestions);

    function drawMatrixActivityChart(data, start_date) {
        $('#surveys-activity').github_graph({
            start_date: start_date ? start_date : null,
            data: usersBydate,
            texts: ['user', 'users'],
            click: function (date, count) {
                let clickDate = new Date(date);
                let pastYear = clickDate.setFullYear(clickDate.getFullYear() - 1);
                drawMatrixActivityChart(usersBydate, pastYear);
            }
        });
    }

    function drawSingleAxisChart(chartType, ctx, labels, values, typeXaxis = 'category') {
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
                        time: {
                            unit: 'year',
                            displayFormats: {
                                year: 'yyyy'
                            },
                            tooltipFormat: 'yyyy'
                        },
                        ticks: {
                            source: 'labels'
                        }
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

    function drawMultipleAxisChart(chartType, ctx, labels, legendYaxis, valuesYaxis, legendY2axis, valuesY2axis, typeXaxis = 'category') {
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
                                minimumFractionDigits: 0
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

    function drawRadarChart(ctx, labels, values, nbElements) {
        let radarChart = new Chart(ctx, {
            type: "radar",
            data: {
                labels: labels,
                datasets: []
            },
            options: {
                responsive: true,
            },
        });
        for (let key in values) {
            radarChart.data.datasets.push(
                {
                    label: key,
                    data: values[key].map((value, index) => { if (index < nbElements) return value.success_rate })
                }
            )
        }
        radarChart.update();
    }

    function aggregateByYear(data) {
        return data.reduce((acc, entry) => {
            const year = new Date(entry.timestamp);
            const yearKey = year.getFullYear();
            if (!acc[yearKey]) {
                acc[yearKey] = 0;
            }
            acc[yearKey] += entry.count;
            return acc;
        }, {});
    }

    function aggregateByLevel(data) {
        return data.reduce((acc, obj) => {
            obj.success_rate = obj.success_rate === null ? 0.0 : obj.success_rate * 100;
            const key = obj.level__translations__name;
            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(obj);
            return acc;
        }, {});
    }

    function getQuestionLabels(data, nbElements) {
        if (Object.keys(data).length === 0) return [];
        let labels = [];
        data[Object.keys(data)[0]].forEach((value, index) => {
            if (index < nbElements) {
                labels.push(`Q${index + 1}`);
            }
        })
        return labels
    }
});
