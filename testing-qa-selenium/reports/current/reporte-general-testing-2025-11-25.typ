// Reporte General de Testing
// Generado automáticamente: 24/11/2025, 8:17:51 p.m.

#set document(
  title: "Reporte General de Testing",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
  header: align(right)[
    _Reporte General de Testing - Sistema de Seguros_
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
    Reporte General de Testing
  ]

  #v(0.5cm)

  #text(size: 22pt, weight: "bold")[
    Suite Completa de Pruebas Automatizadas
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
      98 Test Cases Totales
    ]

    #v(0.5cm)

    #grid(
      columns: (1fr, 1fr),
      gutter: 15pt,
      [
        #text(size: 13pt)[
          *Pasando*: 90
        ]
      ],
      [
        #text(size: 13pt)[
          *Fallando*: 8
        ]
      ],
    )

    #v(0.3cm)

    #text(size: 12pt)[
      *Tasa de Éxito*: 91.8%
    ]

    #v(0.3cm)

    #text(size: 11pt, weight: "bold")[
      Estado: EXCELENTE - Calidad superior
    ]
  ]

  #v(2cm)

  #table(
    columns: (2fr, 3fr),
    align: left,
    stroke: none,
    [*Framework*:], [Selenium WebDriver 4.27.0],
    [*Patrón*:], [Page Object Pattern],
    [*Módulos Testeados*:], [6],
    [*Fecha de Generación*:], [24/11/2025],
  )

  #v(2cm)

  #text(size: 10pt)[
    Generado automáticamente: 24 de noviembre de 2025, 08:17 p.m.
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


= Resumen Ejecutivo

El presente documento consolida los resultados de las pruebas automatizadas realizadas sobre los 6 módulos principales del sistema de gestión de seguros. La suite de testing fue ejecutada utilizando Selenium WebDriver 4.27.0 con el patrón Page Object Model.

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Test Cases Ejecutados*], [98],
    [*Tests Exitosos*], [#text(fill: green)[90 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[8 ✗]],
    [*Tasa de Éxito Global*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[*91.84%*]],
    [*Estado General*], [#box(fill: rgb("#d4edda"), inset: 5pt, radius: 3pt)[*EXCELENTE*]],
  ),
  caption: [Métricas Generales del Testing]
)

== Equipo de Testing

El proceso de testing automatizado fue desarrollado y ejecutado por:

- *Michell Sanchez*: Responsable del módulo de Clientes
- *Angel Salinas*: Responsable del módulo de Pólizas
- *Angel Flores*: Responsable del módulo de Catálogos
- *Salvador Camacho*: Responsable del módulo de Recibos
- *Sebastian Rivera*: Responsable del módulo de Documentos
- *Angel Salinas*: Responsable del módulo de Configuración

== Cobertura por Módulo

La siguiente tabla muestra la distribución de pruebas por módulo:

