/*
 * Cuestionario «Electricidad básica» · 4.º ESO · Tema 2
 * Basado en los apuntes del alumnado: la electricidad y sus ventajas, el circuito eléctrico y sus elementos,
 * magnitudes eléctricas básicas, la ley de Ohm, circuitos en serie y en paralelo, la resistencia y el LED.
 * Banco de preguntas compartido por la página del alumno y el panel del profesor.
 *
 * Para cambiar los grupos, edita GRUPOS.
 * Cada pregunta: k = tipo (test | vf | cerrada | abierta | reflexion | critico), s = segundos,
 * test → o (opciones) y a (índice correcto) · vf → a (true/false) · cerrada → ok (respuestas válidas).
 * Puntos: TODAS las preguntas valen lo mismo (1 punto). La nota es sobre 10, con centésimas.
 * Corrección: todas se corrigen solas. Las abiertas llevan una rúbrica «rb» con sus ideas clave (ver ../correccion.js);
 * el profesor puede cambiar su puntuación en el panel.
 */
(function () {
  'use strict';
  var GRUPOS = ['4º ESO A', '4º ESO B', '4º ESO C', '4º ESO D'];

  /* ---------- Símbolos eléctricos (dibujados como en los apuntes) ---------- */
  var T = 'stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  function caja(cont, w, h) { return '<svg viewBox="0 0 ' + (w || 120) + ' ' + (h || 44) + '" width="' + (w || 120) + '" height="' + (h || 44) + '" style="vertical-align:middle;color:var(--ink)" aria-hidden="true">' + cont + '</svg>'; }
  var SIMB = {
    pila: '<path d="M8 22H52M68 22H112" ' + T + '/><path d="M52 6V38" ' + T + '/><path d="M68 13V31" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
      '<text x="40" y="12" font-size="12" fill="currentColor" font-family="sans-serif">+</text>',
    lampara: '<path d="M8 22H44M76 22H112" ' + T + '/><circle cx="60" cy="22" r="15" ' + T + '/><path d="M49 11L71 33M71 11L49 33" ' + T + '/>',
    motor: '<path d="M8 22H44M76 22H112" ' + T + '/><circle cx="60" cy="22" r="15" ' + T + '/><text x="60" y="28" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor" font-family="sans-serif">M</text>',
    interruptor: '<path d="M8 30H40M80 30H112" ' + T + '/><circle cx="42" cy="30" r="3" ' + T + '/><circle cx="78" cy="30" r="3" ' + T + '/><path d="M44 28L74 10" ' + T + '/>',
    resistencia: '<path d="M8 22H34L40 10L50 34L60 10L70 34L80 10L86 22H112" ' + T + '/>',
    led: '<path d="M8 24H46M74 24H112" ' + T + '/><path d="M46 12V36L72 24Z" ' + T + '/><path d="M74 12V36" ' + T + '/>' +
      '<path d="M66 10L76 2M74 2H76V4M76 14L86 6M84 6H86V8" ' + T + '/>'
  };
  function s(nombre) { return caja(SIMB[nombre]); }
  // Circuito del ejercicio 3: pila, interruptor y motor en serie
  var CIRCUITO = caja('<rect x="20" y="20" width="200" height="90" ' + T + ' stroke-dasharray="0"/>' +
    '<rect x="8" y="50" width="24" height="30" fill="var(--surface)" stroke="none"/><path d="M6 58H34" ' + T + '/><path d="M12 70H28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="70" y="12" width="40" height="16" fill="var(--surface)" stroke="none"/><circle cx="72" cy="20" r="3" ' + T + '/><circle cx="108" cy="20" r="3" ' + T + '/><path d="M74 18L102 4" ' + T + '/>' +
    '<circle cx="160" cy="20" r="14" fill="var(--surface)" ' + T + '/><text x="160" y="26" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor" font-family="sans-serif">M</text>', 240, 124);

  // Circuito del ejercicio 2: pila, LED y resistencia en serie
  var CIRCUITO_LED = caja('<rect x="20" y="20" width="220" height="90" ' + T + '/>' +
    '<rect x="8" y="50" width="24" height="30" fill="var(--surface)" stroke="none"/><path d="M6 58H34" ' + T + '/><path d="M12 70H28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="50" y="4" width="76" height="32" fill="var(--surface)" stroke="none"/><g transform="translate(43 2) scale(.75)">' + SIMB.led + '</g>' +
    '<rect x="140" y="8" width="76" height="26" fill="var(--surface)" stroke="none"/><g transform="translate(133 4) scale(.75)">' + SIMB.resistencia + '</g>', 260, 124);

  var KIND = { test: 'Test', vf: 'Verdadero o falso', cerrada: 'Respuesta cerrada', abierta: 'Respuesta abierta', reflexion: 'Reflexión', critico: 'Pensamiento crítico' };
  var AUTO = { test: 1, vf: 1, cerrada: 1 };
  var Q = [
    { id: 1, p: '1 · La electricidad y sus ventajas', k: 'test', s: 50, q: '¿Qué es la electricidad?',
      o: ['Una forma de energía que usamos para hacer funcionar aparatos, máquinas y sistemas de comunicación', 'Un material que conduce la corriente', 'Un tipo de pila', 'El cable que une los elementos de un circuito'], a: 0 },
    { id: 2, p: '1 · La electricidad y sus ventajas', k: 'test', s: 45, q: 'Una <b>estufa</b> o un <b>horno</b> transforman la energía eléctrica en…',
      o: ['Calor', 'Luz', 'Movimiento', 'Sonido'], a: 0 },
    { id: 3, p: '1 · La electricidad y sus ventajas', k: 'vf', s: 30, q: 'Un ventilador transforma la energía eléctrica en movimiento.', a: true },
    { id: 4, p: '2 · El circuito eléctrico', k: 'test', s: 50, q: '¿Qué es un circuito eléctrico?',
      o: ['Un conjunto de elementos conectados que permiten el paso de la corriente eléctrica', 'Un aparato que fabrica electricidad', 'Un cable muy largo', 'La energía que consume una lámpara'], a: 0 },
    { id: 5, p: '2 · Elementos del circuito', k: 'test', s: 45, q: '¿Qué elemento del circuito <b>proporciona la energía eléctrica</b>?',
      o: ['El generador (por ejemplo, una pila)', 'El receptor (por ejemplo, una lámpara)', 'El conductor (por ejemplo, un cable)', 'El elemento de control (por ejemplo, un interruptor)'], a: 0 },
    { id: 6, p: '2 · Elementos del circuito', k: 'test', s: 45, q: '¿Qué función tiene un <b>interruptor</b> en un circuito?',
      o: ['Es un elemento de control: abre o cierra el circuito', 'Proporciona energía eléctrica', 'Transforma la energía eléctrica en luz', 'Evita daños por exceso de corriente'], a: 0 },
    { id: 7, p: '2 · Elementos del circuito', k: 'cerrada', s: 60, q: '¿Cómo se llama el elemento de <b>protección</b> que evita daños por exceso de corriente?',
      ph: 'Escribe una palabra', ok: ['fusible', 'el fusible', 'un fusible', 'fusibles'] },
    { id: 8, p: '2 · Elementos del circuito', k: 'vf', s: 30, q: 'Los cables son receptores, porque transforman la energía eléctrica.', a: false },
    { id: 9, p: '2 · Elementos del circuito', k: 'test', s: 45, q: '¿Cuál de estos elementos es un <b>receptor</b>?',
      o: ['Un LED', 'Una pila', 'Un cable', 'Un interruptor'], a: 0 },
    { id: 10, p: 'Símbolos eléctricos', k: 'test', s: 50, q: '¿Qué símbolo representa una <b>lámpara</b> (bombilla)?',
      o: [s('lampara'), s('motor'), s('pila'), s('resistencia')], a: 0 },
    { id: 11, p: 'Símbolos eléctricos', k: 'test', s: 45, q: '¿Qué representa este símbolo?', e: s('resistencia'),
      o: ['Una resistencia eléctrica', 'Un interruptor abierto', 'Una pila', 'Un LED'], a: 0 },
    { id: 12, p: 'Símbolos eléctricos', k: 'test', s: 50, q: '¿Qué símbolo representa un <b>LED</b>?',
      o: [s('led'), s('interruptor'), s('lampara'), s('pila')], a: 0 },
    { id: 13, p: '5 · Circuitos en serie', k: 'test', s: 60, q: '¿Qué elementos tiene este circuito en serie?', e: CIRCUITO,
      o: ['Una pila, un interruptor y un motor', 'Una pila, un LED y una resistencia', 'Una pila, un interruptor y una lámpara', 'Dos pilas y un motor'], a: 0 },
    { id: 14, p: '7 · El diodo LED', k: 'vf', s: 30, q: 'En un LED, la patilla más larga es el ánodo (+) y la más corta es el cátodo (−).', a: true },
    { id: 15, p: '3 · Magnitudes eléctricas', k: 'test', s: 45, q: '¿En qué unidad se mide la <b>intensidad de corriente</b>?',
      o: ['En amperios (A)', 'En voltios (V)', 'En ohmios (Ω)', 'En vatios (W)'], a: 0 },
    { id: 16, p: '3 · Magnitudes eléctricas', k: 'test', s: 50, q: '¿Qué magnitud indica la <b>oposición al paso de la corriente</b>?',
      o: ['La resistencia, que se mide en ohmios (Ω)', 'La tensión, que se mide en voltios (V)', 'La potencia, que se mide en vatios (W)', 'La intensidad, que se mide en amperios (A)'], a: 0 },
    { id: 17, p: '3 · Magnitudes eléctricas', k: 'cerrada', s: 45, q: '¿Con qué letra se representa la <b>tensión o voltaje</b>?', ph: 'Escribe una letra', ok: ['v'] },
    { id: 18, p: '3 · Magnitudes eléctricas', k: 'test', s: 50, q: 'La <b>potencia</b> indica la rapidez con la que un dispositivo consume o transforma energía. ¿En qué se mide?',
      o: ['En vatios (W)', 'En amperios (A)', 'En ohmios (Ω)', 'En voltios (V)'], a: 0 },
    { id: 19, p: '3 · Magnitudes eléctricas', k: 'vf', s: 30, q: 'La intensidad de corriente es la cantidad de carga que circula por segundo.', a: true },
    { id: 20, p: '4 · La ley de Ohm', k: 'test', s: 45, q: '¿Cuál es la expresión de la <b>ley de Ohm</b>?',
      o: ['V = I · R', 'V = I + R', 'R = V · I', 'I = R / V'], a: 0 },
    { id: 21, p: '4 · La ley de Ohm', k: 'cerrada', s: 90, q: 'Una pila de <b>9 V</b> alimenta una resistencia de <b>3 Ω</b>. ¿Qué intensidad circula? Escribe solo el número, en amperios.',
      ph: 'Número en A', ok: ['3', '3a', '3 a', '3 amperios'] },
    { id: 22, p: '4 · La ley de Ohm', k: 'cerrada', s: 90, q: 'Por una resistencia de <b>6 Ω</b> circula una intensidad de <b>2 A</b>. ¿Qué tensión tiene? Escribe solo el número, en voltios.',
      ph: 'Número en V', ok: ['12', '12v', '12 v', '12 voltios'] },
    { id: 23, p: '4 · La ley de Ohm', k: 'cerrada', s: 90, q: 'Una lámpara funciona a <b>12 V</b> y por ella circulan <b>0,5 A</b>. ¿Cuál es su resistencia? Escribe solo el número, en ohmios.',
      ph: 'Número en Ω', ok: ['24', '24 ohmios', '24ω', '24 ω', '24 ohm'] },
    { id: 24, p: '5 · Circuitos en serie y en paralelo', k: 'vf', s: 30, q: 'En un circuito en serie, si se funde una bombilla, las demás siguen encendidas.', a: false },
    { id: 25, p: '5 · Circuitos en serie y en paralelo', k: 'abierta', s: 180, q: 'Explica la diferencia entre un circuito <b>en serie</b> y uno <b>en paralelo</b>. Pon un ejemplo de cada uno.',
      rb: [
        { t: 'En serie: los elementos van uno detrás de otro, por un solo camino', w: ['detras', 'uno tras otro', 'seguido', 'un solo camino', 'mismo camino', 'unico camino', 'misma intensidad', 'misma corriente', 'en fila', 'en linea', 'cadena'] },
        { t: 'En paralelo: cada elemento en su propia rama o camino', w: ['rama', 'varios camino', 'distintos camino', 'diferentes camino', 'otro camino', 'cada uno&camino', 'independiente', 'misma tension', 'mismo voltaje', 'por separado'] },
        { t: 'Si un elemento falla: en serie se apagan todos y en paralelo los demás siguen', w: ['apag', 'dejan de funcionar', 'deja de funcionar', 'dejarian de funcionar', 'siguen funcionando', 'sigue funcionando', 'siguen encendid', 'no funciona', 'se funde', 'se rompe', 'se estropea'] },
        { t: 'Pone algún ejemplo', w: ['ejemplo', 'casa', 'vivienda', 'navidad', 'arbol', 'linterna', 'enchufe', 'farola', 'guirnalda', 'bombilla', 'lampara', 'pila', 'coche', 'aula', 'clase'] }
      ] },
    { id: 26, p: '6 y 7 · La resistencia y el LED', k: 'abierta', s: 180, q: 'En los apuntes dibujaste una pila, un LED y una resistencia en serie. Explica cómo se conectan y para qué sirve la resistencia en ese circuito.',
      e: CIRCUITO_LED,
      rb: [
        { t: 'Van conectados en serie, uno detrás de otro', w: ['serie', 'detras', 'seguido', 'uno tras otro', 'un solo camino'] },
        { t: 'Tiene en cuenta la polaridad del LED (ánodo o patilla larga al positivo)', w: ['anodo', 'catodo', 'patilla larga', 'pata larga', 'patita larga', 'positivo', 'negativo', 'polaridad', 'polo'] },
        { t: 'La resistencia limita o reduce la corriente que pasa por el LED', w: ['limit', 'reduc', 'disminu', 'menos corriente', 'menos intensidad', 'baja&corriente', 'baja&intensidad', 'controla&corriente', 'controla&intensidad', 'regula', 'frena', 'se opone', 'oposicion'] },
        { t: 'Así protege el LED para que no se queme o se estropee', w: ['proteg', 'quem', 'fund', 'romp', 'estrope', 'danar', 'dane', 'dana', 'danad', 'explot'] }
      ] },
    { id: 27, p: '1 · La electricidad y sus ventajas', k: 'reflexion', s: 180, q: 'Elige un aparato eléctrico de tu casa que uses todos los días. ¿En qué forma de energía transforma la electricidad (luz, calor, movimiento o sonido)? ¿Cómo sería tu día sin él?',
      rb: [
        { t: 'Nombra un aparato eléctrico', w: ['nevera', 'frigori', 'lavadora', 'lavavajillas', 'microondas', 'horno', 'movil', 'telefono', 'television', 'tele', 'ordenador', 'portatil', 'tablet', 'secador', 'ventilador', 'lampara', 'bombilla', 'tostadora', 'cargador', 'vitro', 'placa', 'plancha', 'calefac', 'radiador', 'estufa', 'router', 'consola', 'altavoz', 'aspiradora', 'batidora', 'cafetera', 'termo', 'aire acondicionado', 'despertador', 'radio', 'cepillo', 'luz', 'luces'] },
        { t: 'Dice en qué forma de energía transforma la electricidad', w: ['luz', 'luminos', 'calor', 'termic', 'calienta', 'movimiento', 'mecanic', 'mueve', 'gira', 'sonido', 'sonora', 'frio', 'enfria', 'imagen', 'ilumina'] },
        { t: 'Reflexiona sobre cómo sería su día sin ese aparato', w: ['sin el', 'sin ella', 'sin ese', 'sin esa', 'sin la', 'sin mi', 'no podria', 'no podr', 'dificil', 'complicad', 'tendria que', 'aburri', 'peor', 'lento', 'imposible', 'echaria', 'de menos', 'costaria', 'incomod', 'no tendria', 'habria que'] },
        { t: 'Lo desarrolla con al menos 25 palabras', min: 25 }
      ] },
    { id: 28, p: '4 · La ley de Ohm', k: 'critico', s: 210, q: 'Un compañero dice: «Cuanto mayor es la resistencia, más corriente pasa por el circuito». ¿Estás de acuerdo? Razónalo usando la ley de Ohm y pon un ejemplo con números.',
      rb: [
        { t: 'No está de acuerdo: es al revés', w: ['no estoy de acuerdo', 'no estoy deacuerdo', 'no es cierto', 'no es verdad', 'no tiene razon', 'falso', 'incorrect', 'se equivoca', 'equivocad', 'al reves', 'desacuerdo', 'no es asi', 'mentira'] },
        { t: 'Explica que a más resistencia, menos corriente (I = V / R)', w: ['menos corriente', 'menos intensidad', 'menor intensidad', 'menor corriente', 'menos pasa', 'pasa menos', 'disminu', 'baja', 'inversa', 'reduc', 'mas pequena'] },
        { t: 'Usa la fórmula de la ley de Ohm', w: ['i=v/r', 'v/r', 'v=i', 'v=r', 'r=v', 'i=v', 'tension entre', 'voltaje entre', 'dividi'] },
        { t: 'Pone un ejemplo con números', re: '\\d' }
      ] },
    { id: 29, p: '5 · Circuitos en serie y en paralelo', k: 'critico', s: 210, q: 'En las casas, las lámparas y los enchufes se conectan en paralelo, no en serie. ¿Por qué crees que se hace así? Piensa en qué pasaría si estuvieran en serie.',
      rb: [
        { t: 'En paralelo cada aparato funciona de forma independiente (se enciende o apaga solo)', w: ['independien', 'por separado', 'cada uno', 'cada aparato', 'cada lampara', 'cada enchufe', 'individual', 'sin que&otro', 'sin afectar', 'no afecta', 'los demas', 'las demas', 'el resto'] },
        { t: 'En serie, si uno se funde o se apaga, se apagarían todos', w: ['apagar', 'apagan', 'apagaria', 'dejarian de funcionar', 'no funcionaria', 'dejaria de funcionar', 'dejan de funcionar', 'funde', 'fundi', 'rompe', 'todos&apag', 'todo&apag', 'ninguno', 'nada funcionaria'] },
        { t: 'En paralelo todos reciben la misma tensión (230 V) y funcionan bien', w: ['misma tension', 'mismo voltaje', 'toda la tension', 'todo el voltaje', '230', '220', 'tension completa', 'misma potencia', 'menos luz', 'menos tension', 'repart', 'divid'] },
        { t: 'Lo razona con al menos 20 palabras', min: 20 }
      ] },
    { id: 30, p: '5 · Circuitos en serie y en paralelo', k: 'vf', s: 30, q: 'En un circuito en paralelo, si se funde una bombilla, las demás siguen encendidas.', a: true }
  ];
  // Todas las preguntas valen lo mismo: 1 punto cada una (30 en total → nota sobre 10 con centésimas)
  Q.forEach(function (q) { q.pt = 1; });

  /** ¿Es correcta la respuesta v? (null si la corrige el profesor) */
  function correcta(q, v) {
    var norm = function (x) { return String(x).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:!¡¿?]/g, '').replace(/\s+/g, ' '); };
    if (q.k === 'test' || q.k === 'vf') return v === q.a;
    if (q.k === 'cerrada') return q.ok.map(norm).indexOf(norm(v == null ? '' : v)) >= 0;
    return null;
  }

  window.CUESTIONARIO = {
    id: '4eso-electricidad', titulo: 'Electricidad básica', grupos: GRUPOS,
    descripcion: 'Es un cuestionario sobre el <b>Tema 2: Electricidad</b>: la electricidad y sus ventajas, el circuito eléctrico y sus elementos, los símbolos eléctricos, las magnitudes eléctricas, la ley de Ohm, los circuitos en serie y en paralelo, la resistencia y el LED. Son <b>30 preguntas</b> y <b>todas valen lo mismo</b>; la nota final es sobre 10, con centésimas. Hay preguntas de varios tipos:',
    preguntas: Q, KIND: KIND, AUTO: AUTO, correcta: correcta
  };
})();
