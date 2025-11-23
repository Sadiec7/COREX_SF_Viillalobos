// controllers/recibos_controller.js
// Controlador para la gestión de recibos con búsqueda unificada

class RecibosController {
    constructor() {
        this.recibos = [];
        this.recibosOriginal = [];
        this.polizas = [];
        this.clientes = [];
        this.prefillPolizaId = null;
        this.prefillPolizaNumero = '';
        this.currentRecibo = null;
        this.isEditMode = false;
        this.activeFilters = {
            pendiente: false,
            pagado: false,
            vencido: false
        };

        // Pagination
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalPages = 1;

        this.initElements();
        this.initEventListeners();
        this.bootstrapContext();
        this.loadCatalogos();
    }

    initElements() {
        // Botones
        this.btnBack = document.getElementById('btnBack');
        this.btnAddRecibo = document.getElementById('btnAddRecibo');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Búsqueda
        this.searchInput = document.getElementById('searchInput');

        // Filters Modal
        this.btnOpenFilters = document.getElementById('btnOpenFilters');
        this.modalFiltros = document.getElementById('modalFiltros');
        this.btnCloseFiltros = document.getElementById('btnCloseFiltros');
        this.btnApplyFilters = document.getElementById('btnApplyFilters');
        this.btnClearFilters = document.getElementById('btnClearFilters');
        this.filterBadge = document.getElementById('filterBadge');

        // Filter Checkboxes
        this.filterPendiente = document.getElementById('filterPendiente');
        this.filterPagado = document.getElementById('filterPagado');
        this.filterVencido = document.getElementById('filterVencido');

        // Estadísticas
        this.statTotal = document.getElementById('statTotal');
        this.statPendientes = document.getElementById('statPendientes');
        this.statPagados = document.getElementById('statPagados');
        this.statVencidos = document.getElementById('statVencidos');

        // Tabla
        this.tableBody = document.getElementById('recibosTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

        // Pagination
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

        // Modal
        this.modal = document.getElementById('modalRecibo');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formRecibo');

        // Form inputs
        this.inputPoliza = document.getElementById('inputPoliza');
        this.inputNumeroRecibo = document.getElementById('inputNumeroRecibo');
        this.inputFechaInicio = document.getElementById('inputFechaInicio');
        this.inputFechaFin = document.getElementById('inputFechaFin');
        this.inputNumeroFraccion = document.getElementById('inputNumeroFraccion');
        this.inputMonto = document.getElementById('inputMonto');
        this.inputFechaCorte = document.getElementById('inputFechaCorte');
        this.inputDiasGracia = document.getElementById('inputDiasGracia');
        this.inputEstado = document.getElementById('inputEstado');
        this.inputFechaPago = document.getElementById('inputFechaPago');
    }

    initEventListeners() {
        // Back button (optional - only in standalone view, not SPA)
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => this.goBack());
        }
        this.btnAddRecibo.addEventListener('click', () => this.openCreateModal());
        this.btnCloseModal.addEventListener('click', () => this.closeModal());
        this.btnCancelForm.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        this.searchInput.addEventListener('input', (event) => {
            this.applySearch(event.target.value);
        });

        // Items per page selector
        if (this.itemsPerPageSelect) {
            this.itemsPerPageSelect.addEventListener('change', (e) => {
                this.changeItemsPerPage(e.target.value);
            });
        }

        // Table click handler (for rows and action buttons)
        this.tableBody.addEventListener('click', (e) => this.handleActionClick(e));

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

    bootstrapContext() {
        try {
            const polizaId = localStorage.getItem('recibosPolizaId');
            const numeroPoliza = localStorage.getItem('recibosPolizaNumero');

            if (polizaId) {
                this.prefillPolizaId = Number(polizaId);
            }

            if (numeroPoliza) {
                this.prefillPolizaNumero = numeroPoliza;
                document.getElementById('contextInfo').textContent =
                    `Contexto: Póliza ${numeroPoliza}`;
                this.searchInput.value = numeroPoliza;
            }

            localStorage.removeItem('recibosPolizaId');
            localStorage.removeItem('recibosPolizaNumero');
        } catch (error) {
            console.warn('No se pudo leer el contexto almacenado:', error);
        }
    }

    async loadCatalogos() {
        try {
            this.showLoading(true);
            const [polizasRes, clientesRes] = await Promise.all([
                window.electronAPI.polizas.getAll({}),
                window.electronAPI.clientes.getAll()
            ]);

            if (polizasRes.success) {
                this.polizas = polizasRes.data || [];
                this.populatePolizasSelect();
            }

            if (clientesRes.success) {
                this.clientes = clientesRes.data || [];
            }

            await this.loadRecibos();
        } catch (error) {
            console.error('Error al cargar catálogos de recibos:', error);
            alert('Error al cargar catálogos. Revisa la consola para más detalles.');
            this.showLoading(false);
        }
    }

