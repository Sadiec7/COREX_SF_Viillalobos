"""
Modern Dashboard Window for Insurance Management System
Features responsive layout, animated sidebar, and elegant data visualization
"""

from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *
from widgets.custom_widgets import (
    MetricCard, AlertCard, CustomTable, SidebarButton,
    NotificationToast, LoadingSpinner
)
from widgets.charts_widget import MetricsOverviewWidget, MiniChart
from datetime import datetime, timedelta
import random


class DashboardSidebar(QWidget):
    """Modern sidebar with navigation buttons"""

    page_changed = Signal(str)

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setProperty("class", "Sidebar")
        self.setFixedWidth(250)

        self.current_button = None
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 20, 0, 20)
        layout.setSpacing(5)

        # Logo/Title area
        self.create_header(layout)

        # Navigation buttons
        self.create_navigation(layout)

        layout.addStretch()

        # User info
        self.create_user_section(layout)

    def create_header(self, parent_layout):
        """Create sidebar header with logo"""
        header_widget = QWidget()
        header_layout = QVBoxLayout(header_widget)
        header_layout.setContentsMargins(20, 0, 20, 20)

        # Logo
        logo_label = QLabel("🛡️")
        logo_label.setAlignment(Qt.AlignCenter)
        logo_label.setStyleSheet("font-size: 32px; margin-bottom: 10px;")
        header_layout.addWidget(logo_label)

        # Title
        title_label = QLabel("Insurance\nManager")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("""
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 700;
            line-height: 1.2;
        """)
        header_layout.addWidget(title_label)

        parent_layout.addWidget(header_widget)

    def create_navigation(self, parent_layout):
        """Create navigation buttons"""
        nav_items = [
            ("Dashboard", "📊", "dashboard"),
            ("Clientes", "👥", "clients"),
            ("Pólizas", "📄", "policies"),
            ("Reportes", "📈", "reports"),
            ("Configuración", "⚙️", "settings")
        ]

        self.nav_buttons = {}

        for name, icon, key in nav_items:
            button = SidebarButton(name, icon)
            button.clicked.connect(lambda checked, k=key: self.change_page(k))
            self.nav_buttons[key] = button
            parent_layout.addWidget(button)

        # Set dashboard as default
        self.nav_buttons["dashboard"].setChecked(True)
        self.current_button = self.nav_buttons["dashboard"]

    def create_user_section(self, parent_layout):
        """Create user info and logout section"""
        user_widget = QWidget()
        user_layout = QVBoxLayout(user_widget)
        user_layout.setContentsMargins(20, 20, 20, 0)

        # User avatar and name
        user_info_layout = QHBoxLayout()

        avatar_label = QLabel("👤")
        avatar_label.setStyleSheet("font-size: 24px;")
        user_info_layout.addWidget(avatar_label)

        user_name_layout = QVBoxLayout()
        name_label = QLabel("Admin User")
        name_label.setStyleSheet("color: #FFFFFF; font-weight: 600; font-size: 14px;")
        user_name_layout.addWidget(name_label)

        role_label = QLabel("Administrador")
        role_label.setStyleSheet("color: #BDC3C7; font-size: 12px;")
        user_name_layout.addWidget(role_label)

        user_info_layout.addLayout(user_name_layout)
        user_layout.addLayout(user_info_layout)

        # Logout button
        logout_button = SidebarButton("Cerrar Sesión", "🚪")
        logout_button.clicked.connect(self.logout_clicked)
        user_layout.addWidget(logout_button)

        parent_layout.addWidget(user_widget)

    def change_page(self, page_key):
        """Handle page change"""
        # Update button states
        if self.current_button:
            self.current_button.setChecked(False)

        self.current_button = self.nav_buttons[page_key]
        self.current_button.setChecked(True)

        # Emit signal
        self.page_changed.emit(page_key)

    def logout_clicked(self):
        """Handle logout button click"""
        reply = QMessageBox.question(
            self,
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            self.page_changed.emit("logout")


class DashboardContent(QWidget):
    """Main dashboard content area"""

    def __init__(self, username="Admin", parent=None):
        super().__init__(parent)
        self.username = username
        self.setProperty("class", "ContentArea")

        self.setup_ui()
        self.load_sample_data()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)

        # Header
        self.create_header(layout)

        # Metrics cards
        self.create_metrics_section(layout)

        # Charts and tables section
        self.create_data_section(layout)

    def create_header(self, parent_layout):
        """Create dashboard header with welcome message"""
        header_widget = QFrame()
        header_widget.setProperty("class", "DashboardHeader")
        header_layout = QHBoxLayout(header_widget)
        header_layout.setContentsMargins(20, 20, 20, 20)

        # Welcome text
        welcome_layout = QVBoxLayout()

        welcome_label = QLabel(f"¡Bienvenido, {self.username}!")
        welcome_label.setProperty("class", "WelcomeText")
        welcome_layout.addWidget(welcome_label)

        date_label = QLabel(datetime.now().strftime("%A, %d de %B de %Y"))
        date_label.setProperty("class", "DateText")
        welcome_layout.addWidget(date_label)

        header_layout.addLayout(welcome_layout)

        header_layout.addStretch()

        # Notifications
        notifications_layout = QHBoxLayout()

        notification_btn = QPushButton("🔔")
        notification_btn.setProperty("class", "SecondaryButton")
        notification_btn.setFixedSize(40, 40)
        notification_btn.clicked.connect(self.show_notifications)
        notifications_layout.addWidget(notification_btn)

        refresh_btn = QPushButton("🔄")
        refresh_btn.setProperty("class", "SecondaryButton")
        refresh_btn.setFixedSize(40, 40)
        refresh_btn.clicked.connect(self.refresh_data)
        notifications_layout.addWidget(refresh_btn)

        header_layout.addLayout(notifications_layout)

        parent_layout.addWidget(header_widget)

    def create_metrics_section(self, parent_layout):
        """Create metrics cards section"""
        metrics_layout = QHBoxLayout()
        metrics_layout.setSpacing(15)

        # Sample metrics data
        metrics_data = [
            {
                "title": "Total Pólizas",
                "value": "245",
                "trend": "up",
                "trend_value": "12%",
                "icon": "📄"
            },
            {
                "title": "Vencen Esta Semana",
                "value": "12",
                "trend": "down",
                "trend_value": "3",
                "icon": "⚠️"
            },
            {
                "title": "Cobros Pendientes",
                "value": "$45,230",
                "trend": "up",
                "trend_value": "8%",
                "icon": "💰"
            },
            {
                "title": "Nuevos Clientes",
                "value": "8",
                "trend": "up",
                "trend_value": "2",
                "icon": "👥"
            }
        ]

        self.metric_cards = []
        for metric in metrics_data:
            card = MetricCard(
                metric["title"],
                metric["value"],
                metric["trend"],
                metric["trend_value"],
                metric["icon"]
            )
            self.metric_cards.append(card)
            metrics_layout.addWidget(card)

        parent_layout.addLayout(metrics_layout)

    def create_data_section(self, parent_layout):
        """Create charts and tables section"""
        data_layout = QHBoxLayout()
        data_layout.setSpacing(20)

        # Left column - Charts
        left_column = QVBoxLayout()

        # Charts widget
        self.charts_widget = MetricsOverviewWidget()
        charts_container = QFrame()
        charts_container.setProperty("class", "MetricCard")
        charts_container_layout = QVBoxLayout(charts_container)
        charts_container_layout.addWidget(self.charts_widget)
        left_column.addWidget(charts_container)

        data_layout.addLayout(left_column, 2)

        # Right column - Tables and alerts
        right_column = QVBoxLayout()

        # Alerts section
        self.create_alerts_section(right_column)

        # Recent policies table
        self.create_policies_table(right_column)

        data_layout.addLayout(right_column, 1)

        parent_layout.addLayout(data_layout)

    def create_alerts_section(self, parent_layout):
        """Create alerts section"""
        alerts_container = QFrame()
        alerts_container.setProperty("class", "MetricCard")
        alerts_layout = QVBoxLayout(alerts_container)
        alerts_layout.setContentsMargins(15, 15, 15, 15)

        # Section title
        title_label = QLabel("⚠️ Alertas Importantes")
        title_label.setStyleSheet("font-size: 16px; font-weight: 600; color: #1B4F72; margin-bottom: 10px;")
        alerts_layout.addWidget(title_label)

        # Sample alerts
        alerts_data = [
            {
                "title": "Pólizas por Vencer",
                "message": "12 pólizas vencen en los próximos 7 días",
                "type": "urgent",
                "action": "Ver Lista"
            },
            {
                "title": "Cobros Pendientes",
                "message": "5 clientes con pagos atrasados",
                "type": "warning",
                "action": "Gestionar"
            },
            {
                "title": "Renovaciones",
                "message": "8 renovaciones programadas esta semana",
                "type": "info",
                "action": "Revisar"
            }
        ]

        for alert_data in alerts_data:
            alert = AlertCard(
                alert_data["title"],
                alert_data["message"],
                alert_data["type"],
                alert_data["action"]
            )
            alerts_layout.addWidget(alert)

        parent_layout.addWidget(alerts_container)

    def create_policies_table(self, parent_layout):
        """Create recent policies table"""
        table_container = QFrame()
        table_container.setProperty("class", "MetricCard")
        table_layout = QVBoxLayout(table_container)
        table_layout.setContentsMargins(15, 15, 15, 15)

        # Section title
        title_label = QLabel("📋 Pólizas Próximas a Vencer")
        title_label.setStyleSheet("font-size: 16px; font-weight: 600; color: #1B4F72; margin-bottom: 15px;")
        table_layout.addWidget(title_label)

        # Sample table data
        headers = ["Cliente", "Póliza", "Vencimiento", "Monto", "Estado"]
        data = [
            ["Juan Pérez García", "AUT-2024-001", "15/03/2024", "$2,450", "urgente"],
            ["María López", "VID-2024-089", "18/03/2024", "$1,200", "próximo"],
            ["Carlos Ruiz", "HOG-2024-034", "20/03/2024", "$850", "próximo"],
            ["Ana Martínez", "SAL-2024-112", "22/03/2024", "$3,100", "activa"],
            ["Roberto Silva", "AUT-2024-078", "25/03/2024", "$1,800", "activa"]
        ]

        self.policies_table = CustomTable(data, headers)
        self.policies_table.setMaximumHeight(200)
        table_layout.addWidget(self.policies_table)

        parent_layout.addWidget(table_container)

    def load_sample_data(self):
        """Load sample data for demonstration"""
        # This would typically load real data from a database
        pass

    def refresh_data(self):
        """Refresh dashboard data"""
        # Show loading indicator
        loading_toast = NotificationToast("Actualizando datos...", "info", 2000, self)
        loading_toast.show_toast(self)

        # Simulate data refresh
        QTimer.singleShot(1000, self.update_metrics)

    def update_metrics(self):
        """Update metrics with new data"""
        # Simulate random changes
        for card in self.metric_cards:
            # Add slight animation to demonstrate updates
            card.animate_scale(1.05)
            QTimer.singleShot(200, lambda c=card: c.animate_scale(1.0))

        # Refresh charts
        if hasattr(self, 'charts_widget'):
            self.charts_widget.refresh_data()

        # Show success message
        success_toast = NotificationToast("Datos actualizados correctamente", "success", 3000, self)
        success_toast.show_toast(self)

    def show_notifications(self):
        """Show notifications panel"""
        notifications = [
            "Nueva póliza registrada para cliente premium",
            "Recordatorio: Reunión con equipo de ventas a las 15:00",
            "3 nuevas solicitudes de cotización recibidas",
            "Actualización del sistema programada para mañana"
        ]

        msg = QMessageBox(self)
        msg.setWindowTitle("Notificaciones")
        msg.setText("Tienes 4 notificaciones nuevas:")
        msg.setDetailedText("\n".join(f"• {notif}" for notif in notifications))
        msg.setIcon(QMessageBox.Information)
        msg.exec()


