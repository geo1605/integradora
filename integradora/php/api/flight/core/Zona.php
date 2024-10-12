<?php
class Zona {
    private $conn;
    private $table = 'zona';

    public $ID_zona;
    public $nombre_colonia;
    public $costo_zona;

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
        $query = 'INSERT INTO ' . $this->table . ' SET nombre_colonia = :nombre_colonia, costo_zona = :costo_zona';
        $stmt = $this->conn->prepare($query);

        $this->nombre_colonia = htmlspecialchars(strip_tags($this->nombre_colonia));
        $this->costo_zona = htmlspecialchars(strip_tags($this->costo_zona));

        $stmt->bindParam(':nombre_colonia', $this->nombre_colonia);
        $stmt->bindParam(':costo_zona', $this->costo_zona);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET nombre_colonia = :nombre_colonia, costo_zona = :costo_zona WHERE ID_zona = :ID_zona';
        $stmt = $this->conn->prepare($query);

        $this->nombre_colonia = htmlspecialchars(strip_tags($this->nombre_colonia));
        $this->costo_zona = htmlspecialchars(strip_tags($this->costo_zona));
        $this->ID_zona = htmlspecialchars(strip_tags($this->ID_zona));

        $stmt->bindParam(':nombre_colonia', $this->nombre_colonia);
        $stmt->bindParam(':costo_zona', $this->costo_zona);
        $stmt->bindParam(':ID_zona', $this->ID_zona);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE ID_zona = :ID_zona';
        $stmt = $this->conn->prepare($query);

        $this->ID_zona = htmlspecialchars(strip_tags($this->ID_zona));

        $stmt->bindParam(':ID_zona', $this->ID_zona);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>