// controllers/periodicidades_controller.js
// Controlador para gestión de Periodicidades

class PeriodicidadesController {
    constructor() {
        this.periodicidades = [];
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
        this.btnAddPeriodicidad = document.getElementById('btnAddPeriodicidad');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Indicadores
        this.statTotal = document.getElementById('statTotal');

        // Búsqueda
        this.searchPeriodicidades = document.getElementById('searchPeriodicidades');

        // Tabla
        this.tablePeriodicidades = document.getElementById('periodicidadesTableBody');

        // Estados vacíos/carga
        this.emptyPeriodicidades = document.getElementById('emptyPeriodicidades');
        this.loadingPeriodicidades = document.getElementById('loadingPeriodicidades');

        // Paginación
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

        // Modal
        this.modal = document.getElementById('modalPeriodicidad');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formPeriodicidad');
        this.inputNombre = document.getElementById('inputNombre');
        this.inputMeses = document.getElementById('inputMeses');
    }

    initEventListeners() {
        this.btnAddPeriodicidad.addEventListener('click', () => this.openModal());
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
        this.searchPeriodicidades.addEventListener('input', () => this.filterPeriodicidades());

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
            const response = await window.electronAPI.catalogos.getPeriodicidades();

            if (response.success) {
                this.periodicidades = response.data || [];
                this.renderPeriodicidades();
                this.updateStats();
            } else {
                throw new Error(response.message || 'Error al obtener periodicidades');
            }
        } catch (error) {
            console.error('Error al cargar periodicidades:', error);
            if (window.toastManager) {
                window.toastManager.show('Error al cargar periodicidades', 'error');
            } else {
                alert(error.message || 'No se pudieron cargar las periodicidades');
            }
        } finally {
            this.showLoading(false);
        }
    }

    renderPeriodicidades() {
        if (!this.periodicidades.length) {
            this.tablePeriodicidades.innerHTML = '';
            this.emptyPeriodicidades.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            return;
        }
        this.emptyPeriodicidades.classList.add('hidden');

        // Calcular paginación
        this.totalPages = PaginationHelper.getTotalPages(this.periodicidades.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Obtener elementos de la página actual
        const paginatedPeriodicidades = PaginationHelper.getPaginatedItems(this.periodicidades, this.currentPage, this.itemsPerPage);

        this.tablePeriodicidades.innerHTML = paginatedPeriodicidades
            .map((item) => `
                <tr class="table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.periodicidadesController.handleRowClick(event, ${item.periodicidad_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.periodicidad_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${item.meses} ${item.meses === 1 ? 'mes' : 'meses'}</td>
                    <td class="sticky right-0 bg-white px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2 whitespace-nowrap">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.periodicidadesController.openModal(${item.periodicidad_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.periodicidadesController.deletePeriodicidad(${item.periodicidad_id})"
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
        this.renderPagination(this.periodicidades.length);
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.periodicidadesController.goToPage'
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderPeriodicidades();
    }

    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1;
        this.renderPeriodicidades();
    }

    updateStats() {
        const total = this.periodicidades.length;
        this.statTotal.textContent = total;
    }

    handleRowClick(event, id) {
        // Abrir modal de edición al hacer clic en la fila
        this.openModal(id);
    }

    openModal(id = null) {
        this.currentId = id;
        this.form.reset();

        if (id) {
            const item = this.periodicidades.find((p) => p.periodicidad_id === id);
            if (!item) {
                if (window.toastManager) {
                    window.toastManager.show('Periodicidad no encontrada', 'error');
                } else {
                    alert('Periodicidad no encontrada');
                }
                return;
            }
            this.inputNombre.value = item.nombre;
            this.inputMeses.value = item.meses;
            this.modalTitle.textContent = 'Editar Periodicidad';
        } else {
            this.modalTitle.textContent = 'Nueva Periodicidad';
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
        const meses = parseInt(this.inputMeses.value);

        if (!nombre) {
            if (window.toastManager) {
                window.toastManager.show('El nombre es obligatorio', 'warning');
            } else {
                alert('El nombre es obligatorio.');
            }
            return;
        }

        if (!meses || meses < 1) {
            if (window.toastManager) {
                window.toastManager.show('Los meses deben ser un número mayor a 0', 'warning');
            } else {
                alert('Los meses deben ser un número mayor a 0.');
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
                response = await window.electronAPI.catalogos.updatePeriodicidad({
                    periodicidad_id: this.currentId,
                    nombre,
                    meses
                });
            } else {
                // Create new
                response = await window.electronAPI.catalogos.createPeriodicidad(nombre, meses);
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
                    this.currentId ? 'Periodicidad actualizada correctamente' : 'Periodicidad creada correctamente',
                    'success'
                );
            } else {
                alert('Cambios guardados correctamente.');
            }
        } catch (error) {
            console.error('Error al guardar periodicidad:', error);
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

    async deletePeriodicidad(id) {
        const item = this.periodicidades.find((p) => p.periodicidad_id === id);

        if (!item) {
            if (window.toastManager) {
                window.toastManager.show('Periodicidad no encontrada', 'error');
            } else {
                alert('Periodicidad no encontrada.');
            }
            return;
        }

        // Confirm deletion
        const confirmMessage = `¿Está seguro de que desea eliminar la periodicidad "${item.nombre}"?\n\nEsta acción no se puede deshacer.`;
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
            const response = await window.electronAPI.catalogos.deletePeriodicidad(id);

            if (!response.success) {
                throw new Error(response.message || 'No se pudo eliminar la periodicidad');
            }

            // Reload data
            await this.loadData();

            // Show success message
            if (window.toastManager) {
                window.toastManager.show('Periodicidad eliminada correctamente', 'success');
            } else {
                alert('Periodicidad eliminada correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar periodicidad:', error);
            if (window.toastManager) {
                window.toastManager.show(error.message || 'Error al eliminar', 'error');
            } else {
                alert(error.message || 'No se pudo eliminar la periodicidad.');
            }
        } finally {
            if (window.loadingSpinner) {
                window.loadingSpinner.hide();
            }
        }
    }

    showLoading(show) {
        this.loadingPeriodicidades.classList.toggle('hidden', !show);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    filterPeriodicidades() {
        const searchTerm = this.searchPeriodicidades.value.toLowerCase().trim();

        const filtered = this.periodicidades.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm) ||
            item.meses.toString().includes(searchTerm)
        );

        this.renderPeriodicidadesFiltered(filtered);
        this.updateStatsFiltered(filtered);
    }

    renderPeriodicidadesFiltered(data) {
        if (!data.length) {
            this.tablePeriodicidades.innerHTML = '';
            this.emptyPeriodicidades.classList.remove('hidden');
            return;
        }
        this.emptyPeriodicidades.classList.add('hidden');

        this.tablePeriodicidades.innerHTML = data
            .map((item) => `
                <tr class="table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.periodicidadesController.handleRowClick(event, ${item.periodicidad_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.periodicidad_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${item.meses} ${item.meses === 1 ? 'mes' : 'meses'}</td>
                    <td class="sticky right-0 bg-white px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2 whitespace-nowrap">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.periodicidadesController.openModal(${item.periodicidad_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.periodicidadesController.deletePeriodicidad(${item.periodicidad_id})"
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
        this.statTotal.textContent = filtered.length;
    }
}

console.log('✅ PeriodicidadesController class loaded successfully');

// Register in global scope
window.PeriodicidadesController = PeriodicidadesController;
