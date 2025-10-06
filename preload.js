// preload.js - Comunicación segura entre procesos
const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // ============================================
    // AUTENTICACIÓN
    // ============================================
    authenticateUser: (username, password) =>
        ipcRenderer.invoke('auth:authenticate', username, password),

    onLoginSuccess: (user) =>
        ipcRenderer.invoke('app:login-success', user),

    logout: () =>
        ipcRenderer.invoke('app:logout'),

    // ============================================
    // CLIENTES
    // ============================================
    clientes: {
        getAll: () =>
            ipcRenderer.invoke('clientes:getAll'),

        search: (nombre) =>
            ipcRenderer.invoke('clientes:search', nombre),

        create: (clienteData) =>
            ipcRenderer.invoke('clientes:create', clienteData),

        update: (clienteId, clienteData) =>
            ipcRenderer.invoke('clientes:update', clienteId, clienteData),

        delete: (clienteId) =>
            ipcRenderer.invoke('clientes:delete', clienteId),

        getPolizas: (clienteId) =>
            ipcRenderer.invoke('clientes:getPolizas', clienteId)
    },

    // ============================================
    // PÓLIZAS
    // ============================================
    polizas: {
        getAll: (filters) =>
            ipcRenderer.invoke('polizas:getAll', filters),

        getById: (polizaId) =>
            ipcRenderer.invoke('polizas:getById', polizaId),

        create: (polizaData) =>
            ipcRenderer.invoke('polizas:create', polizaData),

        getRecibos: (polizaId) =>
            ipcRenderer.invoke('polizas:getRecibos', polizaId),

        porVencer: (dias) =>
            ipcRenderer.invoke('polizas:porVencer', dias)
    },

    // ============================================
    // RECIBOS
    // ============================================
    recibos: {
        marcarPagado: (reciboId, fechaPago) =>
            ipcRenderer.invoke('recibos:marcarPagado', reciboId, fechaPago),

        pendientesConAlertas: () =>
            ipcRenderer.invoke('recibos:pendientesConAlertas')
    },

    // ============================================
    // CATÁLOGOS
    // ============================================
    catalogos: {
        getAseguradoras: () =>
            ipcRenderer.invoke('catalogos:getAseguradoras'),

        getRamos: () =>
            ipcRenderer.invoke('catalogos:getRamos'),

        getPeriodicidades: () =>
            ipcRenderer.invoke('catalogos:getPeriodicidades'),

        getMetodosPago: () =>
            ipcRenderer.invoke('catalogos:getMetodosPago')
    },

    // ============================================
    // DASHBOARD / MÉTRICAS
    // ============================================
    dashboard: {
        getMetrics: () =>
            ipcRenderer.invoke('dashboard:getMetrics'),

        getPolizasConAlertas: () =>
            ipcRenderer.invoke('dashboard:getPolizasConAlertas')
    },

    // Información del sistema
    platform: process.platform,
    versions: process.versions
});

console.log('Preload script cargado - comunicación IPC lista');