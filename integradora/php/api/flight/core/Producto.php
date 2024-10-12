<?php

class Producto{
    private $conn;
    private $table = 'producto';

    public $ID_product;
    public $Nombre;
    public $tipo;
    public $Categoria;
    public $precio;
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
        $query = 'INSERT INTO ' . $this->table . ' SET Nombre = :Nombre, tipo = :tipo, Categoria = :Categoria, precio = :precio, estatus = :estatus';
        $stmt = $this->conn->prepare($query);

        $this->Nombre = htmlspecialchars(strip_tags($this->Nombre));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->Categoria = htmlspecialchars(strip_tags($this->Categoria));
        $this->precio = htmlspecialchars(strip_tags($this->precio));
        $this->estatus = htmlspecialchars(strip_tags($this->estatus));

        $stmt->bindParam(':Nombre', $this->Nombre);
        $stmt->bindParam(':tipo', $this->tipo);
        $stmt->bindParam(':Categoria', $this->Categoria);
        $stmt->bindParam(':precio', $this->precio);
        $stmt->bindParam(':estatus', $this->estatus);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET Nombre = :Nombre, tipo = :tipo, Categoria = :Categoria, precio = :precio, estatus = :estatus WHERE ID_product = :ID_product';
        $stmt = $this->conn->prepare($query);

        $this->Nombre = htmlspecialchars(strip_tags($this->Nombre));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->Categoria = htmlspecialchars(strip_tags($this->Categoria));
        $this->precio = htmlspecialchars(strip_tags($this->precio));
        $this->estatus = htmlspecialchars(strip_tags($this->estatus));
        $this->ID_product = htmlspecialchars(strip_tags($this->ID_product));

        $stmt->bindParam(':Nombre', $this->Nombre);
        $stmt->bindParam(':tipo', $this->tipo);
        $stmt->bindParam(':Categoria', $this->Categoria);
        $stmt->bindParam(':precio', $this->precio);
        $stmt->bindParam(':estatus', $this->estatus);
        $stmt->bindParam(':ID_product', $this->ID_product);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = 'DELETE FROM ' .$this->table . ' WHERE ID_product = :ID_product';
        $stmt = $this->conn->prepare($query);

        $this->ID_product = htmlspecialchars(strip_tags($this->ID_product));

        $stmt->bindParam(':ID_product', $this->ID_product);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}