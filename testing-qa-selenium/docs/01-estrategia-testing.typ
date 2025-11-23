#set document(
  title: "Estrategia de Testing - Sistema de Seguros VILLALOBOS",
  author: "Equipo de QA",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
)

#set text(
  font: "New Computer Modern",
  size: 11pt,
  lang: "es",
)

#set heading(numbering: "1.")

#align(center)[
  #text(size: 24pt, weight: "bold")[
    Estrategia de Testing
  ]

  #v(0.5cm)

  #text(size: 18pt)[
    Selenium IDE + Selenium WebDriver
  ]

  #v(0.5cm)

  #text(size: 14pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(2cm)

  #text(size: 12pt)[
    Versión 1.0 \
    #datetime.today().display()
  ]
]

#pagebreak()

#outline(
  title: "Tabla de Contenido",
  indent: auto,
)

#pagebreak()

= Introducción

Este documento describe la estrategia técnica para implementar pruebas automatizadas utilizando Selenium en sus dos variantes: Selenium IDE (interfaz gráfica) y Selenium WebDriver (programático).

== Justificación del Enfoque Dual

El uso combinado de ambas herramientas proporciona:

+ *Selenium IDE*: Facilidad de uso, grabación visual, ideal para demos
+ *Selenium WebDriver*: Flexibilidad, control total, pruebas complejas
+ *Complementariedad*: Cada herramienta cubre necesidades específicas

= Selenium IDE

== Descripción

Selenium IDE es una extensión de navegador que permite:
- Grabar acciones del usuario automáticamente
- Reproducir pruebas grabadas
- Editar pasos visualmente
- Exportar a código (opcional)

== Instalación

=== Chrome
+ Ir a Chrome Web Store
+ Buscar "Selenium IDE"
+ Hacer clic en "Agregar a Chrome"
+ Confirmar instalación

=== Firefox
+ Ir a Firefox Add-ons
+ Buscar "Selenium IDE"
+ Hacer clic en "Agregar a Firefox"
+ Confirmar instalación

== Casos de Uso

Selenium IDE es ideal para:

#table(
  columns: (2fr, 3fr),
  align: left,
  table.header(
    [*Escenario*], [*Ejemplo*]
  ),
  [Pruebas exploratorias], [Navegar por la app grabando acciones],
  [Demos rápidas], [Mostrar funcionalidad en presentaciones],
  [Validaciones simples], [Login básico, crear cliente simple],
  [Prototipado], [Probar ideas antes de programar],
  [Documentación visual], [Grabar flujos para documentar]
)

== Limitaciones

- No puede interactuar con Electron directamente
- Funciona solo con interfaz web del sistema
- Menos flexible que código
- Dificultad con lógica compleja

= Selenium WebDriver

== Descripción

Selenium WebDriver es una biblioteca programática que permite:
- Control completo del navegador mediante código
- Pruebas complejas con lógica condicional
- Integración con frameworks de testing
- Ejecución en ambientes CI/CD

== Arquitectura

#raw(lang: "text", block: true, "
┌─────────────────┐
│  Test Script    │  ← Código JavaScript con casos de prueba
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Selenium WebDriver │  ← API de Selenium
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ChromeDriver   │  ← Driver específico del navegador
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Electron App    │  ← Aplicación bajo prueba
└─────────────────┘
")

== Configuración

=== Dependencias

```javascript
{
  "devDependencies": {
    "selenium-webdriver": "^4.x.x",
    "chromedriver": "^latest",
    "electron-chromedriver": "^latest"
  }
}
```

=== Setup Básico

```javascript
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configurar opciones para Electron
const options = new chrome.Options();
options.setChromeBinaryPath('/path/to/electron');
options.addArguments('--remote-debugging-port=9222');

// Crear driver
const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
```

== Page Object Pattern

El patrón Page Object separa la lógica de prueba de los detalles de la UI.

=== Estructura

```javascript
class LoginPage {
  constructor(driver) {
    this.driver = driver;
    // Localizadores
    this.usernameInput = By.id('username');
    this.passwordInput = By.id('password');
    this.loginButton = By.id('btnLogin');
  }

  async login(username, password) {
    await this.driver.findElement(this.usernameInput)
      .sendKeys(username);
    await this.driver.findElement(this.passwordInput)
      .sendKeys(password);
    await this.driver.findElement(this.loginButton)
      .click();
  }

  async isLoginSuccessful() {
    // Verificar si se redirigió
    return await this.driver.getCurrentUrl()
      .includes('/app');
  }
}
```

