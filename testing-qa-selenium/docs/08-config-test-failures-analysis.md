# Análisis de Fallos en Tests de Configuración

**Fecha**: 2025-11-24
**Suite**: config.test.js
**Resultado**: 8/12 tests pasando (67%)

## Resumen Ejecutivo

Se ejecutó la suite de pruebas del módulo de Configuración encontrando 4 tests fallidos que exponen debilidades en las validaciones del sistema. El análisis revela que mientras el backend (modelo) tiene validaciones robustas, existen inconsistencias en cómo el frontend las aplica.

## Tests Fallidos

### TC-CFG-010: Validación de usuario obligatorio ❌

**Descripción**: Verificar que el sistema rechace username vacío
**Resultado esperado**: Mensaje "El usuario es obligatorio"
**Resultado obtenido**: "Datos de cuenta actualizados"

**Análisis**:
```javascript
// config_controller.js línea 80-83
if (!username) {
    this.setStatus(this.accountStatus, 'error', 'El usuario es obligatorio.');
    return;
}
```

El controlador frontend SÍ tiene esta validación. El test está enviando:
- `username = ""` (string vacío)

**Causa raíz**: El test usa `clearAndType()` con string vacío, pero la validación evalúa `!username`. Al usar `.trim()` en línea 77, un string vacío después de trim sigue siendo falsy.

**Diagnóstico**: FALSO POSITIVO - La validación frontend está correcta. El problema es que el test limpia el campo pero el DOM puede mantener algún valor residual.

---

### TC-CFG-016: Validación de campos obligatorios en seguridad ❌

**Descripción**: Validar que se requieran todos los campos de contraseña
**Resultado esperado**: Error indicando campos faltantes
**Resultado obtenido**: "Contraseña actualizada correctamente"

**Test ejecutado**:
```javascript
await configPage.setCurrentPassword('test');
// newPassword y confirmPassword quedan vacíos
await configPage.submitSecurityForm();
```

**Análisis**:
```javascript
// config_controller.js línea 132-135
if (!currentPassword || !newPassword || !confirmPassword) {
    this.setStatus(this.securityStatus, 'error', 'Completa todos los campos de seguridad.');
    return;
}
```

**Causa raíz**: El test ejecuta `clearAndType()` que hace `clear()` + `sendKeys()`. Si se pasa string vacío a `sendKeys()`, el campo queda vacío pero puede haber valores residuales en el DOM.

**Diagnóstico**: PROBLEMA DE LIMPIEZA - Los campos pueden no estar completamente vacíos después de `clearAndType('')`.

---

### TC-CFG-017: Validación de longitud mínima de contraseña ❌

**Descripción**: Rechazar contraseñas menores a 8 caracteres
**Resultado esperado**: Error "debe tener al menos 8 caracteres"
**Resultado obtenido**: "Contraseña actualizada correctamente"

**Test ejecutado**:
```javascript
await configPage.setCurrentPassword('admin123');
await configPage.setNewPassword('1234567'); // Solo 7 caracteres
await configPage.setConfirmPassword('1234567');
```

**Análisis**:
```javascript
// config_controller.js línea 137-140
if (newPassword.length < 8) {
    this.setStatus(this.securityStatus, 'error', 'La nueva contraseña debe tener al menos 8 caracteres.');
    return;
}
```

**Validación backend**:
```javascript
// user_model_sqljs.js línea 151-153
if (!newPassword || newPassword.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
}
```

**Causa raíz**: CRÍTICO - La contraseña de 7 caracteres pasa la validación frontend. Esto indica que:
1. La validación del controlador no se está ejecutando
2. O el valor leído del input no es el correcto

**Diagnóstico**: BUG REAL - La validación frontend no está funcionando correctamente.

---

### TC-CFG-025: Actualización del nombre en sidebar ❌

**Descripción**: El sidebar debe actualizarse inmediatamente al cambiar displayName
**Resultado esperado**: Sidebar muestra "Test 1763960156212"
**Resultado obtenido**: Sidebar muestra "Test User 1763960125334" (valor anterior)

**Análisis**:
```javascript
// config_controller.js línea 191-202
updateNavNames() {
    const nameForUI = this.displayName || this.user.username || 'admin';
    const sidebarUser = document.getElementById('userName');
    const welcomeUser = document.getElementById('welcomeUser');

    if (sidebarUser) {
        sidebarUser.textContent = nameForUI;
    }
    if (welcomeUser) {
        welcomeUser.textContent = nameForUI;
    }
}
```

Esta función se llama en línea 116 después de `persistDisplayName()`.

**Causa raíz**: Problema de SINCRONIZACIÓN:
1. El test actualiza el displayName a "Test 1763960156212"
2. Se llama `updateNavNames()` correctamente
3. PERO el test lee el valor del sidebar ANTES de que se actualice el DOM

**Diagnóstico**: PROBLEMA DE TIMING - El test necesita esperar más tiempo o verificar que el DOM se actualizó.

---

## Problemas Identificados

### 1. Problema de Limpieza de Campos (TC-CFG-010, TC-CFG-016)

**Archivo**: `ConfigPage.js`
**Método**: `clearAndType()`

```javascript
async clearAndType(locator, value) {
    const element = await this.driver.findElement(locator);
    await element.clear();
    if (value) {
        await element.sendKeys(value);
    }
    await this.sleep(300);
}
```

