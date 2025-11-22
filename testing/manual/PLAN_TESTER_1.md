# Plan de Testing Manual - TESTER 1
## Sistema de Seguros VILLALOBOS v1.0.0

**Asignado a**: Tester 1
**Módulos**: Clientes, Documentos, Catálogos, Dashboard
**Duración estimada**: 2-3 horas
**Fecha de testing**: ___________

---

## 📋 OBJETIVO

Probar exhaustivamente los módulos de gestión de entidades base del sistema, validando:
- ✅ Creación, lectura, actualización y eliminación de datos
- ✅ Validaciones de campos y formatos
- ✅ Búsquedas y filtros
- ✅ Manejo de documentos
- ✅ Integridad de datos
- ✅ Experiencia de usuario

---

## 🎯 MÓDULOS ASIGNADOS

| Módulo | Prioridad | Casos | Tiempo Estimado |
|--------|-----------|-------|-----------------|
| **Clientes** | CRÍTICO | 25 casos | 70 min |
| **Documentos** | ALTO | 12 casos | 30 min |
| **Catálogos** | ALTO | 10 casos | 25 min |
| **Dashboard** | MEDIO | 8 casos | 15 min |
| **TOTAL** | - | **55 casos** | **140 min** |

---

## ⚙️ PREPARACIÓN DEL AMBIENTE (15 min)

### 1. Instalación
```
1. Descargar: Sistema de Seguros VILLALOBOS Setup 1.0.0.exe
2. Ejecutar instalador
3. Seguir asistente de instalación
4. Iniciar aplicación
```

### 2. Login
```
Usuario: admin
Contraseña: admin123
```

### 3. Verificación inicial
- [ ] La aplicación se abre correctamente
- [ ] El dashboard muestra datos iniciales (0 clientes, 0 pólizas)
- [ ] La navegación lateral es visible
- [ ] Todos los módulos son accesibles

### 4. Preparar herramientas
- [ ] Carpeta para screenshots: `Testing_Tester1_[FECHA]`
- [ ] Abrir template de reporte de bugs
- [ ] Tener archivos de prueba listos (ver DATOS_PRUEBA.md)

---

## 📊 MÓDULO 1: CLIENTES (25 casos - 70 min)

### PRIORIDAD CRÍTICA

#### TC-CLI-001: Crear Cliente Válido (Persona Física)
**Objetivo**: Verificar creación exitosa de cliente persona física

**Pasos**:
1. Click en "Clientes" en navegación
2. Click en botón "+ Nuevo Cliente"
3. Llenar formulario:
   - RFC: `GOMJ850315HDF`
   - Nombre: `Juan Gómez Martínez`
   - Tipo Persona: Seleccionar "Física"
   - Email: `juan.gomez@example.com`
   - Teléfono: `5512345678`
   - Celular: `5523456789`
   - Dirección: `Av. Insurgentes 123, Col. Roma, CDMX`
   - Notas: `Cliente nuevo, contacto por recomendación`
4. Click en "Guardar"

**Resultado esperado**:
- ✅ Mensaje de éxito: "Cliente creado exitosamente"
- ✅ Modal se cierra
- ✅ Cliente aparece en la lista
- ✅ Datos se muestran correctamente

**QUÉ CAPTURAR**:
- Screenshot del cliente en la lista
- Screenshot de los detalles del cliente creado

**Datos a verificar**:
- ✅ RFC exacto: `GOMJ850315HDF`
- ✅ Nombre completo visible
- ✅ Tipo: "Física"
- ✅ Email y teléfonos correctos

---

#### TC-CLI-002: Crear Cliente Válido (Persona Moral)
**Objetivo**: Verificar creación exitosa de cliente persona moral

**Pasos**:
1. Click en "+ Nuevo Cliente"
2. Llenar formulario:
   - RFC: `VIL950228ABC`
   - Nombre: `Villalobos Seguros y Fianzas S.A. de C.V.`
   - Tipo Persona: Seleccionar "Moral"
   - Email: `contacto@villalobos.com`
   - Teléfono: `5567890123`
   - Dirección: `Blvd. Manuel Ávila Camacho 36, Lomas de Chapultepec`
3. Click en "Guardar"

**Resultado esperado**:
- ✅ Cliente moral creado correctamente
- ✅ Aparece en lista con tipo "Moral"

**QUÉ CAPTURAR**:
- Screenshot del cliente moral en la lista

---

#### TC-CLI-003: RFC Duplicado
**Objetivo**: Validar que no se permitan RFCs duplicados

