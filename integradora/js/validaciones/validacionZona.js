// Función para validar que un campo no esté vacío y no comience con un espacio
function validarCampoNoVacio(campo) {
  return campo.trim() !== "" && campo.charAt(0) !== " ";
}

// Función para validar que solo haya letras, espacios y acentos
function validarSoloLetras(campo) {
  const regex = /^[A-Za-zÀ-ÿ\s]+$/; // Permitir solo letras y espacios
  return regex.test(campo);
}

// Función para validar números (para teléfonos y costos)
function validarNumeros(campo, min, max) {
  const regex = new RegExp(`^\\d{${min},${max}}$`); // Solo números con longitud específica
  return regex.test(campo);
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
function validarCampoOnBlur(campo, tipo, listaErrores, min = 1, max = 30) {
  limpiarErroresCampo(campo, listaErrores);

  let esValido = true;

  switch (tipo) {
    case "texto":
      if (!validarCampoNoVacio(campo.value) || !validarSoloLetras(campo.value)) {
        mostrarError(campo, `El campo "${campo.name}" debe contener solo letras y espacios.`, listaErrores);
        esValido = false;
      }
      break;
    case "numero":
      if (!validarCampoNoVacio(campo.value) || isNaN(campo.value) || parseFloat(campo.value) < 0) {
        mostrarError(campo, `El campo "${campo.name}" debe ser un número positivo válido.`, listaErrores);
        esValido = false;
      }
      break;
    default:
      break;
  }

  return esValido;
}

// Verificar si el formulario es válido
function verificarFormularioValido(form, listaErrores, campos) {
  let formularioValido = true;

  campos.forEach((campo) => {
    const tipo = campo.getAttribute("data-tipo");
    if (!validarCampoOnBlur(campo, tipo, listaErrores)) {
      formularioValido = false;
    }
  });

  const botonEnviar = form.querySelector('input[type="submit"]');
  botonEnviar.disabled = !formularioValido; // Habilitar o deshabilitar el botón
}

// Configurar validaciones para el formulario
document.addEventListener("DOMContentLoaded", function () {
  const zonaForm = document.getElementById("zonaForm");
  const listaErrores = zonaForm.querySelector("#errorC");

  const nombreZona = zonaForm.querySelector('input[name="NombreZ"]');
  const costoZona = zonaForm.querySelector('input[name="costo"]');
  const campos = [nombreZona, costoZona];

  // Agregar atributo personalizado para identificar el tipo de validación
  nombreZona.setAttribute("data-tipo", "texto");
  costoZona.setAttribute("data-tipo", "numero");

  // Deshabilitar botón de envío inicialmente
  const botonEnviar = zonaForm.querySelector('input[type="submit"]');
  botonEnviar.disabled = true;

  // Validar cada campo en el evento `onblur`
  campos.forEach((campo) => {
    campo.onblur = function () {
      validarCampoOnBlur(campo, campo.getAttribute("data-tipo"), listaErrores);
      verificarFormularioValido(zonaForm, listaErrores, campos);
    };
  });

  // Verificar el formulario en cada cambio
  zonaForm.addEventListener("input", function () {
    verificarFormularioValido(zonaForm, listaErrores, campos);
  });
});
