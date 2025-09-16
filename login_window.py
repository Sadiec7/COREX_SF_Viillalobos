"""
Modern Login Window for Insurance Management System
Features elegant animations, custom window frame, and modern styling
"""

from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *
from widgets.custom_widgets import CustomLineEdit, RippleButton, LoadingSpinner, NotificationToast
import sys


class CustomTitleBar(QWidget):
    """Custom title bar for frameless window"""

    minimize_clicked = Signal()
    close_clicked = Signal()

    def __init__(self, title="", parent=None):
        super().__init__(parent)
        self.setProperty("class", "TitleBar")
        self.setFixedHeight(40)
        self.title = title
        self.dragging = False
        self.drag_position = QPoint()

        self.setup_ui()

    def setup_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # Title label
        self.title_label = QLabel(self.title)
        self.title_label.setProperty("class", "TitleBar")
        layout.addWidget(self.title_label)

        layout.addStretch()

        # Window controls
        self.minimize_btn = QPushButton("─")
        self.minimize_btn.setProperty("class", "TitleButton")
        self.minimize_btn.clicked.connect(self.minimize_clicked.emit)
        layout.addWidget(self.minimize_btn)

        self.close_btn = QPushButton("✕")
        self.close_btn.setProperty("class", "TitleButton CloseButton")
        self.close_btn.clicked.connect(self.close_clicked.emit)
        layout.addWidget(self.close_btn)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.dragging = True
            self.drag_position = event.globalPosition().toPoint() - self.window().frameGeometry().topLeft()

    def mouseMoveEvent(self, event):
        if self.dragging and event.buttons() == Qt.LeftButton:
            self.window().move(event.globalPosition().toPoint() - self.drag_position)

    def mouseReleaseEvent(self, event):
        self.dragging = False


class PasswordLineEdit(CustomLineEdit):
    """Password input with show/hide toggle"""

    def __init__(self, placeholder="", parent=None):
        super().__init__(placeholder, parent)
        self.setEchoMode(QLineEdit.Password)

        # Toggle button
        self.toggle_action = QAction(self)
        self.toggle_action.setIcon(self.style().standardIcon(QStyle.SP_DialogNoButton))
        self.toggle_action.triggered.connect(self.toggle_visibility)
        self.addAction(self.toggle_action, QLineEdit.TrailingPosition)

        self.password_visible = False

    def toggle_visibility(self):
        if self.password_visible:
            self.setEchoMode(QLineEdit.Password)
            self.toggle_action.setIcon(self.style().standardIcon(QStyle.SP_DialogNoButton))
            self.password_visible = False
        else:
            self.setEchoMode(QLineEdit.Normal)
            self.toggle_action.setIcon(self.style().standardIcon(QStyle.SP_DialogYesButton))
            self.password_visible = True


