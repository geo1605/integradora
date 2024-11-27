
    document.addEventListener('DOMContentLoaded', () => {
        // Obtener las fechas
        const fechaHoy = new Date();
        const fechaPasado = new Date();
        fechaPasado.setDate(fechaHoy.getDate() - 7); // Restar 7 días a la fecha actual
    
        // Formatear las fechas en formato YYYY-MM-DD
        const formatoFecha = fecha => fecha.toISOString().split('T')[0];
    
        // Asignar las fechas a los inputs (si es necesario en el DOM)
        document.getElementById('fechaHoy').value = formatoFecha(fechaHoy);
        document.getElementById('fechapasado').value = formatoFecha(fechaPasado);
    
        // Variables para las fechas formateadas
        const fechaInicio = formatoFecha(fechaPasado);
        const fechaFin = formatoFecha(fechaHoy);
    
        // Actualizar gráficas con las fechas
        cargarTopProductos(fechaInicio, fechaFin);
        cargarTopEmpleados(fechaInicio, fechaFin);
        cargarTopClientes(fechaInicio, fechaFin);
        cargarVentasPorDia(fechaInicio, fechaFin);
        cargarActivas(fechaInicio, fechaFin);
        cargarPendientes(fechaInicio, fechaFin);
        cargarCanceladas(fechaInicio, fechaFin);


    });
    
// Función para cargar productos más vendidos
function cargarTopProductos(fechaInicio, fechaFin) {
    const ctx = document.getElementById('masVendidos');
    fetch(`https://latosca.up.railway.app/topProductos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
        .then(response => response.json())
        .then(data => {
            

            // Ajusta las claves según la respuesta de la API
            const labels = data.data.map(producto => producto.Producto); // Cambiado a 'Producto'
            const ventas = data.data.map(producto => parseInt(producto.Total_Vendido, 10)); // Cambiado a 'Total_Vendido'

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# número de ventas',
                        data: ventas,
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
                            font: { size: 20 }
                        },
                        legend: { display: false }
                    }
                }
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
}


    
// Función para cargar empleados destacados
function cargarTopEmpleados(fechaInicio, fechaFin) {
    const ctx = document.getElementById('empleados');
    fetch(`https://latosca.up.railway.app/topEmpleados?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
        .then(response => response.json())
        .then(data => {
            

            // Ajusta las claves según la respuesta de la API
            const nombres = data.data.map(empleado => empleado.Empleado); // Cambiado a 'Empleado'
            const ordenes = data.data.map(empleado => parseInt(empleado.Total_Ordenes, 10)); // Cambiado a 'Total_Ordenes'

            new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: nombres,
                    datasets: [{
                        label: 'Órdenes',
                        data: ordenes,
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
                            font: { size: 20 }
                        },
                        legend: { display: true }
                    }
                }
            });
        })
        .catch(error => console.error('Error al cargar empleados:', error));
}

    
// Función para cargar clientes destacados
function cargarTopClientes(fechaInicio, fechaFin) {
    const ctx = document.getElementById('clientes');
    fetch(`https://latosca.up.railway.app/topClientes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
        .then(response => response.json())
        .then(data => {


            // Ajusta las claves según la respuesta de la API
            const labels = data.data.map(cliente => cliente.Cliente); // Cambiado a 'Cliente'
            const ordenes = data.data.map(cliente => parseInt(cliente.Total_Ordenes, 10)); // Cambiado a 'Total_Ordenes'

            new Chart(ctx, {
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
                            font: { size: 20 }
                        },
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => console.error('Error al cargar clientes:', error));
}


function cargarVentasPorDia(fechaInicio, fechaFin) {
    const ctx2 = document.getElementById('ventas');

    fetch(`https://latosca.up.railway.app/cantidadOrdenesPorDia?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
        .then(response => response.json())
        .then(data => {


            // Convertimos las fechas a los días de la semana
            const labels = data.data.map(item => {
                const fecha = new Date(item.Dia);
                return fecha.toLocaleDateString('es-MX', { weekday: 'long' }); // Obtiene el día de la semana en español
            });

            // Extraemos los valores de Total_Ordenes
            const ordenes = data.data.map(item => parseInt(item.Total_Ordenes, 10));

            // Crear el gráfico
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: labels, // Días de la semana
                    datasets: [{
                        label: 'Órdenes',
                        data: ordenes, // Cantidad de órdenes por día
                        borderWidth: 1,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Órdenes por Día',
                            font: { size: 20 }
                        },
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => console.error('Error al cargar los datos de ventas:', error));
}

function cargarActivas(fechaInicio, fechaFin) {
    const bloque = document.getElementById("Ocompleta");
    
    fetch(`https://latosca.up.railway.app/cantidadOrdenesPorEstatus?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&estatus=activo`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las órdenes activas');
            }
            return response.json();
        })
        .then(data => {
            
            const cantidad = data.data[0]?.Total_Ordenes || 0; // Supongamos que el resultado incluye un campo "cantidad"
            bloque.textContent = ` ${cantidad}`;
        })
        .catch(error => {
            console.error('Error en cargarActivas:', error);
            bloque.textContent = 'Error al cargar las órdenes activas';
        });
}

function cargarPendientes(fechaInicio, fechaFin) {
    const bloque = document.getElementById("Opendiente");
    
    fetch(`https://latosca.up.railway.app/cantidadOrdenesPorEstatus?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&estatus=proceso`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las órdenes pendientes');
            }
            return response.json();
        })
        .then(data => {
            const cantidad = data.data[0]?.Total_Ordenes || 0; // Supongamos que el resultado incluye un campo "cantidad"
            bloque.textContent = ` ${cantidad}`;
        })
        .catch(error => {
            console.error('Error en cargarpendientes:', error);
            bloque.textContent = 'Error al cargar las órdenes pendientes';
        });
}
function cargarCanceladas(fechaInicio, fechaFin) {
    const bloque = document.getElementById("Ocancelada");
    
    fetch(`https://latosca.up.railway.app/cantidadOrdenesPorEstatus?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&estatus=cancelado`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las órdenes canceladas');
            }
            return response.json();
        })
        .then(data => {

            const cantidad = data.data[0]?.Total_Ordenes || 0; // Supongamos que el resultado incluye un campo "cantidad"
            bloque.textContent = ` ${cantidad}`;
        })
        .catch(error => {
            console.error('Error en cargarcanceladas:', error);
            bloque.textContent = 'Error al cargar las órdenes canceladas';
        });
}
