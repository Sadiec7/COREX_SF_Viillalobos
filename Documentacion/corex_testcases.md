# COREX - Inventario de pruebas

Documentación extraída de TestLink. Incluye suites, casos y pasos vigentes.

## Alertas
*Ámbito*: Notificaciones por vigencia y estados

### TC-ALR-002 - No alertar póliza cancelada
- Resumen: Verificar que no se generen alertas para pólizas canceladas
- Precondiciones: Póliza B 'Cancelada' con fin en 15 días
- Pasos:
  1. Acción: Disparar ciclo de alertas
     Resultado esperado: No se genera alerta para B
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-ALR-001 - Alerta por póliza próxima a expirar (≤30 días)
- Resumen: Generar alerta para pólizas con fecha fin en 30 días o menos
- Precondiciones: Póliza A con fin en 20 días; motor de alertas habilitado
- Pasos:
  1. Acción: Ejecutar ciclo de alertas (o esperar cron)
     Resultado esperado: Proceso se ejecuta correctamente
  2. Acción: Revisar centro/listado de alertas
     Resultado esperado: Alerta visible para la póliza A
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-ALR-003 - Aviso de expiradas
- Resumen: Generar alerta para pólizas que ya expiraron
- Precondiciones: Póliza C con fin en el día anterior
- Pasos:
  1. Acción: Ejecutar ciclo
     Resultado esperado: Se registra alerta de 'póliza expirada'
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-ALR-004 - Generar alerta por póliza vencida
- Resumen: Verificar que se genere una alerta automática cuando la póliza haya superado su fecha de fin de vigencia
- Precondiciones: Existe una póliza con fecha fin anterior a la fecha actual
- Pasos:
  1. Acción: Ejecutar el proceso de evaluación de alertas
     Resultado esperado: El proceso se ejecuta sin errores
  2. Acción: El sistema detecta la póliza vencida
     Resultado esperado: Se genera una alerta con el mensaje 'Póliza vencida'
  3. Acción: Verificar lista de alertas
     Resultado esperado: La alerta se muestra en la lista de alertas pendientes
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-ALR-005 - No generar alerta si el sistema ya envió una previamente
- Resumen: Comprobar que el sistema no duplique alertas de expiración para la misma póliza
- Precondiciones: Existe una alerta previa para la misma póliza
- Pasos:
  1. Acción: Ejecutar el ciclo de alertas
     Resultado esperado: El ciclo se ejecuta
  2. Acción: El sistema valida si ya existe una alerta activa para esa póliza
     Resultado esperado: No se crea una nueva alerta duplicada
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-ALR-006 - Alerta de póliza próxima a expirar (15 días)
- Resumen: Verificar que se genere alerta de advertencia cuando faltan 15 días para la expiración
- Precondiciones: Póliza con fecha fin en 15 días
- Pasos:
  1. Acción: Ejecutar el proceso de alertas
     Resultado esperado: El proceso se ejecuta
  2. Acción: El sistema detecta la fecha próxima de vencimiento
     Resultado esperado: Se genera alerta 'Póliza próxima a expirar en 15 días'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-ALR-007 - Eliminar alerta manualmente y verificar que desaparece del panel
- Resumen: Validar que el usuario pueda eliminar una alerta y que esta ya no se muestre en el panel
- Precondiciones: Existe una alerta visible en el listado
- Pasos:
  1. Acción: Abrir la lista de alertas → Seleccionar una alerta → Eliminar
     Resultado esperado: Se solicita confirmación
  2. Acción: Confirmar la acción
     Resultado esperado: Alerta eliminada
  3. Acción: Actualizar el panel
     Resultado esperado: La alerta eliminada desaparece del listado
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-ALR-008 - Marcar alerta como atendida
- Resumen: Verificar que el usuario pueda cambiar el estado de una alerta a 'Atendida'
- Precondiciones: Alerta activa existente
- Pasos:
  1. Acción: Abrir detalle de la alerta → Cambiar estado a 'Atendida'
     Resultado esperado: Se permite el cambio
  2. Acción: Guardar cambios
     Resultado esperado: La alerta se actualiza y se refleja correctamente en el panel
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-ALR-009 - Filtrar alertas por tipo (expiración, vencida, cancelación)
- Resumen: Validar que los filtros por tipo de alerta funcionen correctamente
- Precondiciones: Existen alertas de distintos tipos
- Pasos:
  1. Acción: Ir al listado de alertas → Seleccionar filtro 'Tipo = Expiración'
     Resultado esperado: El listado solo muestra alertas de expiración
  2. Acción: Cambiar filtro a 'Vencidas'
     Resultado esperado: Se muestran únicamente alertas vencidas
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-ALR-010 - Generar notificación por correo al crear alerta crítica
- Resumen: Validar que el sistema envíe una notificación por correo cuando se crea una alerta crítica
- Precondiciones: Configuración de notificaciones por correo activa
- Pasos:
  1. Acción: Ejecutar el ciclo de alertas con una póliza vencida
     Resultado esperado: Se genera una alerta crítica
  2. Acción: Verificar bandeja de entrada
     Resultado esperado: El correo se recibe correctamente y la alerta queda registrada
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.


