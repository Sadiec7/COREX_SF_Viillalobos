#set document(
  title: "Plan de Pruebas - Módulo Recibos",
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
    Módulo de Gestión de Recibos
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

Este documento detalla el plan de pruebas para el módulo de Gestión de Recibos del Sistema de Seguros VILLALOBOS. Los recibos representan las fracciones de pago de las pólizas de seguro.

== Alcance

El módulo de recibos comprende:
- Generación automática de recibos al crear pólizas
- Visualización de recibos con filtros y búsqueda
- Marcar recibos como pagados/pendientes
- Cálculo automático de fechas de corte
- Gestión de estados (Pendiente, Pagado, Vencido)
- Búsqueda por póliza, cliente, aseguradora
- Paginación de resultados
- Estadísticas de recibos

== Referencias

- Plan Maestro de Pruebas
- Estrategia de Testing
- Plan de Pruebas de Pólizas (TC-POL)
- Especificación funcional del módulo de recibos

= Descripción del Módulo

== Funcionalidad Principal

El módulo de recibos gestiona las fracciones de pago de las pólizas de seguro:

*Características principales:*
- Los recibos se generan automáticamente al crear una póliza
- Cada recibo representa una fracción de pago (mensual, trimestral, etc.)
- Los recibos tienen estados: Pendiente, Pagado, Vencido
- Las fechas de corte se calculan automáticamente ANTES del inicio del periodo
- Búsqueda unificada por número de recibo, póliza, cliente, aseguradora
- Filtros por estado (pendiente/pagado/vencido)
- Estadísticas en tiempo real

== Flujo de Usuario

1. Usuario navega al módulo de Recibos
2. Visualiza lista de recibos con información resumida
3. Puede buscar recibos por múltiples criterios
4. Aplica filtros por estado si es necesario
5. Marca recibos como pagados cuando corresponde
6. Puede ver detalles completos de cada recibo
7. Puede acceder a la póliza relacionada

== Reglas de Negocio

*RN-REC-001:* Los recibos solo se generan automáticamente al crear pólizas
*RN-REC-002:* No se permite crear recibos manualmente
*RN-REC-003:* La fecha de corte debe ser ANTES del inicio del periodo cubierto
*RN-REC-004:* Un recibo pagado no puede volver a estado pendiente
*RN-REC-005:* El monto del recibo debe coincidir con la fracción de la prima
*RN-REC-006:* Los recibos vencidos se marcan automáticamente al pasar la fecha de corte

= Casos de Prueba

== TC-REC-001: Visualización de Lista de Recibos

*Descripción:* Verificar que la lista de recibos se muestre correctamente

*Precondiciones:*
- Usuario autenticado
- Existen pólizas con recibos generados

*Pasos:*
1. Navegar al módulo de Recibos
2. Esperar a que cargue la tabla

*Resultado Esperado:*
- Se muestra la tabla de recibos
- Cada fila muestra: número, póliza, cliente, periodo, monto, fecha corte, estado, aseguradora
- Se muestran las estadísticas: total, pendientes, pagados, vencidos
- La paginación está visible si hay más de 10 registros

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-002: Búsqueda por Número de Recibo

*Descripción:* Verificar búsqueda por número de recibo

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos en el sistema

*Pasos:*
1. Ingresar número de recibo en buscador
2. Esperar resultados

*Resultado Esperado:*
- Se filtra la lista mostrando solo el recibo buscado
- Estadísticas se actualizan
- Mensaje vacío si no existe

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-003: Búsqueda por Número de Póliza

*Descripción:* Verificar búsqueda por número de póliza

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos de diferentes pólizas

*Pasos:*
1. Ingresar número de póliza en buscador
2. Esperar resultados

*Resultado Esperado:*
- Se muestran todos los recibos de esa póliza
- Se respeta el orden por fracción
- Estadísticas se actualizan correctamente

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-004: Búsqueda por Nombre de Cliente

*Descripción:* Verificar búsqueda por nombre del cliente

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos de diferentes clientes

*Pasos:*
1. Ingresar nombre de cliente en buscador
2. Esperar resultados

*Resultado Esperado:*
- Se muestran todos los recibos del cliente
- Búsqueda case-insensitive
- Búsqueda parcial funciona

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-005: Búsqueda por Aseguradora

*Descripción:* Verificar búsqueda por nombre de aseguradora

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos de diferentes aseguradoras

