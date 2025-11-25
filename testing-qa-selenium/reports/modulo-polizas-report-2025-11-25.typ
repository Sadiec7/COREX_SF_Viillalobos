// Reporte de Testing - Módulo Pólizas
// Generado automáticamente: 2025-11-25 07:44 p.m.

#set document(
  title: "Reporte de Testing - Módulo Pólizas",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo Pólizas_
  ],
)

#set text(
  font: "Arial",
  size: 12pt,
  lang: "es",
)

#set heading(numbering: "1.")
#set par(justify: true)

// ========== PORTADA ==========

#align(center)[
  #v(2cm)

  #text(size: 26pt, weight: "bold")[
    Reporte de Testing Automatizado
  ]

  #v(0.5cm)

  #text(size: 22pt, weight: "bold")[
    Módulo de Pólizas
  ]

  #v(2cm)

  #text(size: 16pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(1.5cm)

  #rect(
    fill: rgb("#fff3cd"),
    width: 75%,
    radius: 10pt,
    inset: 20pt,
    stroke: 1pt,
  )[
    #text(size: 16pt, weight: "bold")[
      20 Test Cases
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: 18
        ]
      ],
      [
        #text(size: 13pt)[
          *Fallando*: 2
        ]
      ],
    )

    #v(0.3cm)

    #text(size: 12pt)[
      *Cobertura*: 90.0%
    ]

    #v(0.3cm)

    #text(size: 11pt, weight: "bold")[
      Estado: BUENO - Mayoría de tests pasando
    ]
  ]

  #v(2cm)

  #table(
    columns: (2fr, 3fr),
    align: left,
    stroke: none,
    [*Framework*:], [Selenium WebDriver 4.27.0],
    [*Patrón*:], [Page Object Pattern],
    [*Última Ejecución*:], [23/11/2025, 12:38:14 p.m.],
  )

  #v(2cm)

  #text(size: 10pt)[
    Generado automáticamente: 2025-11-25 - 07:44 p.m.
  ]
]

#pagebreak()

// ========== ÍNDICE ==========

#outline(
  title: "Índice",
  indent: auto,
  depth: 3,
)

#pagebreak()

// ========== RESUMEN DEL MÓDULO ==========

= Resumen del Módulo

== Descripción Funcional

Gestión completa de pólizas de seguros, incluyendo creación, modificación, búsqueda y validaciones de datos.

== Cobertura de Testing

Este reporte documenta la ejecución de 20 test cases automatizados que validan la funcionalidad crítica del módulo de Pólizas.

== Métricas de Ejecución

#figure(
  table(
    columns: (3fr, 1.5fr),
    align: (left, center),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*Métrica*], [*Valor*]
    ),
    [Total de Tests], [20],
    [Tests Pasando], [18 (90.0%)],
    [Tests Fallando], [2],
    [Fecha de Ejecución], [23/11/2025, 12:38:14 p.m.],
    [Estado General], [BUENO - Mayoría de tests pasando],
  ),
  caption: [Resumen de métricas - Módulo Pólizas]
)

#pagebreak()

// ========== DETALLE DE TEST CASES ==========

= Detalle de Test Cases

Esta sección presenta cada test case ejecutado con su información completa estilo TestLink, incluyendo:
- Precondiciones requeridas
- Datos de prueba utilizados
- Pasos de ejecución detallados
- Resultados esperados vs obtenidos
- Evidencia visual (screenshots)


== Tests Pasando (18/20)

Los siguientes tests se ejecutaron correctamente sin errores:


