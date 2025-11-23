// controllers/config_controller.js
// Controlador para la vista de Configuración (cuenta y seguridad)

class ConfigController {
    constructor() {
        this.accountForm = document.getElementById('accountForm');
        this.displayNameInput = document.getElementById('displayNameInput');
        this.usernameInput = document.getElementById('usernameInput');
        this.emailInput = document.getElementById('emailInput');
        this.accountStatus = document.getElementById('accountStatus');

        this.securityForm = document.getElementById('securityForm');
        this.currentPasswordInput = document.getElementById('currentPasswordInput');
        this.newPasswordInput = document.getElementById('newPasswordInput');
        this.confirmPasswordInput = document.getElementById('confirmPasswordInput');
        this.securityStatus = document.getElementById('securityStatus');

        this.user = this.getCurrentUser();
        this.displayName = this.getStoredDisplayName();

        this.populateAccountData();
        this.registerListeners();
    }

    getCurrentUser() {
        try {
            const stored = sessionStorage.getItem('userInfo');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('No se pudo leer la sesión del usuario:', error);
        }
        return {
            usuario_id: 1,
            username: 'admin',
            email: ''
        };
    }

    getStoredDisplayName() {
        try {
            const storedSettings = JSON.parse(localStorage.getItem('dashboardUserSettings') || '{}');
            return storedSettings.displayName || this.user.username || 'admin';
        } catch (error) {
            console.warn('No se pudo leer el nombre para mostrar almacenado:', error);
            return this.user.username || 'admin';
        }
    }

    populateAccountData() {
        if (this.displayNameInput) {
            this.displayNameInput.value = this.displayName || '';
        }
        if (this.usernameInput) {
            this.usernameInput.value = this.user.username || '';
        }
        if (this.emailInput) {
            this.emailInput.value = this.user.email || '';
        }
        this.updateNavNames();
    }

    registerListeners() {
        if (this.accountForm) {
            this.accountForm.addEventListener('submit', (event) => this.handleAccountSubmit(event));
        }
        if (this.securityForm) {
            this.securityForm.addEventListener('submit', (event) => this.handleSecuritySubmit(event));
        }
    }

    async handleAccountSubmit(event) {
        event.preventDefault();

        const displayName = this.displayNameInput?.value.trim() || 'admin';
        const username = this.usernameInput?.value.trim();
        const email = this.emailInput?.value.trim() || null;

        if (!username) {
            this.setStatus(this.accountStatus, 'error', 'El usuario es obligatorio.');
            return;
        }

        if (!window.electronAPI?.user?.updateProfile) {
            this.setStatus(this.accountStatus, 'error', 'La API de configuración no está disponible.');
            return;
        }

        this.setStatus(this.accountStatus, 'info', 'Guardando cambios...');

        try {
            const result = await window.electronAPI.user.updateProfile({
                usuario_id: this.user.usuario_id,
                username,
                email
            });

            if (!result?.success) {
                throw new Error(result?.message || 'No se pudo actualizar la cuenta.');
            }

            const updatedUser = {
                ...this.user,
                ...result.data
            };
            this.user = updatedUser;

            try {
                sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
            } catch (error) {
                console.warn('No se pudo actualizar la sesión en sessionStorage:', error);
            }

            this.persistDisplayName(displayName);
            this.updateNavNames();

            this.setStatus(this.accountStatus, 'success', 'Datos de cuenta actualizados.');
        } catch (error) {
            console.error('Error al actualizar cuenta:', error);
            this.setStatus(this.accountStatus, 'error', error.message || 'No se pudo actualizar la cuenta.');
        }
    }

    async handleSecuritySubmit(event) {
        event.preventDefault();

        const currentPassword = this.currentPasswordInput?.value || '';
        const newPassword = this.newPasswordInput?.value || '';
        const confirmPassword = this.confirmPasswordInput?.value || '';

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.setStatus(this.securityStatus, 'error', 'Completa todos los campos de seguridad.');
            return;
        }

        if (newPassword.length < 8) {
            this.setStatus(this.securityStatus, 'error', 'La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.setStatus(this.securityStatus, 'error', 'Las contraseñas nuevas no coinciden.');
            return;
        }

        if (!window.electronAPI?.user?.changePassword) {
            this.setStatus(this.securityStatus, 'error', 'La API de seguridad no está disponible.');
            return;
        }

        this.setStatus(this.securityStatus, 'info', 'Actualizando contraseña...');

        try {
            const result = await window.electronAPI.user.changePassword({
                usuario_id: this.user.usuario_id,
                currentPassword,
                newPassword
            });

            if (!result?.success) {
                throw new Error(result?.message || 'No se pudo cambiar la contraseña.');
            }

            this.setStatus(this.securityStatus, 'success', 'Contraseña actualizada correctamente.');
            this.currentPasswordInput.value = '';
            this.newPasswordInput.value = '';
            this.confirmPasswordInput.value = '';
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            this.setStatus(this.securityStatus, 'error', error.message || 'No se pudo cambiar la contraseña.');
        }
    }

    persistDisplayName(displayName) {
        this.displayName = displayName;
        try {
            const storedSettings = JSON.parse(localStorage.getItem('dashboardUserSettings') || '{}');
            const nextSettings = {
                ...storedSettings,
                displayName,
                email: this.user.email || storedSettings.email,
                theme: storedSettings.theme || 'default'
            };
            localStorage.setItem('dashboardUserSettings', JSON.stringify(nextSettings));
        } catch (error) {
            console.warn('No se pudo guardar el nombre para mostrar:', error);
        }
    }

    updateNavNames() {
        const nameForUI = this.displayName || this.user.username || 'admin';
        const sidebarUser = document.getElementById('userName');
        const welcomeUser = document.getElementById('welcomeUser');

        if (sidebarUser) {
            sidebarUser.textContent = nameForUI;
        }
        if (welcomeUser) {
            welcomeUser.textContent = nameForUI;
        }
    }

    setStatus(element, type, message) {
        if (!element) return;

        element.classList.remove(
            'hidden',
            'bg-red-50',
            'text-red-700',
            'border-red-200',
            'bg-green-50',
            'text-green-700',
            'border-green-200',
            'bg-blue-50',
            'text-blue-700',
            'border-blue-200',
            'border'
        );
        element.classList.add('border');

        if (type === 'success') {
            element.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
        } else if (type === 'info') {
            element.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
        } else {
            element.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
        }

        element.textContent = message;
    }
}

// Registrar en window para AppNavigation
window.ConfigController = ConfigController;
