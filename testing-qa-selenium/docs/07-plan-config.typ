#import "template.typ": *

#show: project.with(
  title: "Plan de Pruebas - Configuración",
  authors: (
    "QA Team",
  ),
  date: "Noviembre 24, 2025",
)

= Introducción

Este documento define el plan de pruebas para el módulo de *Configuración*, que permite a los usuarios gestionar su cuenta y seguridad sin salir del sistema.

== Alcance

El plan cubre:
- Actualización de información de cuenta (nombre para mostrar, usuario, email)
- Cambio de contraseña
- Validaciones de formularios
- Persistencia de cambios
- Actualización de UI tras cambios

= Casos de Prueba

== 1. Visualización y Carga Inicial

=== TC-CFG-001: Visualizar página de configuración
*Prioridad:* Alta \
*Descripción:* Verificar que la página de configuración carga correctamente. \
*Precondiciones:* Usuario autenticado en el sistema. \
*Pasos:*
1. Navegar a la vista de Configuración
2. Verificar que se muestran dos secciones: "Cuenta" y "Seguridad"
3. Verificar que cada sección tiene su formulario correspondiente

*Resultado esperado:* La página de configuración se carga mostrando ambas secciones correctamente.

---

=== TC-CFG-002: Cargar datos de cuenta existentes
*Prioridad:* Alta \
*Descripción:* Verificar que los campos de cuenta se pre-llenan con datos actuales. \
*Precondiciones:* Usuario con datos guardados. \
*Pasos:*
1. Navegar a Configuración
2. Verificar que el campo "Nombre para mostrar" contiene un valor
3. Verificar que el campo "Usuario" contiene el username actual
4. Verificar que el campo "Correo" contiene el email (si existe)

*Resultado esperado:* Los campos se pre-llenan con la información actual del usuario.

---

=== TC-CFG-003: Verificar estructura de sección Cuenta
*Prioridad:* Media \
*Descripción:* Confirmar que la sección Cuenta tiene todos los elementos necesarios. \
*Precondiciones:* Estar en vista de Configuración. \
*Pasos:*
1. Observar la sección "Cuenta"
2. Verificar presencia de campos: Nombre para mostrar, Usuario, Correo
3. Verificar botón "Guardar cambios"
4. Verificar textos de ayuda descriptivos

*Resultado esperado:* La sección Cuenta contiene todos los elementos requeridos.

---

=== TC-CFG-004: Verificar estructura de sección Seguridad
*Prioridad:* Media \
*Descripción:* Confirmar que la sección Seguridad tiene todos los elementos necesarios. \
*Precondiciones:* Estar en vista de Configuración. \
*Pasos:*
1. Observar la sección "Seguridad"
2. Verificar presencia de campos: Contraseña actual, Nueva contraseña, Confirmar nueva contraseña
3. Verificar botón "Actualizar contraseña"
4. Verificar texto de ayuda sobre requisitos de contraseña

*Resultado esperado:* La sección Seguridad contiene todos los elementos requeridos.

---

== 2. Actualización de Datos de Cuenta

=== TC-CFG-005: Actualizar nombre para mostrar
*Prioridad:* Alta \
*Descripción:* Cambiar el nombre para mostrar y verificar que se actualiza. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Cambiar el campo "Nombre para mostrar" a "Admin Test"
2. Click en "Guardar cambios"
3. Verificar mensaje de éxito "Datos de cuenta actualizados"
4. Verificar que el nombre en la barra lateral se actualiza a "Admin Test"
5. Verificar que el saludo en el dashboard se actualiza

*Resultado esperado:* El nombre para mostrar se actualiza correctamente en toda la UI.

---

=== TC-CFG-006: Actualizar usuario
*Prioridad:* Alta \
*Descripción:* Cambiar el nombre de usuario. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Cambiar el campo "Usuario" a un nuevo valor único
2. Click en "Guardar cambios"
3. Verificar mensaje de éxito
4. Recargar la página
5. Verificar que el nuevo usuario se mantiene

*Resultado esperado:* El nombre de usuario se actualiza y persiste correctamente.

---

