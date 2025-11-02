# Prompt para LucidChart - Diagrama UML Base de Datos

Copia y pega este prompt en LucidChart AI:

---

Crea un diagrama ERD (Entity-Relationship Diagram) para un sistema de gestión de pólizas de seguros con las siguientes especificaciones:

## TABLAS Y CAMPOS:

### 1. Cliente
- cliente_id (PK, INTEGER, autoincrement)
- rfc (VARCHAR(13), UNIQUE, NOT NULL)
- nombre (VARCHAR(255), NOT NULL)
- tipo_persona (VARCHAR(20), valores: 'Física' o 'Moral')
- telefono (VARCHAR(20))
- celular (VARCHAR(20))
- correo (VARCHAR(100))
- direccion (TEXT)
- notas (TEXT)
- fecha_nacimiento (DATE)
- activo (BOOLEAN, default 1)
- fecha_eliminacion (DATETIME, nullable)
- fecha_creacion (DATETIME)
- fecha_modificacion (DATETIME)

### 2. Aseguradora (Catálogo)
- aseguradora_id (PK, INTEGER, autoincrement)
- nombre (VARCHAR(100), UNIQUE, NOT NULL)
- activo (BOOLEAN, default 1)

### 3. Ramo (Catálogo)
- ramo_id (PK, INTEGER, autoincrement)
- nombre (VARCHAR(50), UNIQUE, NOT NULL)
- descripcion (TEXT)
- activo (BOOLEAN, default 1)

### 4. Periodicidad (Catálogo)
- periodicidad_id (PK, INTEGER, autoincrement)
- nombre (VARCHAR(20), UNIQUE, NOT NULL)
- meses (INTEGER, NOT NULL)
- dias_anticipacion_alerta (INTEGER, default 7)

### 5. MetodoPago (Catálogo)
- metodo_pago_id (PK, INTEGER, autoincrement)
- nombre (VARCHAR(50), UNIQUE, NOT NULL)
- requiere_domiciliacion (BOOLEAN, default 0)

### 6. Poliza
- poliza_id (PK, INTEGER, autoincrement)
- numero_poliza (VARCHAR(20), UNIQUE, NOT NULL)
- cliente_id (FK → Cliente.cliente_id, NOT NULL)
- aseguradora_id (FK → Aseguradora.aseguradora_id, NOT NULL)
- ramo_id (FK → Ramo.ramo_id, NOT NULL)
- tipo_poliza (VARCHAR(20), valores: 'nuevo' o 'renovacion', NOT NULL)
- prima_neta (DECIMAL(10,2), NOT NULL)
- prima_total (DECIMAL(10,2), NOT NULL)
- vigencia_inicio (DATE, NOT NULL)
- vigencia_fin (DATE, NOT NULL)
- vigencia_renovacion_automatica (BOOLEAN, default 0)
- periodicidad_id (FK → Periodicidad.periodicidad_id, NOT NULL)
- metodo_pago_id (FK → MetodoPago.metodo_pago_id, NOT NULL)
- domiciliada (BOOLEAN, default 0)
- estado_pago (VARCHAR(20), valores: 'pendiente', 'pagado', 'vencido')
- comision_porcentaje (DECIMAL(5,2))
- suma_asegurada (DECIMAL(15,2))
- notas (TEXT)
- activo (BOOLEAN, default 1)
- fecha_eliminacion (DATETIME, nullable)
- fecha_creacion (DATETIME)
- fecha_modificacion (DATETIME)

### 7. Recibo
- recibo_id (PK, INTEGER, autoincrement)
- poliza_id (FK → Poliza.poliza_id, NOT NULL)
- numero_recibo (VARCHAR(50), NOT NULL)
- fecha_inicio_periodo (DATE, NOT NULL)
- fecha_fin_periodo (DATE, NOT NULL)
- numero_fraccion (INTEGER, NOT NULL)
- monto (DECIMAL(10,2), NOT NULL)
- fecha_corte (DATE, NOT NULL)
- fecha_vencimiento_original (DATE, NOT NULL)
- dias_gracia (INTEGER, default 0)
- estado (VARCHAR(20), valores: 'pendiente', 'pagado', 'vencido')
- fecha_pago (DATETIME, nullable)
- fecha_creacion (DATETIME)
- fecha_modificacion (DATETIME)

### 8. Usuario
- usuario_id (PK, INTEGER, autoincrement)
- username (VARCHAR(50), UNIQUE, NOT NULL)
- email (VARCHAR(100), UNIQUE)
- password_hash (VARCHAR(255), NOT NULL)
- salt (VARCHAR(32), NOT NULL)
- rol (VARCHAR(20), valores: 'admin', 'operador', 'lectura')
- activo (BOOLEAN, default 1)
- bloqueado (BOOLEAN, default 0)
- intentos_fallidos (INTEGER, default 0)
- ultimo_acceso (DATETIME)
- fecha_ultimo_cambio_password (DATETIME)
- fecha_creacion (DATETIME)
- fecha_modificacion (DATETIME)

### 9. Documento
- documento_id (PK, INTEGER, autoincrement)
- cliente_id (FK → Cliente.cliente_id, nullable)
- poliza_id (FK → Poliza.poliza_id, nullable)
- tipo (VARCHAR(50), NOT NULL)
- nombre_archivo (VARCHAR(255), NOT NULL)
- ruta_relativa (TEXT, NOT NULL)
- fecha_creacion (DATETIME)
- Restricción: cliente_id o poliza_id debe tener valor (al menos uno)

### 10. AuditoriaPoliza
- auditoria_id (PK, INTEGER, autoincrement)
- poliza_id (FK → Poliza.poliza_id, NOT NULL)
- usuario_id (FK → Usuario.usuario_id, NOT NULL)
- accion (VARCHAR(20), valores: 'INSERT', 'UPDATE', 'DELETE', NOT NULL)
- campo_modificado (VARCHAR(50))
- valor_anterior (TEXT)
- valor_nuevo (TEXT)
- fecha_modificacion (DATETIME)

## RELACIONES:

1. Cliente → Poliza (uno a muchos)
2. Aseguradora → Poliza (uno a muchos)
3. Ramo → Poliza (uno a muchos)
4. Periodicidad → Poliza (uno a muchos)
5. MetodoPago → Poliza (uno a muchos)
6. Poliza → Recibo (uno a muchos)
7. Cliente → Documento (uno a muchos, opcional)
8. Poliza → Documento (uno a muchos, opcional)
9. Poliza → AuditoriaPoliza (uno a muchos)
10. Usuario → AuditoriaPoliza (uno a muchos)

## ESTILO VISUAL:

- Usa colores para diferenciar:
  - Tablas principales (Cliente, Poliza, Recibo): Color azul
  - Catálogos (Aseguradora, Ramo, Periodicidad, MetodoPago): Color verde
  - Seguridad/Auditoría (Usuario, AuditoriaPoliza): Color naranja
  - Documentos: Color morado
- Muestra las Primary Keys (PK) con icono de llave
- Muestra las Foreign Keys (FK) con iconos de relación
- Indica los campos UNIQUE con asterisco
- Indica los campos NOT NULL en negrita
- Usa líneas con terminaciones crow's foot para relaciones uno-a-muchos

Genera el diagrama de forma clara, organizada y profesional.

---

## Instrucciones adicionales:

1. Copia todo el texto desde "Crea un diagrama ERD..." hasta "profesional."
2. Pégalo en LucidChart AI (opción "Generate with AI" o "Generar con IA")
3. LucidChart generará automáticamente el diagrama
4. Puedes ajustar el layout manualmente después si es necesario
