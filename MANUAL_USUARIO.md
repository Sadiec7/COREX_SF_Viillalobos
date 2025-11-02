# Manual de Usuario - Sistema de Gestión de Seguros
## Seguros Fianzas VILLALOBOS

**Versión:** 1.0
**Fecha:** 20 Octubre 2025
**Sistema:** Electron MVC v2

---

## Índice

1. [Introducción](#introducción)
2. [Inicio de Sesión](#inicio-de-sesión)
3. [Dashboard](#dashboard)
4. [Gestión de Clientes](#gestión-de-clientes)
5. [Gestión de Pólizas](#gestión-de-pólizas)
6. [Sistema de Alertas](#sistema-de-alertas)
7. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

El Sistema de Gestión de Seguros VILLALOBOS es una aplicación de escritorio diseñada para facilitar la administración integral de pólizas de seguros, clientes y recibos de pago.

### Características Principales

- ✅ Gestión completa de clientes (CRUD)
- ✅ Administración de pólizas y recibos
- ✅ Dashboard con métricas en tiempo real
- ✅ Sistema de alertas de vencimiento
- ✅ Búsqueda avanzada
- ✅ Interfaz moderna y responsive
- ✅ Seguridad con bcrypt
- ✅ Auditoría de cambios

---

## Inicio de Sesión

### Primera Vez

Al abrir la aplicación, verás la pantalla de inicio de sesión.

**Credenciales predeterminadas:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### Proceso de Login

1. Ingresa tu nombre de usuario
2. Ingresa tu contraseña
3. Haz clic en "Iniciar Sesión"
4. Si las credenciales son correctas, serás redirigido al Dashboard

### Seguridad

- **Bloqueo automático:** Después de 5 intentos fallidos, tu cuenta se bloqueará
- **Contraseñas seguras:** El sistema utiliza bcrypt para encriptar contraseñas
- **Sesiones seguras:** La sesión se cierra automáticamente después de inactividad

### Cerrar Sesión

- Haz clic en el botón "Cerrar Sesión" en la barra lateral
- Confirma la acción en el diálogo que aparece
- Serás redirigido a la pantalla de login

---

## Dashboard

El Dashboard es la pantalla principal que muestra un resumen de la actividad del sistema.

### Métricas Principales

**1. Total Pólizas**
- Muestra la cantidad total de pólizas activas en el sistema
- Actualización en tiempo real

**2. Vencen Esta Semana**
- Pólizas que vencen en los próximos 7 días
- Color naranja indica alerta

**3. Cobros Pendientes**
- Suma total de recibos no pagados
- Formato de moneda mexicana

**4. Nuevos Clientes**
- Clientes agregados en el mes actual

### Navegación

La barra lateral izquierda contiene el menú principal:

- **📊 Dashboard** - Pantalla principal
- **👥 Clientes** - Gestión de clientes
- **📄 Pólizas** - Gestión de pólizas
- **📈 Reportes** - (Próximamente)
- **⚙️ Configuración** - (Próximamente)

---

## Gestión de Clientes

### Acceder al Módulo

1. Desde el Dashboard, haz clic en **"Clientes"** en la barra lateral
2. Se mostrará la lista de todos los clientes activos

### Visualizar Clientes

La tabla muestra:
- **ID:** Identificador único
- **Nombre:** Nombre completo del cliente
- **RFC:** RFC del cliente
- **Tipo:** Persona Física o Moral
- **Email:** Correo electrónico
- **Teléfono:** Número de contacto
- **Acciones:** Botones de acción

### Estadísticas

En la parte superior se muestran:
- Total de clientes
- Personas Físicas
- Personas Morales

### Agregar Nuevo Cliente

1. Haz clic en el botón **"+ Nuevo Cliente"**
2. Se abrirá un formulario modal
3. Completa los campos requeridos:
   - **Nombre** (Requerido)
   - **RFC** (Requerido, único)
   - **Tipo de Persona** (Física o Moral)
   - Email
   - Teléfono
   - Celular
   - Dirección
   - Notas
4. Haz clic en **"Guardar Cliente"**
5. El cliente se agregará y aparecerá en la lista

### Editar Cliente

1. En la lista de clientes, haz clic en el ícono de **lápiz** ✏️
2. Se abrirá el formulario con los datos actuales
3. Modifica los campos necesarios
4. Haz clic en **"Guardar Cliente"**
5. Los cambios se aplicarán inmediatamente

### Eliminar Cliente

1. En la lista de clientes, haz clic en el ícono de **basurero** 🗑️
2. Aparecerá un diálogo de confirmación
3. Confirma la eliminación
4. El cliente se marcará como inactivo (soft delete)

**Nota:** Los clientes no se eliminan permanentemente, solo se marcan como inactivos.

### Ver Pólizas de un Cliente

1. Haz clic en el ícono de **documento** 📄 junto al cliente
2. Se mostrarán todas las pólizas asociadas a ese cliente

### Buscar Clientes

1. Utiliza la barra de búsqueda en la parte superior
2. Escribe el nombre o RFC del cliente
3. Los resultados se filtrarán automáticamente en tiempo real

---

## Gestión de Pólizas

### Acceder al Módulo

1. Desde el Dashboard, haz clic en **"Pólizas"** en la barra lateral
2. Se mostrará la lista de todas las pólizas activas

### Agregar Nueva Póliza

1. Haz clic en **"+ Nueva Póliza"**
2. Completa el formulario:
   - **Número de Póliza** (Requerido, único)
   - **Cliente** (Seleccionar de lista)
   - **Aseguradora** (Seleccionar de catálogo)
   - **Ramo** (Tipo de seguro)
   - **Fecha de Inicio** (Requerido)
   - **Fecha de Fin** (Requerido)
   - **Prima Total** (Monto total)
   - **Periodicidad de Pago** (Mensual, Trimestral, etc.)
   - **Método de Pago**
   - Comisión %
   - Suma Asegurada
   - Notas
3. Haz clic en **"Crear Póliza"**
4. El sistema generará automáticamente los recibos según la periodicidad

### Generación Automática de Recibos

Al crear una póliza, el sistema:
1. Calcula el número de fracciones según la periodicidad
2. Divide la prima total entre las fracciones
3. Crea los recibos con fechas de vencimiento automáticas
4. Asigna números de recibo secuenciales

**Ejemplo:**
- Prima Total: $12,000
- Periodicidad: Mensual
- Resultado: 12 recibos de $1,000 cada uno

### Ver Detalles de Póliza

1. Haz clic en una póliza de la lista
2. Se mostrarán todos los detalles:
   - Información del cliente
   - Datos de la aseguradora
   - Vigencia
   - Recibos asociados
   - Estado de pagos

### Ver Recibos de una Póliza

1. Desde los detalles de la póliza, ve a la sección "Recibos"
2. Se mostrará una tabla con:
   - Número de fracción
   - Monto
   - Fecha de vencimiento
   - Estado (Pagado/Pendiente)
   - Fecha de pago (si aplica)

### Marcar Recibo como Pagado

1. En la lista de recibos, haz clic en **"Marcar Pagado"**
2. Confirma la acción
3. El recibo se actualizará con:
   - Estado: Pagado
   - Fecha de pago: Fecha actual

---

## Sistema de Alertas

### Tipos de Alertas

**Alertas Rojas (Críticas)**
- Recibos vencidos
- Pólizas vencidas

**Alertas Amarillas (Advertencia)**
- Recibos que vencen en menos de 7 días
- Pólizas que vencen en menos de 30 días

**Alertas Verdes (Informativas)**
- Recibos próximos a vencer (más de 7 días)

### Ver Alertas

1. En el Dashboard, las alertas se muestran en:
   - Métrica "Vencen Esta Semana"
   - Sección de Pólizas con Alertas (si hay)
2. El color de la alerta indica la urgencia

### Notificaciones

Las alertas se actualizan automáticamente al:
- Ingresar al Dashboard
- Marcar un recibo como pagado
- Crear o modificar una póliza

---

## Solución de Problemas

### No puedo iniciar sesión

**Problema:** El sistema no acepta mis credenciales

**Soluciones:**
1. Verifica que estés usando las credenciales correctas
2. Asegúrate de que las mayúsculas/minúsculas sean correctas
3. Si has fallado 5 veces, tu cuenta puede estar bloqueada
4. Contacta al administrador para desbloquear tu cuenta

### Los datos no se actualizan

**Problema:** Los cambios no se reflejan en la interfaz

**Soluciones:**
1. Cierra y vuelve a abrir la aplicación
2. Verifica tu conexión de red (si aplica)
3. Revisa que no haya errores en la consola de desarrollador

### Error al crear cliente/póliza

**Problema:** "RFC ya existe" o "Número de póliza ya existe"

**Solución:**
- Cada RFC y número de póliza debe ser único
- Verifica que no estés duplicando información
- Usa la búsqueda para encontrar registros existentes

### La aplicación se cierra inesperadamente

**Soluciones:**
1. Verifica que tengas permisos de escritura en la carpeta
2. Asegúrate de que el archivo de base de datos no esté corrupto
3. Revisa que tengas espacio en disco
4. Reinstala la aplicación si el problema persiste

### No veo las métricas del Dashboard

**Problema:** El Dashboard muestra ceros o no carga datos

**Soluciones:**
1. Espera unos segundos para que carguen los datos
2. Verifica que haya datos en el sistema
3. Cierra sesión y vuelve a iniciar
4. Revisa la consola de desarrollador para errores

---

## Atajos de Teclado

**Navegación:**
- `Esc` - Cerrar modales
- `Ctrl + R` o `F5` - Recargar vista actual

**Formularios:**
- `Tab` - Siguiente campo
- `Shift + Tab` - Campo anterior
- `Enter` - Enviar formulario

---

## Catálogos del Sistema

### Periodicidades Disponibles

- **Mensual:** 1 mes (12 fracciones por año)
- **Bimestral:** 2 meses (6 fracciones por año)
- **Trimestral:** 3 meses (4 fracciones por año)
- **Cuatrimestral:** 4 meses (3 fracciones por año)
- **Semestral:** 6 meses (2 fracciones por año)
- **Anual:** 12 meses (1 fracción)

### Métodos de Pago

- Domiciliado
- Transferencia Bancaria
- Cheque
- Tarjeta de Crédito
- Tarjeta de Débito
- Efectivo

### Aseguradoras

El sistema incluye 15 aseguradoras principales:
- GNP Seguros
- AXA Seguros
- MAPFRE
- Seguros SURA
- Quálitas
- HDI Seguros
- Banorte Seguros
- Chubb Seguros
- Zurich Seguros
- MetLife
- Y más...

### Ramos de Seguros

- Automóvil
- Vida
- Gastos Médicos Mayores
- Daños
- Hogar
- Responsabilidad Civil
- Accidentes Personales
- Transporte
- Incendio
- Robo

---

## Mejores Prácticas

### Gestión de Clientes

1. **RFC Correcto:** Verifica que el RFC tenga el formato correcto
2. **Datos Completos:** Llena todos los campos posibles para mejor seguimiento
3. **Tipo de Persona:** Selecciona correctamente Física o Moral
4. **Contacto Actualizado:** Mantén teléfono y email actualizados

### Gestión de Pólizas

1. **Número Único:** Usa el número de póliza de la aseguradora
2. **Fechas Correctas:** Verifica vigencia_inicio < vigencia_fin
3. **Periodicidad:** Selecciona según el contrato con el cliente
4. **Notas:** Agrega información relevante que pueda ser útil después

### Pagos de Recibos

1. **Marcar Inmediatamente:** Registra los pagos tan pronto se reciban
2. **Verificar Fecha:** La fecha de pago se registra automáticamente
3. **Revisar Pendientes:** Consulta regularmente los recibos pendientes

### Seguridad

1. **Cambiar Contraseña:** Cambia la contraseña predeterminada
2. **Cerrar Sesión:** Siempre cierra sesión al terminar
3. **No Compartir:** No compartas tus credenciales
4. **Backup:** Realiza respaldos periódicos de la base de datos

---

## Glosario

**RFC:** Registro Federal de Contribuyentes
**Póliza:** Contrato de seguro
**Prima:** Costo del seguro
**Recibo:** Fracción de pago de la póliza
**Periodicidad:** Frecuencia de pago
**Vigencia:** Período de validez de la póliza
**Ramo:** Tipo o categoría de seguro
**Soft Delete:** Eliminación lógica (no física) de registros

---

## Soporte Técnico

Para asistencia técnica o reporte de problemas:

1. **Documentación:** Consulta primero este manual
2. **Logs:** Revisa la consola de desarrollador (F12)
3. **Contacto:** Comunícate con el administrador del sistema
4. **Backup:** Mantén respaldos antes de operaciones críticas

---

## Actualizaciones

**Próximas Funcionalidades:**
- 📊 Reportes avanzados (Excel, PDF)
- 📁 Gestión de documentos adjuntos
- 📧 Notificaciones por correo
- 📱 Versión móvil
- 🔄 Sincronización en la nube

---

**Manual de Usuario - Sistema de Gestión de Seguros VILLALOBOS**
**Versión 1.0 - Octubre 2025**
**© Seguros Fianzas VILLALOBOS**
