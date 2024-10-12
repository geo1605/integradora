<?php
class Empleado {
    private $conn;
    private $table = 'empleado';

    public $ID_Empleados;
    public $Nombres;
    public $Apellido_P;
    public $Apellido_M;
    public $Cargo;
    public $correo;
    public $Telefono;
    public $password;
    public $estatus;

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
        $query = 'INSERT INTO ' . $this->table . ' SET Nombres = :Nombres, Apellido_P = :Apellido_P, Apellido_M = :Apellido_M, Cargo = :Cargo, correo = :correo, Telefono = :Telefono, password = :password, estatus = :estatus';
        $stmt = $this->conn->prepare($query);

        $this->Nombres = htmlspecialchars(strip_tags($this->Nombres));
        $this->Apellido_P = htmlspecialchars(strip_tags($this->Apellido_P));
        $this->Apellido_M = htmlspecialchars(strip_tags($this->Apellido_M));
        $this->Cargo = htmlspecialchars(strip_tags($this->Cargo));
        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->Telefono = htmlspecialchars(strip_tags($this->Telefono));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->estatus = htmlspecialchars(strip_tags($this->estatus));

        $stmt->bindParam(':Nombres', $this->Nombres);
        $stmt->bindParam(':Apellido_P', $this->Apellido_P);
        $stmt->bindParam(':Apellido_M', $this->Apellido_M);
        $stmt->bindParam(':Cargo', $this->Cargo);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->bindParam(':Telefono', $this->Telefono);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':estatus', $this->estatus);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET Nombres = :Nombres, Apellido_P = :Apellido_P, Apellido_M = :Apellido_M, Cargo = :Cargo, correo = :correo, Telefono = :Telefono, password = :password, estatus = :estatus WHERE ID_Empleados = :ID_Empleados';
        $stmt = $this->conn->prepare($query);

        $this->Nombres = htmlspecialchars(strip_tags($this->Nombres));
        $this->Apellido_P = htmlspecialchars(strip_tags($this->Apellido_P));
        $this->Apellido_M = htmlspecialchars(strip_tags($this->Apellido_M));
        $this->Cargo = htmlspecialchars(strip_tags($this->Cargo));
        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->Telefono = htmlspecialchars(strip_tags($this->Telefono));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->estatus = htmlspecialchars(strip_tags($this->estatus));
        $this->ID_Empleados = htmlspecialchars(strip_tags($this->ID_Empleados));

        $stmt->bindParam(':Nombres', $this->Nombres);
        $stmt->bindParam(':Apellido_P', $this->Apellido_P);
        $stmt->bindParam(':Apellido_M', $this->Apellido_M);
        $stmt->bindParam(':Cargo', $this->Cargo);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->bindParam(':Telefono', $this->Telefono);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':estatus', $this->estatus);
        $stmt->bindParam(':ID_Empleados', $this->ID_Empleados);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE ID_Empleados = :ID_Empleados';
        $stmt = $this->conn->prepare($query);

        $this->ID_Empleados = htmlspecialchars(strip_tags($this->ID_Empleados));

        $stmt->bindParam(':ID_Empleados', $this->ID_Empleados);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>