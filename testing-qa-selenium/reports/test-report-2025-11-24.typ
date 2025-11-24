// Reporte de Testing Automatizado
// Generado automáticamente: 2025-11-24 12:23 a.m.

#set document(
  title: "Reporte de Testing - Sistema de Seguros VILLALOBOS",
  author: "QA Team",
  date: datetime.today(),
)

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
)

#set text(
  font: "Arial",
  size: 12pt,
  lang: "es",
)

#set heading(numbering: "1.")

// ========== PORTADA ==========

#align(center)[
  #v(3cm)

  #text(size: 24pt, weight: "bold")[
    Reporte de Testing Automatizado
  ]

  #v(1cm)

  #text(size: 18pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(2cm)

  #text(size: 14pt)[
    Framework: Selenium WebDriver + Electron
  ]

  #v(1cm)

  #text(size: 12pt)[
    Generado: 2025-11-24 12:23 a.m.
  ]

  #v(4cm)

  #text(size: 11pt, style: "italic")[
    Documento generado automáticamente
  ]
]

#pagebreak()

// ========== TABLA DE CONTENIDO ==========

#outline(
  title: "Índice",
  indent: auto,
)

#pagebreak()

// ========== RESUMEN EJECUTIVO ==========

= Resumen Ejecutivo

Este documento presenta los resultados de la ejecución de la suite completa de testing automatizado para el Sistema de Seguros VILLALOBOS.

== Métricas Globales

#table(
  columns: (3fr, 1fr),
  align: (left, right),
  table.header(
    [*Métrica*], [*Valor*]
  ),
  [Total de Tests Implementados], [98],
  [Tests Pasando], [95 (96.9%)],
  [Tests Fallando], [3 (3.1%)],
  [Última Ejecución], [2025-11-24 12:23 a.m.],
)

== Estado del Proyecto

⚠️ *BUENO* - La mayoría de los tests están pasando. Fallos: 3 (no críticos).


#pagebreak()

// ========== RESULTADOS POR MÓDULO ==========

= Resultados por Módulo

#table(
  columns: (2fr, 1fr, 1fr, 1fr, 1fr),
  align: (left, center, center, center, center),
  table.header(
    [*Módulo*], [*Total*], [*Pasando*], [*Fallando*], [*Estado*]
  ),
  [Clientes], [10], [10], [0], [✅],
  [Pólizas], [20], [20], [0], [✅],
  [Catálogos], [26], [26], [0], [✅],
  [Recibos], [20], [18], [2], [⚠️],
  [Documentos], [10], [10], [0], [✅],
  [Configuración], [12], [11], [1], [⚠️],
)

#pagebreak()

== Tests Fallando

Los siguientes tests requieren atención:

=== Recibos (2 fallos)

*TC-REC-021*: Registrar pago completo

_Error_: this.select is not a function

*TC-REC-025*: Cancelar modal registro de pago

_Error_: Modal de pago no se cerró al cancelar

=== Configuración (1 fallo)

*TC-CFG-025*: Actualización del nombre en sidebar

_Error_: Sidebar no se actualizó. Esperado: "Test 1763961426699", Actual: "Test User 1763961396130"



#pagebreak()

// ========== DETALLES DE EJECUCIÓN ==========

= Detalles de Ejecución

== Tests Ejecutados por Módulo

=== Clientes

*Total*: 10 tests *Pasando*: 10 *Fallando*: 0 *Fecha de ejecución*: 23/11/2025, 10:51:40 a.m.

=== Pólizas

*Total*: 20 tests *Pasando*: 20 *Fallando*: 0 *Fecha de ejecución*: 23/11/2025, 3:07:38 p.m.

=== Catálogos

*Total*: 26 tests *Pasando*: 26 *Fallando*: 0 *Fecha de ejecución*: 23/11/2025, 7:48:19 p.m.

=== Recibos

*Total*: 20 tests *Pasando*: 18 *Fallando*: 2 *Fecha de ejecución*: 23/11/2025, 9:43:07 p.m.

=== Documentos

*Total*: 10 tests *Pasando*: 10 *Fallando*: 0 *Fecha de ejecución*: 23/11/2025, 10:44:08 p.m.

=== Configuración

*Total*: 12 tests *Pasando*: 11 *Fallando*: 1 *Fecha de ejecución*: 23/11/2025, 11:16:07 p.m.


#pagebreak()

// ========== CONCLUSIONES ==========

= Conclusiones

== Cobertura de Testing

El sistema cuenta con 98 tests automatizados que cubren los siguientes módulos:

- *Clientes*: 10 tests
- *Pólizas*: 20 tests
- *Catálogos*: 26 tests
- *Recibos*: 20 tests
- *Documentos*: 10 tests
- *Configuración*: 12 tests

== Calidad del Sistema

El sistema demuestra una excelente calidad con 96.9% de tests pasando. Los 3 tests fallando deben ser revisados y corregidos.

== Recomendaciones

1. Ejecutar la suite de tests antes de cada release
2. Revisar y corregir tests fallando prioritariamente
3. Mantener la cobertura de tests actualizada
4. Integrar tests en el pipeline de CI/CD

---

_Reporte generado automáticamente el 2025-11-24 a las 12:23 a.m._
