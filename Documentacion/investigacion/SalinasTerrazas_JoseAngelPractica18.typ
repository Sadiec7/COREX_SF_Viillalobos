#set page(
  paper: "us-letter",
  margin: (top: 2.54cm, bottom: 2.54cm, left: 2.54cm, right: 2.54cm),
  numbering: "1",
)

#set text(
  font: "Arial",
  size: 11pt,
  lang: "es",
)

#set par(justify: true, leading: 0.65em, first-line-indent: 0em)

#set heading(numbering: "1.1")

// Portada
#align(left)[
  #text(weight: "bold")[Universidad Autónoma de Querétaro]

  #v(0.65em)

  #text(weight: "bold")[Actividad 18. Modelos predictivos]

  #v(0.65em)

  *Materia:* Business Intelligence

  #v(0.65em)

  *Profesora:* Alejandra Vergara

  #v(0.65em)

  *Nombre del alumno:* José Ángel Salinas Terrazas

  #v(0.65em)

  *Expediente:* 315437

  #v(0.65em)

  *Fecha:* 11 de noviembre de 2025
]

#pagebreak()

// Índice
#outline(
  title: [Índice],
  indent: auto,
)

#pagebreak()

= Objetivo

Aplicar técnicas predictivas y de análisis avanzado en Power BI, utilizando herramientas visuales y modelos integrados para el análisis de datos de ventas, identificación de factores influyentes y generación de insights accionables para la toma de decisiones estratégicas.

#pagebreak()

= Preparación de Datos

La preparación de datos es fundamental para cualquier análisis en Power BI. En esta fase se establecen los fundamentos del modelo de datos que soportará todos los análisis posteriores.

== Importación y Configuración Inicial

El proceso inició con la importación del conjunto de datos de ventas en Power BI Desktop, seguido del acceso al Power Query Editor para realizar las transformaciones necesarias que aseguren la calidad e integridad de los datos.

== Transformación de Tipos de Datos

En el Power Query Editor se realizaron las siguientes validaciones y transformaciones de tipos de datos:

- *Date*: Configurado en formato Fecha para permitir análisis temporales
- *Sales*: Tipo numérico decimal para cálculos de ingresos
- *Units*: Tipo numérico entero para conteo de unidades vendidas
- *UnitPrice*: Tipo numérico decimal para precio unitario
- *MarketingSpend*: Tipo numérico decimal para inversión en marketing
- *IsHoliday*: Tipo booleano para identificar períodos festivos

Una vez verificados todos los tipos de datos, se aplicaron los cambios y se cerró el Power Query Editor.

== Creación de Tabla Calendar y Relaciones

Para facilitar los análisis temporales y el uso de inteligencia de tiempo, se creó una tabla Calendar utilizando la función DAX:

```dax
Calendar = CALENDARAUTO()
```

Esta tabla se generó desde *Modelado → Nueva tabla* y posteriormente se estableció una relación de uno a muchos entre `Calendar[Date]` y `ventas[Date]`, creando así un modelo estrella que optimiza el rendimiento de las consultas.

#pagebreak()

= Medidas DAX

Las medidas DAX son cálculos dinámicos que se evalúan en el contexto de filtrado actual, proporcionando flexibilidad y potencia al modelo de datos.

== Medidas Básicas Agregadas

Se crearon las siguientes medidas fundamentales en la tabla *ventas*:

```dax
Total Sales = SUM(ventas[Sales])
```

Esta medida calcula el total de ventas considerando el contexto de filtrado aplicado.

```dax
Total Units = SUM(ventas[Units])
```

Suma el total de unidades vendidas en el contexto actual.

```dax
Avg Unit Price = AVERAGE(ventas[UnitPrice])
```

Calcula el precio unitario promedio de los productos.

```dax
Marketing Spend = SUM(ventas[MarketingSpend])
```

Totaliza la inversión en marketing realizada.

== Columna Calculada para Segmentación

Para facilitar el análisis de productos de alto rendimiento, se creó una columna calculada:

```dax
TopSeller = IF(ventas[Units] >= 10, "Sí", "No")
```

