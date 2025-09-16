# main.py
import sys
from PySide6.QtWidgets import QApplication

from models.user_model import UserModel
from views.login_view import LoginView
from controllers.login_controller import LoginController

if __name__ == "__main__":
    app = QApplication(sys.argv)

    # 1. Crear instancias de Modelo y Vista
    user_model = UserModel()
    login_view = LoginView()

    # 2. Crear el Controlador y pasarle el modelo y la vista
    login_controller = LoginController(model=user_model, view=login_view)

    # 3. Mostrar la vista
    login_view.show()

    # Ejecutar la aplicación
    sys.exit(app.exec())