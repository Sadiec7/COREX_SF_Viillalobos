# views/login_view.py
from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QMessageBox

class LoginView(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Inicio de Sesión - Gestor de Pólizas")
        self.layout = QVBoxLayout()

        # Componentes de la interfaz
        self.user_label = QLabel("Usuario:")
        self.user_input = QLineEdit()
        self.user_input.setPlaceholderText("Ej: admin")

        self.pass_label = QLabel("Contraseña:")
        self.pass_input = QLineEdit()
        self.pass_input.setEchoMode(QLineEdit.Password) # Ocultar contraseña
        self.pass_input.setPlaceholderText("Ej: 1234")


        self.login_button = QPushButton("Ingresar")

        # Añadir componentes al layout
        self.layout.addWidget(self.user_label)
        self.layout.addWidget(self.user_input)
        self.layout.addWidget(self.pass_label)
        self.layout.addWidget(self.pass_input)
        self.layout.addWidget(self.login_button)

        self.setLayout(self.layout)

    def get_credentials(self):
        """Devuelve el usuario y la contraseña ingresados."""
        return self.user_input.text(), self.pass_input.text()

    def show_message(self, title, message):
        """Muestra un diálogo de mensaje simple."""
        QMessageBox.information(self, title, message)