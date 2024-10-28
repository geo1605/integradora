const ctx = document.getElementById('masVendidos');

new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Res', 'pollo', 'cerdo', 'cordero'],
        datasets: [{
            label: '#numero de ventas',
            data: [12, 19, 3, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'productos mas vendidos',
                font: {
                    size: 20
                }
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
const ctx2 = document.getElementById('ventas');
    new Chart(ctx2, {
        type: 'line',
        data: {
        labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        datasets: [{
            label: 'Ventas',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Ventas',
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctx3 = document.getElementById('empleados');
    new Chart(ctx3, {
        type: 'polarArea',
        data: {
        labels: ['Mario', 'Pedro', 'juan'],
        datasets: [{
            label: 'ordenes',
            data: [12, 19, 3],
            borderWidth: 1
        }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'ordenes por empleado',
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctx4 = document.getElementById('clientes');
    new Chart(ctx4, {
        type: 'bar',
        data: {
        labels: ['Alberto', 'Maria', 'Heidi'],
        datasets: [{
            label: 'ordenes',
            data: [12, 19, 3],
            borderWidth: 1
        }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'clientes con mas ordenes',
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });