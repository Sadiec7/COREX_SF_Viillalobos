// controllers/base_controller.js
// Clase base para controladores con manejo automático de event listeners
// Resuelve el problema de memory leaks por listeners no removidos

class BaseController {
    constructor() {
        // Map para almacenar referencias a listeners para poder removerlos
        this._boundListeners = new Map();
        this._intervals = [];
        this._timeouts = [];
    }

    /**
     * Registra un event listener que puede ser removido automáticamente
     * @param {HTMLElement} element - Elemento DOM al que añadir el listener
     * @param {string} event - Nombre del evento (click, input, etc.)
     * @param {Function} handler - Función manejadora (método de la clase)
     * @param {Object} options - Opciones del addEventListener
     */
    addListener(element, event, handler, options = false) {
        if (!element) {
            console.warn('BaseController.addListener: elemento no encontrado');
            return;
        }

        // Crear versión bound del handler para mantener el contexto
        const boundHandler = handler.bind(this);
        element.addEventListener(event, boundHandler, options);

        // Almacenar referencia para poder remover después
        if (!this._boundListeners.has(element)) {
            this._boundListeners.set(element, []);
        }
        this._boundListeners.get(element).push({
            event,
            handler: boundHandler,
            options
        });
    }

    /**
     * Registra múltiples eventos en un elemento
     * @param {HTMLElement} element - Elemento DOM
     * @param {Array} events - Array de nombres de eventos
     * @param {Function} handler - Función manejadora
     */
    addListeners(element, events, handler, options = false) {
        events.forEach(event => {
            this.addListener(element, event, handler, options);
        });
    }

    /**
     * Registra un intervalo que será limpiado automáticamente
     * @param {Function} callback - Función a ejecutar
     * @param {number} delay - Intervalo en ms
     * @returns {number} ID del intervalo
     */
    addInterval(callback, delay) {
        const id = setInterval(callback.bind(this), delay);
        this._intervals.push(id);
        return id;
    }

    /**
     * Registra un timeout que será limpiado automáticamente
     * @param {Function} callback - Función a ejecutar
     * @param {number} delay - Delay en ms
     * @returns {number} ID del timeout
     */
    addTimeout(callback, delay) {
        const id = setTimeout(callback.bind(this), delay);
        this._timeouts.push(id);
        return id;
    }

    /**
     * Método destroy que limpia todos los recursos
     * Debe ser llamado cuando el controlador ya no se necesita
     * Las subclases pueden sobreescribir pero deben llamar super.destroy()
     */
    destroy() {
        // Remover todos los event listeners registrados
        this._boundListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler, options }) => {
                try {
                    element.removeEventListener(event, handler, options);
                } catch (e) {
                    // El elemento puede haber sido removido del DOM
                    console.warn('Error removing listener:', e);
                }
            });
        });
        this._boundListeners.clear();

        // Limpiar intervalos
        this._intervals.forEach(id => clearInterval(id));
        this._intervals = [];

        // Limpiar timeouts
        this._timeouts.forEach(id => clearTimeout(id));
        this._timeouts = [];

        console.log(`🧹 ${this.constructor.name} destruido correctamente`);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.BaseController = BaseController;
}

console.log('✅ BaseController class loaded successfully');
