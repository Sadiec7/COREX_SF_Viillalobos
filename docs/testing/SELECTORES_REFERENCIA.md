# 📋 Referencia de Selectores para Automatización

## 🔐 LOGIN (login_view.html)

### Campos de entrada:
- **Usuario**: `#userInput`
- **Contraseña**: `#passInput`

### Botones:
- **Botón Login**: `button[type="submit"]` o `#loginButton`
- **Texto del botón**: `#buttonText`
- **Loader del botón**: `#buttonLoader`

### Mensajes:
- **Error**: `#errorMessage` (container), `#errorText` (texto)
- **Success**: `#successMessage` (container), `#successText` (texto)

### Otros:
- **Checkbox Remember**: `#remember`
- **Form**: `#loginForm`

---

## 📊 DASHBOARD (dashboard_view.html)

### Navegación Sidebar:
- **Sidebar completa**: `.sidebar`
- **Dashboard**: `a:has-text("Dashboard")`
- **Clientes**: `a[href="clientes_view.html"]`
- **Pólizas**: `a[href="polizas_view.html"]`
- **Reportes**: Link con `onclick="showComingSoon('Reportes')"`
- **Configuración**: Link con `onclick="showComingSoon('Configuración')"`

### Botones:
- **Logout**: `#logoutButton`

### Elementos de UI:
- **Usuario**: `#userName` (sidebar), `#welcomeUser` (header)
- **Fecha**: `#currentDate`
- **Hora**: `#currentTime`

### Métricas:
- **Total Pólizas**: `#metricTotalPolizas`
- **Vencen Semana**: `#metricVencenSemana`
- **Cobros Pendientes**: `#metricCobrosPendientes`
- **Nuevos Clientes**: `#metricNuevosClientes`

---

## 👥 CLIENTES (clientes_view.html)

### Navegación:
- **Botón Regresar**: `#btnBack`

### Búsqueda y Acciones:
- **Campo de búsqueda**: `#searchInput`
- **Botón Nuevo Cliente**: `#btnAddCliente`

### Estadísticas:
- **Total**: `#statTotal`
- **Físicas**: `#statFisicas`
- **Morales**: `#statMorales`

### Tabla:
- **Tbody**: `#clientesTableBody`
- **Empty State**: `#emptyState`
- **Loading State**: `#loadingState`

### Modal (Formulario):
- **Modal Container**: `#modalCliente`
- **Modal Title**: `#modalTitle`
- **Form**: `#formCliente`

### Campos del Formulario:
- **Tipo Persona**: `input[name="tipo_persona"]` (radio buttons)
- **Nombre**: `#inputNombre`
- **RFC**: `#inputRFC`
- **Email**: `#inputEmail`
- **Teléfono**: `#inputTelefono`
- **Celular**: `#inputCelular`
- **Dirección**: `#inputDireccion`
- **Notas**: `#inputNotas`

### Botones del Modal:
- **Cerrar Modal**: `#btnCloseModal`
- **Cancelar**: `#btnCancelForm`
- **Submit Form**: `button[type="submit"]` dentro de `#formCliente`

---

## 📄 PÓLIZAS (polizas_view.html)

### Navegación:
- **Botón Regresar**: `#btnBack`

### Filtros:
- **Estado**: `#filterEstado`
- **Aseguradora**: `#filterAseguradora`
- **Ramo**: `#filterRamo`
- **Botón Nueva Póliza**: `#btnAddPoliza`

### Estadísticas:
- **Total**: `#statTotal`
- **Vigentes**: `#statVigentes`
- **Por Vencer**: `#statPorVencer`
- **Vencidas**: `#statVencidas`

### Tabla:
- **Tbody**: `#polizasTableBody`
- **Empty State**: `#emptyState`
- **Loading State**: `#loadingState`

### Modal (Formulario):
- **Modal Container**: `#modalPoliza`
- **Modal Title**: `#modalTitle`
- **Form**: `#formPoliza`

### Campos del Formulario:
- **Número**: `#inputNumero`
- **Cliente**: `#inputCliente` (select)
- **Aseguradora**: `#inputAseguradora` (select)
- **Ramo**: `#inputRamo` (select)
- **Fecha Inicio**: `#inputFechaInicio`
- **Fecha Fin**: `#inputFechaFin`
- **Prima**: `#inputPrima`
- **Comisión**: `#inputComision`
- **Periodicidad**: `#inputPeriodicidad`
- **Método Pago**: `#inputMetodoPago`
- **Suma Asegurada**: `#inputSumaAsegurada`
- **Notas**: `#inputNotas`

