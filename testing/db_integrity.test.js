/**
 * testing/db_integrity.test.js
 * 
 * Verifica inserciones válidas e inválidas y las restricciones de llaves foráneas
 * utilizando el schema v2.0 con sql.js en memoria.
 */

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');

async function run() {
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    const schemaPath = path.join(__dirname, '..', 'migration', 'schema_v2.sql');
    const seedsPath = path.join(__dirname, '..', 'migration', 'seeds.sql');

    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.run(schema);

    let seeds = fs.readFileSync(seedsPath, 'utf8');
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = bcrypt.hashSync('admin123', 10);
    seeds = seeds
        .replace('TEMP_HASH_PLACEHOLDER', passwordHash)
        .replace('TEMP_SALT_PLACEHOLDER', salt);
    db.run(seeds);

    const execSingleValue = (query) => {
        const result = db.exec(query);
        if (result.length === 0) return null;
        return result[0].values[0][0];
    };

    // ---------- Inserción válida de Cliente ----------
    db.run(`
        INSERT INTO Cliente (
            rfc,
            nombre,
            tipo_persona,
            telefono,
            correo,
            direccion,
            notas
        ) VALUES (
            'TESTC900101ABC',
            'Cliente Prueba',
            'Física',
            '5551234567',
            'cliente.prueba@example.com',
            'Calle Falsa 123',
            'Registro de prueba'
        );
    `);
    const clienteTestId = execSingleValue(`
        SELECT cliente_id FROM Cliente WHERE rfc = 'TESTC900101ABC';
    `);
    assert(clienteTestId, 'No se insertó el cliente de prueba');

    let clienteDuplicadoError = null;
    try {
        db.run(`
            INSERT INTO Cliente (rfc, nombre)
            VALUES ('TESTC900101ABC', 'Duplicado');
        `);
    } catch (err) {
        clienteDuplicadoError = err;
    }
    assert(
        clienteDuplicadoError && /UNIQUE/.test(clienteDuplicadoError.message),
        'La inserción duplicada de cliente no disparó UNIQUE'
    );

    // ---------- Inserción válida de Aseguradora ----------
    db.run(`
        INSERT INTO Aseguradora (nombre, activo)
        VALUES ('Aseguradora de Prueba', 1);
    `);
    const asegId = execSingleValue(`
        SELECT aseguradora_id FROM Aseguradora WHERE nombre = 'Aseguradora de Prueba';
    `);
    assert(asegId, 'No se insertó la aseguradora de prueba');

    let asegDuplicadaError = null;
    try {
        db.run(`INSERT INTO Aseguradora (nombre) VALUES ('Aseguradora de Prueba');`);
    } catch (err) {
        asegDuplicadaError = err;
    }
    assert(
        asegDuplicadaError && /UNIQUE/.test(asegDuplicadaError.message),
        'La inserción duplicada de aseguradora no disparó UNIQUE'
    );

    // ---------- Inserción válida de Ramo ----------
    db.run(`
        INSERT INTO Ramo (nombre, descripcion, activo)
        VALUES ('Ramo Prueba', 'Cobertura de ejemplo', 1);
    `);
    const ramoId = execSingleValue(`
        SELECT ramo_id FROM Ramo WHERE nombre = 'Ramo Prueba';
    `);
    assert(ramoId, 'No se insertó el ramo de prueba');

    let ramoDuplicadoError = null;
    try {
        db.run(`INSERT INTO Ramo (nombre) VALUES ('Ramo Prueba');`);
    } catch (err) {
        ramoDuplicadoError = err;
    }
    assert(
        ramoDuplicadoError && /UNIQUE/.test(ramoDuplicadoError.message),
        'La inserción duplicada de ramo no disparó UNIQUE'
    );

    // ---------- Inserción válida de Usuario ----------
    const nuevoSalt = crypto.randomBytes(16).toString('hex');
    const nuevoHash = bcrypt.hashSync('secret123', 10);
    db.run(`
        INSERT INTO Usuario (
            username,
            email,
            password_hash,
            salt,
            rol,
            activo
        ) VALUES (
            'tester',
            'tester@example.com',
            '${nuevoHash}',
            '${nuevoSalt}',
            'operador',
            1
        );
    `);
    const usuarioId = execSingleValue(`
        SELECT usuario_id FROM Usuario WHERE username = 'tester';
    `);
    assert(usuarioId, 'No se insertó el usuario de prueba');

    let usuarioDuplicadoError = null;
    try {
        db.run(`
            INSERT INTO Usuario (
                username,
                email,
                password_hash,
                salt
            ) VALUES (
                'tester',
                'tester2@example.com',
                '${nuevoHash}',
                '${nuevoSalt}'
            );
        `);
    } catch (err) {
        usuarioDuplicadoError = err;
    }
    assert(
        usuarioDuplicadoError && /UNIQUE/.test(usuarioDuplicadoError.message),
        'La inserción duplicada de usuario no disparó UNIQUE'
    );

    // ---------- Inserción válida de Póliza ----------
    db.run(`
        INSERT INTO Poliza (
            numero_poliza,
            cliente_id,
            aseguradora_id,
            ramo_id,
            tipo_poliza,
            prima_neta,
            prima_total,
            vigencia_inicio,
            vigencia_fin,
            vigencia_renovacion_automatica,
            periodicidad_id,
            metodo_pago_id,
            domiciliada,
            estado_pago,
            comision_porcentaje,
            suma_asegurada,
            notas
        ) VALUES (
            'TEST-POL-001',
            1,
            1,
            1,
            'nuevo',
            1000.00,
            1200.00,
            '2024-01-01',
            '2024-12-31',
            0,
            1,
            1,
            0,
            'pendiente',
            10.00,
            500000.00,
            'Póliza de prueba'
        );
    `);

    const polizaId = execSingleValue(`SELECT poliza_id FROM Poliza WHERE numero_poliza = 'TEST-POL-001';`);
    assert(polizaId, 'No se insertó la póliza de prueba');

    // ---------- Inserción inválida de Póliza (FK cliente) ----------
    let invalidPolizaError = null;
    try {
        db.run(`
            INSERT INTO Poliza (
                numero_poliza,
                cliente_id,
                aseguradora_id,
                ramo_id,
                tipo_poliza,
                prima_neta,
                prima_total,
                vigencia_inicio,
                vigencia_fin,
                vigencia_renovacion_automatica,
                periodicidad_id,
                metodo_pago_id,
                domiciliada,
                estado_pago
            ) VALUES (
                'TEST-POL-INVALID',
                999,
                1,
                1,
                'nuevo',
                1000,
                1200,
                '2024-01-01',
                '2024-12-31',
                0,
                1,
                1,
                0,
                'pendiente'
            );
        `);
    } catch (err) {
        invalidPolizaError = err;
    }
    assert(
        invalidPolizaError && /FOREIGN KEY/.test(invalidPolizaError.message),
        'La inserción inválida de póliza no disparó restricción de FK'
    );

    // ---------- Inserción válida de Recibo ----------
    db.run(`
        INSERT INTO Recibo (
            poliza_id,
            numero_recibo,
            fecha_inicio_periodo,
            fecha_fin_periodo,
            numero_fraccion,
            monto,
            fecha_corte,
            fecha_vencimiento_original,
            dias_gracia,
            estado
        ) VALUES (
            ${polizaId},
            'TEST-REC-001',
            '2024-01-01',
            '2024-01-31',
            1,
            100.50,
            '2024-01-15',
            '2024-01-15',
            5,
            'pendiente'
        );
    `);

    const reciboId = execSingleValue(`SELECT recibo_id FROM Recibo WHERE numero_recibo = 'TEST-REC-001';`);
    assert(reciboId, 'No se insertó el recibo de prueba');

    // ---------- Inserción inválida de Recibo (FK póliza) ----------
    let invalidReciboError = null;
    try {
        db.run(`
            INSERT INTO Recibo (
                poliza_id,
                numero_recibo,
                fecha_inicio_periodo,
                fecha_fin_periodo,
                numero_fraccion,
                monto,
                fecha_corte,
                fecha_vencimiento_original,
                dias_gracia,
                estado
            ) VALUES (
                9999,
                'TEST-REC-INVALID',
                '2024-01-01',
                '2024-01-31',
                1,
                200.00,
                '2024-01-15',
                '2024-01-15',
                5,
                'pendiente'
            );
        `);
    } catch (err) {
        invalidReciboError = err;
    }
    assert(
        invalidReciboError && /FOREIGN KEY/.test(invalidReciboError.message),
        'La inserción inválida de recibo no disparó restricción de FK'
    );

    // ---------- Documentos: constraint de relación ----------
    let invalidDocumentoError = null;
    try {
        db.run(`
            INSERT INTO Documento (
                tipo,
                nombre_archivo,
                ruta_relativa
            ) VALUES (
                'PRUEBA',
                'archivo.pdf',
                'docs/archivo.pdf'
            );
        `);
    } catch (err) {
        invalidDocumentoError = err;
    }
    assert(
        invalidDocumentoError && /CHECK constraint failed/.test(invalidDocumentoError.message),
        'El documento sin relación no disparó el CHECK constraint'
    );

    db.run(`
        INSERT INTO Documento (
            cliente_id,
            tipo,
            nombre_archivo,
            ruta_relativa
        ) VALUES (
            1,
            'Identificación',
            'ine.pdf',
            'docs/ine.pdf'
        );
    `);

    const documentoId = execSingleValue(`SELECT documento_id FROM Documento WHERE nombre_archivo = 'ine.pdf';`);
    assert(documentoId, 'El documento válido no se insertó correctamente');

    console.log('✅ Pruebas de integridad superadas: FKs y constraints operativos.');
}

run().catch((err) => {
    console.error('❌ Falló la prueba de integridad:', err);
    process.exit(1);
});
