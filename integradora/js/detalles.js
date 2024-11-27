$(document).ready(function () {
    // Inicializa Select2 para la lista de direcciones
    $("#direccion").select2({
        width: "100%",
    });

    // Escucha el evento 'select2:select' para actualizar el costo extra
    $("#direccion").on("select2:select", function () {
        actualizarCostoZona();
    });
    $("#direccion").on("select2:select", function () {
        actualizarCostoZona();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const ordenId = urlParams.get("id");

    if (ordenId) {
        fetch(`https://latosca.up.railway.app/Vorden/${ordenId}`)
            .then(response => {
                if (!response.ok) throw new Error("Error en la respuesta de la API");
                return response.json();
            })
            .then(orden => {
                if (orden && orden.ID_orden == ordenId) {
                    cargarEmpleados(orden.ID_Empleados);
                    cargarCliente(orden.ID_cliente);
                    cargarDirecciones(orden.ID_cliente, orden.Direccion);
                    cargarProductosOrden(ordenId);

                    document.getElementById("Tipo").value = orden.tipo_pago || "";
                    document.getElementById("fecha-hora").value = formatDate(orden.FechaE);
                    document.getElementById("estatus").value = orden.Estatus || "";
                } else {
                    console.error("No se encontró la orden con el ID especificado");
                }
            })
            .catch(error => console.error("Error al cargar los detalles de la orden:", error));
    } else {
        console.error("No se encontró el ID de la orden en la URL");
    }
});

// Función para habilitar la edición
function editarOr() {
    const inputs = document.querySelectorAll('#detalles input');
    const selects = document.querySelectorAll('#detalles select');
    const but = document.getElementById('editarOr');
    const butE = document.getElementById('enviarOr');
    const error = document.getElementById('error');
    const totalZInput = document.getElementById('totalZ'); // Seleccionar el input totalZ

    // Habilitar los campos de entrada, excepto los bloqueados
    inputs.forEach(input => {
        if (input.id === 'totalZ') {
            input.setAttribute('readonly', 'true'); // Asegurar que totalZ se mantenga bloqueado
        } else if (!input.classList.contains('precio-input') && 
                   !input.classList.contains('total-input')) {
            input.removeAttribute('readonly'); // Permitir editar otros inputs
        }
    });

    selects.forEach(select => {
        if (select.id !== 'cliente') {
            select.removeAttribute('disabled'); // Habilitar selects que no sean 'cliente'
        } else {
            select.setAttribute('disabled', 'true'); // Bloquear 'cliente'
        }
    });

    // Asegurar que totalZ esté bloqueado
    totalZInput.setAttribute('readonly', 'true');

    // Mostrar el error y botones correspondientes
    error.style.display = 'block';
    but.style.display = 'none';
    butE.style.display = 'block';

    // Mostrar alerta de cambio a modo edición
    Alerts.successAlert("Éxito", "Haz cambiado al modo edición");
}






// Función para cargar empleados dinámicamente
function cargarEmpleados(empleadoId) {
    fetch("https://latosca.up.railway.app/empleados")
        .then(response => response.json())
        .then(empleados => {
            const select = document.getElementById("empleado");
            select.innerHTML = '<option value="" selected disabled>Empleado</option>';
            empleados.filter(empleado => empleado.estatus == 1).forEach(empleado => {
                select.innerHTML += `<option value="${empleado.ID_Empleados}">${empleado.Nombres} ${empleado.Apellido_P}</option>`;
            });
            select.value = empleadoId;
            $(select).select2();
        })
        .catch(error => console.error("Error al cargar empleados:", error));
}

// Función para cargar clientes dinámicamente
function cargarCliente(clienteId) {
    fetch("https://latosca.up.railway.app/clientes")
        .then(response => response.json())
        .then(clientes => {
            const select = document.getElementById("cliente");
            select.innerHTML = '<option value="" selected disabled>Cliente</option>';
            clientes.filter(cliente => cliente.estatus === 1).forEach(cliente => {
                select.innerHTML += `<option value="${cliente.ID_cliente}">${cliente.Nombres} ${cliente.Apellido_P}</option>`;
            });
            select.value = clienteId;
            $(select).select2();
        })
        .catch(error => console.error("Error al cargar clientes:", error));
}

// Función para cargar direcciones de un cliente y actualizar el costo extra
function cargarDirecciones(clienteId, direccionSeleccionada) {
    fetch("https://latosca.up.railway.app/direcciones")
        .then(response => response.json())
        .then(direcciones => {
            const select = document.getElementById("direccion");
            select.innerHTML = '<option value="" selected disabled>Dirección</option>';

            direcciones.filter(dir => dir.ID_cliente == clienteId).forEach(direccion => {
                if (direccion.estatus == 1) {
                    select.innerHTML += `
                        <option value="${direccion.id_direccion}" data-zona="${direccion.id_zona}">
                            ${direccion.calle}, ${direccion.colonia}
                        </option>`;
                }
            });

            select.value = direccionSeleccionada; // Establecer la dirección seleccionada
            $(select).select2(); // Inicializar select2

            actualizarCostoZona(); // Actualizar costo extra al cargar
        })
        .catch(error => console.error("Error al cargar direcciones:", error));
}
function actualizarCostoZona() {
    const select = document.getElementById("direccion");
    const selectedOption = select.options[select.selectedIndex];
    const totalZInput = document.getElementById("totalZ");

    if (selectedOption && selectedOption.hasAttribute("data-zona")) {
        const zonaId = selectedOption.getAttribute("data-zona");

        fetch("https://latosca.up.railway.app/zonas/")
            .then((response) => response.json())
            .then((zonas) => {
                const zona = zonas.find((z) => z.ID_zona == zonaId);

                if (zona && zona.costo_zona) {
                    // Actualizar el valor del costo extra
                    totalZInput.value = parseFloat(zona.costo_zona).toFixed(2); // Asignar el nuevo 
                } else {
                    totalZInput.value = "0.00";
                }

                // Recalcular el total general después de actualizar el costo extra
                actualizarTotalGeneral();
            })
            .catch((error) => {
                console.error("Error al obtener el costo extra:", error);
                totalZInput.value = "0.00"; // Si hay error, establecer a 0
                actualizarTotalGeneral(); // Recalcular el total
            });
    } else {
        totalZInput.value = "0.00"; // Si no hay zona seleccionada, establecer a 0
        actualizarTotalGeneral();
    }
}


function cargarProductosOrden(ordenId) {
    const productosContainer = document.getElementById("productos-container");

    // Solicitar detalles de productos de la orden
    fetch(`https://latosca.up.railway.app/Vdetalles/${ordenId}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los detalles de productos");
            return response.json();
        })
        .then((detallesData) => {
            // Solicitar todos los productos disponibles
            return fetch("https://latosca.up.railway.app/productos")
                .then((response) => {
                    if (!response.ok) throw new Error("Error al obtener los productos");
                    return response.json();
                })
                .then((productosData) => ({ detallesData, productosData }));
        })
        .then(({ detallesData, productosData }) => {
            // Limpiar el contenedor de productos
            productosContainer.innerHTML = "";

            if (detallesData.productos && Array.isArray(detallesData.productos)) {
                detallesData.productos.forEach((producto) => {
                    const precioUnitario = parseFloat(producto.precio_unitario) || 0;
                    const total = precioUnitario * (producto.cantidad_p || 1);

                    const productoDiv = document.createElement("div");
                    productoDiv.className = "products";
                    productoDiv.setAttribute("data-id-detalle", producto.ID_detalle); // Asociar ID_detalle

                    // Generar las opciones del select
                    const selectHtml = productosData
                        .map(
                            (prod) => `
                            <option value="${prod.ID_product}" ${
                                prod.ID_product == producto.ID_product ? "selected" : ""
                            }>
                                ${prod.Nombre}
                            </option>`
                        )
                        .join("");

                    // Crear el contenido dinámico del producto
                    productoDiv.innerHTML = `
                        <select class="inputs select-producto js-example-basic-single">
                            ${selectHtml}
                        </select>
                        <input class="inputs cantidad-input" type="number" value="${producto.cantidad_p}" min="1">
                        <input class="inputs precio-input" type="text" value="${precioUnitario.toFixed(2)}" readonly>
                        <input class="inputs total-input" type="text" value="${total.toFixed(2)}" readonly>
                    `;

                    productosContainer.appendChild(productoDiv);

                    // Inicializar Select2 en el nuevo select
                    $(productoDiv.querySelector(".select-producto")).select2();

                    // **Actualizar el precio y total al cambiar el producto seleccionado**
                    const selectProducto = productoDiv.querySelector(".select-producto");
                    $(selectProducto).on("select2:select", function () {
                        const nuevoProductoId = selectProducto.value;
                        const nuevoProducto = productosData.find((prod) => prod.ID_product == nuevoProductoId);

                        if (nuevoProducto) {
                            // Actualizar el precio por unidad
                            const nuevoPrecio = parseFloat(nuevoProducto.precio_unitario) || 0;
                            productoDiv.querySelector(".precio-input").value = nuevoPrecio.toFixed(2);

                            // Recalcular el total del producto
                            const cantidad = parseFloat(productoDiv.querySelector(".cantidad-input").value) || 1;
                            const nuevoTotal = cantidad * nuevoPrecio;
                            productoDiv.querySelector(".total-input").value = nuevoTotal.toFixed(2);

                            // Actualizar el total general
                            actualizarTotalGeneral();
                        } else {
                            console.error("No se encontró el producto seleccionado en los datos.");
                        }
                    });

                    // **Actualizar el total al cambiar la cantidad**
                    const cantidadInput = productoDiv.querySelector(".cantidad-input");
                    cantidadInput.addEventListener("input", () => {
                        const cantidad = parseFloat(cantidadInput.value) || 0;
                        const precio = parseFloat(productoDiv.querySelector(".precio-input").value) || 0;

                        const nuevoTotal = cantidad * precio;
                        productoDiv.querySelector(".total-input").value = nuevoTotal.toFixed(2);

                        // Actualizar el total general
                        actualizarTotalGeneral();
                    });
                });
            } else {
                console.warn("No se encontraron productos en los detalles de la orden.");
            }

            actualizarTotalGeneral(); // Calcular el total general después de cargar los productos
        })
        .catch((error) => console.error("Error al cargar productos de la orden:", error));
}






function actualizarTotalGeneral() {
    const productosContainer = document.getElementById("productos-container"); // Contenedor de los productos
    const totalGeneral = document.getElementById("total-general"); // Elemento donde se muestra el total general
    const totalZInput = document.getElementById("totalZ"); // Input donde está el costo extra

    let totalProductos = 0; // Inicializar el total de los productos

    // Verifica si hay inputs con clase 'total-input' y suma sus valores
    const totalInputs = productosContainer.querySelectorAll(".total-input");
    if (totalInputs.length === 0) {
        console.warn("No se encontraron inputs con clase 'total-input' en el contenedor de productos.");
    }
    totalInputs.forEach((totalInput) => {
        const valor = parseFloat(totalInput.value) || 0; // Convertir el valor a número
        totalProductos += valor; // Sumar al total de productos
    });

    // Obtener el costo extra desde el input totalZ
    const costoExtra = parseFloat(totalZInput.value) || 0;

    // Calcular el total general sumando el total de productos y el costo extra
    const total = totalProductos + costoExtra;


    // Actualizar el HTML con el total general
    totalGeneral.textContent = `Total General: $${total.toFixed(2)}`;
}



const productosContainer = document.getElementById("productos-container");





// Función para inicializar el cálculo dinámico de totales
function inicializarCalculoTotales() {
    const productosContainer = document.getElementById("productos-container");

    productosContainer.addEventListener("input", event => {
        if (event.target.matches(".cantidad-input, .precio-input")) {
            // Obtén el contenedor del producto actual
            const productoDiv = event.target.closest(".products");

            // Calcula el total para este producto
            const cantidadInput = productoDiv.querySelector(".cantidad-input");
            const precioInput = productoDiv.querySelector(".precio-input");
            const totalInput = productoDiv.querySelector(".total-input");

            const cantidad = parseFloat(cantidadInput.value) || 0;
            const precio = parseFloat(precioInput.value) || 0;
            const total = cantidad * precio;

            // Actualiza el total individual
            totalInput.value = total.toFixed(2);

            // Actualiza el total general
            actualizarTotalGeneral();
        }
    });
}



// Asigna el evento 'change' para actualizar el costo extra al cambiar de dirección
document.getElementById("direccion").addEventListener("change", actualizarCostoZona);

// Función para formatear la fecha
function formatDate(fechaISO) {
    if (!fechaISO) {
        console.error("Fecha no proporcionada.");
        return "";
    }

    try {
        const [fecha, hora] = fechaISO.split("T");
        if (!fecha || !hora) {
            throw new Error("Formato ISO incorrecto.");
        }

        const [year, month, day] = fecha.split("-");
        const [hours, minutes] = hora.split(":");

        // Formatear en el estilo deseado: "YYYY-MM-DDTHH:mm"
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
        console.error("Error al formatear la fecha:", error.message);
        return "";
    }
}









// --------------------------------------------------------------------------------------------------------------------------------------Subida---------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const ordenId = new URLSearchParams(window.location.search).get("id");

    if (ordenId) {
        document.getElementById("enviarOr").addEventListener("click", () => {
            guardarCambiosOrden(ordenId);
        });
    } else {
        console.error("No se encontró el ID de la orden.");
    }
});

// Función para actualizar los detalles de la orden
async function actualizarDetallesOrden(ordenId, detalles) {
    try {
        for (const detalle of detalles) {

            const response = await fetch(`https://latosca.up.railway.app/detalle/modificar/${detalle.ID_detalle}`, { // Se usa ID_detalle
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID_product: detalle.ID_product,
                    cantidad_p: detalle.cantidad_p,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error(`Error al actualizar el detalle del producto ${detalle.ID_product}:`, result);
                throw new Error(`Error en la API: ${result.message || response.statusText}`);
            }
        }

    } catch (error) {
        console.error("Error al actualizar los detalles de la orden:", error);
        throw error;
    }
}


