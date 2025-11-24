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
    Versión 2.0 \
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

Este documento detalla el plan de pruebas completo para el módulo de Gestión de Recibos del Sistema de Seguros VILLALOBOS, basado en la implementación actual que incluye registro de pago, generación de PDF, dashboard de métricas y filtros avanzados.

== Alcance

El módulo de recibos comprende:
- CRUD completo de recibos
- Registro de pago con detalles (método, referencia, notas)
- Generación de comprobantes PDF
- Dashboard con 4 métricas principales
- Indicadores visuales de urgencia (9 niveles)
- Búsqueda unificada por número, póliza, cliente, aseguradora
- 6 Filtros rápidos (Todos, Vencen Hoy, Próximos 7 días, Pendientes, Vencidos, Pagados Hoy)
- Filtros avanzados por estado con modal
- Gestión de estados (Pendiente, Pagado, Vencido)
- Paginación con selector de items por página (10/25/50/100)
- Formato inteligente de moneda (K, M para miles/millones)

== Referencias

- Plan Maestro de Pruebas
- Estrategia de Testing
- Especificación funcional del módulo de recibos
- Plan de Pruebas de Pólizas (TC-POL)

= Descripción del Módulo

== Funcionalidad Principal

El módulo de recibos gestiona los pagos fraccionados de las pólizas:

*Características principales:*
- CRUD completo de recibos manuales
- Registro de pago con modal especializado
- Generación de comprobantes PDF automáticos
- Dashboard con 4 tarjetas de métricas en tiempo real
- 6 filtros rápidos para acceso inmediato
- Modal de filtros avanzados con múltiples checkboxes
- 9 niveles de indicadores visuales de urgencia según días restantes
- Badges de estado con colores semafórico (verde/amarillo/rojo)
- Interacción inteligente: click en pendiente → modal pago, click en pagado → PDF
- Formato de moneda con abreviaciones automáticas

*Dashboard de Métricas:*
1. *Por Cobrar:* Monto pendiente total + Recibos pendientes + Vence en 7 días con barra
2. *Cobrado:* Monto pagado total + Recibos pagados + Cobrado este mes
3. *Vencidos:* Monto vencido total + Recibos vencidos + Más antiguo (días)
4. *Total General:* Suma de todos los recibos + Cantidad total

*Indicadores de Urgencia:*
- Pagado: Punto verde pequeño
- Vencido (< 0 días): "!" rojo pulsante
- Vence HOY (0 días): "!" rojo
- Crítico (1-3 días): Punto rojo grande
- Urgente (4-7 días): Punto naranja grande
- Próximo (8-15 días): Punto amarillo grande
- Normal (>15 días): Punto gris pequeño

== Flujo de Usuario

1. Usuario navega al módulo de Recibos
2. Ve dashboard con 4 métricas actualizadas en tiempo real
3. Puede usar 6 filtros rápidos para acceso inmediato
4. Busca recibos por número, póliza, cliente o aseguradora
5. Hace click en recibo pendiente → Modal de registro de pago
6. Llena: fecha (pre-llenada hoy), método, referencia, notas
7. Marca "Generar PDF" (checked por default)
8. Confirma → Estado="Pagado", se genera PDF, opción de abrir
9. Click en recibo pagado → Genera PDF directamente (sin modal)
10. Puede generar PDF en cualquier momento con botón específico

== Reglas de Negocio

*RN-REC-001:* Los recibos se pueden crear manualmente con formulario completo
*RN-REC-002:* El monto del recibo debe ser > 0
*RN-REC-003:* Al registrar pago se requiere: fecha_pago y metodo_pago
*RN-REC-004:* Un recibo pagado puede revertirse a pendiente (mantiene fecha_pago)
*RN-REC-005:* Recibos vencidos: fecha_corte < hoy AND estado != pagado
*RN-REC-006:* PDF incluye: recibo, pago, cliente, póliza, aseguradora
*RN-REC-007:* PDFs se guardan en ~/Documents/Comprobantes_Recibos/
*RN-REC-008:* Número de recibo es opcional (se autogenera: {poliza_id}-{fraccion})
*RN-REC-009:* Filtros rápidos y avanzados pueden combinarse con búsqueda
*RN-REC-010:* Estadísticas se actualizan automáticamente con filtros/búsqueda

= Casos de Prueba

_Total: 60 casos organizados en 10 categorías_

== Categoría 1: CRUD Básico (5 casos)

=== TC-REC-001: Crear Recibo Básico

*Descripción:* Verificar creación de recibo con datos mínimos

*Precondiciones:*
- Usuario autenticado en módulo Recibos
- Existe al menos 1 póliza activa

