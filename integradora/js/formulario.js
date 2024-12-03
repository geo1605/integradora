function addpopup() {
  let pop = document.getElementById("addPopup");
  if (pop) {
    pop.style.display = "flex";
  } else {
    console.error("Elemento 'addPopup' no encontrado");
  }
}
function colapsePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = "none";
  }
}

// Validar formulario completo
function validarFormulario() {
  const form = document.querySelector("#empleados");
  const nombre = form.querySelector("input[name='ActNombre']").value;
  const apellidoP = form.querySelector("input[name='ActPaterno']").value;
  const apellidoM = form.querySelector("input[name='ActMaterno']").value;
  const telefono = form.querySelector("input[name='Acttelefono']").value;
  const correo = form.querySelector("input[name='Actcorreo']").value;
  const cargo = form.querySelector("select[name='Actcargo']").value;

  let errores = [];

  if (!validarCampoNoVacio(nombre) || !validarSoloLetras(nombre)) {
    errores.push("El nombre debe contener solo letras y no puede estar vacío.");
  }

  if (!validarCampoNoVacio(apellidoP) || !validarSoloLetras(apellidoP)) {
    errores.push("El apellido paterno debe contener solo letras y no puede estar vacío.");
  }

  if (!validarCampoNoVacio(apellidoM) || !validarSoloLetras(apellidoM)) {
    errores.push("El apellido materno debe contener solo letras y no puede estar vacío.");
  }

  if (!validarCampoNoVacio(correo) || !validarCorreo(correo)) {
    errores.push("El correo no es válido.");
  }

  if (!validarCampoNoVacio(telefono) || !validarNumeros(telefono, 10, 10)) {
    errores.push("El teléfono debe contener exactamente 10 dígitos.");
  }

  if (!validarCampoNoVacio(cargo) || (cargo !== "empleado" && cargo !== "admin")) {
    errores.push("El cargo debe ser 'empleado' o 'admin'.");
  }

  const errorList = form.querySelector("ul.error");
  errorList.innerHTML = ""; // Limpia los errores previos

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });
    console.log("Errores encontrados:", errores);
    return false; // El formulario no es válido
  }

  console.log("Formulario válido");
  return true; // El formulario es válido
}

// Habilitar o deshabilitar el botón de envío
function actualizarEstadoBoton() {
  const form = document.querySelector("#empleados");
  const botonEnviar = form.querySelector("button[type='button']");
  const esValido = validarFormulario();

  botonEnviar.disabled = !esValido; // Deshabilitar si el formulario no es válido
  console.log("Estado del botón:", botonEnviar.disabled ? "Deshabilitado" : "Habilitado");
}

// Función para actualizar empleado con validaciones
function actualizarEmpleado(id, event) {
  event.preventDefault(); // Evita el envío del formulario

  if (validarFormulario()) {
    console.log("Formulario válido. Enviando datos...");
    // Aquí agregarías el código para realizar la actualización en el backend (fetch o AJAX)
  }
}

// Función para mostrar el formulario y configurar validaciones dinámicas
function updateEmp(id) {
  let name = document.getElementById(`nombre${id}`).innerText;
  let ApeP = document.getElementById(`apellidoP${id}`).innerText;
  let ApeM = document.getElementById(`apellidoM${id}`).innerText;
  let cargo = document.getElementById(`cargo${id}`).innerText;
  let correo = document.getElementById(`correo${id}`).innerText;
  let numero = document.getElementById(`telefono${id}`).innerText;
  let cont = document.getElementById("upPopup");

  cont.innerHTML = `
        <form action="" class="modificacion" id="empleados">
            <h2>Editar empleado</h2>
            <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
            <input type="text" maxlength="50" class="tercio" name="ActNombre" placeholder="Nombre(s)" value="${name}" oninput="actualizarEstadoBoton()">
            <input type="text" maxlength="50" class="tercio" name="ActPaterno" placeholder="Apellido Paterno" value="${ApeP}" oninput="actualizarEstadoBoton()">
            <input type="text" maxlength="50" class="tercio" name="ActMaterno" placeholder="Apellido Materno" value="${ApeM}" oninput="actualizarEstadoBoton()">
            <select class="medio" name="Actcargo" id="cargo" onchange="actualizarEstadoBoton()">
                <option value="empleado" ${cargo === "empleado" ? "selected" : ""}>empleado</option>
                <option value="admin" ${cargo === "admin" ? "selected" : ""}>admin</option>
            </select>
            <input type="text" maxlength="10" class="medio" name="Acttelefono" placeholder="Teléfono" value="${numero}" oninput="actualizarEstadoBoton()">
            <input type="email" class="full" name="Actcorreo" placeholder="Correo" value="${correo}" oninput="actualizarEstadoBoton()">
            <ul class="full error"></ul>
            <button type="button" class="full" onclick="actualizarEmpleado(${id}, event)">Enviar</button>
        </form>`;
  cont.style.display = "flex";

  actualizarEstadoBoton(); // Configura el estado inicial del botón
}



