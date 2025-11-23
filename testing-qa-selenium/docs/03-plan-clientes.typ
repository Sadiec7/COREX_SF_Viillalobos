#set document(
  title: "Plan de Pruebas - Módulo Clientes",
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

  #text(size: 20pt)[
    Módulo de Gestión de Clientes
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

#outline(
  title: "Tabla de Contenido",
  indent: auto,
)

#pagebreak()

= Introducción

== Propósito

Este documento detalla el plan de pruebas para el módulo de Gestión de Clientes del Sistema de Seguros VILLALOBOS, el cual es uno de los módulos más críticos del sistema.

== Alcance

El módulo de clientes comprende:
- CRUD completo de clientes (Crear, Leer, Actualizar, Eliminar)
- Gestión de clientes Persona Física y Moral
- Validaciones de RFC, email, teléfono
- Sistema de búsqueda y filtros
- Paginación de resultados
- Activar/Desactivar clientes
- Gestión de documentos adjuntos

== Referencias

- Plan Maestro de Pruebas
- Estrategia de Testing
- Especificación funcional del módulo de clientes

= Descripción del Módulo

== Funcionalidad Principal

El módulo permite gestionar la información de clientes del sistema de seguros, diferenciando entre Personas Físicas y Personas Morales, con validaciones específicas para cada tipo.

== Componentes de UI

=== Vista Principal (Lista de Clientes)

#table(
  columns: (2fr, 2fr, 3fr),
  align: left,
  table.header(
    [*Elemento*], [*ID/Selector*], [*Descripción*]
  ),
  [Buscador], [`searchInput`], [Campo de búsqueda general],
  [Botón Nuevo], [`btnAddCliente`], [Abre modal para crear cliente],
  [Tabla], [`clientesTableBody`], [Lista de clientes],
  [Paginación], [`paginationContainer`], [Controles de paginación],
  [Items/Página], [`itemsPerPageSelect`], [Selector de items por página],
  [Estado Vacío], [`emptyState`], [Mensaje cuando no hay clientes]
)

=== Modal de Cliente

#table(
  columns: (2fr, 2fr, 3fr),
  align: left,
  table.header(
    [*Campo*], [*ID*], [*Validación*]
  ),
  [Nombre], [`inputNombre`], [Requerido, min 3 caracteres],
  [RFC], [`inputRFC`], [Requerido, formato RFC válido],
  [Email], [`inputEmail`], [Formato email válido],
  [Teléfono], [`inputTelefono`], [10 dígitos],
  [Celular], [`inputCelular`], [10 dígitos],
  [Dirección], [`inputDireccion`], [Texto libre],
  [Notas], [`inputNotas`], [Máx 500 caracteres]
)

== Reglas de Negocio