*Pasos:*
1. Ingresar nombre de aseguradora
2. Esperar resultados

*Resultado Esperado:*
- Se filtran recibos de esa aseguradora
- Búsqueda case-insensitive

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-006: Filtro por Estado Pendiente

*Descripción:* Verificar filtro de recibos pendientes

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos en diferentes estados

*Pasos:*
1. Abrir modal de filtros
2. Seleccionar checkbox "Pendientes"
3. Aplicar filtros

*Resultado Esperado:*
- Solo se muestran recibos con estado "Pendiente"
- Badge de filtros muestra "1"
- Estadísticas se actualizan

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-007: Filtro por Estado Pagado

*Descripción:* Verificar filtro de recibos pagados

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos pagados

*Pasos:*
1. Abrir modal de filtros
2. Seleccionar checkbox "Pagados"
3. Aplicar filtros

*Resultado Esperado:*
- Solo recibos pagados visibles
- Badge muestra "1"

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-008: Filtro por Estado Vencido

*Descripción:* Verificar filtro de recibos vencidos

*Precondiciones:*
- Usuario en módulo de Recibos
- Existen recibos vencidos

*Pasos:*
1. Abrir modal de filtros
2. Seleccionar checkbox "Vencidos"
3. Aplicar filtros

*Resultado Esperado:*
- Solo recibos vencidos visibles
- Badge muestra "1"

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-009: Filtros Múltiples

*Descripción:* Verificar filtros múltiples simultáneos

*Precondiciones:*
- Usuario en módulo de Recibos

*Pasos:*
1. Abrir modal de filtros
2. Seleccionar "Pendientes" y "Vencidos"
3. Aplicar filtros

*Resultado Esperado:*
- Se muestran recibos pendientes Y vencidos
- Badge muestra "2"
- Los pagados están ocultos

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-010: Limpiar Filtros

*Descripción:* Verificar limpieza de filtros

*Precondiciones:*
- Filtros aplicados

*Pasos:*
1. Click en "Limpiar" en modal de filtros
2. Cerrar modal

*Resultado Esperado:*
- Todos los recibos son visibles
- Checkboxes sin seleccionar
- Badge oculto

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-011: Marcar Recibo como Pagado

*Descripción:* Verificar cambio de estado a pagado

*Precondiciones:*
- Usuario en módulo de Recibos
- Existe recibo pendiente

*Pasos:*
1. Localizar recibo pendiente
2. Click en botón "Marcar como pagado" (check verde)
3. Esperar actualización

*Resultado Esperado:*
- Estado cambia a "Pagado"
- Se registra fecha de pago (hoy)
- Estadísticas se actualizan
- Botón cambia a "Revertir a pendiente"
- Toast de éxito se muestra

*Prioridad:* Crítica
*Tipo:* Funcional

---

== TC-REC-012: Revertir Recibo a Pendiente

*Descripción:* Verificar reversión de pago

*Precondiciones:*
- Existe recibo pagado

*Pasos:*
1. Localizar recibo pagado
2. Click en botón "Revertir a pendiente"
3. Esperar actualización

*Resultado Esperado:*
- Estado cambia a "Pendiente"
- Fecha de pago se elimina
- Estadísticas actualizadas
- Toast de éxito

*Prioridad:* Alta
*Tipo:* Funcional

---

== TC-REC-013: Ver Detalles de Recibo (Modal)

*Descripción:* Verificar apertura de modal de detalles

*Precondiciones:*
- Usuario en módulo de Recibos

*Pasos:*
1. Click en una fila de recibo (o botón editar)
2. Observar modal

*Resultado Esperado:*
- Modal se abre mostrando todos los datos
- Formulario es editable
- Botón "Guardar" visible

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-014: Editar Recibo - Cambiar Monto

*Descripción:* Verificar edición de monto

*Precondiciones:*
- Modal de recibo abierto

*Pasos:*
1. Modificar campo "Monto"
2. Click en "Guardar"
3. Cerrar modal

*Resultado Esperado:*
- Monto se actualiza
- Cambio se refleja en tabla
- Toast de éxito

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-015: Validación Monto Negativo

*Descripción:* Verificar que no se permiten montos negativos

*Precondiciones:*
- Modal de recibo abierto

*Pasos:*
1. Ingresar monto negativo (ej: -100)
2. Intentar guardar