// Validar formulario completo (generalizado)
function validarFormularioCliente() {
  const form = document.querySelector("#Actcliente");
  const nombre = form.querySelector("input[name='ActNombreC']").value;
  const apellidoP = form.querySelector("input[name='ActPaternoC']").value;
  const apellidoM = form.querySelector("input[name='ActMaternoC']").value;
  const telefono = form.querySelector("input[name='Acttelefono']").value;
  const correo = form.querySelector("input[name='Actcorreo']").value;

  let errores = [];

  if (!validarCampoNoVacio(nombre) || !validarSoloLetras(nombre)) {
    errores.push("El nombre debe contener solo letras y no puede estar vacío.");
  }

  if (!validarCampoNoVacio(apellidoP) || !validarSoloLetras(apellidoP)) {
    errores.push("El apellido paterno debe contener solo letras y no puede estar vacío.");
  }

  if (!validarCampoNoVacio(apellidoM) || !validarSoloLetras(apellidoM)) {
    errores.push("El apellido materno debe contener solo letras y no puede estar vacío.");
  }

  if (!validarCampoNoVacio(correo) || !validarCorreo(correo)) {
    errores.push("El correo no es válido.");
  }

  if (!validarCampoNoVacio(telefono) || !validarNumeros(telefono, 10, 10)) {
    errores.push("El teléfono debe contener exactamente 10 dígitos.");
  }

  const errorList = form.querySelector("ul.error");
  errorList.innerHTML = ""; // Limpia los errores previos

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });
    console.log("Errores encontrados:", errores);
    return false; // El formulario no es válido
  }

  console.log("Formulario válido");
  return true; // El formulario es válido
}

// Habilitar o deshabilitar el botón de envío para cliente
function actualizarEstadoBotonCliente() {
  const form = document.querySelector("#Actcliente");
  const botonEnviar = form.querySelector("button[type='button']");
  const esValido = validarFormularioCliente();

  botonEnviar.disabled = !esValido; // Deshabilitar si el formulario no es válido
  console.log("Estado del botón:", botonEnviar.disabled ? "Deshabilitado" : "Habilitado");
}

// Función para actualizar cliente con validaciones
function actualizarCliente(id, event) {
  event.preventDefault(); // Evita el envío del formulario

  if (validarFormularioCliente()) {
    console.log("Formulario válido. Enviando datos...");
    // Aquí agregarías el código para realizar la actualización en el backend (fetch o AJAX)
  }
}

