# Optimización de Rendimiento - Sistema de Seguros VILLALOBOS

**Fecha:** 2025-11-18
**Versión:** 1.0
**Hardware objetivo:** Intel Celeron N4120 @ 1.10GHz, 4GB RAM

---

## 📊 Análisis de Problema

### Síntoma
Las transiciones entre pantallas (Dashboard → Clientes → Pólizas, etc.) toman aproximadamente **900ms - 1.5 segundos**, lo cual se percibe como lento y afecta la experiencia de usuario.

### Causa Raíz

El sistema actual tiene los siguientes problemas de rendimiento:

#### 1. **Delays Hardcodeados (200ms)**
```javascript
// app-navigation.js:152
await new Promise(resolve => setTimeout(resolve, 100));

// dashboard_controller.js:431
await new Promise(resolve => setTimeout(resolve, 100));
```

#### 2. **6 Llamadas IPC Separadas en Dashboard**
Cada transición al dashboard ejecuta 6 llamadas IPC independientes:

```javascript
// dashboard_controller.js
constructor() {
    // ...
    this.loadMetrics();      // IPC call #1: getMetrics()
                             // IPC call #2: getPolizasConAlertas()
    this.initCharts();       // IPC call #3: getPolizasTrend()
                             // IPC call #4: getPolizasByAseguradora()
                             // IPC call #5: getRecibosByEstado()
                             // IPC call #6: getCobrosMensuales()
}
```

#### 3. **No hay Caché de Datos**
Cada vez que se navega al dashboard, se vuelven a consultar todos los datos de la base de datos, aunque no hayan cambiado.

#### 4. **No hay Caché de HTML**
Cada navegación hace un `fetch()` para cargar el HTML partial, aunque ya se haya cargado antes.

#### 5. **Controladores se Destruyen/Recrean**
Cada navegación destruye el controlador actual y crea uno nuevo, perdiendo estado y requiriendo reinicialización completa.

---

## 🎯 Soluciones Propuestas

### Prioridad 1: Eliminar Delays Innecesarios (Ganancia: ~200ms)

**Archivos a modificar:**
- `/assets/js/app-navigation.js:152`
- `/controllers/dashboard_controller.js:431`

**Cambio:**
```javascript
// ❌ ANTES
await new Promise(resolve => setTimeout(resolve, 100));

// ✅ DESPUÉS
// Eliminar esta línea completamente
```

**Razón:** Los delays fueron agregados como workaround temporal para "esperar que el DOM esté listo", pero con el uso correcto de async/await y event listeners, no son necesarios.

---

### Prioridad 2: Batch de Queries IPC (Ganancia: ~400-500ms)

**Problema actual:** 6 llamadas IPC independientes = 6 × (serialización + IPC + query + deserialización)

**Solución:** Crear un endpoint IPC que devuelva todos los datos del dashboard en una sola llamada.

#### Cambios en `ipc-handlers.js`

Agregar nuevo handler:

```javascript
// ipc-handlers.js
ipcMain.handle('dashboard:getAllData', async () => {
    try {
        const data = {
            metrics: dbManager.getDashboardMetrics(),
            alertas: dbManager.getPolizasConAlertas(),
            polizasTrend: dbManager.getPolizasTrend(),
            polizasByAseguradora: dbManager.getPolizasByAseguradora(),
            recibosByEstado: dbManager.getRecibosByEstado(),
            cobrosMensuales: dbManager.getCobrosMensuales()
        };

        return { success: true, data };
    } catch (error) {
        console.error('Error en dashboard:getAllData:', error);
        return { success: false, message: error.message };
    }
});
```

#### Cambios en `preload.js`

Agregar método:

```javascript
// preload.js
dashboard: {
    getAllData: () => ipcRenderer.invoke('dashboard:getAllData'),
    // ... mantener métodos existentes para compatibilidad
}
```

#### Cambios en `dashboard_controller.js`

