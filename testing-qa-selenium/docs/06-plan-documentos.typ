#import "template.typ": *

#show: project.with(
  title: "Plan de Pruebas - Documentos",
  authors: (
    "QA Team",
  ),
  date: "Noviembre 24, 2025",
)

= Introducción

Este documento define el plan de pruebas para el módulo de *Gestión de Documentos*, que permite administrar archivos asociados a clientes y pólizas en el sistema.

== Alcance

El plan cubre:
- Visualización y navegación de documentos
- Creación de documentos (upload de archivos)
- Asociación a clientes y pólizas
- Búsqueda y filtrado
- Apertura y visualización de archivos
- Eliminación de documentos
- Exportación masiva de documentos
- Paginación y selección masiva

= Casos de Prueba

== 1. Visualización y Navegación

=== TC-DOC-001: Visualizar lista de documentos
*Prioridad:* Alta \
*Descripción:* Verificar que la vista de documentos carga correctamente mostrando la lista de documentos. \
*Precondiciones:* Sistema con documentos registrados. \
*Pasos:*
1. Navegar a la vista de Documentos
2. Esperar a que cargue la tabla
3. Verificar que se muestra la tabla con documentos
4. Verificar que la métrica "Documentos encontrados" muestra un número mayor a 0

*Resultado esperado:* La lista de documentos se muestra correctamente con sus datos básicos.

---

=== TC-DOC-002: Verificar columnas de la tabla
*Prioridad:* Media \
*Descripción:* Confirmar que todas las columnas necesarias están presentes. \
*Precondiciones:* Estar en la vista de Documentos. \
*Pasos:*
1. Observar el encabezado de la tabla
2. Verificar presencia de columnas: ID, Asociado a, Tipo, Archivo, Registro, Acciones

*Resultado esperado:* Todas las columnas están visibles y correctamente etiquetadas.

---

=== TC-DOC-003: Click en fila abre modal de detalle
*Prioridad:* Alta \
*Descripción:* Al hacer click en una fila, se debe abrir el modal con el detalle del documento. \
*Precondiciones:* Lista de documentos visible. \
*Pasos:*
1. Hacer click en la primera fila de la tabla
2. Verificar que se abre el modal de detalle
3. Verificar que muestra información del documento: ID, Tipo, Archivo, Ruta, Cliente, Póliza, Fecha

*Resultado esperado:* El modal de detalle se abre mostrando la información completa del documento.

---

== 2. Creación de Documentos

=== TC-DOC-004: Abrir modal de nuevo documento
*Prioridad:* Alta \
*Descripción:* Verificar que el botón "Nuevo Documento" abre el modal de creación. \
*Precondiciones:* Estar en la vista de Documentos. \
*Pasos:*
1. Click en botón "Nuevo Documento"
2. Verificar que se abre el modal
3. Verificar título "Nuevo Documento"
4. Verificar presencia de campos: Asociar a, Cliente/Póliza, Tipo, Nombre del archivo, Subir archivo

*Resultado esperado:* El modal de nuevo documento se abre con todos los campos necesarios.

---

=== TC-DOC-005: Crear documento asociado a cliente
*Prioridad:* Alta \
*Descripción:* Crear un nuevo documento asociándolo a un cliente. \
*Precondiciones:* Modal de nuevo documento abierto, archivo de prueba disponible. \
*Pasos:*
1. Seleccionar "Cliente" en el campo "Asociar a"
2. Seleccionar un cliente del datalist
3. Ingresar tipo: "INE"
4. Ingresar nombre: "ine-cliente-test.pdf"
5. Subir archivo de prueba mediante el dropzone
6. Click en "Guardar Documento"
7. Verificar que aparece alerta de éxito
8. Verificar que el modal se cierra
9. Buscar el documento en la tabla

*Resultado esperado:* El documento se crea correctamente y aparece en la lista asociado al cliente.

---

