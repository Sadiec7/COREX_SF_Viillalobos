# Especificaciones Completas - Sistema de Gestión de Pólizas
## Seguros Fianzas VILLALOBOS

**Fecha de Consolidación:** 19 Octubre 2025
**Versión Modelo Original:** v1
**Versión Propuesta Mejorada:** v2.0

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Modelo de Entidades Original (v1)](#modelo-de-entidades-original-v1)
3. [Propuesta de Mejora (v2.0)](#propuesta-de-mejora-v20)
4. [Comparativa v1 vs v2](#comparativa-v1-vs-v2)
5. [Estructura del Proyecto Actual](#estructura-del-proyecto-actual)
6. [Plan de Implementación](#plan-de-implementación)

---

## Resumen Ejecutivo

Este documento consolida las especificaciones completas del Sistema de Gestión de Pólizas para Seguros Fianzas VILLALOBOS, incluyendo:

- **Modelo de Entidades v1**: Especificaciones originales del sistema
- **Propuesta v2.0**: Mejoras propuestas basadas en el análisis del proyecto actual
- **Estado Actual**: Análisis de la implementación existente

### Objetivos del Sistema

1. Gestión integral de clientes y sus datos personales
2. Control de pólizas de seguros con múltiples aseguradoras
3. Gestión de recibos y alertas de vencimiento
4. Sistema de autenticación y seguridad
5. Gestión opcional de documentos adjuntos
6. Reportes y dashboard de métricas

---

## Modelo de Entidades Original (v1)

### 1. Entidades Principales

#### 1.1 Cliente

**Propósito:** Almacenar información de los asegurados y mantener historial por cliente.

**Atributos:**
- `rfc` (PK) - VARCHAR(13) - RFC del cliente (clave primaria)
- `nombre` - VARCHAR(255) - Nombre completo del cliente
- `telefono` - VARCHAR(20) - Número telefónico
- `correo` - VARCHAR(100) - Correo electrónico
- `direccion` - TEXT - Dirección completa
- `fecha_nacimiento` - DATE - Fecha de nacimiento
- `fecha_creacion` - DATETIME - Fecha de registro en el sistema
- `fecha_modificacion` - DATETIME - Última modificación

#### 1.2 Poliza

**Propósito:** Registro central de las pólizas de seguros con toda su información relevante.

**Atributos:**
- `poliza_id` (PK) - INTEGER - Identificador interno único
- `numero_poliza` - VARCHAR(20) - Número de póliza de la aseguradora (único)
- `cliente_rfc` (FK) - VARCHAR(13) - RFC del cliente titular
- `aseguradora_id` (FK) - INTEGER - Referencia a la aseguradora
- `ramo_id` (FK) - INTEGER - Tipo de seguro (ramo)
- `tipo_poliza` - VARCHAR(20) - Nuevo o renovación
- `prima_neta` - DECIMAL(10,2) - Prima sin impuestos
- `prima_total` - DECIMAL(10,2) - Prima total con impuestos
- `vigencia_inicio` - DATE - Fecha de inicio de vigencia
- `vigencia_fin` - DATE - Fecha de fin de vigencia
- `vigencia_renovacion_automatica` - BOOLEAN - Si se renueva automáticamente
- `periodicidad_id` (FK) - INTEGER - Frecuencia de pago
- `metodo_pago_id` (FK) - INTEGER - Método de pago
- `domiciliada` - BOOLEAN - Si el pago está domiciliado
- `estado_pago` - VARCHAR(20) - Estado general de pagos
- `fecha_creacion` - DATETIME - Fecha de registro
- `fecha_modificacion` - DATETIME - Última modificación

#### 1.3 Recibo

**Propósito:** Control de fracciones de pago y generación de alertas de vencimiento.

**Atributos:**
- `recibo_id` (PK) - INTEGER - Identificador único del recibo
- `poliza_id` (FK) - INTEGER - Referencia a la póliza
- `periodo` - VARCHAR(6) - Período del recibo (AAAAMM)
- `numero_fraccion` - INTEGER - Número de fracción (1, 2, 3...)
- `monto` - DECIMAL(10,2) - Monto a pagar
- `fecha_corte` - DATE - Fecha límite de pago
- `fecha_vencimiento_original` - DATE - Fecha original (backup)
- `dias_gracia` - INTEGER - Días de gracia permitidos
- `estado` - VARCHAR(20) - Pendiente/Pagado/Vencido
- `fecha_pago` - DATETIME - Fecha real de pago (nullable)
- `fecha_creacion` - DATETIME - Fecha de registro
- `fecha_modificacion` - DATETIME - Última modificación

#### 1.4 Usuario

**Propósito:** Control de acceso y seguridad de la aplicación.

**Atributos:**
- `usuario_id` (PK) - INTEGER - Identificador único
- `username` - VARCHAR(50) - Nombre de usuario
- `password_hash` - VARCHAR(255) - Contraseña encriptada
- `salt` - VARCHAR(32) - Salt para encriptación
- `ultimo_acceso` - DATETIME - Último inicio de sesión
- `activo` - BOOLEAN - Usuario activo/inactivo
- `intentos_fallidos` - INTEGER - Intentos de login fallidos
- `fecha_creacion` - DATETIME - Fecha de registro
- `fecha_modificacion` - DATETIME - Última modificación

#### 1.5 Documento

**Propósito:** Gestión opcional de documentos adjuntos a clientes o pólizas.

**Atributos:**
- `documento_id` (PK) - INTEGER - Identificador único
- `cliente_rfc` (FK) - VARCHAR(13) - RFC del cliente (nullable)
- `poliza_id` (FK) - INTEGER - ID de póliza (nullable)
- `tipo` - VARCHAR(50) - Tipo de documento (INE, CURP, etc.)
- `nombre_archivo` - VARCHAR(255) - Nombre del archivo
- `ruta_archivo` - TEXT - Ruta completa del archivo
- `fecha_creacion` - DATETIME - Fecha de registro

### 2. Entidades de Catálogo

#### 2.1 Aseguradora

**Propósito:** Catálogo de compañías aseguradoras.

**Atributos:**
- `aseguradora_id` (PK) - INTEGER - Identificador único
- `nombre` - VARCHAR(100) - Nombre de la aseguradora

#### 2.2 Ramo

**Propósito:** Catálogo de tipos de seguros.

**Atributos:**
- `ramo_id` (PK) - INTEGER - Identificador único
- `nombre` - VARCHAR(50) - Nombre del ramo de seguro

#### 2.3 Periodicidad

**Propósito:** Catálogo de frecuencias de pago y configuración de alertas.

**Atributos:**
- `periodicidad_id` (PK) - INTEGER - Identificador único
- `nombre` - VARCHAR(20) - Nombre (mensual, trimestral, etc.)
- `meses` - INTEGER - Cantidad de meses del período
- `dias_anticipacion_alerta` - INTEGER - Días antes para alerta amarilla

#### 2.4 MetodoPago

**Propósito:** Catálogo de métodos de pago disponibles.

**Atributos:**
- `metodo_pago_id` (PK) - INTEGER - Identificador único
- `nombre` - VARCHAR(50) - Nombre del método de pago

### 3. Relaciones

#### 3.1 Relaciones Principales (1:N)

**Cliente → Poliza (1:N)**
- Un cliente puede tener múltiples pólizas
- FK: `Poliza.cliente_rfc` → `Cliente.rfc`

**Poliza → Recibo (1:N)**
- Una póliza genera múltiples recibos (fracciones)
- FK: `Recibo.poliza_id` → `Poliza.poliza_id`

#### 3.2 Relaciones de Catálogo (1:N)

- **Aseguradora → Poliza (1:N)**
  - FK: `Poliza.aseguradora_id` → `Aseguradora.aseguradora_id`

- **Ramo → Poliza (1:N)**
  - FK: `Poliza.ramo_id` → `Ramo.ramo_id`

- **Periodicidad → Poliza (1:N)**
  - FK: `Poliza.periodicidad_id` → `Periodicidad.periodicidad_id`

- **MetodoPago → Poliza (1:N)**
  - FK: `Poliza.metodo_pago_id` → `MetodoPago.metodo_pago_id`

#### 3.3 Relaciones Opcionales

**Cliente → Documento (1:N)** - Opcional
- FK: `Documento.cliente_rfc` → `Cliente.rfc`

**Poliza → Documento (1:N)** - Opcional
- FK: `Documento.poliza_id` → `Poliza.poliza_id`

### 4. Constraints y Reglas de Negocio

#### 4.1 Llaves Únicas

- `Cliente.rfc` - RFC único por cliente
- `Poliza.numero_poliza` - Número de póliza único
- `Usuario.username` - Nombre de usuario único
- `Recibo(poliza_id, periodo, numero_fraccion)` - Combinación única

#### 4.2 Validaciones

- `Documento`: Debe tener al menos `cliente_rfc` o `poliza_id`
- `Recibo.fecha_pago`: Nullable, solo se llena cuando está pagado
- `Poliza.vigencia_fin` > `Poliza.vigencia_inicio`
- `Recibo.monto` > 0
- `Prima_total` >= `Prima_neta`

#### 4.3 Estados Válidos

- `Poliza.estado_pago`: 'pendiente', 'pagado', 'vencido'
- `Recibo.estado`: 'pendiente', 'pagado', 'vencido'
- `Poliza.tipo_poliza`: 'nuevo', 'renovacion'

### 5. Índices Sugeridos

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_poliza_cliente ON Poliza(cliente_rfc);
CREATE INDEX idx_recibo_poliza ON Recibo(poliza_id);
CREATE INDEX idx_recibo_fecha_corte ON Recibo(fecha_corte);
CREATE INDEX idx_poliza_vigencia ON Poliza(vigencia_fin);

-- Reportes mensuales
CREATE INDEX idx_recibo_periodo_estado ON Recibo(periodo, estado);
```

### 6. Notas de Implementación

#### 6.1 Campos Calculados (No Persistidos)

- **Días para vencimiento**: Calculado dinámicamente desde `Recibo.fecha_corte`
- **Estado de alerta**: Derivado de días restantes + `Periodicidad.dias_anticipacion_alerta`
- **Estado general de póliza**: Agregación de estados de recibos

#### 6.2 Triggers Sugeridos

- Actualizar `fecha_modificacion` en UPDATE
- Validar coherencia de fechas de vigencia
- Generar recibos automáticamente al crear póliza

#### 6.3 Datos Iniciales Requeridos

- **Periodicidades**: mensual=1, trimestral=3, semestral=6, anual=12
- **Métodos de pago**: domiciliado, transferencia, cheque, tarjeta
- **Aseguradoras**: GNP, AXA, MAPFRE, SURA, QUALITAS
- **Ramos**: automóvil, vida, gastos médicos, casa, etc.

---

## Propuesta de Mejora (v2.0)

### Análisis del Estado Actual

**Base de Datos Actual:**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL  -- ⚠️ Sin hash, texto plano
)
```

**Problemas Identificados:**
- ❌ Contraseñas en texto plano (grave riesgo de seguridad)
- ❌ No hay roles ni permisos
- ❌ No hay sistema de auditoría
- ❌ No hay tablas para pólizas, clientes, recibos

### Mejoras Propuestas

#### 1. Cliente - Optimización de Primary Key

**Cambio:**
- **v1**: `rfc VARCHAR(13) PRIMARY KEY`
- **v2**: `cliente_id INTEGER PRIMARY KEY AUTOINCREMENT` + `rfc VARCHAR(13) UNIQUE NOT NULL`

**Razones:**
- ✅ Más eficiente en JOINs (INTEGER vs VARCHAR)
- ✅ Permite corrección de RFC sin romper FKs
- ✅ Mejor performance en índices

**Schema v2:**
```sql
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
```

#### 2. Usuario - Seguridad y Roles Mejorados

**Mejoras:**
- ✅ Email para recuperación de contraseña
- ✅ Sistema de roles (admin/operador/lectura)
- ✅ Bloqueo de cuenta por intentos fallidos
- ✅ Política de cambio de contraseña

**Schema v2:**
```sql
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
```

#### 3. Soft Deletes - Integridad Histórica

**Campos agregados a Cliente, Poliza, Recibo:**
```sql
activo BOOLEAN DEFAULT 1,
fecha_eliminacion DATETIME NULL,
usuario_eliminacion_id INTEGER NULL
```

**Beneficios:**
- ✅ Mantener historial completo
- ✅ Recuperación de datos eliminados
- ✅ Auditoría de eliminaciones

#### 4. Sistema de Auditoría Completo

**Nueva tabla:**
```sql
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

#### 5. Recibo.periodo - Mejora de Tipo de Dato

**v1:**
```sql
periodo VARCHAR(6)  -- AAAAMM como texto
```

**v2 (Propuesta):**
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

### Schema SQL Completo v2.0

#### Tabla Poliza v2

```sql
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
```

#### Tabla Recibo v2

```sql
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
```

#### Catálogos Mejorados

```sql
-- Aseguradora
CREATE TABLE Aseguradora (
    aseguradora_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT 1
);

-- Ramo
CREATE TABLE Ramo (
    ramo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1
);

-- Periodicidad
CREATE TABLE Periodicidad (
    periodicidad_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    meses INTEGER NOT NULL,
    dias_anticipacion_alerta INTEGER DEFAULT 7
);

-- Metodo Pago
CREATE TABLE MetodoPago (
    metodo_pago_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    requiere_domiciliacion BOOLEAN DEFAULT 0
);
```

### Índices Optimizados v2

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

### Datos Iniciales (Seeds) v2

#### Periodicidades
```sql
INSERT INTO Periodicidad (nombre, meses, dias_anticipacion_alerta) VALUES
('Mensual', 1, 7),
('Bimestral', 2, 10),
('Trimestral', 3, 15),
('Cuatrimestral', 4, 20),
('Semestral', 6, 30),
('Anual', 12, 45);
```

#### Métodos de Pago
```sql
INSERT INTO MetodoPago (nombre, requiere_domiciliacion) VALUES
('Domiciliado', 1),
('Transferencia Bancaria', 0),
('Cheque', 0),
('Tarjeta de Crédito', 0),
('Tarjeta de Débito', 0),
('Efectivo', 0);
```

#### Aseguradoras
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

#### Ramos de Seguros
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

### Triggers Automáticos v2

#### Actualizar fecha_modificacion
```sql
CREATE TRIGGER update_cliente_timestamp
AFTER UPDATE ON Cliente
FOR EACH ROW
BEGIN
    UPDATE Cliente
    SET fecha_modificacion = CURRENT_TIMESTAMP
    WHERE cliente_id = NEW.cliente_id;
END;
```

#### Auditoría Automática
```sql
CREATE TRIGGER audit_poliza_update
AFTER UPDATE ON Poliza
FOR EACH ROW
BEGIN
    INSERT INTO AuditoriaPoliza (
        poliza_id, usuario_id, accion,
        campo_modificado, valor_anterior, valor_nuevo
    )
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

### Consultas Comunes Optimizadas

#### Dashboard - Recibos por Vencer
```sql
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

#### Historial de Cliente
```sql
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

#### Reporte Mensual de Cobranza
```sql
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

### Vistas Útiles

#### Vista: Pólizas Activas con Alertas
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

#### Vista: Dashboard Principal
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

## Comparativa v1 vs v2

| Aspecto | v1 (Original) | v2 (Propuesta) | Mejora |
|---------|---------------|----------------|--------|
| **Cliente PK** | RFC (VARCHAR) | cliente_id (INTEGER) | ✅ +30% performance en JOINs |
| **Usuario** | Sin roles | 3 roles (admin/operador/lectura) | ✅ Control de acceso |
| **Seguridad** | Sin especificar | bcrypt + salt + intentos fallidos | ✅ Seguridad mejorada |
| **Auditoría** | No existe | Tabla AuditoriaPoliza | ✅ Trazabilidad completa |
| **Soft Deletes** | No | Sí (campo activo) | ✅ Integridad histórica |
| **Recibo.periodo** | VARCHAR(6) | DATE + campo generado | ✅ Mejor ordenamiento |
| **Catálogos** | Básicos | Con campo activo y descripción | ✅ Más flexibilidad |
| **Índices** | 5 índices | 13 índices optimizados | ✅ Mejor rendimiento |
| **Triggers** | Sugeridos | Implementados | ✅ Automatización |
| **Vistas** | No | 2 vistas útiles | ✅ Consultas simplificadas |

---

## Estructura del Proyecto Actual

### Stack Tecnológico

**Core:**
- Electron - Framework de aplicación de escritorio
- Node.js - Runtime de JavaScript
- HTML5/CSS3/JavaScript - Frontend vanilla

**Styling:**
- Tailwind CSS - Framework CSS utility-first
- CSS Custom - Animaciones y efectos avanzados

**Base de Datos:**
- SQLite - Base de datos local
- better-sqlite3 - Driver nativo
- **Actualmente:** Mock data en desarrollo

### Arquitectura MVC

```
projecttest/
├── assets/                    # Recursos estáticos
│   └── images/               # Logos e imágenes
│       ├── logo.png          # Logo pequeño (sidebar)
│       └── logo-with-text.png # Logo completo (login)
├── controllers/              # Controladores MVC
│   ├── login_controller.js   # ❌ Implementado
│   ├── clientes_controller.js # ⚠️ En desarrollo
│   └── polizas_controller.js  # ❌ No implementado
├── models/                   # Modelos de datos
│   ├── database.js           # ❌ No existe
│   ├── user_model.js         # ⚠️ SQLite básico
│   ├── user_model_mock.js    # ✅ Mock activo
│   ├── cliente_model.js      # ❌ No existe
│   └── poliza_model.js       # ❌ No existe
├── views/                    # Vistas de la aplicación
│   ├── login_view.html       # ✅ Implementado
│   ├── dashboard_view.html   # ✅ Implementado
│   ├── clientes_view.html    # ⚠️ Parcial
│   └── polizas_view.html     # ⚠️ Parcial
├── migration/                # ❌ No existe
├── main.js                   # ✅ Proceso principal Electron
├── preload.js               # ✅ Script de preload IPC
├── ipc-handlers.js          # ✅ Manejadores IPC
└── package.json             # ✅ Configuración del proyecto
```

### Base de Datos Actual

**Implementación actual:**
```sql
-- gestor_db.sqlite
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL  -- ⚠️ TEXTO PLANO
)
```

**Problemas críticos:**
1. ❌ Contraseñas sin hash (riesgo de seguridad)
2. ❌ No implementa modelo de entidades v1
3. ❌ No existen tablas de Cliente, Poliza, Recibo
4. ❌ No hay catálogos (Aseguradora, Ramo, etc.)
5. ❌ Sin sistema de auditoría
6. ❌ Sin soft deletes

### Funcionalidades Implementadas

**✅ Completadas:**
- Sistema de login básico
- Dashboard con métricas mock
- Navegación entre vistas
- Interfaz corporativa con branding
- Animaciones CSS

**⚠️ Parcialmente implementadas:**
- Vista de clientes (UI sin backend)
- Vista de pólizas (UI sin backend)

**❌ Pendientes:**
- CRUD de clientes
- Gestión de pólizas
- Sistema de recibos
- Alertas de vencimiento
- Reportes
- Gestión de documentos
- Catálogos de sistema

---

## Plan de Implementación

### Fase 1: Migración de Base de Datos (Semana 1)

**Objetivos:**
- Crear estructura completa v2.0
- Migrar usuarios existentes con hash
- Implementar DatabaseManager

**Tareas:**
1. Crear carpeta `/migration/`
2. Crear `schema_v2.sql` con todas las tablas
3. Crear `seeds.sql` con datos iniciales
4. Crear `migrate_v2.js` para migración
5. Hacer backup de BD actual
6. Ejecutar migración
7. Validar datos migrados

**Archivos a crear:**
- `migration/schema_v2.sql`
- `migration/seeds.sql`
- `migration/migrate_v2.js`
- `models/database.js`

### Fase 2: Modelos de Datos (Semana 2-3)

**Objetivos:**
- Implementar modelos para todas las entidades
- Crear operaciones CRUD completas

**Tareas:**
1. Implementar `models/user_model.js` con bcrypt
2. Crear `models/cliente_model.js`
3. Crear `models/poliza_model.js`
4. Crear `models/recibo_model.js`
5. Crear `models/documento_model.js`
6. Crear `models/catalogos_model.js`

### Fase 3: Controladores (Semana 4)

**Objetivos:**
- Implementar lógica de negocio
- Conectar modelos con vistas

**Tareas:**
1. Actualizar `controllers/login_controller.js`
2. Crear `controllers/clientes_controller.js`
3. Crear `controllers/polizas_controller.js`
4. Crear `controllers/recibos_controller.js`
5. Crear `controllers/dashboard_controller.js`
6. Actualizar `ipc-handlers.js`

### Fase 4: Vistas y UI (Semana 5-6)

**Objetivos:**
- Implementar interfaces completas
- Conectar con controladores

**Tareas:**
1. Completar `views/clientes_view.html`
2. Completar `views/polizas_view.html`
3. Crear `views/recibos_view.html`
4. Mejorar `views/dashboard_view.html`
5. Crear formularios de catálogos
6. Implementar sistema de alertas

### Fase 5: Funcionalidades Avanzadas (Semana 7-8)

**Objetivos:**
- Implementar reportes
- Sistema de alertas
- Gestión de documentos

**Tareas:**
1. Dashboard con métricas reales
2. Alertas de vencimiento
3. Reportes mensuales
4. Gestión de documentos
5. Sistema de auditoría visible
6. Exportación a Excel/PDF

### Fase 6: Testing y Refinamiento (Semana 9-10)

**Objetivos:**
- Testing completo
- Optimización de rendimiento
- Documentación

**Tareas:**
1. Testing de todos los CRUDs
2. Validación de triggers
3. Testing de seguridad
4. Optimización de consultas
5. Documentación de usuario
6. Preparación para producción

---

## Checklist de Implementación Completa

### Base de Datos
- [ ] Crear `migration/schema_v2.sql`
- [ ] Crear `migration/seeds.sql`
- [ ] Implementar script de migración
- [ ] Ejecutar backup de BD actual
- [ ] Migrar usuarios con bcrypt
- [ ] Validar estructura completa
- [ ] Implementar triggers automáticos

### Modelos
- [ ] `models/database.js` con singleton pattern
- [ ] `models/user_model.js` con bcrypt y roles
- [ ] `models/cliente_model.js` con CRUD completo
- [ ] `models/poliza_model.js` con CRUD completo
- [ ] `models/recibo_model.js` con generación automática
- [ ] `models/documento_model.js`
- [ ] `models/catalogos_model.js`
- [ ] `models/auditoria_model.js`

### Controladores
- [ ] `controllers/auth_controller.js` mejorado
- [ ] `controllers/clientes_controller.js`
- [ ] `controllers/polizas_controller.js`
- [ ] `controllers/recibos_controller.js`
- [ ] `controllers/dashboard_controller.js`
- [ ] `controllers/reportes_controller.js`
- [ ] Actualizar `ipc-handlers.js`

### Vistas
- [ ] `views/login_view.html` con recuperación
- [ ] `views/dashboard_view.html` con datos reales
- [ ] `views/clientes_view.html` CRUD completo
- [ ] `views/polizas_view.html` CRUD completo
- [ ] `views/recibos_view.html` gestión y alertas
- [ ] `views/catalogos_view.html`
- [ ] `views/reportes_view.html`
- [ ] `views/perfil_view.html`

### Funcionalidades
- [ ] Sistema de login con roles
- [ ] CRUD de clientes
- [ ] CRUD de pólizas
- [ ] Gestión de recibos
- [ ] Alertas de vencimiento
- [ ] Dashboard con métricas reales
- [ ] Reportes mensuales
- [ ] Gestión de documentos
- [ ] Sistema de auditoría
- [ ] Exportación de reportes

### Seguridad
- [ ] Implementar bcrypt en producción
- [ ] Sistema de roles funcional
- [ ] Bloqueo por intentos fallidos
- [ ] Recuperación de contraseña
- [ ] Validación de permisos en UI
- [ ] Auditoría de acciones críticas
- [ ] Backup automático

### Testing
- [ ] Testing de autenticación
- [ ] Testing de CRUDs
- [ ] Testing de triggers
- [ ] Testing de alertas
- [ ] Testing de reportes
- [ ] Testing de rendimiento
- [ ] Testing de seguridad

---

## Dependencias Requeridas

### Actuales
```json
{
  "electron": "^latest",
  "better-sqlite3": "^9.x"
}
```

### A Agregar
```json
{
  "bcrypt": "^5.1.1",
  "winston": "^3.x" // Para logging
}
```

### Instalación
```bash
npm install bcrypt winston --save
```

---

## Métricas de Rendimiento Esperadas

| Operación | Objetivo | v1 Estimado | v2 Optimizado |
|-----------|----------|-------------|---------------|
| Login | < 100ms | 50ms | 80ms (por bcrypt) |
| Listar clientes (100) | < 50ms | 20ms | 15ms |
| Listar pólizas (1000) | < 100ms | N/A | 25ms |
| Búsqueda por RFC | < 10ms | N/A | 5ms |
| Dashboard completo | < 200ms | N/A | 50ms |
| Generar recibos | < 100ms | N/A | 30ms |
| Reporte mensual | < 300ms | N/A | 150ms |

### Capacidad del Sistema

- **Clientes:** > 100,000
- **Pólizas:** > 500,000
- **Recibos:** > 5,000,000
- **Registros de auditoría:** > 10,000,000

---

## Conclusiones

### Estado Actual
El proyecto tiene una base sólida con:
- ✅ Arquitectura MVC bien definida
- ✅ Interfaz moderna y atractiva
- ✅ Sistema de login funcional
- ⚠️ Base de datos limitada (solo usuarios)
- ❌ Funcionalidades principales no implementadas

### Próximos Pasos Críticos
1. **URGENTE:** Migrar a schema v2 con seguridad mejorada
2. Implementar modelos de datos completos
3. Crear CRUDs de Cliente y Póliza
4. Sistema de alertas de vencimiento
5. Dashboard con datos reales

### Riesgos Identificados
- 🔴 **CRÍTICO:** Contraseñas en texto plano
- 🟡 **ALTO:** Sin implementación del modelo de entidades
- 🟡 **MEDIO:** Sin sistema de backup
- 🟢 **BAJO:** Performance con grandes volúmenes

---

**Documento generado:** 19 Octubre 2025
**Versión:** 1.0
**Autor:** Sistema de Gestión Villalobos
**Próxima revisión:** Post-implementación Fase 1
