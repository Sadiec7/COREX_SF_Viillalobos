#set document(
  title: "Plan de Pruebas - Módulo Documentos",
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
    Módulo de Gestión de Documentos
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

Este documento detalla el plan de pruebas para el módulo de Gestión de Documentos del Sistema de Seguros VILLALOBOS, que permite adjuntar archivos a clientes y pólizas.

== Alcance

El módulo de documentos comprende:
- Subida de archivos (PDF, imágenes, documentos)
- Asociación de documentos a clientes o pólizas
- Selección múltiple de documentos
- Descarga de documentos
- Eliminación individual y masiva
- Búsqueda y filtros por alcance
- Visualización de metadatos

== Referencias

- Plan Maestro de Pruebas
- Plan de Pruebas de Clientes (TC-CLI)
- Plan de Pruebas de Pólizas (TC-POL)

= Descripción del Módulo

== Funcionalidad Principal

Gestión de archivos adjuntos:
- Subir documentos desde el navegador
- Almacenamiento en sistema de archivos
- Metadata en base de datos
- Descarga de archivos
- Eliminación con confirmación

== Campos del Documento

- documento_id (PK)
- nombre_archivo
- tipo_archivo (mime type)
- ruta_archivo
- tamaño (bytes)
- cliente_id (FK, nullable)
- poliza_id (FK, nullable)
- fecha_creacion

= Casos de Prueba

== TC-DOC-001: Subir Documento para Cliente

*Descripción:* Verificar subida de archivo asociado a cliente

*Precondiciones:*
- Usuario autenticado
- En módulo Documentos
- Existe cliente

*Pasos:*
1. Click "Nuevo Documento"
2. Seleccionar alcance "Cliente"
3. Seleccionar cliente del dropdown
4. Seleccionar archivo PDF
5. Guardar

*Resultado Esperado:*
- Documento se sube exitosamente
- Aparece en tabla con icono de cliente
- Metadatos correctos (nombre, tamaño, fecha)
- Toast de éxito

*Prioridad:* Alta

---

== TC-DOC-002: Subir Documento para Póliza

*Descripción:* Verificar subida asociada a póliza

*Pasos:*
1. Nuevo documento
2. Alcance "Póliza"
3. Seleccionar póliza
4. Seleccionar archivo
5. Guardar

*Resultado Esperado:*
- Documento asociado a póliza
- Visible en tabla con icono de póliza

*Prioridad:* Alta

---

== TC-DOC-003: Validación Sin Archivo Seleccionado

*Descripción:* Verificar que se requiere archivo

*Pasos:*
1. Abrir modal
2. Seleccionar cliente
3. NO seleccionar archivo
4. Intentar guardar

*Resultado Esperado:*
- Error "Selecciona un archivo"
- No se crea documento

*Prioridad:* Alta

---

== TC-DOC-004: Validación Sin Cliente/Póliza

*Descripción:* Verificar que se requiere asociación

*Pasos:*
1. Seleccionar archivo
2. NO seleccionar cliente ni póliza
3. Guardar

*Resultado Esperado:*
- Error de validación
- No se guarda

*Prioridad:* Alta

---

== TC-DOC-005: Subir Imagen (JPG/PNG)

*Descripción:* Verificar soporte de imágenes

*Pasos:*
1. Subir archivo .png o .jpg
2. Guardar

*Resultado Esperado:*
- Imagen se sube correctamente
- Tipo MIME correcto

*Prioridad:* Media

---

== TC-DOC-006: Subir Documento Word/Excel

*Descripción:* Verificar soporte de Office

*Pasos:*
1. Subir .docx o .xlsx
2. Guardar

*Resultado Esperado:*
- Se acepta y guarda

*Prioridad:* Media

---

== TC-DOC-007: Descargar Documento

*Descripción:* Verificar descarga de archivo

*Precondiciones:*
- Documento existe

*Pasos:*
1. Click en botón descargar (icono download)
2. Esperar descarga

*Resultado Esperado:*
- Archivo se descarga
- Nombre correcto
- Contenido íntegro

*Prioridad:* Alta

---

== TC-DOC-008: Eliminar Documento Individual

*Descripción:* Verificar eliminación de un documento

*Pasos:*
1. Click en botón eliminar (X roja)
2. Confirmar en modal

*Resultado Esperado:*
- Documento eliminado de BD y filesystem
- Desaparece de tabla
- Toast de éxito

*Prioridad:* Alta

---

== TC-DOC-009: Cancelar Eliminación

