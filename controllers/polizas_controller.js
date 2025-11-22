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
        this.isEditMode = false;

        this.initElements();
        this.initEventListeners();
        this.initValidations();
        this.loadCatalogos();
    }

    initValidations() {
        // Initialize form validation
        if (window.formValidator && this.form) {
            window.formValidator.initForm(this.form, {
                numero_poliza: [
                    { type: 'required', message: 'El número de póliza es requerido' },
                    { type: 'minLength', length: 3, message: 'Mínimo 3 caracteres' }
                ],
                fecha_inicio: [
                    { type: 'required', message: 'La fecha de inicio es requerida' },
                    { type: 'date', message: 'Fecha inválida' }
                ],
                fecha_fin: [
                    { type: 'required', message: 'La fecha de fin es requerida' },
                    { type: 'date', message: 'Fecha inválida' },
                    { type: 'dateRange', minField: 'fecha_inicio', message: 'Debe ser posterior a fecha de inicio' }
                ],
                prima_total: [
                    { type: 'required', message: 'La prima total es requerida' },
                    { type: 'positiveNumber', message: 'Debe ser un número positivo' }
                ],
                prima_neta: [
                    { type: 'positiveNumber', message: 'Debe ser un número positivo' }
                ],
                comision_porcentaje: [
                    { type: 'number', message: 'Debe ser un número válido' }
                ],
                suma_asegurada: [
                    { type: 'positiveNumber', message: 'Debe ser un número positivo' }
                ]
            });
        }

        // Add character counter for notas
        if (window.tooltipManager && this.inputNotas) {
            window.tooltipManager.addCharCounter(this.inputNotas, 1000);
        }
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
        this.detailModal = document.getElementById('modalDetallePoliza');
        this.detailModalClose = document.getElementById('btnCloseDetallePoliza');
        this.detailModalContent = document.getElementById('detallePolizaContent');
        this.detailModalRecibos = document.getElementById('detallePolizaRecibos');

        // Form inputs
        this.inputNumero = document.getElementById('inputNumero');
        this.inputCliente = document.getElementById('inputCliente');
        this.inputAseguradora = document.getElementById('inputAseguradora');
        this.inputRamo = document.getElementById('inputRamo');
        this.inputTipoPoliza = document.getElementById('inputTipoPoliza');
        this.inputFechaInicio = document.getElementById('inputFechaInicio');
        this.inputFechaFin = document.getElementById('inputFechaFin');
        this.inputPrimaNeta = document.getElementById('inputPrimaNeta');
        this.inputPrima = document.getElementById('inputPrima');
        this.inputComision = document.getElementById('inputComision');
        this.inputPeriodicidad = document.getElementById('inputPeriodicidad');
        this.inputMetodoPago = document.getElementById('inputMetodoPago');
        this.inputSumaAsegurada = document.getElementById('inputSumaAsegurada');
        this.inputNotas = document.getElementById('inputNotas');
        this.inputDomiciliada = this.form.querySelector('input[name="domiciliada"]');
        this.inputRenovacionAutomatica = this.form.querySelector('input[name="renovacion_automatica"]');
    }

    initEventListeners() {
        // Back button (optional - only in standalone view, not SPA)
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => this.goBack());
        }

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

        this.detailModal.addEventListener('click', (e) => {
            if (e.target === this.detailModal) {
                this.closeDetailModal();
            }
        });

        this.detailModalClose.addEventListener('click', () => this.closeDetailModal());

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
            const vigenciaInicio = poliza.vigencia_inicio || poliza.fecha_inicio;
            const vigenciaFin = poliza.vigencia_fin || poliza.fecha_fin;

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
                    ${this.formatDate(vigenciaInicio)} - ${this.formatDate(vigenciaFin)}
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
                            onclick="window.polizasController.manageRecibos(${poliza.poliza_id}, '${this.escapeHtml(poliza.numero_poliza)}')"
                            class="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Gestionar recibos"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                        </button>
                        <button
                            onclick="window.polizasController.viewDetails(${poliza.poliza_id})"
                            class="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver detalles"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        <button
                            onclick="window.polizasController.openEditModal(${poliza.poliza_id})"
                            class="text-gold-600 hover:text-gold-900 transition-colors"
                            title="Editar"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button
                            onclick="window.polizasController.deletePoliza(${poliza.poliza_id}, '${this.escapeHtml(poliza.numero_poliza)}')"
                            class="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `}).join('');
    }

    getEstadoPoliza(poliza) {
        const hoy = new Date();
        const fechaFin = new Date(poliza.vigencia_fin || poliza.fecha_fin);
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
        this.isEditMode = false;
        this.currentPoliza = null;
        this.modalTitle.textContent = 'Nueva Póliza';
        this.form.reset();

        // Set default dates
        const hoy = new Date().toISOString().split('T')[0];
        const unAñoDespues = new Date();
        unAñoDespues.setFullYear(unAñoDespues.getFullYear() + 1);

        this.inputFechaInicio.value = hoy;
        this.inputFechaFin.value = unAñoDespues.toISOString().split('T')[0];
        this.inputTipoPoliza.value = 'nuevo';
        this.inputPrimaNeta.value = '';
        this.inputPrima.value = '';
        if (this.inputDomiciliada) {
            this.inputDomiciliada.checked = false;
        }
        if (this.inputRenovacionAutomatica) {
            this.inputRenovacionAutomatica.checked = false;
        }

        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    async openEditModal(polizaId) {
        const poliza = this.polizas.find(p => p.poliza_id === polizaId);

        if (!poliza) {
            this.showError('Póliza no encontrada');
            return;
        }

        this.isEditMode = true;
        this.currentPoliza = poliza;
        this.modalTitle.textContent = 'Editar Póliza';

        // Populate form with poliza data
        this.inputNumero.value = poliza.numero_poliza || '';
        this.inputCliente.value = poliza.cliente_id || '';
        this.inputAseguradora.value = poliza.aseguradora_id || '';
        this.inputRamo.value = poliza.ramo_id || '';
        this.inputTipoPoliza.value = poliza.tipo_poliza || 'nuevo';
        this.inputFechaInicio.value = poliza.fecha_inicio || poliza.vigencia_inicio || '';
        this.inputFechaFin.value = poliza.fecha_fin || poliza.vigencia_fin || '';
        this.inputPrima.value = poliza.prima_total || '';
        this.inputPrimaNeta.value = poliza.prima_neta || poliza.prima_total || '';
        this.inputComision.value = poliza.comision_porcentaje || '';
        this.inputPeriodicidad.value = poliza.periodicidad_pago_id || '';
        this.inputMetodoPago.value = poliza.metodo_pago_id || '';
        this.inputSumaAsegurada.value = poliza.suma_asegurada || '';
        this.inputNotas.value = poliza.notas || '';

        if (this.inputDomiciliada) {
            this.inputDomiciliada.checked = poliza.domiciliada || false;
        }
        if (this.inputRenovacionAutomatica) {
            this.inputRenovacionAutomatica.checked = poliza.vigencia_renovacion_automatica || false;
        }

        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
        this.currentPoliza = null;
        this.isEditMode = false;
    }

    closeRecibosModal() {
        this.modalRecibos.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.recibosContent.innerHTML = '';
    }

    closeDetailModal() {
        this.detailModal.classList.remove('active');
        this.detailModalContent.innerHTML = '';
        this.detailModalRecibos.innerHTML = '';
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const primaTotal = parseFloat(formData.get('prima_total'));
        const primaNetaInput = formData.get('prima_neta');
        const primaNeta = primaNetaInput ? parseFloat(primaNetaInput) : primaTotal;

        const polizaData = {
            numero_poliza: formData.get('numero_poliza').trim(),
            cliente_id: parseInt(formData.get('cliente_id')),
            aseguradora_id: parseInt(formData.get('aseguradora_id')),
            ramo_id: parseInt(formData.get('ramo_id')),
            fecha_inicio: formData.get('fecha_inicio'),
            fecha_fin: formData.get('fecha_fin'),
            prima_total: primaTotal,
            prima_neta: primaNeta,
            tipo_poliza: formData.get('tipo_poliza') || 'nuevo',
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
            domiciliada: formData.get('domiciliada') === 'on',
            vigencia_renovacion_automatica: formData.get('renovacion_automatica') === 'on',
            notas: formData.get('notas')?.trim() || null
        };

        if (!polizaData.metodo_pago_id || Number.isNaN(polizaData.metodo_pago_id)) {
            this.showError('Selecciona un método de pago');
            return;
        }

        if (Number.isNaN(primaTotal) || primaTotal <= 0) {
            this.showError('La prima total debe ser mayor a cero');
            return;
        }

        if (Number.isNaN(primaNeta) || primaNeta <= 0) {
            this.showError('La prima neta debe ser mayor a cero');
            return;
        }

        if (primaNeta > primaTotal) {
            this.showError('La prima neta no puede ser mayor que la prima total');
            return;
        }

        try {
            let result;

            if (this.isEditMode && this.currentPoliza) {
                // Update existing poliza
                result = await window.electronAPI.polizas.update(this.currentPoliza.poliza_id, polizaData);

                if (result.success) {
                    this.showSuccess('Póliza actualizada correctamente');
                    this.closeModal();
                    await this.loadPolizas();
                } else {
                    this.showError(result.message || 'Error al actualizar póliza');
                }
            } else {
                // Create new poliza
                result = await window.electronAPI.polizas.create(polizaData);

                if (result.success) {
                    this.showSuccess('Póliza creada correctamente. Se generaron los recibos automáticamente.');
                    this.closeModal();
                    await this.loadPolizas();
                } else {
                    this.showError(result.message || 'Error al crear póliza');
                }
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
                                    <td class="px-4 py-3 text-sm">${this.formatDate(recibo.fecha_corte)}</td>
                                    <td class="px-4 py-3 text-sm">
                                        <span class="status-badge ${recibo.estado === 'pagado' ? 'status-vigente' : 'status-vencida'}">
                                            ${recibo.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-sm">
                                        ${recibo.estado !== 'pagado' ? `
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
                document.body.classList.add('modal-open');
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

    async viewDetails(polizaId) {
        let poliza = this.polizas.find(p => p.poliza_id === polizaId);

        if (!poliza) {
            try {
                const response = await window.electronAPI.polizas.getById(polizaId);
                if (response.success) {
                    poliza = response.data;
                }
            } catch (error) {
                console.error('Error al obtener póliza:', error);
            }
        }

        if (!poliza) {
            this.showError('Póliza no encontrada');
            return;
        }

        try {
            const recibosRes = await window.electronAPI.polizas.getRecibos(polizaId);
            const recibos = recibosRes.success ? recibosRes.data : [];

            const vigenciaInicio = poliza.vigencia_inicio || poliza.fecha_inicio;
            const vigenciaFin = poliza.vigencia_fin || poliza.fecha_fin;

            this.detailModalContent.innerHTML = `
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Número de póliza</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.numero_poliza)}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Cliente</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.cliente_nombre || 'N/A')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Aseguradora</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.aseguradora_nombre || 'N/A')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Ramo</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.ramo_nombre || 'N/A')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Tipo de póliza</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.tipo_poliza || 'N/A')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Estado de pago</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.estado_pago || 'pendiente')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Prima neta</dt>
                        <dd class="text-sm text-gray-900">$${this.formatNumber(poliza.prima_neta || 0)}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Prima total</dt>
                        <dd class="text-sm text-gray-900">$${this.formatNumber(poliza.prima_total || 0)}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Suma asegurada</dt>
                        <dd class="text-sm text-gray-900">${poliza.suma_asegurada ? '$' + this.formatNumber(poliza.suma_asegurada) : '-'}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Comisión (%)</dt>
                        <dd class="text-sm text-gray-900">${poliza.comision_porcentaje ? this.formatNumber(poliza.comision_porcentaje) + '%' : '-'}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Método de pago</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.metodo_pago_nombre || 'N/A')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Periodicidad</dt>
                        <dd class="text-sm text-gray-900">${this.escapeHtml(poliza.periodicidad_nombre || 'N/A')}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Vigencia</dt>
                        <dd class="text-sm text-gray-900">${this.formatDate(vigenciaInicio)} - ${this.formatDate(vigenciaFin)}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Renovación automática</dt>
                        <dd class="text-sm text-gray-900">${poliza.vigencia_renovacion_automatica ? 'Sí' : 'No'}</dd>
                    </div>
                    <div class="md:col-span-2">
                        <dt class="text-sm font-medium text-gray-500">Notas</dt>
                        <dd class="text-sm text-gray-900">${poliza.notas ? this.escapeHtml(poliza.notas) : 'Sin notas'}</dd>
                    </div>
                </dl>
            `;

            if (recibos && recibos.length) {
                this.detailModalRecibos.innerHTML = recibos.map(recibo => `
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <span class="text-sm font-semibold text-gray-900">${this.escapeHtml(recibo.numero_recibo || ('Recibo #' + recibo.recibo_id))}</span>
                            <span class="text-xs px-2 py-1 rounded-full ${recibo.estado === 'pagado' ? 'bg-green-100 text-green-700' : recibo.estado === 'vencido' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                                ${this.escapeHtml(recibo.estado || 'pendiente')}
                            </span>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">
                            Periodo: ${this.formatDate(recibo.fecha_inicio_periodo)} - ${this.formatDate(recibo.fecha_fin_periodo)}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            Corte: ${this.formatDate(recibo.fecha_corte)} · Monto: $${this.formatNumber(recibo.monto || 0)}
                        </p>
                        ${recibo.fecha_pago ? `<p class="text-xs text-gray-500 mt-1">Pago: ${this.formatDate(recibo.fecha_pago)}</p>` : ''}
                    </div>
                `).join('');
            } else {
                this.detailModalRecibos.innerHTML = `
                    <div class="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        Sin recibos registrados aún.
                    </div>
                `;
            }

            this.detailModal.classList.add('active');
        } catch (error) {
            console.error('Error al obtener detalles de la póliza:', error);
            this.showError('No se pudieron cargar los detalles de la póliza');
        }
    }

    async deletePoliza(polizaId, numeroPoliza) {
        const poliza = this.polizas.find(p => p.poliza_id === polizaId);
        const displayName = numeroPoliza || poliza?.numero_poliza || `#${polizaId}`;

        // Use elegant confirm modal if available
        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.show({
                title: 'Eliminar póliza',
                message: `¿Estás seguro de eliminar la póliza "${displayName}"?\n\nEsta acción no se puede deshacer.`,
                type: 'danger',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar'
            });
        } else {
            confirmed = confirm(`¿Estás seguro de eliminar la póliza "${displayName}"?\n\nEsta acción no se puede deshacer.`);
        }

        if (!confirmed) {
            return;
        }

        try {
            const result = await window.electronAPI.polizas.delete(polizaId);

            if (result.success) {
                this.showSuccess('Póliza eliminada correctamente');
                await this.loadPolizas();
            } else {
                this.showError(result.message || 'Error al eliminar póliza');
            }
        } catch (error) {
            console.error('Error al eliminar póliza:', error);
            this.showError('Error al eliminar póliza');
        }
    }

    manageRecibos(polizaId, numeroPoliza) {
        try {
            localStorage.setItem('recibosPolizaId', polizaId);
            localStorage.setItem('recibosPolizaNumero', numeroPoliza);
        } catch (error) {
            console.warn('No se pudo guardar el contexto en localStorage:', error);
        }
        // Navegar a recibos usando SPA navigation
        if (window.appNavigation) {
            window.appNavigation.navigateTo('recibos');
        } else {
            console.error('appNavigation no disponible');
        }
    }

    goBack() {
        // Navegar al dashboard usando SPA navigation
        if (window.appNavigation) {
            window.appNavigation.navigateTo('dashboard');
        } else {
            console.error('appNavigation no disponible');
        }
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
        if (window.showSuccess) {
            window.showSuccess(message);
        } else {
            alert(message);
        }
    }

    showError(message) {
        if (window.showError) {
            window.showError(message);
        } else {
            alert('Error: ' + message);
        }
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
console.log('✅ PolizasController class loaded successfully');

// Register in global scope
window.PolizasController = PolizasController;
