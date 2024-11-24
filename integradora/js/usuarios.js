/* --------------------- Variables Globales --------------------- */
let usuarioId = null; // Variable global para almacenar el ID del usuario

/* --------------------- Funciones --------------------- */

// Función para cargar el ID del usuario
function cargarUsuarioId() {
    return fetch("http://localhost:5000/api/usuario/id", { credentials: 'include' }) // Incluye cookies de sesión
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("No se pudo obtener el ID del usuario. Verifica si estás autenticado.");
            }
        })
        .then(data => {
            usuarioId = data.id; // Almacenar el ID en la variable global
            return usuarioId;
        })
        .catch(error => {
            console.error("Error al cargar el ID del usuario:", error);
            throw error;
        });
}

// Función para cargar el nombre del empleado dado un ID
function cargarEmpleadoNombre(empleadoId) {
    return fetch("http://localhost:5000/empleados")
        .then(response => response.json())
        .then(empleados => {
            const empleado = empleados.find(e => e.ID_Empleados == empleadoId && e.estatus == 1);
            if (empleado) {
                return `${empleado.Nombres} ${empleado.Apellido_P} ${empleado.Apellido_M ? `${empleado.Apellido_M}` : ''}`;
            } else {
                 throw new Error("Empleado no encontrado o inactivo.");
            }
        })
        .catch(error => {
            console.error("Error al cargar el nombre del empleado:", error);
            throw error;
        });
}

// Función para ocultar elementos de administradores
function ocultarElementosAdmin() {
    const elementos = document.querySelectorAll('.admin'); // Selecciona elementos con la clase "admin"
    elementos.forEach(elemento => elemento.style.display = 'none'); // Oculta los elementos
}

// Función para ocultar elementos de usuarios
function ocultarElementosUser() {
    const elementos = document.querySelectorAll('.user'); // Selecciona elementos con la clase "user"
    elementos.forEach(elemento => elemento.style.display = 'none'); // Oculta los elementos
}

/* --------------------- Lógica Principal --------------------- */
document.addEventListener("DOMContentLoaded", () => {
        // Cargar el ID del usuario
        cargarUsuarioId()
            .then(userId => {
                if (userId) {
                    // Obtener y mostrar el nombre del usuario
                    return cargarEmpleadoNombre(userId);
                } else {
                    console.log("No se pudo cargar el usuario. Redirigiendo a login...");
                }
            }).then(nombre => {
                const nombreUserElement = document.getElementById('nombre_user');
                if (nombreUserElement) {
                    nombreUserElement.innerText = nombre; // Mostrar el nombre del usuario
                }
            })
            .catch(error => {
                console.error("Error al cargar datos del usuario:", error);
            });



    // Obtener el rol del usuario y gestionar permisos
    fetch('http://localhost:5000/api/rol', { credentials: 'include' }) // Incluye cookies
        .then(response => response.json())
        .then(data => {
            if (data.rol === 'admin') {
                ocultarElementosUser(); // Oculta elementos solo para usuarios normales
            } else if (data.rol === 'empleado') {
                ocultarElementosAdmin(); // Oculta elementos solo para administradores
            }
        })
        .catch(error => {
            console.error('Error al obtener el rol del usuario:', error);
            ocultarElementosAdmin(); // Por seguridad, oculta si no se puede determinar el rol
            ocultarElementosUser(); // Por seguridad, oculta si no se puede determinar el rol
        });
});
