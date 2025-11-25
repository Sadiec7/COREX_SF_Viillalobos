// Reporte de Testing - Módulo Catálogos
// Generado automáticamente: 2025-11-25 07:25 p.m.

#set document(
  title: "Reporte de Testing - Módulo Catálogos",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo Catálogos_
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
    Módulo de Catálogos
  ]

  #v(2cm)

  #text(size: 16pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(1.5cm)

  #rect(
    fill: rgb("#d4edda"),
    width: 75%,
    radius: 10pt,
    inset: 20pt,
    stroke: 1pt,
  )[
    #text(size: 16pt, weight: "bold")[
      26 Test Cases
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: 26
        ]
      ],
      [
        #text(size: 13pt)[
          *Fallando*: 0
        ]
      ],
    )

    #v(0.3cm)

    #text(size: 12pt)[
      *Cobertura*: 100.0%
    ]

    #v(0.3cm)

    #text(size: 11pt, weight: "bold")[
      Estado: PERFECTO - Todos los tests pasando
    ]
  ]

  #v(2cm)

  #table(
    columns: (2fr, 3fr),
    align: left,
    stroke: none,
    [*Framework*:], [Selenium WebDriver 4.27.0],
    [*Patrón*:], [Page Object Pattern],
    [*Última Ejecución*:], [23/11/2025, 7:48:19 p.m.],
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

Gestión de catálogos: Aseguradoras, Ramos, Métodos de Pago y Periodicidades.

== Cobertura de Testing

Este reporte documenta la ejecución de 26 test cases automatizados que validan la funcionalidad crítica del módulo de Catálogos.

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
    [Total de Tests], [26],
    [Tests Pasando], [26 (100.0%)],
    [Tests Fallando], [0],
    [Fecha de Ejecución], [23/11/2025, 7:48:19 p.m.],
    [Estado General], [PERFECTO - Todos los tests pasando],
  ),
  caption: [Resumen de métricas - Módulo Catálogos]
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


== Tests Pasando (26/26)

Los siguientes tests se ejecutaron correctamente sin errores:


==== TC-ASEG-001: Crear Aseguradora Válida

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-001],
    [*Descripción*], [Crear Aseguradora Válida],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:48:41 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-001]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-001-CREATED.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-001]
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

==== TC-ASEG-002: Validación Nombre Vacío

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-002],
    [*Descripción*], [Validación Nombre Vacío],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:48:46 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-002]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-002-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-002]
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

==== TC-ASEG-003: Validación Nombre Duplicado

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-003],
    [*Descripción*], [Validación Nombre Duplicado],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:49:09 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-003]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-003-DUPLICATE.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-003]
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

==== TC-ASEG-004: Editar Aseguradora

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-004],
    [*Descripción*], [Editar Aseguradora],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:49:33 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-004]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-004-EDITED.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-004]
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

==== TC-ASEG-005: Desactivar Aseguradora

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-005],
    [*Descripción*], [Desactivar Aseguradora],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:50:08 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-005]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-005-DEACTIVATED.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-005]
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

==== TC-ASEG-006: Activar Aseguradora

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-006],
    [*Descripción*], [Activar Aseguradora],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:50:44 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-006]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-006-ACTIVATED.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-006]
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

==== TC-ASEG-007: Eliminar Aseguradora Sin Uso

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-007],
    [*Descripción*], [Eliminar Aseguradora Sin Uso],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:51:08 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-007]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-007-DELETED.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-007]
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

==== TC-ASEG-008: Búsqueda por Nombre

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-008],
    [*Descripción*], [Búsqueda por Nombre],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:51:22 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-008]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-008-SEARCH.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-008]
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

==== TC-ASEG-009: Paginación

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-009],
    [*Descripción*], [Paginación],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:51:34 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-009]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-009-PAGINATION.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-009]
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

==== TC-ASEG-010: Columna Acciones - Hover

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-ASEG-010],
    [*Descripción*], [Columna Acciones - Hover],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:51:47 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-ASEG-010]
)

No especificado


#figure(
  image("screenshots/TC-ASEG-010-HOVER.png", width: 85%),
  caption: [Evidencia visual - TC-ASEG-010]
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

==== TC-MPAGO-001: Crear Método de Pago

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-MPAGO-001],
    [*Descripción*], [Crear Método de Pago],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:52:05 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-MPAGO-001]
)

No especificado


#figure(
  image("screenshots/TC-MPAGO-001-CREATED.png", width: 85%),
  caption: [Evidencia visual - TC-MPAGO-001]
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

==== TC-MPAGO-002: Validación Nombre Vacío

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-MPAGO-002],
    [*Descripción*], [Validación Nombre Vacío],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:52:08 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-MPAGO-002]
)

No especificado


#figure(
  image("screenshots/TC-MPAGO-002-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-MPAGO-002]
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

==== TC-MPAGO-003: Editar Método de Pago

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-MPAGO-003],
    [*Descripción*], [Editar Método de Pago],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:52:32 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-MPAGO-003]
)

No especificado


#figure(
  image("screenshots/TC-MPAGO-003-EDITED.png", width: 85%),
  caption: [Evidencia visual - TC-MPAGO-003]
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

==== TC-MPAGO-004: Eliminar Método de Pago

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-MPAGO-004],
    [*Descripción*], [Eliminar Método de Pago],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:52:55 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-MPAGO-004]
)

