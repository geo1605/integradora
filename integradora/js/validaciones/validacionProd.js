// Función para validar que un campo no esté vacío y no comience con un espacio
function validarCampoNoVacio(campo) {
  return campo.trim() !== "" && campo.charAt(0) !== " ";
}

// Función para validar que solo haya letras, espacios y acentos
function validarSoloLetras(campo) {
  const regex = /^[A-Za-zÀ-ÿ\s]+$/; // Permitir solo letras y espacios
  return regex.test(campo);
}

// Función para validar números enteros positivos
function validarNumerosPositivos(campo) {
  return !isNaN(campo) && parseFloat(campo) > 0;
}

// Función para validar números decimales positivos
function validarNumerosDecimales(campo) {
  const regex = /^\d+(\.\d+)?$/; // Permitir solo números con opcional un punto decimal
  return regex.test(campo) && parseFloat(campo) > 0;
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
function validarCampoOnBlur(campo, tipo, listaErrores, form) {
  limpiarErroresCampo(campo, listaErrores);

  let esValido = true;

  const tipoSeleccionado = form.querySelector('select[name="tipo"]').value;

  switch (tipo) {
    case "texto":
      if (!validarCampoNoVacio(campo.value) || !validarSoloLetras(campo.value)) {
        mostrarError(campo, `El campo "${campo.name}" debe contener solo letras y espacios.`, listaErrores);
        esValido = false;
      }
      break;
    case "numero":
      if (tipoSeleccionado === "suelto") {
        // Permitir decimales solo si el tipo es "Kilogramos"
        if (!validarCampoNoVacio(campo.value) || !validarNumerosDecimales(campo.value)) {
          mostrarError(campo, `El campo "${campo.name}" debe ser un número decimal válido.`, listaErrores);
          esValido = false;
        }
      } else {
        // Solo números enteros si no es "Kilogramos"
        if (!validarCampoNoVacio(campo.value) || !validarNumerosPositivos(campo.value)) {
          mostrarError(campo, `El campo "${campo.name}" debe ser un número entero positivo válido.`, listaErrores);
          esValido = false;
        }
      }
      break;
    case "select":
      if (!campo.value || campo.value === "") {
        mostrarError(campo, `Debe seleccionar una opción válida para "${campo.name}".`, listaErrores);
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
    if (!validarCampoOnBlur(campo, tipo, listaErrores, form)) {
      formularioValido = false;
    }
  });

  const botonEnviar = form.querySelector('input[type="submit"]');
  botonEnviar.disabled = !formularioValido; // Habilitar o deshabilitar el botón
}

// Configurar validaciones para el formulario de producto
document.addEventListener("DOMContentLoaded", function () {
  const productoForm = document.getElementById("productoForm");
  const listaErrores = document.createElement("ul");
  listaErrores.id = "errorProducto";
  listaErrores.classList.add("error", "full");
  productoForm.insertBefore(listaErrores, productoForm.querySelector('input[type="submit"]'));

  const nombre = productoForm.querySelector('input[name="Nombre"]');
  const tipo = productoForm.querySelector('select[name="tipo"]');
  const categoria = productoForm.querySelector('select[name="Categoria"]');
  const precio = productoForm.querySelector('input[name="precio"]');
  const campos = [nombre, tipo, categoria, precio];

  // Agregar atributo personalizado para identificar el tipo de validación
  nombre.setAttribute("data-tipo", "texto");
  tipo.setAttribute("data-tipo", "select");
  categoria.setAttribute("data-tipo", "select");
  precio.setAttribute("data-tipo", "numero");

  // Deshabilitar botón de envío inicialmente
  const botonEnviar = productoForm.querySelector('input[type="submit"]');
  botonEnviar.disabled = true;

  // Validar cada campo en el evento `onblur`
  campos.forEach((campo) => {
    campo.onblur = function () {
      validarCampoOnBlur(campo, campo.getAttribute("data-tipo"), listaErrores, productoForm);
      verificarFormularioValido(productoForm, listaErrores, campos);
    };
  });

  // Verificar el formulario en cada cambio
  productoForm.addEventListener("input", function () {
    verificarFormularioValido(productoForm, listaErrores, campos);
  });
});


// Función para permitir solo números y un solo punto decimal
function soloNumerosYDecimal(event) {
  const input = event.target;
  // Expresión regular para números (enteros y decimales)
  const regex = /^[0-9]*\.?[0-9]*$/;

  if (!regex.test(input.value)) {
    // Si el valor no coincide con la expresión regular, lo revertimos
    input.value = input.value.slice(0, -1);
  }
}

// Agregar el evento de input al campo precio
document.addEventListener("DOMContentLoaded", function () {
  const precio = document.querySelector('input[name="precio"]');
  precio.addEventListener("input", soloNumerosYDecimal);
});
