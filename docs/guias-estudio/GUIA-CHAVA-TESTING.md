# 📘 GUÍA DE ESTUDIO - CHAVA (Testing & QA)

**Área**: Pruebas Automatizadas, Control de Calidad, Selenium WebDriver

---

## 🎯 TU RESPONSABILIDAD

Eres el experto en **calidad del software y pruebas automatizadas**. Debes poder explicar:
- Cómo funcionan las pruebas automatizadas con Selenium
- Qué es el patrón Page Object Model (POM)
- Cómo se integra Selenium con Electron
- Qué casos de prueba se implementaron
- Cómo se generan los reportes de testing

---

## 📚 ARCHIVOS QUE DEBES DOMINAR

### 🔥 **CRÍTICOS** (Debes conocer al 100%)

1. **`testing-qa-selenium/selenium-webdriver/page-objects/BasePage.js`**
   - **Qué hace**: Clase base para todos los Page Objects
   - **Líneas clave**: 1-505 (completo)
   - **Demostrar**: Métodos de búsqueda, interacción, espera

2. **`testing-qa-selenium/selenium-webdriver/page-objects/LoginPage.js`**
   - **Qué hace**: Page Object para la página de login
   - **Líneas clave**: 1-373 (completo)
   - **Demostrar**: Ejemplo completo de POM

3. **`testing-qa-selenium/selenium-webdriver/tests/polizas.test.js`**
   - **Qué hace**: Suite de pruebas del módulo de pólizas
   - **Líneas clave**: 1-200
   - **Demostrar**: Casos de prueba con patrón AAA

4. **`testing-qa-selenium/selenium-webdriver/helpers/electron-driver.js`**
   - **Qué hace**: Configuración de Selenium para Electron
   - **Líneas clave**: 1-102
   - **Demostrar**: Cómo se conecta Selenium a Electron

### ⚠️ **IMPORTANTES** (Conocer funcionamiento general)

5. **`testing-qa-selenium/selenium-webdriver/helpers/wait-helpers.js`**
6. **`testing-qa-selenium/selenium-webdriver/tests/auth.test.js`**
7. **`testing-qa-selenium/selenium-webdriver/run-all.js`**
8. **`testing-qa-selenium/generate-professional-report.js`**

---

## 💬 PREGUNTAS DEL PROFESOR (PREPARA RESPUESTAS)

### **1. ¿Qué es Selenium WebDriver y por qué lo usaron?**

**RESPUESTA MODELO**:
> "Selenium WebDriver es una herramienta para automatizar pruebas de aplicaciones web. Permite controlar un navegador de forma programática para simular acciones del usuario.
>
> **Por qué Selenium**:
> - **Automatización**: Pruebas repetibles sin intervención manual
> - **Cobertura**: Podemos probar todos los módulos del sistema
> - **Regresión**: Detectar bugs cuando hacemos cambios
> - **Documentación**: Los tests son documentación viva del sistema
> - **Compatibilidad**: Funciona con Electron (Chromium)
>
> **Ventajas en nuestro proyecto**:
> - Probar flujos completos (login → crear póliza → verificar)
> - Validar que la UI funciona correctamente
> - Screenshots automáticos cuando fallan tests
> - Reportes profesionales de calidad"

**DEMOSTRAR**: Ejecutar `npm run test:auth` y mostrar cómo Electron se abre automáticamente, ejecuta login, y cierra

---

### **2. ¿Qué es el patrón Page Object Model (POM)?**

**RESPUESTA MODELO**:
> "Page Object Model es un patrón de diseño donde cada página de la aplicación se representa como una clase de JavaScript.
>
> **Estructura**:
> ```
> LoginPage.js → Representa la página de login
>   - Locators: Selectores de elementos (By.id, By.css)
>   - Methods: Acciones disponibles (login, enterUsername, etc.)
>
> PolizasPage.js → Representa el módulo de pólizas
>   - Locators: Botón 'Nuevo', tabla de pólizas, formulario
>   - Methods: openNewPolizaModal, fillForm, submitForm
> ```
>
> **Ventajas**:
> 1. **Reusabilidad**: Múltiples tests usan el mismo Page Object
> 2. **Mantenibilidad**: Si cambia el HTML, solo actualizamos el PO
> 3. **Legibilidad**: Tests se leen como lenguaje natural
> 4. **DRY**: No repetir código
>
> **Sin POM** (malo):
> ```javascript
> // Test 1
> driver.findElement(By.id('userInput')).sendKeys('admin');
> driver.findElement(By.id('passInput')).sendKeys('admin123');
> driver.findElement(By.id('loginButton')).click();
>
> // Test 2 - repite el mismo código
> driver.findElement(By.id('userInput')).sendKeys('user');
> driver.findElement(By.id('passInput')).sendKeys('pass123');
> driver.findElement(By.id('loginButton')).click();
> ```
>
> **Con POM** (bueno):
> ```javascript
> // Test 1
> await loginPage.login('admin', 'admin123');
>
> // Test 2
> await loginPage.login('user', 'pass123');
> ```

