
// ==========================================
//           Funciones de Producto
// ==========================================

// Función para colapsar un popup
function colapsePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = "none";
  }
}

// Función para añadir un nuevo producto
function addProducto(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nombre = document.querySelector('input[name="Nombre"]').value;
  const tipo = document.querySelector('select[name="tipo"]').value;
  const categoria = document.querySelector('select[name="Categoria"]').value;
  const precio = document.querySelector('input[name="precio"]').value;

  const productoData = {
    Nombre: nombre,
    tipo: tipo,
    Categoria: categoria,
    precio: parseFloat(precio),
    estatus: 1,
  };

  // Enviar datos al servidor
  fetch("https://latosca.up.railway.app/producto/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productoData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Usar alertas personalizadas en lugar de alert()
      Alerts.successAlert('Éxito', 'Producto registrado exitosamente.')
        .then(() => {
          colapsePopup("addPopup");
          document.querySelector("#productoForm").reset();
          location.reload(); // Recargar la página después de presionar el botón de la alerta
        });
    })
    .catch((error) => {
      Alerts.errorAlert('Error', 'Error al registrar el producto: ' + error.message);
    });
}

// ==========================================
//           Funciones de Zona
// ==========================================

// Función para añadir una nueva zona
function addZona(event) {
  event.preventDefault();

  const nombreZona = document.querySelector('input[name="NombreZ"]').value;
  const costoZona = document.querySelector('input[name="costo"]').value;

  const zonaData = {
    nombre_colonia: nombreZona,
    costo_zona: parseFloat(costoZona),
  };

  // Enviar datos al servidor
  fetch("https://latosca.up.railway.app/zona/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(zonaData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Usar alertas personalizadas en lugar de alert()
      Alerts.successAlert('Éxito', 'Zona registrada exitosamente.')
        .then(() => {
          colapsePopup("addPopup");
          document.querySelector("#zonaForm").reset();
          location.reload(); // Recargar la página después de presionar el botón de la alerta
        });
    })
    .catch((error) => {
      Alerts.errorAlert('Error', 'Error al registrar la zona: ' + error.message);
    });
}


// ==========================================
//           Funciones de Empleado
// ==========================================

// Función para añadir un nuevo empleado
function addEmpleado(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nombres = document.querySelector('input[name="Nombres"]').value;
  const apellidoP = document.querySelector('input[name="Apellido_P"]').value;
  const apellidoM = document.querySelector('input[name="Apellido_M"]').value;
  const cargo = document.querySelector('select[name="Cargo"]').value;
  const correo = document.querySelector('input[name="correo"]').value;
  const telefono = document.querySelector('input[name="telefono"]').value;

  // Contraseña predeterminada
  const password = "1234";

  const empleadoData = {
    Nombres: nombres,
    Apellido_P: apellidoP,
    Apellido_M: apellidoM,
    Cargo: cargo,
    correo: correo,
    Telefono: telefono,
    password: password, // Contraseña sin encriptar
    estatus: 1, // Por defecto activo
  };

  // Enviar datos al servidor
  fetch("https://latosca.up.railway.app/empleado/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empleadoData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Usar alertas personalizadas en lugar de alert()
      Alerts.successAlert('Éxito', 'Empleado registrado exitosamente')
        .then(() => {
          colapsePopup("addPopup");
          document.querySelector("#empleadoForm").reset();
          location.reload(); // Recargar la página después de que el usuario cierre la alerta
        });
    })
    .catch((error) => {
      Alerts.errorAlert('Error', 'Error al registrar el empleado: ' + error.message);
    });
}
// ==========================================
//           Funciones de Cliente
// ==========================================
// Función para añadir un nuevo cliente
function addCliente(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nombres = document.querySelector('input[name="NombreC"]').value;
  const apellidoP = document.querySelector('input[name="PaternoC"]').value;
  const apellidoM = document.querySelector('input[name="MaternoC"]').value;
  const telefono = document.querySelector('input[name="telefonoC"]').value;
  const correo = document.querySelector('input[name="correoC"]').value;

  const clienteData = {
    Nombres: nombres,
    Apellido_P: apellidoP,
    Apellido_M: apellidoM,
    Telefono: telefono,
    correo: correo,
    estatus: 1, // Por defecto activo
  };

  // Registrar cliente en la API
  fetch("https://latosca.up.railway.app/cliente/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clienteData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al registrar el cliente. Estado: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      // Intentar obtener el último ID de cliente después de registrar el cliente
      return obtenerUltimoClienteId();
    })
    .then((clienteId) => {
      if (clienteId) {
        // Llama a addDireccionesC con el ID del cliente recién creado
        addDireccionesC(clienteId);
      } else {
        Alerts.errorAlert('Error', 'Error al obtener el ID del cliente registrado');
      }

      colapsePopup("addPopup");
      document.querySelector("#clienteForm").reset(); // Reiniciar formulario cliente
    })
    .catch((error) => {
      Alerts.errorAlert('Error', 'Error al registrar el cliente: ' + error.message);
    });
}

