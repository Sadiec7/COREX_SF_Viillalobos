# Especificaciones del Equipo del Cliente

## Información General

Este documento detalla las especificaciones del hardware del cliente para el cual se ha optimizado el sistema de gestión de seguros "Seguros Fianzas VILLALOBOS".

## Especificaciones Técnicas

| Componente | Detalle |
|-----------|---------|
| **CPU** | Intel Celeron N4120 @ 1.10GHz |
| **RAM** | 4 GB (3.82 GB utilizable) |
| **GPU** | Intel UHD Graphics 600 (512 MB) |
| **Almacenamiento** | 238 GB (107 GB usados) |
| **Equipo** | HP Laptop 14-dq0xxx |
| **Sistema Operativo** | Windows 64 bits |

## Características del Procesador

### Intel Celeron N4120
- **Núcleos**: 4 núcleos
- **Hilos**: 4 hilos
- **Frecuencia base**: 1.10 GHz
- **Frecuencia turbo**: Hasta 2.60 GHz
- **TDP**: 6W (diseño de bajo consumo)
- **Arquitectura**: Gemini Lake Refresh
- **Cache**: 4 MB

### Consideraciones de Rendimiento
- Procesador de gama baja orientado a tareas ligeras
- Ideal para aplicaciones de oficina y navegación web
- Limitaciones en procesamiento intensivo y multitarea pesada

## Características de Memoria

### RAM: 4 GB
- **Disponible**: 3.82 GB (el sistema reserva ~200 MB)
- **Tipo**: DDR4 (probablemente)
- **Velocidad**: Variable según modelo

### Implicaciones
- Memoria limitada para múltiples aplicaciones simultaneas
- Requiere optimización cuidadosa del uso de memoria
- El sistema operativo Windows 64-bit consume aproximadamente 2 GB en reposo

## Características de GPU

### Intel UHD Graphics 600
- **Memoria dedicada**: 512 MB (compartida con RAM del sistema)
- **Frecuencia base**: 200 MHz
- **Frecuencia máxima**: 650 MHz
- **DirectX**: 12
- **OpenGL**: 4.5

### Limitaciones Gráficas
- GPU integrada de bajo rendimiento
- No apta para tareas gráficas intensivas
- Compartir memoria RAM afecta rendimiento general
- Limitada capacidad para animaciones complejas y efectos visuales

## Almacenamiento

- **Capacidad total**: 238 GB
- **Espacio usado**: 107 GB (45%)
- **Espacio disponible**: 131 GB
- **Tipo**: Probablemente SSD (común en laptops modernas)

## Optimizaciones Implementadas

Para garantizar el funcionamiento óptimo del sistema en este hardware, se han implementado las siguientes optimizaciones:

### 1. Optimizaciones de Electron (main.js)
```javascript
// Limitación de heap de V8 a 512MB
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');

// Deshabilitación de características innecesarias
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
```

### 2. Optimizaciones de Ventana
- Garbage collection forzado al minimizar/cerrar ventanas
- Frame rate reducido cuando la ventana está oculta (60 fps → 30 fps)
- Deshabilitación del corrector ortográfico
- Background throttling desactivado

### 3. Optimizaciones CSS (performance.css)
- Animaciones reducidas en duración (0.4s → 0.2s)
- Eliminación de animaciones complejas de hover
- Simplificación de sombras y efectos visuales
- Uso exclusivo de propiedades aceleradas por GPU (transform, opacity)
- Text rendering optimizado para velocidad

### 4. Optimizaciones de Base de Datos
- Índices creados en columnas frecuentemente consultadas
- Índices compuestos para consultas comunes
- ANALYZE ejecutado para optimizar el planificador de consultas
- Queries optimizadas para minimizar joins complejos

### 5. Gestión de Memoria
- Límite de heap de JavaScript en 512 MB
- Garbage collection proactivo
- Contenedores con `contain: layout style` para reducir repaints
- Elementos que cambian frecuentemente con `contain: layout paint`

## Métricas de Rendimiento Esperadas

### Uso de Recursos Objetivo
| Recurso | En reposo | Uso normal | Pico |
|---------|-----------|------------|------|
| CPU | < 5% | 10-20% | < 40% |
| RAM | 150-200 MB | 250-350 MB | < 500 MB |
| GPU | Mínimo | < 20% | < 40% |

### Tiempos de Respuesta Objetivo
- **Inicio de aplicación**: < 3 segundos
- **Carga de dashboard**: < 1 segundo
- **Búsqueda de registros**: < 500 ms
- **Creación de registro**: < 1 segundo
- **Transición entre vistas**: < 300 ms

## Recomendaciones para el Cliente

### Mantenimiento del Sistema
1. Mantener al menos 20% del almacenamiento libre
2. Cerrar aplicaciones no utilizadas mientras se usa el sistema
3. Evitar ejecutar múltiples aplicaciones pesadas simultáneamente
4. Reiniciar el sistema periódicamente para liberar memoria

### Limitaciones Conocidas
1. **Multitarea**: No recomendable tener muchas pestañas de navegador abiertas simultáneamente
2. **Animaciones**: Las animaciones se han simplificado para mantener fluidez
3. **Documentos grandes**: La manipulación de PDFs muy grandes puede ser lenta
4. **Respaldo**: El proceso de respaldo puede tomar varios minutos

### Futuras Mejoras
Si se presenta lentitud significativa, considerar:
1. **Upgrade de RAM**: Expandir a 8 GB mejoraría significativamente el rendimiento
2. **Verificar SSD**: Asegurar que el almacenamiento es SSD y no HDD
3. **Limpieza del sistema**: Eliminar programas innecesarios que se ejecutan al inicio

## Contacto y Soporte

Para reportar problemas de rendimiento o solicitar ajustes adicionales:
- Documentar el problema específico (aplicación lenta, pantalla congelada, etc.)
- Anotar qué estaba haciendo cuando ocurrió el problema
- Verificar el uso de recursos en el Administrador de Tareas de Windows

## Historial de Optimizaciones

| Fecha | Versión | Optimización |
|-------|---------|--------------|
| 2025-11-05 | 1.0.0 | Implementación inicial de optimizaciones para equipos de bajos recursos |

---

**Nota**: Este documento debe actualizarse cuando se implementen nuevas optimizaciones o cambios significativos en el sistema.
