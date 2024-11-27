const Alerts = {
    // Alerta básica
    basicAlert: function (title, text, icon) {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK'
        });
    },

    // Alerta de confirmación (Sí/No)
    confirmAlert: function (title, text) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => result.isConfirmed);
    },

    // Alerta de éxito
    successAlert: function (title, text) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    },

    // Alerta de error
    errorAlert: function (title, text) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    },

    // Alerta de advertencia
    warningAlert: function (title, text) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    },

    // Alerta con temporizador
    timerAlert: function (title, text, timer = 2000) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            timer: timer,
            showConfirmButton: false
        });
    },

    // Alerta personalizada con botones adicionales
    customAlert: function (title, text, buttons) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: buttons.confirmText || 'Aceptar',
            cancelButtonText: buttons.cancelText || 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                buttons.onConfirm && buttons.onConfirm();
            } else if (result.isDismissed) {
                buttons.onCancel && buttons.onCancel();
            }
        });
    },

    // Alerta de carga (loading)
    loadingAlert: function (text) {
        return Swal.fire({
            title: 'Cargando...',
            text: text || 'Por favor espera',
            imageUrl: 'https://i.imgur.com/3l9zQxQ.gif',  // Puedes poner tu propia imagen de carga
            imageWidth: 100,
            imageHeight: 100,
            showConfirmButton: false,
            allowOutsideClick: false
        });
    },

    // Alerta con imagen personalizada
    imageAlert: function (title, text, imageUrl) {
        return Swal.fire({
            title: title,
            text: text,
            imageUrl: imageUrl,
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Custom image',
            confirmButtonText: 'OK'
        });
    }
};

// Exponer Alerts globalmente para que esté disponible en todo el script
window.Alerts = Alerts;
