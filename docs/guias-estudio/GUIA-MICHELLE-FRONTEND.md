# 📘 GUÍA DE ESTUDIO - MICHELLE (Frontend & UI/UX)

**Área**: Frontend, Interfaz de Usuario, Experiencia de Usuario

---

## 🎯 TU RESPONSABILIDAD

Eres el experto en **cómo se ve y se siente** la aplicación. Debes poder explicar:
- Cómo funciona la interfaz de usuario
- Cómo se validan los formularios
- Cómo se muestran notificaciones y errores
- Por qué se eligió Tailwind CSS
- Cómo funcionan los componentes reutilizables

---

## 📚 ARCHIVOS QUE DEBES DOMINAR

### 🔥 **CRÍTICOS** (Debes conocer al 100%)

1. **`assets/js/toast-manager.js`** (Notificaciones)
   - **Qué hace**: Muestra mensajes de éxito, error, advertencia
   - **Líneas clave**: 1-150
   - **Demostrar**: Crear toast de éxito y error

2. **`assets/js/form-validator.js`** (Validación)
   - **Qué hace**: Valida campos antes de enviar formularios
   - **Líneas clave**: 1-200
   - **Demostrar**: Validar RFC, email, campos requeridos

3. **`views/partials/clientes_partial.html`** (Vista CRUD completa)
   - **Qué hace**: Interfaz completa de gestión de clientes
   - **Líneas clave**: 1-300
   - **Demostrar**: Abrir modal, llenar formulario, ver tabla

### ⚠️ **IMPORTANTES** (Conocer funcionamiento general)

4. **`assets/js/pagination-utils.js`**
5. **`assets/js/confirm-modal.js`**
6. **`assets/js/tooltip-manager.js`**
7. **`tailwind.config.js`**

---

## 💬 PREGUNTAS DEL PROFESOR (PREPARA RESPUESTAS)

### **1. ¿Qué es Tailwind CSS y por qué lo usaron?**

**RESPUESTA MODELO**:
> "Tailwind es un framework CSS de utilidad-first. En lugar de escribir clases como `.card` con estilos predefinidos, usamos clases de utilidad como `bg-blue-500`, `p-4`, `rounded-lg`.
>
> **Ventajas**:
> - **Rápido**: No escribimos CSS custom, solo componemos clases
> - **Consistente**: Los colores, espaciados y tamaños siguen un sistema
> - **Pequeño**: Solo incluye las clases que usamos (tree-shaking)
> - **Mantenible**: Cambiamos estilos directamente en el HTML
>
> Por ejemplo, este botón:
> ```html
> <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
>   Guardar
> </button>
> ```
>
> Sin Tailwind sería:
> ```css
> .btn-primary {
>   background: #2563eb;
>   color: white;
>   padding: 0.5rem 1rem;
>   border-radius: 0.25rem;
> }
> .btn-primary:hover { background: #1d4ed8; }
> ```

**DEMOSTRAR**: Abrir Chrome DevTools, cambiar una clase Tailwind y ver el efecto inmediato

---

### **2. ¿Cómo funciona el sistema de toasts (notificaciones)?**

**RESPUESTA MODELO**:
> "El toast-manager es un componente JavaScript reutilizable que muestra notificaciones temporales.
>
> **Funcionamiento**:
> 1. Se llama `showToast(message, type, duration)`
> 2. Crea un elemento HTML dinámicamente
> 3. Lo inserta en el DOM con animación
> 4. Después de X milisegundos, lo remueve
>
> **Tipos**:
> - `success` → Verde, checkmark ✓
> - `error` → Rojo, X
> - `warning` → Amarillo, ⚠
> - `info` → Azul, ℹ
>
> **Ejemplo de uso**:
> ```javascript
> // En clientes_controller.js después de crear un cliente
> showToast('Cliente creado exitosamente', 'success', 3000);
> ```

**DEMOSTRAR**:
1. Abrir consola del navegador (F12)
2. Escribir: `showToast('Prueba exitosa', 'success', 3000)`
3. Ver aparecer y desaparecer el toast

**CÓDIGO CLAVE** (`toast-manager.js`):
```javascript
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${getIcon(type)}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```

---

### **3. ¿Cómo se validan los formularios?**