=== TC-DOC-006: Crear documento asociado a póliza
*Prioridad:* Alta \
*Descripción:* Crear un nuevo documento asociándolo a una póliza. \
*Precondiciones:* Modal de nuevo documento abierto, archivo de prueba disponible. \
*Pasos:*
1. Seleccionar "Póliza" en el campo "Asociar a"
2. Seleccionar una póliza del datalist
3. Ingresar tipo: "Contrato"
4. Ingresar nombre: "contrato-poliza.pdf"
5. Subir archivo de prueba
6. Click en "Guardar Documento"
7. Verificar creación exitosa

*Resultado esperado:* El documento se crea y asocia correctamente a la póliza.

---

=== TC-DOC-007: Validación de campos obligatorios
*Prioridad:* Alta \
*Descripción:* Intentar crear documento sin completar campos obligatorios. \
*Precondiciones:* Modal de nuevo documento abierto. \
*Pasos:*
1. Dejar campos vacíos
2. Click en "Guardar Documento"
3. Verificar mensaje de error "Completa todos los datos del documento"

*Resultado esperado:* El sistema no permite crear el documento y muestra mensaje de validación.

---

=== TC-DOC-008: Validación de archivo requerido
*Prioridad:* Alta \
*Descripción:* Intentar crear documento sin subir archivo. \
*Precondiciones:* Modal de nuevo documento abierto. \
*Pasos:*
1. Completar todos los campos excepto subir archivo
2. Click en "Guardar Documento"
3. Verificar mensaje de error sobre archivo faltante

*Resultado esperado:* El sistema no permite crear el documento sin archivo adjunto.

---

=== TC-DOC-009: Cancelar creación de documento
*Prioridad:* Media \
*Descripción:* Verificar que el botón Cancelar cierra el modal sin guardar. \
*Precondiciones:* Modal de nuevo documento abierto con datos ingresados. \
*Pasos:*
1. Ingresar datos en el formulario
2. Click en "Cancelar"
3. Verificar que el modal se cierra
4. Volver a abrir modal
5. Verificar que los campos están vacíos

*Resultado esperado:* El modal se cierra sin crear el documento y se limpia el formulario.

---

=== TC-DOC-010: Toggle entre Cliente y Póliza
*Prioridad:* Media \
*Descripción:* Verificar que al cambiar entre Cliente y Póliza se muestran los campos correctos. \
*Precondiciones:* Modal de nuevo documento abierto. \
*Pasos:*
1. Verificar que por defecto se muestra el campo Cliente
2. Cambiar a "Póliza"
3. Verificar que se oculta campo Cliente y se muestra campo Póliza
4. Cambiar de nuevo a "Cliente"
5. Verificar que se muestra campo Cliente y se oculta Póliza

*Resultado esperado:* Los campos se alternan correctamente según la selección.

---

== 3. Búsqueda y Filtrado

=== TC-DOC-011: Búsqueda por tipo de documento
*Prioridad:* Alta \
*Descripción:* Buscar documentos por tipo. \
*Precondiciones:* Documentos con diferentes tipos registrados. \
*Pasos:*
1. Ingresar "INE" en el campo de búsqueda
2. Esperar a que se actualice la tabla
3. Verificar que solo se muestran documentos de tipo INE
4. Verificar que la métrica se actualiza

*Resultado esperado:* La búsqueda filtra correctamente por tipo de documento.

---

=== TC-DOC-012: Búsqueda por nombre de archivo
*Prioridad:* Alta \
*Descripción:* Buscar documentos por nombre de archivo. \
*Precondiciones:* Documentos registrados. \
*Pasos:*
1. Ingresar parte del nombre de un archivo en búsqueda
2. Verificar que se filtran los resultados correctamente

*Resultado esperado:* La búsqueda encuentra documentos que contienen el término en el nombre.

---

=== TC-DOC-013: Búsqueda por nombre de cliente
*Prioridad:* Media \
*Descripción:* Buscar documentos asociados a un cliente específico. \
*Precondiciones:* Documentos asociados a clientes. \
*Pasos:*
1. Ingresar nombre de un cliente en búsqueda
2. Verificar que se muestran solo documentos de ese cliente

