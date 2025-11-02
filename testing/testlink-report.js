// testlink-report.js
// Automatiza el envío de resultados PASS y adjuntos a TestLink vía XML-RPC.
const xmlrpc = require('xmlrpc');
const fs = require('fs');
const path = require('path');

const TESTLINK_URL = process.env.TESTLINK_URL || 'http://localhost/testlink/lib/api/xmlrpc/v1/xmlrpc.php';
const TESTLINK_DEVKEY = process.env.TESTLINK_DEVKEY || 'DEVANGEL-API-KEY-20251013';
const TEST_PLAN_ID = parseInt(process.env.TESTLINK_PLAN_ID || '768', 10);
const BUILD_ID = parseInt(process.env.TESTLINK_BUILD_ID || '1', 10);

const EVIDENCES_DIR = path.join(__dirname, 'test-evidences');

const CASES = [
  {
    externalId: 'COREX-21',
    name: 'TC-LOG-001 - Inicio de sesión válido',
    nodeId: 228,
    note: 'Login exitoso con credenciales admin/admin123 utilizando app Electron.',
    evidence: [
      'TC-LOG-001_01_pantalla_login.png',
      'TC-LOG-001_04_dashboard_exitoso.png'
    ]
  },
  {
    externalId: 'COREX-22',
    name: 'TC-LOG-002 - Contraseña incorrecta',
    nodeId: 229,
    note: 'Validación de error al ingresar contraseña incorrecta.',
    evidence: [
      'TC-LOG-002_01_credenciales_invalidas.png',
      'TC-LOG-002_02_mensaje_error.png'
    ]
  },
  {
    externalId: 'COREX-23',
    name: 'TC-LOG-003 - Usuario inexistente',
    nodeId: 230,
    note: 'Mensaje de autenticación cuando el usuario no existe.',
    evidence: [
      'TC-LOG-003_01_usuario_inexistente.png',
      'TC-LOG-003_02_mensaje_error.png'
    ]
  },
  {
    externalId: 'COREX-25',
    name: 'TC-LOG-005 - Campo contraseña vacío',
    nodeId: 232,
    note: 'Validación HTML5 cuando el campo contraseña se envía vacío.',
    evidence: [
      'TC-LOG-005_01_password_vacio.png',
      'TC-LOG-005_02_validacion.png'
    ]
  },
  {
    externalId: 'COREX-26',
    name: 'TC-LOG-006 - Campo usuario vacío',
    nodeId: 233,
    note: 'Validación HTML5 cuando el campo usuario se envía vacío.',
    evidence: [
      'TC-LOG-006_01_usuario_vacio.png',
      'TC-LOG-006_02_validacion.png'
    ]
  },
  {
    externalId: 'COREX-29',
    name: 'TC-LOG-009 - Cierre de sesión exitoso',
    nodeId: 236,
    note: 'Verificación de logout y retorno a pantalla de login.',
    evidence: [
      'TC-LOG-009_01_dashboard_activo.png',
      'TC-LOG-009_03_vuelta_login.png'
    ]
  },
  {
    externalId: 'COREX-30',
    name: 'TC-LOG-010 - Redirección automática al dashboard después del login',
    nodeId: 237,
    note: 'Confirmación de redirección automática al dashboard tras login exitoso.',
    evidence: [
      'TC-LOG-010_01_dashboard_post_login.png'
    ]
  },
  {
    externalId: 'COREX-1',
    name: 'TC-CLI-001 - Registro de cliente con datos válidos',
    nodeId: 208,
    note: 'Creación de cliente físico con datos completos.',
    evidence: [
      'TC-CLI-001_02_formulario_nuevo.png',
      'TC-CLI-001_04_alert.png',
      'TC-CLI-001_05_cliente_creado.png'
    ]
  },
  {
    externalId: 'COREX-2',
    name: 'TC-CLI-002 - Bloqueo por RFC duplicado',
    nodeId: 209,
    note: 'Validación de unicidad de RFC en creación de cliente.',
    evidence: [
      'TC-CLI-002_01_formulario_nuevo.png',
      'TC-CLI-002_02_rfc_duplicado.png',
      'TC-CLI-002_04_alert.png',
      'TC-CLI-002_03_mensaje_error.png'
    ]
  },
  {
    externalId: 'COREX-3',
    name: 'TC-CLI-003 - Edición básica de contacto',
    nodeId: 210,
    note: 'Actualización de teléfono para cliente existente.',
    evidence: [
      'TC-CLI-003_01_lista_clientes.png',
      'TC-CLI-003_04_cliente_actualizado.png'
    ]
  },
  {
    externalId: 'COREX-5',
    name: 'TC-CLI-005 - Correo electrónico con formato inválido',
    nodeId: 212,
    note: 'Validación de formato de correo en alta de cliente.',
    evidence: [
      'TC-CLI-005_01_email_invalido.png',
      'TC-CLI-005_03_alert.png',
      'TC-CLI-005_02_mensaje_error.png'
    ]
  },
  {
    externalId: 'COREX-52',
    name: 'TC-POL-005 - Validación de duplicidad de número de póliza',
    nodeId: 259,
    note: 'Detección de número de póliza duplicado en alta.',
    evidence: [
      'TC-POL-005_01_modulo_polizas.png',
      'TC-POL-005_04_alert.png',
      'TC-POL-005_03_error_duplicado.png'
    ]
  },
  {
    externalId: 'COREX-54',
    name: 'TC-POL-007 - Filtrado por estado de póliza',
    nodeId: 261,
    note: 'Uso de filtro por estado de póliza en la tabla.',
    evidence: [
      'TC-POL-007_01_lista_completa.png',
      'TC-POL-007_03_filtro_vencidas.png'
    ]
  },
  {
    externalId: 'COREX-41',
    name: 'TC-UI-001 - Consistencia visual de formulario de cliente',
    nodeId: 248,
    note: 'Inspección visual del formulario de clientes.',
    evidence: [
      'TC-UI-001_01_form_cliente.png'
    ]
  },
  {
    externalId: 'COREX-44',
    name: 'TC-UI-004 - Validar contraste de colores y legibilidad del texto',
    nodeId: 251,
    note: 'Verificación de contraste en dashboard según lineamientos UI.',
    evidence: [
      'TC-UI-004_01_dashboard_contraste.png'
    ]
  },
  {
    externalId: 'COREX-47',
    name: 'TC-UI-007 - Verificar que el logo y nombre de la aplicación se muestren correctamente',
    nodeId: 254,
    note: 'Presencia del logo en login y dashboard.',
    evidence: [
      'TC-UI-007_01_logo_sidebar.png',
      'TC-UI-007_02_logo_login.png'
    ]
  },
  {
    externalId: 'COREX-48',
    name: 'TC-UI-008 - Verificar alineación y espaciado uniforme en formularios',
    nodeId: 255,
    note: 'Chequeo de alineación general en formularios de clientes.',
    evidence: [
      'TC-UI-008_01_formulario_alineado.png'
    ]
  },
  {
    externalId: 'COREX-49',
    name: 'TC-UI-009 - Validar que los botones tengan estados hover y active',
    nodeId: 256,
    note: 'Estados hover en botones principales de la app.',
    evidence: [
      'TC-UI-009_01_hover_boton_nuevo.png',
      'TC-UI-009_02_hover_boton_editar.png'
    ]
  },
  {
    externalId: 'COREX-50',
    name: 'TC-UI-010 - Comprobar que los iconos y elementos visuales cargan correctamente',
    nodeId: 257,
    note: 'Iconografía presente en módulo de clientes.',
    evidence: [
      'TC-UI-010_01_iconos_clientes.png'
    ]
  }
];

