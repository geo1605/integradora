<?php
class Orden {
    private $conn;
    private $table = 'orden';

    public $ID_orden;
    public $Fecha;
    public $Hora;
    public $Estatus;
    public $Precio_total;
    public $ID_cliente;
    public $ID_detalle;
    public $ID_Empleados;
    public $tipo_pago;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = 'SELECT * FROM ' . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' SET Fecha = :Fecha, Hora = :Hora, Estatus = :Estatus, Precio_total = :Precio_total, ID_cliente = :ID_cliente, ID_detalle = :ID_detalle, ID_Empleados = :ID_Empleados, tipo_pago = :tipo_pago';
        $stmt = $this->conn->prepare($query);

        $this->Fecha = htmlspecialchars(strip_tags($this->Fecha));
        $this->Hora = htmlspecialchars(strip_tags($this->Hora));
        $this->Estatus = htmlspecialchars(strip_tags($this->Estatus));
        $this->Precio_total = htmlspecialchars(strip_tags($this->Precio_total));
        $this->ID_cliente = htmlspecialchars(strip_tags($this->ID_cliente));
        $this->ID_detalle = htmlspecialchars(strip_tags($this->ID_detalle));
        $this->ID_Empleados = htmlspecialchars(strip_tags($this->ID_Empleados));
        $this->tipo_pago = htmlspecialchars(strip_tags($this->tipo_pago));

        $stmt->bindParam(':Fecha', $this->Fecha);
        $stmt->bindParam(':Hora', $this->Hora);
        $stmt->bindParam(':Estatus', $this->Estatus);
        $stmt->bindParam(':Precio_total', $this->Precio_total);
        $stmt->bindParam(':ID_cliente', $this->ID_cliente);
        $stmt->bindParam(':ID_detalle', $this->ID_detalle);
        $stmt->bindParam(':ID_Empleados', $this->ID_Empleados);
        $stmt->bindParam(':tipo_pago', $this->tipo_pago);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET Fecha = :Fecha, Hora = :Hora, Estatus = :Estatus, Precio_total = :Precio_total, 
                ID_cliente = :ID_cliente, ID_detalle = :ID_detalle, ID_Empleados = :ID_Empleados, tipo_pago = :tipo_pago
                WHERE ID_orden = :ID_orden';
        $stmt = $this->conn->prepare($query);

        $this->Fecha = htmlspecialchars(strip_tags($this->Fecha));
        $this->Hora = htmlspecialchars(strip_tags($this->Hora));
        $this->Estatus = htmlspecialchars(strip_tags($this->Estatus));
        $this->Precio_total = htmlspecialchars(strip_tags($this->Precio_total));
        $this->ID_cliente = htmlspecialchars(strip_tags($this->ID_cliente));
        $this->ID_detalle = htmlspecialchars(strip_tags($this->ID_detalle));
        $this->ID_Empleados = htmlspecialchars(strip_tags($this->ID_Empleados));
        $this->tipo_pago = htmlspecialchars(strip_tags($this->tipo_pago));
        $this->ID_orden = htmlspecialchars(strip_tags($this->ID_orden));

        $stmt->bindParam(':Fecha', $this->Fecha);
        $stmt->bindParam(':Hora', $this->Hora);
        $stmt->bindParam(':Estatus', $this->Estatus);
        $stmt->bindParam(':Precio_total', $this->Precio_total);
        $stmt->bindParam(':ID_cliente', $this->ID_cliente);
        $stmt->bindParam(':ID_detalle', $this->ID_detalle);
        $stmt->bindParam(':ID_Empleados', $this->ID_Empleados);
        $stmt->bindParam(':tipo_pago', $this->tipo_pago);
        $stmt->bindParam(':ID_orden', $this->ID_orden);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE ID_orden = :ID_orden';
        $stmt = $this->conn->prepare($query);

        $this->ID_orden = htmlspecialchars(strip_tags($this->ID_orden));

        $stmt->bindParam(':ID_orden', $this->ID_orden);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>