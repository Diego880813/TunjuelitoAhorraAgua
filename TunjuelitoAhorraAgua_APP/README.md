# Tunjuelito Ahorra Agua — V2

Prototipo académico de Proyecto de Diseño 1 (CDIO). HTML5, CSS3 y JavaScript, sin frameworks, cuentas, backend ni dependencias para ejecutarlo.

## Abrir en Visual Studio Code

1. Descomprime **TunjuelitoAhorraAgua_V2.zip** por completo.
2. En VS Code: **Archivo → Abrir carpeta → TunjuelitoAhorraAgua_V2**.
3. Abre `index.html` con doble clic desde el explorador. No requiere instalación ni compilación.
4. Para exponer y conservar los datos de forma consistente, usa una vista previa HTTP local, por ejemplo la extensión gratuita Live Server de VS Code.
5. Si ya tienes Python, otra opción es ejecutar `python -m http.server 5500` dentro de esta carpeta y abrir `http://localhost:5500`. Ctrl+C detiene esa vista previa.

Las pruebas se realizaron mediante HTTP. La apertura directa está prevista (no hay módulos ni fetch), pero no se verificó con file:// y su almacenamiento depende del navegador. No necesitas Node para usar la app.

## Ajustes finales antes de publicar (9 de noviembre de 2026)

- El plan muestra **Resultado de simulación** junto a las cifras y aclara que no son recomendaciones oficiales; el desglose conserva la misma identificación.
- Después del resultado, **Ahora, organiza tu agua** destaca el botón **Revisar qué puede esperar**, que abre el paso de actividades. Se prioriza beber, alimentación e higiene; no se reduce lo indispensable.
- Textos secundarios de explicación, ayudas, fuentes y advertencias ampliados a 15 px con interlineado de 1,6; navegación inferior a 14 px y color secundario más oscuro.
- En el plan y los recibos se explica que el consumo histórico corresponde a periodos facturados y el plan estima actividades durante un corte. Su diferencia no acredita ahorro real.

Se conserva el diseño V2, el recorrido de cuatro pasos y todas las funciones. No se ha publicado.

## Qué cambió en V2

La experiencia ahora es un asistente para la familia, pensado primero para celular: inicio ilustrado, botones amplios, cuatro pasos y navegación inferior **Inicio / Mi plan / Consejos / Más**. En computador conserva una columna centrada y legible.

Se mantienen sin cambios `calculadora.js`, `datos-demo.js` y las 14 pruebas de lógica originales. Se conserva el esquema de datos de V1. Planificador y reserva son complementos del diseño original, identificados al final del plan.

## Recorrido para presentar en clase

1. En Inicio, pulsa **Probar con una familia de ejemplo** y elige uno de los tres hogares.
2. **Mi familia:** cambia integrantes o indica adulto mayor/mascota.
3. **Mis actividades:** selecciona limpieza o ropa. Los usos esenciales permanecen incluidos. Las tasas editables están en **Personalizar cantidades**.
4. **Mi agua:** registra litros propios y una duración de corte ficticia. Pulsa **Ver mi plan**.
5. **Mi plan:** revisa necesidad, reserva y diferencia; abre **Así se reparten los litros** para explicar la fórmula.
6. En **Más**, prueba consumo y recibos, hábitos, metas, avisos y configuración. Consejos también tiene acceso directo.
7. En **Más → Configuración → Reiniciar demostración**, confirma para recuperar la familia inicial.

Para empezar sin recibos ni reserva, usa **Crear mi propio hogar**. Se propone un integrante y tasas de ejemplo editables.

## Funciones conservadas

- Tres escenarios ficticios y hogar desde cero.
- Integrantes, adulto mayor, mascotas y actividades habituales.
- Recibos manuales en m³, días y valor opcional COP; historial, barras y eliminación con confirmación.
- Promedio diario ponderado y por persona; hábitos de ducha/cocina y rango parcial ilustrativo.
- Plan por actividades de 1 a 168 horas; cantidades configurables y comparación con reserva potable doméstica.
- Meta orientativa de 0 a 30 %, consejos personalizados y enlaces institucionales.
- Avisos leídos/no leídos, todos rotulados **SIMULACIÓN — NO ES UN AVISO REAL**.
- Guardado local, validación, mensajes en español y reinicio.