*Pasos:*
1. Click en "Nuevo Recibo"
2. Seleccionar póliza
3. Llenar: fecha inicio, fecha fin, monto ($1000), fecha corte
4. Guardar

*Resultado Esperado:*
- Recibo creado exitosamente
- Aparece en tabla con estado "Pendiente"
- Toast de éxito
- Estadísticas se actualizan

*Prioridad:* Alta

---

=== TC-REC-002: Crear Recibo Completo

*Descripción:* Verificar creación con todos los campos opcionales

*Pasos:*
1. Abrir modal nuevo recibo
2. Llenar todos los campos: número, fracción, días gracia, etc.
3. Guardar

*Resultado Esperado:*
- Recibo guardado con todos los datos correctamente

*Prioridad:* Alta

---

=== TC-REC-003: Validación Monto Negativo

*Descripción:* Verificar que no permite montos <= 0

*Pasos:*
1. Abrir modal nuevo recibo
2. Llenar datos con monto = -100
3. Intentar guardar

*Resultado Esperado:*
- Alert: "El monto debe ser mayor a cero"
- No se crea recibo

*Prioridad:* Alta

---

=== TC-REC-004: Editar Recibo

*Descripción:* Verificar edición de recibo existente

*Precondiciones:*
- Existe al menos 1 recibo

*Pasos:*
1. Click en botón "Editar" (lápiz) de un recibo
2. Modificar monto a $2000
3. Modificar fecha de corte
4. Guardar

*Resultado Esperado:*
- Cambios reflejados en tabla
- Toast de éxito
- Estadísticas actualizadas

*Prioridad:* Media

---

=== TC-REC-005: Eliminar Recibo

*Descripción:* Verificar eliminación con confirmación

*Precondiciones:*
- Existe recibo de prueba

*Pasos:*
1. Click en botón eliminar (X roja)
2. Confirmar en modal de confirmación

*Resultado Esperado:*
- Recibo eliminado de tabla
- Toast de éxito
- Estadísticas actualizadas

*Prioridad:* Media

---

== Categoría 2: Búsqueda y Filtros (15 casos)

=== TC-REC-006: Búsqueda por Número de Recibo

*Descripción:* Verificar búsqueda por número exacto

*Precondiciones:*
- Existe recibo con número conocido (ej: "REC-001")

*Pasos:*
1. Escribir "REC-001" en buscador
2. Esperar resultados

*Resultado Esperado:*
- Solo aparece ese recibo
- Estadísticas muestran 1 recibo

*Prioridad:* Alta

---

=== TC-REC-007: Búsqueda por Cliente

*Descripción:* Verificar búsqueda por nombre de cliente

*Pasos:*
1. Escribir nombre de cliente en buscador
2. Esperar resultados

*Resultado Esperado:*
- Muestra todos los recibos de ese cliente
- Estadísticas actualizadas

*Prioridad:* Alta

---

=== TC-REC-008: Búsqueda por Póliza

*Descripción:* Verificar búsqueda por número de póliza

*Pasos:*
1. Escribir número de póliza
2. Esperar resultados

*Resultado Esperado:*
- Muestra recibos de esa póliza únicamente
- Orden por fracción

*Prioridad:* Alta

---

=== TC-REC-009: Búsqueda Case-Insensitive

*Descripción:* Verificar que búsqueda no distingue mayúsculas

*Pasos:*
1. Buscar "rec-001" (minúsculas)

*Resultado Esperado:*
- Encuentra "REC-001"
- Búsqueda insensitive a mayúsculas

*Prioridad:* Media

---

=== TC-REC-010: Filtro Rápido "Todos"

*Descripción:* Verificar filtro por defecto

*Pasos:*
1. Click en botón "Todos"

*Resultado Esperado:*
- Muestra todos los recibos
- Botón marcado como activo (fondo dorado)
- Sin contador visible

*Prioridad:* Media

---

=== TC-REC-011: Filtro Rápido "Vencen Hoy"

*Descripción:* Verificar filtro de recibos con fecha_corte = hoy

*Precondiciones:*
- Existe recibo con fecha_corte = hoy y estado != pagado

*Pasos:*
1. Click en "Vencen Hoy"

*Resultado Esperado:*
- Solo muestra recibos pendientes que vencen hoy
- Contador muestra cantidad
- Botón "Limpiar" visible

*Prioridad:* Alta

---

=== TC-REC-012: Filtro Rápido "Próximos 7 días"

*Descripción:* Verificar filtro de recibos en próximos 7 días

*Precondiciones:*
- Existe recibo que vence entre hoy y 7 días

*Pasos:*
1. Click en "Próximos 7 días"

