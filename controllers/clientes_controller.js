// controllers/clientes_controller.js
// Controlador para la gestión de clientes

class ClientesController {
    constructor() {
        this.clientes = [];
        this.currentCliente = null;
        this.isEditMode = false;
        this.documentDrafts = [];
        this.documentExisting = [];

        this.initElements();
        this.initEventListeners();
        this.initValidations();
        this.loadClientes();
    }

    initValidations() {
        // Initialize form validation
        if (window.formValidator && this.form) {
            window.formValidator.initForm(this.form, {
                nombre: [
                    { type: 'required', message: 'El nombre es requerido' },
                    { type: 'minLength', length: 3, message: 'Mínimo 3 caracteres' }
                ],
                rfc: [
                    { type: 'required', message: 'El RFC es requerido' },
                    { type: 'rfc', message: 'RFC inválido. Formato: AAAA######XXX' }
                ],
                email: [
                    { type: 'email', message: 'Email inválido' }
                ],
                telefono: [
                    { type: 'phone', message: 'Teléfono inválido (10 dígitos)' }
                ],
                celular: [
                    { type: 'phone', message: 'Celular inválido (10 dígitos)' }
                ]
            });
        }

        // Add character counter for notas
        if (window.tooltipManager && this.inputNotas) {
            window.tooltipManager.addCharCounter(this.inputNotas, 500);
        }

        // Add debounced search
        if (window.tooltipManager && this.searchInput) {
            window.tooltipManager.addDebouncedSearch(this.searchInput, (value) => {
                this.handleSearch(value);
            }, 300);
        }
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

        // Documentos en formulario
        this.dropzone = document.getElementById('documentDropzone');
        this.fileInput = document.getElementById('inputDocumentoFiles');
        this.btnOpenFilePicker = document.getElementById('btnOpenFilePicker');
        this.documentDraftList = document.getElementById('documentDraftList');
        this.documentDraftTemplate = document.getElementById('documentDraftTemplate');
        this.documentEmptyHint = document.getElementById('documentEmptyHint');
        this.documentExistingContainer = document.getElementById('documentExistingContainer');
        this.documentExistingList = document.getElementById('documentExistingList');
        this.documentExistingTemplate = document.getElementById('documentExistingTemplate');
    }