=== TC-CFG-007: Actualizar email
*Prioridad:* Media \
*Descripción:* Actualizar el correo electrónico del usuario. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar o cambiar el campo "Correo" a "admin@test.com"
2. Click en "Guardar cambios"
3. Verificar mensaje de éxito
4. Recargar y verificar que el email se mantiene

*Resultado esperado:* El email se actualiza correctamente.

---

=== TC-CFG-008: Actualizar múltiples campos simultáneamente
*Prioridad:* Alta \
*Descripción:* Cambiar varios campos de cuenta a la vez. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Cambiar "Nombre para mostrar", "Usuario" y "Correo"
2. Click en "Guardar cambios"
3. Verificar que todos los cambios se guardan
4. Verificar mensaje de éxito

*Resultado esperado:* Todos los campos se actualizan correctamente en una sola operación.

---

=== TC-CFG-009: Limpiar email (campo opcional)
*Prioridad:* Media \
*Descripción:* Verificar que se puede dejar el email vacío. \
*Precondiciones:* Usuario con email configurado. \
*Pasos:*
1. Borrar el contenido del campo "Correo"
2. Click en "Guardar cambios"
3. Verificar que se guarda sin error

*Resultado esperado:* El email se puede dejar vacío sin causar errores.

---

=== TC-CFG-010: Validación de usuario obligatorio
*Prioridad:* Alta \
*Descripción:* Intentar guardar sin usuario. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Borrar el campo "Usuario"
2. Click en "Guardar cambios"
3. Verificar mensaje de error "El usuario es obligatorio"

*Resultado esperado:* El sistema no permite guardar sin usuario y muestra validación.

---

=== TC-CFG-011: Validación de formato de email
*Prioridad:* Media \
*Descripción:* Verificar validación de formato de email. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar email inválido "correo-invalido" en campo Correo
2. Intentar guardar
3. Verificar que el navegador muestra validación de formato

*Resultado esperado:* El sistema valida el formato del email usando validación HTML5.

---

=== TC-CFG-012: Límite de caracteres en nombre para mostrar
*Prioridad:* Baja \
*Descripción:* Verificar que el campo tiene límite de 60 caracteres. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Intentar ingresar más de 60 caracteres en "Nombre para mostrar"
2. Verificar que no permite ingresar más del límite

*Resultado esperado:* El campo limita la entrada a 60 caracteres (maxlength).

---

=== TC-CFG-013: Límite de caracteres en usuario
*Prioridad:* Baja \
*Descripción:* Verificar que el campo usuario tiene límite de 50 caracteres. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Intentar ingresar más de 50 caracteres en "Usuario"
2. Verificar que no permite ingresar más del límite

*Resultado esperado:* El campo limita la entrada a 50 caracteres.

---

=== TC-CFG-014: Límite de caracteres en email
*Prioridad:* Baja \
*Descripción:* Verificar que el campo email tiene límite de 100 caracteres. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Intentar ingresar más de 100 caracteres en "Correo"
2. Verificar que no permite ingresar más del límite

*Resultado esperado:* El campo limita la entrada a 100 caracteres.

---

== 3. Cambio de Contraseña

=== TC-CFG-015: Cambiar contraseña correctamente
*Prioridad:* Alta \
*Descripción:* Proceso completo de cambio de contraseña. \
*Precondiciones:* Conocer la contraseña actual. \
*Pasos:*
1. Ingresar contraseña actual en "Contraseña actual"
2. Ingresar nueva contraseña válida (8+ caracteres) en "Nueva contraseña"
3. Repetir nueva contraseña en "Confirmar nueva contraseña"
4. Click en "Actualizar contraseña"
5. Verificar mensaje de éxito "Contraseña actualizada correctamente"
6. Verificar que los campos se limpian después de guardar

*Resultado esperado:* La contraseña se actualiza correctamente y los campos se limpian.

---

=== TC-CFG-016: Validación de campos obligatorios en seguridad
*Prioridad:* Alta \
*Descripción:* Intentar cambiar contraseña sin completar todos los campos. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Dejar uno o más campos de seguridad vacíos
2. Click en "Actualizar contraseña"
3. Verificar mensaje "Completa todos los campos de seguridad"