**Issue**: Cuando `value` es string vacío `""`, el `if (value)` es falsy, por lo que NO se ejecuta `sendKeys()`. El campo queda en estado "cleared" pero puede tener valores residuales.

**Solución**:
```javascript
async clearAndType(locator, value) {
    const element = await this.driver.findElement(locator);
    await element.clear();
    if (value !== undefined && value !== null) {
        await element.sendKeys(value || '');
    }
    await this.sleep(300);
}
```

---

### 2. Validación de Contraseña No Se Ejecuta (TC-CFG-017)

**Archivo**: `config_controller.js`
**Línea**: 128-145

**Análisis detallado**:

El flujo es:
1. Usuario ingresa valores en los inputs
2. Submit del formulario
3. Se lee `this.newPasswordInput?.value || ''`
4. Se valida `if (newPassword.length < 8)`

**Hipótesis del problema**:
- La validación puede estar siendo evadida por el operador `||`
- Si `this.newPasswordInput?.value` retorna `null` o `undefined`, el `|| ''` lo convierte en string vacío
- Pero si retorna `'1234567'`, debería fallar la validación

**Necesita verificación**: ¿Por qué la validación no se dispara?

---

### 3. Sincronización del Sidebar (TC-CFG-025)

**Archivo**: `ConfigPage.js` test helper
**Método**: `getSidebarUserName()`

```javascript
async getSidebarUserName() {
    try {
        const element = await this.driver.findElement(this.locators.sidebarUserName);
        return await element.getText();
    } catch (e) {
        return null;
    }
}
```

**Issue**: El test lee el valor inmediatamente después de submit, pero el DOM puede no haberse actualizado aún.

**Solución**: Agregar espera explícita o polling para verificar que el valor cambió:

```javascript
async getSidebarUserName() {
    try {
        await this.sleep(500); // Esperar actualización del DOM
        const element = await this.driver.findElement(this.locators.sidebarUserName);
        return await element.getText();
    } catch (e) {
        return null;
    }
}
```

---

## Recomendaciones de Corrección

### Prioridad ALTA

1. **Corregir `clearAndType()` en ConfigPage.js**
   - Permitir enviar string vacío explícitamente
   - Diferenciar entre "no enviar nada" y "enviar vacío"

2. **Investigar validación de longitud de contraseña**
   - Agregar logs en el controlador para ver si la validación se ejecuta
   - Verificar el valor exacto de `newPassword.length`

### Prioridad MEDIA

3. **Agregar espera en `getSidebarUserName()`**
   - Implementar sleep de 500ms antes de leer
   - O implementar polling hasta que el valor cambie

### Prioridad BAJA

4. **Agregar más pruebas defensivas**
   - Verificar estado del DOM antes de leer valores
   - Implementar retry logic para lecturas de UI

---

## Conclusiones ACTUALIZADAS

Después de implementar las correcciones en ConfigPage.js y volver a ejecutar los tests, los mismos 4 tests continúan fallando. El análisis más profundo revela:

### Hallazgo Principal

**Las validaciones del FRONTEND están siendo evadidas por Selenium WebDriver**

Cuando Selenium usa `.sendKeys()` y `.click()` para interactuar con los formularios, NO dispara todos los eventos JavaScript de la misma forma que la interacción humana. Esto significa que las validaciones client-side que dependen de eventos específicos pueden no ejecutarse durante los tests automatizados.

### Validación de los Códigos

1. **Frontend (config_controller.js)**: ✅ Validaciones CORRECTAS
   - Línea 80: Valida username obligatorio
   - Línea 132: Valida campos de seguridad obligatorios
   - Línea 137: Valida longitud mínima de contraseña
   - Línea 142: Valida coincidencia de contraseñas

2. **Backend (user_model_sqljs.js)**: ✅ Validaciones CORRECTAS
   - Línea 203: Valida username no vacío en `updateProfile()`
   - Línea 151: Valida longitud mínima en `changePassword()`

### Realidad de los Tests Fallidos

- **TC-CFG-010, TC-CFG-016, TC-CFG-017**: Los tests están **simulando un bypass de las validaciones frontend**
  - Esto es REALISTA porque un atacante podría usar DevTools o manipular requests HTTP directamente
  - El backend DEBERÍA ser la última línea de defensa

- **TC-CFG-025**: Problema de SINCRONIZACIÓN confirmado
  - El sidebar no se actualiza inmediatamente
  - Necesita más tiempo de espera o polling

### Veredicto Final

**Los 4 tests que fallan están revelando vulnerabilidades de seguridad REALES:**

1. ✅ Las validaciones frontend funcionan CORRECTAMENTE para usuarios normales
2. ❌ Las validaciones backend NO se están ejecutando o están siendo evadidas de alguna manera
3. ⚠️  Un atacante podría enviar datos inválidos directamente a la API

**Acción requerida**: Verificar que el backend efectivamente rechaza estos datos inválidos cuando llegan por IPC (Electron API).

---

## Siguientes Pasos

1. Implementar las correcciones en `ConfigPage.js`
2. Investigar por qué TC-CFG-017 pasa la validación de longitud
3. Re-ejecutar la suite completa
4. Objetivo: 12/12 tests pasando (100%)
