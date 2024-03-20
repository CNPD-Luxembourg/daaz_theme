$(document).ready(function () {
    const nbQuestions = 20;
    const topOfCurrentPosition = 10;

    let usersBydate = JSON.parse(document.getElementById('users_by_date').textContent);
    let usersByLevel = JSON.parse(document.getElementById('users_by_level').textContent);
    let scoreBylevel = JSON.parse(document.getElementById('avg_score_by_level').textContent);
    let progressBylevel = JSON.parse(document.getElementById('avg_progress_by_level').textContent);
    let questionsSuccessRate = JSON.parse(document.getElementById('questions_success_rate').textContent);
    let users_current_position = JSON.parse(document.getElementById('users_current_position').textContent);

    let aggregatedUsersBydate = aggregateByYear(usersBydate);
    let successRateByQuestion = aggregateQuestionsByLevel(questionsSuccessRate);
    let questionLabels = getQuestionLabels(successRateByQuestion, nbQuestions);
    let successRateByQuiz = aggregateQuizByLevel(questionsSuccessRate);
    let quizLabels = getQuestionLabels(successRateByQuiz)
    let successRateByCategory = aggregateByCategory(questionsSuccessRate);
    let categoryLabels = Object.keys(successRateByCategory);
    let categories_values = Object.values(successRateByCategory);
    let user_dates_values = Object.values(aggregatedUsersBydate);
    let user_dates = Object.keys(aggregatedUsersBydate);
    let user_levels = usersByLevel.map(user => `Level ${user.level_index}: ${user.level_name}`);
    let user_levels_values = usersByLevel.map(user => user.count);
    let score_levels_values = scoreBylevel.map(user => user.avg_score / 100);
    let progress_levels_values = progressBylevel.map(user => user.avg_progress / 100);
    let user_current_position = users_current_position.map(position => `Level ${position.current_level__index} Slide ${position.current_position}`).slice(0, topOfCurrentPosition);
    let user_current_position_values = users_current_position.map(position => position.total_users).slice(0, topOfCurrentPosition);

    const users_by_year_ctx = document.getElementById('users_by_year_chart');
    const users_by_level_ctx = document.getElementById('users_by_level_chart');
    const users_and_score_by_level_ctx = document.getElementById('users_and_score_by_level_chart');
    const users_and_progress_by_level_ctx = document.getElementById('users_and_progress_by_level_chart');
    const success_rate_by_question_ctx = document.getElementById('success_rate_by_question_chart');
    const success_rate_by_quiz_ctx = document.getElementById('success_rate_by_quiz_chart');
    const success_rate_by_knowledge_ctx = document.getElementById('success_rate_by_knowledge_chart');
    const users_current_position_ctx = document.getElementById('users_current_position_chart');


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

    drawRadarChart(
        success_rate_by_question_ctx,
        questionLabels,
        successRateByQuestion,
        nbQuestions
    );

    drawRadarChart(
        success_rate_by_quiz_ctx,
        quizLabels,
        successRateByQuiz,
    );

    drawLinePercentChart(
        success_rate_by_knowledge_ctx,
        categoryLabels,
        categories_values
    );

    drawLinePieChart(
        users_current_position_ctx,
        user_current_position,
        user_current_position_values
    );

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
        let datasets = [];
        for (let key in values) {
            let data = values[key].map(value => value.success_rate)
            datasets.push(
                {
                    label: key,
                    data: nbElements ? data.slice(0, nbElements) : data,
                }
            )
        }

        new Chart(ctx, {
            type: "radar",
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.raw.toFixed()}%`;
                            }
                        }
                    }
                },
                responsive: true,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return `${value}%`;
                            }
                        }
                    },
                },
            },
        });
    }

    function drawLinePercentChart(ctx, labels, values) {
        new Chart(ctx, {
            type: 'line',
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
                    y: {
                        suggestedMax: 1,
                        suggestedMin: 0,
                        beginAtZero: true,
                        ticks: {
                            format: {
                                style: 'percent',
                                minimumFractionDigits: 0
                            },
                        },
                    }
                },
            },
        });
    }

    function drawLinePieChart(ctx, labels, values) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                responsive: true,
            },
        });
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

    function aggregateQuestionsByLevel(data) {
        return data
            .filter(question => !question.quiz_id)
            .reduce((acc, obj) => {
                obj.success_rate = obj.success_rate === null ? 0.0 : obj.success_rate * 100;
                const key = obj.level__translations__name;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {});
    }

    function aggregateQuizByLevel(data) {
        let filterData = data.filter(question => question.quiz_id)
        const quizIds = filterData.map(item => item.quiz_id);
        const uniqueQuizIds = [...new Set(quizIds)];

        return filterData.reduce((acc, obj) => {
            obj.success_rate = obj.success_rate * 100;
            const key = obj.level__translations__name;
            const quizIndex = uniqueQuizIds.indexOf(obj.quiz_id);
            acc[key] = acc[key] || [];
            acc[key][quizIndex] = acc[key][quizIndex] || obj;
            acc[key][quizIndex].success_rate = (acc[key][quizIndex].success_rate + obj.success_rate) / 2;
            return acc;
        }, {});
    }

    function aggregateByCategory(data) {
        return data.reduce((acc, obj) => {
            if (!obj.categories && obj.quiz_id) {
                let quizCategories = data.find(c => c.quiz_id=== obj.quiz_id && c.categories).categories;
                obj.categories = quizCategories
            }

            const key = obj.categories;

            if (key) {
                let success_rate = obj.success_rate / 100
                if (!acc[key]) {
                    acc[key] = success_rate;
                } else {
                    acc[key] = (acc[key] + success_rate) / 2;
                }
            }
            return acc;
        }, {});
    }

    function getQuestionLabels(data, nbElements) {
        if (Object.keys(data).length === 0) return [];
        let labels = [];
        data[Object.keys(data)[0]].map((value, index) => {
            labels.push(`Q${index + 1}`);
        })
        return nbElements ? labels.slice(0, nbElements) : labels
    }
});