class PlaceholderPage(QWidget):
    """Placeholder page for other sections"""

    def __init__(self, page_name, parent=None):
        super().__init__(parent)
        self.page_name = page_name
        self.setProperty("class", "ContentArea")

        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignCenter)

        # Icon
        icon_map = {
            "clients": "👥",
            "policies": "📄",
            "reports": "📈",
            "settings": "⚙️"
        }

        icon_label = QLabel(icon_map.get(self.page_name, "📄"))
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setStyleSheet("font-size: 64px; margin-bottom: 20px;")
        layout.addWidget(icon_label)

        # Title
        title_label = QLabel(f"Sección: {self.page_name.title()}")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("font-size: 24px; font-weight: 600; color: #1B4F72; margin-bottom: 10px;")
        layout.addWidget(title_label)

        # Description
        desc_label = QLabel("Esta sección está en desarrollo.\nEn una aplicación real, aquí se mostraría el contenido específico.")
        desc_label.setAlignment(Qt.AlignCenter)
        desc_label.setStyleSheet("font-size: 14px; color: #7F8C8D; line-height: 1.5;")
        layout.addWidget(desc_label)

        # Demo button
        demo_button = QPushButton("Ver Demo Interactivo")
        demo_button.setProperty("class", "PrimaryButton")
        demo_button.setMaximumWidth(200)
        demo_button.clicked.connect(self.show_demo)
        layout.addWidget(demo_button, alignment=Qt.AlignCenter)

    def show_demo(self):
        """Show demo functionality"""
        demo_messages = {
            "clients": "En esta sección podrías:\n• Ver lista de clientes\n• Agregar nuevos clientes\n• Editar información de contacto\n• Ver historial de pólizas por cliente",
            "policies": "En esta sección podrías:\n• Gestionar todas las pólizas\n• Crear nuevas pólizas\n• Renovar pólizas existentes\n• Generar documentos de póliza",
            "reports": "En esta sección podrías:\n• Ver reportes de ventas\n• Analizar métricas de performance\n• Exportar datos a Excel/PDF\n• Configurar reportes automáticos",
            "settings": "En esta sección podrías:\n• Configurar parámetros del sistema\n• Gestionar usuarios y permisos\n• Personalizar notificaciones\n• Configurar integraciones"
        }

        msg = QMessageBox(self)
        msg.setWindowTitle(f"Demo - {self.page_name.title()}")
        msg.setText(demo_messages.get(self.page_name, "Funcionalidad demo"))
        msg.setIcon(QMessageBox.Information)
        msg.exec()