```javascript
// dashboard_controller.js
async loadMetrics() {
    try {
        // Una sola llamada IPC que trae todo
        const result = await window.electronAPI.dashboard.getAllData();

        if (result.success && result.data) {
            const { metrics, alertas, polizasTrend, polizasByAseguradora,
                    recibosByEstado, cobrosMensuales } = result.data;

            // Guardar en cache del controlador
            this.dashboardData = result.data;

            // Actualizar métricas
            if (this.metricTotalPolizas) {
                this.metricTotalPolizas.textContent = metrics.total_polizas || 0;
            }
            // ... resto de métricas

            // Actualizar alertas
            this.alerts = alertas || [];
            this.updateAlertsUI();
        }
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
    }
}

async initCharts() {
    // Ya no hacer queries IPC, usar datos cacheados
    const { polizasTrend, polizasByAseguradora, recibosByEstado, cobrosMensuales }
        = this.dashboardData;

    try {
        this.createPolizasTrendChart(polizasTrend);
        this.createAseguradorasChart(polizasByAseguradora);
        this.createEstadosCobroChart(recibosByEstado);
        this.createCobrosMensualesChart(cobrosMensuales);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Modificar métodos de charts para recibir datos como parámetro
async createPolizasTrendChart(data) {
    const canvas = document.getElementById('chartPolizasTrend');
    if (!canvas) return;

    // Ya no hacer IPC call, usar data pasado como parámetro
    const labels = data.map(item => item.mes || '');
    const values = data.map(item => item.total || 0);

    // ... resto del código
}
```

---

### Prioridad 3: Caché de Datos (Ganancia: ~500-600ms en navegaciones repetidas)

Agregar sistema de caché temporal para datos del dashboard:

```javascript
// dashboard_controller.js
class DashboardController {
    static CACHE_DURATION = 60000; // 1 minuto
    static cachedData = null;
    static cacheTimestamp = 0;

    constructor() {
        // ...
        this.loadMetrics();
    }

    async loadMetrics() {
        const now = Date.now();

        // Usar caché si está disponible y es reciente
        if (DashboardController.cachedData &&
            (now - DashboardController.cacheTimestamp) < DashboardController.CACHE_DURATION) {
            console.log('📦 Usando datos cacheados del dashboard');
            this.dashboardData = DashboardController.cachedData;
            this.updateUIWithCachedData();
            return;
        }

        // Si no hay caché, hacer llamada IPC
        try {
            const result = await window.electronAPI.dashboard.getAllData();

            if (result.success && result.data) {
                // Guardar en caché
                DashboardController.cachedData = result.data;
                DashboardController.cacheTimestamp = now;

                this.dashboardData = result.data;
                this.updateUIWithCachedData();
            }
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
        }
    }

    updateUIWithCachedData() {
        const { metrics, alertas } = this.dashboardData;

        // Actualizar métricas
        if (this.metricTotalPolizas) {
            this.metricTotalPolizas.textContent = metrics.total_polizas || 0;
        }
        // ... resto de métricas

        // Actualizar alertas
        this.alerts = alertas || [];
        this.updateAlertsUI();
    }

    // Método público para forzar refresh
    async refresh() {
        DashboardController.cacheTimestamp = 0; // Invalidar caché
        await this.loadMetrics();
        await this.initCharts();
    }
}
```

Agregar botón de refresh en `dashboard_partial.html`:

```html
<button onclick="dashboardController.refresh()"
        class="bg-gold-500 hover:bg-gold-600 text-navy-700 px-4 py-2 rounded-lg">
    🔄 Actualizar datos
</button>
```

---

### Prioridad 4: Caché de HTML Partials (Ganancia: ~50-100ms)

