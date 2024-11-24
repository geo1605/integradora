// Asegúrate de tener SweetAlert2 instalado y referenciado en tu proyecto

// Importa SweetAlert2 (si usas módulos)
import Swal from 'sweetalert2';

/**
 * Funciones de alertas reutilizables con SweetAlert2.
 */
const Alerts = {
    /**
     * Muestra una alerta básica con título y mensaje.
     * @param {string} title - El título de la alerta.
     * @param {string} text - El mensaje de la alerta.
     * @param {string} icon - El tipo de ícono: 'success', 'error', 'warning', 'info', 'question'.
     */
    basicAlert: (title, text, icon = 'info') => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Aceptar',
        });
    },

    /**
     * Muestra una alerta de confirmación con callback en caso de aceptar.
     * @param {string} title - El título de la alerta.
     * @param {string} text - El mensaje de la alerta.
     * @param {Function} onConfirm - Función que se ejecuta al confirmar.
     */
    confirmAlert: (title, text, onConfirm) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
            }
        });
    },

    /**
     * Muestra una alerta con entrada de texto.
     * @param {string} title - El título de la alerta.
     * @param {string} inputPlaceholder - El texto de marcador de posición para el input.
     * @param {Function} onInputSubmit - Función que se ejecuta con el valor ingresado.
     */
    inputAlert: (title, inputPlaceholder, onInputSubmit) => {
        Swal.fire({
            title: title,
            input: 'text',
            inputPlaceholder: inputPlaceholder,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                onInputSubmit(result.value);
            }
        });
    },

    /**
     * Muestra una alerta personalizada con configuración avanzada.
     * @param {Object} options - Configuración avanzada de SweetAlert2.
     */
    customAlert: (options) => {
        Swal.fire(options);
    },

    /**
     * Muestra una alerta de carga/espera.
     * @param {string} text - El mensaje mientras se espera.
     */
    loadingAlert: (text = 'Cargando...') => {
        Swal.fire({
            title: text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    },

    /**
     * Cierra manualmente cualquier alerta activa.
     */
    closeAlert: () => {
        Swal.close();
    },
};

// Exporta el objeto Alerts para usar en otros archivos
export default Alerts;