**DEMOSTRAR**: Abrir `LoginPage.js` y mostrar:
- Locators (líneas 14-39)
- Método `login()` (líneas 121-136)
- Cómo se usa en un test

---

### **3. ¿Cómo se integra Selenium con Electron?**

**RESPUESTA MODELO**:
> "Integrar Selenium con Electron tiene algunos desafíos porque Electron no es un navegador web normal, sino una aplicación de escritorio.
>
> **Configuración especial** (`electron-driver.js`):
>
> 1. **Usar electron-chromedriver** (no chromedriver normal):
> ```javascript
> const service = new chrome.ServiceBuilder(
>   '.../node_modules/electron-chromedriver/bin/chromedriver'
> );
> ```
> Esto usa una versión de ChromeDriver compatible con Electron.
>
> 2. **Apuntar al binario de Electron**:
> ```javascript
> options.setChromeBinaryPath(config.electronPath);
> // '.../Electron.app/Contents/MacOS/Electron'
> ```
> Le dice a Selenium que ejecute Electron en lugar de Chrome.
>
> 3. **Configurar remote debugging**:
> ```javascript
> options.addArguments(
>   `--app=${config.appPath}`,  // main.js de la app
>   `--remote-debugging-port=${config.debuggingPort}`  // 9222
> );
> ```
> Esto abre un puerto para que Selenium se conecte.
>
> **Flujo completo**:
> ```
> 1. electron-chromedriver se inicia en puerto 9515
> 2. ChromeDriver lanza Electron con remote debugging (9222)
> 3. Selenium se conecta al puerto 9222
> 4. Ahora puede controlar Electron como un navegador
> ```

**DEMOSTRAR**:
1. Mostrar `electron-driver.js:12-50`
2. Ejecutar un test y ver cómo Electron se abre automáticamente

---

### **4. ¿Qué es el patrón AAA en tests?**

**RESPUESTA MODELO**:
> "AAA significa **Arrange-Act-Assert** y es la estructura estándar para escribir tests.
>
> **Arrange (Preparar)**:
> - Configurar datos de prueba
> - Establecer estado inicial
> - Ejemplo: preparar datos de una póliza
>
> **Act (Actuar)**:
> - Ejecutar la acción a probar
> - Ejemplo: llenar formulario y hacer clic en 'Guardar'
>
> **Assert (Verificar)**:
> - Comprobar que el resultado es el esperado
> - Ejemplo: verificar que aparece toast de éxito
>
> **Ejemplo completo** (`polizas.test.js`):
> ```javascript
> async function testTC_POL_001() {
>   // ===== ARRANGE =====
>   const poliza = {
>     numero_poliza: 'POL-TEST-' + Date.now(),
>     prima_total: '11600',
>     fecha_inicio: '2025-01-01'
>   };
>
>   // ===== ACT =====
>   await polizasPage.openNewPolizaModal();
>   await polizasPage.fillPolizaForm(poliza);
>   await polizasPage.submitForm();
>
>   // ===== ASSERT =====
>   const success = await polizasPage.isSuccessToastDisplayed();
>   if (!success) {
>     throw new Error('Toast de éxito no apareció');
>   }
>
>   const found = await polizasPage.searchPoliza(poliza.numero_poliza);
>   if (!found) {
>     throw new Error('Póliza no aparece en la tabla');
>   }
> }
> ```

**DEMOSTRAR**: Abrir `polizas.test.js:128-150` y señalar cada sección

---

### **5. ¿Qué son los locators y cuáles tipos usamos?**