=== Ventajas

+ Mantenibilidad: Cambios en UI solo afectan Page Object
+ Reutilización: Métodos usados en múltiples pruebas
+ Legibilidad: Código de prueba más claro
+ Separación de responsabilidades

= Comparación de Herramientas

#table(
  columns: (2fr, 2fr, 2fr),
  align: left,
  table.header(
    [*Aspecto*], [*Selenium IDE*], [*Selenium WebDriver*]
  ),
  [*Interfaz*], [Gráfica], [Código (JavaScript)],
  [*Curva de aprendizaje*], [Baja], [Media-Alta],
  [*Flexibilidad*], [Limitada], [Total],
  [*Mantenimiento*], [Difícil si cambia UI], [Fácil con Page Objects],
  [*CI/CD*], [No integrable], [Completamente integrable],
  [*Debugging*], [Visual, limitado], [Completo con breakpoints],
  [*Datos dinámicos*], [Difícil], [Fácil],
  [*Validaciones complejas*], [No soporta], [Totalmente soportado],
  [*Reportes*], [Básicos], [Personalizables]
)

= Estrategia de Implementación

== Fase 1: Pruebas con Selenium IDE

*Objetivo:* Familiarización y pruebas básicas

#table(
  columns: (1fr, 3fr),
  align: left,
  [*Paso*], [*Descripción*],
  [1], [Instalar extensión Selenium IDE],
  [2], [Grabar flujo de login],
  [3], [Grabar CRUD básico de clientes],
  [4], [Guardar proyectos .side],
  [5], [Documentar casos grabados]
)

*Entregables:*
- Proyecto .side para cada módulo
- Screenshots de ejecución
- Lista de limitaciones encontradas

== Fase 2: Migración a Selenium WebDriver

*Objetivo:* Implementar pruebas programáticas robustas

#table(
  columns: (1fr, 3fr),
  align: left,
  [*Paso*], [*Descripción*],
  [1], [Instalar dependencias npm],
  [2], [Configurar ChromeDriver para Electron],
  [3], [Crear Page Objects base],
  [4], [Implementar casos de prueba críticos],
  [5], [Añadir validaciones y aserciones],
  [6], [Configurar reportes]
)

*Entregables:*
- Scripts de prueba (.js)
- Page Objects
- Configuración de ambiente
- Suite ejecutable

= Estructura del Proyecto

```
testing-qa-selenium/
├── selenium-ide/
│   ├── autenticacion/
│   │   └── login-tests.side
│   ├── clientes/
│   │   ├── crear-cliente.side
│   │   ├── editar-cliente.side
│   │   └── buscar-cliente.side
│   └── polizas/
│       └── gestion-polizas.side
│
├── selenium-webdriver/
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── clientes.test.js
│   │   └── polizas.test.js
│   │
│   ├── page-objects/
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── ClientesPage.js
│   │   └── PolizasPage.js
│   │
│   ├── helpers/
│   │   ├── electron-driver.js
│   │   ├── wait-helpers.js
│   │   └── test-data.js
│   │
│   └── config/
│       ├── selenium.config.js
│       └── test-env.js
```

= Convenciones de Código

== Nomenclatura

=== Archivos
- Tests: `[modulo].test.js` (ej: `clientes.test.js`)
- Page Objects: `[Modulo]Page.js` (ej: `ClientesPage.js`)
- Helpers: `[funcion]-helper.js` (ej: `wait-helper.js`)

=== Variables y Funciones
```javascript
// Camel case para variables y funciones
const loginButton = driver.findElement(...)
async function clickLoginButton() { }

// Pascal case para clases
class ClientesPage { }

// UPPER_CASE para constantes
const MAX_WAIT_TIME = 10000;
```

== Selectores

Prioridad de selectores (de mejor a peor):

1. `id`: `By.id('username')`
2. `name`: `By.name('email')`
3. `data-testid`: `By.css('[data-testid="submit-btn"]')`
4. `class` específica: `By.className('login-form')`
5. `css`: `By.css('.container > .form input')`
6. `xpath` (último recurso): `By.xpath('//div[@class="modal"]//button')`

