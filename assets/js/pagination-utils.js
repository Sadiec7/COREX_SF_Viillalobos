// assets/js/pagination-utils.js
// Utilidades reutilizables para paginación

class PaginationHelper {
    /**
     * Renderiza los controles de paginación
     * @param {Object} options - Opciones de paginación
     * @param {number} options.currentPage - Página actual
     * @param {number} options.itemsPerPage - Items por página
     * @param {number} options.totalItems - Total de items
     * @param {HTMLElement} options.container - Contenedor de paginación
     * @param {HTMLElement} options.infoElement - Elemento para mostrar info
     * @param {Function} options.onPageChange - Callback cuando cambia la página
     */
    static renderPagination(options) {
        const { currentPage, itemsPerPage, totalItems, container, infoElement, onPageChange } = options;

        if (!container) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalItems <= itemsPerPage) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');

        // Actualizar info de paginación
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        if (infoElement) {
            infoElement.textContent = `Mostrando ${startItem} - ${endItem} de ${totalItems}`;
        }

        // Generar botones de paginación
        const paginationButtons = this.generatePaginationButtons({
            currentPage,
            totalPages,
            onPageChange
        });

        const buttonsContainer = container.querySelector('#paginationButtons');
        if (buttonsContainer) {
            buttonsContainer.innerHTML = paginationButtons;
        }
    }

    /**
     * Genera los botones HTML de paginación
     * @param {Object} options - Opciones
     * @param {number} options.currentPage - Página actual
     * @param {number} options.totalPages - Total de páginas
     * @param {Function} options.onPageChange - Callback cuando cambia la página
     */
    static generatePaginationButtons(options) {
        const { currentPage, totalPages, onPageChange } = options;
        const buttons = [];
        const maxButtons = 7;

        // Botón anterior
        buttons.push(`
            <button
                onclick="${onPageChange}(${currentPage - 1})"
                ${currentPage === 1 ? 'disabled' : ''}
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
        `);

        // Calcular rango de páginas a mostrar
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        // Ajustar si estamos cerca del final
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        // Primera página si no está en el rango
        if (startPage > 1) {
            buttons.push(this.createPageButton(1, currentPage, onPageChange));
            if (startPage > 2) {
                buttons.push('<span class="px-3 py-2 text-gray-500">...</span>');
            }
        }

        // Botones de páginas
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(this.createPageButton(i, currentPage, onPageChange));
        }

        // Última página si no está en el rango
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push('<span class="px-3 py-2 text-gray-500">...</span>');
            }
            buttons.push(this.createPageButton(totalPages, currentPage, onPageChange));
        }

        // Botón siguiente
        buttons.push(`
            <button
                onclick="${onPageChange}(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        `);

        return buttons.join('');
    }

    /**
     * Crea un botón de página
     * @param {number} pageNumber - Número de página
     * @param {number} currentPage - Página actual
     * @param {Function} onPageChange - Callback cuando cambia la página
     */
    static createPageButton(pageNumber, currentPage, onPageChange) {
        const isActive = pageNumber === currentPage;
        return `
            <button
                onclick="${onPageChange}(${pageNumber})"
                class="px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                        ? 'bg-gold-500 text-navy-700'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }"
            >
                ${pageNumber}
            </button>
        `;
    }

    /**
     * Obtiene los items paginados de un array
     * @param {Array} items - Array de items
     * @param {number} currentPage - Página actual
     * @param {number} itemsPerPage - Items por página
     */
    static getPaginatedItems(items, currentPage, itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }

    /**
     * Calcula el total de páginas
     * @param {number} totalItems - Total de items
     * @param {number} itemsPerPage - Items por página
     */
    static getTotalPages(totalItems, itemsPerPage) {
        return Math.ceil(totalItems / itemsPerPage);
    }

    /**
     * Asegura que la página actual esté en rango válido
     * @param {number} currentPage - Página actual
     * @param {number} totalPages - Total de páginas
     */
    static getValidPage(currentPage, totalPages) {
        if (currentPage > totalPages) {
            return totalPages > 0 ? totalPages : 1;
        }
        if (currentPage < 1) {
            return 1;
        }
        return currentPage;
    }
}

// Registrar en el scope global
window.PaginationHelper = PaginationHelper;

console.log('✅ PaginationHelper loaded successfully');
