# 🛡️ Sistema de Gestión de Seguros - PySide6 Demo

Una aplicación moderna y elegante de gestión de seguros desarrollada con PySide6, diseñada para demostrar que las aplicaciones nativas de escritorio pueden ser tan visualmente atractivas como las aplicaciones web modernas.

## ✨ Características Principales

### 🎨 Diseño Moderno
- **Interfaz elegante** con tema dorado (#F4D03F, #D4AF37) y azul oscuro (#1B4F72, #2E86AB)
- **Animaciones suaves** y micro-interacciones pulidas
- **Efectos visuales** como sombras, gradientes y hover effects
- **Tipografía jerárquica** y espaciado consistente

### 🔐 Sistema de Login
- Ventana sin bordes del sistema con frame personalizado
- Campos de entrada con validación y efectos de foco
- Toggle show/hide para contraseña
- Animaciones de entrada y retroalimentación de errores
- **Credenciales demo**: `admin` / `123456`

### 📊 Dashboard Interactivo
- **Sidebar responsivo** con navegación animada
- **Cards de métricas** con efectos hover y trends
- **Gráficos animados** (barras, líneas, pie) usando QPainter
- **Tablas personalizadas** con estados coloreados
- **Alertas importantes** con diferentes niveles de prioridad
- **Notificaciones toast** elegantes

### 🎯 Widgets Personalizados
- `MetricCard`: Cards con animaciones y indicadores de tendencia
- `AlertCard`: Alertas con iconos y acciones
- `CustomTable`: Tablas estilizadas con hover effects
- `RippleButton`: Botones con efecto ripple estilo Material Design
- `LoadingSpinner`: Spinners animados personalizados
- `NotificationToast`: Notificaciones no intrusivas

## 🚀 Instalación y Ejecución

### Requisitos
- Python 3.8 o superior
- PySide6

### Instalación
```bash
# Instalar dependencias
pip install -r requirements.txt

# O instalar directamente
pip install PySide6>=6.5.0
```

### Ejecución
```bash
# Ejecutar la aplicación
python main.py
```

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