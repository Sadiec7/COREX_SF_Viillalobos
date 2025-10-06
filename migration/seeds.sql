-- ============================================
-- SEEDS - Datos Iniciales
-- ============================================
-- Sistema de Gestión de Pólizas
-- Catálogos y datos de ejemplo
-- ============================================

-- ============================================
-- 1. PERIODICIDADES
-- ============================================
INSERT OR IGNORE INTO Periodicidad (periodicidad_id, nombre, meses, dias_anticipacion_alerta) VALUES
(1, 'Mensual', 1, 7),
(2, 'Bimestral', 2, 10),
(3, 'Trimestral', 3, 15),
(4, 'Cuatrimestral', 4, 20),
(5, 'Semestral', 6, 30),
(6, 'Anual', 12, 45);

-- ============================================
-- 2. MÉTODOS DE PAGO
-- ============================================
INSERT OR IGNORE INTO MetodoPago (metodo_pago_id, nombre, requiere_domiciliacion) VALUES
(1, 'Domiciliado', 1),
(2, 'Transferencia Bancaria', 0),
(3, 'Cheque', 0),
(4, 'Tarjeta de Crédito', 0),
(5, 'Tarjeta de Débito', 0),
(6, 'Efectivo', 0),
(7, 'Depósito Bancario', 0);

-- ============================================
-- 3. ASEGURADORAS
-- ============================================
INSERT OR IGNORE INTO Aseguradora (aseguradora_id, nombre) VALUES
(1, 'GNP Seguros'),
(2, 'AXA Seguros'),
(3, 'MAPFRE'),
(4, 'Seguros SURA'),
(5, 'Quálitas'),
(6, 'HDI Seguros'),
(7, 'Banorte Seguros'),
(8, 'Chubb Seguros'),
(9, 'Zurich Seguros'),
(10, 'MetLife'),
(11, 'Seguros Monterrey New York Life'),
(12, 'Inbursa Seguros'),
(13, 'Atlas Seguros'),
(14, 'ANA Seguros'),
(15, 'Afirme Seguros');

-- ============================================
-- 4. RAMOS DE SEGUROS
-- ============================================
INSERT OR IGNORE INTO Ramo (ramo_id, nombre, descripcion) VALUES
(1, 'Automóvil', 'Seguro de vehículos automotores'),
(2, 'Vida', 'Seguro de vida individual y colectivo'),
(3, 'Gastos Médicos Mayores', 'Cobertura de gastos médicos'),
(4, 'Daños', 'Seguros de daños a bienes'),
(5, 'Hogar', 'Seguro para vivienda y contenidos'),
(6, 'Responsabilidad Civil', 'Cobertura de responsabilidad civil'),
(7, 'Accidentes Personales', 'Seguro contra accidentes'),
(8, 'Transporte', 'Seguro de mercancías y transporte'),
(9, 'Incendio', 'Seguro contra incendio'),
(10, 'Robo', 'Seguro contra robo y asalto'),
(11, 'Empresarial', 'Seguros para empresas y negocios'),
(12, 'Educación', 'Seguros educativos y universitarios'),
(13, 'Moto', 'Seguro para motocicletas'),
(14, 'Flotilla', 'Seguro para flotillas vehiculares'),
(15, 'Dental', 'Cobertura dental');

-- ============================================
-- 5. USUARIO ADMINISTRADOR INICIAL
-- ============================================
-- NOTA: Este es solo temporal para desarrollo
-- Password: admin123 (hashear en producción con bcrypt)
-- Salt y hash son placeholders que serán reemplazados por el DatabaseManager

INSERT OR IGNORE INTO Usuario (
    usuario_id,
    username,
    email,
    password_hash,
    salt,
    rol,
    activo,
    fecha_ultimo_cambio_password
) VALUES (
    1,
    'admin',
    'admin@segurosvillalobos.com',
    'TEMP_HASH_PLACEHOLDER',
    'TEMP_SALT_PLACEHOLDER',
    'admin',
    1,
    CURRENT_TIMESTAMP
);

-- ============================================
-- 6. CLIENTES DE EJEMPLO (OPCIONAL)
-- ============================================
INSERT OR IGNORE INTO Cliente (cliente_id, rfc, nombre, telefono, correo, direccion, fecha_nacimiento) VALUES
(1, 'GARC850215ABC', 'Juan García Pérez', '5551234567', 'juan.garcia@example.com', 'Av. Insurgentes 123, CDMX', '1985-02-15'),
(2, 'LOPZ901020DEF', 'María López Sánchez', '5559876543', 'maria.lopez@example.com', 'Calle Reforma 456, CDMX', '1990-10-20'),
(3, 'MART750830GHI', 'Carlos Martínez Rodríguez', '5555551234', 'carlos.martinez@example.com', 'Av. Juárez 789, Monterrey', '1975-08-30');