**RESPUESTA MODELO**:
> "Los locators son selectores que usamos para encontrar elementos en la página.
>
> **Tipos de locators** (de más rápido a más lento):
>
> 1. **By.id()** - El más rápido y confiable
> ```javascript
> By.id('userInput')  → <input id='userInput'>
> ```
>
> 2. **By.css()** - Selector CSS
> ```javascript
> By.css('.btn-primary')  → <button class='btn-primary'>
> By.css('table tbody tr')  → Todas las filas de la tabla
> ```
>
> 3. **By.xpath()** - Consulta XPath (más lento)
> ```javascript
> By.xpath('//button[text()=\"Guardar\"]')
> ```
>
> 4. **By.name()** - Por atributo name
> ```javascript
> By.name('username')  → <input name='username'>
> ```
>
> **Mejores prácticas**:
> - Preferir IDs (únicos, rápidos, confiables)
> - CSS para elementos sin ID
> - XPath solo cuando es necesario
> - Evitar selectores frágiles como:
>   - `By.css('div > div > span:nth-child(3)')` ← Se rompe fácil
>
> **Ejemplo en LoginPage.js**:
> ```javascript
> this.locators = {
>   usernameInput: By.id('userInput'),        // ID - mejor
>   passwordInput: By.id('passInput'),        // ID - mejor
>   loginButton: By.id('loginButton'),        // ID - mejor
>   errorMessage: By.id('errorMessage')       // ID - mejor
> };
> ```

**DEMOSTRAR**:
1. Abrir `LoginPage.js:14-39` para ver locators
2. Abrir Electron con DevTools (F12)
3. Inspeccionar un elemento y ver su ID

---

### **6. ¿Cómo se manejan las esperas en Selenium?**

**RESPUESTA MODELO**:
> "Las esperas son cruciales porque las páginas cargan de forma asíncrona.
>
> **Tipos de esperas**:
>
> 1. **Espera Implícita** (global):
> ```javascript
> await driver.manage().setTimeouts({ implicit: 10000 });
> ```
> Selenium esperará hasta 10 segundos antes de lanzar error 'element not found'.
>
> 2. **Espera Explícita** (específica):
> ```javascript
> await waitForElement(driver, By.id('toast-success'), 5000);
> ```
> Espera hasta que un elemento específico aparezca.
>
> 3. **Espera de Condición**:
> ```javascript
> await waitForClickable(driver, By.id('btnGuardar'));
> ```
> Espera hasta que un elemento sea clickeable.
>
> **Estrategias implementadas** (`wait-helpers.js`):
> - `waitForElement()` - Elemento presente en DOM
> - `waitForVisible()` - Elemento visible
> - `waitForClickable()` - Elemento clickeable
> - `waitForText()` - Elemento con texto específico
> - `waitForUrlContains()` - URL contenga texto
>
> **Problema común** (sin espera):
> ```javascript
> await loginPage.clickLoginButton();
> await polizasPage.clickNewButton();  // ❌ Falla - página no cargó
> ```
>
> **Solución** (con espera):
> ```javascript
> await loginPage.clickLoginButton();
> await loginPage.waitForRedirection();  // ✅ Espera a app_view.html
> await polizasPage.clickNewButton();    // ✅ Ahora funciona
> ```

**DEMOSTRAR**: Mostrar `wait-helpers.js` y explicar `waitForElement()`

---

### **7. ¿Qué es clickWithRetry y por qué es necesario?**

**RESPUESTA MODELO**:
> "clickWithRetry es un método avanzado para manejar el error 'element click intercepted'.
>
> **Problema**: A veces cuando intentas hacer clic en un botón:
> - Un toast está desapareciendo encima del botón
> - Una animación está en progreso
> - Un modal se está cerrando
> - Selenium dice: 'otro elemento recibiría el clic'
>
> **Solución** (`BasePage.js:381-411`):
> ```javascript
> async clickWithRetry(locator, maxRetries = 3, delayBetweenRetries = 1000) {
>   for (let attempt = 1; attempt <= maxRetries; attempt++) {
>     try {
>       const element = await waitForClickable(this.driver, locator);
>       await element.click();
>       return;  // ✅ Éxito
>     } catch (error) {
>       if (error.name === 'ElementClickInterceptedError') {
>         if (attempt === maxRetries) throw error;
>         await this.sleep(delayBetweenRetries);  // Espera y reintenta
>       } else {
>         throw error;  // Otro tipo de error
>       }
>     }
>   }
> }
> ```
>
> **Funcionamiento**:
> 1. Intenta hacer clic
> 2. Si falla por interceptación, espera 1 segundo
> 3. Reintenta hasta 3 veces
> 4. Si todos fallan, lanza error
>
> **Cuándo usar**:
> - Después de cerrar un modal
> - Después de un toast
> - Botones cerca de animaciones"

