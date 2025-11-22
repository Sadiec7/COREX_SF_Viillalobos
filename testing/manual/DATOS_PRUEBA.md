# CATÁLOGO DE DATOS DE PRUEBA
## Sistema de Seguros VILLALOBOS

**Versión del Sistema:** 1.0.0
**Fecha de creación:** Noviembre 2025
**Propósito:** Datos predefinidos para testing manual consistente

---

## ÍNDICE

1. [Instrucciones de Uso](#instrucciones-de-uso)
2. [Datos de Clientes](#datos-de-clientes)
3. [Datos de Catálogos](#datos-de-catálogos)
4. [Datos de Pólizas](#datos-de-pólizas)
5. [Datos de Recibos](#datos-de-recibos)
6. [Datos de Documentos](#datos-de-documentos)
7. [Casos Edge (Casos Extremos)](#casos-edge-casos-extremos)
8. [Datos para Pruebas Negativas](#datos-para-pruebas-negativas)
9. [Archivos de Prueba](#archivos-de-prueba)

---

## INSTRUCCIONES DE USO

### ¿Cómo usar este catálogo?

1. **Para testing inicial:** Usa los datos en el orden presentado
2. **Para casos específicos:** Ve directo a la sección relevante
3. **Para reproducir bugs:** Usa exactamente los mismos datos
4. **Para pruebas negativas:** Usa los datos de la sección correspondiente

### Notas Importantes

- ✅ Todos los datos son ficticios pero realistas
- ✅ Los RFCs siguen el formato oficial mexicano
- ✅ Las fechas están calculadas para el año 2025
- ✅ Los montos reflejan valores reales del mercado
- ⚠️ No uses estos datos en ambiente de producción
- ⚠️ Cada tester debe crear sus propios datos adicionales

### Convenciones

- **[OBLIGATORIO]** - Campo requerido, el sistema no permite vacío
- **[OPCIONAL]** - Campo puede dejarse vacío
- **[AUTO]** - Campo generado automáticamente por el sistema
- **[VALIDADO]** - Campo con validación de formato

---

## DATOS DE CLIENTES

### Cliente 1: Persona Física - Caso Estándar
```
Tipo: Persona Física
Nombre: Juan Pérez García
RFC: PEGJ850101XXX [OBLIGATORIO][VALIDADO]
Teléfono: 5512345678
Email: juan.perez@email.com
Dirección: Av. Reforma 123, Col. Centro, CDMX
Notas: Cliente frecuente, prefiere contacto por email
Estado: Activo

Uso: Testing básico de creación y edición
```

### Cliente 2: Persona Moral - Caso Estándar
```
Tipo: Persona Moral
Nombre: Transportes del Norte S.A. de C.V.
RFC: TDN920515JK3 [OBLIGATORIO][VALIDADO]
Teléfono: 5598765432
Email: contacto@transportesnorte.com.mx
Dirección: Calzada Vallejo 456, Col. Industrial, Monterrey, NL
Notas: Empresa con flota de 20 vehículos
Estado: Activo

Uso: Testing de clientes empresariales
```

### Cliente 3: Nombre Largo
```
Tipo: Persona Física
Nombre: María de los Ángeles Fernández Gutiérrez de la Torre
RFC: FAGT750820MDF [OBLIGATORIO][VALIDADO]
Teléfono: 5544332211
Email: maria.fernandez.torre@gmail.com
Dirección: Prolongación Paseo de la Reforma 1234, Torre B, Piso 15, Col. Santa Fe, Alcaldía Cuajimalpa, Ciudad de México
Notas: Probar campos con nombres y direcciones muy largos para validar límites de UI
Estado: Activo

Uso: Testing de límites de campos y UI responsive
```

### Cliente 4: Datos Mínimos
```
Tipo: Persona Física
Nombre: Carlos López
RFC: LOPC900310XXX [OBLIGATORIO][VALIDADO]
Teléfono: [OPCIONAL - Dejar vacío]
Email: [OPCIONAL - Dejar vacío]
Dirección: [OPCIONAL - Dejar vacío]
Notas: [OPCIONAL - Dejar vacío]
Estado: Activo

Uso: Testing con datos mínimos requeridos
```

### Cliente 5: Caracteres Especiales
```
Tipo: Persona Física
Nombre: José O'Connor Müller
RFC: OOMJ880615ABC [OBLIGATORIO][VALIDADO]
Teléfono: 55-1234-5678
Email: jose.oconnor@müller.com
Dirección: Calle 16 de Septiembre #89-A, Col. Año de Juárez
Notas: Testing de acentos, guiones, símbolos: !@#$%
Estado: Activo

Uso: Testing de caracteres especiales y codificación
```

### Cliente 6: Números en Nombre (Edge Case)
```
Tipo: Persona Moral
Nombre: Grupo 3M México S. de R.L.
RFC: GTM850707XX8 [OBLIGATORIO][VALIDADO]
Teléfono: 5511223344
Email: contacto@grupo3m.mx
Dirección: Boulevard Manuel Ávila Camacho 36, Lomas de Chapultepec
Notas: Nombre incluye números
Estado: Activo

Uso: Testing de validación de nombres con números
```

### Cliente 7: Cliente Inactivo
```
Tipo: Persona Física
Nombre: Roberto Sánchez Martínez
RFC: SAMR700925XXX [OBLIGATORIO][VALIDADO]
Teléfono: 5567891234
Email: roberto.sanchez@hotmail.com
Dirección: Calle Morelos 45, Col. Centro, Guadalajara, Jalisco
Notas: Cliente dio de baja sus pólizas, marcar como inactivo
Estado: Inactivo

Uso: Testing de filtros por estado y validación de pólizas con clientes inactivos
```

### Cliente 8: RFC Genérico (Extranjero)
```
Tipo: Persona Física
Nombre: John Smith Anderson
RFC: SAAJ9001015X0 [OBLIGATORIO][VALIDADO]
Teléfono: 5599887766
Email: john.smith@usa.com
Dirección: Residencial Santa Fe, Torre 1, Depto 501, CDMX
Notas: Cliente extranjero residente en México
Estado: Activo

Uso: Testing con RFC de extranjero
```

### Cliente 9: Email Largo
```
Tipo: Persona Física
Nombre: Laura Martínez González
RFC: MAGL850420XXX [OBLIGATORIO][VALIDADO]
Teléfono: 5544556677
Email: laura.martinez.gonzalez.personal.2025@correolargo.com.mx
Dirección: Av. Universidad 234, Col. Copilco
Notas: Email excepcionalmente largo para testing
Estado: Activo

Uso: Testing de validación de email largo
```

### Cliente 10: Múltiples Pólizas
```
Tipo: Persona Moral
Nombre: Constructora Moderna S.A.
RFC: CMS9205153A1 [OBLIGATORIO][VALIDADO]
Teléfono: 5533445566
Email: administracion@constructoramoderna.mx
Dirección: Periférico Sur 4321, Col. Jardines del Pedregal
Notas: Cliente con múltiples tipos de pólizas (autos, vida, gastos médicos)
Estado: Activo

Uso: Testing de cliente con múltiples pólizas relacionadas
```

---

## DATOS DE CATÁLOGOS

### Aseguradoras (10 registros)

```
1. AXA Seguros México
2. Seguros Monterrey New York Life
3. GNP Seguros
4. Qualitas Compañía de Seguros
5. MAPFRE México
6. Seguros Banorte
7. Metlife México
8. HDI Seguros
9. Zurich Seguros México
10. Inbursa Seguros
```

**Uso:** Crear estas aseguradoras antes de comenzar testing de pólizas

### Ramos (12 registros)

```
1. Autos
2. Vida
3. Gastos Médicos Mayores
4. Daños
5. Responsabilidad Civil
6. Transporte
7. Incendio
8. Hogar
9. Equipo Electrónico
10. Agrícola
11. Marítimo
12. Aviación
```

**Uso:** Crear estos ramos antes de comenzar testing de pólizas

### Periodicidades (Sistema predefinido)

```
- Mensual
- Bimestral
- Trimestral
- Semestral
- Anual
```

**Nota:** Estos valores deben estar hardcoded en el sistema

---

## DATOS DE PÓLIZAS

### Póliza 1: Anual - Mensual - Caso Estándar
```
Número Póliza: POL-2025-001 [AUTO]
Cliente: Juan Pérez García (PEGJ850101XXX)
Aseguradora: AXA Seguros México
Ramo: Autos
Periodicidad: Mensual
Prima Neta: $12,000.00
Prima Total: $13,920.00
Fecha Inicio: 01/01/2025
Fecha Fin: 31/12/2025
Notas: Póliza de auto modelo 2024, cobertura amplia

Recibos generados: 12 (uno por mes)
Monto por recibo: $1,000.00 prima neta

Uso: Testing básico de póliza anual con pagos mensuales
```

### Póliza 2: Semestral - Bimestral
```
Número Póliza: POL-2025-002 [AUTO]
Cliente: Transportes del Norte S.A. de C.V. (TDN920515JK3)
Aseguradora: Qualitas Compañía de Seguros
Ramo: Transporte
Periodicidad: Bimestral
Prima Neta: $18,000.00
Prima Total: $20,880.00
Fecha Inicio: 01/03/2025
Fecha Fin: 31/08/2025
Notas: Póliza de flotilla de transporte, 10 unidades

Recibos generados: 3 (uno cada 2 meses)
Monto por recibo: $6,000.00 prima neta

Uso: Testing de póliza semestral con pagos bimestrales
```

### Póliza 3: Anual - Trimestral
```
Número Póliza: POL-2025-003 [AUTO]
Cliente: María de los Ángeles Fernández Gutiérrez de la Torre (FAGT750820MDF)
Aseguradora: GNP Seguros
Ramo: Vida
Periodicidad: Trimestral
Prima Neta: $24,000.00
Prima Total: $27,840.00
Fecha Inicio: 01/01/2025
Fecha Fin: 31/12/2025
Notas: Seguro de vida con cobertura de $2,000,000

Recibos generados: 4 (uno cada 3 meses)
Monto por recibo: $6,000.00 prima neta

Uso: Testing de póliza con pagos trimestrales
```

### Póliza 4: Anual - Semestral
```
Número Póliza: POL-2025-004 [AUTO]
Cliente: Carlos López (LOPC900310XXX)
Aseguradora: MAPFRE México
Ramo: Gastos Médicos Mayores
Periodicidad: Semestral
Prima Neta: $30,000.00
Prima Total: $34,800.00
Fecha Inicio: 01/02/2025
Fecha Fin: 31/01/2026
Notas: Gastos médicos mayores individual

Recibos generados: 2 (uno cada 6 meses)
Monto por recibo: $15,000.00 prima neta

Uso: Testing de pagos semestrales
```

### Póliza 5: Anual - Pago Anual
```
Número Póliza: POL-2025-005 [AUTO]
Cliente: José O'Connor Müller (OOMJ880615ABC)
Aseguradora: Seguros Monterrey New York Life
Ramo: Hogar
Periodicidad: Anual
Prima Neta: $8,500.00
Prima Total: $9,860.00
Fecha Inicio: 15/03/2025
Fecha Fin: 14/03/2026
Notas: Seguro de hogar, incluye contenidos

Recibos generados: 1 (pago único anual)
Monto por recibo: $8,500.00 prima neta

Uso: Testing de póliza con pago anual único
```

### Póliza 6: Vigente (Estado)
```
Número Póliza: POL-2025-006 [AUTO]
Cliente: Grupo 3M México S. de R.L. (GTM850707XX8)
Aseguradora: HDI Seguros
Ramo: Daños
Periodicidad: Mensual
Prima Neta: $15,000.00
Prima Total: $17,400.00
Fecha Inicio: 01/11/2025
Fecha Fin: 31/10/2026
Notas: Póliza actualmente vigente

Estado esperado: VIGENTE
Cálculo: Fecha actual está entre inicio y fin

Uso: Testing de cálculo de estado "Vigente"
```

### Póliza 7: Por Vencer (Estado)
```
Número Póliza: POL-2025-007 [AUTO]
Cliente: Roberto Sánchez Martínez (SAMR700925XXX)
Aseguradora: Zurich Seguros México
Ramo: Autos
Periodicidad: Anual
Prima Neta: $10,000.00
Prima Total: $11,600.00
Fecha Inicio: 01/01/2025
Fecha Fin: 15/11/2025
Notas: Póliza próxima a vencer (vence en 10 días desde hoy: 05/11/2025)

Estado esperado: POR VENCER
Cálculo: Faltan menos de 30 días para vencimiento

Uso: Testing de cálculo de estado "Por Vencer"
```

### Póliza 8: Vencida (Estado)
```
Número Póliza: POL-2025-008 [AUTO]
Cliente: John Smith Anderson (SAAJ9001015X0)
Aseguradora: Metlife México
Ramo: Vida
Periodicidad: Mensual
Prima Neta: $6,000.00
Prima Total: $6,960.00
Fecha Inicio: 01/01/2025
Fecha Fin: 31/10/2025
Notas: Póliza vencida (venció hace 5 días desde hoy: 05/11/2025)

Estado esperado: VENCIDA
Cálculo: Fecha fin ya pasó

Uso: Testing de cálculo de estado "Vencida"
```

### Póliza 9: Monto con Decimales No Divisibles
```
Número Póliza: POL-2025-009 [AUTO]
Cliente: Laura Martínez González (MAGL850420XXX)
Aseguradora: Seguros Banorte
Ramo: Gastos Médicos Mayores
Periodicidad: Mensual
Prima Neta: $12,345.67
Prima Total: $14,320.98
Fecha Inicio: 01/01/2025
Fecha Fin: 31/12/2025
Notas: Testing de división con decimales

Recibos generados: 12
Cálculo esperado:
- Recibos 1-11: $1,028.81 cada uno
- Recibo 12: $1,028.76 (ajuste de centavos)
- Total: $12,345.67

Uso: Testing de cálculo correcto con decimales
```

### Póliza 10: Prima Neta = Prima Total (Sin Recargos)
```
Número Póliza: POL-2025-010 [AUTO]
Cliente: Constructora Moderna S.A. (CMS9205153A1)
Aseguradora: Inbursa Seguros
Ramo: Responsabilidad Civil
Periodicidad: Anual
Prima Neta: $50,000.00
Prima Total: $50,000.00
Fecha Inicio: 01/04/2025
Fecha Fin: 31/03/2026
Notas: Caso especial sin recargos

Recibos generados: 1
Monto por recibo: $50,000.00

Uso: Testing de póliza sin recargos
```

### Póliza 11: Fechas Invertidas (Caso Negativo)
```
Cliente: Juan Pérez García
Fecha Inicio: 31/12/2025
Fecha Fin: 01/01/2025

Resultado esperado: Error de validación
Mensaje: "La fecha de fin debe ser posterior a la fecha de inicio"

Uso: Testing de validación de fechas
```

### Póliza 12: Montos Negativos (Caso Negativo)
```
Cliente: María de los Ángeles Fernández
Prima Neta: -10,000.00

Resultado esperado: Error de validación
Mensaje: "La prima neta debe ser un valor positivo"

Uso: Testing de validación de montos
```

### Póliza 13: Cliente Inexistente (Caso Negativo)
```
Cliente: [Seleccionar opción vacía o inexistente]
Aseguradora: AXA Seguros
Fecha Inicio: 01/01/2025

Resultado esperado: Error de validación
Mensaje: "Debe seleccionar un cliente"

Uso: Testing de validación de relaciones
```

### Póliza 14: Rango de Fechas Muy Corto
```
Número Póliza: POL-2025-014 [AUTO]
Cliente: Carlos López
Aseguradora: AXA Seguros
Ramo: Autos
Periodicidad: Mensual
Prima Neta: $12,000.00
Fecha Inicio: 01/11/2025
Fecha Fin: 15/11/2025
Notas: Solo 15 días de cobertura

Recibos generados: 1 (no cubre un mes completo)

Uso: Testing de edge case con fechas muy cercanas
```

### Póliza 15: Múltiples Pólizas Mismo Cliente
```
Cliente: Constructora Moderna S.A. (CMS9205153A1)

Póliza A:
- Ramo: Autos
- Prima Neta: $20,000.00
- Periodicidad: Mensual

Póliza B:
- Ramo: Vida
- Prima Neta: $15,000.00
- Periodicidad: Trimestral

Póliza C:
- Ramo: Gastos Médicos Mayores
- Prima Neta: $30,000.00
- Periodicidad: Semestral

Uso: Testing de relaciones 1:N (un cliente, múltiples pólizas)
```

---

## DATOS DE RECIBOS

### Recibo 1: Pendiente de Pago
```
Número Recibo: REC-001-2025-01 [AUTO]
Póliza: POL-2025-001
Cliente: Juan Pérez García
Prima Neta: $1,000.00
Prima Total: $1,160.00
Fecha Emisión: 01/01/2025
Fecha Vencimiento: 31/01/2025
Estado: Pendiente
Notas: Primer recibo de póliza mensual

Uso: Testing de recibo en estado pendiente
```

### Recibo 2: Pagado
```
Número Recibo: REC-001-2025-02 [AUTO]
Póliza: POL-2025-001
Cliente: Juan Pérez García
Prima Neta: $1,000.00
Prima Total: $1,160.00
Fecha Emisión: 01/02/2025
Fecha Vencimiento: 28/02/2025
Fecha Pago: 15/02/2025
Estado: Pagado
Notas: Pagado a tiempo

Uso: Testing de cambio de estado a pagado
```

### Recibo 3: Vencido
```
Número Recibo: REC-008-2025-10 [AUTO]
Póliza: POL-2025-008 (Póliza vencida)
Cliente: John Smith Anderson
Prima Neta: $500.00
Prima Total: $580.00
Fecha Emisión: 01/10/2025
Fecha Vencimiento: 31/10/2025
Estado: Vencido
Notas: Recibo no pagado, fecha de vencimiento ya pasó

Uso: Testing de recibos vencidos
```

### Recibo 4: Cancelado
```
Número Recibo: REC-002-2025-03 [AUTO]
Póliza: POL-2025-002
Cliente: Transportes del Norte S.A.
Prima Neta: $6,000.00
Prima Total: $6,960.00
Fecha Emisión: 01/03/2025
Fecha Vencimiento: 30/04/2025
Estado: Cancelado
Notas: Recibo cancelado por cambio en póliza

Uso: Testing de cancelación de recibos
```

### Recibo 5: Último Recibo de Serie
```
Número Recibo: REC-001-2025-12 [AUTO]
Póliza: POL-2025-001
Cliente: Juan Pérez García
Prima Neta: $1,000.00
Prima Total: $1,160.00
Fecha Emisión: 01/12/2025
Fecha Vencimiento: 31/12/2025
Estado: Pendiente
Notas: Último recibo del año

Uso: Testing de último recibo en secuencia
```

### Recibo 6: Ajuste de Centavos (Edge Case)
```
Número Recibo: REC-009-2025-12 [AUTO]
Póliza: POL-2025-009 (Prima no divisible exacta)
Cliente: Laura Martínez González
Prima Neta: $1,028.76 (ajustado)
Prima Total: $1,193.36
Fecha Emisión: 01/12/2025
Fecha Vencimiento: 31/12/2025
Estado: Pendiente
Notas: Recibo con ajuste de centavos del residuo de división

Uso: Testing de ajuste de centavos en último recibo
```

### Recibo 7: Pago Anual Único
```
Número Recibo: REC-005-2025-01 [AUTO]
Póliza: POL-2025-005 (Periodicidad anual)
Cliente: José O'Connor Müller
Prima Neta: $8,500.00
Prima Total: $9,860.00
Fecha Emisión: 15/03/2025
Fecha Vencimiento: 14/04/2025
Estado: Pendiente
Notas: Pago único por todo el año

Uso: Testing de recibo único anual
```

### Recibo 8: Fecha de Pago Futura (Caso Negativo)
```
Número Recibo: REC-001-2025-03
Estado: Pendiente
Fecha Pago a ingresar: 01/12/2025 (fecha futura)

Resultado esperado: Error de validación
Mensaje: "La fecha de pago no puede ser futura"

Uso: Testing de validación de fechas de pago
```

### Recibo 9: Cambio de Estado sin Fecha de Pago (Caso Negativo)
```
Número Recibo: REC-001-2025-04
Estado actual: Pendiente
Cambiar estado a: Pagado
Fecha Pago: [vacío]

Resultado esperado: Error de validación
Mensaje: "Debe ingresar fecha de pago al marcar como pagado"

Uso: Testing de validación de campos requeridos por estado
```

### Recibo 10: Serie Completa Mensual (12 recibos)
```
Póliza: POL-2025-001
Periodicidad: Mensual
Prima Neta Total: $12,000.00

Recibos esperados:
REC-001-2025-01: Ene, vence 31/01, $1,000.00
REC-001-2025-02: Feb, vence 28/02, $1,000.00
REC-001-2025-03: Mar, vence 31/03, $1,000.00
REC-001-2025-04: Abr, vence 30/04, $1,000.00
REC-001-2025-05: May, vence 31/05, $1,000.00
REC-001-2025-06: Jun, vence 30/06, $1,000.00
REC-001-2025-07: Jul, vence 31/07, $1,000.00
REC-001-2025-08: Ago, vence 31/08, $1,000.00
REC-001-2025-09: Sep, vence 30/09, $1,000.00
REC-001-2025-10: Oct, vence 31/10, $1,000.00
REC-001-2025-11: Nov, vence 30/11, $1,000.00
REC-001-2025-12: Dic, vence 31/12, $1,000.00

Uso: Testing de generación completa de recibos mensuales
```

---

## DATOS DE DOCUMENTOS

### Documento 1: PDF - Identificación Oficial
```
Nombre: INE_Juan_Perez.pdf
Cliente: Juan Pérez García (PEGJ850101XXX)
Tipo: Identificación Oficial
Tamaño: ~2 MB
Formato: PDF
Notas: Credencial INE por ambos lados

Uso: Testing de carga de PDF estándar
```

### Documento 2: Imagen JPG - Comprobante de Domicilio
```
Nombre: Comprobante_CFE_Transportes_Norte.jpg
Cliente: Transportes del Norte S.A. de C.V.
Tipo: Comprobante de Domicilio
Tamaño: ~1.5 MB
Formato: JPG
Notas: Recibo CFE reciente

Uso: Testing de carga de imagen JPG
```

### Documento 3: Imagen PNG - Póliza Escaneada
```
Nombre: Poliza_AXA_001.png
Cliente: Juan Pérez García
Tipo: Póliza
Tamaño: ~3 MB
Formato: PNG
Notas: Póliza original escaneada

Uso: Testing de carga de imagen PNG
```

### Documento 4: Word DOC - Contrato
```
Nombre: Contrato_Servicios.doc
Cliente: Constructora Moderna S.A.
Tipo: Contrato
Tamaño: ~500 KB
Formato: DOC
Notas: Contrato de servicios de corretaje

Uso: Testing de carga de documento Word
```

### Documento 5: Excel XLSX - Cálculos de Prima
```
Nombre: Calculos_Prima_2025.xlsx
Cliente: Transportes del Norte S.A. de C.V.
Tipo: Cálculos
Tamaño: ~200 KB
Formato: XLSX
Notas: Desglose de cálculos de prima

Uso: Testing de carga de documento Excel
```

### Documento 6: Archivo Muy Pesado (Edge Case)
```
Nombre: Documento_Grande.pdf
Tamaño: 15 MB

Resultado esperado:
- Si límite es 10 MB: Error "El archivo excede el tamaño máximo permitido"
- Si límite es 20 MB: Debe cargar correctamente pero lento

Uso: Testing de límite de tamaño de archivo
```

### Documento 7: Formato No Permitido (Caso Negativo)
```
Nombre: archivo.exe
Tipo: Ejecutable
Tamaño: 1 MB

Resultado esperado: Error de validación
Mensaje: "Formato de archivo no permitido. Use: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX"

Uso: Testing de validación de formato
```

### Documento 8: Archivo Vacío (Caso Negativo)
```
Nombre: documento_vacio.pdf
Tamaño: 0 KB

Resultado esperado: Error de validación
Mensaje: "El archivo está vacío o corrupto"

Uso: Testing de validación de integridad
```

### Documento 9: Nombre con Caracteres Especiales
```
Nombre: Póliza #1 - Juan Pérez (2025) v2.0.pdf
Cliente: Juan Pérez García
Tipo: Póliza

Uso: Testing de sanitización de nombres de archivo
```

### Documento 10: Múltiples Documentos Mismo Cliente
```
Cliente: María de los Ángeles Fernández

Documentos:
1. INE_Maria_Fernandez.pdf
2. Comprobante_Domicilio_Maria.jpg
3. Poliza_Vida_GNP.pdf
4. Recibo_Pago_Enero.pdf
5. Acta_Nacimiento.pdf

Uso: Testing de múltiples documentos por cliente
```

---

## CASOS EDGE (CASOS EXTREMOS)

### Edge Case 1: RFC con Homoclave Especial
```
RFC: XAXX010101000
Descripción: RFC genérico nacional
Uso: Testing de RFC genérico

RFC: XEXX010101000
Descripción: RFC genérico extranjero
Uso: Testing de RFC genérico extranjero
```

### Edge Case 2: Fechas en Límites de Año
```
Fecha Inicio: 31/12/2025
Fecha Fin: 31/12/2026
Periodicidad: Mensual

Cálculo esperado:
- Primer recibo: 31/12/2025 - 30/01/2026
- Validar manejo de año bisiesto y cambio de año

Uso: Testing de cálculos en cambio de año
```

### Edge Case 3: Año Bisiesto 2024
```
Fecha Inicio: 01/01/2024
Fecha Fin: 31/12/2024
Periodicidad: Mensual

Recibo de Febrero:
- Fecha vencimiento: 29/02/2024 (año bisiesto)
- Validar que considera 29 días, no 28

Uso: Testing de año bisiesto
```

### Edge Case 4: Cliente con 100 Pólizas
```
Cliente: Constructora Moderna S.A.
Pólizas: 100 registros

Objetivo: Testing de rendimiento con volumen alto
Validar:
- Tiempo de carga en lista de pólizas
- Filtros y búsquedas
- Paginación
```

### Edge Case 5: Póliza con 1000 Recibos (Hipotético)
```
NO CREAR EN AMBIENTE DE TESTING NORMAL
Solo para testing de stress si se requiere

Periodicidad: Mensual
Duración: 83.3 años
Objetivo: Testing de límites del sistema
```

### Edge Case 6: Nombre de 1 Carácter
```
Tipo: Persona Física
Nombre: X
RFC: XXXX850101XXX

Resultado esperado: Debe aceptarse si RFC es válido
Uso: Testing de validación de longitud mínima
```

### Edge Case 7: Nombre de 255 Caracteres (Máximo)
```
Nombre: [String de exactamente 255 caracteres]
"María de los Ángeles Guadalupe Fernández González Martínez López Pérez Rodríguez Sánchez Ramírez Torres Flores Gómez Díaz Cruz Hernández Jiménez Morales Reyes García Ruiz Ortiz Mendoza Silva Castro Vargas Romero Álvarez Núñez Domínguez Rivera Muñoz..."

Uso: Testing de límite máximo de caracteres
```

### Edge Case 8: Email en Formato No Común Pero Válido
```
Email: test+filtro@subdomain.example.co.uk
Email: usuario_123-test@email-server.com
Email: "espacios permitidos"@example.com (RFC válido)

Uso: Testing de validación de email con formatos edge
```

### Edge Case 9: Teléfono con Extensión
```
Teléfono: 5512345678 ext. 123
Teléfono: 01 (55) 1234-5678
Teléfono: +52 55 1234 5678

Uso: Testing de formatos de teléfono variados
```

### Edge Case 10: Montos Extremos
```
Prima Neta: $0.01 (un centavo)
Prima Neta: $9,999,999.99 (casi 10 millones)

Uso: Testing de límites numéricos
```

### Edge Case 11: Fecha Inicio = Fecha Fin
```
Fecha Inicio: 01/01/2025
Fecha Fin: 01/01/2025
Periodicidad: Anual

Resultado esperado:
- Opción 1: Aceptar (cobertura de 1 día)
- Opción 2: Rechazar (validación de rango mínimo)

Uso: Testing de regla de negocio sobre duración mínima
```

### Edge Case 12: Cliente sin Pólizas
```
Cliente: Roberto Sánchez Martínez (Inactivo)
Pólizas: 0

Validaciones:
- Debe poder consultarse
- Dashboard debe mostrar 0 pólizas
- Permitir eliminación si no tiene registros relacionados

Uso: Testing de cliente sin relaciones
```

### Edge Case 13: Póliza sin Recibos (Anulada Antes de Generarlos)
```
Póliza creada pero eliminada antes de guardar
O póliza con error en generación de recibos

Validaciones:
- Sistema debe manejar pólizas sin recibos
- Dashboard debe mostrar correctamente

Uso: Testing de integridad referencial
```

### Edge Case 14: Búsqueda con Caracteres Especiales SQL
```
Búsqueda: O'Connor
Búsqueda: 50% descuento
Búsqueda: Cliente--comentario

Resultado esperado: No causar error SQL injection
Uso: Testing de seguridad de búsquedas
```

### Edge Case 15: Múltiples Sesiones del Mismo Usuario
```
Usuario: admin
Sesiones: 2 ventanas abiertas simultáneamente

Validaciones:
- Cambios en ventana 1 deben reflejarse en ventana 2 al refrescar
- No debe causar conflictos de datos

Uso: Testing de concurrencia básica
```

---

## DATOS PARA PRUEBAS NEGATIVAS

### Prueba Negativa 1: RFC Inválido
```
RFC con formato incorrecto:
- "ABC123" (muy corto)
- "PEGJ850101" (sin homoclave)
- "PEGJ85010XXXX" (muy largo)
- "PEGJ850132XXX" (día 32 inválido)
- "PEGJ851301XXX" (mes 13 inválido)

Resultado esperado: Error "RFC inválido"
```

### Prueba Negativa 2: Email Inválido
```
Emails mal formados:
- "usuario@" (falta dominio)
- "@dominio.com" (falta usuario)
- "usuario@dominio" (falta TLD)
- "usuario dominio.com" (falta @)
- "usuario@@dominio.com" (doble @)

Resultado esperado: Error "Email inválido"
```

### Prueba Negativa 3: Teléfono Inválido
```
Teléfonos mal formados:
- "123" (muy corto)
- "abcd567890" (letras)
- "55-12-34-56-78-90" (muy largo)

Resultado esperado:
- Si hay validación: Error
- Si no hay validación: Aceptar (documentar como hallazgo)
```

### Prueba Negativa 4: Campos Obligatorios Vacíos
```
Crear cliente con:
- Nombre: [vacío]
- RFC: [vacío]

Resultado esperado: Error "Campo obligatorio"
```

### Prueba Negativa 5: Duplicados
```
Crear dos clientes con:
- Mismo RFC: PEGJ850101XXX

Resultado esperado: Error "RFC ya existe"
```

### Prueba Negativa 6: Eliminar con Relaciones
```
Intentar eliminar:
- Cliente que tiene pólizas
- Póliza que tiene recibos
- Aseguradora que tiene pólizas

Resultado esperado:
Error "No se puede eliminar porque tiene registros relacionados"
O implementar eliminación en cascada (documentar comportamiento)
```

### Prueba Negativa 7: Inyección de Código HTML/JS
```
Nombre: <script>alert('XSS')</script>
Dirección: <img src=x onerror=alert('XSS')>

Resultado esperado:
- Texto debe guardarse escapado/sanitizado
- No debe ejecutarse el código
```

### Prueba Negativa 8: Inyección SQL
```
Búsqueda: ' OR '1'='1
Búsqueda: '; DROP TABLE clientes; --

Resultado esperado:
- No causar error
- No ejecutar comando SQL malicioso
- Buscar literalmente la cadena
```

### Prueba Negativa 9: Fecha Inválida
```
Fechas imposibles:
- 31/02/2025 (febrero no tiene 31 días)
- 29/02/2025 (2025 no es bisiesto)
- 00/00/0000
- 32/13/2025

Resultado esperado: Error "Fecha inválida"
```

### Prueba Negativa 10: Números Negativos Donde No Deben Ir
```
Prima Neta: -10,000.00
Teléfono: -5512345678

Resultado esperado: Error "Valor debe ser positivo"
```

### Prueba Negativa 11: Caracteres Especiales en Campos Numéricos
```
Prima Neta: $10,000.00 (con símbolo $ y comas)
Prima Neta: 10.000,00 (formato europeo)
Prima Neta: diez mil pesos

Resultado esperado:
- Validación que solo acepta números
- O conversión automática correcta
```

### Prueba Negativa 12: Cerrar Ventana Durante Guardado
```
Pasos:
1. Llenar formulario de cliente
2. Clic en Guardar
3. Inmediatamente cerrar ventana/aplicación

Resultado esperado:
- Datos NO deben guardarse parcialmente
- BD debe mantener integridad
```

### Prueba Negativa 13: Cambiar Fecha del Sistema Durante Operación
```
Pasos:
1. Crear póliza con fecha inicio hoy
2. Cambiar fecha del sistema a ayer
3. Verificar estado de póliza

Resultado esperado:
- Sistema debe usar fecha actual de sistema
- Validar que no causa errores lógicos
```

### Prueba Negativa 14: Desconectar Internet/Red
```
Si el sistema requiere conexión:
1. Iniciar operación
2. Desconectar red
3. Intentar guardar

Resultado esperado: Error apropiado de conexión
```

### Prueba Negativa 15: Llenar Formulario y No Guardar
```
Pasos:
1. Llenar formulario completo
2. No hacer clic en Guardar
3. Navegar a otro módulo

Resultado esperado:
- Mostrar advertencia de cambios sin guardar
- O perder datos (documentar comportamiento)
```

---

## ARCHIVOS DE PRUEBA

### Ubicación de Archivos
Los siguientes archivos deben estar preparados en una carpeta `archivos_prueba/` para usar durante testing:

### PDF Files
```
1. identificacion_ine.pdf (2 MB)
   - Simula INE frente y reverso
   - Usar para: Documentos de identificación

2. poliza_muestra.pdf (1 MB)
   - Simula póliza de seguro
   - Usar para: Documentos de póliza

3. comprobante_domicilio.pdf (500 KB)
   - Simula recibo CFE/Telmex
   - Usar para: Comprobantes de domicilio

4. documento_grande.pdf (15 MB)
   - Para testing de límite de tamaño
   - Usar para: Edge cases de tamaño
```

### Image Files
```
5. foto_cliente.jpg (1.5 MB)
   - Foto genérica de persona
   - Usar para: Foto de perfil

6. documento_escaneado.png (3 MB)
   - Documento escaneado en alta resolución
   - Usar para: Documentos escaneados

7. firma_digital.jpg (200 KB)
   - Imagen de firma
   - Usar para: Firmas digitales
```

### Office Files
```
8. contrato_servicios.doc (500 KB)
   - Documento Word de ejemplo
   - Usar para: Contratos

9. calculo_primas.xlsx (200 KB)
   - Hoja Excel con cálculos
   - Usar para: Cálculos y reportes

10. presentacion_seguros.ppt (2 MB)
    - Presentación PowerPoint
    - Usar para: Material de referencia
```

### Archivos para Pruebas Negativas
```
11. archivo.exe (1 MB)
    - Ejecutable de prueba
    - Usar para: Validar rechazo de formato

12. documento_corrupto.pdf (100 KB)
    - PDF intencionalmente corrupto
    - Usar para: Validar manejo de errores

13. archivo_vacio.pdf (0 KB)
    - Archivo sin contenido
    - Usar para: Validar archivos vacíos

14. nombre_muy_largo_con_mas_de_255_caracteres_...[continúa].pdf
    - Nombre de archivo extremadamente largo
    - Usar para: Validar límite de nombres
```

### Instrucciones para Crear Archivos de Prueba

```bash
# En la carpeta raíz del proyecto, crear carpeta de archivos de prueba
mkdir archivos_prueba
cd archivos_prueba

# Para crear PDFs de prueba en macOS/Linux:
# 1. Crear archivo de texto
echo "Este es un documento de prueba para testing" > temp.txt

# 2. Si tienes herramientas, convertir a PDF
# En macOS: usar Preview o comando textutil
textutil -convert pdf temp.txt -output identificacion_ine.pdf

# 3. Para archivos grandes, duplicar contenido:
cat identificacion_ine.pdf identificacion_ine.pdf > documento_grande.pdf

# Para Windows:
# - Crear documentos Word/Excel y guardar en la carpeta
# - Usar "Imprimir a PDF" desde cualquier aplicación
# - Buscar imágenes libres de derechos en unsplash.com
```

### Notas Importantes sobre Archivos
- ✅ Usar solo archivos genéricos sin información personal real
- ✅ Los archivos deben ser legales y libres de derechos
- ✅ Reutilizar los mismos archivos para consistencia en testing
- ⚠️ NO usar documentos reales de clientes
- ⚠️ NO incluir información sensible en archivos de prueba

---

## FLUJO COMPLETO DE TESTING CON ESTOS DATOS

### Día 1: Preparación
```
1. Crear catálogos (Aseguradoras y Ramos)
2. Crear los 10 clientes base
3. Preparar carpeta con archivos de prueba
4. Validar credenciales de acceso
```

### Día 2: Testing de Módulos Base (Tester 1)
```
1. Testing de módulo Clientes con Clientes 1-10
2. Testing de módulo Documentos con archivos preparados
3. Testing de módulo Catálogos
4. Testing de Dashboard básico
```

### Día 3: Testing de Ciclo de Negocio (Tester 2)
```
1. Crear Pólizas 1-10
2. Validar generación automática de recibos
3. Testing de estados de pólizas
4. Testing de estados de recibos
5. Testing de cálculos y totales
```

### Día 4: Testing de Casos Edge y Negativos (Ambos Testers)
```
1. Tester 1: Casos edge de clientes y documentos
2. Tester 2: Casos edge de pólizas y recibos
3. Ambos: Pruebas negativas y validaciones
4. Ambos: Pruebas de integridad referencial
```

### Día 5: Reporte y Documentación
```
1. Compilar bugs encontrados usando TEMPLATE_REPORTE_BUGS.md
2. Crear reporte resumen
3. Priorizar bugs por severidad
4. Entregar documentación completa
```

---

## MATRIZ DE COBERTURA

### Cobertura por Tipo de Dato

| Tipo de Dato | Casos Normales | Casos Edge | Casos Negativos | Total |
|--------------|----------------|------------|-----------------|-------|
| Clientes     | 7              | 3          | 5               | 15    |
| Pólizas      | 10             | 5          | 3               | 18    |
| Recibos      | 7              | 3          | 2               | 12    |
| Documentos   | 5              | 3          | 3               | 11    |
| Catálogos    | 22             | 0          | 1               | 23    |
| **TOTAL**    | **51**         | **14**     | **14**          | **79**|

### Cobertura por Módulo

| Módulo       | Funciones | Datos de Prueba | Cobertura |
|--------------|-----------|-----------------|-----------|
| Clientes     | 5         | 15              | 100%      |
| Pólizas      | 6         | 18              | 100%      |
| Recibos      | 5         | 12              | 100%      |
| Documentos   | 4         | 11              | 100%      |
| Catálogos    | 4         | 23              | 100%      |
| Dashboard    | 3         | [Calculado]     | 100%      |

---

## CHECKLIST DE PREPARACIÓN

Antes de comenzar testing, verificar:

### Base de Datos
- [ ] Base de datos limpia o con respaldo
- [ ] Usuario admin con credenciales: admin/admin123
- [ ] Sin datos de producción

### Catálogos Base
- [ ] 10 Aseguradoras creadas
- [ ] 12 Ramos creados
- [ ] Periodicidades disponibles en sistema

### Archivos de Prueba
- [ ] Carpeta `archivos_prueba/` creada
- [ ] Al menos 5 PDFs de prueba
- [ ] Al menos 3 imágenes de prueba
- [ ] Al menos 2 documentos Office

### Documentación
- [ ] PLAN_TESTER_1.md disponible
- [ ] PLAN_TESTER_2.md disponible
- [ ] TEMPLATE_REPORTE_BUGS.md disponible
- [ ] DATOS_PRUEBA.md disponible (este documento)

### Ambiente
- [ ] Aplicación instalada y funcionando
- [ ] Permisos de escritura en disco
- [ ] Screenshots tools disponibles
- [ ] Conexión de red (si aplica)

---

## REGISTRO DE DATOS CREADOS

### Template para Tracking

```
SESIÓN DE TESTING: [Fecha]
TESTER: [Nombre]

DATOS CREADOS:
--------------
Clientes:
[ ] Cliente 1: Juan Pérez García - PEGJ850101XXX
[ ] Cliente 2: Transportes del Norte - TDN920515JK3
[ ] Cliente 3: María de los Ángeles... - FAGT750820MDF
... (completar todos)

Pólizas:
[ ] Póliza 1: POL-2025-001
[ ] Póliza 2: POL-2025-002
... (completar todas)

Documentos:
[ ] Documento 1: INE_Juan_Perez.pdf
[ ] Documento 2: Comprobante_CFE...jpg
... (completar todos)

BUGS ENCONTRADOS:
-----------------
[Número] - [Título] - [Severidad]

NOTAS:
------
[Observaciones generales de la sesión]
```

---

## GLOSARIO DE TÉRMINOS

**Edge Case:** Caso extremo o poco común que puede causar comportamiento inesperado

**Prueba Negativa:** Testing de comportamiento con datos inválidos o incorrectos

**Prueba Positiva:** Testing de comportamiento con datos válidos y correctos

**Prima Neta:** Monto base de la póliza sin recargos

**Prima Total:** Prima neta + recargos y comisiones

**Periodicidad:** Frecuencia de pago (Mensual, Bimestral, etc.)

**Ramo:** Tipo de seguro (Autos, Vida, Gastos Médicos, etc.)

**Aseguradora:** Compañía que emite la póliza

**RFC:** Registro Federal de Contribuyentes (identificador fiscal en México)

**Vigente:** Póliza actualmente en su periodo de cobertura

**Por Vencer:** Póliza que vence en menos de 30 días

**Vencida:** Póliza cuya fecha de fin ya pasó

---

## PREGUNTAS FRECUENTES

### ¿Debo usar exactamente estos datos?
Sí para casos específicos de reproducción de bugs. Para testing exploratorio, puedes crear variaciones.

### ¿Qué hago si un dato genera error?
Documenta el error usando TEMPLATE_REPORTE_BUGS.md. El error podría ser un bug o validación correcta.

### ¿Puedo modificar los datos?
Sí, pero documenta los cambios para que otros testers sepan qué datos usaste.

### ¿Necesito crear todos los datos antes de empezar?
No, crea los datos según los vayas necesitando siguiendo el plan de testing.

### ¿Estos datos son suficientes?
Son una base sólida. Crea datos adicionales si encuentras escenarios no cubiertos.

### ¿Qué hago con los datos después de testing?
Puedes conservarlos para regression testing o limpiar la BD para la siguiente sesión.

---

## CONTROL DE VERSIONES

| Versión | Fecha      | Cambios                               | Autor          |
|---------|------------|---------------------------------------|----------------|
| 1.0.0   | 05/11/2025 | Creación inicial del catálogo         | Sistema        |

---

## CONTACTO Y SOPORTE

**Coordinador de Testing:** [Nombre]
**Email:** [email@ejemplo.com]
**Dudas sobre los datos:** Consultar este documento primero

---

**Sistema de Seguros VILLALOBOS**
Catálogo de Datos de Prueba v1.0.0
Noviembre 2025
