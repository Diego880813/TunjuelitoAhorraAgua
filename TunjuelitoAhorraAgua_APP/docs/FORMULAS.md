# Cálculos y supuestos

## Fórmulas

Se calcula con precisión completa y se muestra como máximo un decimal, con formato colombiano.

**Recibos:**

- Litros de un recibo = consumo en m³ × 1.000.
- Promedio diario = suma de litros de los recibos ÷ suma de sus días.
- Promedio por persona = promedio diario ÷ integrantes.
- Cada periodo debe ser distinto y no superponerse. No se hace promedio simple de promedios cuando los periodos tienen duraciones diferentes.
- Sin recibos se muestra “—”, no un consumo total inventado.
- El valor monetario es informativo; no se utiliza para estimar tarifas.

**Hábitos (estimación parcial):**

- Ducha = minutos × caudal en L/min × integrantes; supone una ducha por persona al día.
- Cocina = litros por hogar y día ingresados.
- Total parcial = ducha + cocina.
- Si `esEstimado` está activo, rango = total parcial × 0,8 a total parcial × 1,2.
- El ±20 % es una elección pedagógica, no un intervalo estadístico ni una referencia institucional. Esta estimación no reemplaza al recibo ni se suma a él.

**Planificador:**

- Días simulados = horas ÷ 24.
- Actividad por persona = tasa × integrantes × días simulados.
- Actividad por hogar = tasa × días simulados.
- Necesidad = suma de las actividades incluidas.

| Actividad | Tasa inicial de ejemplo | Unidad | Selección inicial |
| --- | ---: | --- | --- |
| Agua para beber | 3 | L/persona/día | Siempre incluida |
| Preparar alimentos | 8 | L/hogar/día | Siempre incluida |
| Higiene básica | 10 | L/persona/día | Siempre incluida |
| Sanitario | 18 | L/persona/día | Siempre incluida |
| Limpieza | 10 | L/hogar/día | Incluida, se puede desmarcar |
| Lavado de ropa | 50 | L/hogar/día | Desmarcada, se puede incluir |
| Cuidado de mascotas | 2 | L/hogar/día | Incluida cuando hay mascota |

**Todas las tasas de esta tabla son ejemplos de simulación configurables, no recomendaciones oficiales, mínimos sanitarios ni una indicación de cuánta agua debe beber una persona o mascota.** La tasa de mascotas representa el cuidado de todas las mascotas del hogar y debe ajustarse. No se debe reducir lo indispensable para beber, preparar alimentos o realizar higiene. Ropa usa una tasa diaria simplificada, no un contador de ciclos. Se permite editar tasas aunque una actividad no esté seleccionada.

La cifra de cocina se comparte entre los hábitos y el plan. Los cambios válidos del paso Actividades se guardan automáticamente; desde Mis hábitos se aplican al pulsar Guardar mis hábitos. La duración de ducha de un día habitual no se incorpora como ducha completa al corte: el plan tiene su propia estimación de higiene básica.

**Reserva y meta:**

- Saldo = reserva potable registrada − necesidad del plan.
- Saldo negativo: faltante. Positivo: diferencia a favor del plan, no ahorro demostrado.
- La función de cálculo conserva cobertura = reserva ÷ necesidad × 100; la interfaz V2 prioriza los litros y el saldo para facilitar su lectura.
- Meta diaria = promedio de recibos × (1 − porcentaje ÷ 100).
- Diferencia propuesta = promedio − meta. La meta no modifica el plan ni constituye un mínimo de consumo seguro.

