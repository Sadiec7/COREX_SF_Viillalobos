# Modelo Canvas - Sistema de Seguros VILLALOBOS

## Ejemplo de Modelo Canvas con Mermaid.js

El Business Model Canvas no tiene un tipo nativo en Mermaid, pero podemos representarlo usando un **diagrama de bloques** o **flowchart** estructurado.

### Opcion 1: Flowchart como Canvas

```mermaid
flowchart TB
    subgraph CANVAS["MODELO CANVAS - Sistema de Seguros VILLALOBOS"]
        direction TB

        subgraph ROW1[" "]
            direction LR
            subgraph KP["🤝 SOCIOS CLAVE"]
                kp1["Aseguradoras asociadas"]
                kp2["Proveedores de hosting"]
                kp3["Soporte tecnico IT"]
            end

            subgraph KA["⚙️ ACTIVIDADES CLAVE"]
                ka1["Desarrollo de software"]
                ka2["Gestion de polizas"]
                ka3["Atencion al cliente"]
                ka4["Mantenimiento del sistema"]
            end

            subgraph VP["💎 PROPUESTA DE VALOR"]
                vp1["Gestion integral de seguros"]
                vp2["Compatible con equipos lentos"]
                vp3["Interfaz moderna e intuitiva"]
                vp4["Alertas de vencimiento"]
                vp5["Auditoria completa"]
            end

            subgraph CR["💬 RELACION CON CLIENTES"]
                cr1["Soporte tecnico directo"]
                cr2["Actualizaciones periodicas"]
                cr3["Capacitacion inicial"]
            end

            subgraph CS["👥 SEGMENTOS DE CLIENTES"]
                cs1["Despachos de seguros"]
                cs2["PyMEs aseguradoras"]
                cs3["Agentes independientes"]
            end
        end

        subgraph ROW2[" "]
            direction LR
            subgraph KR["🔧 RECURSOS CLAVE"]
                kr1["Electron Framework"]
                kr2["SQLite Database"]
                kr3["Equipo de desarrollo"]
                kr4["Documentacion tecnica"]
            end

            subgraph CH["📢 CANALES"]
                ch1["Venta directa"]
                ch2["Sitio web"]
                ch3["Referidos"]
                ch4["Demostraciones"]
            end
        end

        subgraph ROW3[" "]
            direction LR
            subgraph COST["💰 ESTRUCTURA DE COSTOS"]
                cost1["Desarrollo y mantenimiento"]
                cost2["Infraestructura (servidores)"]
                cost3["Soporte al cliente"]
                cost4["Marketing y ventas"]
            end

            subgraph REV["💵 FUENTES DE INGRESO"]
                rev1["Licencia de software"]
                rev2["Suscripcion mensual/anual"]
                rev3["Soporte premium"]
                rev4["Personalizaciones"]
            end
        end
    end

    style VP fill:#e8f5e9,stroke:#4caf50,stroke-width:3px
    style CS fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style KP fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style KA fill:#fce4ec,stroke:#e91e63,stroke-width:2px
    style KR fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style CR fill:#e0f7fa,stroke:#00bcd4,stroke-width:2px
    style CH fill:#fff8e1,stroke:#ffc107,stroke-width:2px
    style COST fill:#ffebee,stroke:#f44336,stroke-width:2px
    style REV fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
```

### Opcion 2: Diagrama de Bloques (Mas Simple)

```mermaid
block-beta
    columns 5

    block:kp:1
        KP["SOCIOS CLAVE<br/>• Aseguradoras<br/>• Proveedores IT"]
    end

    block:middle:2
        columns 1
        KA["ACTIVIDADES CLAVE<br/>• Desarrollo<br/>• Gestion polizas"]
        KR["RECURSOS CLAVE<br/>• Electron<br/>• SQLite<br/>• Equipo dev"]
    end

    block:vp:1
        VP["PROPUESTA DE VALOR<br/>• Gestion integral<br/>• Equipos lentos<br/>• Alertas<br/>• Auditoria"]
    end

    block:right:1
        columns 1
        CR["RELACION CLIENTES<br/>• Soporte directo<br/>• Capacitacion"]
        CH["CANALES<br/>• Venta directa<br/>• Web<br/>• Demos"]
    end

    block:cs:1
        CS["SEGMENTOS<br/>• Despachos<br/>• PyMEs<br/>• Agentes"]
    end

    space:5

    block:cost:2
        COST["COSTOS: Desarrollo • Infra • Soporte • Marketing"]
    end

    space:1

    block:rev:2
        REV["INGRESOS: Licencias • Suscripcion • Soporte premium"]
    end

    style VP fill:#4caf50,color:#fff
    style CS fill:#2196f3,color:#fff
```

---

## Como visualizar

### GitHub
Sube este archivo a GitHub - se renderiza automaticamente.

### VS Code
Extension: "Markdown Preview Mermaid Support"

### Online
https://mermaid.live/ - Pega el codigo y exporta PNG/SVG

### CLI
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i EJEMPLO_CANVAS.md -o canvas.png -w 1200
```

---

## Nota sobre el Canvas

El Modelo Canvas tradicional tiene 9 bloques dispuestos en un layout especifico. Mermaid no tiene un tipo nativo "canvas", pero con `flowchart` y `subgraph` podemos aproximarlo bien.

Para un Canvas mas fiel al original, tambien podemos usar:
- **HTML/CSS Grid** - Control total del layout
- **PlantUML** - Con componentes personalizados
- **SVG directo** - Dibujo manual

¿Prefieres alguna de estas alternativas?