*Descripción:* Verificar cancelación de eliminar

*Pasos:*
1. Click eliminar
2. Click "Cancelar" en modal

*Resultado Esperado:*
- Modal se cierra
- Documento permanece

*Prioridad:* Media

---

== TC-DOC-010: Seleccionar Múltiples Documentos

*Descripción:* Verificar selección con checkbox

*Precondiciones:*
- Existen varios documentos

*Pasos:*
1. Check en checkbox de 3 documentos
2. Observar selección

*Resultado Esperado:*
- Filas seleccionadas tienen fondo azul
- Contador "3 seleccionados" visible
- Botón "Eliminar seleccionados" habilitado

*Prioridad:* Media

---

== TC-DOC-011: Seleccionar Todos

*Descripción:* Verificar checkbox maestro

*Pasos:*
1. Click en checkbox del header
2. Observar

*Resultado Esperado:*
- Todos los documentos se seleccionan
- Todas las filas con fondo azul

*Prioridad:* Media

---

== TC-DOC-012: Deseleccionar Todos

*Descripción:* Verificar deselección masiva

*Precondiciones:*
- Varios documentos seleccionados

*Pasos:*
1. Click en checkbox maestro (deseleccionar)

*Resultado Esperado:*
- Todas las selecciones se quitan
- Fondos vuelven a normal

*Prioridad:* Media

---

== TC-DOC-013: Eliminar Seleccionados

*Descripción:* Verificar eliminación masiva

*Precondiciones:*
- 3 documentos seleccionados

*Pasos:*
1. Click "Eliminar seleccionados"
2. Confirmar

*Resultado Esperado:*
- Los 3 documentos se eliminan
- Toast de éxito
- Tabla se actualiza

*Prioridad:* Alta

---

== TC-DOC-014: Filtro por Alcance "Cliente"

*Descripción:* Filtrar solo documentos de clientes

*Pasos:*
1. Abrir filtros
2. Seleccionar "Cliente"
3. Aplicar

*Resultado Esperado:*
- Solo documentos con cliente_id visible
- Badge de filtro: 1

*Prioridad:* Media

---

== TC-DOC-015: Filtro por Alcance "Póliza"

*Descripción:* Filtrar solo documentos de pólizas

*Pasos:*
1. Filtro "Póliza"
2. Aplicar

*Resultado Esperado:*
- Solo documentos con poliza_id

*Prioridad:* Media

---

== TC-DOC-016: Búsqueda por Nombre de Archivo

*Descripción:* Buscar documento por nombre

*Pasos:*
1. Ingresar "contrato" en búsqueda
2. Esperar

*Resultado Esperado:*
- Documentos con "contrato" en nombre
- Case-insensitive

*Prioridad:* Media

---

== TC-DOC-017: Búsqueda por Cliente

*Descripción:* Buscar por nombre de cliente

*Pasos:*
1. Buscar "Juan Pérez"

*Resultado Esperado:*
- Documentos de ese cliente

*Prioridad:* Media

---

== TC-DOC-018: Búsqueda por Póliza

*Descripción:* Buscar por número de póliza

*Pasos:*
1. Buscar número de póliza

*Resultado Esperado:*
- Documentos de esa póliza

*Prioridad:* Media

---

== TC-DOC-019: Paginación

*Descripción:* Verificar navegación entre páginas

*Precondiciones:*
- Más de 10 documentos

*Pasos:*
1. Navegar a página 2

*Resultado Esperado:*
- Siguientes 10 documentos
- Indicador correcto

*Prioridad:* Baja

---

== TC-DOC-020: Visualización de Tamaño de Archivo

*Descripción:* Verificar formato de tamaño

*Pasos:*
1. Observar columna "Tamaño"

*Resultado Esperado:*
- Formato legible (KB, MB)
- No bytes crudos

*Prioridad:* Baja

---

== TC-DOC-021: Fecha de Creación

*Descripción:* Verificar formato de fecha

*Pasos:*
1. Observar columna "Fecha"

*Resultado Esperado:*
- Formato DD/MM/YYYY
- Fecha actual para documentos nuevos

*Prioridad:* Baja

---

== TC-DOC-022: Estado Vacío

*Descripción:* Verificar mensaje sin documentos

*Precondiciones:*
- Sin documentos o filtro sin coincidencias

*Pasos:*
1. Observar vista

*Resultado Esperado:*
- Mensaje "No hay documentos"
- Icono de documento
- Sugerencia de subir

*Prioridad:* Baja

---

