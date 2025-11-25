# 📘 GUÍA DE ESTUDIO - SEBAS (Backend & Base de Datos)

**Área**: Base de Datos, Modelos, Lógica de Negocio, Catálogos

---

## 🎯 TU RESPONSABILIDAD

Eres el experto en **base de datos y backend**. Debes poder explicar:
- Cómo está estructurada la base de datos (esquema)
- Por qué se usa SQLite y cómo funciona sql.js
- Qué es el patrón Singleton en DatabaseManager
- Cómo funcionan los soft deletes
- Qué es el sistema de auditoría
- Cómo funcionan las transacciones
- Qué son las periodicidades y su impacto en recibos

---

## 📚 ARCHIVOS QUE DEBES DOMINAR

### 🔥 **CRÍTICOS** (Debes conocer al 100%)

1. **`models/database.js`** - Core de la base de datos
   - **Líneas clave**: 1-300 (clase DatabaseManager), 400-600 (queries del dashboard)
   - **Qué hace**: Conexión a BD, queries, singleton pattern

2. **`models/poliza_model.js`** - Modelo de pólizas
   - **Líneas clave**: 14-93 (transacciones), 454-555 (update con regeneración)
   - **Qué hace**: CRUD pólizas, manejo de transacciones

3. **`models/auditoria_model.js`** - Sistema de auditoría
   - **Líneas clave**: 1-100 (completo)
   - **Qué hace**: Registra cambios en pólizas

4. **`docs/base-de-datos/DATABASE_PROPOSAL.md`** - Esquema de BD
   - **Qué hace**: Documentación completa del esquema

### ⚠️ **IMPORTANTES** (Conocer funcionamiento general)

5. **`models/cliente_model.js`** - Modelo de clientes
6. **`models/recibo_model.js`** - Modelo de recibos
7. **`models/catalogos_model.js`** - Catálogos del sistema
8. **`models/user_model_sqljs.js`** - Usuarios y autenticación

---

## 💬 PREGUNTAS DEL PROFESOR (PREPARA RESPUESTAS)

### **1. ¿Por qué SQLite y cómo funciona sql.js?**

**RESPUESTA MODELO**:
> "Usamos SQLite con sql.js porque es perfecto para aplicaciones de escritorio Electron.
>
> **¿Qué es SQLite?**
> - Base de datos relacional embebida
> - Todo en un archivo: `gestor_polizas_v2.sqlite`
> - Sin servidor, sin configuración
> - Estándar en apps móviles y desktop
>
> **¿Qué es sql.js?**
> - Implementación de SQLite compilada a WebAssembly
> - Permite ejecutar SQLite en JavaScript puro
> - Compatible con Electron/Node.js
> - Sin dependencias nativas (no necesita compilar C++)
>
> **Comparación**:
> ```
> PostgreSQL/MySQL:
> ❌ Requiere servidor separado
> ❌ Cliente debe instalar y configurar
> ❌ Conexión por red (más lenta)
> ❌ Complejo para backups
> ✅ Bueno para multi-usuario web
>
> SQLite + sql.js:
> ✅ Un solo archivo
> ✅ Sin instalación adicional
> ✅ Acceso directo (sin red)
> ✅ Fácil backup (copiar archivo)
> ✅ Perfecto para desktop single-user
> ❌ No para miles de usuarios concurrentes
> ```
>
> **Cómo funciona en nuestro proyecto**:
> ```javascript
> // database.js
> const initSqlJs = require('sql.js');
>
> async initialize() {
>   const SQL = await initSqlJs();
>
>   if (fs.existsSync(this.dbPath)) {
>     // Cargar BD existente
>     const buffer = fs.readFileSync(this.dbPath);
>     this.db = new SQL.Database(buffer);
>   } else {
>     // Crear nueva BD
>     this.db = new SQL.Database();
>     this.createSchema();
>   }
> }
>
> // Guardar cambios a disco
> saveToFile() {
>   const data = this.db.export();
>   const buffer = Buffer.from(data);
>   fs.writeFileSync(this.dbPath, buffer);
> }
> ```