// Función para obtener el último ID de cliente registrado
function obtenerUltimoClienteId() {
  return fetch("https://latosca.up.railway.app/clientes") // Asegúrate de que devuelve una lista de clientes
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener el último ID de cliente");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Datos recibidos del endpoint /cliente:", data); // Verificar la estructura de la respuesta
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No se encontraron clientes registrados o los datos no son un arreglo");
      }
      const ultimoCliente = data[data.length - 1]; // Tomar el último cliente en la lista
      console.log("Último cliente encontrado:", ultimoCliente); // Verificar el último cliente
      return ultimoCliente.id || ultimoCliente.ID_cliente; // Ajusta el nombre del campo del ID según la respuesta
    })
    .catch((error) => {
      console.error("Error al obtener el último ID de cliente:", error);
      return null;
    });
}

function addDireccionesC(clienteId) {
  const direcciones = document.querySelectorAll("#contDicc .continuos");

  direcciones.forEach((direccionDiv, index) => {
    const calle = direccionDiv.querySelector('input[name="calle"]').value;
    const colonia = direccionDiv.querySelector('input[name="colonia"]').value;
    const zonas = direccionDiv.querySelector(`select[name="zonas${index}"]`).value; // Selecciona el nombre dinámico
    const numeroEX = direccionDiv.querySelector('input[name="numeroEX"]').value;
    const numeroIC = direccionDiv.querySelector('input[name="numeroIC"]').value;
    const CP = direccionDiv.querySelector('input[name="CP"]').value;

    const direccionData = {
      calle: calle,
      numero: numeroEX,
      Numero_int: numeroIC,
      colonia: colonia,
      CP: CP,
      estatus: 1,
      id_zona: zonas,
      ID_cliente: clienteId,
    };

    // Enviar cada dirección al servidor
    fetch("https://latosca.up.railway.app/direccion/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(direccionData),
    })
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Error del servidor: ${text}`);
        }
        return text ? JSON.parse(text) : {};
      })
      .catch((error) => {
        console.error("Error al registrar la dirección:", error);
        Alerts.errorAlert('Error', 'Error al registrar la dirección: ' + error.message);
      });
  });

  // Mensaje final una vez que todas las direcciones han sido procesadas
  Alerts.successAlert('Éxito', 'Cliente y todas las direcciones registradas exitosamente')
    .then(() => {
      location.reload(); // Recargar la página después de que el usuario cierre la alerta
    });
}




function addDireccion(event) {
  event.preventDefault();

  const calle = document.querySelector('input[name="calle"]').value;
  const colonia = document.querySelector('input[name="colonia"]').value;
  const zonas = document.querySelector('select[name="Szonas"]').value;
  const numeroEX = document.querySelector('input[name="numeroEX"]').value;
  const numeroIC = document.querySelector('input[name="numeroIC"]').value;
  const CP = document.querySelector('input[name="CP"]').value;
  const cliente = document.querySelector('input[name="cliente"]').value;

  const clienteData = {
    calle: calle,
    numero: numeroEX,
    Numero_int: numeroIC,
    colonia: colonia,
    CP:CP,
    estatus: 1,
    id_zona: zonas,
    ID_cliente: cliente
  };

  fetch("https://latosca.up.railway.app/direccion/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clienteData),
  })
    .then(async (response) => {
      const text = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(`Error del servidor: ${errorData.error || text}`);
        } catch (e) {
          throw new Error(`Error del servidor: ${text}`);
        }
      }
      return text ? JSON.parse(text) : {};
    })
    .then((data) => {
      colapsePopup("addPopup");
      document.getElementById("direcciones").reset();
      alert("Cliente registrado exitosamente");
      location.reload(); 
    })
    .catch((error) => {
      alert("Error al registrar el cliente: " + error.message);
    });
}











//---------------------------------------------UPDATE ------------------------------------------------------
// ================== FUNCIONES GENERALES ================== //

// Función genérica para cerrar el popup y resetear el formulario
function cerrarPopupYRecargar(popupId, formId) {
  colapsePopup(popupId);
  document.querySelector(`#${formId}`).reset();
  location.reload(); // Recargar la página para reflejar cambios
}

// ================== ZONA ================== //

// Actualizar Zona
// ================== ZONA ================== //

// Actualizar Zona
function actualizarZona(ID, event) {
  event.preventDefault();
  const zonaData = {
      nombre_colonia: document.querySelector('input[name="nombre_colonia"]').value,
      costo_zona: parseFloat(document.querySelector('input[name="costo_zona"]').value),
  };

  // Mostrar alerta de carga antes de realizar la solicitud
  const loading = Alerts.loadingAlert('Actualizando zona...');

  fetch(`https://latosca.up.railway.app/zona/modificar/${ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zonaData),
  })
  .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
  })
  .then(() => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de éxito
      Alerts.successAlert("Zona actualizada exitosamente", "La zona se ha actualizado correctamente.")
      .then(() => {
          // Cerrar popup y recargar la página
          cerrarPopupYRecargar("upPopup", "Actzona");
      });
  })
  .catch((error) => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de error
      Alerts.errorAlert("Error al actualizar la zona", error.message);
  });
}

// Eliminar Zona
function eliminarZona(id) {
  // Mostrar alerta de confirmación con SweetAlert
  Alerts.confirmAlert("¿Estás seguro?", "¿Deseas eliminar esta zona permanentemente?")
  .then((isConfirmed) => {
    if (!isConfirmed) return; // Si el usuario cancela, no se hace nada

    // Mostrar alerta de carga antes de realizar la eliminación
    const loading = Alerts.loadingAlert('Eliminando zona...');

    fetch(`https://latosca.up.railway.app/zona/eliminar/${id}`, { method: "PUT" })
    .then((response) => {
        if (!response.ok) throw new Error(`Error al eliminar la zona: ${response.status}`);
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de éxito
        Alerts.successAlert("Zona eliminada exitosamente", "La zona ha sido eliminada.")
        .then(() => {
            location.reload(); // Recargar la página después de la eliminación
        });
    })
    .catch((error) => {
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de error
        Alerts.errorAlert("Ocurrió un error al eliminar la zona", error.message);
    });
  });
}