No especificado


#figure(
  image("screenshots/TC-MPAGO-004-DELETED.png", width: 85%),
  caption: [Evidencia visual - TC-MPAGO-004]
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

==== TC-MPAGO-005: Búsqueda de Método

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-MPAGO-005],
    [*Descripción*], [Búsqueda de Método],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:53:10 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-MPAGO-005]
)

No especificado


#figure(
  image("screenshots/TC-MPAGO-005-SEARCH.png", width: 85%),
  caption: [Evidencia visual - TC-MPAGO-005]
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

==== TC-PER-001: Crear Periodicidad

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-PER-001],
    [*Descripción*], [Crear Periodicidad],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:53:27 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-PER-001]
)

No especificado


#figure(
  image("screenshots/TC-PER-001-CREATED.png", width: 85%),
  caption: [Evidencia visual - TC-PER-001]
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

==== TC-PER-002: Validación Nombre Vacío

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-PER-002],
    [*Descripción*], [Validación Nombre Vacío],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:53:31 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-PER-002]
)

No especificado


#figure(
  image("screenshots/TC-PER-002-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-PER-002]
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

==== TC-PER-003: Validación Meses Inválidos

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-PER-003],
    [*Descripción*], [Validación Meses Inválidos],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:53:37 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-PER-003]
)

No especificado


#figure(
  image("screenshots/TC-PER-003-INVALID-MESES.png", width: 85%),
  caption: [Evidencia visual - TC-PER-003]
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

==== TC-PER-004: Editar Periodicidad

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-PER-004],
    [*Descripción*], [Editar Periodicidad],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:54:01 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-PER-004]
)

No especificado


#figure(
  image("screenshots/TC-PER-004-EDITED.png", width: 85%),
  caption: [Evidencia visual - TC-PER-004]
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

==== TC-PER-005: Eliminar Periodicidad Sin Uso

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-PER-005],
    [*Descripción*], [Eliminar Periodicidad Sin Uso],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:54:24 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-PER-005]
)

No especificado


#figure(
  image("screenshots/TC-PER-005-DELETED.png", width: 85%),
  caption: [Evidencia visual - TC-PER-005]
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

==== TC-RAMO-001: Crear Ramo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-RAMO-001],
    [*Descripción*], [Crear Ramo],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:54:42 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-RAMO-001]
)

No especificado


#figure(
  image("screenshots/TC-RAMO-001-CREATED.png", width: 85%),
  caption: [Evidencia visual - TC-RAMO-001]
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

==== TC-RAMO-002: Validación Nombre Vacío

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-RAMO-002],
    [*Descripción*], [Validación Nombre Vacío],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:54:45 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-RAMO-002]
)

No especificado


#figure(
  image("screenshots/TC-RAMO-002-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-RAMO-002]
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

==== TC-RAMO-003: Validación Nombre Duplicado

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-RAMO-003],
    [*Descripción*], [Validación Nombre Duplicado],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:55:09 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-RAMO-003]
)

No especificado


#figure(
  image("screenshots/TC-RAMO-003-DUPLICATE.png", width: 85%),
  caption: [Evidencia visual - TC-RAMO-003]
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

==== TC-RAMO-004: Editar Ramo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-RAMO-004],
    [*Descripción*], [Editar Ramo],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:55:33 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-RAMO-004]
)

No especificado


#figure(
  image("screenshots/TC-RAMO-004-EDITED.png", width: 85%),
  caption: [Evidencia visual - TC-RAMO-004]
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

==== TC-RAMO-005: Eliminar Ramo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-RAMO-005],
    [*Descripción*], [Eliminar Ramo],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:55:57 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-RAMO-005]
)

No especificado


#figure(
  image("screenshots/TC-RAMO-005-DELETED.png", width: 85%),
  caption: [Evidencia visual - TC-RAMO-005]
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

==== TC-RAMO-006: Búsqueda de Ramo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-RAMO-006],
    [*Descripción*], [Búsqueda de Ramo],
    [*Autor*], [Angel Flores],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 7:56:11 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-RAMO-006]
)

No especificado


#figure(
  image("screenshots/TC-RAMO-006-SEARCH.png", width: 85%),
  caption: [Evidencia visual - TC-RAMO-006]
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

= Análisis de Resultados

== Evaluación General

El módulo de Catálogos demuestra una calidad excepcional con el 100% de tests pasando. Todos los casos de prueba se ejecutaron exitosamente.



== Recomendaciones

- Mantener la suite de tests actualizada
- Ejecutar tests antes de cada deployment
- Considerar agregar tests de regresión adicionales
- Integrar en pipeline de CI/CD

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
`testing-qa-selenium/selenium-webdriver/tests/catalogos.test.js`

*Page Object*:
`testing-qa-selenium/selenium-webdriver/page-objects/CatálogosPage.js`

*Resultados JSON*:
`testing-qa-selenium/reports/catalogos-test-results-*.json`

*Screenshots*:
`testing-qa-selenium/reports/screenshots/`

== Scripts de Ejecución

*Ejecutar este módulo*:
```bash
npm run test:catalogos
```

*Generar este reporte*:
```bash
npm run report:module:catalogos
```

---

_Reporte generado automáticamente el 2025-11-25 a las 07:25 p.m._
