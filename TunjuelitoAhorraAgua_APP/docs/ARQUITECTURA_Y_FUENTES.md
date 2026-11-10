# Coherencia con el proyecto CDIO

## Objetivo y documentos de referencia

Se revisaron el PDF `ArquitecturaAppAhorroAgua - DefinicionDeClases.pdf` (diagrama, componentes, flujo, clases y relaciones), el CSV `Matriz_Seleccion_Tunjuelito(MATRIZ_SELECCION).csv` y la infografía adjunta.

Se prioriza la arquitectura del PDF y la pregunta problema de la infografía: ayudar a hogares de conjuntos residenciales de Tunjuelito a reducir desperdicio durante periodos de racionamiento asociados a El Niño, abordando incertidumbre, desinformación, planificación cotidiana y manejo del agua almacenada.

No se afirma que exista racionamiento vigente. El contexto es el escenario estudiado durante el semestre.

## Correspondencia de componentes

| Diseño original | Implementación | Decisión |
| --- | --- | --- |
| AppMovil | `index.html`, CSS, pantallas en `app.js` | Sitio web adaptable; sin cuentas ni autenticación por solicitud del proyecto |
| Hogar | `estado.hogar` | Integrantes, nombre, localidad fija Tunjuelito y características del hogar |
| Recibo | `estado.recibos` | Registro manual, días y valor opcional; se omiten fotografía/OCR |
| HabitoConsumo | `ducha`, `caudal`, `cocina`, `esEstimado` y actividades | Estimación parcial de ducha/cocina, diferenciada de recibos |
| CalculadoraConsumo | `calculadora.js` | Promedio ponderado, cálculo por persona, hábitos, meta, plan y validación |
| MetaAhorro | `estado.meta` y función `meta` | Objetivo hipotético configurable; no acredita ahorro real |
| ReferenciaConsumo | `DatosDemo.referencias` | Ejemplos editables explícitos; no se atribuyen tasas no verificadas a entidades |
| GestorNotificaciones | Pantalla `avisos`, `estado.leidos` y acciones `data-read` | Tablero local de simulación; no permisos ni notificaciones del sistema operativo |
| EAAB y Alcaldía | Enlaces institucionales y consejos atribuidos | No se implementan las integraciones API del diagrama |
| Planificador | `estado.horas`, `tasas`, `seleccion`, función `plan` | Ampliación marcada en pantalla |
| Reserva doméstica | `estado.reserva` y comparación de saldo | Ampliación marcada en pantalla; no incluye tanques comunales |

Los objetos preservan las relaciones conceptuales sin exigir clases JavaScript. Hogar contiene hábitos y recibos; la calculadora los interpreta; los resultados se presentan como estimación/meta. La ausencia de integración institucional se muestra al usuario.

## De la pregunta problema a la función

| Dificultad | Respuesta del prototipo |
| --- | --- |
| Desinformación y bajo uso de canales oficiales | Fuentes visibles y separación explícita entre avisos simulados e información institucional |
| Incertidumbre sobre el recurso disponible | Reserva doméstica comparada con un plan explicable, sin garantía falsa de suficiencia |
| Dificultad para planificar actividades | Tasas por actividad, selección de labores opcionales y duración configurable |
| Desconocimiento de conservación | Consejos según hábitos y vínculos a publicaciones institucionales |
| Manejo inadecuado del agua almacenada | Balance entre reserva propia y necesidades estimadas, sin asumir acceso a reserva comunal |
| Falta de seguimiento al consumo | Recibos, promedio por hogar/persona e historial de periodos |

## Diferencias entre matriz e infografía

La cabecera del CSV indica pesos 30 %, 30 %, 15 %, 20 % y 20 %, que suman **115 %**. Sus totales publicados son 4,40; 3,60 y 3,73. El cálculo directo con los pesos escritos da 4,40; 3,60 y 3,73, pero no es una escala normalizada sobre 5 porque el peso total excede 100 %.

La infografía presenta otros criterios/pesos (30 %, 20 %, 20 %, 15 %, 15 %) y totales visuales 4; 3,5 y 3,3. No son la misma versión de la matriz. Además, para la tercera opción los valores de la infografía dan 3,35 antes de redondear; el 3,3 impreso no debe asumirse como redondeo estándar verificado.

No se modificaron los documentos ni se mezclaron puntajes. Ambos seleccionan la primera alternativa de aplicación. Se mantiene esa decisión; la matriz no alimenta cálculos domésticos. Antes de la entrega académica definitiva conviene acordar con el docente una única matriz normalizada y su regla de redondeo.

## Fuentes institucionales

Consultadas durante el desarrollo el 8 de noviembre de 2026:

- Portal Bogotá / recomendaciones del Acueducto: https://bogota.gov.co/mi-ciudad/habitat/recomendaciones-del-acueducto-de-bogota-para-ahorrar-agua-en-tu-hogar
  - Base de los consejos: cerrar la llave durante el cepillado, revisar fugas, usar cargas completas y evitar desperdicios al ducharse.
  - Se utiliza para prácticas generales, no para validar un turno o corte actual. La publicación tiene contexto histórico.
- EAAB: https://www.acueducto.com.co/
- Alcaldía / Portal Bogotá: https://bogota.gov.co/

No se encontraron ni se adoptaron cifras institucionales como fundamento de las tasas numéricas de este simulador. Por ello, todas las tasas, el rango ±20 % y la meta inicial del 10 % se identifican como supuestos pedagógicos. Los consejos adicionales de organización para adulto mayor y mascota se atribuyen al prototipo y no a las entidades.

## Diseño y dependencias

Gráficos SVG e iconos vectoriales creados para este prototipo. Fuentes del sistema; sin CDN, bibliotecas gráficas, analítica, fuentes remotas ni rastreadores. HTML semántico, etiquetas asociadas a campos, foco visible, avisos `aria-live` y confirmaciones nativas con `dialog`.

## Presentación V2

La arquitectura se mantiene. La interfaz organiza el plan en Familia, Actividades, Agua y Plan; recibos, hábitos, metas y configuración se acceden desde Más. Consejos tiene acceso directo y enlaza a avisos. Planificador y reserva se identifican como complementos al final de Mi plan. Los cambios válidos del asistente se guardan automáticamente; las demás ediciones utilizan botones de guardar. Las tasas, escenarios y funciones de cálculo permanecen idénticos a V1.
