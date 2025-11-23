// controllers/aseguradoras_controller.js
// Controlador para gestión de Aseguradoras

class AseguradorasController {
    constructor() {
        this.aseguradoras = [];
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
        this.btnAddAseguradora = document.getElementById('btnAddAseguradora');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelForm = document.getElementById('btnCancelForm');

        // Indicadores
        this.statTotal = document.getElementById('statTotal');
        this.statActivas = document.getElementById('statActivas');

        // Búsqueda
        this.searchAseguradoras = document.getElementById('searchAseguradoras');

        // Tabla
        this.tableAseguradoras = document.getElementById('aseguradorasTableBody');

        // Estados vacíos/carga
        this.emptyAseguradoras = document.getElementById('emptyAseguradoras');
        this.loadingAseguradoras = document.getElementById('loadingAseguradoras');

        // Paginación
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

        // Modal
        this.modal = document.getElementById('modalAseguradora');
        this.modalTitle = document.getElementById('modalTitle');
        this.form = document.getElementById('formAseguradora');
        this.inputNombre = document.getElementById('inputNombre');
    }

    initEventListeners() {
        this.btnAddAseguradora.addEventListener('click', () => this.openModal());
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
            const response = await window.electronAPI.catalogos.getAseguradoras();

            if (response.success) {
                this.aseguradoras = response.data || [];
                this.renderAseguradoras();
                this.updateStats();
            } else {
                throw new Error(response.message || 'Error al obtener aseguradoras');
            }
        } catch (error) {
            console.error('Error al cargar aseguradoras:', error);
            if (window.toastManager) {
                window.toastManager.show('Error al cargar aseguradoras', 'error');
            } else {
                alert(error.message || 'No se pudieron cargar las aseguradoras');
            }
        } finally {
            this.showLoading(false);
        }
    }

    renderAseguradoras() {
        if (!this.aseguradoras.length) {
            this.tableAseguradoras.innerHTML = '';
            this.emptyAseguradoras.classList.remove('hidden');
            if (this.paginationContainer) {
                this.paginationContainer.classList.add('hidden');
            }
            return;
        }
        this.emptyAseguradoras.classList.add('hidden');

        // Calcular paginación
        this.totalPages = PaginationHelper.getTotalPages(this.aseguradoras.length, this.itemsPerPage);
        this.currentPage = PaginationHelper.getValidPage(this.currentPage, this.totalPages);

        // Obtener elementos de la página actual
        const paginatedAseguradoras = PaginationHelper.getPaginatedItems(this.aseguradoras, this.currentPage, this.itemsPerPage);

        this.tableAseguradoras.innerHTML = paginatedAseguradoras
            .map((item) => `
                <tr class="group table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.aseguradorasController.handleRowClick(event, ${item.aseguradora_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.aseguradora_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.aseguradorasController.openModal(${item.aseguradora_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'} transition-colors p-1 rounded"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="event.stopPropagation(); window.aseguradorasController.toggleActivo(${item.aseguradora_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.aseguradorasController.deleteAseguradora(${item.aseguradora_id})"
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
        this.renderPagination(this.aseguradoras.length);
    }

    renderPagination(totalItems) {
        PaginationHelper.renderPagination({
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: totalItems,
            container: this.paginationContainer,
            infoElement: this.paginationInfo,
            onPageChange: 'window.aseguradorasController.goToPage'
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderAseguradoras();
    }

    changeItemsPerPage(value) {
        this.itemsPerPage = parseInt(value);
        this.currentPage = 1;
        this.renderAseguradoras();
    }

    updateStats() {
        const total = this.aseguradoras.length;
        const activas = this.aseguradoras.filter((a) => a.activo).length;
        this.statTotal.textContent = total;
        this.statActivas.textContent = activas;
    }

    handleRowClick(event, id) {
        // Abrir modal de edición al hacer clic en la fila
        this.openModal(id);
    }

    openModal(id = null) {
        this.currentId = id;
        this.form.reset();

        if (id) {
            const item = this.aseguradoras.find((a) => a.aseguradora_id === id);
            if (!item) {
                if (window.toastManager) {
                    window.toastManager.show('Aseguradora no encontrada', 'error');
                } else {
                    alert('Aseguradora no encontrada');
                }
                return;
            }
            this.inputNombre.value = item.nombre;
            this.modalTitle.textContent = 'Editar Aseguradora';
        } else {
            this.modalTitle.textContent = 'Nueva Aseguradora';
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
                const item = this.aseguradoras.find((a) => a.aseguradora_id === this.currentId);
                response = await window.electronAPI.catalogos.updateAseguradora({
                    aseguradora_id: this.currentId,
                    nombre,
                    activo: item ? item.activo : true
                });
            } else {
                // Create new
                response = await window.electronAPI.catalogos.createAseguradora(nombre);
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
                    this.currentId ? 'Aseguradora actualizada correctamente' : 'Aseguradora creada correctamente',
                    'success'
                );
            } else {
                alert('Cambios guardados correctamente.');
            }
        } catch (error) {
            console.error('Error al guardar aseguradora:', error);
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
        const item = this.aseguradoras.find((a) => a.aseguradora_id === id);

        if (!item) {
            if (window.toastManager) {
                window.toastManager.show('Aseguradora no encontrada', 'error');
            } else {
                alert('Aseguradora no encontrada.');
            }
            return;
        }

        const nuevoEstado = !item.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';

        // Confirm action with custom modal when available
        const confirmMessage = `¿Está seguro de que desea ${accion} esta aseguradora?\nSe ${accion}á "${item.nombre}".`;
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
            const response = await window.electronAPI.catalogos.updateAseguradora({
                aseguradora_id: id,
                nombre: item.nombre,
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
                    `Aseguradora ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`,
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

    async deleteAseguradora(id) {
        const item = this.aseguradoras.find((a) => a.aseguradora_id === id);

        if (!item) {
            if (window.toastManager) {
                window.toastManager.show('Aseguradora no encontrada', 'error');
            } else {
                alert('Aseguradora no encontrada.');
            }
            return;
        }

        // Confirm deletion
        const confirmMessage = `¿Está seguro de que desea eliminar la aseguradora "${item.nombre}"?\n\nEsta acción no se puede deshacer.`;
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
            const response = await window.electronAPI.catalogos.deleteAseguradora(id);

            if (!response.success) {
                throw new Error(response.message || 'No se pudo eliminar la aseguradora');
            }

            // Reload data
            await this.loadData();

            // Show success message
            if (window.toastManager) {
                window.toastManager.show('Aseguradora eliminada correctamente', 'success');
            } else {
                alert('Aseguradora eliminada correctamente.');
            }
        } catch (error) {
            console.error('Error al eliminar aseguradora:', error);
            if (window.toastManager) {
                window.toastManager.show(error.message || 'Error al eliminar', 'error');
            } else {
                alert(error.message || 'No se pudo eliminar la aseguradora.');
            }
        } finally {
            if (window.loadingSpinner) {
                window.loadingSpinner.hide();
            }
        }
    }

    showLoading(show) {
        this.loadingAseguradoras.classList.toggle('hidden', !show);
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
        this.updateStatsFiltered(filtered);
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
                <tr class="group table-row hover:bg-gray-50 transition-colors cursor-pointer" onclick="window.aseguradorasController.handleRowClick(event, ${item.aseguradora_id})">
                    <td class="px-6 py-4 text-sm text-gray-500">${item.aseguradora_id}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${this.escapeHtml(item.nombre)}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${item.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                            ${item.activo ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="sticky right-0 bg-white group-hover:bg-gray-50 px-6 py-4 text-sm font-medium shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div class="flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                                title="Editar"
                                onclick="event.stopPropagation(); window.aseguradorasController.openModal(${item.aseguradora_id})"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button
                                class="${item.activo ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'} transition-colors p-1 rounded"
                                title="${item.activo ? 'Desactivar' : 'Activar'}"
                                onclick="event.stopPropagation(); window.aseguradorasController.toggleActivo(${item.aseguradora_id})"
                            >
                                ${item.activo ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
                            </button>
                            <button
                                class="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                title="Eliminar"
                                onclick="event.stopPropagation(); window.aseguradorasController.deleteAseguradora(${item.aseguradora_id})"
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
        this.statActivas.textContent = activeCount;
    }
}

console.log('✅ AseguradorasController class loaded successfully');

// Register in global scope
window.AseguradorasController = AseguradorasController;
