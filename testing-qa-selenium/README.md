# Testing QA con Selenium WebDriver

Sistema completo de testing automatizado para el Sistema de Seguros VILLALOBOS.

## 📋 Descripción

Este proyecto implementa pruebas automatizadas end-to-end utilizando un enfoque dual:
- **Selenium IDE**: Para pruebas visuales, grabación y demos
- **Selenium WebDriver**: Para pruebas programáticas complejas y automatización completa

## 🎯 Objetivos

- Validar funcionalidad de módulos críticos del sistema
- Asegurar calidad del software mediante pruebas automatizadas
- Documentar casos de prueba de forma estructurada
- Facilitar regresión y pruebas continuas

## Estructura del Proyecto

```
testing-qa-selenium/
├── scripts/                      # Scripts de automatización
│   ├── generators/               # Generadores de reportes
│   │   ├── generate-module-reports.js    # Reportes detallados por módulo
│   │   ├── generate-general-report.js    # Reporte consolidado general
│   │   ├── generate-report.js            # Generador básico
│   │   ├── generate-full-report.js       # Reporte completo
│   │   └── generate-professional-report.js # Reporte profesional
│   └── parsers/                  # Parsers de datos
│       └── parse-test-docs.js            # Parser de documentación Typst
│
├── selenium-webdriver/           # Tests automatizados
│   ├── tests/                    # Casos de prueba
│   │   ├── auth.test.js
│   │   ├── clientes.test.js
│   │   ├── polizas.test.js
│   │   ├── catalogos.test.js
│   │   ├── recibos.test.js
│   │   ├── documentos.test.js
│   │   ├── config.test.js
│   │   └── dashboard.test.js
│   ├── page-objects/             # Page Object Pattern
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── ClientesPage.js
│   │   ├── PolizasPage.js
│   │   └── ...
│   ├── helpers/                  # Utilidades
│   │   ├── electron-driver.js
│   │   ├── wait-helpers.js
│   │   └── test-data.js
│   ├── config/                   # Configuración
│   │   └── selenium.config.js
│   └── run-all.js                # Ejecutar toda la suite
│
├── docs/                         # Documentación de pruebas
│   ├── 00-plan-maestro-pruebas.typ
│   ├── 01-estrategia-testing.typ
│   ├── 02-plan-autenticacion.typ
│   ├── 03-plan-clientes.typ
│   ├── 04-plan-polizas.typ
│   ├── 05-plan-recibos.typ
│   ├── 06-plan-catalogos.typ
│   ├── 07-plan-config.typ
│   └── archive/                  # Documentos obsoletos
│
├── reports/                      # Reportes generados
│   ├── current/                  # Reportes actuales (última versión)
│   │   ├── modulo-clientes-report-YYYY-MM-DD.pdf
│   │   ├── modulo-polizas-report-YYYY-MM-DD.pdf
│   │   └── reporte-general-testing-YYYY-MM-DD.pdf
│   ├── archive/                  # Reportes históricos
│   ├── screenshots/              # Capturas de pantalla de evidencia
│   └── test-results/             # Resultados JSON de ejecuciones (historial completo)
│
├── analysis/                     # Análisis y hallazgos
│   ├── HALLAZGOS-POLIZAS.md
│   └── RESUMEN-FALLOS-70.md
│
└── README.md                     # Este archivo
```

## 🔧 Instalación

### Prerrequisitos

- Node.js 18+
- Chrome/Chromium instalado
- Extensión Selenium IDE para Chrome/Firefox

### Instalar Dependencias

```bash
npm install
```

Esto instalará:
- `selenium-webdriver`: Para pruebas programáticas
- `chromedriver`: Driver de Chrome
- `electron-chromedriver`: Driver para Electron

## 🚀 Uso

### Selenium IDE (Interfaz Gráfica)

1. Instalar extensión Selenium IDE:
   - Chrome: https://chrome.google.com/webstore
   - Firefox: https://addons.mozilla.org/firefox/addon/selenium-ide/

2. Abrir Selenium IDE
3. Cargar proyecto desde `selenium-ide/`
4. Grabar o ejecutar pruebas existentes

### Selenium WebDriver (Código)

