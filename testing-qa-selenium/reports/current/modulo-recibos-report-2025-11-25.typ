// Reporte de Testing - Módulo Recibos
// Generado automáticamente: 2025-11-25 07:25 p.m.

#set document(
  title: "Reporte de Testing - Módulo Recibos",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo Recibos_
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
    Módulo de Recibos
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
    [*Última Ejecución*:], [23/11/2025, 9:43:07 p.m.],
  )

  #v(2cm)

  #text(size: 10pt)[
    Generado automáticamente: 2025-11-25 - 07:25 p.m.
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

Control de recibos de pago, cobros y seguimiento de vencimientos.

== Cobertura de Testing

Este reporte documenta la ejecución de 20 test cases automatizados que validan la funcionalidad crítica del módulo de Recibos.

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
    [Fecha de Ejecución], [23/11/2025, 9:43:07 p.m.],
    [Estado General], [BUENO - Mayoría de tests pasando],
  ),
  caption: [Resumen de métricas - Módulo Recibos]
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


==== TC-REC-001: Crear Recibo Básico

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-001],
    [*Descripción*], [Crear Recibo Básico],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:43:19 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-001]
)

No especificado


#figure(
  image("screenshots/TC-REC-001-LISTA-RECIBOS.png", width: 85%),
  caption: [Evidencia visual - TC-REC-001]
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

==== TC-REC-002: Click en recibo pendiente abre modal pago

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-002],
    [*Descripción*], [Click en recibo pendiente abre modal pago],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:43:35 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-002]
)

No especificado


#figure(
  image("screenshots/TC-REC-002-MODAL-PAGO.png", width: 85%),
  caption: [Evidencia visual - TC-REC-002]
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

==== TC-REC-003: Verificar indicadores de urgencia

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-003],
    [*Descripción*], [Verificar indicadores de urgencia],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:43:45 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-003]
)

No especificado


#figure(
  image("screenshots/TC-REC-003-INDICADORES.png", width: 85%),
  caption: [Evidencia visual - TC-REC-003]
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

==== TC-REC-006: Búsqueda por número de recibo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-006],
    [*Descripción*], [Búsqueda por número de recibo],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:44:04 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-006]
)

No especificado


#figure(
  image("screenshots/TC-REC-006-SEARCH.png", width: 85%),
  caption: [Evidencia visual - TC-REC-006]
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

==== TC-REC-008: Búsqueda por cliente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-008],
    [*Descripción*], [Búsqueda por cliente],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:44:13 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-008]
)

No especificado


#figure(
  image("screenshots/TC-REC-008-SEARCH-CLIENT.png", width: 85%),
  caption: [Evidencia visual - TC-REC-008]
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

==== TC-REC-009: Búsqueda por aseguradora

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-009],
    [*Descripción*], [Búsqueda por aseguradora],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:44:32 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-009]
)

No especificado


#figure(
  image("screenshots/TC-REC-009-SEARCH-ASEG.png", width: 85%),
  caption: [Evidencia visual - TC-REC-009]
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

==== TC-REC-010: Filtro rápido - Todos

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-010],
    [*Descripción*], [Filtro rápido - Todos],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:44:40 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-010]
)

No especificado


#figure(
  image("screenshots/TC-REC-010-FILTER-ALL.png", width: 85%),
  caption: [Evidencia visual - TC-REC-010]
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

==== TC-REC-011: Filtro rápido - Vencen Hoy

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-011],
    [*Descripción*], [Filtro rápido - Vencen Hoy],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:44:59 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-011]
)

No especificado


#figure(
  image("screenshots/TC-REC-011-FILTER-VENCEN-HOY.png", width: 85%),
  caption: [Evidencia visual - TC-REC-011]
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

==== TC-REC-012: Filtro rápido - Próximos 7 días

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-012],
    [*Descripción*], [Filtro rápido - Próximos 7 días],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:45:08 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-012]
)

No especificado


#figure(
  image("screenshots/TC-REC-012-FILTER-VENCEN-7.png", width: 85%),
  caption: [Evidencia visual - TC-REC-012]
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

==== TC-REC-013: Filtro rápido - Pendientes

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-013],
    [*Descripción*], [Filtro rápido - Pendientes],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:45:17 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-013]
)

No especificado


#figure(
  image("screenshots/TC-REC-013-FILTER-PENDIENTES.png", width: 85%),
  caption: [Evidencia visual - TC-REC-013]
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

==== TC-REC-014: Filtro rápido - Vencidos

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-014],
    [*Descripción*], [Filtro rápido - Vencidos],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:45:26 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-014]
)

