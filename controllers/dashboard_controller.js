// controllers/dashboard_controller.js
// Controlador para el dashboard principal con alertas y ajustes de usuario

class DashboardController {
    constructor() {
        this.alerts = [];
        this.userSettings = {
            displayName: 'admin',
            email: '',
            theme: 'default'
        };

        this.initElements();
        this.initEventListeners();
        this.loadUserSettings();
        this.applyUserSettings();
        this.loadMetrics();
    }

    initElements() {
        // Métricas
        this.metricTotalPolizas = document.getElementById('metricTotalPolizas');
        this.metricVencenSemana = document.getElementById('metricVencenSemana');
        this.metricCobrosPendientes = document.getElementById('metricCobrosPendientes');
        this.metricNuevosClientes = document.getElementById('metricNuevosClientes');

        // Información de usuario
        this.userName = document.getElementById('userName');
        this.welcomeUser = document.getElementById('welcomeUser');

        // Botones principales
        this.logoutButton = document.getElementById('logoutButton');
        this.btnAlerts = document.getElementById('btnAlerts');
        this.alertsBadge = document.getElementById('alertsBadge');
        this.alertsPanel = document.getElementById('alertsPanel');
        this.alertsList = document.getElementById('alertsList');
        this.alertsEmpty = document.getElementById('alertsEmpty');
        this.navConfig = document.getElementById('navConfig');

        // Modal de configuración de usuario
        this.userConfigModal = document.getElementById('userConfigModal');
        this.userConfigForm = document.getElementById('userConfigForm');
        this.btnCloseUserConfig = document.getElementById('btnCloseUserConfig');
        this.btnCancelUserConfig = document.getElementById('btnCancelUserConfig');
        this.inputUserDisplayName = document.getElementById('inputUserDisplayName');
        this.inputUserEmail = document.getElementById('inputUserEmail');
        this.inputUserTheme = document.getElementById('inputUserTheme');
    }