**DEMOSTRAR**: Mostrar `BasePage.js:381-411`

---

### **8. ¿Cuántos tests hay y qué cubren?**

**RESPUESTA MODELO**:
> "Tenemos tests para todos los módulos principales del sistema.
>
> **Suites de pruebas**:
>
> 1. **auth.test.js** - Autenticación
>    - Login con credenciales válidas
>    - Login con credenciales inválidas
>    - Login con campos vacíos
>    - Recordar sesión
>    - Olvidó contraseña
>
> 2. **clientes.test.js** - Gestión de clientes
>    - Crear cliente persona física
>    - Crear cliente persona moral
>    - Editar cliente
>    - Eliminar cliente
>    - Buscar cliente por RFC
>    - Buscar cliente por nombre
>    - Validar RFC inválido
>
> 3. **polizas.test.js** - Gestión de pólizas
>    - Crear póliza nueva
>    - Editar póliza existente
>    - Eliminar póliza
>    - Buscar póliza por número
>    - Ver detalle de póliza
>    - Generar recibos automáticamente
>
> 4. **recibos.test.js** - Gestión de recibos
>    - Marcar recibo como pagado
>    - Buscar recibos pendientes
>    - Filtrar recibos por estado
>    - Ver recibos de una póliza
>
> 5. **catalogos.test.js** - Catálogos
>    - CRUD de aseguradoras
>    - CRUD de ramos
>    - CRUD de periodicidades
>    - CRUD de métodos de pago
>
> 6. **documentos.test.js** - Gestión de documentos
>    - Subir documento
>    - Ver documentos de póliza
>    - Eliminar documento
>
> 7. **dashboard.test.js** - Dashboard
>    - Verificar métricas se cargan
>    - Verificar gráficas se muestran
>    - Verificar alertas urgentes
>
> 8. **config.test.js** - Configuración
>    - Cambiar configuración del sistema
>    - Ver logs de auditoría
>
> **Total**: ~60+ casos de prueba individuales"

**DEMOSTRAR**: Ejecutar `npm run test:selenium` y mostrar la ejecución

---

### **9. ¿Cómo se generan los reportes de tests?**

**RESPUESTA MODELO**:
> "Generamos reportes en formato JSON con información detallada de cada test.
>
> **Información incluida**:
> - Suite de prueba
> - Timestamp de ejecución
> - Total de tests
> - Tests pasados/fallidos
> - Tiempo de ejecución
> - Detalle de cada test:
>   - ID del test
>   - Descripción
>   - Resultado (passed/failed)
>   - Mensaje de error si falló
>   - Screenshot si falló
>
> **Ejemplo de reporte** (`final-report.json`):
> ```json
> {
>   'project': 'Sistema de Seguros VILLALOBOS',
>   'framework': 'Selenium WebDriver + Electron',
>   'timestamp': '2025-11-24T12:30:45.000Z',
>   'executionTime': '45.23s',
>   'summary': {
>     'totalSuites': 8,
>     'passedSuites': 7,
>     'failedSuites': 1,
>     'successRate': '87.5%'
>   },
>   'suites': [
>     {
>       'name': 'Autenticación',
>       'status': 'PASSED'
>     },
>     {
>       'name': 'Pólizas',
>       'status': 'FAILED',
>       'error': 'Toast de éxito no apareció'
>     }
>   ]
> }
> ```
>
> **Screenshots automáticos**:
> Cuando un test falla, se captura una imagen de la pantalla:
> ```javascript
> await polizasPage.screenshot(`${testId}-FAILED`);
> // Guarda: TC-POL-001-FAILED.png
> ```

**DEMOSTRAR**:
1. Ejecutar un test que falle a propósito
2. Mostrar screenshot en `reports/screenshots/`
3. Mostrar reporte JSON generado

---

## 🎬 DEMOSTRACIÓN EN VIVO (Practica esto)

### **Demo 1: Ejecutar Suite Completa**
```bash
# Terminal
npm run test:selenium

# Explicar mientras se ejecuta:
1. "ChromeDriver se inicia en puerto 9515"
2. "Electron se abre automáticamente"
3. "Ejecuta login"
4. "Navega a cada módulo y ejecuta tests"
5. "Genera reporte al final"
6. "Cierra Electron automáticamente"
```

