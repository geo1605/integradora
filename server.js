const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

const port = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'la_tosca';
const DB_PORT = process.env.DB_PORT || 3306;

const bcrypt = require("bcrypt");

const KEY = process.env.KEY || '1234';

app.use(bodyParser.json());
app.use(cors());

// Configuración de la sesión
app.use(session({
    secret: KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 100 * 60 * 1000
    }
}));

// Middleware para verificar inactividad
app.use((req, res, next) => {
    const now = Date.now();
    const maxInactivity = 100 * 60 * 1000;

    if (req.session && req.session.lastActivity) {
        const timeElapsed = now - req.session.lastActivity;
        if (timeElapsed > maxInactivity) {
            req.session.destroy(err => {
                if (err) console.error("Error al destruir la sesión:", err);
                return res.status(401).send({ mensaje: "Sesión expirada por inactividad" });
            });
        } else {
            req.session.lastActivity = now;
            next();
        }
    } else if (req.session) {
        req.session.lastActivity = now;
        next();
    }
});

// Middleware de autenticación para rutas protegidas
function verificarSesion(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

// Middleware para verificar roles
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (req.session && req.session.user) {
            const { Cargo } = req.session.user;
            if (rolesPermitidos.includes(Cargo)) {
                next();
            } else {
                res.status(403).send({ mensaje: "No tienes permiso para acceder a esta ruta" });
            }
        } else {
            res.status(401).send({ mensaje: "Debes iniciar sesión" });
        }
    };
}


app.get('/api/usuario/verificar', verificarSesion, (req, res) => {
    const sql = "SELECT @current_user_id AS currentUserId";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send({ mensaje: "Error al obtener el ID del usuario actual" });
        } else {
            res.status(200).send({ currentUserId: result[0].currentUserId });
        }
    });
});


// ====================== RUTAS DE AUTENTICACIÓN ====================== //

app.post('/login', (req, res) => {
    const { correo, password } = req.body;

    // Buscar al usuario por correo
    const sql = "SELECT * FROM empleado WHERE correo = ? AND estatus = 1";
    db.query(sql, [correo], async (err, results) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el servidor" });
        } else if (results.length > 0) {
            const usuario = results[0];

            try {
                // Comparar la contraseña proporcionada con el hash almacenado
                const isMatch = await bcrypt.compare(password, usuario.password);
                if (isMatch) {
                    req.session.user = usuario;

                    // Configurar la variable global en MySQL para el usuario actual
                    const setSessionQuery = "SET @current_user_id = ?";
                    db.query(setSessionQuery, [usuario.ID_Empleados], (err) => {
                        if (err) {
                            console.error("Error al establecer la variable de sesión en MySQL:", err);
                        }
                    });

                    res.status(200).send({ mensaje: "Inicio de sesión exitoso", usuario });
                } else {
                    res.status(401).send({ mensaje: "Correo o contraseña incorrectos" });
                }
            } catch (error) {
                console.error("Error al comparar contraseñas:", error);
                res.status(500).send({ mensaje: "Error interno al procesar la solicitud" });
            }
        } else {
            res.status(401).send({ mensaje: "Correo o contraseña incorrectos" });
        }
    });
});


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            res.status(500).send({ mensaje: "Error al cerrar sesión" });
        } else {
            res.status(200).send({ mensaje: "Sesión cerrada exitosamente" });
        }
    });
});
app.use('/styles', express.static(path.join(__dirname, 'integradora', 'styles')));
app.use('/js', express.static(path.join(__dirname, 'integradora', 'js')));
app.use('/img', express.static(path.join(__dirname, 'integradora', 'img')));
// ====================== RUTAS PARA GESTIONAR DATOS ====================== //

// Configuración para leer datos (accesible a admin y empleado)
const rutasLectura = [
    { ruta: '/clientes', sql: 'SELECT * FROM cliente' },
    { ruta: '/empleados', sql: 'SELECT * FROM empleado' },
    { ruta: '/productos', sql: 'SELECT * FROM producto' }, 
    { ruta: '/ordenes', sql: 'SELECT * FROM orden' },
    { ruta: '/detalles', sql: 'SELECT * FROM detalle_o' },
    { ruta: '/direcciones', sql: 'SELECT * FROM direccion' },
    { ruta: '/zonas', sql: 'SELECT * FROM zona' },
];

