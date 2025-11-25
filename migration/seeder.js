// seeder.js - Script para poblar la base de datos con datos de prueba realistas

const path = require('path');
const fs = require('fs');

// Importar la instancia singleton de DatabaseManager
const { dbManager } = require('../models/database');
const PolizaModel = require('../models/poliza_model');

// Importar helpers
const { generarRFCAleatorio } = require('./helpers/rfc-generator');
const {
    generarNombreCompleto,
    generarRazonSocial,
    generarDireccion,
    generarTelefono,
    generarEmail,
    generarFechaNacimiento,
    generarFechaConstitucion,
    generarNumeroPoliza,
    generarMontoPorRamo
} = require('./helpers/faker-data');

// Configuración del seeder
const CONFIG = {
    clientes: 75,
    polizas: 350,
    porcentajePagados: 65, // 65% de recibos marcados como pagados
    aniosHistorico: 3,
    mesesFuturo: 6
};

/**
 * Limpia los datos existentes (excepto catálogos y usuario admin)
 */
function limpiarDatos() {
    console.log('\n🧹 Limpiando datos existentes...');

    dbManager.execute('BEGIN TRANSACTION');

    try {
        // Eliminar en orden inverso de dependencias
        dbManager.execute('DELETE FROM AuditoriaPoliza');
        dbManager.execute('DELETE FROM Documento');
        dbManager.execute('DELETE FROM Recibo');
        dbManager.execute('DELETE FROM Poliza');
        dbManager.execute('DELETE FROM Cliente');

        // Resetear auto-increment
        dbManager.execute('DELETE FROM sqlite_sequence WHERE name IN ("Cliente", "Poliza", "Recibo", "Documento", "AuditoriaPoliza")');

        dbManager.execute('COMMIT');
        console.log('✅ Datos limpiados correctamente');
    } catch (error) {
        dbManager.execute('ROLLBACK');
        console.error('❌ Error limpiando datos:', error);
        throw error;
    }
}

/**
 * Obtiene los catálogos necesarios
 */
function obtenerCatalogos() {
    console.log('\n📋 Cargando catálogos...');

    const catalogos = {
        aseguradoras: dbManager.query('SELECT aseguradora_id, nombre FROM Aseguradora WHERE activo = 1'),
        ramos: dbManager.query('SELECT ramo_id, nombre FROM Ramo WHERE activo = 1'),
        periodicidades: dbManager.query('SELECT periodicidad_id, nombre, meses FROM Periodicidad'),
        metodosPago: dbManager.query('SELECT metodo_pago_id, nombre FROM MetodoPago')
    };

    console.log(`   ✓ ${catalogos.aseguradoras.length} Aseguradoras`);
    console.log(`   ✓ ${catalogos.ramos.length} Ramos`);
    console.log(`   ✓ ${catalogos.periodicidades.length} Periodicidades`);
    console.log(`   ✓ ${catalogos.metodosPago.length} Métodos de Pago`);

    return catalogos;
}

/**
 * Genera clientes aleatorios
 */
function generarClientes(cantidad) {
    console.log(`\n👥 Generando ${cantidad} clientes...`);

    const clientes = [];
    const rfcsGenerados = new Set();

    dbManager.execute('BEGIN TRANSACTION');

    try {
        for (let i = 0; i < cantidad; i++) {
            const tipoPersona = Math.random() > 0.7 ? 'Moral' : 'Física';
            let rfc;

            // Generar RFC único
            do {
                rfc = generarRFCAleatorio(tipoPersona);
            } while (rfcsGenerados.has(rfc));
            rfcsGenerados.add(rfc);

            const nombre = tipoPersona === 'Moral' ? generarRazonSocial() : generarNombreCompleto();
            const direccion = generarDireccion();
            const telefono = generarTelefono();
            const celular = generarTelefono();
            const correo = generarEmail(nombre);
            const fechaNacimiento = tipoPersona === 'Física' ? generarFechaNacimiento() : generarFechaConstitucion();

            const result = dbManager.execute(`
                INSERT INTO Cliente (rfc, nombre, tipo_persona, telefono, celular, correo, direccion, fecha_nacimiento, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            `, [rfc, nombre, tipoPersona, telefono, celular, correo, direccion, fechaNacimiento]);

            clientes.push({
                cliente_id: result.lastInsertRowid,
                nombre,
                tipo_persona: tipoPersona
            });

            if ((i + 1) % 25 === 0) {
                console.log(`   ✓ ${i + 1} clientes creados...`);
            }
        }

        dbManager.execute('COMMIT');
        console.log(`✅ ${clientes.length} clientes generados exitosamente`);
        return clientes;
    } catch (error) {
        dbManager.execute('ROLLBACK');
        console.error('❌ Error generando clientes:', error);
        throw error;
    }
}

