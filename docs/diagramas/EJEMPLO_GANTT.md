# Diagrama de Gantt - Sistema de Seguros VILLALOBOS

## Ejemplo de Diagrama de Gantt con Mermaid.js

Este es un ejemplo del diagrama de Gantt que muestra las fases del proyecto desde agosto 2024.

```mermaid
gantt
    title Sistema de Gestion de Seguros VILLALOBOS - Cronograma
    dateFormat  YYYY-MM-DD

    section Fase 1: Analisis
    Levantamiento de requerimientos    :done, req, 2024-08-01, 14d
    Analisis de entidades              :done, ent, after req, 7d
    Especificacion SRS                 :done, srs, after ent, 7d

    section Fase 2: Diseño
    Diseño de base de datos            :done, db, 2024-08-22, 10d
    Diseño de arquitectura MVC         :done, mvc, after db, 7d
    Mockups de interfaz                :done, mock, after mvc, 10d

    section Fase 3: Infraestructura
    Configuracion Electron             :done, elec, 2024-09-15, 7d
    Sistema de autenticacion           :done, auth, after elec, 10d
    IPC y preload seguro               :done, ipc, after auth, 5d

    section Fase 4: Frontend
    Vista de Login                     :done, vlog, 2024-10-01, 5d
    Dashboard principal                :done, dash, after vlog, 10d
    Modulo de Clientes                 :done, cli, after dash, 14d
    Modulo de Polizas                  :active, pol, after cli, 14d

    section Fase 5: Backend
    Modelos de datos                   :active, mod, 2024-11-01, 21d
    IPC Handlers completos             :ipc2, after mod, 14d
    Integracion BD                     :integ, after ipc2, 10d

    section Fase 6: Testing
    Suite Selenium                     :test, 2024-11-20, 21d
    Tests E2E                          :e2e, after test, 14d
    Reportes automatizados             :rep, after e2e, 7d

    section Fase 7: Distribucion
    Optimizacion performance           :opt, 2024-12-15, 10d
    Generacion instaladores            :build, after opt, 7d
    Documentacion final                :docs, after build, 5d
    Release v1.0.0                     :milestone, rel, after docs, 0d
```

## Como visualizar este diagrama

### Opcion 1: GitHub
Sube este archivo `.md` a GitHub y el diagrama se renderizara automaticamente.

### Opcion 2: VS Code
Instala la extension "Markdown Preview Mermaid Support" y abre la preview.

### Opcion 3: Mermaid Live Editor
Copia el codigo entre las comillas y pegalo en: https://mermaid.live/

### Opcion 4: Exportar a imagen
Usa el Mermaid CLI:
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i EJEMPLO_GANTT.md -o gantt.png
```

---

## Leyenda de estados

- `done` = Completado (verde)
- `active` = En progreso (azul)
- `crit` = Critico (rojo)
- Sin estado = Pendiente (gris)
