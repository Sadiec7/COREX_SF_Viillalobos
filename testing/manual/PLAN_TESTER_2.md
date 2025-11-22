# Plan de Testing Manual - TESTER 2
## Sistema de Seguros VILLALOBOS v1.0.0

**Asignado a**: Tester 2
**Módulos**: Pólizas, Recibos, Integraciones
**Duración estimada**: 2-3 horas
**Fecha de testing**: ___________

---

## 📋 OBJETIVO

Probar el ciclo completo de negocio de seguros, validando:
- ✅ Gestión de pólizas (CRUD, validaciones, estados)
- ✅ Gestión de recibos (generación automática, pagos, estados)
- ✅ Relaciones entre entidades (Cliente → Póliza → Recibo)
- ✅ Cálculos automáticos (estados, fechas, montos)
- ✅ Periodicidades y generación de recibos

---

## 🎯 MÓDULOS ASIGNADOS

| Módulo | Prioridad | Casos | Tiempo Estimado |
|--------|-----------|-------|-----------------|
| **Pólizas** | CRÍTICO | 35 casos | 90 min |
| **Recibos** | CRÍTICO | 25 casos | 60 min |
| **Integraciones** | ALTO | 10 casos | 30 min |
| **TOTAL** | - | **70 casos** | **180 min** |

---

## ⚙️ PREPARACIÓN DEL AMBIENTE (15 min)

### 1. Instalación y Login
```
Usuario: admin
Contraseña: admin123
```

### 2. Prerequisitos (ejecutar PRIMERO)
**IMPORTANTE**: Necesitas datos base creados por Tester 1:
- [ ] Al menos 3 clientes creados
- [ ] Catálogos poblados:
  - [ ] 5+ Aseguradoras (QUALITAS, AXA, ZURICH, GNP, MAPFRE)
  - [ ] 5+ Ramos (AUTOS, VIDA, DAÑOS, GMM, AHORRO)

**Si no existen**, créalos tú mismo (10 min):
1. Navegar a Clientes → Crear 3 clientes de prueba
2. Navegar a Catálogos → Crear aseguradoras y ramos

### 3. Preparar herramientas
- [ ] Carpeta screenshots: `Testing_Tester2_[FECHA]`
- [ ] Template de reporte abierto
- [ ] Calculadora (para verificar cálculos)
- [ ] Calendario (para verificar fechas)

---

## 📋 MÓDULO 1: PÓLIZAS (35 casos - 90 min)

### PRIORIDAD CRÍTICA - Creación y Validaciones Básicas

#### TC-POL-001: Crear Póliza Válida (Mensual)
**Objetivo**: Verificar creación exitosa con periodicidad mensual

**Pasos**:
1. Navegar a "Pólizas" → "+ Nueva Póliza"
2. Llenar formulario:
   - Número Póliza: `POL-2025-001`
   - Cliente: Seleccionar cliente existente
   - Aseguradora: `QUALITAS`
   - Ramo: `AUTOS`
   - Tipo: `Nuevo`
   - Fecha Inicio: `01/01/2025`
   - Fecha Fin: `31/12/2025`
   - Prima Neta: `10000`
   - Prima Total: `12000`
   - Periodicidad Pago: `Mensual`
   - Método Pago: `Transferencia`
   - Comisión %: `15`
3. Guardar

**Resultado esperado**:
- ✅ Póliza creada exitosamente
- ✅ Estado: "Vigente"
- ✅ **CRÍTICO**: Sistema genera **12 recibos** automáticamente
- ✅ Cada recibo: Monto = 12000 / 12 = `1000`

**QUÉ CAPTURAR**:
- Screenshot de póliza creada
- Screenshot de recibos generados (debe haber 12)
- **Si NO genera recibos**: 🔴 **REPORTAR BUG CRÍTICO**

---

#### TC-POL-002: Crear Póliza Anual
**Objetivo**: Verificar periodicidad anual

**Pasos**:
1. Nueva Póliza
2. Datos:
   - Número: `POL-2025-002`
   - Cliente: Otro cliente
   - Aseguradora: `AXA`
   - Ramo: `VIDA`
   - Fechas: `01/02/2025` a `31/01/2026`
   - Prima Neta: `24000`
   - Prima Total: `30000`
   - Periodicidad: `Anual`
3. Guardar

**Resultado esperado**:
- ✅ Genera **1 solo recibo** de `30000`

**QUÉ CAPTURAR**:
- Screenshot de recibo generado (1 solo)

---

#### TC-POL-003: Crear Póliza Semestral
**Objetivo**: Verificar periodicidad semestral