*Resultado esperado:* La búsqueda filtra por nombre de cliente correctamente.

---

=== TC-DOC-014: Búsqueda por número de póliza
*Prioridad:* Media \
*Descripción:* Buscar documentos por número de póliza. \
*Precondiciones:* Documentos asociados a pólizas. \
*Pasos:*
1. Ingresar número de póliza en búsqueda
2. Verificar que se muestran documentos de esa póliza

*Resultado esperado:* La búsqueda filtra por número de póliza correctamente.

---

=== TC-DOC-015: Limpiar búsqueda
*Prioridad:* Media \
*Descripción:* Verificar que al borrar la búsqueda se muestran todos los documentos. \
*Precondiciones:* Búsqueda activa con resultados filtrados. \
*Pasos:*
1. Borrar el texto del campo de búsqueda
2. Verificar que se muestran todos los documentos nuevamente

*Resultado esperado:* Al limpiar la búsqueda, se restaura la lista completa.

---

=== TC-DOC-016: Abrir modal de filtros avanzados
*Prioridad:* Media \
*Descripción:* Verificar que el botón de filtros abre el modal. \
*Precondiciones:* Estar en vista de Documentos. \
*Pasos:*
1. Click en botón "Filtros"
2. Verificar que se abre modal de filtros
3. Verificar opciones: Todos, Solo Clientes, Solo Pólizas

*Resultado esperado:* El modal de filtros se abre con las opciones correctas.

---

=== TC-DOC-017: Filtrar solo documentos de clientes
*Prioridad:* Alta \
*Descripción:* Aplicar filtro para ver solo documentos de clientes. \
*Precondiciones:* Modal de filtros abierto. \
*Pasos:*
1. Seleccionar "Solo Clientes"
2. Click en "Aplicar"
3. Verificar que se cierra el modal
4. Verificar que solo se muestran documentos asociados a clientes
5. Verificar que aparece badge "1" en el botón de filtros

*Resultado esperado:* Se filtran correctamente solo los documentos de clientes.

---

=== TC-DOC-018: Filtrar solo documentos de pólizas
*Prioridad:* Alta \
*Descripción:* Aplicar filtro para ver solo documentos de pólizas. \
*Precondiciones:* Modal de filtros abierto. \
*Pasos:*
1. Seleccionar "Solo Pólizas"
2. Click en "Aplicar"
3. Verificar que solo se muestran documentos asociados a pólizas
4. Verificar badge de filtro activo

*Resultado esperado:* Se filtran correctamente solo los documentos de pólizas.

---

=== TC-DOC-019: Limpiar filtros avanzados
*Prioridad:* Media \
*Descripción:* Verificar que el botón "Limpiar" restablece los filtros. \
*Precondiciones:* Filtros aplicados. \
*Pasos:*
1. Abrir modal de filtros
2. Click en "Limpiar"
3. Verificar que se selecciona "Todos"
4. Verificar que desaparece el badge de filtro
5. Verificar que se muestran todos los documentos

*Resultado esperado:* Los filtros se limpian y se muestran todos los documentos.

---

== 4. Acciones sobre Documentos

=== TC-DOC-020: Abrir documento con aplicación predeterminada
*Prioridad:* Alta \
*Descripción:* Verificar que se puede abrir un documento. \
*Precondiciones:* Documento en la lista. \
*Pasos:*
1. Click en una fila para abrir modal de detalle
2. Click en botón "Abrir documento"
3. Verificar que el archivo se abre (verificar que no hay error)

*Resultado esperado:* El documento se abre con la aplicación predeterminada del sistema.

---

=== TC-DOC-021: Eliminar documento desde modal de detalle
*Prioridad:* Alta \
*Descripción:* Eliminar un documento desde el modal de detalle. \
*Precondiciones:* Modal de detalle de documento abierto. \
*Pasos:*
1. Click en botón "Eliminar"
2. Confirmar eliminación en el diálogo
3. Verificar mensaje de éxito
4. Verificar que el modal se cierra
5. Verificar que el documento ya no aparece en la tabla

