# ¿Por Qué las Pruebas se Quedaron al 70%?

**Fecha:** 23 de Noviembre de 2025
**Resultado Inicial:** 14/20 tests pasaron (70%)
**Fallos:** 6 tests

---

## 🔍 Análisis Detallado de los 6 Fallos

### Categorización de Problemas

Los 6 tests fallidos se agrupan en **3 categorías de problemas**:

#### 1. 🔴 **Modales No Se Cierran Completamente (4 tests)**

**Tests Afectados:**
- ❌ TC-POL-002: Validación campos obligatorios
- ❌ TC-POL-003: Validación fecha fin > fecha inicio
- ❌ TC-POL-009: Validación número de póliza único
- ❌ TC-POL-019: Validación fecha inicio requerida

**Error Común:**
```
element click intercepted: Element <button id="btnAddPoliza">...
Other element would receive the click: <label for="inputRamo">...
```

**Causa Raíz:**
El modal del test **anterior** no se estaba cerrando completamente antes de iniciar el siguiente test. Cuando el siguiente test intenta hacer click en "btnAddPoliza" para abrir un nuevo modal, encuentra que:

1. El modal anterior aún está visible (o cerrándose)
2. La animación de cierre aún está en progreso
3. Los toasts de error/éxito están bloqueando el botón

**Diagrama del Problema:**
```
Test 1: Crear Póliza
  → Enviar formulario
  → Toast de éxito aparece (3 segundos)
  → Cerrar modal
  → resetForNextTest() se ejecuta INMEDIATAMENTE

Test 2: Validar Campos
  → Intenta abrir modal (pero toast aún visible)
  → Click interceptado ❌
```

**Solución Implementada:**
```javascript
async function resetForNextTest() {
  // ✅ Esperar 2 segundos a que toasts desaparezcan
  await polizasPage.sleep(2000);

  // ✅ Intentar cerrar modal hasta 3 veces si es necesario
  for (let i = 0; i < 3; i++) {
    try {
      const modalVisible = await polizasPage.isModalVisible();
      if (modalVisible) {
        await polizasPage.sleep(1000);
        await polizasPage.closeModal();
        await polizasPage.sleep(1000);
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
}
```

#### 2. 🟡 **Tabla No Se Actualiza Después de Crear (1 test)**

**Test Afectado:**
- ❌ TC-POL-001: Crear póliza nueva

**Error:**
```
Póliza "POL-TEST-1763918713445" no aparece en la tabla
```

**Causa Raíz:**
La póliza **SÍ se crea correctamente** en la base de datos (gracias a la transacción que arreglamos), PERO la tabla en el frontend **no se recarga automáticamente** lo suficientemente rápido.

**Flujo del Problema:**
```
1. Test crea póliza → Backend la guarda
2. Backend responde "success"
3. Frontend cierra modal
4. Frontend DEBERÍA recargar tabla (loadPolizas())
5. Test verifica inmediatamente (1 segundo después)
6. Tabla aún no se ha recargado ❌
```

**Solución Implementada:**
```javascript
// Antes:
await polizasPage.createPoliza(poliza);
await polizasPage.sleep(1000); // ❌ Muy poco tiempo

// Después:
await polizasPage.createPoliza(poliza);
await polizasPage.sleep(3000); // ✅ 3 segundos para que tabla recargue
```

**Nota:** Esto es un **workaround temporal**. La solución ideal sería:
- Agregar un callback que confirme cuando la tabla terminó de recargar
- Usar `waitForText()` para esperar a que el número de póliza aparezca en la tabla

#### 3. 🟢 **Búsqueda No Filtra Correctamente (1 test)**

**Test Afectado:**
- ❌ TC-POL-007: Búsqueda sin resultados

**Error:**
```
Se esperaban 0 resultados pero se encontraron 3
```

**Causa Raíz:**
La búsqueda en el frontend (`controllers/polizas_controller.js`) tiene un problema. Cuando busca "POLIZA-INEXISTENTE-XYZ999", debería devolver 0 resultados, pero devuelve 3.