*Resultado Esperado:*
- Muestra recibos pendientes que vencen entre hoy y 7 días
- Excluye pagados y los que vencen después de 7 días

*Prioridad:* Alta

---

=== TC-REC-013: Filtro Rápido "Pendientes"

*Descripción:* Verificar filtro de pendientes no vencidos

*Pasos:*
1. Click en "Pendientes"

*Resultado Esperado:*
- Solo recibos con estado != pagado y fecha_corte >= hoy
- Excluye vencidos y pagados

*Prioridad:* Alta

---

=== TC-REC-014: Filtro Rápido "Vencidos"

*Descripción:* Verificar filtro de vencidos

*Precondiciones:*
- Existe recibo con fecha_corte pasada y estado != pagado

*Pasos:*
1. Click en "Vencidos"

*Resultado Esperado:*
- Solo recibos con fecha_corte < hoy y estado != pagado

*Prioridad:* Alta

---

=== TC-REC-015: Filtro Rápido "Pagados Hoy"

*Descripción:* Verificar filtro de pagados hoy

*Precondiciones:*
- Marcar un recibo como pagado hoy

*Pasos:*
1. Click en "Pagados Hoy"

*Resultado Esperado:*
- Solo muestra recibos con fecha_pago = hoy

*Prioridad:* Media

---

=== TC-REC-016: Filtros Avanzados - Estado Pendiente

*Descripción:* Verificar filtro avanzado checkbox

*Pasos:*
1. Click en botón "Filtros"
2. Marcar checkbox "Pendientes"
3. Click "Aplicar"

*Resultado Esperado:*
- Solo recibos pendientes visibles
- Badge muestra "1"
- Modal se cierra

*Prioridad:* Alta

---

=== TC-REC-017: Filtros Avanzados - Múltiples Estados

*Descripción:* Verificar filtros múltiples (OR logic)

*Pasos:*
1. Abrir filtros
2. Marcar "Pendientes" y "Pagados"
3. Aplicar

*Resultado Esperado:*
- Muestra pendientes + pagados
- Badge muestra "2"
- Vencidos ocultos

*Prioridad:* Alta

---

=== TC-REC-018: Limpiar Filtros Avanzados

*Descripción:* Verificar botón "Limpiar"

*Precondiciones:*
- Filtros aplicados

*Pasos:*
1. Abrir filtros
2. Click "Limpiar"

*Resultado Esperado:*
- Todos los checkboxes desmarcados
- Muestra todos los recibos al aplicar
- Badge oculto

*Prioridad:* Media

---

=== TC-REC-019: Contador de Filtro Rápido

*Descripción:* Verificar contador de resultados

*Pasos:*
1. Click en "Vencidos" (supongamos 5 vencidos)

*Resultado Esperado:*
- Muestra "5 recibo(s)"
- Botón "Limpiar" visible

*Prioridad:* Media

---

=== TC-REC-020: Combinación Búsqueda + Filtro

*Descripción:* Verificar que trabajan juntos

*Pasos:*
1. Escribir nombre de cliente
2. Aplicar filtro "Pendientes"

*Resultado Esperado:*
- Muestra solo recibos pendientes de ese cliente
- Estadísticas correctas

*Prioridad:* Alta

---

== Categoría 3: Registro de Pago (8 casos)

=== TC-REC-021: Registrar Pago Completo

*Descripción:* Verificar registro con todos los campos

*Precondiciones:*
- Existe recibo pendiente

*Pasos:*
1. Click en fila de recibo pendiente
2. Modal de pago se abre
3. Llenar: fecha (pre-filled), método="transferencia", referencia="TR-12345", notas="Pago completo"
4. Dejar checked "Generar PDF"
5. Click "Confirmar Pago"

*Resultado Esperado:*
- Estado cambia a "Pagado"
- Se genera PDF
- Pregunta si desea abrir PDF
- Toast de éxito
- Estadísticas actualizadas

*Prioridad:* Crítica

---

=== TC-REC-022: Registrar Pago Mínimo

*Descripción:* Verificar con solo campos requeridos

*Pasos:*
1. Click en recibo pendiente
2. Solo llenar fecha y método
3. Confirmar

*Resultado Esperado:*
- Pago registrado correctamente
- Referencia y notas NULL

*Prioridad:* Alta

---

=== TC-REC-023: Validación Método de Pago Requerido

*Descripción:* Verificar validación HTML5

*Pasos:*
1. Abrir modal pago
2. Dejar método vacío
3. Intentar confirmar

*Resultado Esperado:*
- Validación HTML5 impide submit
- Mensaje "Por favor rellene este campo"

*Prioridad:* Alta

---