**RESPUESTA MODELO**:
> "Usamos el `form-validator.js` que proporciona validaciones comunes antes de enviar datos al backend.
>
> **Validaciones implementadas**:
> - **Campos requeridos**: No pueden estar vacíos
> - **RFC**: Valida formato mexicano (13 caracteres para física, 12 para moral)
> - **Email**: Valida formato correcto
> - **Fechas**: Valida que sean fechas válidas
> - **Números**: Valida que sean números positivos
>
> **Ejemplo de uso**:
> ```javascript
> const form = document.getElementById('formCliente');
> const validator = new FormValidator(form);
>
> validator.addRule('rfc', 'required|rfc');
> validator.addRule('email', 'required|email');
> validator.addRule('nombre', 'required|minLength:3');
>
> if (validator.validate()) {
>   // Enviar formulario
> } else {
>   // Mostrar errores
>   validator.showErrors();
> }
> ```

**DEMOSTRAR**:
1. Abrir formulario de clientes
2. Intentar guardar con campos vacíos
3. Mostrar mensajes de error
4. Llenar con RFC inválido
5. Mostrar validación específica

**CÓDIGO CLAVE** (`form-validator.js`):
```javascript
validateRFC(value) {
  // RFC persona física: 13 caracteres
  // RFC persona moral: 12 caracteres
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcPattern.test(value);
}

validateEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}
```

---

### **4. ¿Cómo funciona la paginación de tablas?**

**RESPUESTA MODELO**:
> "El `pagination-utils.js` divide grandes listas de datos en páginas manejables.
>
> **Funcionamiento**:
> 1. Recibe un array de datos
> 2. Calcula cuántas páginas se necesitan
> 3. Muestra solo los elementos de la página actual
> 4. Genera controles: anterior, números de página, siguiente
>
> **Ejemplo**:
> Si tenemos 100 clientes y mostramos 10 por página:
> - Total de páginas: 100 / 10 = 10
> - Página 1: elementos 0-9
> - Página 2: elementos 10-19
> - etc.

**DEMOSTRAR**:
1. Ir a módulo de clientes
2. Mostrar paginación en la parte inferior de la tabla
3. Cambiar de página
4. Cambiar número de elementos por página (10, 25, 50)

**CÓDIGO CLAVE** (`pagination-utils.js`):
```javascript
function paginate(data, page, perPage) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: data.slice(start, end),
    totalPages: Math.ceil(data.length / perPage),
    currentPage: page,
    hasNext: end < data.length,
    hasPrev: page > 1
  };
}
```

---

### **5. ¿Qué es un modal de confirmación y cuándo se usa?**

**RESPUESTA MODELO**:
> "El `confirm-modal.js` muestra un diálogo que pide confirmación antes de acciones destructivas.
>
> **Cuándo se usa**:
> - Eliminar un cliente
> - Eliminar una póliza
> - Cancelar un recibo
> - Cualquier acción que no se puede deshacer fácilmente
>
> **Funcionamiento**:
> 1. Usuario hace clic en "Eliminar"
> 2. Se abre modal con mensaje: "¿Estás seguro?"
> 3. Botones: "Cancelar" (gris) y "Eliminar" (rojo)
> 4. Solo si confirma, se ejecuta la acción
>
> **Ejemplo de uso**:
> ```javascript
> function eliminarCliente(clienteId) {
>   showConfirmModal(
>     '¿Eliminar cliente?',
>     'Esta acción no se puede deshacer',
>     async () => {
>       // Solo se ejecuta si confirma
>       await window.electronAPI.clientes.delete(clienteId);
>       showToast('Cliente eliminado', 'success');
>     }
>   );
> }
> ```

**DEMOSTRAR**:
1. Ir a tabla de clientes
2. Hacer clic en botón "Eliminar" de un cliente
3. Mostrar modal de confirmación
4. Explicar botones "Cancelar" vs "Eliminar"

---

### **6. ¿Cómo están organizadas las vistas parciales?**

**RESPUESTA MODELO**:
> "El proyecto usa una arquitectura SPA (Single Page Application) con vistas parciales.
>
> **Estructura**:
> - `app_view.html`: Vista principal (shell)
> - `views/partials/`: Vistas parciales de cada módulo
>   - `clientes_partial.html`
>   - `polizas_partial.html`
>   - `dashboard_partial.html`
>   - etc.
>
> **Funcionamiento**:
> 1. Usuario hace clic en menú lateral (ej: "Clientes")
> 2. JavaScript carga el HTML de `clientes_partial.html`
> 3. Lo inserta en el `<div id='content-container'>`
> 4. No recarga toda la página, solo el contenido
>
> **Ventajas**:
> - Más rápido (no recarga completa)
> - Transiciones suaves
> - Mantiene estado de la aplicación
> - Mejor UX (experiencia de usuario)