#figure(
  table(
    columns: (2.5fr, 1fr, 1fr, 1fr, 1.5fr),
    stroke: 0.5pt,
    fill: (x, y) => if y == 0 { rgb("#e3f2fd") } else if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center, center, center, center),
    table.header(
      [*Módulo*], [*Total*], [*Exitosos*], [*Fallidos*], [*Tasa Éxito*]
    ),
    [Clientes], [10], [#text(fill: green)[10]], [#text(fill: red)[0]], [100.0%],
    [Pólizas], [20], [#text(fill: green)[18]], [#text(fill: red)[2]], [90.0%],
    [Catálogos], [26], [#text(fill: green)[26]], [#text(fill: red)[0]], [100.0%],
    [Recibos], [20], [#text(fill: green)[18]], [#text(fill: red)[2]], [90.0%],
    [Documentos], [10], [#text(fill: green)[10]], [#text(fill: red)[0]], [100.0%],
    [Configuración], [12], [#text(fill: green)[8]], [#text(fill: red)[4]], [66.7%],
  ),
  caption: [Distribución de Pruebas por Módulo]
)


#pagebreak()

= Detalle por Módulo


== Módulo: Clientes

*Responsable*: Michell Sanchez

*Descripción*: Gestión de clientes, contactos y agentes

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [10],
    [*Tests Exitosos*], [#text(fill: green)[10 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[0 ✗]],
    [*Tasa de Éxito*], [*100.00%*],
    [*Fecha de Ejecución*], [23/11/2025, 10:51:40 a.m.],
  ),
  caption: [Métricas del Módulo Clientes]
)


=== Estado

#box(fill: rgb("#d4edda"), inset: 10pt, radius: 5pt, width: 100%)[
  ✓ Todos los tests de este módulo pasaron exitosamente.
]


=== Tests Documentados


*TC-CLI-001*: Crear Cliente Persona Física

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CLI-002*: Crear Cliente Persona Moral

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CLI-003*: Validación de RFC formato correcto

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CLI-004*: Validación de email formato válido

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CLI-005*: Validación de email formato inválido

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]




_... y 5 tests más. Ver reporte detallado del módulo para información completa._


#pagebreak()

== Módulo: Pólizas

*Responsable*: Angel Salinas

*Descripción*: Administración completa de pólizas de seguros

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [20],
    [*Tests Exitosos*], [#text(fill: green)[18 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[2 ✗]],
    [*Tasa de Éxito*], [*90.00%*],
    [*Fecha de Ejecución*], [23/11/2025, 12:38:14 p.m.],
  ),
  caption: [Métricas del Módulo Pólizas]
)


=== Análisis de Fallos

Se identificaron 2 test(s) con fallos en este módulo:


*Tests Críticos Fallando*:

- *TC-POL-001*: Crear póliza nueva
  Error: Póliza "POL-TEST-1763923103469" no aparece en la tabla

- *TC-POL-009*: Validación número de póliza único
  Error: element click intercepted: Element ... is not clickable at point (1062, 181). Other element would receive the click: ...
  (Session info: chrome=140.0.7339.133)





=== Tests Documentados


*TC-POL-001*: Crear póliza nueva

Estado: #box(fill: rgb("#f8d7da"), inset: 3pt, radius: 3pt)[[FAIL ✗]]

Error: Póliza "POL-TEST-1763923103469" no aparece en la tabla


*TC-POL-002*: Validación campos obligatorios

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-POL-003*:  fecha inicio

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-POL-004*: Búsqueda por número de póliza

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-POL-005*: Verificar estadísticas de pólizas

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]




_... y 15 tests más. Ver reporte detallado del módulo para información completa._


#pagebreak()

== Módulo: Catálogos

*Responsable*: Angel Flores

*Descripción*: Gestión de aseguradoras, ramos, formas de pago y tipos de documento

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [26],
    [*Tests Exitosos*], [#text(fill: green)[26 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[0 ✗]],
    [*Tasa de Éxito*], [*100.00%*],
    [*Fecha de Ejecución*], [23/11/2025, 7:48:19 p.m.],
  ),
  caption: [Métricas del Módulo Catálogos]
)


=== Estado

#box(fill: rgb("#d4edda"), inset: 10pt, radius: 5pt, width: 100%)[
  ✓ Todos los tests de este módulo pasaron exitosamente.
]


=== Tests Documentados


*TC-ASEG-001*: Crear Aseguradora Válida

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-ASEG-002*: Validación Nombre Vacío

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-ASEG-003*: Validación Nombre Duplicado

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-ASEG-004*: Editar Aseguradora

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-ASEG-005*: Desactivar Aseguradora

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]




_... y 21 tests más. Ver reporte detallado del módulo para información completa._


#pagebreak()

== Módulo: Recibos

*Responsable*: Salvador Camacho

*Descripción*: Control de recibos de pago y estado de cuenta

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [20],
    [*Tests Exitosos*], [#text(fill: green)[18 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[2 ✗]],
    [*Tasa de Éxito*], [*90.00%*],
    [*Fecha de Ejecución*], [23/11/2025, 9:43:07 p.m.],
  ),
  caption: [Métricas del Módulo Recibos]
)


