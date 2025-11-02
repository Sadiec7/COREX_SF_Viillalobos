// assets/js/toast-manager.js
// Sistema de notificaciones toast moderno y elegante

class ToastManager {
    constructor() {
        this.toasts = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
            this.container.style.maxWidth = '420px';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (0 = no auto-dismiss)
     */
    show(message, type = 'info', duration = 4000) {
        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const toast = this.createToastElement(toastId, message, type);
        this.toasts.push({ id: toastId, element: toast });

        // Add to container
        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(toastId);
            }, duration);
        }

        return toastId;
    }

    createToastElement(toastId, message, type) {
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `
            transform translate-x-full opacity-0
            transition-all duration-300 ease-out
            pointer-events-auto
            bg-white rounded-lg shadow-lg border-l-4
            p-4 flex items-start gap-3
            hover:shadow-xl
            ${this.getTypeClasses(type)}
        `.trim().replace(/\s+/g, ' ');

        const icon = this.getIcon(type);
        const colors = this.getColors(type);

        toast.innerHTML = `
            <div class="flex-shrink-0 ${colors.icon}">
                ${icon}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium ${colors.text} break-words">
                    ${this.escapeHtml(message)}
                </p>
            </div>
            <button
                onclick="window.toastManager.dismiss('${toastId}')"
                class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ml-2"
                aria-label="Cerrar"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        return toast;
    }

    dismiss(toastId) {
        const toastIndex = this.toasts.findIndex(t => t.id === toastId);
        if (toastIndex === -1) return;

        const { element } = this.toasts[toastIndex];

        // Animate out
        element.classList.remove('translate-x-0', 'opacity-100');
        element.classList.add('translate-x-full', 'opacity-0');

        // Remove from DOM after animation
        setTimeout(() => {
            if (element.parentElement) {
                element.remove();
            }
            this.toasts.splice(toastIndex, 1);
        }, 300);
    }

    dismissAll() {
        this.toasts.forEach(({ id }) => this.dismiss(id));
    }

    getTypeClasses(type) {
        const classes = {
            'success': 'border-green-500',
            'error': 'border-red-500',
            'warning': 'border-yellow-500',
            'info': 'border-blue-500'
        };
        return classes[type] || classes.info;
    }

    getColors(type) {
        const colors = {
            'success': {
                icon: 'text-green-600',
                text: 'text-gray-900'
            },
            'error': {
                icon: 'text-red-600',
                text: 'text-gray-900'
            },
            'warning': {
                icon: 'text-yellow-600',
                text: 'text-gray-900'
            },
            'info': {
                icon: 'text-blue-600',
                text: 'text-gray-900'
            }
        };
        return colors[type] || colors.info;
    }

    getIcon(type) {
        const icons = {
            'success': `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            'error': `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            'warning': `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,
            'info': `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `
        };
        return icons[type] || icons.info;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Convenience methods
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4500) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.toastManager = new ToastManager();

    // Global helper functions for convenience
    window.showToast = (message, type, duration) => window.toastManager.show(message, type, duration);
    window.showSuccess = (message, duration) => window.toastManager.success(message, duration);
    window.showError = (message, duration) => window.toastManager.error(message, duration);
    window.showWarning = (message, duration) => window.toastManager.warning(message, duration);
    window.showInfo = (message, duration) => window.toastManager.info(message, duration);

    console.log('✅ ToastManager initialized');
}
