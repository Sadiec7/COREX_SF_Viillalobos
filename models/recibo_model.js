// models/recibo_model.js
// ReciboModel - Gestión de recibos conforme a la tabla v2.0

class ReciboModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    getById(reciboId) {
        return this.dbManager.queryOne(
            `
            SELECT *
            FROM Recibo
            WHERE recibo_id = ?
        `,
            [reciboId]
        );
    }

    getByPoliza(polizaId) {
        return this.dbManager.query(
            `
            SELECT *
            FROM Recibo
            WHERE poliza_id = ?
            ORDER BY numero_fraccion ASC
        `,
            [polizaId]
        );
    }

    list(filters = {}) {
        let query = `
            SELECT
                r.recibo_id,
                r.poliza_id,
                r.numero_recibo,
                r.fecha_inicio_periodo,
                r.fecha_fin_periodo,
                r.numero_fraccion,
                r.monto,
                r.fecha_corte,
                r.fecha_vencimiento_original,
                r.dias_gracia,
                r.estado,
                r.fecha_pago,
                p.numero_poliza,
                p.estado_pago,
                c.cliente_id,
                c.nombre AS cliente_nombre,
                a.nombre AS aseguradora_nombre
            FROM Recibo r
            JOIN Poliza p ON r.poliza_id = p.poliza_id
            JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            WHERE 1 = 1
        `;
        const params = [];

        if (filters.poliza_id) {
            query += ' AND r.poliza_id = ?';
            params.push(Number(filters.poliza_id));
        }

        if (filters.cliente_id) {
            query += ' AND c.cliente_id = ?';
            params.push(Number(filters.cliente_id));
        }

        if (filters.estado && filters.estado !== 'todos') {
            query += ' AND r.estado = ?';
            params.push(filters.estado);
        }

        if (filters.desde) {
            query += ' AND DATE(r.fecha_corte) >= DATE(?)';
            params.push(filters.desde);
        }

        if (filters.hasta) {
            query += ' AND DATE(r.fecha_corte) <= DATE(?)';
            params.push(filters.hasta);
        }

        query += ' ORDER BY r.fecha_corte ASC, r.numero_recibo ASC';

        return this.dbManager.query(query, params);
    }

    crearManual(reciboData) {
        const payload = this._normalizeReciboData(reciboData);

        const result = this.dbManager.execute(
            `
            INSERT INTO Recibo (
                poliza_id,
                numero_recibo,
                fecha_inicio_periodo,
                fecha_fin_periodo,
                numero_fraccion,
                monto,
                fecha_corte,
                fecha_vencimiento_original,
                dias_gracia,
                estado,
                fecha_pago
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                payload.poliza_id,
                payload.numero_recibo,
                payload.fecha_inicio_periodo,
                payload.fecha_fin_periodo,
                payload.numero_fraccion,
                payload.monto,
                payload.fecha_corte,
                payload.fecha_vencimiento_original,
                payload.dias_gracia,
                payload.estado,
                payload.fecha_pago
            ]
        );

        return result.lastInsertRowid;
    }

    actualizar(reciboId, reciboData) {
        const payload = this._normalizeReciboData(reciboData, false);

        const result = this.dbManager.execute(
            `
            UPDATE Recibo
            SET numero_recibo = ?,
                fecha_inicio_periodo = ?,
                fecha_fin_periodo = ?,
                numero_fraccion = ?,
                monto = ?,
                fecha_corte = ?,
                fecha_vencimiento_original = ?,
                dias_gracia = ?,
                estado = ?,
                fecha_pago = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE recibo_id = ?
        `,
            [
                payload.numero_recibo,
                payload.fecha_inicio_periodo,
                payload.fecha_fin_periodo,
                payload.numero_fraccion,
                payload.monto,
                payload.fecha_corte,
                payload.fecha_vencimiento_original,
                payload.dias_gracia,
                payload.estado,
                payload.fecha_pago,
                reciboId
            ]
        );

        return result.changes > 0;
    }

    eliminar(reciboId) {
        const result = this.dbManager.execute(
            `DELETE FROM Recibo WHERE recibo_id = ?`,
            [reciboId]
        );
        return result.changes > 0;
    }

    registrarPago(reciboId, pagoData = {}) {
        // Soporte de backward compatibility: si se pasa solo fecha, usarla
        let fecha, metodoPago, referencia, notas;

        if (typeof pagoData === 'string' || pagoData instanceof Date) {
            // Llamada antigua: solo fecha
            fecha = pagoData;
            metodoPago = null;
            referencia = null;
            notas = null;
        } else {
            // Llamada nueva: objeto con todos los campos
            fecha = pagoData.fecha_pago || new Date().toISOString();
            metodoPago = pagoData.metodo_pago || null;
            referencia = pagoData.referencia || null;
            notas = pagoData.notas || null;
        }

        const result = this.dbManager.execute(
            `
            UPDATE Recibo
            SET estado = 'pagado',
                fecha_pago = ?,
                metodo_pago = ?,
                referencia_pago = ?,
                notas = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE recibo_id = ?
        `,
            [fecha, metodoPago, referencia, notas, reciboId]
        );
        return result.changes > 0;
    }

    cambiarEstado(reciboId, estado) {
        if (!['pendiente', 'pagado', 'vencido'].includes(estado)) {
            throw new Error(`Estado de recibo inválido: ${estado}`);
        }

        const result = this.dbManager.execute(
            `
            UPDATE Recibo
            SET estado = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE recibo_id = ?
        `,
            [estado, reciboId]
        );

        return result.changes > 0;
    }

    _normalizeReciboData(data, requirePoliza = true) {
        if (requirePoliza && !data.poliza_id) {
            throw new Error('El recibo debe pertenecer a una póliza');
        }

        const monto = Number(data.monto);
        if (Number.isNaN(monto) || monto <= 0) {
            throw new Error('El monto del recibo debe ser mayor que cero');
        }

        return {
            poliza_id: data.poliza_id ? Number(data.poliza_id) : undefined,
            numero_recibo: data.numero_recibo || this._buildNumeroRecibo(data),
            fecha_inicio_periodo: data.fecha_inicio_periodo,
            fecha_fin_periodo: data.fecha_fin_periodo,
            numero_fraccion: Number(data.numero_fraccion || 1),
            monto,
            fecha_corte: data.fecha_corte || data.fecha_fin_periodo,
            fecha_vencimiento_original: data.fecha_vencimiento_original || data.fecha_corte || data.fecha_fin_periodo,
            dias_gracia: data.dias_gracia ? Number(data.dias_gracia) : 0,
            estado: data.estado || 'pendiente',
            fecha_pago: data.fecha_pago || null
        };
    }

    _buildNumeroRecibo(data) {
        if (!data.poliza_id) {
            return `TMP-${Date.now()}`;
        }
        const fraccion = String(data.numero_fraccion || 1).padStart(2, '0');
        return `${data.poliza_id}-${fraccion}`;
    }

    /**
     * Genera un comprobante PDF para un recibo
     * @param {number} reciboId - ID del recibo
     * @returns {Object} - {success, filePath, fileName, error}
     */
    async generarPDF(reciboId) {
        try {
            const PDFDocument = require('pdfkit');
            const fs = require('fs');
            const path = require('path');
            const os = require('os');

            // Obtener datos completos del recibo con JOIN
            const recibo = this.dbManager.queryOne(
                `
                SELECT
                    r.*,
                    p.numero_poliza,
                    p.ramo,
                    p.suma_asegurada,
                    c.nombre AS cliente_nombre,
                    c.telefono AS cliente_telefono,
                    c.email AS cliente_email,
                    a.nombre AS aseguradora_nombre
                FROM Recibo r
                JOIN Poliza p ON r.poliza_id = p.poliza_id
                JOIN Cliente c ON p.cliente_id = c.cliente_id
                LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
                WHERE r.recibo_id = ?
                `,
                [reciboId]
            );

            if (!recibo) {
                throw new Error('Recibo no encontrado');
            }

            // Crear directorio de comprobantes si no existe
            const comprobantesDir = path.join(os.homedir(), 'Documents', 'Comprobantes_Recibos');
            if (!fs.existsSync(comprobantesDir)) {
                fs.mkdirSync(comprobantesDir, { recursive: true });
            }

            // Nombre del archivo (sanitizar numero_recibo para evitar caracteres inválidos)
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
            const numeroSanitizado = (recibo.numero_recibo || recibo.recibo_id)
                .toString()
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
            const fileName = `Comprobante_${numeroSanitizado}_${timestamp}.pdf`;
            const filePath = path.join(comprobantesDir, fileName);

            // Crear PDF
            const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Header
            doc.fontSize(20).font('Helvetica-Bold').text('COMPROBANTE DE PAGO', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).font('Helvetica').text(`Fecha de emisión: ${new Date().toLocaleDateString('es-MX')}`, { align: 'right' });
            doc.moveDown(2);

            // Información del Recibo
            doc.fontSize(14).font('Helvetica-Bold').text('DATOS DEL RECIBO');
            doc.moveDown(0.5);

            const startY = doc.y;
            doc.fontSize(10).font('Helvetica');
            doc.text(`Número de Recibo: `, 50, startY);
            doc.font('Helvetica-Bold').text(recibo.numero_recibo || `#${recibo.recibo_id}`, 180, startY);

            doc.font('Helvetica').text(`Póliza: `, 50, startY + 15);
            doc.font('Helvetica-Bold').text(recibo.numero_poliza, 180, startY + 15);

            doc.font('Helvetica').text(`Período: `, 50, startY + 30);
            doc.font('Helvetica-Bold').text(
                `${this._formatDate(recibo.fecha_inicio_periodo)} - ${this._formatDate(recibo.fecha_fin_periodo)}`,
                180, startY + 30
            );

            doc.font('Helvetica').text(`Monto: `, 50, startY + 45);
            doc.font('Helvetica-Bold').fontSize(12).text(this._formatCurrency(recibo.monto), 180, startY + 45);

            doc.moveDown(4);

            // Información del Pago
            doc.fontSize(14).font('Helvetica-Bold').text('DATOS DEL PAGO');
            doc.moveDown(0.5);

            const paymentY = doc.y;
            doc.fontSize(10).font('Helvetica');
            doc.text(`Fecha de Pago: `, 50, paymentY);
            doc.font('Helvetica-Bold').text(
                recibo.fecha_pago ? this._formatDate(recibo.fecha_pago) : 'N/A',
                180, paymentY
            );

            doc.font('Helvetica').text(`Método de Pago: `, 50, paymentY + 15);
            doc.font('Helvetica-Bold').text(recibo.metodo_pago || 'N/A', 180, paymentY + 15);

            doc.font('Helvetica').text(`Referencia: `, 50, paymentY + 30);
            doc.font('Helvetica-Bold').text(recibo.referencia_pago || 'N/A', 180, paymentY + 30);

            if (recibo.notas) {
                doc.font('Helvetica').text(`Notas: `, 50, paymentY + 45);
                doc.font('Helvetica').text(recibo.notas, 180, paymentY + 45, { width: 350 });
                doc.moveDown(3);
            } else {
                doc.moveDown(3.5);
            }

            // Información del Cliente
            doc.fontSize(14).font('Helvetica-Bold').text('DATOS DEL CLIENTE');
            doc.moveDown(0.5);

            const clientY = doc.y;
            doc.fontSize(10).font('Helvetica');
            doc.text(`Cliente: `, 50, clientY);
            doc.font('Helvetica-Bold').text(recibo.cliente_nombre, 180, clientY);

            if (recibo.cliente_telefono) {
                doc.font('Helvetica').text(`Teléfono: `, 50, clientY + 15);
                doc.font('Helvetica-Bold').text(recibo.cliente_telefono, 180, clientY + 15);
            }

            if (recibo.cliente_email) {
                doc.font('Helvetica').text(`Email: `, 50, clientY + 30);
                doc.font('Helvetica-Bold').text(recibo.cliente_email, 180, clientY + 30);
            }

            doc.moveDown(3);

            // Información de la Póliza
            doc.fontSize(14).font('Helvetica-Bold').text('DATOS DE LA PÓLIZA');
            doc.moveDown(0.5);

            const polizaY = doc.y;
            doc.fontSize(10).font('Helvetica');
            if (recibo.aseguradora_nombre) {
                doc.text(`Aseguradora: `, 50, polizaY);
                doc.font('Helvetica-Bold').text(recibo.aseguradora_nombre, 180, polizaY);
            }

            if (recibo.ramo) {
                doc.font('Helvetica').text(`Ramo: `, 50, polizaY + 15);
                doc.font('Helvetica-Bold').text(recibo.ramo, 180, polizaY + 15);
            }

            if (recibo.suma_asegurada) {
                doc.font('Helvetica').text(`Suma Asegurada: `, 50, polizaY + 30);
                doc.font('Helvetica-Bold').text(this._formatCurrency(recibo.suma_asegurada), 180, polizaY + 30);
            }

            // Footer
            doc.moveDown(5);
            const footerY = 700;
            doc.fontSize(8).font('Helvetica').fillColor('#666666');
            doc.text(
                'Este comprobante es un documento generado automáticamente por el Sistema de Gestión de Seguros.',
                50, footerY,
                { align: 'center', width: 500 }
            );
            doc.text(
                `Generado el ${new Date().toLocaleString('es-MX')}`,
                50, footerY + 15,
                { align: 'center', width: 500 }
            );

            // Finalizar PDF
            doc.end();

            // Esperar a que se complete la escritura
            await new Promise((resolve, reject) => {
                stream.on('finish', resolve);
                stream.on('error', reject);
            });

            return {
                success: true,
                filePath,
                fileName
            };
        } catch (error) {
            console.error('Error al generar PDF:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    _formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-MX');
    }

    _formatCurrency(amount) {
        return '$' + Number(amount || 0).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

module.exports = ReciboModel;
