// controllers/clientes_controller.js
// Controlador para la gestión de clientes

class ClientesController {
    constructor() {
        this.clientes = [];
        this.currentCliente = null;
        this.isEditMode = false;

        this.initElements();
        this.initEventListeners();
        this.loadClientes();
    }

    initElements() {
        // Buttons
        this.btnBack = document.getElementById('btnBack');
        this.btnAddCliente = document.getElementById('btnAddCliente');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Search
        this.searchInput = document.getElementById('searchInput');

        // Stats
        this.statTotal = document.getElementById('statTotal');
        this.statFisicas = document.getElementById('statFisicas');
        this.statMorales = document.getElementById('statMorales');

        // Table
        this.tableBody = document.getElementById('clientesTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

        // Modal
        this.modal = document.getElementById('modalCliente');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formCliente');

        // Form inputs
        this.inputNombre = document.getElementById('inputNombre');
        this.inputRFC = document.getElementById('inputRFC');
        this.inputEmail = document.getElementById('inputEmail');
        this.inputTelefono = document.getElementById('inputTelefono');
        this.inputCelular = document.getElementById('inputCelular');
        this.inputDireccion = document.getElementById('inputDireccion');
        this.inputNotas = document.getElementById('inputNotas');
    }

    initEventListeners() {
        // Back button
        this.btnBack.addEventListener('click', () => this.goBack());

        // Add button
        this.btnAddCliente.addEventListener('click', () => this.openAddModal());

        // Close modal
        this.btnCloseModal.addEventListener('click', () => this.closeModal());
        this.btnCancelForm.addEventListener('click', () => this.closeModal());

        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Form submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // RFC uppercase
        this.inputRFC.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }

    async loadClientes() {
        try {
            this.showLoading(true);

            const result = await window.electronAPI.clientes.getAll();

            if (result.success) {
                this.clientes = result.data;
                this.renderTable();
                this.updateStats();
            } else {
                console.error('Error al cargar clientes:', result.message);
                this.showError('Error al cargar clientes');
            }

            this.showLoading(false);

        } catch (error) {
            console.error('Error al cargar clientes:', error);
            this.showError('Error al cargar clientes');
            this.showLoading(false);
        }
    }

    renderTable(clientesToRender = null) {
        const clientes = clientesToRender || this.clientes;

        if (clientes.length === 0) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        this.tableBody.innerHTML = clientes.map(cliente => `
            <tr class="table-row transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${cliente.cliente_id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${this.escapeHtml(cliente.nombre)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(cliente.rfc)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.tipo_persona === 'Física'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }">
                        ${cliente.tipo_persona}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${cliente.email || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${cliente.telefono || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex gap-2">
                        <button
                            onclick="window.clientesController.viewPolizas(${cliente.cliente_id})"
                            class="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver pólizas"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </button>
                        <button
                            onclick="window.clientesController.openEditModal(${cliente.cliente_id})"
                            class="text-gold-600 hover:text-gold-900 transition-colors"
                            title="Editar"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button
                            onclick="window.clientesController.deleteCliente(${cliente.cliente_id}, '${this.escapeHtml(cliente.nombre)}')"
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
        `).join('');
    }

    updateStats() {
        const total = this.clientes.length;
        const fisicas = this.clientes.filter(c => c.tipo_persona === 'Física').length;
        const morales = this.clientes.filter(c => c.tipo_persona === 'Moral').length;

        this.statTotal.textContent = total;
        this.statFisicas.textContent = fisicas;
        this.statMorales.textContent = morales;
    }

    async handleSearch(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            this.renderTable();
            return;
        }

        try {
            const result = await window.electronAPI.clientes.search(searchTerm);

            if (result.success) {
                this.renderTable(result.data);
            } else {
                console.error('Error en búsqueda:', result.message);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    }

    openAddModal() {
        this.isEditMode = false;
        this.currentCliente = null;
        this.modalTitle.textContent = 'Nuevo Cliente';
        this.form.reset();
        this.modal.classList.add('active');
    }

    openEditModal(clienteId) {
        const cliente = this.clientes.find(c => c.cliente_id === clienteId);

        if (!cliente) {
            this.showError('Cliente no encontrado');
            return;
        }

        this.isEditMode = true;
        this.currentCliente = cliente;
        this.modalTitle.textContent = 'Editar Cliente';

        // Populate form
        this.inputNombre.value = cliente.nombre;
        this.inputRFC.value = cliente.rfc;
        this.inputEmail.value = cliente.email || '';
        this.inputTelefono.value = cliente.telefono || '';
        this.inputCelular.value = cliente.celular || '';
        this.inputDireccion.value = cliente.direccion || '';
        this.inputNotas.value = cliente.notas || '';

        // Set tipo_persona radio
        const radioTipo = document.querySelector(`input[name="tipo_persona"][value="${cliente.tipo_persona}"]`);
        if (radioTipo) {
            radioTipo.checked = true;
        }

        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.form.reset();
        this.currentCliente = null;
        this.isEditMode = false;
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const clienteData = {
            nombre: formData.get('nombre').trim(),
            rfc: formData.get('rfc').trim().toUpperCase(),
            tipo_persona: formData.get('tipo_persona'),
            email: formData.get('email')?.trim() || null,
            telefono: formData.get('telefono')?.trim() || null,
            celular: formData.get('celular')?.trim() || null,
            direccion: formData.get('direccion')?.trim() || null,
            notas: formData.get('notas')?.trim() || null
        };

        try {
            let result;

            if (this.isEditMode) {
                result = await window.electronAPI.clientes.update(
                    this.currentCliente.cliente_id,
                    clienteData
                );
            } else {
                result = await window.electronAPI.clientes.create(clienteData);
            }

            if (result.success) {
                this.showSuccess(
                    this.isEditMode
                        ? 'Cliente actualizado correctamente'
                        : 'Cliente creado correctamente'
                );
                this.closeModal();
                await this.loadClientes();
            } else {
                this.showError(result.message || 'Error al guardar cliente');
            }

        } catch (error) {
            console.error('Error al guardar cliente:', error);
            this.showError('Error al guardar cliente');
        }
    }

    async deleteCliente(clienteId, nombre) {
        if (!confirm(`¿Estás seguro de eliminar al cliente "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const result = await window.electronAPI.clientes.delete(clienteId);

            if (result.success) {
                this.showSuccess('Cliente eliminado correctamente');
                await this.loadClientes();
            } else {
                this.showError(result.message || 'Error al eliminar cliente');
            }

        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            this.showError('Error al eliminar cliente');
        }
    }

    async viewPolizas(clienteId) {
        // TODO: Navigate to polizas view filtered by cliente
        console.log('Ver pólizas del cliente:', clienteId);
        alert('Funcionalidad de pólizas en desarrollo');
    }

    goBack() {
        // Navigate back to dashboard
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
        alert(message); // TODO: Replace with better notification system
    }

    showError(message) {
        alert('Error: ' + message); // TODO: Replace with better notification system
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
