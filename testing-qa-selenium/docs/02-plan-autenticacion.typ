#set document(
  title: "Plan de Pruebas - Módulo Autenticación",
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
    Módulo de Autenticación
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

Este documento detalla el plan de pruebas para el módulo de Autenticación del Sistema de Seguros VILLALOBOS, incluyendo casos de prueba específicos, datos de prueba y criterios de aceptación.

== Alcance

El módulo de autenticación comprende:
- Pantalla de login
- Validación de credenciales
- Gestión de sesiones
- Logout
- Redirecciones post-autenticación

== Referencias

- Plan Maestro de Pruebas (00-plan-maestro-pruebas.typ)
- Estrategia de Testing (01-estrategia-testing.typ)
- Especificación funcional del módulo de autenticación

= Descripción del Módulo

== Funcionalidad Principal

El módulo de autenticación permite a los usuarios acceder al sistema mediante credenciales (usuario y contraseña). Gestiona la sesión del usuario durante su interacción con el sistema.

== Componentes

=== Elementos de UI

#table(
  columns: (2fr, 1fr, 3fr),
  align: left,
  table.header(
    [*Elemento*], [*ID/Selector*], [*Descripción*]
  ),
  [Campo Usuario], [`username`], [Input para nombre de usuario],
  [Campo Contraseña], [`password`], [Input tipo password],
  [Botón Ingresar], [`btnLogin`], [Botón para enviar formulario],
  [Mensaje Error], [`.error-message`], [Div para mostrar errores],
  [Logo], [`#logo`], [Imagen del sistema]
)

=== Flujo Normal

#raw(lang: "text", block: true, "
1. Usuario abre aplicación
2. Sistema muestra pantalla de login
3. Usuario ingresa credenciales
4. Usuario hace clic en 'Ingresar'
5. Sistema valida credenciales
6. Sistema crea sesión
7. Sistema redirige a vista principal (/app)
8. Usuario puede navegar por el sistema
")

== Reglas de Negocio

+ Usuario debe existir en la base de datos
+ Contraseña debe coincidir con hash almacenado
+ Usuario debe estar activo (no bloqueado)
+ Sesión se mantiene hasta logout explícito
+ Usuario inactivo por 30 minutos cierra sesión automáticamente

= Estrategia de Pruebas

== Tipos de Prueba

+ *Funcionales*: Validar login exitoso y fallido
+ *Validación*: Verificar campos obligatorios y formatos
+ *Seguridad*: Comprobar que contraseñas no se muestran
+ *Usabilidad*: Mensajes de error claros
+ *Integración*: Redirección correcta post-login

== Herramientas

=== Selenium IDE
- Grabar flujo de login básico
- Demo visual para presentaciones

=== Selenium WebDriver
- Casos de validación
- Pruebas de sesión
- Escenarios negativos

= Casos de Prueba

== TC-AUTH-001: Login Exitoso con Credenciales Válidas

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium IDE + WebDriver

=== Descripción
Verificar que un usuario con credenciales válidas puede iniciar sesión correctamente.

=== Precondiciones
- Base de datos contiene usuario de prueba
- Usuario: `admin`, Contraseña: `admin123`
- Usuario está activo en el sistema

=== Datos de Prueba
```
Usuario: admin
Contraseña: admin123
```

=== Pasos
1. Abrir aplicación
2. Verificar que se muestra pantalla de login
3. Ingresar "admin" en campo de usuario
4. Ingresar "admin123" en campo de contraseña
5. Hacer clic en botón "Ingresar"
6. Esperar redirección

=== Resultado Esperado
- Sistema redirige a `/app` (vista principal)
- Se muestra nombre de usuario en header
- No se muestran mensajes de error
- Sesión queda establecida

=== Criterios de Aceptación
- [ ] Redirección ocurre en menos de 2 segundos
- [ ] URL cambia a `/app`
- [ ] Header muestra "Bienvenido, Admin"
- [ ] Menú de navegación está visible

---

== TC-AUTH-002: Login Fallido - Usuario Incorrecto

*Prioridad:* Alta \
*Tipo:* Funcional - Negativo \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que el sistema rechaza credenciales con usuario inválido.

=== Precondiciones
- Aplicación iniciada en pantalla de login

=== Datos de Prueba
```
Usuario: usuarioInexistente
Contraseña: cualquierPassword123
```

=== Pasos
1. Ingresar "usuarioInexistente" en campo de usuario
2. Ingresar "cualquierPassword123" en campo de contraseña
3. Hacer clic en botón "Ingresar"
4. Observar respuesta del sistema