### Botones del Modal:
- **Cerrar Modal**: `#btnCloseModal`
- **Cancelar**: `#btnCancelForm`
- **Submit Form**: `button[type="submit"]` dentro de `#formPoliza`

---

## 🎯 ESTRATEGIA DE ESPERA

### Tiempos recomendados:
- **Después de click en login**: 2000ms (esperar transición al dashboard)
- **Después de logout**: 1500ms (esperar vuelta al login)
- **Después de abrir modal**: 500ms (animación de apertura)
- **Después de crear/editar**: 1000ms (esperar mensaje y actualización de tabla)
- **Después de hover**: 300ms (permitir que la animación CSS se complete)
- **Carga inicial de página**: 1000ms (esperar animaciones fade-in)

### Selectores de espera:
- **Login → Dashboard**: Esperar por `.sidebar` o `#logoutButton`
- **Dashboard → Login**: Esperar por `#userInput`
- **Abrir modal**: Esperar por `#modalCliente.active` o `#modalPoliza.active`
- **Tabla con datos**: Esperar por `#clientesTableBody tr` o `#polizasTableBody tr`

---

## 🚨 MANEJO DE DIÁLOGOS NATIVOS

Para diálogos nativos de confirmación (como el logout):
```javascript
window.on('dialog', dialog => dialog.accept());
```

---

## 📸 NOMBRES DE CAPTURAS (Referencia rápida)

### Login (15):
- TC-LOG-001_01_pantalla_login.png
- TC-LOG-001_02_credenciales_listas.png
- TC-LOG-001_03_boton_loading.png (opcional, difícil de capturar)
- TC-LOG-001_04_dashboard_exitoso.png
- TC-LOG-002_01_credenciales_invalidas.png
- TC-LOG-002_02_mensaje_error.png
- TC-LOG-003_01_campos_vacios.png
- TC-LOG-003_02_validacion_html5.png
- TC-LOG-005_01_credenciales_demo.png
- TC-LOG-006_01_boton_logout.png
- TC-LOG-006_02_dialogo_confirmacion.png
- TC-LOG-006_03_vuelta_login.png
- TC-LOG-009_01_ui_completa.png
- TC-LOG-010_01_hover_campo.png
- TC-LOG-010_02_hover_boton.png

### Dashboard (3):
- DASHBOARD_01_vista_general.png
- DASHBOARD_02_metricas.png
- DASHBOARD_03_navegacion.png

### Clientes (15):
- TC-CLI-001_01_modulo_clientes.png
- TC-CLI-001_02_formulario_nuevo.png
- TC-CLI-001_03_datos_completados.png
- TC-CLI-001_04_cliente_creado.png
- TC-CLI-002_01_lista_clientes.png
- TC-CLI-002_02_formulario_edicion.png
- TC-CLI-002_03_campo_modificado.png
- TC-CLI-002_04_cliente_actualizado.png
- TC-CLI-003_01_email_invalido.png
- TC-CLI-003_02_error_validacion.png
- TC-CLI-005_01_rfc_duplicado.png
- TC-CLI-005_02_error_rfc_duplicado.png
- TC-CLI-008_01_lista_completa.png
- TC-CLI-008_02_texto_busqueda.png
- TC-CLI-008_03_resultados_filtrados.png

### Pólizas (6):
- TC-POL-005_01_modulo_polizas.png
- TC-POL-005_02_numero_duplicado.png
- TC-POL-005_03_error_duplicado.png
- TC-POL-007_01_lista_completa.png
- TC-POL-007_02_filtro_activas.png
- TC-POL-007_03_filtro_vencidas.png

### UI/UX (7):
- TC-UI-001_01_paleta_colores.png
- TC-UI-004_01_navegacion.png
- TC-UI-007_01_logo_login.png
- TC-UI-007_02_logo_sidebar.png
- TC-UI-008_01_hover_botones.png
- TC-UI-009_01_reloj.png
- TC-UI-010_01_toast_notification.png

**TOTAL: ~46 capturas**
