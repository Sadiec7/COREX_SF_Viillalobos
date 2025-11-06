# Guía de Generación de Instaladores

Esta guía explica cómo generar instaladores para Windows y macOS usando Electron Builder.

## Requisitos Previos

### Software Necesario
- **Node.js** v16 o superior
- **npm** actualizado
- **Electron Builder** (ya instalado en el proyecto)

### Para Windows
- Cualquier sistema operativo (Windows, macOS, Linux)
- No se requiere Windows para generar instaladores de Windows

### Para macOS
- **macOS** (requisito obligatorio de Apple)
- Certificado de desarrollador de Apple (opcional, para firmar la app)

## Configuración de Iconos

### Ubicación de los Iconos
Los iconos están en la carpeta `build/`:
```
build/
├── icon.ico        # Icono para Windows (256x256)
├── icon.icns       # Icono para macOS (múltiples resoluciones)
├── icon-256.png    # Icono base PNG
└── logo-256.png    # Logo redimensionado
```

### Generar Iconos Nuevos

#### Desde PNG a ICO (Windows)
```bash
# Instalar dependencias
npm install --save-dev to-ico

# Crear script de conversión
node -e "
const toIco = require('to-ico');
const fs = require('fs');
const buffer = fs.readFileSync('assets/images/logo.png');
toIco([buffer]).then(ico => {
  fs.writeFileSync('build/icon.ico', ico);
  console.log('✅ icon.ico creado');
});
"
```

#### Desde PNG a ICNS (macOS)
```bash
# Crear iconset con múltiples tamaños
mkdir -p build/icon.iconset
sips -z 16 16 assets/images/logo.png --out build/icon.iconset/icon_16x16.png
sips -z 32 32 assets/images/logo.png --out build/icon.iconset/icon_16x16@2x.png
sips -z 32 32 assets/images/logo.png --out build/icon.iconset/icon_32x32.png
sips -z 64 64 assets/images/logo.png --out build/icon.iconset/icon_32x32@2x.png
sips -z 128 128 assets/images/logo.png --out build/icon.iconset/icon_128x128.png
sips -z 256 256 assets/images/logo.png --out build/icon.iconset/icon_128x128@2x.png
sips -z 256 256 assets/images/logo.png --out build/icon.iconset/icon_256x256.png
sips -z 512 512 assets/images/logo.png --out build/icon.iconset/icon_256x256@2x.png
sips -z 512 512 assets/images/logo.png --out build/icon.iconset/icon_512x512.png
sips -z 1024 1024 assets/images/logo.png --out build/icon.iconset/icon_512x512@2x.png

# Convertir a ICNS
iconutil -c icns build/icon.iconset -o build/icon.icns
```

## Configuración en package.json

La configuración de Electron Builder está en `package.json`:

```json
{
  "build": {
    "appId": "com.seguros.villalobos",
    "productName": "Sistema de Seguros VILLALOBOS",
    "directories": {
      "output": "dist",
      "buildResources": "build"
    },
    "files": [
      "**/*",
      "!**/{.git,node_modules/*/{CHANGELOG.md,README.md},testing,dist}/*"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "build/icon.icns",
      "category": "public.app-category.business"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "allowElevation": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Sistema de Seguros VILLALOBOS",
      "installerIcon": "build/icon.ico",
      "uninstallerIcon": "build/icon.ico",
      "installerHeaderIcon": "build/icon.ico",
      "deleteAppDataOnUninstall": false
    }
  }
}
```

## Generar Instaladores

### Windows (NSIS)

#### Comando
```bash
npm run dist:win
```

#### Proceso
1. Instala dependencias nativas para x64 e ia32
2. Descarga Electron para Windows (126 MB, primera vez)
3. Empaqueta la aplicación para ambas arquitecturas
4. Crea el instalador NSIS

#### Tiempo estimado
- Primera vez: 3-5 minutos (descarga Electron)
- Posteriores: 1-2 minutos

#### Archivos generados
```
dist/
├── Sistema de Seguros VILLALOBOS Setup 1.0.0.exe  (~175 MB)
├── Sistema de Seguros VILLALOBOS Setup 1.0.0.exe.blockmap
├── latest.yml
├── win-unpacked/          (app desempaquetada x64)
└── win-ia32-unpacked/     (app desempaquetada x86)
```

#### Características del instalador
- ✅ Instalador con interfaz gráfica
- ✅ Selección de directorio de instalación
- ✅ Atajo en escritorio
- ✅ Atajo en menú de inicio
- ✅ Desinstalador incluido
- ✅ Soporte para x64 y x86 (32-bit)

### macOS (DMG)

#### Comando
```bash
npm run dist:mac
```

**⚠️ IMPORTANTE**: Solo se puede ejecutar desde macOS

#### Proceso
1. Instala dependencias nativas
2. Descarga Electron para macOS
3. Empaqueta la aplicación
4. Crea el archivo DMG

#### Tiempo estimado
- Primera vez: 2-4 minutos
- Posteriores: 1-2 minutos

#### Archivos generados
```
dist/
├── Sistema de Seguros VILLALOBOS-1.0.0.dmg
├── Sistema de Seguros VILLALOBOS-1.0.0-mac.zip
└── mac/                   (app desempaquetada)
```