Esta clasificación binaria identifica productos que vendieron 10 o más unidades como "TopSeller", permitiendo segmentar y analizar qué factores contribuyen al éxito de estos productos.

#pagebreak()

= Pronóstico de Ventas

El análisis predictivo de series temporales permite anticipar tendencias futuras y planificar estrategias basándose en patrones históricos.

== Configuración del Visual de Líneas

Se insertó una gráfica de líneas con la siguiente configuración:

- *Eje X*: Date (utilizando jerarquía de Año, Trimestre y Mes)
- *Eje Y (Valores)*: Total Sales

== Aplicación de Previsión Automática

En el panel de *Análisis*, se activó la función de *Previsión* con los siguientes parámetros:

- *Longitud de pronóstico*: 3 meses (90 días)
- *Nivel de confianza*: 95%
- *Estacionalidad*: Detección automática

#figure(
  image("Capturas/captura7.png", width: 100%),
  caption: [Dashboard completo con pronóstico de ventas a 3 meses y escenario What If]
)

== Análisis e Interpretación de Tendencias

Del análisis del pronóstico se observa:

*Patrón de ventas histórico:*
- Las ventas muestran variabilidad mensual significativa
- Se observan picos periódicos que sugieren estacionalidad
- El rango histórico oscila entre aproximadamente 4.0 y 4.5 millones

*Proyección futura:*
- La tendencia proyectada sugiere un incremento gradual en las ventas
- El área sombreada representa el intervalo de confianza del 95%
- La proyección alcanza niveles superiores a los 4.5 millones hacia 2025

*Conclusiones:*
- Existe un patrón estacional identificable que se puede aprovechar para planificación
- La tendencia general es positiva, sugiriendo crecimiento sostenido
- La variabilidad histórica indica la necesidad de mantener flexibilidad operativa

#pagebreak()

= Elementos Influyentes Clave

El análisis de elementos influyentes utiliza técnicas de machine learning para identificar qué factores tienen mayor impacto en que un producto sea clasificado como TopSeller.

== Configuración del Visual

Se insertó el visual *Elementos Influyentes Clave* con la siguiente configuración:

- *Analizar*: TopSeller (valor "Sí")
- *Explicar por*: Category, Region, MarketingSpend, IsHoliday, UnitPrice

== Los Tres Factores Predictivos Principales

El análisis identificó dos factores principales que influyen significativamente en la probabilidad de que un producto sea TopSeller:

#figure(
  image("Capturas/captura1.png", width: 95%),
  caption: [Factor 1: Región Sur incrementa 1.06x la probabilidad de TopSeller]
)

=== Factor 1: Región Sur (1.06x)

*Hallazgo:*

Cuando la región es Sur, la probabilidad de que un producto sea TopSeller aumenta 1.06 veces (incremento del 6%).

El gráfico de barras muestra que la región Sur tiene aproximadamente 60% de probabilidad de TopSeller, significativamente superior a las demás regiones (Este, Oeste, Norte y Centro con ~50%).

*Recomendación:*

Asignar mayor inventario y recursos de distribución a la región Sur. Analizar las características demográficas y preferencias de esta región para replicar estrategias exitosas en otras zonas geográficas. Considerar campañas de marketing específicas que amplifiquen esta ventaja natural.

#figure(
  image("Capturas/captura2.png", width: 95%),
  caption: [Factor 2: Categoría A incrementa 1.03x la probabilidad de TopSeller]
)

=== Factor 2: Categoría A (1.03x)

*Hallazgo:*

Cuando la categoría del producto es A, la probabilidad de ser TopSeller aumenta 1.03 veces (incremento del 3%).

El análisis visual indica que la categoría A tiene aproximadamente 58% de probabilidad de TopSeller, mientras que las categorías B y C están alrededor del 50%.

*Recomendación:*

Incrementar la inversión en desarrollo de productos de categoría A. Ampliar el portafolio de esta categoría mediante investigación de mercado que identifique nuevas oportunidades. Optimizar la cadena de suministro para productos de categoría A para evitar quiebres de stock.