=== TC-REC-024: Fecha de Pago Pre-llenada

*Descripción:* Verificar que fecha se llena automáticamente

*Pasos:*
1. Abrir modal de pago

*Resultado Esperado:*
- inputFechaPagoModal tiene fecha de hoy
- Formato YYYY-MM-DD

*Prioridad:* Media

---

=== TC-REC-025: Generar PDF Sin Registrar Pago

*Descripción:* Verificar botón PDF independiente

*Pasos:*
1. Click en botón "Generar PDF" (icono morado documento)

*Resultado Esperado:*
- PDF generado
- Pregunta si desea abrir
- Sin cambiar estado del recibo

*Prioridad:* Alta

---

=== TC-REC-026: Cancelar Registro de Pago

*Descripción:* Verificar que cancelar no afecta datos

*Pasos:*
1. Abrir modal pago
2. Llenar campos
3. Click "Cancelar"

*Resultado Esperado:*
- Modal cerrado sin cambios
- Recibo sigue pendiente

*Prioridad:* Media

---

=== TC-REC-027: Marcar como Pendiente

*Descripción:* Verificar reversión de pago

*Precondiciones:*
- Existe recibo pagado

*Pasos:*
1. Localizar recibo pagado
2. Click en botón "Marcar como pendiente" (icono ↻)

*Resultado Esperado:*
- Estado cambia a "Pendiente"
- fecha_pago se mantiene (no se borra)
- Estadísticas actualizadas

*Prioridad:* Alta

---

=== TC-REC-028: Click en Recibo Pagado

*Descripción:* Verificar generación directa de PDF

*Precondiciones:*
- Existe recibo con estado="pagado"

*Pasos:*
1. Click en fila de recibo pagado (no en botón, en la fila)

*Resultado Esperado:*
- PDF generado automáticamente
- NO abre modal de pago
- Pregunta si desea abrir PDF

*Prioridad:* Alta

---

== Categoría 4: Estadísticas y Métricas (6 casos)

=== TC-REC-029: Estadística "Por Cobrar"

*Descripción:* Verificar cálculo correcto

*Precondiciones:*
- Crear 3 recibos pendientes: $1000, $2000, $3000

*Pasos:*
1. Observar card "Por Cobrar"

*Resultado Esperado:*
- Muestra "$6,000.00" o "$6.0K"
- "3 recibos"
- Tooltip muestra valor completo

*Prioridad:* Alta

---

=== TC-REC-030: Sub-métrica "Vence en 7 días"

*Descripción:* Verificar cálculo de urgencia

*Precondiciones:*
- Crear recibo de $5000 que vence en 3 días

*Pasos:*
1. Observar "Vencen en 7 días" en card "Por Cobrar"

*Resultado Esperado:*
- Muestra "$5,000.00"

*Prioridad:* Media

---

=== TC-REC-031: Barra de Urgencia

*Descripción:* Verificar porcentaje visual

*Precondiciones:*
- Total pendiente: $10,000
- Vence en 7 días: $5,000

*Pasos:*
1. Observar barra roja en card "Por Cobrar"

*Resultado Esperado:*
- Barra al 50% de ancho
- Color rojo

*Prioridad:* Media

---

=== TC-REC-032: Estadística "Cobrado este mes"

*Descripción:* Verificar filtrado por mes

*Precondiciones:*
- Marcar recibo como pagado hoy con $1000

*Pasos:*
1. Observar "Este mes" en card "Cobrado"

*Resultado Esperado:*
- Muestra "$1,000.00"
- Solo cuenta pagos del mes actual

*Prioridad:* Media

---

=== TC-REC-033: Estadística "Más antiguo vencido"

*Descripción:* Verificar cálculo de días

*Precondiciones:*
- Crear recibo con fecha_corte hace 15 días, pendiente

*Pasos:*
1. Observar "Más antiguo" en card "Vencidos"

*Resultado Esperado:*
- Muestra "15 días"

*Prioridad:* Media

---

=== TC-REC-034: Formato Inteligente de Moneda

*Descripción:* Verificar abreviación K/M

*Precondiciones:*
- Crear recibos que sumen $1,500,000

*Pasos:*
1. Observar card "Total General"

*Resultado Esperado:*
- Muestra "$1.5M"
- Tooltip muestra "$1,500,000.00"

*Prioridad:* Media

---

== Categoría 5: Indicadores Visuales (5 casos)

=== TC-REC-035: Indicador "Vencido"

*Descripción:* Verificar ícono pulsante

*Precondiciones:*
- Recibo con fecha_corte hace 5 días, pendiente

*Pasos:*
1. Observar columna indicador

