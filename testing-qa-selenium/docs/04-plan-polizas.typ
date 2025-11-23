#set document(
  title: "Plan de Pruebas - Módulo de Pólizas",
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
    Plan de Pruebas
  ]

  #v(0.5cm)

  #text(size: 18pt)[
    Módulo de Pólizas de Seguros
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

= Control de Versiones

#table(
  columns: (1fr, 1fr, 2fr, 3fr),
  align: left,
  table.header(
    [*Versión*], [*Fecha*], [*Autor*], [*Descripción*]
  ),
  [1.0], [2025-11-23], [Equipo QA], [Versión inicial del plan de pruebas de Pólizas]
)

#pagebreak()

#outline(
  title: "Tabla de Contenido",
  indent: auto,
)

#pagebreak()

= Introducción

== Propósito

Este documento define los casos de prueba para el módulo de Pólizas de Seguros del Sistema VILLALOBOS. Cubre las funcionalidades de creación, consulta, edición, eliminación, búsqueda y gestión de pólizas.

== Alcance

El módulo de Pólizas permite:
- Gestionar el ciclo de vida completo de pólizas de seguros
- Asociar pólizas con clientes existentes
- Seleccionar aseguradoras y ramos desde catálogos
- Calcular vigencias y renovaciones
- Buscar y filtrar pólizas por múltiples criterios
- Paginar grandes volúmenes de pólizas
- Gestionar documentos adjuntos

== Audiencia

Este plan está dirigido a:
- Equipo de QA
- Desarrolladores
- Product Owner
- Evaluadores del proyecto

= Funcionalidades del Módulo

== Características Principales

+ *CRUD de Pólizas*: Crear, leer, actualizar y eliminar pólizas
+ *Relaciones*: Asociar con clientes, aseguradoras y ramos
+ *Fechas*: Gestión de inicio, fin y renovación
+ *Búsqueda*: Por número de póliza, cliente, aseguradora
+ *Filtros*: Por ramo, estado, vigencia
+ *Paginación*: Navegación eficiente con grandes volúmenes
+ *Documentos*: Adjuntar archivos relacionados con la póliza

== Reglas de Negocio

=== Número de Póliza
- Debe ser único en el sistema
- Formato libre (depende de cada aseguradora)
- Campo obligatorio
- Longitud mínima: 3 caracteres
- Longitud máxima: 50 caracteres

=== Fechas
- *Fecha de inicio*: Obligatoria
- *Fecha de fin*: Obligatoria
- *Fecha de fin* debe ser posterior a *Fecha de inicio*
- Sistema calcula días de vigencia automáticamente
- Formato: DD/MM/YYYY

=== Suma Asegurada
- Campo numérico obligatorio
- Debe ser mayor a 0
- Formato: Moneda (MXN)
- Máximo: 999,999,999.99

=== Prima
- Campo numérico obligatorio
- Debe ser mayor a 0
- Generalmente menor que suma asegurada
- Formato: Moneda (MXN)

=== Relaciones
- *Cliente*: Obligatorio, debe existir en la base de datos
- *Aseguradora*: Obligatorio, selección desde catálogo
- *Ramo*: Obligatorio, selección desde catálogo

=== Estado
- *Activa*: Póliza vigente
- *Inactiva*: Póliza cancelada o terminada
- Por defecto: Activa

= Casos de Prueba

== TC-POL-001: Crear Póliza Nueva con Datos Válidos

*Prioridad:* Alta

*Tipo:* Funcional

*Herramienta:* Selenium IDE + WebDriver

=== Descripción

Verificar que se puede crear una nueva póliza con todos los campos obligatorios y datos válidos.

=== Precondiciones

- Usuario autenticado
- Estar en la vista de Pólizas
- Al menos un cliente existe en la base de datos
- Catálogos de aseguradoras y ramos poblados

=== Datos de Prueba

```
Número de Póliza: POL-2025-001
Cliente: Juan Pérez López (ID: 1)
Aseguradora: GNP Seguros
Ramo: Vida
Fecha Inicio: 01/01/2025
Fecha Fin: 31/12/2025
Suma Asegurada: $500,000.00
Prima: $12,500.00
Notas: Póliza de prueba
```

=== Pasos

1. Hacer clic en botón "Nueva Póliza" o similar
2. Esperar que se abra el formulario de creación
3. Ingresar número de póliza en campo correspondiente
4. Seleccionar cliente desde el dropdown/autocomplete
5. Seleccionar aseguradora desde el dropdown
6. Seleccionar ramo desde el dropdown
7. Ingresar fecha de inicio (usar date picker o input)
8. Ingresar fecha de fin
9. Ingresar suma asegurada
10. Ingresar prima
11. Ingresar notas (opcional)
12. Hacer clic en botón "Guardar" o "Crear"
13. Esperar respuesta del sistema

