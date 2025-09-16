"""
Modern Insurance Management System - Main Application
Elegant PySide6 application demonstrating native desktop UI capabilities
"""

import sys
import os
from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *

from login_window import LoginWindow
from dashboard_window import DashboardWindow
from widgets.custom_widgets import NotificationToast


class InsuranceApplication(QApplication):
    """Main application class with theme management and window coordination"""

    def __init__(self, argv):
        super().__init__(argv)

        # Application settings
        self.setApplicationName("Sistema de Gestión de Seguros")
        self.setApplicationVersion("1.0.0")
        self.setOrganizationName("Insurance Corp")
        self.setOrganizationDomain("insurance-corp.com")

        # Set application icon (if available)
        self.setWindowIcon(QIcon())  # You can add an icon file here

        # Theme and styling
        self.setup_application_style()

        # Window management
        self.login_window = None
        self.dashboard_window = None
        self.current_user = None

        # Load global stylesheet
        self.load_global_styles()

        # Start with login
        self.show_login()

    def setup_application_style(self):
        """Configure application-wide style settings"""
        # Set style (you can experiment with different styles)
        # Available styles: 'Windows', 'Fusion', etc.
        self.setStyle('Fusion')

        # Set application palette for dark/light theme support
        palette = QPalette()

        # Light theme colors (you can implement dark theme toggle later)
        palette.setColor(QPalette.Window, QColor(248, 249, 250))
        palette.setColor(QPalette.WindowText, QColor(44, 62, 80))
        palette.setColor(QPalette.Base, QColor(255, 255, 255))
        palette.setColor(QPalette.AlternateBase, QColor(241, 243, 244))
        palette.setColor(QPalette.ToolTipBase, QColor(44, 62, 80))
        palette.setColor(QPalette.ToolTipText, QColor(255, 255, 255))
        palette.setColor(QPalette.Text, QColor(44, 62, 80))
        palette.setColor(QPalette.Button, QColor(248, 249, 250))
        palette.setColor(QPalette.ButtonText, QColor(44, 62, 80))
        palette.setColor(QPalette.BrightText, QColor(231, 76, 60))
        palette.setColor(QPalette.Link, QColor(212, 175, 55))
        palette.setColor(QPalette.Highlight, QColor(212, 175, 55))
        palette.setColor(QPalette.HighlightedText, QColor(255, 255, 255))

        self.setPalette(palette)

    def load_global_styles(self):
        """Load and apply global stylesheet"""
        try:
            styles_path = os.path.join(os.path.dirname(__file__), "styles", "styles.qss")
            with open(styles_path, "r", encoding="utf-8") as f:
                self.setStyleSheet(f.read())
        except FileNotFoundError:
            print("Warning: Could not load styles.qss file")
            # Fallback to minimal styling
            self.apply_fallback_styles()

    def apply_fallback_styles(self):
        """Apply minimal fallback styles if QSS file is not found"""
        fallback_style = """
            QMainWindow {
                background-color: #F8F9FA;
                color: #2C3E50;
                font-family: 'Segoe UI', 'Arial', sans-serif;
            }

            QPushButton {
                background-color: #D4AF37;
                color: #1B4F72;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                font-weight: 600;
            }

            QPushButton:hover {
                background-color: #B7950B;
            }

            QLineEdit {
                border: 2px solid #E8E8E8;
                border-radius: 6px;
                padding: 8px 12px;
                background-color: #FFFFFF;
            }

            QLineEdit:focus {
                border-color: #D4AF37;
            }
        """
        self.setStyleSheet(fallback_style)

    def show_login(self):
        """Display login window"""
        if self.dashboard_window:
            self.dashboard_window.close()
            self.dashboard_window = None

        self.login_window = LoginWindow()
        self.login_window.login_successful.connect(self.handle_login_success)
        self.login_window.show()

    def handle_login_success(self, username):
        """Handle successful login"""
        self.current_user = username

        # Close login window with animation
        if self.login_window:
            self.animate_window_close(self.login_window, self.show_dashboard)

    def animate_window_close(self, window, callback):
        """Animate window closing with fade effect"""
        if not window:
            if callback:
                callback()
            return

        # Create fade out animation
        effect = QGraphicsOpacityEffect()
        window.setGraphicsEffect(effect)

        animation = QPropertyAnimation(effect, b"opacity")
        animation.setDuration(500)
        animation.setStartValue(1.0)
        animation.setEndValue(0.0)
        animation.setEasingCurve(QEasingCurve.OutCubic)

        # Close window and execute callback when animation finishes
        animation.finished.connect(lambda: self.finish_window_transition(window, callback))
        animation.start()

    def finish_window_transition(self, window, callback):
        """Complete window transition"""
        window.close()
        if callback:
            callback()

    def show_dashboard(self):
        """Display dashboard window"""
        self.login_window = None

        self.dashboard_window = DashboardWindow(self.current_user)
        self.dashboard_window.logout_requested.connect(self.handle_logout)

        # Show dashboard with entrance animation
        self.dashboard_window.show()
        self.dashboard_window.show_welcome_message()

    def handle_logout(self):
        """Handle user logout"""
        reply = QMessageBox.question(
            self.dashboard_window,
            "Confirmar Cierre de Sesión",
            f"¿Estás seguro que deseas cerrar la sesión de {self.current_user}?",
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            # Show logout toast
            if self.dashboard_window:
                logout_toast = NotificationToast(
                    "Cerrando sesión...",
                    "info",
                    2000,
                    self.dashboard_window
                )
                logout_toast.show_toast(self.dashboard_window)

            # Delay to show toast, then logout
            QTimer.singleShot(1500, self.complete_logout)

    def complete_logout(self):
        """Complete the logout process"""
        self.current_user = None

        if self.dashboard_window:
            self.animate_window_close(self.dashboard_window, self.show_login)

    def closeEvent(self, event):
        """Handle application close event"""
        reply = QMessageBox.question(
            None,
            "Salir de la Aplicación",
            "¿Estás seguro que deseas salir del sistema?",
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            # Save any pending data here
            self.save_application_state()
            event.accept()
        else:
            event.ignore()

    def save_application_state(self):
        """Save application state before closing"""
        # In a real application, you might save:
        # - User preferences
        # - Window positions and sizes
        # - Temporary data
        # - Session information

        # For this demo, we'll just print a message
        print("Saving application state...")

        # You could use QSettings for persistent storage:
        # settings = QSettings()
        # settings.setValue("last_user", self.current_user)
        # settings.setValue("window_geometry", self.dashboard_window.saveGeometry())

    def load_application_state(self):
        """Load saved application state"""
        # Load settings when application starts
        # settings = QSettings()
        # last_user = settings.value("last_user", "")
        pass

    @staticmethod
    def exception_hook(exctype, value, traceback):
        """Global exception handler for better error reporting"""
        print(f"Uncaught exception: {exctype.__name__}: {value}")
        import traceback as tb
        tb.print_exception(exctype, value, traceback)

        # In a production app, you might want to:
        # - Log errors to a file
        # - Send error reports to a server
        # - Show user-friendly error dialogs

        # For now, show a simple error dialog
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Critical)
        msg.setWindowTitle("Error de Aplicación")
        msg.setText("Se ha producido un error inesperado.")
        msg.setInformativeText(f"Error: {exctype.__name__}: {value}")
        msg.setDetailedText(tb.format_exception(exctype, value, traceback))
        msg.exec()


def setup_high_dpi_support():
    """Configure high DPI display support"""
    # Enable high DPI scaling
    QApplication.setAttribute(Qt.AA_EnableHighDpiScaling, True)
    QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps, True)

    # Set DPI scale factor policy
    QApplication.setHighDpiScaleFactorRoundingPolicy(
        Qt.HighDpiScaleFactorRoundingPolicy.PassThrough
    )


def main():
    """Main application entry point"""
    # Setup high DPI support before creating QApplication
    setup_high_dpi_support()

    # Create application instance
    app = InsuranceApplication(sys.argv)

    # Install global exception handler
    sys.excepthook = app.exception_hook

    # Load application state
    app.load_application_state()

    # Show startup message
    print("🛡️  Sistema de Gestión de Seguros v1.0")
    print("    Iniciando aplicación...")
    print("    Usuario demo: admin / 123456")
    print()

    # Start event loop
    try:
        exit_code = app.exec()
        print("Aplicación cerrada correctamente.")
        return exit_code
    except Exception as e:
        print(f"Error crítico en la aplicación: {e}")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)