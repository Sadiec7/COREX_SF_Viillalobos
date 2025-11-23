// controllers/login_controller.js

class LoginController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Conectar eventos - equivalente a la conexión de señales en Python
        this.init();
    }

    init() {
        // En el frontend, la vista ya maneja los eventos del DOM
        // y llama al controlador cuando es necesario
        console.log('LoginController initialized');
    }

    /**
     * Maneja el evento de clic en el botón de login.
     * Equivalente al método handle_login() del Python
     */
    async handleLogin() {
        const credentials = this.view.getCredentials();
        const { username, password } = credentials;

        // Validación básica
        if (!username || !password) {
            this.view.showMessage("Error", "El usuario y la contraseña no pueden estar vacíos.");
            return;
        }

        // Mostrar estado de carga
        this.view.setLoading(true);
        this.view.hideMessages();

        try {
            // Simular delay de red para mejor UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Usar IPC para comunicarse con el proceso principal
            const result = await window.electronAPI.authenticateUser(username, password);

            if (result.success) {
                // Mostrar animación de éxito en el botón
                this.view.showSuccessAnimation();

                // Persistir sesión básica para la app (sidebar, config)
                try {
                    sessionStorage.setItem('userInfo', JSON.stringify(result.user || {}));
                } catch (error) {
                    console.warn('No se pudo persistir la sesión en sessionStorage:', error);
                }

                // Transición inmediata al dashboard
                setTimeout(() => {
                    // Notificar al proceso principal del login exitoso
                    window.electronAPI.onLoginSuccess(result.user);
                }, 800);
            } else {
                this.view.showMessage("Error de Autenticación", "Usuario o contraseña incorrectos.");
                this.view.setLoading(false);
            }

        } catch (error) {
            console.error('Login error:', error);
            this.view.showMessage("Error", "Error de conexión. Inténtalo de nuevo.");
            this.view.setLoading(false);
        }
    }
}

// Export para uso en el renderer process
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginController;
}
