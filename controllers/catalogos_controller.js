// controllers/catalogos_controller.js
// Controlador para gestión de catálogos (Aseguradoras y Ramos)

class CatalogosController {
    constructor() {
        this.aseguradoras = [];
        this.ramos = [];
        this.currentType = 'aseguradora';
        this.currentId = null;

        this.initElements();
        this.initEventListeners();
        this.loadData();
    }

    initElements() {
        // Botones
        this.btnBack = document.getElementById('btnBack');
        this.btnAddAseguradora = document.getElementById('btnAddAseguradora');
        this.btnAddRamo = document.getElementById('btnAddRamo');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Indicadores
        this.statAseguradoras = document.getElementById('statAseguradoras');
        this.statRamos = document.getElementById('statRamos');

        // Búsqueda
        this.searchAseguradoras = document.getElementById('searchAseguradoras');
        this.searchRamos = document.getElementById('searchRamos');

        // Tablas
        this.tableAseguradoras = document.getElementById('aseguradorasTableBody');
        this.tableRamos = document.getElementById('ramosTableBody');

        // Estados vacíos/carga
        this.emptyAseguradoras = document.getElementById('emptyAseguradoras');
        this.emptyRamos = document.getElementById('emptyRamos');
        this.loadingAseguradoras = document.getElementById('loadingAseguradoras');
        this.loadingRamos = document.getElementById('loadingRamos');

        // Modal
        this.modal = document.getElementById('modalCatalogo');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formCatalogo');
        this.inputNombre = document.getElementById('inputNombre');
        this.inputDescripcion = document.getElementById('inputDescripcion');
        this.descripcionGroup = document.getElementById('descripcionGroup');
    }

