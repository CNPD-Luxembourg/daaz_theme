$(document).ready(function () {
    const ctx = document.getElementById('dashboard');

    // TODO: Fetch values from the backend
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Procédures', 'Formation', 'Traitement', 'Sous-traitance', 'Information', 'Risques', 'Violation de données', 'Documentation', 'Transfers'],
            datasets: [{
                data: [0.12, 0.19, 0.33, 0.5, 0.2, 0.3, 0.1, 0.15, 0.6],
                borderRadius: 30,
                borderSkipped: false,
                backgroundColor: '#AFDFFF',
                barPercentage: 0.6
            }]
        },
        options: {
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
                        drawTicks: false,
                        drawOnChartArea: false,
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

    // TODO: Fetch values from the backend
    for (const i in [1,2,3,4,5]) {
        var progress = (5 - i) * 25;
        let ctx1 = document.getElementById('progress' + i)
        new Chart(ctx1, {
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
    }

});