*Resultado esperado:* El sistema requiere todos los campos de seguridad.

---

=== TC-CFG-017: Validación de longitud mínima de contraseña
*Prioridad:* Alta \
*Descripción:* Intentar usar contraseña menor a 8 caracteres. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar contraseña actual correcta
2. Ingresar nueva contraseña de menos de 8 caracteres (ej: "1234567")
3. Confirmar la misma contraseña corta
4. Click en "Actualizar contraseña"
5. Verificar mensaje "La nueva contraseña debe tener al menos 8 caracteres"

*Resultado esperado:* El sistema rechaza contraseñas menores a 8 caracteres.

---

=== TC-CFG-018: Validación de coincidencia de contraseñas
*Prioridad:* Alta \
*Descripción:* Verificar que las contraseñas nuevas deben coincidir. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar contraseña actual correcta
2. Ingresar nueva contraseña "nuevaPassword123"
3. Ingresar confirmación diferente "otraPassword456"
4. Click en "Actualizar contraseña"
5. Verificar mensaje "Las contraseñas nuevas no coinciden"

*Resultado esperado:* El sistema valida que las contraseñas coincidan.

---

=== TC-CFG-019: Validación de contraseña actual incorrecta
*Prioridad:* Alta \
*Descripción:* Intentar cambiar contraseña con contraseña actual incorrecta. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar contraseña actual INCORRECTA
2. Ingresar nueva contraseña válida y confirmarla
3. Click en "Actualizar contraseña"
4. Verificar mensaje de error indicando que la contraseña actual es incorrecta

*Resultado esperado:* El sistema valida la contraseña actual antes de permitir el cambio.

---

=== TC-CFG-020: Minlength HTML5 en campos de contraseña
*Prioridad:* Baja \
*Descripción:* Verificar que los campos tienen validación minlength. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Intentar ingresar menos de 8 caracteres en "Nueva contraseña"
2. Intentar enviar el formulario
3. Verificar que el navegador muestra validación HTML5

*Resultado esperado:* Los campos tienen minlength="8" que activa validación del navegador.

---

=== TC-CFG-021: Campos de contraseña se limpian tras éxito
*Prioridad:* Media \
*Descripción:* Verificar que los campos de contraseña se vacían tras cambio exitoso. \
*Precondiciones:* Cambio de contraseña exitoso. \
*Pasos:*
1. Realizar cambio de contraseña exitoso
2. Verificar que todos los campos de contraseña se limpian
3. Verificar que quedan vacíos

*Resultado esperado:* Los campos de contraseña se limpian automáticamente tras éxito.

---

== 4. Persistencia y Sincronización

=== TC-CFG-022: Persistencia en localStorage del displayName
*Prioridad:* Media \
*Descripción:* Verificar que el nombre para mostrar se guarda en localStorage. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Cambiar "Nombre para mostrar" a "Test Usuario"
2. Guardar cambios
3. Abrir consola del navegador
4. Ejecutar: localStorage.getItem('dashboardUserSettings')
5. Verificar que contiene displayName: "Test Usuario"

*Resultado esperado:* El displayName se guarda en localStorage correctamente.

---

=== TC-CFG-023: Persistencia en sessionStorage del usuario
*Prioridad:* Media \
*Descripción:* Verificar que los datos de usuario se guardan en sessionStorage. \
*Precondiciones:* Actualización de cuenta exitosa. \
*Pasos:*
1. Cambiar usuario o email
2. Guardar cambios
3. Abrir consola y ejecutar: sessionStorage.getItem('userInfo')
4. Verificar que contiene los datos actualizados

*Resultado esperado:* Los datos del usuario se persisten en sessionStorage.

---

=== TC-CFG-024: Actualización del saludo tras cambio de nombre
*Prioridad:* Alta \
*Descripción:* Verificar que el saludo en dashboard se actualiza. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Cambiar "Nombre para mostrar" a "Juan Pérez"
2. Guardar cambios
3. Navegar al Dashboard
4. Verificar que el saludo muestra "Hola, Juan Pérez" o similar

*Resultado esperado:* El saludo se actualiza inmediatamente con el nuevo nombre.