// ================== EMPLEADO ================== //

// Actualizar Empleado
function actualizarEmpleado(ID, event) {
  event.preventDefault();
  const empleadoData = {
      Nombres: document.querySelector('input[name="ActNombre"]').value,
      Apellido_P: document.querySelector('input[name="ActPaterno"]').value,
      Apellido_M: document.querySelector('input[name="ActMaterno"]').value,
      Cargo: document.querySelector('select[name="Actcargo"]').value,
      correo: document.querySelector('input[name="Actcorreo"]').value,
      Telefono: document.querySelector('input[name="Acttelefono"]').value,
      estatus: 1,
  };

  // Mostrar alerta de carga antes de hacer la solicitud
  const loading = Alerts.loadingAlert('Actualizando empleado...');

  fetch(`https://latosca.up.railway.app/empleado/modificar/${ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleadoData),
  })
  .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
  })
  .then(() => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de éxito
      Alerts.successAlert("Empleado actualizado exitosamente", "El empleado se ha actualizado correctamente.")
      .then(() => {
          // Cerrar popup y recargar la página
          cerrarPopupYRecargar("upPopup", "empleados");
      });
  })
  .catch((error) => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de error
      Alerts.errorAlert("Error al actualizar el empleado", error.message);
  });
}

// Eliminar Empleado
function eliminarEmpleado(id) {
  // Mostrar alerta de confirmación con SweetAlert
  Alerts.confirmAlert("¿Estás seguro?", "¿Deseas eliminar este empleado permanentemente?")
  .then((isConfirmed) => {
    if (!isConfirmed) return; // Si el usuario cancela, no se hace nada

    // Mostrar alerta de carga antes de realizar la eliminación
    const loading = Alerts.loadingAlert('Eliminando empleado...');

    fetch(`https://latosca.up.railway.app/empleado/eliminar/${id}`, { method: "PUT" })
    .then((response) => {
        if (!response.ok) throw new Error(`Error al eliminar el empleado: ${response.status}`);
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de éxito
        Alerts.successAlert("Empleado eliminado exitosamente", "El empleado ha sido eliminado.")
        .then(() => {
            location.reload(); // Recargar la página después de la eliminación
        });
    })
    .catch((error) => {
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de error
        Alerts.errorAlert("Ocurrió un error al eliminar el empleado", error.message);
    });
  });
}
// ================== CLIENTE ================== //

