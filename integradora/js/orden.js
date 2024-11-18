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
            <select id="productoSelect${j}" class="productosO js-example-basic-single" name="producto${j}" required onchange="actualizarPrecio(${j})">
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




//iniciar orden


async function registrarOrdenPrimero(datosOrden) {
    try {
        const { Fecha, Hora, Estatus, Direccion, Precio_total, ID_cliente, ID_Empleados, tipo_pago } = datosOrden;

        // Crear la orden primero
        const response = await fetch('https://latosca.up.railway.app/orden/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Fecha: Fecha,
                Hora: Hora,
                Estatus: Estatus,
                Direccion: Direccion,
                Precio_total: Precio_total,
                ID_cliente: ID_cliente,
                ID_Empleados: ID_Empleados,
                tipo_pago: tipo_pago
            })
        });

        const data = await response.json();

        // Devuelve el ID de la orden creada
        if (data.insertId) {
            console.log("Orden creada con ID:", data.insertId);
            return data.insertId;
        } else {
            throw new Error("No se pudo obtener el ID de la orden creada.");
        }
    } catch (error) {
        console.error('Error al registrar la orden:', error);
        throw error; // Propaga el error para manejarlo en el llamado
    }
}

async function registrarDetallesConOrden(ID_orden, productos) {
    try {
        // Registrar los detalles con el ID de la orden creada
        const detallesIDs = await Promise.all(productos.map(async (producto) => {
            const response = await fetch('https://latosca.up.railway.app/detalle/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ID_product: producto.ID_product,
                    ID_orden: ID_orden, // Asigna el ID de la orden creada
                    cantidad_p: producto.cantidad_p
                })
            });
            const data = await response.json();
            return data.insertId; // Devuelve el ID del detalle insertado
        }));

        console.log("Detalles registrados con IDs:", detallesIDs);
        return detallesIDs;
    } catch (error) {
        console.error('Error al registrar detalles del producto:', error);
        throw error;
    }
}

document.querySelector('.botB').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtén los productos seleccionados y otros datos del formulario
    const productos = [...document.querySelectorAll('.producto-item')].map((prod) => ({
        ID_product: prod.querySelector('.productosO').value,
        cantidad_p: prod.querySelector('input[name^="cantidad"]').value
    }));

    // Validar que todos los productos tengan ID y cantidad
    for (let producto of productos) {
        if (!producto.ID_product || !producto.cantidad_p) {
            console.error("Faltan datos en los productos seleccionados:", producto);
            return;
        }
    }

    // Obtener el total directamente desde el elemento h3 con id totalO
    const totalElement = document.getElementById("totalO");
    const Precio_total = parseFloat(totalElement.textContent.replace("Total: ", "")) || 0;

    // Obtener la dirección seleccionada desde el select con id 'direccionS'
    const Direccion = document.getElementById('direccionS').options[document.getElementById('direccionS').selectedIndex].text;
    if (!Direccion) {
        console.error("No se ha seleccionado una dirección.");
        return;
    }

    // Obtener la fecha y hora actual en los formatos correctos
    const Fecha = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const Hora = new Date().toTimeString().split(' ')[0]; // HH:MM:SS en formato 24 horas

    const datosOrden = {
        productos: productos,
        Fecha: Fecha,
        Hora: Hora,
        Estatus: 'activo',
        Direccion: Direccion,  // Dirección seleccionada
        Precio_total: Precio_total,
        ID_cliente: document.getElementById('cliente').value,
        ID_Empleados: document.getElementById('EmpleadoO').value,
        tipo_pago: document.getElementById('tipoP').value
    };

    console.log("Datos de la orden a registrar:", datosOrden);

    try {
        // Primero registrar la orden
        const ID_orden = await registrarOrdenPrimero(datosOrden);

        // Luego registrar los detalles con el ID de la orden
        await registrarDetallesConOrden(ID_orden, productos);

        alert("la orden se creo con exito")
    } catch (error) {
        console.error("Error al registrar la orden y detalles:", error);
    }
});







// Cargar las zonas al iniciar
cargarOrZona();
