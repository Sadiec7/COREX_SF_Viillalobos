#set document(
  title: "Plan de Pruebas - Módulos de Catálogos",
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
    Módulos de Catálogos
  ]

  #v(0.3cm)

  #text(size: 14pt)[
    Aseguradoras • Métodos de Pago • Periodicidades • Ramos
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

Este documento consolida los planes de prueba para los cuatro módulos de catálogos del Sistema de Seguros VILLALOBOS. Dado que estos módulos comparten estructura y funcionalidad similar, se documentan de manera unificada.

== Alcance

Los catálogos incluidos son:
- *Aseguradoras:* Compañías aseguradoras
- *Métodos de Pago:* Formas de pago disponibles
- *Periodicidades:* Frecuencias de pago (Mensual, Trimestral, etc.)
- *Ramos:* Tipos de seguro (Vida, Auto, Hogar, etc.)

Funcionalidad común:
- CRUD básico (Crear, Leer, Actualizar, Eliminar)
- Activar/Desactivar registros
- Búsqueda y paginación
- Validaciones de formulario

== Referencias

- Plan Maestro de Pruebas
- Estrategia de Testing
- Plan de Pruebas de Pólizas (usa estos catálogos)

= Descripción de Módulos

== Aseguradoras

*Propósito:* Gestionar el catálogo de compañías aseguradoras

*Campos:*
- nombre (requerido, único)
- activo (boolean)

*Relaciones:*
- Una póliza pertenece a una aseguradora

---

== Métodos de Pago

*Propósito:* Gestionar formas de pago disponibles

*Campos:*
- nombre (requerido, único)

*Ejemplos:*
- Transferencia
- Tarjeta de Crédito
- Efectivo
- Cheque

---

== Periodicidades

*Propósito:* Gestionar frecuencias de pago

*Campos:*
- nombre (requerido, único)
- meses (número de meses que abarca)
- dias_anticipacion_alerta (días antes de vencer)

*Ejemplos:*
- Mensual (1 mes)
- Trimestral (3 meses)
- Semestral (6 meses)
- Anual (12 meses)

---

== Ramos

*Propósito:* Gestionar tipos de seguro

*Campos:*
- nombre (requerido, único)

*Ejemplos:*
- Vida
- Auto
- Hogar
- Salud
- Daños

= Casos de Prueba - Aseguradoras

== TC-ASEG-001: Crear Aseguradora Válida

*Descripción:* Verificar creación exitosa de aseguradora

*Precondiciones:*
- Usuario autenticado
- En módulo de Aseguradoras

*Pasos:*
1. Click en "Nueva Aseguradora"
2. Ingresar nombre: "AXA Seguros"
3. Guardar

*Resultado Esperado:*
- Aseguradora se crea exitosamente
- Aparece en la tabla
- Estado: Activa (por defecto)
- Toast de éxito

*Prioridad:* Alta

---

== TC-ASEG-002: Validación Nombre Vacío

*Descripción:* Verificar que no se permita nombre vacío

*Pasos:*
1. Abrir modal "Nueva Aseguradora"
2. Dejar campo nombre vacío
3. Intentar guardar

*Resultado Esperado:*
- Alerta "El nombre es obligatorio"
- No se crea registro

*Prioridad:* Alta

---

== TC-ASEG-003: Validación Nombre Duplicado

*Descripción:* Verificar rechazo de nombres duplicados

*Precondiciones:*
- Existe aseguradora "MAPFRE"

*Pasos:*
1. Intentar crear otra aseguradora "MAPFRE"
2. Guardar

*Resultado Esperado:*
- Error de clave duplicada
- No se crea registro

*Prioridad:* Alta

---

== TC-ASEG-004: Editar Aseguradora

*Descripción:* Verificar edición de nombre

*Precondiciones:*
- Existe aseguradora

*Pasos:*
1. Click en botón editar (lápiz)
2. Cambiar nombre
3. Guardar

*Resultado Esperado:*
- Nombre se actualiza
- Toast de éxito

*Prioridad:* Media

---

== TC-ASEG-005: Desactivar Aseguradora

*Descripción:* Verificar cambio a estado inactivo

*Pasos:*
1. Click en botón "Desactivar"
2. Confirmar acción

*Resultado Esperado:*
- Estado cambia a "Inactiva"
- Badge rojo
- Toast de éxito

*Prioridad:* Media

---

== TC-ASEG-006: Activar Aseguradora

*Descripción:* Verificar reactivación

*Precondiciones:*
- Aseguradora inactiva existe

*Pasos:*
1. Click en "Activar"
2. Confirmar

*Resultado Esperado:*
- Estado "Activa"
- Badge verde

