#!/usr/bin/env node
// parse-test-docs.js - Parser de documentación Typst para extraer detalles de test cases

const fs = require('fs');
const path = require('path');

/**
 * Extrae un bloque de contenido entre dos marcadores
 */
function extractSection(content, sectionName) {
  const regex = new RegExp(`===\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n===|\\n==|\\n---|\$)`, 'i');
  const match = content.match(regex);
  if (!match) return '';

  let section = match[1].trim();

  // Limpiar bloques de código markdown
  section = section.replace(/```[\s\S]*?```/g, match => {
    return match.replace(/```\w*\n?/, '').replace(/```$/, '').trim();
  });

  return section;
}

/**
 * Extrae lista con bullets (-)
 */
function extractBulletList(content, sectionName) {
  const section = extractSection(content, sectionName);
  if (!section) return [];

  const items = [];
  const lines = section.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      items.push(trimmed.substring(2).trim());
    } else if (trimmed.startsWith('* ')) {
      items.push(trimmed.substring(2).trim());
    }
  }

  return items;
}

/**
 * Extrae pasos numerados
 */
function extractSteps(content) {
  const section = extractSection(content, 'Pasos');
  if (!section) return [];

  const steps = [];
  const lines = section.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Buscar líneas que empiecen con número seguido de punto o paréntesis
    const match = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (match) {
      steps.push(match[2].trim());
    }
  }

  return steps;
}

/**
 * Extrae datos de prueba (puede ser texto plano o código)
 */
function extractTestData(content) {
  const section = extractSection(content, 'Datos de Prueba');
  if (!section) return '';

  // Limpiar y formatear
  return section
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

/**
 * Extrae la descripción del test case
 */
function extractDescription(testSection) {
  const descMatch = testSection.match(/===\s*Descripción\s*\n([^\n]+)/i);
  if (descMatch) return descMatch[1].trim();

  // Si no hay sección de descripción, intentar obtener del título
  const titleMatch = testSection.match(/==\s*TC-[A-Z]+-\d+:\s*(.+)/);
  if (titleMatch) return titleMatch[1].trim();

  return '';
}

/**
 * Parsea un archivo Typst completo y extrae todos los test cases
 */
function parseTypstFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Advertencia: No se encontró el archivo ${filePath}`);
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const testCases = {};

  // Regex para encontrar cada test case (== TC-XXX-NNN: ...)
  const tcRegex = /==\s+(TC-[A-Z]+-\d+):\s*([^\n]+)([\s\S]*?)(?=\n==\s+TC-|$)/g;

  let match;
  while ((match = tcRegex.exec(content)) !== null) {
    const testId = match[1];
    const title = match[2].trim();
    const testSection = match[0];

    testCases[testId] = {
      testId: testId,
      title: title,
      description: extractDescription(testSection) || title,
      preconditions: extractBulletList(testSection, 'Precondiciones'),
      testData: extractTestData(testSection),
      steps: extractSteps(testSection),
      expectedResult: extractBulletList(testSection, 'Resultado Esperado')
    };
  }

  return testCases;
}

/**
 * Carga la documentación de todos los módulos
 */
function loadAllModuleDocs() {
  const docsDir = path.join(__dirname, 'docs');

  const mapping = {
    'Clientes': path.join(docsDir, '03-plan-clientes.typ'),
    'Pólizas': path.join(docsDir, '04-plan-polizas.typ'),
    'Catálogos': path.join(docsDir, '06-plan-catalogos.typ'),
    'Recibos': path.join(docsDir, '05-plan-recibos.typ'),
    'Documentos': path.join(docsDir, '06-plan-documentos-FINAL.typ'),
    'Configuración': path.join(docsDir, '07-plan-config-FINAL.typ')
  };

  const allDocs = {};

  for (const [moduleName, filePath] of Object.entries(mapping)) {
    console.log(`Cargando documentación de ${moduleName}...`);
    allDocs[moduleName] = parseTypstFile(filePath);
    const count = Object.keys(allDocs[moduleName]).length;
    console.log(`  ✓ ${count} test cases encontrados`);
  }

  return allDocs;
}

module.exports = {
  parseTypstFile,
  loadAllModuleDocs,
  extractSection,
  extractBulletList,
  extractSteps,
  extractTestData,
  extractDescription
};

// Si se ejecuta directamente, mostrar ejemplo
if (require.main === module) {
  console.log('=== Parser de Documentación Typst ===\n');

  const polizasPath = path.join(__dirname, 'docs', '04-plan-polizas.typ');
  const testCases = parseTypstFile(polizasPath);

  console.log(`Tests encontrados en Pólizas: ${Object.keys(testCases).length}\n`);

  // Mostrar primer test como ejemplo
  const firstTest = Object.values(testCases)[0];
  if (firstTest) {
    console.log('Ejemplo de test parseado:');
    console.log(JSON.stringify(firstTest, null, 2));
  }
}
