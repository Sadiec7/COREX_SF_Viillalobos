// controllers/polizas_controller.js
// Controlador para la gestión de pólizas

class PolizasController {
    constructor() {
        this.polizas = [];
        this.clientes = [];
        this.aseguradoras = [];
        this.ramos = [];
        this.periodicidades = [];
        this.metodosPago = [];
        this.currentPoliza = null;

        this.initElements();
        this.initEventListeners();
        this.loadCatalogos();
    }

    initElements() {
        // Buttons
        this.btnBack = document.getElementById('btnBack');
        this.btnAddPoliza = document.getElementById('btnAddPoliza');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');
        this.btnCloseRecibosModal = document.getElementById('btnCloseRecibosModal');

        // Filters
        this.filterEstado = document.getElementById('filterEstado');
        this.filterAseguradora = document.getElementById('filterAseguradora');
        this.filterRamo = document.getElementById('filterRamo');

        // Stats
        this.statTotal = document.getElementById('statTotal');
        this.statVigentes = document.getElementById('statVigentes');
        this.statPorVencer = document.getElementById('statPorVencer');
        this.statVencidas = document.getElementById('statVencidas');

        // Table
        this.tableBody = document.getElementById('polizasTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

        // Modal
        this.modal = document.getElementById('modalPoliza');
        this.modalRecibos = document.getElementById('modalRecibos');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formPoliza');
        this.recibosContent = document.getElementById('recibosContent');

        // Form inputs
        this.inputNumero = document.getElementById('inputNumero');
        this.inputCliente = document.getElementById('inputCliente');
        this.inputAseguradora = document.getElementById('inputAseguradora');
        this.inputRamo = document.getElementById('inputRamo');
        this.inputFechaInicio = document.getElementById('inputFechaInicio');
        this.inputFechaFin = document.getElementById('inputFechaFin');
        this.inputPrima = document.getElementById('inputPrima');
        this.inputComision = document.getElementById('inputComision');
        this.inputPeriodicidad = document.getElementById('inputPeriodicidad');
        this.inputMetodoPago = document.getElementById('inputMetodoPago');
        this.inputSumaAsegurada = document.getElementById('inputSumaAsegurada');
        this.inputNotas = document.getElementById('inputNotas');
    }

    initEventListeners() {
        // Back button
        this.btnBack.addEventListener('click', () => this.goBack());

        // Add button
        this.btnAddPoliza.addEventListener('click', () => this.openAddModal());

        // Close modals
        this.btnCloseModal.addEventListener('click', () => this.closeModal());
        this.btnCancelForm.addEventListener('click', () => this.closeModal());
        this.btnCloseRecibosModal.addEventListener('click', () => this.closeRecibosModal());

        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        this.modalRecibos.addEventListener('click', (e) => {
            if (e.target === this.modalRecibos) {
                this.closeRecibosModal();
            }
        });

        // Form submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Filters
        this.filterEstado.addEventListener('change', () => this.applyFilters());
        this.filterAseguradora.addEventListener('change', () => this.applyFilters());
        this.filterRamo.addEventListener('change', () => this.applyFilters());
    }

    async loadCatalogos() {
        try {
            // Load all catalogs in parallel
            const [clientesRes, aseguradorasRes, ramosRes, periodicidadesRes, metodosPagoRes] = await Promise.all([
                window.electronAPI.clientes.getAll(),
                window.electronAPI.catalogos.getAseguradoras(),
                window.electronAPI.catalogos.getRamos(),
                window.electronAPI.catalogos.getPeriodicidades(),
                window.electronAPI.catalogos.getMetodosPago()
            ]);

            if (clientesRes.success) {
                this.clientes = clientesRes.data;
                this.populateClientesSelect();
            }

            if (aseguradorasRes.success) {
                this.aseguradoras = aseguradorasRes.data;
                this.populateAseguradorasSelect();
                this.populateAseguradorasFilter();
            }

            if (ramosRes.success) {
                this.ramos = ramosRes.data;
                this.populateRamosSelect();
                this.populateRamosFilter();
            }

            if (periodicidadesRes.success) {
                this.periodicidades = periodicidadesRes.data;
                this.populatePeriodicidadesSelect();
            }

            if (metodosPagoRes.success) {
                this.metodosPago = metodosPagoRes.data;
                this.populateMetodosPagoSelect();
            }

            // Load polizas after catalogs are loaded
            await this.loadPolizas();

        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            this.showError('Error al cargar catálogos');
        }
    }

    populateClientesSelect() {
        this.inputCliente.innerHTML = '<option value="">Seleccionar cliente...</option>';
        this.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.cliente_id;
            option.textContent = `${cliente.nombre} (${cliente.rfc})`;
            this.inputCliente.appendChild(option);
        });
    }

    populateAseguradorasSelect() {
        this.inputAseguradora.innerHTML = '<option value="">Seleccionar aseguradora...</option>';
        this.aseguradoras.forEach(aseg => {
            const option = document.createElement('option');
            option.value = aseg.aseguradora_id;
            option.textContent = aseg.nombre;
            this.inputAseguradora.appendChild(option);
        });
    }

    populateAseguradorasFilter() {
        this.filterAseguradora.innerHTML = '<option value="">Todas</option>';
        this.aseguradoras.forEach(aseg => {
            const option = document.createElement('option');
            option.value = aseg.aseguradora_id;
            option.textContent = aseg.nombre;
            this.filterAseguradora.appendChild(option);
        });
    }

    populateRamosSelect() {
        this.inputRamo.innerHTML = '<option value="">Seleccionar ramo...</option>';
        this.ramos.forEach(ramo => {
            const option = document.createElement('option');
            option.value = ramo.ramo_id;
            option.textContent = ramo.nombre;
            this.inputRamo.appendChild(option);
        });
    }

    populateRamosFilter() {
        this.filterRamo.innerHTML = '<option value="">Todos</option>';
        this.ramos.forEach(ramo => {
            const option = document.createElement('option');
            option.value = ramo.ramo_id;
            option.textContent = ramo.nombre;
            this.filterRamo.appendChild(option);
        });
    }

    populatePeriodicidadesSelect() {
        this.inputPeriodicidad.innerHTML = '<option value="">Seleccionar periodicidad...</option>';
        this.periodicidades.forEach(per => {
            const option = document.createElement('option');
            option.value = per.periodicidad_id;
            option.textContent = per.nombre;
            this.inputPeriodicidad.appendChild(option);
        });
    }

    populateMetodosPagoSelect() {
        this.inputMetodoPago.innerHTML = '<option value="">Seleccionar método...</option>';
        this.metodosPago.forEach(metodo => {
            const option = document.createElement('option');
            option.value = metodo.metodo_pago_id;
            option.textContent = metodo.nombre;
            this.inputMetodoPago.appendChild(option);
        });
    }

    async loadPolizas() {
        try {
            this.showLoading(true);

            const result = await window.electronAPI.polizas.getAll({});

            if (result.success) {
                this.polizas = result.data;
                this.renderTable();
                this.updateStats();
            } else {
                console.error('Error al cargar pólizas:', result.message);
                this.showError('Error al cargar pólizas');
            }

            this.showLoading(false);

        } catch (error) {
            console.error('Error al cargar pólizas:', error);
            this.showError('Error al cargar pólizas');
            this.showLoading(false);
        }
    }

    renderTable(polizasToRender = null) {
        const polizas = polizasToRender || this.polizas;

        if (polizas.length === 0) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        this.tableBody.innerHTML = polizas.map(poliza => {
            const estado = this.getEstadoPoliza(poliza);
            const statusClass = this.getStatusClass(estado);

            return `
            <tr class="table-row transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${this.escapeHtml(poliza.numero_poliza)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(poliza.cliente_nombre || 'N/A')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(poliza.aseguradora_nombre || 'N/A')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(poliza.ramo_nombre || 'N/A')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    $${this.formatNumber(poliza.prima_total)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(poliza.fecha_inicio)} - ${this.formatDate(poliza.fecha_fin)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${statusClass}">
                        ${estado}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex gap-2">
                        <button
                            onclick="window.polizasController.viewRecibos(${poliza.poliza_id})"
                            class="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver recibos"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                        </button>
                        <button
                            onclick="window.polizasController.viewDetails(${poliza.poliza_id})"
                            class="text-green-600 hover:text-green-900 transition-colors"
                            title="Ver detalles"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `}).join('');
    }

    getEstadoPoliza(poliza) {
        const hoy = new Date();
        const fechaFin = new Date(poliza.fecha_fin);
        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

        if (diasRestantes < 0) {
            return 'Vencida';
        } else if (diasRestantes <= 30) {
            return 'Por Vencer';
        } else {
            return 'Vigente';
        }
    }

    getStatusClass(estado) {
        switch (estado) {
            case 'Vigente':
                return 'status-vigente';
            case 'Vencida':
                return 'status-vencida';
            case 'Por Vencer':
                return 'status-por-vencer';
            default:
                return '';
        }
    }

    updateStats() {
        const total = this.polizas.length;
        let vigentes = 0;
        let porVencer = 0;
        let vencidas = 0;

        this.polizas.forEach(poliza => {
            const estado = this.getEstadoPoliza(poliza);
            if (estado === 'Vigente') vigentes++;
            else if (estado === 'Por Vencer') porVencer++;
            else if (estado === 'Vencida') vencidas++;
        });

        this.statTotal.textContent = total;
        this.statVigentes.textContent = vigentes;
        this.statPorVencer.textContent = porVencer;
        this.statVencidas.textContent = vencidas;
    }

    applyFilters() {
        const estado = this.filterEstado.value;
        const aseguradoraId = this.filterAseguradora.value;
        const ramoId = this.filterRamo.value;

        let filtered = this.polizas;

        if (estado) {
            if (estado === 'Por Vencer') {
                filtered = filtered.filter(p => this.getEstadoPoliza(p) === 'Por Vencer');
            } else {
                filtered = filtered.filter(p => this.getEstadoPoliza(p) === estado);
            }
        }

        if (aseguradoraId) {
            filtered = filtered.filter(p => p.aseguradora_id == aseguradoraId);
        }

        if (ramoId) {
            filtered = filtered.filter(p => p.ramo_id == ramoId);
        }

        this.renderTable(filtered);
    }

    openAddModal() {
        this.currentPoliza = null;
        this.modalTitle.textContent = 'Nueva Póliza';
        this.form.reset();

        // Set default dates
        const hoy = new Date().toISOString().split('T')[0];
        const unAñoDespues = new Date();
        unAñoDespues.setFullYear(unAñoDespues.getFullYear() + 1);

        this.inputFechaInicio.value = hoy;
        this.inputFechaFin.value = unAñoDespues.toISOString().split('T')[0];

        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.form.reset();
        this.currentPoliza = null;
    }

    closeRecibosModal() {
        this.modalRecibos.classList.remove('active');
        this.recibosContent.innerHTML = '';
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const polizaData = {
            numero_poliza: formData.get('numero_poliza').trim(),
            cliente_id: parseInt(formData.get('cliente_id')),
            aseguradora_id: parseInt(formData.get('aseguradora_id')),
            ramo_id: parseInt(formData.get('ramo_id')),
            fecha_inicio: formData.get('fecha_inicio'),
            fecha_fin: formData.get('fecha_fin'),
            prima_total: parseFloat(formData.get('prima_total')),
            comision_porcentaje: formData.get('comision_porcentaje')
                ? parseFloat(formData.get('comision_porcentaje'))
                : null,
            periodicidad_pago_id: parseInt(formData.get('periodicidad_pago_id')),
            metodo_pago_id: formData.get('metodo_pago_id')
                ? parseInt(formData.get('metodo_pago_id'))
                : null,
            suma_asegurada: formData.get('suma_asegurada')
                ? parseFloat(formData.get('suma_asegurada'))
                : null,
            notas: formData.get('notas')?.trim() || null
        };

        try {
            const result = await window.electronAPI.polizas.create(polizaData);

            if (result.success) {
                this.showSuccess('Póliza creada correctamente. Se generaron los recibos automáticamente.');
                this.closeModal();
                await this.loadPolizas();
            } else {
                this.showError(result.message || 'Error al crear póliza');
            }

        } catch (error) {
            console.error('Error al guardar póliza:', error);
            this.showError('Error al guardar póliza');
        }
    }

    async viewRecibos(polizaId) {
        try {
            const result = await window.electronAPI.polizas.getRecibos(polizaId);

            if (result.success && result.data) {
                const recibos = result.data;

                this.recibosContent.innerHTML = `
                    <table class="min-w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Número</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Monto</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Vencimiento</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${recibos.map(recibo => `
                                <tr>
                                    <td class="px-4 py-3 text-sm">${recibo.numero_recibo}</td>
                                    <td class="px-4 py-3 text-sm font-semibold">$${this.formatNumber(recibo.monto)}</td>
                                    <td class="px-4 py-3 text-sm">${this.formatDate(recibo.fecha_vencimiento)}</td>
                                    <td class="px-4 py-3 text-sm">
                                        <span class="status-badge ${recibo.pagado ? 'status-vigente' : 'status-vencida'}">
                                            ${recibo.pagado ? 'Pagado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-sm">
                                        ${!recibo.pagado ? `
                                            <button
                                                onclick="window.polizasController.marcarPagado(${recibo.recibo_id})"
                                                class="text-green-600 hover:text-green-900 font-medium"
                                            >
                                                Marcar como Pagado
                                            </button>
                                        ` : `
                                            <span class="text-gray-400">Pagado: ${this.formatDate(recibo.fecha_pago)}</span>
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;

                this.modalRecibos.classList.add('active');
            } else {
                this.showError('Error al cargar recibos');
            }

        } catch (error) {
            console.error('Error al ver recibos:', error);
            this.showError('Error al cargar recibos');
        }
    }

    async marcarPagado(reciboId) {
        if (!confirm('¿Marcar este recibo como pagado?')) {
            return;
        }

        try {
            const result = await window.electronAPI.recibos.marcarPagado(reciboId);

            if (result.success) {
                this.showSuccess('Recibo marcado como pagado');
                this.closeRecibosModal();
                await this.loadPolizas();
            } else {
                this.showError(result.message || 'Error al marcar recibo');
            }

        } catch (error) {
            console.error('Error al marcar recibo:', error);
            this.showError('Error al marcar recibo como pagado');
        }
    }

    viewDetails(polizaId) {
        const poliza = this.polizas.find(p => p.poliza_id === polizaId);
        if (!poliza) {
            this.showError('Póliza no encontrada');
            return;
        }

        alert(`Detalles de la póliza:\n\n` +
              `Número: ${poliza.numero_poliza}\n` +
              `Cliente: ${poliza.cliente_nombre}\n` +
              `Aseguradora: ${poliza.aseguradora_nombre}\n` +
              `Ramo: ${poliza.ramo_nombre}\n` +
              `Prima: $${this.formatNumber(poliza.prima_total)}\n` +
              `Vigencia: ${this.formatDate(poliza.fecha_inicio)} - ${this.formatDate(poliza.fecha_fin)}\n` +
              `Estado: ${this.getEstadoPoliza(poliza)}`
        );
    }

    goBack() {
        window.location.href = 'dashboard_view.html';
    }

    showLoading(show) {
        if (show) {
            this.loadingState.classList.remove('hidden');
            this.tableBody.innerHTML = '';
            this.emptyState.classList.add('hidden');
        } else {
            this.loadingState.classList.add('hidden');
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert('Error: ' + message);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatNumber(num) {
        if (!num) return '0.00';
        return parseFloat(num).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-MX');
    }
}