**Pasos**:
1. Intentar crear nuevo cliente con RFC: `GOMJ850315HDF` (ya existe)
2. Llenar otros campos válidos
3. Click en "Guardar"

**Resultado esperado**:
- ❌ **ERROR**: "El RFC ya está registrado"
- ❌ Modal NO se cierra
- ❌ Cliente NO se guarda

**QUÉ CAPTURAR**:
- Screenshot del mensaje de error
- Si NO muestra error: **REPORTAR BUG CRÍTICO**

**SEVERIDAD SI FALLA**: 🔴 CRÍTICO

---

#### TC-CLI-004: RFC Inválido
**Objetivo**: Validar formato de RFC

**Pasos**:
1. Intentar crear cliente con RFCs inválidos:
   - `12345` (muy corto)
   - `ABCD` (sin números)
   - `GOMJ850315` (sin homoclave)
   - `GOMJ850315@@@` (caracteres especiales)
2. Para cada uno, click en "Guardar"

**Resultado esperado**:
- ❌ Mensaje de error: "RFC inválido"
- ❌ No se guarda

**QUÉ CAPTURAR**:
- Screenshot de cada intento fallido
- Si PERMITE guardar: **REPORTAR BUG ALTO**

---

#### TC-CLI-005: Email Inválido
**Objetivo**: Validar formato de email

**Pasos**:
1. Crear cliente con emails inválidos:
   - `correo` (sin @)
   - `correo@` (sin dominio)
   - `@dominio.com` (sin usuario)
   - `correo @dominio.com` (con espacio)
2. Intentar guardar cada uno

**Resultado esperado**:
- ❌ Error de validación
- ❌ No se guarda

**QUÉ CAPTURAR**:
- Screenshot de error de validación
- Si permite guardar: **REPORTAR BUG MEDIO**

---

#### TC-CLI-006: Teléfono Inválido
**Objetivo**: Validar formato de teléfono (10 dígitos)

**Pasos**:
1. Crear cliente con teléfonos inválidos:
   - `123` (menos de 10 dígitos)
   - `12345678901234` (más de 10 dígitos)
   - `abcdefghij` (letras)
   - `55-1234-5678` (con guiones)
2. Intentar guardar

**Resultado esperado**:
- ❌ Error: "Teléfono debe tener 10 dígitos"
- ❌ No se guarda

**QUÉ CAPTURAR**:
- Screenshot del error
- Si permite guardar: **REPORTAR BUG MEDIO**

---

#### TC-CLI-007: Campos Vacíos (Validación Requeridos)
**Objetivo**: Verificar validación de campos obligatorios

**Pasos**:
1. Click en "+ Nuevo Cliente"
2. Dejar RFC vacío, intentar guardar
3. Llenar RFC, dejar Nombre vacío, intentar guardar
4. Llenar RFC y Nombre, NO seleccionar Tipo Persona, intentar guardar

**Resultado esperado**:
- ❌ Error para cada campo requerido
- ❌ No se guarda hasta llenar todos

**QUÉ CAPTURAR**:
- Screenshot de cada validación
- Si permite guardar sin datos: **REPORTAR BUG CRÍTICO**

---

#### TC-CLI-008: Búsqueda por Nombre
**Objetivo**: Verificar búsqueda funciona correctamente

**Prerequisitos**: Tener al menos 3 clientes creados

**Pasos**:
1. En módulo Clientes, ubicar barra de búsqueda
2. Escribir "Juan"
3. Observar resultados

**Resultado esperado**:
- ✅ Se filtran clientes que contienen "Juan"
- ✅ Otros clientes desaparecen
- ✅ Búsqueda es en tiempo real (sin necesidad de Enter)

**QUÉ CAPTURAR**:
- Screenshot de búsqueda con resultados filtrados

---

#### TC-CLI-009: Búsqueda por RFC
**Objetivo**: Verificar búsqueda por RFC

**Pasos**:
1. En búsqueda, escribir "GOMJ"
2. Observar que muestra cliente con RFC que contiene esas letras

**Resultado esperado**:
- ✅ Filtra correctamente por RFC

**QUÉ CAPTURAR**:
- Screenshot de búsqueda por RFC

---

#### TC-CLI-010: Búsqueda Sin Resultados
**Objetivo**: Verificar comportamiento cuando no hay coincidencias

**Pasos**:
1. Buscar: "XXXXXXXX" (texto que no existe)
2. Observar mensaje

**Resultado esperado**:
- ✅ Mensaje: "No se encontraron clientes" o similar
- ✅ Lista vacía
- ✅ NO se muestra error de sistema

