// controllers/documentos_controller.js
// Controlador para la gestión de documentos asociados a clientes y pólizas

class DocumentosController {
    constructor() {
        this.documentos = [];
        this.clientes = [];
        this.polizas = [];
        this.contextScope = 'cliente';

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

        // Filtros
        this.filterScope = document.getElementById('filterScope');
        this.filterCliente = document.getElementById('filterCliente');
        this.filterPoliza = document.getElementById('filterPoliza');

        // Tabla
        this.tableBody = document.getElementById('documentosTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

        // Estadística
        this.statTotal = document.getElementById('statTotal');

        // Modal
        this.modal = document.getElementById('modalDocumento');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formDocumento');

        // Inputs del formulario
        this.inputScope = document.getElementById('inputScope');
        this.inputCliente = document.getElementById('inputCliente');
        this.inputPoliza = document.getElementById('inputPoliza');
        this.inputTipo = document.getElementById('inputTipo');
        this.inputNombre = document.getElementById('inputNombre');
        this.inputRuta = document.getElementById('inputRuta');
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

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        this.filterScope.addEventListener('change', () => {
            this.toggleFilterVisibility();
            this.loadDocumentos();
        });

        this.filterCliente.addEventListener('change', () => this.loadDocumentos());
        this.filterPoliza.addEventListener('change', () => this.loadDocumentos());

        this.inputScope.addEventListener('change', () => this.toggleFormScope());
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
                this.filterScope.value = 'cliente';
                this.filterCliente.dataset.prefill = clienteId;
                this.inputScope.value = 'cliente';
                this.toggleFormScope();
            } else if (polizaId) {
                document.getElementById('contextInfo').textContent =
                    `Contexto: Documentos de póliza ${polizaNumero || polizaId}`;
                this.filterScope.value = 'poliza';
                this.filterPoliza.dataset.prefill = polizaId;
                this.inputScope.value = 'poliza';
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
                this.populateClientesSelect(this.filterCliente);
                this.populateClientesSelect(this.inputCliente, true);
            }

            if (polizasRes.success) {
                this.polizas = polizasRes.data;
                this.populatePolizasSelect(this.filterPoliza);
                this.populatePolizasSelect(this.inputPoliza, true);
            }

            this.toggleFilterVisibility();
            await this.loadDocumentos();
        } catch (error) {
            console.error('Error al cargar catálogos de documentos:', error);
            alert('Error al cargar catálogos. Revisa la consola para más detalles.');
            this.showLoading(false);
        }
    }

    populateClientesSelect(select, isForm = false) {
        if (!select) return;
        select.innerHTML = '';
        if (!isForm) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Todos';
            select.appendChild(option);
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Seleccionar cliente...';
            select.appendChild(option);
        }

        this.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.cliente_id;
            option.textContent = cliente.nombre;
            select.appendChild(option);
        });

        if (select.dataset.prefill) {
            select.value = select.dataset.prefill;
        }
    }

    populatePolizasSelect(select, isForm = false) {
        if (!select) return;
        select.innerHTML = '';
        if (!isForm) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Todas';
            select.appendChild(option);
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Seleccionar póliza...';
            select.appendChild(option);
        }

        this.polizas.forEach(poliza => {
            const option = document.createElement('option');
            option.value = poliza.poliza_id;
            const label = `${poliza.numero_poliza} — ${poliza.cliente_nombre || ''}`.trim();
            option.textContent = label;
            select.appendChild(option);
        });

        if (select.dataset.prefill) {
            select.value = select.dataset.prefill;
        }
    }

    async loadDocumentos() {
        try {
            this.showLoading(true);
            const scope = this.filterScope.value;
            let response;

            if (scope === 'poliza') {
                const polizaId = this.filterPoliza.value;
                if (!polizaId) {
                    this.documentos = [];
                    this.renderTable();
                    this.showLoading(false);
                    return;
                }
                response = await window.electronAPI.documentos.getByPoliza(Number(polizaId));
            } else {
                const clienteId = this.filterCliente.value;
                if (!clienteId) {
                    this.documentos = [];
                    this.renderTable();
                    this.showLoading(false);
                    return;
                }
                response = await window.electronAPI.documentos.getByCliente(Number(clienteId));
            }

            if (response.success) {
                this.documentos = response.data || [];
                this.renderTable();
                this.updateStats();
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

    renderTable() {
        if (!this.documentos.length) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }
        this.emptyState.classList.add('hidden');

        this.tableBody.innerHTML = this.documentos.map(doc => {
            const cliente = this.clientes.find(c => c.cliente_id === doc.cliente_id);
            const poliza = this.polizas.find(p => p.poliza_id === doc.poliza_id);
            return `
                <tr class="transition-colors hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-500">#${doc.documento_id}</td>
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                            class="text-red-600 hover:text-red-900 transition-colors"
                            onclick="window.documentosController.deleteDocumento(${doc.documento_id})"
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateStats() {
        this.statTotal.textContent = this.documentos.length;
    }

    openModal() {
        this.modalTitle.textContent = 'Nuevo Documento';
        this.form.reset();
        this.inputScope.value = this.filterScope.value || 'cliente';
        this.toggleFormScope();

        if (this.inputScope.value === 'cliente' && this.filterCliente.value) {
            this.inputCliente.value = this.filterCliente.value;
        }

        if (this.inputScope.value === 'poliza' && this.filterPoliza.value) {
            this.inputPoliza.value = this.filterPoliza.value;
        }

        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
    }

    async handleSubmit() {
        const scope = this.inputScope.value;
        const clienteId = this.inputCliente.value ? Number(this.inputCliente.value) : null;
        const polizaId = this.inputPoliza.value ? Number(this.inputPoliza.value) : null;

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

        if (!tipo || !nombre || !ruta) {
            alert('Completa todos los datos del documento.');
            return;
        }

        const payload = {
            cliente_id: scope === 'cliente' ? clienteId : null,
            poliza_id: scope === 'poliza' ? polizaId : null,
            tipo,
            nombre_archivo: nombre,
            ruta_relativa: ruta
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

    async deleteDocumento(documentoId) {
        if (!confirm('¿Eliminar este documento? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await window.electronAPI.documentos.delete(documentoId);
            if (response.success) {
                await this.loadDocumentos();
                alert('Documento eliminado.');
            } else {
                throw new Error(response.message || 'No se pudo eliminar el documento');
            }
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            alert(error.message || 'Error al eliminar el documento.');
        }
    }

    toggleFilterVisibility() {
        const scope = this.filterScope.value;
        const clienteGroup = document.getElementById('filterClienteGroup');
        const polizaGroup = document.getElementById('filterPolizaGroup');

        if (scope === 'poliza') {
            clienteGroup.classList.add('hidden');
            polizaGroup.classList.remove('hidden');
            this.filterCliente.value = '';
        } else {
            polizaGroup.classList.add('hidden');
            clienteGroup.classList.remove('hidden');
            this.filterPoliza.value = '';
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
