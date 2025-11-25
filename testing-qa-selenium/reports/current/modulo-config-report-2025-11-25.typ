// Reporte de Testing - Módulo Configuración
// Generado automáticamente: 2025-11-25 07:25 p.m.

#set document(
  title: "Reporte de Testing - Módulo Configuración",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo Configuración_
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
    Módulo de Configuración
  ]

  #v(2cm)

  #text(size: 16pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(1.5cm)

  #rect(
    fill: rgb("#f8d7da"),
    width: 75%,
    radius: 10pt,
    inset: 20pt,
    stroke: 1pt,
  )[
    #text(size: 16pt, weight: "bold")[
      12 Test Cases
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: 8
        ]
      ],
      [
        #text(size: 13pt)[
          *Fallando*: 4
        ]
      ],
    )

    #v(0.3cm)

    #text(size: 12pt)[
      *Cobertura*: 66.7%
    ]

    #v(0.3cm)

    #text(size: 11pt, weight: "bold")[
      Estado: REQUIERE ATENCIÓN
    ]
  ]

  #v(2cm)

  #table(
    columns: (2fr, 3fr),
    align: left,
    stroke: none,
    [*Framework*:], [Selenium WebDriver 4.27.0],
    [*Patrón*:], [Page Object Pattern],
    [*Última Ejecución*:], [23/11/2025, 11:08:40 p.m.],
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

Configuración de cuenta de usuario y ajustes de seguridad.

== Cobertura de Testing

Este reporte documenta la ejecución de 12 test cases automatizados que validan la funcionalidad crítica del módulo de Configuración.

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
    [Total de Tests], [12],
    [Tests Pasando], [8 (66.7%)],
    [Tests Fallando], [4],
    [Fecha de Ejecución], [23/11/2025, 11:08:40 p.m.],
    [Estado General], [REQUIERE ATENCIÓN],
  ),
  caption: [Resumen de métricas - Módulo Configuración]
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


== Tests Pasando (8/12)

Los siguientes tests se ejecutaron correctamente sin errores:


==== TC-CFG-001: Visualizar página de configuración ✅

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-001],
    [*Descripción*], [Visualizar página de configuración ✅],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:08:47 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-001]
)

No especificado


#figure(
  image("screenshots/TC-CFG-001-FAILED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-001]
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

==== TC-CFG-002: Cargar datos de cuenta existentes

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-002],
    [*Descripción*], [Cargar datos de cuenta existentes],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:08:48 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-002]
)

No especificado


#figure(
  image("screenshots/TC-CFG-002-LOADED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-002]
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

==== TC-CFG-005: Actualizar nombre para mostrar

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-005],
    [*Descripción*], [Actualizar nombre para mostrar],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:08:53 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-005]
)

No especificado


#figure(
  image("screenshots/TC-CFG-005-UPDATED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-005]
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

==== TC-CFG-006: Actualizar usuario

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-006],
    [*Descripción*], [Actualizar usuario],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:02 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-006]
)

No especificado


#figure(
  image("screenshots/TC-CFG-006-UPDATED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-006]
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

==== TC-CFG-007: Actualizar email

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-007],
    [*Descripción*], [Actualizar email],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:07 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-007]
)

No especificado


#figure(
  image("screenshots/TC-CFG-007-EMAIL-UPDATED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-007]
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

==== TC-CFG-008: Actualizar múltiples campos simultáneamente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-008],
    [*Descripción*], [Actualizar múltiples campos simultáneamente],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:11 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-008]
)

No especificado


#figure(
  image("screenshots/TC-CFG-008-MULTIPLE-UPDATED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-008]
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

==== TC-CFG-015: Cambiar contraseña correctamente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-015],
    [*Descripción*], [Cambiar contraseña correctamente],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:26 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-015]
)

No especificado


#figure(
  image("screenshots/TC-CFG-015-PASSWORD-CHANGED.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-015]
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

==== TC-CFG-018: Validación de coincidencia de contraseñas

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-018],
    [*Descripción*], [Validación de coincidencia de contraseñas],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:38 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-018]
)

No especificado


#figure(
  image("screenshots/TC-CFG-018-MISMATCH.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-018]
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

== Tests Fallando (4/12)

Los siguientes tests requieren atención:


==== TC-CFG-010: Validación de usuario obligatorio

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-010],
    [*Descripción*], [Validación de usuario obligatorio],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:15 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-010]
)

No especificado


#figure(
  image("screenshots/TC-CFG-010-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-010]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: No se mostró mensaje de validación
]

---

==== TC-CFG-016: Validación de campos obligatorios en seguridad

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-016],
    [*Descripción*], [Validación de campos obligatorios en seguridad],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:29 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-016]
)

No especificado


#figure(
  image("screenshots/TC-CFG-016-VALIDATION.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-016]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: No se mostró mensaje de validación
]

---

==== TC-CFG-017: Validación de longitud mínima de contraseña

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-017],
    [*Descripción*], [Validación de longitud mínima de contraseña],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:33 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-017]
)

No especificado


#figure(
  image("screenshots/TC-CFG-017-SHORT-PASSWORD.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-017]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: No se mostró mensaje sobre longitud mínima
]

---

==== TC-CFG-025: Actualización del nombre en sidebar

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CFG-025],
    [*Descripción*], [Actualización del nombre en sidebar],
    [*Autor*], [Angel Salinas],
    [*Estado*], [#box(fill: rgb("#f8d7da"), inset: 5pt, radius: 3pt)[[FAIL ✗]]],
    [*Fecha de Ejecución*], [23/11/2025, 11:09:43 p.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CFG-025]
)

No especificado


#figure(
  image("screenshots/TC-CFG-025-SIDEBAR-UPDATE.png", width: 85%),
  caption: [Evidencia visual - TC-CFG-025]
)


*Resultado Obtenido*:

#box(
  fill: rgb("#f8d7da"),
  inset: 10pt,
  radius: 5pt,
  width: 100%,
)[
  FAIL: Sidebar no se actualizó. Esperado: "Test 1763960979151", Actual: "Test User 1763960948082"
]

---

#pagebreak()

= Análisis de Resultados

== Evaluación General

El módulo de Configuración tiene 4 test(s) fallando que requieren atención prioritaria antes de considerar el módulo como completo.


== Tests Críticos Fallando

- *TC-CFG-010*: Validación de usuario obligatorio
  Error: No se mostró mensaje de validación

- *TC-CFG-016*: Validación de campos obligatorios en seguridad
  Error: No se mostró mensaje de validación

- *TC-CFG-017*: Validación de longitud mínima de contraseña
  Error: No se mostró mensaje sobre longitud mínima

- *TC-CFG-025*: Actualización del nombre en sidebar
  Error: Sidebar no se actualizó. Esperado: "Test 1763960979151", Actual: "Test User 1763960948082"


== Recomendaciones

- Corregir tests fallando identificados
- Revisar causas raíz de los fallos
- Re-ejecutar suite después de correcciones
- Documentar hallazgos para evitar regresiones

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
`testing-qa-selenium/selenium-webdriver/tests/config.test.js`

*Page Object*:
`testing-qa-selenium/selenium-webdriver/page-objects/ConfiguraciónPage.js`

*Resultados JSON*:
`testing-qa-selenium/reports/config-test-results-*.json`

*Screenshots*:
`testing-qa-selenium/reports/screenshots/`

== Scripts de Ejecución

*Ejecutar este módulo*:
```bash
npm run test:config
```

*Generar este reporte*:
```bash
npm run report:module:config
```

---

_Reporte generado automáticamente el 2025-11-25 a las 07:25 p.m._
