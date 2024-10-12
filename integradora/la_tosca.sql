-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-10-2024 a las 20:44:42
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
  `correo` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`ID_cliente`, `Nombres`, `Apellido_P`, `Apellido_M`, `Telefono`, `correo`) VALUES
(1, 'Juan', 'Pérez', 'García', '5551234567', 'juan.perez@example.com'),
(2, 'María', 'Lopez', 'Martínez', '5552345678', 'maria.lopez@example.com'),
(3, 'Carlos', 'Sánchez', 'Ramírez', '5553456789', 'carlos.sanchez@example.com'),
(4, 'Laura', 'Gómez', 'Hernández', '5554567890', 'laura.gomez@example.com'),
(5, 'Pedro', 'Torres', 'Cruz', '5555678901', 'pedro.torres@example.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_o`
--

CREATE TABLE `detalle_o` (
  `ID_detalle` int(11) NOT NULL,
  `ID_product` int(11) DEFAULT NULL,
  `cantidad_p` int(11) NOT NULL,
  `Importe` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_o`
--

INSERT INTO `detalle_o` (`ID_detalle`, `ID_product`, `cantidad_p`, `Importe`) VALUES
(1, 1, 2, 0.00),
(2, 2, 1, 0.00),
(3, 1, 3, 0.00),
(4, 3, 1, 0.00),
(5, 2, 2, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id_direccion` int(11) NOT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `colonia` varchar(255) NOT NULL,
  `id_zona` int(11) DEFAULT NULL,
  `ID_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`id_direccion`, `calle`, `numero`, `colonia`, `id_zona`, `ID_cliente`) VALUES
(1, 'Calle A', '101', 'Colonia A', 1, 1),
(2, 'Calle B', '202', 'Colonia B', 2, 2),
(3, 'Calle C', '303', 'Colonia C', 3, 3),
(4, 'Calle D', '404', 'Colonia D', 4, 4),
(5, 'Calle E', '505', 'Colonia E', 5, 5);

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
  `estatus` enum('activo','inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`ID_Empleados`, `Nombres`, `Apellido_P`, `Apellido_M`, `Cargo`, `correo`, `Telefono`, `password`, `estatus`) VALUES
(1, 'Ana', 'Méndez', 'Ríos', 'admin', '', '5556789012', 'admin', 'activo'),
(2, 'Luis', 'Hernández', 'Pérez', 'empleado', '', '5557890123', 'empleado123', 'activo'),
(3, 'Sofía', 'Cruz', 'Ramírez', 'empleado', '', '5558901234', 'empleado456', 'activo'),
(4, 'Jorge', 'Salas', 'García', 'empleado', '', '5559012345', 'empleado789', 'activo'),
(5, 'Clara', 'Pérez', 'González', 'empleado', '', '5550123456', 'empleado012', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `ID_orden` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Hora` time NOT NULL,
  `Estatus` enum('activo','proceso','cancelado') NOT NULL,
  `Precio_total` decimal(10,2) DEFAULT NULL,
  `ID_cliente` int(11) DEFAULT NULL,
  `ID_detalle` int(11) DEFAULT NULL,
  `ID_Empleados` int(11) DEFAULT NULL,
  `tipo_pago` enum('Efectivo','tarjeta','deposito') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden`
--

INSERT INTO `orden` (`ID_orden`, `Fecha`, `Hora`, `Estatus`, `Precio_total`, `ID_cliente`, `ID_detalle`, `ID_Empleados`, `tipo_pago`) VALUES
(1, '2024-09-01', '00:00:00', 'activo', 200.00, 1, 1, 1, 'Efectivo'),
(2, '2024-09-02', '00:00:00', 'proceso', 150.00, 2, 2, 1, 'tarjeta'),
(3, '2024-09-03', '00:00:00', 'activo', 300.00, 3, 3, 2, 'deposito'),
(4, '2024-09-04', '00:00:00', 'cancelado', 120.00, 4, 4, 2, 'Efectivo'),
(5, '2024-09-05', '00:00:00', 'activo', 250.00, 5, 5, 2, 'tarjeta');

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
  `estatus` enum('agotado','existente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_product`, `Nombre`, `tipo`, `Categoria`, `precio`, `estatus`) VALUES
(1, 'Producto A', 'suelto', 'Categoria 1', 100.00, 'existente'),
(2, 'Producto B', 'unitario', 'Categoria 2', 75.00, 'existente'),
(3, 'Producto C', 'suelto', 'Categoria 3', 50.00, 'agotado'),
(4, 'Producto D', 'unitario', 'Categoria 1', 120.00, 'existente'),
(5, 'Producto E', 'suelto', 'Categoria 2', 90.00, 'existente');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vis_maspedidos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vis_maspedidos` (
`ID_product` int(11)
,`Nombre` varchar(100)
,`total_orders` bigint(21)
);

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

-- --------------------------------------------------------

--
-- Estructura para la vista `vis_maspedidos`
--
DROP TABLE IF EXISTS `vis_maspedidos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vis_maspedidos`  AS SELECT `p`.`ID_product` AS `ID_product`, `p`.`Nombre` AS `Nombre`, count(`d`.`ID_detalle`) AS `total_orders` FROM (`producto` `p` join `detalle_o` `d` on(`p`.`ID_product` = `d`.`ID_product`)) GROUP BY `p`.`ID_product`, `p`.`Nombre` ;

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
  ADD KEY `ID_product` (`ID_product`);

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
  ADD KEY `ID_detalle` (`ID_detalle`),
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
  MODIFY `ID_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `ID_Empleados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `ID_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `detalle_o_ibfk_1` FOREIGN KEY (`ID_product`) REFERENCES `producto` (`ID_product`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `orden_ibfk_2` FOREIGN KEY (`ID_detalle`) REFERENCES `detalle_o` (`ID_detalle`) ON DELETE SET NULL,
  ADD CONSTRAINT `orden_ibfk_3` FOREIGN KEY (`ID_Empleados`) REFERENCES `empleado` (`ID_Empleados`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