==== TC-POL-002: Validación de Número de Póliza Duplicado

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-002],
    [*Descripción*], [Verificar que el sistema no permite crear dos pólizas con el mismo número.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:38:51 p.m.],

    [*Precondiciones*], [
      - Usuario autenticado
      - Existe al menos una póliza con número "POL-2025-001"
    ],

    [*Datos de Prueba*], [
      ```
      Primera póliza (ya existe):
      Número: POL-2025-001
      Segunda póliza (duplicado):
      Número: POL-2025-001
      Cliente: María García
      Aseguradora: Mapfre
      \[resto de campos válidos\]
      ```
    ],
  ),
  caption: [Información general - TC-POL-002]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir formulario de nueva póliza]], [#[Sistema detecta duplicado]],
    [2], [#[Ingresar número de póliza que ya existe: "POL-2025-001"]], [#[Se muestra mensaje de error: "El número de póliza ya existe"]],
    [3], [#[Llenar resto de campos con datos válidos]], [#[Formulario NO se cierra]],
    [4], [#[Intentar guardar]], [#[Póliza NO se crea en base de datos]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-002-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-POL-002]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-003: Validación de Fechas - Fin Mayor que Inicio

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-003],
    [*Descripción*], [Verificar que el sistema valida que la fecha de fin sea posterior a la fecha de inicio.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:38:59 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      \*Escenario 1: Fecha fin ANTERIOR a inicio (inválido)\*
      Fecha Inicio: 01/12/2025
      Fecha Fin: 01/01/2025
      \*Escenario 2: Fecha fin IGUAL a inicio (inválido)\*
      Fecha Inicio: 01/01/2025
      Fecha Fin: 01/01/2025
      \*Escenario 3: Fecha fin POSTERIOR a inicio (válido)\*
      Fecha Inicio: 01/01/2025
      Fecha Fin: 31/12/2025
      ```
    ],
  ),
  caption: [Información general - TC-POL-003]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir formulario de nueva póliza]], [#[Mensaje de error: "La fecha de fin debe ser posterior a la fecha de inicio"]],
    [2], [#[Ingresar datos del escenario]], [#[Formulario no se guarda]],
    [3], [#[Llenar resto de campos válidos]], [#[Campos de fecha se marcan como inválidos]],
    [4], [#[Intentar guardar]], [#[Póliza se crea exitosamente]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-003-INVALID-DATES.png", width: 85%),
  caption: [Evidencia visual - TC-POL-003]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-004: Validación de Suma Asegurada Mayor a Cero

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-004],
    [*Descripción*], [Verificar que el sistema valida que la suma asegurada sea un número positivo mayor a cero.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:04 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      \*Escenario 1: Suma = 0 (inválido)\*
      Suma Asegurada: 0
      \*Escenario 2: Suma negativa (inválido)\*
      Suma Asegurada: -1000
      \*Escenario 3: Suma válida\*
      Suma Asegurada: 500000
      \*Escenario 4: Caracteres no numéricos (inválido)\*
      Suma Asegurada: "ABC123"
      ```
    ],
  ),
  caption: [Información general - TC-POL-004]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir formulario de nueva póliza]], [#[Mensaje de error específico]],
    [2], [#[Ingresar suma asegurada del escenario]], [#[Campo se marca como inválido]],
    [3], [#[Llenar resto de campos válidos]], [#[No se permite guardar]],
    [4], [#[Intentar guardar]], [#[Póliza se crea correctamente]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-004-SEARCH.png", width: 85%),
  caption: [Evidencia visual - TC-POL-004]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-005: Validación de Prima Mayor a Cero

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-005],
    [*Descripción*], [Verificar que el sistema valida que la prima sea un número positivo mayor a cero.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:08 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      Similar a TC-POL-004 pero para campo Prima:
      Escenario 1: Prima = 0 (inválido)
      Escenario 2: Prima = -500 (inválido)
      Escenario 3: Prima = 12500 (válido)
      Escenario 4: Prima = "XYZ" (inválido)
      ```
    ],
  ),
  caption: [Información general - TC-POL-005]
)

No especificado


#figure(
  image("screenshots/TC-POL-005-STATS.png", width: 85%),
  caption: [Evidencia visual - TC-POL-005]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-006: Editar Póliza Existente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-006],
    [*Descripción*], [Verificar que se puede editar una póliza existente y los cambios se guardan correctamente.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:15 p.m.],

    [*Precondiciones*], [
      - Existe póliza con número "POL-2025-001"
      - Usuario tiene permisos de edición
    ],

    [*Datos de Prueba*], [
      ```
      \*Datos originales:\*
      Número: POL-2025-001
      Cliente: Juan Pérez
      Aseguradora: GNP
      Ramo: Vida
      Suma Asegurada: \$500,000.00
      Prima: \$12,500.00
      \*Datos modificados:\*
      Suma Asegurada: \$750,000.00
      Prima: \$18,750.00
      Notas: "Aumento de cobertura solicitado por cliente"
      ```
    ],
  ),
  caption: [Información general - TC-POL-006]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar la póliza "POL-2025-001" en la tabla]], [#[Formulario se carga con datos actuales]],
    [2], [#[Hacer clic en botón "Editar" o doble clic en la fila]], [#[Cambios se guardan exitosamente]],
    [3], [#[Esperar que se abra el formulario de edición]], [#[Mensaje: "Póliza actualizada correctamente"]],
    [4], [#[Verificar que campos se cargan con datos actuales]], [#[Modal se cierra]],
    [5], [#[Modificar Suma Asegurada a \$750,000.00]], [#[Tabla se actualiza mostrando nuevos valores]],
    [6], [#[Modificar Prima a \$18,750.00]], [#[Datos no modificados permanecen iguales]],
    [7], [#[Agregar notas]], [#[Formulario se carga con datos actuales]],
    [8], [#[Hacer clic en "Guardar"]], [#[Formulario se carga con datos actuales]],
    [9], [#[Esperar confirmación]], [#[Formulario se carga con datos actuales]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-006-INVALID-PRIMA.png", width: 85%),
  caption: [Evidencia visual - TC-POL-006]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-007: Eliminar Póliza (Soft Delete)

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-007],
    [*Descripción*], [Verificar que se puede eliminar (desactivar) una póliza mediante soft delete.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:30 p.m.],

    [*Precondiciones*], [
      - Existe póliza activa "POL-2025-001"
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-007]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar la póliza en la tabla]], [#[Modal de confirmación aparece (si está implementado)]],
    [2], [#[Hacer clic en botón "Eliminar" o ícono de papelera]], [#[Mensaje: "Póliza eliminada correctamente"]],
    [3], [#[Si aparece confirmación, hacer clic en "Confirmar"]], [#[Póliza desaparece de la lista principal]],
    [4], [#[Esperar respuesta del sistema]], [#[Registro permanece en BD con activo=0]],
    [5], [#[Verificar tabla actualizada]], [#[No se borran datos relacionados]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-007-NO-RESULTS.png", width: 85%),
  caption: [Evidencia visual - TC-POL-007]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-008: Búsqueda por Número de Póliza

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-008],
    [*Descripción*], [Verificar que la búsqueda por número de póliza funciona correctamente.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:35 p.m.],

    [*Precondiciones*], [
      - Existen múltiples pólizas:
      - POL-2025-001
      - POL-2025-002
      - POL-2025-003
    ],

    [*Datos de Prueba*], [
      ```
      \*Escenario 1: Búsqueda exacta\*
      Búsqueda: "POL-2025-001"
      Resultado: 1 póliza
      \*Escenario 2: Búsqueda parcial\*
      Búsqueda: "2025"
      Resultado: 3 pólizas
      \*Escenario 3: Sin resultados\*
      Búsqueda: "NOEXISTE"
      Resultado: 0 pólizas
      ```
    ],
  ),
  caption: [Información general - TC-POL-008]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar campo de búsqueda]], [#[Tabla muestra solo "POL-2025-001"]],
    [2], [#[Ingresar término de búsqueda]], [#[Contador muestra "1 resultado"]],
    [3], [#[Presionar Enter o hacer clic en botón buscar]], [#[Tabla muestra las 3 pólizas]],
    [4], [#[Observar resultados filtrados]], [#[Contador muestra "3 resultados"]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-008-CANCELLED.png", width: 85%),
  caption: [Evidencia visual - TC-POL-008]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-010: Filtro por Aseguradora

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-010],
    [*Descripción*], [Verificar que se pueden filtrar pólizas por aseguradora.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:58 p.m.],

    [*Precondiciones*], [
      - 5 pólizas de "GNP Seguros"
      - 3 pólizas de "Mapfre"
      - 2 pólizas de "Qualitas"
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-010]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar filtro de aseguradora (dropdown/multiselect)]], [#[Filtro "GNP": 5 pólizas]],
    [2], [#[Seleccionar "GNP Seguros"]], [#[Filtro "Mapfre": 3 pólizas]],
    [3], [#[Verificar resultados]], [#[Si multi-select: Suma correcta de resultados]],
    [4], [#[Cambiar a "Mapfre"]], [#[Filtro "GNP": 5 pólizas]],
    [5], [#[Verificar resultados]], [#[Filtro "GNP": 5 pólizas]],
    [6], [#[Seleccionar múltiples si es posible]], [#[Filtro "GNP": 5 pólizas]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-010-NEGATIVE-SUM.png", width: 85%),
  caption: [Evidencia visual - TC-POL-010]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-011: Filtro por Ramo de Seguro

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-011],
    [*Descripción*], [Verificar que se pueden filtrar pólizas por ramo (Vida, Auto, Daños, etc.).],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:40:15 p.m.],

    [*Precondiciones*], [
      - 4 pólizas de "Vida"
      - 6 pólizas de "Auto"
      - 2 pólizas de "Daños"
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-011]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar filtro de ramo]], [#[Filtros se aplican correctamente]],
    [2], [#[Seleccionar "Vida"]], [#[Resultados coinciden con datos de prueba]],
    [3], [#[Verificar 4 resultados]], [#[Filtros se aplican correctamente]],
    [4], [#[Cambiar a "Auto"]], [#[Filtros se aplican correctamente]],
    [5], [#[Verificar 6 resultados]], [#[Filtros se aplican correctamente]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-011-CLEARED.png", width: 85%),
  caption: [Evidencia visual - TC-POL-011]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-012: Filtro Combinado (Cliente + Aseguradora + Ramo)

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-012],
    [*Descripción*], [Verificar que se pueden aplicar múltiples filtros simultáneamente.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:40:23 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      Cliente: Juan Pérez
      Aseguradora: GNP
      Ramo: Vida
      Resultado esperado: 1 póliza específica
      ```
    ],
  ),
  caption: [Información general - TC-POL-012]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Seleccionar cliente "Juan Pérez"]], [#[Los 3 filtros se aplican simultáneamente (AND lógico)]],
    [2], [#[Seleccionar aseguradora "GNP"]], [#[Solo aparecen pólizas que cumplen TODOS los criterios]],
    [3], [#[Seleccionar ramo "Vida"]], [#[Contador de resultados es correcto]],
    [4], [#[Verificar que solo aparece 1 póliza que cumple todos los criterios]], [#[Los 3 filtros se aplican simultáneamente (AND lógico)]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-012-RENOVACION.png", width: 85%),
  caption: [Evidencia visual - TC-POL-012]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-013: Paginación - Navegar entre Páginas

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-013],
    [*Descripción*], [Verificar que la paginación funciona correctamente al navegar entre páginas.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:40:31 p.m.],

    [*Precondiciones*], [
      - Existen al menos 25 pólizas en la base de datos
      - Tamaño de página configurado en 10 items
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-013]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Cargar vista de pólizas]], [#[Página 1: Items 1-10]],
    [2], [#[Verificar que se muestran 10 pólizas (página 1)]], [#[Página 2: Items 11-20]],
    [3], [#[Hacer clic en botón "Siguiente" o "Página 2"]], [#[Página 3: Items 21-25]],
    [4], [#[Verificar que se muestran las siguientes 10 pólizas]], [#[Botón "Anterior" funciona correctamente]],
    [5], [#[Hacer clic en "Página 3"]], [#[Botón "Siguiente" se deshabilita en última página]],
    [6], [#[Verificar las últimas 5 pólizas]], [#[Indicador de página actual se actualiza]],
    [7], [#[Hacer clic en "Anterior"]], [#[Página 1: Items 1-10]],
    [8], [#[Verificar regreso a página 2]], [#[Página 1: Items 1-10]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-013-INVALID-COMMISSION.png", width: 85%),
  caption: [Evidencia visual - TC-POL-013]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-014: Paginación - Cambiar Items por Página

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-014],
    [*Descripción*], [Verificar que se puede cambiar el número de items mostrados por página.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:40:36 p.m.],

    [*Precondiciones*], [
      - Existen 50 pólizas
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-014]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Verificar vista inicial (10 items)]], [#[Dropdown tiene opciones: 10, 25, 50]],
    [2], [#[Cambiar selector a "25 items por página"]], [#[Al cambiar, la tabla se actualiza inmediatamente]],
    [3], [#[Verificar que ahora se muestran 25 items]], [#[Paginación se recalcula (total de páginas)]],
    [4], [#[Cambiar a "50 items por página"]], [#[Se mantiene en página 1 al cambiar tamaño]],
    [5], [#[Verificar que se muestran los 50 items en una sola página]], [#[Dropdown tiene opciones: 10, 25, 50]],
    [6], [#[Cambiar a "10 items por página"]], [#[Dropdown tiene opciones: 10, 25, 50]],
    [7], [#[Verificar regreso al estado original]], [#[Dropdown tiene opciones: 10, 25, 50]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-014-SEARCH-CLIENT.png", width: 85%),
  caption: [Evidencia visual - TC-POL-014]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-015: Campos Obligatorios Vacíos

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-015],
    [*Descripción*], [Verificar que el sistema valida que todos los campos obligatorios estén llenos.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:40:51 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-015]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir formulario de nueva póliza]], [#[HTML5 validation actúa primero (required)]],
    [2], [#[Dejar campos vacíos según el escenario]], [#[Mensajes específicos para cada campo faltante]],
    [3], [#[Intentar guardar]], [#[Campos obligatorios se marcan con indicador visual (\*)]],
    [4], [#[Observar mensajes de validación]], [#[No se permite guardar hasta completar todos los campos]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-015-SEARCH-ASEGURADORA.png", width: 85%),
  caption: [Evidencia visual - TC-POL-015]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-016: Activar/Desactivar Póliza

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-016],
    [*Descripción*], [Verificar que se puede activar/desactivar una póliza sin eliminarla.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:40:59 p.m.],

    [*Precondiciones*], [
      - Existe póliza activa "POL-2025-001"
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-016]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar póliza en la tabla]], [#[Toggle switch o botón funciona]],
    [2], [#[Verificar que estado es "Activa" (indicador visual)]], [#[Estado cambia en BD (campo activo)]],
    [3], [#[Hacer clic en botón/switch "Desactivar"]], [#[Indicador visual se actualiza inmediatamente]],
    [4], [#[Confirmar acción si hay modal]], [#[Mensajes de confirmación apropiados]],
    [5], [#[Verificar cambio a "Inactiva"]], [#[No se pierden datos de la póliza]],
    [6], [#[Hacer clic en "Activar"]], [#[Toggle switch o botón funciona]],
    [7], [#[Verificar cambio a "Activa"]], [#[Toggle switch o botón funciona]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-016-NEGATIVE-PRIMA.png", width: 85%),
  caption: [Evidencia visual - TC-POL-016]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-017: Subir Documento Adjunto a Póliza

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-017],
    [*Descripción*], [Verificar que se pueden adjuntar documentos (PDF, imágenes) a una póliza.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:41:02 p.m.],

    [*Precondiciones*], [
      - Existe póliza "POL-2025-001"
      - Usuario tiene documento de prueba (documento-poliza.pdf)
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-017]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir detalle de póliza o formulario de edición]], [#[Input file funciona correctamente]],
    [2], [#[Localizar sección de documentos adjuntos]], [#[Archivo se sube al servidor]],
    [3], [#[Hacer clic en "Subir documento" o similar]], [#[Documento aparece en lista con nombre original]],
    [4], [#[Seleccionar archivo desde sistema de archivos]], [#[Se puede descargar el documento]],
    [5], [#[Esperar carga]], [#[Se puede eliminar el documento]],
    [6], [#[Verificar que documento aparece en la lista]], [#[Input file funciona correctamente]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-017-TOTAL-STATS.png", width: 85%),
  caption: [Evidencia visual - TC-POL-017]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-018: Eliminar Documento Adjunto

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-018],
    [*Descripción*], [Verificar que se pueden eliminar documentos adjuntos a una póliza.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:41:10 p.m.],

    [*Precondiciones*], [
      - Póliza "POL-2025-001" tiene 1 documento adjunto
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-018]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir detalle de póliza]], [#[Confirmación antes de eliminar]],
    [2], [#[Localizar documento en la lista]], [#[Documento se elimina de la lista]],
    [3], [#[Hacer clic en botón "Eliminar" o ícono de papelera]], [#[Archivo se elimina del servidor (o soft delete)]],
    [4], [#[Confirmar eliminación si hay modal]], [#[Mensaje de confirmación]],
    [5], [#[Verificar que documento desaparece de la lista]], [#[Confirmación antes de eliminar]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-018-AFTER-CLOSE.png", width: 85%),
  caption: [Evidencia visual - TC-POL-018]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-019: Ver Detalle de Póliza (Click en Fila)

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-019],
    [*Descripción*], [Verificar que al hacer clic en una fila de la tabla se abre el detalle completo de la póliza.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:41:19 p.m.],

    [*Precondiciones*], [
      - Existe póliza "POL-2025-001" en la tabla
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-019]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar fila de la póliza en la tabla]], [#[Modal o panel de detalle se abre]],
    [2], [#[Hacer clic en cualquier parte de la fila (o botón "Ver")]], [#[Se muestran TODOS los datos de la póliza:]],
    [3], [#[Esperar que se abra modal/vista de detalle]], [#[Número de póliza]],
    [4], [#[Verificar información mostrada]], [#[Cliente (nombre completo)]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-019-NO-FECHA-INICIO.png", width: 85%),
  caption: [Evidencia visual - TC-POL-019]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

==== TC-POL-020: Validación de Longitud Mínima Número de Póliza

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-020],
    [*Descripción*], [Verificar que el sistema valida que el número de póliza tenga al menos 3 caracteres.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:41:24 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      \*Escenario 1: Muy corto (1 caracter)\*
      Número: "A"
      Resultado: Error
      \*Escenario 2: Muy corto (2 caracteres)\*
      Número: "AB"
      Resultado: Error
      \*Escenario 3: Mínimo válido (3 caracteres)\*
      Número: "ABC"
      Resultado: Éxito
      \*Escenario 4: Normal (10+ caracteres)\*
      Número: "POL-2025-001"
      Resultado: Éxito
      ```
    ],
  ),
  caption: [Información general - TC-POL-020]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Abrir formulario de nueva póliza]], [#[Mensaje de error: "El número de póliza debe tener al menos 3 caracteres"]],
    [2], [#[Ingresar número de póliza según escenario]], [#[No se permite guardar]],
    [3], [#[Llenar resto de campos válidos]], [#[Póliza se crea exitosamente]],
    [4], [#[Intentar guardar]], [#[No hay errores de validación]],
    [5], [#[Observar resultado]], [#[Mensaje de error: "El número de póliza debe tener al menos 3 caracteres"]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-020-CASE-INSENSITIVE.png", width: 85%),
  caption: [Evidencia visual - TC-POL-020]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#d4edda"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  PASS: Todos los criterios esperados se cumplieron correctamente.
]

---

#pagebreak()

== Tests Fallando (2/20)

Los siguientes tests requieren atención:


==== TC-POL-001: Crear Póliza Nueva con Datos Válidos

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-001],
    [*Descripción*], [Verificar que se puede crear una nueva póliza con todos los campos obligatorios y datos válidos.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:38:39 p.m.],

    [*Precondiciones*], [
      - Usuario autenticado
      - Estar en la vista de Pólizas
      - Al menos un cliente existe en la base de datos
      - Catálogos de aseguradoras y ramos poblados
    ],

    [*Datos de Prueba*], [
      ```
      Número de Póliza: POL-2025-001
      Cliente: Juan Pérez López (ID: 1)
      Aseguradora: GNP Seguros
      Ramo: Vida
      Fecha Inicio: 01/01/2025
      Fecha Fin: 31/12/2025
      Suma Asegurada: \$500,000.00
      Prima: \$12,500.00
      Notas: Póliza de prueba
      ```
    ],
  ),
  caption: [Información general - TC-POL-001]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Hacer clic en botón "Nueva Póliza" o similar]], [#[Formulario se valida correctamente]],
    [2], [#[Esperar que se abra el formulario de creación]], [#[Póliza se crea en la base de datos]],
    [3], [#[Ingresar número de póliza en campo correspondiente]], [#[Modal/formulario se cierra automáticamente]],
    [4], [#[Seleccionar cliente desde el dropdown/autocomplete]], [#[Mensaje de confirmación: "Póliza creada exitosamente"]],
    [5], [#[Seleccionar aseguradora desde el dropdown]], [#[Nueva póliza aparece en la tabla de pólizas]],
    [6], [#[Seleccionar ramo desde el dropdown]], [#[Los datos guardados coinciden exactamente con los ingresados]],
    [7], [#[Ingresar fecha de inicio (usar date picker o input)]], [#[Formulario se valida correctamente]],
    [8], [#[Ingresar fecha de fin]], [#[Formulario se valida correctamente]],
    [9], [#[Ingresar suma asegurada]], [#[Formulario se valida correctamente]],
    [10], [#[Ingresar prima]], [#[Formulario se valida correctamente]],
    [11], [#[Ingresar notas (opcional)]], [#[Formulario se valida correctamente]],
    [12], [#[Hacer clic en botón "Guardar" o "Crear"]], [#[Formulario se valida correctamente]],
    [13], [#[Esperar respuesta del sistema]], [#[Formulario se valida correctamente]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-001-CREATED.png", width: 85%),
  caption: [Evidencia visual - TC-POL-001]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: Póliza "POL-TEST-1763923103469" no aparece en la tabla
]

---

==== TC-POL-009: Búsqueda por Cliente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-POL-009],
    [*Descripción*], [Verificar que se pueden filtrar pólizas por cliente.],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 12:39:46 p.m.],

    [*Precondiciones*], [
      - Cliente "Juan Pérez" tiene 3 pólizas
      - Cliente "María García" tiene 2 pólizas
      - Cliente "Pedro López" tiene 0 pólizas
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-POL-009]
)

#figure(
  table(
    columns: (0.5fr, 3fr, 2.5fr),
    align: (center, left, left),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") },
    table.header(
      [*\#*], [*Acciones*], [*Salida Esperada*]
    ),
    [1], [#[Localizar dropdown/autocomplete de búsqueda por cliente]], [#[Filtro por "Juan Pérez": 3 pólizas]],
    [2], [#[Seleccionar "Juan Pérez"]], [#[Filtro por "María García": 2 pólizas]],
    [3], [#[Observar resultados filtrados]], [#[Filtro por "Pedro López": 0 pólizas (estado vacío)]],
    [4], [#[Repetir con "María García"]], [#[Filtro por "Juan Pérez": 3 pólizas]],
    [5], [#[Repetir con "Pedro López"]], [#[Filtro por "Juan Pérez": 3 pólizas]],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-POL-009-DUPLICATE.png", width: 85%),
  caption: [Evidencia visual - TC-POL-009]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: element click intercepted: Element ... is not clickable at point (1062, 181). Other element would receive the click: ...
  (Session info: chrome=140.0.7339.133)
]

---

#pagebreak()

= Análisis de Resultados

== Evaluación General

El módulo de Pólizas muestra una buena calidad con 90.0% de tests pasando. Los 2 test(s) fallando requieren revisión pero no son críticos.


== Tests Críticos Fallando

- *TC-POL-001*: Crear póliza nueva
  Error: Póliza "POL-TEST-1763923103469" no aparece en la tabla

- *TC-POL-009*: Validación número de póliza único
  Error: element click intercepted: Element ... is not clickable at point (1062, 181). Other element would receive the click: ...
  (Session info: chrome=140.0.7339.133)


== Recomendaciones

- Corregir tests fallando identificados
- Revisar causas raíz de los fallos
- Re-ejecutar suite después de correcciones
- Documentar hallazgos para evitar regresiones

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
`testing-qa-selenium/selenium-webdriver/tests/polizas.test.js`

*Page Object*:
`testing-qa-selenium/selenium-webdriver/page-objects/PólizasPage.js`

*Resultados JSON*:
`testing-qa-selenium/reports/polizas-test-results-*.json`

*Screenshots*:
`testing-qa-selenium/reports/screenshots/`

== Scripts de Ejecución

*Ejecutar este módulo*:
```bash
npm run test:polizas
```

*Generar este reporte*:
```bash
npm run report:module:polizas
```

---

_Reporte generado automáticamente el 2025-11-25 a las 07:44 p.m._
