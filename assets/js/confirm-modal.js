// assets/js/confirm-modal.js
// Sistema de modales de confirmación elegantes

class ConfirmModal {
    constructor() {
        this.modal = null;
        this.resolveCallback = null;
        this.init();
    }

    init() {
        // Create modal structure if it doesn't exist
        if (!this.modal) {
            this.createModal();
        }
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'confirm-modal';
        this.modal.className = 'fixed inset-0 z-[10000] hidden';
        this.modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" id="confirm-modal-backdrop"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div
                    id="confirm-modal-content"
                    class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all scale-95 opacity-0"
                >
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                        <div id="confirm-modal-icon" class="flex-shrink-0"></div>
                        <h3 id="confirm-modal-title" class="text-lg font-semibold text-navy-700 flex-1"></h3>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-4">
                        <p id="confirm-modal-message" class="text-gray-700"></p>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                        <button
                            id="confirm-modal-cancel"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            id="confirm-modal-confirm"
                            class="px-5 py-2 rounded-lg transition-colors font-semibold"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Event listeners
        const cancelBtn = this.modal.querySelector('#confirm-modal-cancel');
        const confirmBtn = this.modal.querySelector('#confirm-modal-confirm');
        const backdrop = this.modal.querySelector('#confirm-modal-backdrop');

        cancelBtn.addEventListener('click', () => this.close(false));
        backdrop.addEventListener('click', () => this.close(false));
        confirmBtn.addEventListener('click', () => this.close(true));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('hidden')) {
                if (e.key === 'Escape') {
                    this.close(false);
                } else if (e.key === 'Enter') {
                    this.close(true);
                }
            }
        });
    }

    /**
     * Show confirmation modal
     * @param {Object} options - Configuration options
     * @param {string} options.title - Modal title
     * @param {string} options.message - Modal message
     * @param {string} options.type - Type: 'danger', 'warning', 'info', 'success'
     * @param {string} options.confirmText - Text for confirm button
     * @param {string} options.cancelText - Text for cancel button
     * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
     */
    show(options = {}) {
        const {
            title = '¿Estás seguro?',
            message = '',
            type = 'warning',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar'
        } = options;

        // Set content
        this.modal.querySelector('#confirm-modal-title').textContent = title;
        this.modal.querySelector('#confirm-modal-message').textContent = message;
        this.modal.querySelector('#confirm-modal-cancel').textContent = cancelText;
        this.modal.querySelector('#confirm-modal-confirm').textContent = confirmText;

        // Set icon and styling based on type
        const iconContainer = this.modal.querySelector('#confirm-modal-icon');
        const confirmBtn = this.modal.querySelector('#confirm-modal-confirm');

        iconContainer.innerHTML = this.getIcon(type);
        confirmBtn.className = `px-5 py-2 rounded-lg transition-colors font-semibold ${this.getButtonClass(type)}`;

        // Show modal
        this.modal.classList.remove('hidden');

        // Trigger animation
        requestAnimationFrame(() => {
            const content = this.modal.querySelector('#confirm-modal-content');
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        });

        // Return promise
        return new Promise((resolve) => {
            this.resolveCallback = resolve;
        });
    }

    close(confirmed) {
        const content = this.modal.querySelector('#confirm-modal-content');

        // Animate out
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        // Hide after animation
        setTimeout(() => {
            this.modal.classList.add('hidden');

            // Resolve promise
            if (this.resolveCallback) {
                this.resolveCallback(confirmed);
                this.resolveCallback = null;
            }
        }, 200);
    }

    getIcon(type) {
        const icons = {
            danger: `
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,
            warning: `
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,
            info: `
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            success: `
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `
        };

        return icons[type] || icons.info;
    }

    getButtonClass(type) {
        const classes = {
            danger: 'bg-red-600 hover:bg-red-700 text-white',
            warning: 'bg-yellow-500 hover:bg-yellow-600 text-navy-700',
            info: 'bg-blue-600 hover:bg-blue-700 text-white',
            success: 'bg-green-600 hover:bg-green-700 text-white'
        };

        return classes[type] || classes.info;
    }

    // Convenience methods
    async confirm(message, title = '¿Estás seguro?') {
        return await this.show({
            title,
            message,
            type: 'info',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar'
        });
    }

    async confirmDelete(itemName, message = '') {
        const msg = message || `¿Estás seguro de eliminar "${itemName}"?\n\nEsta acción no se puede deshacer.`;
        return await this.show({
            title: 'Confirmar eliminación',
            message: msg,
            type: 'danger',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar'
        });
    }

    async confirmAction(action, itemName) {
        return await this.show({
            title: `Confirmar ${action}`,
            message: `¿Estás seguro de ${action} "${itemName}"?`,
            type: 'warning',
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            cancelText: 'Cancelar'
        });
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.confirmModal = new ConfirmModal();

    // Global helper function
    window.confirmDialog = (options) => window.confirmModal.show(options);

    console.log('✅ ConfirmModal initialized');
}
