// controllers/metodos_pago_controller.js
// Controlador para gestión de Métodos de Pago

class MetodosPagoController {
    constructor() {
        this.metodosPago = [];
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
        this.btnAddMetodoPago = document.getElementById('btnAddMetodoPago');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Indicadores
        this.statTotal = document.getElementById('statTotal');

        // Búsqueda
        this.searchMetodosPago = document.getElementById('searchMetodosPago');

        // Tabla
        this.tableMetodosPago = document.getElementById('metodosPagoTableBody');

        // Estados vacíos/carga
        this.emptyMetodosPago = document.getElementById('emptyMetodosPago');
        this.loadingMetodosPago = document.getElementById('loadingMetodosPago');

        // Paginación
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

        // Modal
        this.modal = document.getElementById('modalMetodoPago');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formMetodoPago');
        this.inputNombre = document.getElementById('inputNombre');
    }

    initEventListeners() {
        this.btnAddMetodoPago.addEventListener('click', () => this.openModal());
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
        this.searchMetodosPago.addEventListener('input', () => this.filterMetodosPago());

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
            const response = await window.electronAPI.catalogos.getMetodosPago();

            if (response.success) {
                this.metodosPago = response.data || [];
                this.renderMetodosPago();
                this.updateStats();
            } else {
                throw new Error(response.message || 'Error al obtener métodos de pago');
            }
        } catch (error) {
            console.error('Error al cargar métodos de pago:', error);
            if (window.toastManager) {
                window.toastManager.show('Error al cargar métodos de pago', 'error');
            } else {
                alert(error.message || 'No se pudieron cargar los métodos de pago');
            }
        } finally {
            this.showLoading(false);
        }
    }

    renderMetodosPago() {
        if (!this.metodosPago.length) {
            this.tableMetodosPago.innerHTML = '';
            this.emptyMetodosPago.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            return;
        }
        this.emptyMetodosPago.classList.add('hidden');

        // Calcular paginación
        this.totalPages = PaginationHelper.getTotalPages(this.metodosPago.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Obtener elementos de la página actual
        const paginatedMetodosPago = PaginationHelper.getPaginatedItems(this.metodosPago, this.currentPage, this.itemsPerPage);

        this.tableMetodosPago.innerHTML = paginatedMetodosPago
            .map((item) => `
                <tr class="group table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.metodosPagoController.handleRowClick(event, ${item.metodo_pago_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.metodo_pago_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2 whitespace-nowrap">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.metodosPagoController.openModal(${item.metodo_pago_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.metodosPagoController.deleteMetodoPago(${item.metodo_pago_id})"
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
        this.renderPagination(this.metodosPago.length);
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.metodosPagoController.goToPage'
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderMetodosPago();
    }

    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1;
        this.renderMetodosPago();
    }

    updateStats() {
        const total = this.metodosPago.length;
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
            const item = this.metodosPago.find((m) => m.metodo_pago_id === id);
            if (!item) {
                if (window.toastManager) {
                    window.toastManager.show('Método de pago no encontrado', 'error');
                } else {
                    alert('Método de pago no encontrado');
                }
                return;
            }
            this.inputNombre.value = item.nombre;
            this.modalTitle.textContent = 'Editar Método de Pago';
        } else {
            this.modalTitle.textContent = 'Nuevo Método de Pago';
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
                response = await window.electronAPI.catalogos.updateMetodoPago({
                    metodo_pago_id: this.currentId,
                    nombre
                });
            } else {
                // Create new
                response = await window.electronAPI.catalogos.createMetodoPago(nombre);
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
                    this.currentId ? 'Método de pago actualizado correctamente' : 'Método de pago creado correctamente',
                    'success'
                );
            } else {
                alert('Cambios guardados correctamente.');
            }
        } catch (error) {
            console.error('Error al guardar método de pago:', error);
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

    async deleteMetodoPago(id) {
        const item = this.metodosPago.find((m) => m.metodo_pago_id === id);

        if (!item) {
            if (window.toastManager) {
                window.toastManager.show('Método de pago no encontrado', 'error');
            } else {
                alert('Método de pago no encontrado.');
            }
            return;
        }

        // Confirm deletion
        const confirmMessage = `¿Está seguro de que desea eliminar el método de pago "${item.nombre}"?\n\nEsta acción no se puede deshacer.`;
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
            const response = await window.electronAPI.catalogos.deleteMetodoPago(id);

            if (!response.success) {
                throw new Error(response.message || 'No se pudo eliminar el método de pago');
            }

            // Reload data
            await this.loadData();

            // Show success message
            if (window.toastManager) {
                window.toastManager.show('Método de pago eliminado correctamente', 'success');
            } else {
                alert('Método de pago eliminado correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar método de pago:', error);
            if (window.toastManager) {
                window.toastManager.show(error.message || 'Error al eliminar', 'error');
            } else {
                alert(error.message || 'No se pudo eliminar el método de pago.');
            }
        } finally {
            if (window.loadingSpinner) {
                window.loadingSpinner.hide();
            }
        }
    }

    showLoading(show) {
        this.loadingMetodosPago.classList.toggle('hidden', !show);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    filterMetodosPago() {
        const searchTerm = this.searchMetodosPago.value.toLowerCase().trim();

        const filtered = this.metodosPago.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm)
        );

        this.renderMetodosPagoFiltered(filtered);
        this.updateStatsFiltered(filtered);
    }

    renderMetodosPagoFiltered(data) {
        if (!data.length) {
            this.tableMetodosPago.innerHTML = '';
            this.emptyMetodosPago.classList.remove('hidden');
            return;
        }
        this.emptyMetodosPago.classList.add('hidden');

        this.tableMetodosPago.innerHTML = data
            .map((item) => `
                <tr class="group table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.metodosPagoController.handleRowClick(event, ${item.metodo_pago_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.metodo_pago_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2 whitespace-nowrap">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.metodosPagoController.openModal(${item.metodo_pago_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.metodosPagoController.deleteMetodoPago(${item.metodo_pago_id})"
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

console.log('✅ MetodosPagoController class loaded successfully');

// Register in global scope
window.MetodosPagoController = MetodosPagoController;
