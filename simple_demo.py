"""
Simple Clean Demo - Login + Basic Dashboard
Without problematic animations or complex widgets
"""

import sys
from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *


class CleanLoginWindow(QMainWindow):
    """Clean login window without overlay issues"""

    login_successful = Signal(str)

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Sistema de Seguros - Login")
        self.setFixedSize(550, 750)
        self.center_window()
        self.setup_ui()
        self.apply_styles()

    def center_window(self):
        screen = QGuiApplication.primaryScreen().geometry()
        window_geometry = self.frameGeometry()
        center_point = screen.center()
        window_geometry.moveCenter(center_point)
        self.move(window_geometry.topLeft())

    def setup_ui(self):
        # Main widget and layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)

        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(60, 60, 60, 60)
        main_layout.setSpacing(40)

        # Logo and title
        logo_label = QLabel("🛡️")
        logo_label.setAlignment(Qt.AlignCenter)
        logo_label.setStyleSheet("font-size: 48px;")
        logo_label.setFixedHeight(60)
        main_layout.addWidget(logo_label)

        title_label = QLabel("Sistema de Gestión de Seguros")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setObjectName("title")
        title_label.setFixedHeight(40)
        main_layout.addWidget(title_label)

        subtitle_label = QLabel("Ingresa tus credenciales para continuar")
        subtitle_label.setAlignment(Qt.AlignCenter)
        subtitle_label.setObjectName("subtitle")
        subtitle_label.setFixedHeight(25)
        main_layout.addWidget(subtitle_label)

        # Spacer
        main_layout.addSpacing(25)

        # Form container
        form_container = QFrame()
        form_container.setObjectName("formContainer")
        form_container.setFixedSize(400, 380)  # Smaller height
        form_layout = QVBoxLayout(form_container)
        form_layout.setContentsMargins(35, 30, 35, 30)
        form_layout.setSpacing(20)

        # Username section
        user_label = QLabel("👤 Usuario")
        user_label.setObjectName("fieldLabel")
        user_label.setFixedHeight(20)
        form_layout.addWidget(user_label)

        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Ingresa tu usuario")
        self.username_input.setText("admin")
        self.username_input.setObjectName("inputField")
        self.username_input.setFixedHeight(40)
        form_layout.addWidget(self.username_input)

        # Add space between fields
        form_layout.addSpacing(10)

        # Password section
        pass_label = QLabel("🔒 Contraseña")
        pass_label.setObjectName("fieldLabel")
        pass_label.setFixedHeight(20)
        form_layout.addWidget(pass_label)

        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Ingresa tu contraseña")
        self.password_input.setText("123456")
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.setObjectName("inputField")
        self.password_input.setFixedHeight(40)
        form_layout.addWidget(self.password_input)

        # Add space before options
        form_layout.addSpacing(15)

        # Remember me
        self.remember_checkbox = QCheckBox("Recordar sesión")
        self.remember_checkbox.setObjectName("checkbox")
        self.remember_checkbox.setFixedHeight(25)
        form_layout.addWidget(self.remember_checkbox)

        # Add space before button
        form_layout.addSpacing(10)

        # Login button
        self.login_button = QPushButton("Iniciar Sesión")
        self.login_button.setObjectName("loginButton")
        self.login_button.setFixedHeight(45)
        self.login_button.clicked.connect(self.handle_login)
        form_layout.addWidget(self.login_button)

        # Center the form container
        form_container_layout = QHBoxLayout()
        form_container_layout.addStretch()
        form_container_layout.addWidget(form_container)
        form_container_layout.addStretch()
        main_layout.addLayout(form_container_layout)

        # Add space before footer
        main_layout.addSpacing(20)

        # Footer
        footer_label = QLabel("Demo: usuario 'admin', contraseña '123456'")
        footer_label.setAlignment(Qt.AlignCenter)
        footer_label.setObjectName("footer")
        footer_label.setFixedHeight(20)
        main_layout.addWidget(footer_label)

        # Bottom spacer
        main_layout.addSpacing(30)

        # Connect Enter key
        self.username_input.returnPressed.connect(self.handle_login)
        self.password_input.returnPressed.connect(self.handle_login)

    def apply_styles(self):
        self.setStyleSheet("""
            QMainWindow {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                           stop: 0 #1B4F72, stop: 1 #2E86AB);
            }

            #title {
                font-size: 24px;
                font-weight: bold;
                color: #FFFFFF;
                margin: 5px 0;
            }

            #subtitle {
                font-size: 14px;
                color: #BDC3C7;
                margin-bottom: 10px;
            }

            #formContainer {
                background-color: #FFFFFF;
                border-radius: 15px;
                border: 2px solid #E0E0E0;
            }

            #fieldLabel {
                color: #2C3E50;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 5px;
            }

            #inputField {
                background-color: #F8F9FA;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 16px;
                color: #2C3E50;
            }

            #inputField:focus {
                border-color: #D4AF37;
                background-color: #FFFFFF;
            }

            #checkbox {
                color: #7F8C8D;
                font-size: 13px;
                margin: 10px 0;
            }

            #loginButton {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0,
                                           stop: 0 #F4D03F, stop: 1 #D4AF37);
                border: none;
                border-radius: 8px;
                color: #1B4F72;
                font-size: 18px;
                font-weight: bold;
            }

            #loginButton:hover {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0,
                                           stop: 0 #F1C40F, stop: 1 #B7950B);
            }

            #loginButton:pressed {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0,
                                           stop: 0 #D4AF37, stop: 1 #B7950B);
            }

            #loginButton:disabled {
                background-color: #BDC3C7;
                color: #7F8C8D;
            }

            #footer {
                color: #FFFFFF;
                font-size: 12px;
                font-style: italic;
                margin-top: 20px;
            }
        """)

    def handle_login(self):
        username = self.username_input.text().strip()
        password = self.password_input.text().strip()

        if not username or not password:
            QMessageBox.warning(self, "Error", "Por favor completa todos los campos")
            return

        # Disable button temporarily
        self.login_button.setEnabled(False)
        self.login_button.setText("Iniciando sesión...")

        # Simulate login delay
        QTimer.singleShot(1500, lambda: self.validate_login(username, password))

    def validate_login(self, username, password):
        if username == "admin" and password == "123456":
            QMessageBox.information(self, "Éxito", "¡Login exitoso!")
            self.login_successful.emit(username)
        else:
            QMessageBox.warning(self, "Error", "Credenciales incorrectas")
            self.login_button.setEnabled(True)
            self.login_button.setText("Iniciar Sesión")