**DEMOSTRAR**:
1. Mostrar archivo `gestor_polizas_v2.sqlite` en Finder
2. Abrir con DB Browser for SQLite
3. Mostrar tablas y datos

---

### **2. ¿Cómo está estructurado el esquema de la base de datos?**

**RESPUESTA MODELO**:
> "El esquema sigue el modelo del negocio de seguros con normalización.
>
> **Tablas principales**:
>
> 1. **Cliente** - Información de clientes
> ```sql
> CREATE TABLE Cliente (
>   cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
>   tipo_persona TEXT CHECK(tipo_persona IN ('Física', 'Moral')),
>   nombre TEXT NOT NULL,
>   rfc TEXT UNIQUE,
>   email TEXT,
>   telefono TEXT,
>   direccion TEXT,
>   fecha_nacimiento TEXT,
>   fecha_constitucion TEXT,
>   activo INTEGER DEFAULT 1,  -- Soft delete
>   fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
> );
> ```
>
> 2. **Poliza** - Pólizas de seguros
> ```sql
> CREATE TABLE Poliza (
>   poliza_id INTEGER PRIMARY KEY AUTOINCREMENT,
>   numero_poliza TEXT UNIQUE NOT NULL,
>   cliente_id INTEGER REFERENCES Cliente(cliente_id),
>   aseguradora_id INTEGER REFERENCES Aseguradora(aseguradora_id),
>   ramo_id INTEGER REFERENCES Ramo(ramo_id),
>   prima_neta REAL NOT NULL,
>   prima_total REAL NOT NULL,
>   vigencia_inicio TEXT NOT NULL,
>   vigencia_fin TEXT NOT NULL,
>   periodicidad_id INTEGER REFERENCES Periodicidad(periodicidad_id),
>   metodo_pago_id INTEGER REFERENCES MetodoPago(metodo_pago_id),
>   estado_pago TEXT DEFAULT 'pendiente',
>   activo INTEGER DEFAULT 1,
>   fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
> );
> ```
>
> 3. **Recibo** - Pagos de pólizas
> ```sql
> CREATE TABLE Recibo (
>   recibo_id INTEGER PRIMARY KEY AUTOINCREMENT,
>   poliza_id INTEGER REFERENCES Poliza(poliza_id),
>   numero_recibo TEXT UNIQUE,
>   fecha_inicio_periodo TEXT,
>   fecha_fin_periodo TEXT,
>   numero_fraccion INTEGER,
>   monto REAL NOT NULL,
>   fecha_corte TEXT,  -- Fecha límite de pago
>   fecha_vencimiento_original TEXT,
>   fecha_pago TEXT,
>   estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'pagado', 'vencido')),
>   fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
> );
> ```
>
> **Tablas de catálogos**:
> - **Aseguradora** - GNP, AXA, Mapfre, etc.
> - **Ramo** - Automóvil, Vida, GMM, Daños, etc.
> - **Periodicidad** - Mensual, Trimestral, Semestral, Anual
> - **MetodoPago** - Efectivo, Transferencia, Cheque, Domiciliado
>
> **Tablas auxiliares**:
> - **Usuario** - Usuarios del sistema
> - **AuditoriaPoliza** - Historial de cambios
> - **Documento** - Archivos adjuntos
>
> **Relaciones**:
> ```
> Cliente (1) ──→ (N) Poliza
> Poliza (1) ──→ (N) Recibo
> Poliza (N) ──→ (1) Aseguradora
> Poliza (N) ──→ (1) Ramo
> Poliza (N) ──→ (1) Periodicidad
> ```

**DEMOSTRAR**:
1. Abrir DB Browser for SQLite
2. Tab "Database Structure"
3. Mostrar cada tabla
4. Clic en una tabla → "Browse Data"
5. Mostrar registros reales

---

### **3. ¿Qué es el patrón Singleton en DatabaseManager?**