**Pasos**:
1. Nueva Póliza
2. Periodicidad: `Semestral`
3. Prima Total: `18000`

**Resultado esperado**:
- ✅ Genera **2 recibos** de `9000` cada uno
- ✅ Fechas espaciadas 6 meses

**QUÉ CAPTURAR**:
- Screenshot de 2 recibos con fechas

---

#### TC-POL-004: Validación Prima Neta > Prima Total
**Objetivo**: CRÍTICO - Verificar validación de montos

**Pasos**:
1. Nueva Póliza
2. Datos:
   - Prima Neta: `15000`
   - Prima Total: `10000` (menor que neta)
3. Intentar guardar

**Resultado esperado**:
- ❌ **ERROR**: "Prima Total no puede ser menor que Prima Neta"
- ❌ NO se guarda

**QUÉ CAPTURAR**:
- Screenshot del error
- **Si PERMITE guardar**: 🔴 **REPORTAR BUG CRÍTICO**

**Razón**: Esto causaría errores en cálculos y recibos

---

#### TC-POL-005: Validación Fecha Fin < Fecha Inicio
**Objetivo**: Verificar validación de fechas

**Pasos**:
1. Nueva Póliza
2. Fecha Inicio: `01/12/2025`
3. Fecha Fin: `01/06/2025` (antes de inicio)
4. Guardar

**Resultado esperado**:
- ❌ Error: "Fecha Fin debe ser posterior a Fecha Inicio"

**QUÉ CAPTURAR**:
- Screenshot del error
- **Si permite guardar**: 🔴 **REPORTAR BUG CRÍTICO**

---

#### TC-POL-006: Número de Póliza Duplicado
**Objetivo**: Verificar unicidad

**Pasos**:
1. Crear póliza con número: `POL-DUPLICADA-001`
2. Intentar crear otra con mismo número

**Resultado esperado**:
- ❌ Error: "Número de póliza ya existe"

**QUÉ CAPTURAR**:
- Screenshot del error
- **Si permite duplicado**: 🔴 **REPORTAR BUG ALTO**

---

#### TC-POL-007: Campos Obligatorios
**Objetivo**: Verificar validación de campos requeridos

**Pasos**:
1. Intentar crear póliza dejando vacíos:
   - Número Póliza (vacío)
   - Cliente (sin seleccionar)
   - Fechas (vacías)
   - Primas (vacías)
2. Para cada uno, intentar guardar

**Resultado esperado**:
- ❌ Error para cada campo obligatorio

**QUÉ CAPTURAR**:
- Screenshots de validaciones

---

#### TC-POL-008: Montos Negativos
**Objetivo**: Verificar validación de montos positivos

**Pasos**:
1. Intentar crear póliza con:
   - Prima Neta: `-5000`
   - Prima Total: `-8000`

**Resultado esperado**:
- ❌ Error: "Montos deben ser positivos"

**QUÉ CAPTURAR**:
- Screenshot del error
- **Si permite negativos**: 🔴 **REPORTAR BUG ALTO**

---

#### TC-POL-009: Montos en Cero
**Objetivo**: Verificar validación de cero

**Pasos**:
1. Prima Neta: `0`
2. Prima Total: `0`
3. Intentar guardar

**Resultado esperado**:
- ❌ Error: "Montos deben ser mayores a 0"
- O permite guardar (dependiendo de lógica de negocio)

**QUÉ CAPTURAR**:
- Comportamiento observado

---

#### TC-POL-010: Comisión Mayor a 100%
**Objetivo**: Verificar validación de comisión

**Pasos**:
1. Comisión %: `150`
2. Guardar

**Resultado esperado**:
- ❌ Error: "Comisión no puede ser mayor a 100%"
- O advertencia

**QUÉ CAPTURAR**:
- Screenshot del error
- **Si permite >100%**: 🟡 **REPORTAR BUG MEDIO**

---

### PRIORIDAD CRÍTICA - Estados de Póliza

#### TC-POL-011: Póliza Vigente (Estado Automático)
**Objetivo**: Verificar cálculo de estado

**Pasos**:
1. Crear póliza con:
   - Fecha Inicio: Hoy
   - Fecha Fin: Hoy + 60 días
2. Ver lista de pólizas

**Resultado esperado**:
- ✅ Estado: "Vigente" (badge verde)

**QUÉ CAPTURAR**:
- Screenshot de póliza con estado Vigente

---

#### TC-POL-012: Póliza Por Vencer
**Objetivo**: Verificar estado "Por Vencer" (< 30 días)

**Pasos**:
1. Crear póliza con:
   - Fecha Inicio: Hoy - 335 días
   - Fecha Fin: Hoy + 20 días