class SimpleDashboard(QMainWindow):
    """Simple dashboard without complex widgets"""

    logout_requested = Signal()

    def __init__(self, username):
        super().__init__()
        self.username = username
        self.setWindowTitle("Sistema de Seguros - Dashboard")
        self.setMinimumSize(1000, 700)
        self.center_window()
        self.setup_ui()
        self.apply_styles()

    def center_window(self):
        screen = QGuiApplication.primaryScreen().geometry()
        window_geometry = self.frameGeometry()
        center_point = screen.center()
        window_geometry.moveCenter(center_point)
        self.move(window_geometry.topLeft())

    def setup_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)

        main_layout = QHBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Sidebar
        sidebar = self.create_sidebar()
        main_layout.addWidget(sidebar)

        # Content area
        content_area = self.create_content_area()
        main_layout.addWidget(content_area)

    def create_sidebar(self):
        sidebar = QFrame()
        sidebar.setObjectName("sidebar")
        sidebar.setFixedWidth(250)

        layout = QVBoxLayout(sidebar)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        # Logo
        logo_label = QLabel("🛡️")
        logo_label.setAlignment(Qt.AlignCenter)
        logo_label.setStyleSheet("font-size: 32px; color: white; margin-bottom: 20px;")
        layout.addWidget(logo_label)

        # Navigation buttons
        nav_buttons = [
            ("📊 Dashboard", True),
            ("👥 Clientes", False),
            ("📄 Pólizas", False),
            ("📈 Reportes", False),
            ("⚙️ Configuración", False)
        ]

        for text, is_active in nav_buttons:
            btn = QPushButton(text)
            btn.setObjectName("navButton" + ("Active" if is_active else ""))
            layout.addWidget(btn)

        layout.addStretch()

        # User info
        user_label = QLabel(f"👤 {self.username}")
        user_label.setObjectName("userLabel")
        layout.addWidget(user_label)

        # Logout button
        logout_btn = QPushButton("🚪 Cerrar Sesión")
        logout_btn.setObjectName("logoutButton")
        logout_btn.clicked.connect(self.handle_logout)
        layout.addWidget(logout_btn)

        return sidebar

    def create_content_area(self):
        content = QFrame()
        content.setObjectName("contentArea")

        layout = QVBoxLayout(content)
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(20)

        # Header
        header = QLabel(f"¡Bienvenido, {self.username}!")
        header.setObjectName("welcomeHeader")
        layout.addWidget(header)

        # Metrics cards
        metrics_layout = QHBoxLayout()
        metrics_layout.setSpacing(20)

        metrics = [
            ("📄", "245", "Total Pólizas"),
            ("⚠️", "12", "Vencen Esta Semana"),
            ("💰", "$45,230", "Cobros Pendientes"),
            ("👥", "8", "Nuevos Clientes")
        ]

        for icon, value, label in metrics:
            card = self.create_metric_card(icon, value, label)
            metrics_layout.addWidget(card)

        layout.addLayout(metrics_layout)

        # Main content area
        main_content = QFrame()
        main_content.setObjectName("mainContent")
        main_content_layout = QVBoxLayout(main_content)

        # Placeholder for charts
        chart_placeholder = QLabel("📊 Gráficos de rendimiento\n\n(En una aplicación real, aquí se mostrarían gráficos interactivos)")
        chart_placeholder.setAlignment(Qt.AlignCenter)
        chart_placeholder.setObjectName("chartPlaceholder")
        main_content_layout.addWidget(chart_placeholder)

        layout.addWidget(main_content)

        return content

    def create_metric_card(self, icon, value, label):
        card = QFrame()
        card.setObjectName("metricCard")

        layout = QVBoxLayout(card)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(10)

        icon_label = QLabel(icon)
        icon_label.setAlignment(Qt.AlignCenter)
        icon_label.setStyleSheet("font-size: 24px;")
        layout.addWidget(icon_label)

        value_label = QLabel(value)
        value_label.setObjectName("metricValue")
        value_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(value_label)

        label_widget = QLabel(label)
        label_widget.setObjectName("metricLabel")
        label_widget.setAlignment(Qt.AlignCenter)
        label_widget.setWordWrap(True)
        layout.addWidget(label_widget)

        return card

    def apply_styles(self):
        self.setStyleSheet("""
            #sidebar {
                background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                           stop: 0 #1B4F72, stop: 1 #2E86AB);
            }

            #navButton, #navButtonActive {
                background-color: transparent;
                border: none;
                color: #FFFFFF;
                font-size: 14px;
                text-align: left;
                padding: 12px 15px;
                border-radius: 8px;
            }

            #navButtonActive {
                background-color: rgba(244, 208, 63, 0.2);
                color: #F4D03F;
                font-weight: bold;
            }

            #navButton:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            #userLabel {
                color: #FFFFFF;
                font-size: 14px;
                padding: 10px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }

            #logoutButton {
                background-color: rgba(231, 76, 60, 0.8);
                color: #FFFFFF;
                border: none;
                padding: 10px;
                border-radius: 8px;
                font-size: 14px;
            }

            #logoutButton:hover {
                background-color: rgba(231, 76, 60, 1.0);
            }

            #contentArea {
                background-color: #F8F9FA;
            }

            #welcomeHeader {
                font-size: 28px;
                font-weight: bold;
                color: #1B4F72;
                margin-bottom: 20px;
            }

            #metricCard {
                background-color: #FFFFFF;
                border-radius: 12px;
                border: 1px solid #E8E8E8;
                min-width: 150px;
            }

            #metricCard:hover {
                border-color: #D4AF37;
            }

            #metricValue {
                font-size: 24px;
                font-weight: bold;
                color: #1B4F72;
            }

            #metricLabel {
                font-size: 12px;
                color: #7F8C8D;
                font-weight: 500;
            }

            #mainContent {
                background-color: #FFFFFF;
                border-radius: 12px;
                border: 1px solid #E8E8E8;
                margin-top: 20px;
            }

            #chartPlaceholder {
                font-size: 16px;
                color: #7F8C8D;
                padding: 40px;
            }
        """)

    def handle_logout(self):
        reply = QMessageBox.question(self, "Cerrar Sesión",
                                   "¿Estás seguro que deseas cerrar sesión?",
                                   QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.logout_requested.emit()


class SimpleApp(QApplication):
    """Simple application manager"""

    def __init__(self, argv):
        super().__init__(argv)
        self.login_window = None
        self.dashboard_window = None
        self.current_user = None
        self.show_login()

    def show_login(self):
        if self.dashboard_window:
            self.dashboard_window.close()
            self.dashboard_window = None

        self.login_window = CleanLoginWindow()
        self.login_window.login_successful.connect(self.handle_login)
        self.login_window.show()

    def handle_login(self, username):
        self.current_user = username
        if self.login_window:
            self.login_window.close()
            self.login_window = None

        self.dashboard_window = SimpleDashboard(username)
        self.dashboard_window.logout_requested.connect(self.handle_logout)
        self.dashboard_window.show()

    def handle_logout(self):
        self.current_user = None
        if self.dashboard_window:
            self.dashboard_window.close()
            self.dashboard_window = None
        self.show_login()


def main():
    print("🛡️ Sistema de Seguros - Versión Simplificada")
    print("   Credenciales: admin / 123456")
    print()

    app = SimpleApp(sys.argv)
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())