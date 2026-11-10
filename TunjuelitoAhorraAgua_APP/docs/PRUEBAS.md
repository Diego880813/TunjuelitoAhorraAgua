# Verificación de la versión V2

## Revisión de los cuatro ajustes finales — 9 de noviembre de 2026

- Se volvieron a ejecutar las **14 pruebas originales: todas aprobadas**. Sintaxis correcta en los tres archivos JavaScript.
- Se compararon los bytes de calculadora, datos-demo y pruebas con el ZIP V2 anterior: idénticos. Los manejadores de formularios, navegación y persistencia tampoco cambiaron.
- Se recorrieron nuevamente las 13 pantallas en 320, 375, 390, 430, 768 y 1365 px: **78 comprobaciones sin desbordamiento horizontal**; el ancho útil descuenta la barra de desplazamiento.
- Se verificaron en navegador el rótulo «Resultado de simulación», la aclaración de cantidades no oficiales y la explicación de consumo histórico frente a necesidad estimada, tanto en Plan como en Recibos.
- El botón «Revisar qué puede esperar» abrió Actividades. Añadir ropa cambió 142 a 192 L; quitarla devolvió 142 L. Los usos esenciales permanecieron incluidos.
- Se cargaron adulto mayor (111 L) y mascota (82 L); Reiniciar recuperó la familia de cuatro y 142 L.
- Se comprobó el estilo calculado del texto secundario del resultado: 15 px y 24 px de interlineado. Se inspeccionaron visualmente el plan a 320 px y la acción a 390 px.
- En los registros consultados no aparecieron errores atribuibles a la app; sí mensajes de la extensión del navegador sobre metadatos.
- Las capturas se actualizaron. Continúan pendientes dispositivos físicos, Safari/Firefox y auditoría formal de accesibilidad. Los recorridos detallados de recibos, metas y validación que siguen corresponden a la revisión previa de V2; no se presentan como repetidos en esta revisión puntual.

## Registro de la revisión anterior de V2

Pruebas realizadas el 8 y 9 de noviembre de 2026 con hogares ficticios. Esta versión cambia la presentación y navegación; conserva los archivos originales de cálculo, escenarios y pruebas.

## Lógica y archivos

`node tests/calculadora.test.js`: **14 pruebas aprobadas**. Incluyen los tres escenarios, conversión m³/litros, promedio ponderado, cálculo por persona, meta, ausencia de recibos, rechazo de negativos/no finitos/división por cero, ceros válidos, escala 24/48 horas, selección de actividades, tasas, hábitos y validación del estado guardado.

Se comprobó sintaxis de los tres JavaScript, identidad de calculadora/datos/pruebas frente a V1 y rutas relativas locales. El ZIP incluye una carpeta raíz y todos los recursos.

## Interacciones verificadas en Chrome

Vista previa HTTP y marcos de prueba con altura de 844 px. Se recorrieron las 13 pantallas en anchos de 320, 375, 390, 430, 768 y 1365 px: **78 comprobaciones sin desbordamiento horizontal**. La barra de desplazamiento del navegador reduce 15 px el ancho útil de esos marcos. Se inspeccionaron visualmente inicio y plan móviles; las capturas están en `capturas/`.

| Acción | Resultado observado |
| --- | --- |
| Abrir inicio y ejemplos | Ilustración, botones y navegación inferior visibles |
| Familia de cuatro, botones +/− | Cambio de integrantes y paso a actividades |
| Añadir ropa, elegir 48 h y 400 L | Plan de 384 L, diferencia +16 L |
| Recargar y volver a Mi plan | Conservó 384 L y 400 L |
| Reserva −5 | Rechazada con mensaje en español |
| Volver a 24 h, 120 L, quitar ropa y cocina 10 | Plan de 144 L, faltante de 24 L |
| Añadir recibo de 12 m³/30 días | Promedio 380 L/día y 95 L/persona; 3 recibos, 150 días |
| Eliminar el recibo añadido | Confirmación y regreso a promedio 375 L/día |
| Hábitos: ducha 6 min, caudal 8 y cocina 10 | Estimación parcial 202 L; rango 161,6–242,4 L |
| Meta del 20 % | 300 L/día, diferencia propuesta 75 L |
| Marcar un aviso leído | Contador de 3 a 2 |
| Hogar con adulto mayor | Plan 111 L, reserva 120 L, +9 L y consejo específico |
| Hogar con mascota | Plan 82 L, reserva 100 L, +18 L y consejo específico |
| Crear hogar y escribir 0 integrantes | Validación 1–30; corregir a 5 permitió continuar |
| Hogar nuevo sin recibos | Indicador vacío, sin consumo inventado |
| Cambiar nombre | Guardado del nombre de prueba |
| Reiniciar demostración | Recuperó 4 personas, plan 142 L, reserva 120 L, faltante 22 L |
| Consola consultada en revisión final | Sin errores atribuibles a los archivos de la aplicación |

La consola mostró errores de una extensión del navegador al enviar metadatos, separados de la app. No se atribuyeron al prototipo.

## Límites

- No se ejecutó en teléfonos físicos, Safari o Firefox. Las dimensiones son una simulación de viewport en Chrome.
- No se probó file://, almacenamiento bloqueado, cuota agotada ni navegación con varias pestañas simultáneas.
- No se publicó en GitHub Pages ni se verificó un dominio público.
- No hubo auditoría formal WCAG, lectores de pantalla ni evaluación con residentes.
- Las 78 comprobaciones miden desbordamiento del documento; no equivalen a 78 pruebas funcionales independientes.
- El archivo automático distribuido prueba la lógica. Las interacciones de la tabla se probaron en el navegador durante el desarrollo.

## Antes de exponer

1. Reinicia desde Más → Configuración.
2. Elige Familia de cuatro y recorre los cuatro pasos: 142 L frente a 120 L.
3. Cambia la duración a 48 h: con las actividades iniciales, 284 L.
4. Recorre los otros hogares y las funciones de Más.
5. Explica que cantidades, metas y avisos son simulados. Reinicia al terminar.
