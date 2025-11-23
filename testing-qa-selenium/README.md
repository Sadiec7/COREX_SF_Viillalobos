# 🧪 Proyecto de Testing QA con Selenium

Sistema de pruebas automatizadas para el Sistema de Seguros VILLALOBOS utilizando Selenium IDE y Selenium WebDriver.

## 📋 Descripción

Este proyecto implementa pruebas automatizadas end-to-end utilizando un enfoque dual:
- **Selenium IDE**: Para pruebas visuales, grabación y demos
- **Selenium WebDriver**: Para pruebas programáticas complejas y automatización completa

## 🎯 Objetivos

- Validar funcionalidad de módulos críticos del sistema
- Asegurar calidad del software mediante pruebas automatizadas
- Documentar casos de prueba de forma estructurada
- Facilitar regresión y pruebas continuas

## 📁 Estructura del Proyecto

```
testing-qa-selenium/
├── docs/                           # Documentación en Typst
│   ├── 00-plan-maestro-pruebas.typ
│   ├── 01-estrategia-testing.typ
│   ├── 02-plan-autenticacion.typ
│   ├── 03-plan-clientes.typ
│   ├── 04-plan-polizas.typ
│   └── templates/
├── selenium-ide/                   # Pruebas grabadas (.side files)
│   ├── autenticacion/
│   ├── clientes/
│   └── polizas/
├── selenium-webdriver/            # Pruebas programáticas
│   ├── tests/                     # Casos de prueba
│   ├── page-objects/              # Page Object Pattern
│   ├── helpers/                   # Utilidades
│   └── config/                    # Configuración
└── reports/                       # Reportes de ejecución
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
npm run test:auth          # Autenticación
npm run test:clientes      # Clientes
npm run test:polizas       # Pólizas
```

## 📊 Módulos bajo Prueba

### 1. Autenticación
- Login/Logout
- Validación de credenciales
- Manejo de sesiones
- **Casos de prueba**: 10+

### 2. Clientes
- CRUD completo
- Búsqueda y filtros
- Paginación
- Validaciones de formulario
- **Casos de prueba**: 20+

### 3. Pólizas
- CRUD completo
- Relaciones con clientes
- Cálculos y validaciones
- Filtros complejos
- **Casos de prueba**: 20+

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
