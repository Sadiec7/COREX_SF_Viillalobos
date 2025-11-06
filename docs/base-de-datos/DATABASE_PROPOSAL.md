# 🗄️ Propuesta de Mejora - Base de Datos del Sistema de Gestión de Pólizas

**Versión:** 2.0
**Fecha:** Octubre 2025
**Basado en:** Modelo de Entidades v1 + Análisis del proyecto actual

---

## 📊 Resumen Ejecutivo

Esta propuesta mejora el modelo de base de datos actual (simple tabla `users`) hacia un sistema completo de gestión de pólizas con:

- ✅ Optimización de claves primarias (INTEGER en vez de VARCHAR)
- ✅ Sistema de auditoría completo (historial de cambios)
- ✅ Seguridad mejorada en usuarios (roles, permisos, password hashing)
- ✅ Soft deletes para mantener integridad histórica
- ✅ Normalización de datos (catálogos independientes)
- ✅ Índices optimizados para consultas frecuentes

---

## 🔍 Análisis del Estado Actual

### Base de Datos Existente

**Tabla actual:** `users`
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL  -- ⚠️ Sin hash, texto plano
)
```

**Problemas identificados:**
- ❌ Contraseñas en texto plano (grave riesgo de seguridad)
- ❌ No hay roles ni permisos
- ❌ No hay sistema de auditoría
- ❌ No hay tablas para pólizas, clientes, recibos

---

## 🎯 Modelo Propuesto

### Cambios Principales vs. Documento Original

#### 1. **Cliente** - Optimización de Primary Key

**Original (Documento):**
```sql
rfc VARCHAR(13) PRIMARY KEY
```

**Propuesta Mejorada:**
```sql
cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
rfc VARCHAR(13) UNIQUE NOT NULL
```

**Razones:**
- ✅ Más eficiente en JOINs (INTEGER vs VARCHAR)
- ✅ Permite corrección de RFC sin romper FKs
- ✅ Mejor performance en índices

#### 2. **Usuario** - Seguridad y Roles

**Mejoras propuestas:**
```sql
CREATE TABLE Usuario (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,                    -- 🆕 Para recuperación
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(32) NOT NULL,
    rol VARCHAR(20) DEFAULT 'operador',           -- 🆕 admin/operador/lectura
    activo BOOLEAN DEFAULT 1,
    bloqueado BOOLEAN DEFAULT 0,                  -- 🆕 Bloqueo de cuenta
    intentos_fallidos INTEGER DEFAULT 0,
    ultimo_acceso DATETIME,
    fecha_ultimo_cambio_password DATETIME,        -- 🆕 Política de cambio
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **Soft Deletes** - Integridad Histórica

Agregar a tablas principales:
```sql
-- En Cliente, Poliza, Recibo
activo BOOLEAN DEFAULT 1,
fecha_eliminacion DATETIME NULL,
usuario_eliminacion_id INTEGER NULL
```

#### 4. **Historial de Cambios** - Auditoría Completa

```sql
CREATE TABLE AuditoriaPoliza (
    auditoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
    poliza_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR(20) NOT NULL,              -- INSERT/UPDATE/DELETE
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
);
```

#### 5. **Recibo.periodo** - Mejora de Tipo de Dato

**Original:**
```sql
periodo VARCHAR(6)  -- AAAAMM como texto
```

**Propuesta:**
```sql
fecha_inicio_periodo DATE NOT NULL,
fecha_fin_periodo DATE NOT NULL,
periodo_texto VARCHAR(6) GENERATED ALWAYS AS (
    strftime('%Y%m', fecha_inicio_periodo)
) VIRTUAL
```

**Ventajas:**
- ✅ Ordenamiento correcto
- ✅ Filtros por rango de fechas
- ✅ Generación automática del texto

---

## 📋 Schema SQL Completo Mejorado

### Entidades Principales

```sql
-- ============================================
-- 1. CLIENTE
-- ============================================
CREATE TABLE Cliente (
    cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfc VARCHAR(13) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion TEXT,
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT 1,
    fecha_eliminacion DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. POLIZA
-- ============================================
CREATE TABLE Poliza (
    poliza_id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_poliza VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL,
    aseguradora_id INTEGER NOT NULL,
    ramo_id INTEGER NOT NULL,
    tipo_poliza VARCHAR(20) CHECK(tipo_poliza IN ('nuevo', 'renovacion')),
    prima_neta DECIMAL(10,2) NOT NULL,
    prima_total DECIMAL(10,2) NOT NULL,
    vigencia_inicio DATE NOT NULL,
    vigencia_fin DATE NOT NULL,
    vigencia_renovacion_automatica BOOLEAN DEFAULT 0,
    periodicidad_id INTEGER NOT NULL,
    metodo_pago_id INTEGER NOT NULL,
    domiciliada BOOLEAN DEFAULT 0,
    estado_pago VARCHAR(20) DEFAULT 'pendiente'
        CHECK(estado_pago IN ('pendiente', 'pagado', 'vencido')),
    activo BOOLEAN DEFAULT 1,
    fecha_eliminacion DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id),
    FOREIGN KEY (aseguradora_id) REFERENCES Aseguradora(aseguradora_id),
    FOREIGN KEY (ramo_id) REFERENCES Ramo(ramo_id),
    FOREIGN KEY (periodicidad_id) REFERENCES Periodicidad(periodicidad_id),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodoPago(metodo_pago_id),

    CHECK (prima_total >= prima_neta),
    CHECK (vigencia_fin > vigencia_inicio)
);

-- ============================================
-- 3. RECIBO
-- ============================================
CREATE TABLE Recibo (
    recibo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    poliza_id INTEGER NOT NULL,
    fecha_inicio_periodo DATE NOT NULL,
    fecha_fin_periodo DATE NOT NULL,
    numero_fraccion INTEGER NOT NULL,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha_corte DATE NOT NULL,
    fecha_vencimiento_original DATE NOT NULL,
    dias_gracia INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'pendiente'
        CHECK(estado IN ('pendiente', 'pagado', 'vencido')),
    fecha_pago DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),
    UNIQUE (poliza_id, fecha_inicio_periodo, numero_fraccion)
);

-- ============================================
-- 4. USUARIO (MEJORADO)
-- ============================================
CREATE TABLE Usuario (
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
-- 5. DOCUMENTO
-- ============================================
CREATE TABLE Documento (
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
```

### Entidades de Catálogo

```sql
-- ============================================
-- 6. ASEGURADORA
-- ============================================
CREATE TABLE Aseguradora (
    aseguradora_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT 1
);

-- ============================================
-- 7. RAMO
-- ============================================
CREATE TABLE Ramo (
    ramo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1
);

-- ============================================
-- 8. PERIODICIDAD
-- ============================================
CREATE TABLE Periodicidad (
    periodicidad_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    meses INTEGER NOT NULL,
    dias_anticipacion_alerta INTEGER DEFAULT 7
);

-- ============================================
-- 9. METODO PAGO
-- ============================================
CREATE TABLE MetodoPago (
    metodo_pago_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    requiere_domiciliacion BOOLEAN DEFAULT 0
);
```

### Tabla de Auditoría

```sql
-- ============================================
-- 10. AUDITORIA POLIZA
-- ============================================
CREATE TABLE AuditoriaPoliza (
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
```

---

## 🚀 Índices Optimizados

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_cliente_rfc ON Cliente(rfc);
CREATE INDEX idx_cliente_nombre ON Cliente(nombre);
CREATE INDEX idx_poliza_cliente ON Poliza(cliente_id);
CREATE INDEX idx_poliza_numero ON Poliza(numero_poliza);
CREATE INDEX idx_recibo_poliza ON Recibo(poliza_id);
CREATE INDEX idx_recibo_fecha_corte ON Recibo(fecha_corte);
CREATE INDEX idx_recibo_estado ON Recibo(estado);

-- Reportes mensuales
CREATE INDEX idx_recibo_periodo ON Recibo(fecha_inicio_periodo, estado);
CREATE INDEX idx_poliza_vigencia ON Poliza(vigencia_fin, estado_pago);

-- Auditoría
CREATE INDEX idx_auditoria_poliza ON AuditoriaPoliza(poliza_id, fecha_modificacion);
CREATE INDEX idx_auditoria_usuario ON AuditoriaPoliza(usuario_id);

-- Documentos
CREATE INDEX idx_documento_cliente ON Documento(cliente_id);
CREATE INDEX idx_documento_poliza ON Documento(poliza_id);
```

---

## 📦 Datos Iniciales (Seeds)

### 1. Periodicidades

```sql
INSERT INTO Periodicidad (nombre, meses, dias_anticipacion_alerta) VALUES
('Mensual', 1, 7),
('Bimestral', 2, 10),
('Trimestral', 3, 15),
('Cuatrimestral', 4, 20),
('Semestral', 6, 30),
('Anual', 12, 45);
```

### 2. Métodos de Pago

```sql
INSERT INTO MetodoPago (nombre, requiere_domiciliacion) VALUES
('Domiciliado', 1),
('Transferencia Bancaria', 0),
('Cheque', 0),
('Tarjeta de Crédito', 0),
('Tarjeta de Débito', 0),
('Efectivo', 0);
```

### 3. Aseguradoras

```sql
INSERT INTO Aseguradora (nombre) VALUES
('GNP Seguros'),
('AXA Seguros'),
('MAPFRE'),
('Seguros SURA'),
('Quálitas'),
('HDI Seguros'),
('Banorte Seguros'),
('Chubb Seguros'),
('Zurich Seguros'),
('MetLife');
```

### 4. Ramos de Seguros

```sql
INSERT INTO Ramo (nombre, descripcion) VALUES
('Automóvil', 'Seguro de vehículos automotores'),
('Vida', 'Seguro de vida individual y colectivo'),
('Gastos Médicos Mayores', 'Cobertura de gastos médicos'),
('Daños', 'Seguros de daños a bienes'),
('Hogar', 'Seguro para vivienda y contenidos'),
('Responsabilidad Civil', 'Cobertura de responsabilidad civil'),
('Accidentes Personales', 'Seguro contra accidentes'),
('Transporte', 'Seguro de mercancías y transporte'),
('Incendio', 'Seguro contra incendio'),
('Robo', 'Seguro contra robo y asalto');
```

### 5. Usuario Administrador Inicial

```sql
-- Nota: Usar bcrypt en la aplicación real para generar el hash
-- Este es solo un ejemplo (password: Admin123!)
INSERT INTO Usuario (
    username,
    email,
    password_hash,
    salt,
    rol,
    fecha_ultimo_cambio_password
) VALUES (
    'admin',
    'admin@segurosvillalobos.com',
    '$2b$10$rOFLvT9F7WqW5dMxF1jOZeXGxXqYxZxZxZxZxZxZxZxZxZxZxZx', -- Hash ejemplo
    'random_salt_32_characters_here',
    'admin',
    CURRENT_TIMESTAMP
);
```

---

## 🔄 Plan de Migración desde BD Actual

### Paso 1: Backup de Datos Actuales

```bash
# Hacer copia de seguridad
cp gestor_db.sqlite gestor_db_backup_$(date +%Y%m%d).sqlite
```

### Paso 2: Crear Nueva Estructura

```javascript
// migration/migrate_v2.js
const Database = require('better-sqlite3');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

function migrateDatabase() {
    const oldDb = new Database('gestor_db.sqlite');
    const newDb = new Database('gestor_db_v2.sqlite');

    // 1. Crear nuevas tablas (ejecutar schema completo)
    newDb.exec(fs.readFileSync('migration/schema_v2.sql', 'utf8'));

    // 2. Migrar usuarios existentes
    const oldUsers = oldDb.prepare('SELECT * FROM users').all();

    for (const user of oldUsers) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = bcrypt.hashSync(user.password, 10);

        newDb.prepare(`
            INSERT INTO Usuario (
                username, password_hash, salt, rol,
                fecha_ultimo_cambio_password
            ) VALUES (?, ?, ?, 'admin', CURRENT_TIMESTAMP)
        `).run(user.username, hash, salt);
    }

    // 3. Insertar datos semilla
    newDb.exec(fs.readFileSync('migration/seeds.sql', 'utf8'));

    console.log('✅ Migración completada');

    oldDb.close();
    newDb.close();
}
```

### Paso 3: Validación Post-Migración

```sql
-- Verificar migración exitosa
SELECT 'Usuarios migrados:', COUNT(*) FROM Usuario;
SELECT 'Periodicidades:', COUNT(*) FROM Periodicidad;
SELECT 'Aseguradoras:', COUNT(*) FROM Aseguradora;
SELECT 'Ramos:', COUNT(*) FROM Ramo;
SELECT 'Métodos de pago:', COUNT(*) FROM MetodoPago;
```

---

## 📊 Triggers Automáticos

### 1. Actualizar fecha_modificacion

```sql
-- Para tabla Cliente
CREATE TRIGGER update_cliente_timestamp
AFTER UPDATE ON Cliente
FOR EACH ROW
BEGIN
    UPDATE Cliente
    SET fecha_modificacion = CURRENT_TIMESTAMP
    WHERE cliente_id = NEW.cliente_id;
