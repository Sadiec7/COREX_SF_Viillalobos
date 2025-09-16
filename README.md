# 🛡️ PySide6 Frontend Demo - Sistema de Gestión de Seguros

Demo completo de frontend moderno desarrollado con **PySide6** que demuestra que las aplicaciones nativas pueden ser tan elegantes y funcionales como las mejores aplicaciones web.

## 🎯 Objetivo del Proyecto

**¿Puede PySide6 competir con React + HTML/CSS en elegancia visual?**

**¡La respuesta es SÍ!** 🚀

Este proyecto demuestra las capacidades avanzadas de PySide6 para crear interfaces de usuario modernas, elegantes y profesionales.

## ✨ Demo en Vivo

### 🚀 Ejecución Rápida

```bash
# 1. Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# 2. Instalar dependencias
pip install PySide6

# 3. Ejecutar demo
python simple_demo.py
```

### 🔑 Credenciales Demo
- **Usuario**: `admin`
- **Contraseña**: `123456`

## 🎨 Características Destacadas

### 🖥️ Interfaz Moderna
- **Login elegante** con animaciones fluidas
- **Dashboard profesional** con sidebar navegación
- **Tema dorado/azul** (#F4D03F, #D4AF37, #1B4F72, #2E86AB)
- **Layouts responsivos** sin superposiciones
- **Micro-animaciones** y hover effects

### 🧩 Widgets Personalizados
- **MetricCard**: Cards animadas con métricas
- **AlertCard**: Alertas con niveles de prioridad
- **CustomTable**: Tablas estilizadas
- **Charts**: Gráficos con QPainter
- **Sidebar**: Navegación moderna

### ⚡ Rendimiento Nativo
- **Sin overhead de navegador**
- **Integración OS nativa**
- **Menor uso de recursos**
- **Funciona offline**

## 📁 Archivos Principales

| Archivo | Descripción |
|---------|-------------|
| `simple_demo.py` | **🌟 Versión optimizada (RECOMENDADA)** |
| `main.py` | Aplicación completa con todas las características |
| `login_window.py` | Login con animaciones avanzadas |
| `dashboard_window.py` | Dashboard completo con sidebar |
| `styles/styles.qss` | Tema CSS profesional |
| `widgets/` | Componentes reutilizables |

## 🚀 Guía de Instalación Completa

Ver **[README_FRONTEND.md](README_FRONTEND.md)** para instrucciones detalladas.

## 📁 Estructura del Proyecto

```
├── main.py                 # Punto de entrada principal
├── login_window.py         # Ventana de login con animaciones
├── dashboard_window.py     # Dashboard principal con sidebar
├── widgets/
│   ├── custom_widgets.py   # Widgets personalizados
│   └── charts_widget.py    # Widgets de gráficos
├── styles/
│   └── styles.qss         # Estilos CSS para Qt
├── assets/
│   └── icons/             # Iconos (opcional)
├── requirements.txt       # Dependencias
└── README.md             # Este archivo
```

## 🎮 Funcionalidades Demo

### Login
- **Usuario**: `admin`
- **Contraseña**: `123456`
- Prueba credenciales incorrectas para ver animación de error

### Dashboard
- **Métricas animadas**: Cards con datos de ejemplo
- **Gráficos interactivos**: Charts que se animan al cargar
- **Navegación**: Sidebar con diferentes secciones (en desarrollo)
- **Alertas**: Sistema de notificaciones importantes
- **Tabla dinámica**: Lista de pólizas próximas a vencer

## 🎨 Características Técnicas

### Animaciones
- `QPropertyAnimation` para transiciones suaves
- `QEasingCurve` para curvas de animación naturales
- Animaciones de entrada, hover y salida
- Loading states y feedback visual

### Estilos
- Archivo QSS separado para estilos CSS-like
- Soporte para temas (base para dark/light mode)
- Gradientes y sombras modernas
- Hover states y focus indicators

### Arquitectura
- Separación clara de responsabilidades
- Widgets reutilizables y modulares
- Sistema de signals/slots para comunicación
- Manejo de estados elegante

## 🌟 Comparación Web vs Nativo

Esta aplicación demuestra que **PySide6 puede competir con aplicaciones web modernas** en términos de:

### ✅ Ventajas Nativas
- **Rendimiento superior**: Sin overhead de navegador
- **Integración OS**: Mejor integración con el sistema operativo
- **Recursos**: Menor uso de memoria y CPU
- **Offline**: Funciona sin conexión a internet
- **Seguridad**: Mayor control sobre la seguridad de datos

### ✅ Paridad Visual
- **Animaciones fluidas**: Comparable a CSS animations
- **Layouts responsivos**: Adaptable a diferentes tamaños
- **Componentes modernos**: Widgets tan elegantes como componentes web
- **Interactividad**: Micro-interacciones pulidas

## 🔧 Personalización

### Cambiar Tema
Edita `styles/styles.qss` para modificar colores y estilos:
```css
/* Cambiar colores principales */
:root {
    --primary-gold: #F4D03F;
    --primary-blue: #1B4F72;
    --background: #F8F9FA;
}
```

### Agregar Nuevas Páginas
1. Crear widget de página en `dashboard_window.py`
2. Agregar a `pages` dictionary
3. Implementar navegación en sidebar

### Widgets Personalizados
Extiende la clase base en `widgets/custom_widgets.py`:
```python
class MiWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setup_ui()
        self.setup_animations()
```

## 📈 Métricas de Demo

La aplicación incluye datos de prueba realistas:
- **245 pólizas** totales en el sistema
- **12 pólizas** próximas a vencer
- **$45,230** en cobros pendientes
- **8 nuevos clientes** este mes

## 🛠️ Desarrollo Futuro

### Características Planificadas
- [ ] Dark/Light theme toggle
- [ ] Más tipos de gráficos
- [ ] Sistema de notificaciones avanzado
- [ ] Integración con base de datos
- [ ] Reportes exportables
- [ ] Sistema de usuarios completo

### Mejoras Técnicas
- [ ] Tests unitarios
- [ ] Documentación API
- [ ] Empaquetado para distribución
- [ ] Configuración avanzada
- [ ] Logging y debugging

## 📄 Licencia

Este proyecto es una demostración técnica y está disponible para fines educativos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¿Puede PySide6 competir con React + HTML/CSS?**

Esta demo responde con un rotundo **¡SÍ!** 🚀

*Desarrollado para demostrar las capacidades de PySide6 en la creación de interfaces nativas elegantes y modernas.*