*Resultado Esperado:*
- Símbolo "!" rojo pulsante (animate-pulse)
- Tooltip "VENCIDO"

*Prioridad:* Alta

---

=== TC-REC-036: Indicador "Vence HOY"

*Descripción:* Verificar ícono crítico

*Precondiciones:*
- Recibo con fecha_corte = hoy

*Pasos:*
1. Observar indicador

*Resultado Esperado:*
- Símbolo "!" rojo (sin pulsar)
- Tooltip "Vence HOY"

*Prioridad:* Alta

---

=== TC-REC-037: Indicador "Crítico" (1-3 días)

*Descripción:* Verificar punto rojo

*Precondiciones:*
- Recibo que vence en 2 días

*Pasos:*
1. Observar indicador

*Resultado Esperado:*
- Punto rojo grande (w-3 h-3)
- Tooltip "Crítico: vence en 2 día(s)"

*Prioridad:* Media

---

=== TC-REC-038: Indicador "Urgente" (4-7 días)

*Descripción:* Verificar punto naranja

*Precondiciones:*
- Recibo que vence en 5 días

*Pasos:*
1. Observar indicador

*Resultado Esperado:*
- Punto naranja grande
- Tooltip "Urgente: vence en 5 día(s)"

*Prioridad:* Media

---

=== TC-REC-039: Indicador "Pagado"

*Descripción:* Verificar punto verde

*Precondiciones:*
- Recibo con estado="pagado"

*Pasos:*
1. Observar indicador

*Resultado Esperado:*
- Punto verde pequeño (w-2 h-2)
- Tooltip "Pagado"

*Prioridad:* Media

---

== Categoría 6: Estados de Badge (3 casos)

=== TC-REC-040: Badge "Pendiente" Amarillo

*Descripción:* Verificar badge para pendientes

*Precondiciones:*
- Recibo pendiente que vence en 10 días

*Pasos:*
1. Observar columna "Estado"

*Resultado Esperado:*
- Badge clase "status-por-vencer"
- Fondo amarillo
- Texto "Pendiente"

*Prioridad:* Baja

---

=== TC-REC-041: Badge "Vencido" Rojo

*Descripción:* Verificar badge rojo

*Precondiciones:*
- Recibo vencido

*Pasos:*
1. Observar badge

*Resultado Esperado:*
- Badge clase "status-vencida"
- Fondo rojo
- Texto "Vencido"

*Prioridad:* Baja

---

=== TC-REC-042: Badge "Pagado" Verde

*Descripción:* Verificar badge verde

*Precondiciones:*
- Recibo pagado

*Pasos:*
1. Observar badge

*Resultado Esperado:*
- Badge clase "status-vigente"
- Fondo verde
- Texto "Pagado"
- Muestra fecha de pago debajo

*Prioridad:* Baja

---

== Categoría 7: Paginación (4 casos)

=== TC-REC-043: Items por Página - 10

*Descripción:* Verificar selector por defecto

*Precondiciones:*
- Crear 15 recibos

*Pasos:*
1. Observar tabla
2. Verificar selector en "10"

*Resultado Esperado:*
- Página 1 muestra 10 recibos
- Paginación activa con 2 páginas

*Prioridad:* Media

---

=== TC-REC-044: Items por Página - 25

*Descripción:* Verificar cambio de cantidad

*Precondiciones:*
- 30 recibos en sistema

*Pasos:*
1. Cambiar selector a "25"

*Resultado Esperado:*
- Muestra 25 recibos en página 1
- Paginación recalculada

*Prioridad:* Media

---

=== TC-REC-045: Navegación entre Páginas

*Descripción:* Verificar botones de paginación

*Precondiciones:*
- 15 recibos, 10 por página

*Pasos:*
1. Click en botón "Página 2"

*Resultado Esperado:*
- Muestra recibos 11-15
- Indicador en página 2

*Prioridad:* Media

---

=== TC-REC-046: Info de Paginación

*Descripción:* Verificar texto informativo

*Precondiciones:*
- 25 recibos, 10 por página, en página 2

*Pasos:*
1. Observar texto de paginación

*Resultado Esperado:*
- Muestra "Mostrando 11-20 de 25 recibos"

*Prioridad:* Baja

---

== Categoría 8: Estados de Vista (3 casos)

=== TC-REC-047: Estado Loading

*Descripción:* Verificar spinner

*Pasos:*
1. Recargar vista de recibos
2. Observar inmediatamente

*Resultado Esperado:*
- Spinner visible
- Mensaje "Cargando recibos..."
- Desaparece al cargar

*Prioridad:* Baja

---

=== TC-REC-048: Estado Empty

*Descripción:* Verificar mensaje sin datos