END;

-- Repetir para Poliza, Recibo, Usuario, etc.
```

### 2. Auditoría Automática en Pólizas

```sql
CREATE TRIGGER audit_poliza_update
AFTER UPDATE ON Poliza
FOR EACH ROW
BEGIN
    INSERT INTO AuditoriaPoliza (
        poliza_id, usuario_id, accion,
        campo_modificado, valor_anterior, valor_nuevo
    )
    -- Detectar qué campos cambiaron
    SELECT
        NEW.poliza_id,
        1, -- TODO: obtener usuario_id del contexto
        'UPDATE',
        'estado_pago',
        OLD.estado_pago,
        NEW.estado_pago
    WHERE OLD.estado_pago != NEW.estado_pago;
END;
```

### 3. Generación Automática de Recibos

```sql
CREATE TRIGGER generar_recibos_poliza
AFTER INSERT ON Poliza
FOR EACH ROW
BEGIN
    -- Generar recibos según periodicidad
    -- Ejemplo: póliza anual con pago mensual = 12 recibos
    INSERT INTO Recibo (
        poliza_id,
        fecha_inicio_periodo,
        fecha_fin_periodo,
        numero_fraccion,
        monto,
        fecha_corte,
        fecha_vencimiento_original
    )
    WITH RECURSIVE
    meses(n) AS (
        SELECT 0
        UNION ALL
        SELECT n + 1 FROM meses
        WHERE n < (
            SELECT 12 / meses FROM Periodicidad
            WHERE periodicidad_id = NEW.periodicidad_id
        ) - 1
    )
    SELECT
        NEW.poliza_id,
        DATE(NEW.vigencia_inicio, '+' || (n * (
            SELECT meses FROM Periodicidad
            WHERE periodicidad_id = NEW.periodicidad_id
        )) || ' months'),
        DATE(NEW.vigencia_inicio, '+' || ((n + 1) * (
            SELECT meses FROM Periodicidad
            WHERE periodicidad_id = NEW.periodicidad_id
        )) || ' months', '-1 day'),
        n + 1,
        NEW.prima_total / (
            SELECT 12 / meses FROM Periodicidad
            WHERE periodicidad_id = NEW.periodicidad_id
        ),
        DATE(NEW.vigencia_inicio, '+' || ((n + 1) * (
            SELECT meses FROM Periodicidad
            WHERE periodicidad_id = NEW.periodicidad_id
        )) || ' months', '-1 day'),
        DATE(NEW.vigencia_inicio, '+' || ((n + 1) * (
            SELECT meses FROM Periodicidad
            WHERE periodicidad_id = NEW.periodicidad_id
        )) || ' months', '-1 day')
    FROM meses;