+ *RFC Persona Física*: 13 caracteres (AAAA######XXX)
+ *RFC Persona Moral*: 12 caracteres (AAA######XXX)
+ *Email*: Formato válido usuario@dominio.com
+ *Teléfono/Celular*: Exactamente 10 dígitos
+ *Nombre*: Mínimo 3 caracteres, máximo 255
+ *RFC único*: No puede haber dos clientes con mismo RFC
+ *Cliente eliminado*: Se marca como inactivo, no se borra físicamente

= Casos de Prueba

== TC-CLI-001: Crear Cliente Persona Física

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium IDE + WebDriver

=== Descripción
Verificar que se puede crear un cliente Persona Física con todos los datos válidos.

=== Precondiciones
- Usuario autenticado
- En vista de clientes (`/app#clientes`)

=== Datos de Prueba
```
Nombre: Juan Pérez López
RFC: PELJ850101ABC
Email: juan.perez@test.com
Teléfono: 5551234567
Celular: 5559876543
Dirección: Calle Reforma 123, CDMX
Notas: Cliente preferente
```

=== Pasos
1. Hacer clic en botón "Nuevo Cliente"
2. Verificar que modal se abre
3. Ingresar todos los datos
4. Hacer clic en "Guardar"
5. Esperar cierre de modal
6. Verificar que cliente aparece en tabla

=== Resultado Esperado
- Modal se cierra
- Toast message: "Cliente creado correctamente"
- Cliente visible en primera página de tabla
- Datos coinciden con los ingresados

=== Criterios de Aceptación
- [ ] Cliente se crea en menos de 2 segundos
- [ ] RFC se guarda en mayúsculas
- [ ] Cliente tiene ID asignado
- [ ] Estado es "Activo" por defecto

---

== TC-CLI-002: Crear Cliente Persona Moral

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se puede crear un cliente Persona Moral.

=== Datos de Prueba
```
Nombre: Empresa Test SA de CV
RFC: ETE850101XYZ
Email: contacto@empresa.test
Teléfono: 5559999999
Dirección: Av. Insurgentes 500, CDMX
```

=== Pasos
1. Clic en "Nuevo Cliente"
2. Ingresar datos de Persona Moral
3. Guardar
4. Verificar creación

=== Resultado Esperado
- Cliente Persona Moral creado
- RFC de 12 caracteres aceptado
- Badge muestra "Moral" en tabla

=== Criterios de Aceptación
- [ ] RFC Moral (12 chars) validado correctamente
- [ ] Tipo "Moral" asignado automáticamente
- [ ] Aparece en tabla con badge morado

---

== TC-CLI-003: Validación de RFC Formato Correcto

*Prioridad:* Alta \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que el sistema valida el formato correcto del RFC.

=== Escenarios

==== 3a: RFC Persona Física válido
```
RFC: PELJ850101ABC (13 caracteres)
Resultado: Aceptado
```

==== 3b: RFC Persona Moral válido
```
RFC: EMP850101ABC (12 caracteres)
Resultado: Aceptado
```

==== 3c: RFC inválido - muy corto
```
RFC: PELJ85010 (11 caracteres)
Resultado: Rechazado - "RFC inválido. Formato: AAAA######XXX"
```

==== 3d: RFC inválido - caracteres especiales
```
RFC: PELJ@50101ABC
Resultado: Rechazado - "RFC contiene caracteres inválidos"
```

==== 3e: RFC inválido - minúsculas
```
RFC: pelj850101abc
Resultado: Auto-convertido a mayúsculas: PELJ850101ABC
```

=== Criterios de Aceptación
- [ ] Validación en tiempo real (al perder focus)
- [ ] Mensaje específico por cada tipo de error
- [ ] Auto-conversión a mayúsculas
- [ ] Borde rojo en campo inválido

---

== TC-CLI-004: Validación de Email Formato

*Prioridad:* Media \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Casos de Prueba

#table(
  columns: (3fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Email*], [*Válido*], [*Mensaje*]
  ),
  [`usuario@dominio.com`], [✓], [Aceptado],
  [`test@test.com.mx`], [✓], [Aceptado],
  [`user.name@domain.co`], [✓], [Aceptado],
  [`invalido@`], [✗], [Email inválido],
  [`@dominio.com`], [✗], [Email inválido],
  [`sin-arroba.com`], [✗], [Email inválido],
  [`con espacios@test.com`], [✗], [Email inválido]
)

=== Criterios de Aceptación
- [ ] Validación con regex estándar
- [ ] Email es opcional (puede estar vacío)
- [ ] Si se llena, debe ser válido

---

== TC-CLI-005: Validación de Teléfono (10 dígitos)

*Prioridad:* Media \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que teléfono y celular aceptan exactamente 10 dígitos.

=== Casos de Prueba

#table(
  columns: (2fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Teléfono*], [*Válido*], [*Mensaje*]
  ),
  [`5551234567`], [✓], [Aceptado],
  [`123456789`], [✗], [Debe tener 10 dígitos],
  [`12345678901`], [✗], [Debe tener 10 dígitos],
  [`55-5123-4567`], [✗], [Solo números permitidos],
  [`abcd123456`], [✗], [Solo números permitidos]
)

=== Criterios de Aceptación
- [ ] Input type="tel" o pattern numérico
- [ ] Validación de 10 dígitos exactos
- [ ] Solo acepta números (0-9)
- [ ] Teléfono y celular son opcionales

---

== TC-CLI-006: Editar Cliente Existente

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se puede editar la información de un cliente existente.

=== Precondiciones
- Cliente con ID conocido existe en BD
- Cliente: "Juan Pérez López", RFC: "PELJ850101ABC"

=== Pasos
1. Buscar cliente "Juan Pérez"
2. Hacer clic en botón "Editar" (ícono lápiz)
3. Modal se abre con datos precargados
4. Modificar email a: "nuevo.email@test.com"
5. Modificar teléfono a: "5559999999"
6. Guardar cambios
7. Verificar actualización en tabla

=== Resultado Esperado
- Modal muestra datos correctos precargados
- Cambios se guardan exitosamente
- Toast: "Cliente actualizado correctamente"
- Tabla refleja nuevos valores
- RFC no cambia (no editable o validado)