**RESPUESTA MODELO**:
> "Singleton asegura que solo hay UNA instancia de DatabaseManager en toda la app.
>
> **Problema sin Singleton**:
> ```javascript
> // archivo1.js
> const db1 = new DatabaseManager();
> db1.query('INSERT INTO Cliente ...');
>
> // archivo2.js
> const db2 = new DatabaseManager();  // ❌ Segunda instancia
> db2.query('SELECT * FROM Cliente');
>
> // Problemas:
> // - Dos conexiones abiertas
> // - db2 no ve los cambios de db1
> // - Bloqueos de archivo
> // - Desperdicio de memoria
> ```
>
> **Solución con Singleton** (`database.js`):
> ```javascript
> // Clase DatabaseManager
> class DatabaseManager {
>   constructor() {
>     this.db = null;
>     this.dbPath = path.join(__dirname, '../gestor_polizas_v2.sqlite');
>   }
>
>   async initialize() {
>     if (this.db) return;  // Ya inicializado
>     // ... código de inicialización
>   }
>
>   query(sql, params = []) {
>     const stmt = this.db.prepare(sql);
>     stmt.bind(params);
>     const rows = [];
>     while (stmt.step()) {
>       rows.push(stmt.getAsObject());
>     }
>     stmt.free();
>     return rows;
>   }
> }
>
> // ✅ Crear UNA SOLA instancia
> const dbManager = new DatabaseManager();
>
> // ✅ Exportar la instancia (NO la clase)
> module.exports = { dbManager };
> ```
>
> **Uso en toda la app**:
> ```javascript
> // poliza_model.js
> const { dbManager } = require('./database');
>
> // cliente_model.js
> const { dbManager } = require('./database');
>
> // recibo_model.js
> const { dbManager } = require('./database');
>
> // Todos usan la MISMA instancia ✅
> ```
>
> **Beneficios**:
> 1. Una sola conexión a BD
> 2. Estado compartido consistente
> 3. Mejor rendimiento
> 4. Evita bloqueos
> 5. Fácil de testear (mock de una instancia)"

**DEMOSTRAR**:
1. Abrir `database.js` líneas finales
2. Mostrar `const dbManager = new DatabaseManager()`
3. Mostrar `module.exports = { dbManager }`
4. Abrir `poliza_model.js` línea 1
5. Mostrar `const { dbManager } = require('./database')`
6. Abrir DevTools → Consola
7. Verificar que todos usan la misma instancia

---

### **4. ¿Cómo funcionan los soft deletes y por qué se usan?**

**RESPUESTA MODELO**:
> "Soft delete es marcar un registro como eliminado sin borrarlo realmente de la BD.
>
> **Implementación**:
> ```sql
> -- Todas las tablas principales tienen:
> activo INTEGER DEFAULT 1
> fecha_eliminacion TEXT
>
> -- Soft delete:
> UPDATE Cliente SET activo = 0, fecha_eliminacion = CURRENT_TIMESTAMP
> WHERE cliente_id = 123;
>
> -- ❌ NO hacer hard delete:
> -- DELETE FROM Cliente WHERE cliente_id = 123;
> ```
>
> **Queries filtran por activo**:
> ```javascript
> // Listar clientes activos
> getAll() {
>   return this.dbManager.query(`
>     SELECT * FROM Cliente
>     WHERE activo = 1
>     ORDER BY nombre
>   `);
> }
>
> // Eliminar (soft delete)
> delete(clienteId) {
>   return this.dbManager.execute(`
>     UPDATE Cliente
>     SET activo = 0, fecha_eliminacion = CURRENT_TIMESTAMP
>     WHERE cliente_id = ?
>   `, [clienteId]);
> }
> ```
>
> **Ventajas**:
> 1. **Recuperación**: Puedes restaurar registros eliminados
> 2. **Auditoría**: Historial completo, nunca pierdes datos
> 3. **Integridad referencial**:
>    - Si eliminas Cliente con Pólizas, las pólizas no quedan huérfanas
>    - Las relaciones se mantienen
> 4. **Reportes históricos**:
>    - "Cuántos clientes teníamos hace 6 meses?"
>    - Incluye los ahora eliminados
> 5. **Cumplimiento legal**: Algunas leyes requieren mantener registros
>
> **Desventajas**:
> - BD crece más (pero SQLite comprime bien)
> - Queries deben filtrar `WHERE activo = 1`
>
> **Ejemplo práctico**:
> ```javascript
> // Usuario elimina cliente por error
> await clienteModel.delete(123);  // activo = 0
>
> // Se da cuenta del error
> // Restaurar (manualmente o con función):
> UPDATE Cliente SET activo = 1, fecha_eliminacion = NULL
> WHERE cliente_id = 123;
>
> // Con hard delete, ¡se perdió para siempre! ❌
> ```