// Función para mostrar el formulario de cliente y configurar validaciones dinámicas
function updateCliente(id) {
  let nombre = document.getElementById(`nombre${id}`).innerText;
  let ApeP = document.getElementById(`ApellidoP${id}`).innerText;
  let ApeM = document.getElementById(`ApellidoM${id}`).innerText;
  let telefono = document.getElementById(`telefono${id}`).innerText;
  let correo = document.getElementById(`correo${id}`).innerText;
  let cont = document.getElementById("upPopup");

  cont.innerHTML = `
        <form action="" class="modificacion" id="Actcliente">
            <h2>Editar cliente</h2>
            <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
            <input type="text" maxlength="50" class="tercio" name="ActNombreC" placeholder="Nombre(s)" value="${nombre}" oninput="actualizarEstadoBotonCliente()">
            <input type="text" maxlength="50" class="tercio" name="ActPaternoC" placeholder="Apellido Paterno" value="${ApeP}" oninput="actualizarEstadoBotonCliente()">
            <input type="text" maxlength="50" class="tercio" name="ActMaternoC" placeholder="Apellido Materno" value="${ApeM}" oninput="actualizarEstadoBotonCliente()">
            <input type="text" maxlength="10" class="medio" name="Acttelefono" placeholder="Teléfono" value="${telefono}" oninput="actualizarEstadoBotonCliente()">
            <input type="email" class="medio" name="Actcorreo" placeholder="Correo" value="${correo}" oninput="actualizarEstadoBotonCliente()">
            <ul class="full error"></ul>
            <button type="button" class="full" onclick="actualizarCliente(${id}, event)">Enviar</button>
        </form>`;

  cont.style.display = "flex";

  actualizarEstadoBotonCliente(); // Configura el estado inicial del botón
}


//producto



// Validar formulario completo (productos)
function validarFormularioProducto() {
  const form = document.querySelector("#Actproducto");
  const nombre = form.querySelector("input[name='ActNombre']").value;
  const categoria = form.querySelector("select[name='Actcategoria']").value;
  const tipo = form.querySelector("select[name='Acttipo']").value;
  const precio = form.querySelector("input[name='Actprecio']").value;

  let errores = [];

  if (!validarCampoNoVacio(nombre)) {
    errores.push("El nombre del producto no puede estar vacío.");
  }

  if (!validarCampoNoVacio(categoria)) {
    errores.push("Debe seleccionar o agregar una categoría.");
  }

  if (!validarCampoNoVacio(tipo) || (tipo !== "suelto" && tipo !== "unitario")) {
    errores.push("Debe seleccionar un tipo válido ('suelto' o 'unitario').");
  }

  if (!validarCampoNoVacio(precio) || isNaN(precio) || Number(precio) <= 0) {
    errores.push("El precio debe ser un número positivo.");
  }

  const errorList = form.querySelector("ul.error");
  errorList.innerHTML = ""; // Limpia los errores previos

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });
    console.log("Errores encontrados:", errores);
    return false; // El formulario no es válido
  }

  console.log("Formulario válido");
  return true; // El formulario es válido
}

// Habilitar o deshabilitar el botón de envío para productos
function actualizarEstadoBotonProducto() {
  const form = document.querySelector("#Actproducto");
  const botonEnviar = form.querySelector("button[type='button']");
  const esValido = validarFormularioProducto();

  botonEnviar.disabled = !esValido; // Deshabilitar si el formulario no es válido
  console.log("Estado del botón:", botonEnviar.disabled ? "Deshabilitado" : "Habilitado");
}

// Función para actualizar producto con validaciones
function actualizarProducto(id, event) {
  event.preventDefault(); // Evita el envío del formulario

  if (validarFormularioProducto()) {
    console.log("Formulario válido. Enviando datos...");
    // Aquí agregarías el código para realizar la actualización en el backend (fetch o AJAX)
  }
}