## Gestión de Clientes
*Ámbito*: Altas, ediciones, validaciones, búsqueda

### TC-CLI-001 - Registro de cliente con datos válidos
- Resumen: Validar que se puede registrar un cliente con datos obligatorios correctos
- Precondiciones: Usuario con permisos de creación; catálogos activos
- Pasos:
  1. Acción: Ir a Clientes → Nuevo
     Resultado esperado: Se muestra formulario
  2. Acción: Capturar campos obligatorios con datos válidos:
    \n- Nombre: María López Ramírez
    \n- RFC: LORM850101ABC
    \n- Tel: 4421234567
    \n- Correo: maria.lopez@example.com
    \n- Estado: Activo
     Resultado esperado: No hay errores de validación
  3. Acción: Guardar
     Resultado esperado: Cliente creado; aparece en listado con ID
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-CLI-002 - Bloqueo por RFC duplicado
- Resumen: Evitar que se duplique un RFC existente
- Precondiciones: Existe cliente con RFC LORM850101ABC
- Pasos:
  1. Acción: Clientes → Nuevo → Capturar RFC duplicado (LORM850101ABC)
     Resultado esperado: Formulario se muestra correctamente
  2. Acción: Guardar
     Resultado esperado: Se muestra error 'RFC existente'; no se crea registro
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-CLI-003 - Edición básica de contacto
- Resumen: Actualizar teléfono y correo de un cliente
- Precondiciones: Cliente existente
- Pasos:
  1. Acción: Abrir detalle → Editar Tel y Correo → Guardar
     Resultado esperado: Cambios se guardan sin errores
  2. Acción: Volver al listado/búsqueda
     Resultado esperado: Datos reflejan cambios
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-CLI-004 - RFC en formato inválido bloquea guardado
- Resumen: Validar que el sistema impida guardar un cliente con un RFC en formato incorrecto
- Precondiciones: El formulario de alta de cliente está accesible
- Pasos:
  1. Acción: Ir a Clientes → Nuevo
     Resultado esperado: Se muestra el formulario
  2. Acción: Capturar los campos obligatorios, usando un RFC inválido (ABC123)
     Resultado esperado: Formulario permite captura
  3. Acción: Guardar
     Resultado esperado: Se muestra un mensaje de error indicando que el RFC no cumple el formato
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-CLI-005 - Correo electrónico con formato inválido
- Resumen: Comprobar que el campo correo exige un formato correcto antes de guardar
- Precondiciones: El formulario de alta de cliente está disponible
- Pasos:
  1. Acción: Ir a Clientes → Nuevo
     Resultado esperado: Se muestra el formulario
  2. Acción: Completar los campos requeridos, usando un correo con formato inválido (maria.lopez@)
     Resultado esperado: Formulario permite captura
  3. Acción: Guardar
     Resultado esperado: El sistema muestra mensaje de error 'Correo inválido' y no crea el registro
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-CLI-006 - Teléfono con longitud distinta a 10 dígitos
- Resumen: Verificar que no se acepten teléfonos con menos o más de 10 dígitos
- Precondiciones: Formulario de alta disponible
- Pasos:
  1. Acción: Ir a Clientes → Nuevo
     Resultado esperado: Se muestra el formulario
  2. Acción: Capturar los campos requeridos con un teléfono de 8 dígitos (44212345)
     Resultado esperado: Formulario permite captura
  3. Acción: Guardar
     Resultado esperado: El sistema muestra mensaje de error por longitud inválida
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-CLI-007 - Cambio de estado a Inactivo (baja lógica)
- Resumen: Validar que un cliente activo pueda cambiar su estado a inactivo y que el sistema restringe ciertas acciones
- Precondiciones: Cliente existente en estado Activo
- Pasos:
  1. Acción: Abrir detalle del cliente → Editar estado → Seleccionar 'Inactivo'
     Resultado esperado: Se puede cambiar el estado
  2. Acción: Guardar
     Resultado esperado: El estado cambia correctamente
  3. Acción: Intentar generar una póliza o acción restringida
     Resultado esperado: El sistema bloquea la operación
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-CLI-008 - Impedir cambiar RFC a uno existente en edición
- Resumen: Evitar duplicados de RFC cuando se edita un cliente
- Precondiciones: Existen dos clientes: Cliente A (RFC_A) y Cliente B (RFC_B)
- Pasos:
  1. Acción: Abrir Cliente B → Editar RFC → Cambiar a RFC_A
     Resultado esperado: Se permite modificar el campo
  2. Acción: Guardar
     Resultado esperado: El sistema muestra mensaje 'RFC ya registrado'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-CLI-009 - Búsqueda y filtro combinado por RFC y Estado