2. Ver estado

**Resultado esperado**:
- ⚠️ Estado: "Por Vencer" (badge amarillo)

**QUÉ CAPTURAR**:
- Screenshot con estado Por Vencer

---

#### TC-POL-013: Póliza Vencida
**Objetivo**: Verificar estado "Vencida"

**Pasos**:
1. Crear póliza con:
   - Fecha Inicio: Hoy - 400 días
   - Fecha Fin: Hoy - 10 días (ya pasó)
2. Ver estado

**Resultado esperado**:
- ❌ Estado: "Vencida" (badge rojo)

**QUÉ CAPTURAR**:
- Screenshot con estado Vencida

---

#### TC-POL-014: Estado en Día Límite (30 días exactos)
**Objetivo**: Verificar edge case de límite

**Pasos**:
1. Póliza que vence en exactamente 30 días
2. Verificar estado

**Resultado esperado**:
- Debe ser "Por Vencer" o "Vigente" (depende de lógica)
- **Documentar** cuál es el comportamiento

**QUÉ CAPTURAR**:
- Screenshot y nota del comportamiento

---

### PRIORIDAD ALTA - Búsqueda y Filtros

#### TC-POL-015: Búsqueda por Número de Póliza
**Objetivo**: Verificar búsqueda

**Prerequisitos**: Varias pólizas creadas

**Pasos**:
1. En módulo Pólizas, buscar: `POL-2025-001`
2. Verificar resultados

**Resultado esperado**:
- ✅ Solo muestra pólizas que contienen ese texto

**QUÉ CAPTURAR**:
- Screenshot de búsqueda

---

#### TC-POL-016: Filtrar por Estado
**Objetivo**: Verificar filtro de estado

**Pasos**:
1. Tener pólizas en diferentes estados
2. Filtrar por "Vigente"
3. Filtrar por "Vencida"
4. Filtrar por "Por Vencer"

**Resultado esperado**:
- ✅ Solo muestra pólizas del estado seleccionado

**QUÉ CAPTURAR**:
- Screenshot de cada filtro

---

#### TC-POL-017: Filtrar por Aseguradora
**Objetivo**: Verificar filtro de aseguradora

**Pasos**:
1. Filtrar por "QUALITAS"
2. Verificar que solo muestra pólizas de QUALITAS

**Resultado esperado**:
- ✅ Filtrado correcto

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-POL-018: Filtros Combinados
**Objetivo**: Verificar múltiples filtros

**Pasos**:
1. Filtrar: Estado="Vigente" Y Aseguradora="AXA" Y Ramo="VIDA"
2. Verificar resultados

**Resultado esperado**:
- ✅ Solo muestra pólizas que cumplen TODOS los criterios

**QUÉ CAPTURAR**:
- Screenshot de filtros combinados

---

### PRIORIDAD ALTA - Edición y Eliminación

#### TC-POL-019: Editar Póliza
**Objetivo**: Verificar edición

**Pasos**:
1. Editar póliza existente
2. Cambiar:
   - Prima Neta de `10000` a `12000`
   - Prima Total de `12000` a `15000`
3. Guardar

**Resultado esperado**:
- ✅ Cambios se guardan
- ⚠️ **VERIFICAR**: ¿Recibos se regeneran o quedan igual?

**QUÉ CAPTURAR**:
- Screenshot ANTES y DESPUÉS
- Screenshot de recibos (¿cambiaron montos?)

---

#### TC-POL-020: Editar Fechas de Póliza
**Objetivo**: Verificar impacto en recibos

**Pasos**:
1. Editar póliza
2. Cambiar Fecha Fin (extender vigencia)
3. Guardar

**Resultado esperado**:
- ⚠️ **Documentar**: ¿Se regeneran recibos? ¿Se mantienen?

**QUÉ CAPTURAR**:
- Comportamiento observado
- Si genera recibos duplicados: 🟡 **REPORTAR BUG**

---

#### TC-POL-021: Eliminar Póliza SIN Recibos
**Objetivo**: Eliminación simple

**Pasos**:
1. Crear póliza de prueba
2. Eliminar ANTES de que genere recibos (si es posible)

**Resultado esperado**:
- ✅ Se elimina correctamente

**QUÉ CAPTURAR**:
- Screenshot de confirmación

---

#### TC-POL-022: Eliminar Póliza CON Recibos
**Objetivo**: CRÍTICO - Verificar eliminación en cascada

**Pasos**:
1. Póliza con recibos generados (Ej: 12 recibos)
2. Eliminar póliza
3. Confirmar eliminación
4. Ir a módulo Recibos

