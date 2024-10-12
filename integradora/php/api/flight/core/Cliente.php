<?php
class Cliente {
    private $conn;
    private $table = 'cliente';

    public $ID_cliente;
    public $Nombres;
    public $Apellido_P;
    public $Apellido_M;
    public $Telefono;
    public $correo;

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
        $query = 'INSERT INTO ' . $this->table . ' SET Nombres = :Nombres, Apellido_P = :Apellido_P, Apellido_M = :Apellido_M, Telefono = :Telefono, correo = :correo';
        $stmt = $this->conn->prepare($query);

        $this->Nombres = htmlspecialchars(strip_tags($this->Nombres));
        $this->Apellido_P = htmlspecialchars(strip_tags($this->Apellido_P));
        $this->Apellido_M = htmlspecialchars(strip_tags($this->Apellido_M));
        $this->Telefono = htmlspecialchars(strip_tags($this->Telefono));
        $this->correo = htmlspecialchars(strip_tags($this->correo));

        $stmt->bindParam(':Nombres', $this->Nombres);
        $stmt->bindParam(':Apellido_P', $this->Apellido_P);
        $stmt->bindParam(':Apellido_M', $this->Apellido_M);
        $stmt->bindParam(':Telefono', $this->Telefono);
        $stmt->bindParam(':correo', $this->correo);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET Nombres = :Nombres, Apellido_P = :Apellido_P, Apellido_M = :Apellido_M, Telefono = :Telefono, correo = :correo WHERE ID_cliente = :ID_cliente';
        $stmt = $this->conn->prepare($query);

        $this->Nombres = htmlspecialchars(strip_tags($this->Nombres));
        $this->Apellido_P = htmlspecialchars(strip_tags($this->Apellido_P));
        $this->Apellido_M = htmlspecialchars(strip_tags($this->Apellido_M));
        $this->Telefono = htmlspecialchars(strip_tags($this->Telefono));
        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->ID_cliente = htmlspecialchars(strip_tags($this->ID_cliente));

        $stmt->bindParam(':Nombres', $this->Nombres);
        $stmt->bindParam(':Apellido_P', $this->Apellido_P);
        $stmt->bindParam(':Apellido_M', $this->Apellido_M);
        $stmt->bindParam(':Telefono', $this->Telefono);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->bindParam(':ID_cliente', $this->ID_cliente);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE ID_cliente = :ID_cliente';
        $stmt = $this->conn->prepare($query);

        $this->ID_cliente = htmlspecialchars(strip_tags($this->ID_cliente));

        $stmt->bindParam(':ID_cliente', $this->ID_cliente);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>