*Precondiciones:*
- BD vacía o filtro sin coincidencias

*Pasos:*
1. Observar vista

*Resultado Esperado:*
- Mensaje "No hay recibos registrados"
- Ícono de documento
- Sugerencia ajustar filtros

*Prioridad:* Baja

---

=== TC-REC-049: Vista Normal con Datos

*Descripción:* Verificar tabla visible

*Precondiciones:*
- Al menos 1 recibo

*Pasos:*
1. Observar vista

*Resultado Esperado:*
- Tabla visible
- Empty y loading ocultos
- Estadísticas visibles

*Prioridad:* Baja

---

== Categoría 9: Generación de PDF (5 casos)

=== TC-REC-050: PDF con Datos Completos

*Descripción:* Verificar contenido del PDF

*Precondiciones:*
- Recibo con todos los campos llenos
- Pago registrado con método, referencia, notas

*Pasos:*
1. Generar PDF
2. Abrir PDF

*Resultado Esperado:*
PDF contiene:
- Datos del recibo (número, póliza, período, monto)
- Datos del pago (fecha, método, referencia, notas)
- Datos del cliente (nombre, teléfono, email)
- Datos de la póliza (aseguradora, ramo, suma asegurada)
- Footer con fecha de generación

*Prioridad:* Crítica

---

=== TC-REC-051: PDF sin Datos Opcionales

*Descripción:* Verificar campos "N/A"

*Precondiciones:*
- Recibo sin referencia ni notas

*Pasos:*
1. Generar PDF
2. Abrir

*Resultado Esperado:*
- Campos faltantes muestran "N/A"
- No hay errores
- PDF completo

*Prioridad:* Media

---

=== TC-REC-052: Nombre de Archivo PDF

*Descripción:* Verificar formato del nombre

*Precondiciones:*
- Recibo "REC-001"

*Pasos:*
1. Generar PDF
2. Verificar nombre de archivo

*Resultado Esperado:*
- Formato: `Comprobante_REC-001_YYYY-MM-DD.pdf`
- Fecha es la actual

*Prioridad:* Media

---

=== TC-REC-053: Directorio de PDFs

*Descripción:* Verificar ubicación

*Pasos:*
1. Generar PDF
2. Verificar ubicación en filesystem

*Resultado Esperado:*
- Archivo en ~/Documents/Comprobantes_Recibos/
- Directorio se crea si no existe

*Prioridad:* Alta

---

=== TC-REC-054: Abrir PDF Automáticamente

*Descripción:* Verificar opción de abrir

*Pasos:*
1. Generar PDF
2. Click "Abrir" en dialog

*Resultado Esperado:*
- PDF se abre con visor del sistema
- Funciona en macOS/Windows/Linux

*Prioridad:* Media

---

== Categoría 10: Validaciones y Edge Cases (6 casos)

=== TC-REC-055: Validación Póliza Requerida

*Descripción:* Verificar campo obligatorio

*Pasos:*
1. Abrir modal nuevo recibo
2. NO seleccionar póliza
3. Llenar otros campos
4. Guardar

*Resultado Esperado:*
- Alert "Selecciona una póliza"
- No se crea recibo

*Prioridad:* Alta

---

=== TC-REC-056: Monto con Decimales

*Descripción:* Verificar precisión

*Pasos:*
1. Crear recibo con monto $1,234.56

*Resultado Esperado:*
- Se guarda correctamente
- Muestra 2 decimales
- No hay redondeo

*Prioridad:* Media

---

=== TC-REC-057: Fecha Inicio después de Fecha Fin

*Descripción:* Verificar validación lógica

*Pasos:*
1. Crear recibo con fecha_inicio > fecha_fin
2. Guardar

*Resultado Esperado:*
- (Documentar comportamiento actual)
- Idealmente: error de validación

*Prioridad:* Media

---

=== TC-REC-058: Días de Gracia = 0

*Descripción:* Verificar valor por defecto

*Pasos:*
1. Crear recibo sin llenar dias_gracia
2. Guardar

*Resultado Esperado:*
- Se guarda con dias_gracia = 0
- No hay error

*Prioridad:* Baja

---

=== TC-REC-059: Número de Recibo Duplicado

*Descripción:* Verificar duplicados

*Pasos:*
1. Crear recibo "REC-001"
2. Crear otro "REC-001"

*Resultado Esperado:*
- (Documentar si permite o rechaza)
- Depende de constraints de BD

*Prioridad:* Media

---

=== TC-REC-060: Recibo sin Número (Autogenerado)

*Descripción:* Verificar generación automática

*Pasos:*
1. Crear recibo sin llenar "Número de recibo"
2. Guardar
3. Ver recibo creado

