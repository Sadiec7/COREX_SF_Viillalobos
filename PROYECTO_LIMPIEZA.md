# Reporte de Limpieza del Proyecto
## Sistema de Seguros VILLALOBOS

**Fecha:** 22 de Noviembre de 2025
**Análisis realizado por:** Claude Code
**Branch:** electron-mvc-production

---

## 📋 Resumen Ejecutivo

Se identificaron **múltiples archivos redundantes, obsoletos y temporales** que pueden ser eliminados para reducir el tamaño del repositorio y mejorar la mantenibilidad del proyecto.

**Tamaño actual de documentación:**
- `/Documentacion/`: ~40MB
- `/docs/`: ~216KB

**Total de archivos a eliminar:** 23 archivos (~500KB+ sin contar bases de datos)

---

## 🔴 CRÍTICO - Archivos Obsoletos para Eliminar

### 1. Modelos de Usuario Duplicados

**Archivos a ELIMINAR:**

```bash
# SOLO SE USA: user_model_sqljs.js
# Los siguientes 3 archivos SON OBSOLETOS:

models/user_model.js              # Versión vieja similar a sqljs
models/user_model_v2.js           # Versión experimental no usada
models/user_model_mock.js         # Mock para desarrollo, ya no se usa
```

**Análisis:**
- `main.js:33` importa ÚNICAMENTE `user_model_sqljs.js`
- Los otros 3 archivos son versiones antiguas/alternativas que NO se utilizan
- **Riesgo de eliminación:** BAJO (no están en uso)
- **Espacio ahorrado:** ~25KB

**Recomendación:** ✅ **ELIMINAR SEGURO**

---

### 2. Archivos Temporales de Compilación LaTeX

**Archivos a ELIMINAR:**

```bash
# Archivos generados por compilación de LaTeX (NO deberían estar en git)

Documentacion/reporte_pruebas_automatizadas.aux
Documentacion/reporte_pruebas_automatizadas.log
Documentacion/reporte_pruebas_automatizadas.out
Documentacion/reporte_pruebas_automatizadas.toc
Documentacion/estimacion_cocomo.aux
Documentacion/estimacion_cocomo.log
estimacion_cocomo.aux                              # Duplicado en raíz
estimacion_cocomo.log                              # Duplicado en raíz
```

**Análisis:**
- Archivos generados automáticamente al compilar `.tex` → `.pdf`
- Se pueden regenerar en cualquier momento
- NO deberían estar en control de versiones
- **Riesgo de eliminación:** NULO
- **Espacio ahorrado:** ~80KB

**Recomendación:** ✅ **ELIMINAR SEGURO** + Agregar a `.gitignore`

---

### 3. Archivos .DS_Store de macOS

**Archivos a ELIMINAR:**

```bash
# Archivos de sistema de macOS (NO deberían estar en git)

./.DS_Store
./Documentacion/.DS_Store
./testing/automatizado/evidencias/test-evidences/.DS_Store
./testing/automatizado/evidencias/test-evidences/Polizas/.DS_Store
./testing/automatizado/evidencias/test-evidences/Login/.DS_Store
```

**Análisis:**
- Archivos de metadatos de macOS Finder
- Inútiles en el repositorio
- **Riesgo de eliminación:** NULO
- **Espacio ahorrado:** ~50KB

**Recomendación:** ✅ **ELIMINAR SEGURO** + Agregar a `.gitignore`

---

### 4. Bases de Datos Antiguas

**Archivo a ELIMINAR:**

```bash
gestor_db.sqlite                   # Base de datos vieja (antes de sql.js)
```

**Análisis:**
- El proyecto usa ÚNICAMENTE `gestor_polizas_v2.sqlite`
- `gestor_db.sqlite` es una versión antigua (pre-migración a sql.js)
- **Riesgo de eliminación:** MEDIO (verificar que no contenga datos únicos)
- **Espacio ahorrado:** Depende del tamaño (~50-200KB estimado)

**Recomendación:** ⚠️ **VERIFICAR PRIMERO** - Hacer backup antes de eliminar

