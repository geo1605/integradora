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

// ====================== RUTAS DE AUTENTICACIÓN ====================== //

app.post('/login', (req, res) => {
    const { correo, password } = req.body;
    const sql = "SELECT * FROM empleado WHERE correo = ? AND password = ?";
    
    db.query(sql, [correo, password], (err, results) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el servidor" });
        } else if (results.length > 0) {
            req.session.user = results[0];
            res.status(200).send({ mensaje: "Inicio de sesión exitoso", usuario: results[0] });
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
    /* { ruta: '/productos', sql: 'SELECT * FROM producto' }, */
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


// Rutas para modificar o eliminar datos (solo admin)
const rutasProtegidas = [
    { metodo: 'put', ruta: '/cliente/modificar/:id' },
    /* { metodo: 'put', ruta: '/orden/modificar/:id' }, */
    { metodo: 'put', ruta: '/empleado/modificar/:id' },
    { metodo: 'put', ruta: '/producto/modificar/:id' },
    /* { metodo: 'put', ruta: '/detalle/modificar/:id' }, */
    { metodo: 'put', ruta: '/zona/modificar/:id' },
    { metodo: 'put', ruta: '/direccion/modificar/:id' },

    { metodo: 'put', ruta: '/empleado/eliminar/:id' },
    { metodo: 'put', ruta: '/producto/eliminar/:id' },
    { metodo: 'put', ruta: '/zona/eliminar/:id' },
    { metodo: 'put', ruta: '/direccion/eliminar/:id' },
    { metodo: 'put', ruta: '/cliente/eliminar/:id' },
];

rutasProtegidas.forEach(({ metodo, ruta }) => {
    app[metodo](ruta, verificarSesion, verificarRol(['admin']), (req, res) => {
        res.status(200).send({ mensaje: "Operación realizada con éxito" });
    });
});

/* extracción de rol  */
app.get('/api/rol', (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).send({ rol: req.session.user.Cargo }); // `Cargo` contiene el rol
    } else {
        res.status(401).send({ mensaje: "No autenticado" });
    }
});

/* seguridad paginas estaticas */
// Middleware para verificar si el usuario es admin
function verificarAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.Cargo === 'admin') {
        next(); // Permite el acceso si es admin
    } else {
        res.status(403).send('Acceso denegado'); // Prohíbe el acceso
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
    const sql = 'SELECT * FROM cliente';
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

// Modificar Clientes
app.put('/cliente/modificar/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { Nombres, Apellido_P, Apellido_M, Telefono, correo } = req.body;
    const sql = "UPDATE cliente SET Nombres = ?, Apellido_P = ?, Apellido_M = ?, Telefono = ?, correo = ? WHERE ID_cliente = ?";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Telefono, correo, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Actualizar estado de Clientes
app.put("/cliente/eliminar/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE cliente SET estatus = 0 WHERE ID_cliente = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
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

// Modificar Detalles de Orden
app.put('/detalle/modificar/:id',  verificarSesion, (req, res) => {
    const { id } = req.params;
    const { ID_product, cantidad_p} = req.body;
    const sql = "UPDATE detalle_o SET ID_product = ?, cantidad_p = ? WHERE ID_detalle = ?";
    db.query(sql, [ID_product, cantidad_p, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Actualizar estado de Detalles de Orden
app.put("/detalle/eliminar/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE detalle_o SET estatus = 0 WHERE ID_detalle = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
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
    const sql = 'SELECT * FROM direccion';
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
app.put('/direccion/modificar/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente } = req.body;
    const sql = "UPDATE direccion SET calle = ?, numero = ?, Numero_int = ?, colonia = ?, CP = ?, estatus = ?, id_zona = ?, ID_cliente = ? WHERE id_direccion = ?";
    db.query(sql, [calle, numero, Numero_int, colonia, CP, estatus, id_zona, ID_cliente, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Actualizar estado de Direcciones
app.put("/direccion/eliminar/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE direccion SET estatus = 0 WHERE id_direccion = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ mensaje: "Dirección desactivada correctamente", result });
        }
    });
});

// ====================== RUTAS PARA EMPLEADOS ====================== //

// Obtener Empleados
app.get("/empleados", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM empleado';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Registrar Empleado
app.post('/empleado/registrar', verificarSesion, (req, res) => {
    const { Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, estatus } = req.body;
    const sql = "INSERT INTO empleado (Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, estatus) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, estatus], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Empleados
app.put('/empleado/modificar/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus } = req.body;
    const sql = "UPDATE empleado SET Nombres = ?, Apellido_P = ?, Apellido_M = ?, Cargo = ?, correo = ?, Telefono = ?, password = ?, estatus = ? WHERE ID_Empleados = ?";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Actualizar estado de Empleados
app.put("/empleado/eliminar/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE empleado SET estatus = 0 WHERE ID_Empleados = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
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
app.put('/orden/modificar/:id', verificarSesion, (req, res) => {
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
    const sql = 'SELECT * FROM producto';
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
app.put('/producto/modificar/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { Nombre, tipo, Categoria, precio, estatus } = req.body;
    const sql = "UPDATE producto SET Nombre = ?, tipo = ?, Categoria = ?, precio = ?, estatus = ? WHERE ID_product = ?";
    db.query(sql, [Nombre, tipo, Categoria, precio, estatus, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Actualizar estado de Productos
app.put("/producto/eliminar/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE producto SET estatus = 0 WHERE ID_product = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ mensaje: "Producto desactivado correctamente", result });
        }
    });
});

// ====================== RUTAS PARA ZONAS ====================== //

// Obtener Zonas
app.get("/zonas", verificarSesion, (req, res) => {
    const sql = 'SELECT * FROM zona';
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
    const sql = "INSERT INTO zona (nombre_colonia, costo_zona) VALUES (?, ?)";
    db.query(sql, [nombre_colonia, costo_zona], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Zonas
app.put('/zona/modificar/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { nombre_colonia, costo_zona } = req.body;
    const sql = "UPDATE zona SET nombre_colonia = ?, costo_zona = ? WHERE ID_zona = ?";
    db.query(sql, [nombre_colonia, costo_zona, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});





// Actualizar estado de Zonas
app.put("/zona/eliminar/:id", verificarSesion, (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE zona SET estatus = 0 WHERE ID_zona = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ mensaje: "Zona desactivada correctamente", result });
        }
    });
});

app.put('/passC/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const {password} = req.body;
    const sql = "UPDATE empleado SET empleado.password = ? where ID_empleados = ?"
    db.query(sql, [password, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});


// procedures

app.get("/topClientes", verificarSesion, verificarRol(['admin']), (req, res) => {
    const sql = 'CALL ObtenerTopClientes()';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result[0]);
        }
    });
});

app.get("/topEmpleados", verificarSesion, verificarRol(['admin']), (req, res) => {
    const sql = 'CALL ObtenerTopEmpleados()';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result[0]);
        }
    });
});

app.get("/topProductos", verificarSesion, verificarRol(['admin']), (req, res) => {
    const sql = 'CALL ObtenerTopProductos()';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado:', err);
            res.status(500).send({ error: 'Error al obtener los productos más vendidos' });
        } else {
            res.status(200).send(result[0]);
        }
    });
});



// Ruta no existente
app.all("*", (req, res) => {
    const respuesta = {
        "codigo": 500,
        "mensaje": "La ruta no existe"
    };
    res.send(respuesta);
});

// ====================== INICIAR SERVIDOR ====================== //

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
