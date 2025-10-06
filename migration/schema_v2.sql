-- ============================================
-- SCHEMA V2 - Sistema de Gestión de Pólizas
-- ============================================
-- Basado en: Modelo de Entidades v1 + Mejoras propuestas
-- Fecha: Octubre 2025
-- ============================================

-- Habilitar foreign keys
PRAGMA foreign_keys = ON;

-- ============================================
-- 1. CLIENTE
-- ============================================
CREATE TABLE IF NOT EXISTS Cliente (
    cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfc VARCHAR(13) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo_persona VARCHAR(20) DEFAULT 'Física' CHECK(tipo_persona IN ('Física', 'Moral')),
    telefono VARCHAR(20),
    celular VARCHAR(20),
    correo VARCHAR(100),
    direccion TEXT,
    notas TEXT,
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT 1,
    fecha_eliminacion DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. ASEGURADORA (Catálogo)
-- ============================================
CREATE TABLE IF NOT EXISTS Aseguradora (
    aseguradora_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT 1
);

-- ============================================
-- 3. RAMO (Catálogo)
-- ============================================
CREATE TABLE IF NOT EXISTS Ramo (
    ramo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1
);

-- ============================================
-- 4. PERIODICIDAD (Catálogo)
-- ============================================
CREATE TABLE IF NOT EXISTS Periodicidad (
    periodicidad_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    meses INTEGER NOT NULL,
    dias_anticipacion_alerta INTEGER DEFAULT 7
);

-- ============================================
-- 5. METODO PAGO (Catálogo)
-- ============================================
CREATE TABLE IF NOT EXISTS MetodoPago (
    metodo_pago_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    requiere_domiciliacion BOOLEAN DEFAULT 0
);

-- ============================================
-- 6. POLIZA
-- ============================================
CREATE TABLE IF NOT EXISTS Poliza (
    poliza_id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_poliza VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL,
    aseguradora_id INTEGER NOT NULL,
    ramo_id INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    prima_total DECIMAL(10,2) NOT NULL,
    comision_porcentaje DECIMAL(5,2),
    suma_asegurada DECIMAL(15,2),
    periodicidad_pago_id INTEGER NOT NULL,
    metodo_pago_id INTEGER,
    notas TEXT,
    activo BOOLEAN DEFAULT 1,
    fecha_eliminacion DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id),
    FOREIGN KEY (aseguradora_id) REFERENCES Aseguradora(aseguradora_id),
    FOREIGN KEY (ramo_id) REFERENCES Ramo(ramo_id),
    FOREIGN KEY (periodicidad_pago_id) REFERENCES Periodicidad(periodicidad_id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodoPago(metodo_pago_id),

    CHECK (prima_total > 0),
    CHECK (fecha_fin > fecha_inicio)
);

-- ============================================
-- 7. RECIBO
-- ============================================
CREATE TABLE IF NOT EXISTS Recibo (
    recibo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    poliza_id INTEGER NOT NULL,
    numero_recibo VARCHAR(50) NOT NULL,
    numero_fraccion INTEGER NOT NULL,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha_vencimiento DATE NOT NULL,
    pagado BOOLEAN DEFAULT 0,
    fecha_pago DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id)
);

-- ============================================
-- 8. USUARIO (MEJORADO)
-- ============================================
CREATE TABLE IF NOT EXISTS Usuario (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(32) NOT NULL,
    rol VARCHAR(20) DEFAULT 'operador'
        CHECK(rol IN ('admin', 'operador', 'lectura')),
    activo BOOLEAN DEFAULT 1,
    bloqueado BOOLEAN DEFAULT 0,
    intentos_fallidos INTEGER DEFAULT 0,
    ultimo_acceso DATETIME,
    fecha_ultimo_cambio_password DATETIME,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. DOCUMENTO
-- ============================================
CREATE TABLE IF NOT EXISTS Documento (
    documento_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NULL,
    poliza_id INTEGER NULL,
    tipo VARCHAR(50) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_relativa TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id),
    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),

    CHECK (cliente_id IS NOT NULL OR poliza_id IS NOT NULL)
);

-- ============================================
-- 10. AUDITORIA POLIZA
-- ============================================
CREATE TABLE IF NOT EXISTS AuditoriaPoliza (
    auditoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
    poliza_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR(20) NOT NULL CHECK(accion IN ('INSERT', 'UPDATE', 'DELETE')),
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
);