=== Resultado Esperado

- Formulario se valida correctamente
- Póliza se crea en la base de datos
- Modal/formulario se cierra automáticamente
- Mensaje de confirmación: "Póliza creada exitosamente"
- Nueva póliza aparece en la tabla de pólizas
- Los datos guardados coinciden exactamente con los ingresados

=== Criterios de Aceptación

- [ ] Póliza se crea en menos de 2 segundos
- [ ] Mensaje de éxito se muestra claramente
- [ ] Póliza tiene ID asignado automáticamente
- [ ] Fechas se guardan en formato correcto
- [ ] Montos se guardan con 2 decimales
- [ ] Relaciones (cliente, aseguradora, ramo) se guardan correctamente

---

== TC-POL-002: Validación de Número de Póliza Duplicado

*Prioridad:* Alta

*Tipo:* Validación

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que el sistema no permite crear dos pólizas con el mismo número.

=== Precondiciones

- Usuario autenticado
- Existe al menos una póliza con número "POL-2025-001"

=== Datos de Prueba

```
Primera póliza (ya existe):
Número: POL-2025-001

Segunda póliza (duplicado):
Número: POL-2025-001
Cliente: María García
Aseguradora: Mapfre
[resto de campos válidos]
```

=== Pasos

1. Abrir formulario de nueva póliza
2. Ingresar número de póliza que ya existe: "POL-2025-001"
3. Llenar resto de campos con datos válidos
4. Intentar guardar

=== Resultado Esperado

- Sistema detecta duplicado
- Se muestra mensaje de error: "El número de póliza ya existe"
- Formulario NO se cierra
- Póliza NO se crea en base de datos
- Campo de número de póliza se marca como inválido

=== Criterios de Aceptación

- [ ] Validación ocurre antes de guardar
- [ ] Mensaje de error es claro y específico
- [ ] Usuario puede corregir sin perder otros datos
- [ ] No se crea registro duplicado en BD

---

== TC-POL-003: Validación de Fechas - Fin Mayor que Inicio

*Prioridad:* Alta

*Tipo:* Validación

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que el sistema valida que la fecha de fin sea posterior a la fecha de inicio.

=== Datos de Prueba

*Escenario 1: Fecha fin ANTERIOR a inicio (inválido)*
```
Fecha Inicio: 01/12/2025
Fecha Fin: 01/01/2025
```

*Escenario 2: Fecha fin IGUAL a inicio (inválido)*
```
Fecha Inicio: 01/01/2025
Fecha Fin: 01/01/2025
```

*Escenario 3: Fecha fin POSTERIOR a inicio (válido)*
```
Fecha Inicio: 01/01/2025
Fecha Fin: 31/12/2025
```

=== Pasos

Para cada escenario:
1. Abrir formulario de nueva póliza
2. Ingresar datos del escenario
3. Llenar resto de campos válidos
4. Intentar guardar

=== Resultado Esperado

*Escenarios 1 y 2 (inválidos):*
- Mensaje de error: "La fecha de fin debe ser posterior a la fecha de inicio"
- Formulario no se guarda
- Campos de fecha se marcan como inválidos

*Escenario 3 (válido):*
- Póliza se crea exitosamente
- No hay mensajes de error

=== Criterios de Aceptación

- [ ] Validación funciona para todos los escenarios
- [ ] Mensaje de error es claro
- [ ] Validación ocurre en tiempo real o al guardar
- [ ] Fechas válidas permiten creación exitosa

---

== TC-POL-004: Validación de Suma Asegurada Mayor a Cero

*Prioridad:* Alta

*Tipo:* Validación

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que el sistema valida que la suma asegurada sea un número positivo mayor a cero.

=== Datos de Prueba

*Escenario 1: Suma = 0 (inválido)*
```
Suma Asegurada: 0
```

*Escenario 2: Suma negativa (inválido)*
```
Suma Asegurada: -1000
```

*Escenario 3: Suma válida*
```
Suma Asegurada: 500000
```

*Escenario 4: Caracteres no numéricos (inválido)*
```
Suma Asegurada: "ABC123"
```

=== Pasos

Para cada escenario:
1. Abrir formulario de nueva póliza
2. Ingresar suma asegurada del escenario
3. Llenar resto de campos válidos
4. Intentar guardar

=== Resultado Esperado

*Escenarios inválidos (1, 2, 4):*
- Mensaje de error específico
- Campo se marca como inválido
- No se permite guardar

*Escenario válido (3):*
- Póliza se crea correctamente
- Monto se guarda con formato de moneda

=== Criterios de Aceptación

- [ ] Solo acepta números positivos mayores a 0
- [ ] Rechaza valores negativos y cero
- [ ] Rechaza caracteres no numéricos
- [ ] Formatea correctamente como moneda al guardar

