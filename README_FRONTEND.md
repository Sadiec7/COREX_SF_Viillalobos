# 🛡️ Sistema de Gestión de Seguros - Frontend PySide6

Demo completo de interfaz moderna desarrollada con PySide6 que demuestra que las aplicaciones nativas pueden ser tan elegantes como las aplicaciones web modernas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Credenciales Demo](#-credenciales-demo)
- [Características Técnicas](#-características-técnicas)

## ✨ Características

### 🎨 Interfaz Moderna
- **Login elegante** con animaciones suaves
- **Dashboard profesional** con sidebar navigation
- **Tema dorado/azul** (#F4D03F, #D4AF37, #1B4F72, #2E86AB)
- **Layouts responsivos** sin superposiciones
- **Hover effects** y micro-animaciones

### 🧩 Componentes Personalizados
- **MetricCard**: Cards animadas con métricas
- **AlertCard**: Alertas con diferentes niveles
- **CustomTable**: Tablas estilizadas
- **Charts**: Gráficos con QPainter
- **Sidebar**: Navegación moderna

### 🎯 Funcionalidades
- Sistema de login con validación
- Dashboard con métricas en tiempo real
- Navegación entre secciones
- Notificaciones y alertas
- Gestión de sesión de usuario

## 📋 Requisitos

- **Python 3.8+**
- **PySide6 6.5.0+**
- **Sistema Operativo**: Windows, macOS, Linux

## 🚀 Instalación

### 1. Crear entorno virtual de Python

```bash
# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate

# En Windows:
venv\\Scripts\\activate
```

### 2. Instalar dependencias

```bash
# Instalar PySide6
pip install -r requirements.txt

# O instalar directamente:
pip install PySide6>=6.5.0
```

### 3. Verificar instalación

```bash
# Verificar que PySide6 está instalado
python -c "import PySide6; print('PySide6 instalado correctamente')"
```

## ▶️ Ejecución

### Método 1: Versión Optimizada (Recomendada)

```bash
# Ejecutar la versión final optimizada
python simple_demo.py
```

### Método 2: Versión Completa

```bash
# Ejecutar la aplicación completa con todas las características
python main.py
```

### Método 3: Solo Login

```bash
# Ejecutar solo la ventana de login
python login_window_fixed.py
```

## 🎮 Credenciales Demo

Para probar la aplicación usa las siguientes credenciales:

- **Usuario**: `admin`
- **Contraseña**: `123456`

## 📁 Estructura del Proyecto

```
├── simple_demo.py           # 🌟 Versión optimizada (RECOMENDADA)
├── main.py                  # Aplicación principal completa
├── login_window.py          # Login con animaciones avanzadas
├── login_window_fixed.py    # Login simplificado
├── dashboard_window.py      # Dashboard completo
├── main_fixed.py           # Versión simplificada del main
├── requirements.txt        # Dependencias Python
├── .gitignore             # Archivos ignorados por Git
├── README.md              # Documentación general
├── README_FRONTEND.md     # 📖 Esta documentación
├── CLAUDE.md              # Guía para Claude Code
├── styles/
│   └── styles.qss         # 🎨 Estilos CSS para Qt
└── widgets/
    ├── custom_widgets.py  # 🧩 Widgets personalizados
    └── charts_widget.py   # 📊 Widgets de gráficos
```

## 🔧 Características Técnicas

### Arquitectura
- **Patrón MVC**: Separación clara de responsabilidades
- **Signals/Slots**: Comunicación entre componentes
- **Layouts responsivos**: QVBoxLayout, QHBoxLayout
- **Widgets personalizados**: Reutilizables y modulares

### Styling
- **QSS (Qt Style Sheets)**: CSS-like styling
- **Colores consistentes**: Paleta profesional
- **Tipografía**: Jerarquía visual clara
- **Animaciones**: QPropertyAnimation

### Rendimiento
- **Layouts optimizados**: Sin superposiciones
- **Dimensiones fijas**: Control total de elementos
- **Gestión de memoria**: Limpieza de efectos
- **Responsive design**: Adaptable a diferentes tamaños

## 🛠️ Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'PySide6'"

```bash
# Asegúrate de tener el entorno virtual activado
source venv/bin/activate  # macOS/Linux
# o
venv\\Scripts\\activate   # Windows

# Reinstala PySide6
pip install PySide6
```

### Error: Elementos superpuestos en la UI

```bash
# Usa la versión optimizada
python simple_demo.py
```

### Error: Ventana muy pequeña

La versión `simple_demo.py` tiene el tamaño optimizado (550x750px).

### Error: No se ve el botón de login

La versión optimizada tiene todos los elementos con dimensiones fijas para evitar este problema.

## 🎯 Próximos Pasos

### Mejoras Futuras
- [ ] Conectar a base de datos real
- [ ] Implementar más páginas del dashboard
- [ ] Agregar tema dark/light
- [ ] Crear más tipos de gráficos
- [ ] Sistema de usuarios completo
- [ ] Exportar reportes

### Extensiones
- [ ] Módulo de clientes
- [ ] Gestión de pólizas
- [ ] Sistema de reportes
- [ ] Configuraciones avanzadas

## 🤝 Contribuciones

Este es un proyecto demo que demuestra las capacidades de PySide6. Si quieres contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Proyecto demo para fines educativos y de demostración.

---

## 🎉 ¡Disfruta explorando el poder de PySide6!

**Demuestra que las aplicaciones nativas pueden ser tan elegantes como las web** 🚀

### 📞 Soporte

Si tienes problemas:
1. Verifica que Python 3.8+ esté instalado
2. Asegúrate de que el entorno virtual esté activado
3. Confirma que PySide6 se instaló correctamente
4. Ejecuta `simple_demo.py` para la mejor experiencia

**¡Happy coding!** 🛡️✨