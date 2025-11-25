# 📘 GUÍA DE ESTUDIO - ANGEL SALINAS (Líder Técnico / Integrador)

**Área**: Arquitectura MVC, Integración de Componentes, Módulos Core

---

## 🎯 TU RESPONSABILIDAD

Eres el **líder técnico** del proyecto. Debes poder explicar:
- La arquitectura completa del sistema (MVC + Electron)
- Cómo funcionan los módulos principales (Pólizas, Recibos, Dashboard)
- Cómo se generan automáticamente los recibos
- Cómo funciona el seeder y por qué es importante
- La integración entre todos los componentes del equipo

**IMPORTANTE**: Como líder, también debes tener conocimiento general de las áreas de todos tus compañeros para poder responder preguntas cruzadas.

---

## 📚 ARCHIVOS QUE DEBES DOMINAR

### 🔥 **CRÍTICOS** (Debes conocer al 100%)

1. **`main.js`** - Proceso principal de Electron
   - **Líneas clave**: 1-200
   - **Qué hace**: Inicializa Electron, crea ventana, configura IPC

2. **`preload.js`** - API Bridge IPC
   - **Líneas clave**: 1-500 (todo)
   - **Qué hace**: Expone APIs seguras al renderer

3. **`models/poliza_model.js`** - Lógica de pólizas
   - **Líneas clave**: 14-93 (create + transacciones), 152-213 (generación recibos)
   - **Qué hace**: CRUD pólizas, auto-genera recibos

4. **`controllers/dashboard_controller.js`** - Dashboard
   - **Líneas clave**: 1-300
   - **Qué hace**: Carga métricas, actualiza gráficas

5. **`migration/seeder.js`** - Seeder de datos
   - **Líneas clave**: 165-249 (generación de pólizas con PolizaModel)
   - **Qué hace**: Puebla BD con datos realistas

---

## 💬 PREGUNTAS DEL PROFESOR (PREPARA RESPUESTAS)

### **1. ¿Cómo funciona la arquitectura MVC en este proyecto?**

**RESPUESTA MODELO**:
> "Usamos el patrón MVC (Model-View-Controller) adaptado para Electron:
>
> **Model** (`models/`):
> - Lógica de negocio y acceso a datos
> - Ejemplo: `poliza_model.js` maneja CRUD de pólizas
> - Interactúa directamente con SQLite
> - No conoce nada de la UI
>
> **View** (`views/`):
> - HTML + Tailwind CSS
> - `app_view.html` es el shell principal
> - `partials/` contiene vistas de cada módulo
> - Se cargan dinámicamente (SPA)
>
> **Controller** (`controllers/`):
> - Conecta Model y View
> - Ejemplo: `polizas_controller.js`
> - Maneja eventos del usuario
> - Llama a Models vía IPC
> - Actualiza la vista con resultados
>
> **Flujo completo**:
> ```
> Usuario hace clic en 'Guardar Póliza'
>   ↓
> View (polizas_partial.html) dispara evento
>   ↓
> Controller (polizas_controller.js) captura evento
>   ↓
> Controller llama IPC: window.electronAPI.polizas.create(data)
>   ↓
> preload.js envía al main process
>   ↓
> ipc-handlers.js recibe y llama al Model
>   ↓
> Model (poliza_model.js) guarda en BD y genera recibos
>   ↓
> Respuesta regresa por el mismo camino
>   ↓
> Controller actualiza la vista con toast de éxito
> ```

**DEMOSTRAR**: Abrir `polizas_controller.js`, seguir una función desde el evento hasta la llamada IPC

---

### **2. ¿Cómo se generan automáticamente los recibos al crear una póliza?**

