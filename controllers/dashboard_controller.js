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

        this.charts = {}; // Store chart instances

        this.initElements();
        this.initEventListeners();
        this.loadUserSettings();
        this.applyUserSettings();
        this.loadMetrics();
        this.initCharts();
        this.startClock();
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

        // Fecha y hora
        this.currentDate = document.getElementById('currentDate');
        this.currentTime = document.getElementById('currentTime');

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
                    this.metricCobrosPendientes.textContent = this.formatCurrencyAbbreviated(metrics.cobros_pendientes || 0);
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

    formatCurrencyAbbreviated(amount) {
        const num = Number(amount || 0);
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return '$' + (num / 1000).toFixed(1) + 'K';
        } else {
            return '$' + num.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
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

    startClock() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();

        if (this.currentDate) {
            const dateOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            this.currentDate.textContent = now.toLocaleDateString('es-MX', dateOptions);
        }

        if (this.currentTime) {
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            this.currentTime.textContent = now.toLocaleTimeString('es-MX', timeOptions);
        }
    }

    async initCharts() {
        // Wait for DOM elements to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            await this.createPolizasTrendChart();
            await this.createAseguradorasChart();
            await this.createEstadosCobroChart();
            await this.createCobrosMensualesChart();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    async createPolizasTrendChart() {
        const canvas = document.getElementById('chartPolizasTrend');
        if (!canvas) return;

        try {
            const result = await window.electronAPI.dashboard.getPolizasTrend();
            const data = result.success && result.data ? result.data : [];

            const labels = data.map(item => item.mes || '');
            const values = data.map(item => item.total || 0);

            this.charts.polizasTrend = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Pólizas Emitidas',
                        data: values,
                        borderColor: '#2E86AB',
                        backgroundColor: 'rgba(46, 134, 171, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating polizas trend chart:', error);
        }
    }

    async createAseguradorasChart() {
        const canvas = document.getElementById('chartAseguradoras');
        if (!canvas) return;

        try {
            const result = await window.electronAPI.dashboard.getPolizasByAseguradora();
            const data = result.success && result.data ? result.data : [];

            const labels = data.map(item => item.aseguradora || 'Sin aseguradora');
            const values = data.map(item => item.total || 0);

            const colors = [
                '#1B4F72', '#2E86AB', '#F4D03F', '#A93226',
                '#27AE60', '#8E44AD', '#E67E22', '#34495E'
            ];

            this.charts.aseguradoras = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Número de Pólizas',
                        data: values,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating aseguradoras chart:', error);
        }
    }

    async createEstadosCobroChart() {
        const canvas = document.getElementById('chartEstadosCobro');
        if (!canvas) return;

        try {
            const result = await window.electronAPI.dashboard.getRecibosByEstado();
            const data = result.success && result.data ? result.data : [];

            const labels = data.map(item => item.estado_cobro || 'Sin estado');
            const values = data.map(item => item.total || 0);

            const colors = ['#27AE60', '#F4D03F', '#E67E22', '#A93226'];

            this.charts.estadosCobro = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating estados cobro chart:', error);
        }
    }

    async createCobrosMensualesChart() {
        const canvas = document.getElementById('chartCobrosMensuales');
        if (!canvas) return;

        try {
            const result = await window.electronAPI.dashboard.getCobrosMensuales();
            const data = result.success && result.data ? result.data : [];

            const labels = data.map(item => item.mes || '');
            const cobrado = data.map(item => item.cobrado || 0);
            const pendiente = data.map(item => item.pendiente || 0);

            this.charts.cobrosMensuales = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cobrado',
                            data: cobrado,
                            backgroundColor: '#27AE60',
                            borderWidth: 1
                        },
                        {
                            label: 'Pendiente',
                            data: pendiente,
                            backgroundColor: '#E67E22',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    },
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString('es-MX');
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating cobros mensuales chart:', error);
        }
    }
}

console.log('✅ DashboardController class loaded successfully');

// Register in global scope
window.DashboardController = DashboardController;
