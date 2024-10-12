<?php
class Direccion {
    private $conn;
    private $table = 'direccion';

    public $id_direccion;
    public $calle;
    public $numero;
    public $Numero_int;
    public $colonia;
    public $CP;
    public $estatus;
    public $id_zona;
    public $ID_cliente;

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
        $query = 'INSERT INTO ' . $this->table . ' SET calle = :calle, numero = :numero, Numero_int = :Numero_int, colonia = :colonia, 
                      CP = :CP, estatus = :estatus, id_zona = :id_zona, ID_cliente = :ID_cliente';
        $stmt = $this->conn->prepare($query);

        $this->calle = htmlspecialchars(strip_tags($this->calle));
        $this->numero = htmlspecialchars(strip_tags($this->numero));
        $this->Numero_int = htmlspecialchars(strip_tags($this->Numero_int));
        $this->colonia = htmlspecialchars(strip_tags($this->colonia));
        $this->CP = htmlspecialchars(strip_tags($this->CP));
        $this->estatus = htmlspecialchars(strip_tags($this->estatus));
        $this->id_zona = htmlspecialchars(strip_tags($this->id_zona));
        $this->ID_cliente = htmlspecialchars(strip_tags($this->ID_cliente));

        $stmt->bindParam(':calle', $this->calle);
        $stmt->bindParam(':numero', $this->numero);
        $stmt->bindParam(':Numero_int', $this->Numero_int);
        $stmt->bindParam(':colonia', $this->colonia);
        $stmt->bindParam(':CP', $this->CP);
        $stmt->bindParam(':estatus', $this->estatus);
        $stmt->bindParam(':id_zona', $this->id_zona);
        $stmt->bindParam(':ID_cliente', $this->ID_cliente);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET calle = :calle, numero = :numero, Numero_int = :Numero_int, colonia = :colonia, 
                      CP = :CP, estatus = :estatus, id_zona = :id_zona, ID_cliente = :ID_cliente 
                  WHERE id_direccion = :id_direccion';
        $stmt = $this->conn->prepare($query);

        $this->calle = htmlspecialchars(strip_tags($this->calle));
        $this->numero = htmlspecialchars(strip_tags($this->numero));
        $this->Numero_int = htmlspecialchars(strip_tags($this->Numero_int));
        $this->colonia = htmlspecialchars(strip_tags($this->colonia));
        $this->CP = htmlspecialchars(strip_tags($this->CP));
        $this->estatus = htmlspecialchars(strip_tags($this->estatus));
        $this->id_zona = htmlspecialchars(strip_tags($this->id_zona));
        $this->ID_cliente = htmlspecialchars(strip_tags($this->ID_cliente));
        $this->id_direccion = htmlspecialchars(strip_tags($this->id_direccion));

        $stmt->bindParam(':calle', $this->calle);
        $stmt->bindParam(':numero', $this->numero);
        $stmt->bindParam(':Numero_int', $this->Numero_int);
        $stmt->bindParam(':colonia', $this->colonia);
        $stmt->bindParam(':CP', $this->CP);
        $stmt->bindParam(':estatus', $this->estatus);
        $stmt->bindParam(':id_zona', $this->id_zona);
        $stmt->bindParam(':ID_cliente', $this->ID_cliente);
        $stmt->bindParam(':id_direccion', $this->id_direccion);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE id_direccion = :id_direccion';
        $stmt = $this->conn->prepare($query);

        $this->id_direccion = htmlspecialchars(strip_tags($this->id_direccion));

        $stmt->bindParam(':id_direccion', $this->id_direccion);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>