**QUÉ CAPTURAR**:
- Screenshot del mensaje

---

#### TC-CLI-011: Búsqueda con Caracteres Especiales
**Objetivo**: Verificar que caracteres especiales no rompen la búsqueda

**Pasos**:
1. Buscar: `José & Cía.`
2. Buscar: `<script>alert()</script>` (prueba XSS)
3. Buscar: `' OR '1'='1` (prueba SQL injection)

**Resultado esperado**:
- ✅ Sistema busca normalmente (o no encuentra resultados)
- ✅ NO muestra errores
- ✅ NO ejecuta scripts

**QUÉ CAPTURAR**:
- Screenshot de cada búsqueda
- Si muestra error de sistema: **REPORTAR BUG ALTO**
- Si ejecuta script: **REPORTAR BUG CRÍTICO**

---

#### TC-CLI-012: Editar Cliente
**Objetivo**: Verificar edición de datos

**Pasos**:
1. Seleccionar cliente "Juan Gómez Martínez"
2. Click en botón "Editar" o ícono de editar
3. Modificar:
   - Email: `juan.nuevo@example.com`
   - Notas: `Cliente actualizado - nuevo email`
4. Click en "Guardar"

**Resultado esperado**:
- ✅ Mensaje de éxito
- ✅ Cambios se reflejan en la lista
- ✅ Al abrir detalles, muestra datos actualizados

**QUÉ CAPTURAR**:
- Screenshot ANTES de editar
- Screenshot DESPUÉS de editar

---

#### TC-CLI-013: Editar RFC (No Debe Permitir)
**Objetivo**: Verificar que RFC NO se puede editar

**Pasos**:
1. Editar un cliente existente
2. Intentar cambiar el RFC
3. Intentar guardar

**Resultado esperado**:
- ❌ Campo RFC debe estar **deshabilitado** o **readonly**
- ❌ O mostrar advertencia al intentar cambiar

**QUÉ CAPTURAR**:
- Screenshot del formulario de edición
- Si PERMITE editar RFC: **REPORTAR BUG MEDIO**

**Razón**: El RFC es único e identificador, no debe cambiar

---

#### TC-CLI-014: Eliminar Cliente Sin Datos Relacionados
**Objetivo**: Verificar eliminación simple

**Prerequisitos**: Cliente SIN pólizas ni documentos

**Pasos**:
1. Crear cliente temporal: RFC `TEMP123456ABC`, Nombre `Cliente Temporal`
2. Click en botón "Eliminar"
3. Confirmar en diálogo

**Resultado esperado**:
- ✅ Diálogo de confirmación aparece
- ✅ Mensaje: "¿Está seguro de eliminar este cliente?"
- ✅ Al confirmar, cliente desaparece de la lista
- ✅ Mensaje de éxito

**QUÉ CAPTURAR**:
- Screenshot del diálogo de confirmación
- Screenshot de lista sin el cliente

---

#### TC-CLI-015: Cancelar Eliminación
**Objetivo**: Verificar que cancelar NO elimina

**Pasos**:
1. Seleccionar cliente existente
2. Click en "Eliminar"
3. En diálogo, click en "Cancelar"

**Resultado esperado**:
- ✅ Diálogo se cierra
- ✅ Cliente **permanece** en la lista

**QUÉ CAPTURAR**:
- Screenshot mostrando que cliente sigue ahí

---

#### TC-CLI-016: Cliente con Nombre Muy Largo
**Objetivo**: Verificar manejo de nombres largos

**Pasos**:
1. Crear cliente con nombre de 200+ caracteres:
   ```
   Juan Alberto Francisco José María González Pérez Ramírez Sánchez López Martínez Rodríguez Fernández García Hernández Díaz Moreno Jiménez Álvarez Romero Gómez Torres
   ```
2. Guardar

**Resultado esperado**:
- ✅ Se guarda correctamente
- ✅ En lista, nombre se trunca con "..." si es muy largo
- ✅ Al ver detalles, muestra nombre completo

**QUÉ CAPTURAR**:
- Screenshot de lista (truncado)
- Screenshot de detalles (completo)
- Si NO se muestra bien: **REPORTAR BUG MEDIO**

---

#### TC-CLI-017: Cliente con Caracteres Especiales
**Objetivo**: Verificar soporte de acentos y caracteres especiales

**Pasos**:
1. Crear cliente:
   - Nombre: `José Ramón O'Brien & Cía. S.A.`
   - Dirección: `Calle 16 de Septiembre #123, 1er Piso`