**RESPUESTA MODELO**:
> "Cuando se crea una póliza, se generan automáticamente todos sus recibos de pago según la periodicidad.
>
> **Código clave** (`poliza_model.js:14-93`):
> ```javascript
> create(polizaData) {
>   try {
>     this.dbManager.execute('BEGIN TRANSACTION');
>
>     // 1. Insertar póliza
>     const result = this.dbManager.execute(`INSERT INTO Poliza ...`);
>     const polizaId = result.lastInsertRowid;
>
>     // 2. Generar recibos automáticamente
>     const recibosGenerados = this._generarRecibos(
>       polizaId,
>       payload.periodicidad_id,
>       payload.vigencia_inicio,
>       payload.vigencia_fin,
>       payload.prima_total
>     );
>
>     this.dbManager.execute('COMMIT');
>
>     return { poliza_id: polizaId, recibos_generados: recibosGenerados };
>   } catch (error) {
>     this.dbManager.execute('ROLLBACK');
>     throw error;
>   }
> }
> ```
>
> **Lógica de generación** (`poliza_model.js:152-213`):
> ```javascript
> _generarRecibos(polizaId, periodicidadId, vigenciaInicio, vigenciaFin, primaTotal) {
>   // 1. Obtener datos de periodicidad (mensual, trimestral, etc.)
>   const periodicidad = this.dbManager.queryOne(
>     'SELECT meses FROM Periodicidad WHERE periodicidad_id = ?',
>     [periodicidadId]
>   );
>
>   // 2. Calcular periodos
>   const periodos = this._buildPeriodos(inicio, fin, periodicidad.meses);
>   // Ejemplo: Póliza anual + mensual = 12 periodos
>
>   // 3. Dividir prima total entre recibos
>   const montos = this._splitAmount(primaTotal, periodos.length);
>   // Ejemplo: $12,000 / 12 = $1,000 por recibo
>
>   // 4. Crear recibo para cada periodo
>   periodos.forEach((periodo, index) => {
>     const numeroRecibo = `${polizaId}-${String(index + 1).padStart(2, '0')}`;
>
>     this.dbManager.execute(`
>       INSERT INTO Recibo (
>         poliza_id, numero_recibo, monto,
>         fecha_inicio_periodo, fecha_fin_periodo,
>         fecha_corte, estado
>       ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
>     `, [...]);
>   });
>
>   return periodos.length;
> }
> ```
>
> **Ejemplo práctico**:
> - Póliza: vigencia del 1-ene-2025 al 31-dic-2025
> - Periodicidad: Mensual (meses = 1)
> - Prima total: $12,000
> - **Resultado**: Se crean 12 recibos de $1,000 cada uno
>   - Recibo 1: 1-ene a 31-ene, vence 25-dic-2024
>   - Recibo 2: 1-feb a 28-feb, vence 25-ene-2025
>   - ... hasta recibo 12

**DEMOSTRAR**:
1. Crear póliza en la app con periodicidad mensual
2. Ir a módulo de Recibos
3. Buscar recibos de esa póliza
4. Mostrar que se generaron automáticamente

---

### **3. ¿Cómo funciona el seeder y por qué es importante?**

**RESPUESTA MODELO**:
> "El seeder es un script que puebla la base de datos con datos realistas de prueba.
>
> **¿Por qué es importante?**
> 1. **Probar rendimiento**: Ver cómo se comporta el sistema con muchos datos
> 2. **Demostración**: Dashboard con datos realistas se ve profesional
> 3. **Testing**: Los testers necesitan datos variados
> 4. **Desarrollo**: No crear manualmente 100 pólizas
>
> **Datos generados**:
> - 75 clientes con RFCs válidos mexicanos
> - 350 pólizas distribuidas en 3 años
> - ~3,223 recibos auto-generados
> - 60% de recibos marcados como pagados
> - Nombres, direcciones, teléfonos realistas
>
> **Código clave** (`seeder.js:165-249`):
> ```javascript
> function generarPolizas(cantidad, clientes, catalogos) {
>   const polizaModel = new PolizaModel(dbManager);
>
>   for (let i = 0; i < cantidad; i++) {
>     const polizaData = {
>       numero_poliza: 'POL-TEST-' + Date.now(),
>       cliente_id: clienteAleatorio.cliente_id,
>       prima_total: generarMontoPorRamo(ramo.nombre),
>       vigencia_inicio: fechaAleatoria,
>       periodicidad_id: periodicidadAleatoria.id
>       // ...
>     };
>
>     // ✅ Usar PolizaModel para auto-generar recibos
>     const result = polizaModel.create(polizaData);
>     totalRecibosGenerados += result.recibos_generados;
>   }
> }
> ```
>
> **Clave**: Usamos `PolizaModel.create()` en lugar de INSERT directo
> - Respeta la lógica de negocio
> - Auto-genera recibos correctamente
> - Valida datos
>
> **Ejecución**:
> ```bash
> npm run seed
> ```
>
> **Resultado**:
> ```
> ✅ 75 clientes generados
> ✅ 350 pólizas generadas
> ✅ 3223 recibos auto-generados
> ✅ 1959 recibos marcados como pagados (60.8%)
> ```

**DEMOSTRAR**:
1. Mostrar BD vacía (sin datos)
2. Ejecutar `npm run seed`
3. Mostrar dashboard con datos realistas
4. Mostrar tabla de clientes poblada

---

### **4. ¿Qué métricas se muestran en el dashboard y cómo se calculan?**

**RESPUESTA MODELO**:
> "El dashboard muestra métricas clave del negocio en tiempo real.
>
> **Métricas implementadas**:
>
> 1. **Recibos que vencen hoy**:
> ```javascript
> const vencenHoy = dbManager.queryOne(`
>   SELECT COUNT(*) as total, SUM(monto) as monto
>   FROM Recibo
>   WHERE estado = 'pendiente'
>   AND DATE(fecha_corte) = DATE('now')
> `);
> ```
>
> 2. **Recibos atrasados +30 días**:
> ```javascript
> const atrasados = dbManager.queryOne(`
>   SELECT COUNT(*) as total, SUM(monto) as monto
>   FROM Recibo
>   WHERE estado IN ('pendiente', 'vencido')
>   AND DATE(fecha_corte) < DATE('now', '-30 days')
> `);
> ```
>
> 3. **Pólizas por renovar en 30 días**:
> ```javascript
> const renovar = dbManager.queryOne(`
>   SELECT COUNT(*) as total, SUM(prima_total) as monto
>   FROM Poliza
>   WHERE activo = 1
>   AND DATE(vigencia_fin) BETWEEN DATE('now') AND DATE('now', '+30 days')
> `);
> ```
>
> 4. **Cobrado este mes**:
> ```javascript
> const cobrado = dbManager.queryOne(`
>   SELECT SUM(monto) as total
>   FROM Recibo r
>   JOIN Poliza p ON r.poliza_id = p.poliza_id
>   WHERE r.estado = 'pagado'
>   AND p.activo = 1
>   AND DATE(r.fecha_pago) >= DATE('now', 'start of month')
> `);
> ```
>
> 5. **Por cobrar total**:
> ```javascript
> const porCobrar = dbManager.queryOne(`
>   SELECT SUM(monto) as total
>   FROM Recibo r
>   JOIN Poliza p ON r.poliza_id = p.poliza_id
>   WHERE r.estado IN ('pendiente', 'vencido')
>   AND p.activo = 1
> `);
> ```
>
> 6. **Tasa de morosidad**:
> ```javascript
> const morosidad = (montosVencidos / (montosVencidos + cobradoMes)) * 100;
> ```
>
> 7. **Top 5 clientes**:
> ```javascript
> const top5 = dbManager.query(`
>   SELECT c.nombre, SUM(p.prima_total) as total
>   FROM Cliente c
>   JOIN Poliza p ON c.cliente_id = p.cliente_id
>   WHERE p.activo = 1
>   GROUP BY c.cliente_id
>   ORDER BY total DESC
>   LIMIT 5
> `);
> ```

**DEMOSTRAR**:
1. Abrir dashboard
2. Señalar cada métrica
3. Explicar qué significa cada número
4. Abrir DevTools y mostrar llamada IPC

---

### **5. ¿Cómo se comunican el frontend y backend en Electron?**

**RESPUESTA MODELO**:
> "Usamos IPC (Inter-Process Communication) para comunicación segura.
>
> **Arquitectura de seguridad**:
> - Renderer process (frontend) NO tiene acceso a Node.js
> - Main process (backend) SÍ tiene acceso completo
> - preload.js es el puente seguro entre ambos
>
> **Flujo completo** (crear póliza):
>
> **1. Frontend** (`polizas_controller.js`):
> ```javascript
> async crearPoliza(polizaData) {
>   const result = await window.electronAPI.polizas.create(polizaData);
>   if (result.success) {
>     showToast('Póliza creada', 'success');
>   }
> }
> ```
>
> **2. Preload Bridge** (`preload.js`):
> ```javascript
> contextBridge.exposeInMainWorld('electronAPI', {
>   polizas: {
>     create: (data) => ipcRenderer.invoke('polizas:create', data)
>   }
> });
> ```
>
> **3. IPC Handler** (`ipc-handlers.js` o `main.js`):
> ```javascript
> ipcMain.handle('polizas:create', async (event, polizaData) => {
>   try {
>     const polizaModel = new PolizaModel(dbManager);
>     const result = polizaModel.create(polizaData);
>     return { success: true, data: result };
>   } catch (error) {
>     return { success: false, error: error.message };
>   }
> });
> ```
>
> **4. Model** (`poliza_model.js`):
> ```javascript
> create(polizaData) {
>   // Validar, sanitizar, guardar en BD
>   // Generar recibos
>   // Retornar resultado
> }
> ```
>
> **5. Respuesta de vuelta**:
> - Model → IPC Handler → preload.js → Controller → View
>
> **Seguridad**:
> - `contextBridge`: Solo expone APIs específicas
> - `nodeIntegration: false`: Renderer no puede usar require()
> - `contextIsolation: true`: Separación de contextos
> - preload.js es el único puente autorizado"

**DEMOSTRAR**:
1. Abrir `preload.js` y mostrar `contextBridge.exposeInMainWorld`
2. Mostrar una API expuesta: `electronAPI.polizas.create`
3. Abrir `main.js` y mostrar configuración de seguridad
4. Abrir DevTools → Consola
5. Escribir `window.electronAPI` y mostrar APIs disponibles

---

### **6. ¿Por qué usaron SQLite y no PostgreSQL/MySQL?**

**RESPUESTA MODELO**:
> "Elegimos SQLite porque es perfecto para aplicaciones de escritorio.
>
> **Ventajas de SQLite**:
> 1. **Archivo único**: `gestor_polizas_v2.sqlite`
>    - Fácil de respaldar
>    - Portable (copiar a USB)
>    - No requiere servidor
>
> 2. **Sin instalación**: Cliente no instala nada extra
>    - PostgreSQL requiere instalar servidor
>    - MySQL requiere configuración
>
> 3. **Local y rápido**: Todo está en disco local
>    - Sin latencia de red
>    - Sin problemas de conexión
>
> 4. **sql.js**: Ejecuta SQLite en JavaScript
>    - Compatible con Electron
>    - No dependencias nativas
>
> 5. **Suficiente para el caso de uso**:
>    - Sistema de escritorio, un usuario
>    - No necesitamos concurrencia de 1000 usuarios
>    - Perfecto para SMB (pequeñas empresas)
>
> **Cuándo NO usar SQLite**:
> - Aplicación web multi-usuario
> - Miles de transacciones concurrentes
> - Necesitas replicación/clustering
>
> **Cuándo SÍ usar SQLite (nuestro caso)**:
> - App de escritorio
> - Un usuario o pocos usuarios
> - Datos locales
> - Sin servidor
> - Portable"

---

### **7. ¿Qué es el patrón Singleton y dónde se usa?**

**RESPUESTA MODELO**:
> "Singleton es un patrón donde solo existe UNA instancia de una clase en toda la aplicación.
>
> **En nuestro proyecto** (`database.js`):
> ```javascript
> class DatabaseManager {
>   constructor() {
>     this.db = null;
>   }
>
>   async initialize() {
>     if (this.db) return; // Ya está inicializado
>     // Inicializar solo una vez...
>   }
> }
>
> // ✅ Exportar la instancia (singleton)
> const dbManager = new DatabaseManager();
> module.exports = { dbManager };
>
> // ❌ NO exportar la clase
> // module.exports = DatabaseManager;
> ```
>
> **Uso en otros archivos**:
> ```javascript
> const { dbManager } = require('./models/database');
> // Todos usan la MISMA instancia
> // Una sola conexión a la BD
> ```
>
> **Por qué Singleton para DB**:
> 1. **Una sola conexión**: Evita abrir múltiples conexiones
> 2. **Estado compartido**: Todos ven los mismos datos
> 3. **Rendimiento**: No crear/destruir conexiones
> 4. **Consistencia**: Una fuente de verdad
>
> **Sin Singleton (malo)**:
> ```javascript
> // archivo1.js
> const db1 = new DatabaseManager(); // Conexión 1
>
> // archivo2.js
> const db2 = new DatabaseManager(); // Conexión 2 ❌
> // Problemas: bloqueos, inconsistencia
> ```

**DEMOSTRAR**:
1. Abrir `database.js` línea final
2. Mostrar `const dbManager = new DatabaseManager()`
3. Mostrar `module.exports = { dbManager }`
4. Abrir varios models y mostrar que todos importan el mismo `dbManager`

---

## 🎬 DEMOSTRACIÓN EN VIVO (Practica esto)

### **Demo 1: Flujo Completo MVC**
```
1. Abrir la aplicación
2. Ir a módulo Pólizas
3. Abrir DevTools (Ctrl+Shift+I)
4. Clic en "Nueva Póliza"
5. Llenar formulario
6. En Network tab, ver llamada IPC
7. Clic en "Guardar"
8. Mostrar toast de éxito
9. Ir a Recibos
10. Buscar recibos de la póliza
11. Mostrar recibos auto-generados

Explicar en cada paso:
- "Aquí el View captura datos"
- "Aquí el Controller valida"
- "Aquí se llama al IPC"
- "Aquí el Model guarda y genera recibos"
- "Aquí regresa la respuesta"
```

### **Demo 2: Ejecutar Seeder**
```bash
# Terminal
npm run seed

# Explicar mientras ejecuta:
1. "Limpia datos existentes"
2. "Genera 75 clientes con RFCs válidos"
3. "Genera 350 pólizas distribuidas en 3 años"
4. "PolizaModel auto-genera ~3200 recibos"
5. "Marca 60% como pagados"
6. "Muestra estadísticas finales"

# Luego abrir app:
7. "Dashboard ahora tiene datos realistas"
8. "Gráficas se ven profesionales"
9. "Listo para demostración"
```

### **Demo 3: Dashboard con Datos Reales**
```
1. Abrir dashboard
2. Señalar "Vencen Hoy: 2 recibos ($2,120)"
3. "Atrasados +30d: 383 recibos ($859K)"
4. "Cobrado este mes: $264K"
5. "Por cobrar: $2.3M"
6. "Tasa de morosidad: 43%"
7. Scroll down
8. "Antigüedad de saldos" → barra verde (al día)
9. "Top 5 clientes" → Lista ordenada
10. "Flujo de caja proyectado" → Gráfica Chart.js

"Todas estas métricas se calculan en tiempo real
desde la base de datos con queries SQL optimizadas"
```

---

## ✅ CHECKLIST DE PREPARACIÓN (Como Líder)

Debes poder:

- [ ] Explicar arquitectura MVC completa
- [ ] Explicar el flujo IPC (frontend ↔ backend)
- [ ] Demostrar creación de póliza con auto-generación de recibos
- [ ] Explicar algoritmo de generación de recibos
- [ ] Ejecutar y explicar el seeder
- [ ] Explicar cada métrica del dashboard
- [ ] Explicar patrón Singleton en DatabaseManager
- [ ] Explicar por qué SQLite vs PostgreSQL
- [ ] Explicar seguridad de Electron (contextBridge)
- [ ] Responder preguntas generales de cualquier módulo
- [ ] Coordinar presentación del equipo
- [ ] Apoyar a compañeros si no saben responder

---

## 🎯 RESPUESTAS RÁPIDAS (Memoriza)

**P: ¿Qué patrón arquitectónico?**
R: MVC adaptado para Electron con IPC

**P: ¿Cómo se generan recibos?**
R: Automáticamente al crear póliza según periodicidad

**P: ¿Por qué el seeder?**
R: Datos realistas para pruebas, demo y desarrollo

**P: ¿Qué muestra el dashboard?**
R: 8 métricas clave: vencimientos, cobrado, morosidad, top clientes, etc.

**P: ¿Cómo frontend-backend?**
R: IPC con contextBridge para seguridad

**P: ¿Por qué SQLite?**
R: App escritorio, archivo único, sin servidor, portable

**P: ¿Qué es Singleton?**
R: Una sola instancia, usado en DatabaseManager

---

## 💡 TIPS PARA LIDERAR LA PRESENTACIÓN

1. **Inicia tú**: Da contexto general del proyecto
2. **Introduce a tu equipo**: Presenta a cada integrante y su rol
3. **Coordina**: "Michelle va a explicar el frontend..."
4. **Apoya**: Si alguien se traba, ayúdalo
5. **Conecta**: Relaciona las áreas entre sí
6. **Cierra**: Resumen final y aprendizajes

**Estructura sugerida** (30 min):
```
1. Intro y contexto (2 min) - TÚ
2. Arquitectura general (3 min) - TÚ
3. Frontend (5 min) - Michelle
4. Backend/BD (5 min) - Sebas
5. Testing (5 min) - Chava
6. Electron/IPC (5 min) - Angel Flores
7. Demo en vivo (3 min) - TÚ
8. Preguntas (2 min) - TODOS
```

**¡Éxito en tu presentación! 🚀**