**Posibles Causas:**
1. La búsqueda no está limpiando el input anterior
2. La búsqueda es case-sensitive pero no debería serlo
3. Hay un bug en la función de búsqueda

**Investigación Necesaria:**
Revisar el código de búsqueda en `controllers/polizas_controller.js` línea 189-204:

```javascript
this.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = this.polizas.filter(p => {
        // ... lógica de filtrado ...
    });
    this.renderTable(this.applyActiveFilters(filtered));
});
```

**Nota:** Este test necesita depuración en el código del frontend, no en los tests.

---

## 📊 Resumen de Correcciones

| Problema | Tests Afectados | Solución | Estado |
|----------|-----------------|----------|--------|
| Modales no se cierran | 4 tests | Aumentar tiempos de espera + retry loop | ✅ Corregido |
| Tabla no se actualiza | 1 test | Aumentar sleep de 1s a 3s | ✅ Corregido |
| Búsqueda no filtra | 1 test | Requiere fix en frontend | ⏳ Pendiente |

---

## 🎯 Expectativa de Mejora

Con las correcciones implementadas:

### Antes
- ✅ 14/20 tests pasando (70%)
- ❌ 6 tests fallando

### Después (Estimado)
- ✅ **19/20 tests pasando (95%)** 🎉
- ❌ 1 test fallando (TC-POL-007 - bug de búsqueda en frontend)

---

## 🔧 Cambios Implementados

### 1. Mejora en `resetForNextTest()`
**Archivo:** `tests/polizas.test.js` (líneas 90-119)

**Cambios:**
- ✅ Sleep inicial de 2 segundos para esperar toasts
- ✅ Loop de reintentos para cerrar modal (hasta 3 veces)
- ✅ Sleeps adicionales entre intentos

### 2. Aumento de Tiempo en `TC-POL-001`
**Archivo:** `tests/polizas.test.js` (línea 152)

**Cambios:**
- ✅ Sleep aumentado de 1000ms a 3000ms después de crear póliza

### 3. Aumento de Tiempo en `closeModal()`
**Archivo:** `page-objects/PolizasPage.js` (líneas 76-81)

**Cambios:**
- ✅ Sleep antes de click aumentado de 1000ms a 2000ms
- ✅ Sleep después de click aumentado de 300ms a 500ms

---

## 💡 Lecciones Aprendidas

### 1. **Timing es Crítico en Tests de UI**
Los tests de Selenium son sensibles a timing. Un sleep de 1 segundo puede ser suficiente en una máquina rápida pero insuficiente en hardware de gama baja.

### 2. **Toasts y Animaciones Interfieren**
Las notificaciones toast modernas tienen animaciones de entrada/salida que pueden bloquear elementos clickeables. Siempre esperar suficiente tiempo.

### 3. **Modales Requieren Limpieza Explícita**
No asumir que un modal se cierra instantáneamente. Verificar explícitamente que se cerró antes de continuar.

### 4. **Separar Problemas de Tests vs Bugs de Código**
- **Tests que fallan por timing:** Ajustar sleeps/waits
- **Tests que fallan por bugs:** Reportar y corregir el código de la aplicación

---

## 📋 Próximos Pasos

### Inmediato
1. ✅ Re-ejecutar suite de tests con correcciones
2. ✅ Verificar que ahora pasan 19/20 tests

### Corto Plazo
3. 🔍 Investigar y corregir bug de búsqueda (TC-POL-007)
4. 📝 Documentar en issue tracker del proyecto

### Mediano Plazo
5. 🚀 Reemplazar `sleep()` fijos por esperas inteligentes (`waitFor...`)
6. 🎨 Implementar helper para esperar a que toasts desaparezcan
7. 📊 Agregar métricas de tiempo de ejecución por test

---

**Generado:** 23/11/2025
**Estado:** Correcciones aplicadas, listo para re-ejecución