*Resultado Esperado:*
- Sistema genera número: "{poliza_id}-{fraccion}"
- Ej: poliza 5, fracción 2 → "5-02"

*Prioridad:* Alta

---

= Matriz de Trazabilidad

#table(
  columns: (auto, auto, auto, auto),
  [*Caso*], [*Categoría*], [*Prioridad*], [*Estado*],
  [TC-REC-001], [CRUD], [Alta], [Pendiente],
  [TC-REC-002], [CRUD], [Alta], [Pendiente],
  [TC-REC-003], [CRUD], [Alta], [Pendiente],
  [TC-REC-004], [CRUD], [Media], [Pendiente],
  [TC-REC-005], [CRUD], [Media], [Pendiente],
  [TC-REC-006], [Búsqueda], [Alta], [Pendiente],
  [TC-REC-007], [Búsqueda], [Alta], [Pendiente],
  [TC-REC-008], [Búsqueda], [Alta], [Pendiente],
  [TC-REC-009], [Búsqueda], [Media], [Pendiente],
  [TC-REC-010], [Filtros], [Media], [Pendiente],
  [TC-REC-011], [Filtros], [Alta], [Pendiente],
  [TC-REC-012], [Filtros], [Alta], [Pendiente],
  [TC-REC-013], [Filtros], [Alta], [Pendiente],
  [TC-REC-014], [Filtros], [Alta], [Pendiente],
  [TC-REC-015], [Filtros], [Media], [Pendiente],
  [TC-REC-016], [Filtros], [Alta], [Pendiente],
  [TC-REC-017], [Filtros], [Alta], [Pendiente],
  [TC-REC-018], [Filtros], [Media], [Pendiente],
  [TC-REC-019], [Filtros], [Media], [Pendiente],
  [TC-REC-020], [Filtros], [Alta], [Pendiente],
  [TC-REC-021], [Pago], [Crítica], [Pendiente],
  [TC-REC-022], [Pago], [Alta], [Pendiente],
  [TC-REC-023], [Pago], [Alta], [Pendiente],
  [TC-REC-024], [Pago], [Media], [Pendiente],
  [TC-REC-025], [Pago], [Alta], [Pendiente],
  [TC-REC-026], [Pago], [Media], [Pendiente],
  [TC-REC-027], [Pago], [Alta], [Pendiente],
  [TC-REC-028], [Pago], [Alta], [Pendiente],
  [TC-REC-029], [Estadísticas], [Alta], [Pendiente],
  [TC-REC-030], [Estadísticas], [Media], [Pendiente],
  [TC-REC-031], [Estadísticas], [Media], [Pendiente],
  [TC-REC-032], [Estadísticas], [Media], [Pendiente],
  [TC-REC-033], [Estadísticas], [Media], [Pendiente],
  [TC-REC-034], [Estadísticas], [Media], [Pendiente],
  [TC-REC-035], [Indicadores], [Alta], [Pendiente],
  [TC-REC-036], [Indicadores], [Alta], [Pendiente],
  [TC-REC-037], [Indicadores], [Media], [Pendiente],
  [TC-REC-038], [Indicadores], [Media], [Pendiente],
  [TC-REC-039], [Indicadores], [Media], [Pendiente],
  [TC-REC-040], [UI], [Baja], [Pendiente],
  [TC-REC-041], [UI], [Baja], [Pendiente],
  [TC-REC-042], [UI], [Baja], [Pendiente],
  [TC-REC-043], [Paginación], [Media], [Pendiente],
  [TC-REC-044], [Paginación], [Media], [Pendiente],
  [TC-REC-045], [Paginación], [Media], [Pendiente],
  [TC-REC-046], [Paginación], [Baja], [Pendiente],
  [TC-REC-047], [Estados], [Baja], [Pendiente],
  [TC-REC-048], [Estados], [Baja], [Pendiente],
  [TC-REC-049], [Estados], [Baja], [Pendiente],
  [TC-REC-050], [PDF], [Crítica], [Pendiente],
  [TC-REC-051], [PDF], [Media], [Pendiente],
  [TC-REC-052], [PDF], [Media], [Pendiente],
  [TC-REC-053], [PDF], [Alta], [Pendiente],
  [TC-REC-054], [PDF], [Media], [Pendiente],
  [TC-REC-055], [Validación], [Alta], [Pendiente],
  [TC-REC-056], [Validación], [Media], [Pendiente],
  [TC-REC-057], [Validación], [Media], [Pendiente],
  [TC-REC-058], [Validación], [Baja], [Pendiente],
  [TC-REC-059], [Validación], [Media], [Pendiente],
  [TC-REC-060], [Validación], [Alta], [Pendiente],
)

