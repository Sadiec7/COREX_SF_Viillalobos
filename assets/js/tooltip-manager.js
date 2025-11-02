// assets/js/tooltip-manager.js
// Sistema de tooltips y microinteracciones

class TooltipManager {
    constructor() {
        this.tooltips = new Map();
        this.init();
    }

    init() {
        // Add CSS for tooltips
        this.addStyles();

        // Initialize tooltips on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.initTooltips();
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tooltip-container {
                position: relative;
                display: inline-block;
            }

            .tooltip {
                position: absolute;
                z-index: 9999;
                background-color: rgba(30, 41, 59, 0.95);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                line-height: 1.25rem;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }

            .tooltip.show {
                opacity: 1;
            }

            .tooltip::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
            }

            .tooltip.top::before {
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 5px 5px 0 5px;
                border-color: rgba(30, 41, 59, 0.95) transparent transparent transparent;
            }

            .tooltip.bottom::before {
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0 5px 5px 5px;
                border-color: transparent transparent rgba(30, 41, 59, 0.95) transparent;
            }

            .tooltip.left::before {
                right: -5px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 5px 0 5px 5px;
                border-color: transparent transparent transparent rgba(30, 41, 59, 0.95);
            }

            .tooltip.right::before {
                left: -5px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 5px 5px 5px 0;
                border-color: transparent rgba(30, 41, 59, 0.95) transparent transparent;
            }

            /* Character counter */
            .char-counter {
                font-size: 0.75rem;
                color: #6b7280;
                margin-top: 0.25rem;
            }

            .char-counter.warning {
                color: #f59e0b;
            }

            .char-counter.danger {
                color: #ef4444;
            }

            /* Microinteractions */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @keyframes pulse-success {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
                }
            }

            .shake {
                animation: shake 0.3s ease;
            }

            .pulse-success {
                animation: pulse-success 0.6s ease;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize all tooltips with data-tooltip attribute
     */
    initTooltips() {
        const elements = document.querySelectorAll('[data-tooltip]');
        elements.forEach(element => {
            this.addTooltip(element);
        });
    }

    /**
     * Add tooltip to an element
     * @param {HTMLElement} element - Element to add tooltip to
     */
    addTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';

        if (!text) return;

        let tooltip = null;

        const showTooltip = (e) => {
            tooltip = document.createElement('div');
            tooltip.className = `tooltip ${position}`;
            tooltip.textContent = text;
            document.body.appendChild(tooltip);

            // Position the tooltip
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let top, left;

            switch (position) {
                case 'top':
                    top = rect.top - tooltipRect.height - 10;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'bottom':
                    top = rect.bottom + 10;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'left':
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    left = rect.left - tooltipRect.width - 10;
                    break;
                case 'right':
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    left = rect.right + 10;
                    break;
            }

            tooltip.style.top = `${top + window.scrollY}px`;
            tooltip.style.left = `${left + window.scrollX}px`;

            // Show with animation
            requestAnimationFrame(() => {
                tooltip.classList.add('show');
            });
        };

        const hideTooltip = () => {
            if (tooltip) {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    if (tooltip && tooltip.parentElement) {
                        tooltip.remove();
                    }
                    tooltip = null;
                }, 200);
            }
        };

        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);

        this.tooltips.set(element, { showTooltip, hideTooltip });
    }

    /**
     * Add character counter to input/textarea
     * @param {HTMLElement} field - Input or textarea element
     * @param {number} maxLength - Maximum character length
     */
    addCharCounter(field, maxLength) {
        if (!field) return;

        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0 / ${maxLength}`;

        field.parentElement.appendChild(counter);

        const updateCounter = () => {
            const current = field.value.length;
            counter.textContent = `${current} / ${maxLength}`;

            // Update color based on usage
            counter.classList.remove('warning', 'danger');
            if (current >= maxLength) {
                counter.classList.add('danger');
            } else if (current >= maxLength * 0.8) {
                counter.classList.add('warning');
            }
        };

        field.addEventListener('input', updateCounter);
    }

    /**
     * Shake animation for invalid fields
     * @param {HTMLElement} element - Element to shake
     */
    shake(element) {
        if (!element) return;

        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 300);
    }

    /**
     * Success pulse animation
     * @param {HTMLElement} element - Element to pulse
     */
    pulseSuccess(element) {
        if (!element) return;

        element.classList.add('pulse-success');
        setTimeout(() => {
            element.classList.remove('pulse-success');
        }, 600);
    }

    /**
     * Add debounced search
     * @param {HTMLInputElement} input - Search input element
     * @param {Function} callback - Function to call after debounce
     * @param {number} delay - Delay in milliseconds (default: 300)
     */
    addDebouncedSearch(input, callback, delay = 300) {
        if (!input) return;

        let timeout;

        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback(e.target.value);
            }, delay);
        });
    }

    /**
     * Remove tooltip from element
     * @param {HTMLElement} element - Element to remove tooltip from
     */
    removeTooltip(element) {
        const handlers = this.tooltips.get(element);
        if (handlers) {
            element.removeEventListener('mouseenter', handlers.showTooltip);
            element.removeEventListener('mouseleave', handlers.hideTooltip);
            element.removeEventListener('focus', handlers.showTooltip);
            element.removeEventListener('blur', handlers.hideTooltip);
            this.tooltips.delete(element);
        }
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.tooltipManager = new TooltipManager();
    console.log('✅ TooltipManager initialized');
}
