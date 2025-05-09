-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-11-2024 a las 23:04:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `la_tosca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `ID_cliente` int(11) NOT NULL,
  `Nombres` varchar(100) NOT NULL,
  `Apellido_P` varchar(50) NOT NULL,
  `Apellido_M` varchar(50) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `estatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`ID_cliente`, `Nombres`, `Apellido_P`, `Apellido_M`, `Telefono`, `correo`, `estatus`) VALUES
(1, 'Juan', 'Pérez', 'García', '5551234567', 'juan.perez@example.com', 1),
(2, 'María', 'Lopez', 'Martínez', '5552345678', 'maria.lopez@example.com', 1),
(3, 'Carlos', 'Sánchez', 'Ramírez', '5553456789', 'carlos.sanchez@example.com', 1),
(4, 'Laura', 'Gómez', 'Hernández', '5554567890', 'laura.gomez@example.com', 1),
(5, 'Pedro', 'Torres', '', '5555678901', 'pedro.torres@example.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_o`
--

CREATE TABLE `detalle_o` (
  `ID_detalle` int(11) NOT NULL,
  `ID_product` int(11) DEFAULT NULL,
  `ID_orden` int(11) NOT NULL,
  `cantidad_p` int(11) NOT NULL,
  `Importe` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_o`
--

INSERT INTO `detalle_o` (`ID_detalle`, `ID_product`, `ID_orden`, `cantidad_p`, `Importe`) VALUES
(6, 3, 6, 4, 10.10),
(13, 3, 6, 4, 10.10),
(14, 3, 6, 4, 10.10),
(15, 2, 6, 4, 10.10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id_direccion` int(11) NOT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `Numero_int` int(11) DEFAULT NULL,
  `colonia` varchar(255) NOT NULL,
  `CP` int(11) DEFAULT NULL,
  `estatus` tinyint(1) NOT NULL,
  `id_zona` int(11) DEFAULT NULL,
  `ID_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`id_direccion`, `calle`, `numero`, `Numero_int`, `colonia`, `CP`, `estatus`, `id_zona`, `ID_cliente`) VALUES
(1, 'Calle A', '101', NULL, 'Colonia A', NULL, 0, 1, 1),
(2, 'Calle B', '202', NULL, 'Colonia B', NULL, 0, 2, 2),
(3, 'Calle C', '303', NULL, 'Colonia C', NULL, 0, 3, 3),
(4, 'Calle D', '404', NULL, 'Colonia D', NULL, 0, 4, 4),
(5, 'Calle E', '505', NULL, 'Colonia E', NULL, 0, 5, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `ID_Empleados` int(11) NOT NULL,
  `Nombres` varchar(100) NOT NULL,
  `Apellido_P` varchar(50) NOT NULL,
  `Apellido_M` varchar(50) DEFAULT NULL,
  `Cargo` enum('empleado','admin') NOT NULL,
  `correo` varchar(100) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `estatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`ID_Empleados`, `Nombres`, `Apellido_P`, `Apellido_M`, `Cargo`, `correo`, `Telefono`, `password`, `estatus`) VALUES
(1, 'Ana', 'Méndez', 'Ríos', 'admin', 'gqongo@goih.com\r\n', '5556789012', 'admin', 1),
(2, 'Luis', 'Hernández', 'Pérez', 'empleado', '', '5557890123', 'empleado123', 1),
(3, 'Sofía', 'Cruz', 'Ramírez', 'empleado', '', '5558901234', 'empleado456', 1),
(4, 'Jorge', 'Salas', 'García', 'empleado', '', '5559012345', 'empleado789', 1),
(5, 'Clara', 'Pérez', 'González', 'empleado', '', '5550123456', 'empleado012', 1),
(6, 'Juan', 'Pérez', 'López', 'empleado', 'juan.perez@la_tosca.com', '1234567890', 'password123', 1),
(7, 'Maria', 'González', 'Martínez', 'admin', 'maria.gonzalez@la_tosca.com', '1234567891', 'password123', 1),
(8, 'Carlos', 'Ramírez', 'Sánchez', 'empleado', 'carlos.ramirez@la_tosca.com', '1234567892', 'password123', 1),
(9, 'Ana', 'Rodríguez', 'Flores', 'empleado', 'ana.rodriguez@la_tosca.com', '1234567893', 'password123', 1),
(10, 'Luis', 'Fernández', 'Gómez', 'empleado', 'luis.fernandez@la_tosca.com', '1234567894', 'password123', 1),
(11, 'Elena', 'Martín', 'Díaz', 'empleado', 'elena.martin@la_tosca.com', '1234567895', 'password123', 1),
(12, 'Pablo', 'Hernández', 'Ortiz', 'admin', 'pablo.hernandez@la_tosca.com', '1234567896', 'password123', 1),
(13, 'Laura', 'Ruiz', 'Morales', 'empleado', 'laura.ruiz@la_tosca.com', '1234567897', 'password123', 1),
(14, 'Miguel', 'Jiménez', 'Cruz', 'empleado', 'miguel.jimenez@la_tosca.com', '1234567898', 'password123', 1),
(15, 'Claudia', 'López', 'Navarro', 'empleado', 'claudia.lopez@la_tosca.com', '1234567899', 'password123', 1),
(16, 'Raúl', 'García', 'Pérez', 'empleado', 'raul.garcia@la_tosca.com', '1234567810', 'password123', 1),
(17, 'Patricia', 'Martínez', 'Gómez', 'empleado', 'patricia.martinez@la_tosca.com', '1234567811', 'password123', 1),
(18, 'Andrés', 'Chávez', 'Méndez', 'empleado', 'andres.chavez@la_tosca.com', '1234567812', 'password123', 1),
(19, 'Beatriz', 'Salazar', 'Ríos', 'empleado', 'beatriz.salazar@la_tosca.com', '1234567813', 'password123', 1),
(20, 'Jorge', 'Santos', 'Cárdenas', 'admin', 'jorge.santos@la_tosca.com', '1234567814', 'password123', 1),
(21, 'Gloria', 'Rivera', 'Romero', 'empleado', 'gloria.rivera@la_tosca.com', '1234567815', 'password123', 1),
(22, 'Fernando', 'Aguilar', 'Sosa', 'empleado', 'fernando.aguilar@la_tosca.com', '1234567816', 'password123', 1),
(23, 'Gabriela', 'Cortés', 'Moreno', 'empleado', 'gabriela.cortes@la_tosca.com', '1234567817', 'password123', 1),
(24, 'Ricardo', 'Pérez', 'Duarte', 'empleado', 'ricardo.perez@la_tosca.com', '1234567818', 'password123', 1),
(25, 'Alejandra', 'Morales', 'Torres', 'empleado', 'alejandra.morales@la_tosca.com', '1234567819', 'password123', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `ID_orden` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Hora` time NOT NULL,
  `Estatus` enum('activo','proceso','cancelado') NOT NULL,
  `Direccion` varchar(100) NOT NULL,
  `Precio_total` decimal(10,2) DEFAULT NULL,
  `ID_cliente` int(11) DEFAULT NULL,
  `ID_Empleados` int(11) DEFAULT NULL,
  `tipo_pago` enum('Efectivo','tarjeta','deposito') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden`
--

INSERT INTO `orden` (`ID_orden`, `Fecha`, `Hora`, `Estatus`, `Direccion`, `Precio_total`, `ID_cliente`, `ID_Empleados`, `tipo_pago`) VALUES
(6, '2024-11-14', '14:30:00', 'activo', '123 Calle Falsa, Ciudad Ejemplo', 150.75, 1, 5, 'tarjeta'),
(7, '2024-11-12', '20:00:22', 'proceso', 'AA', 12.00, 1, 23, 'Efectivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_product` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `tipo` enum('suelto','unitario') NOT NULL,
  `Categoria` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_product`, `Nombre`, `tipo`, `Categoria`, `precio`, `estatus`) VALUES
(1, 'Producto A', 'suelto', 'Categoria 1', 100.00, 1),
(2, 'Producto B', 'unitario', 'Categoria 2', 75.00, 1),
(3, 'Producto C', 'suelto', 'Categoria 3', 50.00, 0),
(4, 'Producto D', 'unitario', 'Categoria 1', 120.00, 1),
(5, 'Producto E', 'suelto', 'Categoria 2', 90.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona`
--

CREATE TABLE `zona` (
  `ID_zona` int(11) NOT NULL,
  `nombre_colonia` varchar(100) NOT NULL,
  `costo_zona` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `zona`
--

INSERT INTO `zona` (`ID_zona`, `nombre_colonia`, `costo_zona`) VALUES
(1, 'Colonia A', 10.00),
(2, 'Colonia B', 15.00),
(3, 'Colonia C', 20.00),
(4, 'Colonia D', 25.00),
(5, 'Colonia E', 30.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ID_cliente`);

--
-- Indices de la tabla `detalle_o`
--
ALTER TABLE `detalle_o`
  ADD PRIMARY KEY (`ID_detalle`),
  ADD KEY `ID_product` (`ID_product`),
  ADD KEY `ID_orden_2` (`ID_orden`);

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `id_zona` (`id_zona`),
  ADD KEY `ID_cliente` (`ID_cliente`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`ID_Empleados`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`ID_orden`),
  ADD KEY `ID_cliente` (`ID_cliente`),
  ADD KEY `ID_Empleados` (`ID_Empleados`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_product`);

--
-- Indices de la tabla `zona`
--
ALTER TABLE `zona`
  ADD PRIMARY KEY (`ID_zona`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `ID_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `detalle_o`
--
ALTER TABLE `detalle_o`
  MODIFY `ID_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `ID_Empleados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `ID_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `zona`
--
ALTER TABLE `zona`
  MODIFY `ID_zona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_o`
--
ALTER TABLE `detalle_o`
  ADD CONSTRAINT `detalle_o_ibfk_1` FOREIGN KEY (`ID_product`) REFERENCES `producto` (`ID_product`) ON DELETE SET NULL,
  ADD CONSTRAINT `detalle_o_ibfk_2` FOREIGN KEY (`ID_orden`) REFERENCES `orden` (`ID_orden`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`ID_zona`) ON DELETE SET NULL,
  ADD CONSTRAINT `direccion_ibfk_2` FOREIGN KEY (`ID_cliente`) REFERENCES `cliente` (`ID_cliente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `orden`
--
ALTER TABLE `orden`
  ADD CONSTRAINT `orden_ibfk_1` FOREIGN KEY (`ID_cliente`) REFERENCES `cliente` (`ID_cliente`) ON DELETE SET NULL,
  ADD CONSTRAINT `orden_ibfk_3` FOREIGN KEY (`ID_Empleados`) REFERENCES `empleado` (`ID_Empleados`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