=== Análisis de Fallos

Se identificaron 2 test(s) con fallos en este módulo:




*Otros Tests Fallando*:

- *TC-REC-021*: Registrar pago completo
- *TC-REC-025*: Cancelar modal registro de pago



=== Tests Documentados


*TC-REC-001*: Visualizar lista de recibos

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-REC-002*: Click en recibo pendiente abre modal pago

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-REC-003*: Verificar indicadores de urgencia

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-REC-006*: Búsqueda por número de recibo

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-REC-008*: Búsqueda por cliente

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]




_... y 15 tests más. Ver reporte detallado del módulo para información completa._


#pagebreak()

== Módulo: Documentos

*Responsable*: Sebastian Rivera

*Descripción*: Sistema de gestión documental y archivo digital

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [10],
    [*Tests Exitosos*], [#text(fill: green)[10 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[0 ✗]],
    [*Tasa de Éxito*], [*100.00%*],
    [*Fecha de Ejecución*], [23/11/2025, 10:44:08 p.m.],
  ),
  caption: [Métricas del Módulo Documentos]
)


=== Estado

#box(fill: rgb("#d4edda"), inset: 10pt, radius: 5pt, width: 100%)[
  ✓ Todos los tests de este módulo pasaron exitosamente.
]


=== Tests Documentados


*TC-DOC-001*: Visualización de Lista de Documentos

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-DOC-002*: Verificar columnas de la tabla

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-DOC-003*: Validación Sin Archivo Seleccionado

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-DOC-004*: Abrir modal de nuevo documento

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-DOC-007*: Validación de campos obligatorios

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]




_... y 5 tests más. Ver reporte detallado del módulo para información completa._


#pagebreak()

== Módulo: Configuración

*Responsable*: Angel Salinas

*Descripción*: Configuración de cuenta, perfil y seguridad

=== Resultados del Módulo

#figure(
  table(
    columns: (2fr, 1fr),
    stroke: 0.5pt,
    fill: (x, y) => if calc.odd(y) { rgb("#f5f5f5") },
    align: (left, center),

    [*Total de Tests*], [12],
    [*Tests Exitosos*], [#text(fill: green)[8 ✓]],
    [*Tests Fallidos*], [#text(fill: red)[4 ✗]],
    [*Tasa de Éxito*], [*66.67%*],
    [*Fecha de Ejecución*], [23/11/2025, 11:08:40 p.m.],
  ),
  caption: [Métricas del Módulo Configuración]
)


=== Análisis de Fallos

Se identificaron 4 test(s) con fallos en este módulo:


*Tests Críticos Fallando*:

- *TC-CFG-010*: Validación de usuario obligatorio
  Error: No se mostró mensaje de validación

- *TC-CFG-016*: Validación de campos obligatorios en seguridad
  Error: No se mostró mensaje de validación

- *TC-CFG-017*: Validación de longitud mínima de contraseña
  Error: No se mostró mensaje sobre longitud mínima



*Otros Tests Fallando*:

- *TC-CFG-025*: Actualización del nombre en sidebar



=== Tests Documentados


*TC-CFG-001*: Visualizar página de configuración

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CFG-002*: Cargar datos de cuenta existentes

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CFG-005*: Actualizar nombre para mostrar

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CFG-006*: Actualizar usuario

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]



*TC-CFG-007*: Actualizar email

Estado: #box(fill: rgb("#d4edda"), inset: 3pt, radius: 3pt)[[PASS ✓]]




_... y 7 tests más. Ver reporte detallado del módulo para información completa._



#pagebreak()


= Conclusiones y Recomendaciones

== Conclusiones Generales

- Se ejecutaron un total de *98 test cases* distribuidos en 6 módulos funcionales
- La tasa de éxito global es del *91.84%* (90/98 tests aprobados)
- Se identificaron *8 casos de fallo* que requieren atención