END;
```

---

## 🔍 Consultas Comunes Optimizadas

### 1. Dashboard - Recibos por Vencer

```sql
-- Recibos que vencen en los próximos 30 días
SELECT
    r.recibo_id,
    p.numero_poliza,
    c.nombre AS cliente,
    r.monto,
    r.fecha_corte,
    CAST(JULIANDAY(r.fecha_corte) - JULIANDAY('now') AS INTEGER) AS dias_restantes,
    CASE
        WHEN JULIANDAY(r.fecha_corte) - JULIANDAY('now') <= 7 THEN 'rojo'
        WHEN JULIANDAY(r.fecha_corte) - JULIANDAY('now') <= per.dias_anticipacion_alerta THEN 'amarillo'
        ELSE 'verde'
    END AS alerta
FROM Recibo r
JOIN Poliza p ON r.poliza_id = p.poliza_id
JOIN Cliente c ON p.cliente_id = c.cliente_id
JOIN Periodicidad per ON p.periodicidad_id = per.periodicidad_id
WHERE r.estado = 'pendiente'
  AND r.fecha_corte BETWEEN DATE('now') AND DATE('now', '+30 days')
ORDER BY r.fecha_corte ASC;
```

### 2. Historial de Cliente

```sql
-- Todas las pólizas de un cliente con estado actual
SELECT
    p.numero_poliza,
    a.nombre AS aseguradora,
    ra.nombre AS ramo,
    p.vigencia_inicio,
    p.vigencia_fin,
    p.prima_total,
    p.estado_pago,
    COUNT(r.recibo_id) AS total_recibos,
    SUM(CASE WHEN r.estado = 'pagado' THEN 1 ELSE 0 END) AS recibos_pagados
