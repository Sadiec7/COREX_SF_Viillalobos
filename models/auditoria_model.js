// models/auditoria_model.js
// AuditoriaModel - Lectura y registro de la tabla AuditoriaPoliza

class AuditoriaModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    registrarEntrada(auditoriaData) {
        const payload = this._normalize(auditoriaData);

        const result = this.dbManager.execute(
            `
            INSERT INTO AuditoriaPoliza (
                poliza_id,
                usuario_id,
                accion,
                campo_modificado,
                valor_anterior,
                valor_nuevo
            ) VALUES (?, ?, ?, ?, ?, ?)
        `,
            [
                payload.poliza_id,
                payload.usuario_id,
                payload.accion,
                payload.campo_modificado,
                payload.valor_anterior,
                payload.valor_nuevo
            ]
        );

        return result.lastInsertRowid;
    }

    listarPorPoliza(polizaId, limit = 50) {
        return this.dbManager.query(
            `
            SELECT *
            FROM AuditoriaPoliza
            WHERE poliza_id = ?
            ORDER BY fecha_modificacion DESC
            LIMIT ?
        `,
            [polizaId, limit]
        );
    }

    listarRecientes(limit = 50) {
        return this.dbManager.query(
            `
            SELECT
                au.*,
                u.username
            FROM AuditoriaPoliza au
            LEFT JOIN Usuario u ON au.usuario_id = u.usuario_id
            ORDER BY au.fecha_modificacion DESC
            LIMIT ?
        `,
            [limit]
        );
    }

    _normalize(auditoriaData) {
        const accionesValidas = ['INSERT', 'UPDATE', 'DELETE'];
        if (!accionesValidas.includes(auditoriaData.accion)) {
            throw new Error(`Acción de auditoría inválida: ${auditoriaData.accion}`);
        }

        return {
            poliza_id: Number(auditoriaData.poliza_id),
            usuario_id: Number(auditoriaData.usuario_id || 1),
            accion: auditoriaData.accion,
            campo_modificado: auditoriaData.campo_modificado || null,
            valor_anterior: auditoriaData.valor_anterior || null,
            valor_nuevo: auditoriaData.valor_nuevo || null
        };
    }
}

module.exports = AuditoriaModel;