// Función para mostrar el formulario de producto y configurar validaciones dinámicas
function updateProducto(id) {
  // Obtener datos del producto específico
  let Id = document.getElementById(`ID${id}`).innerText;
  let nombre = document.getElementById(`nombre${id}`).innerText;
  let tipo = document.getElementById(`tipo${id}`).innerText;
  let categoria = document.getElementById(`categoria${id}`).innerText;
  let precio = document.getElementById(`precio${id}`).innerText;
  let cont = document.getElementById("upPopup");

  // Obtener las categorías únicas de productosData
  const categoriasUnicas = [...new Set(productosData.map(producto => producto.Categoria))];

  // Generar las opciones para el select de categorías
  let opcionesCategoria = categoriasUnicas.map(cat => {
    return `<option value="${cat}" ${cat === categoria ? "selected" : ""}>${cat}</option>`;
  }).join("");

  // Crear el formulario dinámico con las opciones de categorías cargadas
  cont.innerHTML = `<form action="" class="modificacion" id="Actproducto">
                <h2>Editar producto</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" maxlength="50" class="full" name="ActNombre" placeholder="Nombre" value="${nombre}" oninput="actualizarEstadoBotonProducto()">
                <div class="full">
                    <select class="js-example-basic-single" name="Actcategoria" onchange="actualizarEstadoBotonProducto()">
                        <option value="" disabled>Seleccione una categoría</option>
                        ${opcionesCategoria} <!-- Opciones dinámicas -->
                    </select>
                </div>
                <select class="medio" name="Acttipo" id="tipo" onchange="actualizarEstadoBotonProducto()">
                    <option value="suelto" ${tipo === "suelto" ? "selected" : ""}>Suelto</option>
                    <option value="unitario" ${tipo === "unitario" ? "selected" : ""}>Unitario</option>
                </select>
                <input type="number" class="medio" name="Actprecio" placeholder="Precio" value="${precio}" oninput="actualizarEstadoBotonProducto()">
                <ul class="full error"></ul>
                <button type="button" class="full" onclick="actualizarProducto(${Id}, event)">Enviar</button>
            </form>`;

  // Mostrar el popup
  cont.style.display = "flex";

  // Inicializar el select2 para la selección de categorías
  $(".js-example-basic-single").select2({
    placeholder: "Selecciona o agrega una categoría",
    tags: true, // Permite agregar nuevas opciones
    allowClear: true, // Habilita limpiar la selección
    width: "100%" // Asegura que se ajuste al diseño
  });

  actualizarEstadoBotonProducto(); // Configura el estado inicial del botón
}







// Validar formulario completo (zonas)
function validarFormularioZona() {
  const form = document.querySelector("#Actzona");
  const nombreColonia = form.querySelector("input[name='nombre_colonia']").value;
  const costoZona = form.querySelector("input[name='costo_zona']").value;

  let errores = [];

  if (!validarCampoNoVacio(nombreColonia)) {
    errores.push("El nombre de la colonia no puede estar vacío.");
  }

  if (!validarCampoNoVacio(costoZona) || isNaN(costoZona) || Number(costoZona) <= 0) {
    errores.push("El costo de la zona debe ser un número positivo.");
  }

  const errorList = form.querySelector("ul.error");
  errorList.innerHTML = ""; // Limpia los errores previos

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });
    console.log("Errores encontrados:", errores);
    return false; // El formulario no es válido
  }

  console.log("Formulario válido");
  return true; // El formulario es válido
}

// Habilitar o deshabilitar el botón de envío para zonas
function actualizarEstadoBotonZona() {
  const form = document.querySelector("#Actzona");
  const botonEnviar = form.querySelector("button[type='button']");
  const esValido = validarFormularioZona();

  botonEnviar.disabled = !esValido; // Deshabilitar si el formulario no es válido
  console.log("Estado del botón:", botonEnviar.disabled ? "Deshabilitado" : "Habilitado");
}

// Función para actualizar zona con validaciones
function actualizarZona(id, event) {
  event.preventDefault(); // Evita el envío del formulario

  if (validarFormularioZona()) {
    console.log("Formulario válido. Enviando datos...");
    // Aquí agregarías el código para realizar la actualización en el backend (fetch o AJAX)
  }
}

// Función para mostrar el formulario de zona y configurar validaciones dinámicas
function updateZona(id) {
  let nombre_colonia = document.getElementById(`nombre_colonia${id}`).innerText;
  let costo_zona = document.getElementById(`costo_zona${id}`).innerText;
  let cont = document.getElementById("upPopup");

  cont.innerHTML = `<form action="" class="modificacion" id="Actzona">
                <h2>Editar zona</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" maxlength="50" class="medio" name="nombre_colonia" placeholder="Nombre de la colonia" value="${nombre_colonia}" oninput="actualizarEstadoBotonZona()">
                <input type="number" class="medio" name="costo_zona" placeholder="Costo de la zona" value="${costo_zona}" oninput="actualizarEstadoBotonZona()">
                <ul class="error full" id="errorU"></ul>
                <button type="button" class="full" onclick="actualizarZona(${id}, event)">Enviar</button>
            </form>`;

  cont.style.display = "flex";

  actualizarEstadoBotonZona(); // Configura el estado inicial del botón
}







