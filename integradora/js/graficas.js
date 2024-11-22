const ctx = document.getElementById('masVendidos');
fetch('/topProductos')
    .then(response => response.json())
    .then(data => {
        // Preparamos los datos para el gráfico
        const labels = data.map(producto => producto.Nombre);  // Usamos 'map' correctamente para los nombres
        const ventas = data.map(producto => parseInt(producto.TotalVendidos, 10));  // Convertimos a número con parseInt

        // Crear el gráfico con los datos obtenidos
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels, // Usamos los nombres de los productos
                datasets: [{
                    label: '# número de ventas',
                    data: ventas, // Usamos las ventas de los productos
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
                        text: 'Productos más vendidos',
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
    })
    .catch(error => {
        console.error('Error al obtener los productos:', error);
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



// Obtener datos desde la API y crear la gráfica
fetch('/topEmpleados', { credentials: 'include' }) // Asegúrate de que las cookies se incluyan si es necesario
    .then(response => response.json())
    .then(data => {
        // Procesar los datos obtenidos de la API
        const nombres = data.map(empleado => empleado.NombreCompleto); // Extrae los nombres
        const ordenes = data.map(empleado => empleado.TotalOrdenes); // Extrae el total de órdenes

        // Crear la gráfica con los datos dinámicos
        const ctx3 = document.getElementById('empleados');
        new Chart(ctx3, {
            type: 'polarArea',
            data: {
                labels: nombres, // Usamos los nombres de los empleados
                datasets: [{
                    label: 'Órdenes',
                    data: ordenes, // Usamos la cantidad de órdenes
                    borderWidth: 1,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Órdenes por empleado',
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        display: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));


    fetch('/topClientes')
    .then(response => response.json())
    .then(data => {
        const ctx4 = document.getElementById('clientes');
        const labels = data.map(cliente => cliente.NombreCompleto); // Nombres de los clientes
        const ordenes = data.map(cliente => cliente.TotalOrdenes); // Total de órdenes por cliente

        new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Órdenes',
                    data: ordenes,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Clientes con Más Órdenes',
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
    })
    .catch(error => console.error('Error al cargar los datos de los clientes:', error));