**Resultado esperado**:
- ✅ Póliza eliminada
- ✅ **TODOS** los recibos asociados también eliminados
- ❌ Si quedan recibos huérfanos: 🔴 **REPORTAR BUG CRÍTICO**

**QUÉ CAPTURAR**:
- Screenshot de confirmación
- Screenshot de módulo Recibos (verificar que NO hay recibos de esa póliza)

---

### PRIORIDAD ALTA - Casos Edge

#### TC-POL-023: Póliza con Periodicidad Bimestral
**Objetivo**: Verificar otras periodicidades

**Pasos**:
1. Periodicidad: `Bimestral`
2. Prima Total: `12000`
3. Fechas: 1 año

**Resultado esperado**:
- ✅ Genera **6 recibos** de `2000` c/u

**QUÉ CAPTURAR**:
- Cantidad y montos de recibos

---

#### TC-POL-024: Póliza con Periodicidad Trimestral
**Objetivo**: Verificar trimestral

**Pasos**:
1. Periodicidad: `Trimestral`
2. Prima Total: `20000`

**Resultado esperado**:
- ✅ Genera **4 recibos** de `5000` c/u

**QUÉ CAPTURAR**:
- Screenshot de recibos

---

#### TC-POL-025: Póliza de Muy Corta Duración (15 días)
**Objetivo**: Edge case de duración corta

**Pasos**:
1. Fecha Inicio: Hoy
2. Fecha Fin: Hoy + 15 días
3. Periodicidad: Mensual
4. Guardar

**Resultado esperado**:
- ⚠️ **Documentar**: ¿Genera 1 o 0 recibos?
- ¿Muestra advertencia?

**QUÉ CAPTURAR**:
- Comportamiento observado

---

#### TC-POL-026: Póliza con Prima Total = Prima Neta
**Objetivo**: Edge case de montos iguales

**Pasos**:
1. Prima Neta: `10000`
2. Prima Total: `10000` (iguales)
3. Guardar

**Resultado esperado**:
- ✅ Se permite guardar (sin recargos)

**QUÉ CAPTURAR**:
- Screenshot
- Si NO permite: Documentar

---

#### TC-POL-027: Suma Asegurada Muy Grande
**Objetivo**: Verificar límites

**Pasos**:
1. Suma Asegurada: `999999999999`
2. Guardar

**Resultado esperado**:
- ✅ Se guarda (o muestra advertencia si excede límite)

**QUÉ CAPTURAR**:
- Comportamiento

---

#### TC-POL-028: Domiciliada y Renovación Automática
**Objetivo**: Verificar checkboxes

**Pasos**:
1. Marcar "Domiciliada": ✓
2. Marcar "Renovación Automática": ✓
3. Guardar
4. Verificar que se guardaron

**Resultado esperado**:
- ✅ Opciones se guardan correctamente

**QUÉ CAPTURAR**:
- Screenshot con opciones marcadas

---

#### TC-POL-029: Notas con Máximo de Caracteres
**Objetivo**: Verificar límite (1000 chars)

**Pasos**:
1. En Notas, pegar texto de 1200 caracteres
2. Intentar guardar

**Resultado esperado**:
- ❌ Error: "Notas no pueden exceder 1000 caracteres"
- O limita automáticamente

**QUÉ CAPTURAR**:
- Screenshot del error

---

#### TC-POL-030: Crear 10 Pólizas Rápidamente
**Objetivo**: Verificar performance

**Pasos**:
1. Crear 10 pólizas seguidas (usar datos variados)
2. Observar rendimiento

**Resultado esperado**:
- ✅ Todas se crean sin errores
- ✅ Recibos se generan para cada una
- ✅ No se congela

**QUÉ CAPTURAR**:
- Screenshot de lista con 10 pólizas
- Si falla: 🔴 **REPORTAR BUG**

---

#### TC-POL-031: Ver Estadísticas
**Objetivo**: Verificar contadores

**Pasos**:
1. Ver panel de estadísticas en Pólizas
2. Verificar:
   - Total pólizas
   - Desglose por estado

**Resultado esperado**:
- ✅ Números correctos

**QUÉ CAPTURAR**:
- Screenshot de estadísticas
- Si NO coinciden: 🔴 **REPORTAR BUG ALTO**

---

#### TC-POL-032: Póliza con Cliente Eliminado (si aplica)
**Objetivo**: Verificar integridad referencial

**Pasos**:
1. Si es posible eliminar cliente con pólizas:
   - Crear cliente temporal
   - Crear póliza asociada
   - Eliminar cliente
2. Ver qué pasa con póliza

**Resultado esperado**:
- ❌ NO debe permitir eliminar cliente con pólizas
- O elimina en cascada (documentar)

