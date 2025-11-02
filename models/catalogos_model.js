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
}

module.exports = CatalogosModel;