    initEventListeners() {
        // Back button (optional - only in standalone view, not SPA)
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => {
                // Navegar al dashboard usando SPA navigation
                if (window.appNavigation) {
                    window.appNavigation.navigateTo('dashboard');
                } else {
                    console.error('appNavigation no disponible');
                }
            });
        }
        this.btnAddAseguradora.addEventListener('click', () => this.openModal('aseguradora'));
        this.btnAddRamo.addEventListener('click', () => this.openModal('ramo'));
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

        // Búsqueda en tiempo real
        this.searchAseguradoras.addEventListener('input', () => this.filterAseguradoras());
        this.searchRamos.addEventListener('input', () => this.filterRamos());
    }

    async loadData() {
        this.showLoading(true);
        try {
            const [asegRes, ramosRes] = await Promise.all([
                window.electronAPI.catalogos.getAseguradoras(),
                window.electronAPI.catalogos.getRamos()
            ]);

            if (asegRes.success) {
                this.aseguradoras = asegRes.data || [];
                this.renderAseguradoras();
            } else {
                throw new Error(asegRes.message || 'Error al obtener aseguradoras');
            }

            if (ramosRes.success) {
                this.ramos = ramosRes.data || [];
                this.renderRamos();
            } else {
                throw new Error(ramosRes.message || 'Error al obtener ramos');
            }

            this.updateStats();
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            alert(error.message || 'No se pudieron cargar los catálogos');
        } finally {
            this.showLoading(false);
        }
    }

    renderAseguradoras() {
        if (!this.aseguradoras.length) {
            this.tableAseguradoras.innerHTML = '';
            this.emptyAseguradoras.classList.remove('hidden');
            return;
        }
        this.emptyAseguradoras.classList.add('hidden');

        this.tableAseguradoras.innerHTML = this.aseguradoras
            .map((item) => `
                <tr class="table-row transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.aseguradora_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium">
                        <div class="flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar"
                                onclick="window.catalogosController.openModal('aseguradora', ${item.aseguradora_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} transition-colors"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="window.catalogosController.toggleActivo('aseguradora', ${item.aseguradora_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');
    }

    renderRamos() {
        if (!this.ramos.length) {
            this.tableRamos.innerHTML = '';
            this.emptyRamos.classList.remove('hidden');
            return;
        }
        this.emptyRamos.classList.add('hidden');

        this.tableRamos.innerHTML = this.ramos
            .map((item) => `
                <tr class="table-row transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.ramo_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${this.escapeHtml(item.descripcion || '-')}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium">
                        <div class="flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar"
                                onclick="window.catalogosController.openModal('ramo', ${item.ramo_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} transition-colors"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="window.catalogosController.toggleActivo('ramo', ${item.ramo_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');
    }

    updateStats() {
        const totalAseg = this.aseguradoras.length;
        const activasAseg = this.aseguradoras.filter((a) => a.activo).length;
        this.statAseguradoras.textContent = `${totalAseg} (${activasAseg} activas)`;

        const totalRamos = this.ramos.length;
        const activosRamos = this.ramos.filter((r) => r.activo).length;
        this.statRamos.textContent = `${totalRamos} (${activosRamos} activos)`;
    }

    openModal(type, id = null) {
        this.currentType = type;
        this.currentId = id;
        this.form.reset();

        const isRamo = type === 'ramo';
        this.descripcionGroup.classList.toggle('hidden', !isRamo);

        if (id) {
            const collection = isRamo ? this.ramos : this.aseguradoras;
            const item = collection.find((entry) =>
                isRamo ? entry.ramo_id === id : entry.aseguradora_id === id
            );
            if (!item) {
                alert('Elemento no encontrado');
                return;
            }
            this.inputNombre.value = item.nombre;
            if (isRamo) {
                this.inputDescripcion.value = item.descripcion || '';
            }
            this.modalTitle.textContent = `Editar ${isRamo ? 'ramo' : 'aseguradora'}`;
        } else {
            this.modalTitle.textContent = `Nueva ${isRamo ? 'ramo' : 'aseguradora'}`;
        }

        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
        this.currentId = null;
    }

    async handleSubmit() {
        const nombre = this.inputNombre.value.trim();
        if (!nombre) {
            alert('El nombre es obligatorio.');
            return;
        }

        const isRamo = this.currentType === 'ramo';
        const descripcion = this.inputDescripcion.value.trim();

        try {
            if (this.currentId) {
                if (isRamo) {
                    const item = this.ramos.find((r) => r.ramo_id === this.currentId);
                    const response = await window.electronAPI.catalogos.updateRamo({
                        ramo_id: this.currentId,
                        nombre,
                        descripcion,
                        activo: item ? item.activo : true
                    });
                    if (!response.success) throw new Error(response.message);
                } else {
                    const item = this.aseguradoras.find((a) => a.aseguradora_id === this.currentId);
                    const response = await window.electronAPI.catalogos.updateAseguradora({
                        aseguradora_id: this.currentId,
                        nombre,
                        activo: item ? item.activo : true
                    });
                    if (!response.success) throw new Error(response.message);
                }
            } else {
                if (isRamo) {
                    const response = await window.electronAPI.catalogos.createRamo(nombre, descripcion || null);
                    if (!response.success) throw new Error(response.message);
                } else {
                    const response = await window.electronAPI.catalogos.createAseguradora(nombre);
                    if (!response.success) throw new Error(response.message);
                }
            }

            await this.loadData();
            this.closeModal();
            alert('Cambios guardados correctamente.');
        } catch (error) {
            console.error('Error al guardar catálogo:', error);
            alert(error.message || 'No se pudo guardar la información.');
        }
    }

    async toggleActivo(type, id) {
        const isRamo = type === 'ramo';
        const collection = isRamo ? this.ramos : this.aseguradoras;
        const item = collection.find((entry) => (isRamo ? entry.ramo_id === id : entry.aseguradora_id === id));

        if (!item) {
            alert('Elemento no encontrado.');
            return;
        }

        const nuevoEstado = !item.activo;

        try {
            let response;
            if (isRamo) {
                response = await window.electronAPI.catalogos.updateRamo({
                    ramo_id: id,
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    activo: nuevoEstado
                });
            } else {
                response = await window.electronAPI.catalogos.updateAseguradora({
                    aseguradora_id: id,
                    nombre: item.nombre,
                    activo: nuevoEstado
                });
            }

            if (!response.success) {
                throw new Error(response.message || 'No se pudo actualizar el estado');
            }

            await this.loadData();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            alert(error.message || 'No se pudo actualizar el estado.');
        }
    }

    showLoading(show) {
        this.loadingAseguradoras.classList.toggle('hidden', !show);
        this.loadingRamos.classList.toggle('hidden', !show);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    filterAseguradoras() {
        const searchTerm = this.searchAseguradoras.value.toLowerCase().trim();

        const filtered = this.aseguradoras.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm)
        );

        this.renderAseguradorasFiltered(filtered);
        this.updateStatsFiltered(filtered, this.statAseguradoras, this.aseguradoras.length);
    }

    filterRamos() {
        const searchTerm = this.searchRamos.value.toLowerCase().trim();

        const filtered = this.ramos.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm) ||
            (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm))
        );

        this.renderRamosFiltered(filtered);
        this.updateStatsFiltered(filtered, this.statRamos, this.ramos.length);
    }

    renderAseguradorasFiltered(data) {
        if (!data.length) {
            this.tableAseguradoras.innerHTML = '';
            this.emptyAseguradoras.classList.remove('hidden');
            return;
        }
        this.emptyAseguradoras.classList.add('hidden');

        this.tableAseguradoras.innerHTML = data
            .map((item) => `
                <tr class="table-row transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.aseguradora_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium">
                        <div class="flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar"
                                onclick="window.catalogosController.openModal('aseguradora', ${item.aseguradora_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} transition-colors"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="window.catalogosController.toggleActivo('aseguradora', ${item.aseguradora_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');
    }

    renderRamosFiltered(data) {
        if (!data.length) {
            this.tableRamos.innerHTML = '';
            this.emptyRamos.classList.remove('hidden');
            return;
        }
        this.emptyRamos.classList.add('hidden');

        this.tableRamos.innerHTML = data
            .map((item) => `
                <tr class="table-row transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.ramo_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${this.escapeHtml(item.descripcion || '-')}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium">
                        <div class="flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar"
                                onclick="window.catalogosController.openModal('ramo', ${item.ramo_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} transition-colors"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="window.catalogosController.toggleActivo('ramo', ${item.ramo_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');
    }

    updateStatsFiltered(filtered, statElement, total) {
        const activeCount = filtered.filter(item => item.activo).length;
        if (filtered.length === total) {
            statElement.textContent = `${total} (${activeCount} activos)`;
        } else {
            statElement.textContent = `${filtered.length} de ${total} (${activeCount} activos)`;
        }
    }
}

console.log('✅ CatalogosController class loaded successfully');

// Register in global scope
window.CatalogosController = CatalogosController;
