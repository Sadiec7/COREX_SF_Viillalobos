// Reporte de Testing - Módulo Documentos
// Generado automáticamente: 2025-11-25 07:25 p.m.

#set document(
  title: "Reporte de Testing - Módulo Documentos",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo Documentos_
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
    Módulo de Documentos
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
      10 Test Cases
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: 10
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
    [*Última Ejecución*:], [23/11/2025, 10:44:08 p.m.],
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

Sistema de gestión documental para archivos relacionados con pólizas.

== Cobertura de Testing

Este reporte documenta la ejecución de 10 test cases automatizados que validan la funcionalidad crítica del módulo de Documentos.

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
    [Total de Tests], [10],
    [Tests Pasando], [10 (100.0%)],
    [Tests Fallando], [0],
    [Fecha de Ejecución], [23/11/2025, 10:44:08 p.m.],
    [Estado General], [PERFECTO - Todos los tests pasando],
  ),
  caption: [Resumen de métricas - Módulo Documentos]
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


== Tests Pasando (10/10)

Los siguientes tests se ejecutaron correctamente sin errores:


==== TC-DOC-001: Visualización de Lista de Documentos ✅

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-001],
    [*Descripción*], [Visualización de Lista de Documentos ✅],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:17 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-001]
)

No especificado



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

==== TC-DOC-002: Verificar columnas de la tabla

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-002],
    [*Descripción*], [Verificar columnas de la tabla],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:20 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-002]
)

No especificado


#figure(
  image("screenshots/TC-DOC-002-COLUMNS.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-002]
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

==== TC-DOC-003: Validación Sin Archivo Seleccionado

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-003],
    [*Descripción*], [Validación Sin Archivo Seleccionado],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:29 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-003]
)

No especificado


#figure(
  image("screenshots/TC-DOC-003-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-003]
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

==== TC-DOC-004: Abrir modal de nuevo documento

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-004],
    [*Descripción*], [Abrir modal de nuevo documento],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:38 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-004]
)

No especificado


#figure(
  image("screenshots/TC-DOC-004-MODAL-OPEN.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-004]
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

==== TC-DOC-007: Validación de campos obligatorios

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-007],
    [*Descripción*], [Validación de campos obligatorios],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:47 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-007]
)

No especificado


#figure(
  image("screenshots/TC-DOC-007-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-007]
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

==== TC-DOC-009: Cancelar creación de documento

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-009],
    [*Descripción*], [Cancelar creación de documento],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:55 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-009]
)

No especificado


#figure(
  image("screenshots/TC-DOC-009-CANCELLED.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-009]
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

==== TC-DOC-011: Búsqueda por tipo de documento

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-011],
    [*Descripción*], [Búsqueda por tipo de documento],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:45:11 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-011]
)

No especificado


#figure(
  image("screenshots/TC-DOC-011-SEARCH-TYPE.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-011]
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

==== TC-DOC-012: Búsqueda por nombre de archivo

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-012],
    [*Descripción*], [Búsqueda por nombre de archivo],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:45:26 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-012]
)

No especificado


#figure(
  image("screenshots/TC-DOC-012-SEARCH-FILE.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-012]
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

==== TC-DOC-015: Limpiar búsqueda

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-015],
    [*Descripción*], [Limpiar búsqueda],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:45:53 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-015]
)

No especificado


#figure(
  image("screenshots/TC-DOC-015-CLEAR-SEARCH.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-015]
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

==== TC-DOC-022: Mensaje de Estado Vacío

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-DOC-022],
    [*Descripción*], [Mensaje de Estado Vacío],
    [*Autor*], [Sebastian Rivera],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:46:09 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-DOC-022]
)

No especificado


#figure(
  image("screenshots/TC-DOC-022-EMPTY-STATE.png", width: 85%),
  caption: [Evidencia visual - TC-DOC-022]
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

El módulo de Documentos demuestra una calidad excepcional con el 100% de tests pasando. Todos los casos de prueba se ejecutaron exitosamente.



== Recomendaciones

- Mantener la suite de tests actualizada
- Ejecutar tests antes de cada deployment
- Considerar agregar tests de regresión adicionales
- Integrar en pipeline de CI/CD

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
`testing-qa-selenium/selenium-webdriver/tests/documentos.test.js`

*Page Object*:
`testing-qa-selenium/selenium-webdriver/page-objects/DocumentosPage.js`

*Resultados JSON*:
`testing-qa-selenium/reports/documentos-test-results-*.json`

*Screenshots*:
`testing-qa-selenium/reports/screenshots/`

== Scripts de Ejecución

*Ejecutar este módulo*:
```bash
npm run test:documentos
```

*Generar este reporte*:
```bash
npm run report:module:documentos
```

---

_Reporte generado automáticamente el 2025-11-25 a las 07:25 p.m._
