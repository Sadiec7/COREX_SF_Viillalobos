// controllers/documentos_controller.js
// Controlador para la gestión de documentos asociados a clientes y pólizas

class DocumentosController {
    constructor() {
        this.documentos = [];
        this.documentosOriginal = [];
        this.documentosSeleccionados = new Set();
        this.clientes = [];
        this.polizas = [];
        this.contextScope = 'cliente';
        this.activeFilters = {
            scope: '' // '', 'cliente', or 'poliza'
        };

        // Paginación
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
        this.btnAddDocumento = document.getElementById('btnAddDocumento');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Search
        this.searchInput = document.getElementById('searchDocumentos');

        // Filters Modal
        this.btnOpenFilters = document.getElementById('btnOpenFilters');
        this.modalFiltros = document.getElementById('modalFiltros');
        this.btnCloseFiltros = document.getElementById('btnCloseFiltros');
        this.btnApplyFilters = document.getElementById('btnApplyFilters');
        this.btnClearFilters = document.getElementById('btnClearFilters');
        this.filterBadge = document.getElementById('filterBadge');

        // Filter Radio Buttons
        this.filterScopeAll = document.getElementById('filterScopeAll');
        this.filterScopeCliente = document.getElementById('filterScopeCliente');
        this.filterScopePoliza = document.getElementById('filterScopePoliza');
        this.filterScopeRadios = document.querySelectorAll('input[name="filterScope"]');

        // Tabla
        this.tableBody = document.getElementById('documentosTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

        // Estadística
        this.statTotal = document.getElementById('statTotal');
        this.bulkActions = document.getElementById('bulkActions');
        this.bulkCount = document.getElementById('bulkCount');
        this.btnBulkSelectAll = document.getElementById('btnSelectAll');
        this.btnBulkClear = document.getElementById('btnClearSelection');
        this.btnBulkExport = document.getElementById('btnExportSelected');
        this.selectAllCheckbox = document.getElementById('selectAllCheckbox');

        // Paginación
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

        // Modal
        this.modal = document.getElementById('modalDocumento');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formDocumento');
        this.detailModal = document.getElementById('modalDocumentoDetalle');
        this.detailCloseBtn = document.getElementById('btnCloseDetalle');
        this.detailOpenBtn = document.getElementById('btnAbrirDetalle');
        this.detailDeleteBtn = document.getElementById('btnDeleteDetalle');
        this.detailFields = {
            id: document.getElementById('detalleId'),
            tipo: document.getElementById('detalleTipo'),
            archivo: document.getElementById('detalleArchivo'),
            ruta: document.getElementById('detalleRuta'),
            cliente: document.getElementById('detalleCliente'),
            poliza: document.getElementById('detallePoliza'),
            fecha: document.getElementById('detalleFecha'),
            titulo: document.getElementById('detalleTitulo')
        };
        this.documentoSeleccionado = null;

        // Inputs del formulario
        this.inputScope = document.getElementById('inputScope');
        this.inputCliente = document.getElementById('inputCliente');
        this.inputPoliza = document.getElementById('inputPoliza');
        this.clienteOptions = document.getElementById('clienteOptions');
        this.polizaOptions = document.getElementById('polizaOptions');
        this.inputTipo = document.getElementById('inputTipo');
        this.inputNombre = document.getElementById('inputNombre');
        this.inputRuta = document.getElementById('inputRuta');
        this.dropzone = document.getElementById('documentDropzoneDoc');
        this.fileInput = document.getElementById('inputDocumentoFile');
        this.selectedFileName = document.getElementById('selectedFileNameDoc');
        this.selectedFile = null;
    }

    initEventListeners() {
        // Back button (optional - only in standalone view, not SPA)
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => this.goBack());
        }
        this.btnAddDocumento.addEventListener('click', () => this.openModal());
        this.btnCloseModal.addEventListener('click', () => this.closeModal());
        this.btnCancelForm.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Detalle modal events
        if (this.detailModal) {
            this.detailModal.addEventListener('click', (event) => {
                if (event.target === this.detailModal) {
                    this.closeDetailModal();
                }
            });
        }
        if (this.detailCloseBtn) {
            this.detailCloseBtn.addEventListener('click', () => this.closeDetailModal());
        }
        if (this.detailOpenBtn) {
            this.detailOpenBtn.addEventListener('click', () => this.abrirDocumentoSeleccionado());
        }
        if (this.detailDeleteBtn) {
            this.detailDeleteBtn.addEventListener('click', async () => {
                if (this.documentoSeleccionado) {
                    const deleted = await this.deleteDocumento(this.documentoSeleccionado.documento_id);
                    if (deleted) {
                        this.closeDetailModal();
                    }
                }
            });
        }

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.applySearch(e.target.value);
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