*Prioridad:* Media

---

== TC-ASEG-007: Eliminar Aseguradora Sin Uso

*Descripción:* Verificar eliminación cuando no tiene pólizas

*Precondiciones:*
- Aseguradora sin pólizas relacionadas

*Pasos:*
1. Click en botón eliminar (X roja)
2. Confirmar en modal

*Resultado Esperado:*
- Registro eliminado
- Desaparece de tabla
- Toast de éxito

*Prioridad:* Media

---

== TC-ASEG-008: Búsqueda por Nombre

*Descripción:* Verificar búsqueda

*Pasos:*
1. Ingresar "AXA" en buscador
2. Esperar resultado

*Resultado Esperado:*
- Se filtran aseguradoras que contienen "AXA"
- Case-insensitive

*Prioridad:* Media

---

== TC-ASEG-009: Paginación

*Descripción:* Verificar navegación entre páginas

*Precondiciones:*
- Más de 10 aseguradoras

*Pasos:*
1. Navegar a página 2
2. Observar contenido

*Resultado Esperado:*
- Se muestran siguientes 10 registros
- Indicador de página correcto

*Prioridad:* Baja

---

== TC-ASEG-010: Columna Acciones - Hover

*Descripción:* Verificar comportamiento visual

*Pasos:*
1. Pasar mouse sobre fila

*Resultado Esperado:*
- Fila completa cambia a gris
- Columna acciones también cambia
- Sin transparencias

*Prioridad:* Baja

---

= Casos de Prueba - Métodos de Pago

== TC-MPAGO-001: Crear Método de Pago

*Descripción:* Crear nuevo método de pago

*Pasos:*
1. Click "Nuevo Método de Pago"
2. Ingresar "Transferencia Bancaria"
3. Guardar

*Resultado Esperado:*
- Método creado exitosamente
- Visible en tabla

*Prioridad:* Alta

---

== TC-MPAGO-002: Validación Nombre Vacío

*Descripción:* Rechazar nombre vacío

*Pasos:*
1. Abrir modal
2. Dejar vacío
3. Guardar

*Resultado Esperado:*
- Alerta de error
- No se crea

*Prioridad:* Alta

---

== TC-MPAGO-003: Editar Método de Pago

*Descripción:* Modificar nombre

*Pasos:*
1. Editar método existente
2. Cambiar nombre
3. Guardar

*Resultado Esperado:*
- Actualización exitosa

*Prioridad:* Media

---

== TC-MPAGO-004: Eliminar Método de Pago

*Descripción:* Eliminar método sin uso

*Pasos:*
1. Eliminar método
2. Confirmar

*Resultado Esperado:*
- Eliminación exitosa

*Prioridad:* Media

---

== TC-MPAGO-005: Búsqueda de Método

*Descripción:* Buscar por nombre

*Pasos:*
1. Buscar "Tarjeta"

*Resultado Esperado:*
- Métodos con "Tarjeta" visibles

*Prioridad:* Media

---

= Casos de Prueba - Periodicidades

== TC-PER-001: Crear Periodicidad

*Descripción:* Crear nueva periodicidad

*Pasos:*
1. Click "Nueva Periodicidad"
2. Nombre: "Mensual"
3. Meses: 1
4. Días anticipación: 7
5. Guardar

*Resultado Esperado:*
- Periodicidad creada
- Visible en tabla

*Prioridad:* Alta

---

== TC-PER-002: Validación Nombre Vacío

*Descripción:* Rechazar nombre vacío

*Resultado Esperado:*
- Error

*Prioridad:* Alta

---

== TC-PER-003: Validación Meses Inválidos

*Descripción:* Rechazar meses negativos o cero

*Pasos:*
1. Intentar meses = 0
2. Guardar

*Resultado Esperado:*
- Error de validación

*Prioridad:* Alta

---

== TC-PER-004: Editar Periodicidad

*Descripción:* Modificar días anticipación

*Pasos:*
1. Editar periodicidad
2. Cambiar días_anticipacion_alerta a 15
3. Guardar

*Resultado Esperado:*
- Actualización exitosa

*Prioridad:* Media

---

== TC-PER-005: Eliminar Periodicidad Sin Uso

*Descripción:* Eliminar periodicidad sin pólizas

*Resultado Esperado:*
- Eliminación exitosa

*Prioridad:* Media

---

= Casos de Prueba - Ramos

== TC-RAMO-001: Crear Ramo

*Descripción:* Crear nuevo ramo

*Pasos:*
1. Click "Nuevo Ramo"
2. Nombre: "Vida"
3. Guardar

*Resultado Esperado:*
- Ramo creado

