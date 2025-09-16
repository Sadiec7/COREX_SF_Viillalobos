# controllers/login_controller.py
from views.login_view import LoginView
from models.user_model import UserModel

class LoginController:
    def __init__(self, model: UserModel, view: LoginView):
        self.model = model
        self.view = view
        # Conectar la señal del botón de la vista a un método del controlador
        self.view.login_button.clicked.connect(self.handle_login)

    def handle_login(self):
        """Maneja el evento de clic en el botón de login."""
        username, password = self.view.get_credentials()

        if not username or not password:
            self.view.show_message("Error", "El usuario y la contraseña no pueden estar vacíos.")
            return

        # Pedir al modelo que verifique las credenciales
        if self.model.check_credentials(username, password):
            self.view.show_message("Éxito", "¡Inicio de sesión correcto!")
            # Aquí iría la lógica para abrir la ventana principal de la aplicación
            self.view.close() 
        else:
            self.view.show_message("Error de Autenticación", "Usuario o contraseña incorrectos.")