rutasLectura.forEach(({ ruta, sql }) => {
    app.get(ruta, verificarSesion, verificarRol(['admin', 'empleado']), (req, res) => {
        db.query(sql, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });
});

// Rutas para registrar datos (disponible a admin y empleado solo para órdenes)


/* extracción de rol  */
app.get('/api/rol', (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).send({ rol: req.session.user.Cargo }); // `Cargo` contiene el rol
    } else {
        res.status(401).send({ mensaje: "No autenticado" });
    }
});

app.get('/api/usuario/id', verificarSesion, (req, res) => {
    if (req.session && req.session.user) {
        const userId = req.session.user.ID_Empleados; // Cambia 'ID_Empleados' al nombre del campo que almacena el ID en tu tabla
        res.status(200).send({ id: userId });
    } else {
        res.status(401).send({ mensaje: "No hay un usuario autenticado." });
    }
});

/* seguridad paginas estaticas */
// Middleware para verificar si el usuario es admin
function verificarAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.Cargo === 'admin') {
        next(); // Permite el acceso si es admin
    } else {
        res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'error404.html'));
    }
}

// ====================== RUTAS PARA ARCHIVOS HTML ====================== //

app.get('/resourses/cambio.html', verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'cambio.html'));
});

app.get('/resourses/clientes.html', verificarSesion, verificarAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'clientes.html'));
});

app.get('/resourses/crearOrden.html', verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'crearOrden.html'));
});

app.get('/resourses/detalles.html', verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'detalles.html'));
});

/*solo admin*/

app.get('/resourses/direcciones.html', verificarSesion, verificarAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'direcciones.html'));
});

app.get('/resourses/empleados.html', verificarSesion, verificarAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'empleados.html'));
});

app.get('/resourses/main.html', verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'main.html'));
});

app.get('/resourses/orden.html', verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'orden.html'));
});

app.get('/resourses/productos.html', verificarSesion, verificarAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'productos.html'));
});

app.get('/resourses/zonas.html', verificarSesion, verificarAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'zonas.html'));
});

/* base de datos */
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
});

// Conexión a la base de datos y manejo de errores
db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        process.exit(1); // Detiene la aplicación si no puede conectarse
    } else {
        console.log("Conexión exitosa a la base de datos.");
    }
});

// Ruta raíz para redirigir a index.html en la carpeta 'integradora'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'index.html')); 
});

// ====================== RUTAS PARA CLIENTES ====================== //

// Obtener Clientes
app.get("/clientes", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM cliente where estatus=1';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Clientes
app.post('/cliente/registrar', verificarSesion, (req, res) => {
    const { Nombres, Apellido_P, Apellido_M, Telefono, correo, estatus } = req.body;
    const sql = "INSERT INTO cliente (Nombres, Apellido_P, Apellido_M, Telefono, correo, estatus) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Telefono, correo, estatus], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

app.put('/cliente/modificar/:id', verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const { Nombres, Apellido_P, Apellido_M, Telefono, correo } = req.body;
    const sql = "UPDATE cliente SET Nombres = ?, Apellido_P = ?, Apellido_M = ?, Telefono = ?, correo = ? WHERE ID_cliente = ?";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Telefono, correo, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Cliente no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Cliente actualizado correctamente", result });
        }
    });
});

// Eliminar Clientes
app.put("/cliente/eliminar/:id", verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE cliente SET estatus = 0 WHERE ID_cliente = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Cliente no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Cliente desactivado correctamente", result });
        }
    });
});

// ====================== RUTAS PARA DETALLES DE ORDENES ====================== //