No especificado


#figure(
  image("screenshots/TC-REC-014-FILTER-VENCIDOS.png", width: 85%),
  caption: [Evidencia visual - TC-REC-014]
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

==== TC-REC-022: Validación campos obligatorios pago

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-022],
    [*Descripción*], [Validación campos obligatorios pago],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:45:56 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-022]
)

No especificado


#figure(
  image("screenshots/TC-REC-022-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-REC-022]
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

==== TC-REC-029: Verificar métrica - Por Cobrar

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-029],
    [*Descripción*], [Verificar métrica - Por Cobrar],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:46:22 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-029]
)

No especificado


#figure(
  image("screenshots/TC-REC-029-STAT-POR-COBRAR.png", width: 85%),
  caption: [Evidencia visual - TC-REC-029]
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

==== TC-REC-034: Verificar todas las métricas

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-034],
    [*Descripción*], [Verificar todas las métricas],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:46:29 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-034]
)

No especificado


#figure(
  image("screenshots/TC-REC-034-ALL-STATS.png", width: 85%),
  caption: [Evidencia visual - TC-REC-034]
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

==== TC-REC-050: Click en recibo pagado abre PDF

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-050],
    [*Descripción*], [Click en recibo pagado abre PDF],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:46:48 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-050]
)

No especificado


#figure(
  image("screenshots/TC-REC-050-FAILED.png", width: 85%),
  caption: [Evidencia visual - TC-REC-050]
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

==== TC-REC-053: Generar PDF con datos completos

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-053],
    [*Descripción*], [Generar PDF con datos completos],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:46:55 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-053]
)

No especificado


#figure(
  image("screenshots/TC-REC-053-PDF-CAPABILITY.png", width: 85%),
  caption: [Evidencia visual - TC-REC-053]
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

==== TC-REC-055: Validación monto mayor a cero

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-055],
    [*Descripción*], [Validación monto mayor a cero],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:47:05 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-055]
)

No especificado


#figure(
  image("screenshots/TC-REC-055-NEGATIVE-AMOUNT.png", width: 85%),
  caption: [Evidencia visual - TC-REC-055]
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

==== TC-REC-056: Validación fecha corte requerida

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-056],
    [*Descripción*], [Validación fecha corte requerida],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:47:18 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-056]
)

No especificado


#figure(
  image("screenshots/TC-REC-056-NO-FECHA-CORTE.png", width: 85%),
  caption: [Evidencia visual - TC-REC-056]
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


==== TC-REC-021: Registrar pago completo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-021],
    [*Descripción*], [Registrar pago completo],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:45:37 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-021]
)

No especificado


#figure(
  image("screenshots/TC-REC-021-FAILED.png", width: 85%),
  caption: [Evidencia visual - TC-REC-021]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: this.select is not a function
]

---

==== TC-REC-025: Cancelar modal registro de pago

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-REC-025],
    [*Descripción*], [Cancelar modal registro de pago],
    [*Autor*], [Salvador Camacho],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 9:46:14 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-REC-025]
)

No especificado


#figure(
  image("screenshots/TC-REC-025-BEFORE-CANCEL.png", width: 85%),
  caption: [Evidencia visual - TC-REC-025]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: Modal de pago no se cerró al cancelar
]

---

#pagebreak()

= Análisis de Resultados

== Evaluación General

El módulo de Recibos muestra una buena calidad con 90.0% de tests pasando. Los 2 test(s) fallando requieren revisión pero no son críticos.


== Tests Críticos Fallando

- *TC-REC-021*: Registrar pago completo
  Error: this.select is not a function

- *TC-REC-025*: Cancelar modal registro de pago
  Error: Modal de pago no se cerró al cancelar


== Recomendaciones

- Corregir tests fallando identificados
- Revisar causas raíz de los fallos
- Re-ejecutar suite después de correcciones
- Documentar hallazgos para evitar regresiones

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
`testing-qa-selenium/selenium-webdriver/tests/recibos.test.js`

*Page Object*:
`testing-qa-selenium/selenium-webdriver/page-objects/RecibosPage.js`

*Resultados JSON*:
`testing-qa-selenium/reports/recibos-test-results-*.json`

*Screenshots*:
`testing-qa-selenium/reports/screenshots/`

== Scripts de Ejecución

*Ejecutar este módulo*:
```bash
npm run test:recibos
```

*Generar este reporte*:
```bash
npm run report:module:recibos
```

---

_Reporte generado automáticamente el 2025-11-25 a las 07:25 p.m._