=== Resultado Esperado
- Sistema muestra mensaje: "Usuario o contraseña incorrectos"
- No se realiza redirección
- Campos se mantienen con valores ingresados (excepto contraseña)
- Campo de contraseña se limpia

=== Criterios de Aceptación
- [ ] Mensaje de error visible en menos de 1 segundo
- [ ] Mensaje tiene clase CSS `.error-message`
- [ ] Usuario permanece en `/login`
- [ ] No se crea sesión

---

== TC-AUTH-003: Login Fallido - Contraseña Incorrecta

*Prioridad:* Alta \
*Tipo:* Funcional - Negativo \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que el sistema rechaza credenciales con contraseña inválida.

=== Precondiciones
- Usuario "admin" existe en base de datos
- Contraseña correcta es "admin123"

=== Datos de Prueba
```
Usuario: admin
Contraseña: passwordIncorrecto
```

=== Pasos
1. Ingresar "admin" en campo de usuario
2. Ingresar "passwordIncorrecto" en campo de contraseña
3. Hacer clic en botón "Ingresar"
4. Observar respuesta del sistema

=== Resultado Esperado
- Sistema muestra mensaje: "Usuario o contraseña incorrectos"
- No se realiza redirección
- Campo de usuario mantiene "admin"
- Campo de contraseña se limpia

=== Criterios de Aceptación
- [ ] Mensaje genérico (no especifica qué es incorrecto)
- [ ] Respuesta en menos de 1 segundo
- [ ] No se crea sesión
- [ ] Evento de intento fallido se registra en logs

---

== TC-AUTH-004: Validación de Campos Vacíos

*Prioridad:* Media \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que el sistema valida campos obligatorios antes de enviar.

=== Precondiciones
- Aplicación en pantalla de login

=== Escenarios

==== 4a: Ambos campos vacíos
*Pasos:*
1. Dejar campo usuario vacío
2. Dejar campo contraseña vacío
3. Hacer clic en "Ingresar"

*Resultado Esperado:*
- Validación HTML5 muestra "Please fill out this field" en campo usuario
- No se envía formulario

==== 4b: Usuario vacío, contraseña llena
*Pasos:*
1. Dejar campo usuario vacío
2. Ingresar "test123" en contraseña
3. Hacer clic en "Ingresar"

*Resultado Esperado:*
- Validación HTML5 en campo usuario
- No se envía formulario

==== 4c: Usuario lleno, contraseña vacía
*Pasos:*
1. Ingresar "admin" en usuario
2. Dejar campo contraseña vacío
3. Hacer clic en "Ingresar"

*Resultado Esperado:*
- Validación HTML5 en campo contraseña
- No se envía formulario

=== Criterios de Aceptación
- [ ] Validación ocurre antes de enviar request
- [ ] Mensajes de validación son claros
- [ ] No se realizan llamadas al backend

---

== TC-AUTH-005: Logout Exitoso

*Prioridad:* Alta \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que un usuario autenticado puede cerrar sesión correctamente.

=== Precondiciones
- Usuario autenticado en el sistema
- Navegando en vista principal `/app`

=== Pasos
1. Verificar que usuario está en `/app`
2. Hacer clic en botón/menú de usuario
3. Seleccionar opción "Cerrar Sesión"
4. Observar comportamiento del sistema

=== Resultado Esperado
- Sistema redirige a `/login`
- Sesión se destruye completamente
- Tokens/cookies se eliminan
- Mensaje "Sesión cerrada correctamente" (opcional)

=== Criterios de Aceptación
- [ ] Redirección inmediata a login
- [ ] LocalStorage/SessionStorage limpio
- [ ] Intentar acceder a `/app` sin login redirige a `/login`
- [ ] No hay datos de sesión en memoria

---

== TC-AUTH-006: Persistencia de Sesión al Recargar

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que la sesión persiste al recargar la página.

=== Precondiciones
- Usuario autenticado exitosamente
- En vista `/app`

=== Pasos
1. Iniciar sesión con credenciales válidas
2. Navegar a vista de clientes o cualquier módulo
3. Presionar F5 o recargar página
4. Observar comportamiento

=== Resultado Esperado
- Usuario permanece autenticado
- No se redirige a login
- Se mantiene en la misma vista
- Datos de sesión intactos

=== Criterios de Aceptación
- [ ] No se solicita login nuevamente
- [ ] Vista se recarga correctamente
- [ ] Nombre de usuario sigue visible
- [ ] Navegación funciona normalmente

---

== TC-AUTH-007: Redirección Post-Login

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que después de login exitoso, el usuario es redirigido a la vista correcta.