---

== TC-POL-005: Validación de Prima Mayor a Cero

*Prioridad:* Alta

*Tipo:* Validación

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que el sistema valida que la prima sea un número positivo mayor a cero.

=== Datos de Prueba

Similar a TC-POL-004 pero para campo Prima:
```
Escenario 1: Prima = 0 (inválido)
Escenario 2: Prima = -500 (inválido)
Escenario 3: Prima = 12500 (válido)
Escenario 4: Prima = "XYZ" (inválido)
```

=== Pasos

Idénticos a TC-POL-004 pero enfocados en campo Prima

=== Resultado Esperado

Mismo comportamiento que TC-POL-004:
- Rechaza cero, negativos y no numéricos
- Acepta valores positivos
- Formatea como moneda

=== Criterios de Aceptación

- [ ] Validación funciona correctamente
- [ ] Mensajes de error claros
- [ ] Formato de moneda al guardar

---

== TC-POL-006: Editar Póliza Existente

*Prioridad:* Alta

*Tipo:* Funcional

*Herramienta:* Selenium IDE + WebDriver

=== Descripción

Verificar que se puede editar una póliza existente y los cambios se guardan correctamente.

=== Precondiciones

- Existe póliza con número "POL-2025-001"
- Usuario tiene permisos de edición

=== Datos de Prueba

*Datos originales:*
```
Número: POL-2025-001
Cliente: Juan Pérez
Aseguradora: GNP
Ramo: Vida
Suma Asegurada: $500,000.00
Prima: $12,500.00
```

*Datos modificados:*
```
Suma Asegurada: $750,000.00
Prima: $18,750.00
Notas: "Aumento de cobertura solicitado por cliente"
```

=== Pasos

1. Localizar la póliza "POL-2025-001" en la tabla
2. Hacer clic en botón "Editar" o doble clic en la fila
3. Esperar que se abra el formulario de edición
4. Verificar que campos se cargan con datos actuales
5. Modificar Suma Asegurada a $750,000.00
6. Modificar Prima a $18,750.00
7. Agregar notas
8. Hacer clic en "Guardar"
9. Esperar confirmación

=== Resultado Esperado

- Formulario se carga con datos actuales
- Cambios se guardan exitosamente
- Mensaje: "Póliza actualizada correctamente"
- Modal se cierra
- Tabla se actualiza mostrando nuevos valores
- Datos no modificados permanecen iguales

=== Criterios de Aceptación

- [ ] Formulario precarga datos correctamente
- [ ] Solo campos modificados se actualizan
- [ ] Cambios persisten en base de datos
- [ ] Actualización toma menos de 2 segundos
- [ ] Tabla refleja cambios inmediatamente

---

== TC-POL-007: Eliminar Póliza (Soft Delete)

*Prioridad:* Alta

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se puede eliminar (desactivar) una póliza mediante soft delete.

=== Precondiciones

- Existe póliza activa "POL-2025-001"

=== Pasos

1. Localizar la póliza en la tabla
2. Hacer clic en botón "Eliminar" o ícono de papelera
3. Si aparece confirmación, hacer clic en "Confirmar"
4. Esperar respuesta del sistema
5. Verificar tabla actualizada

=== Resultado Esperado

- Modal de confirmación aparece (si está implementado)
- Mensaje: "Póliza eliminada correctamente"
- Póliza desaparece de la lista principal
- Registro permanece en BD con activo=0
- No se borran datos relacionados

=== Criterios de Aceptación

- [ ] Confirmación antes de eliminar
- [ ] Soft delete (no borrado físico)
- [ ] Mensaje de éxito claro
- [ ] Póliza no visible en vista principal
- [ ] Datos preservados en BD

---

== TC-POL-008: Búsqueda por Número de Póliza

*Prioridad:* Alta

*Tipo:* Funcional

*Herramienta:* Selenium IDE + WebDriver

=== Descripción

Verificar que la búsqueda por número de póliza funciona correctamente.

=== Precondiciones

- Existen múltiples pólizas:
  - POL-2025-001
  - POL-2025-002
  - POL-2025-003

=== Datos de Prueba

*Escenario 1: Búsqueda exacta*
```
Búsqueda: "POL-2025-001"
Resultado: 1 póliza
```

*Escenario 2: Búsqueda parcial*
```
Búsqueda: "2025"
Resultado: 3 pólizas
```

*Escenario 3: Sin resultados*
```
Búsqueda: "NOEXISTE"
Resultado: 0 pólizas
```

=== Pasos

Para cada escenario:
1. Localizar campo de búsqueda
2. Ingresar término de búsqueda
3. Presionar Enter o hacer clic en botón buscar
4. Observar resultados filtrados

