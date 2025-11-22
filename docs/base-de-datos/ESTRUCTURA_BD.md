# ESTRUCTURA DE BASE DE DATOS - Sistema de Finanzas Villalobos
## Referencia Completa de Schema v2.0

**Última actualización:** 18 de Noviembre, 2025
**Versión del Schema:** 2.0
**Motor:** SQLite vía sql.js (WebAssembly)
**Ubicación:** `gestor_polizas_v2.sqlite`

---

## Índice

1. [Resumen General](#resumen-general)
2. [Tablas Principales](#tablas-principales)
3. [Tablas de Catálogos](#tablas-de-catálogos)
4. [Relaciones y Foreign Keys](#relaciones-y-foreign-keys)
5. [Índices de Rendimiento](#índices-de-rendimiento)
6. [Changelog de Correcciones](#changelog-de-correcciones)
7. [Referencia Rápida de Columnas](#referencia-rápida-de-columnas)

---

## Resumen General

### Estadísticas
- **Total de tablas:** 10
- **Total de índices:** 13 (optimizados para hardware de baja gama)
- **Relaciones (FKs):** 11 foreign keys
- **Constraints:** 15+ restricciones de integridad

### Arquitectura
```
┌─────────────────┐
│     Usuario     │ ← Autenticación y roles
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│    Cliente      │────▶│   Poliza     │
└─────────────────┘     └──────────────┘
         │                      │
         │                      ├──────▶ Aseguradora (catálogo)
         │                      ├──────▶ Ramo (catálogo)
         │                      ├──────▶ Periodicidad (catálogo)
         │                      ├──────▶ MetodoPago (catálogo)
         │                      │
         ▼                      ▼
┌─────────────────┐     ┌──────────────┐
│   Documento     │     │   Recibo     │
└─────────────────┘     └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ AuditoriaPoliza│
                        └──────────────┘
```

---

## Tablas Principales

### 1. Cliente

Almacena información de clientes (personas físicas o morales).

```sql
CREATE TABLE Cliente (
    cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfc VARCHAR(13) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo_persona VARCHAR(20) DEFAULT 'Física',
    telefono VARCHAR(20),
    celular VARCHAR(20),
    correo VARCHAR(100),                    -- ⚠️ NOTA: No es correo_electronico
    direccion TEXT,
    notas TEXT,
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT 1,
    fecha_eliminacion DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Columnas clave:**
- `rfc`: **UNIQUE** - Identificador fiscal único
- `correo`: Email del cliente (NO usar `correo_electronico`)
- `activo`: Soft delete - 1 = activo, 0 = eliminado

**Constraints:**
- `tipo_persona IN ('Física', 'Moral')`

---

### 2. Poliza

Registro de pólizas de seguro.

```sql
CREATE TABLE Poliza (
    poliza_id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_poliza VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL,
    aseguradora_id INTEGER NOT NULL,
    ramo_id INTEGER NOT NULL,
    tipo_poliza VARCHAR(20) NOT NULL,
    prima_neta DECIMAL(10,2) NOT NULL,
    prima_total DECIMAL(10,2) NOT NULL,
    vigencia_inicio DATE NOT NULL,          -- ⚠️ NOTA: No es fecha_inicio_vigencia
    vigencia_fin DATE NOT NULL,             -- ⚠️ NOTA: No es fecha_fin_vigencia
    vigencia_renovacion_automatica BOOLEAN DEFAULT 0,
    periodicidad_id INTEGER NOT NULL,
    metodo_pago_id INTEGER NOT NULL,
    domiciliada BOOLEAN DEFAULT 0,
    estado_pago VARCHAR(20) DEFAULT 'pendiente',
    comision_porcentaje DECIMAL(5,2),
    suma_asegurada DECIMAL(15,2),
    notas TEXT,
    activo BOOLEAN DEFAULT 1,
    fecha_eliminacion DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,  -- ⚠️ Usar para tendencias, no fecha_emision
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

**Columnas clave:**
- `numero_poliza`: **UNIQUE** - Identificador de póliza
- `vigencia_inicio` / `vigencia_fin`: Periodo de cobertura (NO usar `fecha_inicio_vigencia`)
- `fecha_creacion`: Usar para tendencias temporales (NO existe `fecha_emision`)
- `estado_pago`: Estado del pago (pendiente/pagado/vencido)

**Constraints:**
- `tipo_poliza IN ('nuevo', 'renovacion')`
- `estado_pago IN ('pendiente', 'pagado', 'vencido')`

---

### 3. Recibo

Pagos fraccionados de pólizas.

```sql
CREATE TABLE Recibo (
    recibo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    poliza_id INTEGER NOT NULL,
    numero_recibo VARCHAR(50) NOT NULL,
    fecha_inicio_periodo DATE NOT NULL,
    fecha_fin_periodo DATE NOT NULL,
    numero_fraccion INTEGER NOT NULL,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha_corte DATE NOT NULL,
    fecha_vencimiento_original DATE NOT NULL,   -- ⚠️ NOTA: No es solo fecha_vencimiento
    dias_gracia INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'pendiente',     -- ⚠️ NOTA: No es estado_cobro
    fecha_pago DATETIME NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),
    UNIQUE(poliza_id, fecha_inicio_periodo, numero_fraccion)
);
```

**Columnas clave:**
- `fecha_vencimiento_original`: Fecha límite de pago (NO usar `fecha_vencimiento`)
- `estado`: Estado del recibo (NO usar `estado_cobro`)
- `dias_gracia`: Días adicionales permitidos después del vencimiento

**Constraints:**
- `estado IN ('pendiente', 'pagado', 'vencido')`
- `UNIQUE(poliza_id, fecha_inicio_periodo, numero_fraccion)`: No duplicar fracciones

---

### 4. Usuario

Gestión de usuarios y autenticación.

```sql
CREATE TABLE Usuario (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,      -- bcrypt hash
    salt VARCHAR(32) NOT NULL,
    rol VARCHAR(20) DEFAULT 'operador',
    activo BOOLEAN DEFAULT 1,
    bloqueado BOOLEAN DEFAULT 0,
    intentos_fallidos INTEGER DEFAULT 0,
    ultimo_acceso DATETIME,
    fecha_ultimo_cambio_password DATETIME,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    CHECK(rol IN ('admin', 'operador', 'lectura'))
);
```

**Seguridad:**
- Passwords hasheados con **bcrypt** (10 salt rounds)
- `bloqueado`: Se activa automáticamente después de 5 intentos fallidos
- `intentos_fallidos`: Contador de intentos de login fallidos

---

### 5. Documento

Archivos adjuntos a clientes o pólizas.

```sql
CREATE TABLE Documento (
    documento_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NULL,
    poliza_id INTEGER NULL,
    tipo VARCHAR(50) NOT NULL,              -- ⚠️ NOTA: No es tipo_documento
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_relativa TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id),
    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),

    CHECK (cliente_id IS NOT NULL OR poliza_id IS NOT NULL)
);
```

**Columnas clave:**
- `tipo`: Tipo de documento (NO usar `tipo_documento`)
- **Constraint:** Debe estar asociado a cliente O póliza (al menos uno)

---

### 6. AuditoriaPoliza

Registro de cambios en pólizas.

```sql
CREATE TABLE AuditoriaPoliza (
    auditoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
    poliza_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR(20) NOT NULL,
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,  -- ⚠️ NOTA: No es fecha_hora

    FOREIGN KEY (poliza_id) REFERENCES Poliza(poliza_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id),

    CHECK(accion IN ('INSERT', 'UPDATE', 'DELETE'))
);
```

**Columnas clave:**
- `fecha_modificacion`: Timestamp del cambio (NO usar `fecha_hora`)
- **Nota:** La tabla se llama `AuditoriaPoliza`, NO `Auditoria`

---

## Tablas de Catálogos

### 7. Aseguradora

```sql
CREATE TABLE Aseguradora (
    aseguradora_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT 1
);
```

**Datos iniciales:** GNP, AXA, MAPFRE, SURA, Quálitas, HDI, Banorte, Chubb, Zurich, MetLife, etc. (15 total)

---

### 8. Ramo

```sql
CREATE TABLE Ramo (
    ramo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1
);
```

**Datos iniciales:** Automóvil, Vida, Gastos Médicos, Daños, Responsabilidad Civil, etc. (15 total)

---

### 9. Periodicidad

```sql
CREATE TABLE Periodicidad (
    periodicidad_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    meses INTEGER NOT NULL,
    dias_anticipacion_alerta INTEGER DEFAULT 7
);
```

**Datos iniciales:** Mensual (1), Bimestral (2), Trimestral (3), Cuatrimestral (4), Semestral (6), Anual (12)

---

### 10. MetodoPago

```sql
CREATE TABLE MetodoPago (
    metodo_pago_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    requiere_domiciliacion BOOLEAN DEFAULT 0
);
```

**Datos iniciales:** Domiciliado, Transferencia Bancaria, Cheque, Tarjeta de Crédito, Tarjeta de Débito, Efectivo, Depósito Bancario

---

## Relaciones y Foreign Keys

```
Cliente (1) ──────▶ (N) Poliza
Cliente (1) ──────▶ (N) Documento

Poliza (1) ───────▶ (N) Recibo
Poliza (1) ───────▶ (N) Documento
Poliza (1) ───────▶ (N) AuditoriaPoliza
Poliza (N) ───────▶ (1) Aseguradora
Poliza (N) ───────▶ (1) Ramo
Poliza (N) ───────▶ (1) Periodicidad
Poliza (N) ───────▶ (1) MetodoPago

Usuario (1) ──────▶ (N) AuditoriaPoliza
```

**Total:** 11 foreign keys

---

## Índices de Rendimiento

### Optimización para Hardware de Baja Gama
Target: Intel Celeron N4120 @ 1.10GHz, 4GB RAM

**Total:** 13 índices

#### Cliente
```sql
idx_cliente_nombre ON Cliente(nombre)
idx_cliente_rfc ON Cliente(rfc)
idx_cliente_correo ON Cliente(correo)          -- ⚠️ Corregido de correo_electronico
```

#### Poliza
```sql
idx_poliza_numero ON Poliza(numero_poliza)
idx_poliza_cliente ON Poliza(cliente_id)
idx_poliza_fecha_inicio ON Poliza(vigencia_inicio)    -- ⚠️ Corregido de fecha_inicio_vigencia
idx_poliza_fecha_fin ON Poliza(vigencia_fin)          -- ⚠️ Corregido de fecha_fin_vigencia
idx_poliza_aseguradora ON Poliza(aseguradora_id)
idx_poliza_ramo ON Poliza(ramo_id)
idx_poliza_vigencia_activa ON Poliza(vigencia_fin, vigencia_inicio)  -- ⚠️ Nombres corregidos
    WHERE vigencia_fin >= date('now')
```

#### Recibo
```sql
idx_recibo_poliza ON Recibo(poliza_id)
idx_recibo_fecha_vencimiento ON Recibo(fecha_vencimiento_original)  -- ⚠️ Corregido
idx_recibo_fecha_pago ON Recibo(fecha_pago)
idx_recibo_estado ON Recibo(estado)                                 -- ⚠️ Corregido de estado_pago
idx_recibo_pendientes ON Recibo(estado, fecha_vencimiento_original) -- ⚠️ Nombres corregidos
    WHERE estado = 'pendiente'
```

#### Documento
```sql
idx_documento_poliza ON Documento(poliza_id)
idx_documento_tipo ON Documento(tipo)                    -- ⚠️ Corregido de tipo_documento
```

#### Usuario
```sql
idx_usuario_username ON Usuario(username)
```

#### AuditoriaPoliza
```sql
idx_auditoria_fecha ON AuditoriaPoliza(fecha_modificacion)      -- ⚠️ Corregido de fecha_hora
idx_auditoria_usuario ON AuditoriaPoliza(usuario_id)
idx_auditoria_accion ON AuditoriaPoliza(accion)
idx_auditoria_poliza ON AuditoriaPoliza(poliza_id)
idx_auditoria_reciente ON AuditoriaPoliza(fecha_modificacion DESC, usuario_id)
```

---

## Changelog de Correcciones

### 18 de Noviembre, 2025

#### Correcciones en `migration/performance_indexes.sql`

Se corrigieron **13 nombres de columnas incorrectos** que no coincidían con el schema:

| Tabla | Nombre Incorrecto | Nombre Correcto | Impacto |
|-------|-------------------|-----------------|---------|
| Cliente | `correo_electronico` | `correo` | Índice fallaba |
| Poliza | `fecha_inicio_vigencia` | `vigencia_inicio` | Índice fallaba |
| Poliza | `fecha_fin_vigencia` | `vigencia_fin` | Índice fallaba |
| Recibo | `fecha_vencimiento` | `fecha_vencimiento_original` | Índice fallaba |
| Recibo | `estado_pago` (2 veces) | `estado` | Índice fallaba |
| Documento | `tipo_documento` | `tipo` | Índice fallaba |
| AuditoriaPoliza | Tabla `Auditoria` | Tabla `AuditoriaPoliza` | Tabla no existía |
| AuditoriaPoliza | `fecha_hora` | `fecha_modificacion` | Columna no existía |
| AuditoriaPoliza | `tabla_afectada` | (no existe) | Columna no existía |

#### Correcciones en `models/database.js`

Se corrigieron **3 queries con nombres de columnas incorrectos**:

**1. `getPolizasTrend()`**
```sql
-- ❌ ANTES (incorrecto):
SELECT strftime('%Y-%m', fecha_emision) as mes ...

-- ✅ DESPUÉS (correcto):
SELECT strftime('%Y-%m', fecha_creacion) as mes ...
```

**2. `getRecibosByEstado()`**
```sql
-- ❌ ANTES (incorrecto):
SELECT r.estado_cobro, COUNT(*) ...
GROUP BY r.estado_cobro

-- ✅ DESPUÉS (correcto):
SELECT r.estado, COUNT(*) ...
GROUP BY r.estado
```

**3. `getCobrosMensuales()`**
```sql
-- ❌ ANTES (incorrecto):
SELECT strftime('%Y-%m', r.fecha_vencimiento) as mes,
    SUM(CASE WHEN r.estado_cobro = 'pagado' ...

-- ✅ DESPUÉS (correcto):
SELECT strftime('%Y-%m', r.fecha_vencimiento_original) as mes,
    SUM(CASE WHEN r.estado = 'pagado' ...
```

**Impacto:** Estos errores causaban que:
- La base de datos NO se creara correctamente
- Los queries del dashboard fallaran
- La aplicación no arrancara si la BD no existía previamente

---

## Referencia Rápida de Columnas

### ⚠️ NOMBRES COMUNES QUE CAUSAN ERROR

| ❌ NO Usar | ✅ Usar Esto | Tabla |
|-----------|-------------|-------|
| `correo_electronico` | `correo` | Cliente |
| `fecha_inicio_vigencia` | `vigencia_inicio` | Poliza |
| `fecha_fin_vigencia` | `vigencia_fin` | Poliza |
| `fecha_emision` | `fecha_creacion` | Poliza |
| `fecha_vencimiento` | `fecha_vencimiento_original` | Recibo |
| `estado_cobro` | `estado` | Recibo |
| `estado_pago` | `estado` | Recibo |
| `tipo_documento` | `tipo` | Documento |
| `fecha_hora` | `fecha_modificacion` | AuditoriaPoliza |
| `Auditoria` | `AuditoriaPoliza` | (nombre de tabla) |

### Columnas de Fechas por Tabla

| Tabla | Columna de Fecha | Propósito |
|-------|------------------|-----------|
| Cliente | `fecha_nacimiento` | Fecha de nacimiento del cliente |
| Cliente | `fecha_creacion` | Timestamp de creación |
| Cliente | `fecha_modificacion` | Timestamp de última modificación |
| Cliente | `fecha_eliminacion` | Timestamp de soft delete |
| Poliza | `vigencia_inicio` | Inicio de cobertura |
| Poliza | `vigencia_fin` | Fin de cobertura |
| Poliza | `fecha_creacion` | Timestamp de creación (usar para tendencias) |
| Poliza | `fecha_modificacion` | Timestamp de última modificación |
| Poliza | `fecha_eliminacion` | Timestamp de soft delete |
| Recibo | `fecha_inicio_periodo` | Inicio del periodo de pago |
| Recibo | `fecha_fin_periodo` | Fin del periodo de pago |
| Recibo | `fecha_corte` | Fecha de corte del recibo |
| Recibo | `fecha_vencimiento_original` | Fecha límite de pago |
| Recibo | `fecha_pago` | Fecha real de pago (NULL si pendiente) |
| Recibo | `fecha_creacion` | Timestamp de creación |
| Recibo | `fecha_modificacion` | Timestamp de última modificación |
| Usuario | `ultimo_acceso` | Último login exitoso |
| Usuario | `fecha_ultimo_cambio_password` | Último cambio de contraseña |
| Usuario | `fecha_creacion` | Timestamp de creación |
| Usuario | `fecha_modificacion` | Timestamp de última modificación |
| Documento | `fecha_creacion` | Timestamp de creación |
| AuditoriaPoliza | `fecha_modificacion` | Timestamp del cambio |

---

## Mejores Prácticas

### 1. Siempre Usar Nombres Exactos del Schema
```javascript
// ✅ CORRECTO
const query = "SELECT correo FROM Cliente WHERE cliente_id = ?";

// ❌ INCORRECTO
const query = "SELECT correo_electronico FROM Cliente WHERE cliente_id = ?";
```

### 2. Consultar Esta Documentación Antes de Escribir Queries
Si tienes duda sobre un nombre de columna:
1. Busca en la sección de la tabla correspondiente
2. Verifica la "Referencia Rápida de Columnas"
3. Si es un nombre común problemático, revisa la tabla de errores

### 3. Usar Timestamps Correctos
```javascript
// Para tendencias de pólizas
const query = "SELECT strftime('%Y-%m', fecha_creacion) ...";  // ✅

// Para vencimientos de recibos
const query = "SELECT fecha_vencimiento_original ...";  // ✅
```

### 4. Nombrar Correctamente la Tabla de Auditoría
```javascript
// ✅ CORRECTO
const query = "SELECT * FROM AuditoriaPoliza WHERE ...";

// ❌ INCORRECTO
const query = "SELECT * FROM Auditoria WHERE ...";
```

---

## Archivos de Referencia

- **Schema completo:** `migration/schema_v2.sql`
- **Índices:** `migration/performance_indexes.sql`
- **Seeds:** `migration/seeds.sql`
- **DatabaseManager:** `models/database.js`
- **Diagrama ER:** `docs/base-de-datos/diagrama_bd.md`

---

## Contacto y Soporte

Para dudas sobre la estructura de la base de datos, consultar:
- Este documento (`ESTRUCTURA_BD.md`)
- El archivo de schema (`migration/schema_v2.sql`)
- El archivo de índices (`migration/performance_indexes.sql`)

**Última revisión:** 18 de Noviembre, 2025
**Versión:** 2.0.1 (con correcciones de nombres)