- Resumen: Validar que la búsqueda por RFC y el filtro de Estado se apliquen correctamente de forma conjunta
- Precondiciones: Base con varios clientes activos e inactivos
- Pasos:
  1. Acción: Ir al listado de clientes → Buscar 'LORM' → Filtrar Estado = Activo
     Resultado esperado: El listado solo muestra clientes activos cuyo RFC contiene 'LORM'
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-CLI-010 - Ordenamiento por nombre (ASC/DESC)
- Resumen: Validar que el listado de clientes pueda ordenarse correctamente por el campo nombre
- Precondiciones: Existen al menos cinco clientes con nombres distintos
- Pasos:
  1. Acción: Ir al listado de clientes → Clic en columna 'Nombre'
     Resultado esperado: El sistema ordena la lista en forma ascendente
  2. Acción: Clic nuevamente
     Resultado esperado: Orden descendente
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.


## Login
*Ámbito*: Autenticación y manejo de errores

### TC-LOG-001 - Inicio de sesión válido
- Resumen: Acceso con credenciales correctas
- Precondiciones: Usuario activo con email/contraseña válidos
- Pasos:
  1. Acción: Ir a /login → Ingresar credenciales válidas → Acceder
     Resultado esperado: Redirección a dashboard; sesión activa
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-LOG-002 - Contraseña incorrecta
- Resumen: Validar mensaje de error con contraseña incorrecta
- Precondiciones: Usuario válido existente
- Pasos:
  1. Acción: /login → Usuario válido + contraseña inválida → Acceder
     Resultado esperado: Error 'Credenciales inválidas'; sin sesión
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-LOG-003 - Usuario inexistente
- Resumen: Validar mensaje de error con usuario no registrado
- Precondiciones: Ninguna
- Pasos:
  1. Acción: /login → Usuario no registrado + cualquier contraseña
     Resultado esperado: Error 'Usuario no encontrado' o equivalente; sin sesión
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-LOG-004 - Intentos fallidos consecutivos bloquean cuenta temporalmente
- Resumen: Validar que tras varios intentos fallidos el sistema bloquee temporalmente la cuenta del usuario
- Precondiciones: Usuario activo existente. Política de seguridad configurada (máximo 3 intentos)
- Pasos:
  1. Acción: Ingresar credenciales incorrectas 3 veces consecutivas
     Resultado esperado: Se registran los intentos fallidos
  2. Acción: Intentar iniciar sesión nuevamente con credenciales correctas
     Resultado esperado: El sistema muestra mensaje 'Cuenta bloqueada temporalmente'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-LOG-005 - Mostrar mensaje de error cuando el campo contraseña está vacío
- Resumen: Verificar que el sistema solicite la contraseña si el campo se deja vacío
- Precondiciones: Página de login disponible
- Pasos:
  1. Acción: Ingresar un usuario válido y dejar vacío el campo contraseña
     Resultado esperado: Campo vacío
  2. Acción: Clic en 'Iniciar sesión'
     Resultado esperado: El sistema muestra mensaje 'Ingrese su contraseña'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-LOG-006 - Mostrar mensaje de error cuando el campo usuario está vacío