const client = xmlrpc.createClient(TESTLINK_URL);

function call(method, params) {
  return new Promise((resolve, reject) => {
    client.methodCall(method, [params], (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}

async function uploadAttachment(executionId, filename) {
  const filePath = path.join(EVIDENCES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`   ⚠ Evidencia no encontrada: ${filename}`);
    return;
  }
  const buffer = fs.readFileSync(filePath);
  try {
    await call('tl.uploadExecutionAttachment', {
      devKey: TESTLINK_DEVKEY,
      executionid: executionId,
      title: filename,
      description: `Adjunto generado automáticamente (${filename})`,
      filename,
      filetype: 'image/png',
      content: buffer
    });
    console.log(`   📎 Adjuntado: ${filename}`);
  } catch (error) {
    console.warn(`   ⚠ No fue posible adjuntar ${filename}: ${error.message}`);
  }
}

async function reportCase(tc) {
  console.log(`⚙️  Reportando ${tc.externalId} (${tc.name})`);
  const evidenceList = tc.evidence && tc.evidence.length
    ? `Evidencias: ${tc.evidence.join(', ')}`
    : 'Evidencias generadas en test-evidences/';
  const notes =
    (tc.note ? `${tc.note}\n${evidenceList}` : `Ejecución automatizada - ${new Date().toISOString()}\n${evidenceList}`);

  const res = await call('tl.reportTCResult', {
    devKey: TESTLINK_DEVKEY,
    testcaseexternalid: tc.externalId,
    testplanid: TEST_PLAN_ID,
    buildid: BUILD_ID,
    status: 'p',
    notes,
    guess: false
  });

  const payload = Array.isArray(res) ? res[0] : res;
  const execId = payload?.execution_id || payload?.id;

  if (!execId) {
    console.warn(`   ⚠ No se obtuvo execution_id para ${tc.externalId}:`, payload);
    return;
  }

  console.log(`   ✅ Resultado registrado (execution_id=${execId})`);

  for (const evidence of tc.evidence) {
    await uploadAttachment(execId, evidence);
  }
}

async function main() {
  console.log('🚀 Iniciando integración con TestLink\n');
  for (const tc of CASES) {
    try {
      await reportCase(tc);
    } catch (error) {
      console.error(`   ❌ Error procesando ${tc.externalId}:`, error.message);
    }
  }
  console.log('\n🎉 Integración finalizada');
}

main().catch((err) => {
  console.error('❌ Error crítico:', err);
  process.exit(1);
});