        // Keep scope radios in sync without crashing when missing nodes
        if (this.filterScopeRadios && this.filterScopeRadios.length) {
            this.filterScopeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.activeFilters.scope = radio.value;
                });
            });
        }

        this.inputScope.addEventListener('change', () => this.toggleFormScope());

        // File picker / dropzone
        if (this.dropzone) {
            ['dragenter', 'dragover'].forEach(evt =>
                this.dropzone.addEventListener(evt, (event) => this.handleDragOver(event))
            );
            ['dragleave', 'drop'].forEach(evt =>
                this.dropzone.addEventListener(evt, (event) => this.handleDragLeave(event))
            );
            this.dropzone.addEventListener('drop', (event) => this.handleDrop(event));
            this.dropzone.addEventListener('click', () => this.openFilePicker());
        }
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (event) => this.handleFileInputChange(event));
        }

        // Bulk actions
        if (this.btnBulkSelectAll) {
            this.btnBulkSelectAll.addEventListener('click', () => this.selectAllVisible());
        }
        if (this.btnBulkClear) {
            this.btnBulkClear.addEventListener('click', () => this.clearSelection());
        }
        if (this.btnBulkExport) {
            this.btnBulkExport.addEventListener('click', () => this.exportSelected());
        }
        if (this.selectAllCheckbox) {
            this.selectAllCheckbox.addEventListener('change', (e) => this.handleHeaderSelectAll(e));
        }
    }

    bootstrapContext() {
        try {
            const clienteId = localStorage.getItem('documentosClienteId');
            const clienteNombre = localStorage.getItem('documentosClienteNombre');
            const polizaId = localStorage.getItem('documentosPolizaId');
            const polizaNumero = localStorage.getItem('documentosPolizaNumero');

            if (clienteId) {
                document.getElementById('contextInfo').textContent =
                    `Contexto: Documentos de ${clienteNombre || 'cliente seleccionado'}`;
                if (this.filterScopeCliente) {
                    this.filterScopeCliente.checked = true;
                }
                this.inputScope.value = 'cliente';
                if (this.inputCliente) {
                    this.inputCliente.dataset.prefill = clienteId;
                    this.inputCliente.value = `${clienteId} — ${clienteNombre || ''}`.trim();
                }
                this.toggleFormScope();
            } else if (polizaId) {
                document.getElementById('contextInfo').textContent =
                    `Contexto: Documentos de póliza ${polizaNumero || polizaId}`;
                if (this.filterScopePoliza) {
                    this.filterScopePoliza.checked = true;
                }
                this.inputScope.value = 'poliza';
                if (this.inputPoliza) {
                    this.inputPoliza.dataset.prefill = polizaId;
                    this.inputPoliza.value = `${polizaId} — ${polizaNumero || ''}`.trim();
                }
                this.toggleFormScope();
            }

            localStorage.removeItem('documentosClienteId');
            localStorage.removeItem('documentosClienteNombre');
            localStorage.removeItem('documentosPolizaId');
            localStorage.removeItem('documentosPolizaNumero');
        } catch (error) {
            console.warn('No se pudo leer el contexto de documentos:', error);
        }
    }

    async loadCatalogos() {
        try {
            this.showLoading(true);
            const [clientesRes, polizasRes] = await Promise.all([
                window.electronAPI.clientes.getAll(),
                window.electronAPI.polizas.getAll({})
            ]);

            if (clientesRes.success) {
                this.clientes = clientesRes.data;
                this.populateClientesSelect(this.clienteOptions);
            }

            if (polizasRes.success) {
                this.polizas = polizasRes.data;
                this.populatePolizasSelect(this.polizaOptions);
            }

            await this.loadDocumentos();
        } catch (error) {
            console.error('Error al cargar catálogos de documentos:', error);
            alert('Error al cargar catálogos. Revisa la consola para más detalles.');
            this.showLoading(false);
        }
    }

    populateClientesSelect(datalist) {
        if (!datalist) return;
        datalist.innerHTML = '';
        this.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = `${cliente.cliente_id} — ${cliente.nombre}`;
            datalist.appendChild(option);
        });
    }

    populatePolizasSelect(datalist) {
        if (!datalist) return;
        datalist.innerHTML = '';
        this.polizas.forEach(poliza => {
            const option = document.createElement('option');
            const label = `${poliza.poliza_id} — ${poliza.numero_poliza} — ${poliza.cliente_nombre || ''}`.trim();
            option.value = label;
            datalist.appendChild(option);
        });
    }

    async loadDocumentos() {
        try {
            this.showLoading(true);
            const response = await window.electronAPI.documentos.getAll();

            if (response.success) {
                this.documentosOriginal = response.data || [];
                this.applySearch(this.searchInput.value);
            } else {
                throw new Error(response.message || 'No se pudieron obtener los documentos');
            }

            this.showLoading(false);
        } catch (error) {
            console.error('Error al cargar documentos:', error);
            alert(error.message || 'Error al cargar los documentos.');
            this.showLoading(false);
        }
    }

    applySearch(term = '') {
        const normalized = term.trim().toLowerCase();

        if (!normalized) {
            this.documentos = [...this.documentosOriginal];
        } else {
            this.documentos = this.documentosOriginal.filter(doc => {
                const targets = [
                    doc.tipo,
                    doc.nombre_archivo,
                    doc.cliente_nombre,
                    doc.numero_poliza
                ]
                    .filter(Boolean)
                    .map(value => value.toString().toLowerCase());
                return targets.some(value => value.includes(normalized));
            });
        }

        // Apply active filters
        this.documentos = this.applyActiveFilters(this.documentos);

        this.renderTable();
        this.updateStats();
    }

    openFiltersModal() {
        this.modalFiltros.classList.add('active');
    }

    closeFiltersModal() {
        this.modalFiltros.classList.remove('active');
    }

    applyFilters() {
        // Get selected radio button value
        let selectedScope = '';
        if (this.filterScopeCliente && this.filterScopeCliente.checked) {
            selectedScope = 'cliente';
        } else if (this.filterScopePoliza && this.filterScopePoliza.checked) {
            selectedScope = 'poliza';
        }

        // Save filter state
        this.activeFilters.scope = selectedScope;

        // Update badge
        this.updateFilterBadge();

        // Close modal
        this.closeFiltersModal();

        // Re-apply search with new filters
        this.applySearch(this.searchInput.value);
    }

    clearFilters() {
        // Reset radio buttons to "All"
        if (this.filterScopeAll) {
            this.filterScopeAll.checked = true;
        }

        // Reset active filters
        this.activeFilters = {
            scope: ''
        };

        // Update badge
        this.updateFilterBadge();

        // Re-apply search without filters
        this.applySearch(this.searchInput.value);
    }

    updateFilterBadge() {
        if (this.activeFilters.scope) {
            this.filterBadge.textContent = '1';
            this.filterBadge.classList.remove('hidden');
        } else {
            this.filterBadge.classList.add('hidden');
        }
    }

    applyActiveFilters(documentos) {
        let filtered = [...documentos];

        // Filter by scope (cliente/poliza)
        if (this.activeFilters.scope === 'cliente') {
            filtered = filtered.filter(d => d.cliente_id !== null);
        } else if (this.activeFilters.scope === 'poliza') {
            filtered = filtered.filter(d => d.poliza_id !== null);
        }

        return filtered;
    }

    renderTable() {
        if (!this.documentos.length) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            this.updateBulkUI();
            return;
        }

        this.emptyState.classList.add('hidden');

        // Calcular paginación
        this.totalPages = PaginationHelper.getTotalPages(this.documentos.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Obtener elementos de la página actual
        const paginatedDocumentos = PaginationHelper.getPaginatedItems(this.documentos, this.currentPage, this.itemsPerPage);

        this.tableBody.innerHTML = paginatedDocumentos.map(doc => {
            const cliente = this.clientes.find(c => c.cliente_id === doc.cliente_id);
            const poliza = this.polizas.find(p => p.poliza_id === doc.poliza_id);
            const isSelected = this.documentosSeleccionados.has(doc.documento_id);
            return `
                <tr class="group transition-colors cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-100' : ''}" data-documento-id="${doc.documento_id}">
                    <td class="px-6 py-4">
                        <input type="checkbox" class="row-checkbox w-4 h-4 text-gold-500 border-gray-300 rounded" data-documento-id="${doc.documento_id}" ${isSelected ? 'checked' : ''}>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">${doc.documento_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${cliente ? `<div class="font-medium text-gray-900">${this.escapeHtml(cliente.nombre)}</div>` : '-'}
                        ${poliza ? `<div class="text-xs text-gray-500">Póliza: ${this.escapeHtml(poliza.numero_poliza)}</div>` : ''}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                        ${this.escapeHtml(doc.tipo)}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 break-all">
                        <div class="font-medium text-gray-900">${this.escapeHtml(doc.nombre_archivo)}</div>
                        <div class="text-xs text-gray-500">${this.escapeHtml(doc.ruta_relativa)}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${this.formatDate(doc.fecha_creacion)}
                    </td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2">
                            <button
                                data-action="delete"
                                data-documento-id="${doc.documento_id}"
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

        // Renderizar controles de paginación
        this.renderPagination(this.documentos.length);
        this.updateBulkUI();
    }

    updateStats() {
        this.statTotal.textContent = this.documentos.length;
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.documentosController.goToPage'
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

    openModal() {
        this.modalTitle.textContent = 'Nuevo Documento';
        this.form.reset();

        // Set scope based on active filter
        if (this.activeFilters.scope === 'cliente') {
            this.inputScope.value = 'cliente';
        } else if (this.activeFilters.scope === 'poliza') {
            this.inputScope.value = 'poliza';
        } else {
            this.inputScope.value = 'cliente'; // default
        }

        this.toggleFormScope();
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
        this.selectedFile = null;
        if (this.selectedFileName) {
            this.selectedFileName.classList.add('hidden');
            this.selectedFileName.textContent = '';
        }
    }

    openDetailModal(documento) {
        this.documentoSeleccionado = documento;
        const cliente = this.clientes.find(c => c.cliente_id === documento.cliente_id);
        const poliza = this.polizas.find(p => p.poliza_id === documento.poliza_id);

        if (this.detailFields.titulo) {
            this.detailFields.titulo.textContent = documento.nombre_archivo || documento.tipo || `Documento ${documento.documento_id}`;
        }
        if (this.detailFields.id) this.detailFields.id.textContent = documento.documento_id ?? '-';
        if (this.detailFields.tipo) this.detailFields.tipo.textContent = documento.tipo || '-';
        if (this.detailFields.archivo) this.detailFields.archivo.textContent = documento.nombre_archivo || '-';
        if (this.detailFields.ruta) this.detailFields.ruta.textContent = documento.ruta_relativa || '-';
        if (this.detailFields.cliente) this.detailFields.cliente.textContent = cliente?.nombre || 'No asociado';
        if (this.detailFields.poliza) this.detailFields.poliza.textContent = poliza?.numero_poliza || 'No asociada';
        if (this.detailFields.fecha) this.detailFields.fecha.textContent = this.formatDate(documento.fecha_creacion);

        if (this.detailModal) {
            this.detailModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    closeDetailModal() {
        if (this.detailModal) {
            this.detailModal.classList.remove('active');
        }
        document.body.classList.remove('modal-open');
        this.documentoSeleccionado = null;
    }

    async abrirDocumentoSeleccionado() {
        if (!this.documentoSeleccionado) return;
        if (!window.electronAPI?.documentos?.openFile) {
            alert('La apertura de documentos no está disponible.');
            return;
        }

        try {
            const response = await window.electronAPI.documentos.openFile({
                ruta_relativa: this.documentoSeleccionado.ruta_relativa,
                nombre_archivo: this.documentoSeleccionado.nombre_archivo
            });

            if (!response?.success) {
                throw new Error(response?.message || 'No se pudo abrir el archivo.');
            }
        } catch (error) {
            console.error('Error al abrir documento:', error);
            alert(error.message || 'No se pudo abrir el documento.');
        }
    }

    async handleSubmit() {
        const scope = this.inputScope.value;
        const clienteId = this.getClienteIdFromInput();
        const polizaId = this.getPolizaIdFromInput();

        if (scope === 'cliente' && !clienteId) {
            alert('Selecciona un cliente para asociar el documento.');
            return;
        }

        if (scope === 'poliza' && !polizaId) {
            alert('Selecciona una póliza para asociar el documento.');
            return;
        }

        const tipo = this.inputTipo.value.trim();
        const nombre = this.inputNombre.value.trim();
        const ruta = this.inputRuta.value.trim();

        if (!tipo || !nombre) {
            alert('Completa todos los datos del documento.');
            return;
        }

        if (!this.selectedFile || !this.selectedFile.path) {
            alert('Selecciona un archivo para subir (no se pudo leer la ruta).');
            return;
        }

        const rutaRelativa = ruta || this.selectedFile.name;

        const payload = {
            cliente_id: scope === 'cliente' ? clienteId : null,
            poliza_id: scope === 'poliza' ? polizaId : null,
            tipo,
            nombre_archivo: nombre,
            ruta_relativa: rutaRelativa,
            source_path: this.selectedFile.path
        };

        try {
            const response = await window.electronAPI.documentos.create(payload);
            if (response.success) {
                this.closeModal();
                await this.loadDocumentos();
                alert('Documento registrado correctamente.');
            } else {
                throw new Error(response.message || 'No se pudo registrar el documento');
            }
        } catch (error) {
            console.error('Error al crear documento:', error);
            alert(error.message || 'Error al guardar el documento.');
        }
    }

    handleActionClick(event) {
        // Check if click was on an action button
        const button = event.target.closest('button[data-action]');
        if (button) {
            const documentoId = Number(button.dataset.documentoId);
            if (!documentoId) return;

            const action = button.dataset.action;

            if (action === 'delete') {
                this.deleteDocumento(documentoId);
            }
            return;
        }

        // Checkbox selection
        const checkbox = event.target.closest('.row-checkbox');
        if (checkbox) {
            event.stopPropagation();
            const documentoId = Number(checkbox.dataset.documentoId);
            const checked = checkbox.checked;
            this.toggleSelection(documentoId, checked);
            return;
        }

        // If not a button, check if click was on a table row (currently no edit modal for documentos)
        const row = event.target.closest('tr[data-documento-id]');
        if (row) {
            const documentoId = Number(row.dataset.documentoId);
            const documento = this.documentos.find(d => d.documento_id === documentoId);
            if (documento) {
                this.openDetailModal(documento);
            }
        }
    }

    async deleteDocumento(documentoId) {
        const documento = this.documentosOriginal.find(d => d.documento_id === documentoId)
            || this.documentos.find(d => d.documento_id === documentoId);
        const displayName = documento?.nombre_archivo || documento?.tipo || `Documento ${documentoId}`;

        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.confirmDelete(displayName);
        } else {
            confirmed = confirm(`¿Eliminar "${displayName}"? Esta acción no se puede deshacer.`);
        }

        if (!confirmed) {
            return false;
        }

        try {
            const response = await window.electronAPI.documentos.delete(documentoId);
            if (response.success) {
                await this.loadDocumentos();
                alert('Documento eliminado.');
                this.documentosSeleccionados.delete(documentoId);
                this.updateBulkUI();
                return true;
            } else {
                throw new Error(response.message || 'No se pudo eliminar el documento');
            }
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            alert(error.message || 'Error al eliminar el documento.');
            return false;
        }
    }

    toggleFormScope() {
        const scope = this.inputScope.value;
        const clienteField = document.getElementById('formClienteGroup');
        const polizaField = document.getElementById('formPolizaGroup');

        if (scope === 'poliza') {
            clienteField.classList.add('hidden');
            polizaField.classList.remove('hidden');
        } else {
            polizaField.classList.add('hidden');
            clienteField.classList.remove('hidden');
        }
    }

    getClienteIdFromInput() {
        if (!this.inputCliente || !this.inputCliente.value) return null;
        const match = this.inputCliente.value.trim().match(/^(\d+)/);
        return match ? Number(match[1]) : null;
    }

    getPolizaIdFromInput() {
        if (!this.inputPoliza || !this.inputPoliza.value) return null;
        const match = this.inputPoliza.value.trim().match(/^(\d+)/);
        return match ? Number(match[1]) : null;
    }

    handleDragOver(event) {
        event.preventDefault();
        if (this.dropzone) {
            this.dropzone.classList.add('active');
        }
    }

    handleDragLeave(event) {
        event.preventDefault();
        if (this.dropzone) {
            this.dropzone.classList.remove('active');
        }
    }

    handleDrop(event) {
        event.preventDefault();
        this.handleDragLeave(event);
        const files = event.dataTransfer?.files;
        if (files && files.length) {
            this.setSelectedFile(files[0]);
        }
    }

    openFilePicker() {
        if (!this.fileInput) return;
        this.fileInput.click();
    }

    handleFileInputChange(event) {
        const file = event.target.files?.[0];
        if (file) {
            this.setSelectedFile(file);
        }
    }

    setSelectedFile(file) {
        this.selectedFile = file;
        if (this.inputNombre && !this.inputNombre.value) {
            this.inputNombre.value = file.name || '';
        }
        if (this.selectedFileName) {
            this.selectedFileName.textContent = file.name || '';
            this.selectedFileName.classList.remove('hidden');
        }
    }

    toggleSelection(documentoId, checked) {
        if (checked) {
            this.documentosSeleccionados.add(documentoId);
        } else {
            this.documentosSeleccionados.delete(documentoId);
        }
        this.updateBulkUI();
    }

    selectAllVisible() {
        this.documentos.forEach(doc => this.documentosSeleccionados.add(doc.documento_id));
        this.renderTable();
    }

    clearSelection() {
        this.documentosSeleccionados.clear();
        this.renderTable();
    }

    handleHeaderSelectAll(event) {
        if (event.target.checked) {
            this.selectAllVisible();
        } else {
            this.clearSelection();
        }
    }

    updateBulkUI() {
        const count = this.documentosSeleccionados.size;
        if (this.bulkCount) {
            this.bulkCount.textContent = `${count} seleccionados`;
        }
        if (this.bulkActions) {
            this.bulkActions.classList.toggle('hidden', count === 0);
        }
        if (this.selectAllCheckbox) {
            const allVisibleSelected = this.documentos.length > 0 && this.documentos.every(doc => this.documentosSeleccionados.has(doc.documento_id));
            this.selectAllCheckbox.checked = allVisibleSelected;
            this.selectAllCheckbox.indeterminate = !allVisibleSelected && count > 0;
        }
    }

    async exportSelected() {
        if (!this.documentosSeleccionados.size) {
            alert('Selecciona al menos un documento.');
            return;
        }

        const destinoDialog = await window.electronAPI.dialog.selectDirectory({
            title: 'Selecciona carpeta destino',
            properties: ['openDirectory', 'createDirectory']
        });

        if (destinoDialog.canceled || !destinoDialog.filePaths?.[0]) {
            return;
        }

        const destino = destinoDialog.filePaths[0];
        const docs = this.documentosOriginal.filter(d => this.documentosSeleccionados.has(d.documento_id));

        try {
            const response = await window.electronAPI.documentos.exportSelected({
                destino,
                documentos: docs.map(d => ({
                    documento_id: d.documento_id,
                    ruta_relativa: d.ruta_relativa,
                    nombre_archivo: d.nombre_archivo,
                    cliente_id: d.cliente_id
                }))
            });

            if (response.success) {
                const mensaje = response.message || 'Documentos exportados.';
                alert(mensaje);
            } else {
                throw new Error(response.message || 'No se pudieron exportar los documentos.');
            }
        } catch (error) {
            console.error('Error al exportar documentos:', error);
            alert(error.message || 'No se pudieron exportar los documentos.');
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
            this.emptyState.classList.add('hidden');
            this.tableBody.innerHTML = '';
        } else {
            this.loadingState.classList.add('hidden');
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

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

console.log('✅ DocumentosController class loaded successfully');

// Register in global scope
window.DocumentosController = DocumentosController;