=== Resultado Esperado

*Escenario 1:*
- Tabla muestra solo "POL-2025-001"
- Contador muestra "1 resultado"

*Escenario 2:*
- Tabla muestra las 3 pólizas
- Contador muestra "3 resultados"

*Escenario 3:*
- Tabla vacía o mensaje "No se encontraron resultados"
- Contador muestra "0 resultados"

=== Criterios de Aceptación

- [ ] Búsqueda funciona en tiempo real o al presionar Enter
- [ ] Coincidencias parciales son soportadas
- [ ] Contador de resultados es preciso
- [ ] Estado vacío se maneja correctamente
- [ ] Búsqueda NO es case-sensitive

---

== TC-POL-009: Búsqueda por Cliente

*Prioridad:* Alta

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se pueden filtrar pólizas por cliente.

=== Precondiciones

- Cliente "Juan Pérez" tiene 3 pólizas
- Cliente "María García" tiene 2 pólizas
- Cliente "Pedro López" tiene 0 pólizas

=== Pasos

1. Localizar dropdown/autocomplete de búsqueda por cliente
2. Seleccionar "Juan Pérez"
3. Observar resultados filtrados
4. Repetir con "María García"
5. Repetir con "Pedro López"

=== Resultado Esperado

- Filtro por "Juan Pérez": 3 pólizas
- Filtro por "María García": 2 pólizas
- Filtro por "Pedro López": 0 pólizas (estado vacío)

=== Criterios de Aceptación

- [ ] Dropdown carga todos los clientes
- [ ] Filtro se aplica correctamente
- [ ] Se pueden limpiar filtros (mostrar todas)
- [ ] Estado vacío se maneja bien

---

== TC-POL-010: Filtro por Aseguradora

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se pueden filtrar pólizas por aseguradora.

=== Precondiciones

- 5 pólizas de "GNP Seguros"
- 3 pólizas de "Mapfre"
- 2 pólizas de "Qualitas"

=== Pasos

1. Localizar filtro de aseguradora (dropdown/multiselect)
2. Seleccionar "GNP Seguros"
3. Verificar resultados
4. Cambiar a "Mapfre"
5. Verificar resultados
6. Seleccionar múltiples si es posible

=== Resultado Esperado

- Filtro "GNP": 5 pólizas
- Filtro "Mapfre": 3 pólizas
- Si multi-select: Suma correcta de resultados

=== Criterios de Aceptación

- [ ] Filtro funciona correctamente
- [ ] Dropdown carga aseguradoras del catálogo
- [ ] Posibilidad de limpiar filtro
- [ ] Multi-select opcional funciona

---

== TC-POL-011: Filtro por Ramo de Seguro

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se pueden filtrar pólizas por ramo (Vida, Auto, Daños, etc.).

=== Precondiciones

- 4 pólizas de "Vida"
- 6 pólizas de "Auto"
- 2 pólizas de "Daños"

=== Pasos

1. Localizar filtro de ramo
2. Seleccionar "Vida"
3. Verificar 4 resultados
4. Cambiar a "Auto"
5. Verificar 6 resultados

=== Resultado Esperado

- Filtros se aplican correctamente
- Resultados coinciden con datos de prueba

=== Criterios de Aceptación

- [ ] Dropdown carga ramos del catálogo
- [ ] Filtro funciona correctamente
- [ ] Posibilidad de limpiar filtro

---

== TC-POL-012: Filtro Combinado (Cliente + Aseguradora + Ramo)

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se pueden aplicar múltiples filtros simultáneamente.

=== Datos de Prueba

```
Cliente: Juan Pérez
Aseguradora: GNP
Ramo: Vida
Resultado esperado: 1 póliza específica
```

=== Pasos

1. Seleccionar cliente "Juan Pérez"
2. Seleccionar aseguradora "GNP"
3. Seleccionar ramo "Vida"
4. Verificar que solo aparece 1 póliza que cumple todos los criterios

=== Resultado Esperado

- Los 3 filtros se aplican simultáneamente (AND lógico)
- Solo aparecen pólizas que cumplen TODOS los criterios
- Contador de resultados es correcto

=== Criterios de Aceptación

- [ ] Filtros múltiples funcionan con lógica AND
- [ ] Se puede limpiar cada filtro individualmente
- [ ] Se puede limpiar todos los filtros a la vez
- [ ] Performance es aceptable con múltiples filtros

---

== TC-POL-013: Paginación - Navegar entre Páginas

*Prioridad:* Alta

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que la paginación funciona correctamente al navegar entre páginas.

=== Precondiciones

- Existen al menos 25 pólizas en la base de datos
- Tamaño de página configurado en 10 items

=== Pasos