=== Criterios de Aceptación
- [ ] Datos precargados son correctos
- [ ] Solo campos modificados se actualizan
- [ ] Actualización en menos de 2 segundos
- [ ] ID del cliente no cambia

---

== TC-CLI-007: Eliminar Cliente

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se puede eliminar (marcar como inactivo) un cliente.

=== Precondiciones
- Cliente de prueba existe en sistema

=== Pasos
1. Localizar cliente en tabla
2. Hacer clic en botón "Eliminar" (ícono basura)
3. Aparece modal de confirmación
4. Leer mensaje: "¿Está seguro de que desea eliminar..."
5. Hacer clic en "Eliminar"
6. Esperar confirmación

=== Resultado Esperado
- Modal de confirmación aparece
- Al confirmar, cliente se marca como inactivo
- Toast: "Cliente eliminado correctamente"
- Cliente desaparece de lista (si filtro solo activos)
- Cliente aún existe en BD (soft delete)

=== Criterios de Aceptación
- [ ] Requiere confirmación (no elimina directo)
- [ ] Mensaje claro en confirmación
- [ ] Opción "Cancelar" cancela acción
- [ ] Soft delete (activo=false)

---

== TC-CLI-008: Búsqueda por Nombre

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que la búsqueda por nombre funciona correctamente.

=== Precondiciones
- BD contiene:
  - "Juan Pérez López"
  - "María García Rodríguez"
  - "Pedro Martínez Sánchez"

=== Escenarios

==== 8a: Búsqueda exacta
```
Buscar: "Juan Pérez"
Resultado: 1 cliente encontrado
```

==== 8b: Búsqueda parcial
```
Buscar: "García"
Resultado: 1 cliente (María García)
```

==== 8c: Búsqueda sin resultados
```
Buscar: "Cliente Inexistente"
Resultado: Estado vacío, mensaje "No hay clientes"
```

==== 8d: Case insensitive
```
Buscar: "juan pérez" (minúsculas)
Resultado: 1 cliente encontrado (Juan Pérez)
```

=== Criterios de Aceptación
- [ ] Búsqueda en tiempo real (debounce 300ms)
- [ ] Case insensitive
- [ ] Busca en nombre completo
- [ ] Muestra resultados inmediatamente

---

== TC-CLI-009: Búsqueda por RFC

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se puede buscar cliente por RFC.

=== Datos de Prueba
- Cliente 1: RFC "PELJ850101ABC"
- Cliente 2: RFC "GARC900505XYZ"

=== Pasos
1. En campo de búsqueda, escribir: "PELJ"
2. Observar resultados filtrados
3. Escribir RFC completo: "PELJ850101ABC"
4. Verificar que solo aparece 1 cliente

=== Resultado Esperado
- Búsqueda por RFC funciona
- Coincidencias parciales muestran resultados
- RFC completo muestra cliente exacto

=== Criterios de Aceptación
- [ ] Busca en campo RFC
- [ ] Auto-convierte a mayúsculas búsqueda
- [ ] Acepta búsquedas parciales

---

== TC-CLI-010: Filtro por Tipo de Persona

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se pueden filtrar clientes por tipo (Física/Moral).

=== Precondiciones
- BD contiene:
  - 5 Personas Físicas
  - 3 Personas Morales

=== Pasos
1. Hacer clic en filtro "Persona Física"
2. Verificar que solo se muestran 5 clientes
3. Todos tienen badge "Física" verde
4. Hacer clic en filtro "Persona Moral"
5. Verificar que solo se muestran 3 clientes
6. Todos tienen badge "Moral" morado
7. Desactivar filtros
8. Verificar que se muestran todos (8 clientes)

=== Criterios de Aceptación
- [ ] Filtros son mutuamente exclusivos o acumulativos
- [ ] Contador se actualiza con filtros
- [ ] Se puede limpiar filtros fácilmente

---

== TC-CLI-011: Paginación - Navegar Páginas

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que la paginación permite navegar entre páginas.

=== Precondiciones
- BD contiene 25 clientes
- Items por página configurado en 10

=== Pasos
1. Verificar que se muestran 10 clientes (página 1)
2. Verificar info: "Mostrando 1 - 10 de 25"
3. Hacer clic en botón "Página 2"
4. Verificar que se muestran clientes 11-20
5. Info: "Mostrando 11 - 20 de 25"
6. Hacer clic en botón "Siguiente" (>)
7. Debe ir a página 3
8. Verificar clientes 21-25
9. Info: "Mostrando 21 - 25 de 25"
10. Botón "Siguiente" debe estar deshabilitado