== TC-DOC-023: Cambiar Alcance de Cliente a Póliza

*Descripción:* Verificar cambio de asociación

*Pasos:*
1. Editar documento de cliente
2. Cambiar alcance a "Póliza"
3. Seleccionar póliza
4. Guardar

*Resultado Esperado:*
- cliente_id se limpia
- poliza_id se establece
- Icono cambia

*Prioridad:* Media

---

== TC-DOC-024: Validación Archivo Muy Grande (>10MB)

*Descripción:* Verificar límite de tamaño (si existe)

*Pasos:*
1. Intentar subir archivo de 50MB

*Resultado Esperado:*
- Error de tamaño
- O subida exitosa (según límite configurado)

*Prioridad:* Media

---

== TC-DOC-025: Caracteres Especiales en Nombre

*Descripción:* Verificar manejo de nombres con ñ, tildes

*Pasos:*
1. Subir archivo "Póliza - José Muñoz.pdf"

*Resultado Esperado:*
- Nombre se preserva correctamente
- Descarga funciona

*Prioridad:* Media

---

= Matriz de Trazabilidad

#table(
  columns: (auto, auto, auto, auto),
  [*Caso*], [*Funcionalidad*], [*Prioridad*], [*Estado*],
  [TC-DOC-001], [Subida], [Alta], [Pendiente],
  [TC-DOC-002], [Subida], [Alta], [Pendiente],
  [TC-DOC-003], [Validación], [Alta], [Pendiente],
  [TC-DOC-004], [Validación], [Alta], [Pendiente],
  [TC-DOC-005], [Subida], [Media], [Pendiente],
  [TC-DOC-006], [Subida], [Media], [Pendiente],
  [TC-DOC-007], [Descarga], [Alta], [Pendiente],
  [TC-DOC-008], [Eliminar], [Alta], [Pendiente],
  [TC-DOC-009], [Eliminar], [Media], [Pendiente],
  [TC-DOC-010], [Selección], [Media], [Pendiente],
  [TC-DOC-011], [Selección], [Media], [Pendiente],
  [TC-DOC-012], [Selección], [Media], [Pendiente],
  [TC-DOC-013], [Eliminar Masivo], [Alta], [Pendiente],
  [TC-DOC-014], [Filtros], [Media], [Pendiente],
  [TC-DOC-015], [Filtros], [Media], [Pendiente],
  [TC-DOC-016], [Búsqueda], [Media], [Pendiente],
  [TC-DOC-017], [Búsqueda], [Media], [Pendiente],
  [TC-DOC-018], [Búsqueda], [Media], [Pendiente],
  [TC-DOC-019], [Paginación], [Baja], [Pendiente],
  [TC-DOC-020], [UI], [Baja], [Pendiente],
  [TC-DOC-021], [UI], [Baja], [Pendiente],
  [TC-DOC-022], [UX], [Baja], [Pendiente],
  [TC-DOC-023], [Edición], [Media], [Pendiente],
  [TC-DOC-024], [Validación], [Media], [Pendiente],
  [TC-DOC-025], [I18n], [Media], [Pendiente],
)

= Criterios de Aceptación

*Casos Críticos:*
- TC-DOC-001, 002: Subida correcta
- TC-DOC-003, 004: Validaciones
- TC-DOC-007: Descarga
- TC-DOC-008: Eliminación
- TC-DOC-013: Eliminación masiva

*Cobertura Mínima:* 85%

= Recursos

*Archivos de Prueba:*
- PDF de 100KB
- Imagen PNG de 500KB
- Documento Word de 1MB
- Archivo grande de 15MB (para límites)

= Cronograma

- *Día 1:* Implementar DocumentosPage.js
- *Día 2:* TC-DOC-001 a TC-DOC-009 (Subida y Eliminación)
- *Día 3:* TC-DOC-010 a TC-DOC-018 (Selección, Filtros, Búsqueda)
- *Día 4:* TC-DOC-019 a TC-DOC-025 (Edge cases)
- *Día 5:* Regresión y reportes

= Riesgos

*R-DOC-001:* Manejo de archivos en filesystem
- Sistema operativo puede afectar rutas
- *Mitigación:* Usar rutas relativas

*R-DOC-002:* Límites de tamaño variables
- Puede cambiar según configuración
- *Mitigación:* Parametrizar límite

= Conclusiones

El módulo de Documentos es crítico para el archivo digital. Requiere:
- Validación robusta de subidas
- Manejo seguro de archivos
- UX clara para selección múltiple

Total de casos: *25*