    populatePolizasSelect() {
        if (!this.inputPoliza) return;
        this.inputPoliza.innerHTML = '<option value=\"\">Seleccionar póliza...</option>';
        this.polizas.forEach(poliza => {
            const option = document.createElement('option');
            option.value = poliza.poliza_id;
            option.textContent = `${poliza.numero_poliza} (${poliza.cliente_nombre || 'Sin cliente'})`;
            this.inputPoliza.appendChild(option);
        });

        if (this.prefillPolizaId) {
            this.inputPoliza.value = this.prefillPolizaId;
        }
    }

    async loadRecibos() {
        try {
            this.showLoading(true);
            const response = await window.electronAPI.recibos.list({});

            if (response.success) {
                this.recibosOriginal = response.data || [];
                const initialTerm = this.searchInput.value || '';
                this.applySearch(initialTerm);
            } else {
                throw new Error(response.message || 'Error al cargar recibos');
            }
        } catch (error) {
            console.error('Error al cargar recibos:', error);
            alert('Error al cargar los recibos.');
            this.showLoading(false);
        }
    }

    applySearch(term = '') {
        const normalized = term.trim().toLowerCase();

        if (!normalized) {
            this.recibos = [...this.recibosOriginal];
        } else {
            this.recibos = this.recibosOriginal.filter(recibo => {
                const targets = [
                    recibo.numero_recibo,
                    recibo.numero_poliza,
                    recibo.cliente_nombre,
                    recibo.aseguradora_nombre
                ]
                    .filter(Boolean)
                    .map(value => value.toString().toLowerCase());
                return targets.some(value => value.includes(normalized));
            });
        }

        // Apply active filters
        this.recibos = this.applyActiveFilters(this.recibos);

        this.renderTable();
        this.updateStats();
        this.showLoading(false);
    }

    openFiltersModal() {
        this.modalFiltros.classList.add('active');
    }

    closeFiltersModal() {
        this.modalFiltros.classList.remove('active');
    }

    applyFilters() {
        // Save filter state
        this.activeFilters.pendiente = this.filterPendiente.checked;
        this.activeFilters.pagado = this.filterPagado.checked;
        this.activeFilters.vencido = this.filterVencido.checked;

        // Update badge
        this.updateFilterBadge();

        // Close modal
        this.closeFiltersModal();

        // Re-apply search with new filters
        this.applySearch(this.searchInput.value);
    }

    clearFilters() {
        // Reset checkboxes
        this.filterPendiente.checked = false;
        this.filterPagado.checked = false;
        this.filterVencido.checked = false;

        // Reset active filters
        this.activeFilters = {
            pendiente: false,
            pagado: false,
            vencido: false
        };

        // Update badge
        this.updateFilterBadge();

        // Re-apply search without filters
        this.applySearch(this.searchInput.value);
    }

    updateFilterBadge() {
        let count = 0;
        if (this.activeFilters.pendiente) count++;
        if (this.activeFilters.pagado) count++;
        if (this.activeFilters.vencido) count++;

        if (count > 0) {
            this.filterBadge.textContent = count;
            this.filterBadge.classList.remove('hidden');
        } else {
            this.filterBadge.classList.add('hidden');
        }
    }

    applyActiveFilters(recibos) {
        let filtered = [...recibos];

        // Filter by estado
        const estadoFilters = [];
        if (this.activeFilters.pendiente) estadoFilters.push('Pendiente');
        if (this.activeFilters.pagado) estadoFilters.push('Pagado');
        if (this.activeFilters.vencido) estadoFilters.push('Vencido');

        if (estadoFilters.length > 0) {
            filtered = filtered.filter(r => estadoFilters.includes(r.estado));
        }

        return filtered;
    }

    renderTable() {
        if (!this.recibos.length) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            return;
        }

        this.emptyState.classList.add('hidden');

