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

        // Estadísticas
        this.statTotal = document.getElementById('statTotal');
        this.statPendientes = document.getElementById('statPendientes');
        this.statPagados = document.getElementById('statPagados');
        this.statVencidos = document.getElementById('statVencidos');

        // Tabla
        this.tableBody = document.getElementById('recibosTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

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

        this.renderTable();
        this.updateStats();
        this.showLoading(false);
    }

    renderTable() {
        if (!this.recibos.length) {
            this.tableBody.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        this.tableBody.innerHTML = this.recibos.map(recibo => {
            const estadoClass = this.getEstadoBadge(recibo.estado, recibo.fecha_corte);
            return `
                <tr class=\"table-row transition-colors\">
                    <td class=\"px-6 py-4 text-sm text-gray-900 font-semibold\">
                        ${this.escapeHtml(recibo.numero_recibo || `#${recibo.recibo_id}`)}
                    </td>
                    <td class=\"px-6 py-4 text-sm text-gray-500\">
                        <div class=\"font-medium text-gray-900\">${this.escapeHtml(recibo.numero_poliza || '')}</div>
                        <div class=\"text-xs text-gray-500\">${this.escapeHtml(recibo.cliente_nombre || '')}</div>
                    </td>
                    <td class=\"px-6 py-4 text-sm text-gray-500\">
                        ${this.formatDate(recibo.fecha_inicio_periodo)} - ${this.formatDate(recibo.fecha_fin_periodo)}
                    </td>
                    <td class=\"px-6 py-4 text-sm text-gray-900 font-semibold\">
                        ${this.formatCurrency(recibo.monto)}
                    </td>
                    <td class=\"px-6 py-4 text-sm text-gray-500\">
                        ${this.formatDate(recibo.fecha_corte)}
                    </td>
                    <td class=\"px-6 py-4 text-sm\">
                        <span class=\"status-badge ${estadoClass}\">
                            ${this.capitalize(recibo.estado)}
                        </span>
                        ${recibo.fecha_pago ? `<div class=\"text-xs text-gray-500 mt-1\">Pago: ${this.formatDate(recibo.fecha_pago)}</div>` : ''}
                    </td>
                    <td class=\"px-6 py-4 text-sm text-gray-500\">
                        ${this.escapeHtml(recibo.aseguradora_nombre || '-')}
                    </td>
                    <td class=\"px-6 py-4 whitespace-nowrap text-sm font-medium\">
                        <div class=\"flex gap-2\">
                            ${recibo.estado !== 'pagado' ? `
                                <button
                                    class=\"text-green-600 hover:text-green-900 transition-colors\"
                                    title=\"Marcar como pagado\"
                                    onclick=\"window.recibosController.markAsPaid(${recibo.recibo_id})\"
                                >
                                    ✔
                                </button>
                            ` : `
                                <button
                                    class=\"text-yellow-600 hover:text-yellow-900 transition-colors\"
                                    title=\"Marcar como pendiente\"
                                    onclick=\"window.recibosController.markAsPending(${recibo.recibo_id})\"
                                >
                                    ⟳
                                </button>
                            `}
                            <button
                                class=\"text-indigo-600 hover:text-indigo-900 transition-colors\"
                                title=\"Editar\"
                                onclick=\"window.recibosController.openEditModal(${recibo.recibo_id})\"
                            >
                                ✎
                            </button>
                            <button
                                class=\"text-red-600 hover:text-red-900 transition-colors\"
                                title=\"Eliminar\"
                                onclick=\"window.recibosController.deleteRecibo(${recibo.recibo_id})\"
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
    }

    updateStats() {
        const totals = this.recibos.reduce((acc, recibo) => {
            acc.total += 1;
            acc[recibo.estado] = (acc[recibo.estado] || 0) + 1;
            return acc;
        }, { total: 0, pendiente: 0, pagado: 0, vencido: 0 });

        this.statTotal.textContent = totals.total;
        this.statPendientes.textContent = totals.pendiente;
        this.statPagados.textContent = totals.pagado;
        this.statVencidos.textContent = totals.vencido;
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
        if (!confirm('¿Eliminar este recibo de forma permanente?')) {
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

    closeModal() {
        this.modal.classList.remove('active');
        this.form.reset();
        this.currentRecibo = null;
        this.isEditMode = false;
    }

    goBack() {
        window.location.href = 'dashboard_view.html';
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
        } else if (num >= 1000) {
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
}

console.log('✅ RecibosController class loaded successfully');

// Register in global scope
window.RecibosController = RecibosController;
