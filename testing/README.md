# TESTING - Sistema de Seguros VILLALOBOS

Carpeta organizada de testing del proyecto.

## Estructura

```
testing/
├── README.md                          # Este archivo
├── manual/                            # Testing Manual
│   ├── PLAN_TESTER_1.md              # Plan para Tester 1 (Módulos base)
│   ├── PLAN_TESTER_2.md              # Plan para Tester 2 (Ciclo de negocio)
│   ├── TEMPLATE_REPORTE_BUGS.md      # Plantilla para reportar bugs
│   └── DATOS_PRUEBA.md               # Catálogo de datos de prueba
├── automatizado/                      # Testing Automatizado
│   ├── scripts/                       # Scripts de automatización
│   │   ├── test-automation.js        # Script principal de automatización
│   │   ├── db_integrity.test.js      # Tests de integridad de BD
│   │   ├── ui_smoke.test.js          # Tests de humo de UI
│   │   ├── explore-testlink.js       # Exploración de TestLink
│   │   ├── testlink-assign.js        # Asignación de casos TestLink
│   │   ├── testlink-capture-results.js  # Captura de resultados
│   │   └── testlink-report.js        # Reportes de TestLink
│   ├── evidencias/                    # Evidencias de tests automatizados
│   │   └── test-evidences/           # Screenshots y archivos de evidencia
│   └── testlink/                      # Archivos relacionados con TestLink
│       ├── testlink_mapping.json     # Mapeo de casos de prueba
│       ├── testlink-headless.png     # Screenshot TestLink modo headless
│       ├── testlink-home.png         # Screenshot home TestLink
│       ├── treeframe.html            # Frame de árbol TestLink
│       ├── treeframe_updated.html    # Frame actualizado
│       ├── workframe_case228.html    # Frame de trabajo caso 228
│       └── workframe_log005.html     # Frame de trabajo log 005
└── archivos_historicos/               # Versiones anteriores de scripts
    ├── test-automation.OLD.js        # Versión antigua de automatización
    └── test-automation.v1.js         # Versión 1 de automatización
```

## Testing Manual

### Para los Testers

Si eres tester asignado a este proyecto, comienza aquí:

1. **Lee primero:**
   - `manual/DATOS_PRUEBA.md` - Familiarízate con los datos de prueba

2. **Tu plan de trabajo:**
   - **Tester 1:** Sigue `manual/PLAN_TESTER_1.md`
     - Módulos: Clientes, Documentos, Catálogos, Dashboard
     - 55 casos de prueba

   - **Tester 2:** Sigue `manual/PLAN_TESTER_2.md`
     - Módulos: Pólizas, Recibos, Integraciones
     - 70 casos de prueba

3. **Reporta bugs usando:**
   - `manual/TEMPLATE_REPORTE_BUGS.md` - Formato estándar

### Archivos del Testing Manual

#### PLAN_TESTER_1.md
Guía detallada para testing de módulos base del sistema:
- Gestión de Clientes (CRUD, validaciones, búsquedas)
- Gestión de Documentos (carga, formatos, límites)
- Gestión de Catálogos (aseguradoras, ramos)
- Dashboard (métricas, visualización)

#### PLAN_TESTER_2.md
Guía detallada para testing del ciclo de negocio:
- Gestión de Pólizas (creación, cálculos, estados)
- Gestión de Recibos (generación automática, pagos, vencimientos)
- Integraciones (relaciones entre módulos)

#### TEMPLATE_REPORTE_BUGS.md
Plantilla profesional para documentar bugs encontrados:
- Clasificación por severidad (Crítico, Alto, Medio, Bajo)
- Campos estándar (pasos, resultado esperado vs actual)
- Ejemplos de reportes bien formados
- Checklist de validación

#### DATOS_PRUEBA.md
Catálogo completo de datos predefinidos para usar en testing:
- 10 Clientes de prueba (casos normales y edge cases)
- 15 Pólizas de prueba (todos los escenarios)
- 10 Recibos de prueba (todos los estados)
- 10 Documentos de prueba (diferentes formatos)
- Casos edge y pruebas negativas

## Testing Automatizado

### Scripts Disponibles

#### Scripts Principales

**test-automation.js**
Script principal de automatización con Playwright. Ejecuta suite completa de tests automatizados.

**db_integrity.test.js**
Tests de integridad de base de datos. Valida:
- Estructura de tablas
- Relaciones entre entidades
- Constraints y foreign keys

**ui_smoke.test.js**
Tests de humo (smoke tests) de interfaz de usuario. Valida:
- Carga de módulos principales
- Navegación básica
- Elementos críticos visibles

#### Scripts de TestLink

**explore-testlink.js**
Explora y analiza la estructura de TestLink para obtener casos de prueba.

**testlink-assign.js**
Asigna casos de prueba de TestLink a testers.

**testlink-capture-results.js**
Captura y registra resultados de ejecución en TestLink.

**testlink-report.js**
Genera reportes de resultados de TestLink.

### Evidencias

La carpeta `automatizado/evidencias/test-evidences/` contiene:
- Screenshots de tests fallidos
- Logs de ejecución
- Archivos de evidencia de bugs encontrados

### Ejecutar Tests Automatizados

```bash
# Instalar dependencias (si no están instaladas)
npm install

# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
node testing/automatizado/scripts/test-automation.js
node testing/automatizado/scripts/db_integrity.test.js
node testing/automatizado/scripts/ui_smoke.test.js
```

## Archivos Históricos

