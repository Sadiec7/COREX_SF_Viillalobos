// faker-data.js - Datos realistas mexicanos para el seeder

const NOMBRES_HOMBRE = [
    'Juan', 'José', 'Luis', 'Carlos', 'Miguel', 'Pedro', 'Jorge', 'Francisco', 'Antonio', 'Alejandro',
    'Fernando', 'Daniel', 'Ricardo', 'Roberto', 'Javier', 'Sergio', 'Eduardo', 'Manuel', 'Raúl', 'Arturo'
];

const NOMBRES_MUJER = [
    'María', 'Ana', 'Laura', 'Rosa', 'Carmen', 'Guadalupe', 'Martha', 'Elena', 'Patricia', 'Verónica',
    'Sandra', 'Lucía', 'Claudia', 'Diana', 'Beatriz', 'Mónica', 'Teresa', 'Silvia', 'Gabriela', 'Adriana'
];

const APELLIDOS = [
    'García', 'Martínez', 'López', 'González', 'Hernández', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
    'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Jiménez', 'Ruiz', 'Mendoza',
    'Castillo', 'Vargas', 'Vázquez', 'Romero', 'Herrera', 'Mendez', 'Aguilar', 'Gutiérrez', 'Ortiz', 'Chavez'
];

const RAZONES_SOCIALES = [
    'Comercializadora del Bajío',
    'Importadora Mexicana',
    'Servicios Integrales del Norte',
    'Constructora Nacional',
    'Distribuidora Regional del Sureste',
    'Grupo Industrial del Pacífico',
    'Soluciones Empresariales Modernas',
    'Corporativo Financiero del Centro',
    'Tecnología Avanzada',
    'Logística y Transportes Unidos',
    'Alimentos y Bebidas del Valle',
    'Textiles y Confecciones',
    'Ferretería y Materiales',
    'Equipos y Maquinaria Industrial',
    'Consultoría Profesional Integral'
];

const CALLES = [
    'Av. Insurgentes', 'Av. Juárez', 'Av. Reforma', 'Calle Morelos', 'Av. Hidalgo', 'Calle Madero',
    'Av. Revolución', 'Calle Allende', 'Av. Universidad', 'Calle Zaragoza', 'Av. Constitución',
    'Calle 5 de Mayo', 'Av. Independencia', 'Calle Guerrero', 'Av. Justo Sierra', 'Calle Obregón'
];

const COLONIAS = [
    'Centro', 'Del Valle', 'Roma', 'Polanco', 'Narvarte', 'Condesa', 'Santa María',
    'San Miguel', 'Las Águilas', 'Lindavista', 'Satelite', 'Pedregal', 'Coyoacán',
    'Anzures', 'Escandón', 'Portales', 'Nápoles', 'Mixcoac', 'San Ángel', 'Tlalpan'
];

const CIUDADES = [
    { ciudad: 'Ciudad de México', estado: 'CDMX', cp: '01000' },
    { ciudad: 'Guadalajara', estado: 'Jalisco', cp: '44100' },
    { ciudad: 'Monterrey', estado: 'Nuevo León', cp: '64000' },
    { ciudad: 'Puebla', estado: 'Puebla', cp: '72000' },
    { ciudad: 'Querétaro', estado: 'Querétaro', cp: '76000' },
    { ciudad: 'Mérida', estado: 'Yucatán', cp: '97000' },
    { ciudad: 'León', estado: 'Guanajuato', cp: '37000' },
    { ciudad: 'Tijuana', estado: 'Baja California', cp: '22000' },
    { ciudad: 'Toluca', estado: 'Estado de México', cp: '50000' },
    { ciudad: 'Aguascalientes', estado: 'Aguascalientes', cp: '20000' }
];

const TELEFONOS_LADA = ['55', '33', '81', '222', '442', '999', '477', '664', '722', '449'];

/**
 * Genera un nombre completo aleatorio
 */