=== Criterios de Aceptación
- [ ] Botones de página numerados correctamente
- [ ] Página actual resaltada (color dorado)
- [ ] Botones Anterior/Siguiente funcionan
- [ ] Límites respetados (no ir más allá)

---

== TC-CLI-012: Paginación - Cambiar Items por Página

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se puede cambiar cantidad de items por página.

=== Precondiciones
- BD contiene 35 clientes

=== Escenarios

#table(
  columns: (1fr, 2fr, 2fr),
  align: left,
  table.header(
    [*Opción*], [*Páginas*], [*Info Página 1*]
  ),
  [10], [4 páginas], [Mostrando 1 - 10 de 35],
  [25], [2 páginas], [Mostrando 1 - 25 de 35],
  [50], [1 página], [Mostrando 1 - 35 de 35],
  [100], [1 página], [Mostrando 1 - 35 de 35]
)

=== Pasos
1. Seleccionar "25" en dropdown "Por página"
2. Verificar que tabla muestra 25 clientes
3. Verificar que hay 2 páginas total
4. Cambiar a "50"
5. Verificar que todos los clientes caben en 1 página

=== Criterios de Aceptación
- [ ] Dropdown funciona correctamente
- [ ] Vuelve a página 1 al cambiar items/página
- [ ] Total de páginas se recalcula
- [ ] Tabla se actualiza inmediatamente

---

== TC-CLI-013: Activar/Desactivar Cliente

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se puede activar/desactivar un cliente sin eliminarlo.

=== Precondiciones
- Cliente activo en sistema

=== Pasos - Desactivar
1. Localizar cliente activo en tabla
2. Hacer clic en botón "Pausar" (ícono pausa)
3. Aparece confirmación: "¿Desea desactivar este cliente?"
4. Confirmar
5. Observar cambio de estado

=== Resultado Esperado - Desactivar
- Toast: "Cliente desactivado correctamente"
- Ícono cambia de "pausa" a "play"
- Color del botón cambia de naranja a verde

=== Pasos - Activar
1. Hacer clic en botón "Play" (activar)
2. Confirmar acción
3. Observar cambio

=== Resultado Esperado - Activar
- Toast: "Cliente activado correctamente"
- Ícono vuelve a "pausa"
- Cliente totalmente funcional

=== Criterios de Aceptación
- [ ] Toggle funciona correctamente
- [ ] Estado persiste en BD
- [ ] Visual feedback claro (iconos, colores)

---

== TC-CLI-014: Campos Obligatorios Vacíos

*Prioridad:* Alta \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que campos obligatorios no permiten guardar si están vacíos.

=== Campos Obligatorios
- Nombre (*)
- RFC (*)

=== Escenarios

==== 14a: Todos vacíos
```
Nombre: [vacío]
RFC: [vacío]
Resultado: Validación HTML5 en campo Nombre
```

==== 14b: Solo Nombre vacío
```
Nombre: [vacío]
RFC: PELJ850101ABC
Resultado: "El nombre es requerido"
```

==== 14c: Solo RFC vacío
```
Nombre: Juan Pérez
RFC: [vacío]
Resultado: "El RFC es requerido"
```

=== Criterios de Aceptación
- [ ] Validación antes de submit
- [ ] Atributo `required` en HTML
- [ ] Mensajes claros
- [ ] No se envía request si hay errores

---

== TC-CLI-015: RFC Duplicado

*Prioridad:* Alta \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que el sistema no permite crear dos clientes con el mismo RFC.

=== Precondiciones
- Cliente existente con RFC: "PELJ850101ABC"

=== Pasos
1. Intentar crear nuevo cliente
2. Usar mismo RFC: "PELJ850101ABC"
3. Llenar otros campos con datos diferentes
4. Intentar guardar

=== Resultado Esperado
- Backend rechaza creación
- Toast error: "Ya existe un cliente con este RFC"
- Modal permanece abierto
- Datos ingresados no se pierden
- Campo RFC se marca como inválido

=== Criterios de Aceptación
- [ ] Validación en backend (no solo frontend)
- [ ] Mensaje específico de RFC duplicado
- [ ] No se crea registro duplicado
- [ ] Usuario puede corregir sin perder datos

---

== TC-CLI-016: Subir Documento Adjunto

*Prioridad:* Baja \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se pueden adjuntar documentos al crear/editar cliente.

