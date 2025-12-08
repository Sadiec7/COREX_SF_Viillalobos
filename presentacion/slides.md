---
theme: default
title: Sistema de Seguros VILLALOBOS
highlighter: shiki
transition: fade
mdc: true
aspectRatio: '16/9'
canvasWidth: 980
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
.slidev-layout {
  background: white !important;
  color: #2F2F2F !important;
  font-family: 'Inter', sans-serif;
  overflow: hidden !important;
  padding: 0 !important;
}
h1, h2, h3 { color: #2F2F2F; margin: 0; }
.slide-container { padding: 24px 40px; height: 100%; display: flex; flex-direction: column; }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2F2F2F; padding-bottom: 8px; margin-bottom: 16px; }
.header img { height: 50px; }
.header span { font-size: 14px; color: #666; }
</style>

<!-- SLIDE 1: PORTADA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 flex flex-col justify-center">
    <h1 class="text-4xl font-black leading-tight">Sistema de Seguros<br/>VILLALOBOS</h1>
    <p class="text-base text-gray-500 mt-3">Sistema de Gestion Integral para Agencias de Seguros</p>
    <div class="flex gap-2 mt-4">
      <span class="px-2 py-1 border border-gray-800 rounded-full text-xs">Electron</span>
      <span class="px-2 py-1 border border-gray-800 rounded-full text-xs">Node.js</span>
      <span class="px-2 py-1 border border-gray-800 rounded-full text-xs">SQLite</span>
      <span class="px-2 py-1 border border-gray-800 rounded-full text-xs">MVC</span>
    </div>
  </div>
  <div class="text-right text-xs text-gray-500">
    <strong>Team COREX:</strong> Angel Salinas | Sebastian Rivera | Salvador Camacho | Mariana Michelle
  </div>
</div>

---

<!-- SLIDE 2: AGENDA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-6">Agenda</h1>
  <div class="text-lg leading-loose ml-4">
    <div>01. Contexto del Proyecto</div>
    <div>02. Problema y Solucion</div>
    <div>03. Demostracion del Sistema</div>
    <div>04. Arquitectura Tecnica</div>
    <div>05. Calidad y Testing</div>
    <div>06. Conclusiones</div>
  </div>
</div>

---

<!-- SLIDE 3: CONTEXTO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-3">Contexto del Proyecto</h1>
  <div class="grid grid-cols-2 gap-8 flex-1">
    <div>
      <h3 class="text-lg font-bold text-[#2AABAB] mb-2">Cliente</h3>
      <p class="text-sm leading-relaxed"><strong>Seguros VILLALOBOS</strong> es una agencia de seguros ubicada en Queretaro que gestiona polizas de multiples aseguradoras.</p>
      <h3 class="text-lg font-bold text-[#2AABAB] mt-4 mb-2">Necesidad</h3>
      <p class="text-sm leading-relaxed">Automatizar la gestion de clientes, polizas y cobranza, reemplazando procesos manuales en Excel.</p>
    </div>
    <div>
      <h3 class="text-lg font-bold text-[#2AABAB] mb-2">Alcance</h3>
      <div class="text-sm leading-relaxed">
        • Gestion completa de clientes (CRUD)<br/>
        • Administracion de polizas y renovaciones<br/>
        • Control de cobranza y recibos<br/>
        • Generacion de reportes PDF/Excel<br/>
        • Dashboard con metricas en tiempo real<br/>
        • Sistema de alertas automaticas<br/>
        • Instaladores para Windows y macOS
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 4: EL PROBLEMA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">El Problema</h1>
  <div class="grid grid-cols-2 gap-8 flex-1">
    <div>
      <h3 class="text-lg font-bold mb-3">Situacion Actual</h3>
      <div class="text-sm leading-loose">
        <span class="text-red-600">[X]</span> Multiples archivos Excel sin sincronizar<br/>
        <span class="text-red-600">[X]</span> Perdida de informacion por errores humanos<br/>
        <span class="text-red-600">[X]</span> Sin control de cobranza automatizado<br/>
        <span class="text-red-600">[X]</span> Reportes manuales que toman horas<br/>
        <span class="text-red-600">[X]</span> Sin alertas de vencimiento de polizas<br/>
        <span class="text-red-600">[X]</span> Dificultad para encontrar informacion
      </div>
    </div>
    <div class="bg-gray-100 p-4 rounded-lg">
      <h3 class="text-base font-bold mb-2 font-mono">Escritorio/Seguros/</h3>
      <div class="font-mono text-xs text-gray-600 leading-relaxed">
        Clientes_FINAL.xlsx<br/>
        Clientes_FINAL_v2.xlsx<br/>
        Clientes_FINAL_v2_NUEVO.xlsx<br/>
        Polizas_2024.xlsx<br/>
        Polizas_2024_copia.xlsx<br/>
        Recibos_pendientes.xlsx<br/>
        Recibos_URGENTE_revisar.xlsx
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 5: LA SOLUCION -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">La Solucion</h1>
  <div class="grid grid-cols-2 gap-8 flex-1">
    <div>
      <h3 class="text-lg font-bold mb-3">Sistema Integral</h3>
      <div class="text-sm leading-loose">
        <span class="text-green-600">[+]</span> Base de datos centralizada y segura<br/>
        <span class="text-green-600">[+]</span> Gestion unificada de clientes y polizas<br/>
        <span class="text-green-600">[+]</span> Control automatico de cobranza<br/>
        <span class="text-green-600">[+]</span> Generacion de PDF y Excel en 1 clic<br/>
        <span class="text-green-600">[+]</span> Alertas de vencimientos automaticas<br/>
        <span class="text-green-600">[+]</span> Dashboard ejecutivo en tiempo real
      </div>
    </div>
    <div>
      <h3 class="text-lg font-bold mb-3">Beneficios</h3>
      <div class="text-sm leading-loose">
        • Reduccion de errores humanos en 90%<br/>
        • Ahorro de 4+ horas diarias en tareas<br/>
        • Informacion disponible al instante<br/>
        • Mejor seguimiento de cobranza<br/>
        • Reportes profesionales automaticos<br/>
        • Funciona sin conexion a internet
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 6: MODULOS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Modulos del Sistema</h1>
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="border-2 border-gray-800 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">C</div>
      <div class="text-sm font-bold mt-1">Clientes</div>
      <div class="text-xs text-gray-500">Fisicos y Morales</div>
    </div>
    <div class="border-2 border-gray-800 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">P</div>
      <div class="text-sm font-bold mt-1">Polizas</div>
      <div class="text-xs text-gray-500">Gestion completa</div>
    </div>
    <div class="border-2 border-gray-800 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">R</div>
      <div class="text-sm font-bold mt-1">Recibos</div>
      <div class="text-xs text-gray-500">Cobranza</div>
    </div>
    <div class="border-2 border-gray-800 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">D</div>
      <div class="text-sm font-bold mt-1">Dashboard</div>
      <div class="text-xs text-gray-500">KPIs en vivo</div>
    </div>
  </div>
  <div class="grid grid-cols-4 gap-4">
    <div class="border-2 border-gray-300 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-gray-500">A</div>
      <div class="text-sm font-bold mt-1">Auth</div>
      <div class="text-xs text-gray-500">Login seguro</div>
    </div>
    <div class="border-2 border-gray-300 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-gray-500">K</div>
      <div class="text-sm font-bold mt-1">Catalogos</div>
      <div class="text-xs text-gray-500">Configuracion</div>
    </div>
    <div class="border-2 border-gray-300 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-gray-500">F</div>
      <div class="text-sm font-bold mt-1">Docs</div>
      <div class="text-xs text-gray-500">PDF y Excel</div>
    </div>
    <div class="border-2 border-gray-300 rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-gray-500">S</div>
      <div class="text-sm font-bold mt-1">Config</div>
      <div class="text-xs text-gray-500">Ajustes</div>
    </div>
  </div>
</div>

---

<!-- SLIDE 7: DEMO DASHBOARD -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Dashboard - Vista General</h1>
  <div class="grid grid-cols-3 gap-4 flex-1">
    <div>
      <h3 class="text-sm font-bold text-[#2AABAB] mb-2">KPIs en Tiempo Real</h3>
      <div class="text-xs leading-relaxed">
        • Total clientes activos<br/>
        • Polizas vigentes<br/>
        • Recibos pendientes<br/>
        • Ingresos del periodo
      </div>
      <h3 class="text-sm font-bold text-[#2AABAB] mt-3 mb-2">Graficos</h3>
      <div class="text-xs leading-relaxed">
        • Distribucion por aseguradora<br/>
        • Estado de cobranza<br/>
        • Top 5 clientes
      </div>
      <h3 class="text-sm font-bold text-[#2AABAB] mt-3 mb-2">Alertas</h3>
      <div class="text-xs leading-relaxed">
        • Polizas por vencer<br/>
        • Recibos vencidos
      </div>
    </div>
    <div class="col-span-2">
      <img src="/screenshots/00-DASHBOARD-INITIAL.png" class="w-full rounded border border-gray-300" />
    </div>
  </div>
</div>

---

<!-- SLIDE 8: DEMO CLIENTES -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Modulo de Clientes</h1>
  <div class="grid grid-cols-3 gap-4 flex-1">
    <div>
      <h3 class="text-sm font-bold text-[#2AABAB] mb-2">Funcionalidades</h3>
      <div class="text-xs leading-relaxed">
        • Registro personas fisicas/morales<br/>
        • Validacion de RFC mexicano<br/>
        • Validacion de email<br/>
        • Busqueda por nombre/RFC<br/>
        • Filtros por tipo persona<br/>
        • Exportacion a Excel
      </div>
      <div class="mt-4 p-3 border-2 border-[#2AABAB] rounded text-center">
        <span class="text-2xl font-black text-[#2AABAB]">80+</span>
        <span class="text-xs ml-2">clientes</span>
      </div>
    </div>
    <div class="col-span-2">
      <img src="/screenshots/01-CLIENTES-VIEW.png" class="w-full rounded border border-gray-300" />
    </div>
  </div>
</div>

---

<!-- SLIDE 9: DEMO POLIZAS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Modulo de Polizas</h1>
  <div class="grid grid-cols-3 gap-4 flex-1">
    <div>
      <h3 class="text-sm font-bold text-[#2AABAB] mb-2">Estados Automaticos</h3>
      <div class="text-xs leading-relaxed">
        <span class="text-green-600">[V]</span> Vigente<br/>
        <span class="text-yellow-600">[!]</span> Por Renovar<br/>
        <span class="text-red-600">[X]</span> Vencida<br/>
        <span class="text-gray-500">[-]</span> Cancelada
      </div>
      <h3 class="text-sm font-bold text-[#2AABAB] mt-3 mb-2">Caracteristicas</h3>
      <div class="text-xs leading-relaxed">
        • Vinculacion con cliente<br/>
        • Calculo automatico primas<br/>
        • Generacion de recibos<br/>
        • Historial renovaciones
      </div>
      <div class="mt-4 p-3 border-2 border-[#2AABAB] rounded text-center">
        <span class="text-2xl font-black text-[#2AABAB]">350+</span>
        <span class="text-xs ml-2">polizas</span>
      </div>
    </div>
    <div class="col-span-2">
      <img src="/screenshots/01-POLIZAS-VIEW.png" class="w-full rounded border border-gray-300" />
    </div>
  </div>
</div>

---

<!-- SLIDE 10: DEMO RECIBOS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Modulo de Recibos</h1>
  <div class="grid grid-cols-3 gap-4 flex-1">
    <div>
      <h3 class="text-sm font-bold text-[#2AABAB] mb-2">Control de Cobranza</h3>
      <div class="text-xs leading-relaxed">
        • Generacion automatica<br/>
        • Estados: Pendiente/Pagado/Vencido<br/>
        • Registro fecha de pago<br/>
        • Historial por cliente
      </div>
      <h3 class="text-sm font-bold text-[#2AABAB] mt-3 mb-2">Documentos</h3>
      <div class="text-xs leading-relaxed">
        • Guia de pago en PDF<br/>
        • Exportacion masiva Excel<br/>
        • Filtros estado/fecha
      </div>
      <div class="mt-4 p-3 border-2 border-[#2AABAB] rounded text-center">
        <span class="text-2xl font-black text-[#2AABAB]">3,200+</span>
        <span class="text-xs ml-2">recibos</span>
      </div>
    </div>
    <div class="col-span-2">
      <img src="/screenshots/01-RECIBOS-VIEW.png" class="w-full rounded border border-gray-300" />
    </div>
  </div>
</div>

---

<!-- SLIDE 11: ARQUITECTURA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Arquitectura Tecnica</h1>
  <div class="grid grid-cols-3 gap-4 flex-1">
    <div class="border-2 border-[#2AABAB] rounded-lg p-4">
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">Frontend</h3>
      <div class="text-xs leading-loose">
        <strong>Electron</strong> v38.1.2<br/>
        <strong>TailwindCSS</strong> v3.4.17<br/>
        <strong>Chart.js</strong> v4.5.1<br/>
        <strong>JavaScript</strong> ES6+<br/>
        <strong>HTML5/CSS3</strong>
      </div>
    </div>
    <div class="border-2 border-[#2AABAB] rounded-lg p-4">
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">Backend</h3>
      <div class="text-xs leading-loose">
        <strong>Node.js</strong> v18+<br/>
        <strong>SQL.js</strong> v1.13.0<br/>
        <strong>PDFKit</strong> v0.17.2<br/>
        <strong>xlsx</strong> v0.18.5<br/>
        <strong>bcrypt</strong> v5.1.1
      </div>
    </div>
    <div class="border-2 border-[#2AABAB] rounded-lg p-4">
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">Testing</h3>
      <div class="text-xs leading-loose">
        <strong>Selenium</strong> v4.27.0<br/>
        <strong>ChromeDriver</strong> v132<br/>
        <strong>Page Objects</strong><br/>
        <strong>Custom Reporter</strong><br/>
        <strong>Screenshots</strong> auto
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 12: ARQUITECTURA MVC -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Patron MVC + IPC</h1>
  <div class="grid grid-cols-2 gap-6 flex-1">
    <div>
      <div class="bg-[#e8f5f5] p-4 rounded-lg mb-3">
        <h3 class="text-sm font-bold text-[#2AABAB] mb-2">MAIN PROCESS</h3>
        <div class="text-xs leading-relaxed">
          <strong>main.js</strong> - Punto de entrada<br/>
          <strong>ipc-handlers.js</strong> - Manejadores IPC<br/>
          <strong>preload.js</strong> - Puente seguro<br/>
          <strong>models/</strong> - Acceso a datos
        </div>
      </div>
      <div class="text-center text-lg my-2">↕ IPC Communication</div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-sm font-bold text-gray-600 mb-2">RENDERER PROCESS</h3>
        <div class="text-xs leading-relaxed">
          <strong>views/</strong> - Vistas HTML<br/>
          <strong>controllers/</strong> - Logica de UI<br/>
          <strong>assets/</strong> - CSS y JS
        </div>
      </div>
    </div>
    <div>
      <h3 class="text-sm font-bold mb-2">Ventajas del Patron</h3>
      <div class="text-xs leading-loose">
        • Separacion clara de responsabilidades<br/>
        • Seguridad: Context Isolation<br/>
        • Comunicacion segura via IPC<br/>
        • Facil mantenimiento y testing<br/>
        • Codigo modular y reutilizable
      </div>
      <h3 class="text-sm font-bold mt-4 mb-2">Estructura</h3>
      <div class="text-xs leading-relaxed font-mono bg-gray-100 p-3 rounded">
        /models - 7 archivos<br/>
        /views - 2 vistas + 6 partials<br/>
        /controllers - 6 controladores<br/>
        /assets - CSS + JS
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 13: BASE DE DATOS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Base de Datos</h1>
  <div class="grid grid-cols-2 gap-6 flex-1">
    <div>
      <h3 class="text-base font-bold mb-3">Modelo Relacional</h3>
      <div class="bg-gray-100 p-4 rounded-lg font-mono text-xs leading-relaxed">
        <strong>CLIENTES</strong> (id, rfc, nombre, tipo)<br/>
        &nbsp;&nbsp;|<br/>
        &nbsp;&nbsp;| 1:N<br/>
        &nbsp;&nbsp;↓<br/>
        <strong>POLIZAS</strong> (id, numero, cliente_id)<br/>
        &nbsp;&nbsp;|<br/>
        &nbsp;&nbsp;| 1:N<br/>
        &nbsp;&nbsp;↓<br/>
        <strong>RECIBOS</strong> (id, poliza_id, monto)
      </div>
      <p class="text-xs text-gray-500 mt-3"><strong>SQLite via SQL.js</strong> - BD embebida en WebAssembly</p>
    </div>
    <div>
      <h3 class="text-base font-bold mb-3">Tablas del Sistema</h3>
      <div class="text-sm">
        <div class="flex justify-between border-b border-gray-200 py-1"><span>clientes</span><strong>80+</strong></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>polizas</span><strong>350+</strong></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>recibos</span><strong>3,200+</strong></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>aseguradoras</span>15+</div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>ramos</span>10+</div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>periodicidades</span>5</div>
        <div class="flex justify-between py-1"><span>metodos_pago</span>5</div>
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 14: TESTING -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Testing Automatizado</h1>
  <div class="grid grid-cols-2 gap-6 flex-1">
    <div>
      <h3 class="text-base font-bold mb-3">Suites de Prueba</h3>
      <div class="text-sm">
        <div class="flex justify-between border-b border-gray-200 py-1"><span>Autenticacion</span><span>10 tests <span class="text-green-600">PASS</span></span></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>Clientes</span><span>20 tests <span class="text-green-600">PASS</span></span></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>Polizas</span><span>15 tests <span class="text-green-600">PASS</span></span></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>Recibos</span><span>12 tests <span class="text-green-600">PASS</span></span></div>
        <div class="flex justify-between border-b border-gray-200 py-1"><span>Catalogos</span><span>10 tests <span class="text-green-600">PASS</span></span></div>
        <div class="flex justify-between py-1"><span>Dashboard</span><span>26 tests <span class="text-green-600">PASS</span></span></div>
      </div>
      <p class="text-xs text-gray-500 mt-3">Selenium + Page Object Pattern</p>
    </div>
    <div class="flex flex-col gap-4">
      <div class="border-2 border-[#2AABAB] rounded-lg p-4 text-center">
        <div class="text-4xl font-black text-[#2AABAB]">93</div>
        <div class="text-sm mt-1">Tests Totales</div>
      </div>
      <div class="border-2 border-green-500 rounded-lg p-4 text-center">
        <div class="text-4xl font-black text-green-500">100%</div>
        <div class="text-sm mt-1">Cobertura Funcional</div>
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 15: SEGURIDAD -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Seguridad y Rendimiento</h1>
  <div class="grid grid-cols-2 gap-6 flex-1">
    <div>
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">Medidas de Seguridad</h3>
      <div class="text-sm leading-loose">
        <strong>bcrypt</strong> - Passwords hasheados<br/>
        <strong>Context Isolation</strong> - Renderer aislado<br/>
        <strong>IPC Seguro</strong> - Preload como puente<br/>
        <strong>Validacion</strong> - En todos los handlers<br/>
        <strong>nodeIntegration</strong> - false
      </div>
    </div>
    <div>
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">Metricas de Rendimiento</h3>
      <div class="text-sm">
        <div class="flex justify-between py-1"><span>Inicio app</span><strong>&lt; 3 seg</strong></div>
        <div class="flex justify-between py-1"><span>Carga vista</span><strong>&lt; 500 ms</strong></div>
        <div class="flex justify-between py-1"><span>Consulta BD</span><strong>&lt; 100 ms</strong></div>
        <div class="flex justify-between py-1"><span>Export Excel</span><strong>&lt; 5 seg</strong></div>
        <div class="flex justify-between py-1"><span>Generar PDF</span><strong>&lt; 1 seg</strong></div>
      </div>
      <p class="text-xs text-gray-500 mt-3">Optimizado para hardware basico</p>
    </div>
  </div>
</div>

---

<!-- SLIDE 16: RESUMEN -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Resumen del Proyecto</h1>
  <div class="grid grid-cols-4 gap-4 mb-4">
    <div class="border-2 border-[#2AABAB] rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">8</div>
      <div class="text-xs mt-1">Modulos</div>
    </div>
    <div class="border-2 border-[#2AABAB] rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">93</div>
      <div class="text-xs mt-1">Tests</div>
    </div>
    <div class="border-2 border-[#2AABAB] rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">3.6K</div>
      <div class="text-xs mt-1">Registros</div>
    </div>
    <div class="border-2 border-[#2AABAB] rounded-lg p-4 text-center">
      <div class="text-3xl font-black text-[#2AABAB]">2</div>
      <div class="text-xs mt-1">Plataformas</div>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div>
      <h3 class="text-sm font-bold mb-2">Entregables</h3>
      <div class="text-xs leading-relaxed">
        • Aplicacion de escritorio completa<br/>
        • Instaladores Windows y macOS<br/>
        • Documentacion tecnica y usuario<br/>
        • Suite de pruebas automatizadas<br/>
        • Codigo fuente documentado
      </div>
    </div>
    <div>
      <h3 class="text-sm font-bold mb-2">Objetivos Cumplidos</h3>
      <div class="text-xs leading-relaxed">
        • Eliminar dependencia de Excel<br/>
        • Automatizar control de cobranza<br/>
        • Generar reportes profesionales<br/>
        • Alertas de vencimientos<br/>
        • Sistema seguro y eficiente
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 17: GRACIAS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 flex flex-col justify-center items-center">
    <h1 class="text-7xl font-black">Gracias</h1>
    <p class="text-xl text-gray-500 mt-4">Sistema de Seguros VILLALOBOS</p>
  </div>
  <div class="grid grid-cols-2 gap-8">
    <div>
      <h3 class="text-xs font-bold mb-1">CLIENTE</h3>
      <p class="text-sm">Seguros VILLALOBOS</p>
    </div>
    <div class="text-right">
      <h3 class="text-xs font-bold mb-1">DESARROLLADO POR</h3>
      <p class="text-sm">COREX Solutions</p>
    </div>
  </div>
</div>

---

<!-- SLIDE 18: CONTACTO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-3xl font-black mb-4">Contacto</h1>
  <div class="grid grid-cols-2 gap-8 flex-1">
    <div>
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">COREX Solutions</h3>
      <div class="text-sm leading-loose">
        <strong>Email:</strong> corexsolutions.team@gmail.com<br/>
        <strong>Telefono:</strong> (+52) 414 119 2616<br/>
        <strong>Ubicacion:</strong> Av. de las Ciencias S/N,<br/>
        76230 Juriquilla, Queretaro
      </div>
    </div>
    <div>
      <h3 class="text-base font-bold text-[#2AABAB] mb-3">Equipo de Desarrollo</h3>
      <div class="text-sm leading-loose">
        Angel Salinas<br/>
        Sebastian Rivera<br/>
        Salvador Camacho<br/>
        Mariana Michelle
      </div>
    </div>
  </div>
  <div class="text-center mt-4">
    <p class="text-lg text-[#2AABAB] font-semibold">Preguntas?</p>
  </div>
</div>
