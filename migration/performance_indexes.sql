-- ========================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE RENDIMIENTO
-- Target: Intel Celeron N4120, 4GB RAM
-- Propósito: Acelerar consultas frecuentes
-- ========================================================

-- Índices para tabla Cliente (búsquedas frecuentes por nombre/RFC)
CREATE INDEX IF NOT EXISTS idx_cliente_nombre ON Cliente(nombre);
CREATE INDEX IF NOT EXISTS idx_cliente_rfc ON Cliente(rfc);
CREATE INDEX IF NOT EXISTS idx_cliente_correo ON Cliente(correo_electronico);

-- Índices para tabla Poliza (búsquedas por número, cliente, fechas)
CREATE INDEX IF NOT EXISTS idx_poliza_numero ON Poliza(numero_poliza);
CREATE INDEX IF NOT EXISTS idx_poliza_cliente ON Poliza(cliente_id);
CREATE INDEX IF NOT EXISTS idx_poliza_fecha_inicio ON Poliza(fecha_inicio_vigencia);
CREATE INDEX IF NOT EXISTS idx_poliza_fecha_fin ON Poliza(fecha_fin_vigencia);
CREATE INDEX IF NOT EXISTS idx_poliza_aseguradora ON Poliza(aseguradora_id);
CREATE INDEX IF NOT EXISTS idx_poliza_ramo ON Poliza(ramo_id);

-- Índice compuesto para búsqueda de pólizas próximas a vencer
CREATE INDEX IF NOT EXISTS idx_poliza_vigencia_activa
ON Poliza(fecha_fin_vigencia, fecha_inicio_vigencia)
WHERE fecha_fin_vigencia >= date('now');

-- Índices para tabla Recibo (búsquedas por póliza, fechas de pago)
CREATE INDEX IF NOT EXISTS idx_recibo_poliza ON Recibo(poliza_id);
CREATE INDEX IF NOT EXISTS idx_recibo_fecha_vencimiento ON Recibo(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_recibo_fecha_pago ON Recibo(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_recibo_estado_pago ON Recibo(estado_pago);

-- Índice compuesto para recibos pendientes
CREATE INDEX IF NOT EXISTS idx_recibo_pendientes
ON Recibo(estado_pago, fecha_vencimiento)
WHERE estado_pago = 'PENDIENTE';

-- Índices para tabla Documento (búsquedas por póliza, tipo)
CREATE INDEX IF NOT EXISTS idx_documento_poliza ON Documento(poliza_id);
CREATE INDEX IF NOT EXISTS idx_documento_tipo ON Documento(tipo_documento);

-- Índices para tabla Usuario (búsquedas por username)
CREATE INDEX IF NOT EXISTS idx_usuario_username ON Usuario(username);

-- Índices para tabla Auditoria (consultas por fecha, usuario, acción)
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON Auditoria(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON Auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON Auditoria(accion);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabla ON Auditoria(tabla_afectada);

-- Índice compuesto para auditoría reciente
CREATE INDEX IF NOT EXISTS idx_auditoria_reciente
ON Auditoria(fecha_hora DESC, usuario_id);

-- Optimización: ANALYZE para actualizar estadísticas del optimizador de SQLite
ANALYZE;

-- Optimización: VACUUM para desfragmentar la base de datos
-- (Comentado porque puede ser costoso, ejecutar manualmente si es necesario)
-- VACUUM;