/**
 * Genera fechas aleatorias dentro del rango histórico
 */
function generarFechaVigencia() {
    const ahora = new Date();
    const inicioHistorico = new Date();
    inicioHistorico.setFullYear(ahora.getFullYear() - CONFIG.aniosHistorico);

    const finFuturo = new Date();
    finFuturo.setMonth(ahora.getMonth() + CONFIG.mesesFuturo);

    // Generar fecha de inicio entre histórico y futuro
    const inicio = new Date(inicioHistorico.getTime() + Math.random() * (finFuturo.getTime() - inicioHistorico.getTime()));

    // Duración: entre 6 meses y 2 años
    const duracionMeses = Math.floor(Math.random() * 18) + 6;
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + duracionMeses);

    return {
        vigencia_inicio: inicio.toISOString().split('T')[0],
        vigencia_fin: fin.toISOString().split('T')[0]
    };
}

/**
 * Genera pólizas aleatorias usando PolizaModel para auto-generar recibos
 */
function generarPolizas(cantidad, clientes, catalogos) {
    console.log(`\n📄 Generando ${cantidad} pólizas...`);

    const polizas = [];
    const numerosGenerados = new Set();
    const polizaModel = new PolizaModel(dbManager);

    let totalRecibosGenerados = 0;

    try {
        for (let i = 0; i < cantidad; i++) {
            let numeroPoliza;
            do {
                numeroPoliza = generarNumeroPoliza();
            } while (numerosGenerados.has(numeroPoliza));
            numerosGenerados.add(numeroPoliza);

            const cliente = clientes[Math.floor(Math.random() * clientes.length)];
            const aseguradora = catalogos.aseguradoras[Math.floor(Math.random() * catalogos.aseguradoras.length)];
            const ramo = catalogos.ramos[Math.floor(Math.random() * catalogos.ramos.length)];

            // Periodicidades más comunes: mensual (40%), trimestral (25%), semestral (20%), anual (15%)
            const rand = Math.random();
            let periodicidad;
            if (rand < 0.4) periodicidad = catalogos.periodicidades.find(p => p.nombre === 'Mensual');
            else if (rand < 0.65) periodicidad = catalogos.periodicidades.find(p => p.nombre === 'Trimestral');
            else if (rand < 0.85) periodicidad = catalogos.periodicidades.find(p => p.nombre === 'Semestral');
            else periodicidad = catalogos.periodicidades.find(p => p.nombre === 'Anual');

            const metodoPago = catalogos.metodosPago[Math.floor(Math.random() * catalogos.metodosPago.length)];

            const tipoPoliza = Math.random() > 0.3 ? 'nuevo' : 'renovacion';
            const domiciliada = metodoPago.nombre === 'Domiciliado' ? 1 : 0;

            const primaNeta = generarMontoPorRamo(ramo.nombre);
            const primaTotal = Math.round(primaNeta * (1 + Math.random() * 0.3) * 100) / 100;

            const { vigencia_inicio, vigencia_fin } = generarFechaVigencia();

            const comision = Math.round((Math.random() * 15 + 5) * 100) / 100;
            const sumaAsegurada = Math.round(primaNeta * (Math.random() * 40 + 10));

            // Usar PolizaModel.create() para auto-generar recibos
            const polizaData = {
                numero_poliza: numeroPoliza,
                cliente_id: cliente.cliente_id,
                aseguradora_id: aseguradora.aseguradora_id,
                ramo_id: ramo.ramo_id,
                tipo_poliza: tipoPoliza,
                prima_neta: primaNeta,
                prima_total: primaTotal,
                vigencia_inicio: vigencia_inicio,
                vigencia_fin: vigencia_fin,
                vigencia_renovacion_automatica: Math.random() > 0.7,
                periodicidad_id: periodicidad.periodicidad_id,
                metodo_pago_id: metodoPago.metodo_pago_id,
                domiciliada: domiciliada === 1,
                estado_pago: 'pendiente',
                comision_porcentaje: comision,
                suma_asegurada: sumaAsegurada
            };

            const result = polizaModel.create(polizaData);

            polizas.push({
                poliza_id: result.poliza_id,
                numero_poliza: numeroPoliza,
                cliente_nombre: cliente.nombre
            });

            totalRecibosGenerados += result.recibos_generados;

            if ((i + 1) % 50 === 0) {
                console.log(`   ✓ ${i + 1} pólizas creadas...`);
            }
        }

        console.log(`✅ ${polizas.length} pólizas generadas exitosamente`);
        console.log(`✅ ${totalRecibosGenerados} recibos auto-generados`);
        return polizas;
    } catch (error) {
        console.error('❌ Error generando pólizas:', error);
        throw error;
    }
}

