// preload.js - Comunicación segura entre procesos
const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Autenticación
    authenticateUser: (username, password) =>
        ipcRenderer.invoke('auth:authenticate', username, password),

    // Notificar login exitoso
    onLoginSuccess: (user) =>
        ipcRenderer.invoke('app:login-success', user),

    // Logout
    logout: () =>
        ipcRenderer.invoke('app:logout'),

    // Información del sistema
    platform: process.platform,
    versions: process.versions
});

console.log('Preload script cargado - comunicación IPC lista');