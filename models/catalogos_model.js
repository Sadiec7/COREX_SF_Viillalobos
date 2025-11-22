// models/catalogos_model.js
// CatalogosModel - Operaciones sobre catálogos maestros

class CatalogosModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    listarAseguradoras(activos = true) {
        const query = `
            SELECT *
            FROM Aseguradora
            ${activos ? 'WHERE activo = 1' : ''}
            ORDER BY nombre
        `;
        return this.dbManager.query(query);
    }

    listarRamos(activos = true) {
        const query = `
            SELECT *
            FROM Ramo
            ${activos ? 'WHERE activo = 1' : ''}
            ORDER BY nombre
        `;
        return this.dbManager.query(query);
    }

    listarPeriodicidades() {
        return this.dbManager.query(`
            SELECT * FROM Periodicidad ORDER BY meses
        `);
    }

    listarMetodosPago() {
        return this.dbManager.query(`
            SELECT * FROM MetodoPago ORDER BY nombre
        `);
    }

    crearAseguradora(nombre) {
        const result = this.dbManager.execute(
            `INSERT INTO Aseguradora (nombre) VALUES (?)`,
            [nombre.trim()]
        );
        return result.lastInsertRowid;
    }

    crearRamo(nombre, descripcion = null) {
        const result = this.dbManager.execute(
            `INSERT INTO Ramo (nombre, descripcion) VALUES (?, ?)`,
            [nombre.trim(), descripcion]
        );
        return result.lastInsertRowid;
    }

    actualizarAseguradora(id, nombre, activo = true) {
        const result = this.dbManager.execute(
            `
            UPDATE Aseguradora
            SET nombre = ?, activo = ?
            WHERE aseguradora_id = ?
        `,
            [nombre.trim(), activo ? 1 : 0, id]
        );
        return result.changes > 0;
    }

    actualizarRamo(id, nombre, descripcion = null, activo = true) {
        const result = this.dbManager.execute(
            `
            UPDATE Ramo
            SET nombre = ?, descripcion = ?, activo = ?
            WHERE ramo_id = ?
        `,
            [nombre.trim(), descripcion, activo ? 1 : 0, id]
        );
        return result.changes > 0;
    }

    eliminarAseguradora(id) {
        const result = this.dbManager.execute(
            `DELETE FROM Aseguradora WHERE aseguradora_id = ?`,
            [id]
        );
        return result.changes > 0;
    }

    eliminarRamo(id) {
        const result = this.dbManager.execute(
            `DELETE FROM Ramo WHERE ramo_id = ?`,
            [id]
        );
        return result.changes > 0;
    }

    // Periodicidades
    crearPeriodicidad(nombre, meses) {
        const result = this.dbManager.execute(
            `INSERT INTO Periodicidad (nombre, meses) VALUES (?, ?)`,
            [nombre.trim(), meses]
        );
        return result.lastInsertRowid;
    }

    actualizarPeriodicidad(id, nombre, meses) {
        const result = this.dbManager.execute(
            `UPDATE Periodicidad SET nombre = ?, meses = ? WHERE periodicidad_id = ?`,
            [nombre.trim(), meses, id]
        );
        return result.changes > 0;
    }

    eliminarPeriodicidad(id) {
        const result = this.dbManager.execute(
            `DELETE FROM Periodicidad WHERE periodicidad_id = ?`,
            [id]
        );
        return result.changes > 0;
    }

    // Métodos de Pago
    crearMetodoPago(nombre) {
        const result = this.dbManager.execute(
            `INSERT INTO MetodoPago (nombre) VALUES (?)`,
            [nombre.trim()]
        );
        return result.lastInsertRowid;
    }

    actualizarMetodoPago(id, nombre) {
        const result = this.dbManager.execute(
            `UPDATE MetodoPago SET nombre = ? WHERE metodo_pago_id = ?`,
            [nombre.trim(), id]
        );
        return result.changes > 0;
    }

    eliminarMetodoPago(id) {
        const result = this.dbManager.execute(
            `DELETE FROM MetodoPago WHERE metodo_pago_id = ?`,
            [id]
        );
        return result.changes > 0;
    }
}

module.exports = CatalogosModel;