2. Guardar y verificar

**Resultado esperado**:
- ✅ Se guarda correctamente
- ✅ Acentos y símbolos se muestran bien
- ✅ NO hay corrupción de caracteres

**QUÉ CAPTURAR**:
- Screenshot del cliente creado
- Si caracteres se corrompen: **REPORTAR BUG MEDIO**

---

#### TC-CLI-018: Notas con Máximo de Caracteres
**Objetivo**: Verificar límite de campo Notas (500 chars)

**Pasos**:
1. Crear/editar cliente
2. En campo Notas, pegar texto de 600 caracteres
3. Intentar guardar

**Resultado esperado**:
- ❌ Error: "Notas no pueden exceder 500 caracteres"
- ❌ O campo limita automáticamente a 500

**QUÉ CAPTURAR**:
- Screenshot del error o límite
- Si permite > 500: **REPORTAR BUG BAJO**

---

#### TC-CLI-019: Crear 10 Clientes Rápidamente
**Objetivo**: Verificar performance y estabilidad

**Pasos**:
1. Crear 10 clientes seguidos (usar datos de DATOS_PRUEBA.md)
2. NO esperar entre creaciones
3. Observar comportamiento

**Resultado esperado**:
- ✅ Todos se crean correctamente
- ✅ Lista se actualiza para cada uno
- ✅ NO hay errores ni congelamiento

**QUÉ CAPTURAR**:
- Screenshot de lista con 10 clientes
- Si se congela o da error: **REPORTAR BUG ALTO**

---

#### TC-CLI-020: Ver Estadísticas de Clientes
**Objetivo**: Verificar contadores

**Prerequisitos**: Tener clientes creados (Ej: 5 Física, 3 Moral)

**Pasos**:
1. Observar panel de estadísticas/métricas en vista Clientes
2. Verificar contadores

**Resultado esperado**:
- ✅ Total de clientes correcto
- ✅ Desglose por tipo (Física / Moral) correcto
- ✅ Números coinciden con lista

**QUÉ CAPTURAR**:
- Screenshot de estadísticas
- Si números NO coinciden: **REPORTAR BUG ALTO**

---

### PRIORIDAD ALTA

#### TC-CLI-021: Cerrar Modal Sin Guardar
**Objetivo**: Verificar pérdida de datos al cerrar

**Pasos**:
1. Click en "+ Nuevo Cliente"
2. Llenar varios campos
3. Click fuera del modal o en botón "Cerrar" (X)

**Resultado esperado**:
- ⚠️ **Ideal**: Advertencia "¿Desea salir sin guardar?"
- ✅ **Mínimo**: Modal se cierra, datos NO se guardan

**QUÉ CAPTURAR**:
- Si hay advertencia: Screenshot de advertencia
- Si NO hay advertencia: Nota en reporte (no es bug, es mejora)

---

#### TC-CLI-022: Editar y Cancelar
**Objetivo**: Verificar que cancelar NO guarda cambios

**Pasos**:
1. Editar cliente existente
2. Cambiar Nombre y Email
3. Click en "Cancelar"
4. Verificar que datos NO cambiaron

**Resultado esperado**:
- ✅ Cambios NO se guardan
- ✅ Datos originales permanecen

**QUÉ CAPTURAR**:
- Screenshot ANTES de cancelar
- Screenshot DESPUÉS de cancelar
- Si cambios se guardan: **REPORTAR BUG MEDIO**

---

#### TC-CLI-023: Crear Cliente Solo con Campos Requeridos
**Objetivo**: Verificar que campos opcionales NO son obligatorios

**Pasos**:
1. Crear cliente solo con:
   - RFC: `OPC890123XYZ`
   - Nombre: `Cliente Mínimo`
   - Tipo: Física
2. Dejar vacíos: Email, Teléfono, Celular, Dirección, Notas
3. Guardar

**Resultado esperado**:
- ✅ Se guarda correctamente
- ✅ Campos opcionales quedan vacíos

**QUÉ CAPTURAR**:
- Screenshot del cliente con campos vacíos
- Si NO permite guardar: **REPORTAR BUG MEDIO**

---

#### TC-CLI-024: Filtrar por Tipo de Persona
**Objetivo**: Verificar filtro Física/Moral (si existe)

**Prerequisitos**: Tener clientes de ambos tipos

**Pasos**:
1. Si hay filtro/dropdown "Tipo de Persona":
   - Seleccionar "Física"
   - Verificar que solo muestra Físicas
   - Seleccionar "Moral"
   - Verificar que solo muestra Morales