**DEMOSTRAR**:
1. Abrir app → Clientes
2. Eliminar un cliente
3. Abrir DB Browser
4. Mostrar que el cliente sigue ahí con `activo = 0`
5. Query manual: `SELECT * FROM Cliente WHERE activo = 0`
6. Mostrar clientes "eliminados"

---

### **5. ¿Qué es el sistema de auditoría y cómo funciona?**

**RESPUESTA MODELO**:
> "El sistema de auditoría registra todos los cambios en pólizas para tener un historial completo.
>
> **Tabla AuditoriaPoliza**:
> ```sql
> CREATE TABLE AuditoriaPoliza (
>   auditoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
>   poliza_id INTEGER REFERENCES Poliza(poliza_id),
>   usuario_id INTEGER REFERENCES Usuario(usuario_id),
>   accion TEXT,  -- 'CREATE', 'UPDATE', 'DELETE'
>   valores_anteriores TEXT,  -- JSON
>   valores_nuevos TEXT,      -- JSON
>   fecha_cambio TEXT DEFAULT CURRENT_TIMESTAMP
> );
> ```
>
> **Código** (`auditoria_model.js`):
> ```javascript
> class AuditoriaModel {
>   registrarCambio(polizaId, usuarioId, accion, valoresAnteriores, valoresNuevos) {
>     this.dbManager.execute(`
>       INSERT INTO AuditoriaPoliza (
>         poliza_id, usuario_id, accion,
>         valores_anteriores, valores_nuevos
>       ) VALUES (?, ?, ?, ?, ?)
>     `, [
>       polizaId,
>       usuarioId,
>       accion,
>       JSON.stringify(valoresAnteriores),
>       JSON.stringify(valoresNuevos)
>     ]);
>   }
>
>   obtenerHistorial(polizaId) {
>     return this.dbManager.query(`
>       SELECT a.*, u.username
>       FROM AuditoriaPoliza a
>       LEFT JOIN Usuario u ON a.usuario_id = u.usuario_id
>       WHERE a.poliza_id = ?
>       ORDER BY a.fecha_cambio DESC
>     `, [polizaId]);
>   }
> }
> ```
>
> **Uso en poliza_model.js**:
> ```javascript
> update(polizaId, nuevosValores) {
>   // 1. Obtener valores actuales
>   const valoresAnteriores = this.getById(polizaId);
>
>   // 2. Actualizar póliza
>   this.dbManager.execute('UPDATE Poliza SET ... WHERE poliza_id = ?');
>
>   // 3. Registrar cambio en auditoría
>   auditoriaModel.registrarCambio(
>     polizaId,
>     usuarioId,
>     'UPDATE',
>     valoresAnteriores,
>     nuevosValores
>   );
> }
> ```
>
> **Ejemplo de registro**:
> ```json
> {
>   "auditoria_id": 45,
>   "poliza_id": 123,
>   "usuario_id": 1,
>   "username": "admin",
>   "accion": "UPDATE",
>   "valores_anteriores": {
>     "prima_total": 10000,
>     "vigencia_fin": "2025-12-31"
>   },
>   "valores_nuevos": {
>     "prima_total": 12000,
>     "vigencia_fin": "2026-06-30"
>   },
>   "fecha_cambio": "2025-11-24 14:30:45"
> }
> ```
>
> **Utilidad**:
> - "¿Quién cambió esta póliza?"
> - "¿Cuándo se modificó el monto?"
> - "¿Cuál era el valor anterior?"
> - Cumplimiento normativo
> - Resolución de disputas"