- Resumen: Validar que el sistema solicite el usuario si el campo se deja vacío
- Precondiciones: Página de login cargada
- Pasos:
  1. Acción: Dejar el campo usuario vacío y escribir una contraseña válida
     Resultado esperado: Campo usuario vacío
  2. Acción: Presionar 'Iniciar sesión'
     Resultado esperado: El sistema muestra mensaje 'Ingrese su usuario o correo'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-LOG-007 - Restablecimiento de contraseña por correo electrónico
- Resumen: Validar que el sistema permita solicitar un restablecimiento de contraseña
- Precondiciones: Usuario registrado con correo válido
- Pasos:
  1. Acción: Ir a la página de login → Clic en '¿Olvidaste tu contraseña?'
     Resultado esperado: Se muestra formulario de recuperación
  2. Acción: Ingresar correo del usuario
     Resultado esperado: El sistema muestra mensaje 'Se ha enviado un correo con instrucciones'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-LOG-008 - Enlace de restablecimiento expira después de cierto tiempo
- Resumen: Asegurar que el enlace de recuperación tenga una vigencia limitada
- Precondiciones: Usuario con correo de recuperación recibido
- Pasos:
  1. Acción: Esperar que pase el tiempo de expiración configurado (10 minutos)
     Resultado esperado: Tiempo transcurrido
  2. Acción: Intentar abrir el enlace de restablecimiento
     Resultado esperado: El sistema muestra mensaje 'El enlace ha expirado'
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-LOG-009 - Cierre de sesión exitoso
- Resumen: Validar que el usuario pueda cerrar sesión correctamente y que la sesión se invalide
- Precondiciones: Usuario autenticado
- Pasos:
  1. Acción: Clic en el menú de usuario → Seleccionar 'Cerrar sesión'
     Resultado esperado: El sistema redirige a la pantalla de login
  2. Acción: Intentar volver atrás con el navegador
     Resultado esperado: No se accede al sistema
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-LOG-010 - Redirección automática al dashboard después del login
- Resumen: Verificar que tras iniciar sesión correctamente, el usuario sea dirigido al panel principal
- Precondiciones: Usuario activo con credenciales válidas
- Pasos:
  1. Acción: Ingresar credenciales válidas → Iniciar sesión
     Resultado esperado: El sistema redirige al dashboard principal
  2. Acción: Verificar dashboard
     Resultado esperado: El nombre del usuario se muestra en la parte superior derecha
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.


## Base de Datos
*Ámbito*: Persistencia e integridad referencial