---

=== TC-CFG-025: Actualización del nombre en sidebar
*Prioridad:* Alta \
*Descripción:* Verificar que el nombre en la barra lateral se actualiza. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Anotar el nombre actual en la barra lateral
2. Cambiar "Nombre para mostrar" a un valor diferente
3. Guardar cambios
4. Verificar que el nombre en la barra lateral se actualiza SIN recargar

*Resultado esperado:* El nombre en sidebar se actualiza en tiempo real.

---

=== TC-CFG-026: Persistencia tras recargar página
*Prioridad:* Alta \
*Descripción:* Verificar que los cambios persisten al recargar. \
*Precondiciones:* Cambios guardados en cuenta. \
*Pasos:*
1. Realizar cambios en cuenta y guardar
2. Recargar la página (F5)
3. Navegar de nuevo a Configuración
4. Verificar que los campos muestran los valores actualizados

*Resultado esperado:* Los cambios persisten correctamente tras recargar.

---

== 5. Estados y Mensajes

=== TC-CFG-027: Mensaje de estado al guardar cuenta
*Prioridad:* Media \
*Descripción:* Verificar que se muestra feedback visual al guardar. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Realizar cambio en cuenta
2. Click en "Guardar cambios"
3. Observar el área de estado (accountStatus)
4. Verificar que primero muestra "Guardando cambios..." (azul)
5. Luego muestra "Datos de cuenta actualizados" (verde)

*Resultado esperado:* Se muestra feedback visual apropiado durante y después del guardado.

---

=== TC-CFG-028: Mensaje de estado al cambiar contraseña
*Prioridad:* Media \
*Descripción:* Verificar feedback visual al cambiar contraseña. \
*Precondiciones:* Formulario de seguridad con datos válidos. \
*Pasos:*
1. Completar formulario de cambio de contraseña
2. Click en "Actualizar contraseña"
3. Observar el área de estado (securityStatus)
4. Verificar que muestra "Actualizando contraseña..." (azul)
5. Luego muestra "Contraseña actualizada correctamente" (verde)

*Resultado esperado:* Se muestra feedback apropiado durante el proceso.

---

=== TC-CFG-029: Mensaje de error en cuenta
*Prioridad:* Media \
*Descripción:* Verificar que los errores se muestran correctamente. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Intentar guardar sin usuario
2. Verificar que el mensaje de error se muestra en rojo
3. Verificar que el texto es claro y descriptivo

*Resultado esperado:* Los mensajes de error se muestran con estilo rojo y texto claro.

---

=== TC-CFG-030: Mensaje de error en seguridad
*Prioridad:* Media \
*Descripción:* Verificar que los errores de seguridad se muestran apropiadamente. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Intentar cambiar contraseña con datos inválidos
2. Verificar que el mensaje de error se muestra en el área correcta
3. Verificar estilo rojo y texto descriptivo

*Resultado esperado:* Los errores de seguridad se muestran claramente.

---

== 6. Casos Especiales

=== TC-CFG-031: Uso de caracteres especiales en nombre
*Prioridad:* Baja \
*Descripción:* Verificar que se aceptan caracteres especiales en nombre. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar "María José Ñ" en "Nombre para mostrar"
2. Guardar cambios
3. Verificar que se guarda correctamente
4. Verificar que se muestra correctamente en UI

*Resultado esperado:* Los caracteres especiales y acentos se manejan correctamente.

---

=== TC-CFG-032: Espacios en nombre de usuario
*Prioridad:* Baja \
*Descripción:* Verificar manejo de espacios en username. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Ingresar " admin " (con espacios) en Usuario
2. Guardar
3. Verificar comportamiento (probablemente se recorta con trim)

*Resultado esperado:* Los espacios se recortan automáticamente con trim().

---

=== TC-CFG-033: Navegación entre secciones
*Prioridad:* Baja \
*Descripción:* Verificar que se puede trabajar con ambas secciones independientemente. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Realizar cambios en Cuenta y guardar
2. Sin recargar, realizar cambio de contraseña
3. Verificar que ambas operaciones funcionan independientemente