**DEMOSTRAR**:
1. Editar una póliza
2. Cambiar prima total de $10,000 a $12,000
3. Guardar
4. Abrir DB Browser
5. Query: `SELECT * FROM AuditoriaPoliza ORDER BY fecha_cambio DESC LIMIT 10`
6. Mostrar registro del cambio
7. Mostrar valores_anteriores y valores_nuevos en JSON

---

### **6. ¿Cómo funcionan las transacciones y por qué son importantes?**

**RESPUESTA MODELO**:
> "Las transacciones aseguran que múltiples operaciones se completen TODAS o NINGUNA.
>
> **Problema sin transacciones**:
> ```javascript
> // Crear póliza
> db.execute('INSERT INTO Poliza ...');  // ✅ Éxito
> const polizaId = result.lastInsertRowid;
>
> // Generar recibos
> db.execute('INSERT INTO Recibo ...');  // ❌ Error (disco lleno)
>
> // Resultado: Póliza sin recibos ❌
> // Estado inconsistente
> ```
>
> **Solución con transacciones** (`poliza_model.js:14-93`):
> ```javascript
> create(polizaData) {
>   try {
>     // 1. Iniciar transacción
>     this.dbManager.execute('BEGIN TRANSACTION');
>
>     // 2. Insertar póliza
>     const result = this.dbManager.execute(
>       'INSERT INTO Poliza (...) VALUES (...)'
>     );
>     const polizaId = result.lastInsertRowid;
>
>     // 3. Generar recibos
>     const recibosGenerados = this._generarRecibos(
>       polizaId, periodicidadId, ...
>     );
>
>     // 4. Si todo OK, confirmar cambios
>     this.dbManager.execute('COMMIT');
>
>     return { poliza_id: polizaId, recibos_generados: recibosGenerados };
>
>   } catch (error) {
>     // 5. Si algo falla, deshacer TODO
>     this.dbManager.execute('ROLLBACK');
>     throw error;
>   }
> }
> ```
>
> **Propiedades ACID**:
> - **Atomicidad**: Todo o nada
> - **Consistencia**: BD siempre en estado válido
> - **Isolation**: Transacciones no interfieren entre sí
> - **Durability**: Cambios confirmados persisten
>
> **Escenarios reales**:
>
> 1. **Crear póliza + recibos**:
> ```
> BEGIN TRANSACTION;
>   INSERT INTO Poliza ...;            -- 1 registro
>   INSERT INTO Recibo ... (12 veces); -- 12 registros
> COMMIT;
>
> Si cualquier INSERT falla → ROLLBACK → 0 registros
> ```
>
> 2. **Editar póliza + regenerar recibos**:
> ```
> BEGIN TRANSACTION;
>   UPDATE Poliza ...;
>   DELETE FROM Recibo WHERE poliza_id = ? AND estado = 'pendiente';
>   INSERT INTO Recibo ... (nueva serie);
> COMMIT;
> ```
>
> 3. **Transferir entre cuentas** (ejemplo genérico):
> ```
> BEGIN TRANSACTION;
>   UPDATE Cuenta SET saldo = saldo - 100 WHERE id = 1;
>   UPDATE Cuenta SET saldo = saldo + 100 WHERE id = 2;
> COMMIT;
>
> Si la segunda falla, la primera se deshace automáticamente
> ```

**DEMOSTRAR**:
1. Crear póliza en la app
2. Abrir `poliza_model.js:14-93`
3. Señalar BEGIN TRANSACTION
4. Señalar INSERT INTO Poliza
5. Señalar _generarRecibos()
6. Señalar COMMIT
7. Señalar try/catch con ROLLBACK
8. Explicar: "Si _generarRecibos falla, se deshace todo"

---

### **7. ¿Qué son las periodicidades y cómo afectan los recibos?**

