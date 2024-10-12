<?php
class Detalle {
    private $conn;
    private $table = 'detalle_o';

    public $ID_detalle;
    public $ID_product;
    public $cantidad_p;
    public $Importe;

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
        $query = 'INSERT INTO ' . $this->table . ' SET ID_product = :ID_product, cantidad_p = :cantidad_p, Importe = :Importe';
        $stmt = $this->conn->prepare($query);

        $this->ID_product = htmlspecialchars(strip_tags($this->ID_product));
        $this->cantidad_p = htmlspecialchars(strip_tags($this->cantidad_p));
        $this->Importe = htmlspecialchars(strip_tags($this->Importe));

        $stmt->bindParam(':ID_product', $this->ID_product);
        $stmt->bindParam(':cantidad_p', $this->cantidad_p);
        $stmt->bindParam(':Importe', $this->Importe);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET ID_product = :ID_product, cantidad_p = :cantidad_p, Importe = :Importe WHERE ID_detalle = :ID_detalle';
        $stmt = $this->conn->prepare($query);

        $this->ID_product = htmlspecialchars(strip_tags($this->ID_product));
        $this->cantidad_p = htmlspecialchars(strip_tags($this->cantidad_p));
        $this->Importe = htmlspecialchars(strip_tags($this->Importe));
        $this->ID_detalle = htmlspecialchars(strip_tags($this->ID_detalle));

        $stmt->bindParam(':ID_product', $this->ID_product);
        $stmt->bindParam(':cantidad_p', $this->cantidad_p);
        $stmt->bindParam(':Importe', $this->Importe);
        $stmt->bindParam(':ID_detalle', $this->ID_detalle);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE ID_detalle = :ID_detalle';
        $stmt = $this->conn->prepare($query);

        $this->ID_detalle = htmlspecialchars(strip_tags($this->ID_detalle));

        $stmt->bindParam(':ID_detalle', $this->ID_detalle);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>