// Función para actualizar la orden principal
async function actualizarOrdenPrincipal(ordenId, datosOrden) {
    try {

        const response = await fetch(`https://latosca.up.railway.app/orden/modificar/${ordenId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosOrden),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error al actualizar la orden principal:", result);
            throw new Error(`Error en la API: ${result.message || response.statusText}`);
        }

    } catch (error) {
        console.error("Error al actualizar la orden principal:", error);
        throw error;
    }
}

// Función que recopila los datos y realiza ambas actualizaciones
async function guardarCambiosOrden(ordenId) {
    try {


        // Recopilar los datos de la orden principal
        const datosOrden = {
            fechaE: document.getElementById("fecha-hora").value,
            Estatus: document.getElementById("estatus").value,
            Precio_total: parseFloat(document.getElementById("total-general").textContent.replace("Total General: $", "")) || 0,
            ID_cliente: document.getElementById("cliente").value,
            ID_Empleados: document.getElementById("empleado").value,
            tipo_pago: document.getElementById("Tipo").value,
        };

        // Recopilar los detalles de los productos
        const detalles = [...document.querySelectorAll("#productos-container .products")].map((productoDiv) => {
            return {
                ID_detalle: productoDiv.getAttribute("data-id-detalle"), // Nuevo: Obtener el ID_detalle
                ID_product: productoDiv.querySelector(".select-producto").value,
                cantidad_p: productoDiv.querySelector(".cantidad-input").value,
            };
        });

        // Validar que los detalles sean correctos
        for (const detalle of detalles) {
            if (!detalle.ID_product || !detalle.cantidad_p || !detalle.ID_detalle) { // Validar ID_detalle
                throw new Error("Faltan datos en uno o más productos");
            }
        }

        // Actualizar la orden principal
        await actualizarOrdenPrincipal(ordenId, datosOrden);

        // Actualizar los detalles de la orden
        await actualizarDetallesOrden(ordenId, detalles);

        alert("Cambios guardados correctamente");
    } catch (error) {
        console.error("Error al guardar los cambios de la orden:", error);
        alert("Error al guardar los cambios de la orden. Revisa la consola para más detalles.");
    }
}


// Validar formulario de orden
function validarFormularioOrden() {
    const errores = [];
    const errorList = document.querySelector("ul.error");
    errorList.innerHTML = ""; // Limpia errores previos
  
    // Validar campos principales de la orden
    const fechaE = document.getElementById("fecha-hora").value;
    const estatus = document.getElementById("estatus").value;
    const cliente = document.getElementById("cliente").value;
    const empleado = document.getElementById("empleado").value;
    const tipoPago = document.getElementById("Tipo").value;
  
    if (!fechaE) {
      errores.push("La fecha y hora no pueden estar vacías.");
    }
  
    if (!estatus) {
      errores.push("El estatus no puede estar vacío.");
    }
  
    if (!cliente) {
      errores.push("Debe seleccionar un cliente.");
    }
  
    if (!empleado) {
      errores.push("Debe seleccionar un empleado.");
    }
  
    if (!tipoPago) {
      errores.push("Debe seleccionar un tipo de pago.");
    }
  
    // Validar detalles de productos
    const productos = document.querySelectorAll("#productos-container .products");
    if (productos.length === 0) {
      errores.push("Debe agregar al menos un producto.");
    } else {
      productos.forEach((producto, index) => {
        const idProducto = producto.querySelector(".select-producto").value;
        const cantidad = producto.querySelector(".cantidad-input").value;
  
        if (!idProducto) {
          errores.push(`El producto en la fila ${index + 1} no está seleccionado.`);
        }
  
        if (!cantidad || parseInt(cantidad) <= 0) {
          errores.push(`La cantidad del producto en la fila ${index + 1} debe ser mayor a 0.`);
        }
      });
    }
  
    // Mostrar errores si los hay
    if (errores.length > 0) {
      errores.forEach((error) => {
        const li = document.createElement("li");
        li.textContent = error;
        errorList.appendChild(li);
      });
      console.log("Errores encontrados:", errores);
      return false; // Formulario no válido
    }
  
    console.log("Formulario válido");
    return true; // Formulario válido
  }
  
  // Habilitar o deshabilitar el botón de envío
  function actualizarEstadoBotonOrden() {
    const botonEnviar = document.getElementById("enviarOr");
    const esValido = validarFormularioOrden();
    botonEnviar.disabled = !esValido; // Deshabilitar si el formulario no es válido
    console.log("Estado del botón:", botonEnviar.disabled ? "Deshabilitado" : "Habilitado");
  }
  
  // Asignar validación al botón
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("orden-formulario");
    form.addEventListener("input", actualizarEstadoBotonOrden); // Validar dinámicamente
  });

  document.addEventListener("DOMContentLoaded", () => {
    const fechaHoraInput = document.getElementById("fecha-hora");

    // Obtener la fecha y hora actual en formato ISO (YYYY-MM-DDTHH:mm)
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");

    // Formatear la fecha mínima para el atributo "min"
    const fechaMinima = `${anio}-${mes}-${dia}T${horas}:${minutos}`;

    // Establecer la fecha mínima en el input
    fechaHoraInput.min = fechaMinima;
});

  
