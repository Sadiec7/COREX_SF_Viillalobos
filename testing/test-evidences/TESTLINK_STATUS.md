# TestLink – Revisión de Suites vs Proyecto `projecttest`

## Contexto
- **Documento base**: `Downloads/Documento de Especificación de Requerimientos de Software (ERS).docx` describe el sistema Corex (gestión de clientes, pólizas, pagos/alertas, reportes y autenticación).
- **Aplicación revisada**: `/Documents/Projects/projecttest` (Electron + SQLite local) con módulos de Login, Dashboard, Clientes y Pólizas. No hay módulo operativo de Reportes ni notificaciones por correo.
- **Objetivo**: verificar si las suites de TestLink asociadas al proyecto COREX cubren los requerimientos reales y cuáles casos pueden ejecutarse hoy.

## Requerimientos del ERS vs implementación actual
| Requerimiento | Estado en la app | Observaciones |
| --- | --- | --- |
| **RF01 Gestión de Clientes** | Parcial | CRUD, búsqueda por nombre y soft delete implementados. Falta cambio de estado activo/inactivo, validaciones estrictas de RFC/teléfono y filtros por estado. |
| **RF02 Gestión de Pólizas** | Parcial | Alta, filtros por aseguradora/ramo/estado y generación automática de recibos están listos. No existe edición/baja de pólizas, historial de cambios ni generación de documentos. |
| **RF03 Pagos y Alertas** | Parcial | Recibos y métricas de vencimientos están en DB, pero no hay panel de alertas ni notificaciones por correo o workflows de “atendida/eliminada”. |
| **RF04 Reportes y Consultas** | No implementado | La opción “Reportes” del menú muestra un mensaje “coming soon”; no hay exportación a Excel. |
| **RF05 Seguridad** | Parcial | Autenticación con hash bcrypt y logout listos. No se implementan bloqueo por intentos, recuperación de contraseña ni expiración de enlaces. |
| **RNF (UI/UX)** | Parcial | Paleta y estilos consistentes en login/cliente/póliza. No hay vistas reales para Reportes, por lo que navegar “clientes → pólizas → reportes” abre un modal placeholder. |

## Estado de las suites de TestLink
| Suite | Cobertura principal | Estado | Casos ejecutables hoy | Casos bloqueados / motivos |
| --- | --- | --- | --- | --- |
| **Gestión de Clientes** | RF01 | **Parcial** | TC-CLI-001, 002, 003, 005, 008 (altas, edición básica, validación de email, RFC duplicado) | TC-CLI-004/006 (no hay validaciones de formato para RFC/teléfono), TC-CLI-007 (no existe cambio a “Inactivo”), TC-CLI-009 (no hay filtro por estado), TC-CLI-010 (no hay ordenamiento en UI). |
| **Pólizas** | RF02 & RF03 | **Parcial** | TC-POL-005 (bloqueo por número duplicado), TC-POL-007 (filtro por estado) | TC-POL-001/009 (no existe edición de póliza), TC-POL-006 (no hay búsqueda/filtrado por cliente), TC-POL-008 (sin generación de PDF/documentos), TC-POL-010 (no se implementó historial/auditoría visible). |
| **Alertas** | RF03 | **Bloqueada** | — | No existe UI para listar/gestionar alertas ni motor de notificaciones por correo; el dashboard sólo expone métricas internas. Casos TC-ALR-007/008/009 requieren flujos inexistentes. |
| **Login** | RF05 | **Parcial** | TC-LOG-001, 002, 003, 005, 006, 009, 010 | TC-LOG-004 (bloqueo tras intentos fallidos), TC-LOG-007/008 (recuperación de contraseña y expiración de enlace) no están implementados. |
| **Base de Datos** | Integridad | **Parcial** | TC-DB-001, 002, 003, 004, 007, 008, 009 | TC-DB-005 (correo no es NOT NULL), TC-DB-006 (longitud esperada 255 pero en schema es 100 y la UI no valida), TC-DB-010 (eliminación es soft delete, no RESTRICT/ CASCADE). |
| **Diseño (UI/UX)** | RNF | **Parcial** | TC-UI-001, 004, 007, 008, 009, 010 | TC-UI-002/006 requieren vista responsive móvil (la app de escritorio no cubre), TC-UI-003/005 aluden al módulo de Reportes inexistente. |

### Suites que pueden ejecutarse sin bloqueos
- **Login**: enfocado en autenticación básica y UX (TC-LOG-001/002/003/005/006/009/010).
- **Gestión de Clientes**: validar altas, edición básica y reglas de unicidad (TC-CLI-001/002/003/005/008).
- **Base de Datos**: pruebas de integridad referencial y restricciones activas (TC-DB-001/002/003/004/007/008/009).
- **Diseño (UI/UX)**: inspecciones visuales generales en módulos existentes (TC-UI-001/004/007/008/009/010).
- **Pólizas**: únicamente los escenarios de duplicidad y filtros de estado (TC-POL-005, TC-POL-007).

### Casos que deben aplazarse o ajustarse
- Implementar antes: gestión de alertas (ALR-xxx), reportes a Excel, password recovery, bloqueo de cuenta, edición/historial de pólizas, filtros avanzados de clientes.
- Ajustar expectativas: TC-DB-005/006 (actualizar diseño de datos o corregir caso), TC-DB-010 (acordar estrategia de baja lógica), TC-UI-003/005 (sin módulo de reportes), TC-CLI-009/010 (actualizar backlog para incluir filtros/ordenamientos o modificar casos).

## Recomendaciones
1. **Priorizar desarrollo** de módulo de reportes (RF04) y panel de alertas antes de planear pruebas end-to-end.
2. **Agregar validaciones** en formularios (RFC, longitudes, cambio de estado) para alinear TC-CLI-004/006/007/009.
3. **Extender módulo de pólizas** con edición, descarga de documentos y auditoría para habilitar la suite completa.
4. **Seguridad**: decidir política de recuperación/bloqueo y documentar cronograma; ajustar casos de Login si no se implementará pronto.
5. **Actualizar TestLink** con notas de alcance (marcar casos bloqueados) hasta que existan los flujos/product backlog correspondientes.


## 📌 Resumen de ejecución – 12/10/2025 23:00

### Casos ejecutados por suite
- **Login**: 7 casos PASS
- **Gestion de Clientes**: 5 casos PASS
- **Polizas**: 2 casos PASS
- **Diseno (UI-UX)**: 6 casos PASS

### Casos no ejecutados
- **Alertas**: Sin módulo implementado en la app; los casos ALR requieren UI y notificaciones.
- **Base de Datos**: Validaciones avanzadas y reglas no están completas (campos not null, cascadas).

### Notas
Se ejecutaron únicamente los casos alineados con la funcionalidad disponible en el build actual. Los módulos de Alertas y reportes, así como parte de las validaciones de Base de Datos, siguen pendientes de implementación, por lo que sus casos permanecen bloqueados.
