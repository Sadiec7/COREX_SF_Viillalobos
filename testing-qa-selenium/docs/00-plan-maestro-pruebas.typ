#set document(
  title: "Plan Maestro de Pruebas - Sistema de Seguros VILLALOBOS",
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
    Plan Maestro de Pruebas
  ]

  #v(0.5cm)

  #text(size: 18pt)[
    Sistema de Seguros VILLALOBOS
  ]

  #v(0.5cm)

  #text(size: 14pt)[
    Proyecto de Testing con Selenium
  ]

  #v(1cm)

  #image("../../../build/icon.png", width: 20%) // Ajustar ruta según sea necesario

  #v(1cm)

  #text(size: 12pt)[
    Versión 1.0 \
    #datetime.today().display()
  ]
]

#pagebreak()

= Control de Versiones

#table(
  columns: (1fr, 1fr, 2fr, 3fr),
  align: left,
  table.header(
    [*Versión*], [*Fecha*], [*Autor*], [*Descripción*]
  ),
  [1.0], [2025-11-22], [Equipo QA], [Versión inicial del Plan Maestro]
)

#pagebreak()

#outline(
  title: "Tabla de Contenido",
  indent: auto,
)

#pagebreak()

= Introducción

== Propósito del Documento

Este documento establece el Plan Maestro de Pruebas para el Sistema de Seguros VILLALOBOS, definiendo la estrategia, alcance, recursos y cronograma de las actividades de testing que se llevarán a cabo utilizando Selenium como herramienta principal de automatización.

== Alcance

El presente plan cubre:

- Pruebas funcionales automatizadas de los módulos principales del sistema
- Pruebas de interfaz de usuario (UI)
- Pruebas de integración entre módulos
- Validaciones de datos y reglas de negocio

*Módulos bajo prueba:*
- Autenticación y gestión de sesiones
- Gestión de Clientes
- Gestión de Pólizas de Seguros

== Audiencia

Este documento está dirigido a:
- Equipo de desarrollo
- Equipo de QA
- Product Owner
- Stakeholders del proyecto
- Profesores y evaluadores (contexto universitario)

= Objetivos de las Pruebas

== Objetivos Generales

+ *Asegurar la calidad* del sistema antes del despliegue
+ *Validar funcionalidades* críticas del negocio
+ *Detectar defectos* tempranamente en el ciclo de desarrollo
+ *Documentar evidencias* de las pruebas realizadas
+ *Automatizar* casos de prueba repetitivos
+ *Facilitar regresión* ante cambios futuros

== Objetivos Específicos

=== Módulo de Autenticación
- Verificar login/logout funciona correctamente
- Validar manejo de credenciales inválidas
- Comprobar persistencia de sesión
- Validar seguridad básica

=== Módulo de Clientes
- Verificar CRUD completo de clientes
- Validar formularios y reglas de validación
- Comprobar búsqueda y filtros
- Validar paginación con grandes volúmenes de datos

=== Módulo de Pólizas
- Verificar CRUD completo de pólizas
- Validar relaciones con clientes y catálogos
- Comprobar cálculos de fechas y vigencias
- Validar reglas de negocio

= Estrategia de Pruebas

== Enfoque Dual: Selenium IDE + WebDriver

El proyecto utiliza un enfoque dual para maximizar cobertura y facilidad de uso:

#table(
  columns: (2fr, 3fr, 3fr),
  align: left,
  table.header(
    [*Herramienta*], [*Uso*], [*Casos Típicos*]
  ),
  [*Selenium IDE*],
  [Grabación visual de pruebas \ Demos y presentaciones],
  [Login básico \ Navegación simple \ CRUD básico],

  [*Selenium WebDriver*],
  [Pruebas programáticas \ Automatización completa],
  [Validaciones complejas \ Integración \ Datos masivos]
)

== Tipos de Pruebas

+ *Pruebas Funcionales*: Validar que cada función cumple requisitos
+ *Pruebas de UI*: Verificar elementos visuales y navegación
+ *Pruebas de Validación*: Comprobar validaciones de formularios
+ *Pruebas de Integración*: Verificar interacción entre módulos
+ *Pruebas de Regresión*: Asegurar que cambios no afecten funcionalidad existente

== Niveles de Prueba

#table(
  columns: (1fr, 3fr),
  align: left,
  table.header(
    [*Nivel*], [*Descripción*]
  ),
  [*Humo*], [Pruebas básicas para verificar funcionamiento general],
  [*Funcional*], [Pruebas detalladas de cada funcionalidad],
  [*Integración*], [Pruebas de interacción entre módulos],
  [*Regresión*], [Re-ejecución de pruebas ante cambios]
)

= Alcance de las Pruebas

== Módulos en Scope

=== 1. Autenticación (Alta Prioridad)
- Login de usuarios
- Logout
- Validación de credenciales
- Manejo de sesiones
- Redirecciones

*Casos de prueba estimados:* 10

=== 2. Gestión de Clientes (Alta Prioridad)
- Crear cliente (Persona Física/Moral)
- Leer/Consultar clientes
- Actualizar información de cliente
- Eliminar cliente
- Búsqueda y filtros
- Paginación
- Validaciones (RFC, email, teléfono)
- Activar/Desactivar cliente
- Gestión de documentos adjuntos

*Casos de prueba estimados:* 20

=== 3. Gestión de Pólizas (Alta Prioridad)
- Crear póliza
- Leer/Consultar pólizas
- Actualizar póliza
- Eliminar póliza
- Asociar con cliente
- Seleccionar aseguradora y ramo
- Validaciones de fechas
- Cálculo de vigencias
- Búsqueda y filtros avanzados
- Paginación

*Casos de prueba estimados:* 20

