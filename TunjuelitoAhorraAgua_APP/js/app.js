/* V2: nueva presentación sobre la lógica y los datos originales de V1.
   El esquema de localStorage sigue siendo compatible con la primera versión. */
(function () {
  'use strict';
  const C = window.CalculadoraConsumo;
  const D = window.DatosDemo;
  const KEY = 'tunjuelito-agua-v1';
  const $ = selector => document.querySelector(selector);
  const fmt = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n);
  const money = n => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paths={gota:'M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12ZM8 15a4 4 0 0 0 4 4',hogar:'m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',grafico:'M4 20V10m8 10V4m8 16v-7M2 22h20',plan:'M4 5h16v16H4zM8 2v6m8-6v6M4 10h16m-12 4h3m2 3h3',reserva:'M6 4q6-3 12 0v16q-6 3-12 0ZM6 5q6 3 12 0M6 14q3-3 6 0t6 0',meta:'M21 12a9 9 0 1 1-9-9m0 5a4 4 0 1 0 4 4m-4 0 9-9m-5 0h5v5',campana:'M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10M10 21h4',info:'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',personas:'M9 8a3 3 0 1 0 0 .1M3 21v-3a6 6 0 0 1 12 0v3m2-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2',flecha:'M5 12h14m-5-5 5 5-5 5',check:'m5 12 4 4L19 6',brillo:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',ropa:'m8 3 4 3 4-3 6 5-4 4v9H6v-9L2 8Z',cocina:'M5 9h14v10H5ZM3 9h18M9 5V2m6 3V2',huella:'M8 15c-4 7 12 7 8 0l-4-4ZM4 9v1m5-5v1m6-1v1m5 3v1',libro:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3ZM12 6v16'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[n]||paths.gota}"/></svg>`;
  paths.mas = 'M5 12h.01M12 12h.01M19 12h.01';
  paths.atras = 'm14 6-6 6 6 6';
  paths.corazon = 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z';
  document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));

  let estado = D.crear('familia');
  let avisoCarga = '';
  let memoria = false;
  let tieneDatos = false;
  const borradores = new Map();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { estado = C.validar(JSON.parse(raw)); tieneDatos = true; }
  } catch (_) {
    avisoCarga = 'No pudimos recuperar tus datos. Puedes volver a empezar o cargar una familia de ejemplo.';
  }

  const fuente = 'https://bogota.gov.co/mi-ciudad/habitat/recomendaciones-del-acueducto-de-bogota-para-ahorrar-agua-en-tu-hogar';
  const externos = (url, text) => `<a class="external" href="${url}" target="_blank" rel="noopener noreferrer">${text} <span aria-hidden="true">↗</span></a>`;
  const nota = (text, clase = '') => `<aside class="note ${clase}">${icon('info')}<p>${text}</p></aside>`;
  const heading = (tag, title, text = '') => `<div class="heading"><span class="eyebrow">${tag}</span><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</div>`;
  const btn = (text, route, style = '') => `<a class="btn ${style}" href="#${route}">${text}${icon('flecha')}</a>`;
  const input = (name, label, value, min, max, step = '1', hint = '') => `<label class="field">${label}<input name="${name}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}" required>${hint ? `<small>${hint}</small>` : ''}</label>`;
  const checkbox = (name, text, checked, value = 'on') => `<label class="check-row"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span>${text}</span></label>`;
  const error = '<p class="form-error" role="alert"></p>';
  const volver = (text = 'Más opciones', url = 'mas') => `<a class="back-link" href="#${url}">${icon('atras')}${text}</a>`;
  const paso = n => `<div class="stepper" aria-label="Paso ${n} de 4"><div class="step-label"><span>PASO ${n} DE 4</span><span>${['Mi familia', 'Mis actividades', 'Mi agua', 'Mi plan'][n - 1]}</span></div><ol>${['familia', 'actividades', 'agua', 'plan'].map((id, i) => `<li class="${i < n ? 'done' : ''}"><a href="#${id}" aria-label="Paso ${i + 1}: ${['Mi familia', 'Mis actividades', 'Mi agua', 'Mi plan'][i]}" ${i === n - 1 ? 'aria-current="step"' : ''}><span>${i + 1}</span></a></li>`).join('')}</ol></div>`;
  const acciones = (back, forward, label) => `<div class="wizard-actions">${back ? `<a class="btn back" href="#${back}">${icon('atras')}Atrás</a>` : ''}<button class="btn" type="submit">${label || 'Continuar'}${icon('flecha')}</button></div><p class="save-note" id="save-status" role="status">Tus cambios válidos se guardan en este navegador.</p>`;

  function guardar() {
    try { localStorage.setItem(KEY, JSON.stringify(estado)); memoria = false; }
    catch (_) { memoria = true; }
    tieneDatos = true;
  }
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
  }
  function commit(next) { C.validar(next); estado = next; guardar(); }
  function data() { return { c: C.consumo(estado.recibos, estado.hogar.personas), p: C.plan(estado), h: C.habitos(estado.hogar) }; }

  function inicio() {
    return `<section class="welcome">
      <span class="local-pill">${icon('hogar')} HECHO PARA TUNJUELITO</span>
      <h1>Cuidar el agua<br>empieza en <em>familia.</em></h1>
      <p>Organiza el agua de tu hogar, conoce cuánto podrías necesitar y descubre cómo evitar desperdicios durante un corte.</p>
      <img class="family-art" src="assets/familia.svg" alt="Una familia junto a su reserva de agua, rodeada de casas, árboles y edificios del barrio" width="480" height="265">
      <div class="welcome-actions">${btn('Probar con una familia de ejemplo', 'ejemplos')}<button class="btn secondary" data-demo="nuevo">Crear mi propio hogar${icon('hogar')}</button></div>
      ${tieneDatos ? '<a class="resume" href="#plan">Continuar con mi hogar guardado →</a>' : ''}
      <div class="welcome-promise"><span>${icon('check')} Sin cuentas</span><span>${icon('check')} Paso a paso</span><span>${icon('check')} A tu ritmo</span></div>
      ${nota('<strong>Estás en un prototipo académico.</strong> Los cortes y avisos son simulados; no son información actual.', 'compact')}
    </section>`;
  }
  function ejemplos() {
    return volver('Volver al inicio', 'inicio') + heading('PROBEMOS EN FAMILIA', 'Elige un hogar', 'Todos son ejemplos ficticios. Después puedes cambiar sus datos.') +
      `<div class="example-list">${[
        ['familia', 'Familia de cuatro', '4 integrantes', 'Un día para cocinar, asearse y limpiar.', 'personas', 'mint'],
        ['mayor', 'Con un adulto mayor', '3 integrantes', 'Organizar juntos el acceso al agua.', 'corazon', 'peach'],
        ['mascota', 'Con una mascota', '2 integrantes', 'También incluimos su cuidado en el plan.', 'huella', 'blue']
      ].map(([id, title, sub, description, ico, color]) => `<button class="example ${color}" data-demo="${id}"><span class="example-icon">${icon(ico)}</span><span><strong>${title}</strong><small>${sub}</small><span class="example-description">${description}</span></span>${icon('flecha')}</button>`).join('')}</div>
      <button class="wide-link" data-demo="nuevo">Prefiero crear mi propio hogar →</button>`;
  }
  function familia() {
    const h = estado.hogar;
    return paso(1) + heading('EMPECEMOS POR USTEDES', '¿Quiénes viven en casa?', 'Conocer tu familia nos ayuda a organizar el agua.') +
      `<form id="familia-form" data-autosave>
        <section class="surface family-count"><label for="personas">Número de integrantes</label><div class="counter"><button type="button" data-count="-1" aria-label="Disminuir integrantes" ${h.personas <= 1 ? 'disabled' : ''}>−</button><input id="personas" name="personas" type="number" inputmode="numeric" min="1" max="30" step="1" value="${h.personas}" required aria-label="Número de integrantes"><button type="button" data-count="1" aria-label="Aumentar integrantes" ${h.personas >= 30 ? 'disabled' : ''}>+</button></div><span class="muted">Incluye a todas las personas del hogar.</span></section>
        <fieldset class="plain"><legend>¿Algo más sobre tu familia?</legend><div class="choice-list">
          ${opcion('mayor', 'Vive un adulto mayor', 'Mostraremos consejos para organizarse juntos.', h.mayor, 'corazon')}
          ${opcion('mascota', 'Tenemos mascotas', 'Incluiremos su cuidado en las actividades.', h.mascota, 'huella')}
        </div></fieldset>
        <p class="quiet">No pedimos nombres, direcciones ni información médica.</p>
        ${error}${acciones('inicio', 'actividades')}
      </form>`;
  }
  function opcion(name, title, desc, checked, ico, value = 'on') {
    return `<label class="choice"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span class="choice-icon">${icon(ico)}</span><span class="choice-text"><strong>${title}</strong><small>${desc}</small></span><span class="choice-check" aria-hidden="true">${icon('check')}</span></label>`;
  }
  function actividades() {
    const desc = { beber: 'Agua para las personas del hogar.', cocinar: 'Preparar los alimentos del día.', higiene: 'Incluye el lavado de manos y el aseo básico.', sanitario: 'Incluido dentro de los usos básicos.', limpieza: 'Las tareas que no pueden esperar.', ropa: 'Puedes dejar esta tarea para otro momento.', mascota: 'Agua para su cuidado en el hogar.' };
    const refs = D.referencias.filter(r => r.id !== 'mascota' || estado.hogar.mascota);
    return paso(2) + heading('UN DÍA EN TU HOGAR', '¿Qué necesitan hacer?', 'Los usos esenciales ya están incluidos. Elige las demás actividades.') +
      `<form id="actividades-form" data-autosave>
        <div class="activity-choices">${refs.map(r => r.esencial ? `<div class="essential"><span class="choice-icon">${icon(r.icono)}</span><span><strong>${r.nombre}</strong><small>${desc[r.id]}</small><span class="included">${icon('check')} Siempre incluida</span></span></div>` : opcion('seleccion', r.nombre, desc[r.id], estado.seleccion.includes(r.id), r.icono, r.id)).join('')}</div>
        <details class="customize"><summary>${icon('grafico')}<span>Personalizar cantidades<small>Opcional · valores de ejemplo</small></span><span aria-hidden="true">+</span></summary><div class="details-content"><p>Estas cantidades son supuestos de simulación, no recomendaciones oficiales. Ajústalas a tu hogar.</p>${refs.map(r => input('tasa-' + r.id, r.nombre, estado.tasas[r.id], .1, r.id === 'cocinar' ? 200 : 1000, .1, r.unidad)).join('')}</div></details>
        ${nota('No reduzcas el agua indispensable para beber, preparar alimentos o mantener la higiene para hacer coincidir el plan con tu reserva.')}
        ${error}${acciones('familia', 'agua')}
      </form>`;
  }
  function agua() {
    return paso(3) + heading('LO QUE TIENES A MANO', '¿Cuánta agua tienes?', 'Cuenta solo el agua potable almacenada dentro de tu hogar.') +
      `<form id="agua-form" data-autosave><section class="surface water-entry"><span class="water-icon">${icon('reserva')}</span><label for="reserva">Agua disponible</label><div class="liters-input"><input id="reserva" name="reserva" type="number" inputmode="decimal" min="0" max="100000" step="0.1" value="${estado.reserva}" required><span>litros</span></div><div class="quick-values" aria-label="Cantidades de ejemplo">${[60, 120, 180].map(n => `<button type="button" data-value="${n}" data-field="reserva">${n} L</button>`).join('')}</div></section>
        <section class="duration"><h2>¿Cuánto duraría el corte?</h2><p>Es una simulación, sin una fecha real.</p><div class="duration-options">${[12, 24, 48].map(n => `<button type="button" data-value="${n}" data-field="horas" aria-pressed="${estado.horas === n}">${n} <span>horas</span></button>`).join('')}</div>${input('horas', 'Duración del corte simulado (horas)', estado.horas, 1, 168, .5, 'Puedes elegir otra duración entre 1 y 168 horas.')}</section>
        ${nota('No sumes el agua de tanques comunales del conjunto. No suponemos que esa reserva esté disponible para tu hogar.')}
        ${error}${acciones('actividades', 'plan', 'Ver mi plan')}
      </form>`;
  }
  function plan() {
    const { p } = data();
    const falta = p.saldo < 0;
    return paso(4) + heading('YA TIENEN UN PUNTO DE PARTIDA', 'Un plan para tu familia', `${estado.hogar.personas} integrantes · ${fmt(estado.horas)} horas simuladas`) +
      `<section class="plan-card"><div class="plan-icon">${icon('gota')}</div><h2 class="simulation-result">Resultado de simulación</h2><p class="simulation-context">Cantidades de ejemplo; no son recomendaciones oficiales.</p><p>Para las actividades que elegiste,<br>podrían necesitar aproximadamente</p><div class="plan-number">${fmt(p.total)} <span>litros</span></div><div class="available"><span>Tienes registrados</span><strong>${fmt(estado.reserva)} L</strong></div><div class="balance ${falta ? 'shortage' : 'enough'}"><span class="balance-icon">${icon(falta ? 'info' : 'check')}</span><div><strong>${falta ? `Podrían faltar ${fmt(-p.saldo)} litros` : p.saldo === 0 ? 'Tu reserva coincide con el plan' : `Tendrías ${fmt(p.saldo)} litros por encima del plan`}</strong><p>Según esta simulación, con los datos que ingresaste.</p></div></div></section>
        <p class="estimate-caption">Es una estimación, no una garantía de abastecimiento.</p>
        <section class="organize-next" aria-labelledby="organize-title"><h2 id="organize-title">Ahora, organiza tu agua</h2><p>Reserva primero el agua para beber, preparar alimentos y la higiene básica. Revisa qué tareas de limpieza o lavado de ropa pueden esperar, sin reducir lo indispensable.</p>${btn('Revisar qué puede esperar', 'actividades')}</section>
        ${nota('<strong>Recibos:</strong> muestran el consumo histórico de periodos facturados.<br><strong>Este plan:</strong> estima el agua para las actividades y horas de un corte simulado. La diferencia entre ambos no demuestra ahorro real.')}

        <div class="section-title"><span class="round-icon">${icon('corazon')}</span><h2>¿Cómo pueden organizarse?</h2></div>
        <ol class="advice-steps"><li><strong>Primero, los usos esenciales.</strong><p>${falta ? 'Revisa el faltante y consulta alternativas de abastecimiento en los canales oficiales. No dejes de beber, preparar alimentos o realizar higiene básica.' : 'La diferencia a favor no significa que debas gastar o almacenar más. Revisa lo que realmente necesitas.'}</p></li><li><strong>Decidan qué puede esperar.</strong><p>Revisa la limpieza y el lavado de ropa. Pueden cambiar las actividades y volver a calcular.</p></li>${estado.hogar.mayor ? '<li><strong>Acompañen al adulto mayor.</strong><p>Acuerden quién facilita el acceso al agua, sin cambiar sus indicaciones individuales.</p></li>' : ''}${estado.hogar.mascota ? '<li><strong>Incluyan a su mascota.</strong><p>Revisa el agua prevista para su cuidado. El valor de ejemplo no es una cuota veterinaria.</p></li>' : ''}</ol>
        <details class="customize breakdown"><summary>${icon('libro')}<span>Así se reparten los litros<small>Resultado de simulación · ver cálculo</small></span><span aria-hidden="true">+</span></summary><div class="details-content">${p.filas.map(r => `<div class="breakdown-row"><span>${r.nombre}<small>${fmt(r.tasa)} × ${r.base === 'persona' ? estado.hogar.personas + ' personas × ' : ''}${fmt(estado.horas / 24)} días</small></span><strong>≈ ${fmt(r.total)} L</strong></div>`).join('')}<p class="quiet">Tasas diarias de ejemplo, editables en Mis actividades. Los cálculos usan todos los decimales; aquí se muestra uno.</p></div></details>
        <div class="plan-actions">${btn('Ajustar mi agua', 'agua')}${btn('Cambiar actividades', 'actividades', 'secondary')}</div>
        <a class="wide-link" href="#consejos">Ver consejos para mi hogar →</a>
        <p class="extension-note">Planificador y reserva: complementos del diseño original.</p>`;
  }
  function mas() {
    return heading('A TU RITMO', 'Un poco más para tu hogar', 'Consulta tus registros o ajusta lo que necesites.') +
      `<div class="menu-list">${[
        ['consumo', 'Mi consumo y recibos', 'Conoce cuánto consumen en casa.', 'grafico'],
        ['habitos', 'Mis hábitos', 'Ducha, cocina y actividades habituales.', 'gota'],
        ['metas', 'Mis metas', 'Explora un objetivo de ahorro.', 'meta'],
        ['avisos', 'Información y avisos', 'Fuentes oficiales y ejemplos de avisos.', 'campana'],
        ['configuracion', 'Configuración', 'Tu hogar, cantidades y demostración.', 'hogar']
      ].map(([url, title, sub, ico]) => `<a class="menu-item" href="#${url}"><span class="choice-icon">${icon(ico)}</span><span><strong>${title}</strong><small>${sub}</small></span>${icon('flecha')}</a>`).join('')}</div>`;
  }
  function consumo() {
    const { c } = data();
    const max = Math.max(1, ...estado.recibos.map(r => r.m3 * 1000 / r.dias));
    return volver() + heading('CONOCE TU CONSUMO', 'Mi consumo y recibos', 'Transcribe los datos de tu recibo. No necesitas subir una foto.') +
      `<section class="surface consumption-summary"><p>Promedio diario del hogar</p><div class="summary-number">${c ? fmt(c.diario) : '—'}<span>litros / día</span></div><div class="inline-result"><span>Por persona</span><strong>${c ? fmt(c.persona) : '—'} L / día</strong></div><p class="quiet">${c ? `${estado.recibos.length} recibos · ${c.dias} días registrados` : 'Agrega tu primer recibo para calcular el promedio.'}</p></section>
      ${nota('<strong>Consumo histórico:</strong> este promedio se obtiene de los recibos de periodos anteriores.<br><strong>Necesidad durante un corte:</strong> Mi plan la estima según actividades y duración, con valores de ejemplo. Son cálculos distintos; compararlos no demuestra ahorro real.')}
      <details class="customize" ${estado.recibos.length ? '' : 'open'}><summary>${icon('grafico')}<span>Agregar un recibo<small>Consumo, días y valor opcional</small></span><span aria-hidden="true">+</span></summary><form id="recibo-form" class="details-content">${input('m3', 'Consumo del recibo (m³)', '', 0, 10000, .001, '1 m³ equivale a 1.000 litros.')}${input('dias', 'Días del periodo facturado', 60, 1, 366)}<label class="field">Valor del recibo (COP, opcional)<input name="valor" type="number" inputmode="numeric" min="0" max="100000000" step="1" placeholder="Por ejemplo, 150000"></label><p class="quiet">Registra periodos distintos, sin superponerlos. El valor se guarda como información; no calcula ahorros económicos.</p>${error}<button class="btn" type="submit">Guardar recibo${icon('check')}</button></form></details>
      <h2 class="spaced">Tus recibos</h2><div class="receipts">${estado.recibos.length ? estado.recibos.map((r, i) => `<article class="receipt"><div class="receipt-heading"><strong>Periodo ${i + 1}</strong><button class="icon-button" data-delete="${r.id}" aria-label="Eliminar periodo ${i + 1}">×</button></div><span class="receipt-type">${r.demo ? 'Ejemplo ficticio' : 'Registro manual'} · ${r.dias} días</span><div class="receipt-values"><strong>${fmt(r.m3)} m³</strong><span>≈ ${fmt(r.m3 * 1000 / r.dias)} L/día</span></div><div class="bar" aria-hidden="true"><span style="width:${r.m3 * 1000 / r.dias / max * 100}%"></span></div><small>${r.valor === null ? 'Sin valor registrado' : money(r.valor)}</small></article>`).join('') : '<p class="empty">Tu historial empieza con el primer recibo.</p>'}</div>
      <details class="customize"><summary>${icon('info')}<span>¿Cómo lo calculamos?</span><span aria-hidden="true">+</span></summary><div class="details-content"><p>Sumamos los m³, los multiplicamos por 1.000 y dividimos entre la suma de días. Después dividimos por ${estado.hogar.personas} integrantes para obtener el promedio por persona.</p><p>Comparar periodos no demuestra ahorro por sí solo. No detectamos fechas duplicadas.</p></div></details>`;
  }
  function habitos() {
    const h = estado.hogar, calc = C.habitos(h);
    return volver() + heading('PEQUEÑAS ACCIONES DIARIAS', 'Mis hábitos', 'Estos datos estiman parte del consumo de un día habitual, sin corte.') +
      `<form id="habitos-form"><fieldset class="plain"><legend>¿Qué hacen habitualmente?</legend>${[['cocinar', 'Cocinar'], ['limpieza', 'Limpiar la casa'], ['ropa', 'Lavar ropa'], ['plantas', 'Cuidar plantas']].map(([v, t]) => checkbox('actividades', t, h.actividades.includes(v), v)).join('')}</fieldset>
        ${input('ducha', 'Duración de la ducha (minutos)', h.ducha, .1, 120, .1)}
        ${input('caudal', 'Agua que sale de la ducha (L/min)', h.caudal, .1, 40, .1, 'Ejemplo inicial: 8 litros por minuto. Puedes ajustarlo.')}
        ${input('cocina', 'Agua para cocinar (L/hogar/día)', h.cocina, .1, 200, .1, 'Este dato también se usa para cocinar en tu plan.')}
        ${checkbox('esEstimado', 'No conozco los datos: mostrar un rango de ejemplo de ±20 %', h.esEstimado)}${error}<button class="btn" type="submit">Guardar mis hábitos${icon('check')}</button></form>
        <section class="surface habit-result"><h2>Ducha y cocina, aproximadamente</h2><div class="summary-number">${fmt(calc.total)}<span>L / día</span></div><p>Ducha: ${fmt(calc.ducha)} L + cocina: ${fmt(calc.cocina)} L.</p>${h.esEstimado ? `<p>Rango ilustrativo: <strong>${fmt(calc.min)} a ${fmt(calc.max)} L/día.</strong></p>` : ''}<p class="quiet">Supone una ducha por persona al día. Es una estimación parcial; no reemplaza el recibo ni se suma a él. El rango no es una referencia oficial ni estadística.</p></section>`;
  }
  function metas() {
    const { c } = data(), m = C.meta(c ? c.diario : null, estado.meta);
    return volver() + heading('UN OBJETIVO PARA EXPLORAR', 'Mis metas', 'Piensa en desperdicios que podrías evitar, sin reducir los usos esenciales.') +
      `<section class="surface goal-result"><span class="round-icon">${icon('meta')}</span><p>Meta orientativa del hogar</p><div class="summary-number">${m === null ? '—' : fmt(m)}<span>L / día</span></div><p>${m === null ? 'Agrega un recibo para tener una base de comparación.' : `Sobre un promedio de ${fmt(c.diario)} L/día, la diferencia propuesta es ${fmt(c.diario - m)} L/día.`}</p></section>
        <form id="meta-form">${input('meta', 'Reducción que quieres explorar (%)', estado.meta, 0, 30, .5)}${error}<button class="btn" type="submit">Actualizar mi meta${icon('check')}</button></form>
        ${nota('<strong>Es un objetivo, no ahorro logrado.</strong> La meta no cambia los litros esenciales de tu plan. El 10 % inicial es solo un ejemplo; puedes elegir 0 % si no identificas desperdicios evitables.')}
        <a class="wide-link" href="#consejos">Ideas para evitar desperdicios →</a>`;
  }
  function listaConsejos() {
    const h = estado.hogar;
    const rows = [
      ['Cierra la llave en las pausas', 'Al cepillarte, evita dejar correr el agua sin usarla.', 'gota', true],
      ['Revisa las fugas', 'Comprueba llaves, duchas y tuberías: una pérdida pequeña también cuenta.', 'hogar', true]
    ];
    if (h.ducha > 5) rows.push(['Revisa el tiempo de la ducha', 'Tus hábitos indican duchas de más de cinco minutos. Identifica momentos en que corre agua sin usarla.', 'gota', true]);
    if (h.actividades.includes('ropa')) rows.push(['Aprovecha cada carga', 'Usa la lavadora con carga completa, de acuerdo con su capacidad.', 'ropa', true]);
    if (h.actividades.includes('cocinar')) rows.push(['Planea la preparación de alimentos', 'Separa el agua de cocina en tu plan. Conserva la necesaria para preparar los alimentos.', 'cocina', false]);
    if (h.mayor) rows.push(['Planeen juntos', 'Acuerden quién facilita el acceso al agua al adulto mayor. No cambiamos sus indicaciones individuales.', 'corazon', false]);
    if (h.mascota) rows.push(['Su cuidado también cuenta', 'Ajusta el agua de mascotas a las necesidades que conoces. El ejemplo no es una cuota veterinaria.', 'huella', false]);
    if (h.actividades.includes('plantas')) rows.push(['Separa los usos del agua', 'Planifica el cuidado de las plantas sin mezclar agua reutilizada con la reserva potable.', 'brillo', false]);
    return rows;
  }
  function consejos() {
    return heading('CUIDAR SIN COMPLICARSE', 'Pequeños hábitos que suman', 'Ideas para tu hogar, según las actividades que registraste.') +
      `<div class="tips">${listaConsejos().map(([t, s, ico, oficial], i) => `<article class="tip ${i === 0 ? 'featured' : ''}"><span class="round-icon">${icon(ico)}</span><h2>${t}</h2><p>${s}</p>${oficial ? externos(fuente, 'Fuente: Portal Bogotá / EAAB') : '<small>Orientación del prototipo, sin cantidades obligatorias.</small>'}</article>`).join('')}</div>${btn('Información y avisos', 'avisos', 'secondary')}`;
  }
  function avisos() {
    return volver('Volver a consejos', 'consejos') + heading('INFORMACIÓN CON ORIGEN CLARO', 'Información y avisos', 'Verifica la fuente antes de compartir un aviso.') +
      nota('<strong>SIMULACIÓN — NO ES UN AVISO REAL</strong><br>No recibimos turnos ni fechas de la EAAB. Estos avisos son ejemplos.', 'warning') +
      `<div class="section-heading"><h2>Avisos de ejemplo</h2><span>${3 - estado.leidos.length} sin leer</span></div><div class="notices">${[
        ['corte', 'Preparen juntos el corte simulado', `Tu plan está configurado para ${fmt(estado.horas)} horas. No corresponde a una fecha o corte real.`],
        ['meta', 'Revisen su meta', 'Comprueben los recibos y los desperdicios evitables antes de cambiar el objetivo.'],
        ['reserva', 'Actualicen el agua disponible', 'Revisen los litros almacenados cuando cambie la reserva. No es una lectura automática.']
      ].map(([id, t, s]) => `<article class="notice"><span class="simulation-label">SIMULACIÓN — NO ES UN AVISO REAL</span><h3>${t}</h3><p>${s}</p><button class="wide-link" data-read="${id}">${estado.leidos.includes(id) ? '✓ Leído · Marcar como no leído' : 'Marcar como leído'}</button></article>`).join('')}</div>
        <h2 class="spaced">Canales oficiales</h2><div class="source-list">${externos('https://www.acueducto.com.co/', 'Acueducto de Bogotá · EAAB')}${externos('https://bogota.gov.co/', 'Alcaldía · Portal Bogotá')}${externos(fuente, 'Consejos del Acueducto')}</div><p class="quiet">Revisa la fecha de las publicaciones. Los consejos citados no confirman un corte vigente. Los avisos se muestran solo aquí; no se envían al teléfono.</p>`;
  }
  function configuracion() {
    return volver() + heading('TU HOGAR, A TU MANERA', 'Configuración', 'Ajusta tus datos o vuelve a empezar la demostración.') +
      `<form id="nombre-form"><label class="field">Nombre para identificar tu hogar<input name="nombre" maxlength="50" value="${esc(estado.hogar.nombre)}" required></label><p class="quiet">Puede ser un nombre ficticio. No necesitas identificar a las personas.</p>${error}<button class="btn secondary" type="submit">Guardar nombre${icon('check')}</button></form>
        <div class="menu-list spaced">${[['familia', 'Cambiar integrantes', 'personas'], ['actividades', 'Personalizar cantidades', 'grafico'], ['habitos', 'Editar mis hábitos', 'gota'], ['ejemplos', 'Elegir otra familia de ejemplo', 'hogar']].map(([url, t, ico]) => `<a class="menu-item" href="#${url}"><span class="choice-icon">${icon(ico)}</span><strong>${t}</strong>${icon('flecha')}</a>`).join('')}</div>
        <section class="reset-area"><h2>Volver al ejemplo inicial</h2><p>Recupera la familia de cuatro y reemplaza tus registros actuales.</p><button class="btn secondary" data-reset>Reiniciar demostración</button></section>
        ${nota('Tus datos se guardan en este navegador. No hay cuentas ni sincronización entre dispositivos. Las funciones de la app usan archivos locales; abrir las fuentes requiere internet.')}`;
  }

  const screens = { inicio, ejemplos, familia, actividades, agua, plan, mas, consumo, habitos, metas, consejos, avisos, configuracion };
  // Compatibilidad con enlaces de V1.
  const aliases = { hogar: 'familia', planificador: 'actividades', reserva: 'agua' };
  function route() { const id = aliases[location.hash.slice(1)] || location.hash.slice(1); return screens[id] ? id : 'inicio'; }
  function navGroup(id) {
    if (['familia', 'actividades', 'agua', 'plan'].includes(id)) return 'plan';
    if (['consejos', 'avisos'].includes(id)) return 'consejos';
    return ['inicio', 'ejemplos'].includes(id) ? 'inicio' : 'mas';
  }
  function render(focus = false) {
    const id = route();
    $('#bottom-nav').innerHTML = [['inicio', 'Inicio', 'hogar'], ['plan', 'Mi plan', 'plan'], ['consejos', 'Consejos', 'brillo'], ['mas', 'Más', 'mas']].map(([url, label, ico]) => `<a href="#${url}" ${navGroup(id) === url ? 'aria-current="page"' : ''}><span>${icon(ico)}</span>${label}</a>`).join('');
    $('#contenido').innerHTML = (avisoCarga ? nota(esc(avisoCarga), 'warning') : '') + (memoria ? nota('No pudimos guardar en el navegador. Puedes seguir usando esta sesión.', 'warning') : '') + screens[id]();
    const form = $('#contenido form');
    if (form && borradores.has(form.id)) restoreDraft(form);
    if (focus) { $('#contenido').focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  // Los valores incompletos se conservan durante la navegación de esta sesión.
  // Solo datos válidos pasan al estado utilizado por la calculadora.
  function captureDraft(form) {
    const values = Array.from(form.elements).filter(el => el.name).map(el => ({ name: el.name, value: el.value, checked: el.checked, type: el.type }));
    borradores.set(form.id, values);
  }
  function restoreDraft(form) {
    for (const field of borradores.get(form.id)) {
      const el = Array.from(form.elements).find(el => el.name === field.name && (field.type !== 'checkbox' || el.value === field.value));
      if (el) { if (field.type === 'checkbox') el.checked = field.checked; else el.value = field.value; }
    }
    updateControls(form);
  }
  function readForm(form) {
    const f = new FormData(form), n = structuredClone(estado);
    switch (form.id) {
      case 'familia-form':
        n.hogar.personas = C.numero(f.get('personas'), 1, 30, true);
        n.hogar.mayor = f.has('mayor'); n.hogar.mascota = f.has('mascota');
        n.seleccion = n.seleccion.filter(id => id !== 'mascota');
        if (n.hogar.mascota) n.seleccion.push('mascota');
        break;
      case 'actividades-form':
        n.seleccion = D.referencias.filter(r => r.esencial && (r.id !== 'mascota' || n.hogar.mascota)).map(r => r.id).concat(f.getAll('seleccion'));
        D.referencias.filter(r => r.id !== 'mascota' || n.hogar.mascota).forEach(r => n.tasas[r.id] = C.numero(f.get('tasa-' + r.id), .1, r.id === 'cocinar' ? 200 : 1000));
        n.hogar.cocina = n.tasas.cocinar;
        break;
      case 'agua-form':
        n.reserva = C.numero(f.get('reserva'), 0, 100000);
        n.horas = C.numero(f.get('horas'), 1, 168);
        break;
      case 'habitos-form':
        n.hogar.actividades = f.getAll('actividades');
        n.hogar.ducha = C.numero(f.get('ducha'), .1, 120);
        n.hogar.caudal = C.numero(f.get('caudal'), .1, 40);
        n.hogar.cocina = C.numero(f.get('cocina'), .1, 200);
        n.hogar.esEstimado = f.has('esEstimado');
        n.tasas.cocinar = n.hogar.cocina;
        break;
      case 'meta-form': n.meta = C.numero(f.get('meta'), 0, 30); break;
      case 'nombre-form':
        n.hogar.nombre = f.get('nombre').trim();
        if (!n.hogar.nombre) throw new Error('Escribe un nombre para tu hogar.');
        break;
      case 'recibo-form':
        if (n.recibos.length >= 100) throw new Error('Puedes guardar hasta 100 recibos. Elimina uno para continuar.');
        n.recibos.push({ id: Date.now(), m3: C.numero(f.get('m3'), 0, 10000), dias: C.numero(f.get('dias'), 1, 366, true), valor: f.get('valor').trim() === '' ? null : C.numero(f.get('valor'), 0, 100000000), demo: false });
        break;
    }
    return C.validar(n);
  }
  function updateControls(form) {
    const person = form.elements.personas;
    if (person) form.querySelectorAll('[data-count]').forEach(b => b.disabled = Number(b.dataset.count) < 0 ? Number(person.value) <= 1 : Number(person.value) >= 30);
    form.querySelectorAll('[data-field="horas"]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.value) === Number(form.elements.horas.value))));
  }
  function inputChanged(form) {
    captureDraft(form);
    updateControls(form);
    if (!form.hasAttribute('data-autosave')) return;
    try {
      // validity.valid no presenta globos de error mientras la persona escribe.
      if (!Array.from(form.elements).every(el => !el.validity || el.validity.valid)) return;
      commit(readForm(form));
      borradores.delete(form.id);
      // Cocina es compartida: no dejar un borrador antiguo que la sobrescriba.
      if (form.id === 'actividades-form') borradores.delete('habitos-form');
      if ($('#save-status')) $('#save-status').textContent = memoria ? 'Cambios guardados solo durante esta sesión.' : 'Cambios guardados en este navegador.';
    } catch (_) { /* Se valida al continuar; nunca guardar entradas inválidas. */ }
  }
  function confirmAction(title, text, label, action) {
    const dlg = $('#confirmacion');
    $('#dialog-title').textContent = title; $('#dialog-text').textContent = text;
    dlg.querySelector('[value="ok"]').textContent = label;
    dlg.querySelector('[value="cancel"]').textContent = 'Cancelar';
    dlg.returnValue = '';
    dlg.onclose = () => { if (dlg.returnValue === 'ok') action(); };
    dlg.showModal();
  }
  function loadDemo(id) {
    const action = () => {
      borradores.clear(); avisoCarga = ''; commit(D.crear(id));
      if (route() === 'familia') render(true); else location.hash = 'familia';
      toast(id === 'nuevo' ? 'Tu hogar está listo para configurar.' : 'Familia de ejemplo cargada.');
    };
    if (tieneDatos) confirmAction('¿Cambiamos de hogar?', 'Se reemplazarán el perfil, los recibos y el plan guardados en este navegador.', id === 'nuevo' ? 'Crear mi hogar' : 'Cargar familia', action);
    else action();
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.skip')) { e.preventDefault(); $('#contenido').focus(); return; }
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.demo) loadDemo(b.dataset.demo);
    if (b.hasAttribute('data-reset')) confirmAction('¿Reiniciar la demostración?', 'Volverás a la familia de cuatro. Se reemplazarán los datos actuales.', 'Reiniciar', () => {
      borradores.clear(); avisoCarga = ''; commit(D.crear('familia')); location.hash = 'inicio'; render(true); toast('Demostración reiniciada.');
    });
    if (b.dataset.count) {
      const form = b.closest('form'), el = form.elements.personas;
      el.value = Math.min(30, Math.max(1, (Number(el.value) || 1) + Number(b.dataset.count)));
      el.setCustomValidity(''); inputChanged(form);
    }
    if (b.dataset.field) {
      const form = b.closest('form'), el = form.elements[b.dataset.field];
      el.value = b.dataset.value; el.setCustomValidity(''); inputChanged(form);
    }
    if (b.dataset.delete) confirmAction('¿Eliminar este recibo?', 'El promedio y la meta se recalcularán con los recibos restantes.', 'Eliminar recibo', () => {
      const n = structuredClone(estado); n.recibos = n.recibos.filter(r => r.id !== Number(b.dataset.delete)); commit(n); render(); toast('Recibo eliminado.');
    });
    if (b.dataset.read) {
      const n = structuredClone(estado), id = b.dataset.read;
      n.leidos = n.leidos.includes(id) ? n.leidos.filter(v => v !== id) : [...n.leidos, id];
      commit(n); render(); toast('Aviso actualizado.');
    }
  });
  document.addEventListener('invalid', e => {
    const el = e.target;
    if (!el.matches('input')) return;
    el.setCustomValidity(el.validity.valueMissing ? 'Completa este campo.' : el.validity.rangeUnderflow || el.validity.rangeOverflow ? `Ingresa un valor entre ${el.min} y ${el.max}.` : el.validity.stepMismatch ? 'Revisa los decimales o usa un número entero según el campo.' : 'Revisa el valor ingresado.');
    // Permite que el navegador enfoque un campo inválido dentro de un desplegable.
    const details = el.closest('details'); if (details) details.open = true;
  }, true);
  document.addEventListener('input', e => {
    if (!e.target.matches('input')) return;
    e.target.setCustomValidity('');
    const form = e.target.closest('#contenido form');
    if (form) { form.querySelector('.form-error').textContent = ''; inputChanged(form); }
  });
  document.addEventListener('submit', e => {
    if (e.target.method === 'dialog') return;
    const form = e.target;
    if (!form.closest('#contenido')) return;
    e.preventDefault();
    try {
      commit(readForm(form)); borradores.delete(form.id);
      if (form.id === 'habitos-form') borradores.delete('actividades-form');
      const next = { 'familia-form': 'actividades', 'actividades-form': 'agua', 'agua-form': 'plan' }[form.id];
      if (next) location.hash = next;
      else { render(); toast(memoria ? 'Cambios aplicados en esta sesión.' : 'Cambios guardados.'); }
    } catch (err) { form.querySelector('.form-error').textContent = err.message; }
  });
  window.addEventListener('hashchange', () => render(true));
  render();
})();