= Resumen de Cobertura

#table(
  columns: (auto, auto, auto),
  [*Categoría*], [*Casos*], [*Prioridad*],
  [CRUD Básico], [5], [Alta],
  [Búsqueda y Filtros], [15], [Alta],
  [Registro de Pago], [8], [Crítica/Alta],
  [Estadísticas], [6], [Alta/Media],
  [Indicadores Visuales], [5], [Alta/Media],
  [Estados de Badge], [3], [Baja],
  [Paginación], [4], [Media/Baja],
  [Estados de Vista], [3], [Baja],
  [Generación de PDF], [5], [Crítica/Alta],
  [Validaciones], [6], [Alta/Media],
  [*TOTAL*], [*60*], [-],
)

= Criterios de Aceptación

*Cobertura Mínima:* 95% de casos exitosos

*Casos Críticos (DEBEN pasar):*
- TC-REC-021: Registrar pago completo
- TC-REC-050: PDF con datos completos

*Casos de Alta Prioridad (>90% éxito):*
- Todos los de CRUD básico (TC-REC-001 a TC-REC-003)
- Búsqueda (TC-REC-006, TC-REC-007, TC-REC-008)
- Filtros rápidos críticos (TC-REC-011 a TC-REC-014)
- Pago (TC-REC-022, TC-REC-023, TC-REC-025, TC-REC-027, TC-REC-028)
- PDF (TC-REC-053)
- Validaciones (TC-REC-055, TC-REC-060)

= Recursos Necesarios

*Herramientas:*
- Selenium WebDriver 4.x
- Node.js 18+
- ChromeDriver / Electron ChromeDriver
- Page Object Pattern

*Datos de Prueba:*
- Mínimo 2 pólizas activas de diferentes clientes
- Mínimo 1 aseguradora activa
- Recibos en diferentes estados (pendiente, pagado, vencido)
- Recibos con diferentes fechas (pasadas, hoy, futuras)

*Ambiente:*
- Desarrollo/QA con datos de prueba
- Base de datos limpia o reseteable

= Cronograma

*Fase 1 - Crítica (Días 1-2):*
- Implementar RecibosPage.js (Page Object)
- TC-REC-001 a TC-REC-005: CRUD básico
- TC-REC-021, TC-REC-022: Registro de pago
- TC-REC-050, TC-REC-053: PDF básico
- TC-REC-055, TC-REC-060: Validaciones críticas

*Fase 2 - Alta Prioridad (Días 3-4):*
- TC-REC-006 a TC-REC-009: Búsqueda
- TC-REC-011 a TC-REC-017: Filtros completos
- TC-REC-023 a TC-REC-028: Pago avanzado
- TC-REC-029, TC-REC-034: Estadísticas básicas
- TC-REC-035, TC-REC-036: Indicadores críticos

*Fase 3 - Completa (Día 5):*
- Todos los casos restantes
- Regresión completa
- Documentación de resultados

*Fase 4 - Reporte (Día 6):*
- Generar reporte final JSON
- Screenshots de evidencia
- Documentar hallazgos

= Riesgos

*R-REC-001:* Dependencia de módulo de Pólizas
- *Impacto:* Alto
- *Mitigación:* Asegurar pólizas existan antes de probar recibos

*R-REC-002:* Cálculo de fechas puede variar
- *Impacto:* Medio
- *Mitigación:* Usar fechas relativas (hoy, hoy+N, hoy-N)

*R-REC-003:* Estados cambian automáticamente
- *Impacto:* Medio
- *Mitigación:* Crear datos con fechas controladas

*R-REC-004:* Generación de PDF puede fallar por permisos
- *Impacto:* Alto
- *Mitigación:* Verificar permisos en ~/Documents antes de ejecutar

*R-REC-005:* Timezone puede afectar cálculos de fechas
- *Impacto:* Medio
- *Mitigación:* Usar fechas con hora 00:00:00

= Conclusiones

El módulo de Recibos es el más complejo y crítico del sistema, con 60 casos de prueba que cubren:
- Gestión financiera completa
- Registro de pagos con trazabilidad
- Generación de documentos fiscales (PDF)
- Dashboard de métricas en tiempo real
- Múltiples niveles de filtrado
- Experiencia de usuario avanzada

Prioridades de ejecución:
1. *Crítica:* Registro de pago y generación de PDF (sustento fiscal)
2. *Alta:* CRUD, búsqueda, filtros (operación diaria)
3. *Media:* Estadísticas, paginación (eficiencia)
4. *Baja:* UI/UX (polish)

Total: *60 casos de prueba* organizados en 10 categorías
