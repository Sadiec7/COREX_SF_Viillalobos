// controllers/ramos_controller.js
// Controlador para gestión de Ramos

class RamosController {
    constructor() {
        this.ramos = [];
        this.currentId = null;

        // Paginación
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalPages = 1;

        this.initElements();
        this.initEventListeners();
        this.loadData();
    }

    initElements() {
        // Botones
        this.btnAddRamo = document.getElementById('btnAddRamo');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Indicadores
        this.statTotal = document.getElementById('statTotal');
        this.statActivos = document.getElementById('statActivos');

        // Búsqueda
        this.searchRamos = document.getElementById('searchRamos');

        // Tabla
        this.tableRamos = document.getElementById('ramosTableBody');

        // Estados vacíos/carga
        this.emptyRamos = document.getElementById('emptyRamos');
        this.loadingRamos = document.getElementById('loadingRamos');

        // Paginación
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

        // Modal
        this.modal = document.getElementById('modalRamo');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formRamo');
        this.inputNombre = document.getElementById('inputNombre');
        this.inputDescripcion = document.getElementById('inputDescripcion');
    }

    initEventListeners() {
        this.btnAddRamo.addEventListener('click', () => this.openModal());
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
        this.searchRamos.addEventListener('input', () => this.filterRamos());

        // Items per page selector
        if (this.itemsPerPageSelect) {
            this.itemsPerPageSelect.addEventListener('change', (e) => {
                this.changeItemsPerPage(e.target.value);
            });
        }
    }

    async loadData() {
        this.showLoading(true);
        try {
            const response = await window.electronAPI.catalogos.getRamos();

            if (response.success) {
                this.ramos = response.data || [];
                this.renderRamos();
                this.updateStats();
            } else {
                throw new Error(response.message || 'Error al obtener ramos');
            }
        } catch (error) {
            console.error('Error al cargar ramos:', error);
            if (window.toastManager) {
                window.toastManager.show('Error al cargar ramos', 'error');
            } else {
                alert(error.message || 'No se pudieron cargar los ramos');
            }
        } finally {
            this.showLoading(false);
        }
    }

    renderRamos() {
        if (!this.ramos.length) {
            this.tableRamos.innerHTML = '';
            this.emptyRamos.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            return;
        }
        this.emptyRamos.classList.add('hidden');

        // Calcular paginación
        this.totalPages = PaginationHelper.getTotalPages(this.ramos.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Obtener elementos de la página actual
        const paginatedRamos = PaginationHelper.getPaginatedItems(this.ramos, this.currentPage, this.itemsPerPage);

        this.tableRamos.innerHTML = paginatedRamos
            .map((item) => `
                <tr class="group table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.ramosController.handleRowClick(event, ${item.ramo_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.ramo_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${this.escapeHtml(item.descripcion) || '-'}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2 whitespace-nowrap">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.ramosController.openModal(${item.ramo_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'} transition-colors p-1 rounded"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="event.stopPropagation(); window.ramosController.toggleActivo(${item.ramo_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.ramosController.deleteRamo(${item.ramo_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');

        // Renderizar controles de paginación
        this.renderPagination(this.ramos.length);
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.ramosController.goToPage'
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderRamos();
    }

    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1;
        this.renderRamos();
    }

    updateStats() {
        const total = this.ramos.length;
        const activos = this.ramos.filter((r) => r.activo).length;
        this.statTotal.textContent = total;
        this.statActivos.textContent = activos;
    }

    handleRowClick(event, id) {
        // Abrir modal de edición al hacer clic en la fila
        this.openModal(id);
    }

    openModal(id = null) {
        this.currentId = id;
        this.form.reset();

        if (id) {
            const item = this.ramos.find((r) => r.ramo_id === id);
            if (!item) {
                if (window.toastManager) {
                    window.toastManager.show('Ramo no encontrado', 'error');
                } else {
                    alert('Ramo no encontrado');
                }
                return;
            }
            this.inputNombre.value = item.nombre;
            this.inputDescripcion.value = item.descripcion || '';
            this.modalTitle.textContent = 'Editar Ramo';
        } else {
            this.modalTitle.textContent = 'Nuevo Ramo';
        }

        this.modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Focus on input
        setTimeout(() => this.inputNombre.focus(), 100);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.form.reset();
        this.currentId = null;
    }

    async handleSubmit() {
        const nombre = this.inputNombre.value.trim();
        const descripcion = this.inputDescripcion.value.trim() || null;

        if (!nombre) {
            if (window.toastManager) {
                window.toastManager.show('El nombre es obligatorio', 'warning');
            } else {
                alert('El nombre es obligatorio.');
            }
            return;
        }

        // Show loading spinner
        if (window.loadingSpinner) {
            window.loadingSpinner.show();
        }

        try {
            let response;
            if (this.currentId) {
                // Update existing
                const item = this.ramos.find((r) => r.ramo_id === this.currentId);
                response = await window.electronAPI.catalogos.updateRamo({
                    ramo_id: this.currentId,
                    nombre,
                    descripcion,
                    activo: item ? item.activo : true
                });
            } else {
                // Create new
                response = await window.electronAPI.catalogos.createRamo(nombre, descripcion);
            }

            if (!response.success) {
                throw new Error(response.message || 'Error al guardar');
            }

            // Reload data
            await this.loadData();
            this.closeModal();

            // Show success message
            if (window.toastManager) {
                window.toastManager.show(
                    this.currentId ? 'Ramo actualizado correctamente' : 'Ramo creado correctamente',
                    'success'
                );
            } else {
                alert('Cambios guardados correctamente.');
            }
        } catch (error) {
            console.error('Error al guardar ramo:', error);
            if (window.toastManager) {
                window.toastManager.show(error.message || 'Error al guardar', 'error');
            } else {
                alert(error.message || 'No se pudo guardar la información.');
            }
        } finally {
            if (window.loadingSpinner) {
                window.loadingSpinner.hide();
            }
        }
    }

    async toggleActivo(id) {
        const item = this.ramos.find((r) => r.ramo_id === id);

        if (!item) {
            if (window.toastManager) {
                window.toastManager.show('Ramo no encontrado', 'error');
            } else {
                alert('Ramo no encontrado.');
            }
            return;
        }

        const nuevoEstado = !item.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';

        // Confirm action with custom modal when available
        const confirmMessage = `¿Está seguro de que desea ${accion} este ramo?\nSe ${accion}á "${item.nombre}".`;
        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.show({
                title: 'Confirmar acción',
                message: confirmMessage,
                type: 'warning',
                confirmText: accion.charAt(0).toUpperCase() + accion.slice(1),
                cancelText: 'Cancelar'
            });
        } else {
            confirmed = confirm(confirmMessage);
        }

        if (!confirmed) {
            return;
        }

        // Show loading
        if (window.loadingSpinner) {
            window.loadingSpinner.show();
        }

        try {
            const response = await window.electronAPI.catalogos.updateRamo({
                ramo_id: id,
                nombre: item.nombre,
                descripcion: item.descripcion,
                activo: nuevoEstado
            });

            if (!response.success) {
                throw new Error(response.message || 'No se pudo actualizar el estado');
            }

            // Reload data
            await this.loadData();

            // Show success message
            if (window.toastManager) {
                window.toastManager.show(
                    `Ramo ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
                    'success'
                );
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            if (window.toastManager) {
                window.toastManager.show(error.message || 'Error al actualizar el estado', 'error');
            } else {
                alert(error.message || 'No se pudo actualizar el estado.');
            }
        } finally {
            if (window.loadingSpinner) {
                window.loadingSpinner.hide();
            }
        }
    }