**QUÉ CAPTURAR**:
- Comportamiento observado

---

#### TC-POL-033: Ver Detalles de Póliza
**Objetivo**: Verificar vista detallada

**Pasos**:
1. Click en póliza para ver detalles
2. Verificar que muestra:
   - Todos los campos
   - Recibos asociados
   - Documentos (si hay)

**Resultado esperado**:
- ✅ Vista completa y legible

**QUÉ CAPTURAR**:
- Screenshot de detalles

---

#### TC-POL-034: Navegar desde Póliza a Recibos
**Objetivo**: Verificar navegación integrada

**Pasos**:
1. En detalles de póliza, buscar botón/link "Ver Recibos"
2. Click
3. Verificar que filtra recibos de esa póliza

**Resultado esperado**:
- ✅ Navega a módulo Recibos con filtro aplicado

**QUÉ CAPTURAR**:
- Screenshot de recibos filtrados

---

#### TC-POL-035: Actualización de Lista Después de Crear
**Objetivo**: Verificar refresh automático

**Pasos**:
1. Ver lista de pólizas
2. Crear nueva póliza
3. Verificar lista inmediatamente

**Resultado esperado**:
- ✅ Nueva póliza aparece sin refrescar página

**QUÉ CAPTURAR**:
- Screenshot de lista actualizada

---

## 💰 MÓDULO 2: RECIBOS (25 casos - 60 min)

### PRIORIDAD CRÍTICA - Generación Automática

#### TC-REC-001: Recibos Generados Automáticamente (Mensual)
**Objetivo**: CRÍTICO - Verificar generación desde póliza

**Prerequisitos**: Póliza mensual creada (TC-POL-001)

**Pasos**:
1. Navegar a "Recibos"
2. Buscar/filtrar recibos de póliza `POL-2025-001`
3. Contar cantidad

**Resultado esperado**:
- ✅ Debe haber **12 recibos**
- ✅ Montos: `1000` cada uno
- ✅ Fechas: Espaciadas mensualmente

**QUÉ CAPTURAR**:
- Screenshot de lista de recibos (12)
- Screenshot de fechas de cada recibo
- **Si NO hay 12**: 🔴 **REPORTAR BUG CRÍTICO**

---

#### TC-REC-002: Verificar Cálculo de Montos
**Objetivo**: Validar división de prima

**Pasos**:
1. Póliza: Prima Total = `12000`, Periodicidad = Mensual (12 recibos)
2. Verificar monto de cada recibo

**Resultado esperado**:
- ✅ Cada recibo: `12000 / 12 = 1000`

**QUÉ CAPTURAR**:
- Screenshot con montos

---

#### TC-REC-003: Recibos con División No Exacta
**Objetivo**: Verificar redondeo

**Pasos**:
1. Póliza: Prima Total = `10000`, Periodicidad = Trimestral (4 recibos)
2. 10000 / 4 = 2500 (exacto)
3. Otra póliza: Prima = `10001`, Trimestral
4. 10001 / 4 = 2500.25 (decimal)

**Resultado esperado**:
- ⚠️ Manejo correcto de decimales
- ⚠️ Redondeo a 2 decimales

**QUÉ CAPTURAR**:
- Screenshot de montos
- Si suma NO da total: 🟡 **REPORTAR BUG**

---

#### TC-REC-004: Fechas de Recibos Correctas
**Objetivo**: Verificar espaciado de fechas

**Pasos**:
1. Póliza mensual: 01/01/2025 a 31/12/2025
2. Verificar fecha_inicio_periodo y fecha_fin_periodo de cada recibo

**Resultado esperado**:
- Recibo 1: 01/01 - 31/01
- Recibo 2: 01/02 - 28/02
- Recibo 3: 01/03 - 31/03
- ... (y así sucesivamente)

**QUÉ CAPTURAR**:
- Screenshot de primeros 3 recibos con fechas

---

### PRIORIDAD CRÍTICA - Estados y Pagos

#### TC-REC-005: Marcar Recibo como Pagado
**Objetivo**: Cambiar estado a "Pagado"

**Pasos**:
1. Seleccionar recibo con estado "Pendiente"
2. Click en botón "Marcar como Pagado"
3. Confirmar (si hay diálogo)
4. Verificar cambios

**Resultado esperado**:
- ✅ Estado cambia a "Pagado" (badge verde)
- ✅ Fecha Pago se setea a HOY
- ✅ Estadísticas se actualizan

**QUÉ CAPTURAR**:
- Screenshot ANTES (Pendiente)
- Screenshot DESPUÉS (Pagado con fecha)

---

