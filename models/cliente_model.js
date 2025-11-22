// models/cliente_model.js
// ClienteModel - CRUD para gestión de clientes (compatible con sql.js)

class ClienteModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Crear nuevo cliente
     * @param {Object} clienteData - Datos del cliente
     * @returns {Object} Cliente creado con ID
     */
    create(clienteData) {
        const { nombre, rfc, tipo_persona, email, telefono, celular, direccion, notas } = clienteData;

        try {
            const result = this.dbManager.execute(`
                INSERT INTO Cliente (
                    rfc, nombre, telefono, correo, celular, direccion, tipo_persona, notas
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [rfc, nombre, telefono || null, email || null, celular || null, direccion || null, tipo_persona || 'Física', notas || null]);

            return {
                cliente_id: result.lastInsertRowid,
                ...clienteData
            };
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error(`El RFC ${rfc} ya existe en el sistema`);
            }
            throw error;
        }
    }

    /**
     * Obtener cliente por ID
     * @param {number} clienteId - ID del cliente
     * @returns {Object|null} Datos del cliente
     */
    getById(clienteId) {
        return this.dbManager.queryOne(`
            SELECT
                cliente_id,
                rfc,
                nombre,
                tipo_persona,
                telefono,
                celular,
                correo AS email,
                direccion,
                notas,
                fecha_nacimiento,
                activo,
                fecha_eliminacion,
                fecha_creacion,
                fecha_modificacion
            FROM Cliente
            WHERE cliente_id = ? AND activo = 1
        `, [clienteId]);
    }

    /**
     * Obtener cliente por RFC
     * @param {string} rfc - RFC del cliente
     * @returns {Object|null} Datos del cliente
     */
    getByRFC(rfc) {
        return this.dbManager.queryOne(`
            SELECT
                cliente_id,
                rfc,
                nombre,
                tipo_persona,
                telefono,
                celular,
                correo AS email,
                direccion,
                notas,
                fecha_nacimiento,
                activo,
                fecha_eliminacion,
                fecha_creacion,
                fecha_modificacion
            FROM Cliente
            WHERE rfc = ? AND activo = 1
        `, [rfc]);
    }

    /**
     * Buscar clientes por nombre o RFC
     * @param {string} term - Término de búsqueda
     * @returns {Array} Lista de clientes que coinciden
     */
    search(term) {
        return this.dbManager.query(`
            SELECT
                cliente_id,
                rfc,
                nombre,
                tipo_persona,
                telefono,
                celular,
                correo AS email,
                direccion,
                notas,
                fecha_nacimiento,
                activo,
                fecha_eliminacion,
                fecha_creacion,
                fecha_modificacion
            FROM Cliente
            WHERE (nombre LIKE ? OR rfc LIKE ?) AND activo = 1
            ORDER BY nombre ASC
        `, [`%${term}%`, `%${term}%`]);
    }

    /**
     * Buscar clientes por nombre (búsqueda parcial)
     * @param {string} nombre - Nombre o parte del nombre
     * @returns {Array} Lista de clientes que coinciden
     */
    searchByName(nombre) {
        return this.dbManager.query(`
            SELECT
                cliente_id,
                rfc,
                nombre,
                tipo_persona,
                telefono,
                celular,
                correo AS email,
                direccion,
                notas,
                fecha_nacimiento,
                activo,
                fecha_eliminacion,
                fecha_creacion,
                fecha_modificacion
            FROM Cliente
            WHERE nombre LIKE ? AND activo = 1
            ORDER BY nombre ASC
        `, [`%${nombre}%`]);
    }

    /**
     * Listar todos los clientes activos
     * @param {number} limit - Límite de resultados (opcional)
     * @param {number} offset - Offset para paginación (opcional)
     * @returns {Array} Lista de clientes
     */
    getAll(limit = 1000, offset = 0) {
        return this.dbManager.query(`
            SELECT
                cliente_id,
                rfc,
                nombre,
                tipo_persona,
                telefono,
                celular,
                correo AS email,
                direccion,
                notas,
                fecha_nacimiento,
                activo,
                fecha_eliminacion,
                fecha_creacion,
                fecha_modificacion
            FROM Cliente
            WHERE activo = 1
            ORDER BY fecha_creacion DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);
    }

    /**
     * Actualizar datos de cliente
     * @param {number} clienteId - ID del cliente
     * @param {Object} clienteData - Datos a actualizar
     * @returns {boolean} True si se actualizó
     */
    update(clienteId, clienteData) {
        const { nombre, rfc, tipo_persona, email, telefono, celular, direccion, notas } = clienteData;

        const result = this.dbManager.execute(`
            UPDATE Cliente
            SET nombre = ?,
                rfc = ?,
                tipo_persona = ?,
                correo = ?,
                telefono = ?,
                celular = ?,
                direccion = ?,
                notas = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE cliente_id = ? AND activo = 1
        `, [nombre, rfc, tipo_persona, email, telefono, celular, direccion, notas, clienteId]);

        return result.changes > 0;
    }

    /**
     * Eliminar cliente (soft delete)
     * @param {number} clienteId - ID del cliente
     * @returns {boolean} True si se eliminó
     */
    delete(clienteId) {
        const result = this.dbManager.execute(`
            UPDATE Cliente
            SET activo = 0,
                fecha_eliminacion = CURRENT_TIMESTAMP
            WHERE cliente_id = ?
        `, [clienteId]);

        return result.changes > 0;
    }

    /**
     * Obtener pólizas de un cliente
     * @param {number} clienteId - ID del cliente
     * @returns {Array} Pólizas del cliente
     */
    getPolizas(clienteId) {
        return this.dbManager.query(`
            SELECT
                p.poliza_id,
                p.numero_poliza,
                a.nombre AS aseguradora_nombre,
                r.nombre AS ramo_nombre,
                p.vigencia_inicio,
                p.vigencia_fin,
                p.prima_total,
                p.estado_pago
            FROM Poliza p
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
            WHERE p.cliente_id = ?
            ORDER BY p.fecha_creacion DESC
        `, [clienteId]);
    }

    /**
     * Contar total de clientes activos
     * @returns {number} Total de clientes
     */
    count() {
        const result = this.dbManager.queryOne(`
            SELECT COUNT(*) as total FROM Cliente WHERE activo = 1
        `);

        return result ? result.total : 0;
    }
}

module.exports = ClienteModel;