La carpeta `archivos_historicos/` contiene versiones anteriores de scripts que ya no se usan pero se conservan por referencia:

- `test-automation.OLD.js` - Versión antigua del script de automatización
- `test-automation.v1.js` - Primera versión del script

**Nota:** Estos archivos NO deben usarse en testing activo.

## Flujo de Trabajo Recomendado

### Para Testing Manual

1. **Preparación (Día 1)**
   ```
   - Leer DATOS_PRUEBA.md
   - Familiarizarse con el sistema
   - Preparar ambiente de testing
   - Crear carpeta para screenshots
   ```

2. **Ejecución (Días 2-4)**
   ```
   Tester 1:
   - Seguir PLAN_TESTER_1.md paso a paso
   - Documentar bugs en tiempo real
   - Tomar screenshots de cada hallazgo

   Tester 2:
   - Seguir PLAN_TESTER_2.md paso a paso
   - Documentar bugs en tiempo real
   - Tomar screenshots de cada hallazgo
   ```

3. **Reporte (Día 5)**
   ```
   - Compilar todos los bugs encontrados
   - Usar TEMPLATE_REPORTE_BUGS.md
   - Priorizar por severidad
   - Entregar reporte final
   ```

### Para Testing Automatizado

1. **Configuración**
   ```bash
   # Verificar que Playwright está instalado
   npm list @playwright/test

   # Si no está, instalar
   npm install --save-dev @playwright/test
   ```

2. **Ejecución**
   ```bash
   # Tests completos
   npm test

   # Solo smoke tests
   node testing/automatizado/scripts/ui_smoke.test.js

   # Solo integridad de BD
   node testing/automatizado/scripts/db_integrity.test.js
   ```

3. **Revisión de Resultados**
   ```
   - Revisar console output
   - Verificar screenshots en evidencias/
   - Analizar logs de errores
   ```

## Coordinación entre Testers

### Reunión Diaria (15 min)
- ¿Qué probé ayer?
- ¿Qué bugs encontré?
- ¿Qué voy a probar hoy?
- ¿Tengo algún bloqueador?

### Compartir Hallazgos
- Usar carpeta compartida para screenshots
- Documentar bugs inmediatamente al encontrarlos
- Comunicar bugs críticos de inmediato
- Evitar duplicar trabajo

## Métricas de Testing

### Metas de Cobertura

**Testing Manual:**
- Módulos base: 55 casos de prueba (Tester 1)
- Ciclo de negocio: 70 casos de prueba (Tester 2)
- **Total:** 125 casos de prueba manuales

**Testing Automatizado:**
- Smoke tests: ~20 casos
- Integridad BD: ~15 casos
- **Total:** ~35 casos automatizados

### Tracking de Progreso

Usar checklist al final de cada plan de testing para marcar:
- ✅ Casos ejecutados
- ❌ Casos fallidos
- ⚠️ Casos bloqueados
- 📝 Bugs encontrados

## Mejores Prácticas

### Para Todos los Testers

1. **Documentación**
   - Siempre tomar screenshots
   - Usar datos exactos (no "un cliente cualquiera")
   - Especificar pasos reproducibles
   - Incluir información del sistema (OS, versión)

2. **Comunicación**
   - Reportar bugs críticos inmediatamente
   - Actualizar progreso diariamente
   - Compartir hallazgos con el equipo
   - Preguntar si algo no está claro

3. **Organización**
   - Seguir el plan de testing
   - No saltar casos
   - Documentar todo hallazgo
   - Mantener evidencias organizadas

4. **Actitud**
   - Pensar como usuario final
   - Probar casos edge
   - No asumir que algo funciona
   - Ser exhaustivo pero eficiente

## Solución de Problemas

### Testing Manual

**P: No puedo reproducir un bug**
R: Documéntalo con la información que tengas, marca frecuencia como "Rara vez"

**P: ¿Debo reportar bugs menores?**
R: Sí, todos los bugs deben reportarse. Usa severidad "Bajo" para cosméticos.

**P: El sistema se cerró durante una prueba**
R: Bug Crítico. Documenta inmediatamente con pasos exactos.

### Testing Automatizado

**P: Los tests fallan al ejecutarse**
R: Verifica que la app esté construida: `npm run build`

**P: Playwright no encuentra elementos**
R: Verifica los selectores en el código vs la app actual

**P: Tests pasan pero hay bugs visibles**
R: Los tests automatizados no cubren todo. Por eso necesitamos testing manual.

## Contacto

**Coordinador de Testing:** [Nombre]
**Desarrolladores:** [Nombres]
**Reunión diaria:** [Hora]
**Canal de comunicación:** [Slack/Discord/Email]

## Notas Importantes

- ⚠️ **NO uses datos de producción** - Solo datos de DATOS_PRUEBA.md
- ⚠️ **NO modifiques los scripts automatizados** sin consultar
- ⚠️ **SIEMPRE haz backup** antes de testing destructivo
- ⚠️ **REPORTA bugs críticos** inmediatamente, no esperes

## Recursos Adicionales

- [Manual de Usuario](../docs/manuales/MANUAL_USUARIO.md)
- [Especificaciones Técnicas](../docs/arquitectura/ESPECIFICACIONES_COMPLETAS.md)
- [Diagrama de Base de Datos](../docs/base-de-datos/diagrama_bd.md)
- [README Principal](../README.md)

---

**Sistema de Seguros VILLALOBOS**
Testing v1.0.0
Noviembre 2025
