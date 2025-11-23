// assets/js/app-navigation.js
// Sistema de navegación SPA para la aplicación

class AppNavigation {
    constructor() {
        this.contentView = document.getElementById('contentView');
        this.navItems = document.querySelectorAll('.nav-item');
        this.currentView = null;
        this.currentController = null;

        // Mapeo de vistas a archivos parciales (rutas relativas a app_view.html que está en /views/)
        this.viewMap = {
            'dashboard': {
                file: 'partials/dashboard_partial.html',
                controller: 'DashboardController'
            },
            'clientes': {
                file: 'partials/clientes_partial.html',
                controller: 'ClientesController'
            },
            'polizas': {
                file: 'partials/polizas_partial.html',
                controller: 'PolizasController'
            },
            'recibos': {
                file: 'partials/recibos_partial.html',
                controller: 'RecibosController'
            },
            'catalogos': {
                file: 'partials/catalogos_partial.html',
                controller: 'CatalogosController'
            },
            'aseguradoras': {
                file: 'partials/aseguradoras_partial.html',
                controller: 'AseguradorasController'
            },
            'ramos': {
                file: 'partials/ramos_partial.html',
                controller: 'RamosController'
            },
            'periodicidades': {
                file: 'partials/periodicidades_partial.html',
                controller: 'PeriodicidadesController'
            },
            'metodos-pago': {
                file: 'partials/metodos_pago_partial.html',
                controller: 'MetodosPagoController'
            },
            'documentos': {
                file: 'partials/documentos_partial.html',
                controller: 'DocumentosController'
            },
            'config': {
                file: 'partials/config_partial.html',
                controller: 'ConfigController'
            }
        };

        this.initEventListeners();
    }

    initEventListeners() {
        // Event listeners para navegación
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = item.getAttribute('data-view');
                if (viewName) {
                    this.loadView(viewName);
                }
            });
        });
    }

    async loadView(viewName) {
        console.log('🔄 Intentando cargar vista:', viewName);

        if (!this.viewMap[viewName]) {
            console.error(`❌ Vista no encontrada: ${viewName}`);
            if (window.toastManager) {
                window.toastManager.show('Vista no encontrada', 'error');
            }
            return;
        }

        try {
            // Mostrar loading
            this.contentView.classList.add('loading');

            // Limpiar controlador anterior
            if (this.currentController) {
                this.cleanup();
            }

            const viewConfig = this.viewMap[viewName];
            console.log('📁 Ruta del archivo:', viewConfig.file);

            // Cargar contenido HTML (la ruta es relativa al archivo HTML, no al JS)
            const response = await fetch(viewConfig.file);
            console.log('📡 Response status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Error al cargar vista: ${response.statusText}`);
            }

            const html = await response.text();

            // Insertar contenido
            this.contentView.innerHTML = html;

            // Actualizar navegación activa
            this.updateActiveNav(viewName);

            // Inicializar controlador si existe
            if (viewConfig.controller) {
                await this.initController(viewConfig.controller);
            }

            // Guardar vista actual
            this.currentView = viewName;

            // Remover loading
            this.contentView.classList.remove('loading');

            // Scroll al inicio
            this.contentView.scrollTop = 0;

        } catch (error) {
            console.error('Error al cargar vista:', error);
            this.contentView.classList.remove('loading');

            if (window.toastManager) {
                window.toastManager.show('Error al cargar la vista', 'error');
            }

            // Mostrar mensaje de error en el contenido
            this.contentView.innerHTML = `
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <h3 class="mt-4 text-lg font-medium text-gray-900">Error al cargar la vista</h3>
                        <p class="mt-2 text-sm text-gray-500">${error.message}</p>
                        <button onclick="window.appNavigation.loadView('dashboard')" class="mt-4 bg-gold-500 hover:bg-gold-600 text-navy-700 font-semibold px-6 py-2 rounded-lg transition-colors">
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            `;
        }
    }

    async initController(controllerName) {
        try {
            // Cargar el script del controlador si no está ya cargado
            const scriptId = `controller-${controllerName}`;

            // Verificar si el script ya existe
            if (!document.getElementById(scriptId)) {
                await this.loadScript(`../controllers/${this.getControllerFileName(controllerName)}`, scriptId);
            }

            // Esperar un momento para que el script se ejecute y el DOM esté listo
            await new Promise(resolve => setTimeout(resolve, 100));

            // Inicializar el controlador
            if (window[controllerName]) {
                this.currentController = new window[controllerName]();

                // También registrar con nombre en minúsculas para acceso desde HTML inline
                const instanceName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
                window[instanceName] = this.currentController;

                console.log(`✅ Controlador ${controllerName} inicializado`);
            } else {
                console.warn(`Controlador ${controllerName} no encontrado en window`);
            }

        } catch (error) {
            console.error(`Error al inicializar controlador ${controllerName}:`, error);
        }
    }

    loadScript(src, id) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    getControllerFileName(controllerName) {
        // Convertir CamelCase a snake_case
        const fileName = controllerName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .substring(1);
        return `${fileName}.js`;
    }

    updateActiveNav(viewName) {
        this.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    executeScripts(container) {
        // Extraer todos los scripts del contenedor
        const scripts = container.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');

            // Copiar atributos
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copiar contenido
            if (oldScript.src) {
                // Script externo
                newScript.src = oldScript.src;
            } else {
                // Script inline
                newScript.textContent = oldScript.textContent;
            }

            // Reemplazar el script antiguo con el nuevo
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        console.log(`✅ ${scripts.length} scripts ejecutados`);
    }

    cleanup() {
        // Limpiar eventos y estado del controlador anterior si es necesario
        if (this.currentController && typeof this.currentController.destroy === 'function') {
            this.currentController.destroy();
        }
        this.currentController = null;
    }

    // Método público para navegar desde otros scripts
    navigateTo(viewName) {
        this.loadView(viewName);
    }
}