=== Factor 3: Marketing Spend

*Hallazgo:*

Aunque no aparece como burbuja individual en las primeras posiciones, el análisis del dashboard muestra una correlación positiva entre MarketingSpend y Total Sales en el gráfico de dispersión.

Las tiendas con mayor inversión en marketing (3,700-3,800 mil) tienden a generar mayores ventas totales (20.5-21.5 millones).

*Recomendación:*

Establecer umbrales mínimos de inversión en marketing basados en el potencial de cada tienda o región. Implementar un modelo de asignación presupuestaria que priorice regiones con alto ROI histórico. Monitorear continuamente la eficiencia del gasto mediante KPIs de costo por adquisición.

#pagebreak()

= Análisis de Escenarios "What If"

Los parámetros "What If" permiten simular diferentes escenarios de negocio en tiempo real, facilitando la evaluación de decisiones estratégicas antes de su implementación.

== Creación del Parámetro

Se creó un parámetro desde *Modelado → Nuevo parámetro* con la siguiente configuración:

- *Nombre*: IncrementoMarketing
- *Tipo*: Decimal number
- *Mínimo*: 0 (0%)
- *Máximo*: 0.5 (50%)
- *Incremento*: 0.05 (5%)
- *Valor predeterminado*: 0

== Medidas DAX para Simulación

Se crearon las medidas necesarias para el análisis:

```dax
IncrementoMarketing Value =
SELECTEDVALUE(IncrementoMarketing[IncrementoMarketing Value])
```

```dax
Ventas Simuladas = [Total Sales] * (1 + [IncrementoMarketing Value])
```

== Visualización y Resultados

Se insertaron tarjetas que muestran:
- *Total Sales*: 104 millones (ventas actuales)
- *Ventas Simuladas*: Valor dinámico según el parámetro

Además, se agregó el control deslizante del parámetro al dashboard para manipulación interactiva.

#figure(
  image("Capturas/captura8.png", width: 100%),
  caption: [Escenario con 20% de incremento en marketing: Ventas proyectadas de 124.74 millones]
)

=== Escenario 1: Incremento del 20% (0.20)

*Resultados:*
- Total Sales actual: 104 millones
- Ventas Simuladas: 124.74 millones
- Incremento absoluto: 20.74 millones
- ROI: 19.94%

*Análisis:*

Un incremento del 20% en la inversión en marketing proyecta un aumento proporcional en ventas de 124.74 millones. Esto representa un ROI prácticamente lineal, sugiriendo que en este rango la inversión adicional mantiene su eficiencia.

#figure(
  image("Capturas/captura9.png", width: 100%),
  caption: [Escenario con 30% de incremento en marketing: Ventas proyectadas de 135.14 millones]
)

=== Escenario 2: Incremento del 30% (0.30)

*Resultados:*
- Total Sales actual: 104 millones
- Ventas Simuladas: 135.14 millones
- Incremento absoluto: 31.14 millones
- ROI: 29.94%

*Análisis:*

Con un incremento del 30%, las ventas proyectadas alcanzan 135.14 millones. El ROI sigue siendo aproximadamente proporcional, lo que indica que el modelo asume una relación lineal entre inversión en marketing y ventas.

== Recomendaciones de Escenarios

*Punto óptimo sugerido:*

Basándose en el modelo lineal presentado, cualquier incremento hasta el 50% mantendría proporcionalidad. Sin embargo, en la práctica se recomienda:

+ *Implementación gradual*: Comenzar con un incremento del 15-20% para validar las proyecciones
+ *Segmentación*: Aplicar incrementos mayores (25-30%) en regiones y categorías de alto rendimiento (Sur, Categoría A)
+ *Monitoreo*: Establecer métricas de seguimiento mensual para detectar rendimientos decrecientes
+ *Ajuste dinámico*: Estar preparado para reasignar presupuesto según resultados en tiempo real

*Consideraciones importantes:*

El modelo asume linealidad, pero en la realidad suelen existir rendimientos decrecientes. Se recomienda validar estos supuestos mediante pruebas piloto antes de comprometer grandes incrementos presupuestarios.