FROM Poliza p
JOIN Cliente c ON p.cliente_id = c.cliente_id
JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
JOIN Ramo ra ON p.ramo_id = ra.ramo_id
LEFT JOIN Recibo r ON p.poliza_id = r.poliza_id
WHERE c.rfc = ?
  AND p.activo = 1
GROUP BY p.poliza_id
ORDER BY p.vigencia_inicio DESC;
```

### 3. Reporte Mensual de Cobranza

```sql
-- Resumen de pagos del mes
SELECT
    strftime('%Y-%m', r.fecha_pago) AS mes,
    COUNT(*) AS recibos_cobrados,
    SUM(r.monto) AS monto_total,
    a.nombre AS aseguradora
FROM Recibo r
JOIN Poliza p ON r.poliza_id = p.poliza_id
JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
WHERE r.estado = 'pagado'
  AND r.fecha_pago >= DATE('now', 'start of month', '-3 months')
GROUP BY mes, a.aseguradora_id
ORDER BY mes DESC, monto_total DESC;
```

### 4. Auditoría de Cambios en Póliza

```sql
-- Historial completo de modificaciones
SELECT
    au.fecha_modificacion,
    u.username AS modificado_por,
    au.accion,
    au.campo_modificado,
    au.valor_anterior,
    au.valor_nuevo