    initEventListeners() {
        if (this.logoutButton) {
            this.logoutButton.addEventListener('click', async () => {
                let confirmed = false;
                if (window.confirmModal) {
                    confirmed = await window.confirmModal.show({
                        title: 'Cerrar sesión',
                        message: '¿Estás seguro que deseas cerrar sesión?',
                        type: 'warning',
                        confirmText: 'Cerrar sesión',
                        cancelText: 'Cancelar'
                    });
                } else {
                    confirmed = confirm('¿Estás seguro que deseas cerrar sesión?');
                }

                if (confirmed) {
                    await window.electronAPI.logout();
                }
            });
        }

        if (this.btnAlerts) {
            this.btnAlerts.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleAlertsPanel();
            });
        }
        if (this.alertsPanel) {
            this.alertsPanel.addEventListener('click', (event) => event.stopPropagation());
        }
        document.addEventListener('click', (event) => {
            if (!this.alertsPanel || !this.btnAlerts) return;
            const clickedInsidePanel = this.alertsPanel.contains(event.target);
            const clickedButton = this.btnAlerts.contains(event.target);
            if (!clickedInsidePanel && !clickedButton) {
                this.closeAlertsPanel();
            }
        });

        if (this.navConfig) {
            this.navConfig.addEventListener('click', (event) => {
                event.preventDefault();
                this.closeAlertsPanel();
                this.openUserConfigModal();
            });
        }
        if (this.btnCloseUserConfig) {
            this.btnCloseUserConfig.addEventListener('click', () => this.closeUserConfigModal());
        }
        if (this.btnCancelUserConfig) {
            this.btnCancelUserConfig.addEventListener('click', () => this.closeUserConfigModal());
        }
        if (this.userConfigModal) {
            this.userConfigModal.addEventListener('click', (event) => {
                if (event.target === this.userConfigModal) {
                    this.closeUserConfigModal();
                }
            });
        }
        if (this.userConfigForm) {
            this.userConfigForm.addEventListener('submit', (event) => this.handleUserConfigSubmit(event));
        }
    }

    async loadMetrics() {
        try {
            const metricsResult = await window.electronAPI.dashboard.getMetrics();

            if (metricsResult.success && metricsResult.data) {
                const metrics = metricsResult.data;

                if (this.metricTotalPolizas) {
                    this.metricTotalPolizas.textContent = metrics.total_polizas || 0;
                }

                if (this.metricVencenSemana) {
                    this.metricVencenSemana.textContent = metrics.polizas_vencen_7dias || 0;
                }

                if (this.metricCobrosPendientes) {
                    this.metricCobrosPendientes.textContent = this.formatCurrency(metrics.cobros_pendientes || 0);
                }

                if (this.metricNuevosClientes) {
                    this.metricNuevosClientes.textContent = metrics.clientes_mes_actual || 0;
                }
            }

            await this.loadAlerts();
        } catch (error) {
            console.error('Error al cargar métricas:', error);
            await this.loadAlerts();
        }
    }

    async loadAlerts() {
        try {
            const alertsResult = await window.electronAPI.dashboard.getPolizasConAlertas();
            if (alertsResult.success && Array.isArray(alertsResult.data)) {
                this.alerts = alertsResult.data;
            } else {
                this.alerts = [];
            }
            this.updateAlertsUI();
        } catch (error) {
            console.error('Error al cargar alertas:', error);
            this.alerts = [];
            this.updateAlertsUI();
        }
    }

    updateAlertsUI() {
        if (!this.alertsList || !this.alertsEmpty || !this.alertsBadge) {
            return;
        }

        // Limpiar tarjetas anteriores
        this.alertsList.querySelectorAll('.alert-card').forEach((node) => node.remove());

        if (!this.alerts.length) {
            this.alertsEmpty.classList.remove('hidden');
            this.alertsBadge.classList.add('hidden');
            this.closeAlertsPanel();
            return;
        }

        this.alertsEmpty.classList.add('hidden');
        this.alertsBadge.textContent = this.alerts.length;
        this.alertsBadge.classList.remove('hidden');

        this.alerts.forEach((alert) => {
            const card = document.createElement('div');
            card.className = `alert-card border rounded-lg p-4 ${this.getAlertTone(alert.dias_para_vencer)}`;

            const clienteLabel = alert.cliente_nombre ? this.escapeHtml(alert.cliente_nombre) : 'Cliente sin nombre';
            const aseguradora = alert.aseguradora_nombre ? this.escapeHtml(alert.aseguradora_nombre) : 'Sin aseguradora';
            const ramo = alert.ramo_nombre ? this.escapeHtml(alert.ramo_nombre) : 'Sin ramo';
            const vigencia = this.formatDate(alert.vigencia_fin);
            const diasRestantes = this.formatDays(alert.dias_para_vencer);

            card.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <p class="text-navy-700 font-semibold">Póliza ${this.escapeHtml(alert.numero_poliza || '#')}</p>
                        <p class="text-sm text-gray-600">${clienteLabel}</p>
                        <p class="text-xs text-gray-500">${aseguradora} · ${ramo}</p>
                    </div>
                    <div class="text-sm text-right md:text-left">
                        <p class="font-semibold">${vigencia}</p>
                        <p class="text-xs">${diasRestantes}</p>
                    </div>
                </div>
            `;

            this.alertsList.appendChild(card);
        });
    }

    loadUserSettings() {
        try {
            const stored = localStorage.getItem('dashboardUserSettings');
            const defaults = {
                displayName: this.userName?.textContent?.trim() || 'admin',
                email: '',
                theme: 'default'
            };

            if (stored) {
                const parsed = JSON.parse(stored);
                this.userSettings = { ...defaults, ...parsed };
            } else {
                this.userSettings = defaults;
            }
        } catch (error) {
            console.warn('No se pudo leer la configuración de usuario almacenada:', error);
            this.userSettings = {
                displayName: this.userName?.textContent?.trim() || 'admin',
                email: '',
                theme: 'default'
            };
        }
    }

    applyUserSettings() {
        const displayName = this.userSettings.displayName?.trim() || 'admin';

        if (this.userName) {
            this.userName.textContent = displayName;
        }
        if (this.welcomeUser) {
            this.welcomeUser.textContent = displayName;
        }

        if (this.inputUserDisplayName) {
            this.inputUserDisplayName.value = this.userSettings.displayName || '';
        }
        if (this.inputUserEmail) {
            this.inputUserEmail.value = this.userSettings.email || '';
        }
        if (this.inputUserTheme) {
            this.inputUserTheme.value = this.userSettings.theme || 'default';
        }

        this.applyTheme(this.userSettings.theme);
    }

    handleUserConfigSubmit(event) {
        event.preventDefault();

        const displayName = this.inputUserDisplayName?.value.trim() || 'admin';
        const email = this.inputUserEmail?.value.trim() || '';
        const theme = this.inputUserTheme?.value || 'default';

        this.userSettings = { displayName, email, theme };
        this.saveUserSettings();
        this.applyUserSettings();

        if (window.showSuccess) {
            window.showSuccess('Configuración de usuario actualizada correctamente');
        } else {
            alert('Configuración de usuario actualizada correctamente.');
        }

        this.closeUserConfigModal();
    }

    saveUserSettings() {
        try {
            localStorage.setItem('dashboardUserSettings', JSON.stringify(this.userSettings));
        } catch (error) {
            console.warn('No se pudo guardar la configuración de usuario:', error);
        }
    }

    toggleAlertsPanel() {
        if (!this.alertsPanel) return;
        this.alertsPanel.classList.toggle('hidden');
    }

    closeAlertsPanel() {
        if (!this.alertsPanel) return;
        this.alertsPanel.classList.add('hidden');
    }

    openUserConfigModal() {
        if (!this.userConfigModal) return;
        this.closeAlertsPanel();
        this.applyUserSettings();
        this.userConfigModal.classList.add('active');
    }

    closeUserConfigModal() {
        if (!this.userConfigModal) return;
        this.userConfigModal.classList.remove('active');
    }

    formatCurrency(amount) {
        return '$' + parseFloat(amount).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Sin fecha';
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) {
            return 'Sin fecha';
        }
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatDays(days) {
        if (typeof days !== 'number') {
            return 'Sin información';
        }

        if (days < 0) {
            return 'Vencida';
        }

        if (days === 0) {
            return 'Vence hoy';
        }

        if (days === 1) {
            return 'Vence en 1 día';
        }

        return `Vence en ${days} días`;
    }

    getAlertTone(days) {
        if (typeof days !== 'number') {
            return 'border-gray-200 bg-gray-50';
        }

        if (days <= 7) {
            return 'border-red-200 bg-red-50';
        }

        if (days <= 15) {
            return 'border-yellow-200 bg-yellow-50';
        }

        return 'border-blue-200 bg-blue-50';
    }

    applyTheme(theme) {
        document.body.classList.remove('theme-dark');

        if (theme === 'oscuro') {
            document.body.classList.add('theme-dark');
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardController = new DashboardController();
});
