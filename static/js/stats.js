
$(document).ready(function () {
    let usersBydate = JSON.parse(document.getElementById('users_by_date').textContent);
    let usersByLevel = JSON.parse(document.getElementById('users_by_level').textContent);
    let user_dates = usersBydate.map(user => new Date(user.created_at))
    let user_dates_values = usersBydate.map(user => user.total_users)
    let user_levels = usersByLevel.map(user => user.current_level__index)
    let user_levels_values = usersByLevel.map(user => user.total_users)
    console.log(usersByLevel);

    let users_by_date_bar_ctx = document.getElementById('users_by_date_bar');
    let users_by_date_line_ctx = document.getElementById('users_by_date_line');
    let users_by_level_bar_ctx = document.getElementById('users_by_level_bar');
    let users_by_level_line_ctx = document.getElementById('users_by_level_line');

    barChart(users_by_date_bar_ctx,user_dates,user_dates_values,'time')
    lineChart(users_by_date_line_ctx,user_dates,user_dates_values, 'time')
    barChart(users_by_level_bar_ctx,user_levels,user_levels_values)
    lineChart(users_by_level_line_ctx,user_levels,user_levels_values)


    function barChart(ctx,labels,values,typeXaxis='category') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                }]
            },
            options: {
                plugins: {
                    legend : {
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

    function lineChart(ctx,labels,values,typeXaxis='category') {
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
                    legend : {
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
});