=== Precondiciones
- Archivo de prueba: "identificacion.pdf" (< 5MB)

=== Pasos
1. Abrir modal de nuevo cliente
2. Arrastrar archivo a zona de dropzone
3. O hacer clic en "Seleccionar archivo"
4. Elegir "identificacion.pdf"
5. Verificar preview/nombre del archivo
6. Completar otros campos
7. Guardar cliente

=== Resultado Esperado
- Archivo se carga correctamente
- Preview o nombre visible en modal
- Al guardar, documento se asocia a cliente
- Se puede ver/descargar después

=== Criterios de Aceptación
- [ ] Drag & drop funciona
- [ ] Click para seleccionar funciona
- [ ] Validación de tamaño (< 5MB)
- [ ] Tipos permitidos: PDF, JPG, PNG
- [ ] Archivo se guarda en filesystem/BD

---

== TC-CLI-017: Eliminar Documento Adjunto

*Prioridad:* Baja \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que se pueden eliminar documentos previamente adjuntos.

=== Precondiciones
- Cliente con documento adjunto existe

=== Pasos
1. Editar cliente que tiene documentos
2. En sección de documentos, ver lista
3. Hacer clic en "X" o ícono eliminar
4. Confirmar eliminación
5. Guardar cambios

=== Resultado Esperado
- Documento se marca para eliminación
- Al guardar, archivo se elimina
- Toast: "Documento eliminado"

=== Criterios de Aceptación
- [ ] Requiere confirmación
- [ ] Archivo se elimina de storage
- [ ] Referencia se elimina de BD

---

== TC-CLI-018: Ver Detalle de Cliente (Click en Fila)

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que hacer clic en una fila abre el cliente en modo edición.

=== Pasos
1. En tabla de clientes, hacer clic en cualquier parte de la fila
2. (Excepto en botones de acción)
3. Observar comportamiento

=== Resultado Esperado
- Modal se abre en modo edición
- Título: "Editar Cliente"
- Datos del cliente precargados
- Se puede modificar información

=== Criterios de Aceptación
- [ ] Click en fila (no en botones) abre modal
- [ ] event.stopPropagation() en botones
- [ ] Modo edición claro (título diferente)
- [ ] Botón guardar dice "Actualizar"

---

== TC-CLI-019: Estado Vacío - No Hay Clientes

*Prioridad:* Baja \
*Tipo:* UI/UX \
*Herramienta:* Selenium IDE

=== Descripción
Verificar que cuando no hay clientes, se muestra estado vacío apropiado.

=== Precondiciones
- Base de datos sin clientes (nueva instalación o test)

=== Pasos
1. Navegar a vista de clientes
2. Observar mensaje de estado vacío

=== Resultado Esperado
- Tabla no se muestra
- Ícono ilustrativo visible
- Mensaje: "No hay clientes"
- Submensaje: "Comienza agregando un nuevo cliente"
- Botón "Nuevo Cliente" destacado

=== Criterios de Aceptación
- [ ] Mensaje claro y amigable
- [ ] Ícono SVG apropiado
- [ ] Call-to-action visible
- [ ] No se muestran controles de paginación

---

== TC-CLI-020: Validación de Nombre - Longitud Mínima

*Prioridad:* Media \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar validación de longitud mínima en campo nombre.

=== Casos de Prueba

#table(
  columns: (2fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Nombre*], [*Caracteres*], [*Resultado*]
  ),
  [`AB`], [2], [Rechazado - mínimo 3],
  [`ABC`], [3], [Aceptado],
  [`A`], [1], [Rechazado - mínimo 3],
  [[vacío]], [0], [Rechazado - requerido]
)

=== Pasos
1. Intentar ingresar nombre de 2 caracteres
2. Intentar guardar

=== Resultado Esperado
- Mensaje: "Mínimo 3 caracteres"
- Campo marcado como inválido
- No se puede guardar

=== Criterios de Aceptación
- [ ] Validación en tiempo real
- [ ] minLength=3 en input
- [ ] Mensaje específico

---

= Matriz de Trazabilidad