2. Si NO hay filtro: **Anotar como mejora sugerida**

**Resultado esperado**:
- ✅ Filtro funciona correctamente

**QUÉ CAPTURAR**:
- Screenshot de cada filtro aplicado

---

#### TC-CLI-025: Actualizar Lista Después de Crear
**Objetivo**: Verificar que lista se refresca automáticamente

**Pasos**:
1. Ver lista de clientes (Ej: 5 clientes)
2. Crear nuevo cliente
3. Observar lista inmediatamente

**Resultado esperado**:
- ✅ Nuevo cliente aparece **inmediatamente** sin refrescar
- ✅ Contador se actualiza

**QUÉ CAPTURAR**:
- Screenshot de lista actualizada
- Si necesita refresh manual: **REPORTAR BUG BAJO**

---

## 📄 MÓDULO 2: DOCUMENTOS (12 casos - 30 min)

### PRIORIDAD ALTA

#### TC-DOC-001: Subir Documento a Cliente
**Objetivo**: Verificar subida de documento desde módulo Cliente

**Prerequisitos**: Cliente creado

**Pasos**:
1. Abrir detalles de cliente "Juan Gómez Martínez"
2. Buscar sección "Documentos" o botón "Subir Documento"
3. Click en "Subir" o "Adjuntar"
4. Seleccionar archivo: `identificacion.pdf` (preparar archivo de prueba)
5. Seleccionar tipo: "PDF"
6. Guardar

**Resultado esperado**:
- ✅ Documento se sube correctamente
- ✅ Aparece en lista de documentos del cliente
- ✅ Muestra nombre, tipo, fecha

**QUÉ CAPTURAR**:
- Screenshot del documento en lista
- Si falla: **REPORTAR BUG ALTO**

---

#### TC-DOC-002: Subir Documento con Drag & Drop
**Objetivo**: Verificar arrastrar y soltar

**Pasos**:
1. Abrir modal de documentos
2. Arrastrar archivo desde escritorio
3. Soltar en área de "Drag & Drop"

**Resultado esperado**:
- ✅ Archivo se carga
- ✅ Muestra nombre del archivo

**QUÉ CAPTURAR**:
- Screenshot del proceso
- Si NO funciona: **REPORTAR BUG MEDIO**

---

#### TC-DOC-003: Tipos de Archivo Soportados
**Objetivo**: Verificar tipos de archivo permitidos

**Pasos**:
1. Intentar subir diferentes tipos:
   - PDF: `documento.pdf`
   - Imagen: `foto.jpg`, `scan.png`
   - Word: `contrato.docx`
   - Excel: `hoja.xlsx`
   - TXT: `notas.txt`
2. Para cada uno, verificar si se acepta

**Resultado esperado**:
- ✅ PDF, JPG, PNG, DOCX, XLSX se aceptan
- ❌ Archivos no soportados muestran error

**QUÉ CAPTURAR**:
- Lista de tipos aceptados vs rechazados
- Si acepta tipos raros (`.exe`, `.zip`): **REPORTAR BUG MEDIO**

---

#### TC-DOC-004: Subir Documento Grande
**Objetivo**: Verificar límite de tamaño

**Pasos**:
1. Intentar subir archivo de 5 MB
2. Intentar subir archivo de 10 MB
3. Intentar subir archivo de 50 MB (si es posible)

**Resultado esperado**:
- ⚠️ Si hay límite, debe mostrar error claro
- ⚠️ Si NO hay límite, documentar

**QUÉ CAPTURAR**:
- Tamaño máximo permitido
- Screenshot de error si lo hay
- Si acepta archivos enormes sin límite: **ANOTAR COMO RIESGO**

---

#### TC-DOC-005: Abrir/Ver Documento
**Objetivo**: Verificar que documentos se pueden abrir

**Prerequisitos**: Documento subido

**Pasos**:
1. En lista de documentos, click en nombre o botón "Abrir"
2. Verificar que documento se abre

**Resultado esperado**:
- ✅ Documento se abre en visor del sistema
- ✅ O se descarga y abre con app predeterminada

**QUÉ CAPTURAR**:
- Screenshot del documento abierto
- Si NO abre: **REPORTAR BUG CRÍTICO**

---

#### TC-DOC-006: Eliminar Documento
**Objetivo**: Verificar eliminación

**Pasos**:
1. Seleccionar documento
2. Click en "Eliminar" o ícono de papelera
3. Confirmar en diálogo

**Resultado esperado**:
- ✅ Diálogo de confirmación
- ✅ Documento desaparece de lista
- ⚠️ Archivo físico se elimina del disco (no verificable desde UI)

