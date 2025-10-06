// ipc-handlers.js
// Handlers IPC para comunicación con el frontend

const { ipcMain } = require('electron');

/**
 * Registrar todos los handlers IPC
 */
function registerIPCHandlers(dbManager, userModel, clienteModel, polizaModel) {

    // ============================================
    // CLIENTES
    // ============================================

    // Listar todos los clientes
    ipcMain.handle('clientes:getAll', async () => {
        try {
            const clientes = clienteModel.getAll(1000, 0);
            return { success: true, data: clientes };
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            return { success: false, message: error.message };
        }
    });

    // Buscar clientes por nombre
    ipcMain.handle('clientes:search', async (event, nombre) => {
        try {
            const clientes = clienteModel.searchByName(nombre);
            return { success: true, data: clientes };
        } catch (error) {
            console.error('Error al buscar clientes:', error);
            return { success: false, message: error.message };
        }
    });

    // Crear cliente
    ipcMain.handle('clientes:create', async (event, clienteData) => {
        try {
            const cliente = clienteModel.create(clienteData);
            console.log('✅ Cliente creado:', cliente.cliente_id);
            return { success: true, data: cliente };
        } catch (error) {
            console.error('Error al crear cliente:', error);
            return { success: false, message: error.message };
        }
    });

    // Actualizar cliente
    ipcMain.handle('clientes:update', async (event, clienteId, clienteData) => {
        try {
            const updated = clienteModel.update(clienteId, clienteData);
            if (updated) {
                console.log('✅ Cliente actualizado:', clienteId);
                return { success: true };
            }
            return { success: false, message: 'Cliente no encontrado' };
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            return { success: false, message: error.message };
        }
    });

    // Eliminar cliente
    ipcMain.handle('clientes:delete', async (event, clienteId) => {
        try {
            const deleted = clienteModel.delete(clienteId);
            if (deleted) {
                console.log('✅ Cliente eliminado:', clienteId);
                return { success: true };
            }
            return { success: false, message: 'Cliente no encontrado' };
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener pólizas de un cliente
    ipcMain.handle('clientes:getPolizas', async (event, clienteId) => {
        try {
            const polizas = clienteModel.getPolizas(clienteId);
            return { success: true, data: polizas };
        } catch (error) {
            console.error('Error al obtener pólizas del cliente:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // PÓLIZAS
    // ============================================

    // Listar todas las pólizas
    ipcMain.handle('polizas:getAll', async (event, filters = {}) => {
        try {
            const polizas = polizaModel.getAll(filters);
            return { success: true, data: polizas };
        } catch (error) {
            console.error('Error al obtener pólizas:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener póliza por ID
    ipcMain.handle('polizas:getById', async (event, polizaId) => {
        try {
            const poliza = polizaModel.getById(polizaId);
            return { success: true, data: poliza };
        } catch (error) {
            console.error('Error al obtener póliza:', error);
            return { success: false, message: error.message };
        }
    });

    // Crear póliza
    ipcMain.handle('polizas:create', async (event, polizaData) => {
        try {
            const poliza = polizaModel.create(polizaData);
            console.log('✅ Póliza creada:', poliza.poliza_id, '- Recibos:', poliza.recibos_generados);
            return { success: true, data: poliza };
        } catch (error) {
            console.error('Error al crear póliza:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener recibos de una póliza
    ipcMain.handle('polizas:getRecibos', async (event, polizaId) => {
        try {
            const recibos = polizaModel.getRecibos(polizaId);
            return { success: true, data: recibos };
        } catch (error) {
            console.error('Error al obtener recibos:', error);
            return { success: false, message: error.message };
        }
    });

    // Marcar recibo como pagado
    ipcMain.handle('recibos:marcarPagado', async (event, reciboId, fechaPago = null) => {
        try {
            const updated = polizaModel.marcarReciboPagado(reciboId, fechaPago);
            if (updated) {
                console.log('✅ Recibo marcado como pagado:', reciboId);
                return { success: true };
            }
            return { success: false, message: 'Recibo no encontrado' };
        } catch (error) {
            console.error('Error al marcar recibo como pagado:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener pólizas por vencer
    ipcMain.handle('polizas:porVencer', async (event, dias = 30) => {
        try {
            const polizas = polizaModel.getPolizasPorVencer(dias);
            return { success: true, data: polizas };
        } catch (error) {
            console.error('Error al obtener pólizas por vencer:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener recibos pendientes con alertas
    ipcMain.handle('recibos:pendientesConAlertas', async () => {
        try {
            const recibos = polizaModel.getRecibosPendientesConAlertas();
            return { success: true, data: recibos };
        } catch (error) {
            console.error('Error al obtener recibos pendientes:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // CATÁLOGOS
    // ============================================

    // Obtener aseguradoras
    ipcMain.handle('catalogos:getAseguradoras', async () => {
        try {
            const aseguradoras = dbManager.query('SELECT * FROM Aseguradora WHERE activo = 1 ORDER BY nombre');
            return { success: true, data: aseguradoras };
        } catch (error) {
            console.error('Error al obtener aseguradoras:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener ramos
    ipcMain.handle('catalogos:getRamos', async () => {
        try {
            const ramos = dbManager.query('SELECT * FROM Ramo WHERE activo = 1 ORDER BY nombre');
            return { success: true, data: ramos };
        } catch (error) {
            console.error('Error al obtener ramos:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener periodicidades
    ipcMain.handle('catalogos:getPeriodicidades', async () => {
        try {
            const periodicidades = dbManager.query('SELECT * FROM Periodicidad ORDER BY meses');
            return { success: true, data: periodicidades };
        } catch (error) {
            console.error('Error al obtener periodicidades:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener métodos de pago
    ipcMain.handle('catalogos:getMetodosPago', async () => {
        try {
            const metodos = dbManager.query('SELECT * FROM MetodoPago ORDER BY nombre');
            return { success: true, data: metodos };
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // DASHBOARD / MÉTRICAS
    // ============================================

    // Obtener métricas del dashboard
    ipcMain.handle('dashboard:getMetrics', async () => {
        try {
            const metrics = dbManager.getDashboardMetrics();
            return { success: true, data: metrics };
        } catch (error) {
            console.error('Error al obtener métricas:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener pólizas con alertas
    ipcMain.handle('dashboard:getPolizasConAlertas', async () => {
        try {
            const polizas = dbManager.getPolizasConAlertas();
            return { success: true, data: polizas };
        } catch (error) {
            console.error('Error al obtener pólizas con alertas:', error);
            return { success: false, message: error.message };
        }
    });

    console.log('✅ IPC Handlers registrados correctamente');
}

module.exports = { registerIPCHandlers };