/**
 * Marca recibos como pagados según configuración
 */
function marcarRecibosPagados() {
    console.log(`\n💰 Marcando recibos como pagados (${CONFIG.porcentajePagados}%)...`);

    dbManager.execute('BEGIN TRANSACTION');

    try {
        // Obtener todos los recibos pendientes ordenados por fecha de corte
        const recibos = dbManager.query(`
            SELECT recibo_id, fecha_corte, monto
            FROM Recibo
            WHERE estado = 'pendiente'
            ORDER BY fecha_corte ASC
        `);

        const totalRecibos = recibos.length;
        const cantidadPagar = Math.floor(totalRecibos * (CONFIG.porcentajePagados / 100));

        // Estrategia: pagar más recibos antiguos que recientes (más realista)
        let pagados = 0;
        const metodosPago = ['Transferencia Bancaria', 'Domiciliado', 'Tarjeta de Crédito', 'Cheque', 'Efectivo'];

        for (let i = 0; i < recibos.length && pagados < cantidadPagar; i++) {
            // Probabilidad decreciente: recibos más antiguos tienen mayor probabilidad de estar pagados
            const probabilidad = 1 - (i / recibos.length);

            if (Math.random() < probabilidad || i < cantidadPagar * 0.7) {
                const recibo = recibos[i];
                const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];

                // Fecha de pago: entre fecha_corte y fecha_corte + 15 días
                const fechaCorte = new Date(recibo.fecha_corte);
                const diasExtra = Math.floor(Math.random() * 15);
                const fechaPago = new Date(fechaCorte);
                fechaPago.setDate(fechaPago.getDate() + diasExtra);

                const referencia = `REF-${Math.floor(Math.random() * 900000) + 100000}`;

                dbManager.execute(`
                    UPDATE Recibo
                    SET estado = 'pagado',
                        fecha_pago = ?,
                        metodo_pago = ?,
                        referencia_pago = ?
                    WHERE recibo_id = ?
                `, [fechaPago.toISOString(), metodoPago, referencia, recibo.recibo_id]);

                pagados++;
            }
        }

        // Marcar recibos vencidos (fecha_corte pasada y no pagados)
        const recibosVencidos = dbManager.execute(`
            UPDATE Recibo
            SET estado = 'vencido'
            WHERE estado = 'pendiente'
            AND DATE(fecha_corte) < DATE('now')
        `);

        dbManager.execute('COMMIT');

        console.log(`✅ ${pagados} recibos marcados como pagados`);
        console.log(`✅ ${recibosVencidos.changes} recibos marcados como vencidos`);

        return { pagados, vencidos: recibosVencidos.changes };
    } catch (error) {
        dbManager.execute('ROLLBACK');
        console.error('❌ Error marcando recibos como pagados:', error);
        throw error;
    }
}

/**
 * Muestra estadísticas finales
 */
