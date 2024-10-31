const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'la_tosca';
const DB_PORT = process.env.DB_PORT || 3306;
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
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

// ====================== RUTAS PARA DETALLES DE ORDENES ====================== //

// Obtener Detalles de Orden
app.get("/detalles", (req, res) => {
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
app.post('/detalle/registrar', (req, res) => {
    const { ID_product, cantidad_p, Importe } = req.body;
    const sql = "INSERT INTO detalle_o (ID_product, cantidad_p, Importe) VALUES (?, ?, ?)";
    db.query(sql, [ID_product, cantidad_p, Importe], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Detalles de Orden
app.put('/detalle/modificar/:id', (req, res) => {
    const { id } = req.params;
    const { ID_product, cantidad_p, Importe } = req.body;
    const sql = "UPDATE detalle_o SET ID_product = ?, cantidad_p = ?, Importe = ? WHERE ID_detalle = ?";
    db.query(sql, [ID_product, cantidad_p, Importe, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Eliminar Detalles de Orden
app.delete("/detalle/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM detalle_o WHERE ID_detalle = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// ====================== RUTAS PARA DIRECCIONES ====================== //

// Obtener Direcciones
app.get("/direcciones", (req, res) => {
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
app.post('/direccion/registrar', (req, res) => {
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
app.put('/direccion/modificar/:id', (req, res) => {
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

// Eliminar Direcciones
app.delete("/direccion/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM direccion WHERE id_direccion = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// ====================== RUTAS PARA EMPLEADOS ====================== //

// Obtener Empleados
app.get("/empleados", (req, res) => {
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
app.post('/empleado/registrar', (req, res) => {
    const { Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus } = req.body;
    const sql = "INSERT INTO empleado (Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Nombres, Apellido_P, Apellido_M, Cargo, correo, Telefono, password, estatus], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Empleados
app.put('/empleado/modificar/:id', (req, res) => {
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

// Eliminar Empleados
app.delete("/empleado/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM empleado WHERE ID_Empleados = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// ====================== RUTAS PARA ORDENES ====================== //

// Obtener Ordenes
app.get("/ordenes", (req, res) => {
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
app.post('/orden/registrar', (req, res) => {
    const { Fecha, Hora, Estatus, Precio_total, ID_cliente, ID_detalle, ID_Empleados, tipo_pago } = req.body;
    const sql = "INSERT INTO orden (Fecha, Hora, Estatus, Precio_total, ID_cliente, ID_detalle, ID_Empleados, tipo_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [Fecha, Hora, Estatus, Precio_total, ID_cliente, ID_detalle, ID_Empleados, tipo_pago], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Modificar Ordenes
app.put('/orden/modificar/:id', (req, res) => {
    const { id } = req.params;
    const { Fecha, Hora, Estatus, Precio_total, ID_cliente, ID_detalle, ID_Empleados, tipo_pago } = req.body;
    const sql = "UPDATE orden SET Fecha = ?, Hora = ?, Estatus = ?, Precio_total = ?, ID_cliente = ?, ID_detalle = ?, ID_Empleados = ?, tipo_pago = ? WHERE ID_orden = ?";
    db.query(sql, [Fecha, Hora, Estatus, Precio_total, ID_cliente, ID_detalle, ID_Empleados, tipo_pago, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

// Eliminar Ordenes
app.delete("/orden/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM orden WHERE ID_orden = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

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

// ====================== RUTAS PARA ZONAS ====================== //

// Obtener Zonas
app.get("/zonas", (req, res) => {
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
app.post('/zona/registrar', (req, res) => {
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
app.put('/zona/modificar/:id', (req, res) => {
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

// Eliminar Zonas
app.delete("/zona/eliminar/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM zona WHERE ID_zona = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
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

// Iniciar Servidor
app.listen(port, () => {
    console.log("Escuchando en el puerto", port);
});
