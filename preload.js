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

        update: (polizaId, polizaData) =>
            ipcRenderer.invoke('polizas:update', polizaId, polizaData),

        delete: (polizaId) =>
            ipcRenderer.invoke('polizas:delete', polizaId),

        getRecibos: (polizaId) =>
            ipcRenderer.invoke('polizas:getRecibos', polizaId),

        porVencer: (dias) =>
            ipcRenderer.invoke('polizas:porVencer', dias)
    },

    // ============================================
    // RECIBOS
    // ============================================
    recibos: {
        list: (filters) =>
            ipcRenderer.invoke('recibos:list', filters),

        getById: (reciboId) =>
            ipcRenderer.invoke('recibos:getById', reciboId),

        getByPoliza: (polizaId) =>
            ipcRenderer.invoke('recibos:getByPoliza', polizaId),

        create: (reciboData) =>
            ipcRenderer.invoke('recibos:create', reciboData),

        update: (reciboId, reciboData) =>
            ipcRenderer.invoke('recibos:update', reciboId, reciboData),

        delete: (reciboId) =>
            ipcRenderer.invoke('recibos:delete', reciboId),

        marcarPagado: (reciboId, fechaPago) =>
            ipcRenderer.invoke('recibos:marcarPagado', reciboId, fechaPago),

        cambiarEstado: (reciboId, nuevoEstado) =>
            ipcRenderer.invoke('recibos:cambiarEstado', reciboId, nuevoEstado),

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
            ipcRenderer.invoke('catalogos:getMetodosPago'),

        createAseguradora: (nombre) =>
            ipcRenderer.invoke('catalogos:createAseguradora', nombre),

        updateAseguradora: (payload) =>
            ipcRenderer.invoke('catalogos:updateAseguradora', payload),

        createRamo: (nombre, descripcion) =>
            ipcRenderer.invoke('catalogos:createRamo', nombre, descripcion),

        updateRamo: (payload) =>
            ipcRenderer.invoke('catalogos:updateRamo', payload)
    },

    // ============================================
    // DIÁLOGOS NATIVOS
    // ============================================
    dialog: {
        openFile: (options = {}) =>
            ipcRenderer.invoke('dialog:openFile', options),

        selectDirectory: (options = {}) =>
            ipcRenderer.invoke('dialog:selectDirectory', options)
    },

    // ============================================
    // DOCUMENTOS
    // ============================================
    documentos: {
        create: (documentoData) =>
            ipcRenderer.invoke('documentos:create', documentoData),

        getByCliente: (clienteId) =>
            ipcRenderer.invoke('documentos:getByCliente', clienteId),

        getByPoliza: (polizaId) =>
            ipcRenderer.invoke('documentos:getByPoliza', polizaId),

        delete: (documentoId) =>
            ipcRenderer.invoke('documentos:delete', documentoId),

        openFile: (payload) =>
            ipcRenderer.invoke('documentos:openFile', payload),

        exportCliente: (payload) =>
            ipcRenderer.invoke('documentos:exportCliente', payload)
    },

    // ============================================
    // AUDITORÍA
    // ============================================
    auditoria: {
        listarPorPoliza: (polizaId, limit) =>
            ipcRenderer.invoke('auditoria:listarPorPoliza', polizaId, limit),

        listarRecientes: (limit) =>
            ipcRenderer.invoke('auditoria:listarRecientes', limit),

        registrar: (auditoriaData) =>
            ipcRenderer.invoke('auditoria:registrar', auditoriaData)
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