function mostrarEstadisticas() {
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    console.log('═'.repeat(60));

    const stats = {
        clientes: dbManager.queryOne('SELECT COUNT(*) as total FROM Cliente WHERE activo = 1'),
        polizas: dbManager.queryOne('SELECT COUNT(*) as total FROM Poliza WHERE activo = 1'),
        recibos: dbManager.queryOne('SELECT COUNT(*) as total FROM Recibo'),
        recibosPagados: dbManager.queryOne('SELECT COUNT(*) as total FROM Recibo WHERE estado = "pagado"'),
        recibosVencidos: dbManager.queryOne('SELECT COUNT(*) as total FROM Recibo WHERE estado = "vencido"'),
        recibosPendientes: dbManager.queryOne('SELECT COUNT(*) as total FROM Recibo WHERE estado = "pendiente"'),
        montoPorCobrar: dbManager.queryOne('SELECT COALESCE(SUM(monto), 0) as total FROM Recibo WHERE estado IN ("pendiente", "vencido")'),
        montoCobrado: dbManager.queryOne('SELECT COALESCE(SUM(monto), 0) as total FROM Recibo WHERE estado = "pagado"')
    };

    console.log(`\n👥 Clientes:              ${stats.clientes.total}`);
    console.log(`📄 Pólizas:               ${stats.polizas.total}`);
    console.log(`\n📋 Recibos Totales:       ${stats.recibos.total}`);
    console.log(`   ✅ Pagados:            ${stats.recibosPagados.total} (${((stats.recibosPagados.total / stats.recibos.total) * 100).toFixed(1)}%)`);
    console.log(`   ⏳ Pendientes:         ${stats.recibosPendientes.total} (${((stats.recibosPendientes.total / stats.recibos.total) * 100).toFixed(1)}%)`);
    console.log(`   ❌ Vencidos:           ${stats.recibosVencidos.total} (${((stats.recibosVencidos.total / stats.recibos.total) * 100).toFixed(1)}%)`);
    console.log(`\n💰 Monto Cobrado:         $${stats.montoCobrado.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
    console.log(`💸 Monto Por Cobrar:      $${stats.montoPorCobrar.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);

    console.log('\n═'.repeat(60));
}

/**
 * Función principal del seeder
 */
async function ejecutarSeeder() {
    console.log('\n🌱 INICIANDO SEEDER DE BASE DE DATOS');
    console.log('═'.repeat(60));
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-MX')}`);
    console.log(`📊 Configuración:`);
    console.log(`   • Clientes: ${CONFIG.clientes}`);
    console.log(`   • Pólizas: ${CONFIG.polizas}`);
    console.log(`   • Periodo histórico: ${CONFIG.aniosHistorico} años`);
    console.log(`   • Proyección futura: ${CONFIG.mesesFuturo} meses`);
    console.log(`   • Recibos pagados: ${CONFIG.porcentajePagados}%`);
    console.log('═'.repeat(60));

    const inicio = Date.now();

    try {
        // 0. Asegurar que la base de datos está inicializada
        console.log('\n📂 Verificando base de datos...');
        if (!dbManager.db) {
            console.log('   Inicializando base de datos...');
            await dbManager.initialize();
        }
        console.log('✅ Base de datos cargada');

        // 1. Limpiar datos existentes
        limpiarDatos();

        // 2. Cargar catálogos
        const catalogos = obtenerCatalogos();

        // 3. Generar clientes
        const clientes = generarClientes(CONFIG.clientes);

        // 4. Generar pólizas (esto auto-genera recibos)
        const polizas = generarPolizas(CONFIG.polizas, clientes, catalogos);

        // 5. Marcar recibos como pagados
        marcarRecibosPagados();

        // 6. Mostrar estadísticas
        mostrarEstadisticas();

        const tiempoTotal = ((Date.now() - inicio) / 1000).toFixed(2);
        console.log(`\n✅ SEEDER COMPLETADO EXITOSAMENTE en ${tiempoTotal}s`);

    } catch (error) {
        console.error('\n💥 ERROR CRÍTICO EN EL SEEDER:');
        console.error(error);
        process.exit(1);
    }
}

// Ejecutar el seeder
if (require.main === module) {
    ejecutarSeeder().then(() => {
        console.log('\n👋 Seeder finalizado. Base de datos lista para usar.');
        process.exit(0);
    }).catch((error) => {
        console.error('\n💥 Error fatal:', error);
        process.exit(1);
    });
}

module.exports = { ejecutarSeeder };