*Resultado esperado:* El documento se elimina correctamente.

---

=== TC-DOC-022: Cancelar eliminación de documento
*Prioridad:* Media \
*Descripción:* Verificar que se puede cancelar la eliminación. \
*Precondiciones:* Modal de detalle abierto. \
*Pasos:*
1. Click en botón "Eliminar"
2. Cancelar en el diálogo de confirmación
3. Verificar que el documento sigue en la tabla

*Resultado esperado:* La eliminación se cancela y el documento permanece.

---

=== TC-DOC-023: Eliminar documento desde botón de acción en tabla
*Prioridad:* Media \
*Descripción:* Eliminar documento directamente desde la tabla. \
*Precondiciones:* Documentos en la tabla. \
*Pasos:*
1. Click en icono de eliminar (papelera) de un documento
2. Confirmar eliminación
3. Verificar que el documento se elimina

*Resultado esperado:* El documento se elimina correctamente desde la tabla.

---

=== TC-DOC-024: Cerrar modal de detalle
*Prioridad:* Baja \
*Descripción:* Verificar que el modal de detalle se puede cerrar. \
*Precondiciones:* Modal de detalle abierto. \
*Pasos:*
1. Click en botón X de cerrar
2. Verificar que el modal se cierra

*Resultado esperado:* El modal se cierra correctamente.

---

== 5. Selección Masiva y Exportación

=== TC-DOC-025: Seleccionar documento individual
*Prioridad:* Media \
*Descripción:* Seleccionar un documento usando el checkbox. \
*Precondiciones:* Documentos en la tabla. \
*Pasos:*
1. Click en checkbox de una fila
2. Verificar que la fila se marca como seleccionada
3. Verificar que aparece barra de acciones masivas
4. Verificar que muestra "1 seleccionados"

*Resultado esperado:* El documento se selecciona y aparece la UI de selección.

---

=== TC-DOC-026: Deseleccionar documento individual
*Prioridad:* Baja \
*Descripción:* Deseleccionar un documento previamente seleccionado. \
*Precondiciones:* Al menos un documento seleccionado. \
*Pasos:*
1. Click en checkbox del documento seleccionado
2. Verificar que se deselecciona
3. Si era el único, verificar que desaparece la barra de acciones

*Resultado esperado:* El documento se deselecciona correctamente.

---

=== TC-DOC-027: Seleccionar todos los documentos visibles
*Prioridad:* Media \
*Descripción:* Usar el botón "Seleccionar visibles". \
*Precondiciones:* Documentos en la tabla. \
*Pasos:*
1. Click en "Seleccionar visibles"
2. Verificar que todos los documentos de la página actual se seleccionan
3. Verificar que el contador muestra el número correcto

*Resultado esperado:* Todos los documentos visibles se seleccionan.

---

=== TC-DOC-028: Seleccionar todos usando checkbox del header
*Prioridad:* Media \
*Descripción:* Usar el checkbox del header de la tabla. \
*Precondiciones:* Documentos en la tabla. \
*Pasos:*
1. Click en checkbox del header
2. Verificar que todos los documentos visibles se seleccionan
3. Click nuevamente
4. Verificar que todos se deseleccionan

*Resultado esperado:* El checkbox del header selecciona/deselecciona todos los visibles.

---

=== TC-DOC-029: Limpiar selección
*Prioridad:* Media \
*Descripción:* Usar el botón "Limpiar selección". \
*Precondiciones:* Varios documentos seleccionados. \
*Pasos:*
1. Click en "Limpiar selección"
2. Verificar que todos los documentos se deseleccionan
3. Verificar que desaparece la barra de acciones

*Resultado esperado:* La selección se limpia correctamente.

---

=== TC-DOC-030: Exportar documentos seleccionados
*Prioridad:* Alta \
*Descripción:* Exportar documentos a una carpeta externa. \
*Precondiciones:* Al menos 2 documentos seleccionados. \
*Pasos:*
1. Click en "Exportar seleccionados"
2. Seleccionar carpeta destino en el diálogo
3. Confirmar exportación
4. Verificar mensaje de éxito
5. Verificar que los archivos se copiaron a la carpeta destino