1. Cargar vista de pólizas
2. Verificar que se muestran 10 pólizas (página 1)
3. Hacer clic en botón "Siguiente" o "Página 2"
4. Verificar que se muestran las siguientes 10 pólizas
5. Hacer clic en "Página 3"
6. Verificar las últimas 5 pólizas
7. Hacer clic en "Anterior"
8. Verificar regreso a página 2

=== Resultado Esperado

- Página 1: Items 1-10
- Página 2: Items 11-20
- Página 3: Items 21-25
- Botón "Anterior" funciona correctamente
- Botón "Siguiente" se deshabilita en última página
- Indicador de página actual se actualiza

=== Criterios de Aceptación

- [ ] Paginación muestra items correctos
- [ ] Navegación entre páginas funciona
- [ ] Indicadores visuales correctos (página actual, total)
- [ ] Botones se habilitan/deshabilitan apropiadamente
- [ ] No hay duplicados entre páginas

---

== TC-POL-014: Paginación - Cambiar Items por Página

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se puede cambiar el número de items mostrados por página.

=== Precondiciones

- Existen 50 pólizas

=== Pasos

1. Verificar vista inicial (10 items)
2. Cambiar selector a "25 items por página"
3. Verificar que ahora se muestran 25 items
4. Cambiar a "50 items por página"
5. Verificar que se muestran los 50 items en una sola página
6. Cambiar a "10 items por página"
7. Verificar regreso al estado original

=== Resultado Esperado

- Dropdown tiene opciones: 10, 25, 50
- Al cambiar, la tabla se actualiza inmediatamente
- Paginación se recalcula (total de páginas)
- Se mantiene en página 1 al cambiar tamaño

=== Criterios de Aceptación

- [ ] Dropdown funciona correctamente
- [ ] Tabla se actualiza sin recargar página completa
- [ ] Cálculo de páginas es correcto
- [ ] Performance aceptable con 50 items

---

== TC-POL-015: Campos Obligatorios Vacíos

*Prioridad:* Alta

*Tipo:* Validación

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que el sistema valida que todos los campos obligatorios estén llenos.

=== Escenarios de Prueba

*Escenario 1: Todos los campos vacíos*
*Escenario 2: Solo falta número de póliza*
*Escenario 3: Solo falta cliente*
*Escenario 4: Solo falta aseguradora*
*Escenario 5: Solo falta fecha inicio*
*Escenario 6: Solo falta suma asegurada*

=== Pasos

Para cada escenario:
1. Abrir formulario de nueva póliza
2. Dejar campos vacíos según el escenario
3. Intentar guardar
4. Observar mensajes de validación

=== Resultado Esperado

- HTML5 validation actúa primero (required)
- Mensajes específicos para cada campo faltante
- Campos obligatorios se marcan con indicador visual (*)
- No se permite guardar hasta completar todos los campos
- Mensajes claros: "El campo [nombre] es obligatorio"

=== Criterios de Aceptación

- [ ] Validación funciona para cada campo obligatorio
- [ ] Mensajes son claros y específicos
- [ ] Indicadores visuales ayudan al usuario
- [ ] No se guarda con campos vacíos

---

== TC-POL-016: Activar/Desactivar Póliza

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se puede activar/desactivar una póliza sin eliminarla.

=== Precondiciones

- Existe póliza activa "POL-2025-001"

=== Pasos

1. Localizar póliza en la tabla
2. Verificar que estado es "Activa" (indicador visual)
3. Hacer clic en botón/switch "Desactivar"
4. Confirmar acción si hay modal
5. Verificar cambio a "Inactiva"
6. Hacer clic en "Activar"
7. Verificar cambio a "Activa"

=== Resultado Esperado

- Toggle switch o botón funciona
- Estado cambia en BD (campo activo)
- Indicador visual se actualiza inmediatamente
- Mensajes de confirmación apropiados
- No se pierden datos de la póliza

=== Criterios de Aceptación

- [ ] Toggle funciona en ambas direcciones
- [ ] Estado se actualiza en BD
- [ ] Indicador visual claro (color, texto, ícono)
- [ ] Cambio es inmediato
- [ ] Se puede filtrar por estado activo/inactivo

---

== TC-POL-017: Subir Documento Adjunto a Póliza

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se pueden adjuntar documentos (PDF, imágenes) a una póliza.

=== Precondiciones

- Existe póliza "POL-2025-001"
- Usuario tiene documento de prueba (documento-poliza.pdf)

=== Pasos

1. Abrir detalle de póliza o formulario de edición
2. Localizar sección de documentos adjuntos
3. Hacer clic en "Subir documento" o similar
4. Seleccionar archivo desde sistema de archivos
5. Esperar carga
6. Verificar que documento aparece en la lista

=== Resultado Esperado

