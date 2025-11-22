// models/documento_model.js
// DocumentoModel - CRUD de documentos adjuntos (clientes / pólizas)

class DocumentoModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    create(documentoData) {
        const payload = this._normalize(documentoData);

        const result = this.dbManager.execute(
            `
            INSERT INTO Documento (
                cliente_id,
                poliza_id,
                tipo,
                nombre_archivo,
                ruta_relativa
            ) VALUES (?, ?, ?, ?, ?)
        `,
            [
                payload.cliente_id,
                payload.poliza_id,
                payload.tipo,
                payload.nombre_archivo,
                payload.ruta_relativa
            ]
        );

        return {
            documento_id: result.lastInsertRowid,
            ...payload
        };
    }

    getById(documentoId) {
        return this.dbManager.queryOne(
            `
            SELECT * FROM Documento WHERE documento_id = ?
        `,
            [documentoId]
        );
    }

    getAll() {
        return this.dbManager.query(
            `
            SELECT
                d.*,
                c.nombre as cliente_nombre,
                p.numero_poliza
            FROM Documento d
            LEFT JOIN Cliente c ON d.cliente_id = c.cliente_id
            LEFT JOIN Poliza p ON d.poliza_id = p.poliza_id
            ORDER BY d.fecha_creacion DESC
        `
        );
    }

    getByCliente(clienteId) {
        return this.dbManager.query(
            `
            SELECT * FROM Documento WHERE cliente_id = ?
            ORDER BY fecha_creacion DESC
        `,
            [clienteId]
        );
    }

    getByPoliza(polizaId) {
        return this.dbManager.query(
            `
            SELECT * FROM Documento WHERE poliza_id = ?
            ORDER BY fecha_creacion DESC
        `,
            [polizaId]
        );
    }

    delete(documentoId) {
        const result = this.dbManager.execute(
            `DELETE FROM Documento WHERE documento_id = ?`,
            [documentoId]
        );
        return result.changes > 0;
    }

    _normalize(data) {
        if (!data.cliente_id && !data.poliza_id) {
            throw new Error('El documento debe relacionarse con un cliente o una póliza');
        }

        if (!data.tipo || !data.nombre_archivo || !data.ruta_relativa) {
            throw new Error('El documento debe incluir tipo, nombre y ruta');
        }

        return {
            cliente_id: data.cliente_id ? Number(data.cliente_id) : null,
            poliza_id: data.poliza_id ? Number(data.poliza_id) : null,
            tipo: data.tipo.trim(),
            nombre_archivo: data.nombre_archivo.trim(),
            ruta_relativa: data.ruta_relativa.trim()
        };
    }
}

module.exports = DocumentoModel;