*Resultado esperado:* Los documentos seleccionados se exportan correctamente.

---

=== TC-DOC-031: Cancelar exportación
*Prioridad:* Baja \
*Descripción:* Cancelar el diálogo de selección de carpeta. \
*Precondiciones:* Documentos seleccionados. \
*Pasos:*
1. Click en "Exportar seleccionados"
2. Cancelar el diálogo de carpeta
3. Verificar que no se exporta nada

*Resultado esperado:* La exportación se cancela sin problemas.

---

=== TC-DOC-032: Intentar exportar sin selección
*Prioridad:* Baja \
*Descripción:* Validar que no se puede exportar sin seleccionar documentos. \
*Precondiciones:* Ningún documento seleccionado. \
*Pasos:*
1. Deseleccionar todos los documentos
2. Verificar que el botón de exportación no está visible (barra oculta)

*Resultado esperado:* No se puede acceder a exportar sin selección previa.

---

== 6. Paginación

=== TC-DOC-033: Cambiar items por página
*Prioridad:* Media \
*Descripción:* Verificar que se puede cambiar el número de items por página. \
*Precondiciones:* Más de 10 documentos en el sistema. \
*Pasos:*
1. Cambiar el selector "Por página" a 25
2. Verificar que se muestran hasta 25 documentos
3. Verificar que la información de paginación se actualiza

*Resultado esperado:* El número de items por página cambia correctamente.

---

=== TC-DOC-034: Navegar a página siguiente
*Prioridad:* Media \
*Descripción:* Navegar entre páginas usando los controles. \
*Precondiciones:* Más de 10 documentos (múltiples páginas). \
*Pasos:*
1. Click en página "2"
2. Verificar que se cargan los documentos de la página 2
3. Verificar que el indicador de página actual se actualiza

*Resultado esperado:* La navegación entre páginas funciona correctamente.

---

=== TC-DOC-035: Información de paginación correcta
*Prioridad:* Baja \
*Descripción:* Verificar que el texto de paginación muestra la información correcta. \
*Precondiciones:* Documentos con paginación activa. \
*Pasos:*
1. Observar el texto de paginación (ej: "Mostrando 1-10 de 25")
2. Cambiar de página
3. Verificar que el texto se actualiza correctamente

*Resultado esperado:* La información de paginación es precisa y se actualiza.

---

== 7. Métricas y Estadísticas

=== TC-DOC-036: Métrica de documentos encontrados
*Prioridad:* Media \
*Descripción:* Verificar que la métrica "Documentos encontrados" es correcta. \
*Precondiciones:* Documentos en el sistema. \
*Pasos:*
1. Observar la métrica "Documentos encontrados"
2. Contar los documentos en la tabla (considerando paginación)
3. Verificar que coinciden

*Resultado esperado:* La métrica muestra el número correcto de documentos.

---

=== TC-DOC-037: Actualización de métrica al buscar
*Prioridad:* Media \
*Descripción:* Verificar que la métrica se actualiza con búsquedas. \
*Precondiciones:* Documentos en el sistema. \
*Pasos:*
1. Anotar el valor inicial de "Documentos encontrados"
2. Realizar una búsqueda que reduzca resultados
3. Verificar que la métrica se actualiza al nuevo total

*Resultado esperado:* La métrica refleja el número de documentos filtrados.

---

=== TC-DOC-038: Actualización de métrica al filtrar
*Prioridad:* Media \
*Descripción:* Verificar que la métrica se actualiza con filtros. \
*Precondiciones:* Documentos de clientes y pólizas. \
*Pasos:*
1. Aplicar filtro "Solo Clientes"
2. Verificar que la métrica muestra solo documentos de clientes
3. Cambiar a "Solo Pólizas"
4. Verificar que la métrica se actualiza

*Resultado esperado:* La métrica refleja los filtros aplicados.

---

== 8. Estados Vacíos y Carga

