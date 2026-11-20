/*
 * RayoBlocks · definición de los bloques (español / inglés)
 * Los bloques se dibujan con Blockly (Google, licencia Apache 2.0) y el renderizador «zelos».
 * Este archivo solo describe cómo son los bloques; el motor (motor.js) los ejecuta.
 */
(function () {
  'use strict';

  var CAT = {
    motion:   { colour: '#4C97FF', es: 'Movimiento', en: 'Motion' },
    looks:    { colour: '#9966FF', es: 'Apariencia', en: 'Looks' },
    sound:    { colour: '#CF63CF', es: 'Sonido',     en: 'Sound' },
    events:   { colour: '#FFBF00', es: 'Eventos',    en: 'Events' },
    control:  { colour: '#FFAB19', es: 'Control',    en: 'Control' },
    sensing:  { colour: '#5CB1D6', es: 'Sensores',   en: 'Sensing' },
    operators:{ colour: '#59C059', es: 'Operadores', en: 'Operators' },
    variables:{ colour: '#FF8C1A', es: 'Variables',  en: 'Variables' },
    pen:      { colour: '#0FBD8C', es: 'Lápiz',      en: 'Pen' }
  };

  var FLAG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3v18" stroke="#3d7a1f" stroke-width="2.4" stroke-linecap="round"/><path d="M6 4c4-2 7 2 12 0v9c-5 2-8-2-12 0z" fill="#4cbf56" stroke="#3d7a1f" stroke-width="1.4" stroke-linejoin="round"/></svg>');
  var ROT_R = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 8a7 7 0 1 0 1 6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M19 3v6h-6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  var ROT_L = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 8a7 7 0 1 1-1 6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M5 3v6h6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');

  function L() { return (window.RB && RB.lang) || 'es'; }
  function tr(es, en) { return L() === 'en' ? en : es; }

  // Menús que dependen del proyecto (objetos, disfraces, fondos, mensajes…). Los rellena app.js.
  function menu(nombre, extra) {
    return function () {
      var base = (window.RB && RB.menus && RB.menus[nombre]) ? RB.menus[nombre]() : [];
      var pre = (extra || []).map(function (o) { return [tr(o[1], o[2]), o[0]]; });
      var r = pre.concat(base);
      return r.length ? r : [[' ', ' ']];
    };
  }
  function fijo(opts) {
    return function () { return opts.map(function (o) { return [tr(o[1], o[2]), o[0]]; }); };
  }

  var BLOQUES = {};   // tipo → { cat, es, en, args, forma, salida }

  /*
   * def(tipo, categoría, texto_es, texto_en, argumentos, forma)
   *   forma: 'pila' (por defecto), 'sombrero', 'final', 'c', 'c2' (si/si no), 'valor', 'booleano'
   *   argumento: ['NOMBRE', 'num'|'texto'|'bool'|'menu'|'var'|'img', valor por defecto o menú]
   *   En los textos, %1 %2… marcan dónde va cada argumento.
   */
  function def(tipo, cat, es, en, args, forma, extra) {
    BLOQUES[tipo] = { cat: cat, es: es, en: en, args: args || [], forma: forma || 'pila', extra: extra || {} };
  }

  function argJson(a) {
    var nombre = a[0], t = a[1], v = a[2];
    if (t === 'num' || t === 'texto') return { type: 'input_value', name: nombre };
    if (t === 'bool') return { type: 'input_value', name: nombre, check: 'Boolean' };
    if (t === 'menu') return { type: 'field_dropdown', name: nombre, options: typeof v === 'function' ? v : fijo(v) };
    if (t === 'var') return { type: 'field_variable', name: nombre, variable: null };
    if (t === 'img') return { type: 'field_image', src: v, width: 22, height: 22, alt: '*' };
    if (t === 'campo_num') return { type: 'field_number', name: nombre, value: v };
    if (t === 'campo_texto') return { type: 'field_input', name: nombre, text: v };
    throw new Error('Argumento desconocido ' + t);
  }

  function json(tipo) {
    var b = BLOQUES[tipo];
    var j = { type: tipo, colour: CAT[b.cat].colour, inputsInline: true };
    var texto = tr(b.es, b.en);
    var partes = texto.split('|');            // «|» separa las filas de los bloques en C
    var nArg = 0;
    var argsPorFila = partes.map(function (p) {
      var n = (p.match(/%\d/g) || []).length;
      var a = b.args.slice(nArg, nArg + n);
      nArg += n;
      // renumerar %n dentro de cada fila
      var k = 0;
      return { msg: p.replace(/%\d/g, function () { return '%' + (++k); }), args: a.map(argJson) };
    });
    if (b.forma === 'c' || b.forma === 'c2') {
      // fila 0: cabecera · fila «interior» · (si no) · interior 2
      var filas = [];
      filas.push(argsPorFila[0]);
      filas.push({ msg: '%1', args: [{ type: 'input_statement', name: 'SUBSTACK' }] });
      if (b.forma === 'c2') {
        filas.push(argsPorFila[1] || { msg: tr('si no', 'else'), args: [] });
        filas.push({ msg: '%1', args: [{ type: 'input_statement', name: 'SUBSTACK2' }] });
      }
      argsPorFila = filas;
    }
    argsPorFila.forEach(function (f, i) { j['message' + i] = f.msg; j['args' + i] = f.args; });
    if (b.forma === 'valor') j.output = 'Number';
    else if (b.forma === 'booleano') j.output = 'Boolean';
    else {
      if (b.forma !== 'sombrero') j.previousStatement = null;
      if (b.forma !== 'final' && !b.extra.final) j.nextStatement = null;
    }
    if (b.extra.tooltip) j.tooltip = tr(b.extra.tooltip[0], b.extra.tooltip[1]);
    return j;
  }

  function registrar() {
    Object.keys(BLOQUES).forEach(function (tipo) {
      Blockly.Blocks[tipo] = {
        init: function () {
          this.jsonInit(json(tipo));
          if (BLOQUES[tipo].forma === 'sombrero') this.hat = 'cap';
          var v = BLOQUES[tipo].extra.validador;
          if (v) { var f = this.getField(v[0]); if (f) f.setValidator(v[1]); }
        }
      };
    });
    // Bloques «sombra»: los huecos donde se escriben números y textos
    Blockly.Blocks.rb_num = { init: function () {
      this.jsonInit({ type: 'rb_num', message0: '%1', args0: [{ type: 'field_number', name: 'NUM', value: 0 }], output: 'Number', colour: '#FFFFFF' });
    } };
    Blockly.Blocks.rb_text = { init: function () {
      this.jsonInit({ type: 'rb_text', message0: '%1', args0: [{ type: 'field_input', name: 'TEXT', text: '' }], output: 'Number', colour: '#FFFFFF' });
    } };
  }

  /* ----------------------------- Movimiento ----------------------------- */
  var DESTINOS = [['_random_', 'posición aleatoria', 'random position'], ['_mouse_', 'puntero del ratón', 'mouse-pointer']];
  def('motion_move', 'motion', 'mover %1 pasos', 'move %1 steps', [['STEPS', 'num', 10]]);
  def('motion_turnright', 'motion', 'girar %1 %2 grados', 'turn %1 %2 degrees', [['', 'img', ROT_R], ['DEGREES', 'num', 15]]);
  def('motion_turnleft', 'motion', 'girar %1 %2 grados', 'turn %1 %2 degrees', [['', 'img', ROT_L], ['DEGREES', 'num', 15]]);
  def('motion_goto', 'motion', 'ir a %1', 'go to %1', [['TO', 'menu', menu('objetos', DESTINOS)]]);
  def('motion_gotoxy', 'motion', 'ir a x: %1 y: %2', 'go to x: %1 y: %2', [['X', 'num', 0], ['Y', 'num', 0]]);
  def('motion_glideto', 'motion', 'deslizar en %1 segs a %2', 'glide %1 secs to %2', [['SECS', 'num', 1], ['TO', 'menu', menu('objetos', DESTINOS)]]);
  def('motion_glidesecstoxy', 'motion', 'deslizar en %1 segs a x: %2 y: %3', 'glide %1 secs to x: %2 y: %3', [['SECS', 'num', 1], ['X', 'num', 0], ['Y', 'num', 0]]);
  def('motion_pointindirection', 'motion', 'apuntar en dirección %1', 'point in direction %1', [['DIRECTION', 'num', 90]]);
  def('motion_pointtowards', 'motion', 'apuntar hacia %1', 'point towards %1', [['TOWARDS', 'menu', menu('objetos', [['_mouse_', 'puntero del ratón', 'mouse-pointer']])]]);
  def('motion_changexby', 'motion', 'sumar %1 a x', 'change x by %1', [['DX', 'num', 10]]);
  def('motion_setx', 'motion', 'dar a x el valor %1', 'set x to %1', [['X', 'num', 0]]);
  def('motion_changeyby', 'motion', 'sumar %1 a y', 'change y by %1', [['DY', 'num', 10]]);
  def('motion_sety', 'motion', 'dar a y el valor %1', 'set y to %1', [['Y', 'num', 0]]);
  def('motion_ifonedgebounce', 'motion', 'si toca un borde, rebotar', 'if on edge, bounce', []);
  def('motion_setrotationstyle', 'motion', 'fijar estilo de rotación a %1', 'set rotation style %1', [['STYLE', 'menu',
    [['all around', 'en todas direcciones', 'all around'], ['left-right', 'izquierda-derecha', 'left-right'], ["don't rotate", 'no rotar', "don't rotate"]]]]);
  def('motion_xposition', 'motion', 'posición en x', 'x position', [], 'valor');
  def('motion_yposition', 'motion', 'posición en y', 'y position', [], 'valor');
  def('motion_direction', 'motion', 'dirección', 'direction', [], 'valor');

  /* ----------------------------- Apariencia ----------------------------- */
  def('looks_sayforsecs', 'looks', 'decir %1 durante %2 segundos', 'say %1 for %2 seconds', [['MESSAGE', 'texto', '¡Hola!'], ['SECS', 'num', 2]]);
  def('looks_say', 'looks', 'decir %1', 'say %1', [['MESSAGE', 'texto', '¡Hola!']]);
  def('looks_thinkforsecs', 'looks', 'pensar %1 durante %2 segundos', 'think %1 for %2 seconds', [['MESSAGE', 'texto', 'Mmm…'], ['SECS', 'num', 2]]);
  def('looks_think', 'looks', 'pensar %1', 'think %1', [['MESSAGE', 'texto', 'Mmm…']]);
  def('looks_switchcostumeto', 'looks', 'cambiar disfraz a %1', 'switch costume to %1', [['COSTUME', 'menu', menu('disfraces')]]);
  def('looks_nextcostume', 'looks', 'siguiente disfraz', 'next costume', []);
  def('looks_switchbackdropto', 'looks', 'cambiar fondo a %1', 'switch backdrop to %1', [['BACKDROP', 'menu', menu('fondos', [['_next_', 'siguiente fondo', 'next backdrop'], ['_random_', 'fondo aleatorio', 'random backdrop']])]]);
  def('looks_nextbackdrop', 'looks', 'siguiente fondo', 'next backdrop', []);
  def('looks_changesizeby', 'looks', 'sumar %1 al tamaño', 'change size by %1', [['CHANGE', 'num', 10]]);
  def('looks_setsizeto', 'looks', 'fijar tamaño al %1 %', 'set size to %1 %', [['SIZE', 'num', 100]]);
  var EFECTOS = [['color', 'color', 'color'], ['ghost', 'desvanecer', 'ghost'], ['brightness', 'brillo', 'brightness']];
  def('looks_changeeffectby', 'looks', 'sumar al efecto %1 %2', 'change %1 effect by %2', [['EFFECT', 'menu', EFECTOS], ['CHANGE', 'num', 25]]);
  def('looks_seteffectto', 'looks', 'dar al efecto %1 el valor %2', 'set %1 effect to %2', [['EFFECT', 'menu', EFECTOS], ['VALUE', 'num', 0]]);
  def('looks_cleargraphiceffects', 'looks', 'quitar efectos gráficos', 'clear graphic effects', []);
  def('looks_show', 'looks', 'mostrar', 'show', []);
  def('looks_hide', 'looks', 'esconder', 'hide', []);
  def('looks_gotofrontback', 'looks', 'ir a la capa %1', 'go to %1 layer', [['FRONT_BACK', 'menu', [['front', 'delantera', 'front'], ['back', 'trasera', 'back']]]]);
  def('looks_costumenumbername', 'looks', 'disfraz %1', 'costume %1', [['NUMBER_NAME', 'menu', [['number', 'número', 'number'], ['name', 'nombre', 'name']]]], 'valor');
  def('looks_backdropnumbername', 'looks', 'fondo %1', 'backdrop %1', [['NUMBER_NAME', 'menu', [['number', 'número', 'number'], ['name', 'nombre', 'name']]]], 'valor');
  def('looks_size', 'looks', 'tamaño', 'size', [], 'valor');

  /* ------------------------------- Sonido ------------------------------- */
  def('sound_playuntildone', 'sound', 'tocar sonido %1 hasta que termine', 'play sound %1 until done', [['SOUND', 'menu', menu('sonidos')]]);
  def('sound_play', 'sound', 'iniciar sonido %1', 'start sound %1', [['SOUND', 'menu', menu('sonidos')]]);
  def('sound_playnote', 'sound', 'tocar nota %1 durante %2 pulsos', 'play note %1 for %2 beats', [['NOTE', 'num', 60], ['BEATS', 'num', 0.5]]);
  def('sound_stopallsounds', 'sound', 'detener todos los sonidos', 'stop all sounds', []);
  def('sound_changevolumeby', 'sound', 'sumar %1 al volumen', 'change volume by %1', [['VOLUME', 'num', -10]]);
  def('sound_setvolumeto', 'sound', 'fijar volumen al %1 %', 'set volume to %1 %', [['VOLUME', 'num', 100]]);
  def('sound_volume', 'sound', 'volumen', 'volume', [], 'valor');

  /* ------------------------------- Eventos ------------------------------ */
  var TECLAS = [['space', 'espacio', 'space'], ['up arrow', 'flecha arriba', 'up arrow'], ['down arrow', 'flecha abajo', 'down arrow'],
    ['right arrow', 'flecha derecha', 'right arrow'], ['left arrow', 'flecha izquierda', 'left arrow'], ['any', 'cualquiera', 'any']]
    .concat('abcdefghijklmnopqrstuvwxyz0123456789'.split('').map(function (c) { return [c, c, c]; }));
  def('event_whenflagclicked', 'events', 'al hacer clic en %1', 'when %1 clicked', [['', 'img', FLAG]], 'sombrero');
  def('event_whenkeypressed', 'events', 'al presionar tecla %1', 'when %1 key pressed', [['KEY', 'menu', TECLAS]], 'sombrero');
  def('event_whenthisspriteclicked', 'events', 'al hacer clic en este objeto', 'when this sprite clicked', [], 'sombrero');
  def('event_whenstageclicked', 'events', 'al hacer clic en el escenario', 'when stage clicked', [], 'sombrero');
  def('event_whenbackdropswitchesto', 'events', 'cuando el fondo cambie a %1', 'when backdrop switches to %1', [['BACKDROP', 'menu', menu('fondos')]], 'sombrero');
  var validarMensaje = function (v) {
    if (v !== '_new_') return v;
    var n = window.prompt(tr('Nombre del nuevo mensaje:', 'New message name:'), tr('mensaje', 'message') + ((RB.proyecto.mensajes || []).length + 1));
    if (!n || !n.trim()) return null;
    n = n.trim();
    if (RB.proyecto.mensajes.indexOf(n) < 0) RB.proyecto.mensajes.push(n);
    return n;
  };
  var MENU_MSG = function () {
    var r = (RB.proyecto.mensajes || []).map(function (m) { return [m, m]; });
    r.push([tr('Nuevo mensaje…', 'New message…'), '_new_']);
    return r;
  };
  def('event_whenbroadcastreceived', 'events', 'al recibir %1', 'when I receive %1', [['BROADCAST', 'menu', MENU_MSG]], 'sombrero', { validador: ['BROADCAST', validarMensaje] });
  def('event_broadcast', 'events', 'enviar %1', 'broadcast %1', [['BROADCAST', 'menu', MENU_MSG]], 'pila', { validador: ['BROADCAST', validarMensaje] });
  def('event_broadcastandwait', 'events', 'enviar %1 y esperar', 'broadcast %1 and wait', [['BROADCAST', 'menu', MENU_MSG]], 'pila', { validador: ['BROADCAST', validarMensaje] });

  /* ------------------------------- Control ------------------------------ */
  def('control_wait', 'control', 'esperar %1 segundos', 'wait %1 seconds', [['DURATION', 'num', 1]]);
  def('control_repeat', 'control', 'repetir %1', 'repeat %1', [['TIMES', 'num', 10]], 'c');
  def('control_forever', 'control', 'por siempre', 'forever', [], 'c', { final: true });
  def('control_if', 'control', 'si %1 entonces', 'if %1 then', [['CONDITION', 'bool']], 'c');
  def('control_if_else', 'control', 'si %1 entonces|si no', 'if %1 then|else', [['CONDITION', 'bool']], 'c2');
  def('control_wait_until', 'control', 'esperar hasta que %1', 'wait until %1', [['CONDITION', 'bool']]);
  def('control_repeat_until', 'control', 'repetir hasta que %1', 'repeat until %1', [['CONDITION', 'bool']], 'c');
  def('control_stop', 'control', 'detener %1', 'stop %1', [['STOP_OPTION', 'menu',
    [['all', 'todos', 'all'], ['this script', 'este programa', 'this script'], ['other scripts in sprite', 'otros programas del objeto', 'other scripts in sprite']]]], 'final');
  def('control_start_as_clone', 'control', 'al comenzar como clon', 'when I start as a clone', [], 'sombrero');
  def('control_create_clone_of', 'control', 'crear clon de %1', 'create clone of %1', [['CLONE_OPTION', 'menu', menu('objetosSinMi', [['_myself_', 'mí mismo', 'myself']])]]);
  def('control_delete_this_clone', 'control', 'eliminar este clon', 'delete this clone', [], 'final');

  /* ------------------------------ Sensores ------------------------------ */
  def('sensing_touchingobject', 'sensing', '¿tocando %1?', 'touching %1?', [['TOUCHINGOBJECTMENU', 'menu',
    menu('objetosSinMi', [['_mouse_', 'puntero del ratón', 'mouse-pointer'], ['_edge_', 'borde', 'edge']])]], 'booleano');
  def('sensing_distanceto', 'sensing', 'distancia a %1', 'distance to %1', [['DISTANCETOMENU', 'menu', menu('objetosSinMi', [['_mouse_', 'puntero del ratón', 'mouse-pointer']])]], 'valor');
  def('sensing_askandwait', 'sensing', 'preguntar %1 y esperar', 'ask %1 and wait', [['QUESTION', 'texto', '¿Cómo te llamas?']]);
  def('sensing_answer', 'sensing', 'respuesta', 'answer', [], 'valor');
  def('sensing_keypressed', 'sensing', '¿tecla %1 presionada?', 'key %1 pressed?', [['KEY_OPTION', 'menu', TECLAS]], 'booleano');
  def('sensing_mousedown', 'sensing', '¿ratón presionado?', 'mouse down?', [], 'booleano');
  def('sensing_mousex', 'sensing', 'posición x del ratón', 'mouse x', [], 'valor');
  def('sensing_mousey', 'sensing', 'posición y del ratón', 'mouse y', [], 'valor');
  def('sensing_timer', 'sensing', 'cronómetro', 'timer', [], 'valor');
  def('sensing_resettimer', 'sensing', 'reiniciar cronómetro', 'reset timer', []);
  def('sensing_of', 'sensing', '%1 de %2', '%1 of %2', [['PROPERTY', 'menu',
    [['x position', 'posición en x', 'x position'], ['y position', 'posición en y', 'y position'], ['direction', 'dirección', 'direction'],
     ['costume #', 'disfraz nº', 'costume #'], ['size', 'tamaño', 'size'], ['backdrop #', 'fondo nº', 'backdrop #']]],
    ['OBJECT', 'menu', menu('objetos', [['_stage_', 'Escenario', 'Stage']])]], 'valor');
  def('sensing_current', 'sensing', '%1 actual', 'current %1', [['CURRENTMENU', 'menu',
    [['YEAR', 'año', 'year'], ['MONTH', 'mes', 'month'], ['DATE', 'día', 'date'], ['DAYOFWEEK', 'día de la semana', 'day of week'],
     ['HOUR', 'hora', 'hour'], ['MINUTE', 'minuto', 'minute'], ['SECOND', 'segundo', 'second']]]], 'valor');

  /* ----------------------------- Operadores ----------------------------- */
  def('operator_add', 'operators', '%1 + %2', '%1 + %2', [['NUM1', 'num', ''], ['NUM2', 'num', '']], 'valor');
  def('operator_subtract', 'operators', '%1 - %2', '%1 - %2', [['NUM1', 'num', ''], ['NUM2', 'num', '']], 'valor');
  def('operator_multiply', 'operators', '%1 × %2', '%1 × %2', [['NUM1', 'num', ''], ['NUM2', 'num', '']], 'valor');
  def('operator_divide', 'operators', '%1 / %2', '%1 / %2', [['NUM1', 'num', ''], ['NUM2', 'num', '']], 'valor');
  def('operator_random', 'operators', 'número aleatorio entre %1 y %2', 'pick random %1 to %2', [['FROM', 'num', 1], ['TO', 'num', 10]], 'valor');
  def('operator_gt', 'operators', '%1 > %2', '%1 > %2', [['OPERAND1', 'texto', ''], ['OPERAND2', 'texto', 50]], 'booleano');
  def('operator_lt', 'operators', '%1 < %2', '%1 < %2', [['OPERAND1', 'texto', ''], ['OPERAND2', 'texto', 50]], 'booleano');
  def('operator_equals', 'operators', '%1 = %2', '%1 = %2', [['OPERAND1', 'texto', ''], ['OPERAND2', 'texto', 50]], 'booleano');
  def('operator_and', 'operators', '%1 y %2', '%1 and %2', [['OPERAND1', 'bool'], ['OPERAND2', 'bool']], 'booleano');
  def('operator_or', 'operators', '%1 o %2', '%1 or %2', [['OPERAND1', 'bool'], ['OPERAND2', 'bool']], 'booleano');
  def('operator_not', 'operators', 'no %1', 'not %1', [['OPERAND', 'bool']], 'booleano');
  def('operator_join', 'operators', 'unir %1 %2', 'join %1 %2', [['STRING1', 'texto', 'manzana '], ['STRING2', 'texto', 'plátano']], 'valor');
  def('operator_letter_of', 'operators', 'letra %1 de %2', 'letter %1 of %2', [['LETTER', 'num', 1], ['STRING', 'texto', 'manzana']], 'valor');
  def('operator_length', 'operators', 'longitud de %1', 'length of %1', [['STRING', 'texto', 'manzana']], 'valor');
  def('operator_contains', 'operators', '¿%1 contiene %2?', '%1 contains %2?', [['STRING1', 'texto', 'manzana'], ['STRING2', 'texto', 'a']], 'booleano');
  def('operator_mod', 'operators', '%1 módulo %2', '%1 mod %2', [['NUM1', 'num', ''], ['NUM2', 'num', '']], 'valor');
  def('operator_round', 'operators', 'redondear %1', 'round %1', [['NUM', 'num', '']], 'valor');
  def('operator_mathop', 'operators', '%1 de %2', '%1 of %2', [['OPERATOR', 'menu',
    [['abs', 'valor absoluto', 'abs'], ['floor', 'redondear hacia abajo', 'floor'], ['ceiling', 'redondear hacia arriba', 'ceiling'],
     ['sqrt', 'raíz cuadrada', 'sqrt'], ['sin', 'sen', 'sin'], ['cos', 'cos', 'cos'], ['tan', 'tan', 'tan']]], ['NUM', 'num', '']], 'valor');

  /* ------------------------------ Variables ----------------------------- */
  def('data_variable', 'variables', '%1', '%1', [['VARIABLE', 'var']], 'valor');
  def('data_setvariableto', 'variables', 'dar a %1 el valor %2', 'set %1 to %2', [['VARIABLE', 'var'], ['VALUE', 'texto', 0]]);
  def('data_changevariableby', 'variables', 'sumar a %1 %2', 'change %1 by %2', [['VARIABLE', 'var'], ['VALUE', 'num', 1]]);
  def('data_showvariable', 'variables', 'mostrar variable %1', 'show variable %1', [['VARIABLE', 'var']]);
  def('data_hidevariable', 'variables', 'esconder variable %1', 'hide variable %1', [['VARIABLE', 'var']]);

  /* -------------------------------- Lápiz ------------------------------- */
  var COLORES = [['#E53935', 'rojo', 'red'], ['#FB8C00', 'naranja', 'orange'], ['#FDD835', 'amarillo', 'yellow'], ['#43A047', 'verde', 'green'],
    ['#1E88E5', 'azul', 'blue'], ['#8E24AA', 'morado', 'purple'], ['#EC407A', 'rosa', 'pink'], ['#6D4C41', 'marrón', 'brown'],
    ['#000000', 'negro', 'black'], ['#9E9E9E', 'gris', 'grey'], ['#FFFFFF', 'blanco', 'white']];
  def('pen_clear', 'pen', 'borrar todo', 'erase all', []);
  def('pen_stamp', 'pen', 'sellar', 'stamp', []);
  def('pen_penDown', 'pen', 'bajar lápiz', 'pen down', []);
  def('pen_penUp', 'pen', 'subir lápiz', 'pen up', []);
  def('pen_setPenColorTo', 'pen', 'fijar color del lápiz a %1', 'set pen color to %1', [['COLOR', 'menu', COLORES]]);
  def('pen_changePenColorBy', 'pen', 'sumar %1 al color del lápiz', 'change pen color by %1', [['COLOR', 'num', 10]]);
  def('pen_setPenSizeTo', 'pen', 'fijar tamaño del lápiz a %1', 'set pen size to %1', [['SIZE', 'num', 1]]);
  def('pen_changePenSizeBy', 'pen', 'sumar %1 al tamaño del lápiz', 'change pen size by %1', [['SIZE', 'num', 1]]);

  /* ------------------------------- Caja de herramientas ------------------------------ */
  var ORDEN = {
    motion: ['motion_move', 'motion_turnright', 'motion_turnleft', 'motion_goto', 'motion_gotoxy', 'motion_glideto', 'motion_glidesecstoxy',
      'motion_pointindirection', 'motion_pointtowards', 'motion_changexby', 'motion_setx', 'motion_changeyby', 'motion_sety',
      'motion_ifonedgebounce', 'motion_setrotationstyle', 'motion_xposition', 'motion_yposition', 'motion_direction'],
    looks: ['looks_sayforsecs', 'looks_say', 'looks_thinkforsecs', 'looks_think', 'looks_switchcostumeto', 'looks_nextcostume',
      'looks_switchbackdropto', 'looks_nextbackdrop', 'looks_changesizeby', 'looks_setsizeto', 'looks_changeeffectby', 'looks_seteffectto',
      'looks_cleargraphiceffects', 'looks_show', 'looks_hide', 'looks_gotofrontback', 'looks_costumenumbername', 'looks_backdropnumbername', 'looks_size'],
    sound: ['sound_playuntildone', 'sound_play', 'sound_playnote', 'sound_stopallsounds', 'sound_changevolumeby', 'sound_setvolumeto', 'sound_volume'],
    events: ['event_whenflagclicked', 'event_whenkeypressed', 'event_whenthisspriteclicked', 'event_whenbackdropswitchesto',
      'event_whenbroadcastreceived', 'event_broadcast', 'event_broadcastandwait'],
    control: ['control_wait', 'control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_wait_until', 'control_repeat_until',
      'control_stop', 'control_start_as_clone', 'control_create_clone_of', 'control_delete_this_clone'],
    sensing: ['sensing_touchingobject', 'sensing_distanceto', 'sensing_askandwait', 'sensing_answer', 'sensing_keypressed', 'sensing_mousedown',
      'sensing_mousex', 'sensing_mousey', 'sensing_timer', 'sensing_resettimer', 'sensing_of', 'sensing_current'],
    operators: ['operator_add', 'operator_subtract', 'operator_multiply', 'operator_divide', 'operator_random', 'operator_gt', 'operator_lt',
      'operator_equals', 'operator_and', 'operator_or', 'operator_not', 'operator_join', 'operator_letter_of', 'operator_length',
      'operator_contains', 'operator_mod', 'operator_round', 'operator_mathop'],
    pen: ['pen_clear', 'pen_stamp', 'pen_penDown', 'pen_penUp', 'pen_setPenColorTo', 'pen_changePenColorBy', 'pen_setPenSizeTo', 'pen_changePenSizeBy']
  };
  // Bloques que no tienen sentido en el escenario
  var SOLO_OBJETO = /^(motion_|looks_(say|think|switchcostumeto|nextcostume|changesizeby|setsizeto|show|hide|gotofrontback|costumenumbername|size)|event_whenthisspriteclicked|control_(start_as_clone|delete_this_clone)|sensing_(touchingobject|distanceto)|pen_(stamp|penDown|penUp|setPen|changePen))/;
  var SOLO_ESCENARIO = /^event_whenstageclicked$/;

  function itemToolbox(tipo) {
    var b = BLOQUES[tipo], it = { kind: 'block', type: tipo };
    var inputs = {};
    b.args.forEach(function (a) {
      if (a[1] === 'num') inputs[a[0]] = { shadow: { type: 'rb_num', fields: { NUM: a[2] === '' ? '' : a[2] } } };
      if (a[1] === 'texto') inputs[a[0]] = { shadow: { type: 'rb_text', fields: { TEXT: String(L() === 'en' ? traducirDefecto(a[2]) : a[2]) } } };
    });
    if (Object.keys(inputs).length) it.inputs = inputs;
    return it;
  }
  function traducirDefecto(v) {
    var m = { '¡Hola!': 'Hello!', 'Mmm…': 'Hmm…', '¿Cómo te llamas?': "What's your name?", 'manzana ': 'apple ', 'plátano': 'banana', 'manzana': 'apple' };
    return m[v] !== undefined ? m[v] : v;
  }

  function toolbox(esEscenario) {
    var cats = ['motion', 'looks', 'sound', 'events', 'control', 'sensing', 'operators', 'variables', 'pen'];
    return {
      kind: 'categoryToolbox',
      contents: cats.map(function (c) {
        if (c === 'variables') return { kind: 'category', name: tr(CAT[c].es, CAT[c].en), colour: CAT[c].colour, custom: 'RB_VARIABLES' };
        var tipos = ORDEN[c].slice();
        if (c === 'events' && esEscenario) tipos.splice(2, 1, 'event_whenstageclicked');
        tipos = tipos.filter(function (t) { return esEscenario ? !SOLO_OBJETO.test(t) : !SOLO_ESCENARIO.test(t); });
        var contenido = tipos.map(itemToolbox);
        if (esEscenario && c === 'motion') contenido = [{ kind: 'label', text: tr('El escenario no se mueve. Elige un objeto.', 'The stage cannot move. Select a sprite.') }];
        return { kind: 'category', name: tr(CAT[c].es, CAT[c].en), colour: CAT[c].colour, contents: contenido };
      })
    };
  }

  function flyoutVariables(ws) {
    var items = [{ kind: 'button', text: tr('Crear una variable', 'Make a Variable'), callbackKey: 'RB_NUEVA_VAR' }];
    var vars = ws.getVariableMap ? ws.getVariableMap().getAllVariables() : ws.getAllVariables();
    vars = vars.slice().sort(function (a, b) { return a.getName().localeCompare(b.getName(), 'es'); });
    if (!vars.length) return items;
    vars.forEach(function (v) { items.push({ kind: 'block', type: 'data_variable', fields: { VARIABLE: { id: v.getId() } } }); });
    var primera = { VARIABLE: { id: vars[0].getId() } };
    items.push({ kind: 'sep', gap: 24 });
    items.push({ kind: 'block', type: 'data_setvariableto', fields: primera, inputs: { VALUE: { shadow: { type: 'rb_text', fields: { TEXT: '0' } } } } });
    items.push({ kind: 'block', type: 'data_changevariableby', fields: primera, inputs: { VALUE: { shadow: { type: 'rb_num', fields: { NUM: 1 } } } } });
    items.push({ kind: 'block', type: 'data_showvariable', fields: primera });
    items.push({ kind: 'block', type: 'data_hidevariable', fields: primera });
    return items;
  }

  window.RBBloques = { CAT: CAT, BLOQUES: BLOQUES, registrar: registrar, toolbox: toolbox, flyoutVariables: flyoutVariables, tr: tr };
})();
