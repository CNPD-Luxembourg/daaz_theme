
$(document).ready(function () {
    let usersData = JSON.parse(document.getElementById('users-data').textContent);
    let dates = usersData.map(user => new Date(user.created_at))
    let user_values = usersData.map(user => user.total_users)

    let users_bar_ctx = document.getElementById('users_stats_bar');
    let users_line_ctx = document.getElementById('users_stats_line');
    let users_data = user_values;
    
    barChart(users_bar_ctx,users_data)
    lineChart(users_line_ctx,users_data)


    function barChart(ctx,values) {
        const labels = dates;
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
                        type: 'time',
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

    function lineChart(ctx,values) {
        const labels = dates;
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
                        type: 'time',
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
