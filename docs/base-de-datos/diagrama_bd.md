# Diagrama UML - Base de Datos del Sistema de Gestión de Pólizas

```mermaid
erDiagram
    Cliente ||--o{ Poliza : "tiene"
    Cliente ||--o{ Documento : "posee"
    Aseguradora ||--o{ Poliza : "emite"
    Ramo ||--o{ Poliza : "clasifica"
    Periodicidad ||--o{ Poliza : "define"
    MetodoPago ||--o{ Poliza : "usa"
    Poliza ||--o{ Recibo : "genera"
    Poliza ||--o{ Documento : "contiene"
    Poliza ||--o{ AuditoriaPoliza : "registra"
    Usuario ||--o{ AuditoriaPoliza : "realiza"

    Cliente {
        INTEGER cliente_id PK
        VARCHAR rfc UK "NOT NULL"
        VARCHAR nombre "NOT NULL"
        VARCHAR tipo_persona "Física/Moral"
        VARCHAR telefono
        VARCHAR celularx|
        VARCHAR correo
        TEXT direccion
        TEXT notas
        DATE fecha_nacimiento
        BOOLEAN activo
        DATETIME fecha_eliminacion
        DATETIME fecha_creacion
        DATETIME fecha_modificacion
    }

    Aseguradora {
        INTEGER aseguradora_id PK
        VARCHAR nombre UK "NOT NULL"
        BOOLEAN activo
    }

    Ramo {
        INTEGER ramo_id PK
        VARCHAR nombre UK "NOT NULL"
        TEXT descripcion
        BOOLEAN activo
    }

    Periodicidad {
        INTEGER periodicidad_id PK
        VARCHAR nombre UK "NOT NULL"
        INTEGER meses "NOT NULL"
        INTEGER dias_anticipacion_alerta
    }

    MetodoPago {
        INTEGER metodo_pago_id PK
        VARCHAR nombre UK "NOT NULL"
        BOOLEAN requiere_domiciliacion
    }

    Poliza {
        INTEGER poliza_id PK
        VARCHAR numero_poliza UK "NOT NULL"
        INTEGER cliente_id FK "NOT NULL"
        INTEGER aseguradora_id FK "NOT NULL"
        INTEGER ramo_id FK "NOT NULL"
        VARCHAR tipo_poliza "nuevo/renovacion"
        DECIMAL prima_neta "NOT NULL"
        DECIMAL prima_total "NOT NULL"
        DATE vigencia_inicio "NOT NULL"
        DATE vigencia_fin "NOT NULL"
        BOOLEAN vigencia_renovacion_automatica
        INTEGER periodicidad_id FK "NOT NULL"
        INTEGER metodo_pago_id FK "NOT NULL"
        BOOLEAN domiciliada
        VARCHAR estado_pago "pendiente/pagado/vencido"
        DECIMAL comision_porcentaje
        DECIMAL suma_asegurada
        TEXT notas
        BOOLEAN activo
        DATETIME fecha_eliminacion
        DATETIME fecha_creacion
        DATETIME fecha_modificacion
    }

    Recibo {
        INTEGER recibo_id PK
        INTEGER poliza_id FK "NOT NULL"
        VARCHAR numero_recibo "NOT NULL"
        DATE fecha_inicio_periodo "NOT NULL"
        DATE fecha_fin_periodo "NOT NULL"
        INTEGER numero_fraccion "NOT NULL"
        DECIMAL monto "NOT NULL"
        DATE fecha_corte "NOT NULL"
        DATE fecha_vencimiento_original "NOT NULL"
        INTEGER dias_gracia
        VARCHAR estado "pendiente/pagado/vencido"
        DATETIME fecha_pago
        DATETIME fecha_creacion
        DATETIME fecha_modificacion
    }

    Usuario {
        INTEGER usuario_id PK
        VARCHAR username UK "NOT NULL"
        VARCHAR email UK
        VARCHAR password_hash "NOT NULL"
        VARCHAR salt "NOT NULL"
        VARCHAR rol "admin/operador/lectura"
        BOOLEAN activo
        BOOLEAN bloqueado
        INTEGER intentos_fallidos
        DATETIME ultimo_acceso
        DATETIME fecha_ultimo_cambio_password
        DATETIME fecha_creacion
        DATETIME fecha_modificacion
    }

    Documento {
        INTEGER documento_id PK
        INTEGER cliente_id FK
        INTEGER poliza_id FK
        VARCHAR tipo "NOT NULL"
        VARCHAR nombre_archivo "NOT NULL"
        TEXT ruta_relativa "NOT NULL"
        DATETIME fecha_creacion
    }

    AuditoriaPoliza {
        INTEGER auditoria_id PK
        INTEGER poliza_id FK "NOT NULL"
        INTEGER usuario_id FK "NOT NULL"
        VARCHAR accion "INSERT/UPDATE/DELETE"
        VARCHAR campo_modificado
        TEXT valor_anterior
        TEXT valor_nuevo
        DATETIME fecha_modificacion
    }
```

## Descripción de las Relaciones

### Relaciones Principales
- **Cliente → Poliza** (1:N): Un cliente puede tener múltiples pólizas
- **Aseguradora → Poliza** (1:N): Una aseguradora emite múltiples pólizas
- **Ramo → Poliza** (1:N): Un ramo clasifica múltiples pólizas
- **Periodicidad → Poliza** (1:N): Una periodicidad se aplica a múltiples pólizas
- **MetodoPago → Poliza** (1:N): Un método de pago se usa en múltiples pólizas
- **Poliza → Recibo** (1:N): Una póliza genera múltiples recibos

### Relaciones de Documentos
- **Cliente → Documento** (1:N): Un cliente puede tener múltiples documentos
- **Poliza → Documento** (1:N): Una póliza puede tener múltiples documentos
- Nota: Un documento debe estar asociado a un cliente O a una póliza (no ambos)

### Relaciones de Auditoría
- **Poliza → AuditoriaPoliza** (1:N): Una póliza tiene múltiples registros de auditoría
- **Usuario → AuditoriaPoliza** (1:N): Un usuario realiza múltiples acciones auditadas

## Catálogos del Sistema
- **Aseguradora**: Catálogo de compañías aseguradoras
- **Ramo**: Catálogo de tipos de seguros (Auto, Vida, Gastos Médicos, etc.)
- **Periodicidad**: Catálogo de frecuencias de pago (Mensual, Trimestral, Anual, etc.)
- **MetodoPago**: Catálogo de métodos de pago disponibles

## Características de Seguridad
- Soft delete: Las tablas Cliente y Poliza usan `fecha_eliminacion` en lugar de borrado físico
- Auditoría automática: Triggers registran cambios en estado_pago de pólizas
- Control de acceso: Sistema de roles (admin, operador, lectura)
- Seguridad de passwords: Uso de hash y salt para almacenar contraseñas
