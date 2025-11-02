// assets/js/loading-spinner.js
// Sistema de loading spinners y overlays

class LoadingManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create loading overlay
        this.createOverlay();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'loading-overlay';
        this.overlay.className = 'fixed inset-0 z-[9998] hidden bg-black bg-opacity-50 transition-opacity';
        this.overlay.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4">
                    <svg class="animate-spin h-12 w-12 text-gold-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p id="loading-overlay-text" class="text-navy-700 font-medium">Cargando...</p>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
    }

    /**
     * Show global loading overlay
     * @param {string} message - Loading message
     */
    show(message = 'Cargando...') {
        if (!this.overlay) {
            this.createOverlay();
        }

        const textElement = this.overlay.querySelector('#loading-overlay-text');
        if (textElement) {
            textElement.textContent = message;
        }

        this.overlay.classList.remove('hidden');
    }

    /**
     * Hide global loading overlay
     */
    hide() {
        if (this.overlay) {
            this.overlay.classList.add('hidden');
        }
    }

    /**
     * Set loading state on a button
     * @param {HTMLButtonElement} button - Button element
     * @param {boolean} isLoading - Loading state
     * @param {string} loadingText - Text to show while loading
     */
    setButtonLoading(button, isLoading, loadingText = 'Procesando...') {
        if (!button) return;

        if (isLoading) {
            // Store original content
            button.dataset.originalContent = button.innerHTML;
            button.disabled = true;

            // Set loading content
            button.innerHTML = `
                <svg class="animate-spin inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>${loadingText}</span>
            `;
        } else {
            // Restore original content
            button.disabled = false;
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
                delete button.dataset.originalContent;
            }
        }
    }

    /**
     * Create a skeleton loader for tables
     * @param {number} rows - Number of skeleton rows
     * @param {number} cols - Number of skeleton columns
     * @returns {string} - HTML for skeleton loader
     */
    getTableSkeleton(rows = 5, cols = 6) {
        let html = '';

        for (let i = 0; i < rows; i++) {
            html += '<tr class="skeleton-row">';
            for (let j = 0; j < cols; j++) {
                html += `
                    <td class="px-6 py-4">
                        <div class="skeleton-box h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                `;
            }
            html += '</tr>';
        }

        return html;
    }

    /**
     * Create a skeleton loader for cards
     * @param {number} count - Number of skeleton cards
     * @returns {string} - HTML for skeleton cards
     */
    getCardSkeleton(count = 3) {
        let html = '';

        for (let i = 0; i < count; i++) {
            html += `
                <div class="bg-white rounded-lg shadow-md p-6 skeleton-card">
                    <div class="skeleton-box h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div class="skeleton-box h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div class="skeleton-box h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
            `;
        }

        return html;
    }

    /**
     * Show loading spinner inside a specific element
     * @param {HTMLElement} element - Container element
     * @param {string} message - Loading message
     */
    showInElement(element, message = 'Cargando...') {
        if (!element) return;

        element.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12">
                <svg class="animate-spin h-10 w-10 text-gold-500 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-sm text-gray-500">${message}</p>
            </div>
        `;
    }
}

// CSS for skeleton loaders (inject into document)
const skeletonStyles = document.createElement('style');
skeletonStyles.textContent = `
    @keyframes skeleton-pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .skeleton-box {
        animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-row td {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(skeletonStyles);

// Initialize global instance
if (typeof window !== 'undefined') {
    window.loadingManager = new LoadingManager();

    // Global helper functions
    window.showLoading = (message) => window.loadingManager.show(message);
    window.hideLoading = () => window.loadingManager.hide();
    window.setButtonLoading = (button, isLoading, text) => window.loadingManager.setButtonLoading(button, isLoading, text);

    console.log('✅ LoadingManager initialized');
}