class LoginWindow(QMainWindow):
    """Modern login window with animations and elegant styling"""

    login_successful = Signal(str)  # Emits username on successful login

    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.FramelessWindowHint)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setFixedSize(450, 600)

        # Center window on screen
        self.center_window()

        # Setup shadow effect
        self.setup_shadow_effect()

        # Create UI
        self.setup_ui()

        # Animation setup
        self.setup_animations()

        # Load stylesheet
        self.load_styles()

    def center_window(self):
        """Center window on the screen"""
        screen = QGuiApplication.primaryScreen().geometry()
        window_geometry = self.frameGeometry()
        center_point = screen.center()
        window_geometry.moveCenter(center_point)
        self.move(window_geometry.topLeft())

    def setup_shadow_effect(self):
        """Add drop shadow effect to window"""
        self.shadow = QGraphicsDropShadowEffect()
        self.shadow.setBlurRadius(15)
        self.shadow.setColor(QColor(0, 0, 0, 60))
        self.shadow.setOffset(0, 3)

    def setup_ui(self):
        # Main container
        main_widget = QWidget()
        main_widget.setProperty("class", "CustomWindow")
        main_widget.setGraphicsEffect(self.shadow)
        self.setCentralWidget(main_widget)

        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Custom title bar
        self.title_bar = CustomTitleBar("Sistema de Seguros - Login")
        self.title_bar.minimize_clicked.connect(self.showMinimized)
        self.title_bar.close_clicked.connect(self.close)
        main_layout.addWidget(self.title_bar)

        # Login content area
        content_widget = QWidget()
        content_widget.setProperty("class", "LoginWindow")
        main_layout.addWidget(content_widget)

        content_layout = QVBoxLayout(content_widget)
        content_layout.setContentsMargins(40, 40, 40, 40)
        content_layout.setSpacing(30)

        # Logo/Title area
        self.create_header(content_layout)

        # Login form
        self.create_login_form(content_layout)

        # Footer
        self.create_footer(content_layout)

        content_layout.addStretch()

    def create_header(self, parent_layout):
        """Create logo and title section"""
        header_layout = QVBoxLayout()
        header_layout.setSpacing(15)

        # Logo placeholder (you can add an actual logo here)
        logo_label = QLabel("🛡️")
        logo_label.setAlignment(Qt.AlignCenter)
        logo_label.setStyleSheet("font-size: 48px;")
        header_layout.addWidget(logo_label)

        # Title
        title_label = QLabel("Sistema de Gestión de Seguros")
        title_label.setProperty("class", "LoginTitle")
        title_label.setAlignment(Qt.AlignCenter)
        header_layout.addWidget(title_label)

        # Subtitle
        subtitle_label = QLabel("Ingresa tus credenciales para continuar")
        subtitle_label.setProperty("class", "LoginSubtitle")
        subtitle_label.setAlignment(Qt.AlignCenter)
        header_layout.addWidget(subtitle_label)

        parent_layout.addLayout(header_layout)

    def create_login_form(self, parent_layout):
        """Create login form with inputs and buttons"""
        # Login card
        login_card = QFrame()
        login_card.setProperty("class", "LoginCard")
        card_layout = QVBoxLayout(login_card)
        card_layout.setSpacing(20)
        card_layout.setContentsMargins(30, 30, 30, 30)

        # Username field
        user_layout = QVBoxLayout()
        user_label = QLabel("👤 Usuario")
        user_label.setStyleSheet("color: #7F8C8D; font-weight: 500; margin-bottom: 5px;")
        user_layout.addWidget(user_label)

        self.username_input = CustomLineEdit("Ingresa tu usuario")
        self.username_input.setText("admin")  # Pre-fill for demo
        user_layout.addWidget(self.username_input)
        card_layout.addLayout(user_layout)

        # Password field
        pass_layout = QVBoxLayout()
        pass_label = QLabel("🔒 Contraseña")
        pass_label.setStyleSheet("color: #7F8C8D; font-weight: 500; margin-bottom: 5px;")
        pass_layout.addWidget(pass_label)

        self.password_input = PasswordLineEdit("Ingresa tu contraseña")
        self.password_input.setText("123456")  # Pre-fill for demo
        pass_layout.addWidget(self.password_input)
        card_layout.addLayout(pass_layout)

        # Remember me checkbox
        options_layout = QHBoxLayout()
        self.remember_checkbox = QCheckBox("Recordar sesión")
        options_layout.addWidget(self.remember_checkbox)

        options_layout.addStretch()

        # Forgot password link
        forgot_link = QLabel('<a href="#" style="color: #D4AF37; text-decoration: none;">¿Olvidaste tu contraseña?</a>')
        forgot_link.setProperty("class", "LinkLabel")
        forgot_link.linkActivated.connect(self.show_forgot_password)
        options_layout.addWidget(forgot_link)

        card_layout.addLayout(options_layout)

        # Login button with loading spinner
        button_layout = QHBoxLayout()
        self.login_button = RippleButton("Iniciar Sesión")
        self.login_button.setProperty("class", "PrimaryButton")
        self.login_button.clicked.connect(self.attempt_login)
        button_layout.addWidget(self.login_button)

        self.loading_spinner = LoadingSpinner(24)
        self.loading_spinner.hide()
        button_layout.addWidget(self.loading_spinner)

        card_layout.addLayout(button_layout)

        parent_layout.addWidget(login_card)

        # Connect Enter key to login
        self.username_input.returnPressed.connect(self.attempt_login)
        self.password_input.returnPressed.connect(self.attempt_login)

    def create_footer(self, parent_layout):
        """Create footer with additional options"""
        footer_layout = QVBoxLayout()
        footer_layout.setSpacing(10)

        # Demo credentials info
        demo_info = QLabel("Demo: usuario 'admin', contraseña '123456'")
        demo_info.setAlignment(Qt.AlignCenter)
        demo_info.setStyleSheet("color: #95A5A6; font-size: 12px; font-style: italic;")
        footer_layout.addWidget(demo_info)

        # Copyright
        copyright_label = QLabel("© 2024 Sistema de Seguros. Todos los derechos reservados.")
        copyright_label.setAlignment(Qt.AlignCenter)
        copyright_label.setStyleSheet("color: #BDC3C7; font-size: 11px;")
        footer_layout.addWidget(copyright_label)

        parent_layout.addLayout(footer_layout)

    def setup_animations(self):
        """Setup entrance animations"""
        # Fade in animation
        self.fade_effect = QGraphicsOpacityEffect()
        self.setGraphicsEffect(self.fade_effect)

        self.fade_animation = QPropertyAnimation(self.fade_effect, b"opacity")
        self.fade_animation.setDuration(800)
        self.fade_animation.setStartValue(0)
        self.fade_animation.setEndValue(1)
        self.fade_animation.setEasingCurve(QEasingCurve.OutCubic)

        # Scale animation
        self.scale_animation = QPropertyAnimation(self, b"geometry")
        self.scale_animation.setDuration(600)
        self.scale_animation.setEasingCurve(QEasingCurve.OutBack)

    def showEvent(self, event):
        """Override show event to trigger entrance animation"""
        super().showEvent(event)
        self.start_entrance_animation()

    def start_entrance_animation(self):
        """Start the entrance animation sequence"""
        # Start from smaller size
        current_geometry = self.geometry()
        start_geometry = QRect(
            current_geometry.center().x() - 200,
            current_geometry.center().y() - 250,
            400,
            500
        )

        self.setGeometry(start_geometry)

        # Animate to full size
        self.scale_animation.setStartValue(start_geometry)
        self.scale_animation.setEndValue(current_geometry)
        self.scale_animation.start()

        # Fade in
        self.fade_animation.start()

    def load_styles(self):
        """Load and apply stylesheet"""
        try:
            with open("styles/styles.qss", "r", encoding="utf-8") as f:
                self.setStyleSheet(f.read())
        except FileNotFoundError:
            print("Warning: styles.qss not found")

    def attempt_login(self):
        """Handle login attempt with validation and animation"""
        username = self.username_input.text().strip()
        password = self.password_input.text().strip()

        # Basic validation
        if not username or not password:
            self.show_error_message("Por favor completa todos los campos")
            return

        # Disable login button and show spinner
        self.login_button.setEnabled(False)
        self.loading_spinner.start_animation()

        # Simulate authentication delay
        QTimer.singleShot(1500, lambda: self.validate_credentials(username, password))

    def validate_credentials(self, username, password):
        """Validate user credentials"""
        # Demo credentials
        if username == "admin" and password == "123456":
            self.show_success_message("¡Login exitoso!")
            QTimer.singleShot(1000, lambda: self.emit_login_success(username))
        else:
            self.show_error_message("Credenciales incorrectas")
            self.reset_login_form()

    def emit_login_success(self, username):
        """Emit login success signal"""
        self.login_successful.emit(username)

    def reset_login_form(self):
        """Reset form after failed login"""
        self.login_button.setEnabled(True)
        self.loading_spinner.stop_animation()

        # Shake animation for error feedback
        self.shake_animation()

    def shake_animation(self):
        """Shake window for error feedback"""
        original_pos = self.pos()

        self.shake_anim = QPropertyAnimation(self, b"pos")
        self.shake_anim.setDuration(400)
        self.shake_anim.setLoopCount(3)

        # Create shake effect
        shake_positions = [
            original_pos + QPoint(-10, 0),
            original_pos + QPoint(10, 0),
            original_pos
        ]

        for i, pos in enumerate(shake_positions):
            self.shake_anim.setKeyValueAt(i / len(shake_positions), pos)

        self.shake_anim.finished.connect(lambda: self.move(original_pos))
        self.shake_anim.start()

    def show_error_message(self, message):
        """Show error notification"""
        toast = NotificationToast(message, "error", 3000, self)
        toast.show_toast(self)

    def show_success_message(self, message):
        """Show success notification"""
        toast = NotificationToast(message, "success", 2000, self)
        toast.show_toast(self)

    def show_forgot_password(self):
        """Handle forgot password link"""
        msg = QMessageBox(self)
        msg.setWindowTitle("Recuperar Contraseña")
        msg.setText("Función de recuperación de contraseña no implementada en la demo.")
        msg.setInformativeText("En una aplicación real, aquí se enviaría un email de recuperación.")
        msg.setIcon(QMessageBox.Information)
        msg.exec()

    def keyPressEvent(self, event):
        """Handle key press events"""
        if event.key() == Qt.Key_Escape:
            self.close()
        super().keyPressEvent(event)


if __name__ == "__main__":
    app = QApplication(sys.argv)

    # Set application properties
    app.setApplicationName("Sistema de Seguros")
    app.setApplicationVersion("1.0")
    app.setOrganizationName("Insurance Corp")

    window = LoginWindow()
    window.show()

    sys.exit(app.exec())