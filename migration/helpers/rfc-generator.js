// rfc-generator.js - Generador de RFCs válidos mexicanos

/**
 * Genera un RFC válido para persona física
 * Formato: AAAA######XXX (13 caracteres)
 */
function generarRFCPersonaFisica(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) {
    // Primeras 4 letras: primera y vocal del apellido paterno + inicial apellido materno + inicial nombre
    const primeraLetraPaterno = apellidoPaterno[0].toUpperCase();
    const vocalPaterno = extraerPrimeraVocal(apellidoPaterno);
    const primeraLetraMaterno = apellidoMaterno[0].toUpperCase();
    const primeraLetraNombre = nombre[0].toUpperCase();

    const letras = primeraLetraPaterno + vocalPaterno + primeraLetraMaterno + primeraLetraNombre;

    // Fecha: AAMMDD
    const fecha = fechaNacimiento.toISOString().slice(2, 10).replace(/-/g, '').slice(0, 6);

    // Homoclave: 3 caracteres aleatorios
    const homoclave = generarHomoclave();

    return letras + fecha + homoclave;
}

/**
 * Genera un RFC válido para persona moral
 * Formato: AAA######XXX (12 caracteres)
 */
function generarRFCPersonaMoral(razonSocial, fechaConstitucion) {
    // Primeras 3 letras de las primeras 3 palabras significativas
    const palabras = razonSocial.toUpperCase()
        .replace(/\bSA\b|\bDE\b|\bCV\b|\bSC\b|\bLTDA\b|\bSRL\b/g, '')
        .split(' ')
        .filter(p => p.length > 0);

    let letras = '';
    for (let i = 0; i < Math.min(3, palabras.length); i++) {
        letras += palabras[i][0];
    }
    while (letras.length < 3) {
        letras += 'X';
    }

    // Fecha: AAMMDD
    const fecha = fechaConstitucion.toISOString().slice(2, 10).replace(/-/g, '').slice(0, 6);

    // Homoclave: 3 caracteres aleatorios
    const homoclave = generarHomoclave();

    return letras + fecha + homoclave;
}

/**
 * Extrae la primera vocal interna de un apellido
 */
function extraerPrimeraVocal(apellido) {
    const vocales = 'AEIOUÁÉÍÓÚ';
    for (let i = 1; i < apellido.length; i++) {
        const letra = apellido[i].toUpperCase();
        if (vocales.includes(letra)) {
            return letra.replace(/[ÁÉÍÓÚ]/g, (m) => {
                const map = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
                return map[m];
            });
        }
    }
    return 'X';
}

/**
 * Genera una homoclave aleatoria de 3 caracteres
 */
function generarHomoclave() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

/**
 * Genera un RFC aleatorio válido
 */
function generarRFCAleatorio(tipoPersona = 'Física') {
    if (tipoPersona === 'Moral') {
        const razones = [
            'COMERCIALIZADORA DEL BAJIO',
            'IMPORTADORA MEXICANA',
            'SERVICIOS INTEGRALES',
            'CONSTRUCTORA NACIONAL',
            'DISTRIBUIDORA REGIONAL',
            'GRUPO INDUSTRIAL',
            'SOLUCIONES EMPRESARIALES',
            'CORPORATIVO FINANCIERO',
            'TECNOLOGIA AVANZADA'
        ];
        const razon = razones[Math.floor(Math.random() * razones.length)];
        const fecha = generarFechaAleatoria(new Date('2000-01-01'), new Date('2020-12-31'));
        return generarRFCPersonaMoral(razon, fecha);
    } else {
        const nombres = ['JUAN', 'MARIA', 'JOSE', 'LUIS', 'ANA', 'CARLOS', 'LAURA', 'MIGUEL', 'ROSA', 'PEDRO'];
        const apellidosP = ['GARCIA', 'MARTINEZ', 'LOPEZ', 'GONZALEZ', 'HERNANDEZ', 'RODRIGUEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ', 'TORRES'];
        const apellidosM = ['FLORES', 'RIVERA', 'GOMEZ', 'DIAZ', 'CRUZ', 'MORALES', 'REYES', 'JIMENEZ', 'RUIZ', 'MENDEZ'];

        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellidoP = apellidosP[Math.floor(Math.random() * apellidosP.length)];
        const apellidoM = apellidosM[Math.floor(Math.random() * apellidosM.length)];
        const fecha = generarFechaAleatoria(new Date('1950-01-01'), new Date('2000-12-31'));

        return generarRFCPersonaFisica(nombre, apellidoP, apellidoM, fecha);
    }
}

/**
 * Genera una fecha aleatoria entre dos fechas
 */
function generarFechaAleatoria(inicio, fin) {
    return new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
}

module.exports = {
    generarRFCPersonaFisica,
    generarRFCPersonaMoral,
    generarRFCAleatorio
};