### TC-DB-001 - Persistencia de cliente tras alta (verificación básica)
- Resumen: Confirmar que el alta desde UI se persiste
- Precondiciones: Acceso de lectura a BD o endpoint de consulta
- Pasos:
  1. Acción: Crear cliente (ver TC-CLI-001)
     Resultado esperado: Cliente creado en UI
  2. Acción: Consultar BD (SELECT por RFC) o API
     Resultado esperado: Registro existe con campos coincidentes
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-DB-002 - Integridad referencial cliente–póliza
- Resumen: Verificar la integridad referencial entre clientes y pólizas
- Precondiciones: Cliente X existente
- Pasos:
  1. Acción: Crear póliza asociada a X
     Resultado esperado: Póliza creada
  2. Acción: Consultar BD: póliza tiene FK válida a cliente
     Resultado esperado: Integridad mantenida
  3. Acción: (Opcional) Intentar eliminar cliente con póliza
     Resultado esperado: Integridad mantenida (bloqueo o cascada definida)
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-DB-003 - Índices/búsqueda por RFC
- Resumen: Validar que la búsqueda por RFC sea eficiente
- Precondiciones: Base de datos con clientes
- Pasos:
  1. Acción: Ejecutar búsqueda por RFC desde UI
     Resultado esperado: Búsqueda se ejecuta
  2. Acción: Validar tiempo de respuesta aceptable y resultado correcto
     Resultado esperado: Devuelve cliente esperado rápidamente (evidencia de índice/config correcta)
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-DB-004 - Unicidad de RFC en BD (índice UNIQUE)
- Resumen: Verificar que la BD prohíbe RFC duplicado mediante restricción UNIQUE
- Precondiciones: Existe cliente con RFC LORM850101ABC
- Pasos:
  1. Acción: Intentar insertar/guardar un nuevo cliente con el mismo RFC
     Resultado esperado: La BD rechaza la operación (error de UNIQUE) y no crea el registro
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-DB-005 - Campos obligatorios (NOT NULL) bloquean nulos
- Resumen: Asegurar que columnas obligatorias no acepten NULL
- Precondiciones: Definiciones NOT NULL en la tabla clientes
- Pasos:
  1. Acción: Ejecutar INSERT/alta desde UI dejando correo vacío
     Resultado esperado: La BD rechaza (violación NOT NULL) y el sistema muestra error
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-DB-006 - Tipos y longitudes (p. ej., email ≤ 255)
- Resumen: Validar que la BD aplique tipos/longitudes y rechace excedentes
- Precondiciones: Columna correo limitada (VARCHAR(255))
- Pasos:
  1. Acción: Intentar guardar cliente con correo que excede el límite (>255 caracteres)
     Resultado esperado: La BD rechaza por longitud/tipo; el sistema informa el error
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-DB-007 - Transacción y rollback ante fallo de integridad
- Resumen: Asegurar que si falla la creación de póliza por FK inválida, se haga rollback sin dejar basura
- Precondiciones: Transacciones activas en la capa de datos; FK polizas.cliente_id → clientes.id
- Pasos:
  1. Acción: Iniciar operación de alta de póliza con cliente_id inválido
     Resultado esperado: La BD lanza error de FK y la transacción se revierte. No quedan registros huérfanos ni parciales en polizas
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-DB-008 - Restricción CHECK de vigencias (fin ≥ inicio)
- Resumen: Validar que la BD impide guardar vigencias inválidas en pólizas
- Precondiciones: CHECK (fecha_fin >= fecha_inicio) definido en polizas
- Pasos:
  1. Acción: Intentar insertar/guardar póliza con fecha_inicio = 2025-10-05, fecha_fin = 2025-10-04
     Resultado esperado: La BD rechaza por violar CHECK; el sistema muestra error
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-DB-009 - Auditoría: created_at/updated_at correctos
- Resumen: Verificar timestamps de auditoría y actualización en edición
- Precondiciones: Triggers o defaults (now()) en created_at y updated_at
- Pasos:
  1. Acción: Crear cliente → Consultar BD
     Resultado esperado: created_at y updated_at iguales y con zona horaria correcta
  2. Acción: Editar correo del cliente → Consultar BD
     Resultado esperado: updated_at > created_at
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-DB-010 - Eliminación restringida o en cascada (cliente con pólizas)
- Resumen: Comprobar política de integridad al eliminar un cliente con pólizas asociadas
- Precondiciones: FK polizas.cliente_id con acción definida (RESTRICT o CASCADE). Cliente X con al menos una póliza vinculada
- Pasos:
  1. Acción: Intentar eliminar cliente X
     Resultado esperado: Si RESTRICT: la BD bloquea la eliminación. Si CASCADE: elimina cliente y pólizas asociadas de forma consistente
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.


## Diseño (UI/UX)
*Ámbito*: Consistencia visual y responsividad