        // Calculate pagination
        this.totalPages = PaginationHelper.getTotalPages(this.recibos.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Get items for current page
        const paginatedRecibos = PaginationHelper.getPaginatedItems(this.recibos, this.currentPage, this.itemsPerPage);

        this.tableBody.innerHTML = paginatedRecibos.map(recibo => {
            const estadoClass = this.getEstadoBadge(recibo.estado, recibo.fecha_corte);
            return `
                <tr class="group transition-colors cursor-pointer hover:bg-gray-50" data-recibo-id="${recibo.recibo_id}">
                    <td class="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${this.escapeHtml(recibo.numero_recibo || `#${recibo.recibo_id}`)}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        <div class="font-medium text-gray-900">${this.escapeHtml(recibo.numero_poliza || '')}</div>
                        <div class="text-xs text-gray-500">${this.escapeHtml(recibo.cliente_nombre || '')}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${this.formatDate(recibo.fecha_inicio_periodo)} - ${this.formatDate(recibo.fecha_fin_periodo)}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${this.formatCurrency(recibo.monto)}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${this.formatDate(recibo.fecha_corte)}
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <span class="status-badge ${estadoClass}">
                            ${this.capitalize(recibo.estado)}
                        </span>
                        ${recibo.fecha_pago ? `<div class="text-xs text-gray-500 mt-1">Pago: ${this.formatDate(recibo.fecha_pago)}</div>` : ''}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${this.escapeHtml(recibo.aseguradora_nombre || '-')}
                    </td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2">
                            ${recibo.estado !== 'pagado' ? `
                                <button
                                    data-action="mark-paid"
                                    data-recibo-id="${recibo.recibo_id}"
                                    class="p-1 text-green-600 hover:text-white hover:bg-green-600 rounded transition-all duration-150"
                                    title="Marcar como pagado"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </button>
                            ` : `
                                <button
                                    data-action="mark-pending"
                                    data-recibo-id="${recibo.recibo_id}"
                                    class="p-1 text-yellow-600 hover:text-white hover:bg-yellow-600 rounded transition-all duration-150"
                                    title="Marcar como pendiente"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                </button>
                            `}
                            <button
                                data-action="edit"
                                data-recibo-id="${recibo.recibo_id}"
                                class="p-1 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded transition-all duration-150"
                                title="Editar"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                data-action="delete"
                                data-recibo-id="${recibo.recibo_id}"
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
            `;
        }).join('');

        // Render pagination controls
        this.renderPagination(this.recibos.length);
    }

    updateStats() {
        const totals = this.recibos.reduce((acc, recibo) => {
            acc.total += 1;
            acc[recibo.estado] = (acc[recibo.estado] || 0) + 1;
            return acc;
        }, { total: 0, pendiente: 0, pagado: 0, vencido: 0 });

        this.statTotal.textContent = totals.total;
        this.statPendientes.textContent = totals.pendiente;
        this.statPagados.textContent = totals.pagado;
        this.statVencidos.textContent = totals.vencido;
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.recibosController.goToPage'
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderTable();
    }

    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1; // Reset to first page
        this.renderTable();
    }

    openCreateModal() {
        this.isEditMode = false;
        this.currentRecibo = null;
        this.modalTitle.textContent = 'Nuevo Recibo';
        this.form.reset();
        this.inputEstado.value = 'pendiente';

        if (this.prefillPolizaId) {
            this.inputPoliza.value = this.prefillPolizaId;
        }

        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    async openEditModal(reciboId) {
        try {
            const response = await window.electronAPI.recibos.getById(reciboId);
            if (!response.success || !response.data) {
                throw new Error('Recibo no encontrado');
            }

            const recibo = response.data;
            this.isEditMode = true;
            this.currentRecibo = recibo;
            this.modalTitle.textContent = `Editar recibo ${recibo.numero_recibo || recibo.recibo_id}`;
            this.form.reset();

            this.inputPoliza.value = recibo.poliza_id;
            this.inputNumeroRecibo.value = recibo.numero_recibo || '';
            this.inputFechaInicio.value = this.toInputDate(recibo.fecha_inicio_periodo);
            this.inputFechaFin.value = this.toInputDate(recibo.fecha_fin_periodo);
            this.inputNumeroFraccion.value = recibo.numero_fraccion || '';
            this.inputMonto.value = recibo.monto || '';
            this.inputFechaCorte.value = this.toInputDate(recibo.fecha_corte);
            this.inputDiasGracia.value = recibo.dias_gracia || 0;
            this.inputEstado.value = recibo.estado || 'pendiente';
            this.inputFechaPago.value = recibo.fecha_pago ? this.toInputDate(recibo.fecha_pago) : '';

            this.modal.classList.add('active');
        document.body.classList.add('modal-open');
        } catch (error) {
            console.error('Error al cargar recibo:', error);
            alert('No se pudo cargar el recibo seleccionado.');
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const polizaId = parseInt(formData.get('poliza_id'));
        if (!polizaId) {
            alert('Selecciona una póliza');
            return;
        }

        const monto = parseFloat(formData.get('monto'));
        if (Number.isNaN(monto) || monto <= 0) {
            alert('El monto debe ser mayor a cero');
            return;
        }

        const reciboData = {
            poliza_id: polizaId,
            numero_recibo: formData.get('numero_recibo')?.trim() || null,
            fecha_inicio_periodo: formData.get('fecha_inicio_periodo'),
            fecha_fin_periodo: formData.get('fecha_fin_periodo'),
            numero_fraccion: parseInt(formData.get('numero_fraccion') || '1', 10),
            monto,
            fecha_corte: formData.get('fecha_corte'),
            fecha_vencimiento_original: formData.get('fecha_corte'),
            dias_gracia: parseInt(formData.get('dias_gracia') || '0', 10),
            estado: formData.get('estado') || 'pendiente',
            fecha_pago: formData.get('fecha_pago') || null
        };

        try {
            let response;
            if (this.isEditMode && this.currentRecibo) {
                response = await window.electronAPI.recibos.update(this.currentRecibo.recibo_id, reciboData);
            } else {
                response = await window.electronAPI.recibos.create(reciboData);
            }

            if (response.success) {
                this.closeModal();
                await this.loadRecibos();
                alert('Recibo guardado correctamente.');
            } else {
                throw new Error(response.message || 'No se pudo guardar el recibo');
            }
        } catch (error) {
            console.error('Error al guardar recibo:', error);
            alert(error.message || 'Error al guardar el recibo.');
        }
    }

    async deleteRecibo(reciboId) {
        const recibo = this.recibos.find(r => r.recibo_id === reciboId);
        const displayName = recibo?.numero_fraccion
            ? `Recibo ${recibo.numero_fraccion}`
            : `Recibo #${reciboId}`;

        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.confirmDelete(displayName);
        } else {
            confirmed = confirm('¿Eliminar este recibo de forma permanente?');
        }

        if (!confirmed) {
            return;
        }
        try {
            const response = await window.electronAPI.recibos.delete(reciboId);
            if (response.success) {
                await this.loadRecibos();
                alert('Recibo eliminado.');
            } else {
                throw new Error(response.message || 'No se pudo eliminar el recibo');
            }
        } catch (error) {
            console.error('Error al eliminar recibo:', error);
            alert(error.message || 'Error al eliminar el recibo.');
        }
    }

    async markAsPaid(reciboId) {
        try {
            const response = await window.electronAPI.recibos.marcarPagado(reciboId);
            if (response.success) {
                await this.loadRecibos();
            } else {
                throw new Error(response.message || 'No se pudo marcar como pagado');
            }
        } catch (error) {
            console.error('Error al marcar recibo como pagado:', error);
            alert(error.message || 'Error al actualizar el recibo.');
        }
    }

    async markAsPending(reciboId) {
        try {
            const response = await window.electronAPI.recibos.cambiarEstado(reciboId, 'pendiente');
            if (response.success) {
                await this.loadRecibos();
            } else {
                throw new Error(response.message || 'No se pudo actualizar el recibo');
            }
        } catch (error) {
            console.error('Error al marcar recibo como pendiente:', error);
            alert(error.message || 'Error al actualizar el recibo.');
        }
    }

    handleActionClick(event) {
        // Check if click was on an action button
        const button = event.target.closest('button[data-action]');
        if (button) {
            const reciboId = Number(button.dataset.reciboId);
            if (!reciboId) return;

            const action = button.dataset.action;

            if (action === 'mark-paid') {
                this.markAsPaid(reciboId);
            } else if (action === 'mark-pending') {
                this.markAsPending(reciboId);
            } else if (action === 'edit') {
                this.openEditModal(reciboId);
            } else if (action === 'delete') {
                this.deleteRecibo(reciboId);
            }
            return;
        }

        // If not a button, check if click was on a table row
        const row = event.target.closest('tr[data-recibo-id]');
        if (row) {
            const reciboId = Number(row.dataset.reciboId);
            if (reciboId) {
                this.openEditModal(reciboId);
            }
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
        this.currentRecibo = null;
        this.isEditMode = false;
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
            this.emptyState.classList.add('hidden');
            this.tableBody.innerHTML = '';
        } else {
            this.loadingState.classList.add('hidden');
        }
    }

    getEstadoBadge(estado, fechaCorte) {
        switch (estado) {
            case 'pagado':
                return 'status-vigente';
            case 'vencido':
                return 'status-vencida';
            default: {
                if (fechaCorte) {
                    const dias = this.diasHasta(fechaCorte);
                    if (dias < 0) {
                        return 'status-vencida';
                    }
                    if (dias <= 7) {
                        return 'status-por-vencer';
                    }
                }
                return 'status-por-vencer';
            }
        }
    }

    diasHasta(fecha) {
        const target = new Date(fecha);
        const hoy = new Date();
        const diff = target.getTime() - hoy.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    formatCurrency(amount) {
        return '$' + Number(amount || 0).toLocaleString('es-MX', {
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
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleDateString('es-MX');
    }

    toInputDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    }

    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

console.log('✅ RecibosController class loaded successfully');

// Register in global scope
window.RecibosController = RecibosController;