**QUÉ CAPTURAR**:
- Screenshot de confirmación
- Screenshot de lista sin documento

---

#### TC-DOC-007: Subir Mismo Archivo Dos Veces
**Objetivo**: Verificar duplicados

**Pasos**:
1. Subir `identificacion.pdf`
2. Subir de nuevo `identificacion.pdf`

**Resultado esperado**:
- ⚠️ **Ideal**: Advertencia de duplicado
- ✅ **Mínimo**: Ambos se guardan (con nombres diferentes)

**QUÉ CAPTURAR**:
- Screenshot de ambos documentos en lista
- Si hay conflicto: **REPORTAR BUG MEDIO**

---

#### TC-DOC-008: Documento con Nombre Largo
**Objetivo**: Verificar nombres largos

**Pasos**:
1. Subir archivo con nombre muy largo:
   ```
   Identificacion_Oficial_Juan_Gomez_Martinez_IFE_Credencial_Para_Votar_Vigente_2025.pdf
   ```

**Resultado esperado**:
- ✅ Se sube correctamente
- ✅ Nombre se trunca en lista si es necesario
- ✅ Nombre completo visible en tooltip o detalles

**QUÉ CAPTURAR**:
- Screenshot del documento con nombre largo

---

#### TC-DOC-009: Documento Sin Extensión
**Objetivo**: Verificar validación de tipo

**Pasos**:
1. Renombrar archivo para que NO tenga extensión: `documento`
2. Intentar subirlo

**Resultado esperado**:
- ❌ Error: "Archivo debe tener extensión válida"
- ❌ O sistema detecta tipo automáticamente

**QUÉ CAPTURAR**:
- Comportamiento del sistema
- Si permite sin extensión: **ANOTAR COMPORTAMIENTO**

---

#### TC-DOC-010: Ver Documentos en Módulo Documentos
**Objetivo**: Verificar vista consolidada de documentos

**Pasos**:
1. Navegar a módulo "Documentos"
2. Verificar que muestra **todos** los documentos del sistema
3. Verificar filtros (si hay)

**Resultado esperado**:
- ✅ Muestra documentos de todos los clientes/pólizas
- ✅ Indica a qué entidad pertenece cada documento

**QUÉ CAPTURAR**:
- Screenshot de vista de documentos

---

#### TC-DOC-011: Filtrar Documentos por Cliente
**Objetivo**: Verificar filtro por ámbito

**Pasos**:
1. En módulo Documentos, filtrar por "Cliente"
2. Seleccionar cliente específico en dropdown
3. Verificar que solo muestra documentos de ese cliente

**Resultado esperado**:
- ✅ Filtro funciona correctamente

**QUÉ CAPTURAR**:
- Screenshot de documentos filtrados

---

#### TC-DOC-012: Performance con Múltiples Documentos
**Objetivo**: Verificar rendimiento

**Pasos**:
1. Subir 10 documentos a un cliente
2. Observar tiempo de carga de lista

**Resultado esperado**:
- ✅ Lista se carga en < 2 segundos
- ✅ Sistema no se congela

**QUÉ CAPTURAR**:
- Tiempo aproximado de carga
- Si se congela: **REPORTAR BUG ALTO**

---

## 📚 MÓDULO 3: CATÁLOGOS (10 casos - 25 min)

### PRIORIDAD ALTA

#### TC-CAT-001: Ver Catálogos Existentes
**Objetivo**: Verificar vista inicial

**Pasos**:
1. Navegar a módulo "Catálogos"
2. Verificar pestañas o secciones:
   - Aseguradoras
   - Ramos (Tipos de Seguro)

**Resultado esperado**:
- ✅ Ambas secciones visibles
- ✅ Datos iniciales cargados (si los hay)

**QUÉ CAPTURAR**:
- Screenshot de vista de catálogos

---

#### TC-CAT-002: Crear Aseguradora
**Objetivo**: Verificar creación de aseguradora

**Pasos**:
1. En sección Aseguradoras, click "+ Nueva Aseguradora"
2. Llenar:
   - Nombre: `QUALITAS`
   - Estado: Activo (por defecto)
3. Guardar

**Resultado esperado**:
- ✅ Aseguradora creada
- ✅ Aparece en lista

**QUÉ CAPTURAR**:
- Screenshot de aseguradora en lista

---

#### TC-CAT-003: Crear Múltiples Aseguradoras
**Objetivo**: Poblar catálogo