### TC-UI-001 - Consistencia visual de formulario de cliente
- Resumen: Etiquetas, orden, placeholders y botones según diseño
- Precondiciones: Mockups/guía de estilo aprobados
- Pasos:
  1. Acción: Clientes → Nuevo → Comparar con mockup
     Resultado esperado: Coinciden textos, orden y alineaciones; sin solapes
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-UI-002 - Responsividad en 1366×768 y móvil
- Resumen: Verificar que la UI se adapte correctamente a diferentes resoluciones
- Precondiciones: Sistema accesible
- Pasos:
  1. Acción: Listado de pólizas → Vista 1366×768
     Resultado esperado: UI legible
  2. Acción: Cambiar a viewport móvil (390×844)
     Resultado esperado: UI legible; scroll/filtros utilizables
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-UI-003 - Colores corporativos
- Resumen: Validar uso consistente de la paleta corporativa
- Precondiciones: Guía de estilo definida
- Pasos:
  1. Acción: Recorrer Módulos (Clientes, Pólizas, Reportes)
     Resultado esperado: Paleta corporativa aplicada de forma consistente
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-UI-004 - Validar contraste de colores y legibilidad del texto
- Resumen: Asegurar que el texto tenga suficiente contraste con el fondo según los lineamientos WCAG
- Precondiciones: El sistema está desplegado en entorno de pruebas
- Pasos:
  1. Acción: Abrir la interfaz principal del sistema
     Resultado esperado: Sistema carga correctamente
  2. Acción: Revisar encabezados, botones y texto sobre fondos de color
     Resultado esperado: Todo texto y botón cumple el nivel AA de contraste (mínimo 4.5:1); sin áreas ilegibles
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-UI-005 - Verificar consistencia de tipografía en módulos
- Resumen: Validar que todos los módulos usen la misma fuente, tamaño y estilo tipográfico
- Precondiciones: Guía de estilo aprobada
- Pasos:
  1. Acción: Navegar por módulos Clientes, Pólizas y Reportes
     Resultado esperado: Se usa la tipografía definida; no hay fuentes distintas o tamaños irregulares
  2. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  3. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  4. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
  5. Acción: Registrar evidencia (capturas, logs) y actualizar el resultado del caso en TestLink.
     Resultado esperado: La evidencia queda almacenada y el resultado del caso se documenta correctamente.

### TC-UI-006 - Validar diseño adaptable en pantallas pequeñas (móvil)
- Resumen: Comprobar que la interfaz se adapte correctamente en resoluciones móviles
- Precondiciones: Acceso a navegador con modo responsive
- Pasos:
  1. Acción: Cambiar el viewport a resolución 390x844
     Resultado esperado: Viewport cambiado
  2. Acción: Explorar formularios y menús
     Resultado esperado: No hay solapamientos, los botones siguen siendo accesibles y el contenido se ajusta correctamente
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-UI-007 - Verificar que el logo y nombre de la aplicación se muestren correctamente
- Resumen: Asegurar que el logo y el título del sistema estén visibles en todas las vistas principales
- Precondiciones: Usuario autenticado
- Pasos:
  1. Acción: Iniciar sesión y navegar entre módulos
     Resultado esperado: Logo visible
  2. Acción: Verificar que el logo se mantenga en el encabezado
     Resultado esperado: El logo y el nombre del sistema se muestran siempre sin distorsión ni desplazamiento
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-UI-008 - Verificar alineación y espaciado uniforme en formularios
- Resumen: Asegurar que los campos de formularios estén alineados correctamente
- Precondiciones: Formularios activos en los módulos Clientes y Pólizas
- Pasos:
  1. Acción: Abrir formularios de alta en ambos módulos
     Resultado esperado: Formularios cargados
  2. Acción: Verificar que las etiquetas y campos estén correctamente alineados
     Resultado esperado: Espaciados y márgenes consistentes; sin desalineaciones visuales
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-UI-009 - Validar que los botones tengan estados hover y active
- Resumen: Comprobar que los botones cambien de color o sombra al interactuar con el cursor
- Precondiciones: CSS con estilos definidos para hover/active
- Pasos:
  1. Acción: Colocar el cursor sobre los botones principales (Guardar, Cancelar, Editar)
     Resultado esperado: Observar el cambio de color o sombra
  2. Acción: Verificar cambio visual
     Resultado esperado: Todos los botones muestran un cambio visual claro al interactuar
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-UI-010 - Comprobar que los iconos y elementos visuales cargan correctamente
- Resumen: Validar que todos los íconos del sistema se visualicen correctamente y no falten recursos
- Precondiciones: Sistema cargado completamente
- Pasos:
  1. Acción: Navegar por todas las vistas del sistema
     Resultado esperado: Navegación exitosa
  2. Acción: Verificar que los íconos (editar, eliminar, agregar, etc.) se muestren correctamente
     Resultado esperado: Ningún ícono roto o sin carga; los elementos visuales se renderizan en su posición adecuada
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.


## Pólizas
*Ámbito*: Alta/edición, reglas de vigencia y estados

### TC-POL-001 - Edición de póliza válida
- Resumen: Modificar información de una póliza vigente sin afectar datos críticos
- Precondiciones: Póliza existente en estado 'Vigente'
- Pasos:
  1. Acción: Abrir módulo de pólizas → Listado → Seleccionar póliza
     Resultado esperado: Póliza cargada
  2. Acción: Hacer clic en 'Editar'
     Resultado esperado: Formulario de edición se muestra
  3. Acción: Modificar datos no críticos (ej. teléfono de contacto, correo)
     Resultado esperado: Cambios permitidos
  4. Acción: Guardar cambios
     Resultado esperado: Cambios guardados correctamente; datos críticos permanecen inalterados; póliza sigue 'Vigente'
  5. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.

