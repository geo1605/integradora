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
//updates
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
            <input type="text" class="tercio" name="ActNombre" placeholder="Nombre(s)" value="${name}">
            <input type="text" class="tercio" name="ActPaterno" placeholder="Apellido Paterno" value="${ApeP}">
            <input type="text" class="tercio" name="ActMaterno" placeholder="Apellido Materno" value="${ApeM}">
            <select class="medio" name="Actcargo" id="cargo" value="${cargo}">
                <option value="empleado">empleado</option>
                <option value="admin">admin</option>
            </select>
            <input type="text" class="medio" name="Acttelefono" placeholder="telefono" value="${numero}">
            <input type="email" class="full" name="Actcorreo" placeholder="correo" value="${correo}">
            <button type="button" class="full" onclick="actualizarEmpleado(${id}, event)">Enviar</button>
        </form>`;

  cont.style.display = "flex";
}

function updateCliente(id) {
  let nombre = document.getElementById(`nombre${id}`).innerText;
  let ApeP = document.getElementById(`ApellidoP${id}`).innerText;
  let ApeM = document.getElementById(`ApellidoM${id}`).innerText;
  let telefono = document.getElementById(`telefono${id}`).innerText;
  let correo = document.getElementById(`correo${id}`).innerText;
  let cont = document.getElementById("upPopup");

  cont.innerHTML = `<form action="" class="modificacion" id="Actcliente">
                <h2>Editar cliente</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="tercio" name="ActNombreC" placeholder="Nombre(s)" value="${nombre}">
                <input type="text" class="tercio" name="ActPaternoC" placeholder="Apellido Paterno" value="${ApeP}">
                <input type="text" class="tercio" name="ActMaternoC" placeholder="Apellido Materno" value="${ApeM}">
                <input type="text" class="medio" name="Acttelefono" placeholder="telefono" value="${telefono}">
                <input type="email" class="medio" name="Actcorreo" placeholder="correo" value="${correo}">
                <button type="button" class="full" onclick="actualizarCliente(${id}, event)">Enviar</button>
            </form>`;

  cont.style.display = "flex";
}

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
              <input type="text" class="full" name="ActNombre" placeholder="Nombre" value="${nombre}">
              <div class="full">
                  <select class="js-example-basic-single" name="Actcategoria">
                      <option value="" disabled>Seleccione una categoría</option>
                      ${opcionesCategoria} <!-- Opciones dinámicas -->
                  </select>
              </div>
              <select class="medio" name="Acttipo" id="tipo">
                  <option value="suelto" ${tipo === "suelto" ? "selected" : ""}>Suelto</option>
                  <option value="unitario" ${tipo === "unitario" ? "selected" : ""}>Unitario</option>
              </select>
              <input type="number" class="medio" name="Actprecio" placeholder="Precio" value="${precio}">
              <button type="button" class="full" onclick="actualizarProducto(${Id}, event)">Enviar</button>
          </form>`;

  // Mostrar el popup
  cont.style.display = "flex";

  $(".js-example-basic-single").select2({
    placeholder: "Selecciona o agrega una categoría",
    tags: true, // Permite agregar nuevas opciones
    allowClear: true, // Habilita limpiar la selección
    width: "100%" // Asegura que se ajuste al diseño
});
}





function updateZona(id) {
  let nombre_colonia = document.getElementById(`nombre_colonia${id}`).innerText;
  let costo_zona = document.getElementById(`costo_zona${id}`).innerText;
  let cont = document.getElementById("upPopup");

  cont.innerHTML = `<form action="" class="modificacion" id="Actzona">
                <h2>Editar zona</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="medio" name="nombre_colonia" placeholder="Nombre de la colonia" value="${nombre_colonia}">
                <input type="number" class="medio" name="costo_zona" placeholder="Costo de la zona" value="${costo_zona}">
                <ul class="error full" id="errorU"></ul>
                <button type="button" class="full" onclick="actualizarZona(${id}, event)">Enviar</button>
            </form>`;

  cont.style.display = "flex";
}

function updateDireccion(id,id_C) {
  let calle = document.getElementById(`calle${id}`).innerText;
  let num_ext = document.getElementById(`num_ext${id}`).innerText;
  let num_int = document.getElementById(`num_int${id}`).innerText;
  let colonia = document.getElementById(`colonia${id}`).innerText;
  let zona = document.getElementById(`zona${id}`).innerText;
  let CP = document.getElementById(`CP${id}`).innerText;
  let cont = document.getElementById("upPopup");
  let ID = id;
  cont.innerHTML = `<form action="" class="modificacion" id="direccion">
                <h2>Editar dirección</h2>
                <button id="salirP" type="button" onclick="colapsePopup('upPopup')">X</button>
                <input type="text" class="tercio" name="Actcalle" placeholder="Calle" value="${calle}">
                <input type="text" class="tercio" name="Actnum_ext" placeholder="Número Exterior" value="${num_ext}">
                <input type="text" class="tercio" name="Actnum_int" placeholder="Número Interior" value="${num_int}">
                <input type="text" class="tercio" name="Actcolonia" placeholder="Colonia" value="${colonia}">
                <input type="number" class="tercio" name="ActCP" placeholder="codigo postal" value="${CP}">
                <div class="tercio">
                <select class="js-example-basic-single zonas" name="Actzonas" >
                    <option value="" disabled>categoría</option>
                    <option value="${zona}" selected >${zona}</option>
                </select>
                </div>
                <button type="button" class="full" onclick="actualizarDireccion(${ID}, event, ${id_C})">Enviar</button>
            </form>`;


  cont.style.display = "flex";
  $(".js-example-basic-single").select2();
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
    <input type="text" class="medio" name="calle" placeholder="Calle">
    <input type="text" class="medio" name="colonia" placeholder="Colonia">
    <div class="contSel cuarto">
      <select class="js-example-basic-single zonas" id="zona${i}" name="zonas${i}">
          <option value="" selected disabled>Zona</option>
      </select>
    </div>
    <input type="text" name="numeroEX" class="cuarto" placeholder="Número Exterior">
    <input type="text" name="numeroIC" class="cuarto" placeholder="Número Interior">
    <input type="text" name="CP" class="cuarto" placeholder="Código Postal">
    <button type="button" id="B_direcciones" onclick="eliminarDireccion(this)">Eliminar dirección</button><br>
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
  fetch("https://latosca.up.railway.app/zonas")
    .then((response) => response.json())
    .then((zonas) => {
      const selects = document.querySelectorAll('.zonas');
      selects.forEach((select) => {
        select.innerHTML = '<option value="" selected disabled>Zona</option>';
        zonas.forEach((zona) => {
          select.innerHTML += `<option value="${zona.ID_zona}">${zona.nombre_colonia}</option>`;
        });
        $(select).select2(); // Initialize select2 for new elements
      });
    })
    .catch((error) => console.error("Error al cargar zonas:", error));
}


function eliminarDireccion(button) {
  let direccion = button.parentNode; // Obtiene el div contenedor de la dirección
  direccion.remove(); // Elimina el div contenedor
}