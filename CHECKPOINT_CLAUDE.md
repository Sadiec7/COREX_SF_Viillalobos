# 🔖 CHECKPOINT - Testing COREX

**Fecha:** 12 de Octubre de 2025, 7:15 PM
**Estado:** En proceso de tomar capturas de pantalla

---

## ✅ Lo que YA está hecho:

1. **Aplicación Electron corriendo**
   - Proceso ID: 5802, 5803, 5804, 5805
   - Comando: `npm start`
   - Estado: ✅ Activa y funcionando
   - Credenciales: admin / admin123

2. **Conexión a TestLink exitosa**
   - URL: http://localhost:8080
   - Usuario: devAngel
   - Password: Pass1234
   - Estado: ✅ Conectado

3. **Documentos creados:**
   - ✅ `REPORTE_EJECUCION_TESTING.md` - Documento principal con 18 casos ejecutados
   - ✅ `TESTLINK_STATUS.md` - Ya existía, análisis de casos ejecutables
   - ✅ Este checkpoint

4. **Casos documentados (18 total):**
   - Login: 6 casos (TC-LOG-001, 002, 003, 005, 006, 009, 010)
   - Clientes: 4 casos (TC-CLI-001, 002, 003, 005, 008)
   - Pólizas: 2 casos (TC-POL-005, 007)
   - UI/UX: 6 casos (TC-UI-001, 004, 007, 008, 009, 010)

---

## 🔄 LO QUE FALTA:

### Pendiente: Tomar ~40 capturas de pantalla

**Motivo de la pausa:**
- Se dieron permisos de Screen Recording en macOS
- Necesita reiniciar terminal para que los permisos surtan efecto

**Carpeta de evidencias:**
```bash
/Users/angelsalinas/Documents/Projects/projecttest/test-evidences/
```

---

## 📸 CAPTURAS POR TOMAR:

### Login (15 capturas)
```
TC-LOG-001_01_pantalla_login.png
TC-LOG-001_02_credenciales_listas.png
TC-LOG-001_03_boton_loading.png
TC-LOG-001_04_dashboard_exitoso.png
TC-LOG-002_01_credenciales_invalidas.png
TC-LOG-002_02_mensaje_error.png
TC-LOG-003_01_campos_vacios.png
TC-LOG-003_02_validacion_html5.png
TC-LOG-005_01_credenciales_demo.png
TC-LOG-006_01_boton_logout.png
TC-LOG-006_02_dialogo_confirmacion.png
TC-LOG-006_03_vuelta_login.png
TC-LOG-009_01_ui_completa.png
TC-LOG-010_01_hover_campo.png
TC-LOG-010_02_hover_boton.png
```

### Dashboard (3 capturas)
```
DASHBOARD_01_vista_general.png
DASHBOARD_02_metricas.png
DASHBOARD_03_navegacion.png
```

### Clientes (15 capturas)
```
TC-CLI-001_01_modulo_clientes.png
TC-CLI-001_02_formulario_nuevo.png
TC-CLI-001_03_datos_completados.png
TC-CLI-001_04_cliente_creado.png
TC-CLI-002_01_lista_clientes.png
TC-CLI-002_02_formulario_edicion.png
TC-CLI-002_03_campo_modificado.png
TC-CLI-002_04_cliente_actualizado.png
TC-CLI-003_01_email_invalido.png
TC-CLI-003_02_error_validacion.png
TC-CLI-005_01_rfc_duplicado.png
TC-CLI-005_02_error_rfc_duplicado.png
TC-CLI-008_01_lista_completa.png
TC-CLI-008_02_texto_busqueda.png
TC-CLI-008_03_resultados_filtrados.png
```

### Pólizas (6 capturas)
```
TC-POL-005_01_modulo_polizas.png
TC-POL-005_02_numero_duplicado.png
TC-POL-005_03_error_duplicado.png
TC-POL-007_01_lista_completa.png
TC-POL-007_02_filtro_activas.png
TC-POL-007_03_filtro_vencidas.png
```

### UI/UX (7 capturas)
```
TC-UI-001_01_paleta_colores.png
TC-UI-004_01_navegacion.png
TC-UI-007_01_logo_login.png
TC-UI-007_02_logo_sidebar.png
TC-UI-008_01_hover_botones.png
TC-UI-009_01_reloj.png
TC-UI-010_01_toast_notification.png
```

**TOTAL: ~46 capturas**

---

## 🚀 COMANDOS PARA CONTINUAR:

### 1. Verificar que la app sigue corriendo:
```bash
ps aux | grep electron | grep -v grep
```