```bash
# Ejecutar todas las pruebas
npm run test:selenium

# Ejecutar módulo específico
npm run test:auth          # Autenticación (3 casos)
npm run test:clientes      # Clientes (20 casos)
npm run test:polizas       # Pólizas (20 casos)
npm run test:recibos       # Recibos (25 casos)
npm run test:catalogos     # Catálogos (13 casos consolidados)
npm run test:documentos    # Documentos (17 casos)
```

## 📊 Módulos bajo Prueba

### 1. Autenticación (TC-AUTH)
- Login/Logout
- Validación de credenciales
- Manejo de sesiones
- **Casos de prueba**: 3

### 2. Clientes (TC-CLI)
- CRUD completo
- Búsqueda y filtros
- Paginación
- Validaciones de formulario
- **Casos de prueba**: 20

### 3. Pólizas (TC-POL)
- CRUD completo
- Relaciones con clientes
- Cálculos y validaciones
- Filtros complejos
- **Casos de prueba**: 20

### 4. Recibos (TC-REC)
- Gestión de fracciones de pago
- Búsqueda (número, póliza, cliente, aseguradora)
- Filtros por estado (pendiente, pagado, vencido)
- Marcar como pagado/revertir pago (CRÍTICO)
- Estadísticas y paginación
- Validación de lógica de negocio
- **Casos de prueba**: 25

### 5. Catálogos (TC-ASEG, TC-MPAGO, TC-PER, TC-RAMO)
- **Aseguradoras**: CRUD, activar/desactivar (10 casos)
- **Métodos de Pago**: CRUD básico (5 casos)
- **Periodicidades**: CRUD con validación de meses (5 casos)
- **Ramos**: CRUD con validación de duplicados (6 casos)
- **Casos de prueba consolidados**: 13 (casos más importantes)
- **Total de casos planificados**: 26

### 6. Documentos (TC-DOC)
- Subida de archivos (PDF, imágenes, Office)
- Asociación a clientes o pólizas
- Descarga de documentos
- Eliminación individual y masiva
- Selección múltiple
- Búsqueda y filtros por alcance
- **Casos de prueba**: 17

## 📝 Documentación

La documentación completa en formato Typst se encuentra en `docs/`:

- **Plan Maestro**: Visión general del proyecto de testing
- **Estrategia**: Metodología y herramientas
- **Planes por Módulo**: Casos de prueba detallados

### Generar PDFs desde Typst

```bash
# Instalar Typst (si no está instalado)
# macOS: brew install typst
# Linux: cargo install typst-cli

# Compilar documentos
typst compile docs/00-plan-maestro-pruebas.typ
typst compile docs/01-estrategia-testing.typ
# ... etc
```

## 🎨 Convenciones

### Nomenclatura de Casos de Prueba

```
TC-[MÓDULO]-[NÚMERO]: [Descripción]

Ejemplos:
- TC-AUTH-001: Login exitoso con credenciales válidas
- TC-CLI-005: Validación de formato RFC
- TC-POL-012: Filtro por ramo de seguro
```

### Page Object Pattern

Cada vista tiene su clase Page Object en `selenium-webdriver/page-objects/`:

```javascript
class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  async login(username, password) {
    // Implementación
  }
}
```

## 📈 Reportes

Los reportes de ejecución se generan automáticamente en `reports/`:
- HTML: Reportes visuales
- JSON: Datos estructurados
- Screenshots: Capturas en caso de fallo

## 👥 Equipo

- **QA Lead**: [Nombre]
- **Test Automation**: [Nombre]
- **Documentación**: [Nombre]

## 📅 Cronograma

- **Fase 1**: Documentación (Semana 1)
- **Fase 2**: Setup Técnico (Semana 2)
- **Fase 3**: Pruebas Autenticación (Semana 3)
- **Fase 4**: Pruebas Clientes (Semana 4)
- **Fase 5**: Pruebas Pólizas (Semana 5)

## 🔗 Enlaces Útiles

- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [Selenium IDE](https://www.selenium.dev/selenium-ide/)
- [WebDriver API](https://www.selenium.dev/documentation/webdriver/)
- [Typst Documentation](https://typst.app/docs/)

## 📄 Licencia

Este proyecto es parte del Sistema de Seguros VILLALOBOS.

---

**Última actualización**: Noviembre 2025