== Módulos Fuera de Scope (Fase Inicial)

- Reportes y gráficas
- Gestión de recibos
- Gestión de documentos independiente
- Catálogos (se prueban indirectamente)

= Recursos

== Recursos Humanos

#table(
  columns: (2fr, 2fr, 3fr),
  align: left,
  table.header(
    [*Rol*], [*Responsable*], [*Responsabilidades*]
  ),
  [QA Lead], [[Nombre]], [Planificación, coordinación, reportes],
  [Test Automation], [[Nombre]], [Desarrollo de scripts Selenium],
  [Tester Manual], [[Nombre]], [Ejecución con Selenium IDE],
  [Documentador], [[Nombre]], [Documentación en Typst]
)

== Recursos Tecnológicos

=== Hardware
- Computadoras de desarrollo (mínimo 8GB RAM)
- Navegadores Chrome/Firefox actualizados

=== Software
- Node.js 18+
- Selenium WebDriver 4.x
- ChromeDriver (compatible con versión de Chrome)
- Electron ChromeDriver
- Selenium IDE Extension
- Typst (para documentación)

=== Ambiente de Pruebas
- Base de datos de prueba (SQLite)
- Datos de prueba predefinidos
- Aplicación Electron en modo desarrollo

= Cronograma

#table(
  columns: (1fr, 2fr, 3fr, 1fr),
  align: left,
  table.header(
    [*Fase*], [*Actividad*], [*Descripción*], [*Semana*]
  ),
  [Fase 1], [Documentación], [Crear planes de prueba detallados], [1],
  [Fase 2], [Setup Técnico], [Configurar Selenium y ambiente], [2],
  [Fase 3], [Autenticación], [Implementar y ejecutar pruebas], [3],
  [Fase 4], [Clientes], [Implementar y ejecutar pruebas], [4],
  [Fase 5], [Pólizas], [Implementar y ejecutar pruebas], [5],
  [Fase 6], [Reportes], [Generar reportes finales], [6]
)

= Criterios de Aceptación

== Criterios de Éxito

Una prueba se considera exitosa cuando:

+ Se ejecuta sin errores técnicos
+ El resultado obtenido coincide con el resultado esperado
+ No se producen efectos secundarios no deseados
+ El tiempo de ejecución es aceptable (< 30 segundos por caso)

== Criterios de Fallo

Una prueba falla cuando:

+ Genera excepciones o errores técnicos
+ El resultado no coincide con el esperado
+ Se producen efectos secundarios no controlados
+ Timeout (> 30 segundos sin respuesta)

== Métricas de Calidad

#table(
  columns: (2fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Métrica*], [*Objetivo*], [*Descripción*]
  ),
  [Cobertura de Casos], [≥ 80%], [% de casos implementados vs planificados],
  [Tasa de Éxito], [≥ 95%], [% de pruebas exitosas],
  [Defectos Encontrados], [Meta], [Documentar todos los defectos],
  [Tiempo de Ejecución], [< 10 min], [Tiempo total de suite completa]
)

= Gestión de Defectos

== Severidad de Defectos

#table(
  columns: (1fr, 3fr, 2fr),
  align: left,
  table.header(
    [*Nivel*], [*Descripción*], [*Acción*]
  ),
  [*Crítico*], [Sistema no funciona, datos corruptos], [Bloquea release],
  [*Alto*], [Funcionalidad principal no opera], [Debe corregirse],
  [*Medio*], [Funcionalidad secundaria afectada], [Corregir si hay tiempo],
  [*Bajo*], [Problemas cosméticos], [Opcional]
)

== Proceso de Reporte

+ Ejecutar prueba y documentar fallo
+ Capturar screenshot/video del error
+ Registrar en sistema de tracking
+ Asignar severidad y prioridad
+ Notificar a equipo de desarrollo
+ Seguimiento hasta resolución

= Entregables

== Documentación

+ Plan Maestro de Pruebas (este documento)
+ Estrategia de Testing
+ Planes detallados por módulo (3 documentos)
+ Casos de prueba documentados
+ Matrices de trazabilidad

== Artefactos de Prueba

+ Scripts Selenium WebDriver (.js)
+ Proyectos Selenium IDE (.side)
+ Page Objects
+ Helpers y utilidades
+ Configuraciones

== Reportes

+ Reportes de ejecución (HTML/JSON)
+ Screenshots de fallos
+ Logs de ejecución
+ Resumen ejecutivo
+ Métricas de cobertura

= Riesgos y Mitigación

#table(
  columns: (2fr, 2fr, 2fr),
  align: left,
  table.header(
    [*Riesgo*], [*Impacto*], [*Mitigación*]
  ),
  [Cambios en UI], [Alto], [Usar selectores robustos, Page Objects],
  [Datos inconsistentes], [Medio], [Usar datos de prueba controlados],
  [Timeouts], [Bajo], [Configurar esperas explícitas],
  [Ambiente inestable], [Medio], [Base de datos de prueba dedicada],
  [Falta de tiempo], [Alto], [Priorizar casos críticos]
)

= Aprobaciones

Este plan debe ser revisado y aprobado por:

#table(
  columns: (2fr, 2fr, 1fr),
  align: left,
  table.header(
    [*Rol*], [*Nombre*], [*Firma/Fecha*]
  ),
  [QA Lead], [], [],
  [Product Owner], [], [],
  [Líder Técnico], [], [],
  [Profesor/Evaluador], [], []
)

#pagebreak()

= Referencias

+ Selenium Documentation: https://www.selenium.dev/documentation/
+ IEEE 829 Standard for Software Test Documentation
+ ISTQB Foundation Level Syllabus
+ Documentación del Sistema de Seguros VILLALOBOS

---

*Fin del documento*
