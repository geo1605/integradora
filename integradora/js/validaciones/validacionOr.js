// Configurar el valor mínimo del input "datetime-local" al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const fechaInput = document.getElementById("fechaE");
    const ahora = new Date();

    // Formatear fecha y hora para el atributo "min"
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0"); // Mes comienza en 0
    const dia = String(ahora.getDate()).padStart(2, "0");
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");

    // Formato correcto para el atributo "min": YYYY-MM-DDTHH:mm
    const fechaMinima = `${anio}-${mes}-${dia}T${horas}:${minutos}`;
    fechaInput.min = fechaMinima; // Establecer el valor mínimo
});

// Función para validar que un campo no esté vacío y no comience con un espacio
function validarCampoNoVacio(campo) {
    return campo.trim() !== "" && campo.charAt(0) !== " ";
}

// Función para validar que un número sea positivo
function validarNumerosPositivos(campo) {
    return !isNaN(campo) && parseFloat(campo) > 0;
}

// Función para validar fechas y horas
function validarFechaFutura(campo) {
    const fechaIngresada = new Date(campo);
    const fechaActual = new Date();
    return fechaIngresada >= fechaActual;
}

// Función para mostrar errores
function mostrarError(campo, mensaje, listaErrores) {
    campo.style.border = "2px solid red"; // Agregar borde rojo
    if (!listaErrores.querySelector(`[data-campo="${campo.name}"]`)) {
        const li = document.createElement("li");
        li.textContent = mensaje;
        li.dataset.campo = campo.name; // Asociar error al campo
        listaErrores.appendChild(li);
    }
}

// Función para limpiar errores de un campo específico
function limpiarErroresCampo(campo, listaErrores) {
    campo.style.border = ""; // Quitar borde rojo
    const error = listaErrores.querySelector(`[data-campo="${campo.name}"]`);
    if (error) {
        error.remove(); // Eliminar el error específico del campo
    }
}

// Validar un campo específico
function validarCampo(campo, tipo, listaErrores) {
    limpiarErroresCampo(campo, listaErrores);
    let esValido = true;

    switch (tipo) {
        case "select2":
            if (!campo.value || campo.value === "") {
                mostrarError(campo, `Debe seleccionar una opción válida para "${campo.name}".`, listaErrores);
                esValido = false;
            }
            break;
        case "numero":
            if (!validarCampoNoVacio(campo.value) || !validarNumerosPositivos(campo.value)) {
                mostrarError(campo, `El campo "${campo.name}" debe contener un número positivo válido.`, listaErrores);
                esValido = false;
            }
            break;
        case "fecha":
            if (!validarCampoNoVacio(campo.value) || !validarFechaFutura(campo.value)) {
                mostrarError(campo, `La fecha y hora de "${campo.name}" debe ser posterior a la actual.`, listaErrores);
                esValido = false;
            }
            break;
        default:
            if (!validarCampoNoVacio(campo.value)) {
                mostrarError(campo, `El campo "${campo.name}" no puede estar vacío.`, listaErrores);
                esValido = false;
            }
            break;
    }
    return esValido;
}

// Verificar si el formulario es válido
function verificarFormulario(form, listaErrores, campos) {
    let formularioValido = true;

    campos.forEach((campo) => {
        const tipo = campo.getAttribute("data-tipo");
        if (!validarCampo(campo, tipo, listaErrores)) {
            formularioValido = false;
        }
    });

    // Validar productos dinámicos
    const productos = form.querySelectorAll(".producto-item");
    productos.forEach((producto) => {
        const selectProducto = producto.querySelector(".productosO");
        const inputCantidad = producto.querySelector('input[name^="cantidad"]');

        if (!validarCampo(selectProducto, "select2", listaErrores)) {
            formularioValido = false;
        }
        if (!validarCampo(inputCantidad, "numero", listaErrores)) {
            formularioValido = false;
        }
    });

    const botonEnviar = form.querySelector('button[type="submit"]');
    botonEnviar.disabled = !formularioValido; // Habilitar o deshabilitar el botón
}

// Inicializar validaciones para el formulario
function inicializarValidaciones() {
    const contenedorForm = document.getElementById("contenedor");
    const listaErrores = document.createElement("ul");
    listaErrores.id = "errorContenedor";
    listaErrores.classList.add("error");
    contenedorForm.insertBefore(listaErrores, contenedorForm.querySelector("button[type='submit']"));

    const empleado = contenedorForm.querySelector("#EmpleadoO");
    const cliente = contenedorForm.querySelector("#cliente");
    const direccion = contenedorForm.querySelector("#direccionS");
    const metodoPago = contenedorForm.querySelector("#tipoP");
    const fechaEntrega = contenedorForm.querySelector("#fechaE");

    const campos = [empleado, cliente, direccion, metodoPago, fechaEntrega];

    // Agregar atributos para identificar el tipo de validación
    empleado.setAttribute("data-tipo", "select2");
    cliente.setAttribute("data-tipo", "select2");
    direccion.setAttribute("data-tipo", "select2");
    metodoPago.setAttribute("data-tipo", "select2");
    fechaEntrega.setAttribute("data-tipo", "fecha");

    // Validar cada campo en el evento `onchange` para Select2 y `oninput` para otros
    campos.forEach((campo) => {
        if ($(campo).data('select2')) {
            $(campo).on("change", function () {
                validarCampo(campo, "select2", listaErrores);
                verificarFormulario(contenedorForm, listaErrores, campos);
            });
        } else {
            campo.onblur = function () {
                validarCampo(campo, campo.getAttribute("data-tipo"), listaErrores);
                verificarFormulario(contenedorForm, listaErrores, campos);
            };
            campo.oninput = function () {
                verificarFormulario(contenedorForm, listaErrores, campos);
            };
        }
    });

    // Validar productos dinámicos al añadir
    document.querySelector(".bot").addEventListener("click", function () {
        setTimeout(() => {
            const productosContainer = document.querySelectorAll(".producto-item");
            productosContainer.forEach((producto) => {
                const selectProducto = producto.querySelector(".productosO");
                const inputCantidad = producto.querySelector('input[name^="cantidad"]');

                selectProducto.setAttribute("data-tipo", "select2");
                inputCantidad.setAttribute("data-tipo", "numero");

                if ($(selectProducto).data("select2")) {
                    $(selectProducto).on("change", function () {
                        validarCampo(selectProducto, "select2", listaErrores);
                        verificarFormulario(contenedorForm, listaErrores, campos);
                    });
                }

                inputCantidad.onblur = function () {
                    validarCampo(inputCantidad, "numero", listaErrores);
                    verificarFormulario(contenedorForm, listaErrores, campos);
                };
            });
            verificarFormulario(contenedorForm, listaErrores, campos);
        }, 100); // Asegurar que el DOM esté actualizado antes de validar
    });

    // Verificar el formulario al cargar la página
    verificarFormulario(contenedorForm, listaErrores, campos);
}

// Ejecutar validaciones al cargar la página
document.addEventListener("DOMContentLoaded", inicializarValidaciones);
