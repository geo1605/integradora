let j = 0;
let productosData = []; // Almacenará los datos de los productos obtenidos de la API
let direccionesData = []; // Almacenará todas las direcciones de la API
let zonasData = []; // Almacenará todas las zonas de la API

// Cargar productos de la API y guardarlos en productosData
function cargarproductos() {
    fetch("https://latosca.up.railway.app/productos")
      .then((response) => response.json())
      .then((productos) => {
        productosData = productos; // Guardar todos los productos en productosData
        anadirProducto(); // Llama a anadirProducto() después de cargar los datos
      })
      .catch((error) => console.error("Error al cargar productos:", error));
}

// Función para añadir un producto dinámicamente
function anadirProducto() {
    const productosContainer = document.getElementById("productosContainer");

    let newProductHTML = `
        <div class="producto-item" id="producto${j}">
            <select id="productoSelect${j}" class="productosO js-example-basic-single" name="producto${j}" onchange="actualizarPrecio(${j})">
                <option value="" selected disabled>Productos</option>
            </select>
            <input id="cantidad${j}" type="number" name="cantidad${j}" placeholder="cantidad/Kg" oninput="actualizarTotal()">
            <input id="precio${j}" type="number" placeholder="Precio" disabled>
        </div>
    `;

    productosContainer.insertAdjacentHTML("beforeend", newProductHTML);

    const nuevoSelect = document.getElementById(`productoSelect${j}`);
    productosData.forEach((producto) => {
        nuevoSelect.innerHTML += `<option value="${producto.ID_product}">${producto.Nombre}</option>`;
    });

    // Aplicar select2 después de añadir el nuevo select al DOM
    $(`#productoSelect${j}`).select2();

    j++;
}

// Función para actualizar el precio del producto seleccionado
function actualizarPrecio(productoIndex) {
    const productoSelect = document.getElementById(`productoSelect${productoIndex}`);
    const precioInput = document.getElementById(`precio${productoIndex}`);
    const productoId = productoSelect.value;

    // Buscar el producto en productosData
    const producto = productosData.find(p => p.ID_product == productoId);

    if (producto) {
        precioInput.value = parseFloat(producto.precio); // Asignar el precio del producto
        actualizarTotal(); // Llamar a actualizarTotal para recalcular el total con el nuevo precio
    }
}

// Función para actualizar el total
function actualizarTotal() {
    let total = 0;

    for (let i = 0; i < j; i++) {
        const productoSelect = document.getElementById(`productoSelect${i}`);
        const cantidadInput = document.getElementById(`cantidad${i}`);
        const precioInput = document.getElementById(`precio${i}`);

        if (productoSelect && cantidadInput && precioInput) {
            const cantidad = parseFloat(cantidadInput.value) || 0;
            const precio = parseFloat(precioInput.value) || 0;

            total += cantidad * precio;
        }
    }

    // Obtener el costo extra de la zona y añadirlo al total
    const costoExtra = parseFloat(document.querySelector("input[name='extra']").value) || 0;
    total += costoExtra;

    document.getElementById("totalO").textContent = `Total: ${total.toFixed(2)}`;
}

// Cargar empleados y aplicar select2
function cargarEmpleados() {
    fetch("https://latosca.up.railway.app/empleados")
      .then((response) => response.json())
      .then((empleados) => {
        const select = document.getElementById('EmpleadoO');
        
        if (select) {
          select.innerHTML = '<option value="" selected disabled>Empleados</option>';
          empleados.forEach((empleado) => {
            select.innerHTML += `<option value="${empleado.ID_Empleados}">${empleado.Nombres} ${empleado.Apellido_P} ${empleado.Apellido_M}</option>`;
          });
          
          $(select).select2(); // Inicializa select2 en el select
        }
      })
      .catch((error) => console.error("Error al cargar empleados:", error));
}

// Función para cargar clientes y aplicar select2
function cargarCliente() {
    fetch("https://latosca.up.railway.app/clientes")
      .then((response) => response.json())
      .then((clientes) => {
        const select = document.getElementById('cliente');
        
        if (select) {
          select.innerHTML = '<option value="" selected disabled>Clientes</option>';
          clientes.forEach((cliente) => {
            if (cliente.estatus === 1) {
                select.innerHTML += `<option value="${cliente.ID_cliente}">${cliente.Nombres} ${cliente.Apellido_P} ${cliente.Apellido_M}</option>`;
            }
          });

          // Inicializa select2 en el select de clientes
          $(select).select2();

          // Agrega un listener para actualizar las direcciones cuando se seleccione un cliente usando change.select2
          $(select).on('change.select2', actualizarDirecciones);
        }
      })
      .catch((error) => console.error("Error al cargar clientes:", error));
}

// Cargar todas las direcciones
function cargarDirecciones() {
    fetch("https://latosca.up.railway.app/direcciones")
      .then((response) => response.json())
      .then((direcciones) => {
        direccionesData = direcciones; // Almacena todas las direcciones en la variable global
      })
      .catch((error) => console.error("Error al cargar direcciones:", error));
}

// Función para cargar todas las zonas y almacenarlas en zonasData
function cargarOrZona() {
    fetch("https://latosca.up.railway.app/zonas")
    .then((response) => response.json())
    .then((zonas) => {
        zonasData = zonas;
    })
    .catch((error) => console.error("Error al cargar zonas:", error));
}

// Función para obtener el costo extra de una zona por su ID
function obtenerCostoZona(idZona) {
    const zona = zonasData.find(z => z.ID_zona === idZona);
    return zona ? parseFloat(zona.costo_zona) : 0; // Devuelve el costo o 0 si no encuentra la zona
}

// Función para actualizar el select de direcciones basado en el cliente seleccionado y cargar el costo extra
function actualizarDirecciones() {
    const clienteID = document.getElementById('cliente').value; // ID del cliente seleccionado
    const selectDireccion = document.getElementById('direccionS');
    const extraInput = document.querySelector("input[name='extra']");

    if (selectDireccion) {
        // Filtra las direcciones que corresponden al cliente seleccionado
        const direccionesFiltradas = direccionesData.filter(direccion => direccion.ID_cliente == clienteID);

        // Limpia las opciones anteriores
        selectDireccion.innerHTML = '<option value="" selected disabled>Dirección</option>';

        // Agrega las direcciones filtradas al select
        direccionesFiltradas.forEach((direccion) => {
            selectDireccion.innerHTML += `<option value="${direccion.id_direccion}" data-id-zona="${direccion.id_zona}">${direccion.calle}, ${direccion.colonia}, ${direccion.numero}</option>`;
        });

        // Inicializa select2 en el select de direcciones
        $(selectDireccion).select2();

        // Actualizar el costo extra al seleccionar una dirección
        $(selectDireccion).on('change', function() {
            const selectedOption = selectDireccion.options[selectDireccion.selectedIndex];
            const idZona = parseInt(selectedOption.getAttribute("data-id-zona"));
            const costoZona = obtenerCostoZona(idZona); // Obtener el costo de la zona usando el ID
            
            if (extraInput) { // Asegúrate de que extraInput existe
                extraInput.value = costoZona.toFixed(2); // Actualiza el campo de costo extra con formato de dos decimales
            }
            actualizarTotal(); // Recalcula el total con el nuevo costo extra
        });
    }
}

// Cargar las zonas al iniciar
cargarOrZona();