// Validar formulario completo (dirección)
function validarFormularioDireccion() {
  const form = document.querySelector("#direccion");
  const calle = form.querySelector("input[name='Actcalle']").value;
  const numExt = form.querySelector("input[name='Actnum_ext']").value;
  const numInt = form.querySelector("input[name='Actnum_int']").value;
  const colonia = form.querySelector("input[name='Actcolonia']").value;
  const CP = form.querySelector("input[name='ActCP']").value;
  const zona = form.querySelector("select[name='Actzonas']").value;

  let errores = [];

  if (!validarCampoNoVacio(calle)) {
    errores.push("La calle no puede estar vacía.");
  }

  if (!validarCampoNoVacio(numExt) || isNaN(numExt) || Number(numExt) <= 0) {
    errores.push("El número exterior debe ser un número positivo.");
  }


  if (!validarCampoNoVacio(colonia)) {
    errores.push("La colonia no puede estar vacía.");
  }

  if (!validarCampoNoVacio(CP) || !validarNumeros(CP, 5, 5)) {
    errores.push("El código postal debe contener exactamente 5 dígitos.");
  }

  if (!validarCampoNoVacio(zona)) {
    errores.push("Debe seleccionar una zona.");
  }

  const errorList = form.querySelector("ul.error");
  errorList.innerHTML = ""; // Limpia los errores previos

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });
    console.log("Errores encontrados:", errores);
    return false; // El formulario no es válido
  }

  console.log("Formulario válido");
  return true; // El formulario es válido
}

// Habilitar o deshabilitar el botón de envío para direcciones
function actualizarEstadoBotonDireccion() {
  const form = document.querySelector("#direccion");
  const botonEnviar = form.querySelector("button[type='button']");
  const esValido = validarFormularioDireccion();

  botonEnviar.disabled = !esValido; // Deshabilitar si el formulario no es válido
  console.log("Estado del botón:", botonEnviar.disabled ? "Deshabilitado" : "Habilitado");
}

// Función para actualizar dirección con validaciones
function actualizarDireccion(id, event, id_C) {
  event.preventDefault(); // Evita el envío del formulario

  if (validarFormularioDireccion()) {
    console.log(`Formulario válido. Enviando datos de la dirección ${id} del cliente ${id_C}...`);
    // Aquí agregarías el código para realizar la actualización en el backend (fetch o AJAX)
  }
}

function updateDireccion(id, id_C) {
  let calle = document.getElementById(`calle${id}`).innerText;
  let num_ext = document.getElementById(`num_ext${id}`).innerText;
  let num_int = document.getElementById(`num_int${id}`).innerText;
  let colonia = document.getElementById(`colonia${id}`).innerText;
  let zonaId = document.getElementById(`zona${id}`).getAttribute("data-zona-id"); // Obtener el ID de la zona
  let CP = document.getElementById(`CP${id}`).innerText;
  let cont = document.getElementById("upPopup");
  let ID = id;

  // Renderizar el formulario en el popup
  cont.innerHTML = `<form action="" class="modificacion" id="direccion">
                <h2>Editar dirección</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" maxlength="100" class="tercio" name="Actcalle" placeholder="Calle" value="${calle}" oninput="actualizarEstadoBotonDireccion()">
                <input type="text" maxlength="10" class="tercio" name="Actnum_ext" placeholder="Número Exterior" value="${num_ext}" oninput="actualizarEstadoBotonDireccion()">
                <input type="text" maxlength="10" class="tercio" name="Actnum_int" placeholder="Número Interior" value="${num_int}" oninput="actualizarEstadoBotonDireccion()">
                <input type="text" maxlength="100" class="tercio" name="Actcolonia" placeholder="Colonia" value="${colonia}" oninput="actualizarEstadoBotonDireccion()">
                <input type="number" class="tercio" name="ActCP" placeholder="Código Postal" value="${CP}" oninput="actualizarEstadoBotonDireccion()">
                <div class="tercio">
                  <select class="js-example-basic-single zonas" name="Actzonas" onchange="actualizarEstadoBotonDireccion()">
                      <option value="" selected disabled>Zona</option>
                  </select>
                </div>
                <ul class="error full"></ul>
                <button type="button" class="full" onclick="actualizarDireccion(${ID}, event, ${id_C})">Enviar</button>
            </form>`;

  cont.style.display = "flex";

  // Cargar zonas dinámicamente y seleccionar la zona actual
  cargarZonas()
    .then(() => {
      const selectZona = cont.querySelector(".zonas");
      if (selectZona) {
        selectZona.value = zonaId; // Seleccionar el ID de la zona actual
        $(selectZona).trigger("change"); // Asegura que select2 actualice la selección
      }
    })
    .catch((error) => console.error("Error al cargar zonas en updateDireccion:", error));

  actualizarEstadoBotonDireccion(); // Configurar el estado inicial del botón
}