// Actualizar Cliente
function actualizarCliente(ID, event) {
  event.preventDefault();
  const clienteData = {
      Nombres: document.querySelector('input[name="ActNombreC"]').value,
      Apellido_P: document.querySelector('input[name="ActPaternoC"]').value,
      Apellido_M: document.querySelector('input[name="ActMaternoC"]').value,
      Telefono: document.querySelector('input[name="Acttelefono"]').value,
      correo: document.querySelector('input[name="Actcorreo"]').value,
      estatus: 1,
  };

  // Mostrar alerta de carga antes de hacer la solicitud
  const loading = Alerts.loadingAlert('Actualizando cliente...');

  fetch(`https://latosca.up.railway.app/cliente/modificar/${ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clienteData),
  })
  .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
  })
  .then(() => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de éxito
      Alerts.successAlert("Cliente actualizado exitosamente", "El cliente ha sido actualizado correctamente.")
      .then(() => {
          // Cerrar popup y recargar la página
          cerrarPopupYRecargar("upPopup", "Actcliente");
      });
  })
  .catch((error) => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de error
      Alerts.errorAlert("Error al actualizar el cliente", error.message);
  });
}

// Eliminar Cliente
function eliminarCliente(id) {
  // Mostrar alerta de confirmación con SweetAlert
  Alerts.confirmAlert("¿Estás seguro?", "¿Deseas eliminar este cliente permanentemente?")
  .then((isConfirmed) => {
    if (!isConfirmed) return; // Si el usuario cancela, no se hace nada

    // Mostrar alerta de carga antes de realizar la eliminación
    const loading = Alerts.loadingAlert('Eliminando cliente...');

    fetch(`https://latosca.up.railway.app/cliente/eliminar/${id}`, { method: "PUT" })
    .then((response) => {
        if (!response.ok) throw new Error(`Error al eliminar el cliente: ${response.status}`);
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de éxito
        Alerts.successAlert("Cliente eliminado exitosamente", "El cliente ha sido eliminado.")
        .then(() => {
            location.reload(); // Recargar la página después de la eliminación
        });
    })
    .catch((error) => {
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de error
        Alerts.errorAlert("Ocurrió un error al eliminar el cliente", error.message);
    });
  });
}

// ================== PRODUCTO ================== //

// Actualizar Producto
function actualizarProducto(ID, event) {
  event.preventDefault();
  const productoData = {
      Nombre: document.querySelector('input[name="ActNombre"]').value,
      tipo: document.querySelector('select[name="Acttipo"]').value,
      Categoria: document.querySelector('select[name="Actcategoria"]').value,
      precio: parseFloat(document.querySelector('input[name="Actprecio"]').value),
      estatus: 1,
  };

  // Mostrar alerta de carga antes de hacer la solicitud
  const loading = Alerts.loadingAlert('Actualizando producto...');

  fetch(`https://latosca.up.railway.app/producto/modificar/${ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoData),
  })
  .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
  })
  .then(() => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de éxito
      Alerts.successAlert("Producto actualizado exitosamente", "El producto ha sido actualizado correctamente.")
      .then(() => {
          // Cerrar popup y recargar la página
          cerrarPopupYRecargar("upPopup", "Actproductos");
      });
  })
  .catch((error) => {
      // Cerrar alerta de carga
      loading.close();

      // Mostrar alerta de error
      Alerts.errorAlert("Error al actualizar el producto", error.message);
  });
}

// Eliminar Producto
function eliminarProducto(id) {
  // Mostrar alerta de confirmación con SweetAlert
  Alerts.confirmAlert("¿Estás seguro?", "¿Deseas eliminar este producto permanentemente?")
  .then((isConfirmed) => {
    if (!isConfirmed) return; // Si el usuario cancela, no se hace nada

    // Mostrar alerta de carga antes de realizar la eliminación
    const loading = Alerts.loadingAlert('Eliminando producto...');

    fetch(`https://latosca.up.railway.app/producto/eliminar/${id}`, { method: "PUT" })
    .then((response) => {
        if (!response.ok) throw new Error(`Error al eliminar el producto: ${response.status}`);
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de éxito
        Alerts.successAlert("Producto eliminado exitosamente", "El producto ha sido eliminado.")
        .then(() => {
            location.reload(); // Recargar la página después de la eliminación
        });
    })
    .catch((error) => {
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de error
        Alerts.errorAlert("Ocurrió un error al eliminar el producto", error.message);
    });
  });
}