- Input file funciona correctamente
- Archivo se sube al servidor
- Documento aparece en lista con nombre original
- Se puede descargar el documento
- Se puede eliminar el documento

=== Criterios de Aceptación

- [ ] Subida exitosa de archivos PDF
- [ ] Subida exitosa de imágenes (JPG, PNG)
- [ ] Validación de tamaño máximo (ej: 5MB)
- [ ] Validación de tipos permitidos
- [ ] Lista de documentos se actualiza

---

== TC-POL-018: Eliminar Documento Adjunto

*Prioridad:* Baja

*Tipo:* Funcional

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que se pueden eliminar documentos adjuntos a una póliza.

=== Precondiciones

- Póliza "POL-2025-001" tiene 1 documento adjunto

=== Pasos

1. Abrir detalle de póliza
2. Localizar documento en la lista
3. Hacer clic en botón "Eliminar" o ícono de papelera
4. Confirmar eliminación si hay modal
5. Verificar que documento desaparece de la lista

=== Resultado Esperado

- Confirmación antes de eliminar
- Documento se elimina de la lista
- Archivo se elimina del servidor (o soft delete)
- Mensaje de confirmación

=== Criterios de Aceptación

- [ ] Confirmación obligatoria
- [ ] Eliminación exitosa
- [ ] Lista se actualiza
- [ ] Archivo no accesible después de eliminar

---

== TC-POL-019: Ver Detalle de Póliza (Click en Fila)

*Prioridad:* Media

*Tipo:* Funcional

*Herramienta:* Selenium IDE + WebDriver

=== Descripción

Verificar que al hacer clic en una fila de la tabla se abre el detalle completo de la póliza.

=== Precondiciones

- Existe póliza "POL-2025-001" en la tabla

=== Pasos

1. Localizar fila de la póliza en la tabla
2. Hacer clic en cualquier parte de la fila (o botón "Ver")
3. Esperar que se abra modal/vista de detalle
4. Verificar información mostrada

=== Resultado Esperado

- Modal o panel de detalle se abre
- Se muestran TODOS los datos de la póliza:
  - Número de póliza
  - Cliente (nombre completo)
  - Aseguradora
  - Ramo
  - Fechas (inicio, fin)
  - Suma asegurada
  - Prima
  - Notas
  - Estado (activo/inactivo)
  - Documentos adjuntos
- Información es correcta y formateada
- Hay botón para cerrar el detalle

=== Criterios de Aceptación

- [ ] Click en fila abre detalle
- [ ] Todos los campos se muestran
- [ ] Formato de datos es correcto (fechas, moneda)
- [ ] Se puede cerrar el modal
- [ ] Performance: carga en < 1 segundo

---

== TC-POL-020: Validación de Longitud Mínima Número de Póliza

*Prioridad:* Media

*Tipo:* Validación

*Herramienta:* Selenium WebDriver

=== Descripción

Verificar que el sistema valida que el número de póliza tenga al menos 3 caracteres.

=== Datos de Prueba

*Escenario 1: Muy corto (1 caracter)*
```
Número: "A"
Resultado: Error
```

*Escenario 2: Muy corto (2 caracteres)*
```
Número: "AB"
Resultado: Error
```

*Escenario 3: Mínimo válido (3 caracteres)*
```
Número: "ABC"
Resultado: Éxito
```

*Escenario 4: Normal (10+ caracteres)*
```
Número: "POL-2025-001"
Resultado: Éxito
```

=== Pasos

Para cada escenario:
1. Abrir formulario de nueva póliza
2. Ingresar número de póliza según escenario
3. Llenar resto de campos válidos
4. Intentar guardar
5. Observar resultado

=== Resultado Esperado

*Escenarios 1 y 2:*
- Mensaje de error: "El número de póliza debe tener al menos 3 caracteres"
- No se permite guardar

*Escenarios 3 y 4:*
- Póliza se crea exitosamente
- No hay errores de validación

=== Criterios de Aceptación

- [ ] Validación de longitud mínima funciona
- [ ] Mensaje de error es claro
- [ ] Números válidos (≥3 chars) se aceptan
- [ ] Validación puede ser en tiempo real o al guardar

---

= Matriz de Trazabilidad

