// test-pdf-recibo.js
// Script de prueba para generar PDF de recibo

const path = require('path');
const fs = require('fs');

async function testGenerarPDF() {
    console.log('='.repeat(50));
    console.log('TEST: Generación de PDF de Recibo');
    console.log('='.repeat(50));

    // Cargar el DatabaseManager (exporta singleton)
    const { dbManager, initDatabase } = require('./models/database');

    // Inicializar la base de datos
    console.log('\n1. Inicializando base de datos...');
    await initDatabase();
    console.log('   ✅ Base de datos inicializada');

    // Cargar el modelo de recibos
    const ReciboModel = require('./models/recibo_model');
    const reciboModel = new ReciboModel(dbManager);

    // Buscar un recibo pagado para generar el PDF
    console.log('\n2. Buscando recibo pagado...');
    let recibo = dbManager.queryOne(`
        SELECT r.recibo_id, r.numero_recibo, r.estado, r.monto, r.fecha_pago
        FROM Recibo r
        WHERE r.estado = 'pagado'
        LIMIT 1
    `);

    if (!recibo) {
        console.log('   ⚠️  No hay recibos pagados. Buscando cualquier recibo...');
        recibo = dbManager.queryOne(`
            SELECT r.recibo_id, r.numero_recibo, r.estado, r.monto
            FROM Recibo r
            LIMIT 1
        `);

        if (!recibo) {
            console.log('   ❌ No hay recibos en la BD');
            process.exit(1);
        }
    }

    console.log('   ✅ Recibo encontrado:');
    console.log(`      - ID: ${recibo.recibo_id}`);
    console.log(`      - Número: ${recibo.numero_recibo}`);
    console.log(`      - Estado: ${recibo.estado}`);
    console.log(`      - Monto: $${recibo.monto}`);

    // Generar PDF
    console.log('\n3. Generando PDF...');
    const result = await reciboModel.generarPDF(recibo.recibo_id);

    if (result.success) {
        console.log('   ✅ PDF generado exitosamente!');
        console.log(`   📄 Archivo: ${result.fileName}`);
        console.log(`   📁 Ruta: ${result.filePath}`);

        // Verificar que el archivo existe
        if (fs.existsSync(result.filePath)) {
            const stats = fs.statSync(result.filePath);
            console.log(`   📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('RESULTADO: ✅ ÉXITO');
        console.log('='.repeat(50));

        // Retornar la ruta para abrir el archivo
        return result.filePath;
    } else {
        console.log('   ❌ Error al generar PDF:', result.error);
        console.log('\n' + '='.repeat(50));
        console.log('RESULTADO: ❌ FALLO');
        console.log('='.repeat(50));
        return null;
    }
}

// Ejecutar el test
testGenerarPDF()
    .then(filePath => {
        if (filePath) {
            console.log('\nPDF generado en:', filePath);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Error en el test:', err);
        process.exit(1);
    });