// ================== DIRECCION ================== //

// Actualizar Dirección
function actualizarDireccion(ID, event, idC) {
  event.preventDefault();
  const idV = parseInt(ID); 
  // Crear objeto con los datos de la dirección
  const direccionData = {
      calle: document.querySelector('input[name="Actcalle"]').value,
      numero: document.querySelector('input[name="Actnum_ext"]').value,
      Numero_int: parseInt(document.querySelector('input[name="Actnum_int"]').value),
      colonia: document.querySelector('input[name="Actcolonia"]').value,
      CP: parseInt(document.querySelector('input[name="ActCP"]').value),
      estatus: 1,
      id_zona: parseInt(document.querySelector('select[name="Actzonas"]').value),
      ID_cliente: parseInt(idC),
  };

  // Log para verificar los datos antes de enviarlos
  console.log("Datos a enviar:", direccionData);

  // Mostrar alerta de carga antes de hacer la solicitud
  const loading = Alerts.loadingAlert('Actualizando dirección...');

  // Hacer la solicitud PUT
  fetch(`https://latosca.up.railway.app/direccion/modificar/${idV}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(direccionData),
  })
  .then((response) => {
    console.log("Respuesta del servidor:", response); // Log para verificar la respuesta inicial

    if (!response.ok) {
      return response.json().then((errorData) => {
        console.error(idV, "Error en la respuesta del servidor:", errorData); // Log para ver detalles del error en el servidor
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "No message available"}`);
      });
    }
    return response.json();
  })
  .then((data) => {
    console.log("Respuesta procesada correctamente:", data); // Log para confirmar éxito en la respuesta procesada

    // Cerrar alerta de carga
    loading.close();

    // Mostrar alerta de éxito
    Alerts.successAlert("Dirección actualizada exitosamente", "La dirección ha sido actualizada correctamente.")
    .then(() => {
      // Cerrar popup y recargar la página
      cerrarPopupYRecargar("upPopup", "direccion");
    });
  })
  .catch((error) => {
    console.error("Error en la actualización:", error); // Log para ver el detalle del error capturado

    // Cerrar alerta de carga
    loading.close();

    // Mostrar alerta de error
    Alerts.errorAlert("Error al actualizar la dirección", error.message);
  });
}


// Eliminar Dirección
function eliminarDireccion(id) {
  // Mostrar alerta de confirmación con SweetAlert
  Alerts.confirmAlert("¿Estás seguro?", "¿Deseas eliminar esta dirección permanentemente?")
  .then((isConfirmed) => {
    if (!isConfirmed) return; // Si el usuario cancela, no se hace nada

    // Mostrar alerta de carga antes de realizar la eliminación
    const loading = Alerts.loadingAlert('Eliminando dirección...');

    fetch(`https://latosca.up.railway.app/direccion/eliminar/${id}`, { method: "PUT" })
    .then((response) => {
        if (!response.ok) throw new Error(`Error al eliminar la dirección: ${response.status}`);
        
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de éxito
        Alerts.successAlert("Dirección eliminada exitosamente", "La dirección ha sido eliminada.")
        .then(() => {
            location.reload(); // Recargar la página después de la eliminación
        });
    })
    .catch((error) => {
        // Cerrar alerta de carga
        loading.close();

        // Mostrar alerta de error
        Alerts.errorAlert("Ocurrió un error al eliminar la dirección", error.message);
    });
  });
}


// ==========================================
//           Event Listeners
// ==========================================

// Formulario de producto
const productoForm = document.querySelector("#productoForm");
productoForm && productoForm.addEventListener("submit", addProducto);

// Formulario de zona
const zonaForm = document.querySelector("#zonaForm");
zonaForm && zonaForm.addEventListener("submit", addZona);

// Formulario de empleado
const empleadoForm = document.querySelector("#empleadoForm");
empleadoForm && empleadoForm.addEventListener("submit", addEmpleado);

// Asociar el evento submit al formulario de cliente
const clienteForm = document.querySelector("#clienteForm");
clienteForm && clienteForm.addEventListener("submit", addCliente);
