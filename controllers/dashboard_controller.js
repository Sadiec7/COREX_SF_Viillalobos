// controllers/dashboard_controller.js
// Controlador para el dashboard principal

class DashboardController {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.loadMetrics();
    }

    initElements() {
        // Metric cards
        this.metricTotalPolizas = document.getElementById('metricTotalPolizas');
        this.metricVencenSemana = document.getElementById('metricVencenSemana');
        this.metricCobrosPendientes = document.getElementById('metricCobrosPendientes');
        this.metricNuevosClientes = document.getElementById('metricNuevosClientes');

        // User info
        this.userName = document.getElementById('userName');
        this.welcomeUser = document.getElementById('welcomeUser');

        // Buttons
        this.logoutButton = document.getElementById('logoutButton');
    }

    initEventListeners() {
        // Logout button
        this.logoutButton.addEventListener('click', async () => {
            const confirmed = confirm('¿Estás seguro que deseas cerrar sesión?');
            if (confirmed) {
                await window.electronAPI.logout();
            }
        });
    }

    async loadMetrics() {
        try {
            // Load dashboard metrics
            const metricsResult = await window.electronAPI.dashboard.getMetrics();

            if (metricsResult.success && metricsResult.data) {
                const metrics = metricsResult.data;

                // Update metric cards
                if (this.metricTotalPolizas) {
                    this.metricTotalPolizas.textContent = metrics.total_polizas || 0;
                }

                if (this.metricVencenSemana) {
                    this.metricVencenSemana.textContent = metrics.polizas_vencen_7dias || 0;
                }

                if (this.metricCobrosPendientes) {
                    this.metricCobrosPendientes.textContent =
                        this.formatCurrency(metrics.cobros_pendientes || 0);
                }

                if (this.metricNuevosClientes) {
                    this.metricNuevosClientes.textContent = metrics.clientes_mes_actual || 0;
                }
            }

            // Load polizas with alerts
            await this.loadAlerts();

        } catch (error) {
            console.error('Error al cargar métricas:', error);
        }
    }

    async loadAlerts() {
        try {
            const alertsResult = await window.electronAPI.dashboard.getPolizasConAlertas();

            if (alertsResult.success && alertsResult.data && alertsResult.data.length > 0) {
                console.log('Alertas de pólizas:', alertsResult.data);
                // TODO: Display alerts in UI
            }

        } catch (error) {
            console.error('Error al cargar alertas:', error);
        }
    }

    formatCurrency(amount) {
        return '$' + parseFloat(amount).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}