document.addEventListener("DOMContentLoaded", function () {
  cargarZonas();
});

let i = 0;

function agregarDireccion() {
  let info = document.getElementById("contDicc");

  // Crear un nuevo contenedor para la dirección
  let nuevaDireccion = document.createElement("div");
  nuevaDireccion.classList.add("continuos");
  nuevaDireccion.id = `direccion${i}`;

  // Configurar el contenido HTML del nuevo contenedor
  nuevaDireccion.innerHTML = `
    <h2>Dirección</h2>
    <input type="text" maxlength="100" class="medio" name="calle" placeholder="Calle">
    <input type="text" maxlength="100" class="medio" name="colonia" placeholder="Colonia">
    <div class="contSel cuarto">
      <select class="js-example-basic-single zonas" id="zona${i}" name="zonas${i}">
          <option value="" selected disabled>Zona</option>
      </select>
    </div>
    <input type="text" maxlength="10" name="numeroEX" class="cuarto" placeholder="Número Exterior">
    <input type="text" maxlength="10" name="numeroIC" class="cuarto" placeholder="Número Interior">
    <input type="text" maxlength="5" name="CP" class="cuarto" placeholder="Código Postal">
    <button type="button" id="B_direcciones" onclick="eliminarCampoDireccion(this)">Eliminar dirección</button><br>
  `;

  // Agregar el nuevo contenedor de dirección al contenedor principal
  info.appendChild(nuevaDireccion);

  // Inicializar select2 en el nuevo elemento select
  cargarZonasParaSelect(`#zona${i}`);
  $(`#zona${i}`).select2();

  i++; // Incrementar el contador para la próxima dirección
}


function cargarZonasParaSelect(selector) {
  fetch("https://latosca.up.railway.app/zonas")
    .then((response) => response.json())
    .then((zonas) => {
      const select = document.querySelector(selector);
      select.innerHTML = '<option value="" selected disabled>Zona</option>'; // Clear previous options if any
      zonas.forEach((zona) => {
        const option = document.createElement("option");
        option.value = zona.ID_zona;
        option.textContent = zona.nombre_colonia;
        select.appendChild(option);
      });
      $(select).trigger("change"); // Refresh select2 with new options
    })
    .catch((error) => console.error("Error al cargar zonas:", error));
}


function cargarZonas() {
  return new Promise((resolve, reject) => {
    fetch("https://latosca.up.railway.app/zonas")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((zonas) => {
        const selects = document.querySelectorAll('.zonas');
        selects.forEach((select) => {
          select.innerHTML = '<option value="" selected disabled>Zona</option>';
          zonas.forEach((zona) => {
            select.innerHTML += `<option value="${zona.ID_zona}">${zona.nombre_colonia}</option>`;
          });
          $(select).select2(); // Inicializa select2 para los nuevos elementos
        });
        console.log("Zonas cargadas correctamente.");
        resolve(); // Indica que la carga se completó correctamente
      })
      .catch((error) => {
        console.error("Error al cargar zonas:", error);
        reject(error); // Indica que hubo un error
      });
  });
}



function eliminarCampoDireccion(button) {
  let direccion = button.parentNode; // Obtiene el div contenedor de la dirección
  direccion.remove(); // Elimina el div contenedor
}