=== TC-DOC-039: Estado vacío cuando no hay documentos
*Prioridad:* Baja \
*Descripción:* Verificar el estado vacío cuando no hay documentos. \
*Precondiciones:* Sistema sin documentos o búsqueda sin resultados. \
*Pasos:*
1. Realizar búsqueda que no retorne resultados
2. Verificar que se muestra mensaje "No hay documentos"
3. Verificar que no se muestra la tabla

*Resultado esperado:* Se muestra un estado vacío apropiado.

---

=== TC-DOC-040: Estado de carga inicial
*Prioridad:* Baja \
*Descripción:* Verificar que se muestra indicador de carga. \
*Precondiciones:* Ninguna. \
*Pasos:*
1. Navegar a Documentos
2. Observar brevemente el estado de carga
3. Verificar que desaparece cuando cargan los datos

*Resultado esperado:* Se muestra spinner de carga durante la carga inicial.

---

= Priorización

== Pruebas de Alta Prioridad (P1)
- TC-DOC-001: Visualizar lista de documentos
- TC-DOC-003: Click en fila abre modal de detalle
- TC-DOC-004: Abrir modal de nuevo documento
- TC-DOC-005: Crear documento asociado a cliente
- TC-DOC-006: Crear documento asociado a póliza
- TC-DOC-007: Validación de campos obligatorios
- TC-DOC-008: Validación de archivo requerido
- TC-DOC-011: Búsqueda por tipo de documento
- TC-DOC-012: Búsqueda por nombre de archivo
- TC-DOC-017: Filtrar solo documentos de clientes
- TC-DOC-018: Filtrar solo documentos de pólizas
- TC-DOC-020: Abrir documento con aplicación predeterminada
- TC-DOC-021: Eliminar documento desde modal de detalle
- TC-DOC-030: Exportar documentos seleccionados

== Pruebas de Media Prioridad (P2)
- TC-DOC-002: Verificar columnas de la tabla
- TC-DOC-009: Cancelar creación de documento
- TC-DOC-010: Toggle entre Cliente y Póliza
- TC-DOC-013 a TC-DOC-016: Búsquedas y filtros adicionales
- TC-DOC-019: Limpiar filtros avanzados
- TC-DOC-022: Cancelar eliminación de documento
- TC-DOC-023: Eliminar documento desde tabla
- TC-DOC-025 a TC-DOC-029: Selección masiva
- TC-DOC-033 a TC-DOC-038: Paginación y métricas

== Pruebas de Baja Prioridad (P3)
- TC-DOC-024: Cerrar modal de detalle
- TC-DOC-026: Deseleccionar documento individual
- TC-DOC-031: Cancelar exportación
- TC-DOC-032: Intentar exportar sin selección
- TC-DOC-035: Información de paginación correcta
- TC-DOC-039: Estado vacío
- TC-DOC-040: Estado de carga inicial

= Resumen

*Total de casos de prueba:* 40

*Distribución por prioridad:*
- Alta (P1): 14 casos
- Media (P2): 19 casos
- Baja (P3): 7 casos

*Cobertura funcional:*
- Visualización y navegación: 3 casos
- Creación de documentos: 7 casos
- Búsqueda y filtrado: 9 casos
- Acciones sobre documentos: 5 casos
- Selección masiva y exportación: 8 casos
- Paginación: 3 casos
- Métricas: 3 casos
- Estados especiales: 2 casos

= Notas de Implementación

1. *Archivos de prueba:* Se necesitarán archivos de prueba (PDFs, imágenes, etc.) en una carpeta accesible

2. *Limpieza de datos:* Después de cada test que cree documentos, considerar eliminarlos para mantener el entorno limpio

3. *Verificación de exportación:* TC-DOC-030 requiere verificar archivos en el sistema de archivos

4. *Apertura de archivos:* TC-DOC-020 puede ser difícil de automatizar completamente - verificar que no hay errores es suficiente

5. *Contexto de navegación:* Algunos tests pueden beneficiarse de llegar a Documentos desde Clientes o Pólizas para probar el contexto pre-cargado
