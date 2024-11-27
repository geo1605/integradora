// Función para iniciar sesión
async function iniciarSesion() {
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://latosca.up.railway.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password }),
        });

        const data = await response.json();

        if (response.ok) {
            Alerts.basicAlert('¡Éxito!', data.mensaje, 'success')
            .then(() => {
                window.location.href = 'resourses/main.html'; 
              });
        } else {
            Alerts.basicAlert('Error', data.mensaje || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        Alerts.basicAlert('Error', 'No se pudo conectar con el servidor. Intenta de nuevo.', 'error');
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Mostrar una alerta de confirmación
    Alerts.confirmAlert('¿Estás seguro?', '¿Quieres cerrar sesión?')
        .then((isConfirmed) => {
            if (isConfirmed) {
                // Si el usuario confirma, proceder con la solicitud de cierre de sesión
                fetch('https://latosca.up.railway.app/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            Alerts.basicAlert('¡Éxito!', 'Sesión cerrada correctamente.', 'success');
                            setTimeout(() => {
                                // Redirige al usuario a la página de inicio de sesión
                                window.location.href = '/';
                            }, 2000);
                        } else {
                            Alerts.basicAlert('Error', 'Error al cerrar sesión.', 'error');
                        }
                    })
                    .catch((error) => {
                        console.error('Error al cerrar sesión:', error);
                        Alerts.basicAlert('Error', 'No se pudo conectar con el servidor. Intenta de nuevo.', 'error');
                    });
            } else {
                // Si el usuario cancela, no hacer nada
                Alerts.basicAlert('Cancelado', 'El cierre de sesión fue cancelado.', 'info');
            }
        });
}


