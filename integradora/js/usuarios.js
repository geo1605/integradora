/* --------------------- Variables Globales --------------------- */
let usuarioId = null; // Variable global para almacenar el ID del usuario
let usuarioNombre = null; // Variable global para almacenar el nombre del usuario

/* --------------------- Funciones --------------------- */

// Función para cargar el ID del usuario autenticado
async function cargarUsuarioId() {
    try {
        const response = await fetch("https://latosca.up.railway.app/api/usuario/id", { credentials: 'include' });
        if (!response.ok) throw new Error("No se pudo obtener el ID del usuario. Verifica si estás autenticado.");

        const data = await response.json();
        usuarioId = data.id; // Almacena el ID en la variable global
        return usuarioId;
    } catch (error) {
        console.error("Error al cargar el ID del usuario:", error);
        throw error;
    }
}

// Función para cargar el nombre del empleado dado un ID
async function cargarEmpleadoNombre(empleadoId) {
    try {
        const response = await fetch("https://latosca.up.railway.app/empleados");
        const empleados = await response.json();

        const empleado = empleados.find(e => e.ID_Empleados == empleadoId && e.estatus == 1);
        if (!empleado) throw new Error("Empleado no encontrado o inactivo.");

        return `${empleado.Nombres} ${empleado.Apellido_P} ${empleado.Apellido_M || ''}`.trim();
    } catch (error) {
        console.error("Error al cargar el nombre del empleado:", error);
        throw error;
    }
}

// Función para ocultar elementos de administradores
function ocultarElementosAdmin() {
    document.querySelectorAll('.admin').forEach(elemento => (elemento.style.display = 'none'));
}

// Función para ocultar elementos de usuarios
function ocultarElementosUser() {
    document.querySelectorAll('.user').forEach(elemento => (elemento.style.display = 'none'));
}

// Filtrar y ordenar órdenes según la jerarquía deseada y el usuario
function filterAndSortOrdenes(ordenes, fechaInicio) {
    const startDate = new Date(fechaInicio); // Fecha de inicio como objeto Date
    const userName = usuarioNombre ? usuarioNombre.trim().toLowerCase() : ""; // Usar el nombre del usuario global

    if (!userName) {
        console.error("No se pudo obtener el nombre del usuario.");
        return [];
    }

    console.log(`Nombre del usuario actual: ${userName}`);

    // Filtrar por usuario y fecha igual o posterior a la actual usando fechaE
    const filteredOrdenes = ordenes.filter((orden) => {
        const ordenDateE = new Date(orden.fechaE); // Convertir fechaE de orden a objeto Date
        if (isNaN(ordenDateE)) {
            console.error("fechaE inválida en orden:", orden);
            return false; // Ignorar órdenes con fechas inválidas
        }

        const ordenUser = (orden.Empleado || "").toLowerCase(); // Asumimos que "Empleado" tiene el nombre del usuario
        return ordenDateE >= startDate && ordenUser === userName; // Comparar fechaE y usuario
    });

    // Ordenar por estado (proceso primero) y luego por fechaE
    return filteredOrdenes.sort((a, b) => {
        // Priorizar por estado
        const prioridadEstado = { proceso: 1, activo: 2, completado: 3 };
        const estadoA = prioridadEstado[a.Estatus] || 999;
        const estadoB = prioridadEstado[b.Estatus] || 999;

        if (estadoA !== estadoB) {
            return estadoA - estadoB; // Ordenar por prioridad del estado
        }

        // Si el estado es igual, ordenar por fechaE
        const fechaEA = new Date(a.fechaE);
        const fechaEB = new Date(b.fechaE);
        return fechaEA - fechaEB; // De la más próxima a la más lejana
    });
}

/* --------------------- Lógica Principal --------------------- */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar el ID del usuario y su nombre
        const userId = await cargarUsuarioId();
        if (userId) {
            usuarioNombre = await cargarEmpleadoNombre(userId); // Guardar el nombre del usuario en la variable global
            const nombreUserElement = document.getElementById('nombre_user');
            if (nombreUserElement) nombreUserElement.innerText = usuarioNombre;
        } else {
            console.error("No se pudo cargar el usuario. Redirigiendo a login...");
        }

        // Obtener el rol del usuario y gestionar permisos
        const response = await fetch('https://latosca.up.railway.app/api/rol', { credentials: 'include' });
        const data = await response.json();

        if (data.rol === 'admin') {
            ocultarElementosUser(); // Oculta elementos solo para usuarios normales
        } else if (data.rol === 'empleado') {
            ocultarElementosAdmin(); // Oculta elementos solo para administradores
        }
    } catch (error) {
        console.error("Error al cargar datos del usuario o rol:", error);
        // Por seguridad, ocultar todo si hay un error
        ocultarElementosAdmin();
        ocultarElementosUser();
    }
});