=== Precondiciones
- Usuario no autenticado
- Base de datos con usuario de prueba

=== Pasos
1. Abrir aplicación (debe mostrar login)
2. Ingresar credenciales válidas
3. Hacer clic en "Ingresar"
4. Esperar redirección
5. Verificar URL y vista cargada

=== Resultado Esperado
- Usuario redirigido a `/app` (dashboard/vista principal)
- Vista principal carga completamente
- Elementos de navegación visibles

=== Criterios de Aceptación
- [ ] URL es exactamente `/app` o `/dashboard`
- [ ] Título de página cambia apropiadamente
- [ ] Menú lateral está visible
- [ ] Header con nombre de usuario presente

---

== TC-AUTH-008: Validación de Longitud de Contraseña

*Prioridad:* Baja \
*Tipo:* Validación \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar que el sistema valida longitud mínima de contraseña.

=== Precondiciones
- Aplicación en pantalla de login
- Política: contraseña mínimo 6 caracteres

=== Datos de Prueba

#table(
  columns: (2fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Contraseña*], [*Caracteres*], [*Resultado Esperado*]
  ),
  [`12345`], [5], [Rechazada - muy corta],
  [`123456`], [6], [Aceptada (si credenciales válidas)],
  [`a`], [1], [Rechazada - muy corta]
)

=== Pasos (Contraseña corta)
1. Ingresar "admin" en usuario
2. Ingresar "123" en contraseña
3. Hacer clic en "Ingresar"

=== Resultado Esperado
- Sistema muestra: "La contraseña debe tener al menos 6 caracteres"
- No se envía al backend
- Campo contraseña se marca como inválido

=== Criterios de Aceptación
- [ ] Validación en frontend antes de submit
- [ ] Mensaje específico sobre longitud
- [ ] Visual feedback (borde rojo, ícono)

---

== TC-AUTH-009: Seguridad - Contraseña Enmascarada

*Prioridad:* Alta \
*Tipo:* Seguridad \
*Herramienta:* Selenium IDE + WebDriver

=== Descripción
Verificar que el campo de contraseña enmascara caracteres ingresados.

=== Precondiciones
- Aplicación en pantalla de login

=== Pasos
1. Hacer clic en campo de contraseña
2. Escribir "TestPassword123"
3. Observar caracteres mostrados
4. Inspeccionar atributo `type` del input

=== Resultado Esperado
- Caracteres se muestran como puntos/asteriscos
- Atributo `type="password"` presente
- No es posible ver texto plano en UI
- DevTools puede mostrar valor, pero UI no

=== Criterios de Aceptación
- [ ] Input tiene `type="password"`
- [ ] Caracteres no visibles durante escritura
- [ ] No hay opción "mostrar contraseña" (o está desactivada)
- [ ] Copiar/pegar funciona pero no revela contraseña

---

== TC-AUTH-010: Comportamiento con Sesión Expirada

*Prioridad:* Media \
*Tipo:* Funcional \
*Herramienta:* Selenium WebDriver

=== Descripción
Verificar comportamiento cuando la sesión expira por inactividad.

=== Precondiciones
- Usuario autenticado
- Configuración: timeout de sesión = 30 minutos
- *Nota:* Para pruebas, reducir timeout a 2 minutos

=== Pasos
1. Iniciar sesión con credenciales válidas
2. Navegar a cualquier módulo
3. Esperar 31 minutos (o 2 min en ambiente de prueba)
4. Intentar realizar una acción (ej: crear cliente)

=== Resultado Esperado
- Sistema detecta sesión expirada
- Muestra mensaje: "Su sesión ha expirado. Por favor, inicie sesión nuevamente"
- Redirige a `/login`
- No se pierde datos ingresados (se guardan en draft si es posible)

=== Criterios de Aceptación
- [ ] Detección automática de sesión expirada
- [ ] Mensaje claro para el usuario
- [ ] Redirección limpia a login
- [ ] Después de re-login, puede continuar trabajo

---

= Matriz de Trazabilidad

