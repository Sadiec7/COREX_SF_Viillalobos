// ipc-handlers.js
// Handlers IPC para comunicación con el frontend

const { ipcMain, dialog, shell, app } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

let documentsRootCache = null;

function getDocumentsRoot() {
    if (!documentsRootCache) {
        documentsRootCache = path.join(app.getPath('userData'), 'documentos');
    }
    return documentsRootCache;
}

function ensureDocumentsRoot() {
    const root = getDocumentsRoot();
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }
}

function sanitizeSegment(segment) {
    return segment.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}

function sanitizeFilename(name) {
    const parsed = path.parse(name || '');
    const base = sanitizeSegment((parsed.name || 'documento').trim() || 'documento');
    const ext = (parsed.ext || '').replace(/[^.\w-]/g, '');
    return `${base}${ext}`.slice(0, 180);
}

function sanitizePathSegments(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') {
        return [];
    }
    return rawPath
        .replace(/\\/g, '/')
        .split('/')
        .map(segment => segment.trim())
        .filter(segment => segment && segment !== '.' && segment !== '..')
        .map(sanitizeSegment);
}

function buildRelativePath(clienteId, rutaRelativa, nombreArchivo) {
    const segments = sanitizePathSegments(rutaRelativa);
    if (!segments.length && clienteId) {
        segments.push('clientes', String(clienteId));
    }

    if (segments.length) {
        const last = segments[segments.length - 1];
        if (last.includes('.')) {
            segments[segments.length - 1] = sanitizeFilename(last);
        } else {
            segments.push(sanitizeFilename(nombreArchivo));
        }
    } else {
        segments.push(sanitizeFilename(nombreArchivo));
    }

    return segments.join('/');
}

function normalizeRelativePath(relativePath) {
    const segments = sanitizePathSegments(relativePath);
    if (!segments.length) {
        throw new Error('No se pudo determinar la ruta del documento.');
    }
    return segments.join('/');
}

function ensureUniqueRelativePath(relativePath) {
    let candidate = normalizeRelativePath(relativePath);
    const ext = path.extname(candidate);
    const baseName = path.basename(candidate, ext);
    const dir = path.dirname(candidate);
    let counter = 1;

    const root = getDocumentsRoot();

    while (fs.existsSync(path.join(root, candidate))) {
        const suffixed = `${baseName}_${counter}${ext}`;
        candidate = dir && dir !== '.'
            ? path.join(dir, suffixed)
            : suffixed;
        candidate = candidate.replace(/\\/g, '/');
        counter += 1;
    }

    return candidate;
}

