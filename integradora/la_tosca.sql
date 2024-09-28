-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-09-2024 a las 01:47:51
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_o`
--

CREATE TABLE `detalle_o` (
  `ID_detalle` int(11) NOT NULL,
  `ID_product` int(11) DEFAULT NULL,
  `cantidad_p` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `Telefono` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `estatus` enum('activo','inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`ID_Empleados`, `Nombres`, `Apellido_P`, `Apellido_M`, `Cargo`, `Telefono`, `password`, `estatus`) VALUES
(1, 'admin', '123', '123', 'admin', '42122213', 'admin', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `ID_orden` int(11) NOT NULL,
  `calle` varchar(100) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `colonia` varchar(100) NOT NULL,
  `Fecha` date NOT NULL,
  `Estatus` enum('activo','proceso','cancelado') NOT NULL,
  `Precio_total` decimal(10,2) DEFAULT NULL,
  `ID_cliente` int(11) DEFAULT NULL,
  `ID_detalle` int(11) DEFAULT NULL,
  `ID_Empleados` int(11) DEFAULT NULL,
  `tipo_pago` enum('Efectivo','tarjeta','deposito') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `ID_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_o`
--
ALTER TABLE `detalle_o`
  MODIFY `ID_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `ID_Empleados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `ID_orden` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_product` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `zona`
--
ALTER TABLE `zona`
  MODIFY `ID_zona` int(11) NOT NULL AUTO_INCREMENT;

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