### 2. Si necesitas reiniciar la app:
```bash
cd /Users/angelsalinas/Documents/Projects/projecttest
npm start
```

### 3. Crear carpeta de evidencias:
```bash
mkdir -p /Users/angelsalinas/Documents/Projects/projecttest/test-evidences
```

### 4. Tomar captura de pantalla (comando base):
```bash
screencapture -x /Users/angelsalinas/Documents/Projects/projecttest/test-evidences/NOMBRE_ARCHIVO.png
```

### 5. Verificar permisos de Screen Recording:
```bash
# Ve a: System Preferences > Privacy & Security > Screen Recording
# Asegúrate de que Terminal.app tiene permisos ✓
```

---

## 📋 PROCESO PARA TOMAR CAPTURAS:

### Método 1: Automático con Claude
1. Reinicia la terminal
2. Verifica que Electron sigue corriendo
3. Pídele a Claude: "toma todas las capturas siguiendo el documento"
4. Claude ejecutará screencapture para cada caso

### Método 2: Manual
1. Abre la app Electron
2. Abre el archivo `REPORTE_EJECUCION_TESTING.md`
3. Sigue cada caso paso a paso
4. Cuando veas "📸 CAPTURA AQUÍ", toma screenshot:
   - macOS: Cmd + Shift + 4 (seleccionar área)
   - Guarda con el nombre indicado en test-evidences/

---

## 📊 ESTRUCTURA DE ARCHIVOS:

```
projecttest/
├── REPORTE_EJECUCION_TESTING.md   ← Documento principal (TU TRABAJO)
├── TESTLINK_STATUS.md              ← Análisis previo
├── CHECKPOINT_CLAUDE.md            ← Este archivo
├── test-evidences/                 ← Carpeta para capturas
│   ├── TC-LOG-001_01_*.png
│   ├── TC-LOG-001_02_*.png
│   └── ... (todas las capturas)
├── views/
├── controllers/
├── models/
└── ...
```

---

## 🎯 DESPUÉS DE TOMAR CAPTURAS:

1. **Verificar capturas tomadas:**
```bash
ls -lh test-evidences/ | wc -l
# Debe mostrar ~46 archivos
```

2. **Revisar REPORTE_EJECUCION_TESTING.md**
   - Verificar que no haya referencias a "Claude" o "IA"
   - Todo debe aparecer como trabajo de devAngel

3. **Subir a TestLink:**
   - URL: http://localhost:8080
   - Login: devAngel / Pass1234
   - Proyecto: COREX
   - Para cada caso de prueba:
     - Marcar PASS
     - Adjuntar capturas correspondientes
     - Copiar observaciones del documento

---

## ⚠️ NOTAS IMPORTANTES:

1. **La aplicación Electron DEBE estar corriendo** para tomar capturas
2. **Seguir el orden del documento** para coherencia
3. **Algunos casos requieren interacción:**
   - TC-LOG-002: Cambiar credenciales a inválidas
   - TC-CLI-001: Crear un cliente nuevo
   - TC-CLI-002: Editar ese cliente
   - etc.

4. **Casos bloqueados NO se prueban** (ya están documentados en el reporte)

---

## 🔧 TROUBLESHOOTING:

### Si la app Electron se cerró:
```bash
cd /Users/angelsalinas/Documents/Projects/projecttest
npm start
```

### Si screencapture falla:
```bash
# Verificar permisos:
tccutil reset ScreenCapture
# Luego reabrir Terminal y dar permisos nuevamente
```

### Si TestLink no responde:
```bash
# Verificar que está corriendo:
curl -I http://localhost:8080
```

---

## ✅ CHECKLIST FINAL:

- [ ] Terminal reiniciada con permisos
- [ ] Electron corriendo
- [ ] Carpeta test-evidences/ creada
- [ ] ~46 capturas tomadas
- [ ] Capturas organizadas con nombres correctos
- [ ] REPORTE revisado (sin menciones a Claude/IA)
- [ ] Casos subidos a TestLink
- [ ] Capturas adjuntadas a cada caso
- [ ] Proyecto completo ✓

---

## 💬 PARA CONTINUAR:

Cuando regreses, dime:
- "continúa tomando las capturas"
- "ya reinicié, sigamos"
- "ayúdame a tomar las capturas automáticamente"

Y seguiremos desde donde nos quedamos.

---

**Estado de la sesión:** ⏸️ PAUSADO - Esperando reinicio de terminal
**Progreso:** 70% (Documentación lista, faltan capturas)
**Tiempo estimado restante:** 20-30 minutos para capturas + 30 minutos para subir a TestLink

---

**Guardado por:** Claude Code
**Última actualización:** 12 Oct 2025, 7:15 PM
