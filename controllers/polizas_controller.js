// controllers/polizas_controller.js
// Controlador para la gestión de pólizas

class PolizasController {
    constructor() {
        console.log('🏗️ [POLIZAS] Inicializando PolizasController...');

        this.polizas = [];
        this.clientes = [];

        // Catálogos GLOBALES - Ya cargados por CatalogsManager
        this.aseguradoras = window.catalogsManager.get('aseguradoras');
        this.ramos = window.catalogsManager.get('ramos');
        this.periodicidades = window.catalogsManager.get('periodicidades');
        this.metodosPago = window.catalogsManager.get('metodosPago');

        console.log('📦 [POLIZAS] Catálogos obtenidos:', {
            aseguradoras: this.aseguradoras.length,
            ramos: this.ramos.length,
            periodicidades: this.periodicidades.length,
            metodosPago: this.metodosPago.length
        });

        this.currentPoliza = null;
        this.isEditMode = false;
        this.activeFilters = {
            vigente: false,
            porVencer: false,
            vencida: false,
            aseguradoraId: '',
            ramoId: ''
        };

        // Paginación
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalPages = 1;

        this.initElements();
        this.initEventListeners();
        this.initValidations();

        // Cargar solo clientes y pólizas (catálogos ya están disponibles)
        this.init();

        console.log('✅ [POLIZAS] PolizasController inicializado');
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

        // Search
        this.searchInput = document.getElementById('searchPolizas');

        // Filters Modal
        this.btnOpenFilters = document.getElementById('btnOpenFilters');
        this.modalFiltros = document.getElementById('modalFiltros');
        this.btnCloseFiltros = document.getElementById('btnCloseFiltros');
        this.btnApplyFilters = document.getElementById('btnApplyFilters');
        this.btnClearFilters = document.getElementById('btnClearFilters');
        this.filterBadge = document.getElementById('filterBadge');

        // Filter Checkboxes and Selects
        this.filterVigente = document.getElementById('filterVigente');
        this.filterPorVencer = document.getElementById('filterPorVencer');
        this.filterVencida = document.getElementById('filterVencida');
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

        // Paginación
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

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

        // Table click handler (for rows and action buttons)
        this.tableBody.addEventListener('click', (e) => this.handleActionClick(e));

        // Search
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = (e.target.value || '').toLowerCase();
            this.currentPage = 1;
            const filtered = this.getFilteredPolizas(searchTerm);
            this.renderTable(filtered);
        });

        // Items per page selector
        if (this.itemsPerPageSelect) {
            this.itemsPerPageSelect.addEventListener('change', (e) => {
                this.changeItemsPerPage(e.target.value);
            });
        }

        // Filters Modal
        this.btnOpenFilters.addEventListener('click', () => this.openFiltersModal());
        this.btnCloseFiltros.addEventListener('click', () => this.closeFiltersModal());
        this.btnApplyFilters.addEventListener('click', () => this.applyFilters());
        this.btnClearFilters.addEventListener('click', () => this.clearFilters());

        // Close modal on outside click
        this.modalFiltros.addEventListener('click', (e) => {
            if (e.target === this.modalFiltros) {
                this.closeFiltersModal();
            }
        });
    }

    async init() {
        try {
            console.log('🔄 [POLIZAS] Inicializando datos...');

            // Poblar selects con catálogos ya cargados
            this.populateAseguradorasSelect();
            this.populateAseguradorasFilter();
            this.populateRamosSelect();
            this.populateRamosFilter();
            this.populatePeriodicidadesSelect();
            this.populateMetodosPagoSelect();

            // Cargar clientes (datos específicos de este módulo)
            const clientesRes = await window.electronAPI.clientes.getAll();
            if (clientesRes.success) {
                this.clientes = clientesRes.data;
                this.populateClientesSelect();
            }

            // Validar que catálogos críticos tengan datos
            if (!this.periodicidades.length || !this.metodosPago.length) {
                this.showError('Catálogos críticos no disponibles. Por favor recarga la aplicación.');
                return;
            }

            // Cargar pólizas
            await this.loadPolizas();

            console.log('✅ [POLIZAS] Datos inicializados correctamente');

        } catch (error) {
            console.error('❌ [POLIZAS] Error al inicializar datos:', error);
            this.showError('Error al inicializar datos del módulo');
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
        this.setDefaultSelect(this.inputPeriodicidad);
    }

    populateMetodosPagoSelect() {
        this.inputMetodoPago.innerHTML = '<option value="">Seleccionar método...</option>';
        this.metodosPago.forEach(metodo => {
            const option = document.createElement('option');
            option.value = metodo.metodo_pago_id;
            option.textContent = metodo.nombre;
            this.inputMetodoPago.appendChild(option);
        });
        this.setDefaultSelect(this.inputMetodoPago);
    }

    async loadPolizas() {
        try {
            this.showLoading(true);

            const result = await window.electronAPI.polizas.getAll({});

            if (result.success) {
                this.polizas = result.data;
                // Reaplicar búsqueda y filtros actuales
                this.currentPage = 1;
                const filtered = this.getFilteredPolizas((this.searchInput?.value || '').toLowerCase());
                this.renderTable(filtered);
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
        let polizas = polizasToRender || this.polizas;

        // Ordenar por fecha de creación (desc) para que las más recientes aparezcan primero
        polizas = [...polizas].sort((a, b) => {
            const fechaA = new Date(a.fecha_creacion || a.vigencia_inicio || 0);
            const fechaB = new Date(b.fecha_creacion || b.vigencia_inicio || 0);
            return fechaB - fechaA;
        });

        // Apply active filters if no specific polizas provided
        if (!polizasToRender) {
            polizas = this.applyActiveFilters(polizas);
        }

        if (polizas.length === 0) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            return;
        }

        this.emptyState.classList.add('hidden');

        // Calcular paginación
        this.totalPages = PaginationHelper.getTotalPages(polizas.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Obtener elementos de la página actual
        const paginatedPolizas = PaginationHelper.getPaginatedItems(polizas, this.currentPage, this.itemsPerPage);

        this.tableBody.innerHTML = paginatedPolizas.map(poliza => {
            const estado = this.getEstadoPoliza(poliza);
            const statusClass = this.getStatusClass(estado);
            const vigenciaInicio = poliza.vigencia_inicio || poliza.fecha_inicio;
            const vigenciaFin = poliza.vigencia_fin || poliza.fecha_fin;

            return `
            <tr class="group transition-colors cursor-pointer hover:bg-gray-50" data-poliza-id="${poliza.poliza_id}">
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
                <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                    <div class="flex gap-2">
                        <button
                            data-action="view-recibos"
                            data-poliza-id="${poliza.poliza_id}"
                            class="p-1 text-blue-600 hover:text-white hover:bg-blue-600 rounded transition-all duration-150"
                            title="Ver recibos"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                        </button>
                        <button
                            data-action="manage-recibos"
                            data-poliza-id="${poliza.poliza_id}"
                            data-poliza-numero="${this.escapeHtml(poliza.numero_poliza)}"
                            class="p-1 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded transition-all duration-150"
                            title="Gestionar recibos"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                        </button>
                        <button
                            data-action="view-details"
                            data-poliza-id="${poliza.poliza_id}"
                            class="p-1 text-blue-600 hover:text-white hover:bg-blue-600 rounded transition-all duration-150"
                            title="Ver detalles"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        <button
                            data-action="edit"
                            data-poliza-id="${poliza.poliza_id}"
                            class="p-1 text-gold-600 hover:text-white hover:bg-gold-600 rounded transition-all duration-150"
                            title="Editar"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button
                            data-action="delete"
                            data-poliza-id="${poliza.poliza_id}"
                            data-poliza-numero="${this.escapeHtml(poliza.numero_poliza)}"
                            class="p-1 text-red-600 hover:text-white hover:bg-red-600 rounded transition-all duration-150"
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

        // Renderizar controles de paginación
        this.renderPagination(polizas.length);
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.polizasController.goToPage'
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderTable();
    }

    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1; // Resetear a la primera página
        this.renderTable();
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

    openFiltersModal() {
        this.modalFiltros.classList.add('active');
    }

    closeFiltersModal() {
        this.modalFiltros.classList.remove('active');
    }

    applyFilters() {
        // Save filter state
        this.activeFilters.vigente = this.filterVigente.checked;
        this.activeFilters.porVencer = this.filterPorVencer.checked;
        this.activeFilters.vencida = this.filterVencida.checked;
        this.activeFilters.aseguradoraId = this.filterAseguradora.value;
        this.activeFilters.ramoId = this.filterRamo.value;

        // Update badge
        this.updateFilterBadge();

        // Close modal
        this.closeFiltersModal();

        // Apply filters and current search
        const searchTerm = (this.searchInput?.value || '').toLowerCase();
        this.currentPage = 1;
        const filtered = this.getFilteredPolizas(searchTerm);
        this.renderTable(filtered);
    }

    clearFilters() {
        // Reset checkboxes
        this.filterVigente.checked = false;
        this.filterPorVencer.checked = false;
        this.filterVencida.checked = false;
        this.filterAseguradora.value = '';
        this.filterRamo.value = '';

        // Reset active filters
        this.activeFilters = {
            vigente: false,
            porVencer: false,
            vencida: false,
            aseguradoraId: '',
            ramoId: ''
        };

        // Update badge
        this.updateFilterBadge();

        // Re-render with current search
        const searchTerm = (this.searchInput?.value || '').toLowerCase();
        this.currentPage = 1;
        const filtered = this.getFilteredPolizas(searchTerm);
        this.renderTable(filtered);
    }

    updateFilterBadge() {
        let count = 0;
        if (this.activeFilters.vigente) count++;
        if (this.activeFilters.porVencer) count++;
        if (this.activeFilters.vencida) count++;
        if (this.activeFilters.aseguradoraId) count++;
        if (this.activeFilters.ramoId) count++;

        if (count > 0) {
            this.filterBadge.textContent = count;
            this.filterBadge.classList.remove('hidden');
        } else {
            this.filterBadge.classList.add('hidden');
        }
    }

    applyActiveFilters(polizas) {
        let filtered = [...polizas];

        // Filter by estado
        const estadoFilters = [];
        if (this.activeFilters.vigente) estadoFilters.push('Vigente');
        if (this.activeFilters.porVencer) estadoFilters.push('Por Vencer');
        if (this.activeFilters.vencida) estadoFilters.push('Vencida');

        if (estadoFilters.length > 0) {
            filtered = filtered.filter(p => estadoFilters.includes(this.getEstadoPoliza(p)));
        }

        // Filter by aseguradora
        if (this.activeFilters.aseguradoraId) {
            filtered = filtered.filter(p => p.aseguradora_id == this.activeFilters.aseguradoraId);
        }

        // Filter by ramo
        if (this.activeFilters.ramoId) {
            filtered = filtered.filter(p => p.ramo_id == this.activeFilters.ramoId);
        }

        return filtered;
    }

    getFilteredPolizas(searchTerm = '') {
        const term = (searchTerm || '').toLowerCase();
        let filtered = [...this.polizas];

        if (term) {
            filtered = filtered.filter(p => {
                const cliente = this.clientes.find(c => c.cliente_id === p.cliente_id);
                const clienteNombre = cliente?.nombre_completo || cliente?.nombre || '';
                const aseguradora = this.aseguradoras.find(a => a.aseguradora_id === p.aseguradora_id);
                const ramo = this.ramos.find(r => r.ramo_id === p.ramo_id);

                return (
                    (p.numero_poliza || '').toLowerCase().includes(term) ||
                    clienteNombre.toLowerCase().includes(term) ||
                    (aseguradora?.nombre || '').toLowerCase().includes(term) ||
                    (ramo?.nombre || '').toLowerCase().includes(term)
                );
            });
        }

        return this.applyActiveFilters(filtered);
    }

    async openAddModal() {
        console.log('📝 [POLIZAS] Abriendo modal de nueva póliza...');

        // Validación básica de catálogos (ya deberían estar cargados)
        if (!this.periodicidades.length || !this.metodosPago.length) {
            console.error('❌ [POLIZAS] Catálogos no disponibles');
            this.showError('Catálogos no disponibles. Por favor recarga la aplicación.');
            return;
        }

        if (window.toastManager) {
            window.toastManager.dismissAll();
        }
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
        // Seleccionar primera opción disponible en catálogos para evitar selects vacíos
        this.setDefaultSelect(this.inputCliente);
        this.setDefaultSelect(this.inputAseguradora);
        this.setDefaultSelect(this.inputRamo);
        this.setDefaultSelect(this.inputPeriodicidad);
        this.setDefaultSelect(this.inputMetodoPago);
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
        if (window.toastManager) {
            window.toastManager.dismissAll();
        }
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

        // Fallbacks seguros para catálogos
        const periodicidadId = formData.get('periodicidad_pago_id');
        const metodoPagoId = formData.get('metodo_pago_id');

        const safePeriodicidadId = periodicidadId && !Number.isNaN(parseInt(periodicidadId))
            ? parseInt(periodicidadId)
            : (this.periodicidades[0]?.periodicidad_id || 1);

        const safeMetodoPagoId = metodoPagoId && !Number.isNaN(parseInt(metodoPagoId))
            ? parseInt(metodoPagoId)
            : (this.metodosPago[0]?.metodo_pago_id || 1);

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
            periodicidad_pago_id: safePeriodicidadId,
            metodo_pago_id: safeMetodoPagoId,
            suma_asegurada: formData.get('suma_asegurada')
                ? parseFloat(formData.get('suma_asegurada'))
                : null,
            domiciliada: formData.get('domiciliada') === 'on',
            vigencia_renovacion_automatica: formData.get('renovacion_automatica') === 'on',
            notas: formData.get('notas')?.trim() || null
        };

        if (!polizaData.metodo_pago_id || Number.isNaN(polizaData.metodo_pago_id)) {
            this.showError('Selecciona un método de pago');
            if (this.inputMetodoPago) this.inputMetodoPago.focus();
            return;
        }

        if (!polizaData.periodicidad_pago_id || Number.isNaN(polizaData.periodicidad_pago_id)) {
            this.showError('Selecciona una periodicidad de pago');
            if (this.inputPeriodicidad) this.inputPeriodicidad.focus();
            return;
        }

        if (!this.periodicidades.length || !this.metodosPago.length) {
            this.showError('Los catálogos aún no están listos. Recarga y vuelve a intentar.');
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
                // ✅ EDICIÓN: Detectar si los cambios requieren regeneración de recibos
                const cambiosCriticos = this._detectarCambiosCriticos(this.currentPoliza, polizaData);

                if (cambiosCriticos.requiereRegeneracion) {
                    // Mostrar advertencia y pedir confirmación
                    const confirmado = await this._confirmarRegeneracion(cambiosCriticos);

                    if (!confirmado) {
                        return; // Usuario canceló
                    }
                }

                // Actualizar póliza
                result = await window.electronAPI.polizas.update(this.currentPoliza.poliza_id, polizaData);

                if (result.success) {
                    // Mostrar mensaje apropiado según si hubo regeneración
                    if (result.cambios_requirieron_regeneracion) {
                        this.showSuccess(
                            `Póliza actualizada. ` +
                            `Recibos: ${result.mantenidos} pagados mantenidos, ` +
                            `${result.eliminados} pendientes eliminados, ` +
                            `${result.regenerados} nuevos generados.`
                        );
                    } else {
                        this.showSuccess('Póliza actualizada correctamente');
                    }

                    this.closeModal();
                    if (this.searchInput) this.searchInput.value = '';
                    await this.loadPolizas();
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    this.showError(this.formatError(result.message) || 'No se pudo actualizar la póliza. Revisa los datos e intenta de nuevo.');
                }
            } else {
                // ✅ CREACIÓN: Mostrar confirmación con preview de recibos
                const numeroRecibos = this._calcularNumeroRecibos(polizaData);
                const confirmado = await this._confirmarCreacion(polizaData, numeroRecibos);

                if (!confirmado) {
                    return; // Usuario canceló
                }

                // Crear póliza
                result = await window.electronAPI.polizas.create(polizaData);

                if (result.success) {
                    this.showSuccess(`Póliza creada y ${numeroRecibos} recibos generados correctamente.`);
                    this.closeModal();

                    if (this.searchInput) this.searchInput.value = '';
                    await this.loadPolizas();

                    console.log('✅ Póliza creada y tabla recargada');
                } else {
                    this.showError(this.formatError(result.message) || 'No se pudo crear la póliza. Verifica los campos obligatorios.');
                }
            }

        } catch (error) {
            console.error('Error al guardar póliza:', error);
            this.showError('No se pudo guardar la póliza. Intenta de nuevo o contacta a soporte.');
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
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Periodo</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Monto</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Vencimiento</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${recibos.map(recibo => `
                                <tr>
                                    <td class="px-4 py-3 text-sm">${recibo.numero_recibo}</td>
                                    <td class="px-4 py-3 text-sm">${this.formatDate(recibo.fecha_inicio_periodo)} - ${this.formatDate(recibo.fecha_fin_periodo)}</td>
                                    <td class="px-4 py-3 text-sm font-semibold">$${this.formatNumber(recibo.monto)}</td>
                                    <td class="px-4 py-3 text-sm">${this.formatDate(recibo.fecha_corte)}</td>
                                    <td class="px-4 py-3 text-sm">
                                        <span class="status-badge ${recibo.estado === 'pagado' ? 'status-vigente' : 'status-vencida'}">
                                            ${recibo.estado === 'pagado' ? 'Pagado' : recibo.estado === 'vencido' ? 'Vencido' : 'Pendiente'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="mt-4 text-center">
                        <a href="#" onclick="window.appController.navigateToView('recibos'); window.polizasController.closeRecibosModal(); return false;"
                           class="text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                            Ver todos los recibos en el módulo de Recibos
                        </a>
                    </div>
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
        // Obtener info del recibo para mostrar confirmación detallada
        try {
            const reciboResult = await window.electronAPI.recibos.getById(reciboId);

            if (!reciboResult.success) {
                this.showError('No se pudo obtener la información del recibo');
                return;
            }

            const recibo = reciboResult.data;

            const mensaje = `
¿Confirmar pago del recibo?

Recibo: ${recibo.numero_recibo}
Monto: $${this.formatNumber(recibo.monto)}
Periodo: ${this.formatDate(recibo.fecha_inicio_periodo)} - ${this.formatDate(recibo.fecha_fin_periodo)}

Esta acción registrará el recibo como pagado con la fecha actual.
            `.trim();

            if (!confirm(mensaje)) {
                return;
            }

            const result = await window.electronAPI.recibos.marcarPagado(reciboId);

            if (result.success) {
                this.showSuccess('✓ Recibo marcado como pagado');

                // ✅ MEJORA: Recargar la vista de recibos sin cerrar el modal
                // Obtener poliza_id del recibo para recargar
                await this.viewRecibos(recibo.poliza_id);
                await this.loadPolizas(); // Actualizar tabla principal
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
            confirmed = await window.confirmModal.confirmDelete(displayName, `¿Estás seguro de eliminar la póliza "${displayName}"?\n\nEsta acción no se puede deshacer.`);
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

    handleActionClick(event) {
        // Check if click was on an action button
        const button = event.target.closest('button[data-action]');
        if (button) {
            const polizaId = Number(button.dataset.polizaId);
            if (!polizaId) return;

            const action = button.dataset.action;

            if (action === 'view-recibos') {
                this.viewRecibos(polizaId);
            } else if (action === 'manage-recibos') {
                const numeroPoliza = button.dataset.polizaNumero || '';
                this.manageRecibos(polizaId, numeroPoliza);
            } else if (action === 'view-details') {
                this.viewDetails(polizaId);
            } else if (action === 'edit') {
                this.openEditModal(polizaId);
            } else if (action === 'delete') {
                const numeroPoliza = button.dataset.polizaNumero || '';
                this.deletePoliza(polizaId, numeroPoliza);
            }
            return;
        }

        // If not a button, check if click was on a table row
        const row = event.target.closest('tr[data-poliza-id]');
        if (row) {
            const polizaId = Number(row.dataset.polizaId);
            if (polizaId) {
                this.openEditModal(polizaId);
            }
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
            } else if (window.toastManager) {
            window.toastManager.success(message, 1500);
        } else {
            alert(message);
        }
        // Auto-ocultar para evitar bloqueos de UI
        setTimeout(() => window.toastManager?.dismissAll(), 1800);
    }

    showError(message) {
        if (window.showError) {
            window.showError(message);
        } else if (window.toastManager) {
            window.toastManager.error(message, 1500);
        } else {
            alert('Error: ' + message);
        }
        // Auto-ocultar para evitar bloqueos de UI
        setTimeout(() => window.toastManager?.dismissAll(), 1800);
    }

    formatError(rawMessage) {
        if (!rawMessage) return null;
        const msg = rawMessage.toLowerCase();
        if (msg.includes('unique') || msg.includes('único')) {
            return 'Ya existe una póliza con ese número. Usa uno diferente.';
        }
        if (msg.includes('metodo_pago') || msg.includes('método de pago')) {
            return 'Selecciona un método de pago válido.';
        }
        if (msg.includes('periodicidad')) {
            return 'Selecciona una periodicidad de pago.';
        }
        if (msg.includes('cannot read properties') && msg.includes('periodicidad')) {
            return 'Selecciona una periodicidad de pago.';
        }
        if (msg.includes('monto > 0')) {
            return 'El monto de los recibos debe ser mayor a 0. Revisa prima total y periodicidad.';
        }
        if (msg.includes('vigencia_fin') && msg.includes('vigencia_inicio')) {
            return 'La fecha de fin debe ser posterior a la fecha de inicio.';
        }
        return rawMessage;
    }

    setDefaultSelect(selectElement) {
        if (!selectElement) return;
        const options = Array.from(selectElement.options || []);
        if (options.length > 1 && !selectElement.value) {
            // Saltar la opción vacía (index 0)
            selectElement.value = options[1].value;
        }
    }

    insertPolizaInMemory(polizaId, polizaData) {
        const nuevaPoliza = {
            poliza_id: polizaId || Date.now(),
            numero_poliza: polizaData.numero_poliza,
            cliente_id: polizaData.cliente_id,
            cliente_nombre: this.getClienteNombre(polizaData.cliente_id),
            aseguradora_id: polizaData.aseguradora_id,
            aseguradora_nombre: this.getAseguradoraNombre(polizaData.aseguradora_id),
            ramo_id: polizaData.ramo_id,
            ramo_nombre: this.getRamoNombre(polizaData.ramo_id),
            periodicidad_id: polizaData.periodicidad_pago_id,
            periodicidad_nombre: this.getPeriodicidadNombre(polizaData.periodicidad_pago_id),
            metodo_pago_id: polizaData.metodo_pago_id,
            metodo_pago_nombre: this.getMetodoPagoNombre(polizaData.metodo_pago_id),
            prima_total: polizaData.prima_total,
            prima_neta: polizaData.prima_neta,
            vigencia_inicio: polizaData.fecha_inicio,
            vigencia_fin: polizaData.fecha_fin,
            vigencia_renovacion_automatica: polizaData.vigencia_renovacion_automatica,
            suma_asegurada: polizaData.suma_asegurada,
            comision_porcentaje: polizaData.comision_porcentaje,
            notas: polizaData.notas,
            estado_pago: 'pendiente',
            tipo_poliza: polizaData.tipo_poliza || 'nuevo'
        };

        this.polizas = [nuevaPoliza, ...this.polizas];
        const filtered = this.getFilteredPolizas((this.searchInput?.value || '').toLowerCase());
        this.renderTable(filtered);
        this.updateStats();
    }

    async insertPolizaFromBackend(polizaId, polizaData) {
        if (!polizaId) {
            this.insertPolizaInMemory(polizaId, polizaData);
            return;
        }

        try {
            const res = await window.electronAPI.polizas.getById(polizaId);
            if (res.success && res.data) {
                this.polizas = [res.data, ...this.polizas];
                const filtered = this.getFilteredPolizas((this.searchInput?.value || '').toLowerCase());
                this.renderTable(filtered);
                this.updateStats();
                return;
            }
        } catch (error) {
            console.warn('No se pudo recuperar la póliza recién creada, usando datos locales:', error);
        }

        this.insertPolizaInMemory(polizaId, polizaData);
    }

    getClienteNombre(clienteId) {
        const cliente = this.clientes.find(c => c.cliente_id === clienteId);
        return cliente?.nombre_completo || cliente?.nombre || 'Cliente';
    }

    getAseguradoraNombre(aseguradoraId) {
        const aseg = this.aseguradoras.find(a => a.aseguradora_id === aseguradoraId);
        return aseg?.nombre || 'Aseguradora';
    }

    getRamoNombre(ramoId) {
        const ramo = this.ramos.find(r => r.ramo_id === ramoId);
        return ramo?.nombre || 'Ramo';
    }

    getPeriodicidadNombre(periodicidadId) {
        const per = this.periodicidades.find(p => p.periodicidad_id === periodicidadId);
        return per?.nombre || 'Periodicidad';
    }

    getMetodoPagoNombre(metodoId) {
        const metodo = this.metodosPago.find(m => m.metodo_pago_id === metodoId);
        return metodo?.nombre || 'Método de pago';
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

    // ========== MÉTODOS PARA REGENERACIÓN INTELIGENTE DE RECIBOS ==========

    /**
     * Detecta si los cambios a una póliza requieren regenerar recibos.
     * @private
     * @param {Object} polizaActual - Póliza antes de la modificación
     * @param {Object} nuevoDatos - Datos nuevos a aplicar
     * @returns {Object} - { requiereRegeneracion: boolean, cambios: string[] }
     */
    _detectarCambiosCriticos(polizaActual, nuevoDatos) {
        const cambios = [];

        // Mapeo de campos del formulario a campos de BD
        const camposRelevantes = [
            { form: 'periodicidad_pago_id', db: 'periodicidad_id', nombre: 'Periodicidad de pago' },
            { form: 'prima_total', db: 'prima_total', nombre: 'Prima total' },
            { form: 'fecha_inicio', db: 'vigencia_inicio', nombre: 'Fecha de inicio' },
            { form: 'fecha_fin', db: 'vigencia_fin', nombre: 'Fecha de fin' }
        ];

        for (const campo of camposRelevantes) {
            const valorActual = polizaActual[campo.db];
            const valorNuevo = nuevoDatos[campo.form];

            // Normalizar para comparación
            const actualNorm = String(valorActual);
            const nuevoNorm = String(valorNuevo);

            if (actualNorm !== nuevoNorm) {
                cambios.push({
                    nombre: campo.nombre,
                    anterior: valorActual,
                    nuevo: valorNuevo
                });
            }
        }

        return {
            requiereRegeneracion: cambios.length > 0,
            cambios
        };
    }

    /**
     * Muestra diálogo de confirmación antes de regenerar recibos.
     * @private
     * @param {Object} cambiosCriticos - Resultado de _detectarCambiosCriticos
     * @returns {Promise<boolean>}
     */
    async _confirmarRegeneracion(cambiosCriticos) {
        const cambiosHTML = cambiosCriticos.cambios.map(c =>
            `<li><strong>${c.nombre}:</strong> ${c.anterior} → ${c.nuevo}</li>`
        ).join('');

        const mensaje = `
            <div class="text-left">
                <p class="mb-2"><strong>⚠️ Los siguientes cambios requieren regenerar recibos:</strong></p>
                <ul class="list-disc list-inside mb-3 text-sm">
                    ${cambiosHTML}
                </ul>
                <p class="text-sm text-gray-700 mb-2">
                    <strong>Se mantendrán:</strong> Recibos ya pagados
                </p>
                <p class="text-sm text-gray-700 mb-2">
                    <strong>Se eliminarán:</strong> Recibos pendientes/vencidos
                </p>
                <p class="text-sm text-gray-700">
                    <strong>Se generarán:</strong> Nuevos recibos con los valores actualizados
                </p>
                <p class="mt-3 font-semibold">¿Deseas continuar?</p>
            </div>
        `;

        return new Promise((resolve) => {
            if (window.confirm(mensaje.replace(/<[^>]*>/g, '\n'))) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Muestra diálogo de confirmación antes de crear póliza.
     * @private
     * @param {Object} polizaData - Datos de la póliza a crear
     * @param {number} numeroRecibos - Cantidad de recibos que se generarán
     * @returns {Promise<boolean>}
     */
    async _confirmarCreacion(polizaData, numeroRecibos) {
        const periodicidad = this.periodicidades.find(p => p.periodicidad_id === polizaData.periodicidad_pago_id);
        const periodicidadNombre = periodicidad ? periodicidad.nombre : 'N/A';

        const mensaje = `
Se creará la póliza "${polizaData.numero_poliza}" con:
- Periodicidad: ${periodicidadNombre}
- Prima total: $${polizaData.prima_total.toFixed(2)}
- Vigencia: ${polizaData.fecha_inicio} a ${polizaData.fecha_fin}

Se generarán automáticamente ${numeroRecibos} recibos de pago.

¿Deseas continuar?
        `.trim();

        return new Promise((resolve) => {
            if (window.confirm(mensaje)) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Calcula cuántos recibos se generarán para una póliza.
     * @private
     * @param {Object} polizaData - Datos de la póliza
     * @returns {number}
     */
    _calcularNumeroRecibos(polizaData) {
        const periodicidad = this.periodicidades.find(p => p.periodicidad_id === polizaData.periodicidad_pago_id);

        if (!periodicidad) {
            return 0;
        }

        const mesesPorRecibo = periodicidad.meses || 1;
        const fechaInicio = new Date(polizaData.fecha_inicio);
        const fechaFin = new Date(polizaData.fecha_fin);

        // Calcular diferencia en meses
        const diffMeses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 +
                         (fechaFin.getMonth() - fechaInicio.getMonth()) + 1;

        return Math.ceil(diffMeses / mesesPorRecibo);
    }
}
console.log('✅ PolizasController class loaded successfully');

// Register in global scope
window.PolizasController = PolizasController;