### TC-POL-005 - Validación de duplicidad de número de póliza
- Resumen: Prevenir creación de póliza con número ya existente
- Precondiciones: Número de póliza AUTO-2025-001 ya registrado
- Pasos:
  1. Acción: Pólizas → Nueva → Capturar datos con número repetido (AUTO-2025-001)
     Resultado esperado: Formulario permite captura
  2. Acción: Guardar
     Resultado esperado: Sistema muestra mensaje de error indicando duplicidad; no se permite guardar
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-POL-006 - Búsqueda de póliza por cliente
- Resumen: Verificar que la búsqueda de pólizas por cliente retorne resultados correctos
- Precondiciones: Cliente María López Ramírez con pólizas registradas
- Pasos:
  1. Acción: Módulo de pólizas → Buscar por cliente
     Resultado esperado: Formulario de búsqueda visible
  2. Acción: Ingresar nombre o ID del cliente (María López Ramírez) → Buscar
     Resultado esperado: Se muestran todas las pólizas asociadas al cliente seleccionado
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-POL-007 - Filtrado por estado de póliza
- Resumen: Comprobar que el filtrado por estado (Vigente, Cancelada, Expirada) funcione correctamente
- Precondiciones: Existencia de pólizas con diferentes estados
- Pasos:
  1. Acción: Abrir módulo de pólizas → Aplicar filtro por estado
     Resultado esperado: Filtro disponible
  2. Acción: Seleccionar 'Vigente' → Aplicar
     Resultado esperado: Solo se muestran pólizas vigentes
  3. Acción: Repetir para 'Cancelada' y 'Expirada'
     Resultado esperado: Solo se muestran pólizas correspondientes al estado seleccionado
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-POL-008 - Generación de documento de póliza
- Resumen: Verificar que se pueda generar documento PDF de una póliza válida
- Precondiciones: Póliza AUTO-2025-001 existente y vigente
- Pasos:
  1. Acción: Abrir detalle de póliza → Generar documento
     Resultado esperado: Opciones de generación disponibles
  2. Acción: Seleccionar formato PDF → Confirmar
     Resultado esperado: Documento PDF generado correctamente con todos los datos de la póliza; descargable o imprimible
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.

### TC-POL-009 - Cambio de vigencia de póliza
- Resumen: Actualizar fechas de vigencia de una póliza válida
- Precondiciones: Póliza vigente; fechas nuevas válidas (inicio < fin)
- Pasos:
  1. Acción: Abrir detalle de póliza → Editar
     Resultado esperado: Formulario de edición visible
  2. Acción: Modificar fechas de vigencia de 01/10/2025–30/09/2026 a 01/11/2025–31/10/2026
     Resultado esperado: Cambios permitidos
  3. Acción: Guardar cambios
     Resultado esperado: Fechas actualizadas correctamente; sistema mantiene estado 'Vigente'
  4. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  5. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.

### TC-POL-010 - Visualización del historial de cambios de póliza
- Resumen: Verificar que el sistema muestre correctamente el historial de modificaciones de una póliza
- Precondiciones: Póliza VIDA-2025-005 con al menos un cambio registrado
- Pasos:
  1. Acción: Abrir detalle de póliza → Historial de cambios
     Resultado esperado: Historial visible
  2. Acción: Revisar fechas, campos modificados y usuario que realizó el cambio
     Resultado esperado: Historial completo y legible; datos reflejan cambios reales realizados
  3. Acción: Validar en la interfaz el mensaje o estado mostrado tras la operación.
     Resultado esperado: El mensaje o estado coincide con el resultado esperado del caso.
  4. Acción: Revisar logs o la base de datos relacionada (si aplica) para confirmar la operación.
     Resultado esperado: Los registros muestran la operación correcta sin errores adicionales.
  5. Acción: Comprobar que no se generaron efectos colaterales en otros registros o módulos.
     Resultado esperado: No se detectan efectos colaterales y los demás registros permanecen intactos.
