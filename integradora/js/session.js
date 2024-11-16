
async function iniciarSesion() {
    // Obtén los valores ingresados en los inputs
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        // Realiza la solicitud al servidor para verificar el login
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correo, password: password }) // Envía los datos
        });

        const data = await response.json();

        if (response.ok) {
            // Login exitoso, redirige a la página principal
            alert(data.mensaje);
            window.location.href = 'resourses/main.html'; // Corrige "resourses" a "resources"
        } else {
            // Muestra un mensaje de error
            alert(data.mensaje || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al conectar con el servidor');
    }
}

        

function cerrarSesion() {
    fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Sesión cerrada correctamente.");
            // Redirige al usuario a la página de inicio de sesión (por ejemplo, index.html)
            window.location.href = '../index.html';
        } else {
            alert("Error al cerrar sesión.");
        }
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
        alert("Error al conectar con el servidor.");
    });
}
