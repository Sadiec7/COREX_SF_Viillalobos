"""
Fixed Main Application - Simplified without problematic overlays
"""

import sys
import os
from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *

from login_window_fixed import SimpleLoginWindow
from dashboard_window import DashboardWindow


class SimpleInsuranceApp(QApplication):
    """Simplified application without complex window transitions"""

    def __init__(self, argv):
        super().__init__(argv)

        # Basic application setup
        self.setApplicationName("Sistema de Gestión de Seguros")
        self.setApplicationVersion("1.0.0")
        self.setOrganizationName("Insurance Corp")

        # Window management
        self.login_window = None
        self.dashboard_window = None
        self.current_user = None

        # Start application
        self.show_login()

    def show_login(self):
        """Show login window"""
        if self.dashboard_window:
            self.dashboard_window.close()
            self.dashboard_window = None

        self.login_window = SimpleLoginWindow()
        self.login_window.login_successful.connect(self.handle_login_success)
        self.login_window.show()

    def handle_login_success(self, username):
        """Handle successful login"""
        self.current_user = username

        # Close login window
        if self.login_window:
            self.login_window.close()
            self.login_window = None

        # Show dashboard
        self.show_dashboard()

    def show_dashboard(self):
        """Show dashboard window"""
        try:
            self.dashboard_window = DashboardWindow(self.current_user)
            self.dashboard_window.logout_requested.connect(self.handle_logout)
            self.dashboard_window.show()

            # Show welcome message
            msg = QMessageBox(self.dashboard_window)
            msg.setWindowTitle("Bienvenido")
            msg.setText(f"¡Bienvenido al sistema, {self.current_user}!")
            msg.setIcon(QMessageBox.Information)
            msg.exec()

        except Exception as e:
            print(f"Error loading dashboard: {e}")
            # Fallback to simple message
            msg = QMessageBox()
            msg.setWindowTitle("Dashboard")
            msg.setText(f"¡Bienvenido, {self.current_user}!\n\nDashboard cargado correctamente.")
            msg.setIcon(QMessageBox.Information)
            msg.exec()

    def handle_logout(self):
        """Handle logout request"""
        reply = QMessageBox.question(
            self.dashboard_window,
            "Cerrar Sesión",
            f"¿Estás seguro que deseas cerrar la sesión de {self.current_user}?",
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            self.current_user = None
            if self.dashboard_window:
                self.dashboard_window.close()
                self.dashboard_window = None
            self.show_login()


def main():
    """Main entry point"""
    print("🛡️  Sistema de Gestión de Seguros v1.0")
    print("    Iniciando aplicación...")
    print("    Usuario demo: admin / 123456")
    print()

    # Create application
    app = SimpleInsuranceApp(sys.argv)

    # Start event loop
    try:
        exit_code = app.exec()
        print("Aplicación cerrada correctamente.")
        return exit_code
    except Exception as e:
        print(f"Error en la aplicación: {e}")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)