---

## 🟡 MEDIO - Archivos Potencialmente Redundantes

### 5. Vistas HTML de Backup

**Ubicación:** `views/backup_views_completas/`

```
backup_views_completas/
├── catalogos_view.html       (10KB)
├── clientes_view.html        (24KB)
├── dashboard_view.html       (19KB)
├── documentos_view.html      (13KB)
├── polizas_view.html         (27KB)
└── recibos_view.html         (16KB)
```

**Total:** ~109KB en 6 archivos

**Análisis:**
- Son las vistas completas antiguas (antes de refactorizar a SPA)
- Se movieron a backup en el último commit
- Útiles como referencia por ahora, pero eventualmente innecesarias
- **Riesgo de eliminación:** BAJO (útiles como backup temporal)
- **Espacio ahorrado:** ~109KB

**Recomendación:** ⏳ **MANTENER POR AHORA** - Eliminar en 1-2 meses si no se usan

---

### 6. Documentación Duplicada: testlink-setup.md

**Archivos:**

```bash
Documentacion/testlink-setup.md        # Versión en Documentacion/
docs/testing/TESTLINK_STATUS.md        # Posible info relacionada en docs/
```

**Análisis:**
- Puede haber información redundante sobre TestLink
- Necesita revisión manual para identificar duplicación exacta
- **Riesgo de eliminación:** MEDIO (requiere consolidación)

**Recomendación:** ⏳ **REVISAR MANUALMENTE** - Consolidar en un solo archivo

---

## 🟢 BAJO - Documentación a Reorganizar (NO eliminar)

### 7. Estructura de Documentación

**Observación:** Hay 2 carpetas de documentación:

- `/Documentacion/` - 40MB (incluye PDFs generados, investigación académica)
- `/docs/` - 216KB (documentación bien organizada por categorías)

**Contenido de /Documentacion/ a REVISAR:**

```
Documentacion/
├── investigacion/                    # Documentos académicos
│   ├── PracticasMateriales.pdf       # ¿Es necesario en el repo?
│   ├── estandares_calidad_software.pdf
│   └── estandares_calidad_software.typ
├── corex_testcases.*                 # 3 formatos del mismo contenido
├── estimacion_cocomo.*               # .tex + .pdf
├── reporte_pruebas_automatizadas.*   # .tex + .pdf
└── RESUMEN_PROGRESO.*                # .typ + .pdf
```

**Análisis:**
- Muchos archivos tienen tanto el source (.tex, .typ) como el compilado (.pdf)
- Los PDFs académicos de `investigacion/` pueden no ser necesarios en el repo
- **Riesgo de eliminación:** MEDIO (depende del propósito del proyecto)

**Recomendación:**
- ✅ **MANTENER archivos source (.tex, .typ)**
- ⚠️ **CONSIDERAR eliminar PDFs generados** (pueden regenerarse)
- ⚠️ **CONSIDERAR mover PDFs académicos** a un Google Drive / Carpeta externa

---

## 📝 Archivos Recomendados para .gitignore

Agregar estas líneas a `.gitignore`:

```gitignore
# Archivos de sistema macOS
.DS_Store
**/.DS_Store

# Archivos temporales de LaTeX
*.aux
*.log
*.out
*.toc
*.synctex.gz
*.fdb_latexmk
*.fls

# Bases de datos SQLite (excepto la principal)
gestor_db.sqlite
*.sqlite-journal
*.sqlite-shm
*.sqlite-wal

# Node modules (ya debería estar)
node_modules/

# Build outputs (ya debería estar)
dist/
```

---

## 🎯 Plan de Acción Recomendado

### Fase 1: Limpieza Segura (AHORA)

