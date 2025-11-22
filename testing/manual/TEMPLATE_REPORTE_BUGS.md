# PLANTILLA DE REPORTE DE BUGS
## Sistema de Seguros VILLALOBOS

**Versión del Sistema:** 1.0.0
**Fecha de creación de plantilla:** Noviembre 2025

---

## ÍNDICE

1. [Instrucciones Generales](#instrucciones-generales)
2. [Niveles de Severidad](#niveles-de-severidad)
3. [Formato de Reporte](#formato-de-reporte)
4. [Ejemplos de Reportes](#ejemplos-de-reportes)
5. [Checklist de Validación](#checklist-de-validación)
6. [Información del Sistema](#información-del-sistema)

---

## INSTRUCCIONES GENERALES

### ¿Cuándo reportar un bug?

Reporta un bug cuando encuentres:
- ✅ El sistema no funciona como se esperaba
- ✅ Errores visibles en la interfaz
- ✅ Datos incorrectos o inconsistentes
- ✅ Botones o funciones que no responden
- ✅ Mensajes de error inesperados
- ✅ Problemas de rendimiento notables
- ✅ Problemas de diseño o visualización

### ¿Qué NO reportar como bug?

- ❌ Sugerencias de mejora (usar documento separado)
- ❌ Funcionalidades faltantes pero conocidas
- ❌ Dudas sobre cómo usar el sistema (consultar manual)

### Reglas de Oro

1. **Un bug por reporte** - No mezclar múltiples problemas
2. **Ser específico** - Detalles exactos, no generalidades
3. **Adjuntar evidencia** - Screenshots SIEMPRE que sea posible
4. **Reproducibilidad** - Verificar que el bug se repite
5. **Datos reales** - Usar datos exactos que causaron el error

---

## NIVELES DE SEVERIDAD

### 🔴 CRÍTICO
**Impide el uso del sistema**

**Características:**
- El sistema se cierra inesperadamente
- Pérdida de datos confirmada
- No se puede acceder a funciones esenciales
- Afecta a todos los usuarios
- No hay workaround posible

**Ejemplos:**
- "La aplicación se cierra al guardar una póliza"
- "Se borran todos los clientes al eliminar uno"
- "No se puede iniciar sesión (ningún usuario)"

**Tiempo de respuesta esperado:** Inmediato (< 2 horas)

---

### 🟠 ALTO
**Funcionalidad importante no trabaja correctamente**

**Características:**
- Una función principal no funciona
- Cálculos incorrectos que afectan datos críticos
- Afecta a muchos usuarios
- Existe workaround complicado
- Puede causar pérdida de datos en casos específicos

**Ejemplos:**
- "Las fechas de vencimiento de recibos se calculan mal"
- "No se pueden generar recibos para pólizas anuales"
- "Los totales en Dashboard muestran valores erróneos"

**Tiempo de respuesta esperado:** Mismo día (< 8 horas)

---

### 🟡 MEDIO
**Funcionalidad trabaja pero con problemas**

**Características:**
- Función trabaja pero con comportamiento incorrecto
- Afecta a usuarios específicos o casos particulares
- Existe workaround sencillo
- No hay pérdida de datos
- Problemas de usabilidad notables

**Ejemplos:**
- "El botón 'Limpiar' no limpia el campo RFC"
- "El filtro por fecha no actualiza inmediatamente"
- "El mensaje de confirmación no aparece al guardar"

**Tiempo de respuesta esperado:** 2-3 días

---

### 🟢 BAJO
**Problemas menores o cosméticos**

**Características:**
- Errores de texto u ortografía
- Problemas visuales menores
- Funcionalidad completa pero comportamiento no ideal
- No afecta el trabajo diario
- Mejoras de UX

**Ejemplos:**
- "El texto 'Cliente' aparece como 'Clinte'"
- "El botón está desalineado 2px a la derecha"
- "El color del header no coincide con el logo"

**Tiempo de respuesta esperado:** Cuando sea posible

---

## FORMATO DE REPORTE

### Plantilla Básica

```
================================================================================
BUG ID: [AUTO] - Será asignado por el sistema de tracking
================================================================================

INFORMACIÓN GENERAL
-------------------
Título:           [Descripción breve y clara del problema]
Módulo:           [Clientes | Pólizas | Recibos | Documentos | Catálogos | Dashboard | Login]
Severidad:        [Crítico | Alto | Medio | Bajo]
Reportado por:    [Nombre del tester]
Fecha:            [DD/MM/YYYY]
Versión Sistema:  1.0.0
Estado:           [Nuevo | En Revisión | En Corrección | Corregido | Cerrado]

DESCRIPCIÓN
-----------
[Descripción detallada del problema encontrado]

PASOS PARA REPRODUCIR
----------------------
1. [Primer paso específico]
2. [Segundo paso específico]
3. [Tercer paso específico]
...
N. [Paso donde ocurre el error]

RESULTADO ESPERADO
------------------
[Qué debería suceder según la especificación o lógica del negocio]

RESULTADO ACTUAL
----------------
[Qué sucede realmente - describir el comportamiento incorrecto]

DATOS DE PRUEBA
---------------
[Datos exactos usados que causaron el error]
- Campo 1: [valor]
- Campo 2: [valor]
- Campo 3: [valor]

EVIDENCIA
---------
Screenshots:
- [X] Screenshot 1: [screenshot_nombre_1.png] - Descripción
- [X] Screenshot 2: [screenshot_nombre_2.png] - Descripción
- [ ] Video: [Si aplica]
- [ ] Logs: [Si aplica]

INFORMACIÓN ADICIONAL
---------------------
Frecuencia:       [Siempre | A veces | Rara vez]
Workaround:       [¿Existe forma alternativa de realizar la acción? Describir]
Impacto:          [Alto | Medio | Bajo]
Navegador:        [N/A - Aplicación Electron]
SO:               [Windows 10 | Windows 11 | macOS]
Notas:            [Cualquier información adicional relevante]

================================================================================
```

---

## EJEMPLOS DE REPORTES

### EJEMPLO 1: Bug Crítico

```
================================================================================
BUG ID: BUG-001
================================================================================

INFORMACIÓN GENERAL
-------------------
Título:           Sistema se cierra al intentar eliminar póliza con recibos
Módulo:           Pólizas
Severidad:        Crítico
Reportado por:    María González
Fecha:            05/11/2025
Versión Sistema:  1.0.0
Estado:           Nuevo

DESCRIPCIÓN
-----------
Al intentar eliminar una póliza que tiene recibos asociados, la aplicación
se cierra completamente sin mostrar mensaje de error. Esto causa pérdida
del trabajo no guardado en otras pantallas.

PASOS PARA REPRODUCIR
----------------------
1. Iniciar sesión con usuario admin/admin123
2. Navegar a módulo "Pólizas"
3. Seleccionar póliza con número "POL-2025-001" (tiene 12 recibos asociados)
4. Hacer clic en botón "Eliminar" (ícono de basura rojo)
5. Confirmar eliminación en el diálogo

RESULTADO ESPERADO
------------------
- Debería mostrar mensaje: "No se puede eliminar la póliza porque tiene
  recibos asociados. Elimine primero los recibos."
- La aplicación debe permanecer abierta
- La póliza no debe eliminarse

RESULTADO ACTUAL
----------------
- La aplicación se cierra inmediatamente sin mensaje
- Al volver a abrir, la póliza sigue existiendo (no se eliminó)
- Se pierde el trabajo no guardado en otros módulos

DATOS DE PRUEBA
---------------
Póliza utilizada:
- Número Póliza: POL-2025-001
- Cliente: Juan Pérez García (RFC: PEGJ850101XXX)
- Aseguradora: AXA Seguros
- Ramo: Autos
- Periodicidad: Mensual
- Recibos asociados: 12 (todos en estado Pendiente)

EVIDENCIA
---------
Screenshots:
- [X] screenshot_bug001_poliza_antes.png - Póliza antes de eliminar
- [X] screenshot_bug001_dialogo_confirmacion.png - Diálogo de confirmación
- [X] screenshot_bug001_aplicacion_cerrada.png - Aplicación cerrada

INFORMACIÓN ADICIONAL
---------------------
Frecuencia:       Siempre (100% reproducible)
Workaround:       Eliminar manualmente los recibos antes de eliminar la póliza
Impacto:          Alto - Puede causar pérdida de datos y frustración
SO:               Windows 10 Pro 64-bit
Notas:            El mismo comportamiento ocurre con cualquier póliza que
                  tenga recibos asociados. El problema NO ocurre si la póliza
                  no tiene recibos.

================================================================================
```

---

### EJEMPLO 2: Bug Alto

```
================================================================================
BUG ID: BUG-002
================================================================================

INFORMACIÓN GENERAL
-------------------
Título:           Cálculo incorrecto de prima neta en recibos mensuales
Módulo:           Recibos
Severidad:        Alto
Reportado por:    Carlos Rodríguez
Fecha:            05/11/2025
Versión Sistema:  1.0.0
Estado:           Nuevo

DESCRIPCIÓN
-----------
Al generar recibos automáticamente para pólizas con periodicidad mensual,
la prima neta de cada recibo no coincide con la división exacta de la
prima total entre 12. Hay diferencias de centavos que se acumulan.

PASOS PARA REPRODUCIR
----------------------
1. Navegar a módulo "Pólizas"
2. Crear nueva póliza anual con los siguientes datos:
   - Cliente: Ana López
   - Periodicidad: Mensual
   - Prima Neta Total: $12,000.00
   - Fecha Inicio: 01/01/2025
   - Fecha Fin: 31/12/2025
3. Guardar póliza (genera 12 recibos automáticamente)
4. Navegar a módulo "Recibos"
5. Revisar los montos de prima neta de cada recibo generado

RESULTADO ESPERADO
------------------
- Cada recibo mensual debe tener Prima Neta = $1,000.00
- La suma de los 12 recibos debe ser exactamente $12,000.00
- No debe haber diferencias por redondeo

RESULTADO ACTUAL
----------------
- Recibos 1-11: Prima Neta = $1,000.00 cada uno
- Recibo 12: Prima Neta = $999.98
- Suma total: $11,999.98 (faltante de $0.02)

DATOS DE PRUEBA
---------------
Póliza creada:
- Número: POL-2025-015
- Cliente: Ana López Martínez (RFC: LOMA900215XXX)
- Aseguradora: Seguros Monterrey
- Ramo: Vida
- Periodicidad: Mensual
- Prima Neta Total: $12,000.00
- Fecha Inicio: 01/01/2025
- Fecha Fin: 31/12/2025

EVIDENCIA
---------
Screenshots:
- [X] screenshot_bug002_poliza_datos.png - Datos de la póliza
- [X] screenshot_bug002_recibos_lista.png - Lista de recibos generados
- [X] screenshot_bug002_recibo_12_detalle.png - Detalle del recibo 12

INFORMACIÓN ADICIONAL
---------------------
Frecuencia:       Siempre con montos que no son divisibles exactamente
Workaround:       Editar manualmente el último recibo para ajustar el monto
Impacto:          Alto - Afecta cálculos financieros y reportes contables
SO:               Windows 11
Notas:            El problema también ocurre con otras periodicidades
                  (bimestral, trimestral) cuando la división no es exacta.
                  Recomendación: Aplicar lógica de ajuste en el último recibo.

================================================================================
```

---

### EJEMPLO 3: Bug Medio

```
================================================================================
BUG ID: BUG-003
================================================================================

INFORMACIÓN GENERAL
-------------------
Título:           Filtro por RFC en módulo Clientes no funciona con mayúsculas
Módulo:           Clientes
Severidad:        Medio
Reportado por:    María González
Fecha:            05/11/2025
Versión Sistema:  1.0.0
Estado:           Nuevo

DESCRIPCIÓN
-----------
El campo de búsqueda por RFC en el módulo de Clientes solo encuentra
resultados si se escribe en minúsculas, aunque los RFC están guardados
en mayúsculas en la base de datos.

PASOS PARA REPRODUCIR
----------------------
1. Navegar a módulo "Clientes"
2. En el campo de búsqueda, escribir: "PEGJ850101XXX" (mayúsculas)
3. Observar resultados
4. Limpiar búsqueda
5. Escribir: "pegj850101xxx" (minúsculas)
6. Observar resultados

RESULTADO ESPERADO
------------------
- La búsqueda debe ser case-insensitive (no distinguir mayúsculas/minúsculas)
- Debe encontrar el cliente "Juan Pérez García" en ambos casos
- El RFC se almacena y muestra siempre en mayúsculas

RESULTADO ACTUAL
----------------
- Búsqueda con "PEGJ850101XXX": No encuentra resultados (0 clientes)
- Búsqueda con "pegj850101xxx": Encuentra a Juan Pérez García (1 cliente)
- Comportamiento inconsistente e inesperado

DATOS DE PRUEBA
---------------
Cliente buscado:
- Nombre: Juan Pérez García
- RFC: PEGJ850101XXX
- Tipo: Persona Física
- Estado: Activo

EVIDENCIA
---------
Screenshots:
- [X] screenshot_bug003_busqueda_mayusculas.png - Búsqueda sin resultados
- [X] screenshot_bug003_busqueda_minusculas.png - Búsqueda exitosa
- [X] screenshot_bug003_cliente_detalle.png - RFC guardado en mayúsculas

INFORMACIÓN ADICIONAL
---------------------
Frecuencia:       Siempre
Workaround:       Escribir la búsqueda en minúsculas
Impacto:          Medio - Afecta usabilidad pero hay workaround sencillo
SO:               Windows 10
Notas:            El problema solo ocurre en el filtro de RFC. Los filtros
                  de Nombre y Teléfono funcionan correctamente con
                  mayúsculas y minúsculas.
                  Revisar: clientes_controller.js línea donde se aplica
                  el filtro de búsqueda.

================================================================================
```

---

### EJEMPLO 4: Bug Bajo

```
================================================================================
BUG ID: BUG-004
================================================================================

INFORMACIÓN GENERAL
-------------------
Título:           Error ortográfico en botón "Cancelar" (dice "Cencelar")
Módulo:           Catálogos
Severidad:        Bajo
Reportado por:    Carlos Rodríguez
Fecha:            05/11/2025
Versión Sistema:  1.0.0
Estado:           Nuevo

DESCRIPCIÓN
-----------
En el diálogo de confirmación para eliminar una aseguradora, el botón
de cancelar tiene un error ortográfico: dice "Cencelar" en lugar de
"Cancelar".

PASOS PARA REPRODUCIR
----------------------
1. Navegar a módulo "Catálogos"
2. Seleccionar pestaña "Aseguradoras"
3. Hacer clic en botón "Eliminar" de cualquier aseguradora
4. Observar el diálogo de confirmación
5. Leer el texto del botón derecho

RESULTADO ESPERADO
------------------
- El botón debe decir "Cancelar" correctamente escrito
- Mantener consistencia con otros diálogos del sistema

RESULTADO ACTUAL
----------------
- El botón dice "Cencelar" (error ortográfico)
- Es visualmente notable y poco profesional

DATOS DE PRUEBA
---------------
No aplica - error visual en interfaz

EVIDENCIA
---------
Screenshots:
- [X] screenshot_bug004_dialogo_error.png - Diálogo con error ortográfico

INFORMACIÓN ADICIONAL
---------------------
Frecuencia:       Siempre
Workaround:       No afecta funcionalidad, solo estética
Impacto:          Bajo - Solo afecta imagen profesional
SO:               Windows 11
Notas:            Revisar archivo: views/partials/modal-confirm.html
                  El mismo error podría existir en otros diálogos.
                  Hacer búsqueda global de "Cencelar" en todos los archivos.

================================================================================
```

---

## CHECKLIST DE VALIDACIÓN

Antes de enviar un reporte de bug, verifica:

### Información Completa
- [ ] El título describe claramente el problema
- [ ] El módulo está correctamente identificado
- [ ] La severidad está bien clasificada
- [ ] Los pasos son específicos y detallados
- [ ] Los resultados esperado y actual están claros
- [ ] Los datos de prueba están completos

### Evidencia
- [ ] Hay al menos 1 screenshot adjunto
- [ ] Los screenshots muestran claramente el problema
- [ ] Los nombres de archivos son descriptivos
- [ ] Si el bug es visual, hay screenshot del problema

### Reproducibilidad
- [ ] El bug se puede reproducir siguiendo los pasos
- [ ] El bug se probó al menos 2 veces
- [ ] La frecuencia está documentada
- [ ] Se probó con diferentes datos si aplica

### Unicidad
- [ ] Es solo 1 bug por reporte
- [ ] No está duplicado con otro reporte existente
- [ ] No es una mejora disfrazada de bug

### Claridad
- [ ] La redacción es clara y sin ambigüedades
- [ ] No hay jerga técnica innecesaria
- [ ] Cualquier persona puede entender el problema
- [ ] Los datos son reales, no ejemplos genéricos

---

## INFORMACIÓN DEL SISTEMA

### Datos a Recopilar

Cuando reportes un bug, incluye siempre esta información:

#### Sistema Operativo
```
Para Windows:
1. Presionar Win + R
2. Escribir: winver
3. Tomar screenshot de la versión

Para macOS:
1. Menú Apple > Acerca de este Mac
2. Anotar versión de macOS
```

#### Versión de la Aplicación
```
- Ir a Menú > Ayuda > Acerca de
- O revisar archivo package.json
- Versión actual: 1.0.0
```

#### Especificaciones del Equipo
```
Para Windows:
1. Win + R > dxdiag
2. Anotar:
   - Procesador
   - Memoria RAM
   - Sistema Operativo

Para macOS:
1. Apple > Acerca de este Mac
2. Anotar las mismas especificaciones
```

#### Estado de la Base de Datos
```
- ¿Base de datos nueva o con datos existentes?
- ¿Cuántos registros aproximadamente?
  - Clientes: _____
  - Pólizas: _____
  - Recibos: _____
```

---

## NOMENCLATURA DE ARCHIVOS

### Screenshots
Usar el formato: `screenshot_[bugid]_[descripcion].png`

**Ejemplos:**
- `screenshot_bug001_aplicacion_cerrada.png`
- `screenshot_bug002_calculo_incorrecto.png`
- `screenshot_bug015_boton_deshabilitado.png`

### Videos (si aplica)
Usar el formato: `video_[bugid]_[descripcion].mp4`

**Ejemplos:**
- `video_bug001_cierre_inesperado.mp4`
- `video_bug010_comportamiento_lento.mp4`

### Logs (si aplica)
Usar el formato: `log_[bugid]_[fecha].txt`

**Ejemplos:**
- `log_bug001_05112025.txt`
- `log_bug023_06112025.txt`

---

## FLUJO DE TRABAJO

### 1. Descubrimiento del Bug
```
Tester encuentra problema
    ↓
Verificar que es reproducible
    ↓
Clasificar severidad
```

### 2. Documentación
```
Completar plantilla de reporte
    ↓
Tomar screenshots
    ↓
Revisar checklist de validación
```

### 3. Reporte
```
Crear documento .md o entrada en sistema
    ↓
Asignar ID único
    ↓
Enviar a coordinador de testing
```

### 4. Seguimiento
```
Bug asignado a desarrollador
    ↓
Estado: En Corrección
    ↓
Desarrollador corrige y notifica
    ↓
Tester re-testea (regression testing)
    ↓
Si OK: Estado: Cerrado
Si NO: Reabrir con nueva evidencia
```

---

## MEJORES PRÁCTICAS

### ✅ HACER

1. **Ser específico**
   - ❌ "El módulo de clientes no funciona"
   - ✅ "Al guardar cliente con RFC vacío, no muestra mensaje de error"

2. **Proveer datos exactos**
   - ❌ "Con cualquier póliza"
   - ✅ "Con póliza POL-2025-001, cliente Juan Pérez"

3. **Describir paso a paso**
   - ❌ "Intenté guardar y falló"
   - ✅ "1. Clic en Nuevo, 2. Llenar nombre, 3. Clic en Guardar, 4. Error"

4. **Adjuntar evidencia**
   - Siempre incluir screenshots
   - Si es bug de flujo, considerar video
   - Si hay error en consola, capturar logs

5. **Verificar reproducibilidad**
   - Probar el bug al menos 2 veces
   - Probar con diferentes datos
   - Documentar frecuencia real

### ❌ NO HACER

1. **No mezclar bugs**
   - ❌ Reportar 3 problemas en un solo reporte
   - ✅ Crear 3 reportes separados

2. **No asumir la causa**
   - ❌ "El bug es porque el código está mal"
   - ✅ "El resultado es X cuando esperaba Y"

3. **No usar datos genéricos**
   - ❌ "Con un cliente cualquiera"
   - ✅ "Con cliente RFC: PEGJ850101XXX"

4. **No reportar sin verificar**
   - ❌ Reportar a la primera ocurrencia
   - ✅ Verificar que se repite consistentemente

5. **No omitir información**
   - ❌ Dejar campos vacíos
   - ✅ Completar todos los campos, usar "N/A" si no aplica

---

## GLOSARIO

**Bug:** Error o defecto en el software que causa comportamiento incorrecto

**Severidad:** Nivel de impacto del bug en el sistema

**Workaround:** Forma alternativa de realizar una acción evitando el bug

**Reproducible:** Un bug que ocurre consistentemente siguiendo los mismos pasos

**Regression:** Bug que reaparece después de haber sido corregido

**Edge Case:** Caso extremo o poco común que puede causar errores

**Case-sensitive:** Distinguir entre mayúsculas y minúsculas

**Case-insensitive:** No distinguir entre mayúsculas y minúsculas

**Crash:** Cierre inesperado de la aplicación

**Freeze:** La aplicación deja de responder pero no se cierra

---

## PREGUNTAS FRECUENTES

### ¿Qué hago si no estoy seguro de la severidad?
Clasifícalo como **Medio** y el coordinador lo reclasificará si es necesario.

### ¿Qué hago si no puedo reproducir el bug?
Documenta el único caso que viste con todos los detalles posibles y márcalo como "Frecuencia: Rara vez (no reproducible)".

### ¿Puedo reportar mejoras en este formato?
No, este formato es solo para bugs. Las mejoras van en documento separado.

### ¿Qué hago si el bug solo ocurre a veces?
Documéntalo normalmente, indica la frecuencia aproximada (ej: "3 de cada 10 intentos") y anota cualquier patrón que notes.

### ¿Debo reportar bugs menores/cosméticos?
Sí, todos los bugs deben reportarse. Usa severidad "Bajo" para temas cosméticos.

### ¿Qué hago si encuentro el mismo bug en varios módulos?
Crea un reporte por cada módulo afectado, o un único reporte indicando claramente todos los módulos en la descripción.

---

## CONTACTO Y SOPORTE

**Coordinador de Testing:** [Nombre]
**Email:** [email@ejemplo.com]
**Dudas sobre el formato:** Consultar este documento primero

---

## CONTROL DE VERSIONES

| Versión | Fecha      | Cambios                           | Autor          |
|---------|------------|-----------------------------------|----------------|
| 1.0.0   | 05/11/2025 | Creación inicial de plantilla     | Sistema        |

---

**Sistema de Seguros VILLALOBOS**
Plantilla de Reporte de Bugs v1.0.0
Noviembre 2025
