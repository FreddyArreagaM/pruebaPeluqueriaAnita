
CREATE DATABASE IF NOT EXISTS peluqueria_anita;
USE peluqueria_anita;

-- 1. Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    cedula VARCHAR(10),
    email VARCHAR(100),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de citas
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATETIME NOT NULL,
    estado ENUM('PENDIENTE', 'REALIZADA', 'CANCELADA') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- 3. Tabla de atenciones
CREATE TABLE atenciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    fecha DATETIME NOT NULL,
    total DECIMAL(10,2),
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE
);

-- 4. Tabla de servicios (catálogo)
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    duracion_minutos INT
);

-- 5. Tabla de detalle de atenciones
CREATE TABLE detalle_atenciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    atencion_id INT NOT NULL,
    servicio_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (atencion_id) REFERENCES atenciones(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

-- 6. Tabla de usuarios (para login si aplica)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'CLIENTE') DEFAULT 'CLIENTE'
);
