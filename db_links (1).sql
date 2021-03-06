-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2021 a las 00:38:24
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_links`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `confirmaciones`
--

CREATE TABLE `confirmaciones` (
  `id_notificacion` int(15) NOT NULL,
  `id_firma` int(15) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `trabajo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados_activos`
--

CREATE TABLE `empleados_activos` (
  `id` int(11) NOT NULL,
  `id_firma` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `trabajo` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `mostrar` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_empleados`
--

CREATE TABLE `notificaciones_empleados` (
  `id_notificacion` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `id_firma` int(11) NOT NULL,
  `contenido` varchar(100) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_firmas`
--

CREATE TABLE `notificaciones_firmas` (
  `id_notificacion` int(11) NOT NULL,
  `id_firma` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `contenido` varchar(100) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones_empleados`
--

CREATE TABLE `publicaciones_empleados` (
  `id_publicacion` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `trabajo` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `horario` varchar(30) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `publicaciones_empleados`
--

INSERT INTO `publicaciones_empleados` (`id_publicacion`, `id_empleado`, `trabajo`, `descripcion`, `horario`) VALUES
(1, 3, 'ses', 'sas', 'PART-TIME'),
(6, 1, 'repositor', '', 'PART-TIME');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones_firmas`
--

CREATE TABLE `publicaciones_firmas` (
  `id_publicacion` int(11) NOT NULL,
  `id_firma` int(11) NOT NULL,
  `trabajo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` varchar(502) COLLATE utf8mb4_spanish_ci NOT NULL,
  `horario` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `publicaciones_firmas`
--

INSERT INTO `publicaciones_firmas` (`id_publicacion`, `id_firma`, `trabajo`, `descripcion`, `horario`) VALUES
(25, 2, 'repositor', 's', 'FULL-TIME');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion`
--

CREATE TABLE `puntuacion` (
  `id_puntuacion` int(11) NOT NULL,
  `id_firma` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `puntuacion` int(11) NOT NULL,
  `trabajo` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ventajas` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `desventajas` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `puntuacion`
--

INSERT INTO `puntuacion` (`id_puntuacion`, `id_firma`, `id_empleado`, `puntuacion`, `trabajo`, `ventajas`, `desventajas`) VALUES
(12, 2, 1, 7, 'cocinero', '[\"Buena Presencia\",\"Buena Diccion\",\"Buena Relacion con sus Pares\",\"Buena Relacion con sus Superiores\",\"Responsable\",\"Cumple con las tareas asignadas\",\"Evita Conflictos\"]', '[\"Impuntual\",\"Ausentismo\",\"Genera Conflictos\"]'),
(13, 2, 1, 6, 'cocinero', '[\"Puntual\",\"Buena Presencia\",\"Buena Diccion\",\"Buena Relacion con sus Pares\",\"Buena Relacion con sus Superiores\",\"Evita Conflictos\"]', '[\"Ausentismo\",\"Irresponsible\",\"No cumple con las tareas asignadas\",\"Genera Conflictos\"]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('1tGWTgRWLJe6VSWmP6FX1FKeuiq-9rlw', 1613533269, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('3-C8MzTKJJmNm2L0JY1cQfXdLanY5VHi', 1613531569, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('39qMoIwBnita6me9Y9N4ChxNmKEhjeER', 1613533418, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('3PDmhJmd4NAPLVUnIZOzMUk59ecNXlNE', 1613530858, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('3gSq8zrUpaA4tuRTcC41DM5NaJGvWjOv', 1613535074, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('6bXeLyhKc4yNk_OSKGmREAeK22JoAgV6', 1613530784, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('7P_ZRfN5NXKlqPSe_DAIG-Iw1hVMGtnC', 1613533230, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('82i_cnpF4NldGTzG_sQyqfylWyrtOHyp', 1613523741, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('85pH9HSgunJCQ5nvKqGuBawmCVwaOx5A', 1613531374, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('9LUKUc3ZWK6dO75LeT3v3ZFHqu6YV47I', 1613535448, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('AdUmyZ7m1cT7B893EMmijJDD3zOoTNVq', 1613532889, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('B35hbltGdDKT0iP5HmiCKSKBORDr0S_5', 1613535566, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('BzTN5FgISre3rjYrA8Q6vmuV0P3M_uh1', 1613535409, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('DSOQheCGOgGkXzXuok8gccs1SgJM4PYm', 1613531403, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('DsqijvrXQAJmb9O0uMp7X9XKXE_WJW22', 1613535387, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('ImJiMLIZVYtLlSjEtgwlcibkcv9UQrKR', 1613532688, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('Js9odfWONePaJo9J0yF5FQu5ESfReMQC', 1613530715, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('K6rEymYPpXj0ZczbcYe9HiyndFjy4E82', 1613530688, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('Ka2vIusv8Iy6GOdQX_Nu2SsUXrfpsuZc', 1613531292, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('MINdcHNWOGVIwRfgW__fknuUnDo09zFD', 1613533299, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('N-Tjsk5e1b1uHR8aqIsaMVMTCn0T8kB2', 1613535649, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":2}}'),
('O1Mgn9N0AXbhDgYrcIjwIs717CovpOcg', 1613535626, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('Q_7lOmJnGzuUJFqkty0f_m2yWc9dUzhE', 1613534865, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('RovTaaecNSFGNVbyIVhphuqlbTIfX0DB', 1613535499, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('T6MlpS1ca_H6p7_CuIo391BVBz612rs-', 1613530669, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('VjH1kH2au7OUP7JSjvWqD1n_q6LTfMAD', 1613530878, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('Yv45_DLBnfndvonLkCwYIVMa4Wz_XwYr', 1613532747, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('Z-uI884D5I_qsBmgaNyB_lvy9kPVLVqW', 1613535275, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('_vIp0vd30DezTo8U8w1ZsT06A3iAoPt1', 1613531269, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('biaAUMpBspNQlX0S2KsfTBpa0Y8uITY2', 1613534985, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('hNnEYf7tc9vXV1v3ZeGh7PAJR6U7Thy6', 1613530707, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('k8DxhU5Z1FLwl5jgmtzldRLQZsQvZQcZ', 1613533091, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('lHtRTYBQ8phuJ667G1T0sLS320YQLhp9', 1613533826, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('mGiDim39WZzgNHqWfBCL4cYbdfJTL8cR', 1613531228, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('mezU6cR6LQS8I4Kjw9rZneBU74KgfxoA', 1613530637, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('nORHnyiQvHllcdMJ6JMF3dbZQiMt95ez', 1613533525, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('pStyZ25dE28iqaQlsZ4KuLsAdk5Y5q5f', 1613532769, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('pcSfgKxq-FlyxDY6AlCM6LO25drhKsAm', 1613535553, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('qyTyQakTfXywxUwzVpeKkT8w9flwUhHd', 1613533597, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('rxVO66Y1XjbFV0aRJ4xMGS6wI40PNVZ_', 1613531258, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('rzfFuyNwefOQd3fT0AYrhRyiY8nHHQqu', 1613533570, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('sShf0_OJtUAT6BombzOltOeJxsShP8ug', 1613533848, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('tB_e6B1hWmzJ7gfeUCG0Hm3KXbbNqX2z', 1613535612, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('v3VxHGIG6SUA5zurk0azKatv1rZGSr4J', 1613535508, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('yU6eP5ZqXqyHRrdMF6SxrxirggnO16pP', 1613533210, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');

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
(1, 'indefinido'),
(2, 'empleado'),
(3, 'firma');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `password` varchar(60) CHARACTER SET utf8mb4 NOT NULL,
  `codigo` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `activacion` int(2) NOT NULL,
  `tipo_perfil` int(1) NOT NULL,
  `perfil` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `codigo`, `activacion`, `tipo_perfil`, `perfil`) VALUES
(1, 'franmedi_mdp@hotmail.com', '$2a$10$1YRXYX6om1rXlKqpgOs3Du9HyeQpQCmnuMOW10cMecZhf/cTd420i', '609471587372169', 1, 2, 1),
(2, 'user@mail.com', '$2a$10$1YRXYX6om1rXlKqpgOs3Du9HyeQpQCmnuMOW10cMecZhf/cTd420i', '1', 1, 3, 1),
(3, 'user1@mail.com', '$2a$10$1YRXYX6om1rXlKqpgOs3Du9HyeQpQCmnuMOW10cMecZhf/cTd420i', '1', 1, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_empleado`
--

CREATE TABLE `usuarios_empleado` (
  `id_empleado` int(10) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `fecha` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `telefono` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `sexo` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `estado_civil` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `hijos` varchar(11) COLLATE utf8_spanish_ci NOT NULL,
  `video` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `facebook` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `instagram` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `twitter` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `puntuacion` varchar(3) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios_empleado`
--

INSERT INTO `usuarios_empleado` (`id_empleado`, `nombre`, `apellido`, `descripcion`, `fecha`, `telefono`, `sexo`, `estado_civil`, `hijos`, `video`, `facebook`, `instagram`, `twitter`, `puntuacion`) VALUES
(1, 'francisco', 'medina deering', ' sa', '1999-07-08', '(+54) 223 687 0198', 'Hombre', 'Casado', '0', '', 'https://www.facebook.com/profile.php?id=100008188352302', 'instagram.com/fmedina', 'twitter.com/fmedina', '6.5'),
(3, 'usuario', 'apellidodelusuario', 'descripcion', '1999-07-08', '223', 'hombre', 'casado', '0', '', '', '', '', '10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_firma`
--

CREATE TABLE `usuarios_firma` (
  `id_firma` int(11) NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `fecha` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `descripcion` varchar(2000) CHARACTER SET utf8mb4 NOT NULL,
  `telefono` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `id_suscripcion` varchar(50) CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios_firma`
--

INSERT INTO `usuarios_firma` (`id_firma`, `nombre`, `fecha`, `descripcion`, `telefono`, `id_suscripcion`) VALUES
(2, 'franciscorp', '2018-07-08', 'empresa de desarrollo de software', '(+54) 223 687 0198', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `confirmaciones`
--
ALTER TABLE `confirmaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `empleadores_notificaciones_ibfk_1` (`id_firma`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `empleados_activos`
--
ALTER TABLE `empleados_activos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trabajadores_actuales_ibfk_1` (`id_firma`),
  ADD KEY `trabajadores_actuales_ibfk_3` (`trabajo`),
  ADD KEY `id_trabajador` (`id_empleado`);

--
-- Indices de la tabla `notificaciones_empleados`
--
ALTER TABLE `notificaciones_empleados`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_firma` (`id_firma`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `notificaciones_firmas`
--
ALTER TABLE `notificaciones_firmas`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_empleado` (`id_empleado`),
  ADD KEY `id_firma` (`id_firma`);

--
-- Indices de la tabla `publicaciones_empleados`
--
ALTER TABLE `publicaciones_empleados`
  ADD PRIMARY KEY (`id_publicacion`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `publicaciones_firmas`
--
ALTER TABLE `publicaciones_firmas`
  ADD PRIMARY KEY (`id_publicacion`),
  ADD KEY `id_empleador` (`id_firma`);

--
-- Indices de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id_puntuacion`),
  ADD KEY `puntuacion_ibfk_1` (`id_firma`),
  ADD KEY `id_trabajador` (`id_empleado`);

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
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_perfil` (`tipo_perfil`);

--
-- Indices de la tabla `usuarios_empleado`
--
ALTER TABLE `usuarios_empleado`
  ADD PRIMARY KEY (`id_empleado`);

--
-- Indices de la tabla `usuarios_firma`
--
ALTER TABLE `usuarios_firma`
  ADD PRIMARY KEY (`id_firma`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `confirmaciones`
--
ALTER TABLE `confirmaciones`
  MODIFY `id_notificacion` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `empleados_activos`
--
ALTER TABLE `empleados_activos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `notificaciones_empleados`
--
ALTER TABLE `notificaciones_empleados`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `notificaciones_firmas`
--
ALTER TABLE `notificaciones_firmas`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `publicaciones_empleados`
--
ALTER TABLE `publicaciones_empleados`
  MODIFY `id_publicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `publicaciones_firmas`
--
ALTER TABLE `publicaciones_firmas`
  MODIFY `id_publicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id_puntuacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tipo_de_perfil`
--
ALTER TABLE `tipo_de_perfil`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios_empleado`
--
ALTER TABLE `usuarios_empleado`
  MODIFY `id_empleado` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios_firma`
--
ALTER TABLE `usuarios_firma`
  MODIFY `id_firma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `confirmaciones`
--
ALTER TABLE `confirmaciones`
  ADD CONSTRAINT `confirmaciones_ibfk_1` FOREIGN KEY (`id_firma`) REFERENCES `usuarios_firma` (`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `confirmaciones_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios_empleado` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `empleados_activos`
--
ALTER TABLE `empleados_activos`
  ADD CONSTRAINT `empleados_activos_ibfk_3` FOREIGN KEY (`id_firma`) REFERENCES `usuarios_firma` (`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `empleados_activos_ibfk_4` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios_empleado` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones_empleados`
--
ALTER TABLE `notificaciones_empleados`
  ADD CONSTRAINT `notificaciones_empleados_ibfk_1` FOREIGN KEY (`id_firma`) REFERENCES `usuarios_firma` (`id_firma`) ON DELETE CASCADE,
  ADD CONSTRAINT `notificaciones_empleados_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios_empleado` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones_firmas`
--
ALTER TABLE `notificaciones_firmas`
  ADD CONSTRAINT `notificaciones_firmas_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios_empleado` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notificaciones_firmas_ibfk_2` FOREIGN KEY (`id_firma`) REFERENCES `usuarios_firma` (`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones_empleados`
--
ALTER TABLE `publicaciones_empleados`
  ADD CONSTRAINT `publicaciones_empleados_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios_empleado` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones_firmas`
--
ALTER TABLE `publicaciones_firmas`
  ADD CONSTRAINT `publicaciones_firmas_ibfk_1` FOREIGN KEY (`id_firma`) REFERENCES `usuarios_firma` (`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD CONSTRAINT `puntuacion_ibfk_3` FOREIGN KEY (`id_firma`) REFERENCES `usuarios_firma` (`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `puntuacion_ibfk_4` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios_empleado` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`tipo_perfil`) REFERENCES `tipo_de_perfil` (`id_tipo`);

--
-- Filtros para la tabla `usuarios_empleado`
--
ALTER TABLE `usuarios_empleado`
  ADD CONSTRAINT `usuarios_empleado_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios_firma`
--
ALTER TABLE `usuarios_firma`
  ADD CONSTRAINT `usuarios_firma_ibfk_1` FOREIGN KEY (`id_firma`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