FROM AuditoriaPoliza au
JOIN Usuario u ON au.usuario_id = u.usuario_id
WHERE au.poliza_id = ?
ORDER BY au.fecha_modificacion DESC;
```

---

## 📈 Vistas Útiles

### Vista: Pólizas Activas con Alertas

```sql
CREATE VIEW PolizasConAlertas AS
SELECT
    p.poliza_id,
    p.numero_poliza,
    c.nombre AS cliente,
    c.rfc,
    p.vigencia_fin,
    CAST(JULIANDAY(p.vigencia_fin) - JULIANDAY('now') AS INTEGER) AS dias_para_vencer,
    COUNT(r.recibo_id) AS total_recibos,
    SUM(CASE WHEN r.estado = 'pendiente' THEN 1 ELSE 0 END) AS recibos_pendientes,
    SUM(CASE WHEN r.estado = 'vencido' THEN 1 ELSE 0 END) AS recibos_vencidos
FROM Poliza p
JOIN Cliente c ON p.cliente_id = c.cliente_id
LEFT JOIN Recibo r ON p.poliza_id = r.poliza_id
WHERE p.activo = 1
GROUP BY p.poliza_id;
```

### Vista: Dashboard Principal

```sql
CREATE VIEW DashboardMetrics AS
SELECT
    (SELECT COUNT(*) FROM Cliente WHERE activo = 1) AS total_clientes,
    (SELECT COUNT(*) FROM Poliza WHERE activo = 1) AS total_polizas_activas,
    (SELECT COUNT(*) FROM Recibo WHERE estado = 'pendiente') AS recibos_pendientes,
    (SELECT COUNT(*) FROM Recibo WHERE estado = 'vencido') AS recibos_vencidos,
    (SELECT SUM(monto) FROM Recibo WHERE estado = 'pendiente') AS monto_por_cobrar,
    (SELECT SUM(monto) FROM Recibo
     WHERE estado = 'pagado'
       AND fecha_pago >= DATE('now', 'start of month')) AS cobrado_mes_actual;
```

---

## ⚙️ Configuración de la Aplicación

### Actualizar `models/database.js`

```javascript
// models/database.js
const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
    constructor(dbName = "gestor_db_v2.sqlite") {
        const dbPath = path.join(__dirname, '..', dbName);
        this.db = new Database(dbPath);

        // Habilitar foreign keys
        this.db.pragma('foreign_keys = ON');

        // Optimizaciones
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('synchronous = NORMAL');

        this._initialize();
    }

    _initialize() {
        const fs = require('fs');

        // Verificar si la BD ya está inicializada
        const tables = this.db.prepare(`
            SELECT name FROM sqlite_master
            WHERE type='table' AND name='Usuario'
        `).all();

        if (tables.length === 0) {
            console.log('🔧 Inicializando base de datos...');

            // Ejecutar schema
            const schema = fs.readFileSync(
                path.join(__dirname, '..', 'migration', 'schema_v2.sql'),
                'utf8'
            );
            this.db.exec(schema);

            // Ejecutar seeds
            const seeds = fs.readFileSync(
                path.join(__dirname, '..', 'migration', 'seeds.sql'),
                'utf8'
            );
            this.db.exec(seeds);

            console.log('✅ Base de datos inicializada');
        }
    }

    getConnection() {
        return this.db;
    }

    close() {
        this.db.close();
    }
}