#### TC-REC-006: Marcar Recibo como Pendiente (Revertir Pago)
**Objetivo**: Revertir estado

**Pasos**:
1. Recibo en estado "Pagado"
2. Click en "Marcar como Pendiente"
3. Confirmar

**Resultado esperado**:
- ✅ Estado cambia a "Pendiente"
- ✅ Fecha Pago se borra (NULL)

**QUÉ CAPTURAR**:
- Screenshot de cambio

---

#### TC-REC-007: Estado "Vencido" Automático
**Objetivo**: Verificar cálculo de vencimiento

**Pasos**:
1. Recibo con fecha_corte en el pasado (Ej: hace 5 días)
2. Verificar estado

**Resultado esperado**:
- ❌ Estado: "Vencido" (badge rojo)

**QUÉ CAPTURAR**:
- Screenshot de recibo vencido

---

#### TC-REC-008: Recibo Pagado NO Puede Vencer
**Objetivo**: Verificar lógica de estados

**Pasos**:
1. Marcar recibo como pagado (fecha_corte ya pasó)
2. Verificar estado

**Resultado esperado**:
- ✅ Debe ser "Pagado", NO "Vencido"

**QUÉ CAPTURAR**:
- Screenshot

---

### PRIORIDAD ALTA - CRUD de Recibos

#### TC-REC-009: Crear Recibo Manual
**Objetivo**: Verificar creación manual (no auto-generado)

**Pasos**:
1. Navegar a Recibos → "+ Nuevo Recibo"
2. Llenar:
   - Póliza: Seleccionar existente
   - Número Recibo: `REC-MANUAL-001`
   - Fecha Inicio Período: `01/03/2025`
   - Fecha Fin Período: `31/03/2025`
   - Monto: `1500`
   - Fecha Corte: `10/04/2025`
3. Guardar

**Resultado esperado**:
- ✅ Recibo manual creado
- ✅ Aparece en lista

**QUÉ CAPTURAR**:
- Screenshot de recibo manual

---

#### TC-REC-010: Editar Recibo
**Objetivo**: Modificar datos

**Pasos**:
1. Editar recibo existente
2. Cambiar Monto de `1000` a `1200`
3. Guardar

**Resultado esperado**:
- ✅ Cambios se guardan

**QUÉ CAPTURAR**:
- Screenshot ANTES/DESPUÉS

---

#### TC-REC-011: Eliminar Recibo
**Objetivo**: Eliminación individual

**Pasos**:
1. Eliminar recibo creado manualmente
2. Confirmar

**Resultado esperado**:
- ✅ Recibo eliminado

**QUÉ CAPTURAR**:
- Screenshot de confirmación

---

#### TC-REC-012: Validación Fecha Fin < Fecha Inicio
**Objetivo**: Verificar validación de fechas

**Pasos**:
1. Crear/editar recibo
2. Fecha Inicio: `01/05/2025`
3. Fecha Fin: `01/04/2025` (anterior)
4. Guardar

**Resultado esperado**:
- ❌ Error: "Fecha Fin debe ser posterior a Fecha Inicio"

**QUÉ CAPTURAR**:
- Screenshot del error

---

#### TC-REC-013: Monto Negativo o Cero
**Objetivo**: Verificar validación

**Pasos**:
1. Monto: `-500` → Guardar
2. Monto: `0` → Guardar

**Resultado esperado**:
- ❌ Error para ambos casos

**QUÉ CAPTURAR**:
- Screenshots de errores

---

### PRIORIDAD ALTA - Búsqueda y Filtros

#### TC-REC-014: Búsqueda por Número de Recibo
**Objetivo**: Verificar búsqueda

**Pasos**:
1. Buscar: `REC-MANUAL-001`

**Resultado esperado**:
- ✅ Solo muestra ese recibo

**QUÉ CAPTURAR**:
- Screenshot de búsqueda

---

#### TC-REC-015: Búsqueda por Número de Póliza
**Objetivo**: Búsqueda cruzada

**Pasos**:
1. Buscar: `POL-2025-001`

**Resultado esperado**:
- ✅ Muestra todos los recibos de esa póliza

**QUÉ CAPTURAR**:
- Screenshot de resultados

---

#### TC-REC-016: Búsqueda por Cliente
**Objetivo**: Búsqueda por nombre de cliente

**Pasos**:
1. Buscar nombre de cliente (Ej: "Juan")

**Resultado esperado**:
- ✅ Muestra recibos de pólizas de ese cliente

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-REC-017: Filtrar por Estado (Pendiente)
**Objetivo**: Filtro de estado

**Pasos**:
1. Filtrar por "Pendiente"