**RESPUESTA MODELO**:
> "La periodicidad define cada cuánto tiempo el cliente paga la prima del seguro.
>
> **Tabla Periodicidad**:
> ```sql
> CREATE TABLE Periodicidad (
>   periodicidad_id INTEGER PRIMARY KEY,
>   nombre TEXT NOT NULL,
>   meses INTEGER NOT NULL,
>   dias_anticipacion_alerta INTEGER DEFAULT 7
> );
>
> -- Datos:
> INSERT INTO Periodicidad VALUES (1, 'Mensual', 1, 7);
> INSERT INTO Periodicidad VALUES (2, 'Bimestral', 2, 7);
> INSERT INTO Periodicidad VALUES (3, 'Trimestral', 3, 7);
> INSERT INTO Periodicidad VALUES (4, 'Cuatrimestral', 4, 7);
> INSERT INTO Periodicidad VALUES (5, 'Semestral', 6, 7);
> INSERT INTO Periodicidad VALUES (6, 'Anual', 12, 7);
> INSERT INTO Periodicidad VALUES (7, 'Pago Único', 12, 0);
> ```
>
> **Impacto en recibos**:
>
> **Ejemplo 1: Póliza Mensual**
> ```
> Póliza:
> - Prima total: $12,000
> - Vigencia: 1-ene-2025 a 31-dic-2025
> - Periodicidad: Mensual (meses = 1)
>
> Recibos generados: 12
> - Recibo 1: $1,000 (1-ene a 31-ene)
> - Recibo 2: $1,000 (1-feb a 28-feb)
> - Recibo 3: $1,000 (1-mar a 31-mar)
> - ...
> - Recibo 12: $1,000 (1-dic a 31-dic)
> ```
>
> **Ejemplo 2: Póliza Trimestral**
> ```
> Póliza:
> - Prima total: $12,000
> - Vigencia: 1-ene-2025 a 31-dic-2025
> - Periodicidad: Trimestral (meses = 3)
>
> Recibos generados: 4
> - Recibo 1: $3,000 (1-ene a 31-mar)
> - Recibo 2: $3,000 (1-abr a 30-jun)
> - Recibo 3: $3,000 (1-jul a 30-sep)
> - Recibo 4: $3,000 (1-oct a 31-dic)
> ```
>
> **Ejemplo 3: Pago Único**
> ```
> Póliza:
> - Prima total: $12,000
> - Vigencia: 1-ene-2025 a 31-dic-2025
> - Periodicidad: Pago Único (meses = 12)
>
> Recibos generados: 1
> - Recibo 1: $12,000 (1-ene a 31-dic)
> ```
>
> **Algoritmo de cálculo** (`poliza_model.js:215-229`):
> ```javascript
> _buildPeriodos(inicio, fin, mesesPorRecibo) {
>   const periodos = [];
>   let periodStart = new Date(inicio);
>
>   while (periodStart <= fin) {
>     // Calcular fin del periodo
>     const periodEnd = new Date(periodStart);
>     periodEnd.setMonth(periodEnd.getMonth() + mesesPorRecibo);
>     periodEnd.setDate(periodEnd.getDate() - 1);
>
>     if (periodEnd > fin) periodEnd = fin;
>
>     periodos.push({ inicio: periodStart, fin: periodEnd });
>
>     // Siguiente periodo
>     periodStart = new Date(periodEnd);
>     periodStart.setDate(periodStart.getDate() + 1);
>   }
>
>   return periodos;
> }
> ```

**DEMOSTRAR**:
1. Crear póliza con periodicidad Mensual
2. Ver que se generan 12 recibos
3. Crear póliza con periodicidad Anual
4. Ver que se genera 1 recibo
5. Abrir DB Browser
6. Query: `SELECT * FROM Periodicidad`
7. Mostrar columna `meses`

---

## 🎬 DEMOSTRACIÓN EN VIVO (Practica esto)

