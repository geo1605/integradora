// Función para validar que un campo no esté vacío y no comience con un espacio
function validarCampoNoVacio(campo) {
  return campo.trim() !== "" && campo.charAt(0) !== " ";
}

// Función para validar que solo haya letras, espacios y acentos
function validarSoloLetras(campo) {
  const regex = /^[A-Za-zÀ-ÿ\s]+$/; // Permitir solo letras y espacios
  return regex.test(campo);
}

// Función para validar números
function validarNumeros(campo, min, max) {
  const regex = new RegExp(`^\\d{${min},${max}}$`); // Solo números con longitud específica
  return regex.test(campo);
}

// Función para validar correos
function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato básico de correo
  return regex.test(correo);
}

// Función para mostrar errores (con color rojo)
function mostrarError(campo, mensaje, listaErrores) {
  campo.style.border = "2px solid red"; // Cambia el borde a rojo
  if (!listaErrores.querySelector(`[data-campo="${campo.name}"]`)) {
      const li = document.createElement("li");
      li.textContent = mensaje;
      li.dataset.campo = campo.name;
      listaErrores.appendChild(li);
  }
}

// Función para limpiar errores de un campo específico
function limpiarErroresCampo(campo, listaErrores) {
  campo.style.border = ""; // Limpia el borde rojo si existía
  const error = listaErrores.querySelector(`[data-campo="${campo.name}"]`);
  if (error) {
      error.remove();
  }
}

// Validar un campo específico
function validarCampo(campo, tipo, listaErrores) {
  if (!campo.dataset.tocado) return true; // Validar solo si el campo ha sido "tocado"

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
      case "telefono":
          if (!validarNumeros(campo.value, 10, 10)) {
              mostrarError(campo, `El campo "${campo.name}" debe contener un teléfono válido (10 dígitos).`, listaErrores);
              esValido = false;
          }
          break;
      case "correo":
          if (!validarCorreo(campo.value)) {
              mostrarError(campo, `El campo "${campo.name}" no tiene un formato válido.`, listaErrores);
              esValido = false;
          }
          break;
      case "select2":
          if (!campo.value || campo.value === "") {
              campo.style.border = "2px solid red"; // Solo colorear en rojo
              esValido = false;
          } else {
              campo.style.border = ""; // Limpiar el estilo si es válido
          }
          break;
      default:
          break;
  }

  return esValido;
}

// Verificar si todo el formulario es válido
function verificarFormulario() {
  const clienteForm = document.getElementById("clienteForm");
  const listaErrores = clienteForm.querySelector("#errorC");

  // Validar campos del cliente
  const camposCliente = clienteForm.querySelectorAll('input[data-tipo]');
  let formularioValido = true;

  camposCliente.forEach((campo) => {
      const tipo = campo.getAttribute("data-tipo");
      if (!validarCampo(campo, tipo, listaErrores)) {
          formularioValido = false;
      }
  });

  // Validar direcciones dinámicas
  const direcciones = clienteForm.querySelectorAll(".continuos");
  direcciones.forEach((direccion) => {
      const camposDireccion = direccion.querySelectorAll("input, select");
      camposDireccion.forEach((campo) => {
          const tipo = campo.getAttribute("data-tipo");
          if (!validarCampo(campo, tipo, listaErrores)) {
              formularioValido = false;
          }
      });
  });

  // Habilitar o deshabilitar el botón de envío
  const botonEnviar = clienteForm.querySelector('input[type="submit"]');
  botonEnviar.disabled = !formularioValido;
}

// Inicializar validaciones de campos del cliente
function inicializarValidacionesCliente() {
  const clienteForm = document.getElementById("clienteForm");
  const listaErrores = clienteForm.querySelector("#errorC");

  const nombreC = clienteForm.querySelector('input[name="NombreC"]');
  const paternoC = clienteForm.querySelector('input[name="PaternoC"]');
  const maternoC = clienteForm.querySelector('input[name="MaternoC"]');
  const telefonoC = clienteForm.querySelector('input[name="telefonoC"]');
  const correoC = clienteForm.querySelector('input[name="correoC"]');

  const campos = [nombreC, paternoC, maternoC, telefonoC, correoC];

  nombreC.setAttribute("data-tipo", "texto");
  paternoC.setAttribute("data-tipo", "texto");
  maternoC.setAttribute("data-tipo", "texto");
  telefonoC.setAttribute("data-tipo", "telefono");
  correoC.setAttribute("data-tipo", "correo");

  campos.forEach((campo) => {
      campo.dataset.tocado = false; // Inicializar como no "tocado"
      campo.onblur = () => {
          campo.dataset.tocado = true; // Marcar como "tocado"
          verificarFormulario();
      };
      campo.addEventListener("input", verificarFormulario);
  });
}

// Inicializar validaciones de direcciones dinámicas
function inicializarValidacionesDirecciones() {
  const clienteForm = document.getElementById("clienteForm");
  const listaErrores = clienteForm.querySelector("#errorC");

  const direcciones = clienteForm.querySelectorAll(".continuos");

  direcciones.forEach((direccion) => {
      const calle = direccion.querySelector('input[name="calle"]');
      const colonia = direccion.querySelector('input[name="colonia"]');
      const numeroEX = direccion.querySelector('input[name="numeroEX"]');
      const numeroIC = direccion.querySelector('input[name="numeroIC"]');
      const CP = direccion.querySelector('input[name="CP"]');
      const zona = direccion.querySelector('.zonas');

      const camposDireccion = [calle, colonia, numeroEX, numeroIC, CP, zona];

      calle.setAttribute("data-tipo", "texto");
      colonia.setAttribute("data-tipo", "texto");
      numeroEX.setAttribute("data-tipo", "numero");
      numeroIC.setAttribute("data-tipo", "numero");
      CP.setAttribute("data-tipo", "numero");
      zona.setAttribute("data-tipo", "select2");

      camposDireccion.forEach((campo) => {
          campo.dataset.tocado = false; // Inicializar como no "tocado"
          campo.onblur = () => {
              campo.dataset.tocado = true; // Marcar como "tocado"
              verificarFormulario();
          };
          campo.addEventListener("input", verificarFormulario);
      });

      // Validar cambios de `select2`
      if ($(zona).data('select2')) {
          $(zona).on('change', verificarFormulario);
      }
  });
}

// Inicializar todas las validaciones al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  inicializarValidacionesCliente();
  inicializarValidacionesDirecciones();

  // Escuchar el evento de agregar dirección para validar las nuevas direcciones
  document.getElementById("B_direcciones").addEventListener("click", function () {
      setTimeout(() => {
          inicializarValidacionesDirecciones();
          verificarFormulario();
      }, 100);
  });

  verificarFormulario(); // Verificar al cargar la página
});
