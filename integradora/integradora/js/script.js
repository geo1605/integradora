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
      colapsePopup("addPopup");
      document.querySelector("#productoForm").reset();
      alert("Producto registrado exitosamente");
      location.reload(); // Recargar la página
    })
    .catch((error) => {
      alert("Error al registrar el producto: " + error.message);
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
      colapsePopup("addPopup");
      document.querySelector("#zonaForm").reset();
      alert("Zona registrada exitosamente");
      location.reload(); // Recargar la página
    })
    .catch((error) => {
      alert("Error al registrar la zona: " + error.message);
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
  const telefono = document.querySelector('input[name="Telefono"]').value;
  const password = document.querySelector('input[name="password"]').value;

  const empleadoData = {
    Nombres: nombres,
    Apellido_P: apellidoP,
    Apellido_M: apellidoM,
    Cargo: cargo,
    correo: correo,
    Telefono: telefono,
    password: password,
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
      colapsePopup("addPopup");
      document.querySelector("#empleadoForm").reset();
      alert("Empleado registrado exitosamente");
      location.reload(); // Recargar la página
    })
    .catch((error) => {
      alert("Error al registrar el empleado: " + error.message);
    });
}

// ==========================================
//           Funciones de Cliente
// ==========================================

// Función para añadir un nuevo cliente
function addCliente(event) {
  event.preventDefault();

  // Obtener los valores del formulario individualmente
  const nombres = document.querySelector('input[name="Nombres"]').value;
  const apellidoP = document.querySelector('input[name="Apellido_P"]').value;
  const apellidoM = document.querySelector('input[name="Apellido_M"]').value;
  const telefono = document.querySelector('input[name="Telefono"]').value;
  const correo = document.querySelector('input[name="correo"]').value;

  const clienteData = {
    Nombres: nombres,
    Apellido_P: apellidoP,
    Apellido_M: apellidoM,
    Telefono: telefono,
    correo: correo,
    estatus: 1,
  };

  fetch("https://latosca.up.railway.app/cliente/registrar", {
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
      document.getElementById("clienteForm").reset();
      alert("Cliente registrado exitosamente");
      location.reload(); // Recargar la página
    })
    .catch((error) => {
      alert("Error al registrar el cliente: " + error.message);
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

// Formulario de cliente
const clienteForm = document.querySelector("#clienteForm");
clienteForm && clienteForm.addEventListener("submit", addCliente);