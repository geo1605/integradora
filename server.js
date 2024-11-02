const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Importa el módulo path para manejar rutas de archivos
const app = express();

const port = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'la_tosca';
const DB_PORT = process.env.DB_PORT || 3306;

app.use(bodyParser.json());
app.use(cors());

// Configura Express para servir archivos estáticos desde las carpetas principales
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
});

// Ruta raíz para redirigir a index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Envía el archivo index.html en la ruta raíz
});

// ====================== RUTAS PARA CLIENTES ====================== //

// Obtener Clientes
app.get("/clientes", (req, res) => {
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
app.post('/cliente/registrar', (req, res) => {
    const { Nombres, Apellido_P, Apellido_M, Telefono, correo } = req.body;
    const sql = "INSERT INTO cliente (Nombres, Apellido_P, Apellido_M, Telefono, correo) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Telefono, correo], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Clientes
app.put('/cliente/modificar/:id', (req, res) => {
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

// Eliminar Clientes
app.delete("/cliente/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM cliente WHERE ID_cliente = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// ====================== Otras RUTAS (detalles, direcciones, empleados, etc.) ====================== //
// Repite el mismo patrón de arriba para todas las otras rutas de tus recursos (detalle_o, direccion, empleado, etc.)

// ====================== RUTAS PARA PRODUCTOS ====================== //

// Obtener Productos
app.get("/productos", (req, res) => {
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
app.post('/producto/registrar', (req, res) => {
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
app.put('/producto/modificar/:id', (req, res) => {
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

// Eliminar Productos
app.delete("/producto/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM producto WHERE ID_product = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// ====================== Ruta para Zonas, Ordenes, y otras entidades (agrega según sea necesario) ====================== //

// Ruta no existente
app.all("*", (req, res) => {
    const respuesta = {
        "codigo": 500,
        "mensaje": "La ruta no existe"
    };
    res.send(respuesta);
});

// Iniciar Servidor
app.listen(port, () => {
    console.log("Escuchando en el puerto", port);
});
