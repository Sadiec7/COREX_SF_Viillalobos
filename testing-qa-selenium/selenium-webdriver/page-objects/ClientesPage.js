// ClientesPage.js - Page Object para la gestión de Clientes

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const {
  waitForElement,
  waitForVisible,
  waitForClickable,
  waitForText
} = require('../helpers/wait-helpers');

class ClientesPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators principales
    this.locators = {
      // Búsqueda y filtros
      searchInput: By.id('searchInput'),
      btnOpenFilters: By.id('btnOpenFilters'),
      btnAddCliente: By.id('btnAddCliente'),

      // Stats
      statTotal: By.id('statTotal'),
      statFisicas: By.id('statFisicas'),
      statMorales: By.id('statMorales'),

      // Tabla
      clientesTableBody: By.id('clientesTableBody'),
      emptyState: By.id('emptyState'),
      loadingState: By.id('loadingState'),

      // Modal de Cliente
      modalCliente: By.id('modalCliente'),
      modalTitle: By.id('modalTitle'),
      btnCloseModal: By.id('btnCloseModal'),
      formCliente: By.id('formCliente'),

      // Campos del formulario
      inputNombre: By.id('inputNombre'),
      inputRFC: By.id('inputRFC'),
      inputEmail: By.id('inputEmail'),
      inputTelefono: By.id('inputTelefono'),
      inputCelular: By.id('inputCelular'),
      inputDireccion: By.id('inputDireccion'),
      inputNotas: By.id('inputNotas'),

      // Radio buttons tipo persona
      radioFisica: By.css('input[name="tipo_persona"][value="Física"]'),
      radioMoral: By.css('input[name="tipo_persona"][value="Moral"]'),

      // Botones del formulario
      btnCancelForm: By.id('btnCancelForm'),
      btnSubmitForm: By.css('#formCliente button[type="submit"]'),

      // Modal de filtros
      modalFiltros: By.id('modalFiltros'),
      btnCloseFiltros: By.id('btnCloseFiltros'),
      filterFisica: By.id('filterFisica'),
      filterMoral: By.id('filterMoral'),
      filterConEmail: By.id('filterConEmail'),
      filterConTelefono: By.id('filterConTelefono'),
      filterConDireccion: By.id('filterConDireccion'),
      btnClearFilters: By.id('btnClearFilters'),
      btnApplyFilters: By.id('btnApplyFilters'),

      // Paginación
      paginationContainer: By.id('paginationContainer'),
      paginationInfo: By.id('paginationInfo'),
      itemsPerPageSelect: By.id('itemsPerPageSelect')
    };
  }

  // ==================== NAVEGACIÓN ====================

  /**
   * Navega a la sección de clientes
   */
  async navigateToClientes() {
    console.log('📍 Navegando a sección de Clientes...');

    // Buscar y hacer clic en el enlace de navegación de Clientes
    const navLink = By.css('a[data-view="clientes"]');
    await this.click(navLink);

    // Esperar a que la tabla esté visible
    await this.sleep(1000); // Dar tiempo a la transición
    await waitForVisible(this.driver, this.locators.clientesTableBody);
    console.log('✅ Vista de Clientes cargada');
  }

  /**
   * Espera a que la página de clientes esté completamente cargada
   */
  async waitForPageLoad() {
    console.log('⏳ Esperando carga de página de Clientes...');
    await waitForVisible(this.driver, this.locators.clientesTableBody);
    await this.sleep(500); // Dar tiempo a que se carguen los datos
    console.log('✅ Página de Clientes cargada');
  }

  // ==================== MODAL DE CLIENTE ====================

  /**
   * Abre el modal para crear un nuevo cliente
   */
  async openNewClienteModal() {
    console.log('🆕 Abriendo modal de nuevo cliente...');
    await this.click(this.locators.btnAddCliente);
    await waitForVisible(this.driver, this.locators.modalCliente);
    await this.sleep(300);
    console.log('✅ Modal de nuevo cliente abierto');
  }

  /**
   * Cierra el modal de cliente
   */
  async closeModal() {
    console.log('❌ Cerrando modal...');
    // Esperar a que desaparezcan toasts que puedan bloquear el botón
    await this.sleep(1000);
    await this.click(this.locators.btnCloseModal);
    await this.sleep(300);
    console.log('✅ Modal cerrado');
  }

  /**
   * Verifica si el modal está visible
   */
  async isModalVisible() {
    try {
      const modal = await this.driver.findElement(this.locators.modalCliente);
      const classes = await modal.getAttribute('class');
      return classes.includes('active');
    } catch (error) {
      return false;
    }
  }

  // ==================== FORMULARIO DE CLIENTE ====================

  /**
   * Selecciona el tipo de persona
   * @param {string} tipo - "Física" o "Moral"
   */
  async selectTipoPersona(tipo) {
    console.log(`👤 Seleccionando tipo de persona: ${tipo}`);

    const locator = tipo === 'Física'
      ? this.locators.radioFisica
      : this.locators.radioMoral;

    await this.click(locator);
    console.log(`✅ Tipo de persona seleccionado: ${tipo}`);
  }

  /**
   * Llena el formulario de cliente con los datos proporcionados
   * @param {Object} clienteData - Datos del cliente
   */
  async fillClienteForm(clienteData) {
    console.log('📝 Llenando formulario de cliente...');

    // Tipo de persona
    if (clienteData.tipo_persona) {
      await this.selectTipoPersona(clienteData.tipo_persona);
    }

    // Nombre
    if (clienteData.nombre) {
      await this.type(this.locators.inputNombre, clienteData.nombre);
    }

    // RFC
    if (clienteData.rfc) {
      await this.type(this.locators.inputRFC, clienteData.rfc);
    }

    // Email
    if (clienteData.email) {
      await this.type(this.locators.inputEmail, clienteData.email);
    }

    // Teléfono
    if (clienteData.telefono) {
      await this.type(this.locators.inputTelefono, clienteData.telefono);
    }

    // Celular
    if (clienteData.celular) {
      await this.type(this.locators.inputCelular, clienteData.celular);
    }

    // Dirección
    if (clienteData.direccion) {
      await this.type(this.locators.inputDireccion, clienteData.direccion);
    }

    // Notas
    if (clienteData.notas) {
      await this.type(this.locators.inputNotas, clienteData.notas);
    }

    console.log('✅ Formulario llenado correctamente');
  }

  /**
   * Envía el formulario de cliente
   */
  async submitForm() {
    console.log('💾 Enviando formulario...');
    await this.click(this.locators.btnSubmitForm);
    console.log('✅ Formulario enviado');
  }

  /**
   * Cancela el formulario de cliente
   */
  async cancelForm() {
    console.log('🚫 Cancelando formulario...');
    await this.click(this.locators.btnCancelForm);
    await this.sleep(300);
    console.log('✅ Formulario cancelado');
  }

  /**
   * Crea un nuevo cliente con los datos proporcionados
   * @param {Object} clienteData - Datos del cliente
   */
  async createCliente(clienteData) {
    await this.openNewClienteModal();
    await this.fillClienteForm(clienteData);
    await this.submitForm();

    // Esperar a que el modal se cierre
    await this.sleep(1500);
  }

  // ==================== BÚSQUEDA Y FILTROS ====================

  /**
   * Busca clientes por texto
   * @param {string} searchText - Texto a buscar
   */
  async search(searchText) {
    console.log(`🔍 Buscando: "${searchText}"`);
    await this.type(this.locators.searchInput, searchText);
    await this.sleep(500); // Dar tiempo para que se aplique la búsqueda
    console.log('✅ Búsqueda aplicada');
  }

  /**
   * Limpia el campo de búsqueda
   */
  async clearSearch() {
    console.log('🧹 Limpiando búsqueda...');
    const searchInput = await this.driver.findElement(this.locators.searchInput);
    await searchInput.clear();
    await this.sleep(500);
    console.log('✅ Búsqueda limpiada');
  }

  /**
   * Abre el modal de filtros
   */
  async openFiltersModal() {
    console.log('🔧 Abriendo filtros avanzados...');
    await this.click(this.locators.btnOpenFilters);
    await waitForVisible(this.driver, this.locators.modalFiltros);
    await this.sleep(300);
    console.log('✅ Modal de filtros abierto');
  }

  /**
   * Aplica filtros avanzados
   * @param {Object} filters - Filtros a aplicar
   */
  async applyFilters(filters) {
    await this.openFiltersModal();

    // Aplicar cada filtro
    if (filters.fisica !== undefined) {
      const checkbox = await this.driver.findElement(this.locators.filterFisica);
      const isChecked = await checkbox.isSelected();
      if (isChecked !== filters.fisica) {
        await this.click(this.locators.filterFisica);
      }
    }

    if (filters.moral !== undefined) {
      const checkbox = await this.driver.findElement(this.locators.filterMoral);
      const isChecked = await checkbox.isSelected();
      if (isChecked !== filters.moral) {
        await this.click(this.locators.filterMoral);
      }
    }

    if (filters.conEmail !== undefined) {
      const checkbox = await this.driver.findElement(this.locators.filterConEmail);
      const isChecked = await checkbox.isSelected();
      if (isChecked !== filters.conEmail) {
        await this.click(this.locators.filterConEmail);
      }
    }

    // Aplicar filtros
    await this.click(this.locators.btnApplyFilters);
    await this.sleep(500);
    console.log('✅ Filtros aplicados');
  }

  /**
   * Limpia todos los filtros
   */
  async clearFilters() {
    await this.openFiltersModal();
    await this.click(this.locators.btnClearFilters);
    await this.sleep(300);
    console.log('✅ Filtros limpiados');
  }

  // ==================== TABLA Y STATS ====================

  /**
   * Obtiene el número total de clientes mostrado en stats
   */
  async getTotalClientes() {
    const text = await this.getText(this.locators.statTotal);
    return parseInt(text);
  }

  /**
   * Obtiene el número de personas físicas
   */
  async getTotalFisicas() {
    const text = await this.getText(this.locators.statFisicas);
    return parseInt(text);
  }

  /**
   * Obtiene el número de personas morales
   */
  async getTotalMorales() {
    const text = await this.getText(this.locators.statMorales);
    return parseInt(text);
  }

  /**
   * Obtiene el número de filas en la tabla
   */
  async getTableRowCount() {
    try {
      const tbody = await this.driver.findElement(this.locators.clientesTableBody);
      const rows = await tbody.findElements(By.css('tr'));
      return rows.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Verifica si un cliente existe en la tabla por nombre
   * @param {string} nombre - Nombre del cliente a buscar
   */
  async clienteExistsInTable(nombre) {
    console.log(`🔎 Verificando si existe cliente: ${nombre}`);

    try {
      const tbody = await this.driver.findElement(this.locators.clientesTableBody);
      const rows = await tbody.findElements(By.css('tr'));

      for (const row of rows) {
        const text = await row.getText();
        if (text.includes(nombre)) {
          console.log(`✅ Cliente encontrado en tabla: ${nombre}`);
          return true;
        }
      }

      console.log(`❌ Cliente no encontrado en tabla: ${nombre}`);
      return false;
    } catch (error) {
      console.error('❌ Error al buscar cliente en tabla:', error.message);
      return false;
    }
  }

  /**
   * Verifica si la tabla está vacía (empty state visible)
   */
  async isTableEmpty() {
    try {
      const emptyState = await this.driver.findElement(this.locators.emptyState);
      const classes = await emptyState.getAttribute('class');
      return !classes.includes('hidden');
    } catch (error) {
      return false;
    }
  }

  /**
   * Hace clic en el primer cliente de la tabla para editarlo
   */
  async clickFirstClienteEdit() {
    console.log('✏️ Haciendo clic en editar primer cliente...');

    const tbody = await this.driver.findElement(this.locators.clientesTableBody);
    const editButton = await tbody.findElement(By.css('button[title="Editar"]'));
    await editButton.click();

    await waitForVisible(this.driver, this.locators.modalCliente);
    await this.sleep(300);
    console.log('✅ Modal de edición abierto');
  }

  /**
   * Hace clic en eliminar el primer cliente de la tabla
   */
  async clickFirstClienteDelete() {
    console.log('🗑️  Haciendo clic en eliminar primer cliente...');

    const tbody = await this.driver.findElement(this.locators.clientesTableBody);
    const deleteButton = await tbody.findElement(By.css('button[title="Eliminar"]'));
    await deleteButton.click();

    await this.sleep(300);
    console.log('✅ Botón eliminar presionado');
  }

  // ==================== VALIDACIONES ====================

  /**
   * Obtiene el mensaje de validación de un campo
   * @param {By} fieldLocator - Locator del campo
   */
  async getFieldValidationMessage(fieldLocator) {
    try {
      const field = await this.driver.findElement(fieldLocator);
      return await field.getAttribute('validationMessage');
    } catch (error) {
      return '';
    }
  }

  /**
   * Verifica si un campo tiene error (borde rojo)
   * @param {By} fieldLocator - Locator del campo
   */
  async fieldHasError(fieldLocator) {
    try {
      const field = await this.driver.findElement(fieldLocator);
      const classes = await field.getAttribute('class');
      return classes.includes('border-red') || classes.includes('ring-red');
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene el valor actual de un campo
   * @param {By} fieldLocator - Locator del campo
   */
  async getFieldValue(fieldLocator) {
    try {
      const field = await this.driver.findElement(fieldLocator);
      return await field.getAttribute('value');
    } catch (error) {
      return '';
    }
  }
}

module.exports = ClientesPage;