function generarNombreCompleto(genero = null) {
    if (!genero) {
        genero = Math.random() > 0.5 ? 'H' : 'M';
    }

    const nombre = genero === 'H'
        ? NOMBRES_HOMBRE[Math.floor(Math.random() * NOMBRES_HOMBRE.length)]
        : NOMBRES_MUJER[Math.floor(Math.random() * NOMBRES_MUJER.length)];

    const apellidoP = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
    const apellidoM = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];

    return `${nombre} ${apellidoP} ${apellidoM}`;
}

/**
 * Genera una razón social aleatoria
 */
function generarRazonSocial() {
    const razon = RAZONES_SOCIALES[Math.floor(Math.random() * RAZONES_SOCIALES.length)];
    const sufijos = ['SA de CV', 'SC', 'SAPI de CV', 'SPR de RL'];
    const sufijo = sufijos[Math.floor(Math.random() * sufijos.length)];
    return `${razon} ${sufijo}`;
}

/**
 * Genera una dirección completa aleatoria
 */
function generarDireccion() {
    const calle = CALLES[Math.floor(Math.random() * CALLES.length)];
    const numero = Math.floor(Math.random() * 999) + 1;
    const colonia = COLONIAS[Math.floor(Math.random() * COLONIAS.length)];
    const ciudad = CIUDADES[Math.floor(Math.random() * CIUDADES.length)];

    return `${calle} ${numero}, Col. ${colonia}, ${ciudad.ciudad}, ${ciudad.estado}, C.P. ${ciudad.cp}`;
}

/**
 * Genera un teléfono aleatorio
 */
function generarTelefono() {
    const lada = TELEFONOS_LADA[Math.floor(Math.random() * TELEFONOS_LADA.length)];
    const numero = Math.floor(Math.random() * 9000000) + 1000000;
    return `${lada}${numero}`;
}

/**
 * Genera un email aleatorio
 */
function generarEmail(nombre) {
    const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com.mx', 'outlook.com', 'live.com.mx'];
    const nombreLimpio = nombre.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '.');
    const dominio = dominios[Math.floor(Math.random() * dominios.length)];
    const numero = Math.floor(Math.random() * 999);

    return `${nombreLimpio}${numero > 0 ? numero : ''}@${dominio}`;
}

/**
 * Genera una fecha de nacimiento aleatoria
 */
function generarFechaNacimiento() {
    const inicio = new Date('1950-01-01');
    const fin = new Date('2000-12-31');
    const fecha = new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
    return fecha.toISOString().split('T')[0];
}

/**
 * Genera una fecha de constitución aleatoria (empresas)
 */
function generarFechaConstitucion() {
    const inicio = new Date('1990-01-01');
    const fin = new Date('2020-12-31');
    const fecha = new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
    return fecha.toISOString().split('T')[0];
}

/**
 * Genera un número de póliza aleatorio
 */
function generarNumeroPoliza() {
    const anio = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 900000) + 100000;
    return `POL-${anio}-${numero}`;
}

/**
 * Genera montos realistas según el ramo
 */
function generarMontoPorRamo(ramoNombre) {
    const rangos = {
        'Automóvil': [3000, 15000],
        'Vida': [5000, 50000],
        'Gastos Médicos Mayores': [8000, 40000],
        'Daños': [2000, 20000],
        'Hogar': [1500, 8000],
        'Responsabilidad Civil': [3000, 25000],
        'Accidentes Personales': [2000, 10000],
        'Transporte': [5000, 30000],
        'Incendio': [4000, 35000],
        'Robo': [1500, 12000],
        'Empresarial': [10000, 100000],
        'Educación': [3000, 15000],
        'Moto': [1000, 5000],
        'Flotilla': [20000, 150000],
        'Dental': [800, 4000]
    };

    const rango = rangos[ramoNombre] || [2000, 20000];
    const monto = Math.random() * (rango[1] - rango[0]) + rango[0];
    return Math.round(monto * 100) / 100;
}

module.exports = {
    generarNombreCompleto,
    generarRazonSocial,
    generarDireccion,
    generarTelefono,
    generarEmail,
    generarFechaNacimiento,
    generarFechaConstitucion,
    generarNumeroPoliza,
    generarMontoPorRamo,
    NOMBRES_HOMBRE,
    NOMBRES_MUJER,
    APELLIDOS
};