```bash
# 1. Eliminar modelos de usuario obsoletos
rm models/user_model.js
rm models/user_model_v2.js
rm models/user_model_mock.js

# 2. Eliminar archivos temporales de LaTeX
rm Documentacion/*.aux Documentacion/*.log Documentacion/*.out Documentacion/*.toc
rm estimacion_cocomo.aux estimacion_cocomo.log

# 3. Eliminar .DS_Store
find . -name ".DS_Store" -delete

# 4. Actualizar .gitignore
cat >> .gitignore << 'EOF'

# Archivos de sistema macOS
.DS_Store

# Archivos temporales de LaTeX
*.aux
*.log
*.out
*.toc
*.synctex.gz
EOF

# 5. Commit y push
git add -A
git commit -m "chore: Remove obsolete files and add gitignore rules

- Remove unused user model files (user_model.js, user_model_v2.js, user_model_mock.js)
- Remove LaTeX compilation artifacts (.aux, .log, .out, .toc)
- Remove macOS system files (.DS_Store)
- Update .gitignore to prevent future commits of temporary files"

git push origin electron-mvc-production
```

**Ganancia estimada:** ~180KB + Repositorio más limpio

---

### Fase 2: Verificación de Base de Datos (ANTES DE ELIMINAR)

```bash
# 1. Verificar cuál base de datos se usa actualmente
grep -r "gestor_db.sqlite" .
grep -r "gestor_polizas_v2.sqlite" .

# 2. Hacer backup de gestor_db.sqlite
cp gestor_db.sqlite gestor_db.sqlite.backup

# 3. Si NO se usa, eliminarla
rm gestor_db.sqlite

# 4. Agregar a .gitignore
echo "gestor_db.sqlite" >> .gitignore
```

---

### Fase 3: Consolidación de Documentación (EN 1-2 SEMANAS)

1. ✅ Revisar si `testlink-setup.md` está duplicado
2. ✅ Decidir si mantener PDFs generados o solo sources
3. ✅ Mover documentos académicos a almacenamiento externo si no son críticos
4. ✅ Eliminar `backup_views_completas/` si ya no son necesarias

---

## 📊 Impacto Estimado

| Acción | Archivos | Espacio Ahorrado | Riesgo |
|--------|----------|------------------|--------|
| Eliminar user models obsoletos | 3 | ~25KB | BAJO ✅ |
| Eliminar archivos LaTeX temp | 8 | ~80KB | NULO ✅ |
| Eliminar .DS_Store | 5 | ~50KB | NULO ✅ |
| Eliminar gestor_db.sqlite | 1 | ~50-200KB | MEDIO ⚠️ |
| Eliminar backup views (futuro) | 6 | ~109KB | BAJO ⏳ |
| **TOTAL INMEDIATO** | **16** | **~155KB** | **BAJO** |
| **TOTAL EVENTUAL** | **22+** | **~300KB+** | **BAJO** |

---

## ⚠️ Advertencias Importantes

### ❌ NO ELIMINAR:

- `testing/archivos_historicos/` - Útil como referencia histórica
- `migration/` - Crítico para inicialización de BD
- `docs/` - Documentación organizada y actualizada
- `Documentacion/OPTIMIZACION_RENDIMIENTO.md` - Documento crítico reciente
- `REFACTORING_SUMMARY.md` - Documento crítico reciente

### ✅ SEGURO ELIMINAR:

- Archivos .aux, .log, .out, .toc de LaTeX
- Archivos .DS_Store
- Modelos de usuario no utilizados (user_model.js, user_model_v2.js, user_model_mock.js)

### ⚠️ VERIFICAR ANTES DE ELIMINAR:

- `gestor_db.sqlite` - Asegurar que no contiene datos únicos
- PDFs generados de documentación (.pdf cuando existe .tex/.typ)

---

## 🏁 Conclusión

El proyecto está **en buen estado** en general, pero hay archivos de desarrollo y compilación que pueden ser removidos sin riesgo. La limpieza propuesta es **conservadora** y prioriza la seguridad sobre el ahorro de espacio.

**Recomendación final:** Ejecutar la **Fase 1** inmediatamente (~180KB de ganancia segura) y planificar las Fases 2 y 3 según necesidad.

---

**Generado por:** Claude Code
**Fecha:** 2025-11-22
**Versión del proyecto:** electron-mvc-production @ bf5b2e2