class DashboardWindow(QMainWindow):
    """Main dashboard window with sidebar navigation"""

    logout_requested = Signal()

    def __init__(self, username="Admin"):
        super().__init__()
        self.username = username
        self.setWindowTitle("Sistema de Seguros - Dashboard")
        self.setMinimumSize(1200, 800)
        self.resize(1400, 900)

        # Center window
        self.center_window()

        # Setup UI
        self.setup_ui()

        # Load styles
        self.load_styles()

    def center_window(self):
        """Center window on screen"""
        screen = QGuiApplication.primaryScreen().geometry()
        window_geometry = self.frameGeometry()
        center_point = screen.center()
        window_geometry.moveCenter(center_point)
        self.move(window_geometry.topLeft())

    def setup_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Sidebar
        self.sidebar = DashboardSidebar()
        self.sidebar.page_changed.connect(self.change_page)
        main_layout.addWidget(self.sidebar)

        # Content area
        self.content_stack = QStackedWidget()

        # Add pages
        self.dashboard_page = DashboardContent(self.username)
        self.content_stack.addWidget(self.dashboard_page)

        # Placeholder pages
        for page_name in ["clients", "policies", "reports", "settings"]:
            page = PlaceholderPage(page_name)
            self.content_stack.addWidget(page)

        main_layout.addWidget(self.content_stack)

        # Page mapping
        self.pages = {
            "dashboard": 0,
            "clients": 1,
            "policies": 2,
            "reports": 3,
            "settings": 4
        }

    def change_page(self, page_key):
        """Handle page changes"""
        if page_key == "logout":
            self.handle_logout()
        elif page_key in self.pages:
            self.content_stack.setCurrentIndex(self.pages[page_key])

            # Add page transition animation
            self.animate_page_transition()

    def animate_page_transition(self):
        """Add smooth transition between pages"""
        current_widget = self.content_stack.currentWidget()

        # Fade effect
        effect = QGraphicsOpacityEffect()
        current_widget.setGraphicsEffect(effect)

        animation = QPropertyAnimation(effect, b"opacity")
        animation.setDuration(300)
        animation.setStartValue(0.7)
        animation.setEndValue(1.0)
        animation.setEasingCurve(QEasingCurve.OutCubic)
        animation.start()

    def handle_logout(self):
        """Handle logout request"""
        self.logout_requested.emit()

    def load_styles(self):
        """Load stylesheet"""
        try:
            with open("styles/styles.qss", "r", encoding="utf-8") as f:
                self.setStyleSheet(f.read())
        except FileNotFoundError:
            print("Warning: styles.qss not found")

    def show_welcome_message(self):
        """Show welcome message after login"""
        welcome_toast = NotificationToast(
            f"¡Bienvenido al sistema, {self.username}!",
            "success",
            4000,
            self
        )
        welcome_toast.show_toast(self)


if __name__ == "__main__":
    import sys
    app = QApplication(sys.argv)

    window = DashboardWindow("Admin")
    window.show()

    sys.exit(app.exec())