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
.header img { height: 65px; }
.header span { font-size: 14px; color: #666; }
.center-slide { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.big-number { font-size: 96px; font-weight: 900; color: #2AABAB; line-height: 1; }
.big-text { font-size: 42px; font-weight: 900; line-height: 1.2; }
.hero-text { font-size: 96px; font-weight: 900; line-height: 1.1; }
.large-text { font-size: 72px; font-weight: 900; line-height: 1.2; }
.mega-text { font-size: 120px; font-weight: 900; line-height: 1; }
.medium-text { font-size: 32px; font-weight: 700; }
.accent { color: #2AABAB; }
.strike { text-decoration: line-through; color: #999; }
</style>

<!-- SLIDE 1: PORTADA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" style="height: 80px;" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 flex flex-col justify-center">
    <h1 class="text-5xl font-black leading-tight">Sistema de Seguros<br/>VILLALOBOS</h1>
    <p class="text-lg text-gray-500 mt-4">Una nueva satisfaccion para gestionar tu agencia</p>
  </div>
  <div class="text-right text-xs text-gray-500">
    <strong>COREX Solutions</strong> — Angel | Sebastian | Salvador | Mariana
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
  <div class="text-xl leading-loose">
    <div class="py-1">1. El Problema</div>
    <div class="py-1">2. La Solucion</div>
    <div class="py-1">3. Demo en Vivo</div>
    <div class="py-1">4. Bajo el Capo (Arquitectura)</div>
    <div class="py-1">5. Calidad y Numeros</div>
  </div>
</div>

---

<!-- SLIDE 3: CONTEXTO - EL CLIENTE -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <p class="text-xl text-gray-500 mb-4">Nuestro cliente</p>
    <h1 class="large-text">Seguros VILLALOBOS</h1>
    <p class="text-2xl text-gray-600 mt-6">Agencia de seguros en Queretaro<br/>Multiples aseguradoras, cientos de clientes</p>
  </div>
</div>

---

<!-- SLIDE 4: EL DOLOR - PREGUNTA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="hero-text">¿Como gestionaban<br/>su informacion?</h1>
  </div>
</div>

---

<!-- SLIDE 5: EL DOLOR - RESPUESTA -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="mega-text text-red-500">Excel.</h1>
    <p class="text-3xl text-gray-500 mt-8">Muchos. Demasiados.</p>
  </div>
</div>

---

<!-- SLIDE 6: CAOS DE ARCHIVOS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <div class="bg-gray-100 p-8 rounded-xl font-mono text-left">
      <p class="text-sm text-gray-500 mb-4">Escritorio/Seguros/</p>
      <p class="text-lg">Clientes_FINAL.xlsx</p>
      <p class="text-lg">Clientes_FINAL_v2.xlsx</p>
      <p class="text-lg">Clientes_FINAL_v2_<span class="text-red-500 font-bold">NUEVO</span>.xlsx</p>
      <p class="text-lg">Polizas_2024_<span class="text-red-500 font-bold">copia</span>.xlsx</p>
      <p class="text-lg">Recibos_<span class="text-red-500 font-bold">URGENTE</span>_revisar.xlsx</p>
    </div>
    <p class="text-base text-gray-500 mt-6">¿Te suena familiar?</p>
  </div>
</div>

---

<!-- SLIDE 7: LOS PROBLEMAS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-6">Los problemas reales</h1>
  <div class="flex-1 flex flex-col justify-center">
    <div class="text-xl leading-loose">
      <p class="py-2"><span class="text-red-500 font-bold">✗</span> Informacion duplicada y desactualizada</p>
      <p class="py-2"><span class="text-red-500 font-bold">✗</span> Recibos vencidos sin cobrar</p>
      <p class="py-2"><span class="text-red-500 font-bold">✗</span> Horas buscando datos de un cliente</p>
      <p class="py-2"><span class="text-red-500 font-bold">✗</span> Polizas que vencen sin que nadie se entere</p>
      <p class="py-2"><span class="text-red-500 font-bold">✗</span> Reportes manuales que nadie quiere hacer</p>
    </div>
  </div>
</div>

---

<!-- SLIDE 8: EL COSTO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <p class="text-lg text-gray-500 mb-2">Tiempo perdido cada dia</p>
    <h1 class="big-number">4+</h1>
    <p class="text-2xl font-bold">horas</p>
    <p class="text-base text-gray-500 mt-4">En tareas que deberian ser automaticas</p>
  </div>
</div>

---

<!-- SLIDE 9: LA SOLUCION -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <p class="text-xl text-gray-500 mb-4">Presentamos</p>
    <h1 class="large-text accent">Sistema de Seguros<br/>VILLALOBOS</h1>
    <p class="text-2xl text-gray-600 mt-8">Todo en un solo lugar. Sin Excel.</p>
  </div>
</div>

---

<!-- SLIDE 10: QUE HACE -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-4">Un sistema que...</h1>
  <div class="flex-1 flex flex-col justify-center">
    <div class="text-xl leading-loose">
      <p class="py-2"><span class="accent font-bold">✓</span> Centraliza clientes, polizas y recibos</p>
      <p class="py-2"><span class="accent font-bold">✓</span> Genera alertas automaticas de vencimientos</p>
      <p class="py-2"><span class="accent font-bold">✓</span> Exportacion de datos a Excel</p>
      <p class="py-2"><span class="accent font-bold">✓</span> Muestra KPIs en tiempo real</p>
      <p class="py-2"><span class="accent font-bold">✓</span> Funciona sin internet</p>
    </div>
  </div>
</div>

---

<!-- SLIDE 11: DEMO INTRO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="mega-text">Demo</h1>
    <p class="text-3xl text-gray-500 mt-8">Veamoslo en accion</p>
  </div>
</div>

---

<!-- SLIDE 12: DASHBOARD -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-2">Dashboard — Todo de un vistazo</h1>
  <div class="flex-1 overflow-hidden">
    <img src="/screenshots/00-DASHBOARD-INITIAL.png" class="w-full h-full object-cover rounded-lg shadow-lg" />
  </div>
</div>

---

<!-- SLIDE 13: CLIENTES -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-2">Modulo de Clientes</h1>
  <div class="flex-1 overflow-hidden">
    <img src="/screenshots/01-CLIENTES-VIEW.png" class="w-full h-full object-cover rounded-lg shadow-lg" />
  </div>
</div>

---

<!-- SLIDE 14: POLIZAS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-2">Modulo de Polizas</h1>
  <div class="flex-1 overflow-hidden">
    <img src="/screenshots/01-POLIZAS-VIEW.png" class="w-full h-full object-cover rounded-lg shadow-lg" />
  </div>
</div>

---

<!-- SLIDE 15: RECIBOS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-2">Modulo de Recibos y Cobranza</h1>
  <div class="flex-1 overflow-hidden">
    <img src="/screenshots/01-RECIBOS-VIEW.png" class="w-full h-full object-cover rounded-lg shadow-lg" />
  </div>
</div>

---

<!-- SLIDE 16: BAJO EL CAPO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="mega-text">Bajo el capo</h1>
    <p class="text-3xl text-gray-500 mt-8">La arquitectura tecnica</p>
  </div>
</div>

---

<!-- SLIDE 17: STACK -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-6">Stack Tecnologico</h1>
  <div class="grid grid-cols-3 gap-6 flex-1">
    <div class="bg-gray-50 rounded-xl p-6">
      <h3 class="text-lg font-bold accent mb-4">Frontend</h3>
      <p class="text-base leading-relaxed">Electron 38<br/>TailwindCSS 3.4<br/>Chart.js 4.5<br/>JavaScript ES6+</p>
    </div>
    <div class="bg-gray-50 rounded-xl p-6">
      <h3 class="text-lg font-bold accent mb-4">Backend</h3>
      <p class="text-base leading-relaxed">Node.js 18+<br/>SQLite (SQL.js)<br/>PDFKit<br/>bcrypt</p>
    </div>
    <div class="bg-gray-50 rounded-xl p-6">
      <h3 class="text-lg font-bold accent mb-4">Arquitectura</h3>
      <p class="text-base leading-relaxed">Patron MVC<br/>IPC Seguro<br/>Context Isolation<br/>Preload Bridge</p>
    </div>
  </div>
</div>

---

<!-- SLIDE 18: ARQUITECTURA VISUAL -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-4">Arquitectura MVC + IPC</h1>
  <div class="flex-1 flex items-center justify-center gap-8">
    <div class="bg-[#e8f5f5] rounded-xl p-6 text-center">
      <h3 class="font-bold accent mb-3">MAIN PROCESS</h3>
      <p class="text-sm">main.js<br/>ipc-handlers.js<br/>models/</p>
    </div>
    <div class="text-4xl">↔</div>
    <div class="bg-gray-100 rounded-xl p-6 text-center">
      <h3 class="font-bold text-gray-600 mb-3">RENDERER</h3>
      <p class="text-sm">views/<br/>controllers/<br/>assets/</p>
    </div>
  </div>
  <p class="text-center text-sm text-gray-500 mt-4">Comunicacion segura via IPC • Context Isolation activado • Sin acceso directo a Node</p>
</div>

---

<!-- SLIDE 19: TESTING INTRO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <p class="text-lg text-gray-500 mb-2">Tests automatizados</p>
    <h1 class="big-number">93</h1>
    <p class="text-2xl font-bold accent">100% pasando</p>
  </div>
</div>

---

<!-- SLIDE 20: TESTING DETALLE -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-4">Cobertura de Testing</h1>
  <div class="grid grid-cols-3 gap-4 flex-1">
    <div class="border-2 border-green-500 rounded-xl p-4 text-center">
      <p class="text-3xl font-black text-green-500">10</p>
      <p class="text-sm">Autenticacion</p>
    </div>
    <div class="border-2 border-green-500 rounded-xl p-4 text-center">
      <p class="text-3xl font-black text-green-500">20</p>
      <p class="text-sm">Clientes</p>
    </div>
    <div class="border-2 border-green-500 rounded-xl p-4 text-center">
      <p class="text-3xl font-black text-green-500">15</p>
      <p class="text-sm">Polizas</p>
    </div>
    <div class="border-2 border-green-500 rounded-xl p-4 text-center">
      <p class="text-3xl font-black text-green-500">12</p>
      <p class="text-sm">Recibos</p>
    </div>
    <div class="border-2 border-green-500 rounded-xl p-4 text-center">
      <p class="text-3xl font-black text-green-500">26</p>
      <p class="text-sm">Dashboard</p>
    </div>
    <div class="border-2 border-green-500 rounded-xl p-4 text-center">
      <p class="text-3xl font-black text-green-500">10</p>
      <p class="text-sm">Catalogos</p>
    </div>
  </div>
  <p class="text-center text-sm text-gray-500 mt-4">Selenium WebDriver • Page Object Pattern • Screenshots automaticos</p>
</div>

---

<!-- SLIDE 21: RESULTADOS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="text-3xl font-black mb-8">El resultado</h1>
    <div class="grid grid-cols-2 gap-12 w-full max-w-2xl">
      <div class="text-center">
        <p class="text-7xl font-black accent">8</p>
        <p class="text-base text-gray-500 mt-2">Modulos</p>
      </div>
      <div class="text-center">
        <p class="text-7xl font-black accent">93</p>
        <p class="text-base text-gray-500 mt-2">Tests</p>
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 22: ANTES Y DESPUES -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <h1 class="text-2xl font-black mb-6 text-center">Antes vs Despues</h1>
  <div class="grid grid-cols-2 gap-8 flex-1">
    <div class="bg-red-50 rounded-xl p-6">
      <h3 class="text-lg font-bold text-red-500 mb-4">Antes</h3>
      <p class="text-base leading-relaxed text-gray-600">
        <span class="strike">Archivos Excel por todos lados</span><br/>
        <span class="strike">4+ horas en tareas manuales</span><br/>
        <span class="strike">Recibos vencidos olvidados</span><br/>
        <span class="strike">Sin visibilidad del negocio</span><br/>
        <span class="strike">Sin control de vencimientos</span>
      </p>
    </div>
    <div class="bg-green-50 rounded-xl p-6">
      <h3 class="text-lg font-bold text-green-600 mb-4">Despues</h3>
      <p class="text-base leading-relaxed">
        <strong>Todo centralizado</strong><br/>
        <strong>Automatizacion completa</strong><br/>
        <strong>Alertas proactivas</strong><br/>
        <strong>Dashboard en tiempo real</strong><br/>
        <strong>Control de vencimientos</strong>
      </p>
    </div>
  </div>
</div>

---

<!-- SLIDE 23: GRACIAS -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="mega-text">Gracias</h1>
    <p class="text-3xl text-gray-500 mt-6 mb-12">Sistema de Seguros VILLALOBOS</p>
    <p class="text-4xl accent font-bold">¿Preguntas?</p>
  </div>
</div>

---

<!-- SLIDE 24: CONTACTO -->
<div class="slide-container">
  <div class="header">
    <img src="/corex-logo.png" />
    <span>Diciembre 2025</span>
  </div>
  <div class="flex-1 center-slide">
    <h1 class="text-3xl font-black mb-8">COREX Solutions</h1>
    <div class="text-lg leading-loose text-gray-600">
      <p>corexsolutions.team@gmail.com</p>
      <p>(+52) 414 119 2616</p>
      <p class="text-sm mt-4">Juriquilla, Queretaro</p>
    </div>
    <div class="flex gap-8 mt-8 text-sm text-gray-500">
      <span>Angel Salinas</span>
      <span>Sebastian Rivera</span>
      <span>Salvador Camacho</span>
      <span>Mariana Michelle</span>
    </div>
  </div>
</div>
