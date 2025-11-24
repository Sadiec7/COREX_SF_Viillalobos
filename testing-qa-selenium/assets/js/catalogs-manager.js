// catalogs-manager.js - Gestor global de catálogos compartidos
// Carga catálogos inmutables una sola vez al inicio de la aplicación

class CatalogsManager {
    constructor() {
        this.catalogs = {
            periodicidades: [],
            metodosPago: [],
            aseguradoras: [],
            ramos: []
        };
        this.loaded = false;
        this.loading = false;
        this.loadPromise = null;
    }

    /**
     * Carga todos los catálogos compartidos en paralelo
     * @returns {Promise<void>}
     */
    async loadAll() {
        // Si ya se están cargando, retornar la promesa existente
        if (this.loading) {
            return this.loadPromise;
        }

        // Si ya están cargados, no hacer nada
        if (this.loaded) {
            console.log('✅ [CATALOGS] Catálogos ya cargados previamente');
            return;
        }

        this.loading = true;
        console.log('🔄 [CATALOGS] Iniciando carga de catálogos globales...');
        const startTime = Date.now();

        this.loadPromise = (async () => {
            try {
                // Cargar todos los catálogos en paralelo
                const [periodicidadesRes, metodosPagoRes, aseguradorasRes, ramosRes] =
                    await Promise.all([
                        window.electronAPI.catalogos.getPeriodicidades(),
                        window.electronAPI.catalogos.getMetodosPago(),
                        window.electronAPI.catalogos.getAseguradoras(),
                        window.electronAPI.catalogos.getRamos()
                    ]);

                // Validar respuestas y asignar datos
                if (periodicidadesRes.success) {
                    this.catalogs.periodicidades = periodicidadesRes.data || [];
                    console.log(`  ✓ Periodicidades: ${this.catalogs.periodicidades.length} registros`);
                } else {
                    console.error('  ✗ Error al cargar periodicidades:', periodicidadesRes.message);
                }

                if (metodosPagoRes.success) {
                    this.catalogs.metodosPago = metodosPagoRes.data || [];
                    console.log(`  ✓ Métodos de Pago: ${this.catalogs.metodosPago.length} registros`);
                } else {
                    console.error('  ✗ Error al cargar métodos de pago:', metodosPagoRes.message);
                }

                if (aseguradorasRes.success) {
                    this.catalogs.aseguradoras = aseguradorasRes.data || [];
                    console.log(`  ✓ Aseguradoras: ${this.catalogs.aseguradoras.length} registros`);
                } else {
                    console.error('  ✗ Error al cargar aseguradoras:', aseguradorasRes.message);
                }

                if (ramosRes.success) {
                    this.catalogs.ramos = ramosRes.data || [];
                    console.log(`  ✓ Ramos: ${this.catalogs.ramos.length} registros`);
                } else {
                    console.error('  ✗ Error al cargar ramos:', ramosRes.message);
                }

                // Validar que al menos periodicidades y métodos de pago se hayan cargado
                // (son críticos para crear pólizas)
                if (this.catalogs.periodicidades.length === 0 || this.catalogs.metodosPago.length === 0) {
                    throw new Error('Catálogos críticos (periodicidades/métodos de pago) vacíos');
                }

                this.loaded = true;
                this.loading = false;

                const elapsed = Date.now() - startTime;
                console.log(`✅ [CATALOGS] Catálogos globales cargados en ${elapsed}ms`);

            } catch (error) {
                this.loading = false;
                console.error('❌ [CATALOGS] Error al cargar catálogos:', error);
                throw error;
            }
        })();

        return this.loadPromise;
    }

    /**
     * Obtiene un catálogo por nombre
     * @param {string} catalogName - Nombre del catálogo (periodicidades, metodosPago, aseguradoras, ramos)
     * @returns {Array} Array de registros del catálogo
     */
    get(catalogName) {
        if (!this.loaded) {
            console.warn(`⚠️ [CATALOGS] Intentando acceder a catálogo '${catalogName}' antes de que estén cargados`);
            return [];
        }

        if (!this.catalogs[catalogName]) {
            console.warn(`⚠️ [CATALOGS] Catálogo '${catalogName}' no existe`);
            return [];
        }

        return this.catalogs[catalogName];
    }

    /**
     * Verifica si los catálogos están listos
     * @returns {boolean}
     */
    isReady() {
        return this.loaded;
    }

    /**
     * Refresca un catálogo específico (útil si se agregan/modifican registros)
     * @param {string} catalogName - Nombre del catálogo a refrescar
     */
    async refresh(catalogName) {
        console.log(`🔄 [CATALOGS] Refrescando catálogo: ${catalogName}`);

        try {
            let result;
            switch (catalogName) {
                case 'periodicidades':
                    result = await window.electronAPI.catalogos.getPeriodicidades();
                    break;
                case 'metodosPago':
                    result = await window.electronAPI.catalogos.getMetodosPago();
                    break;
                case 'aseguradoras':
                    result = await window.electronAPI.catalogos.getAseguradoras();
                    break;
                case 'ramos':
                    result = await window.electronAPI.catalogos.getRamos();
                    break;
                default:
                    console.warn(`⚠️ [CATALOGS] Catálogo desconocido: ${catalogName}`);
                    return;
            }

            if (result.success) {
                this.catalogs[catalogName] = result.data || [];
                console.log(`✅ [CATALOGS] Catálogo '${catalogName}' refrescado: ${this.catalogs[catalogName].length} registros`);
            } else {
                console.error(`❌ [CATALOGS] Error al refrescar '${catalogName}':`, result.message);
            }
        } catch (error) {
            console.error(`❌ [CATALOGS] Error al refrescar '${catalogName}':`, error);
        }
    }

    /**
     * Refresca todos los catálogos
     */
    async refreshAll() {
        this.loaded = false;
        await this.loadAll();
    }
}

// Crear instancia global
window.catalogsManager = new CatalogsManager();
console.log('📦 [CATALOGS] CatalogsManager inicializado');