**DEMOSTRAR**:
1. Abrir la app
2. Navegar entre módulos (Dashboard → Clientes → Pólizas)
3. Mostrar que solo cambia el contenido central
4. Mostrar que el menú lateral siempre está presente

---

## 🎬 DEMOSTRACIÓN EN VIVO (Practica esto)

### **Demo 1: Sistema de Notificaciones**
```
1. Abrir módulo de Clientes
2. Abrir DevTools (F12) → Consola
3. Ejecutar: showToast('¡Operación exitosa!', 'success', 3000)
4. Explicar: "Aquí vemos cómo aparece un toast de éxito"
5. Ejecutar: showToast('Error en la operación', 'error', 3000)
6. Explicar: "Los toasts de error son rojos para llamar la atención"
```

### **Demo 2: Validación de Formularios**
```
1. Abrir modal "Nuevo Cliente"
2. Dejar campos vacíos, hacer clic en "Guardar"
3. Mostrar mensajes de error en rojo
4. Llenar campo RFC con valor inválido: "ABC"
5. Mostrar: "RFC inválido"
6. Llenar correctamente
7. Mostrar: Toast de éxito "Cliente creado"
```

### **Demo 3: Paginación**
```
1. Ir a tabla de Clientes (debe tener varios registros)
2. Mostrar controles de paginación
3. Cambiar a página 2
4. Cambiar "Mostrar 10" a "Mostrar 25"
5. Explicar: "La paginación mejora el rendimiento y UX"
```

---

## 📖 CONCEPTOS CLAVE QUE DEBES CONOCER

### **1. Utility-First CSS (Tailwind)**
- Clases de una sola propiedad: `text-center`, `bg-blue-500`
- Responsive: `md:flex`, `lg:grid-cols-3`
- Estados: `hover:bg-blue-700`, `focus:ring-2`

### **2. DOM Manipulation**
- `document.createElement()`: Crear elementos
- `element.appendChild()`: Agregar al DOM
- `element.classList.add/remove()`: Cambiar clases
- `element.innerHTML`: Cambiar contenido

### **3. Event Listeners**
- `element.addEventListener('click', callback)`
- Prevenir comportamiento default: `event.preventDefault()`
- Propagación de eventos: `event.stopPropagation()`

### **4. Async/Await**
- Llamadas a backend son asíncronas
- `await window.electronAPI.clientes.getAll()`
- Manejo de errores con try/catch

---

## ✅ CHECKLIST DE PREPARACIÓN

Antes de la presentación, asegúrate de poder:

- [ ] Explicar qué es Tailwind CSS y sus ventajas
- [ ] Demostrar un toast (éxito y error)
- [ ] Explicar y mostrar validación de formularios
- [ ] Explicar la paginación de tablas
- [ ] Mostrar un modal de confirmación
- [ ] Explicar arquitectura SPA con partials
- [ ] Abrir DevTools y explicar qué se ve
- [ ] Modificar una clase Tailwind y ver el cambio
- [ ] Explicar la diferencia entre frontend y backend
- [ ] Conocer dónde está cada archivo importante

---

## 🎯 RESPUESTAS RÁPIDAS (Memoriza estos puntos)

**P: ¿Por qué Tailwind?**
R: Rápido, consistente, no CSS custom, tree-shaking, utility-first

**P: ¿Qué hace toast-manager?**
R: Muestra notificaciones temporales (éxito, error, warning, info)

**P: ¿Cómo validamos formularios?**
R: form-validator.js con reglas (required, rfc, email, etc.)

**P: ¿Qué es SPA?**
R: Single Page Application - carga parciales sin recargar toda la página

**P: ¿Qué componentes reutilizables hay?**
R: Toasts, modales de confirmación, validador de formularios, paginación, tooltips

---

## 🚀 PRACTICA FINAL

**Ejercicio**: Explica en 2 minutos el flujo completo de crear un cliente:

1. Usuario hace clic en "Nuevo Cliente"
2. Se abre modal (confirm-modal.js)
3. Usuario llena formulario
4. Hace clic en "Guardar"
5. form-validator valida campos
6. Si hay errores, muestra mensajes en rojo
7. Si es válido, envía a clientes_controller.js
8. Controller usa IPC para enviar al backend
9. Backend responde éxito
10. Se muestra toast verde "Cliente creado"
11. Se cierra modal
12. Se actualiza la tabla con el nuevo cliente

**¡Éxito en tu presentación! 🎨**
