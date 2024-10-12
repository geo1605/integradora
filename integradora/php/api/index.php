<?php
require 'flight/Flight.php';
require 'flight/core/Database.php';  
require 'flight/core/Cliente.php';  
require 'flight/core/Producto.php';
require 'flight/core/Direccion.php';
require 'flight/core/Zona.php';
require 'flight/core/Empleado.php';
require 'flight/core/Orden.php';
require 'flight/core/Detalle.php';

//CLIENTES//

Flight::route('GET /clientes', function(){
    $database = new Database();
    $db = $database->connect();

    $cliente = new Cliente($db);
    $result = $cliente->read();

    $clientes_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $cliente_item = array(
            'ID_cliente' => $ID_cliente,
            'Nombres' => $Nombres,
            'Apellido_P' => $Apellido_P,
            'Apellido_M' => $Apellido_M,
            'Telefono' => $Telefono,
            'correo' => $correo
        );
        array_push($clientes_arr, $cliente_item);
    }
    if (count($clientes_arr) > 0) {
        Flight::json($clientes_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron clientes.'));
    }

    Flight::json($clientes_arr);
});
Flight::route('POST /clientes', function(){
    $database = new Database();
    $db = $database->connect();

    $cliente = new Cliente($db);
    $data = json_decode(Flight::request()->getBody());

    $cliente->Nombres = $data->Nombres;
    $cliente->Apellido_P = $data->Apellido_P;
    $cliente->Apellido_M = isset($data->Apellido_M) ? $data->Apellido_M : NULL;
    $cliente->Telefono = $data->Telefono;
    $cliente->correo = $data->correo;

    if ($cliente->create()) {
        Flight::json(array('message' => 'Cliente creado.'));
    } else {
        Flight::json(array('message' => 'Cliente no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /clientes/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $cliente = new Cliente($db);
    $data = json_decode(Flight::request()->getBody());

    $cliente->ID_cliente = $id;
    $cliente->Nombres = $data->Nombres;
    $cliente->Apellido_P = $data->Apellido_P;
    $cliente->Apellido_M = isset($data->Apellido_M) ? $data->Apellido_M : NULL;
    $cliente->Telefono = $data->Telefono;
    $cliente->correo = $data->correo;

    if ($cliente->update()) {
        Flight::json(array('message' => 'Cliente actualizado.'));
    } else {
        Flight::json(array('message' => 'Cliente no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /clientes/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $cliente = new Cliente($db);
    $cliente->ID_cliente = $id;

    if ($cliente->delete()) {
        Flight::json(array('message' => 'Cliente eliminado.'));
    } else {
        Flight::json(array('message' => 'Cliente no pudo ser eliminado.'), 500);
    }
});

//PRODUCTOS

Flight::route('GET /productos', function(){
    $database = new Database();
    $db = $database->connect();

    $producto = new Producto($db);
    $result = $producto->read();

    $productos_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $producto_item = array(
            'ID_product' => $ID_product,
            'Nombre' => $Nombre,
            'tipo' => $tipo,
            'Categoria' => $Categoria,
            'precio' => $precio,
            'estatus' => $estatus
        );
        array_push($productos_arr, $producto_item);
    }
    if (count($productos_arr) > 0) {
        Flight::json($productos_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron productos.'));
    }

    Flight::json($productos_arr);
});
Flight::route('POST /productos', function(){
    $database = new Database();
    $db = $database->connect();

    $producto = new Producto($db);
    $data = json_decode(Flight::request()->getBody());

    $producto->Nombre = $data->Nombre;
    $producto->tipo = $data->tipo;
    $producto->Categoria = $data->Categoria;
    $producto->precio = $data->precio;
    $producto->estatus = $data->estatus;

    if ($producto->create()) {
        Flight::json(array('message' => 'Producto creado.'));
    } else {
        Flight::json(array('message' => 'Producto no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /productos/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $producto = new Producto($db);
    $data = json_decode(Flight::request()->getBody());

    $producto->ID_product = $id;
    $producto->Nombre = $data->Nombre;
    $producto->tipo = $data->tipo;
    $producto->Categoria = $data->Categoria;
    $producto->precio = $data->precio;
    $producto->estatus = $data->estatus;

    if ($producto->update()) {
        Flight::json(array('message' => 'Producto actualizado.'));
    } else {
        Flight::json(array('message' => 'Producto no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /productos/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $producto = new Producto($db);
    $producto->ID_product = $id;

    if ($producto->delete()) {
        Flight::json(array('message' => 'Producto eliminado.'));
    } else {
        Flight::json(array('message' => 'Producto no pudo ser eliminado.'), 500);
    }
});

//DIRECCION//

Flight::route('GET /direcciones', function(){
    $database = new Database();
    $db = $database->connect();

    $direccion = new Direccion($db);
    $result = $direccion->read();

    $direccion_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $direccion_item = array(
            'id_direccion' => $id_direccion,
            'calle' => $calle,
            'numero' => $numero,
            'Numero_int' => $Numero_int,
            'colonia' => $colonia,
            'CP' => $CP,
            'estatus' => $estatus,
            'id_zona' => $id_zona,
            'ID_cliente' => $ID_cliente
        );
        array_push($direccion_arr, $direccion_item);
    }
    if (count($direccion_arr) > 0) {
        Flight::json($direccion_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron direcciones.'));
    }

    Flight::json($direccion_arr);
});
Flight::route('POST /direcciones', function(){
    $database = new Database();
    $db = $database->connect();

    $direccion = new Direccion($db);
    $data = json_decode(Flight::request()->getBody());

    $direccion->calle = $data->calle;
    $direccion->numero = $data->numero;
    $direccion->Numero_int = isset($data->Numero_int) ? $data->Numero_int : NULL;
    $direccion->colonia = $data->colonia;
    $direccion->CP = $data->CP;
    $direccion->estatus = $data->estatus;
    $direccion->id_zona = $data->id_zona;
    $direccion->ID_cliente = $data->ID_cliente;

    if ($direccion->create()) {
        Flight::json(array('message' => 'Direccion creado.'));
    } else {
        Flight::json(array('message' => 'Direccion no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /direcciones/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $direccion = new Direccion($db);
    $data = json_decode(Flight::request()->getBody());

    $direccion->id_direccion = $id;
    $direccion->calle = $data->calle;
    $direccion->numero = $data->numero;
    $direccion->Numero_int = isset($data->Numero_int) ? $data->Numero_int : NULL;
    $direccion->colonia = $data->colonia;
    $direccion->CP = $data->CP;
    $direccion->estatus = $data->estatus;
    $direccion->id_zona = $data->id_zona;
    $direccion->ID_cliente = $data->ID_cliente;

    if ($direccion->update()) {
        Flight::json(array('message' => 'Direccion actualizado.'));
    } else {
        Flight::json(array('message' => 'Direccion no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /direcciones/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $direccion = new Direccion($db);
    $direccion->id_direccion = $id;

    if ($direccion->delete()) {
        Flight::json(array('message' => 'Direccion eliminado.'));
    } else {
        Flight::json(array('message' => 'Direccion no pudo ser eliminado.'), 500);
    }
});

//ZONA//

Flight::route('GET /zonas', function(){
    $database = new Database();
    $db = $database->connect();

    $zona = new Zona($db);
    $result = $zona->read();

    $zona_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $zona_item = array(
            'ID_zona' => $ID_zona,
            'nombre_colonia' => $nombre_colonia,
            'costo_zona' => $costo_zona
        );
        array_push($zona_arr, $zona_item);
    }
    if (count($zona_arr) > 0) {
        Flight::json($zona_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron zonas.'));
    }

    Flight::json($zona_arr);
});
Flight::route('POST /zonas', function(){
    $database = new Database();
    $db = $database->connect();

    $zona = new Zona($db);
    $data = json_decode(Flight::request()->getBody());

    $zona->nombre_colonia = $data->nombre_colonia;
    $zona->costo_zona = $data->costo_zona;

    if ($zona->create()) {
        Flight::json(array('message' => 'Zona creado.'));
    } else {
        Flight::json(array('message' => 'Zona no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /zonas/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $zona = new Zona($db);
    $data = json_decode(Flight::request()->getBody());

    $zona->ID_zona = $id;
    $zona->nombre_colonia = $data->nombre_colonia;
    $zona->costo_zona = $data->costo_zona;

    if ($zona->update()) {
        Flight::json(array('message' => 'Zona actualizado.'));
    } else {
        Flight::json(array('message' => 'Zona no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /zonas/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $zona = new Zona($db);
    $zona->ID_zona = $id;

    if ($zona->delete()) {
        Flight::json(array('message' => 'Zona eliminado.'));
    } else {
        Flight::json(array('message' => 'Zona no pudo ser eliminado.'), 500);
    }
});

//EMPLEADOS//

Flight::route('GET /empleados', function(){
    $database = new Database();
    $db = $database->connect();

    $empleado = new Empleado($db);
    $result = $empleado->read();

    $empleados_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $empleado_item = array(
            'ID_Empleados' => $ID_Empleados,
            'Nombres' => $Nombres,
            'Apellido_P' => $Apellido_P,
            'Apellido_M' => $Apellido_M,
            'Cargo' => $Cargo,
            'correo' => $correo,
            'Telefono' => $Telefono,
            'password' => $password,
            'estatus' => $estatus

        );
        array_push($empleados_arr, $empleado_item);
    }
    if (count($empleados_arr) > 0) {
        Flight::json($empleados_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron empleados.'));
    }

    Flight::json($empleados_arr);
});
Flight::route('POST /empleados', function(){
    $database = new Database();
    $db = $database->connect();

    $empleado = new Empleado($db);
    $data = json_decode(Flight::request()->getBody());

    $empleado->Nombres = $data->Nombres;
    $empleado->Apellido_P = $data->Apellido_P;
    $empleado->Apellido_M = isset($data->Apellido_M) ? $data->Apellido_M : NULL;
    $empleado->Cargo = $data->Cargo;
    $empleado->correo = $data->correo;
    $empleado->password = $data->password;
    $empleado->estatus = $data->estatus;

    if ($empleado->create()) {
        Flight::json(array('message' => 'Empleado creado.'));
    } else {
        Flight::json(array('message' => 'Empleado no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /empleados/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $empleado = new Empleado($db);
    $data = json_decode(Flight::request()->getBody());

    $empleado->ID_Empleados = $id;
    $empleado->Nombres = $data->Nombres;
    $empleado->Apellido_P = $data->Apellido_P;
    $empleado->Apellido_M = isset($data->Apellido_M) ? $data->Apellido_M : NULL;
    $empleado->Cargo = $data->Cargo;
    $empleado->correo = $data->correo;
    $empleado->password = $data->password;
    $empleado->estatus = $data->estatus;

    if ($empleado->update()) {
        Flight::json(array('message' => 'Empleado actualizado.'));
    } else {
        Flight::json(array('message' => 'Empleado no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /empleados/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $empleado = new Empleado($db);
    $empleado->ID_Empleados = $id;

    if ($empleado->delete()) {
        Flight::json(array('message' => 'Empleado eliminado.'));
    } else {
        Flight::json(array('message' => 'Empleado no pudo ser eliminado.'), 500);
    }
});

//ORDENES//

Flight::route('GET /ordenes', function() {
    $database = new Database();
    $db = $database->connect();

    $orden = new Orden($db);
    $result = $orden->read();

    $ordenes_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $orden_item = array(
            'ID_orden' => $ID_orden,
            'Fecha' => $Fecha,
            'Hora' => $Hora,
            'Estatus' => $Estatus,
            'Precio_total' => $Precio_total,
            'ID_cliente' => $ID_cliente,
            'ID_detalle' => $ID_detalle,
            'ID_Empleados' => $ID_Empleados,
            'tipo_pago' => $tipo_pago
        );
        array_push($ordenes_arr, $orden_item);
    }
    if (count($ordenes_arr) > 0) {
        Flight::json($ordenes_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron ordenes.'));
    }
});
Flight::route('POST /ordenes', function(){
    $database = new Database();
    $db = $database->connect();

    $orden = new Orden($db);
    $data = json_decode(Flight::request()->getBody());

    $orden->Fecha = $data->Fecha;
    $orden->Hora = $data->Hora;
    $orden->Estatus = $data->Estatus;
    $orden->Precio_total = $data->Precio_total;
    $orden->ID_cliente = $data->ID_cliente;
    $orden->ID_detalle = $data->ID_detalle;
    $orden->ID_Empleados = $data->ID_Empleados;
    $orden->tipo_pago = $data->tipo_pago;

    if ($orden->create()) {
        Flight::json(array('message' => 'Orden creado.'));
    } else {
        Flight::json(array('message' => 'Orden no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /ordenes/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $orden = new Orden($db);
    $data = json_decode(Flight::request()->getBody());

    $orden->ID_orden = $id;
    $orden->Fecha = $data->Fecha;
    $orden->Hora = $data->Hora;
    $orden->Estatus = $data->Estatus;
    $orden->Precio_total = $data->Precio_total;
    $orden->ID_cliente = $data->ID_cliente;
    $orden->ID_detalle = $data->ID_detalle;
    $orden->ID_Empleados = $data->ID_Empleados;
    $orden->tipo_pago = $data->tipo_pago;

    if ($orden->update()) {
        Flight::json(array('message' => 'Orden actualizado.'));
    } else {
        Flight::json(array('message' => 'Orden no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /ordenes/@id', function($id){
    $database = new Database();
    $db = $database->connect();

    $orden = new Orden($db);
    $orden->ID_orden = $id;

    if ($orden->delete()) {
        Flight::json(array('message' => 'Orden eliminado.'));
    } else {
        Flight::json(array('message' => 'Orden no pudo ser eliminado.'), 500);
    }
});

//DETALLES//

Flight::route('GET /detalles', function() {
    $database = new Database();
    $db = $database->connect();

    $detalle = new Detalle($db);
    $result = $detalle->read();

    $detalle_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $detalle_item = array(
            'ID_detalle' => $ID_detalle,
            'ID_product' => $ID_product,
            'cantidad_p' => $cantidad_p,
            'Importe' => $Importe
        );
        array_push($detalle_arr, $detalle_item);
    }
    if (count($detalle_arr) > 0) {
        Flight::json($detalle_arr);
    } else {
        Flight::json(array('message' => 'No se encontraron detalles.'));
    }

    Flight::json($detalle_arr);
});
Flight::route('POST /detalles', function() {
    $database = new Database();
    $db = $database->connect();

    $detalle = new Detalle($db);
    $data = json_decode(Flight::request()->getBody());

    $detalle->ID_product = $data->ID_product;
    $detalle->cantidad_p = $data->cantidad_p;
    $detalle->Importe = $data->Importe;

    if ($detalle->create()) {
        Flight::json(array('message' => 'Detalle creado.'));
    } else {
        Flight::json(array('message' => 'Detalle no pudo ser creado.'), 500);
    }
});
Flight::route('PUT /detalles/@id', function($id) {
    $database = new Database();
    $db = $database->connect();

    $detalle = new Detalle($db);
    $data = json_decode(Flight::request()->getBody());

    $detalle->ID_detalle = $id;
    $detalle->ID_product = $data->ID_product;
    $detalle->cantidad_p = $data->cantidad_p;
    $detalle->Importe = $data->Importe;

    if ($detalle->update()) {
        Flight::json(array('message' => 'Detalle actualizado.'));
    } else {
        Flight::json(array('message' => 'Detalle no pudo ser actualizado.'), 500);
    }
});
Flight::route('DELETE /detalles/@id', function($id) {
    $database = new Database();
    $db = $database->connect();

    $detalle = new Detalle($db);
    $detalle->ID_detalle = $id;

    if ($detalle->delete()) {
        Flight::json(array('message' => 'Detalle eliminado.'));
    } else {
        Flight::json(array('message' => 'Detalle no pudo ser eliminado.'), 500);
    }
});

Flight::start();
?>