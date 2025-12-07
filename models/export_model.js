// models/export_model.js
// ExportModel - Gestión de exportación de datos a Excel

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ExportModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
        this.exportDir = path.join(os.homedir(), 'Documents', 'Exports_VILLALOBOS');
    }

    /**
     * Asegura que el directorio de exportación exista
     */
    _ensureExportDir() {
        if (!fs.existsSync(this.exportDir)) {
            fs.mkdirSync(this.exportDir, { recursive: true });
        }
    }

    /**
     * Genera un nombre de archivo seguro con timestamp
     */
    _generateFileName(prefix) {
        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .split('.')[0];
        return `${prefix}_${timestamp}.xlsx`;
    }

    /**
     * Formatea una fecha para Excel
     */
    _formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('es-MX');
    }

    /**
     * Formatea un número como moneda
     */
    _formatCurrency(amount) {
        if (amount === null || amount === undefined) return '';
        return Number(amount).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /**
     * Exporta clientes a Excel
     * @param {Object} filters - Filtros opcionales
     * @param {boolean} exportAll - Si es true, ignora filtros y exporta todos
     * @returns {Object} - {success, filePath, fileName, count, error}
     */
    exportarClientes(filters = {}, exportAll = false) {
        try {
            this._ensureExportDir();

            // Construir query
            let query = `
                SELECT
                    c.cliente_id,
                    c.rfc,
                    c.nombre,
                    c.tipo_persona,
                    c.telefono,
                    c.celular,
                    c.correo,
                    c.direccion,
                    c.fecha_nacimiento,
                    c.notas,
                    c.activo,
                    c.fecha_creacion,
                    (SELECT COUNT(*) FROM Poliza p WHERE p.cliente_id = c.cliente_id AND p.activo = 1) as total_polizas
                FROM Cliente c
                WHERE c.activo = 1
            `;
            const params = [];

            if (!exportAll) {
                if (filters.search) {
                    query += ` AND (c.nombre LIKE ? OR c.rfc LIKE ? OR c.correo LIKE ?)`;
                    const searchTerm = `%${filters.search}%`;
                    params.push(searchTerm, searchTerm, searchTerm);
                }
                if (filters.tipo_persona && filters.tipo_persona !== 'todos') {
                    query += ` AND c.tipo_persona = ?`;
                    params.push(filters.tipo_persona);
                }
            }

            query += ` ORDER BY c.nombre ASC`;

            const clientes = this.dbManager.query(query, params);

            // Transformar datos para Excel
            const data = clientes.map(c => ({
                'RFC': c.rfc || '',
                'Nombre': c.nombre,
                'Tipo': c.tipo_persona === 'fisica' ? 'Persona Física' : 'Persona Moral',
                'Teléfono': c.telefono || '',
                'Celular': c.celular || '',
                'Email': c.correo || '',
                'Dirección': c.direccion || '',
                'Fecha Nacimiento': this._formatDate(c.fecha_nacimiento),
                'Total Pólizas': c.total_polizas || 0,
                'Notas': c.notas || '',
                'Fecha Registro': this._formatDate(c.fecha_creacion)
            }));

            // Crear workbook
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);

            // Ajustar anchos de columna
            ws['!cols'] = [
                { wch: 15 },  // RFC
                { wch: 35 },  // Nombre
                { wch: 15 },  // Tipo
                { wch: 12 },  // Teléfono
                { wch: 12 },  // Celular
                { wch: 30 },  // Email
                { wch: 40 },  // Dirección
                { wch: 15 },  // Fecha Nac
                { wch: 12 },  // Total Pólizas
                { wch: 30 },  // Notas
                { wch: 15 }   // Fecha Registro
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

            // Guardar archivo
            const fileName = this._generateFileName('Clientes');
            const filePath = path.join(this.exportDir, fileName);
            XLSX.writeFile(wb, filePath);

            return {
                success: true,
                filePath,
                fileName,
                count: data.length
            };
        } catch (error) {
            console.error('Error al exportar clientes:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Exporta pólizas a Excel
     * @param {Object} filters - Filtros opcionales
     * @param {boolean} exportAll - Si es true, ignora filtros y exporta todos
     * @returns {Object} - {success, filePath, fileName, count, error}
     */
    exportarPolizas(filters = {}, exportAll = false) {
        try {
            this._ensureExportDir();

            let query = `
                SELECT
                    p.poliza_id,
                    p.numero_poliza,
                    c.nombre AS cliente_nombre,
                    c.rfc AS cliente_rfc,
                    a.nombre AS aseguradora,
                    r.nombre AS ramo,
                    p.tipo_poliza,
                    p.prima_neta,
                    p.prima_total,
                    p.vigencia_inicio,
                    p.vigencia_fin,
                    p.estado_pago,
                    per.nombre AS periodicidad,
                    mp.nombre AS metodo_pago,
                    p.suma_asegurada,
                    p.comision_porcentaje,
                    p.domiciliada,
                    p.notas,
                    p.fecha_creacion
                FROM Poliza p
                JOIN Cliente c ON p.cliente_id = c.cliente_id
                LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
                LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
                LEFT JOIN Periodicidad per ON p.periodicidad_id = per.periodicidad_id
                LEFT JOIN MetodoPago mp ON p.metodo_pago_id = mp.metodo_pago_id
                WHERE p.activo = 1
            `;
            const params = [];

            if (!exportAll) {
                if (filters.cliente_id) {
                    query += ` AND p.cliente_id = ?`;
                    params.push(Number(filters.cliente_id));
                }
                if (filters.aseguradora_id) {
                    query += ` AND p.aseguradora_id = ?`;
                    params.push(Number(filters.aseguradora_id));
                }
                if (filters.ramo_id) {
                    query += ` AND p.ramo_id = ?`;
                    params.push(Number(filters.ramo_id));
                }
                if (filters.estado_pago && filters.estado_pago !== 'todos') {
                    query += ` AND p.estado_pago = ?`;
                    params.push(filters.estado_pago);
                }
                if (filters.search) {
                    query += ` AND (p.numero_poliza LIKE ? OR c.nombre LIKE ?)`;
                    const searchTerm = `%${filters.search}%`;
                    params.push(searchTerm, searchTerm);
                }
            }

            query += ` ORDER BY p.vigencia_fin DESC, c.nombre ASC`;

            const polizas = this.dbManager.query(query, params);

            const data = polizas.map(p => ({
                'No. Póliza': p.numero_poliza,
                'Cliente': p.cliente_nombre,
                'RFC Cliente': p.cliente_rfc || '',
                'Aseguradora': p.aseguradora || '',
                'Ramo': p.ramo || '',
                'Tipo': p.tipo_poliza || '',
                'Prima Neta': this._formatCurrency(p.prima_neta),
                'Prima Total': this._formatCurrency(p.prima_total),
                'Vigencia Inicio': this._formatDate(p.vigencia_inicio),
                'Vigencia Fin': this._formatDate(p.vigencia_fin),
                'Estado': p.estado_pago === 'al_corriente' ? 'Al Corriente' :
                         p.estado_pago === 'pendiente' ? 'Pendiente' :
                         p.estado_pago === 'vencido' ? 'Vencido' : p.estado_pago,
                'Periodicidad': p.periodicidad || '',
                'Método Pago': p.metodo_pago || '',
                'Suma Asegurada': this._formatCurrency(p.suma_asegurada),
                'Comisión %': p.comision_porcentaje || '',
                'Domiciliada': p.domiciliada ? 'Sí' : 'No',
                'Notas': p.notas || '',
                'Fecha Registro': this._formatDate(p.fecha_creacion)
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);

            ws['!cols'] = [
                { wch: 18 },  // No. Póliza
                { wch: 30 },  // Cliente
                { wch: 15 },  // RFC
                { wch: 20 },  // Aseguradora
                { wch: 15 },  // Ramo
                { wch: 12 },  // Tipo
                { wch: 12 },  // Prima Neta
                { wch: 12 },  // Prima Total
                { wch: 12 },  // Vigencia Inicio
                { wch: 12 },  // Vigencia Fin
                { wch: 12 },  // Estado
                { wch: 12 },  // Periodicidad
                { wch: 15 },  // Método Pago
                { wch: 15 },  // Suma Asegurada
                { wch: 10 },  // Comisión
                { wch: 10 },  // Domiciliada
                { wch: 30 },  // Notas
                { wch: 15 }   // Fecha Registro
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Pólizas');

            const fileName = this._generateFileName('Polizas');
            const filePath = path.join(this.exportDir, fileName);
            XLSX.writeFile(wb, filePath);

            return {
                success: true,
                filePath,
                fileName,
                count: data.length
            };
        } catch (error) {
            console.error('Error al exportar pólizas:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Exporta recibos a Excel
     * @param {Object} filters - Filtros opcionales
     * @param {boolean} exportAll - Si es true, ignora filtros y exporta todos
     * @returns {Object} - {success, filePath, fileName, count, error}
     */
    exportarRecibos(filters = {}, exportAll = false) {
        try {
            this._ensureExportDir();

            let query = `
                SELECT
                    r.recibo_id,
                    r.numero_recibo,
                    p.numero_poliza,
                    c.nombre AS cliente_nombre,
                    c.rfc AS cliente_rfc,
                    a.nombre AS aseguradora,
                    r.fecha_inicio_periodo,
                    r.fecha_fin_periodo,
                    r.numero_fraccion,
                    r.monto,
                    r.fecha_corte,
                    r.fecha_vencimiento_original,
                    r.dias_gracia,
                    r.estado,
                    r.fecha_pago,
                    r.metodo_pago,
                    r.referencia_pago,
                    r.notas
                FROM Recibo r
                JOIN Poliza p ON r.poliza_id = p.poliza_id
                JOIN Cliente c ON p.cliente_id = c.cliente_id
                LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
                WHERE 1=1
            `;
            const params = [];

            if (!exportAll) {
                if (filters.poliza_id) {
                    query += ` AND r.poliza_id = ?`;
                    params.push(Number(filters.poliza_id));
                }
                if (filters.cliente_id) {
                    query += ` AND c.cliente_id = ?`;
                    params.push(Number(filters.cliente_id));
                }
                if (filters.estado && filters.estado !== 'todos') {
                    query += ` AND r.estado = ?`;
                    params.push(filters.estado);
                }
                if (filters.desde) {
                    query += ` AND DATE(r.fecha_corte) >= DATE(?)`;
                    params.push(filters.desde);
                }
                if (filters.hasta) {
                    query += ` AND DATE(r.fecha_corte) <= DATE(?)`;
                    params.push(filters.hasta);
                }
            }

            query += ` ORDER BY r.fecha_corte DESC, r.numero_recibo ASC`;

            const recibos = this.dbManager.query(query, params);

            const data = recibos.map(r => ({
                'No. Recibo': r.numero_recibo,
                'No. Póliza': r.numero_poliza,
                'Cliente': r.cliente_nombre,
                'RFC': r.cliente_rfc || '',
                'Aseguradora': r.aseguradora || '',
                'Período Inicio': this._formatDate(r.fecha_inicio_periodo),
                'Período Fin': this._formatDate(r.fecha_fin_periodo),
                'Fracción': r.numero_fraccion,
                'Monto': this._formatCurrency(r.monto),
                'Fecha Corte': this._formatDate(r.fecha_corte),
                'Fecha Vencimiento': this._formatDate(r.fecha_vencimiento_original),
                'Días Gracia': r.dias_gracia || 0,
                'Estado': r.estado === 'pagado' ? 'Pagado' :
                         r.estado === 'pendiente' ? 'Pendiente' :
                         r.estado === 'vencido' ? 'Vencido' : r.estado,
                'Fecha Pago': this._formatDate(r.fecha_pago),
                'Método Pago': r.metodo_pago || '',
                'Referencia': r.referencia_pago || '',
                'Notas': r.notas || ''
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);

            ws['!cols'] = [
                { wch: 15 },  // No. Recibo
                { wch: 18 },  // No. Póliza
                { wch: 30 },  // Cliente
                { wch: 15 },  // RFC
                { wch: 20 },  // Aseguradora
                { wch: 12 },  // Período Inicio
                { wch: 12 },  // Período Fin
                { wch: 8 },   // Fracción
                { wch: 12 },  // Monto
                { wch: 12 },  // Fecha Corte
                { wch: 14 },  // Fecha Vencimiento
                { wch: 10 },  // Días Gracia
                { wch: 10 },  // Estado
                { wch: 12 },  // Fecha Pago
                { wch: 15 },  // Método Pago
                { wch: 15 },  // Referencia
                { wch: 30 }   // Notas
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Recibos');

            const fileName = this._generateFileName('Recibos');
            const filePath = path.join(this.exportDir, fileName);
            XLSX.writeFile(wb, filePath);

            return {
                success: true,
                filePath,
                fileName,
                count: data.length
            };
        } catch (error) {
            console.error('Error al exportar recibos:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Exporta un reporte consolidado con todas las entidades
     * @returns {Object} - {success, filePath, fileName, error}
     */
    exportarReporteCompleto() {
        try {
            this._ensureExportDir();

            const wb = XLSX.utils.book_new();

            // Hoja de Clientes
            const clientesResult = this.exportarClientes({}, true);
            if (clientesResult.success) {
                const clientesWb = XLSX.readFile(clientesResult.filePath);
                const clientesWs = clientesWb.Sheets['Clientes'];
                XLSX.utils.book_append_sheet(wb, clientesWs, 'Clientes');
                fs.unlinkSync(clientesResult.filePath); // Eliminar archivo temporal
            }

            // Hoja de Pólizas
            const polizasResult = this.exportarPolizas({}, true);
            if (polizasResult.success) {
                const polizasWb = XLSX.readFile(polizasResult.filePath);
                const polizasWs = polizasWb.Sheets['Pólizas'];
                XLSX.utils.book_append_sheet(wb, polizasWs, 'Pólizas');
                fs.unlinkSync(polizasResult.filePath);
            }

            // Hoja de Recibos
            const recibosResult = this.exportarRecibos({}, true);
            if (recibosResult.success) {
                const recibosWb = XLSX.readFile(recibosResult.filePath);
                const recibosWs = recibosWb.Sheets['Recibos'];
                XLSX.utils.book_append_sheet(wb, recibosWs, 'Recibos');
                fs.unlinkSync(recibosResult.filePath);
            }

            const fileName = this._generateFileName('Reporte_Completo');
            const filePath = path.join(this.exportDir, fileName);
            XLSX.writeFile(wb, filePath);

            return {
                success: true,
                filePath,
                fileName,
                counts: {
                    clientes: clientesResult.count || 0,
                    polizas: polizasResult.count || 0,
                    recibos: recibosResult.count || 0
                }
            };
        } catch (error) {
            console.error('Error al exportar reporte completo:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ExportModel;