function resolveDocumentAbsolutePath(rutaRelativa) {
    if (!rutaRelativa) {
        return null;
    }

    const sanitized = sanitizePathSegments(rutaRelativa).join('/');
    const root = getDocumentsRoot();

    if (sanitized) {
        const candidate = path.join(root, sanitized);
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    if (path.isAbsolute(rutaRelativa) && fs.existsSync(rutaRelativa)) {
        return rutaRelativa;
    }

    const cwdCandidate = path.resolve(process.cwd(), rutaRelativa);
    if (fs.existsSync(cwdCandidate)) {
        return cwdCandidate;
    }

    return null;
}

async function ensureUniqueTarget(baseDir, relativePath) {
    let candidate = normalizeRelativePath(relativePath);
    const ext = path.extname(candidate);
    const baseName = path.basename(candidate, ext);
    const dir = path.dirname(candidate);
    let counter = 1;

    while (fs.existsSync(path.join(baseDir, candidate))) {
        const suffixed = `${baseName}_${counter}${ext}`;
        candidate = dir && dir !== '.'
            ? path.join(dir, suffixed)
            : suffixed;
        candidate = candidate.replace(/\\/g, '/');
        counter += 1;
    }

    return candidate;
}

/**
 * Registrar todos los handlers IPC
 */
function registerIPCHandlers(dbManager, models) {
    const {
        userModel,
        clienteModel,
        polizaModel,
        reciboModel,
        documentoModel,
        catalogosModel,
        auditoriaModel
    } = models;

    ensureDocumentsRoot();

    // ============================================
    // DIÁLOGOS DEL SISTEMA
    // ============================================
    ipcMain.handle('dialog:openFile', async (event, options = {}) => {
        try {
            const dialogOptions = {
                properties: ['openFile'],
                ...options
            };

            if (!dialogOptions.properties) {
                dialogOptions.properties = ['openFile'];
            }

            const result = await dialog.showOpenDialog(dialogOptions);
            return result;
        } catch (error) {
            console.error('Error al abrir diálogo de archivo:', error);
            return { canceled: true, filePaths: [], error: error.message };
        }
    });

    // Abrir archivo con aplicación predeterminada del sistema
    ipcMain.handle('openFile', async (event, filePath) => {
        try {
            if (!filePath || typeof filePath !== 'string') {
                throw new Error('Ruta de archivo inválida');
            }

            const shellResult = await shell.openPath(filePath);
            if (shellResult) {
                // shell.openPath returns empty string on success, error message on failure
                throw new Error(shellResult);
            }

            return { success: true };
        } catch (error) {
            console.error('Error al abrir archivo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('dialog:selectDirectory', async (event, options = {}) => {
        try {
            const dialogOptions = {
                properties: ['openDirectory', 'createDirectory'],
                ...options
            };

            if (!dialogOptions.properties) {
                dialogOptions.properties = ['openDirectory', 'createDirectory'];
            }

            const result = await dialog.showOpenDialog(dialogOptions);
            return result;
        } catch (error) {
            console.error('Error al abrir diálogo de carpeta:', error);
            return { canceled: true, filePaths: [], error: error.message };
        }
    });

    // ============================================
    // USUARIOS
    // ============================================
    ipcMain.handle('user:updateProfile', async (event, payload = {}) => {
        try {
            const { usuario_id, username, email } = payload;
            const updated = await userModel.updateProfile(usuario_id, username, email);
            return { success: true, data: updated };
        } catch (error) {
            console.error('Error al actualizar perfil de usuario:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('user:changePassword', async (event, payload = {}) => {
        try {
            const { usuario_id, currentPassword, newPassword } = payload;
            const changed = await userModel.changePassword(usuario_id, currentPassword, newPassword);
            return { success: changed };
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return { success: false, message: error.message };
        }
    });

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

    // Buscar clientes por nombre o RFC
    ipcMain.handle('clientes:search', async (event, term) => {
        try {
            const clientes = clienteModel.search(term);
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

    // Obtener recibos de una póliza
    ipcMain.handle('polizas:getRecibos', async (event, polizaId) => {
        try {
            const recibos = reciboModel.getByPoliza(polizaId);
            return { success: true, data: recibos };
        } catch (error) {
            console.error('Error al obtener recibos:', error);
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

    // Actualizar póliza
    ipcMain.handle('polizas:update', async (event, polizaId, polizaData) => {
        try {
            const resultado = polizaModel.update(polizaId, polizaData);

            if (resultado.success) {
                console.log('✅ Póliza actualizada:', polizaId);

                // Retornar información completa de la actualización
                return {
                    success: true,
                    cambios_requirieron_regeneracion: resultado.cambios_requirieron_regeneracion || false,
                    mantenidos: resultado.mantenidos || 0,
                    eliminados: resultado.eliminados || 0,
                    regenerados: resultado.regenerados || 0
                };
            }

            return { success: false, message: 'Póliza no encontrada' };
        } catch (error) {
            console.error('Error al actualizar póliza:', error);
            return { success: false, message: error.message };
        }
    });

    // Eliminar póliza (soft delete)
    ipcMain.handle('polizas:delete', async (event, polizaId) => {
        try {
            const deleted = polizaModel.delete(polizaId);
            if (deleted) {
                console.log('✅ Póliza eliminada:', polizaId);
                return { success: true };
            }
            return { success: false, message: 'Póliza no encontrada' };
        } catch (error) {
            console.error('Error al eliminar póliza:', error);
            return { success: false, message: error.message };
        }
    });

    // Marcar recibo como pagado
    ipcMain.handle('recibos:marcarPagado', async (event, reciboId, fechaPago = null) => {
        try {
            const updated = reciboModel.registrarPago(reciboId, fechaPago);
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
    // RECIBOS CRUD
    // ============================================
    ipcMain.handle('recibos:list', async (event, filters = {}) => {
        try {
            const recibos = reciboModel.list(filters);
            return { success: true, data: recibos };
        } catch (error) {
            console.error('Error al listar recibos:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('recibos:getById', async (event, reciboId) => {
        try {
            const recibo = reciboModel.getById(reciboId);
            return { success: true, data: recibo };
        } catch (error) {
            console.error('Error al obtener recibo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('recibos:getByPoliza', async (event, polizaId) => {
        try {
            const recibos = reciboModel.getByPoliza(polizaId);
            return { success: true, data: recibos };
        } catch (error) {
            console.error('Error al obtener recibos de póliza:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('recibos:create', async (event, reciboData) => {
        try {
            const id = reciboModel.crearManual(reciboData);
            return { success: true, data: { recibo_id: id } };
        } catch (error) {
            console.error('Error al crear recibo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('recibos:update', async (event, reciboId, reciboData) => {
        try {
            const updated = reciboModel.actualizar(reciboId, reciboData);
            return { success: updated };
        } catch (error) {
            console.error('Error al actualizar recibo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('recibos:delete', async (event, reciboId) => {
        try {
            const deleted = reciboModel.eliminar(reciboId);
            return { success: deleted };
        } catch (error) {
            console.error('Error al eliminar recibo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('recibos:cambiarEstado', async (event, reciboId, nuevoEstado) => {
        try {
            const updated = reciboModel.cambiarEstado(reciboId, nuevoEstado);
            return { success: updated };
        } catch (error) {
            console.error('Error al cambiar estado del recibo:', error);
            return { success: false, message: error.message };
        }
    });

    // Registrar pago con detalles extendidos
    ipcMain.handle('recibos:registrarPago', async (event, pagoData) => {
        try {
            const { recibo_id, fecha_pago, metodo_pago, referencia, notas, generar_pdf } = pagoData;

            // Registrar el pago con los nuevos campos
            const updated = reciboModel.registrarPago(recibo_id, {
                fecha_pago,
                metodo_pago,
                referencia,
                notas
            });

            if (!updated) {
                throw new Error('No se pudo registrar el pago');
            }

            let pdfPath = null;

            // Si se solicitó generar PDF, hacerlo
            if (generar_pdf) {
                const pdfResult = await reciboModel.generarPDF(recibo_id);
                if (pdfResult.success) {
                    pdfPath = pdfResult.filePath;
                    console.log('✅ PDF generado:', pdfResult.fileName);
                } else {
                    console.warn('⚠️  No se pudo generar PDF:', pdfResult.error);
                }
            }

            console.log('✅ Pago registrado correctamente:', recibo_id);
            return {
                success: true,
                pdfPath
            };
        } catch (error) {
            console.error('Error al registrar pago:', error);
            return { success: false, message: error.message };
        }
    });

    // Generar PDF de comprobante de recibo
    ipcMain.handle('recibos:generarPDF', async (event, reciboId) => {
        try {
            const result = await reciboModel.generarPDF(reciboId);

            if (result.success) {
                console.log('✅ PDF generado correctamente:', result.fileName);
                return {
                    success: true,
                    filePath: result.filePath,
                    fileName: result.fileName
                };
            } else {
                throw new Error(result.error || 'Error al generar PDF');
            }
        } catch (error) {
            console.error('Error al generar PDF:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // CATÁLOGOS
    // ============================================

    // Obtener aseguradoras
    ipcMain.handle('catalogos:getAseguradoras', async () => {
        try {
            const aseguradoras = catalogosModel.listarAseguradoras(true);
            return { success: true, data: aseguradoras };
        } catch (error) {
            console.error('Error al obtener aseguradoras:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener ramos
    ipcMain.handle('catalogos:getRamos', async () => {
        try {
            const ramos = catalogosModel.listarRamos(true);
            return { success: true, data: ramos };
        } catch (error) {
            console.error('Error al obtener ramos:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener periodicidades
    ipcMain.handle('catalogos:getPeriodicidades', async () => {
        try {
            const periodicidades = catalogosModel.listarPeriodicidades();
            return { success: true, data: periodicidades };
        } catch (error) {
            console.error('Error al obtener periodicidades:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener métodos de pago
    ipcMain.handle('catalogos:getMetodosPago', async () => {
        try {
            const metodos = catalogosModel.listarMetodosPago();
            return { success: true, data: metodos };
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:createAseguradora', async (event, nombre) => {
        try {
            const id = catalogosModel.crearAseguradora(nombre);
            return { success: true, data: { aseguradora_id: id } };
        } catch (error) {
            console.error('Error al crear aseguradora:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:updateAseguradora', async (event, payload) => {
        try {
            const { aseguradora_id, nombre, activo } = payload;
            const updated = catalogosModel.actualizarAseguradora(
                aseguradora_id,
                nombre,
                activo
            );
            return { success: updated };
        } catch (error) {
            console.error('Error al actualizar aseguradora:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:createRamo', async (event, nombre, descripcion = null) => {
        try {
            const id = catalogosModel.crearRamo(nombre, descripcion);
            return { success: true, data: { ramo_id: id } };
        } catch (error) {
            console.error('Error al crear ramo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:updateRamo', async (event, payload) => {
        try {
            const { ramo_id, nombre, descripcion, activo } = payload;
            const updated = catalogosModel.actualizarRamo(
                ramo_id,
                nombre,
                descripcion,
                activo
            );
            return { success: updated };
        } catch (error) {
            console.error('Error al actualizar ramo:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:deleteAseguradora', async (event, id) => {
        try {
            const deleted = catalogosModel.eliminarAseguradora(id);
            return { success: deleted };
        } catch (error) {
            console.error('Error al eliminar aseguradora:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:deleteRamo', async (event, id) => {
        try {
            const deleted = catalogosModel.eliminarRamo(id);
            return { success: deleted };
        } catch (error) {
            console.error('Error al eliminar ramo:', error);
            return { success: false, message: error.message };
        }
    });

    // Periodicidades
    ipcMain.handle('catalogos:createPeriodicidad', async (event, nombre, meses) => {
        try {
            const id = catalogosModel.crearPeriodicidad(nombre, meses);
            return { success: true, data: { periodicidad_id: id } };
        } catch (error) {
            console.error('Error al crear periodicidad:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:updatePeriodicidad', async (event, payload) => {
        try {
            const { periodicidad_id, nombre, meses } = payload;
            const updated = catalogosModel.actualizarPeriodicidad(periodicidad_id, nombre, meses);
            return { success: updated };
        } catch (error) {
            console.error('Error al actualizar periodicidad:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:deletePeriodicidad', async (event, id) => {
        try {
            const deleted = catalogosModel.eliminarPeriodicidad(id);
            return { success: deleted };
        } catch (error) {
            console.error('Error al eliminar periodicidad:', error);
            return { success: false, message: error.message };
        }
    });

    // Métodos de Pago
    ipcMain.handle('catalogos:createMetodoPago', async (event, nombre) => {
        try {
            const id = catalogosModel.crearMetodoPago(nombre);
            return { success: true, data: { metodo_pago_id: id } };
        } catch (error) {
            console.error('Error al crear método de pago:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:updateMetodoPago', async (event, payload) => {
        try {
            const { metodo_pago_id, nombre } = payload;
            const updated = catalogosModel.actualizarMetodoPago(metodo_pago_id, nombre);
            return { success: updated };
        } catch (error) {
            console.error('Error al actualizar método de pago:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('catalogos:deleteMetodoPago', async (event, id) => {
        try {
            const deleted = catalogosModel.eliminarMetodoPago(id);
            return { success: deleted };
        } catch (error) {
            console.error('Error al eliminar método de pago:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // DOCUMENTOS
    // ============================================
    ipcMain.handle('documentos:create', async (event, documentoData = {}) => {
        try {
            ensureDocumentsRoot();
            const payload = { ...documentoData };

            if (!payload.nombre_archivo && payload.source_path) {
                payload.nombre_archivo = path.basename(payload.source_path);
            }

            const relativeCandidate = buildRelativePath(
                payload.cliente_id,
                payload.ruta_relativa,
                payload.nombre_archivo
            );

            const relativeSegments = sanitizePathSegments(relativeCandidate);
            if (!relativeSegments.length) {
                throw new Error('La ruta proporcionada para el documento no es válida.');
            }

            const sanitizedFilename = sanitizeFilename(relativeSegments[relativeSegments.length - 1]);
            relativeSegments[relativeSegments.length - 1] = sanitizedFilename;
            let sanitizedRelative = relativeSegments.join('/');

            payload.nombre_archivo = sanitizedFilename;
            payload.ruta_relativa = sanitizedRelative;

            if (payload.source_path) {
                const sourcePath = payload.source_path;
                if (!fs.existsSync(sourcePath)) {
                    throw new Error('El archivo seleccionado no se encontró en el sistema.');
                }

                sanitizedRelative = ensureUniqueRelativePath(sanitizedRelative);
                const absoluteTarget = path.join(getDocumentsRoot(), sanitizedRelative);

                await fsp.mkdir(path.dirname(absoluteTarget), { recursive: true });
                await fsp.copyFile(sourcePath, absoluteTarget);
                payload.ruta_relativa = sanitizedRelative;
                payload.nombre_archivo = sanitizeFilename(path.basename(sanitizedRelative));
            }

            delete payload.source_path;

            const documento = documentoModel.create(payload);
            console.log('✅ Documento registrado:', documento.documento_id);
            return { success: true, data: documento };
        } catch (error) {
            console.error('Error al crear documento:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:getAll', async () => {
        try {
            const documentos = documentoModel.getAll();
            return { success: true, data: documentos };
        } catch (error) {
            console.error('Error al listar todos los documentos:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:getByCliente', async (event, clienteId) => {
        try {
            const documentos = documentoModel.getByCliente(clienteId);
            return { success: true, data: documentos };
        } catch (error) {
            console.error('Error al listar documentos por cliente:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:getByPoliza', async (event, polizaId) => {
        try {
            const documentos = documentoModel.getByPoliza(polizaId);
            return { success: true, data: documentos };
        } catch (error) {
            console.error('Error al listar documentos por póliza:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:delete', async (event, documentoId) => {
        try {
            const deleted = documentoModel.delete(documentoId);
            return { success: deleted };
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:openFile', async (event, payload = {}) => {
        try {
            const { ruta_relativa } = payload;
            const absolutePath = resolveDocumentAbsolutePath(ruta_relativa);
            if (!absolutePath) {
                throw new Error('No se encontró el archivo asociado al documento.');
            }

            const shellResult = await shell.openPath(absolutePath);
            if (shellResult) {
                throw new Error(shellResult);
            }

            return { success: true, path: absolutePath };
        } catch (error) {
            console.error('Error al abrir documento:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:exportCliente', async (event, payload = {}) => {
        try {
            const { cliente_id, destino } = payload;
            if (!cliente_id) {
                throw new Error('No se especificó el cliente a exportar.');
            }
            if (!destino) {
                throw new Error('Selecciona una carpeta de destino.');
            }

            const documentos = documentoModel.getByCliente(cliente_id) || [];
            if (!documentos.length) {
            return { success: false, message: 'El cliente no tiene documentos registrados.' };
        }

            await fsp.mkdir(destino, { recursive: true });
            const resumen = {
                copiados: 0,
                omitidos: []
            };

            for (const documento of documentos) {
                const origenAbsoluto = resolveDocumentAbsolutePath(documento.ruta_relativa);
                if (!origenAbsoluto) {
                    resumen.omitidos.push({
                        documento_id: documento.documento_id,
                        nombre_archivo: documento.nombre_archivo,
                        motivo: 'Archivo no encontrado'
                    });
                    continue;
                }

                const relativeDestino = await ensureUniqueTarget(
                    destino,
                    buildRelativePath(
                        documento.cliente_id,
                        documento.ruta_relativa,
                        documento.nombre_archivo
                    )
                );
                const destinoAbsoluto = path.join(destino, relativeDestino);
                await fsp.mkdir(path.dirname(destinoAbsoluto), { recursive: true });
                await fsp.copyFile(origenAbsoluto, destinoAbsoluto);
                resumen.copiados += 1;
            }

            const message = resumen.omitidos.length
                ? `Documentos exportados: ${resumen.copiados}. Omitidos: ${resumen.omitidos.length}.`
                : 'Todos los documentos se exportaron correctamente.';

            return { success: true, data: resumen, message };
        } catch (error) {
            console.error('Error al exportar documentos del cliente:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('documentos:exportSelected', async (event, payload = {}) => {
        try {
            const { documentos = [], destino } = payload;
            if (!destino) {
                throw new Error('Selecciona una carpeta de destino.');
            }
            if (!Array.isArray(documentos) || !documentos.length) {
                throw new Error('No se proporcionaron documentos para exportar.');
            }

            await fsp.mkdir(destino, { recursive: true });
            const resumen = {
                copiados: 0,
                omitidos: []
            };

            for (const documento of documentos) {
                const origenAbsoluto = resolveDocumentAbsolutePath(documento.ruta_relativa);
                if (!origenAbsoluto) {
                    resumen.omitidos.push({
                        documento_id: documento.documento_id,
                        nombre_archivo: documento.nombre_archivo,
                        motivo: 'Archivo no encontrado'
                    });
                    continue;
                }

                const relativeDestino = await ensureUniqueTarget(
                    destino,
                    buildRelativePath(
                        documento.cliente_id,
                        documento.ruta_relativa,
                        documento.nombre_archivo
                    )
                );
                const destinoAbsoluto = path.join(destino, relativeDestino);
                await fsp.mkdir(path.dirname(destinoAbsoluto), { recursive: true });
                await fsp.copyFile(origenAbsoluto, destinoAbsoluto);
                resumen.copiados += 1;
            }

            const message = resumen.omitidos.length
                ? `Documentos exportados: ${resumen.copiados}. Omitidos: ${resumen.omitidos.length}.`
                : 'Todos los documentos se exportaron correctamente.';

            return { success: true, data: resumen, message };
        } catch (error) {
            console.error('Error al exportar documentos seleccionados:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // AUDITORÍA
    // ============================================
    ipcMain.handle('auditoria:listarPorPoliza', async (event, polizaId, limit = 50) => {
        try {
            const registros = auditoriaModel.listarPorPoliza(polizaId, limit);
            return { success: true, data: registros };
        } catch (error) {
            console.error('Error al obtener auditoría de póliza:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('auditoria:listarRecientes', async (event, limit = 50) => {
        try {
            const registros = auditoriaModel.listarRecientes(limit);
            return { success: true, data: registros };
        } catch (error) {
            console.error('Error al obtener auditoría reciente:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('auditoria:registrar', async (event, auditoriaData) => {
        try {
            const id = auditoriaModel.registrarEntrada(auditoriaData);
            return { success: true, data: { auditoria_id: id } };
        } catch (error) {
            console.error('Error al registrar auditoría:', error);
            return { success: false, message: error.message };
        }
    });

    // ============================================
    // DASHBOARD / MÉTRICAS
    // ============================================

    // Obtener métricas del dashboard
    ipcMain.handle('dashboard:getMetrics', async (event, dateRange = {}) => {
        try {
            const metrics = dbManager.getDashboardMetrics(dateRange);
            return { success: true, data: metrics };
        } catch (error) {
            console.error('Error al obtener métricas:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener pólizas con alertas
    ipcMain.handle('dashboard:getPolizasConAlertas', async (event, dateRange = {}) => {
        try {
            const polizas = dbManager.getPolizasConAlertas(dateRange);
            return { success: true, data: polizas };
        } catch (error) {
            console.error('Error al obtener pólizas con alertas:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener datos para gráfica de tendencia de pólizas (últimos 6 meses)
    ipcMain.handle('dashboard:getPolizasTrend', async () => {
        try {
            const data = dbManager.getPolizasTrend();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener tendencia de pólizas:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener distribución de pólizas por aseguradora
    ipcMain.handle('dashboard:getPolizasByAseguradora', async () => {
        try {
            const data = dbManager.getPolizasByAseguradora();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener pólizas por aseguradora:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener distribución de recibos por estado de cobro
    ipcMain.handle('dashboard:getRecibosByEstado', async () => {
        try {
            const data = dbManager.getRecibosByEstado();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener recibos por estado:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener cobros mensuales (últimos 6 meses)
    ipcMain.handle('dashboard:getCobrosMensuales', async () => {
        try {
            const data = dbManager.getCobrosMensuales();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener cobros mensuales:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener antigüedad de saldos
    ipcMain.handle('dashboard:getAntiguedadSaldos', async () => {
        try {
            const data = dbManager.getAntiguedadSaldos();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener antigüedad de saldos:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener top 5 clientes
    ipcMain.handle('dashboard:getTop5Clientes', async () => {
        try {
            const data = dbManager.getTop5Clientes();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener top 5 clientes:', error);
            return { success: false, message: error.message };
        }
    });

    // Obtener flujo de caja proyectado
    ipcMain.handle('dashboard:getFlujoCajaProyectado', async () => {
        try {
            const data = dbManager.getFlujoCajaProyectado();
            return { success: true, data };
        } catch (error) {
            console.error('Error al obtener flujo de caja proyectado:', error);
            return { success: false, message: error.message };
        }
    });

    console.log('✅ IPC Handlers registrados correctamente');
}

module.exports = { registerIPCHandlers };