#table(
  columns: (1.5fr, 3fr, 1fr, 1fr),
  align: left,
  table.header(
    [*Caso*], [*Requerimiento*], [*Prioridad*], [*Estado*]
  ),
  [TC-AUTH-001], [RF-001: Login exitoso], [Alta], [Pendiente],
  [TC-AUTH-002], [RF-002: Validar usuario], [Alta], [Pendiente],
  [TC-AUTH-003], [RF-002: Validar contraseña], [Alta], [Pendiente],
  [TC-AUTH-004], [RF-003: Campos obligatorios], [Media], [Pendiente],
  [TC-AUTH-005], [RF-004: Logout], [Alta], [Pendiente],
  [TC-AUTH-006], [RF-005: Persistencia sesión], [Media], [Pendiente],
  [TC-AUTH-007], [RF-006: Redirección], [Media], [Pendiente],
  [TC-AUTH-008], [RF-007: Validar longitud pwd], [Baja], [Pendiente],
  [TC-AUTH-009], [RNF-001: Seguridad contraseña], [Alta], [Pendiente],
  [TC-AUTH-010], [RF-008: Sesión expirada], [Media], [Pendiente]
)

= Datos de Prueba

== Usuarios de Prueba

#table(
  columns: (1.5fr, 1.5fr, 1fr, 2fr),
  align: left,
  table.header(
    [*Usuario*], [*Contraseña*], [*Rol*], [*Propósito*]
  ),
  [`admin`], [`admin123`], [Admin], [Login exitoso, funcionalidad completa],
  [`agente1`], [`agente123`], [Agente], [Login con permisos limitados],
  [`test_user`], [`Test123!`], [Usuario], [Pruebas de usuario normal],
  [`bloqueado`], [`pwd123`], [Usuario], [Probar cuenta bloqueada],
)

== Credenciales Inválidas (Negativas)

- Usuario: `usuarioInexistente`, Contraseña: `cualquiera`
- Usuario: `admin`, Contraseña: `wrongPassword123`
- Usuario: ` ` (vacío), Contraseña: `test`
- Usuario: `admin`, Contraseña: ` ` (vacío)
- Usuario: `admin`, Contraseña: `123` (muy corta)

= Ambiente de Pruebas

== Configuración

- *Base de datos:* SQLite de prueba (copia de producción sanitizada)
- *Aplicación:* Electron en modo desarrollo
- *Puerto:* 3000 (si aplica servidor local)
- *ChromeDriver:* Versión compatible con Electron

== Preparación del Ambiente

1. Crear base de datos limpia
2. Insertar usuarios de prueba
3. Configurar timeout de sesión reducido (para TC-AUTH-010)
4. Limpiar localStorage/sessionStorage
5. Iniciar aplicación Electron

== Limpieza Post-Prueba

- Eliminar datos creados durante pruebas
- Cerrar todas las sesiones activas
- Restaurar configuración original
- Limpiar cookies y storage

= Criterios de Aceptación del Módulo

El módulo de autenticación se considera aceptado cuando:

+ *100% de casos de alta prioridad* pasan exitosamente
+ *≥90% de casos de media prioridad* pasan
+ *No hay defectos críticos* sin resolver
+ *Cobertura de código* ≥ 80% en funciones de autenticación
+ *Tiempo de respuesta* < 2 segundos para login

= Riesgos Específicos

#table(
  columns: (2fr, 2fr, 2fr),
  align: left,
  table.header(
    [*Riesgo*], [*Probabilidad*], [*Mitigación*]
  ),
  [Cambio en lógica de autenticación], [Media], [Mantener Page Objects actualizados],
  [Problemas de timing en redirects], [Alta], [Usar esperas explícitas],
  [Datos de sesión inconsistentes], [Baja], [Limpiar storage antes de cada test],
  [Contraseñas hasheadas diferentes], [Baja], [Usar misma función hash en tests]
)

= Ejecución

== Orden Recomendado

1. TC-AUTH-001 (Login exitoso - base para otros)
2. TC-AUTH-005 (Logout - limpieza)
3. TC-AUTH-002, TC-AUTH-003 (Validaciones negativas)
4. TC-AUTH-004 (Campos vacíos)
5. TC-AUTH-007 (Redirección)
6. TC-AUTH-006 (Persistencia)
7. TC-AUTH-008, TC-AUTH-009 (Validaciones adicionales)
8. TC-AUTH-010 (Sesión expirada - al final por timeout)

== Tiempo Estimado

- *Preparación ambiente:* 15 minutos
- *Ejecución manual (Selenium IDE):* 30 minutos
- *Ejecución automatizada (WebDriver):* 5 minutos
- *Análisis de resultados:* 20 minutos
- *Total:* ~70 minutos por iteración

= Reportes

Cada ejecución debe generar:

+ Reporte HTML con resultados de cada caso
+ Screenshots de casos fallidos
+ Log de ejecución detallado
+ Métricas: tiempo, pass/fail ratio
+ Lista de defectos encontrados

---

*Fin del Plan de Pruebas - Módulo Autenticación*