    initEventListeners() {
        // Back button (optional - only in standalone view, not SPA)
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => this.goBack());
        }

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

        if (this.tableBody) {
            this.tableBody.addEventListener('click', (event) => this.handleActionClick(event));
        }

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

        if (this.btnOpenFilePicker) {
            this.btnOpenFilePicker.addEventListener('click', () => this.openFilePicker());
        }

        if (this.fileInput) {
            this.fileInput.addEventListener('change', (event) => this.handleFileInputChange(event));
        }

        if (this.documentDraftList) {
            this.documentDraftList.addEventListener('input', (event) => this.handleDraftInputChange(event));
            this.documentDraftList.addEventListener('click', (event) => this.handleDraftAction(event));
        }

        if (this.documentExistingList) {
            this.documentExistingList.addEventListener('click', (event) => this.handleExistingAction(event));
        }
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
            <tr class="table-row transition-colors" data-cliente-id="${cliente.cliente_id}">
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
                            data-action="edit"
                            data-cliente-id="${cliente.cliente_id}"
                            class="text-gold-600 hover:text-gold-900 transition-colors"
                            title="Editar"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button
                            data-action="delete"
                            data-cliente-id="${cliente.cliente_id}"
                            data-cliente-nombre=${JSON.stringify(cliente.nombre)}
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

    handleActionClick(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) {
            return;
        }

        const clienteId = Number(button.dataset.clienteId);
        if (!clienteId) {
            return;
        }

        const action = button.dataset.action;
        if (action === 'edit') {
            this.openEditModal(clienteId);
        } else if (action === 'delete') {
            const nombre = button.dataset.clienteNombre || null;
            this.deleteCliente(clienteId, nombre);
        }
    }

    async openFilePicker() {
        if (!window.electronAPI.dialog || !window.electronAPI.dialog.openFile) {
            this.showError('La selección de archivos no está disponible en este entorno.');
            return;
        }

        try {
            const result = await window.electronAPI.dialog.openFile({
                title: 'Selecciona documentos del cliente',
                properties: ['openFile', 'multiSelections'],
                filters: [
                    { name: 'Documentos', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'] },
                    { name: 'Todos los archivos', extensions: ['*'] }
                ]
            });

            if (!result || result.canceled || !result.filePaths?.length) {
                return;
            }

            result.filePaths.forEach((filePath) => this.addDraftFromPath(filePath));
        } catch (error) {
            console.error('Error al seleccionar archivos:', error);
            this.showError('No se pudieron seleccionar los archivos.');
        }
    }

    handleFileInputChange(event) {
        const files = Array.from(event.target.files || []);
        files.forEach(file => {
            // En Electron el File incluye la ruta absoluta en la propiedad path
            const filePath = file.path || file.webkitRelativePath || file.name;
            if (!filePath || filePath === file.name) {
                console.warn('El archivo no expone ruta absoluta, usa el botón "Seleccionar archivos".');
                return;
            }
            this.addDraftFromPath(filePath);
        });
        event.target.value = '';
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropzone?.classList.add('dropzone-active');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropzone?.classList.remove('dropzone-active');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropzone?.classList.remove('dropzone-active');

        const files = Array.from(event.dataTransfer?.files || []);
        if (!files.length) {
            return;
        }

        files.forEach(file => {
            if (!file.path) {
                console.warn('Archivo sin ruta absoluta, se omitió.');
                return;
            }
            this.addDraftFromPath(file.path);
        });
    }

    addDraftFromPath(filePath) {
        if (!filePath) {
            return;
        }

        if (this.documentDrafts.some(draft => draft.sourcePath === filePath)) {
            return;
        }

        const fileName = this.extractFilename(filePath);
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const defaultTipo = extension ? extension.toUpperCase() : 'Documento';

        this.documentDrafts.push({
            sourcePath: filePath,
            nombreArchivo: fileName,
            tipo: defaultTipo,
            rutaRelativa: null
        });

        this.renderDrafts();
    }

    renderDrafts() {
        if (!this.documentDraftList || !this.documentDraftTemplate) {
            return;
        }

        this.documentDraftList.innerHTML = '';

        this.documentDrafts.forEach((draft, index) => {
            const clone = document.importNode(this.documentDraftTemplate.content, true);
            const wrapper = clone.firstElementChild;
            wrapper.dataset.index = index;

            const nameEl = wrapper.querySelector('.draft-file-name');
            const pathEl = wrapper.querySelector('.draft-file-path');
            const tipoInput = wrapper.querySelector('.draft-input-tipo');
            const nombreInput = wrapper.querySelector('.draft-input-nombre');

            if (nameEl) nameEl.textContent = draft.nombreArchivo;
            if (pathEl) pathEl.textContent = draft.sourcePath;
            if (tipoInput) tipoInput.value = draft.tipo || '';
            if (nombreInput) nombreInput.value = draft.nombreArchivo;

            this.documentDraftList.appendChild(clone);
        });

        const hasDrafts = this.documentDrafts.length > 0;
        this.documentDraftList.classList.toggle('hidden', !hasDrafts);
        this.documentEmptyHint?.classList.toggle('hidden', hasDrafts);
    }

    handleDraftInputChange(event) {
        const wrapper = event.target.closest('[data-index]');
        if (!wrapper) {
            return;
        }

        const index = Number(wrapper.dataset.index);
        const draft = this.documentDrafts[index];
        if (!draft) return;

        if (event.target.classList.contains('draft-input-tipo')) {
            draft.tipo = event.target.value.trim();
        } else if (event.target.classList.contains('draft-input-nombre')) {
            const value = event.target.value.trim();
            draft.nombreArchivo = value || draft.nombreArchivo;
        }
    }

    handleDraftAction(event) {
        const button = event.target.closest('.draft-remove-btn');
        if (!button) {
            return;
        }

        const wrapper = button.closest('[data-index]');
        if (!wrapper) {
            return;
        }

        const index = Number(wrapper.dataset.index);
        if (Number.isNaN(index)) {
            return;
        }

        this.documentDrafts.splice(index, 1);
        this.renderDrafts();
    }

    renderExistingDocuments() {
        if (!this.documentExistingContainer || !this.documentExistingList || !this.documentExistingTemplate) {
            return;
        }

        this.documentExistingList.innerHTML = '';

        this.documentExisting.forEach((doc) => {
            const clone = document.importNode(this.documentExistingTemplate.content, true);
            const wrapper = clone.firstElementChild;
            wrapper.dataset.documentoId = doc.documento_id;

            const nameEl = wrapper.querySelector('.existing-file-name');
            const metaEl = wrapper.querySelector('.existing-file-meta');
            if (nameEl) {
                nameEl.textContent = `${doc.tipo || 'Documento'} · ${doc.nombre_archivo}`;
            }
            if (metaEl) {
                metaEl.textContent = `${this.escapeHtml(doc.ruta_relativa || '')}`;
            }

            this.documentExistingList.appendChild(clone);
        });

        const hasExisting = this.documentExisting.length > 0;
        this.documentExistingContainer.classList.toggle('hidden', !hasExisting);
    }

    handleExistingAction(event) {
        const downloadBtn = event.target.closest('.existing-download-btn');
        const removeBtn = event.target.closest('.existing-remove-btn');
        const wrapper = event.target.closest('[data-documento-id]');

        if (!wrapper) {
            return;
        }

        const documentoId = Number(wrapper.dataset.documentoId);
        const documento = this.documentExisting.find(doc => doc.documento_id === documentoId);
        if (!documento) {
            return;
        }

        if (downloadBtn) {
            this.openExistingDocumento(documento);
        } else if (removeBtn) {
            this.deleteExistingDocumento(documento);
        }
    }

    async openExistingDocumento(documento) {
        if (!window.electronAPI.documentos.openFile) {
            this.showError('La apertura de documentos no está disponible.');
            return;
        }

        try {
            const response = await window.electronAPI.documentos.openFile({
                ruta_relativa: documento.ruta_relativa,
                nombre_archivo: documento.nombre_archivo
            });
            if (!response?.success) {
                throw new Error(response?.message || 'No se pudo abrir el archivo.');
            }
        } catch (error) {
            console.error('Error al abrir documento existente:', error);
            this.showError(error.message || 'No se pudo abrir el documento.');
        }
    }

    async deleteExistingDocumento(documento) {
        // Use elegant confirm modal if available
        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.show({
                title: 'Eliminar documento',
                message: '¿Estás seguro de eliminar este documento del cliente?',
                type: 'danger',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar'
            });
        } else {
            confirmed = confirm('¿Eliminar este documento del cliente?');
        }

        if (!confirmed) {
            return;
        }

        try {
            const response = await window.electronAPI.documentos.delete(documento.documento_id);
            if (!response?.success) {
                throw new Error(response?.message || 'No se pudo eliminar el documento.');
            }

            this.documentExisting = this.documentExisting.filter(doc => doc.documento_id !== documento.documento_id);
            this.renderExistingDocuments();
            this.showSuccess('Documento eliminado.');
        } catch (error) {
            console.error('Error al eliminar documento existente:', error);
            this.showError(error.message || 'No se pudo eliminar el documento.');
        }
    }

    resetDocumentState() {
        this.documentDrafts = [];
        this.documentExisting = [];
        this.renderDrafts();
        this.renderExistingDocuments();
    }

    extractFilename(pathString) {
        if (!pathString) return '';
        const parts = pathString.split(/[/\\]/);
        return parts[parts.length - 1] || pathString;
    }

    async loadExistingDocumentos(clienteId) {
        if (!clienteId) {
            return;
        }

        try {
            const response = await window.electronAPI.documentos.getByCliente(clienteId);
            if (!response?.success) {
                throw new Error(response?.message || 'No se pudieron cargar los documentos existentes.');
            }

            this.documentExisting = response.data || [];
            this.renderExistingDocuments();
        } catch (error) {
            console.error('Error al cargar documentos existentes:', error);
            this.documentExisting = [];
            this.renderExistingDocuments();
        }
    }

    async persistDocumentDrafts(clienteId) {
        if (!this.documentDrafts.length || !clienteId) {
            return { success: true, addedCount: 0 };
        }

        let added = 0;
        try {
            for (const draft of this.documentDrafts) {
                const nombreArchivo = (draft.nombreArchivo || this.extractFilename(draft.sourcePath)).trim();
                if (!nombreArchivo) {
                    continue;
                }

                const payload = {
                    cliente_id: clienteId,
                    poliza_id: null,
                    tipo: (draft.tipo || 'Documento').trim() || 'Documento',
                    nombre_archivo: nombreArchivo,
                    ruta_relativa: `clientes/${clienteId}/${nombreArchivo}`,
                    source_path: draft.sourcePath
                };

                const response = await window.electronAPI.documentos.create(payload);
                if (!response?.success) {
                    throw new Error(response?.message || 'No se pudo guardar uno de los documentos.');
                }
                added += 1;
            }

            this.documentDrafts = [];
            this.renderDrafts();

            if (this.isEditMode) {
                await this.loadExistingDocumentos(clienteId);
            }

            return { success: true, addedCount: added };
        } catch (error) {
            console.error('Error al guardar documentos adjuntos:', error);
            return { success: false, addedCount: added, message: error.message };
        }
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
        this.resetDocumentState();
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    async openEditModal(clienteId) {
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

        this.resetDocumentState();
        await this.loadExistingDocumentos(cliente.cliente_id);
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
        this.currentCliente = null;
        this.isEditMode = false;
        this.resetDocumentState();
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
            let clienteId = this.currentCliente?.cliente_id || null;

            if (this.isEditMode) {
                result = await window.electronAPI.clientes.update(
                    this.currentCliente.cliente_id,
                    clienteData
                );
                clienteId = this.currentCliente.cliente_id;
            } else {
                result = await window.electronAPI.clientes.create(clienteData);
                if (result.success && result.data?.cliente_id) {
                    clienteId = result.data.cliente_id;
                }
            }

            if (result.success) {
                let docMessage = '';
                if (clienteId) {
                    const persisted = await this.persistDocumentDrafts(clienteId);
                    if (!persisted.success) {
                        this.showError(persisted.message || 'Algunos documentos no se pudieron guardar.');
                    } else if (persisted.addedCount) {
                        docMessage = `Se adjuntaron ${persisted.addedCount} documento(s) al cliente.`;
                    }
                }

                const baseMessage = this.isEditMode
                    ? 'Cliente actualizado correctamente'
                    : 'Cliente creado correctamente';

                this.showSuccess(docMessage ? `${baseMessage}\n${docMessage}` : baseMessage);
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

    async deleteCliente(clienteId, nombre = null) {
        const cliente = this.clientes.find(c => c.cliente_id === clienteId);
        const displayName = nombre || cliente?.nombre || `#${clienteId}`;

        // Use elegant confirm modal if available, fallback to native confirm
        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.confirmDelete(displayName);
        } else {
            confirmed = confirm(`¿Estás seguro de eliminar al cliente "${displayName}"?\n\nEsta acción no se puede deshacer.`);
        }

        if (!confirmed) {
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

}
console.log('✅ ClientesController class loaded successfully');

// Register in global scope
window.ClientesController = ClientesController;
