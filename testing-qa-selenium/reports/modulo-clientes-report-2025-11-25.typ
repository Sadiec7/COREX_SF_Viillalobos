// Reporte de Testing - Módulo Clientes
// Generado automáticamente: 2025-11-25 07:25 p.m.

#set document(
  title: "Reporte de Testing - Módulo Clientes",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte de Testing - Módulo Clientes_
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
    Módulo de Clientes
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
    [*Última Ejecución*:], [23/11/2025, 10:51:40 a.m.],
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

Administración de clientes y contactos del sistema de seguros.

== Cobertura de Testing

Este reporte documenta la ejecución de 10 test cases automatizados que validan la funcionalidad crítica del módulo de Clientes.

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
    [Fecha de Ejecución], [23/11/2025, 10:51:40 a.m.],
    [Estado General], [PERFECTO - Todos los tests pasando],
  ),
  caption: [Resumen de métricas - Módulo Clientes]
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


==== TC-CLI-001: Crear Cliente Persona Física

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-001],
    [*Descripción*], [Verificar que se puede crear un cliente Persona Física con todos los datos válidos.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:51:49 a.m.],

    [*Precondiciones*], [
      - Usuario autenticado
      - En vista de clientes (`/app\#clientes`)
    ],

    [*Datos de Prueba*], [
      ```
      Nombre: Juan Pérez López
      RFC: PELJ850101ABC
      Email: juan.perez\@test.com
      Teléfono: 5551234567
      Celular: 5559876543
      Dirección: Calle Reforma 123, CDMX
      Notas: Cliente preferente
      ```
    ],
  ),
  caption: [Información general - TC-CLI-001]
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
    [1], [Hacer clic en botón "Nuevo Cliente"], [Modal se cierra],
    [2], [Verificar que modal se abre], [Toast message: "Cliente creado correctamente"],
    [3], [Ingresar todos los datos], [Cliente visible en primera página de tabla],
    [4], [Hacer clic en "Guardar"], [Datos coinciden con los ingresados],
    [5], [Esperar cierre de modal], [Modal se cierra],
    [6], [Verificar que cliente aparece en tabla], [Modal se cierra],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-CLI-001-AFTER-SUBMIT.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-001]
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