**Pasos**:
Crear las siguientes aseguradoras:
1. `AXA`
2. `ZURICH`
3. `BANORTE`
4. `MAPFRE`
5. `GNP`
6. `SURA`

**Resultado esperado**:
- ✅ Todas se crean correctamente
- ✅ Lista ordenada alfabéticamente (ideal)

**QUÉ CAPTURAR**:
- Screenshot de lista completa

---

#### TC-CAT-004: Aseguradora con Nombre Duplicado
**Objetivo**: Verificar validación de duplicados

**Pasos**:
1. Intentar crear aseguradora con nombre `QUALITAS` (ya existe)
2. Guardar

**Resultado esperado**:
- ❌ Error: "El nombre ya existe"
- ❌ No se guarda

**QUÉ CAPTURAR**:
- Screenshot de error
- Si permite duplicado: **REPORTAR BUG MEDIO**

---

#### TC-CAT-005: Editar Aseguradora
**Objetivo**: Verificar edición

**Pasos**:
1. Seleccionar aseguradora `AXA`
2. Editar nombre a `AXA SEGUROS`
3. Guardar

**Resultado esperado**:
- ✅ Cambio se guarda
- ✅ Lista se actualiza

**QUÉ CAPTURAR**:
- Screenshot ANTES y DESPUÉS

---

#### TC-CAT-006: Eliminar Aseguradora Sin Uso
**Objetivo**: Verificar eliminación simple

**Pasos**:
1. Crear aseguradora temporal: `TEMP ASEGURADORA`
2. Eliminarla (debe estar SIN pólizas asociadas)

**Resultado esperado**:
- ✅ Se elimina correctamente

**QUÉ CAPTURAR**:
- Screenshot de confirmación

---

#### TC-CAT-007: Intentar Eliminar Aseguradora en Uso
**Objetivo**: Verificar protección de datos

**Prerequisitos**: Aseguradora con pólizas creadas

**Pasos**:
1. Intentar eliminar aseguradora que tiene pólizas
2. Verificar comportamiento

**Resultado esperado**:
- ❌ Error: "No se puede eliminar, tiene pólizas asociadas"
- ❌ O deshabilitar botón de eliminar

**QUÉ CAPTURAR**:
- Screenshot de error
- Si permite eliminar: **REPORTAR BUG CRÍTICO**

**Razón**: Eliminar causaría pólizas huérfanas (datos corruptos)

---

#### TC-CAT-008: Crear Ramo
**Objetivo**: Verificar creación de ramo

**Pasos**:
1. En sección Ramos, click "+ Nuevo Ramo"
2. Llenar:
   - Nombre: `AUTOS`
   - Descripción: `Seguros de automóviles`
   - Estado: Activo
3. Guardar

**Resultado esperado**:
- ✅ Ramo creado
- ✅ Aparece en lista

**QUÉ CAPTURAR**:
- Screenshot de ramo creado

---

#### TC-CAT-009: Crear Múltiples Ramos
**Objetivo**: Poblar catálogo

**Pasos**:
Crear los siguientes ramos:
1. `VIDA`
2. `DAÑOS`
3. `GASTOS MÉDICOS`
4. `AHORRO`
5. `RETIRO`

**Resultado esperado**:
- ✅ Todos se crean correctamente

**QUÉ CAPTURAR**:
- Screenshot de lista de ramos

---

#### TC-CAT-010: Verificar Catálogos en Dropdown de Pólizas
**Objetivo**: Verificar integración con módulo Pólizas

**Pasos**:
1. Navegar a módulo "Pólizas"
2. Click en "+ Nueva Póliza"
3. Observar dropdowns de:
   - Aseguradora
   - Ramo

**Resultado esperado**:
- ✅ Dropdowns muestran aseguradoras y ramos creados
- ✅ Están ordenados

**QUÉ CAPTURAR**:
- Screenshot de dropdowns poblados

---

## 📊 MÓDULO 4: DASHBOARD (8 casos - 15 min)

### PRIORIDAD MEDIA

#### TC-DASH-001: Ver Dashboard Inicial
**Objetivo**: Verificar carga de dashboard

**Pasos**:
1. Login y esperar carga de dashboard
2. Observar métricas/widgets

**Resultado esperado**:
- ✅ Dashboard se carga en < 3 segundos
- ✅ Muestra métricas:
  - Total de clientes
  - Total de pólizas
  - Pólizas por vencer
  - Recibos pendientes (u otras métricas)

**QUÉ CAPTURAR**:
- Screenshot del dashboard

---

#### TC-DASH-002: Métricas Reflejan Datos Reales
**Objetivo**: Verificar precisión de contadores