*Evitar:*
- Selectores frágiles (dependen de estructura)
- Índices numéricos
- Textos que pueden cambiar

== Esperas

*Usar esperas explícitas, NO sleep():*

```javascript
// ❌ MAL
await driver.sleep(5000);

// ✅ BIEN
const { until } = require('selenium-webdriver');
await driver.wait(
  until.elementLocated(By.id('result')),
  10000
);
```

== Aserciones

Usar aserciones claras y descriptivas:

```javascript
const assert = require('assert');

// ❌ MAL
assert(result);

// ✅ BIEN
assert.strictEqual(
  actualValue,
  expectedValue,
  'El nombre del cliente debe coincidir'
);
```

= Datos de Prueba

== Estrategia

+ *Datos fijos*: Para casos predecibles
+ *Datos dinámicos*: Generados en tiempo de ejecución
+ *Datos de fixtures*: Precargados en BD de prueba

== Ejemplo de Fixtures

```javascript
// helpers/test-data.js
module.exports = {
  usuarios: {
    admin: {
      username: 'admin',
      password: 'admin123'
    },
    agente: {
      username: 'agente1',
      password: 'agente123'
    }
  },

  clientes: {
    personaFisica: {
      nombre: 'Juan Pérez López',
      rfc: 'PELJ850101ABC',
      email: 'juan.perez@test.com',
      telefono: '5551234567'
    },
    personaMoral: {
      nombre: 'Empresa Test SA de CV',
      rfc: 'ETE850101XYZ',
      email: 'contacto@empresa.test',
      telefono: '5559876543'
    }
  }
};
```

= Ejecución de Pruebas

== Comandos NPM

```bash
# Ejecutar todas las pruebas
npm run test:selenium

# Ejecutar módulo específico
npm run test:auth
npm run test:clientes
npm run test:polizas

# Modo watch (desarrollo)
npm run test:watch

# Generar reporte HTML
npm run test:report
```

== Configuración de Scripts

```json
{
  "scripts": {
    "test:selenium": "node selenium-webdriver/run-all.js",
    "test:auth": "node selenium-webdriver/tests/auth.test.js",
    "test:clientes": "node selenium-webdriver/tests/clientes.test.js",
    "test:polizas": "node selenium-webdriver/tests/polizas.test.js"
  }
}
```

= Reportes

== Formato de Reportes

Los reportes se generan en múltiples formatos:

+ *HTML*: Reporte visual para humanos
+ *JSON*: Datos estructurados para análisis
+ *JUnit XML*: Compatible con CI/CD

== Contenido del Reporte

- Resumen ejecutivo (pass/fail/skip)
- Tiempo de ejecución
- Detalles de cada caso
- Screenshots de fallos
- Stack traces de errores
- Métricas de cobertura

= Mejores Prácticas

== Testing

+ *Independencia*: Cada prueba debe ser independiente
+ *Idempotencia*: Mismo resultado en múltiples ejecuciones
+ *Limpieza*: Limpiar datos después de cada prueba
+ *Claridad*: Nombres descriptivos y auto-documentados
+ *Rapidez*: Optimizar tiempos de espera

== Mantenimiento

+ Actualizar Page Objects ante cambios de UI
+ Revisar selectores periódicamente
+ Refactorizar código duplicado
+ Documentar casos complejos
+ Mantener fixtures actualizados

== Debugging

+ Usar `driver.takeScreenshot()` en fallos
+ Activar logs detallados
+ Ejecutar prueba individual para debugging
+ Usar breakpoints en IDE
+ Verificar selectores en DevTools

= Integración Continua

== GitHub Actions (Ejemplo)

```yaml
name: Selenium Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:selenium
      - uses: actions/upload-artifact@v2
        with:
          name: test-reports
          path: reports/
```

= Conclusiones

Este enfoque dual permite:

+ *Flexibilidad*: Elegir herramienta según necesidad
+ *Aprendizaje gradual*: Comenzar con IDE, avanzar a código
+ *Documentación*: IDE para demos, WebDriver para automatización
+ *Robustez*: Pruebas programáticas más confiables
+ *Escalabilidad*: WebDriver crece con el proyecto

---

*Fin del documento*