#pagebreak()

= Segmentación Predictiva

La segmentación mediante algoritmos de clustering permite identificar grupos homogéneos en los datos con características y comportamientos similares, facilitando estrategias diferenciadas.

== Configuración del Análisis de Segmentos

El visual de *Elementos Influyentes Clave* incluye la pestaña *Segmentos principales* que utiliza algoritmos de machine learning para detectar automáticamente grupos en los datos.

*Configuración:*
- *Campo analizado*: TopSeller (% de productos que son TopSeller)
- *Criterio de segmentación*: Tamaño de segmento
- *Detección automática*: Power BI determinó que 3 segmentos era el número óptimo

#figure(
  image("Capturas/captura3.png", width: 90%),
  caption: [Vista general de los 3 segmentos detectados automáticamente]
)

== Descripción de los Clusters Detectados

El análisis identificó 3 segmentos principales, clasificados por el porcentaje de TopSeller y el tamaño de cada grupo:

#figure(
  image("Capturas/captura4.png", width: 90%),
  caption: [Segmento 1: Category C + Region Sur (60.7% TopSeller)]
)

=== Segmento 1: Alto Rendimiento (60.7%)

*Características principales:*
- *Category*: C
- *Region*: Sur
- *% TopSeller*: 60.7%
- *Diferencia vs media global*: +2.4 puntos porcentuales (media: 58.3%)
- *Tamaño*: 2,422 registros (6.6% del total)

*Interpretación:*

Este segmento representa el grupo de mayor éxito, con productos de categoría C en la región Sur alcanzando la mayor tasa de TopSeller. Aunque la categoría C no destacaba individualmente como factor influyente, su combinación con la región Sur crea un segmento de alto valor.

*Estrategia sugerida:*

Maximizar la disponibilidad de productos categoría C en la región Sur. Investigar qué características específicas de estos productos resuenan con el mercado Sur. Considerar expansión de líneas similares y asegurar cadena de suministro robusta.

#figure(
  image("Capturas/captura5.png", width: 90%),
  caption: [Segmento 2: Category A + Region Este (59.8% TopSeller)]
)

=== Segmento 2: Rendimiento Sólido (59.8%)

*Características principales:*
- *Category*: A
- *Region*: Este
- *Diferencia vs media global*: +1.5 puntos porcentuales
- *% TopSeller*: 59.8%
- *Tamaño*: 2,468 registros (6.8% del total)

*Interpretación:*

Este segmento combina la categoría A (identificada como factor influyente individual) con la región Este. Aunque la región Este no era el principal factor geográfico, su combinación con categoría A genera resultados superiores a la media.

*Estrategia sugerida:*

Fortalecer la presencia de categoría A en la región Este mediante campañas de marketing dirigidas. Evaluar la posibilidad de replicar elementos exitosos de la región Sur en la región Este. Mantener niveles de inventario adecuados para evitar pérdida de oportunidades de venta.

#figure(
  image("Capturas/captura6.png", width: 90%),
  caption: [Segmento 3: Categorías no-B y no-C + Region Sur (57.4% TopSeller)]
)

=== Segmento 3: Rendimiento por Debajo de Media (57.4%)

*Características principales:*
- *Category*: No es B ni C (implica principalmente categoría A)
- *Region*: Sur
- *% TopSeller*: 57.4%
- *Diferencia vs media global*: -0.9 puntos porcentuales
- *Tamaño*: 2,486 registros (6.8% del total)

*Interpretación:*

Este segmento es interesante porque combina la región Sur (factor positivo) con categorías distintas a B y C, pero paradójicamente tiene el rendimiento más bajo de los tres segmentos. Esto sugiere que no todas las categorías funcionan igual en la región Sur.

*Estrategia sugerida:*

Analizar en detalle qué subcategorías dentro de este grupo tienen peor rendimiento. Considerar ajustes de producto, pricing o posicionamiento para mejorar resultados. Evaluar si ciertos productos deberían descontinuarse o reposicionarse en esta región.

