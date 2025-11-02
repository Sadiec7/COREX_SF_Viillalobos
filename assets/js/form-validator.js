// assets/js/form-validator.js
// Sistema de validación de formularios en tiempo real

class FormValidator {
    constructor() {
        this.validators = {
            rfc: this.validateRFC.bind(this),
            email: this.validateEmail.bind(this),
            phone: this.validatePhone.bind(this),
            date: this.validateDate.bind(this),
            dateRange: this.validateDateRange.bind(this),
            number: this.validateNumber.bind(this),
            positiveNumber: this.validatePositiveNumber.bind(this),
            required: this.validateRequired.bind(this),
            maxLength: this.validateMaxLength.bind(this),
            minLength: this.validateMinLength.bind(this)
        };
    }

    /**
     * Initialize validation for a form
     * @param {HTMLFormElement} form - Form element to validate
     * @param {Object} rules - Validation rules for each field
     */
    initForm(form, rules = {}) {
        if (!form) return;

        Object.keys(rules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const fieldRules = rules[fieldName];

            // Add input event listener for real-time validation
            field.addEventListener('input', () => {
                this.validateField(field, fieldRules);
            });

            // Add blur event for final validation
            field.addEventListener('blur', () => {
                this.validateField(field, fieldRules);
            });
        });

        // Validate on form submit
        form.addEventListener('submit', (e) => {
            let isValid = true;

            Object.keys(rules).forEach(fieldName => {
                const field = form.querySelector(`[name="${fieldName}"]`);
                if (!field) return;

                const fieldValid = this.validateField(field, rules[fieldName]);
                if (!fieldValid) isValid = false;
            });

            if (!isValid) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    /**
     * Validate a single field
     * @param {HTMLInputElement} field - Input field to validate
     * @param {Array} rules - Array of validation rules
     * @returns {boolean} - Whether the field is valid
     */
    validateField(field, rules) {
        if (!field || !rules) return true;

        let isValid = true;
        let errorMessage = '';

        for (const rule of rules) {
            const { type, message, ...params } = rule;
            const validator = this.validators[type];

            if (!validator) continue;

            const result = validator(field.value, params, field);

            if (!result.valid) {
                isValid = false;
                errorMessage = message || result.message;
                break;
            }
        }

        this.updateFieldUI(field, isValid, errorMessage);
        return isValid;
    }

    /**
     * Update field UI based on validation result
     */
    updateFieldUI(field, isValid, errorMessage) {
        // Remove existing validation classes
        field.classList.remove('border-green-500', 'border-red-500', 'border-gray-300');

        // Remove existing error message
        let errorElement = field.parentElement.querySelector('.validation-error');
        if (errorElement) {
            errorElement.remove();
        }

        // Don't show validation if field is empty and not required
        const isEmpty = !field.value || field.value.trim() === '';
        if (isEmpty && isValid) {
            field.classList.add('border-gray-300');
            return;
        }

        if (isValid) {
            field.classList.add('border-green-500');
        } else {
            field.classList.add('border-red-500');

            // Add error message
            errorElement = document.createElement('p');
            errorElement.className = 'validation-error text-xs text-red-600 mt-1';
            errorElement.textContent = errorMessage;
            field.parentElement.appendChild(errorElement);
        }
    }

    // Validation methods
    validateRequired(value, params) {
        const isValid = value && value.trim() !== '';
        return {
            valid: isValid,
            message: 'Este campo es requerido'
        };
    }

    validateRFC(value, params) {
        if (!value) return { valid: true };

        // RFC pattern: AAAA######XXX or AAA######XXX
        const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
        const isValid = rfcPattern.test(value.toUpperCase());

        return {
            valid: isValid,
            message: 'RFC inválido. Formato: AAAA######XXX'
        };
    }

    validateEmail(value, params) {
        if (!value) return { valid: true };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(value);

        return {
            valid: isValid,
            message: 'Email inválido'
        };
    }

    validatePhone(value, params) {
        if (!value) return { valid: true };

        // Allow formats: 1234567890, 123-456-7890, (123) 456-7890
        const phonePattern = /^[\d\s\-\(\)]+$/;
        const digitsOnly = value.replace(/\D/g, '');
        const isValid = phonePattern.test(value) && digitsOnly.length === 10;

        return {
            valid: isValid,
            message: 'Teléfono inválido (10 dígitos)'
        };
    }

    validateDate(value, params) {
        if (!value) return { valid: true };

        const date = new Date(value);
        const isValid = !isNaN(date.getTime());

        return {
            valid: isValid,
            message: 'Fecha inválida'
        };
    }

    validateDateRange(value, params, field) {
        if (!value) return { valid: true };

        const { min, max, minField, maxField } = params;
        const currentDate = new Date(value);

        // Check against min date
        if (min) {
            const minDate = new Date(min);
            if (currentDate < minDate) {
                return {
                    valid: false,
                    message: `Fecha debe ser posterior a ${min}`
                };
            }
        }

        // Check against max date
        if (max) {
            const maxDate = new Date(max);
            if (currentDate > maxDate) {
                return {
                    valid: false,
                    message: `Fecha debe ser anterior a ${max}`
                };
            }
        }

        // Check against another field (e.g., start date < end date)
        if (minField) {
            const otherField = field.form.querySelector(`[name="${minField}"]`);
            if (otherField && otherField.value) {
                const otherDate = new Date(otherField.value);
                if (currentDate <= otherDate) {
                    return {
                        valid: false,
                        message: 'Fecha de fin debe ser posterior a fecha de inicio'
                    };
                }
            }
        }

        if (maxField) {
            const otherField = field.form.querySelector(`[name="${maxField}"]`);
            if (otherField && otherField.value) {
                const otherDate = new Date(otherField.value);
                if (currentDate >= otherDate) {
                    return {
                        valid: false,
                        message: 'Fecha de inicio debe ser anterior a fecha de fin'
                    };
                }
            }
        }

        return { valid: true };
    }

    validateNumber(value, params) {
        if (!value) return { valid: true };

        const num = parseFloat(value);
        const isValid = !isNaN(num);

        return {
            valid: isValid,
            message: 'Debe ser un número válido'
        };
    }

    validatePositiveNumber(value, params) {
        if (!value) return { valid: true };

        const num = parseFloat(value);
        const isValid = !isNaN(num) && num > 0;

        return {
            valid: isValid,
            message: 'Debe ser un número positivo'
        };
    }

    validateMaxLength(value, params) {
        if (!value) return { valid: true };

        const { length } = params;
        const isValid = value.length <= length;

        return {
            valid: isValid,
            message: `Máximo ${length} caracteres`
        };
    }

    validateMinLength(value, params) {
        if (!value) return { valid: true };

        const { length } = params;
        const isValid = value.length >= length;

        return {
            valid: isValid,
            message: `Mínimo ${length} caracteres`
        };
    }

    /**
     * Custom validation method
     */
    addValidator(name, validatorFn) {
        this.validators[name] = validatorFn;
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.formValidator = new FormValidator();
    console.log('✅ FormValidator initialized');
}
