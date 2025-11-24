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

        // Quick Filters
        this.quickFilterAll = document.getElementById('quickFilterAll');
        this.quickFilterVencenHoy = document.getElementById('quickFilterVencenHoy');
        this.quickFilterVencen7 = document.getElementById('quickFilterVencen7');
        this.quickFilterPendientes = document.getElementById('quickFilterPendientes');
        this.quickFilterVencidos = document.getElementById('quickFilterVencidos');
        this.quickFilterPagadosHoy = document.getElementById('quickFilterPagadosHoy');
        this.quickFilterCounter = document.getElementById('quickFilterCounter');
        this.quickFilterClear = document.getElementById('quickFilterClear');

        // Modal Registrar Pago
        this.modalPago = document.getElementById('modalRegistrarPago');
        this.btnCloseModalPago = document.getElementById('btnCloseModalPago');
        this.btnCancelarPago = document.getElementById('btnCancelarPago');
        this.formPago = document.getElementById('formRegistrarPago');
        this.pagoReciboInfo = document.getElementById('pagoReciboInfo');
        this.pagoMontoInfo = document.getElementById('pagoMontoInfo');
        this.inputFechaPagoModal = document.getElementById('inputFechaPagoModal');
        this.inputMetodoPagoModal = document.getElementById('inputMetodoPagoModal');
        this.inputReferenciaPago = document.getElementById('inputReferenciaPago');
        this.inputNotasPago = document.getElementById('inputNotasPago');
        this.checkGenerarComprobante = document.getElementById('checkGenerarComprobante');

        // Estadísticas mejoradas
        this.statMontoTotal = document.getElementById('statMontoTotal');
        this.statRecibosTotal = document.getElementById('statRecibosTotal');
        this.statMontoPendiente = document.getElementById('statMontoPendiente');
        this.statRecibosPendientes = document.getElementById('statRecibosPendientes');
        this.statMontoVence7 = document.getElementById('statMontoVence7');
        this.statMontoPagado = document.getElementById('statMontoPagado');
        this.statRecibosPagados = document.getElementById('statRecibosPagados');
        this.statPagadoMes = document.getElementById('statPagadoMes');
        this.statMontoVencido = document.getElementById('statMontoVencido');
        this.statRecibosVencidos = document.getElementById('statRecibosVencidos');
        this.statDiasVencido = document.getElementById('statDiasVencido');
        this.barraUrgencia = document.getElementById('barraUrgencia');

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

        // Quick Filters
        this.quickFilterAll.addEventListener('click', () => this.applyQuickFilter('all'));
        this.quickFilterVencenHoy.addEventListener('click', () => this.applyQuickFilter('vencen-hoy'));
        this.quickFilterVencen7.addEventListener('click', () => this.applyQuickFilter('vencen-7'));
        this.quickFilterPendientes.addEventListener('click', () => this.applyQuickFilter('pendientes'));
        this.quickFilterVencidos.addEventListener('click', () => this.applyQuickFilter('vencidos'));
        this.quickFilterPagadosHoy.addEventListener('click', () => this.applyQuickFilter('pagados-hoy'));
        this.quickFilterClear.addEventListener('click', () => this.applyQuickFilter('all'));

        // Modal Pago
        this.btnCloseModalPago.addEventListener('click', () => this.closeModalPago());
        this.btnCancelarPago.addEventListener('click', () => this.closeModalPago());
        this.modalPago.addEventListener('click', (e) => {
            if (e.target === this.modalPago) this.closeModalPago();
        });
        this.formPago.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistrarPago();
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

        // Si hay filtros activos
        if (this.activeFilters.pendiente || this.activeFilters.pagado || this.activeFilters.vencido) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            filtered = filtered.filter(r => {
                // Determinar estado real del recibo
                const fechaCorte = new Date(r.fecha_corte);
                fechaCorte.setHours(0, 0, 0, 0);

                const esPagado = r.estado === 'pagado';
                const estaVencido = !esPagado && fechaCorte < hoy;
                const estaPendiente = !esPagado && !estaVencido;

                // Verificar si cumple con algún filtro activo
                if (this.activeFilters.pagado && esPagado) return true;
                if (this.activeFilters.vencido && estaVencido) return true;
                if (this.activeFilters.pendiente && estaPendiente) return true;

                return false;
            });
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
            const urgenciaIndicator = this.getUrgenciaIndicator(recibo);
            const diasRestantes = this.diasHasta(recibo.fecha_corte);

            return `
                <tr class="group transition-colors cursor-pointer hover:bg-gray-50" data-recibo-id="${recibo.recibo_id}">
                    <!-- Indicador de Urgencia -->
                    <td class="px-2 py-4 text-center">
                        ${urgenciaIndicator}
                    </td>

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
                    <td class="px-6 py-4 text-sm">
                        <div class="text-gray-900">${this.formatDate(recibo.fecha_corte)}</div>
                        ${recibo.estado !== 'pagado' ? `
                            <div class="text-xs ${diasRestantes < 0 ? 'text-red-600 font-semibold' : diasRestantes <= 7 ? 'text-orange-600' : 'text-gray-500'}">
                                ${diasRestantes < 0
                                    ? `Vencido hace ${Math.abs(diasRestantes)} día(s)`
                                    : diasRestantes === 0
                                    ? 'Vence HOY'
                                    : `En ${diasRestantes} día(s)`}
                            </div>
                        ` : ''}
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
                                data-action="generate-pdf"
                                data-recibo-id="${recibo.recibo_id}"
                                class="p-1 text-purple-600 hover:text-white hover:bg-purple-600 rounded transition-all duration-150"
                                title="Generar Comprobante PDF"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                            </button>
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
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const en7Dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        inicioMes.setHours(0, 0, 0, 0);

        const stats = this.recibos.reduce((acc, recibo) => {
            const monto = parseFloat(recibo.monto) || 0;
            const fechaCorte = new Date(recibo.fecha_corte);
            fechaCorte.setHours(0, 0, 0, 0);

            // Normalizar fecha de pago
            const fechaPago = recibo.fecha_pago ? new Date(recibo.fecha_pago) : null;
            if (fechaPago) {
                fechaPago.setHours(0, 0, 0, 0);
            }

            // Determinar si está vencido (fecha de corte ya pasó y no está pagado)
            const estaVencido = recibo.estado !== 'pagado' && fechaCorte < hoy;

            // Totales
            acc.montoTotal += monto;
            acc.recibosTotal += 1;

            // Pagados
            if (recibo.estado === 'pagado') {
                acc.montoPagado += monto;
                acc.recibosPagados += 1;

                // Pagados este mes (comparar año y mes)
                if (fechaPago && fechaPago >= inicioMes && fechaPago <= hoy) {
                    acc.montoPagadoMes += monto;
                }
            }
            // Vencidos (no pagados y fecha de corte ya pasó)
            else if (estaVencido) {
                acc.montoVencido += monto;
                acc.recibosVencidos += 1;

                // Días vencido más antiguo
                const diasVencido = Math.floor((hoy - fechaCorte) / (1000 * 60 * 60 * 24));
                if (diasVencido > acc.diasVencidoMax) {
                    acc.diasVencidoMax = diasVencido;
                }
            }
            // Pendientes (no pagados y fecha de corte no ha pasado)
            else {
                acc.montoPendiente += monto;
                acc.recibosPendientes += 1;

                // Vencen en 7 días
                if (fechaCorte <= en7Dias) {
                    acc.montoVence7 += monto;
                }
            }

            return acc;
        }, {
            montoTotal: 0,
            recibosTotal: 0,
            montoPendiente: 0,
            recibosPendientes: 0,
            montoPagado: 0,
            recibosPagados: 0,
            montoVencido: 0,
            recibosVencidos: 0,
            montoVence7: 0,
            montoPagadoMes: 0,
            diasVencidoMax: 0
        });

        // Actualizar DOM con formato inteligente y tooltips con valores completos
        this.statMontoTotal.textContent = this.formatCurrencySmart(stats.montoTotal);
        this.statMontoTotal.title = this.formatCurrency(stats.montoTotal);
        this.statRecibosTotal.textContent = `${stats.recibosTotal} recibos`;

        this.statMontoPendiente.textContent = this.formatCurrencySmart(stats.montoPendiente);
        this.statMontoPendiente.title = this.formatCurrency(stats.montoPendiente);
        this.statRecibosPendientes.textContent = `${stats.recibosPendientes} recibos`;
        this.statMontoVence7.textContent = this.formatCurrencySmart(stats.montoVence7);
        this.statMontoVence7.title = this.formatCurrency(stats.montoVence7);

        this.statMontoPagado.textContent = this.formatCurrencySmart(stats.montoPagado);
        this.statMontoPagado.title = this.formatCurrency(stats.montoPagado);
        this.statRecibosPagados.textContent = `${stats.recibosPagados} recibos`;
        this.statPagadoMes.textContent = this.formatCurrencySmart(stats.montoPagadoMes);
        this.statPagadoMes.title = this.formatCurrency(stats.montoPagadoMes);

        this.statMontoVencido.textContent = this.formatCurrencySmart(stats.montoVencido);
        this.statMontoVencido.title = this.formatCurrency(stats.montoVencido);
        this.statRecibosVencidos.textContent = `${stats.recibosVencidos} recibos`;
        this.statDiasVencido.textContent = stats.diasVencidoMax > 0 ? `${stats.diasVencidoMax} días` : 'N/A';

        // Barra de urgencia (% de lo pendiente que vence en 7 días)
        const porcentajeUrgencia = stats.montoPendiente > 0
            ? (stats.montoVence7 / stats.montoPendiente) * 100
            : 0;
        this.barraUrgencia.style.width = `${Math.min(porcentajeUrgencia, 100)}%`;
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
            } else if (action === 'generate-pdf') {
                this.generateReciboPDF(reciboId);
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
                // Abrir modal de pago en lugar de edición
                const recibo = this.recibos.find(r => r.recibo_id === reciboId);
                if (recibo && recibo.estado !== 'pagado') {
                    this.openModalPago(reciboId);
                } else if (recibo && recibo.estado === 'pagado') {
                    // Si ya está pagado, generar PDF directamente
                    this.generateReciboPDF(reciboId);
                }
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
        } else if (num >= 10000) {
            return '$' + (num / 1000).toFixed(1) + 'K';
        } else {
            return '$' + num.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    formatCurrencySmart(amount) {
        const num = Number(amount || 0);
        // Si es mayor a 999,999.99 (7+ dígitos) usar abreviado
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 100000) {
            return '$' + (num / 1000).toFixed(0) + 'K';
        } else if (num >= 10000) {
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

    // Quick Filters
    applyQuickFilter(filter) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const en7Dias = new Date(hoy);
        en7Dias.setDate(en7Dias.getDate() + 7);

        let filtered = [...this.recibosOriginal];

        switch(filter) {
            case 'vencen-hoy':
                filtered = filtered.filter(r => {
                    if (r.estado === 'pagado') return false;
                    const corte = new Date(r.fecha_corte);
                    corte.setHours(0, 0, 0, 0);
                    return corte.getTime() === hoy.getTime();
                });
                break;

            case 'vencen-7':
                filtered = filtered.filter(r => {
                    if (r.estado === 'pagado') return false;
                    const corte = new Date(r.fecha_corte);
                    return corte >= hoy && corte <= en7Dias;
                });
                break;

            case 'pendientes':
                filtered = filtered.filter(r => {
                    if (r.estado === 'pagado') return false;
                    const corte = new Date(r.fecha_corte);
                    corte.setHours(0, 0, 0, 0);
                    return corte >= hoy; // Pendientes son los que aún no vencen
                });
                break;

            case 'vencidos':
                filtered = filtered.filter(r => {
                    if (r.estado === 'pagado') return false;
                    const corte = new Date(r.fecha_corte);
                    corte.setHours(0, 0, 0, 0);
                    return corte < hoy; // Vencidos son los que ya pasó su fecha de corte
                });
                break;

            case 'pagados-hoy':
                filtered = filtered.filter(r => {
                    if (!r.fecha_pago) return false;
                    const pago = new Date(r.fecha_pago);
                    pago.setHours(0, 0, 0, 0);
                    return pago.getTime() === hoy.getTime();
                });
                break;

            case 'all':
            default:
                // No filtrar
                break;
        }

        this.recibos = filtered;

        // Actualizar botones activos
        document.querySelectorAll('.quick-filter-btn').forEach(btn => btn.classList.remove('active'));
        const btnId = filter === 'all' ? 'quickFilterAll' :
                      filter === 'vencen-hoy' ? 'quickFilterVencenHoy' :
                      filter === 'vencen-7' ? 'quickFilterVencen7' :
                      filter === 'pendientes' ? 'quickFilterPendientes' :
                      filter === 'vencidos' ? 'quickFilterVencidos' :
                      filter === 'pagados-hoy' ? 'quickFilterPagadosHoy' : 'quickFilterAll';
        document.getElementById(btnId).classList.add('active');

        // Mostrar contador y botón clear
        if (filter !== 'all') {
            this.quickFilterCounter.textContent = `${filtered.length} recibo(s)`;
            this.quickFilterClear.classList.remove('hidden');
        } else {
            this.quickFilterCounter.textContent = '';
            this.quickFilterClear.classList.add('hidden');
        }

        this.renderTable();
        this.updateStats();
    }

    // Indicador de urgencia visual
    getUrgenciaIndicator(recibo) {
        if (recibo.estado === 'pagado') {
            return '<span class="inline-block w-2 h-2 bg-green-500 rounded-full" title="Pagado"></span>';
        }

        const dias = this.diasHasta(recibo.fecha_corte);

        if (dias < 0) {
            return '<span class="inline-flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse" title="VENCIDO">!</span>';
        } else if (dias === 0) {
            return '<span class="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold" title="Vence HOY">!</span>';
        } else if (dias <= 3) {
            return '<span class="inline-block w-3 h-3 bg-red-500 rounded-full" title="Crítico: vence en ' + dias + ' día(s)"></span>';
        } else if (dias <= 7) {
            return '<span class="inline-block w-3 h-3 bg-orange-500 rounded-full" title="Urgente: vence en ' + dias + ' día(s)"></span>';
        } else if (dias <= 15) {
            return '<span class="inline-block w-3 h-3 bg-yellow-400 rounded-full" title="Próximo: vence en ' + dias + ' día(s)"></span>';
        }

        return '<span class="inline-block w-2 h-2 bg-gray-300 rounded-full" title="Normal: vence en ' + dias + ' día(s)"></span>';
    }

    // Modal Registrar Pago
    async openModalPago(reciboId) {
        try {
            const response = await window.electronAPI.recibos.getById(reciboId);
            if (!response.success || !response.data) {
                throw new Error('Recibo no encontrado');
            }

            const recibo = response.data;
            this.currentRecibo = recibo;

            // Llenar información
            this.pagoReciboInfo.textContent = recibo.numero_recibo || `#${recibo.recibo_id}`;
            this.pagoMontoInfo.textContent = this.formatCurrency(recibo.monto);

            // Prefill fecha de hoy
            this.inputFechaPagoModal.value = new Date().toISOString().split('T')[0];

            // Resetear campos
            this.inputMetodoPagoModal.value = '';
            this.inputReferenciaPago.value = '';
            this.inputNotasPago.value = '';
            this.checkGenerarComprobante.checked = true;

            this.modalPago.classList.add('active');
            document.body.classList.add('modal-open');
        } catch (error) {
            console.error('Error al abrir modal de pago:', error);
            alert('No se pudo abrir el modal de pago.');
        }
    }

    closeModalPago() {
        this.modalPago.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.currentRecibo = null;
    }

    async handleRegistrarPago() {
        if (!this.currentRecibo) return;

        const formData = new FormData(this.formPago);

        const pagoData = {
            recibo_id: this.currentRecibo.recibo_id,
            fecha_pago: formData.get('fecha_pago'),
            metodo_pago: formData.get('metodo_pago'),
            referencia: formData.get('referencia') || null,
            notas: formData.get('notas') || null,
            generar_pdf: this.checkGenerarComprobante.checked
        };

        try {
            const response = await window.electronAPI.recibos.registrarPago(pagoData);

            if (response.success) {
                this.closeModalPago();

                // Si se generó PDF, preguntar si quiere abrirlo
                if (pagoData.generar_pdf && response.pdfPath) {
                    if (confirm('Pago registrado. ¿Deseas abrir el comprobante PDF?')) {
                        await window.electronAPI.openFile(response.pdfPath);
                    }
                } else {
                    alert('Pago registrado correctamente.');
                }

                await this.loadRecibos();
            } else {
                throw new Error(response.message || 'Error al registrar el pago');
            }
        } catch (error) {
            console.error('Error al registrar pago:', error);
            alert(error.message || 'Error al registrar el pago.');
        }
    }

    // Modificar markAsPaid para usar el modal
    async markAsPaid(reciboId) {
        await this.openModalPago(reciboId);
    }

    // Generar PDF de recibo
    async generateReciboPDF(reciboId) {
        try {
            const response = await window.electronAPI.recibos.generarPDF(reciboId);
            if (response.success) {
                if (confirm(`Comprobante generado: ${response.fileName}\n\n¿Deseas abrirlo?`)) {
                    await window.electronAPI.openFile(response.filePath);
                }
            } else {
                throw new Error(response.message || 'Error al generar PDF');
            }
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('No se pudo generar el comprobante PDF.');
        }
    }
}

console.log('✅ RecibosController class loaded successfully');

// Register in global scope
window.RecibosController = RecibosController;