== Visualización de Clustering Geográfico

#figure(
  image("Capturas/captura10.png", width: 100%),
  caption: [Gráfico de dispersión mostrando relación entre MarketingSpend y Total Sales por región (con clusters)]
)

El gráfico de dispersión en la parte inferior derecha del dashboard muestra la relación entre inversión en marketing (eje X) y ventas totales (eje Y), con puntos coloreados por región y posiblemente agrupados mediante clustering.

*Observaciones clave:*
- Existe una relación positiva general entre MarketingSpend y Total Sales
- Los puntos se distribuyen en un rango de 3,600 a 3,800 mil en MarketingSpend
- Las ventas totales varían entre aproximadamente 19.5 y 21.5 millones
- La dispersión sugiere que otros factores además del marketing influyen en las ventas

#pagebreak()

= Conclusiones

El análisis predictivo y avanzado realizado en Power BI ha generado insights accionables que fundamentan decisiones estratégicas basadas en datos:

+ *Factores de Éxito Identificados*
  - La región Sur incrementa 1.06x la probabilidad de TopSeller
  - La categoría A incrementa 1.03x la probabilidad de TopSeller
  - La inversión en marketing muestra correlación positiva con ventas

+ *Proyecciones y Tendencias*
  - El pronóstico a 3 meses sugiere crecimiento sostenido
  - La tendencia histórica muestra patrones estacionales aprovechables
  - El intervalo de confianza del 95% proporciona rangos realistas de variabilidad

+ *Simulación de Escenarios*
  - Un incremento del 20% en marketing proyecta ventas de 124.74 millones
  - Un incremento del 30% proyecta ventas de 135.14 millones
  - El modelo sugiere relación lineal en el rango analizado

+ *Segmentación Estratégica*
  - Segmento 1 (Category C + Sur): 60.7% TopSeller - prioridad máxima
  - Segmento 2 (Category A + Este): 59.8% TopSeller - alto potencial
  - Segmento 3 (no-B/no-C + Sur): 57.4% TopSeller - requiere optimización

Estas técnicas de análisis predictivo proporcionan una base cuantitativa sólida para la toma de decisiones, reduciendo la incertidumbre y permitiendo anticipar resultados de diferentes acciones estratégicas.

#pagebreak()

= Recomendaciones Estratégicas

Basándose en los resultados del análisis, se proponen las siguientes recomendaciones:

== Recomendación 1: Priorizar Segmentos de Alto Rendimiento

*Acción:*

Concentrar recursos en las combinaciones producto-región más exitosas:
- Aumentar inventario de productos categoría C en la región Sur
- Incrementar inventario de productos categoría A en región Este
- Asignar mayor presupuesto de marketing a estos segmentos

*Justificación:*

El análisis demuestra que estas combinaciones superan la media global de TopSeller (58.3%), alcanzando 60.7% y 59.8% respectivamente. Invertir en estos segmentos tiene mayor probabilidad de éxito.

*Métricas para monitorear:*
- Ventas totales en estos segmentos
- Tasa de TopSeller por segmento
- ROI de inversiones en inventario y marketing

== Recomendación 2: Incrementar Inversión en Marketing de Forma Gradual

*Acción:*

Implementar un incremento progresivo del presupuesto de marketing:
- Iniciar con un aumento del 20% en regiones Sur y Este
- Medir resultados durante 2-3 meses
- Ajustar el presupuesto según el ROI observado
- Considerar incrementos mayores (hasta 30%) solo si los resultados lo justifican

*Justificación:*

El análisis What If muestra que un incremento del 20% en marketing puede generar ventas de 124.74 millones (vs. 104 millones actuales). Un incremento del 30% proyecta 135.14 millones. Sin embargo, es importante validar estos supuestos antes de comprometer grandes presupuestos.

*Métricas para monitorear:*
- Ventas totales y simuladas
- ROI por región
- Costo de adquisición por cliente

La implementación de estas recomendaciones debe ir acompañada de monitoreo continuo mediante el dashboard de Power BI para ajustar las estrategias según los resultados reales.
