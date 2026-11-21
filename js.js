// ===== Menú móvil =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const abierto = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', abierto);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// ===== Enlace activo según la sección visible =====
const links = [...nav.querySelectorAll('a')];
const obs = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) obs.observe(s); });

// ===== Calculadora solar =====
// Aparatos: nombre, potencia en vatios, horas de uso por día (valor inicial) y si viene marcado.
const aparatos = [
  { n: 'Bombillas LED (4)',     w: 36,  h: 5, on: true  },
  { n: 'Ventilador',            w: 60,  h: 8, on: true  },
  { n: 'Nevera pequeña',        w: 100, h: 8, on: false },
  { n: 'Televisor',             w: 80,  h: 4, on: false },
  { n: 'Carga de celulares',    w: 20,  h: 3, on: true  },
  { n: 'Computador portátil',   w: 60,  h: 4, on: false },
  { n: 'Bomba de agua pequeña', w: 250, h: 1, on: false }
];
// Supuestos (aproximados): puedes cambiarlos aquí.
const HORAS_SOL = 5.5;      // horas de sol pico por día
const EFICIENCIA = 0.75;    // pérdidas del sistema
const PANEL_KW = 0.4;       // panel de 400 W
const DESCARGA_UTIL = 0.8;  // porcentaje utilizable de la batería
const KG_CO2_KWH = 0.7;     // generador diésel de referencia

const cont = document.getElementById('appliances');
const filas = aparatos.map((a, i) => {
  const fila = document.createElement('div');
  fila.className = 'app';
  const lab = document.createElement('label');
  const chk = document.createElement('input');
  chk.type = 'checkbox'; chk.checked = a.on;
  const nom = document.createElement('span');
  nom.textContent = a.n + ' · ' + a.w + ' W';
  lab.append(chk, nom);
  const dere = document.createElement('div');
  const hrs = document.createElement('input');
  hrs.type = 'number'; hrs.min = 0; hrs.max = 24; hrs.step = 0.5; hrs.value = a.h;
  hrs.setAttribute('aria-label', 'Horas por día de ' + a.n);
  const peq = document.createElement('small');
  peq.textContent = ' h/día';
  dere.append(hrs, peq);
  fila.append(lab, dere);
  cont.appendChild(fila);
  chk.addEventListener('change', calcular);
  hrs.addEventListener('input', calcular);
  return { chk, hrs };
});

const barras = document.getElementById('bars');
function calcular() {
  let totalWh = 0;
  const partes = [];
  filas.forEach((f, i) => {
    const h = Math.min(24, Math.max(0, parseFloat(f.hrs.value) || 0));
    const wh = f.chk.checked ? aparatos[i].w * h : 0;
    totalWh += wh;
    if (wh > 0) partes.push([aparatos[i].n, wh]);
  });
  const kwh = totalWh / 1000;
  const paneles = kwh > 0 ? Math.ceil(kwh / (PANEL_KW * HORAS_SOL * EFICIENCIA)) : 0;
  const bateria = kwh / DESCARGA_UTIL;
  const co2 = kwh * 365 * KG_CO2_KWH;
  document.getElementById('rKwh').textContent = kwh.toFixed(2).replace('.', ',');
  document.getElementById('rPan').textContent = paneles;
  document.getElementById('rBat').textContent = bateria.toFixed(1).replace('.', ',');
  document.getElementById('rCo2').textContent = Math.round(co2).toLocaleString('es-CO');
  pintarBarras(partes, totalWh);
}

// ===== Infografía: reparto del consumo por aparato =====
function pintarBarras(partes, total) {
  barras.innerHTML = '';
  if (!partes.length) {
    const p = document.createElement('p');
    p.className = 'note';
    p.textContent = 'Marca al menos un aparato en la calculadora para ver el reparto.';
    barras.appendChild(p);
    return;
  }
  partes.sort((a, b) => b[1] - a[1]).forEach(([nombre, wh]) => {
    const pct = Math.round((wh / total) * 100);
    const fila = document.createElement('div');
    fila.className = 'bar';
    const et = document.createElement('span');
    et.textContent = nombre + ' (' + pct + ' %)';
    const b = document.createElement('div');
    fila.append(et, b);
    barras.appendChild(fila);
    requestAnimationFrame(() => { b.style.width = pct + '%'; });
  });
}
calcular();

// ===== Método científico (6 pasos) =====
// Edita los pasos 4 y 5 con los resultados reales de tu grupo.
const pasos = [
  ['1. Observación', 'Observamos que muchas comunidades rurales de La Guajira tienen acceso limitado a energía eléctrica o dependen de generadores a diésel, aunque la región tiene mucho sol y viento.'],
  ['2. Planteamiento del problema', '¿Cómo puede una herramienta digital ayudar a las comunidades a dimensionar y adoptar energía solar para cubrir sus necesidades básicas?'],
  ['3. Hipótesis', 'Si las familias cuentan con una calculadora que estima su consumo y el tamaño de un sistema solar, entenderán mejor cuánta energía necesitan y verán la energía solar como una opción posible.'],
  ['4. Experimentación', 'Desarrollamos un prototipo de calculadora solar y lo probamos con personas. [Agrega aquí cuántas personas lo probaron, quiénes eran y qué encuesta aplicaron.]'],
  ['5. Análisis de resultados', '[Escribe aquí los resultados reales de la encuesta: por ejemplo, qué porcentaje entendió mejor su consumo, cuántos consideraron útil la herramienta y qué mejoras sugirieron.]'],
  ['6. Conclusiones', 'Una herramienta digital sencilla puede ayudar a las familias a entender su consumo y a evaluar la energía solar. Para mejorarla se recomienda ajustarla con datos reales de radiación y costos de la región.']
];
const contPasos = document.getElementById('steps');
const cuerpo = document.getElementById('stepBody');
function mostrarPaso(k) {
  contPasos.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-selected', j === k));
  cuerpo.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = pasos[k][0];
  const p = document.createElement('p');
  p.textContent = pasos[k][1];
  cuerpo.append(h, p);
}
pasos.forEach((paso, k) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.textContent = paso[0];
  b.addEventListener('click', () => mostrarPaso(k));
  contPasos.appendChild(b);
});
mostrarPaso(0);
