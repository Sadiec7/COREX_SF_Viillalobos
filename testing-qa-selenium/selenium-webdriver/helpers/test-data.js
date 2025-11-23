// test-data.js - Datos de prueba para los casos de Selenium

const testData = {
  // Usuarios para pruebas de autenticación
  usuarios: {
    admin: {
      username: 'admin',
      password: 'admin123',
      descripcion: 'Usuario administrador válido'
    },
    agente: {
      username: 'agente1',
      password: 'agente123',
      descripcion: 'Usuario agente válido'
    },
    testUser: {
      username: 'test_user',
      password: 'Test123!',
      descripcion: 'Usuario de prueba válido'
    },
    invalido: {
      username: 'usuarioInexistente',
      password: 'passwordIncorrecto123',
      descripcion: 'Usuario que no existe'
    },
    passwordIncorrecto: {
      username: 'admin',
      password: 'passwordIncorrecto',
      descripcion: 'Usuario válido con password incorrecto'
    }
  },

  // Clientes para pruebas
  clientes: {
    personaFisica: {
      nombre: 'Juan Pérez López',
      rfc: 'PELJ850101ABC',
      email: 'juan.perez@test.com',
      telefono: '5551234567',
      celular: '5559876543',
      direccion: 'Calle Principal 123, Col. Centro',
      tipoPersona: 'Física'
    },
    personaMoral: {
      nombre: 'Empresa Test SA de CV',
      rfc: 'ETE850101XYZ',
      email: 'contacto@empresa.test',
      telefono: '5559876543',
      celular: '5551234567',
      direccion: 'Av. Empresarial 456, Col. Industrial',
      tipoPersona: 'Moral'
    },
    rfcInvalido: {
      nombre: 'Cliente RFC Inválido',
      rfc: 'ABC',
      email: 'cliente@test.com',
      telefono: '5551234567'
    },
    emailInvalido: {
      nombre: 'Cliente Email Inválido',
      rfc: 'CEIJ850101ABC',
      email: 'email-invalido',
      telefono: '5551234567'
    },
    telefonoInvalido: {
      nombre: 'Cliente Teléfono Inválido',
      rfc: 'CTIJ850101ABC',
      email: 'cliente@test.com',
      telefono: '123'
    }
  },

  // Pólizas para pruebas
  polizas: {
    vida: {
      numeroPoliza: 'POL-2025-001',
      aseguradora: 'GNP Seguros',
      ramo: 'Vida',
      fechaInicio: '01/01/2025',
      fechaFin: '31/12/2025',
      sumaAsegurada: '500000',
      prima: '12500',
      notas: 'Póliza de prueba - Vida'
    },
    auto: {
      numeroPoliza: 'POL-2025-002',
      aseguradora: 'Mapfre',
      ramo: 'Auto',
      fechaInicio: '15/01/2025',
      fechaFin: '14/01/2026',
      sumaAsegurada: '300000',
      prima: '8500',
      notas: 'Póliza de prueba - Auto'
    },
    fechasInvalidas: {
      numeroPoliza: 'POL-2025-003',
      aseguradora: 'Qualitas',
      ramo: 'Daños',
      fechaInicio: '31/12/2025',
      fechaFin: '01/01/2025', // Fecha fin menor a inicio
      sumaAsegurada: '100000',
      prima: '5000'
    },
    sumaInvalida: {
      numeroPoliza: 'POL-2025-004',
      aseguradora: 'AXA',
      ramo: 'Vida',
      fechaInicio: '01/01/2025',
      fechaFin: '31/12/2025',
      sumaAsegurada: '0', // Suma = 0 (inválido)
      prima: '5000'
    }
  },

  // Mensajes de error esperados
  mensajes: {
    loginIncorrecto: 'Usuario o contraseña incorrectos',
    campoObligatorio: 'Este campo es obligatorio',
    rfcInvalido: 'RFC inválido',
    emailInvalido: 'Email inválido',
    telefonoInvalido: 'Teléfono debe tener 10 dígitos',
    numeroPolizaDuplicado: 'El número de póliza ya existe',
    fechaInvalida: 'La fecha de fin debe ser posterior a la fecha de inicio',
    sumaInvalida: 'La suma asegurada debe ser mayor a 0',
    primaInvalida: 'La prima debe ser mayor a 0'
  },

  // Mensajes de éxito esperados
  mensajesExito: {
    loginExitoso: 'Bienvenido',
    clienteCreado: 'Cliente creado exitosamente',
    clienteActualizado: 'Cliente actualizado correctamente',
    clienteEliminado: 'Cliente eliminado correctamente',
    polizaCreada: 'Póliza creada exitosamente',
    polizaActualizada: 'Póliza actualizada correctamente',
    polizaEliminada: 'Póliza eliminada correctamente'
  }
};

module.exports = testData;