*Resultado Esperado:*
- Mensaje de error
- No se guarda el cambio
- Campo se marca como inválido

*Prioridad:* Alta
*Tipo:* Validación

---

== TC-REC-016: Paginación - Primera Página

*Descripción:* Verificar navegación a primera página

*Precondiciones:*
- Más de 10 recibos en sistema
- Usuario en página 2 o superior

*Pasos:*
1. Click en botón "Primera" o "1"
2. Observar tabla

*Resultado Esperado:*
- Se muestran primeros 10 recibos
- Indicador de página en "1"
- Info de paginación correcta

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-017: Paginación - Última Página

*Descripción:* Verificar navegación a última página

*Precondiciones:*
- Más de 10 recibos

*Pasos:*
1. Click en botón "Última"
2. Observar tabla

*Resultado Esperado:*
- Se muestran últimos recibos
- Indicador correcto
- Botón "Siguiente" deshabilitado

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-018: Cambiar Items por Página

*Descripción:* Verificar cambio de cantidad de registros

*Precondiciones:*
- Usuario en módulo de Recibos

*Pasos:*
1. Cambiar selector "Por página" a 25
2. Observar tabla

*Resultado Esperado:*
- Se muestran hasta 25 recibos
- Paginación se recalcula
- Info de paginación actualizada

*Prioridad:* Baja
*Tipo:* Funcional

---

== TC-REC-019: Estadísticas - Total de Recibos

*Descripción:* Verificar cálculo de estadística Total

*Precondiciones:*
- Existen recibos en sistema

*Pasos:*
1. Observar card "Total Recibos"
2. Contar recibos manualmente

*Resultado Esperado:*
- Número coincide con total de recibos
- Se actualiza al filtrar/buscar

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-020: Estadísticas - Recibos Pendientes

*Descripción:* Verificar contador de pendientes

*Precondiciones:*
- Existen recibos pendientes

*Pasos:*
1. Observar card "Pendientes"
2. Contar recibos pendientes

*Resultado Esperado:*
- Contador correcto
- Color naranja
- Actualización dinámica

*Prioridad:* Media
*Tipo:* Funcional

---

== TC-REC-021: Validar Fecha de Corte Correcta

*Descripción:* Verificar que fecha de corte es ANTES del periodo

*Precondiciones:*
- Recibo recién generado de póliza

*Pasos:*
1. Ver detalles de recibo
2. Comparar fecha_corte con fecha_inicio_periodo

*Resultado Esperado:*
- fecha_corte < fecha_inicio_periodo
- Diferencia = días_anticipacion_alerta (por defecto 7 días)

*Prioridad:* Crítica
*Tipo:* Validación de Negocio

---

== TC-REC-022: Estado Vacío - Sin Recibos

*Descripción:* Verificar mensaje cuando no hay recibos

*Precondiciones:*
- Base de datos sin recibos (o filtro que no coincide)

*Pasos:*
1. Navegar a Recibos
2. Observar mensaje

*Resultado Esperado:*
- Mensaje "No hay recibos registrados"
- Icono de documento
- Sugerencia de ajustar filtros

*Prioridad:* Baja
*Tipo:* UX

---

== TC-REC-023: Búsqueda Sin Resultados

*Descripción:* Verificar mensaje cuando búsqueda no coincide

*Precondiciones:*
- Usuario en módulo de Recibos

*Pasos:*
1. Buscar texto que no existe (ej: "ZZZZZZ")
2. Observar resultado

*Resultado Esperado:*
- Mensaje de estado vacío
- Estadísticas en cero
- Opción de limpiar búsqueda

*Prioridad:* Baja
*Tipo:* UX

---

== TC-REC-024: Navegación a Póliza desde Recibo

*Descripción:* Verificar enlace a póliza relacionada

*Precondiciones:*
- Usuario visualizando recibo

*Pasos:*
1. Click en número de póliza del recibo
2. Observar navegación

*Resultado Esperado:*
- Navega al módulo de Pólizas
- Póliza relacionada está seleccionada/filtrada
- Context se mantiene

*Prioridad:* Media
*Tipo:* Navegación

---

== TC-REC-025: Columna Acciones - Hover Consistente

*Descripción:* Verificar comportamiento visual de hover en fila

*Precondiciones:*
- Usuario en módulo de Recibos

*Pasos:*
1. Pasar mouse sobre fila de recibo
2. Observar columna de acciones