**Resultado esperado**:
- ✅ Solo muestra pendientes

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-REC-018: Filtrar por Estado (Pagado)
**Objetivo**: Filtro de pagados

**Pasos**:
1. Filtrar por "Pagado"

**Resultado esperado**:
- ✅ Solo muestra pagados

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-REC-019: Filtrar por Estado (Vencido)
**Objetivo**: Filtro de vencidos

**Pasos**:
1. Filtrar por "Vencido"

**Resultado esperado**:
- ✅ Solo muestra vencidos

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-REC-020: Estadísticas de Recibos
**Objetivo**: Verificar contadores

**Pasos**:
1. Ver panel de estadísticas
2. Verificar:
   - Total recibos
   - Pendientes
   - Pagados
   - Vencidos

**Resultado esperado**:
- ✅ Números correctos (sumar manualmente para verificar)

**QUÉ CAPTURAR**:
- Screenshot de estadísticas
- Si NO coinciden: 🔴 **REPORTAR BUG ALTO**

---

### PRIORIDAD MEDIA - Casos Edge

#### TC-REC-021: Número de Fracción
**Objetivo**: Verificar campo número de fracción

**Pasos**:
1. Verificar que recibos auto-generados tengan:
   - Fracción 1/12, 2/12, ..., 12/12

**Resultado esperado**:
- ✅ Numeración correcta

**QUÉ CAPTURAR**:
- Screenshot de fracciones

---

#### TC-REC-022: Días de Gracia
**Objetivo**: Verificar campo opcional

**Pasos**:
1. Crear/editar recibo
2. Días Gracia: `5`
3. Guardar

**Resultado esperado**:
- ✅ Se guarda (campo opcional)

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-REC-023: Recibo con Monto Muy Grande
**Objetivo**: Verificar límites

**Pasos**:
1. Monto: `9999999999.99`
2. Guardar

**Resultado esperado**:
- ✅ Se guarda correctamente
- ✅ Formato de moneda correcto

**QUÉ CAPTURAR**:
- Screenshot del monto

---

#### TC-REC-024: Performance con 100+ Recibos
**Objetivo**: Verificar rendimiento

**Pasos**:
1. Crear varias pólizas mensuales (para generar muchos recibos)
2. Ir a módulo Recibos
3. Observar tiempo de carga

**Resultado esperado**:
- ✅ Se carga en < 3 segundos

**QUÉ CAPTURAR**:
- Tiempo aproximado
- Si se congela: 🔴 **REPORTAR BUG ALTO**

---

#### TC-REC-025: Navegación Recibo → Póliza
**Objetivo**: Verificar link de vuelta

**Pasos**:
1. En detalles de recibo, buscar link/botón a póliza
2. Click
3. Verificar que navega a detalles de póliza

**Resultado esperado**:
- ✅ Navegación funciona

**QUÉ CAPTURAR**:
- Screenshot

---

## 🔄 MÓDULO 3: INTEGRACIONES (10 casos - 30 min)

### Flujos Completos End-to-End

#### TC-INT-001: Flujo Completo Cliente → Póliza → Recibos → Pago
**Objetivo**: CRÍTICO - Verificar ciclo completo

**Pasos**:
1. Crear cliente nuevo: "Cliente Integración Test"
2. Crear póliza para ese cliente (Mensual, 12000)
3. Verificar que se generan 12 recibos
4. Marcar primer recibo como pagado
5. Verificar que estadísticas se actualizan
6. Ir a Dashboard → Verificar métricas

**Resultado esperado**:
- ✅ Todo el flujo funciona sin errores
- ✅ Datos consistentes en todos los módulos

**QUÉ CAPTURAR**:
- Screenshots de cada paso
- Tabla resumen de verificación:

| Módulo | Verificación | ✓ |
|--------|--------------|---|
| Cliente | Creado | ✅ |
| Póliza | Creada | ✅ |
| Recibos | 12 generados | ✅ |
| Recibo | Marcado como pagado | ✅ |
| Dashboard | Métricas correctas | ✅ |

---

#### TC-INT-002: Eliminar Cliente con Pólizas
**Objetivo**: CRÍTICO - Verificar protección de datos

**Pasos**:
1. Cliente con 1+ pólizas
2. Intentar eliminar cliente

**Resultado esperado**:
- ❌ **NO debe permitir** eliminar
- ❌ Error: "No se puede eliminar, tiene pólizas asociadas"

**QUÉ CAPTURAR**:
- Screenshot del error
- **Si PERMITE eliminar**: 🔴 **REPORTAR BUG CRÍTICO** (datos huérfanos)

---