== Módulos que Requieren Atención


=== Pólizas (90.0% éxito) - Prioridad: BAJA

- Tests fallidos: 2/20
- Responsable: Angel Salinas
- Mejoras menores requeridas


=== Recibos (90.0% éxito) - Prioridad: BAJA

- Tests fallidos: 2/20
- Responsable: Salvador Camacho
- Mejoras menores requeridas


=== Configuración (66.7% éxito) - Prioridad: ALTA

- Tests fallidos: 4/12
- Responsable: Angel Salinas
- Requiere atención inmediata



== Recomendaciones Técnicas


1. *Mantenimiento*: Continuar con el esquema actual de pruebas automatizadas
2. *Expansión*: Considerar agregar pruebas de rendimiento y carga
3. *Documentación*: Actualizar la documentación técnica con los casos de éxito


== Próximos Pasos

1. Revisión de los reportes detallados por módulo
2. Corrección de defectos identificados por orden de prioridad
3. Re-ejecución de tests fallidos después de las correcciones
4. Actualización de la documentación técnica
5. Planificación de próxima iteración de testing

== Metodología

*Framework*: Selenium WebDriver 4.27.0
*Patrón de Diseño*: Page Object Model (POM)
*Lenguaje*: JavaScript (Node.js)
*Navegador*: Chrome (modo headless)
*Sistema Operativo*: darwin

*Fecha de Generación del Reporte*: lunes, 24 de noviembre de 2025, 08:17 p.m.


#pagebreak()

= Apéndice: Información Técnica

== Configuración del Entorno

*Node Version*: v24.6.0
*Sistema Operativo*: darwin
*Arquitectura*: arm64

== Estructura de Módulos Testeados


=== Clientes

*Autor del Testing*: Michell Sanchez

*Descripción*: Gestión de clientes, contactos y agentes

*Tests Ejecutados*: 10

*Archivo de Resultados*: `clientes-test-results-[timestamp].json`


=== Pólizas

*Autor del Testing*: Angel Salinas

*Descripción*: Administración completa de pólizas de seguros

*Tests Ejecutados*: 20

*Archivo de Resultados*: `polizas-test-results-[timestamp].json`


=== Catálogos

*Autor del Testing*: Angel Flores

*Descripción*: Gestión de aseguradoras, ramos, formas de pago y tipos de documento

*Tests Ejecutados*: 26

*Archivo de Resultados*: `catalogos-test-results-[timestamp].json`


=== Recibos

*Autor del Testing*: Salvador Camacho

*Descripción*: Control de recibos de pago y estado de cuenta

*Tests Ejecutados*: 20

*Archivo de Resultados*: `recibos-test-results-[timestamp].json`


=== Documentos

*Autor del Testing*: Sebastian Rivera

*Descripción*: Sistema de gestión documental y archivo digital

*Tests Ejecutados*: 10

*Archivo de Resultados*: `documentos-test-results-[timestamp].json`


=== Configuración

*Autor del Testing*: Angel Salinas

*Descripción*: Configuración de cuenta, perfil y seguridad

*Tests Ejecutados*: 12

*Archivo de Resultados*: `config-test-results-[timestamp].json`


== Repositorio y Documentación

Para acceder a los reportes detallados de cada módulo, consultar:

- `reports/modulo-clientes-report-2025-11-25.pdf`
- `reports/modulo-polizas-report-2025-11-25.pdf`
- `reports/modulo-catalogos-report-2025-11-25.pdf`
- `reports/modulo-recibos-report-2025-11-25.pdf`
- `reports/modulo-documentos-report-2025-11-25.pdf`
- `reports/modulo-config-report-2025-11-25.pdf`

#v(2em)

#align(center)[
  #text(10pt, style: "italic")[
    Este reporte fue generado automáticamente por el sistema de testing

    Framework: Selenium WebDriver 4.27.0
  ]
]