```javascript
// app-navigation.js
class AppNavigation {
    constructor() {
        // ...
        this.htmlCache = new Map(); // Cache para HTML cargados
    }

    async loadView(viewName) {
        // ...
        try {
            this.contentView.classList.add('loading');

            if (this.currentController) {
                this.cleanup();
            }

            const viewConfig = this.viewMap[viewName];

            // Verificar caché de HTML
            let html;
            if (this.htmlCache.has(viewConfig.file)) {
                console.log('📦 Usando HTML cacheado:', viewConfig.file);
                html = this.htmlCache.get(viewConfig.file);
            } else {
                console.log('📁 Cargando HTML:', viewConfig.file);
                const response = await fetch(viewConfig.file);
                if (!response.ok) {
                    throw new Error(`Error al cargar vista: ${response.statusText}`);
                }
                html = await response.text();
                this.htmlCache.set(viewConfig.file, html);
            }

            this.contentView.innerHTML = html;

            // ... resto del código
        } catch (error) {
            console.error('Error al cargar vista:', error);
        }
    }

    // Método para limpiar caché si es necesario
    clearCache() {
        this.htmlCache.clear();
        console.log('🗑️ Caché de HTML limpiado');
    }
}
```

---

### Prioridad 5: Reutilización de Controladores (Ganancia: ~100-200ms)

**Nota:** Esta es una optimización más compleja que requiere refactorizar la arquitectura.

En lugar de destruir/recrear controladores, mantenerlos en memoria:

```javascript
// app-navigation.js
class AppNavigation {
    constructor() {
        // ...
        this.controllers = new Map(); // Cache de controladores
    }

    async initController(controllerName) {
        try {
            // Verificar si el controlador ya existe
            if (this.controllers.has(controllerName)) {
                console.log(`♻️ Reutilizando controlador ${controllerName}`);
                this.currentController = this.controllers.get(controllerName);

                // Si el controlador tiene método refresh, llamarlo
                if (typeof this.currentController.refresh === 'function') {
                    await this.currentController.refresh();
                }

                return;
            }

            // Si no existe, crear nuevo
            const scriptId = `controller-${controllerName}`;
            if (!document.getElementById(scriptId)) {
                await this.loadScript(
                    `../controllers/${this.getControllerFileName(controllerName)}`,
                    scriptId
                );
            }

            if (window[controllerName]) {
                this.currentController = new window[controllerName]();
                this.controllers.set(controllerName, this.currentController);

                const instanceName = controllerName.charAt(0).toLowerCase() +
                                    controllerName.slice(1);
                window[instanceName] = this.currentController;

                console.log(`✅ Controlador ${controllerName} inicializado`);
            }
        } catch (error) {
            console.error(`Error al inicializar controlador ${controllerName}:`, error);
        }
    }

    cleanup() {
        // Ya no destruir, solo desconectar del DOM
        if (this.currentController && typeof this.currentController.onHide === 'function') {
            this.currentController.onHide();
        }
        this.currentController = null;
    }
}
```

---

## 📈 Estimación de Mejoras

| Optimización | Ganancia | Dificultad | Prioridad |
|-------------|----------|------------|-----------|
| Eliminar delays | ~200ms | Fácil | ⭐⭐⭐ Alta |
| Batch IPC queries | ~500ms | Media | ⭐⭐⭐ Alta |
| Caché de datos | ~600ms (navegaciones repetidas) | Media | ⭐⭐ Media |
| Caché de HTML | ~50ms | Fácil | ⭐⭐ Media |
| Reutilizar controladores | ~150ms | Alta | ⭐ Baja |

### Resultados Esperados

**Situación actual:**
- Primera carga dashboard: ~900-1200ms
- Navegaciones subsecuentes: ~900-1200ms (sin caché)

**Después de Prioridad 1 + 2:**
- Primera carga dashboard: ~400-500ms ✅
- Navegaciones subsecuentes: ~400-500ms

**Después de Prioridad 1 + 2 + 3:**
- Primera carga dashboard: ~400-500ms ✅
- Navegaciones subsecuentes: **~50-100ms** ✅ (usando caché)

---