#### TC-INT-003: Eliminar Póliza con Recibos
**Objetivo**: Ya probado en TC-POL-022, re-verificar

**Resultado esperado**:
- ✅ Elimina póliza Y recibos

**QUÉ CAPTURAR**:
- Confirmación

---

#### TC-INT-004: Estadísticas Globales (Dashboard)
**Objetivo**: Verificar precisión total

**Pasos**:
1. Contar manualmente:
   - Clientes (módulo Clientes)
   - Pólizas (módulo Pólizas)
   - Recibos Pendientes (módulo Recibos)
2. Comparar con Dashboard

**Resultado esperado**:
- ✅ **100% de precisión** en todos los números

**QUÉ CAPTURAR**:
- Tabla comparativa:

| Métrica | Dashboard | Real | ✓ |
|---------|-----------|------|---|
| Clientes | 8 | 8 | ✅ |
| Pólizas | 15 | 15 | ✅ |
| Vigentes | 10 | 10 | ✅ |
| Por Vencer | 3 | 3 | ✅ |
| Vencidas | 2 | 2 | ✅ |
| Rec. Pendientes | 45 | 45 | ✅ |

- **Si NO coinciden**: 🔴 **REPORTAR BUG ALTO**

---

#### TC-INT-005: Crear Póliza desde Cliente
**Objetivo**: Verificar context passing

**Pasos**:
1. Abrir detalles de cliente
2. Si hay botón "+ Nueva Póliza" en vista de cliente
3. Click
4. Verificar que campo Cliente ya viene pre-seleccionado

**Resultado esperado**:
- ✅ Cliente pre-cargado en formulario

**QUÉ CAPTURAR**:
- Screenshot de formulario con cliente pre-seleccionado

---

#### TC-INT-006: Ver Pólizas de un Cliente
**Objetivo**: Verificar vista relacional

**Pasos**:
1. Abrir detalles de cliente
2. Buscar sección "Pólizas" o pestaña
3. Verificar que muestra pólizas de ese cliente

**Resultado esperado**:
- ✅ Solo muestra pólizas del cliente actual

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-INT-007: Filtrar Pólizas por Cliente
**Objetivo**: Filtro cruzado

**Pasos**:
1. En módulo Pólizas, filtrar por cliente específico

**Resultado esperado**:
- ✅ Solo muestra pólizas de ese cliente

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-INT-008: Buscar Recibo por Nombre de Cliente
**Objetivo**: Búsqueda transversal

**Pasos**:
1. En módulo Recibos, buscar nombre de cliente

**Resultado esperado**:
- ✅ Muestra recibos de pólizas de ese cliente

**QUÉ CAPTURAR**:
- Screenshot

---

#### TC-INT-009: Actualización en Tiempo Real
**Objetivo**: Verificar sincronización

**Pasos**:
1. Abrir Dashboard
2. En otra ventana/pestaña, crear nueva póliza
3. Volver a Dashboard

**Resultado esperado**:
- ⚠️ Ideal: Se actualiza automáticamente
- ⚠️ Mínimo: Se actualiza al refrescar (F5)

**QUÉ CAPTURAR**:
- Comportamiento observado

---

#### TC-INT-010: Consistencia Después de Múltiples Operaciones
**Objetivo**: Stress test de integridad

**Pasos**:
1. Crear 5 clientes
2. Crear 10 pólizas (variadas)
3. Marcar 15 recibos como pagados
4. Eliminar 2 pólizas
5. Verificar que:
   - Dashboard muestra números correctos
   - No hay recibos huérfanos
   - No hay errores en consola

**Resultado esperado**:
- ✅ Todo consistente

**QUÉ CAPTURAR**:
- Screenshot final de Dashboard
- Notas de cualquier inconsistencia

---

## 📋 CHECKLIST FINAL

- [ ] **70 casos ejecutados**
- [ ] **Screenshots capturados** (mínimo 50)
- [ ] **Bugs reportados** con template
- [ ] **Cálculos verificados** (montos, fechas, estados)
- [ ] **Integraciones probadas**
- [ ] **Performance documentada**

---

## 📊 RESUMEN DE TESTING - TESTER 2

```
Fecha: ___________
Hora inicio: ___________
Hora fin: ___________

CASOS EJECUTADOS:
- Pólizas: ___/35
- Recibos: ___/25
- Integraciones: ___/10
- TOTAL: ___/70

BUGS ENCONTRADOS:
- Críticos: ___
- Altos: ___
- Medios: ___
- Bajos: ___

BUGS CRÍTICOS (Detalle):
1. ___________________
2. ___________________

OBSERVACIONES:
_______________________
_______________________
```

---

**Fin del Plan - Tester 2**