### **Demo 1: Estructura de la Base de Datos**
```
1. Abrir DB Browser for SQLite
2. File → Open Database → gestor_polizas_v2.sqlite
3. Tab "Database Structure"
4. Señalar tablas principales:
   - Cliente (datos de clientes)
   - Poliza (pólizas de seguro)
   - Recibo (pagos)
5. Señalar catálogos:
   - Aseguradora
   - Ramo
   - Periodicidad
   - MetodoPago
6. Clic derecho en Poliza → "Modify Table"
7. Mostrar campos y tipos de datos
8. Señalar foreign keys (cliente_id, aseguradora_id, etc.)
```

### **Demo 2: Soft Deletes en Acción**
```
1. Abrir app → módulo Clientes
2. Mostrar lista de clientes (5 clientes visibles)
3. Seleccionar un cliente → Eliminar
4. Confirmar eliminación
5. Mostrar que desapareció de la lista
6. Abrir DB Browser
7. Query: SELECT * FROM Cliente WHERE activo = 1
8. Mostrar 4 clientes (el eliminado no aparece)
9. Query: SELECT * FROM Cliente WHERE activo = 0
10. Mostrar el cliente eliminado con fecha_eliminacion
11. Explicar: "El registro sigue ahí, solo está marcado"
```

### **Demo 3: Transacciones con Rollback**
```
1. Abrir código poliza_model.js:14-93
2. Señalar BEGIN TRANSACTION (línea 19)
3. Señalar INSERT INTO Poliza (líneas 21-62)
4. Señalar _generarRecibos() (líneas 65-71)
5. Señalar COMMIT (línea 74)
6. Señalar try/catch (líneas 80-92)
7. Señalar ROLLBACK (línea 83)

Explicar:
"Si el INSERT de póliza funciona pero _generarRecibos falla,
el ROLLBACK deshace todo, incluyendo el INSERT de la póliza.
Esto garantiza que nunca tengamos una póliza sin recibos."
```

---

## ✅ CHECKLIST DE PREPARACIÓN

Antes de la presentación, asegúrate de poder:

- [ ] Explicar por qué SQLite + sql.js
- [ ] Explicar el esquema completo de BD
- [ ] Abrir DB Browser y navegar por las tablas
- [ ] Explicar patrón Singleton en DatabaseManager
- [ ] Demostrar soft deletes en acción
- [ ] Explicar sistema de auditoría
- [ ] Explicar transacciones (BEGIN, COMMIT, ROLLBACK)
- [ ] Explicar periodicidades y su impacto en recibos
- [ ] Mostrar queries SQL reales del código
- [ ] Ejecutar queries manualmente en DB Browser
- [ ] Explicar relaciones entre tablas (1:N, N:1)

---

## 🎯 RESPUESTAS RÁPIDAS (Memoriza)

**P: ¿Por qué SQLite?**
R: App desktop, un archivo, sin servidor, portable, perfecto para single-user

**P: ¿Qué es sql.js?**
R: SQLite compilado a WebAssembly, ejecuta en JavaScript puro

**P: ¿Qué es Singleton?**
R: Una sola instancia de DatabaseManager, compartida en toda la app

**P: ¿Qué son soft deletes?**
R: Marcar activo=0 en lugar de DELETE, mantiene historial

**P: ¿Para qué la auditoría?**
R: Registrar quién, cuándo y qué cambió en pólizas

**P: ¿Para qué transacciones?**
R: Todo o nada, garantiza consistencia (ACID)

**P: ¿Qué son periodicidades?**
R: Frecuencia de pago (mensual, trimestral, etc.), determina cuántos recibos

**P: ¿Cuántas tablas hay?**
R: 12 tablas (Cliente, Poliza, Recibo, Usuario, 4 catálogos, Auditoría, Documento)

---

## 💡 DATOS INTERESANTES DEL PROYECTO

- **Tamaño de BD con seeder**: ~5 MB con 350 pólizas y 3,223 recibos
- **Total de queries SQL en el código**: ~120+
- **Tablas con soft delete**: Cliente, Poliza (no Recibo - se regeneran)
- **Índices creados**: RFCs únicos, números de póliza únicos
- **Catálogos preinstalados**: 45 aseguradoras, 26 ramos, 8 periodicidades

**¡Éxito en tu presentación! 🗄️**
