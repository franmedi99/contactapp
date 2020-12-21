-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-12-2020 a las 02:52:06
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `contactapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados_activos`
--

CREATE TABLE `empleados_activos` (
  `id` int(11) NOT NULL,
  `id_remitente` int(11) NOT NULL,
  `id_receptor` int(11) NOT NULL,
  `trabajo` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `mostrar` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informacion_adicional`
--

CREATE TABLE `informacion_adicional` (
  `id_informacion` int(11) NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `sexo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `estado_civil` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(15) NOT NULL,
  `id_remitente` int(15) NOT NULL,
  `id_receptor` int(15) NOT NULL,
  `contenido` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id_post` int(11) NOT NULL,
  `trabajo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(502) COLLATE utf8mb4_spanish_ci NOT NULL,
  `horario` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `id_remitente` int(11) NOT NULL,
  `tipo_de_publicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion`
--

CREATE TABLE `puntuacion` (
  `id_puntuacion` int(11) NOT NULL,
  `id_remitente` int(11) NOT NULL,
  `id_receptor` int(11) NOT NULL,
  `puntuacion` int(11) NOT NULL,
  `trabajo` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `review` varchar(500) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_de_perfil`
--

CREATE TABLE `tipo_de_perfil` (
  `id_tipo` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_de_perfil`
--

INSERT INTO `tipo_de_perfil` (`id_tipo`, `tipo`) VALUES
(1, 'undefined'),
(2, 'trabajador'),
(3, 'empleador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_de_publicacion`
--

CREATE TABLE `tipo_de_publicacion` (
  `id_tipo` int(11) NOT NULL,
  `tipo` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_de_publicacion`
--

INSERT INTO `tipo_de_publicacion` (`id_tipo`, `tipo`) VALUES
(1, 'trabajador'),
(2, 'empleador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `codigo` varchar(100) NOT NULL,
  `activacion` int(2) NOT NULL,
  `tipo_perfil` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_informacion`
--

CREATE TABLE `usuario_informacion` (
  `id_informacion` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `descripcion` varchar(2000) NOT NULL,
  `telefono` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `empleados_activos`
--
ALTER TABLE `empleados_activos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trabajadores_actuales_ibfk_1` (`id_remitente`),
  ADD KEY `trabajadores_actuales_ibfk_3` (`trabajo`),
  ADD KEY `id_trabajador` (`id_receptor`);

--
-- Indices de la tabla `informacion_adicional`
--
ALTER TABLE `informacion_adicional`
  ADD PRIMARY KEY (`id_informacion`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `empleadores_notificaciones_ibfk_1` (`id_remitente`),
  ADD KEY `id_trabajador` (`id_receptor`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `id_empleador` (`id_remitente`),
  ADD KEY `tipo_de_publicacion` (`tipo_de_publicacion`);

--
-- Indices de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id_puntuacion`),
  ADD KEY `puntuacion_ibfk_1` (`id_remitente`),
  ADD KEY `id_trabajador` (`id_receptor`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tipo_de_perfil`
--
ALTER TABLE `tipo_de_perfil`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `tipo_de_publicacion`
--
ALTER TABLE `tipo_de_publicacion`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_perfil` (`tipo_perfil`);

--
-- Indices de la tabla `usuario_informacion`
--
ALTER TABLE `usuario_informacion`
  ADD PRIMARY KEY (`id_informacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `empleados_activos`
--
ALTER TABLE `empleados_activos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `informacion_adicional`
--
ALTER TABLE `informacion_adicional`
  MODIFY `id_informacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id_puntuacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_de_perfil`
--
ALTER TABLE `tipo_de_perfil`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_de_publicacion`
--
ALTER TABLE `tipo_de_publicacion`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de la tabla `usuario_informacion`
--
ALTER TABLE `usuario_informacion`
  MODIFY `id_informacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empleados_activos`
--
ALTER TABLE `empleados_activos`
  ADD CONSTRAINT `empleados_activos_ibfk_1` FOREIGN KEY (`id_remitente`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `empleados_activos_ibfk_4` FOREIGN KEY (`id_receptor`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `informacion_adicional`
--
ALTER TABLE `informacion_adicional`
  ADD CONSTRAINT `informacion_adicional_ibfk_1` FOREIGN KEY (`id_informacion`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_remitente`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_receptor`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`id_remitente`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `publicaciones_ibfk_2` FOREIGN KEY (`tipo_de_publicacion`) REFERENCES `tipo_de_publicacion` (`id_tipo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD CONSTRAINT `puntuacion_ibfk_1` FOREIGN KEY (`id_remitente`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `puntuacion_ibfk_2` FOREIGN KEY (`id_receptor`) REFERENCES `usuario_informacion` (`id_informacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`tipo_perfil`) REFERENCES `tipo_de_perfil` (`id_tipo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_informacion`
--
ALTER TABLE `usuario_informacion`
  ADD CONSTRAINT `usuario_informacion_ibfk_1` FOREIGN KEY (`id_informacion`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