*Resultado esperado:* Las dos secciones funcionan de manera independiente.

---

=== TC-CFG-034: Email vacío por defecto
*Prioridad:* Baja \
*Descripción:* Verificar comportamiento cuando el usuario no tiene email. \
*Precondiciones:* Usuario sin email configurado. \
*Pasos:*
1. Navegar a Configuración
2. Verificar que el campo Correo está vacío
3. Verificar que no hay errores

*Resultado esperado:* El sistema maneja correctamente la ausencia de email.

---

=== TC-CFG-035: Texto de ayuda visible
*Prioridad:* Baja \
*Descripción:* Verificar que los textos de ayuda son útiles y visibles. \
*Precondiciones:* Estar en Configuración. \
*Pasos:*
1. Observar texto debajo de "Nombre para mostrar"
2. Verificar: "Se usa en el saludo y la barra lateral"
3. Observar texto en seguridad
4. Verificar: "Usa 8+ caracteres, mezcla mayúsculas, minúsculas y números"

*Resultado esperado:* Los textos de ayuda son claros y orientan al usuario.

---

= Priorización

== Pruebas de Alta Prioridad (P1)
- TC-CFG-001: Visualizar página de configuración
- TC-CFG-002: Cargar datos de cuenta existentes
- TC-CFG-005: Actualizar nombre para mostrar
- TC-CFG-006: Actualizar usuario
- TC-CFG-008: Actualizar múltiples campos simultáneamente
- TC-CFG-010: Validación de usuario obligatorio
- TC-CFG-015: Cambiar contraseña correctamente
- TC-CFG-016: Validación de campos obligatorios en seguridad
- TC-CFG-017: Validación de longitud mínima de contraseña
- TC-CFG-018: Validación de coincidencia de contraseñas
- TC-CFG-019: Validación de contraseña actual incorrecta
- TC-CFG-024: Actualización del saludo tras cambio de nombre
- TC-CFG-025: Actualización del nombre en sidebar
- TC-CFG-026: Persistencia tras recargar página

== Pruebas de Media Prioridad (P2)
- TC-CFG-003: Verificar estructura de sección Cuenta
- TC-CFG-004: Verificar estructura de sección Seguridad
- TC-CFG-007: Actualizar email
- TC-CFG-009: Limpiar email (campo opcional)
- TC-CFG-011: Validación de formato de email
- TC-CFG-021: Campos de contraseña se limpian tras éxito
- TC-CFG-022: Persistencia en localStorage
- TC-CFG-023: Persistencia en sessionStorage
- TC-CFG-027 a TC-CFG-030: Mensajes de estado

== Pruebas de Baja Prioridad (P3)
- TC-CFG-012 a TC-CFG-014: Límites de caracteres
- TC-CFG-020: Minlength HTML5
- TC-CFG-031 a TC-CFG-035: Casos especiales y edge cases

= Resumen

*Total de casos de prueba:* 35

*Distribución por prioridad:*
- Alta (P1): 14 casos
- Media (P2): 12 casos
- Baja (P3): 9 casos

*Cobertura funcional:*
- Visualización y carga inicial: 4 casos
- Actualización de datos de cuenta: 10 casos
- Cambio de contraseña: 7 casos
- Persistencia y sincronización: 5 casos
- Estados y mensajes: 4 casos
- Casos especiales: 5 casos

= Notas de Implementación

1. *Contraseña de prueba:* Se necesitará conocer una contraseña válida para las pruebas de cambio de contraseña

2. *Limpieza de datos:* Los tests pueden modificar el usuario actual - considerar restaurar valores originales o usar un usuario de prueba dedicado

3. *Validación de sessionStorage/localStorage:* Algunos tests requieren inspeccionar el almacenamiento del navegador

4. *Sincronización de UI:* Los tests TC-CFG-024 y TC-CFG-025 verifican actualización en tiempo real - importante verificar sin recargar

5. *Independencia de tests:* Los cambios en configuración son persistentes - cada test debe considerar el estado previo o restaurar valores

6. *Validación HTML5:* Algunos tests dependen de validación nativa del navegador (email, minlength) - el comportamiento exacto puede variar
