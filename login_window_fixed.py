"""
Fixed Login Window - Simplified and properly structured
Eliminates layout overlap issues and animation problems
"""

from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *
import sys


class SimpleLoginWindow(QMainWindow):
    """Simplified login window without problematic overlays"""

    login_successful = Signal(str)

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Sistema de Seguros - Login")
        self.setFixedSize(400, 500)
        self.center_window()
        self.setup_ui()
        self.load_styles()

    def center_window(self):
        """Center window on screen"""
        screen = QGuiApplication.primaryScreen().geometry()
        window_geometry = self.frameGeometry()
        center_point = screen.center()
        window_geometry.moveCenter(center_point)
        self.move(window_geometry.topLeft())

    def setup_ui(self):
        """Setup clean UI without overlapping elements"""
        # Main widget
        main_widget = QWidget()
        self.setCentralWidget(main_widget)

        # Main layout with proper spacing
        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(40, 40, 40, 40)
        main_layout.setSpacing(30)

        # Header section
        self.create_header(main_layout)

        # Login form section
        self.create_form(main_layout)

        # Footer section
        self.create_footer(main_layout)

        # Add stretch to center content
        main_layout.addStretch()

    def create_header(self, parent_layout):
        """Create header with logo and title"""
        header_widget = QWidget()
        header_layout = QVBoxLayout(header_widget)
        header_layout.setSpacing(15)
        header_layout.setContentsMargins(0, 0, 0, 0)

        # Logo
        logo_label = QLabel("🛡️")
        logo_label.setAlignment(Qt.AlignCenter)
        logo_label.setStyleSheet("font-size: 48px; margin-bottom: 10px;")
        header_layout.addWidget(logo_label)

        # Title
        title_label = QLabel("Sistema de Gestión de Seguros")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("""
            font-size: 24px;
            font-weight: bold;
            color: #1B4F72;
            margin-bottom: 5px;
        """)
        header_layout.addWidget(title_label)

        # Subtitle
        subtitle_label = QLabel("Ingresa tus credenciales para continuar")
        subtitle_label.setAlignment(Qt.AlignCenter)
        subtitle_label.setStyleSheet("""
            font-size: 14px;
            color: #7F8C8D;
            margin-bottom: 10px;
        """)
        header_layout.addWidget(subtitle_label)

        parent_layout.addWidget(header_widget)

    def create_form(self, parent_layout):
        """Create login form without overlapping elements"""
        # Form container
        form_widget = QFrame()
        form_widget.setStyleSheet("""
            QFrame {
                background-color: #FFFFFF;
                border-radius: 12px;
                border: 1px solid #E8E8E8;
                padding: 20px;
            }
        """)

        form_layout = QVBoxLayout(form_widget)
        form_layout.setContentsMargins(30, 30, 30, 30)
        form_layout.setSpacing(20)

        # Username section
        user_label = QLabel("👤 Usuario")
        user_label.setStyleSheet("color: #7F8C8D; font-weight: 500; font-size: 14px;")
        form_layout.addWidget(user_label)

        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Ingresa tu usuario")
        self.username_input.setText("admin")
        self.username_input.setStyleSheet("""
            QLineEdit {
                background-color: #F8F9FA;
                border: 2px solid #E8E8E8;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 14px;
                color: #2C3E50;
                min-height: 20px;
            }
            QLineEdit:focus {
                border-color: #D4AF37;
                background-color: #FFFFFF;
            }
        """)
        form_layout.addWidget(self.username_input)

        # Password section
        pass_label = QLabel("🔒 Contraseña")
        pass_label.setStyleSheet("color: #7F8C8D; font-weight: 500; font-size: 14px;")
        form_layout.addWidget(pass_label)

        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Ingresa tu contraseña")
        self.password_input.setText("123456")
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.setStyleSheet("""
            QLineEdit {
                background-color: #F8F9FA;
                border: 2px solid #E8E8E8;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 14px;
                color: #2C3E50;
                min-height: 20px;
            }
            QLineEdit:focus {
                border-color: #D4AF37;
                background-color: #FFFFFF;
            }
        """)
        form_layout.addWidget(self.password_input)

        # Options row
        options_widget = QWidget()
        options_layout = QHBoxLayout(options_widget)
        options_layout.setContentsMargins(0, 0, 0, 0)

        self.remember_checkbox = QCheckBox("Recordar sesión")
        self.remember_checkbox.setStyleSheet("""
            QCheckBox {
                color: #7F8C8D;
                font-size: 13px;
                spacing: 8px;
            }
            QCheckBox::indicator {
                width: 16px;
                height: 16px;
                border-radius: 3px;
                border: 2px solid #E8E8E8;
                background-color: #FFFFFF;
            }
            QCheckBox::indicator:checked {
                background-color: #D4AF37;
                border-color: #D4AF37;
            }
        """)
        options_layout.addWidget(self.remember_checkbox)

        options_layout.addStretch()

        forgot_label = QLabel('<a href="#" style="color: #D4AF37; text-decoration: none;">¿Olvidaste tu contraseña?</a>')
        forgot_label.setStyleSheet("font-size: 13px;")
        forgot_label.linkActivated.connect(self.show_forgot_password)
        options_layout.addWidget(forgot_label)

        form_layout.addWidget(options_widget)

        # Login button
        self.login_button = QPushButton("Iniciar Sesión")
        self.login_button.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0,
                                           stop: 0 #F4D03F, stop: 1 #D4AF37);
                border: none;
                border-radius: 8px;
                color: #1B4F72;
                font-size: 14px;
                font-weight: 600;
                padding: 12px 24px;
                min-height: 20px;
            }
            QPushButton:hover {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0,
                                           stop: 0 #F1C40F, stop: 1 #B7950B);
            }
            QPushButton:pressed {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 0,
                                           stop: 0 #D4AF37, stop: 1 #B7950B);
            }
            QPushButton:disabled {
                background-color: #BDC3C7;
                color: #7F8C8D;
            }
        """)
        self.login_button.clicked.connect(self.handle_login)
        form_layout.addWidget(self.login_button)

        parent_layout.addWidget(form_widget)

        # Connect Enter key to login
        self.username_input.returnPressed.connect(self.handle_login)
        self.password_input.returnPressed.connect(self.handle_login)

    def create_footer(self, parent_layout):
        """Create footer section"""
        footer_widget = QWidget()
        footer_layout = QVBoxLayout(footer_widget)
        footer_layout.setSpacing(10)
        footer_layout.setContentsMargins(0, 0, 0, 0)

        # Demo info
        demo_label = QLabel("Demo: usuario 'admin', contraseña '123456'")
        demo_label.setAlignment(Qt.AlignCenter)
        demo_label.setStyleSheet("color: #95A5A6; font-size: 12px; font-style: italic;")
        footer_layout.addWidget(demo_label)

        # Copyright
        copyright_label = QLabel("© 2024 Sistema de Seguros. Todos los derechos reservados.")
        copyright_label.setAlignment(Qt.AlignCenter)
        copyright_label.setStyleSheet("color: #BDC3C7; font-size: 11px;")
        footer_layout.addWidget(copyright_label)

        parent_layout.addWidget(footer_widget)

    def handle_login(self):
        """Handle login without complex animations"""
        username = self.username_input.text().strip()
        password = self.password_input.text().strip()

        if not username or not password:
            self.show_message("Error", "Por favor completa todos los campos")
            return

        # Disable button and show loading
        self.login_button.setEnabled(False)
        self.login_button.setText("Iniciando sesión...")

        # Simulate authentication delay
        QTimer.singleShot(1500, lambda: self.validate_credentials(username, password))

    def validate_credentials(self, username, password):
        """Validate credentials and emit success"""
        if username == "admin" and password == "123456":
            self.show_message("Éxito", "¡Login exitoso!")
            QTimer.singleShot(1000, lambda: self.login_successful.emit(username))
        else:
            self.show_message("Error", "Credenciales incorrectas")
            self.login_button.setEnabled(True)
            self.login_button.setText("Iniciar Sesión")

    def show_message(self, title, message):
        """Show simple message dialog"""
        msg = QMessageBox(self)
        msg.setWindowTitle(title)
        msg.setText(message)
        if title == "Error":
            msg.setIcon(QMessageBox.Critical)
        else:
            msg.setIcon(QMessageBox.Information)
        msg.exec()

    def show_forgot_password(self):
        """Handle forgot password"""
        self.show_message("Recuperar Contraseña",
                         "Función de recuperación de contraseña no implementada en la demo.")

    def load_styles(self):
        """Load basic styling"""
        self.setStyleSheet("""
            QMainWindow {
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                           stop: 0 #1B4F72, stop: 1 #2E86AB);
            }
        """)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SimpleLoginWindow()
    window.show()
    sys.exit(app.exec())