#table(
  columns: (1.5fr, 2.5fr, 1fr),
  align: left,
  table.header(
    [*Caso*], [*Requerimiento*], [*Prioridad*]
  ),
  [TC-CLI-001], [RF-CLI-01: Crear cliente Física], [Alta],
  [TC-CLI-002], [RF-CLI-02: Crear cliente Moral], [Alta],
  [TC-CLI-003], [RF-CLI-03: Validar RFC], [Alta],
  [TC-CLI-004], [RF-CLI-04: Validar email], [Media],
  [TC-CLI-005], [RF-CLI-05: Validar teléfono], [Media],
  [TC-CLI-006], [RF-CLI-06: Editar cliente], [Alta],
  [TC-CLI-007], [RF-CLI-07: Eliminar cliente], [Alta],
  [TC-CLI-008], [RF-CLI-08: Búsqueda nombre], [Alta],
  [TC-CLI-009], [RF-CLI-09: Búsqueda RFC], [Alta],
  [TC-CLI-010], [RF-CLI-10: Filtro tipo], [Media],
  [TC-CLI-011], [RF-CLI-11: Paginación], [Alta],
  [TC-CLI-012], [RF-CLI-12: Items/página], [Media],
  [TC-CLI-013], [RF-CLI-13: Activar/Desactivar], [Media],
  [TC-CLI-014], [RF-CLI-14: Campos obligatorios], [Alta],
  [TC-CLI-015], [RF-CLI-15: RFC único], [Alta],
  [TC-CLI-016], [RF-CLI-16: Subir documento], [Baja],
  [TC-CLI-017], [RF-CLI-17: Eliminar documento], [Baja],
  [TC-CLI-018], [RF-CLI-18: Ver detalle], [Media],
  [TC-CLI-019], [RNF-CLI-01: Estado vacío], [Baja],
  [TC-CLI-020], [RF-CLI-20: Validar longitud], [Media]
)

= Datos de Prueba

== Clientes de Prueba - Personas Físicas

#table(
  columns: (2fr, 1.5fr, 2fr),
  align: left,
  table.header(
    [*Nombre*], [*RFC*], [*Email*]
  ),
  [Juan Pérez López], [PELJ850101ABC], [juan.perez@test.com],
  [María García R.], [GARM900505XYZ], [maria.garcia@test.com],
  [Pedro Martínez S.], [MASP750815DEF], [pedro.martinez@test.com]
)

== Clientes de Prueba - Personas Morales

#table(
  columns: (2fr, 1.5fr, 2fr),
  align: left,
  table.header(
    [*Razón Social*], [*RFC*], [*Email*]
  ),
  [Empresa Test SA], [ETE850101XYZ], [contacto@empresa.test],
  [Comercial ABC], [CAB900101ABC], [info@comercial.test],
  [Servicios XYZ], [SXY800101DEF], [ventas@servicios.test]
)

= Ambiente de Pruebas

== Preparación

1. Crear BD de prueba limpia
2. Insertar datos de prueba base
3. Preparar archivos para adjuntar (PDFs de prueba)
4. Limpiar localStorage/sessionStorage
5. Configurar paginación a 10 items

== Limpieza

- Eliminar clientes creados durante pruebas
- Limpiar archivos adjuntos
- Restaurar datos base
- Vaciar tabla de clientes de prueba

= Criterios de Aceptación del Módulo

+ *CRUD completo funcional* al 100%
+ *Validaciones* funcionan correctamente
+ *Búsqueda y filtros* operativos
+ *Paginación* maneja correctamente hasta 1000 registros
+ *Sin defectos críticos* o altos
+ *Tiempo de respuesta* < 2 segundos por operación

= Riesgos

#table(
  columns: (2fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Riesgo*], [*Prob.*], [*Mitigación*]
  ),
  [Cambios en validaciones], [Media], [Mantener tests actualizados],
  [Paginación con datos grandes], [Baja], [Probar con dataset > 100 items],
  [Archivos adjuntos grandes], [Media], [Validar límite de 5MB],
  [RFC duplicados no detectados], [Baja], [Validación en backend]
)

= Ejecución

== Tiempo Estimado

- Preparación: 20 minutos
- Ejecución manual: 2 horas
- Ejecución automatizada: 10 minutos
- Análisis: 30 minutos

== Orden Recomendado

1. TC-CLI-001, 002 (Crear)
2. TC-CLI-006 (Editar)
3. TC-CLI-007 (Eliminar)
4. TC-CLI-008, 009 (Búsqueda)
5. TC-CLI-011, 012 (Paginación)
6. TC-CLI-003, 004, 005 (Validaciones)
7. TC-CLI-010, 013 (Filtros y estados)
8. TC-CLI-014, 015, 020 (Validaciones críticas)
9. TC-CLI-016, 017 (Documentos)
10. TC-CLI-018, 019 (UI/UX)

---

*Fin del Plan de Pruebas - Módulo Clientes*