*Prioridad:* Alta

---

== TC-RAMO-002: Validación Nombre Vacío

*Descripción:* Rechazar nombre vacío

*Resultado Esperado:*
- Error

*Prioridad:* Alta

---

== TC-RAMO-003: Validación Nombre Duplicado

*Descripción:* Rechazar nombres duplicados

*Precondiciones:*
- Existe ramo "Auto"

*Pasos:*
1. Intentar crear otro "Auto"

*Resultado Esperado:*
- Error de duplicado

*Prioridad:* Alta

---

== TC-RAMO-004: Editar Ramo

*Descripción:* Modificar nombre de ramo

*Resultado Esperado:*
- Actualización exitosa

*Prioridad:* Media

---

== TC-RAMO-005: Eliminar Ramo

*Descripción:* Eliminar ramo sin pólizas

*Resultado Esperado:*
- Eliminación exitosa

*Prioridad:* Media

---

== TC-RAMO-006: Búsqueda de Ramo

*Descripción:* Buscar por nombre

*Resultado Esperado:*
- Filtrado correcto

*Prioridad:* Media

---

= Matriz de Trazabilidad

== Aseguradoras (10 casos)

#table(
  columns: (auto, auto, auto),
  [*Caso*], [*Funcionalidad*], [*Prioridad*],
  [TC-ASEG-001], [Crear], [Alta],
  [TC-ASEG-002], [Validación], [Alta],
  [TC-ASEG-003], [Validación], [Alta],
  [TC-ASEG-004], [Editar], [Media],
  [TC-ASEG-005], [Desactivar], [Media],
  [TC-ASEG-006], [Activar], [Media],
  [TC-ASEG-007], [Eliminar], [Media],
  [TC-ASEG-008], [Búsqueda], [Media],
  [TC-ASEG-009], [Paginación], [Baja],
  [TC-ASEG-010], [UI], [Baja],
)

== Métodos de Pago (5 casos)

#table(
  columns: (auto, auto, auto),
  [*Caso*], [*Funcionalidad*], [*Prioridad*],
  [TC-MPAGO-001], [Crear], [Alta],
  [TC-MPAGO-002], [Validación], [Alta],
  [TC-MPAGO-003], [Editar], [Media],
  [TC-MPAGO-004], [Eliminar], [Media],
  [TC-MPAGO-005], [Búsqueda], [Media],
)

== Periodicidades (5 casos)

#table(
  columns: (auto, auto, auto),
  [*Caso*], [*Funcionalidad*], [*Prioridad*],
  [TC-PER-001], [Crear], [Alta],
  [TC-PER-002], [Validación], [Alta],
  [TC-PER-003], [Validación], [Alta],
  [TC-PER-004], [Editar], [Media],
  [TC-PER-005], [Eliminar], [Media],
)

== Ramos (6 casos)

#table(
  columns: (auto, auto, auto),
  [*Caso*], [*Funcionalidad*], [*Prioridad*],
  [TC-RAMO-001], [Crear], [Alta],
  [TC-RAMO-002], [Validación], [Alta],
  [TC-RAMO-003], [Validación], [Alta],
  [TC-RAMO-004], [Editar], [Media],
  [TC-RAMO-005], [Eliminar], [Media],
  [TC-RAMO-006], [Búsqueda], [Media],
)

= Criterios de Aceptación

*Cobertura:* Mínimo 90% de casos exitosos por módulo

*Casos Críticos por Módulo:*
- Crear registro válido
- Validar nombre obligatorio
- Validar duplicados (donde aplique)

= Recursos

*Herramientas:*
- Selenium WebDriver
- Page Object Pattern

*Datos de Prueba:*
- 5+ registros por catálogo
- Registros activos e inactivos (Aseguradoras)

= Cronograma

*Día 1:* Implementar Page Objects para los 4 catálogos
*Día 2:* TC-ASEG-001 a TC-ASEG-010 (Aseguradoras completo)
*Día 3:* Métodos de Pago y Periodicidades
*Día 4:* Ramos y regresión general
*Día 5:* Documentación y reporte final

= Riesgos

*R-CAT-001:* Dependencias en Pólizas
- Si catálogos tienen registros usados en pólizas, no se pueden eliminar
- *Mitigación:* Usar datos de prueba independientes

= Conclusiones

Los módulos de catálogos son fundamentales para el funcionamiento del sistema. Aunque simples, requieren:
- Validaciones robustas
- Manejo correcto de duplicados
- UI consistente

*Total consolidado:* 26 casos de prueba
- Aseguradoras: 10
- Métodos de Pago: 5
- Periodicidades: 5
- Ramos: 6