// Obtener Detalles de Orden
app.get("/detalles", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM detalle_o';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Detalles de Orden
app.post('/detalle/registrar', verificarSesion, (req, res) => {
    const { ID_product, ID_orden, cantidad_p } = req.body;
    const sql = "INSERT INTO detalle_o (ID_product, ID_orden, cantidad_p) VALUES (?, ?, ?)";
    db.query(sql, [ID_product, ID_orden, cantidad_p], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

app.put('/detalle/modificar/:id', verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const { ID_product, cantidad_p } = req.body;
    const sql = "UPDATE detalle_o SET ID_product = ?, cantidad_p = ? WHERE ID_detalle = ?";
    db.query(sql, [ID_product, cantidad_p, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Detalle de orden no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Detalle de orden actualizado correctamente", result });
        }
    });
});

// Eliminar Detalles de Orden
app.put("/detalle/eliminar/:id", verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE detalle_o SET estatus = 0 WHERE ID_detalle = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Detalle de orden no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Detalle de orden desactivado correctamente", result });
        }
    });
});


app.get('/Vdetalles/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT d.ID_detalle, d.ID_product, d.ID_orden, d.cantidad_p,
        p.Nombre AS producto, p.precio AS precio_unitario
        FROM detalle_o d
        INNER JOIN producto p ON d.ID_product = p.ID_product
        WHERE d.ID_orden = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json({ productos: result });
        }
    });
});



// ====================== RUTAS PARA DIRECCIONES ====================== //

// Obtener Direcciones
app.get("/direcciones", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM direccion where estatus=1 ';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Direcciones
app.post('/direccion/registrar', verificarSesion, (req, res) => {
    const { calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente } = req.body;
    const sql = "INSERT INTO direccion (calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Direcciones
app.put('/direccion/modificar/:id', verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const { calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente } = req.body;
    const sql = "UPDATE direccion SET calle = ?, numero = ?, Numero_int = ?, colonia = ?, CP = ?, estatus = ?, id_zona = ?, ID_cliente = ? WHERE id_direccion = ?";
    db.query(sql, [calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Dirección no encontrada" });
        } else {
            res.status(200).send({ mensaje: "Dirección actualizada correctamente", result });
        }
    });
});

// Eliminar Direcciones
app.put("/direccion/eliminar/:id", verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE direccion SET estatus = 0 WHERE id_direccion = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Dirección no encontrada" });
        } else {
            res.status(200).send({ mensaje: "Dirección desactivada correctamente", result });
        }
    });
});

// ====================== RUTAS PARA EMPLEADOS ====================== //

