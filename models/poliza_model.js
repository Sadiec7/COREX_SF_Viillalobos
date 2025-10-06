// models/poliza_model.js
// PolizaModel - Gestión de pólizas (compatible con sql.js)

class PolizaModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Crear nueva póliza y generar recibos automáticamente
     * @param {Object} polizaData - Datos de la póliza
     * @returns {Object} Póliza creada con recibos
     */
    create(polizaData) {
        const {
            numero_poliza,
            cliente_id,
            aseguradora_id,
            ramo_id,
            fecha_inicio,
            fecha_fin,
            prima_total,
            comision_porcentaje,
            suma_asegurada,
            periodicidad_pago_id,
            metodo_pago_id,
            notas
        } = polizaData;

        try {
            // Insertar póliza
            const result = this.dbManager.execute(`
                INSERT INTO Poliza (
                    numero_poliza, cliente_id, aseguradora_id, ramo_id,
                    fecha_inicio, fecha_fin, prima_total, comision_porcentaje,
                    suma_asegurada, periodicidad_pago_id, metodo_pago_id, notas
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                numero_poliza, cliente_id, aseguradora_id, ramo_id,
                fecha_inicio, fecha_fin, prima_total, comision_porcentaje || null,
                suma_asegurada || null, periodicidad_pago_id, metodo_pago_id || null, notas || null
            ]);

            const poliza_id = result.lastInsertRowid;

            // Generar recibos automáticamente
            const recibosGenerados = this._generarRecibos(poliza_id, periodicidad_pago_id, fecha_inicio, fecha_fin, prima_total);

            return {
                poliza_id,
                ...polizaData,
                recibos_generados: recibosGenerados
            };
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error(`El número de póliza ${numero_poliza} ya existe`);
            }
            throw error;
        }
    }

    /**
     * Generar recibos basados en la periodicidad
     * @private
     */
    _generarRecibos(poliza_id, periodicidad_id, fecha_inicio, fecha_fin, prima_total) {
        // Obtener información de la periodicidad
        const periodicidad = this.dbManager.queryOne(`
            SELECT * FROM Periodicidad WHERE periodicidad_id = ?
        `, [periodicidad_id]);

        if (!periodicidad) {
            throw new Error('Periodicidad no encontrada');
        }

        const meses = periodicidad.meses || 12;
        const num_fracciones = Math.ceil(12 / meses);
        const monto_por_recibo = prima_total / num_fracciones;

        const inicio = new Date(fecha_inicio);
        const recibos = [];

        for (let i = 0; i < num_fracciones; i++) {
            const fecha_vencimiento = new Date(inicio);
            fecha_vencimiento.setMonth(inicio.getMonth() + (i * meses));

            const numero_recibo = `${poliza_id}-${String(i + 1).padStart(2, '0')}`;

            this.dbManager.execute(`
                INSERT INTO Recibo (
                    poliza_id, numero_recibo, numero_fraccion, monto, fecha_vencimiento
                ) VALUES (?, ?, ?, ?, ?)
            `, [poliza_id, numero_recibo, i + 1, monto_por_recibo, fecha_vencimiento.toISOString().split('T')[0]]);

            recibos.push({
                numero_recibo,
                monto: monto_por_recibo,
                fecha_vencimiento: fecha_vencimiento.toISOString().split('T')[0]
            });
        }

        return recibos.length;
    }

    /**
     * Obtener póliza por ID con información relacionada
     * @param {number} polizaId - ID de la póliza
     * @returns {Object|null} Póliza con datos completos
     */
    getById(polizaId) {
        return this.dbManager.queryOne(`
            SELECT
                p.*,
                c.nombre AS cliente_nombre,
                c.rfc AS cliente_rfc,
                a.nombre AS aseguradora_nombre,
                r.nombre AS ramo_nombre
            FROM Poliza p
            LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
            WHERE p.poliza_id = ? AND p.activo = 1
        `, [polizaId]);
    }

    /**
     * Listar todas las pólizas con filtros opcionales
     * @param {Object} filters - Filtros opcionales
     * @returns {Array} Lista de pólizas
     */
    getAll(filters = {}) {
        let query = `
            SELECT
                p.*,
                c.nombre AS cliente_nombre,
                a.nombre AS aseguradora_nombre,
                r.nombre AS ramo_nombre
            FROM Poliza p
            LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
            WHERE p.activo = 1
        `;

        const params = [];

        if (filters.cliente_id) {
            query += ` AND p.cliente_id = ?`;
            params.push(filters.cliente_id);
        }

        if (filters.aseguradora_id) {
            query += ` AND p.aseguradora_id = ?`;
            params.push(filters.aseguradora_id);
        }

        if (filters.ramo_id) {
            query += ` AND p.ramo_id = ?`;
            params.push(filters.ramo_id);
        }

        query += ` ORDER BY p.fecha_creacion DESC`;

        return this.dbManager.query(query, params);
    }

    /**
     * Obtener recibos de una póliza
     * @param {number} polizaId - ID de la póliza
     * @returns {Array} Lista de recibos
     */
    getRecibos(polizaId) {
        return this.dbManager.query(`
            SELECT * FROM Recibo
            WHERE poliza_id = ?
            ORDER BY numero_fraccion ASC
        `, [polizaId]);
    }

    /**
     * Marcar un recibo como pagado
     * @param {number} reciboId - ID del recibo
     * @param {string} fechaPago - Fecha de pago (opcional)
     * @returns {boolean} True si se actualizó
     */
    marcarReciboPagado(reciboId, fechaPago = null) {
        const fecha = fechaPago || new Date().toISOString();

        const result = this.dbManager.execute(`
            UPDATE Recibo
            SET pagado = 1,
                fecha_pago = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE recibo_id = ?
        `, [fecha, reciboId]);

        return result.changes > 0;
    }

    /**
     * Obtener pólizas que vencen en X días
     * @param {number} dias - Días hacia adelante
     * @returns {Array} Pólizas por vencer
     */
    getPolizasPorVencer(dias = 30) {
        return this.dbManager.query(`
            SELECT
                p.*,
                c.nombre AS cliente_nombre,
                a.nombre AS aseguradora_nombre
            FROM Poliza p
            LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            WHERE p.activo = 1
            AND DATE(p.fecha_fin) BETWEEN DATE('now') AND DATE('now', '+' || ? || ' days')
            ORDER BY p.fecha_fin ASC
        `, [dias]);
    }

    /**
     * Obtener recibos pendientes con alertas
     * @returns {Array} Recibos pendientes con información de alerta
     */
    getRecibosPendientesConAlertas() {
        return this.dbManager.query(`
            SELECT
                r.*,
                p.numero_poliza,
                c.nombre AS cliente_nombre,
                JULIANDAY(r.fecha_vencimiento) - JULIANDAY('now') AS dias_hasta_vencimiento
            FROM Recibo r
            JOIN Poliza p ON r.poliza_id = p.poliza_id
            JOIN Cliente c ON p.cliente_id = c.cliente_id
            WHERE r.pagado = 0
            AND p.activo = 1
            ORDER BY r.fecha_vencimiento ASC
        `);
    }
}

module.exports = PolizaModel;
