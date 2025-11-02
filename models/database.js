// models/database.js
// DatabaseManager - Gestor centralizado usando sql.js (JavaScript puro)

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class DatabaseManager {
    constructor(dbName = "gestor_polizas_v2.sqlite") {
        this.dbPath = path.join(__dirname, '..', dbName);
        this.db = null;
        this.SQL = null;
    }

    async initialize() {
        console.log(`📦 Inicializando base de datos: ${path.basename(this.dbPath)}`);

        // 1. Inicializar sql.js
        this.SQL = await initSqlJs();

        // 2. Cargar o crear base de datos
        if (fs.existsSync(this.dbPath)) {
            const buffer = fs.readFileSync(this.dbPath);
            this.db = new this.SQL.Database(buffer);
            console.log('✅ Base de datos cargada desde archivo');
            await this._migrateIfNeeded();
        } else {
            this.db = new this.SQL.Database();
            console.log('🔧 Creando nueva base de datos...');
            await this._createSchema();
        }

        return this;
    }

    _columnExists(table, column) {
        try {
            const info = this.query(`PRAGMA table_info(${table})`);
            return info.some(col => col.name === column);
        } catch (error) {
            console.warn(`No se pudo inspeccionar la tabla ${table}:`, error.message);
            return false;
        }
    }

    async _migrateIfNeeded() {
        const needsReciboMigration = !this._columnExists('Recibo', 'fecha_inicio_periodo');
        const needsPolizaMigration = !this._columnExists('Poliza', 'prima_neta');

        if (needsReciboMigration || needsPolizaMigration) {
            console.warn('⚠️  Se detectó un esquema antiguo. Se regenerará la base de datos con el schema v2.');

            try {
                if (fs.existsSync(this.dbPath)) {
                    const backupPath = this.dbPath + '.bak';
                    fs.copyFileSync(this.dbPath, backupPath);
                    console.log(`📦 Respaldo creado: ${path.basename(backupPath)}`);
                }
            } catch (error) {
                console.error('No se pudo crear respaldo de la base de datos:', error.message);
            }

            try {
                this.db.close();
            } catch (error) {
                console.warn('Error al cerrar base de datos previa:', error.message);
            }

            this.db = new this.SQL.Database();
            await this._createSchema();
        }
    }

    async _createSchema() {
        try {
            // 1. Ejecutar schema
            const schemaPath = path.join(__dirname, '..', 'migration', 'schema_v2.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            this.db.run(schema);
            console.log('✅ Schema creado (10 tablas)');

            // 2. Ejecutar seeds
            const seedsPath = path.join(__dirname, '..', 'migration', 'seeds.sql');
            let seeds = fs.readFileSync(seedsPath, 'utf8');

            // 3. Crear usuario admin con password hasheado
            const adminPassword = 'admin123';
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = bcrypt.hashSync(adminPassword, 10);

            // Reemplazar placeholders en seeds
            seeds = seeds.replace('TEMP_HASH_PLACEHOLDER', passwordHash);
            seeds = seeds.replace('TEMP_SALT_PLACEHOLDER', salt);

            this.db.run(seeds);
            console.log('✅ Datos iniciales cargados');

            // 4. Guardar BD en disco
            this._saveToDisk();

            // Mostrar resumen
            this._showInitSummary();

        } catch (error) {
            console.error('❌ Error al crear schema:', error.message);
            throw error;
        }
    }

    _showInitSummary() {
        const stats = {
            periodicidades: this.queryOne('SELECT COUNT(*) as count FROM Periodicidad').count,
            metodosPago: this.queryOne('SELECT COUNT(*) as count FROM MetodoPago').count,
            aseguradoras: this.queryOne('SELECT COUNT(*) as count FROM Aseguradora').count,
            ramos: this.queryOne('SELECT COUNT(*) as count FROM Ramo').count,
            usuarios: this.queryOne('SELECT COUNT(*) as count FROM Usuario').count,
            clientes: this.queryOne('SELECT COUNT(*) as count FROM Cliente').count,
            polizas: this.queryOne('SELECT COUNT(*) as count FROM Poliza').count
        };

        console.log('\n📊 Resumen de datos cargados:');
        console.log(`   ├─ Periodicidades: ${stats.periodicidades}`);
        console.log(`   ├─ Métodos de pago: ${stats.metodosPago}`);
        console.log(`   ├─ Aseguradoras: ${stats.aseguradoras}`);
        console.log(`   ├─ Ramos: ${stats.ramos}`);
        console.log(`   ├─ Usuarios: ${stats.usuarios} (admin/admin123)`);
        console.log(`   ├─ Clientes ejemplo: ${stats.clientes}`);
        console.log(`   └─ Pólizas ejemplo: ${stats.polizas}\n`);
    }

    /**
     * Obtener la conexión a la base de datos
     * @returns {Database} Instancia de sql.js
     */
    getConnection() {
        return this.db;
    }

    /**
     * Ejecutar una consulta SELECT
     * @param {string} query - SQL query
     * @param {Array} params - Parámetros de la query
     * @returns {Array} Resultados
     */
    query(query, params = []) {
        try {
            const stmt = this.db.prepare(query);
            stmt.bind(params);

            const results = [];
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            stmt.free();

            return results;
        } catch (error) {
            console.error('Error en query:', error.message);
            throw error;
        }
    }

    /**
     * Ejecutar una consulta que retorna un solo resultado
     * @param {string} query - SQL query
     * @param {Array} params - Parámetros de la query
     * @returns {Object|null} Resultado o null
     */
    queryOne(query, params = []) {
        try {
            const stmt = this.db.prepare(query);
            stmt.bind(params);

            let result = null;
            if (stmt.step()) {
                result = stmt.getAsObject();
            }
            stmt.free();

            return result;
        } catch (error) {
            console.error('Error en queryOne:', error.message);
            throw error;
        }
    }

    /**
     * Ejecutar una consulta INSERT/UPDATE/DELETE
     * @param {string} query - SQL query
     * @param {Array} params - Parámetros de la query
     * @returns {Object} Resultado con changes y lastInsertRowid
     */
    execute(query, params = []) {
        try {
            const stmt = this.db.prepare(query);
            stmt.bind(params);
            stmt.step();

            const changes = this.db.getRowsModified();
            const lastIdExec = this.db.exec('SELECT last_insert_rowid() AS id');
            const lastInsertRowid =
                lastIdExec.length && lastIdExec[0].values.length
                    ? lastIdExec[0].values[0][0]
                    : 0;

            stmt.free();

            // Guardar cambios en disco
            this._saveToDisk();

            return {
                changes,
                lastInsertRowid
            };
        } catch (error) {
            console.error('Error en execute:', error.message);
            throw error;
        }
    }

    /**
     * Ejecutar múltiples queries (transacción manual)
     * @param {Function} callback - Función con las operaciones
     * @returns {*} Resultado del callback
     */
    transaction(callback) {
        try {
            this.db.run('BEGIN TRANSACTION');
            const result = callback();
            this.db.run('COMMIT');
            this._saveToDisk();
            return result;
        } catch (error) {
            this.db.run('ROLLBACK');
            throw error;
        }
    }

    /**
     * Guardar BD en disco
     * @private
     */
    _saveToDisk() {
        try {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(this.dbPath, buffer);
        } catch (error) {
            console.error('Error al guardar BD:', error.message);
        }
    }

    /**
     * Obtener métricas del dashboard
     * @returns {Object} Métricas agregadas
     */
    getDashboardMetrics() {
        try {
            // Total de pólizas activas
            const totalPolizas = this.queryOne(`
                SELECT COUNT(*) as total FROM Poliza WHERE activo = 1
            `);

            // Pólizas que vencen en los próximos 7 días
            const polizasVencen7dias = this.queryOne(`
                SELECT COUNT(*) as total FROM Poliza
                WHERE activo = 1
                AND DATE(vigencia_fin) BETWEEN DATE('now') AND DATE('now', '+7 days')
            `);

            // Cobros pendientes (suma de recibos no pagados)
            const cobrosPendientes = this.queryOne(`
                SELECT COALESCE(SUM(r.monto), 0) as total
                FROM Recibo r
                JOIN Poliza p ON r.poliza_id = p.poliza_id
                WHERE r.estado = 'pendiente' AND p.activo = 1
            `);

            // Clientes nuevos del mes actual
            const clientesMesActual = this.queryOne(`
                SELECT COUNT(*) as total FROM Cliente
                WHERE activo = 1
                AND DATE(fecha_creacion) >= DATE('now', 'start of month')
            `);

            return {
                total_polizas: totalPolizas?.total || 0,
                polizas_vencen_7dias: polizasVencen7dias?.total || 0,
                cobros_pendientes: cobrosPendientes?.total || 0,
                clientes_mes_actual: clientesMesActual?.total || 0
            };
        } catch (error) {
            console.error('Error al obtener métricas del dashboard:', error.message);
            return {
                total_polizas: 0,
                polizas_vencen_7dias: 0,
                cobros_pendientes: 0,
                clientes_mes_actual: 0
            };
        }
    }

    /**
     * Obtener pólizas con alertas
     * @returns {Array} Pólizas con información de alertas
     */
    getPolizasConAlertas() {
        try {
            return this.query(`
                SELECT
                    p.poliza_id,
                    p.numero_poliza,
                    p.vigencia_fin,
                    c.nombre AS cliente_nombre,
                    a.nombre AS aseguradora_nombre,
                    r.nombre AS ramo_nombre,
                    CAST(JULIANDAY(p.vigencia_fin) - JULIANDAY('now') AS INTEGER) AS dias_para_vencer
                FROM Poliza p
                LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
                LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
                LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
                WHERE p.activo = 1
                AND DATE(p.vigencia_fin) >= DATE('now')
                AND DATE(p.vigencia_fin) <= DATE('now', '+30 days')
                ORDER BY p.vigencia_fin ASC
            `);
        } catch (error) {
            console.error('Error al obtener pólizas con alertas:', error.message);
            return [];
        }
    }

    /**
     * Cerrar la conexión a la base de datos
     */
    close() {
        if (this.db) {
            this._saveToDisk();
            this.db.close();
            console.log('🔒 Conexión a base de datos cerrada');
        }
    }
}

// Crear instancia y exportar
const dbManager = new DatabaseManager();

module.exports = {
    // Exportar el manager para inicialización
    dbManager,

    // Función helper para inicializar
    async initDatabase() {
        await dbManager.initialize();
        return dbManager;
    }
};
