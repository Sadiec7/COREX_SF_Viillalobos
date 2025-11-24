// models/poliza_model.js
// PolizaModel - Gestión de pólizas conforme al esquema v2.0

class PolizaModel {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Crear una póliza y generar sus recibos asociados.
     * @param {Object} polizaData - Datos de entrada provenientes del frontend.
     * @returns {{poliza_id:number, recibos_generados:number}} payload con la póliza creada.
     */
    create(polizaData) {
        const payload = this._normalizePolizaData(polizaData);

        try {
            // Usar transacción para evitar bloqueo del UI
            this.dbManager.execute('BEGIN TRANSACTION');

            const result = this.dbManager.execute(
                `
                INSERT INTO Poliza (
                    numero_poliza,
                    cliente_id,
                    aseguradora_id,
                    ramo_id,
                    tipo_poliza,
                    prima_neta,
                    prima_total,
                    vigencia_inicio,
                    vigencia_fin,
                    vigencia_renovacion_automatica,
                    periodicidad_id,
                    metodo_pago_id,
                    domiciliada,
                    estado_pago,
                    comision_porcentaje,
                    suma_asegurada,
                    notas
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
                [
                    payload.numero_poliza,
                    payload.cliente_id,
                    payload.aseguradora_id,
                    payload.ramo_id,
                    payload.tipo_poliza,
                    payload.prima_neta,
                    payload.prima_total,
                    payload.vigencia_inicio,
                    payload.vigencia_fin,
                    payload.vigencia_renovacion_automatica,
                    payload.periodicidad_id,
                    payload.metodo_pago_id,
                    payload.domiciliada,
                    payload.estado_pago,
                    payload.comision_porcentaje,
                    payload.suma_asegurada,
                    payload.notas
                ]
            );

            const polizaId = result.lastInsertRowid;
            const recibosGenerados = this._generarRecibos(
                polizaId,
                payload.periodicidad_id,
                payload.vigencia_inicio,
                payload.vigencia_fin,
                payload.prima_total
            );

            // Commit transacción (esto también guarda a disco)
            this.dbManager.execute('COMMIT');

            return {
                poliza_id: polizaId,
                recibos_generados: recibosGenerados
            };
        } catch (error) {
            // Rollback en caso de error
            try {
                this.dbManager.execute('ROLLBACK');
            } catch (rollbackError) {
                console.error('Error en rollback:', rollbackError);
            }

            if (error.message.includes('UNIQUE')) {
                throw new Error(`El número de póliza ${polizaData.numero_poliza} ya existe`);
            }
            throw error;
        }
    }

    /**
     * Normaliza datos recibidos desde la UI al formato requerido por la tabla.
     * @private
     */
    _normalizePolizaData(data) {
        const vigenciaInicio = data.vigencia_inicio || data.fecha_inicio;
        const vigenciaFin = data.vigencia_fin || data.fecha_fin;
        const periodicidadId = data.periodicidad_id || data.periodicidad_pago_id;

        if (!vigenciaInicio || !vigenciaFin) {
            throw new Error('La vigencia de la póliza es obligatoria');
        }

        if (!periodicidadId) {
            throw new Error('La periodicidad de pago es obligatoria');
        }

        if (!data.metodo_pago_id && data.metodo_pago_id !== 0) {
            throw new Error('El método de pago es obligatorio');
        }

        const primaTotal = Number(data.prima_total);
        const primaNeta = data.prima_neta ? Number(data.prima_neta) : primaTotal;

        if (Number.isNaN(primaTotal) || primaTotal <= 0) {
            throw new Error('La prima total debe ser un número mayor que cero');
        }

        if (Number.isNaN(primaNeta) || primaNeta <= 0) {
            throw new Error('La prima neta debe ser un número mayor que cero');
        }

        return {
            numero_poliza: data.numero_poliza?.trim(),
            cliente_id: Number(data.cliente_id),
            aseguradora_id: Number(data.aseguradora_id),
            ramo_id: Number(data.ramo_id),
            tipo_poliza: data.tipo_poliza || 'nuevo',
            prima_neta: primaNeta,
            prima_total: primaTotal,
            vigencia_inicio: vigenciaInicio,
            vigencia_fin: vigenciaFin,
            vigencia_renovacion_automatica: data.vigencia_renovacion_automatica ? 1 : 0,
            periodicidad_id: Number(periodicidadId),
            metodo_pago_id: Number(data.metodo_pago_id),
            domiciliada: data.domiciliada ? 1 : 0,
            estado_pago: data.estado_pago || 'pendiente',
            comision_porcentaje: data.comision_porcentaje ? Number(data.comision_porcentaje) : null,
            suma_asegurada: data.suma_asegurada ? Number(data.suma_asegurada) : null,
            notas: data.notas?.trim() || null
        };
    }

    /**
     * Genera los recibos asociados a la póliza según la periodicidad definida.
     * @private
     */
    _generarRecibos(polizaId, periodicidadId, vigenciaInicio, vigenciaFin, primaTotal) {
        const periodicidad = this.dbManager.queryOne(
            `SELECT meses, dias_anticipacion_alerta FROM Periodicidad WHERE periodicidad_id = ?`,
            [periodicidadId]
        );

        if (!periodicidad) {
            throw new Error('Periodicidad no encontrada');
        }

        const mesesPorRecibo = periodicidad.meses;
        const inicio = this._toUTCDate(vigenciaInicio);
        const fin = this._toUTCDate(vigenciaFin);

        const periodos = this._buildPeriodos(inicio, fin, mesesPorRecibo);
        const montos = this._splitAmount(primaTotal, periodos.length);

        // Validar que los montos sean > 0 antes de insertar
        if (!montos.length || montos.some(m => m <= 0)) {
            throw new Error('Los recibos generados deben tener monto mayor a cero. Revisa prima total y periodicidad.');
        }

        periodos.forEach((periodo, index) => {
            const numeroRecibo = `${polizaId}-${String(index + 1).padStart(2, '0')}`;

            // ✅ CORREGIDO: Calcular fecha de corte ANTES del inicio del periodo
            const diasAnticipacion = periodicidad.dias_anticipacion_alerta || 7;
            const fechaCorte = this._calcularFechaCorte(periodo.inicio, diasAnticipacion);
            const fechaVencimiento = new Date(periodo.inicio.getTime()); // Vence el día que inicia la cobertura

            this.dbManager.execute(
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
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
                [
                    polizaId,
                    numeroRecibo,
                    this._formatDate(periodo.inicio),
                    this._formatDate(periodo.fin),
                    index + 1,
                    montos[index],
                    this._formatDate(fechaCorte),           // ← Vence ANTES del inicio
                    this._formatDate(fechaVencimiento),     // ← Vencimiento = inicio del periodo
                    periodicidad.dias_anticipacion_alerta || 0,
                    'pendiente'
                ]
            );
        });

        return periodos.length;
    }

    _buildPeriodos(inicio, fin, mesesPorRecibo) {
        const periodos = [];
        let periodStart = new Date(inicio.getTime());

        while (periodStart <= fin) {
            const periodEnd = this._calculatePeriodEnd(periodStart, fin, mesesPorRecibo);
            periodos.push({
                inicio: new Date(periodStart.getTime()),
                fin: new Date(periodEnd.getTime())
            });
            periodStart = this._nextPeriodStart(periodEnd);
        }

        return periodos;
    }

    _splitAmount(total, partes) {
        if (!partes || partes <= 0) {
            return [];
        }
        const montoBase = Number((total / partes).toFixed(2));
        const montos = new Array(partes).fill(montoBase);
        let acumulado = Number((montoBase * partes).toFixed(2));

        if (acumulado !== total) {
            const diferencia = Number((total - acumulado).toFixed(2));
            montos[partes - 1] = Number((montos[partes - 1] + diferencia).toFixed(2));
        }

        return montos;
    }

    _calculatePeriodEnd(periodStart, vigenciaFin, mesesPorRecibo) {
        const end = new Date(periodStart.getTime());
        end.setUTCMonth(end.getUTCMonth() + mesesPorRecibo);
        end.setUTCDate(end.getUTCDate() - 1);

        if (end > vigenciaFin) {
            return new Date(vigenciaFin.getTime());
        }
        return end;
    }

    _nextPeriodStart(periodEnd) {
        const next = new Date(periodEnd.getTime());
        next.setUTCDate(next.getUTCDate() + 1);
        return next;
    }

    _toUTCDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    _formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Calcula la fecha de corte (vencimiento) del recibo.
     * En seguros, el pago debe hacerse ANTES del inicio del periodo cubierto.
     * @private
     * @param {Date} fechaInicioPeriodo - Inicio del periodo que cubre el recibo
     * @param {number} diasAnticipacion - Días antes del inicio para que venza
     * @returns {Date}
     */
    _calcularFechaCorte(fechaInicioPeriodo, diasAnticipacion = 7) {
        const fechaCorte = new Date(fechaInicioPeriodo.getTime());
        fechaCorte.setUTCDate(fechaCorte.getUTCDate() - diasAnticipacion);
        return fechaCorte;
    }

    /**
     * Recupera una póliza por ID con joins informativos.
     */
    getById(polizaId) {
        return this.dbManager.queryOne(
            `
            SELECT
                p.*,
                c.nombre AS cliente_nombre,
                c.rfc AS cliente_rfc,
                a.nombre AS aseguradora_nombre,
                r.nombre AS ramo_nombre,
                per.nombre AS periodicidad_nombre,
                mp.nombre AS metodo_pago_nombre
            FROM Poliza p
            LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
            LEFT JOIN Periodicidad per ON p.periodicidad_id = per.periodicidad_id
            LEFT JOIN MetodoPago mp ON p.metodo_pago_id = mp.metodo_pago_id
            WHERE p.poliza_id = ? AND p.activo = 1
        `,
            [polizaId]
        );
    }

    /**
     * Lista pólizas aplicando filtros opcionales.
     */
    getAll(filters = {}) {
        let query = `
            SELECT
                p.*,
                c.nombre AS cliente_nombre,
                a.nombre AS aseguradora_nombre,
                r.nombre AS ramo_nombre,
                per.nombre AS periodicidad_nombre,
                mp.nombre AS metodo_pago_nombre
            FROM Poliza p
            LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            LEFT JOIN Ramo r ON p.ramo_id = r.ramo_id
            LEFT JOIN Periodicidad per ON p.periodicidad_id = per.periodicidad_id
            LEFT JOIN MetodoPago mp ON p.metodo_pago_id = mp.metodo_pago_id
            WHERE p.activo = 1
        `;
        const params = [];

        if (filters.cliente_id) {
            query += ` AND p.cliente_id = ?`;
            params.push(filters.cliente_id);
        }

        if (filters.aseguradora_id) {
            query += ` AND p.aseguradora_id = ?`;
            params.push(filters.aseguradora_id);
        }

        if (filters.ramo_id) {
            query += ` AND p.ramo_id = ?`;
            params.push(filters.ramo_id);
        }

        if (filters.estado_pago) {
            query += ` AND p.estado_pago = ?`;
            params.push(filters.estado_pago);
        }

        query += ` ORDER BY p.fecha_creacion DESC`;

        return this.dbManager.query(query, params);
    }

    /**
     * Recupera recibos asociados a una póliza.
     */
    getRecibos(polizaId) {
        return this.dbManager.query(
            `
            SELECT
                recibo_id,
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
            FROM Recibo
            WHERE poliza_id = ?
            ORDER BY numero_fraccion ASC
        `,
            [polizaId]
        );
    }

    /**
     * Marca un recibo como pagado.
     */
    marcarReciboPagado(reciboId, fechaPago = null) {
        const fecha = fechaPago || new Date().toISOString();
        const result = this.dbManager.execute(
            `
            UPDATE Recibo
            SET estado = 'pagado',
                fecha_pago = ?,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE recibo_id = ?
        `,
            [fecha, reciboId]
        );

        return result.changes > 0;
    }

    /**
     * Pólizas por vencer en los próximos X días.
     */
    getPolizasPorVencer(dias = 30) {
        return this.dbManager.query(
            `
            SELECT
                p.*,
                c.nombre AS cliente_nombre,
                a.nombre AS aseguradora_nombre
            FROM Poliza p
            LEFT JOIN Cliente c ON p.cliente_id = c.cliente_id
            LEFT JOIN Aseguradora a ON p.aseguradora_id = a.aseguradora_id
            WHERE p.activo = 1
            AND DATE(p.vigencia_fin) BETWEEN DATE('now') AND DATE('now', '+' || ? || ' days')
            ORDER BY p.vigencia_fin ASC
        `,
            [dias]
        );
    }

    /**
     * Recibos pendientes con información adicional para alertas.
     */
    getRecibosPendientesConAlertas() {
        return this.dbManager.query(
            `
            SELECT
                r.*,
                p.numero_poliza,
                c.nombre AS cliente_nombre,
                CAST(JULIANDAY(r.fecha_corte) - JULIANDAY('now') AS INTEGER) AS dias_hasta_vencimiento
            FROM Recibo r
            JOIN Poliza p ON r.poliza_id = p.poliza_id
            JOIN Cliente c ON p.cliente_id = c.cliente_id
            WHERE r.estado = 'pendiente'
              AND p.activo = 1
            ORDER BY r.fecha_corte ASC
        `
        );
    }

    /**
     * Actualiza una póliza existente y regenera recibos si es necesario
     * @param {number} polizaId
     * @param {object} polizaData
     * @returns {object} { success, recibos_regenerados, recibos_eliminados, recibos_mantenidos }
     */
    update(polizaId, polizaData) {
        const payload = this._normalizePolizaData(polizaData);

        try {
            // 1. Obtener póliza actual para comparar
            const polizaActual = this.getById(polizaId);

            if (!polizaActual) {
                throw new Error('Póliza no encontrada');
            }

            // 2. Detectar si cambió algo que requiera regenerar recibos
            const cambiosRequierenRegeneracion = this._requiereRegenerarRecibos(
                polizaActual,
                payload
            );

            this.dbManager.execute('BEGIN TRANSACTION');

            // 3. Actualizar póliza
            this.dbManager.execute(
                `UPDATE Poliza SET
                    numero_poliza = ?,
                    cliente_id = ?,
                    aseguradora_id = ?,
                    ramo_id = ?,
                    tipo_poliza = ?,
                    prima_neta = ?,
                    prima_total = ?,
                    vigencia_inicio = ?,
                    vigencia_fin = ?,
                    vigencia_renovacion_automatica = ?,
                    periodicidad_id = ?,
                    metodo_pago_id = ?,
                    domiciliada = ?,
                    estado_pago = ?,
                    comision_porcentaje = ?,
                    suma_asegurada = ?,
                    notas = ?,
                    fecha_modificacion = CURRENT_TIMESTAMP
                WHERE poliza_id = ? AND activo = 1`,
                [
                    payload.numero_poliza,
                    payload.cliente_id,
                    payload.aseguradora_id,
                    payload.ramo_id,
                    payload.tipo_poliza,
                    payload.prima_neta,
                    payload.prima_total,
                    payload.vigencia_inicio,
                    payload.vigencia_fin,
                    payload.vigencia_renovacion_automatica,
                    payload.periodicidad_id,
                    payload.metodo_pago_id,
                    payload.domiciliada,
                    payload.estado_pago,
                    payload.comision_porcentaje,
                    payload.suma_asegurada,
                    payload.notas,
                    polizaId
                ]
            );

            let resultadoRecibos = {
                regenerados: 0,
                eliminados: 0,
                mantenidos: 0
            };

            // 4. Regenerar recibos si es necesario
            if (cambiosRequierenRegeneracion) {
                resultadoRecibos = this._regenerarRecibosPendientes(
                    polizaId,
                    payload.periodicidad_id,
                    payload.vigencia_inicio,
                    payload.vigencia_fin,
                    payload.prima_total
                );
            }

            this.dbManager.execute('COMMIT');

            return {
                success: true,
                poliza_id: polizaId,
                cambios_requirieron_regeneracion: cambiosRequierenRegeneracion,
                ...resultadoRecibos
            };

        } catch (error) {
            try {
                this.dbManager.execute('ROLLBACK');
            } catch (rollbackError) {
                console.error('Error en rollback:', rollbackError);
            }

            if (error.message && error.message.includes('UNIQUE')) {
                throw new Error(`El número de póliza ${polizaData.numero_poliza} ya existe`);
            }
            throw error;
        }
    }

    /**
     * Determina si los cambios a una póliza requieren regenerar recibos.
     * @private
     * @param {Object} polizaActual - Póliza antes de la modificación
     * @param {Object} nuevoDatos - Datos nuevos a aplicar
     * @returns {boolean}
     */
    _requiereRegenerarRecibos(polizaActual, nuevoDatos) {
        // Mapear campos del payload a campos de BD
        const cambiosRelevantes = [
            { payload: 'periodicidad_id', bd: 'periodicidad_id' },
            { payload: 'prima_total', bd: 'prima_total' },
            { payload: 'vigencia_inicio', bd: 'vigencia_inicio' },
            { payload: 'vigencia_fin', bd: 'vigencia_fin' }
        ];

        for (const campo of cambiosRelevantes) {
            const valorActual = polizaActual[campo.bd];
            const valorNuevo = nuevoDatos[campo.payload];

            // Comparar valores normalizados (convertir a string para comparación segura)
            if (String(valorActual) !== String(valorNuevo)) {
                console.log(`🔄 Campo "${campo.bd}" cambió: ${valorActual} → ${valorNuevo}`);
                return true;
            }
        }

        return false;
    }

    /**
     * Obtiene la fecha de finalización del último recibo pagado.
     * @private
     * @param {number} polizaId
     * @returns {string|null} - Fecha en formato YYYY-MM-DD o null si no hay recibos pagados
     */
    _getUltimaFechaPagada(polizaId) {
        const ultimoPagado = this.dbManager.queryOne(
            `
            SELECT fecha_fin_periodo
            FROM Recibo
            WHERE poliza_id = ? AND estado = 'pagado'
            ORDER BY numero_fraccion DESC
            LIMIT 1
        `,
            [polizaId]
        );

        return ultimoPagado ? ultimoPagado.fecha_fin_periodo : null;
    }

    /**
     * Regenera los recibos pendientes/vencidos de una póliza.
     * Preserva recibos pagados y regenera solo los que no se han pagado.
     * @private
     * @param {number} polizaId
     * @param {number} periodicidadId
     * @param {string} vigenciaInicio - YYYY-MM-DD
     * @param {string} vigenciaFin - YYYY-MM-DD
     * @param {number} primaTotal
     * @returns {Object} - { eliminados, regenerados, mantenidos }
     */
    _regenerarRecibosPendientes(polizaId, periodicidadId, vigenciaInicio, vigenciaFin, primaTotal) {
        console.log(`🔄 Regenerando recibos para póliza ${polizaId}...`);

        // 1. Obtener la última fecha pagada
        const ultimaFechaPagada = this._getUltimaFechaPagada(polizaId);

        // 2. Contar recibos pagados (para calcular número inicial)
        const countPagados = this.dbManager.queryOne(
            `SELECT COUNT(*) as total FROM Recibo WHERE poliza_id = ? AND estado = 'pagado'`,
            [polizaId]
        );
        const numeroInicial = countPagados ? countPagados.total + 1 : 1;

        // 3. Contar recibos a eliminar (pendientes/vencidos)
        const countEliminar = this.dbManager.queryOne(
            `SELECT COUNT(*) as total FROM Recibo WHERE poliza_id = ? AND estado IN ('pendiente', 'vencido')`,
            [polizaId]
        );
        const eliminados = countEliminar ? countEliminar.total : 0;

        // 4. Eliminar recibos pendientes/vencidos
        this.dbManager.execute(
            `DELETE FROM Recibo WHERE poliza_id = ? AND estado IN ('pendiente', 'vencido')`,
            [polizaId]
        );

        console.log(`   ✅ Eliminados ${eliminados} recibos pendientes/vencidos`);
        console.log(`   ℹ️  Mantenidos ${numeroInicial - 1} recibos pagados`);

        // 5. Determinar fecha de inicio para nuevos recibos
        let fechaInicioNuevos = vigenciaInicio;
        if (ultimaFechaPagada) {
            // Iniciar después del último recibo pagado
            const fechaPagada = this._toUTCDate(ultimaFechaPagada);
            const siguienteDia = this._nextPeriodStart(fechaPagada);
            fechaInicioNuevos = this._formatDate(siguienteDia);
            console.log(`   ℹ️  Continuando desde: ${fechaInicioNuevos} (después de último pago)`);
        }

        // 6. Generar nuevos recibos desde la fecha de inicio calculada
        const regenerados = this._generarRecibosDesde(
            polizaId,
            periodicidadId,
            fechaInicioNuevos,
            vigenciaFin,
            primaTotal,
            numeroInicial
        );

        console.log(`   ✅ Regenerados ${regenerados} recibos nuevos`);

        return {
            eliminados,
            regenerados,
            mantenidos: numeroInicial - 1
        };
    }

    /**
     * Genera recibos desde una fecha inicial específica con numeración personalizada.
     * @private
     * @param {number} polizaId
     * @param {number} periodicidadId
     * @param {string} vigenciaInicio - YYYY-MM-DD
     * @param {string} vigenciaFin - YYYY-MM-DD
     * @param {number} primaTotal - Prima total ORIGINAL (no ajustada)
     * @param {number} numeroInicial - Número de fracción inicial (default: 1)
     * @returns {number} - Cantidad de recibos generados
     */
    _generarRecibosDesde(polizaId, periodicidadId, vigenciaInicio, vigenciaFin, primaTotal, numeroInicial = 1) {
        const periodicidad = this.dbManager.queryOne(
            `SELECT meses, dias_anticipacion_alerta FROM Periodicidad WHERE periodicidad_id = ?`,
            [periodicidadId]
        );

        if (!periodicidad) {
            throw new Error('Periodicidad no encontrada');
        }

        const mesesPorRecibo = periodicidad.meses;
        const inicio = this._toUTCDate(vigenciaInicio);
        const fin = this._toUTCDate(vigenciaFin);

        const periodos = this._buildPeriodos(inicio, fin, mesesPorRecibo);

        // IMPORTANTE: Dividir la prima total entre TODOS los recibos (pagados + nuevos)
        // Para eso, necesitamos saber cuántos recibos hay en total
        const totalRecibosCompletos = numeroInicial - 1 + periodos.length;

        // Calcular monto por recibo basado en el total completo
        const montos = this._splitAmount(primaTotal, totalRecibosCompletos);

        // Usar solo los montos correspondientes a los nuevos recibos
        const montosNuevos = montos.slice(numeroInicial - 1);

        // Validar que los montos sean > 0 antes de insertar
        if (!montosNuevos.length || montosNuevos.some(m => m <= 0)) {
            throw new Error('Los recibos generados deben tener monto mayor a cero. Revisa prima total y periodicidad.');
        }

        periodos.forEach((periodo, index) => {
            const numeroFraccion = numeroInicial + index;
            const numeroRecibo = `${polizaId}-${String(numeroFraccion).padStart(2, '0')}`;

            // ✅ CORREGIDO: Calcular fecha de corte ANTES del inicio del periodo
            const diasAnticipacion = periodicidad.dias_anticipacion_alerta || 7;
            const fechaCorte = this._calcularFechaCorte(periodo.inicio, diasAnticipacion);
            const fechaVencimiento = new Date(periodo.inicio.getTime()); // Vence el día que inicia la cobertura

            this.dbManager.execute(
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
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
                [
                    polizaId,
                    numeroRecibo,
                    this._formatDate(periodo.inicio),
                    this._formatDate(periodo.fin),
                    numeroFraccion,
                    montosNuevos[index],
                    this._formatDate(fechaCorte),           // ← Vence ANTES del inicio
                    this._formatDate(fechaVencimiento),     // ← Vencimiento = inicio del periodo
                    periodicidad.dias_anticipacion_alerta || 0,
                    'pendiente'
                ]
            );
        });

        return periodos.length;
    }

    /**
     * Soft delete de una póliza.
     */
    delete(polizaId) {
        const result = this.dbManager.execute(
            `
            UPDATE Poliza
            SET activo = 0,
                fecha_eliminacion = CURRENT_TIMESTAMP
            WHERE poliza_id = ?
        `,
            [polizaId]
        );

        return result.changes > 0;
    }

    count() {
        const result = this.dbManager.queryOne(
            `SELECT COUNT(*) AS total FROM Poliza WHERE activo = 1`
        );
        return result ? result.total : 0;
    }
}

module.exports = PolizaModel;
