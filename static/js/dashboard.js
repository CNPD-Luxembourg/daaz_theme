
$(document).ready(function () {
    let criteria = JSON.parse(document.getElementById('criteria-data').textContent);
    let progress = JSON.parse(document.getElementById('progress-data').textContent);
    const ctx = document.getElementById('dashboard');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: criteria.labels,
            datasets: [{
                data: criteria.data,
                borderRadius: 30,
                borderSkipped: false,
                backgroundColor: '#AFDFFF',
                barPercentage: 0.6
            },
            {
                data: criteria.data.map(() => { return 100 }),
                borderRadius: 30,
                backgroundColor: '#ECF6FF',
                barPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    ticks: {
                        format: {
                            style: 'percent',
                            minimumFractionDigits: 0,
                        },
                        count: 5,

                    },
                    min: 0,
                    max: 1,
                    grid: {
                        display: false,
                        drawTicks: false,
                        drawOnChartArea: false,
                    },
                    border: {
                        display: false,
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                        font: {
                            weight: 'bold',
                        },
                        maxRotation: 90,
                        minRotation: 30
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                }
            },
        }
    });

    progress.forEach((el, i) => {
        let index = i + 1;
        let progress = el;
        let progress_ctx = document.getElementById('progress' + index)
        new Chart(progress_ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [100 - progress, progress],
                    backgroundColor: ['#006ED3', '#FFFFFF'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: "85%",
                animations: {
                    startAngle: {
                      from: Math.PI * 2
                    },
                    endAngle: {
                      from: Math.PI * 2
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: false
                    }
                },
            }
        });
    });

});