#### Características del instalador
- ✅ Instalación por drag & drop
- ✅ Icono personalizado
- ✅ Ventana de instalación con branding
- ⚠️ Sin firmar (requiere certificado de Apple)

### Ambas Plataformas

#### Comando
```bash
npm run dist:all
```

**⚠️ IMPORTANTE**: Solo funciona completamente desde macOS

Desde otros sistemas, solo generará el instalador de Windows.

## Firmar Aplicaciones

### Windows (Opcional)

Para firmar el ejecutable de Windows necesitas:

1. **Certificado de Code Signing**
   - Obtener de una autoridad certificadora (CA)
   - Formatos: `.pfx` o `.p12`

2. **Configurar en package.json**
```json
{
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password",
    "signingHashAlgorithms": ["sha256"]
  }
}
```

3. **Variables de ambiente**
```bash
# Alternativa: usar variables de entorno
export CSC_LINK=/path/to/cert.pfx
export CSC_KEY_PASSWORD=your_password
npm run dist:win
```

### macOS (Recomendado)

Para firmar y notarizar en macOS:

1. **Certificado de Apple Developer**
   - Inscribirse en Apple Developer Program ($99/año)
   - Descargar certificado desde Xcode

2. **Configurar en package.json**
```json
{
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  },
  "afterSign": "scripts/notarize.js"
}
```

3. **Notarizar**
Crear `scripts/notarize.js`:
```javascript
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') return;

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.seguros.villalobos',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
```

## Distribución

### Windows

#### Subir a servidor web
```bash
# El instalador es autocontenido
scp "dist/Sistema de Seguros VILLALOBOS Setup 1.0.0.exe" \
    user@server:/downloads/
```

#### Microsoft Store (opcional)
- Requiere conversión a AppX
- Configurar `appx` en targets de electron-builder

### macOS

#### Subir a servidor web
```bash
scp "dist/Sistema de Seguros VILLALOBOS-1.0.0.dmg" \
    user@server:/downloads/
```

#### Mac App Store (opcional)
- Requiere certificado "Mac App Distribution"
- Configurar `mas` en targets de electron-builder

## Auto-actualizaciones

### Configurar electron-updater

1. **Instalar dependencia**
```bash
npm install electron-updater
```

2. **Configurar en main.js**
```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  // Verificar actualizaciones al iniciar
  autoUpdater.checkForUpdatesAndNotify();
});
```

3. **Publicar en GitHub Releases**
```bash
# Configurar en package.json
{
  "publish": {
    "provider": "github",
    "owner": "your-org",
    "repo": "your-repo"
  }
}

# Build y publicar
GH_TOKEN=your_github_token npm run dist
```

## Solución de Problemas

### Error: "Invalid icon file"
**Problema**: NSIS no acepta archivos PNG

**Solución**:
```bash
# Convertir PNG a ICO
node create-ico.js
# O manualmente usar herramientas online
```

### Error: "Cannot build for macOS"
**Problema**: Intentando compilar para macOS desde Windows/Linux

**Solución**:
- Solo se puede compilar para macOS desde macOS
- Usar un servicio CI/CD con macOS (GitHub Actions, CircleCI)
- Usar una máquina virtual macOS

### Instalador muy grande
**Problema**: El instalador pesa más de 150 MB

**Explicación**:
- Electron incluye Chromium completo (~120 MB)
- Es normal para aplicaciones Electron
- Incluye todo lo necesario (no requiere instalaciones adicionales)

**Optimización**:
```json
{
  "build": {
    "compression": "maximum",
    "asar": true
  }
}
```

### Falla al descargar Electron
**Problema**: Error de red al descargar dependencias

**Solución**:
```bash
# Usar mirror de Electron
export ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/
npm run dist:win
```

## Buenas Prácticas

### Antes de generar instaladores

1. **Probar la aplicación**
```bash
npm start
npm run test:db
npm run test:ui
```

2. **Incrementar versión**
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

3. **Limpiar caché**
```bash
rm -rf dist/
rm -rf node_modules/.cache
```

### Después de generar instaladores

1. **Probar instalador en máquina limpia**
   - Instalar en VM o máquina sin Node.js
   - Verificar que todo funcione

2. **Documentar cambios**
   - Actualizar CHANGELOG.md
   - Crear release notes

3. **Backup del instalador**
   - Guardar copia del instalador generado
   - Etiquetar versión en Git

## Scripts Útiles

### Build completo automatizado
```bash
#!/bin/bash
# build.sh

echo "🧹 Limpiando..."
rm -rf dist/

echo "📦 Instalando dependencias..."
npm install

echo "🎨 Compilando CSS..."
npm run build:css

echo "🔧 Ejecutando tests..."
npm run test:db

echo "🏗️ Generando instalador..."
npm run dist:win

echo "✅ ¡Build completado!"
ls -lh dist/*.exe
```

### Versión y build
```bash
#!/bin/bash
# release.sh

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Uso: ./release.sh <version>"
  exit 1
fi

npm version $VERSION
npm run dist:all
git push --follow-tags
```

## Referencias

- [Electron Builder Docs](https://www.electron.build/)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Apple Code Signing](https://developer.apple.com/support/code-signing/)
- [electron-updater](https://www.electron.build/auto-update)