#table(
  columns: (2fr, 3fr, 3fr),
  align: left,
  table.header(
    [*Caso de Prueba*], [*Requisito Funcional*], [*Prioridad*]
  ),
  [TC-POL-001], [RF-POL-001: Crear póliza], [Alta],
  [TC-POL-002], [RF-POL-002: Validar unicidad], [Alta],
  [TC-POL-003], [RF-POL-003: Validar fechas], [Alta],
  [TC-POL-004], [RF-POL-004: Validar suma asegurada], [Alta],
  [TC-POL-005], [RF-POL-005: Validar prima], [Alta],
  [TC-POL-006], [RF-POL-006: Editar póliza], [Alta],
  [TC-POL-007], [RF-POL-007: Eliminar póliza], [Alta],
  [TC-POL-008], [RF-POL-008: Buscar por número], [Alta],
  [TC-POL-009], [RF-POL-009: Buscar por cliente], [Alta],
  [TC-POL-010], [RF-POL-010: Filtrar por aseguradora], [Media],
  [TC-POL-011], [RF-POL-011: Filtrar por ramo], [Media],
  [TC-POL-012], [RF-POL-012: Filtros combinados], [Media],
  [TC-POL-013], [RF-POL-013: Paginación básica], [Alta],
  [TC-POL-014], [RF-POL-014: Cambiar tamaño página], [Media],
  [TC-POL-015], [RF-POL-015: Validar campos obligatorios], [Alta],
  [TC-POL-016], [RF-POL-016: Activar/Desactivar], [Media],
  [TC-POL-017], [RF-POL-017: Subir documentos], [Media],
  [TC-POL-018], [RF-POL-018: Eliminar documentos], [Baja],
  [TC-POL-019], [RF-POL-019: Ver detalle], [Media],
  [TC-POL-020], [RF-POL-020: Validar longitud mínima], [Media]
)

= Datos de Prueba

== Clientes de Prueba

#table(
  columns: (1fr, 2fr, 1fr),
  align: left,
  table.header(
    [*ID*], [*Nombre*], [*Tipo*]
  ),
  [1], [Juan Pérez López], [Física],
  [2], [María García Rodríguez], [Física],
  [3], [Empresa Test SA de CV], [Moral],
  [4], [Pedro López Martínez], [Física]
)

== Aseguradoras de Prueba

- GNP Seguros
- Mapfre
- Qualitas
- AXA Seguros
- Metlife

== Ramos de Prueba

- Vida
- Auto
- Daños
- Gastos Médicos Mayores
- Responsabilidad Civil

== Pólizas de Prueba

#table(
  columns: (2fr, 2fr, 1fr, 1fr),
  align: left,
  table.header(
    [*Número*], [*Cliente*], [*Aseguradora*], [*Ramo*]
  ),
  [POL-2025-001], [Juan Pérez], [GNP], [Vida],
  [POL-2025-002], [María García], [Mapfre], [Auto],
  [POL-2025-003], [Empresa Test], [Qualitas], [Auto],
  [POL-2025-004], [Juan Pérez], [GNP], [Auto],
  [POL-2025-005], [Juan Pérez], [AXA], [Daños]
)

= Ambiente de Pruebas

== Preparación del Ambiente

1. *Base de Datos*:
   - Crear base de datos de prueba separada
   - Ejecutar migrations/schema
   - Poblar catálogos (aseguradoras, ramos)
   - Insertar clientes de prueba
   - Insertar pólizas de prueba (al menos 50 para paginación)

2. *Aplicación*:
   - Ejecutar en modo desarrollo
   - Configurar para usar BD de prueba
   - Deshabilitar emails/notificaciones (si aplica)

3. *Selenium*:
   - ChromeDriver compatible instalado
   - Variables de entorno configuradas
   - Carpeta de screenshots configurada

== Limpieza Post-Pruebas

```sql
-- Limpiar datos de prueba
DELETE FROM polizas WHERE numero LIKE 'TEST-%';
DELETE FROM documentos WHERE poliza_id IN (SELECT id FROM polizas WHERE numero LIKE 'TEST-%');

-- Resetear auto-increment
DELETE FROM sqlite_sequence WHERE name='polizas';
```

= Orden de Ejecución Recomendado

== Pruebas de Humo (Smoke Tests)

Ejecutar primero para verificar funcionalidad básica:
1. TC-POL-001 (Crear póliza)
2. TC-POL-006 (Editar póliza)
3. TC-POL-008 (Búsqueda básica)
4. TC-POL-007 (Eliminar póliza)

== Pruebas de Validación

2. TC-POL-002 (Número duplicado)
3. TC-POL-003 (Validación fechas)
4. TC-POL-004 (Suma asegurada)
5. TC-POL-005 (Prima)
6. TC-POL-015 (Campos obligatorios)
7. TC-POL-020 (Longitud mínima)

== Pruebas de Búsqueda y Filtros

8. TC-POL-009 (Búsqueda por cliente)
9. TC-POL-010 (Filtro por aseguradora)
10. TC-POL-011 (Filtro por ramo)
11. TC-POL-012 (Filtros combinados)

== Pruebas de Paginación

12. TC-POL-013 (Navegar páginas)
13. TC-POL-014 (Cambiar items por página)

== Pruebas de Funcionalidades Adicionales

