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
                    rm.nombre AS ramo,
                    p.suma_asegurada,
                    p.vigencia_inicio AS poliza_inicio,
                    p.vigencia_fin AS poliza_fin,
                    c.nombre AS cliente_nombre,
                    c.telefono AS cliente_telefono,
                    c.correo AS cliente_email,
                    c.direccion AS cliente_direccion,
                    a.nombre AS aseguradora_nombre
                FROM Recibo r
                JOIN Poliza p ON r.poliza_id = p.poliza_id
                JOIN Cliente c ON p.cliente_id = c.cliente_id
                LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
                LEFT JOIN Ramo rm ON p.ramo_id = rm.ramo_id
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

            // Nombre del archivo
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
            const numeroSanitizado = (recibo.numero_recibo || recibo.recibo_id)
                .toString()
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
            const fileName = `Guia_Pago_${numeroSanitizado}_${timestamp}.pdf`;
            const filePath = path.join(comprobantesDir, fileName);

            // Crear PDF
            const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Colores
            const primaryColor = '#1a5276';
            const accentColor = '#2980b9';
            const lightBg = '#f8f9fa';
            const textGray = '#555555';

            // ============ HEADER ============
            // Barra superior decorativa
            doc.rect(0, 0, 612, 8).fill(primaryColor);

            // Título principal
            doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold');
            doc.text('GUIA DE PAGO', 40, 30, { align: 'center', width: 532 });

            // Subtítulo
            doc.fillColor(textGray).fontSize(10).font('Helvetica');
            doc.text('Referencia de pago para su seguro', 40, 58, { align: 'center', width: 532 });

            // Línea separadora
            doc.moveTo(40, 80).lineTo(572, 80).strokeColor(accentColor).lineWidth(2).stroke();

            // ============ INFORMACIÓN DESTACADA ============
            // Caja de monto a pagar
            const boxY = 95;
            doc.rect(40, boxY, 250, 80).fill(lightBg).stroke(accentColor);

            doc.fillColor(textGray).fontSize(10).font('Helvetica');
            doc.text('MONTO A PAGAR', 50, boxY + 12);
            doc.fillColor(primaryColor).fontSize(28).font('Helvetica-Bold');
            doc.text(this._formatCurrency(recibo.monto), 50, boxY + 30);
            doc.fillColor(textGray).fontSize(9).font('Helvetica');
            const estadoTexto = recibo.estado === 'pagado' ? 'PAGADO' :
                               recibo.estado === 'vencido' ? 'VENCIDO' : 'PENDIENTE';
            const estadoColor = recibo.estado === 'pagado' ? '#27ae60' :
                               recibo.estado === 'vencido' ? '#e74c3c' : '#f39c12';
            doc.fillColor(estadoColor).text(`Estado: ${estadoTexto}`, 50, boxY + 62);

            // Caja de fecha límite
            doc.rect(310, boxY, 250, 80).fill(lightBg).stroke(accentColor);
            doc.fillColor(textGray).fontSize(10).font('Helvetica');
            doc.text('FECHA LIMITE DE PAGO', 320, boxY + 12);
            doc.fillColor(primaryColor).fontSize(18).font('Helvetica-Bold');
            const fechaLimite = recibo.fecha_vencimiento_original || recibo.fecha_corte;
            doc.text(this._formatDate(fechaLimite), 320, boxY + 35);
            if (recibo.dias_gracia > 0) {
                doc.fillColor(textGray).fontSize(9).font('Helvetica');
                doc.text(`+ ${recibo.dias_gracia} días de gracia`, 320, boxY + 62);
            }

            // ============ DATOS DEL RECIBO ============
            let currentY = 195;

            doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold');
            doc.text('DATOS DEL RECIBO', 40, currentY);
            doc.moveTo(40, currentY + 15).lineTo(572, currentY + 15).strokeColor('#dddddd').lineWidth(1).stroke();

            currentY += 25;
            const col1 = 40, col2 = 180, col3 = 320, col4 = 450;

            doc.fillColor(textGray).fontSize(9).font('Helvetica');
            doc.text('No. Recibo:', col1, currentY);
            doc.font('Helvetica-Bold').fillColor('#333333');
            doc.text(recibo.numero_recibo || `#${recibo.recibo_id}`, col2, currentY);

            doc.font('Helvetica').fillColor(textGray);
            doc.text('No. Póliza:', col3, currentY);
            doc.font('Helvetica-Bold').fillColor('#333333');
            doc.text(recibo.numero_poliza, col4, currentY);

            currentY += 18;
            doc.font('Helvetica').fillColor(textGray);
            doc.text('Período:', col1, currentY);
            doc.font('Helvetica-Bold').fillColor('#333333');
            doc.text(`${this._formatDate(recibo.fecha_inicio_periodo)} al ${this._formatDate(recibo.fecha_fin_periodo)}`, col2, currentY);

            doc.font('Helvetica').fillColor(textGray);
            doc.text('Fracción:', col3, currentY);
            doc.font('Helvetica-Bold').fillColor('#333333');
            doc.text(`${recibo.numero_fraccion || 1}`, col4, currentY);

            // ============ DATOS DEL CLIENTE ============
            currentY += 40;
            doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold');
            doc.text('DATOS DEL ASEGURADO', 40, currentY);
            doc.moveTo(40, currentY + 15).lineTo(572, currentY + 15).strokeColor('#dddddd').lineWidth(1).stroke();

            currentY += 25;
            doc.fillColor(textGray).fontSize(9).font('Helvetica');
            doc.text('Nombre:', col1, currentY);
            doc.font('Helvetica-Bold').fillColor('#333333');
            doc.text(recibo.cliente_nombre, col2, currentY);

            if (recibo.cliente_telefono) {
                currentY += 18;
                doc.font('Helvetica').fillColor(textGray);
                doc.text('Teléfono:', col1, currentY);
                doc.font('Helvetica-Bold').fillColor('#333333');
                doc.text(recibo.cliente_telefono, col2, currentY);
            }

            if (recibo.cliente_email) {
                doc.font('Helvetica').fillColor(textGray);
                doc.text('Email:', col3, currentY);
                doc.font('Helvetica-Bold').fillColor('#333333');
                doc.text(recibo.cliente_email, col4, currentY);
            }

            // ============ DATOS DE LA PÓLIZA ============
            currentY += 40;
            doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold');
            doc.text('DATOS DE LA POLIZA', 40, currentY);
            doc.moveTo(40, currentY + 15).lineTo(572, currentY + 15).strokeColor('#dddddd').lineWidth(1).stroke();

            currentY += 25;
            if (recibo.aseguradora_nombre) {
                doc.fillColor(textGray).fontSize(9).font('Helvetica');
                doc.text('Aseguradora:', col1, currentY);
                doc.font('Helvetica-Bold').fillColor('#333333');
                doc.text(recibo.aseguradora_nombre, col2, currentY);
            }

            if (recibo.ramo) {
                doc.font('Helvetica').fillColor(textGray);
                doc.text('Ramo:', col3, currentY);
                doc.font('Helvetica-Bold').fillColor('#333333');
                doc.text(recibo.ramo, col4, currentY);
            }

            if (recibo.suma_asegurada) {
                currentY += 18;
                doc.font('Helvetica').fillColor(textGray);
                doc.text('Suma Asegurada:', col1, currentY);
                doc.font('Helvetica-Bold').fillColor('#333333');
                doc.text(this._formatCurrency(recibo.suma_asegurada), col2, currentY);
            }

            // ============ SI YA ESTÁ PAGADO ============
            if (recibo.estado === 'pagado' && recibo.fecha_pago) {
                currentY += 40;
                doc.rect(40, currentY, 532, 60).fill('#e8f8f5').stroke('#27ae60');

                doc.fillColor('#27ae60').fontSize(12).font('Helvetica-Bold');
                doc.text('PAGO REGISTRADO', 50, currentY + 10);

                currentY += 28;
                doc.fillColor(textGray).fontSize(9).font('Helvetica');
                doc.text('Fecha de pago:', 50, currentY);
                doc.font('Helvetica-Bold').fillColor('#333333');
                doc.text(this._formatDate(recibo.fecha_pago), 140, currentY);

                if (recibo.metodo_pago) {
                    doc.font('Helvetica').fillColor(textGray);
                    doc.text('Método:', 280, currentY);
                    doc.font('Helvetica-Bold').fillColor('#333333');
                    doc.text(recibo.metodo_pago, 330, currentY);
                }

                if (recibo.referencia_pago) {
                    doc.font('Helvetica').fillColor(textGray);
                    doc.text('Ref:', 430, currentY);
                    doc.font('Helvetica-Bold').fillColor('#333333');
                    doc.text(recibo.referencia_pago, 460, currentY);
                }
            }

            // ============ INSTRUCCIONES DE PAGO ============
            currentY = recibo.estado === 'pagado' ? currentY + 80 : currentY + 50;

            doc.rect(40, currentY, 532, 70).fill(lightBg);
            doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold');
            doc.text('INSTRUCCIONES DE PAGO', 50, currentY + 10);

            doc.fillColor(textGray).fontSize(9).font('Helvetica');
            doc.text('Para realizar su pago, comuníquese con su agente de seguros o acuda a nuestras', 50, currentY + 28);
            doc.text('oficinas con este documento. Conserve su comprobante de pago.', 50, currentY + 40);
            doc.text('Para cualquier duda o aclaración, contáctenos.', 50, currentY + 52);

            // ============ FOOTER ============
            // Posicionar footer en la parte inferior de la página
            const footerStartY = 680;

            // Línea separadora
            doc.moveTo(40, footerStartY).lineTo(572, footerStartY).strokeColor('#dddddd').lineWidth(1).stroke();

            // Aviso legal
            doc.fillColor('#999999').fontSize(7).font('Helvetica');
            doc.text(
                'AVISO: Este documento es únicamente una guía de pago y referencia. No constituye un documento fiscal ni comprobante oficial de pago. Para comprobantes oficiales, solicítelos directamente con su aseguradora.',
                40, footerStartY + 8,
                { align: 'center', width: 532 }
            );

            // Fecha de generación
            doc.fillColor('#aaaaaa').fontSize(7);
            doc.text(
                `Generado el ${new Date().toLocaleString('es-MX')} | Sistema de Gestión de Seguros VILLALOBOS`,
                40, footerStartY + 28,
                { align: 'center', width: 532 }
            );

            // Barra inferior decorativa
            doc.rect(0, 784, 612, 8).fill(primaryColor);

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