## Escenarios y cálculos principales

Resultados iniciales para 24 horas y meta del 10 %:

| Hogar | Personas | Promedio L/día | Plan L | Reserva L | Diferencia L |
| --- | ---: | ---: | ---: | ---: | ---: |
| Familia de cuatro | 4 | 375 | 142 | 120 | -22 |
| Con adulto mayor | 3 | 300 | 111 | 120 | +9 |
| Con mascota | 2 | 220 | 82 | 100 | +18 |

- Litros de recibos = suma de m³ × 1.000.
- Promedio diario = litros totales ÷ suma de días; por persona = promedio ÷ integrantes.
- Plan = suma de tasas × (integrantes cuando corresponde) × horas ÷ 24.
- Diferencia = reserva − necesidad estimada.
- Meta = promedio diario × (1 − porcentaje ÷ 100).

Todas las tasas del plan son **ejemplos configurables, no recomendaciones oficiales ni mínimos sanitarios**. Una diferencia positiva no demuestra ahorro real ni garantiza abastecimiento. No se reduce automáticamente el agua esencial y no se incluye reserva comunal. Fórmulas, unidades y supuestos completos: [docs/FORMULAS.md](docs/FORMULAS.md).

## Guardado y privacidad

Los cambios válidos de los tres pasos de configuración se guardan automáticamente. Los formularios de recibos, hábitos, meta y nombre usan su botón de guardar. Los borradores incompletos se conservan al navegar durante la sesión, pero no sobreviven a una recarga. Cambiar de ejemplo, crear un hogar o reiniciar reemplaza los datos tras una confirmación.

Solo se guarda un hogar por navegador/origen, bajo `tunjuelito-agua-v1`. No se transmiten perfiles ni recibos. No hay sincronización entre dispositivos o pestañas. Si localStorage no está disponible, la app permite continuar en memoria. Las pantallas usan recursos locales; abrir fuentes oficiales requiere internet.

## Archivos

- `index.html`: estructura, navegación y recursos relativos.
- `css/styles.css`: diseño móvil y adaptación.
- `js/app.js`: pantallas, formularios y persistencia.
- `js/calculadora.js`: cálculo y validación; `js/datos-demo.js`: referencias y escenarios.
- `assets/`: ilustraciones e icono locales.
- `docs/`: fórmulas, coherencia con arquitectura, fuentes y pruebas.
- `capturas/`: inicio, plan y acción para organizar el agua en dimensiones móviles, capturados en navegador (algunas imágenes incluyen el marco de prueba).
- `tests/calculadora.test.js`: 14 pruebas originales; opcionalmente ejecuta `node tests/calculadora.test.js`.

## Publicar más adelante en GitHub Pages

Esta entrega no está publicada ni tiene QR.

1. Crea un repositorio y sube el **contenido** de esta carpeta: `index.html` debe quedar en la raíz; no subas solo el ZIP.
2. Abre **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Selecciona la rama `main` y `/(root)`, guarda y espera el despliegue.
4. Abre la dirección que muestre GitHub y verifica allí el recorrido antes de compartirla.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Limitaciones y mejoras

No hay conexión automática EAAB, fechas reales, sensores ni notificaciones push. No se certifica potabilidad, suficiencia ni ahorro efectivo. Los recibos no detectan solapamientos de fechas. Los cálculos son educativos y lineales por duración.

Se probaron dimensiones móviles en Chrome, no dispositivos físicos ni Safari/Firefox. No se realizó auditoría formal de accesibilidad o validación con residentes. Mejoras posibles: probar con familias de Tunjuelito, registrar fechas de recibos, permitir exportar datos e incorporar una fuente institucional verificada.

Consulta [docs/PRUEBAS.md](docs/PRUEBAS.md) para los resultados comprobados y pendientes.