module.exports = new DatabaseManager();
```

---

## 🔒 Seguridad - Implementación de Hashing

### Actualizar `models/user_model.js`

```javascript
// models/user_model.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserModel {
    constructor(db) {
        this.db = db;
    }

    async createUser(username, email, password, rol = 'operador') {
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = await bcrypt.hash(password, 10);

        const stmt = this.db.prepare(`
            INSERT INTO Usuario (
                username, email, password_hash, salt, rol,
                fecha_ultimo_cambio_password
            ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);

        return stmt.run(username, email, passwordHash, salt, rol);
    }

    async checkCredentials(username, password) {
        const user = this.db.prepare(`
            SELECT * FROM Usuario
            WHERE username = ? AND activo = 1 AND bloqueado = 0
        `).get(username);

        if (!user) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (isValid) {
            // Actualizar último acceso
            this.db.prepare(`
                UPDATE Usuario
                SET ultimo_acceso = CURRENT_TIMESTAMP,
                    intentos_fallidos = 0
                WHERE usuario_id = ?
            `).run(user.usuario_id);

            return {
                usuario_id: user.usuario_id,
                username: user.username,
                email: user.email,
                rol: user.rol
            };
        } else {
            // Incrementar intentos fallidos
            this.db.prepare(`
                UPDATE Usuario
                SET intentos_fallidos = intentos_fallidos + 1,
                    bloqueado = CASE
                        WHEN intentos_fallidos >= 5 THEN 1
                        ELSE 0
                    END
                WHERE usuario_id = ?
            `).run(user.usuario_id);

            return null;
        }
    }
}

module.exports = UserModel;
```

---

## 📊 Métricas de Rendimiento Esperadas

### Comparativa Antes/Después

| Métrica | Antes (Simple) | Después (Optimizado) | Mejora |
|---------|----------------|----------------------|--------|
| Consulta usuario | ~1ms | ~1ms | = |
| Listado 1000 pólizas | N/A | ~15ms | 🆕 |
| Búsqueda por RFC | N/A | ~2ms | 🆕 |
| Dashboard completo | N/A | ~25ms | 🆕 |
| Generación recibos | N/A | ~50ms (automático) | 🆕 |

### Capacidad Estimada

- **Clientes:** +100,000 sin degradación
- **Pólizas:** +500,000 con índices
- **Recibos:** +5,000,000 (particionable por año)
- **Auditoría:** +10,000,000 (archivar histórico)

---

## 🎯 Roadmap de Implementación

### Fase 1: Fundación (Semana 1)
- [x] Diseño del schema mejorado
- [ ] Crear scripts de migración
- [ ] Implementar DatabaseManager
- [ ] Testing de schema en BD vacía

### Fase 2: Migración (Semana 2)
- [ ] Backup de BD actual
- [ ] Ejecutar migración
- [ ] Validar datos migrados
- [ ] Actualizar modelos

### Fase 3: Modelos (Semana 3)
- [ ] ClienteModel
- [ ] PolizaModel
- [ ] ReciboModel
- [ ] DocumentoModel

### Fase 4: Seguridad (Semana 4)
- [ ] Implementar bcrypt
- [ ] Sistema de roles
- [ ] Auditoría de cambios
- [ ] Tests de seguridad

### Fase 5: UI (Semana 5-6)
- [ ] CRUD de clientes
- [ ] Gestión de pólizas
- [ ] Dashboard con alertas
- [ ] Reportes

---

## 📚 Referencias

- **SQLite Docs:** https://www.sqlite.org/docs.html
- **better-sqlite3:** https://github.com/WiseLibs/better-sqlite3
- **bcrypt:** https://www.npmjs.com/package/bcrypt
- **Electron SQLite:** https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules

---

## ✅ Checklist de Implementación

```markdown
- [ ] Revisar y aprobar schema propuesto
- [ ] Instalar dependencia bcrypt: `npm install bcrypt`
- [ ] Crear carpeta `migration/` con scripts SQL
- [ ] Ejecutar backup de BD actual
- [ ] Implementar DatabaseManager
- [ ] Crear modelos para cada entidad
- [ ] Actualizar main.js para usar nueva BD
- [ ] Actualizar vistas (HTML) con nuevos campos
- [ ] Implementar sistema de roles en UI
- [ ] Testing completo
- [ ] Documentar cambios en README
```

---

**Fin de la propuesta** 🎉

¿Preguntas o sugerencias? Contacta al equipo de desarrollo.