    async deleteRamo(id) {
        const item = this.ramos.find((r) => r.ramo_id === id);

        if (!item) {
            if (window.toastManager) {
                window.toastManager.show('Ramo no encontrado', 'error');
            } else {
                alert('Ramo no encontrado.');
            }
            return;
        }

        // Confirm deletion
        const confirmMessage = `¿Está seguro de que desea eliminar el ramo "${item.nombre}"?\n\nEsta acción no se puede deshacer.`;
        let confirmed = false;
        if (window.confirmModal) {
            confirmed = await window.confirmModal.show({
                title: 'Confirmar eliminación',
                message: confirmMessage,
                type: 'danger',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar'
            });
        } else {
            confirmed = confirm(confirmMessage);
        }

        if (!confirmed) {
            return;
        }

        // Show loading
        if (window.loadingSpinner) {
            window.loadingSpinner.show();
        }

        try {
            const response = await window.electronAPI.catalogos.deleteRamo(id);

            if (!response.success) {
                throw new Error(response.message || 'No se pudo eliminar el ramo');
            }

            // Reload data
            await this.loadData();

            // Show success message
            if (window.toastManager) {
                window.toastManager.show('Ramo eliminado correctamente', 'success');
            } else {
                alert('Ramo eliminado correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar ramo:', error);
            if (window.toastManager) {
                window.toastManager.show(error.message || 'Error al eliminar', 'error');
            } else {
                alert(error.message || 'No se pudo eliminar el ramo.');
            }
        } finally {
            if (window.loadingSpinner) {
                window.loadingSpinner.hide();
            }
        }
    }

    showLoading(show) {
        this.loadingRamos.classList.toggle('hidden', !show);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    filterRamos() {
        const searchTerm = this.searchRamos.value.toLowerCase().trim();

        const filtered = this.ramos.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm) ||
            (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm))
        );

        this.renderRamosFiltered(filtered);
        this.updateStatsFiltered(filtered);
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
                <tr class="group table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.ramosController.handleRowClick(event, ${item.ramo_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.ramo_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${this.escapeHtml(item.descripcion) || '-'}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2 whitespace-nowrap">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.ramosController.openModal(${item.ramo_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'} transition-colors p-1 rounded"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="event.stopPropagation(); window.ramosController.toggleActivo(${item.ramo_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.ramosController.deleteRamo(${item.ramo_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');
    }

    updateStatsFiltered(filtered) {
        const activeCount = filtered.filter(item => item.activo).length;
        this.statTotal.textContent = filtered.length;
        this.statActivos.textContent = activeCount;
    }
}

console.log('✅ RamosController class loaded successfully');

// Register in global scope
window.RamosController = RamosController;