==== TC-CLI-002: Crear Cliente Persona Moral

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-002],
    [*Descripción*], [Verificar que se puede crear un cliente Persona Moral.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:51:53 a.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      Nombre: Empresa Test SA de CV
      RFC: ETE850101XYZ
      Email: contacto\@empresa.test
      Teléfono: 5559999999
      Dirección: Av. Insurgentes 500, CDMX
      ```
    ],
  ),
  caption: [Información general - TC-CLI-002]
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
    [1], [Clic en "Nuevo Cliente"], [Cliente Persona Moral creado],
    [2], [Ingresar datos de Persona Moral], [RFC de 12 caracteres aceptado],
    [3], [Guardar], [Badge muestra "Moral" en tabla],
    [4], [Verificar creación], [Cliente Persona Moral creado],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-CLI-002-CREATED.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-002]
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

==== TC-CLI-003: Validación de RFC Formato Correcto

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-003],
    [*Descripción*], [Verificar que el sistema valida el formato correcto del RFC.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:51:55 a.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-003]
)

No especificado


#figure(
  image("screenshots/TC-CLI-003-RFC-VALID.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-003]
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

==== TC-CLI-004: Validación de Email Formato

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-004],
    [*Descripción*], [Validación de Email Formato],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:51:58 a.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-004]
)

No especificado


#figure(
  image("screenshots/TC-CLI-004-EMAIL-VALID.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-004]
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

==== TC-CLI-005: Validación de Teléfono (10 dígitos)

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-005],
    [*Descripción*], [Verificar que teléfono y celular aceptan exactamente 10 dígitos.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:52:01 a.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-005]
)

No especificado


#figure(
  image("screenshots/TC-CLI-005-EMAIL-INVALID.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-005]
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

==== TC-CLI-006: Editar Cliente Existente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-006],
    [*Descripción*], [Verificar que se puede editar la información de un cliente existente.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:52:04 a.m.],

    [*Precondiciones*], [
      - Cliente con ID conocido existe en BD
      - Cliente: "Juan Pérez López", RFC: "PELJ850101ABC"
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-006]
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
    [1], [Buscar cliente "Juan Pérez"], [Modal muestra datos correctos precargados],
    [2], [Hacer clic en botón "Editar" (ícono lápiz)], [Cambios se guardan exitosamente],
    [3], [Modal se abre con datos precargados], [Toast: "Cliente actualizado correctamente"],
    [4], [Modificar email a: "nuevo.email\@test.com"], [Tabla refleja nuevos valores],
    [5], [Modificar teléfono a: "5559999999"], [RFC no cambia (no editable o validado)],
    [6], [Guardar cambios], [Modal muestra datos correctos precargados],
    [7], [Verificar actualización en tabla], [Modal muestra datos correctos precargados],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-CLI-006-SEARCH-RESULTS.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-006]
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

==== TC-CLI-007: Eliminar Cliente

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-007],
    [*Descripción*], [Verificar que se puede eliminar (marcar como inactivo) un cliente.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:52:16 a.m.],

    [*Precondiciones*], [
      - Cliente de prueba existe en sistema
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-007]
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
    [1], [Localizar cliente en tabla], [Modal de confirmación aparece],
    [2], [Hacer clic en botón "Eliminar" (ícono basura)], [Al confirmar, cliente se marca como inactivo],
    [3], [Aparece modal de confirmación], [Toast: "Cliente eliminado correctamente"],
    [4], [Leer mensaje: "¿Está seguro de que desea eliminar..."], [Cliente desaparece de lista (si filtro solo activos)],
    [5], [Hacer clic en "Eliminar"], [Cliente aún existe en BD (soft delete)],
    [6], [Esperar confirmación], [Modal de confirmación aparece],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-CLI-007-NO-RESULTS.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-007]
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

==== TC-CLI-008: Búsqueda por Nombre

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-008],
    [*Descripción*], [Verificar que la búsqueda por nombre funciona correctamente.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:52:19 a.m.],

    [*Precondiciones*], [
      - BD contiene:
      - "Juan Pérez López"
      - "María García Rodríguez"
      - "Pedro Martínez Sánchez"
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-008]
)

No especificado


#figure(
  image("screenshots/TC-CLI-008-REQUIRED-FIELDS.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-008]
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

==== TC-CLI-009: Búsqueda por RFC

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-009],
    [*Descripción*], [Verificar que se puede buscar cliente por RFC.],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:52:21 a.m.],

    [*Precondiciones*], [
      No especificado
    ],

    [*Datos de Prueba*], [
      ```
      - Cliente 1: RFC "PELJ850101ABC"
      - Cliente 2: RFC "GARC900505XYZ"
      ```
    ],
  ),
  caption: [Información general - TC-CLI-009]
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
    [1], [En campo de búsqueda, escribir: "PELJ"], [Búsqueda por RFC funciona],
    [2], [Observar resultados filtrados], [Coincidencias parciales muestran resultados],
    [3], [Escribir RFC completo: "PELJ850101ABC"], [RFC completo muestra cliente exacto],
    [4], [Verificar que solo aparece 1 cliente], [Búsqueda por RFC funciona],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-CLI-009-CANCELLED.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-009]
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

==== TC-CLI-010: Filtro por Tipo de Persona

#figure(
  table(
    columns: (1.5fr, 3.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left + top, left + top),

    [*Test Case ID*], [TC-CLI-010],
    [*Descripción*], [Verificar que se pueden filtrar clientes por tipo (Física/Moral).],
    [*Autor*], [Michell Sanchez],
    [*Estado*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[[PASS ✓]]],
    [*Fecha de Ejecución*], [23/11/2025, 10:52:22 a.m.],

    [*Precondiciones*], [
      - BD contiene:
      - 5 Personas Físicas
      - 3 Personas Morales
    ],

    [*Datos de Prueba*], [
      No especificado
    ],
  ),
  caption: [Información general - TC-CLI-010]
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
    [1], [Hacer clic en filtro "Persona Física"], [],
    [2], [Verificar que solo se muestran 5 clientes], [],
    [3], [Todos tienen badge "Física" verde], [],
    [4], [Hacer clic en filtro "Persona Moral"], [],
    [5], [Verificar que solo se muestran 3 clientes], [],
    [6], [Todos tienen badge "Moral" morado], [],
    [7], [Desactivar filtros], [],
    [8], [Verificar que se muestran todos (8 clientes)], [],
  ),
  caption: [Pasos de ejecución detallados]
)



#figure(
  image("screenshots/TC-CLI-010-STATS.png", width: 85%),
  caption: [Evidencia visual - TC-CLI-010]
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

El módulo de Clientes demuestra una calidad excepcional con el 100% de tests pasando. Todos los casos de prueba se ejecutaron exitosamente.



== Recomendaciones

- Mantener la suite de tests actualizada
- Ejecutar tests antes de cada deployment
- Considerar agregar tests de regresión adicionales
- Integrar en pipeline de CI/CD

#pagebreak()

= Apéndice

== Ubicación de Archivos

*Código Fuente del Test*:
`testing-qa-selenium/selenium-webdriver/tests/clientes.test.js`

*Page Object*:
`testing-qa-selenium/selenium-webdriver/page-objects/ClientesPage.js`

*Resultados JSON*:
`testing-qa-selenium/reports/clientes-test-results-*.json`

*Screenshots*:
`testing-qa-selenium/reports/screenshots/`

== Scripts de Ejecución

*Ejecutar este módulo*:
```bash
npm run test:clientes
```

*Generar este reporte*:
```bash
npm run report:module:clientes
```

---

_Reporte generado automáticamente el 2025-11-25 a las 07:25 p.m._