// Obtener Empleados
app.get("/empleados", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM empleado where estatus=1 ';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Empleado


app.post('/empleado/registrar',  verificarSesion,  async (req, res) => {
  const { Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus } = req.body;

  try {
    // Encriptar la contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // SQL para insertar el empleado con la contraseña encriptada
    const sql = `
      INSERT INTO empleado (Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, hashedPassword, estatus], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({ message: "Empleado registrado exitosamente", result });
      }
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    res.status(500).send({ error: "Error interno al procesar la solicitud" });
  }
});



// Modificar Empleados
app.put('/empleado/modificar/:id', /* verificarSesion, verificarRol(['admin']), */ (req, res) => {
    const { id } = req.params;
    const { Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus } = req.body;
    const sql = "UPDATE empleado SET Nombres = ?, Apellido_P = ?, Apellido_M = ?, Cargo = ?, correo = ?, Telefono = ?, password = ?, estatus = ? WHERE ID_Empleados = ?";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Empleado no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Empleado actualizado correctamente", result });
        }
    });
});

// Eliminar Empleados
app.put("/empleado/eliminar/:id", verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE empleado SET estatus = 0 WHERE ID_Empleados = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Empleado no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Empleado desactivado correctamente", result });
        }
    });
});


// ====================== RUTAS PARA ORDENES ====================== //

// Obtener Ordenes
app.get("/ordenes", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM orden';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Ordenes
app.post('/orden/registrar', verificarSesion, verificarRol(['admin', 'empleado']), (req, res) => {
    const { fechaE, Fecha, Hora, Estatus, Direccion, Precio_total, ID_cliente, ID_Empleados, tipo_pago } = req.body;
    const sql = "INSERT INTO orden (fechaE, Fecha, Hora, Estatus, Direccion, Precio_total, ID_cliente, ID_Empleados, tipo_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [fechaE, Fecha, Hora, Estatus, Direccion, Precio_total, ID_cliente, ID_Empleados, tipo_pago], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Ordenes
app.put('/orden/modificar/:id' , verificarSesion , (req, res) => {
    const { id } = req.params;
    const { fechaE, Estatus, Precio_total, ID_cliente, ID_Empleados, tipo_pago } = req.body;
    const sql = "UPDATE orden SET fechaE = ?, Estatus = ?, Precio_total = ?, ID_cliente = ?, ID_Empleados = ?, tipo_pago = ? WHERE ID_orden = ?";
    db.query(sql, [fechaE, Estatus, Precio_total, ID_cliente, ID_Empleados, tipo_pago, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});


app.put('/orden/estatus/:id' , verificarSesion , (req, res) => {
    const { id } = req.params;
    const { Estatus } = req.body;
    const sql = "UPDATE orden SET Estatus = ? WHERE ID_orden = ?";
    db.query(sql, [ Estatus, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

app.get("/ViewOrden",  verificarSesion, (req, res) => {
    const sql = 'CALL obtener_ordenes();';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el servidor", error: err });
        } else if (results[0].length === 0) {
            res.status(404).send({ mensaje: "No se encontraron órdenes" });
        } else {
            res.status(200).send(results[0]); // Envía el primer conjunto de resultados del procedimiento
        }
    });
});



app.get("/Vorden/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM orden WHERE ID_orden = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length === 0) {
            res.status(404).send({ mensaje: "Orden no encontrada" });
        } else {
            res.status(200).send(result[0]); // Devuelve la primera (y única) orden encontrada
        }
    });
});
// ====================== RUTAS PARA PRODUCTOS ====================== //

// Obtener Productos
app.get("/productos", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM producto WHERE estatus = 1';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Productos
app.post('/producto/registrar', verificarSesion, (req, res) => {
    const { Nombre, tipo, Categoria, precio, estatus } = req.body;
    const sql = "INSERT INTO producto (Nombre, tipo, Categoria, precio, estatus) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [Nombre, tipo, Categoria, precio, estatus], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Productos
app.put('/producto/modificar/:id', verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const { Nombre, tipo, Categoria, precio, estatus } = req.body;
    const sql = "UPDATE producto SET Nombre = ?, tipo = ?, Categoria = ?, precio = ?, estatus = ? WHERE ID_product = ?";
    db.query(sql, [Nombre, tipo, Categoria, precio, estatus, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Producto no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Producto actualizado correctamente", result });
        }
    });
});

// Eliminar Productos
app.put("/producto/eliminar/:id", verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE producto SET estatus = 0 WHERE ID_product = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Producto no encontrado" });
        } else {
            res.status(200).send({ mensaje: "Producto desactivado correctamente", result });
        }
    });
});
// ====================== RUTAS PARA ZONAS ====================== //

// Obtener Zonas
app.get("/zonas", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM zona where estatus = 1';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Zonas
app.post('/zona/registrar', verificarSesion, (req, res) => {
    const { nombre_colonia, costo_zona } = req.body;
    const sql = "INSERT INTO zona (estatus, nombre_colonia, costo_zona) VALUES (1, ?, ?)";
    db.query(sql, [nombre_colonia, costo_zona], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Zonas
app.put('/zona/modificar/:id', verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const { nombre_colonia, costo_zona } = req.body;
    const sql = "UPDATE zona SET nombre_colonia = ?, costo_zona = ? WHERE ID_zona = ?";
    db.query(sql, [nombre_colonia, costo_zona, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Zona no encontrada" });
        } else {
            res.status(200).send({ mensaje: "Zona actualizada correctamente", result });
        }
    });
});

// Eliminar Zonas
app.put("/zona/eliminar/:id", verificarSesion, verificarRol(['admin']), (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE zona SET estatus = 0 WHERE ID_zona = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ mensaje: "Zona no encontrada" });
        } else {
            res.status(200).send({ mensaje: "Zona desactivada correctamente", result });
        }
    });
});

app.put('/passC/:id', verificarSesion, async (req, res) => {
    const { id } = req.params;
    const { antiguaPassword, nuevaPassword } = req.body;

    try {
        // Buscar la contraseña actual del usuario
        const sqlSelect = "SELECT password FROM empleado WHERE ID_empleados = ?";
        db.query(sqlSelect, [id], async (err, results) => {
            if (err) {
                return res.status(500).send({ mensaje: "Error al buscar la contraseña" });
            }

            if (results.length === 0) {
                return res.status(404).send({ mensaje: "Usuario no encontrado" });
            }

            const passwordHash = results[0].password;

            // Comparar la contraseña antigua con el hash almacenado
            const isMatch =   await bcrypt.compare(antiguaPassword, passwordHash); 
            if (!isMatch) {
                return res.status(401).send({ mensaje: "Contraseña antigua incorrecta" });
            }

            // Encriptar la nueva contraseña
            const saltRounds = 10;
            const newHashedPassword = await bcrypt.hash(nuevaPassword, saltRounds);

            // Actualizar la contraseña en la base de datos
            const sqlUpdate = "UPDATE empleado SET password = ? WHERE ID_empleados = ?";
            db.query(sqlUpdate, [newHashedPassword, id], (err, result) => {
                if (err) {
                    return res.status(500).send({ mensaje: "Error al actualizar la contraseña" });
                }
                res.status(200).send({ mensaje: "Contraseña actualizada correctamente" });
            });
        });
    } catch (error) {
        console.error("Error en la actualización de contraseña:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
    }
});



// procedures
app.get("/topClientes",  verificarSesion, verificarRol(['admin']),  (req, res) => {
    const { fechaInicio, fechaFin } = req.query; // Parámetros de fecha enviados en la URL
    const sql = 'CALL topClientes(?, ?)';
    db.query(sql, [fechaInicio, fechaFin], (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado:', err);
            res.status(500).send({ error: 'Error al obtener el top de clientes' });
        } else {
            res.status(200).json({ data: result[0] });
        }
    });
});

app.get("/topEmpleados",  verificarSesion, verificarRol(['admin']),  (req, res) => {
    const { fechaInicio, fechaFin } = req.query; // Parámetros de fecha enviados en la URL
    const sql = 'CALL topEmpleados(?, ?)';
    db.query(sql, [fechaInicio, fechaFin], (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado:', err);
            res.status(500).send({ error: 'Error al obtener el top de empleados' });
        } else {
            res.status(200).json({ data: result[0] });
        }
    });
});

app.get("/topProductos", verificarSesion, verificarRol(['admin']),  (req, res) => {
    const { fechaInicio, fechaFin } = req.query; // Parámetros de fecha enviados en la URL
    const sql = 'CALL topProductos(?, ?)';
    db.query(sql, [fechaInicio, fechaFin], (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado:', err);
            res.status(500).send({ error: 'Error al obtener los productos más vendidos' });
        } else {
            res.status(200).json({ data: result[0] });
        }
    });
});

app.get("/cantidadOrdenesPorDia",  verificarSesion, verificarRol(['admin']),  (req, res) => {
    const { fechaInicio, fechaFin } = req.query; // Parámetros de fecha enviados en la URL
    const sql = 'CALL cantidadOrdenesPorDia(?, ?)';
    db.query(sql, [fechaInicio, fechaFin], (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado:', err);
            res.status(500).send({ error: 'Error al obtener la cantidad de órdenes por día' });
        } else {
            res.status(200).json({ data: result[0] });
        }
    });
});

app.get("/cantidadOrdenesPorEstatus",  verificarSesion, verificarRol(['admin']),  (req, res) => {
    const { fechaInicio, fechaFin, estatus } = req.query; // Parámetros de fecha y estatus enviados en la URL
    const sql = 'CALL cantidadOrdenesPorEstatus(?, ?, ?)';
    db.query(sql, [fechaInicio, fechaFin, estatus], (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado:', err);
            res.status(500).send({ error: 'Error al obtener la cantidad de órdenes por estatus' });
        } else {
            res.status(200).json({ data: result[0] });
        }
    });
});



app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'integradora', 'resourses', 'error404.html'));
});



// ====================== INICIAR SERVIDOR ====================== //

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