*Resultado Esperado:*
- Toda la fila cambia a fondo gris claro
- Columna de acciones TAMBIÉN cambia a gris
- Sin transparencias
- Transición suave

*Prioridad:* Baja
*Tipo:* UI/UX

---

= Matriz de Trazabilidad

#table(
  columns: (auto, auto, auto, auto),
  [*Caso*], [*Funcionalidad*], [*Prioridad*], [*Estado*],
  [TC-REC-001], [Visualización], [Alta], [Pendiente],
  [TC-REC-002], [Búsqueda], [Alta], [Pendiente],
  [TC-REC-003], [Búsqueda], [Alta], [Pendiente],
  [TC-REC-004], [Búsqueda], [Media], [Pendiente],
  [TC-REC-005], [Búsqueda], [Media], [Pendiente],
  [TC-REC-006], [Filtros], [Alta], [Pendiente],
  [TC-REC-007], [Filtros], [Alta], [Pendiente],
  [TC-REC-008], [Filtros], [Alta], [Pendiente],
  [TC-REC-009], [Filtros], [Media], [Pendiente],
  [TC-REC-010], [Filtros], [Media], [Pendiente],
  [TC-REC-011], [Pagos], [Crítica], [Pendiente],
  [TC-REC-012], [Pagos], [Alta], [Pendiente],
  [TC-REC-013], [CRUD], [Media], [Pendiente],
  [TC-REC-014], [CRUD], [Media], [Pendiente],
  [TC-REC-015], [Validación], [Alta], [Pendiente],
  [TC-REC-016], [Paginación], [Media], [Pendiente],
  [TC-REC-017], [Paginación], [Media], [Pendiente],
  [TC-REC-018], [Paginación], [Baja], [Pendiente],
  [TC-REC-019], [Estadísticas], [Media], [Pendiente],
  [TC-REC-020], [Estadísticas], [Media], [Pendiente],
  [TC-REC-021], [Negocio], [Crítica], [Pendiente],
  [TC-REC-022], [UX], [Baja], [Pendiente],
  [TC-REC-023], [UX], [Baja], [Pendiente],
  [TC-REC-024], [Navegación], [Media], [Pendiente],
  [TC-REC-025], [UI], [Baja], [Pendiente],
)

= Criterios de Aceptación

*Criterio de Éxito:* Todos los casos de prueba críticos y de alta prioridad deben pasar exitosamente.

*Casos Críticos:*
- TC-REC-011: Marcar como pagado
- TC-REC-021: Validar fecha de corte

*Casos de Alta Prioridad:*
- TC-REC-001, 002, 003, 006, 007, 008, 012, 015

*Cobertura Mínima:* 90% de los casos de prueba deben ejecutarse exitosamente.

= Recursos Necesarios

*Herramientas:*
- Selenium WebDriver
- Node.js 18+
- ChromeDriver / Electron ChromeDriver

*Datos de Prueba:*
- Pólizas con recibos generados
- Recibos en diferentes estados
- Diferentes periodicidades

*Ambiente:*
- Desarrollo/QA
- Base de datos de pruebas

= Cronograma

- *Día 1:* Implementar Page Object (RecibosPage.js)
- *Día 2:* Casos TC-REC-001 a TC-REC-010 (Visualización, Búsqueda, Filtros)
- *Día 3:* Casos TC-REC-011 a TC-REC-015 (Pagos y CRUD)
- *Día 4:* Casos TC-REC-016 a TC-REC-025 (Paginación, Estadísticas, UX)
- *Día 5:* Regresión completa y documentación

= Riesgos

*R-REC-001:* Dependencia de módulo de Pólizas
- *Mitigación:* Asegurar que pólizas existan antes de probar recibos

*R-REC-002:* Cálculo de fechas puede variar según periodicidad
- *Mitigación:* Probar con múltiples periodicidades

*R-REC-003:* Estados pueden cambiar automáticamente (vencido)
- *Mitigación:* Usar datos de prueba con fechas controladas

= Conclusiones

El módulo de Recibos es crítico para la gestión financiera del sistema. Las pruebas deben enfocarse en:
1. Correcta generación automática
2. Cálculo preciso de fechas de corte
3. Gestión de estados de pago
4. Búsqueda y filtrado eficiente

Total de casos: *25*
- Críticos: 2
- Alta prioridad: 8
- Media prioridad: 11
- Baja prioridad: 4