## 🛠️ Plan de Implementación

### Fase 1: Quick Wins (1-2 horas)
1. ✅ Eliminar delay de app-navigation.js:152
2. ✅ Eliminar delay de dashboard_controller.js:431
3. ✅ Probar y verificar que no hay regresiones

**Ganancia inmediata:** ~200ms

### Fase 2: Batch Queries (2-3 horas)
1. ✅ Crear handler `dashboard:getAllData` en ipc-handlers.js
2. ✅ Exponer método en preload.js
3. ✅ Refactorizar dashboard_controller.js para usar batch query
4. ✅ Modificar métodos de charts para aceptar datos como parámetro
5. ✅ Probar exhaustivamente

**Ganancia adicional:** ~500ms

### Fase 3: Caché (2-4 horas)
1. ✅ Implementar caché de datos en dashboard_controller.js
2. ✅ Implementar caché de HTML en app-navigation.js
3. ✅ Agregar botón de refresh manual
4. ✅ Probar con navegación repetida

**Ganancia adicional:** ~500-600ms en navegaciones repetidas

### Fase 4: Reutilización de Controladores (4-6 horas) - Opcional
1. ⚠️ Refactorizar ciclo de vida de controladores
2. ⚠️ Implementar métodos `onHide()` y `refresh()`
3. ⚠️ Probar con todos los módulos
4. ⚠️ Verificar que no hay memory leaks

**Ganancia adicional:** ~100-200ms

---

## ⚠️ Consideraciones

### 1. Invalidación de Caché
El caché de datos debe invalidarse cuando:
- Usuario hace cambios (crea/edita/elimina cliente, póliza, etc.)
- Cada 60 segundos (configurable)
- Usuario presiona botón "Actualizar"

### 2. Memory Management
- En equipos de 4GB RAM, mantener ojo en uso de memoria
- Limitar tamaño de caché HTML (máximo 10 vistas)
- Si se implementa reutilización de controladores, agregar límite

### 3. Compatibilidad
- Mantener endpoints IPC individuales para módulos que los usen
- Agregar handlers batch como complemento, no reemplazo

### 4. Testing
- Probar en hardware objetivo (Celeron N4120)
- Verificar que caché se invalida correctamente
- Confirmar que no hay memory leaks después de 50+ navegaciones

---

## 📝 Notas Técnicas

### Por qué los delays eran innecesarios

Los delays de 100ms fueron agregados como workaround temporal, probablemente para resolver race conditions. Sin embargo:

1. **app-navigation.js:152** - El delay esperaba a que el script del controlador se cargara, pero el `loadScript()` ya es asíncrono y espera el evento `onload`.

2. **dashboard_controller.js:431** - El delay esperaba a que el DOM estuviera listo, pero el controlador solo se inicializa **después** de que el HTML ya fue insertado en `contentView.innerHTML` (app-navigation.js:96).

### Por qué batch queries son más rápidas

Cada IPC call tiene overhead:
```
IPC Call Overhead = Serialización + IPC Transport + Deserialización
                   ≈ 20-30ms en máquina rápida
                   ≈ 50-100ms en Celeron N4120
```

6 calls separadas = 6 × overhead + 6 × query time
1 batch call = 1 × overhead + (6 × query time ejecutadas juntas)

Además, sql.js puede optimizar múltiples queries ejecutadas en bloque.

---

## 🎯 Conclusión

Con las optimizaciones de Fase 1 y Fase 2 implementadas, el sistema debería sentirse **significativamente más rápido**:

- **Reducción de ~700ms** en cada transición (de ~900ms a ~200ms)
- **Mejora de ~77%** en tiempo de respuesta
- Experiencia de usuario mucho más fluida

Las Fases 3 y 4 pueden implementarse posteriormente si se requiere aún más optimización.

---

**Documentado por:** Claude Code
**Fecha:** 2025-11-18
**Versión del sistema:** MVC Electron v2.0