**Prerequisitos**: Tener datos creados

**Pasos**:
1. Contar manualmente:
   - Clientes en módulo Clientes
   - Pólizas en módulo Pólizas
2. Comparar con dashboard

**Resultado esperado**:
- ✅ Números coinciden exactamente

**QUÉ CAPTURAR**:
- Screenshot de dashboard con números
- Screenshot de módulos con conteos
- Si NO coinciden: **REPORTAR BUG ALTO**

---

#### TC-DASH-003: Dashboard Sin Datos
**Objetivo**: Verificar estado vacío

**Pasos**:
1. Si es posible, resetear BD o crear usuario nuevo
2. Ver dashboard sin datos

**Resultado esperado**:
- ✅ Muestra métricas en 0
- ✅ Mensaje amigable: "No hay datos aún" o similar
- ✅ NO muestra errores

**QUÉ CAPTURAR**:
- Screenshot de dashboard vacío

---

#### TC-DASH-004: Refrescar Dashboard
**Objetivo**: Verificar actualización de métricas

**Pasos**:
1. Ver dashboard (Ej: 5 clientes)
2. Crear nuevo cliente
3. Regresar a dashboard

**Resultado esperado**:
- ✅ Métricas se actualizan automáticamente
- ✅ O al refrescar (F5)

**QUÉ CAPTURAR**:
- Comportamiento observado

---

#### TC-DASH-005: Navegación desde Dashboard
**Objetivo**: Verificar links/botones

**Pasos**:
1. Si hay botones como "Ver Clientes", "Ver Pólizas"
2. Click en cada uno
3. Verificar que navega al módulo correcto

**Resultado esperado**:
- ✅ Navegación funciona

**QUÉ CAPTURAR**:
- Nota de funcionalidad

---

#### TC-DASH-006: Alertas/Notificaciones
**Objetivo**: Verificar panel de alertas

**Pasos**:
1. Buscar ícono de campana o sección "Alertas"
2. Verificar si muestra alertas

**Resultado esperado**:
- ✅ Si hay pólizas por vencer, debe mostrar alerta
- ✅ Badge con número de alertas

**QUÉ CAPTURAR**:
- Screenshot de alertas (si hay)

---

#### TC-DASH-007: Tema/Configuración
**Objetivo**: Verificar cambio de tema

**Pasos**:
1. Buscar opción de tema (ícono de sol/luna)
2. Cambiar de tema claro a oscuro
3. Verificar cambio visual

**Resultado esperado**:
- ✅ Tema cambia correctamente
- ✅ Se guarda preferencia (persiste al refrescar)

**QUÉ CAPTURAR**:
- Screenshot de ambos temas

---

#### TC-DASH-008: Información del Usuario
**Objetivo**: Verificar datos de sesión

**Pasos**:
1. Buscar nombre de usuario en sidebar o header
2. Verificar que muestra: "admin" o nombre configurado

**Resultado esperado**:
- ✅ Muestra usuario actual

**QUÉ CAPTURAR**:
- Screenshot con info de usuario

---

## 📋 CHECKLIST FINAL

Al terminar todas las pruebas, verificar:

- [ ] **Todos los casos ejecutados** (55 casos)
- [ ] **Screenshots capturados** (mínimo 40 screenshots)
- [ ] **Bugs reportados** con template completo
- [ ] **Datos de prueba documentados**
- [ ] **Tiempos registrados** por módulo
- [ ] **Notas adicionales** sobre comportamientos

---

## 📊 RESUMEN DE TESTING

Al finalizar, llenar:

```
RESUMEN - TESTER 1
==================

Fecha: ___________
Hora inicio: ___________
Hora fin: ___________
Duración total: ___________

CASOS EJECUTADOS:
- Clientes: ___/25
- Documentos: ___/12
- Catálogos: ___/10
- Dashboard: ___/8
- TOTAL: ___/55

BUGS ENCONTRADOS:
- Críticos: ___
- Altos: ___
- Medios: ___
- Bajos: ___
- TOTAL: ___

MÓDULOS CON MÁS ISSUES:
1. ___________
2. ___________
3. ___________

OBSERVACIONES GENERALES:
_________________________
_________________________
_________________________
```

---

## 🚀 SIGUIENTE PASO

Al completar testing:
1. Organizar screenshots en carpeta
2. Completar reportes de bugs
3. Enviar resumen al equipo de desarrollo
4. Coordinar con Tester 2 para revisión cruzada

---

**Fin del Plan de Testing - Tester 1**