### **Demo 2: Ejecutar Test Individual**
```bash
# Terminal
npm run test:auth

# Mostrar:
1. "Este test solo prueba el login"
2. "Intenta login válido"
3. "Intenta login inválido"
4. "Verifica mensajes de error"
5. "Muestra ✅ o ❌ para cada caso"
```

### **Demo 3: Explicar un Page Object**
```javascript
// Abrir LoginPage.js
1. "Líneas 14-39: Locators (selectores de elementos)"
2. "Líneas 59-69: enterUsername() - método simple"
3. "Líneas 121-136: login() - método completo"
4. "Líneas 334-344: isLoginSuccessful() - validación"

// Mostrar cómo se usa en un test:
const loginPage = new LoginPage(driver);
await loginPage.login('admin', 'admin123');
await loginPage.waitForRedirection();

// Explicar:
"Sin Page Object, serían 10+ líneas de código.
Con Page Object, son solo 3 líneas legibles."
```

---

## 📖 CONCEPTOS CLAVE QUE DEBES CONOCER

### **1. WebDriver**
- Interfaz para controlar navegadores
- Comandos: click, sendKeys, getText, findElement

### **2. Locator Strategy**
- Preferir IDs
- CSS para múltiples elementos
- XPath solo si necesario

### **3. Synchronization**
- Esperas implícitas vs explícitas
- Condiciones: visible, clickable, present

### **4. Test Organization**
- Page Objects para estructura
- Test suites para agrupación
- Setup/teardown para preparación

### **5. Assertions**
- Verificar estado esperado
- Lanzar error si falla
- Screenshot para debug

---

## ✅ CHECKLIST DE PREPARACIÓN

Antes de la presentación, asegúrate de poder:

- [ ] Explicar qué es Selenium WebDriver
- [ ] Explicar el patrón Page Object Model
- [ ] Demostrar cómo se ejecuta una suite de tests
- [ ] Mostrar un Page Object completo (LoginPage.js)
- [ ] Explicar el patrón AAA en tests
- [ ] Explicar tipos de locators (By.id, By.css, etc.)
- [ ] Explicar las esperas (implicit, explicit)
- [ ] Explicar clickWithRetry y por qué es necesario
- [ ] Mostrar un reporte de tests
- [ ] Mostrar screenshots de tests fallidos
- [ ] Explicar integración Selenium + Electron

---

## 🎯 RESPUESTAS RÁPIDAS (Memoriza estos puntos)

**P: ¿Qué es Selenium?**
R: Herramienta para automatizar pruebas de aplicaciones web

**P: ¿Qué es POM?**
R: Page Object Model - cada página es una clase con locators y métodos

**P: ¿Por qué POM?**
R: Reusabilidad, mantenibilidad, legibilidad, DRY

**P: ¿Qué es AAA?**
R: Arrange-Act-Assert - estructura estándar de tests

**P: ¿Tipos de locators?**
R: By.id (mejor), By.css, By.xpath, By.name

**P: ¿Tipos de esperas?**
R: Implícita (global), explícita (específica), condicional

**P: ¿Cuántos tests hay?**
R: ~60+ casos en 8 suites (auth, clientes, pólizas, recibos, etc.)

---

## 🚀 PRACTICA FINAL

**Ejercicio**: Explica en 2 minutos cómo funciona un test de login:

```javascript
// 1. SETUP - Crear driver y page object
const driver = await createElectronDriver();
const loginPage = new LoginPage(driver);

// 2. ARRANGE - Preparar datos
const username = 'admin';
const password = 'admin123';

// 3. ACT - Ejecutar login
await loginPage.login(username, password);

// 4. ASSERT - Verificar éxito
const success = await loginPage.isLoginSuccessful();
if (!success) {
  throw new Error('Login falló');
}

// 5. TEARDOWN - Cerrar
await quitDriver(driver);
```

**Explica**:
1. "Creamos el driver que controla Electron"
2. "Creamos LoginPage que tiene los métodos de login"
3. "Llamamos login() que llena usuario y contraseña"
4. "Verificamos que redirigió a app_view.html"
5. "Si pasa, test ✅. Si falla, screenshot y ❌"

**¡Éxito en tu presentación! 🧪**
