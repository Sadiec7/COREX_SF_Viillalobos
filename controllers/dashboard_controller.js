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

        // Filtro de fecha por defecto: últimos 30 días
        this.dateFilter = {
            days: 30,
            label: '30 días'
        };

        this.initElements();
        this.initEventListeners();
        this.setupDateFilters();
        // this.setupDrillDownListeners(); // Deshabilitado temporalmente
        this.loadUserSettings();
        this.applyUserSettings();
        this.loadMetrics();
        this.initCharts();
        this.startClock();
    }

    initElements() {
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

    setupDateFilters() {
        // Botones de filtros rápidos
        const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filterValue = btn.getAttribute('data-filter');

                // Remover clase active de todos los botones
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'border-navy-500', 'bg-navy-50', 'text-navy-700', 'font-medium');
                    b.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
                });

                // Agregar clase active al botón clickeado
                btn.classList.add('active', 'border-navy-500', 'bg-navy-50', 'text-navy-700', 'font-medium');
                btn.classList.remove('border-gray-300', 'bg-white');

                // Actualizar filtro
                if (filterValue === 'all') {
                    this.dateFilter = { label: 'Todo el historial' };
                    document.getElementById('activeRangeIndicator').textContent = 'Mostrando todo el historial';
                } else {
                    const days = parseInt(filterValue);
                    this.dateFilter = { days, label: `${days} días` };
                    const label = days === 7 ? '7 días' : days === 30 ? '30 días' : days === 90 ? '90 días' : '1 año';
                    document.getElementById('activeRangeIndicator').textContent = `Mostrando últimos ${label}`;
                }

                // Recargar datos
                this.loadMetrics();
            });
        });

        // Botón personalizado
        const btnCustomRange = document.getElementById('btnCustomRange');
        const customRangePanel = document.getElementById('customRangePanel');
        const btnApplyCustomRange = document.getElementById('btnApplyCustomRange');
        const btnCancelCustomRange = document.getElementById('btnCancelCustomRange');

        if (btnCustomRange) {
            btnCustomRange.addEventListener('click', (e) => {
                e.preventDefault();
                customRangePanel.classList.toggle('hidden');
            });
        }

        if (btnApplyCustomRange) {
            btnApplyCustomRange.addEventListener('click', (e) => {
                e.preventDefault();
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;

                if (!startDate || !endDate) {
                    alert('Por favor selecciona ambas fechas');
                    return;
                }

                if (new Date(startDate) > new Date(endDate)) {
                    alert('La fecha de inicio debe ser anterior a la fecha fin');
                    return;
                }

                // Remover clase active de todos los botones
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'border-navy-500', 'bg-navy-50', 'text-navy-700', 'font-medium');
                    b.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
                });

                // Marcar botón personalizado como activo
                btnCustomRange.classList.add('active', 'border-navy-500', 'bg-navy-50', 'text-navy-700', 'font-medium');
                btnCustomRange.classList.remove('border-gray-300', 'bg-white');

                this.dateFilter = {
                    startDate,
                    endDate,
                    label: 'Personalizado'
                };
                document.getElementById('activeRangeIndicator').textContent = `Mostrando del ${startDate} al ${endDate}`;

                customRangePanel.classList.add('hidden');

                // Recargar datos
                this.loadMetrics();
            });
        }

        if (btnCancelCustomRange) {
            btnCancelCustomRange.addEventListener('click', (e) => {
                e.preventDefault();
                customRangePanel.classList.add('hidden');
            });
        }

        // Cerrar panel al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (customRangePanel && !customRangePanel.classList.contains('hidden')) {
                const clickedInsidePanel = customRangePanel.contains(e.target);
                const clickedButton = btnCustomRange && btnCustomRange.contains(e.target);

                if (!clickedInsidePanel && !clickedButton) {
                    customRangePanel.classList.add('hidden');
                }
            }
        });
    }

    async loadMetrics() {
        try {
            const metricsResult = await window.electronAPI.dashboard.getMetrics(this.dateFilter);

            if (metricsResult.success && metricsResult.data) {
                const m = metricsResult.data;

                // ===== ATENCIÓN URGENTE =====
                const urgentVencenHoyCount = document.getElementById('urgentVencenHoyCount');
                const urgentVencenHoyMonto = document.getElementById('urgentVencenHoyMonto');
                const urgentAtrasados30Count = document.getElementById('urgentAtrasados30Count');
                const urgentAtrasados30Monto = document.getElementById('urgentAtrasados30Monto');
                const urgentRenovar30Count = document.getElementById('urgentRenovar30Count');
                const urgentRenovar30Riesgo = document.getElementById('urgentRenovar30Riesgo');

                if (urgentVencenHoyCount) urgentVencenHoyCount.textContent = m.urgente_vencen_hoy_count || 0;
                if (urgentVencenHoyMonto) urgentVencenHoyMonto.textContent = this.formatCurrency(m.urgente_vencen_hoy_monto || 0);
                if (urgentAtrasados30Count) urgentAtrasados30Count.textContent = m.urgente_atrasados_30_count || 0;
                if (urgentAtrasados30Monto) urgentAtrasados30Monto.textContent = this.formatCurrency(m.urgente_atrasados_30_monto || 0);
                if (urgentRenovar30Count) urgentRenovar30Count.textContent = m.urgente_renovar_30_count || 0;
                if (urgentRenovar30Riesgo) urgentRenovar30Riesgo.textContent = this.formatCurrency(m.urgente_renovar_30_riesgo || 0);

                // ===== SALUD DEL NEGOCIO =====
                const metricCobradoMes = document.getElementById('metricCobradoMes');
                const metricCobradoMesTrend = document.getElementById('metricCobradoMesTrend');
                const metricPorCobrar = document.getElementById('metricPorCobrar');
                const metricVencen7Dias = document.getElementById('metricVencen7Dias');
                const metricMorosidad = document.getElementById('metricMorosidad');
                const metricMorosidadTrend = document.getElementById('metricMorosidadTrend');
                const metricEfectividad = document.getElementById('metricEfectividad');

                if (metricCobradoMes) {
                    metricCobradoMes.textContent = this.formatCurrencyAbbreviated(m.cobrado_mes || 0);
                }

                if (metricCobradoMesTrend) {
                    const cambio = m.cobrado_mes - m.cobrado_mes_anterior;
                    const porcentaje = m.cobrado_mes_anterior > 0 ? (cambio / m.cobrado_mes_anterior) * 100 : 0;
                    const arrow = cambio >= 0 ? '↑' : '↓';
                    const color = cambio >= 0 ? 'text-green-600' : 'text-red-600';
                    metricCobradoMesTrend.textContent = `${arrow} ${Math.abs(porcentaje).toFixed(1)}%`;
                    metricCobradoMesTrend.className = `text-sm font-semibold ${color}`;
                }

                if (metricPorCobrar) {
                    metricPorCobrar.textContent = this.formatCurrencyAbbreviated(m.por_cobrar || 0);
                }

                if (metricVencen7Dias) {
                    metricVencen7Dias.textContent = this.formatCurrencyAbbreviated(m.vencen_7_dias || 0);
                }

                if (metricMorosidad) {
                    metricMorosidad.textContent = (m.tasa_morosidad || 0).toFixed(1) + '%';
                }

                if (metricMorosidadTrend) {
                    const cambio = m.tasa_morosidad - (m.tasa_morosidad_anterior || m.tasa_morosidad);
                    const arrow = cambio <= 0 ? '↓' : '↑'; // Invertido: bajar es bueno
                    const color = cambio <= 0 ? 'text-green-600' : 'text-red-600';
                    metricMorosidadTrend.textContent = `${arrow} ${Math.abs(cambio).toFixed(1)}%`;
                    metricMorosidadTrend.className = `text-sm font-semibold ${color}`;
                }

                if (metricEfectividad) {
                    metricEfectividad.textContent = (m.efectividad_cobro || 0).toFixed(1) + '%';
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
            await this.createAntiguedadSaldosChart();
            await this.createTop5ClientesSection();
            await this.createFlujoCajaChart();
            await this.createPolizasTrendChart();
            await this.createAseguradorasChart();
            await this.createEstadosCobroChart();
            await this.createCobrosMensualesChart();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    async createAntiguedadSaldosChart() {
        const canvas = document.getElementById('chartAntiguedadSaldos');
        if (!canvas) return;

        try {
            const result = await window.electronAPI.dashboard.getAntiguedadSaldos();
            const data = result.success && result.data ? result.data : {};

            // Actualizar valores en texto
            document.getElementById('saldoAlDia').textContent = this.formatCurrencyAbbreviated(data.al_dia || 0);
            document.getElementById('saldo1_30').textContent = this.formatCurrencyAbbreviated(data.dias_1_30 || 0);
            document.getElementById('saldo31_60').textContent = this.formatCurrencyAbbreviated(data.dias_31_60 || 0);
            document.getElementById('saldo60Plus').textContent = this.formatCurrencyAbbreviated(data.dias_60_plus || 0);

            const totalSaldos = (data.al_dia || 0) + (data.dias_1_30 || 0) + (data.dias_31_60 || 0) + (data.dias_60_plus || 0);

            this.charts.antiguedadSaldos = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['Al día', '1-30 días', '31-60 días', '+60 días'],
                    datasets: [{
                        label: 'Monto',
                        data: [data.al_dia || 0, data.dias_1_30 || 0, data.dias_31_60 || 0, data.dias_60_plus || 0],
                        backgroundColor: ['#10B981', '#F59E0B', '#F97316', '#DC2626'],
                        borderWidth: 2,
                        borderColor: '#fff',
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(30, 58, 95, 0.95)',
                            padding: 12,
                            titleColor: '#D4AF37',
                            bodyColor: '#fff',
                            borderColor: '#D4AF37',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed.y;
                                    const percentage = totalSaldos > 0 ? ((value / totalSaldos) * 100).toFixed(1) : 0;
                                    return [
                                        `Monto: $${value.toLocaleString('es-MX')}`,
                                        `Porcentaje: ${percentage}%`,
                                        `Total adeudado: $${totalSaldos.toLocaleString('es-MX')}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => '$' + (value / 1000).toFixed(0) + 'K',
                                color: '#6B7280'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating antigüedad saldos chart:', error);
        }
    }

    async createTop5ClientesSection() {
        const container = document.getElementById('top5ClientesContainer');
        if (!container) return;

        try {
            const result = await window.electronAPI.dashboard.getTop5Clientes();
            const data = result.success && result.data ? result.data : {};

            const clientes = data.clientes || [];
            const porcentajeTotal = data.porcentaje_total || 0;

            // Actualizar porcentaje total
            document.getElementById('top5Percentage').textContent = porcentajeTotal.toFixed(1) + '%';
            document.getElementById('top5ProgressBar').style.width = Math.min(porcentajeTotal, 100) + '%';

            // Mostrar alerta si concentración > 60%
            const warningEl = document.getElementById('top5Warning');
            if (warningEl) {
                if (porcentajeTotal > 60) {
                    warningEl.classList.remove('hidden');
                } else {
                    warningEl.classList.add('hidden');
                }
            }

            // Renderizar clientes
            container.innerHTML = clientes.map((cliente, index) => {
                const porcentajeWidth = Math.min(cliente.porcentaje || 0, 100);
                const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];
                return `
                    <div class="animate-slide-in" style="animation-delay: ${0.9 + (index * 0.1)}s">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm font-semibold text-navy-700 truncate">${this.escapeHtml(cliente.nombre || 'Sin nombre')}</span>
                            <span class="text-sm font-bold text-purple-700 ml-2">${cliente.porcentaje.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar-container" style="height: 6px;">
                            <div class="progress-bar-fill" style="width: ${porcentajeWidth}%; background: ${colors[index] || colors[4]};"></div>
                        </div>
                        <div class="flex items-center justify-between mt-1 text-xs text-gray-600">
                            <span>${this.formatCurrencyAbbreviated(cliente.prima_total || 0)}</span>
                            <span>${cliente.num_polizas || 0} póliza(s)</span>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error creating top 5 clientes section:', error);
        }
    }

    async createFlujoCajaChart() {
        const canvas = document.getElementById('chartFlujoCaja');
        if (!canvas) return;

        try {
            const result = await window.electronAPI.dashboard.getFlujoCajaProyectado();
            const data = result.success && result.data ? result.data : {};

            // Actualizar tarjetas de resumen
            document.getElementById('flujoCajaEsperado').textContent = this.formatCurrencyAbbreviated(data.total_esperado || 0);
            document.getElementById('flujoCajaProyectado').textContent = this.formatCurrencyAbbreviated(data.total_proyectado || 0);
            const brecha = (data.total_esperado || 0) - (data.total_proyectado || 0);
            document.getElementById('flujoCajaBrecha').textContent = this.formatCurrencyAbbreviated(brecha);

            const flujoMensual = data.meses || [];
            const labels = flujoMensual.map(item => {
                const [year, month] = (item.mes || '').split('-');
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return monthNames[parseInt(month) - 1] || '';
            });
            const esperado = flujoMensual.map(item => item.esperado || 0);
            const proyectado = flujoMensual.map(item => item.proyectado || 0);

            this.charts.flujoCaja = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Esperado (100%)',
                            data: esperado,
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: 'Proyectado Real',
                            data: proyectado,
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 15
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => context.dataset.label + ': $' + context.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => '$' + (value / 1000).toFixed(0) + 'K'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating flujo de caja chart:', error);
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

            // Calcular promedio y tendencia
            const promedio = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            const maxValue = Math.max(...values, 0);
            const minValue = Math.min(...values, 0);

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
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#2E86AB',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(30, 58, 95, 0.95)',
                            padding: 12,
                            titleColor: '#D4AF37',
                            bodyColor: '#fff',
                            borderColor: '#D4AF37',
                            borderWidth: 1,
                            displayColors: true,
                            callbacks: {
                                title: (context) => `Mes: ${context[0].label}`,
                                label: (context) => {
                                    const value = context.parsed.y;
                                    const diff = value - promedio;
                                    const diffText = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
                                    return [
                                        `Pólizas: ${value}`,
                                        `Promedio: ${promedio.toFixed(1)}`,
                                        `Variación: ${diffText}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                color: '#6B7280'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280'
                            },
                            grid: {
                                display: false
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

            const totalPolizas = values.reduce((a, b) => a + b, 0);

            this.charts.aseguradoras = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Número de Pólizas',
                        data: values,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(30, 58, 95, 0.95)',
                            padding: 12,
                            titleColor: '#D4AF37',
                            bodyColor: '#fff',
                            borderColor: '#D4AF37',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed.y;
                                    const percentage = totalPolizas > 0 ? ((value / totalPolizas) * 100).toFixed(1) : 0;
                                    return [
                                        `Pólizas: ${value}`,
                                        `Participación: ${percentage}%`,
                                        `Total mercado: ${totalPolizas}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                color: '#6B7280'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6B7280',
                                maxRotation: 45,
                                minRotation: 45
                            },
                            grid: {
                                display: false
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
            const total = values.reduce((a, b) => a + b, 0);

            const colors = ['#27AE60', '#F4D03F', '#E67E22', '#A93226'];

            this.charts.estadosCobro = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 3,
                        borderColor: '#fff',
                        hoverBorderWidth: 4,
                        hoverBorderColor: '#D4AF37'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(30, 58, 95, 0.95)',
                            padding: 12,
                            titleColor: '#D4AF37',
                            bodyColor: '#fff',
                            borderColor: '#D4AF37',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed;
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return [
                                        `${context.label}: ${value} recibos`,
                                        `Porcentaje: ${percentage}%`,
                                        `Del total: ${total} recibos`
                                    ];
                                }
                            }
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

    setupDrillDownListeners() {
        // Cerrar modal
        const modal = document.getElementById('drillDownModal');
        const closeBtn = document.getElementById('closeDrillDown');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal?.classList.add('hidden');
            });
        }

        // Cerrar al hacer clic fuera del modal
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Agregar listeners a tarjetas con drill-down
        document.querySelectorAll('[data-drill-down]').forEach(card => {
            card.addEventListener('click', (e) => {
                const drillDownType = card.getAttribute('data-drill-down');
                this.showDrillDown(drillDownType);
            });
        });
    }

    async showDrillDown(type) {
        const modal = document.getElementById('drillDownModal');
        const title = document.getElementById('drillDownTitle');
        const content = document.getElementById('drillDownContent');

        if (!modal || !title || !content) return;

        // Mostrar modal con loading
        title.textContent = 'Cargando...';
        content.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700 mx-auto"></div></div>';
        modal.classList.remove('hidden');

        try {
            switch (type) {
                case 'recibos-vencen-hoy':
                    await this.showRecibosVencenHoy(title, content);
                    break;
                case 'recibos-atrasados-30':
                    await this.showRecibosAtrasados30(title, content);
                    break;
                case 'polizas-renovar-30':
                    await this.showPolizasRenovar30(title, content);
                    break;
                default:
                    title.textContent = 'Detalle';
                    content.innerHTML = '<p class="text-gray-500">No hay información disponible.</p>';
            }
        } catch (error) {
            console.error('Error showing drill-down:', error);
            content.innerHTML = '<p class="text-red-600">Error al cargar los datos.</p>';
        }
    }

    async showRecibosVencenHoy(title, content) {
        title.textContent = '⚠️ Recibos que Vencen Hoy';

        const result = await window.electronAPI.recibos.pendientesConAlertas();
        const recibos = result.success && result.data ? result.data.filter(r => {
            const diasRestantes = this.calculateDaysRemaining(r.fecha_corte);
            return diasRestantes === 0;
        }) : [];

        if (recibos.length === 0) {
            content.innerHTML = '<p class="text-gray-500 text-center py-8">No hay recibos que venzan hoy.</p>';
            return;
        }

        content.innerHTML = `
            <div class="space-y-3">
                ${recibos.map(r => `
                    <div class="border border-red-200 rounded-lg p-4 hover:bg-red-50 transition-colors">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <p class="font-bold text-navy-700">${this.escapeHtml(r.cliente_nombre || 'Sin cliente')}</p>
                                <p class="text-sm text-gray-600">Póliza: ${this.escapeHtml(r.numero_poliza || 'N/A')}</p>
                            </div>
                            <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                ${this.formatCurrency(r.monto || 0)}
                            </span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div><span class="font-medium">Vence:</span> ${this.formatDate(r.fecha_corte)}</div>
                            <div><span class="font-medium">Método:</span> ${this.escapeHtml(r.metodo_pago_nombre || 'N/A')}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-6 flex justify-end">
                <button onclick="window.appNavigation?.navigateTo('recibos')" class="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800 transition-colors">
                    Ir a Recibos
                </button>
            </div>
        `;
    }

    async showRecibosAtrasados30(title, content) {
        title.textContent = '⏰ Recibos Atrasados +30 Días';

        const result = await window.electronAPI.recibos.pendientesConAlertas();
        const recibos = result.success && result.data ? result.data.filter(r => {
            const diasRestantes = this.calculateDaysRemaining(r.fecha_corte);
            return diasRestantes < -30;
        }) : [];

        if (recibos.length === 0) {
            content.innerHTML = '<p class="text-gray-500 text-center py-8">No hay recibos atrasados por más de 30 días.</p>';
            return;
        }

        const totalMonto = recibos.reduce((sum, r) => sum + (r.monto || 0), 0);

        content.innerHTML = `
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-orange-700 font-medium">Total en Riesgo</p>
                        <p class="text-2xl font-bold text-orange-900">${this.formatCurrency(totalMonto)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-orange-700 font-medium">Recibos</p>
                        <p class="text-2xl font-bold text-orange-900">${recibos.length}</p>
                    </div>
                </div>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${recibos.map(r => {
                    const diasAtraso = Math.abs(this.calculateDaysRemaining(r.fecha_corte));
                    return `
                        <div class="border border-orange-200 rounded-lg p-4 hover:bg-orange-50 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <p class="font-bold text-navy-700">${this.escapeHtml(r.cliente_nombre || 'Sin cliente')}</p>
                                    <p class="text-sm text-gray-600">Póliza: ${this.escapeHtml(r.numero_poliza || 'N/A')}</p>
                                </div>
                                <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                                    ${this.formatCurrency(r.monto || 0)}
                                </span>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div><span class="font-medium">Venció:</span> ${this.formatDate(r.fecha_corte)}</div>
                                <div><span class="font-medium text-red-600">Atraso:</span> ${diasAtraso} días</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="mt-6 flex justify-end">
                <button onclick="window.appNavigation?.navigateTo('recibos')" class="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800 transition-colors">
                    Gestionar Recibos
                </button>
            </div>
        `;
    }

    async showPolizasRenovar30(title, content) {
        title.textContent = '📋 Pólizas por Renovar en 30 Días';

        const result = await window.electronAPI.polizas.porVencer(30);
        const polizas = result.success && result.data ? result.data : [];

        if (polizas.length === 0) {
            content.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pólizas por renovar en los próximos 30 días.</p>';
            return;
        }

        const totalPrima = polizas.reduce((sum, p) => sum + (p.prima_total || 0), 0);

        content.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-blue-700 font-medium">Prima Total en Juego</p>
                        <p class="text-2xl font-bold text-blue-900">${this.formatCurrency(totalPrima)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-blue-700 font-medium">Pólizas</p>
                        <p class="text-2xl font-bold text-blue-900">${polizas.length}</p>
                    </div>
                </div>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${polizas.map(p => {
                    const diasRestantes = this.calculateDaysRemaining(p.vigencia_fin);
                    const urgencia = diasRestantes <= 7 ? 'bg-red-100 text-red-700' : diasRestantes <= 15 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700';
                    return `
                        <div class="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <p class="font-bold text-navy-700">${this.escapeHtml(p.cliente_nombre || 'Sin cliente')}</p>
                                    <p class="text-sm text-gray-600">Póliza: ${this.escapeHtml(p.numero_poliza || 'N/A')}</p>
                                    <p class="text-xs text-gray-500">${this.escapeHtml(p.aseguradora_nombre || 'Sin aseguradora')}</p>
                                </div>
                                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                    ${this.formatCurrency(p.prima_total || 0)}
                                </span>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div><span class="font-medium">Vence:</span> ${this.formatDate(p.vigencia_fin)}</div>
                                <div><span class="px-2 py-1 ${urgencia} rounded text-xs font-semibold">${diasRestantes} días</span></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="mt-6 flex justify-end">
                <button onclick="window.appNavigation?.navigateTo('polizas')" class="px-6 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800 transition-colors">
                    Ir a Pólizas
                </button>
            </div>
        `;
    }

    calculateDaysRemaining(fechaStr) {
        if (!fechaStr) return 0;
        const fecha = new Date(fechaStr);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fecha.setHours(0, 0, 0, 0);
        const diff = fecha - hoy;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}

console.log('✅ DashboardController class loaded successfully');

// Register in global scope
window.DashboardController = DashboardController;
