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
        if (!validarCampoNoVacio(campo.value) || !validarNumeros(campo.value, min, max)) {
          mostrarError(campo, `El campo "${campo.name}" debe contener un número válido (${min}-${max} dígitos).`, listaErrores);
          esValido = false;
        }
        break;
      case "correo":
        if (!validarCorreo(campo.value)) {
          mostrarError(campo, `El campo "${campo.name}" no tiene un formato válido.`, listaErrores);
          esValido = false;
        }
        break;
      case "select":
        if (!campo.value || campo.value === "cargo") {
          mostrarError(campo, `Debes seleccionar un cargo válido para "${campo.name}".`, listaErrores);
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
  
  // Configurar validaciones para el formulario de empleado
  document.addEventListener("DOMContentLoaded", function () {
    const empleadoForm = document.getElementById("empleadoForm");
    const listaErrores = document.createElement("ul");
    listaErrores.id = "errorEmpleado";
    listaErrores.classList.add("error", "full");
    empleadoForm.insertBefore(listaErrores, empleadoForm.querySelector('input[type="submit"]'));
  
    const nombres = empleadoForm.querySelector('input[name="Nombres"]');
    const apellidoP = empleadoForm.querySelector('input[name="Apellido_P"]');
    const apellidoM = empleadoForm.querySelector('input[name="Apellido_M"]');
    const cargo = empleadoForm.querySelector('select[name="Cargo"]');
    const telefono = empleadoForm.querySelector('input[name="telefono"]');
    const correo = empleadoForm.querySelector('input[name="correo"]');
  
    const campos = [nombres, apellidoP, apellidoM, cargo, telefono, correo];
  
    // Agregar atributo personalizado para identificar el tipo de validación
    nombres.setAttribute("data-tipo", "texto");
    apellidoP.setAttribute("data-tipo", "texto");
    apellidoM.setAttribute("data-tipo", "texto");
    cargo.setAttribute("data-tipo", "select");
    telefono.setAttribute("data-tipo", "numero");
    correo.setAttribute("data-tipo", "correo");
  
    // Deshabilitar botón de envío inicialmente
    const botonEnviar = empleadoForm.querySelector('input[type="submit"]');
    botonEnviar.disabled = true;
  
    // Validar cada campo en el evento `onblur`
    campos.forEach((campo) => {
      campo.onblur = function () {
        validarCampoOnBlur(campo, campo.getAttribute("data-tipo"), listaErrores, 10, 10);
        verificarFormularioValido(empleadoForm, listaErrores, campos);
      };
    });
  
    // Verificar el formulario en cada cambio
    empleadoForm.addEventListener("input", function () {
      verificarFormularioValido(empleadoForm, listaErrores, campos);
    });
  });
  