14. TC-POL-016 (Activar/Desactivar)
15. TC-POL-017 (Subir documento)
16. TC-POL-018 (Eliminar documento)
17. TC-POL-019 (Ver detalle)

= Tiempo Estimado

== Por Caso de Prueba

#table(
  columns: (2fr, 1fr, 1fr),
  align: left,
  table.header(
    [*Caso*], [*Manual (min)*], [*Automatizado (seg)*]
  ),
  [TC-POL-001], [5], [15],
  [TC-POL-002], [3], [10],
  [TC-POL-003], [8], [25],
  [TC-POL-004], [6], [20],
  [TC-POL-005], [6], [20],
  [TC-POL-006], [5], [15],
  [TC-POL-007], [3], [10],
  [TC-POL-008], [7], [20],
  [TC-POL-009], [5], [15],
  [TC-POL-010], [4], [12],
  [TC-POL-011], [4], [12],
  [TC-POL-012], [6], [20],
  [TC-POL-013], [8], [25],
  [TC-POL-014], [5], [15],
  [TC-POL-015], [10], [30],
  [TC-POL-016], [4], [12],
  [TC-POL-017], [6], [20],
  [TC-POL-018], [3], [10],
  [TC-POL-019], [4], [12],
  [TC-POL-020], [6], [20]
)

== Totales

- *Ejecución Manual*: ~2 horas (108 minutos)
- *Ejecución Automatizada*: ~5.5 minutos (318 segundos)
- *Desarrollo de Automatización*: ~8 horas
- *Documentación*: ~2 horas

= Herramientas y Tecnologías

== Selenium IDE

*Casos recomendados para IDE:*
- TC-POL-001 (crear póliza básica - demo)
- TC-POL-008 (búsqueda simple)
- TC-POL-019 (ver detalle - visual)

*Ventajas:*
- Grabación rápida
- Visual y fácil de entender
- Bueno para demos

== Selenium WebDriver

*Casos recomendados para WebDriver:*
- Todos los casos de validación (TC-POL-002 a TC-POL-005)
- Casos con lógica compleja (TC-POL-012, TC-POL-013)
- Casos con múltiples escenarios (TC-POL-003, TC-POL-015)

*Ventajas:*
- Control total
- Manejo de múltiples escenarios
- Integración con CI/CD
- Reportes detallados

= Criterios de Éxito del Módulo

El módulo de Pólizas se considera probado exitosamente cuando:

+ *Cobertura*: Al menos 18 de 20 casos ejecutados (90%)
+ *Tasa de éxito*: ≥ 95% de casos pasan
+ *Defectos críticos*: 0 defectos críticos sin resolver
+ *Documentación*: Todos los resultados documentados
+ *Automatización*: Al menos 15 casos automatizados con WebDriver

= Riesgos Específicos del Módulo

#table(
  columns: (2fr, 1fr, 3fr),
  align: left,
  table.header(
    [*Riesgo*], [*Impacto*], [*Mitigación*]
  ),
  [Cálculo de fechas incorrecto], [Alto], [Validar con múltiples rangos de fechas],
  [Dropdowns de catálogos no cargan], [Alto], [Verificar datos seed antes de pruebas],
  [Relaciones FK rotas], [Crítico], [Validar integridad referencial en DB],
  [Performance con muchas pólizas], [Medio], [Probar con dataset grande (1000+ pólizas)],
  [Filtros combinados fallan], [Medio], [Probar todas las combinaciones posibles]
)

= Notas Adicionales

== Consideraciones Especiales

+ *Integridad Referencial*: Las pólizas dependen de clientes y catálogos. Asegurar que existan antes de crear pólizas.

+ *Validación de Fechas*: Considerar casos edge:
  - Años bisiestos
  - Cambio de año
  - Fechas muy futuras (> 10 años)

+ *Montos Monetarios*: Validar precisión decimal (2 decimales), formateo correcto con comas y símbolo de moneda.

+ *Búsquedas y Filtros*: Considerar performance con grandes volúmenes (> 10,000 pólizas).

+ *Documentos Adjuntos*: Validar tipos MIME, tamaños máximos, y sanitización de nombres de archivo.

== Dependencias con Otros Módulos

- *Módulo de Clientes*: Debe estar funcional, ya que pólizas requieren clientes
- *Catálogo de Aseguradoras*: Debe tener al menos 3 aseguradoras
- *Catálogo de Ramos*: Debe tener al menos 5 ramos
- *Módulo de Autenticación*: Usuario debe estar autenticado

= Referencias

+ Documentación del Sistema de Seguros VILLALOBOS
+ Plan Maestro de Pruebas
+ Estrategia de Testing con Selenium
+ Plan de Pruebas - Módulo de Clientes
+ Selenium WebDriver Documentation: https://www.selenium.dev/documentation/webdriver/

---

*Fin del documento*
