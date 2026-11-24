/*
 * RayoBlocks · interfaz: editor de bloques, escenario, objetos, disfraces y archivos.
 * No guarda nada en el navegador: los proyectos se guardan como archivo .rayo en el equipo.
 */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var B = window.RBBiblioteca;

  window.RB = { lang: 'es', proyecto: { mensajes: [] }, menus: {} };

  var UI = {
    es: {
      archivo: 'Archivo', nuevo: 'Nuevo proyecto', abrir: 'Abrir desde tu equipo', guardar: 'Guardar en tu equipo',
      ej1: 'Ejemplo: Chispa pasea', ej2: 'Ejemplo: dibujar un polígono', ej3: 'Ejemplo: atrapa la estrella', ej4: 'Juego: RayoMan atrapa rayos',
      ayuda: 'Ayuda', volver: '← Robótica', empezar: 'Empezar', detener: 'Detener', grande: 'Escenario grande',
      objeto: 'Objeto', mostrar: 'Mostrar', tamano: 'Tamaño', direccion: 'Dirección', escenario: 'Escenario', fondos: 'Fondos',
      cerrar: 'Cerrar', elegirObjeto: 'Elegir un objeto', subir: 'Subir imagen', disfraces: 'Disfraces', elegirDisfraz: 'Elegir un disfraz',
      elegirFondo: 'Elegir un fondo', ejecutando: 'En marcha…', borrarObjeto: '¿Borrar el objeto «{n}» y sus programas?',
      confirmarNuevo: '¿Empezar un proyecto nuevo? Se perderá lo que no hayas guardado.', nombreArchivo: 'Nombre del archivo:',
      guardado: 'Proyecto guardado en tu equipo', abierto: 'Proyecto abierto', errorAbrir: 'Ese archivo no es un proyecto de RayoBlocks.',
      renombrar: 'Nuevo nombre:', nombreUsado: 'Ya hay un objeto con ese nombre.', salir: 'Tienes cambios sin guardar.',
      unDisfraz: 'Un objeto necesita al menos un disfraz.', unFondo: 'El escenario necesita al menos un fondo.',
      soloEscenario: 'El escenario no tiene posición ni tamaño', resultado: 'Resultado',
      practicas: 'Prácticas', practica: 'Práctica', elegirPractica: 'Elige una práctica', reto: '⭐ Reto extra:',
      ayuda1: '💡 Ayuda 1', ayuda2: '💡 Ayuda 2', ayuda3: '🆘 Ayuda 3', primero1: 'Primero abre la ayuda 1.', primero2: 'Primero abre la ayuda 2.',
      nota0: 'Intenta resolverla sin ayuda. Si usas una ayuda, quedará anotado en tu proyecto.', nota1: 'Has usado 1 ayuda: quedará anotado en tu proyecto.',
      nota2: 'Has usado 2 ayudas: quedará anotado en tu proyecto.', nota3: 'Has usado 3 ayudas: quedará anotado en tu proyecto.',
      seguro3: 'La ayuda 3 te da la solución completa y sustituye tu programa. ¿Seguro que quieres abrirla? Quedará anotado que has resuelto la práctica con gran dificultad.',
      seguroN: '¿Seguro que quieres abrir la ayuda {n}? Quedará anotado que la has usado.', si: 'Sí, ver la ayuda', no: 'No, sigo probando',
      ayudaN: '💡 Ayuda {n}:', ayuda3t: '🆘 Ayuda 3:', solPuesta: 'La solución completa ya está en tu programa. Pulsa la bandera verde para probarla y fíjate en cómo funciona cada bloque.',
      volverSol: '↺ Volver a poner la solución', sinAyudas: 'sin ayudas', conAyudas: '{n} ayuda(s)',
      cambiarPractica: '¿Empezar otra práctica? Se perderá lo que no hayas guardado de esta.', guardaPractica: 'Cuando termines, guarda tu proyecto con Archivo → Guardar en tu equipo.'
    },
    en: {
      archivo: 'File', nuevo: 'New project', abrir: 'Load from your computer', guardar: 'Save to your computer',
      ej1: 'Example: Chispa takes a walk', ej2: 'Example: draw a polygon', ej3: 'Example: catch the star', ej4: 'Game: RayoMan catches bolts',
      ayuda: 'Help', volver: '← Robotics', empezar: 'Go', detener: 'Stop', grande: 'Large stage',
      objeto: 'Sprite', mostrar: 'Show', tamano: 'Size', direccion: 'Direction', escenario: 'Stage', fondos: 'Backdrops',
      cerrar: 'Close', elegirObjeto: 'Choose a sprite', subir: 'Upload image', disfraces: 'Costumes', elegirDisfraz: 'Choose a costume',
      elegirFondo: 'Choose a backdrop', ejecutando: 'Running…', borrarObjeto: 'Delete the sprite “{n}” and its scripts?',
      confirmarNuevo: 'Start a new project? Anything you have not saved will be lost.', nombreArchivo: 'File name:',
      guardado: 'Project saved to your computer', abierto: 'Project loaded', errorAbrir: 'That file is not a RayoBlocks project.',
      renombrar: 'New name:', nombreUsado: 'There is already a sprite with that name.', salir: 'You have unsaved changes.',
      unDisfraz: 'A sprite needs at least one costume.', unFondo: 'The stage needs at least one backdrop.',
      soloEscenario: 'The stage has no position or size', resultado: 'Result',
      practicas: 'Activities', practica: 'Activity', elegirPractica: 'Choose an activity', reto: '⭐ Extra challenge:',
      ayuda1: '💡 Help 1', ayuda2: '💡 Help 2', ayuda3: '🆘 Help 3', primero1: 'Open help 1 first.', primero2: 'Open help 2 first.',
      nota0: 'Try to solve it without help. If you use a help, it will be recorded in your project.', nota1: 'You have used 1 help: it will be recorded in your project.',
      nota2: 'You have used 2 helps: it will be recorded in your project.', nota3: 'You have used 3 helps: it will be recorded in your project.',
      seguro3: 'Help 3 gives you the complete solution and replaces your program. Are you sure you want to open it? It will be recorded that you solved the activity with great difficulty.',
      seguroN: 'Are you sure you want to open help {n}? It will be recorded that you used it.', si: 'Yes, show the help', no: 'No, I will keep trying',
      ayudaN: '💡 Help {n}:', ayuda3t: '🆘 Help 3:', solPuesta: 'The complete solution is now in your program. Click the green flag to try it and look at how each block works.',
      volverSol: '↺ Put the solution back', sinAyudas: 'no help', conAyudas: '{n} help(s)',
      cambiarPractica: 'Start another activity? Anything you have not saved from this one will be lost.', guardaPractica: 'When you finish, save your project with File → Save to your computer.'
    }
  };
  var NOMBRES_EN = { 'Chispa': 'Chispa', 'Robot': 'Robot', 'Pelota': 'Ball', 'Coche': 'Car', 'Pez': 'Fish', 'Estrella': 'Star', 'Flecha': 'Arrow', 'Cohete': 'Rocket', 'Bloque': 'Block', 'Rayo': 'Bolt', 'Nubarrón': 'Storm cloud', 'RayoMan': 'RayoMan', 'Ciudad': 'City',
    'Blanco': 'White', 'Cuadrícula XY': 'XY grid', 'Cielo': 'Sky', 'Campo': 'Field', 'Mar': 'Sea', 'Espacio': 'Space', 'Pizarra': 'Chalkboard', 'Laberinto': 'Maze',
    'Pop': 'Pop', 'Campana': 'Bell', 'Tambor': 'Drum', 'Láser': 'Laser', 'Moneda': 'Coin', 'Salto': 'Jump', 'Aplausos': 'Applause', 'Fanfarria': 'Fanfare' };
  function t(k) { return (UI[RB.lang] || UI.es)[k] || UI.es[k] || k; }
  function nombreLib(n) { return RB.lang === 'en' ? (NOMBRES_EN[n] || n) : n; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
  function svgSrc(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }

  var motor = new RBMotor($('#lienzo'));
  var ws = null, actual = null, cargando = false, cambios = false;

  /* ------------------------- Objetos del proyecto ------------------------ */
  function base(extra) {
    return Object.assign({ id: uid(), x: 0, y: 0, dir: 90, tam: 100, visible: true, estiloRot: 'all around', disfraz: 0, disfraces: [],
      bloques: null, efectos: {}, volumen: 100, lapiz: { abajo: false, color: { h: 66, s: 100, v: 100 }, tam: 1 }, decir: null }, extra);
  }
  function crearEscenario(fondo) {
    var f = B.FONDOS.filter(function (x) { return x.nombre === fondo; })[0] || B.FONDOS[0];
    return base({ nombre: 'Escenario', esEscenario: true, disfraces: [{ nombre: f.nombre, src: svgSrc(f.svg) }] });
  }
  function nombreLibre(n) {
    var usados = motor.objetos.map(function (o) { return o.nombre; });
    if (usados.indexOf(n) < 0) return n;
    for (var i = 2; ; i++) if (usados.indexOf(n + i) < 0) return n + i;
  }
  function crearObjeto(def, nombre) {
    return base({ nombre: nombreLibre(nombre || def.nombre), esEscenario: false,
      disfraces: def.disfraces.map(function (d) { return { nombre: d.nombre, src: d.src || svgSrc(d.svg) }; }) });
  }
  function libObjeto(n) { return B.OBJETOS.filter(function (o) { return o.nombre === n; })[0]; }
  function sprites() { return motor.objetos.filter(function (o) { return !o.esEscenario && !o.esClon; }); }

  RB.menus = {
    objetos: function () { return sprites().filter(function (o) { return o !== actual; }).map(function (o) { return [o.nombre, o.nombre]; }); },
    objetosSinMi: function () { return sprites().filter(function (o) { return o !== actual; }).map(function (o) { return [o.nombre, o.nombre]; }); },
    disfraces: function () { return (actual ? actual.disfraces : []).map(function (d) { return [d.nombre, d.nombre]; }); },
    fondos: function () { var e = motor.escenario(); return e ? e.disfraces.map(function (d) { return [d.nombre, d.nombre]; }) : []; },
    sonidos: function () { return B.SONIDOS.map(function (s) { return [nombreLib(s.nombre), s.nombre]; }); }
  };

  /* ------------------------------ Blockly ------------------------------- */
  function variablesBlockly() {
    return Object.keys(motor.variables).map(function (id) { return { name: motor.variables[id].nombre, id: id }; });
  }
  function guardarActual() {
    if (!actual || cargando || !ws) return;
    actual.bloques = Blockly.serialization.workspaces.save(ws);
  }
  function cargarWs(o) {
    cargando = true;
    Blockly.Events.disable();
    try {
      var estado = JSON.parse(JSON.stringify(o.bloques || {}));
      estado.variables = variablesBlockly();
      ws.clear();
      Blockly.serialization.workspaces.load(estado, ws);
    } catch (e) { console.error(e); }
    finally { Blockly.Events.enable(); cargando = false; }
    ws.scrollCenter && ws.getTopBlocks().length && ws.scrollCenter();
  }
  function mostrarVariables() {
    // Tras crear una variable, vuelve a abrir la categoría Variables para que aparezca enseguida
    var tb = ws.getToolbox(); if (!tb) return;
    var item = tb.getToolboxItems().filter(function (i) { return i.getContents && i.getContents() === 'RB_VARIABLES'; })[0];
    if (!item) return;
    if (tb.getSelectedItem() === item) tb.getFlyout().show('RB_VARIABLES'); else tb.setSelectedItem(item);
  }
  function iniciarBlockly() {
    RBBloques.registrar();
    Blockly.setLocale(BLOCKLY_MSG.es);
    var tema = Blockly.Theme.defineTheme('rayo', {
      name: 'rayo', base: Blockly.Themes.Classic,
      fontStyle: { family: 'Nunito, system-ui, sans-serif', weight: '700', size: 11 },
      componentStyles: { workspaceBackgroundColour: '#F9FAFC', toolboxBackgroundColour: '#FFFFFF', toolboxForegroundColour: '#1B2140',
        flyoutBackgroundColour: '#EEF2F8', flyoutOpacity: 1, scrollbarColour: '#C9D2E3', insertionMarkerColour: '#000000', insertionMarkerOpacity: 0.2 }
    });
    ws = Blockly.inject('blockly', {
      toolbox: RBBloques.toolbox(false), renderer: 'zelos', theme: tema, media: 'vendor/media/', trashcan: true, sounds: true,
      zoom: { controls: true, wheel: true, startScale: 0.7, maxScale: 2, minScale: 0.3, scaleSpeed: 1.15 },
      move: { scrollbars: true, drag: true, wheel: false }, grid: { spacing: 40, length: 2, colour: '#E3E8F0', snap: false }
    });
    ws.registerToolboxCategoryCallback('RB_VARIABLES', RBBloques.flyoutVariables);
    ws.registerButtonCallback('RB_NUEVA_VAR', function () { Blockly.Variables.createVariableButtonHandler(ws, null, ''); });
    ws.addChangeListener(function (e) {
      if (cargando) return;
      if (e.type === Blockly.Events.VAR_CREATE) { motor.variables[e.varId] = { id: e.varId, nombre: e.varName, valor: 0 }; motor.monitores[e.varId] = true; motor.redibujar = true;
        setTimeout(mostrarVariables, 0); }
      else if (e.type === Blockly.Events.VAR_RENAME) { if (motor.variables[e.varId]) motor.variables[e.varId].nombre = e.newName; motor.redibujar = true; }
      else if (e.type === Blockly.Events.VAR_DELETE) { delete motor.variables[e.varId]; delete motor.monitores[e.varId]; motor.redibujar = true; }
      if (e.type === Blockly.Events.CLICK && e.targetType === 'block' && e.blockId) {
        var blk = ws.getBlockById(e.blockId);
        if (blk && !blk.isInFlyout) {
          var raiz = blk.getRootBlock();
          guardarActual();
          ultimoClic = raiz;
          motor.ejecutarPila(actual, Blockly.serialization.blocks.save(raiz, { addCoordinates: false }));
        }
      }
      if (!e.isUiEvent) { guardarActual(); cambios = true; }
    });
    new ResizeObserver(function () { Blockly.svgResize(ws); }).observe($('.editor'));
  }

  /* ------------------------------ Selección ----------------------------- */
  function seleccionar(o) {
    if (!o) return;
    guardarActual();
    actual = o;
    ws.updateToolbox(RBBloques.toolbox(!!o.esEscenario));
    cargarWs(o);
    pintarTodo();
  }

  /* ------------------------------ Panel --------------------------------- */
  function miniatura(o) { var d = o.disfraces[o.disfraz] || o.disfraces[0]; return d ? d.src : ''; }
  function pintarObjetos() {
    var box = $('#objetos');
    box.innerHTML = sprites().map(function (o) {
      return '<div class="ficha' + (o === actual ? ' sel' : '') + '" data-id="' + o.id + '" title="' + esc(o.nombre) + '"><img alt="" src="' + miniatura(o) + '"><span>' + esc(o.nombre) +
        '</span><button class="x" data-borrar="' + o.id + '" aria-label="Borrar">✕</button></div>';
    }).join('') +
      '<button class="nuevo" id="n-objeto"><b>+</b>' + esc(t('elegirObjeto')) + '</button>' +
      '<button class="nuevo" id="n-subir-objeto"><b>⬆</b>' + esc(t('subir')) + '</button>';
    var e = motor.escenario(), fe = $('#ficha-escenario');
    fe.classList.toggle('sel', actual === e);
    fe.querySelector('img').src = miniatura(e);
  }
  function pintarTrajes() {
    var o = actual, box = $('#trajes');
    if (!o) { box.innerHTML = ''; return; }
    box.innerHTML = '<span class="tit">' + esc(o.esEscenario ? t('fondos') : t('disfraces')) + '</span>' +
      o.disfraces.map(function (d, i) {
        return '<div class="traje' + (i === o.disfraz ? ' sel' : '') + '" data-k="' + i + '" title="' + esc(d.nombre) + '"><span class="n">' + (i + 1) + '</span><img alt="" src="' + d.src + '"><span>' +
          esc(nombreLib(d.nombre)) + '</span><button class="x" data-quitar="' + i + '" aria-label="Borrar">✕</button></div>';
      }).join('') +
      '<button class="nuevo" id="n-traje"><b>+</b>' + esc(o.esEscenario ? t('elegirFondo') : t('elegirDisfraz')) + '</button>' +
      '<button class="nuevo" id="n-subir-traje"><b>⬆</b>' + esc(t('subir')) + '</button>';
  }
  function pintarInfo() {
    var o = actual; if (!o) return;
    var es = !!o.esEscenario;
    var campos = { '#i-nombre': es ? t('escenario') : o.nombre, '#i-x': Math.round(o.x), '#i-y': Math.round(o.y), '#i-tam': Math.round(o.tam), '#i-dir': Math.round(o.dir) };
    Object.keys(campos).forEach(function (s) {
      var el = $(s);
      el.disabled = es;
      if (document.activeElement !== el) el.value = es && s !== '#i-nombre' ? '' : campos[s];
    });
    $('#i-ver').classList.toggle('on', !es && o.visible);
    $('#i-ocultar').classList.toggle('on', !es && !o.visible);
    $('#i-ver').disabled = $('#i-ocultar').disabled = es;
    $('#info').title = es ? t('soloEscenario') : '';
  }
  function pintarTodo() { pintarObjetos(); pintarTrajes(); pintarInfo(); }

  var pendiente = false;
  motor.alCambiar = function (que, o) {
    if (que === 'resultado') return mostrarResultado(o);
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      pintarInfo();
      // miniaturas y disfraz seleccionado
      sprites().forEach(function (s) {
        var img = document.querySelector('.ficha[data-id="' + s.id + '"] img');
        if (img && img.getAttribute('src') !== miniatura(s)) img.src = miniatura(s);
      });
      var fe = document.querySelector('#ficha-escenario img');
      if (fe.getAttribute('src') !== miniatura(motor.escenario())) fe.src = miniatura(motor.escenario());
      if (actual) document.querySelectorAll('.traje').forEach(function (el) { el.classList.toggle('sel', +el.dataset.k === actual.disfraz); });
    });
  };
  motor.alEstado = function (enMarcha) {
    $('#b-bandera').classList.toggle('on', enMarcha);
    $('#estado').textContent = enMarcha ? t('ejecutando') : '';
  };
  var ultimoClic = null;
  function mostrarResultado(valor) {
    var r = document.createElement('div');
    r.className = 'resultado';
    r.textContent = valor === '' ? '""' : valor;
    var caja = ultimoClic && ultimoClic.getSvgRoot ? ultimoClic.getSvgRoot().getBoundingClientRect() : { left: 200, top: 200, height: 0 };
    r.style.left = Math.max(8, caja.left) + 'px';
    r.style.top = Math.max(8, caja.top + caja.height + 6) + 'px';
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 2200);
  }

  $('#objetos').addEventListener('click', function (e) {
    var b = e.target.closest('[data-borrar]');
    if (b) { borrarObjeto(motor.objetos.filter(function (o) { return o.id === b.dataset.borrar; })[0]); return; }
    var f = e.target.closest('.ficha');
    if (f) { seleccionar(motor.objetos.filter(function (o) { return o.id === f.dataset.id; })[0]); return; }
    if (e.target.closest('#n-objeto')) elegirObjeto();
    if (e.target.closest('#n-subir-objeto')) subirImagen('objeto');
  });
  $('#ficha-escenario').addEventListener('click', function () { seleccionar(motor.escenario()); });
  $('#trajes').addEventListener('click', function (e) {
    var q = e.target.closest('[data-quitar]');
    if (q) {
      if (actual.disfraces.length < 2) return aviso(actual.esEscenario ? t('unFondo') : t('unDisfraz'));
      var k = +q.dataset.quitar;
      actual.disfraces.splice(k, 1);
      if (actual.disfraz >= actual.disfraces.length) actual.disfraz = actual.disfraces.length - 1;
      cambios = true; motor.redibujar = true; pintarTodo(); return;
    }
    var tr = e.target.closest('.traje');
    if (tr) { actual.disfraz = +tr.dataset.k; motor.cambio(actual); pintarTrajes(); return; }
    if (e.target.closest('#n-traje')) actual.esEscenario ? elegirFondo() : elegirDisfraz();
    if (e.target.closest('#n-subir-traje')) subirImagen('disfraz');
  });
  $('#trajes').addEventListener('dblclick', function (e) {
    var tr = e.target.closest('.traje'); if (!tr) return;
    var d = actual.disfraces[+tr.dataset.k];
    var n = prompt(t('renombrar'), d.nombre);
    if (n && n.trim()) { d.nombre = n.trim(); cambios = true; pintarTrajes(); }
  });

  function borrarObjeto(o) {
    if (!o || !confirm(t('borrarObjeto').replace('{n}', o.nombre))) return;
    motor.pararTodo();
    motor.objetos.splice(motor.objetos.indexOf(o), 1);
    cambios = true; motor.redibujar = true;
    actual = null;
    seleccionar(sprites()[0] || motor.escenario());
  }

  // Campos de información
  function campoNum(sel, fn) {
    $(sel).addEventListener('change', function () { if (!actual || actual.esEscenario) return; fn(Number(this.value) || 0); cambios = true; });
  }
  campoNum('#i-x', function (v) { motor.mover(actual, v, actual.y); });
  campoNum('#i-y', function (v) { motor.mover(actual, actual.x, v); });
  campoNum('#i-tam', function (v) { motor.tamano(actual, v); });
  campoNum('#i-dir', function (v) { motor.girar(actual, v); });
  $('#i-ver').addEventListener('click', function () { if (actual && !actual.esEscenario) { actual.visible = true; motor.cambio(actual); cambios = true; } });
  $('#i-ocultar').addEventListener('click', function () { if (actual && !actual.esEscenario) { actual.visible = false; motor.cambio(actual); cambios = true; } });
  $('#i-nombre').addEventListener('change', function () {
    if (!actual || actual.esEscenario) return;
    var n = this.value.trim();
    if (!n || n === actual.nombre) { this.value = actual.nombre; return; }
    if (motor.objetos.some(function (o) { return o !== actual && o.nombre === n; })) { aviso(t('nombreUsado')); this.value = actual.nombre; return; }
    renombrarObjeto(actual, n);
  });
  function renombrarObjeto(o, n) {
    guardarActual();
    var viejo = o.nombre;
    var CAMPOS = ['TO', 'TOWARDS', 'OBJECT', 'CLONE_OPTION', 'TOUCHINGOBJECTMENU', 'DISTANCETOMENU'];
    var recorrer = function (b) {
      if (!b || typeof b !== 'object') return;
      if (b.fields) CAMPOS.forEach(function (c) { if (b.fields[c] === viejo) b.fields[c] = n; });
      Object.keys(b).forEach(function (k) { if (b[k] && typeof b[k] === 'object') recorrer(b[k]); });
    };
    motor.objetos.forEach(function (x) { recorrer(x.bloques); });
    o.nombre = n;
    cambios = true;
    cargarWs(actual);
    pintarObjetos();
  }

  /* ------------------------------ Ventanas ------------------------------ */
  function ventana(titulo, html, alAbrir) {
    $('#v-tit').textContent = titulo;
    $('#v-cuerpo').innerHTML = html;
    $('#velo').hidden = false;
    if (alAbrir) alAbrir($('#v-cuerpo'));
    $('#v-cerrar').focus();
  }
  function cerrarVentana() { $('#velo').hidden = true; $('#v-cuerpo').innerHTML = ''; }
  $('#v-cerrar').addEventListener('click', cerrarVentana);
  $('#velo').addEventListener('click', function (e) { if (e.target === this) cerrarVentana(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#velo').hidden) cerrarVentana(); });

  function galeria(items, clase, alElegir) {
    ventana(items.titulo, '<div class="galeria ' + (clase || '') + '">' + items.lista.map(function (it, i) {
      return '<button data-k="' + i + '"><img alt="" src="' + it.src + '">' + esc(nombreLib(it.nombre)) + '</button>';
    }).join('') + '</div>', function (c) {
      c.addEventListener('click', function (e) {
        var b = e.target.closest('[data-k]'); if (!b) return;
        cerrarVentana(); alElegir(items.lista[+b.dataset.k]);
      });
    });
  }
  function elegirObjeto() {
    galeria({ titulo: t('elegirObjeto'), lista: B.OBJETOS.map(function (o) { return { nombre: o.nombre, src: svgSrc(o.disfraces[0].svg), def: o }; }) }, '', function (it) {
      var o = crearObjeto(it.def, nombreLib(it.def.nombre));
      o.x = Math.round(Math.random() * 240 - 120); o.y = Math.round(Math.random() * 160 - 80);
      o.disfraces.forEach(function (d) { motor.prepararDisfraz(d); });
      motor.objetos.push(o);
      cambios = true; motor.redibujar = true;
      seleccionar(o);
    });
  }
  function elegirDisfraz() {
    var lista = [];
    B.OBJETOS.forEach(function (o) { o.disfraces.forEach(function (d) { lista.push({ nombre: d.nombre, src: svgSrc(d.svg) }); }); });
    galeria({ titulo: t('elegirDisfraz'), lista: lista }, '', function (it) { anadirTraje({ nombre: it.nombre, src: it.src }); });
  }
  function elegirFondo() {
    galeria({ titulo: t('elegirFondo'), lista: B.FONDOS.map(function (f) { return { nombre: f.nombre, src: svgSrc(f.svg) }; }) }, 'fondos', function (it) {
      anadirTraje({ nombre: it.nombre, src: it.src });
    });
  }
  function anadirTraje(d) {
    var o = actual;
    var usados = o.disfraces.map(function (x) { return x.nombre; }), n = d.nombre, i = 2;
    while (usados.indexOf(n) >= 0) n = d.nombre + (i++);
    d.nombre = n;
    motor.prepararDisfraz(d);
    o.disfraces.push(d);
    o.disfraz = o.disfraces.length - 1;
    cambios = true; motor.cambio(o);
    pintarTodo();
  }
  var destinoSubida = 'objeto';
  function subirImagen(destino) { destinoSubida = destino; $('#f-imagen').value = ''; $('#f-imagen').click(); }
  $('#f-imagen').addEventListener('change', function () {
    var file = this.files[0]; if (!file) return;
    var nombre = file.name.replace(/\.[^.]+$/, '').slice(0, 30) || 'imagen';
    leerImagen(file).then(function (src) {
      if (destinoSubida === 'objeto') {
        var o = base({ nombre: nombreLibre(nombre), esEscenario: false, disfraces: [{ nombre: nombre, src: src }] });
        motor.prepararDisfraz(o.disfraces[0]);
        motor.objetos.push(o);
        cambios = true;
        seleccionar(o);
      } else anadirTraje({ nombre: nombre, src: src });
    });
  });
  function leerImagen(file) {
    return new Promise(function (ok) {
      var fr = new FileReader();
      fr.onload = function () {
        if (/svg/.test(file.type)) return ok(fr.result);
        var img = new Image();
        img.onload = function () {
          // Las fotos grandes se reducen para que quepan en el escenario y el archivo no pese tanto
          var max = actual && actual.esEscenario && destinoSubida !== 'objeto' ? 960 : 360;
          var s = Math.min(1, max / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          ok(c.toDataURL(/jpe?g/.test(file.type) ? 'image/jpeg' : 'image/png', 0.88));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* ------------------------------ Escenario ----------------------------- */
  var lienzo = $('#lienzo'), arrastre = null;
  function puntoEscena(e) {
    var r = lienzo.getBoundingClientRect();
    var x = (e.clientX - r.left) * 480 / r.width - 240, y = 180 - (e.clientY - r.top) * 360 / r.height;
    return { x: Math.max(-240, Math.min(240, x)), y: Math.max(-180, Math.min(180, y)) };
  }
  lienzo.addEventListener('pointerdown', function (e) {
    motor.audio();
    var p = puntoEscena(e);
    motor.raton.x = p.x; motor.raton.y = p.y; motor.raton.abajo = true;
    var o = motor.objetoEn(p.x, p.y);
    arrastre = { o: o, dx: o ? o.x - p.x : 0, dy: o ? o.y - p.y : 0, x0: e.clientX, y0: e.clientY, movido: false };
    lienzo.setPointerCapture(e.pointerId);
  });
  lienzo.addEventListener('pointermove', function (e) {
    var p = puntoEscena(e);
    motor.raton.x = p.x; motor.raton.y = p.y;
    $('#coords').textContent = 'x: ' + Math.round(p.x) + ' · y: ' + Math.round(p.y);
    if (arrastre && arrastre.o && !arrastre.o.esClon) {
      if (!arrastre.movido && Math.hypot(e.clientX - arrastre.x0, e.clientY - arrastre.y0) > 4) {
        arrastre.movido = true;
        var k = motor.objetos.indexOf(arrastre.o); motor.objetos.splice(k, 1); motor.objetos.push(arrastre.o);
      }
      if (arrastre.movido) { arrastre.o.x = p.x + arrastre.dx; arrastre.o.y = p.y + arrastre.dy; motor.cambio(arrastre.o); }
    }
  });
  lienzo.addEventListener('pointerup', function () {
    motor.raton.abajo = false;
    if (!arrastre) return;
    if (!arrastre.movido) motor.clicEn(arrastre.o);
    else { cambios = true; if (arrastre.o !== actual) seleccionar(arrastre.o); }
    arrastre = null;
  });
  new ResizeObserver(function () { motor.ajustarTamano(); }).observe($('#escena'));

  function escribiendo(el) {
    return el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable || (el.closest && el.closest('.blocklyWidgetDiv,.blocklyDropDownDiv')));
  }
  document.addEventListener('keydown', function (e) {
    if (escribiendo(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (motor.tecla(e, true) && (e.key === ' ' || /^Arrow/.test(e.key)) && !(e.target.closest && e.target.closest('.blocklySvg,.blocklyToolboxDiv'))) e.preventDefault();
  });
  document.addEventListener('keyup', function (e) { motor.tecla(e, false); });
  window.addEventListener('blur', function () { motor.teclas = {}; });

  motor.alPreguntar = function (texto) {
    var p = $('#preguntar');
    if (texto === null) { p.hidden = true; return; }
    $('#preguntar-q').textContent = texto;
    $('#preguntar-q').hidden = !texto;
    $('#respuesta').value = '';
    p.hidden = false;
    setTimeout(function () { $('#respuesta').focus(); }, 30);
  };
  $('#f-respuesta').addEventListener('submit', function (e) {
    e.preventDefault();
    motor.responder($('#respuesta').value);
    $('#preguntar').hidden = true;
  });

  $('#b-bandera').addEventListener('click', function () { guardarActual(); motor.banderaVerde(); });
  $('#b-parar').addEventListener('click', function () { motor.pararTodo(); });
  $('#b-grande').addEventListener('click', function () {
    document.body.classList.toggle('grande');
    setTimeout(function () { motor.ajustarTamano(); Blockly.svgResize(ws); }, 30);
  });

  var temporizadorAviso;
  function aviso(texto) {
    var a = $('#aviso'); a.textContent = texto; a.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { a.hidden = true; }, 2600);
  }

  /* ------------------------------ Archivos ------------------------------ */
  var PRACTICAS = [], practicaActual = null, ayudas = {}, preguntaAyuda = 0;
  function proyectoJSON() {
    guardarActual();
    return {
      formato: 'rayoblocks', version: 1,
      objetos: motor.objetos.filter(function (o) { return !o.esClon; }).map(function (o) {
        return { nombre: o.nombre, esEscenario: !!o.esEscenario, x: o.x, y: o.y, dir: o.dir, tam: o.tam, visible: o.visible, estiloRot: o.estiloRot,
          disfraz: o.disfraz, volumen: o.volumen,
          disfraces: o.disfraces.map(function (d) { return { nombre: d.nombre, src: d.src, cx: d.cx, cy: d.cy, w: d.w, h: d.h }; }),
          bloques: o.bloques };
      }),
      variables: Object.keys(motor.variables).map(function (id) { var v = motor.variables[id]; return { id: id, nombre: v.nombre, valor: v.valor, monitor: !!motor.monitores[id] }; }),
      mensajes: RB.proyecto.mensajes.slice(),
      practica: practicaActual === null ? undefined : { n: practicaActual + 1, ayudas: ayudas[practicaActual] || 0, titulo: PRACTICAS[practicaActual].t.es }
    };
  }
  function abrirProyecto(datos) {
    if (!datos || datos.formato !== 'rayoblocks' || !Array.isArray(datos.objetos) || !datos.objetos.some(function (o) { return o.esEscenario; })) throw new Error('formato');
    var objetos = datos.objetos.map(function (o) {
      return base({ nombre: String(o.nombre || 'Objeto'), esEscenario: !!o.esEscenario, x: +o.x || 0, y: +o.y || 0, dir: o.dir === undefined ? 90 : +o.dir,
        tam: +o.tam || 100, visible: o.visible !== false, estiloRot: o.estiloRot || 'all around', disfraz: +o.disfraz || 0, volumen: o.volumen === undefined ? 100 : +o.volumen,
        disfraces: (o.disfraces || []).filter(function (d) { return d && typeof d.src === 'string' && /^data:image\//.test(d.src); })
          .map(function (d) { return { nombre: String(d.nombre || 'disfraz'), src: d.src, cx: d.cx, cy: d.cy, w: d.w, h: d.h }; }),
        bloques: o.bloques || null });
    }).filter(function (o) { return o.disfraces.length; });
    objetos.sort(function (a, b) { return (b.esEscenario ? 1 : 0) - (a.esEscenario ? 1 : 0); });
    if (!objetos.length || !objetos[0].esEscenario) throw new Error('formato');
    objetos.forEach(function (o) { if (o.disfraz >= o.disfraces.length) o.disfraz = 0; });
    motor.monitores = {};
    motor.cargar(objetos, datos.variables || []);
    RB.proyecto.mensajes = Array.isArray(datos.mensajes) ? datos.mensajes.map(String) : [];
    actual = null;
    seleccionar(sprites()[0] || motor.escenario());
    cambios = false;
    var pr = datos.practica, k = pr && Math.round(+pr.n) - 1;
    if (pr && k >= 0 && k < PRACTICAS.length) {
      practicaActual = k;
      ayudas[k] = Math.max(ayudas[k] || 0, Math.min(3, Math.max(0, Math.round(+pr.ayudas) || 0)));
      nombreProyecto = (RB.lang === 'en' ? 'activity-' : 'practica-') + (k + 1);
    } else practicaActual = null;
    pintarPractica();
  }
  function descargar(nombre, texto) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
    a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  var nombreProyecto = 'mi-proyecto';
  function guardar() {
    var n = prompt(t('nombreArchivo'), nombreProyecto);
    if (n === null) return;
    n = (n.trim() || 'mi-proyecto').replace(/[\\/:*?"<>|]+/g, '-').replace(/\.rayo$/i, '');
    nombreProyecto = n;
    descargar(n + '.rayo', JSON.stringify(proyectoJSON()));
    cambios = false;
    aviso(t('guardado'));
  }
  $('#f-abrir').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      try { abrirProyecto(JSON.parse(fr.result)); nombreProyecto = f.name.replace(/\.(rayo|json)$/i, ''); aviso(t('abierto')); }
      catch (e) { console.error(e); alert(t('errorAbrir')); }
    };
    fr.readAsText(f);
    this.value = '';
  });
  window.addEventListener('beforeunload', function (e) { if (cambios) { e.preventDefault(); e.returnValue = t('salir'); } });

  // Menú Archivo
  var mArchivo = $('#m-archivo'), bArchivo = $('#b-archivo');
  bArchivo.addEventListener('click', function (e) { e.stopPropagation(); var abrir = mArchivo.hidden; mArchivo.hidden = !abrir; bArchivo.setAttribute('aria-expanded', abrir); });
  document.addEventListener('click', function () { mArchivo.hidden = true; bArchivo.setAttribute('aria-expanded', 'false'); });
  mArchivo.addEventListener('click', function (e) {
    var b = e.target.closest('[data-acc]'); if (!b) return;
    var acc = b.dataset.acc;
    if (acc === 'guardar') return guardar();
    if (acc === 'abrir') return $('#f-abrir').click();
    if (cambios && !confirm(t('confirmarNuevo'))) return;
    if (acc === 'nuevo') proyectoNuevo();
    else abrirProyecto(EJEMPLOS[acc]());
    cambios = false;
  });

  /* ------------------------------ Ejemplos ------------------------------ */
  function blk(tipo, campos, entradas) { var b = { type: tipo, id: uid() }; if (campos) b.fields = campos; if (entradas) b.inputs = entradas; return b; }
  function n(v, bloque) { var e = { shadow: { type: 'rb_num', id: uid(), fields: { NUM: v } } }; if (bloque) e.block = bloque; return e; }
  function tx(v, bloque) { var e = { shadow: { type: 'rb_text', id: uid(), fields: { TEXT: String(v) } } }; if (bloque) e.block = bloque; return e; }
  function cadena(lista) { for (var i = 0; i < lista.length - 1; i++) lista[i].next = { block: lista[i + 1] }; return lista[0]; }
  function sub(lista) { return { block: cadena(lista) }; }
  function programa(x, y, lista) { var c = cadena(lista); c.x = x; c.y = y; return c; }
  function estado(programas) { return { blocks: { languageVersion: 0, blocks: programas } }; }
  function obj(nombre, extra) { var o = crearObjeto(libObjeto(nombre)); o.nombre = nombreLib(nombre); return proyectoObjeto(Object.assign(o, extra)); }
  function proyectoObjeto(o) {
    return { nombre: o.nombre, esEscenario: !!o.esEscenario, x: o.x, y: o.y, dir: o.dir, tam: o.tam, visible: o.visible, estiloRot: o.estiloRot,
      disfraz: o.disfraz, volumen: o.volumen, disfraces: o.disfraces, bloques: o.bloques };
  }
  function esc2(fondos) {
    var e = crearEscenario(fondos[0]);
    fondos.slice(1).forEach(function (f) { var d = B.FONDOS.filter(function (x) { return x.nombre === f; })[0]; e.disfraces.push({ nombre: d.nombre, src: svgSrc(d.svg) }); });
    return proyectoObjeto(e);
  }
  var hola = function () { return RB.lang === 'en' ? 'Hello! I am Chispa' : '¡Hola! Soy Chispa'; };
  var EJEMPLOS = {
    'ejemplo-gato': function () {
      return { formato: 'rayoblocks', version: 1, mensajes: [], variables: [], objetos: [esc2(['Campo', 'Cielo']), obj('Chispa', { estiloRot: 'left-right', bloques: estado([
        programa(30, 30, [blk('event_whenflagclicked'), blk('motion_gotoxy', null, { X: n(0), Y: n(-40) }), blk('looks_sayforsecs', null, { MESSAGE: tx(hola()), SECS: n(2) }),
          blk('control_forever', null, { SUBSTACK: sub([blk('motion_move', null, { STEPS: n(8) }), blk('motion_ifonedgebounce'), blk('looks_nextcostume'), blk('control_wait', null, { DURATION: n(0.15) })]) })]),
        programa(30, 560, [blk('event_whenthisspriteclicked'), blk('sound_play', { SOUND: 'Salto' }), blk('looks_changeeffectby', { EFFECT: 'color' }, { CHANGE: n(25) })])
      ]) })] };
    },
    'ejemplo-dibujo': function () {
      var lados = { id: 'var-lados' }, pregunta = RB.lang === 'en' ? 'How many sides?' : '¿Cuántos lados?';
      return { formato: 'rayoblocks', version: 1, mensajes: [], variables: [{ id: 'var-lados', nombre: RB.lang === 'en' ? 'sides' : 'lados', valor: 0, monitor: true }],
        objetos: [esc2(['Cuadrícula XY']), obj('Flecha', { tam: 50, x: -50, y: -90, bloques: estado([
          programa(30, 30, [blk('event_whenflagclicked'), blk('pen_clear'), blk('pen_penUp'), blk('motion_gotoxy', null, { X: n(-50), Y: n(-90) }),
            blk('motion_pointindirection', null, { DIRECTION: n(90) }), blk('sensing_askandwait', null, { QUESTION: tx(pregunta) }),
            blk('data_setvariableto', { VARIABLE: lados }, { VALUE: tx(0, blk('sensing_answer')) }),
            blk('pen_setPenColorTo', { COLOR: '#1E88E5' }), blk('pen_setPenSizeTo', null, { SIZE: n(4) }), blk('pen_penDown'),
            blk('control_repeat', null, { TIMES: n(10, blk('data_variable', { VARIABLE: lados })), SUBSTACK: sub([
              blk('motion_move', null, { STEPS: n(100) }),
              blk('motion_turnleft', null, { DEGREES: n(15, blk('operator_divide', null, { NUM1: n(360), NUM2: n(0, blk('data_variable', { VARIABLE: lados })) })) }),
              blk('control_wait', null, { DURATION: n(0.2) })]) }),
            blk('pen_penUp')])
        ]) })] };
    },
    'ejemplo-juego': function () {
      var puntos = { id: 'var-puntos' };
      var flecha = function (tecla, tipo, cant) {
        return blk('control_if', null, { CONDITION: { block: blk('sensing_keypressed', { KEY_OPTION: tecla }) }, SUBSTACK: sub([blk(tipo, null, tipo === 'motion_changexby' ? { DX: n(cant) } : { DY: n(cant) })]) });
      };
      return { formato: 'rayoblocks', version: 1, mensajes: [], variables: [{ id: 'var-puntos', nombre: RB.lang === 'en' ? 'points' : 'puntos', valor: 0, monitor: true }],
        objetos: [esc2(['Espacio']),
          obj('Chispa', { tam: 70, estiloRot: 'left-right', bloques: estado([
            programa(30, 30, [blk('event_whenflagclicked'), blk('data_setvariableto', { VARIABLE: puntos }, { VALUE: tx(0) }), blk('motion_gotoxy', null, { X: n(0), Y: n(0) }),
              blk('control_forever', null, { SUBSTACK: sub([flecha('right arrow', 'motion_changexby', 8), flecha('left arrow', 'motion_changexby', -8),
                flecha('up arrow', 'motion_changeyby', 8), flecha('down arrow', 'motion_changeyby', -8)]) })])
          ]) }),
          obj('Estrella', { x: 150, y: 100, bloques: estado([
            programa(30, 30, [blk('event_whenflagclicked'), blk('control_forever', null, { SUBSTACK: sub([
              blk('motion_goto', { TO: '_random_' }),
              blk('control_wait_until', null, { CONDITION: { block: blk('sensing_touchingobject', { TOUCHINGOBJECTMENU: 'Chispa' }) } }),
              blk('sound_play', { SOUND: 'Moneda' }), blk('data_changevariableby', { VARIABLE: puntos }, { VALUE: n(1) })]) })])
          ]) })] };
    },

    /* Juego completo: RayoMan atrapa los rayos que caen y esquiva los nubarrones.
       Flechas ← → para moverse · cada rayo suma 1 punto · cada nubarrón quita 1 vida · cuanto más puntos, más rápido caen. */
    'ejemplo-rayoman': function () {
      var en = RB.lang === 'en', L = function (es, ing) { return en ? ing : es; };
      var puntos = { id: 'var-puntos' }, vidas = { id: 'var-vidas' }, record = { id: 'var-record' };
      var vr = function (v) { return blk('data_variable', { VARIABLE: v }); };
      var MSG_EMPEZAR = L('empezar', 'start'), MSG_GOLPE = L('golpe', 'hit'), MSG_FIN = L('fin', 'game over');
      var RM = 'RayoMan';
      var tecla = function (k, dir, dx) {
        return blk('control_if', null, { CONDITION: { block: blk('sensing_keypressed', { KEY_OPTION: k }) }, SUBSTACK: sub([
          blk('motion_pointindirection', null, { DIRECTION: n(dir) }), blk('motion_changexby', null, { DX: n(dx) })]) });
      };
      var limite = function (op, valor) {
        return blk('control_if', null, { CONDITION: { block: blk(op, null, { OPERAND1: tx('', blk('motion_xposition')), OPERAND2: tx(valor) }) },
          SUBSTACK: sub([blk('motion_setx', null, { X: n(valor) })]) });
      };
      // velocidad de caída = -(base + puntos / divisor): cuantos más puntos, más rápido
      var caida = function (base, divisor) {
        return n(-5, blk('operator_subtract', null, { NUM1: n(0), NUM2: n(0, blk('operator_add', null, { NUM1: n(base),
          NUM2: n(0, blk('operator_divide', null, { NUM1: n(0, vr(puntos)), NUM2: n(divisor) })) })) }));
      };
      var alAzar = function (a, b) { return blk('operator_random', null, { FROM: n(a), TO: n(b) }); };
      var finObjeto = function (y) { return programa(30, y, [blk('event_whenbroadcastreceived', { BROADCAST: MSG_FIN }), blk('looks_hide'),
        blk('control_stop', { STOP_OPTION: 'other scripts in sprite' })]); };

      var escenario = esc2(['Ciudad']);
      escenario.bloques = estado([
        programa(30, 30, [blk('event_whenflagclicked'), blk('looks_switchbackdropto', { BACKDROP: 'Ciudad' }),
          blk('data_setvariableto', { VARIABLE: puntos }, { VALUE: tx(0) }), blk('data_setvariableto', { VARIABLE: vidas }, { VALUE: tx(3) })])
      ]);

      var rayoman = obj('RayoMan', { x: 0, y: -125, tam: 55, estiloRot: 'left-right', bloques: estado([
        programa(30, 30, [blk('event_whenflagclicked'), blk('looks_switchcostumeto', { COSTUME: 'rayoman-saluda' }),
          blk('motion_gotoxy', null, { X: n(0), Y: n(-125) }), blk('motion_pointindirection', null, { DIRECTION: n(90) }),
          blk('looks_cleargraphiceffects'), blk('looks_show'),
          blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Atrapa los rayos ⚡ y esquiva los nubarrones! Usa las flechas ← →', 'Catch the bolts ⚡ and dodge the storm clouds! Use the ← → arrows')), SECS: n(3) }),
          blk('looks_switchcostumeto', { COSTUME: 'rayoman-vuela' }), blk('event_broadcast', { BROADCAST: MSG_EMPEZAR }),
          blk('control_repeat_until', null, { CONDITION: { block: blk('operator_lt', null, { OPERAND1: tx('', vr(vidas)), OPERAND2: tx(1) }) },
            SUBSTACK: sub([tecla('right arrow', 90, 10), tecla('left arrow', -90, -10), limite('operator_gt', 210), limite('operator_lt', -210)]) })]),
        programa(700, 30, [blk('event_whenbroadcastreceived', { BROADCAST: MSG_GOLPE }), blk('sound_play', { SOUND: 'Tambor' }),
          blk('control_repeat', null, { TIMES: n(4), SUBSTACK: sub([blk('looks_seteffectto', { EFFECT: 'ghost' }, { VALUE: n(70) }), blk('control_wait', null, { DURATION: n(0.1) }),
            blk('looks_seteffectto', { EFFECT: 'ghost' }, { VALUE: n(0) }), blk('control_wait', null, { DURATION: n(0.1) })]) }),
          blk('control_if', null, { CONDITION: { block: blk('operator_lt', null, { OPERAND1: tx('', vr(vidas)), OPERAND2: tx(1) }) },
            SUBSTACK: sub([blk('event_broadcast', { BROADCAST: MSG_FIN })]) })]),
        programa(700, 640, [blk('event_whenbroadcastreceived', { BROADCAST: MSG_FIN }),
          blk('control_if', null, { CONDITION: { block: blk('operator_gt', null, { OPERAND1: tx('', vr(puntos)), OPERAND2: tx('', vr(record)) }) },
            SUBSTACK: sub([blk('data_setvariableto', { VARIABLE: record }, { VALUE: tx(0, vr(puntos)) }), blk('sound_play', { SOUND: 'Fanfarria' })]) }),
          blk('looks_switchcostumeto', { COSTUME: 'rayoman-saluda' }), blk('looks_cleargraphiceffects'),
          blk('looks_sayforsecs', null, { MESSAGE: tx('', blk('operator_join', null, { STRING1: tx(L('¡Fin de la partida! Puntos: ', 'Game over! Points: ')), STRING2: tx('', vr(puntos)) })), SECS: n(3) }),
          blk('control_stop', { STOP_OPTION: 'all' })])
      ]) });

      var rayo = obj('Rayo', { x: 0, y: 170, tam: 80, visible: false, bloques: estado([
        programa(30, 30, [blk('event_whenflagclicked'), blk('looks_hide')]),
        programa(30, 180, [blk('event_whenbroadcastreceived', { BROADCAST: MSG_EMPEZAR }), blk('control_forever', null, { SUBSTACK: sub([
          blk('control_create_clone_of', { CLONE_OPTION: '_myself_' }),
          blk('control_wait', null, { DURATION: n(1, blk('operator_divide', null, { NUM1: n(0, alAzar(6, 14)), NUM2: n(10) })) })]) })]),
        programa(600, 30, [blk('control_start_as_clone'), blk('motion_gotoxy', null, { X: n(0, alAzar(-210, 210)), Y: n(170) }), blk('looks_show'),
          blk('control_repeat_until', null, { CONDITION: { block: blk('operator_lt', null, { OPERAND1: tx('', blk('motion_yposition')), OPERAND2: tx(-170) }) }, SUBSTACK: sub([
            blk('motion_changeyby', null, { DY: caida(4, 5) }),
            blk('control_if', null, { CONDITION: { block: blk('sensing_touchingobject', { TOUCHINGOBJECTMENU: RM }) }, SUBSTACK: sub([
              blk('sound_play', { SOUND: 'Moneda' }), blk('data_changevariableby', { VARIABLE: puntos }, { VALUE: n(1) }), blk('control_delete_this_clone')]) })]) }),
          blk('control_delete_this_clone')]),
        finObjeto(440)
      ]) });

      var nube = obj('Nubarrón', { x: 0, y: 170, tam: 70, visible: false, bloques: estado([
        programa(30, 30, [blk('event_whenflagclicked'), blk('looks_hide')]),
        programa(30, 180, [blk('event_whenbroadcastreceived', { BROADCAST: MSG_EMPEZAR }), blk('control_wait', null, { DURATION: n(3) }),
          blk('control_forever', null, { SUBSTACK: sub([blk('control_create_clone_of', { CLONE_OPTION: '_myself_' }),
            blk('control_wait', null, { DURATION: n(2, alAzar(2, 4)) })]) })]),
        programa(600, 30, [blk('control_start_as_clone'), blk('motion_gotoxy', null, { X: n(0, alAzar(-200, 200)), Y: n(170) }), blk('looks_show'),
          blk('control_repeat_until', null, { CONDITION: { block: blk('operator_lt', null, { OPERAND1: tx('', blk('motion_yposition')), OPERAND2: tx(-170) }) }, SUBSTACK: sub([
            blk('motion_changeyby', null, { DY: caida(3, 8) }),
            blk('control_if', null, { CONDITION: { block: blk('sensing_touchingobject', { TOUCHINGOBJECTMENU: RM }) }, SUBSTACK: sub([
              blk('data_changevariableby', { VARIABLE: vidas }, { VALUE: n(-1) }), blk('event_broadcast', { BROADCAST: MSG_GOLPE }), blk('control_delete_this_clone')]) })]) }),
          blk('control_delete_this_clone')]),
        finObjeto(480)
      ]) });

      return { formato: 'rayoblocks', version: 1, mensajes: [MSG_EMPEZAR, MSG_GOLPE, MSG_FIN],
        variables: [{ id: 'var-puntos', nombre: L('puntos', 'points'), valor: 0, monitor: true }, { id: 'var-vidas', nombre: L('vidas', 'lives'), valor: 3, monitor: true },
          { id: 'var-record', nombre: L('récord', 'record'), valor: 0, monitor: true }],
        objetos: [escenario, rayoman, rayo, nube] };
    }
  };
  PRACTICAS = window.RBPracticas ? window.RBPracticas({ L: function (es, en) { return RB.lang === 'en' ? en : es; }, blk: blk, n: n, tx: tx, sub: sub,
    programa: programa, estado: estado, obj: obj, esc: esc2, nom: nombreLib }) : [];
  function proyectoNuevo() {
    abrirProyecto({ formato: 'rayoblocks', version: 1, mensajes: [], variables: [], objetos: [esc2(['Blanco']), obj('Chispa')] });
  }

  /* ------------------------------ Prácticas ------------------------------ */
  function L2(o) { return o[RB.lang] || o.es; }
  function abrirPractica(k) {
    if (k < 0 || k >= PRACTICAS.length) return;
    if (cambios && !confirm(t('cambiarPractica'))) return;
    var d = PRACTICAS[k].inicio();
    d.practica = { n: k + 1, ayudas: ayudas[k] || 0 };
    preguntaAyuda = 0;
    abrirProyecto(d);
    $('#practica').classList.remove('plegada');
  }
  function cargarSolucion() {
    var k = practicaActual; if (k === null) return;
    var d = PRACTICAS[k].sol();
    d.practica = { n: k + 1, ayudas: ayudas[k] || 0 };
    abrirProyecto(d);
    cambios = true;
  }
  function pintarPractica() {
    var caja = $('#practica');
    if (practicaActual === null) { caja.hidden = true; return; }
    var P = PRACTICAS[practicaActual], u = ayudas[practicaActual] || 0;
    caja.hidden = false;
    $('#pr-num').textContent = t('practica') + ' ' + (practicaActual + 1);
    $('#pr-tit').textContent = L2(P.t);
    $('#pr-tit').title = L2(P.t);
    $('#pr-desc').innerHTML = L2(P.d) + '<div class="hint" style="margin-top:6px;color:#5B6280;font-size:12.5px">' + esc(t('guardaPractica')) + '</div>';
    $('#pr-extra').innerHTML = '<b>' + esc(t('reto')) + '</b> ' + esc(L2(P.extra));
    $('#pr-ant').disabled = practicaActual === 0;
    $('#pr-sig').disabled = practicaActual === PRACTICAS.length - 1;
    var h = '<div class="hb-top"><button class="hbtn u1 ' + (u >= 1 ? 'used' : '') + '" data-h="1">' + t('ayuda1') + '</button>' +
      '<button class="hbtn u2 ' + (u >= 2 ? 'used' : '') + '" data-h="2" ' + (u < 1 ? 'disabled title="' + esc(t('primero1')) + '"' : '') + '>' + t('ayuda2') + '</button>' +
      '<button class="hbtn u3 ' + (u >= 3 ? 'used' : '') + '" data-h="3" ' + (u < 2 ? 'disabled title="' + esc(t('primero2')) + '"' : '') + '>' + t('ayuda3') + '</button>' +
      '<span class="hb-note">' + esc(t('nota' + u)) + '</span></div>';
    if (preguntaAyuda) h += '<div class="hb-ask">⚠️ ' + esc(preguntaAyuda === 3 ? t('seguro3') : t('seguroN').replace('{n}', preguntaAyuda)) +
      '<button class="btn go" data-yes="' + preguntaAyuda + '">' + esc(t('si')) + '</button><button class="btn" data-no>' + esc(t('no')) + '</button></div>';
    for (var i = 0; i < Math.min(u, 2); i++) h += '<div class="hb-txt u' + (i + 1) + '"><b>' + esc(t('ayudaN').replace('{n}', i + 1)) + '</b> ' + L2(P.h[i]) + '</div>';
    if (u >= 3) h += '<div class="hb-txt u3"><b>' + esc(t('ayuda3t')) + '</b> ' + esc(t('solPuesta')) + '<button class="btn" data-load>' + esc(t('volverSol')) + '</button></div>';
    $('#pr-ayuda').innerHTML = h;
    var nuevo = $('#pr-ayuda .hb-ask') || $('#pr-ayuda .hb-txt:last-child');
    if (nuevo && (preguntaAyuda || u)) nuevo.scrollIntoView({ block: 'nearest' });
  }
  $('#pr-ayuda').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled || practicaActual === null) return;
    var u = ayudas[practicaActual] || 0;
    if (b.dataset.yes) {
      var k = +b.dataset.yes;
      preguntaAyuda = 0;
      if (u < k) ayudas[practicaActual] = k;
      cambios = true;
      if (k === 3) cargarSolucion(); else pintarPractica();
      return;
    }
    if (b.dataset.load !== undefined) { cargarSolucion(); return; }
    if (b.dataset.no !== undefined) { preguntaAyuda = 0; pintarPractica(); return; }
    var nn = +b.dataset.h;
    if (nn && u === nn - 1) { preguntaAyuda = nn; pintarPractica(); }
  });
  $('#pr-ant').addEventListener('click', function () { abrirPractica(practicaActual - 1); });
  $('#pr-sig').addEventListener('click', function () { abrirPractica(practicaActual + 1); });
  $('#pr-plegar').addEventListener('click', function () {
    var pl = $('#practica').classList.toggle('plegada');
    this.textContent = pl ? '▸' : '▾'; this.setAttribute('aria-expanded', !pl);
  });
  $('#pr-cerrar').addEventListener('click', function () { $('#practica').hidden = true; });
  $('#b-practicas').addEventListener('click', function () {
    ventana(t('elegirPractica'), '<div class="lista-pr">' + PRACTICAS.map(function (P, k) {
      var u = ayudas[k];
      return '<button data-k="' + k + '"><span class="nn">' + (k + 1) + '</span><span><b>' + esc(L2(P.t)) + '</b><small>' +
        esc(L2(P.d).replace(/<[^>]+>/g, '').slice(0, 95)) + '…</small></span>' +
        (u !== undefined ? '<span class="ay">' + esc(u ? t('conAyudas').replace('{n}', u) : t('sinAyudas')) + '</span>' : '') + '</button>';
    }).join('') + '</div>', function (c) {
      c.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; cerrarVentana(); abrirPractica(+b.dataset.k); });
    });
  });

  /* ------------------------------ Ayuda ------------------------------ */
  var AYUDA = {
    es: '<div class="ayuda"><p><b>RayoBlocks</b> sirve para programar uniendo bloques, como piezas de un puzle.</p>' +
      '<h3>Cómo empezar</h3><ol><li>Elige una categoría de bloques a la izquierda (Movimiento, Apariencia…).</li><li>Arrastra los bloques a la zona central y encájalos.</li>' +
      '<li>Empieza el programa con un bloque amarillo de <b>Eventos</b>, como «al hacer clic en 🚩».</li><li>Pulsa la bandera verde para ejecutarlo y el octógono rojo para detenerlo.</li></ol>' +
      '<h3>Trucos</h3><ul><li>Haz clic en un programa para ejecutarlo solo; en un bloque redondo, para ver su valor.</li><li>Arrastra los objetos por el escenario para colocarlos.</li>' +
      '<li>Cada objeto tiene sus propios programas: elígelo abajo a la derecha.</li><li>Haz doble clic en un disfraz para cambiarle el nombre.</li>' +
      '<li>Para quitar un bloque, arrástralo de vuelta a la lista de bloques.</li></ul>' +
      '<h3>Guardar tu trabajo</h3><p>RayoBlocks no guarda nada en el navegador. Usa <b>Archivo → Guardar en tu equipo</b> para descargar tu proyecto (archivo .rayo) y <b>Abrir desde tu equipo</b> para seguir otro día.</p>' +
      '<p style="color:#5B6280;font-size:13px;margin-top:18px">RayoBlocks · David Rayo Torres · IES Palomares. Bloques dibujados con Blockly (Google, licencia Apache 2.0).</p></div>',
    en: '<div class="ayuda"><p><b>RayoBlocks</b> lets you program by snapping blocks together like puzzle pieces.</p>' +
      '<h3>Getting started</h3><ol><li>Pick a block category on the left (Motion, Looks…).</li><li>Drag blocks into the middle area and snap them together.</li>' +
      '<li>Start your script with a yellow <b>Events</b> block such as “when 🚩 clicked”.</li><li>Click the green flag to run it and the red octagon to stop.</li></ol>' +
      '<h3>Tips</h3><ul><li>Click a script to run it on its own; click a round block to see its value.</li><li>Drag sprites around the stage to place them.</li>' +
      '<li>Each sprite has its own scripts: select it at the bottom right.</li><li>Double-click a costume to rename it.</li><li>To delete a block, drag it back to the block list.</li></ul>' +
      '<h3>Saving your work</h3><p>RayoBlocks does not store anything in the browser. Use <b>File → Save to your computer</b> to download your project (.rayo file) and <b>Load from your computer</b> to continue later.</p>' +
      '<p style="color:#5B6280;font-size:13px;margin-top:18px">RayoBlocks · David Rayo Torres · IES Palomares. Blocks drawn with Blockly (Google, Apache 2.0 licence).</p></div>'
  };
  $('#b-ayuda').addEventListener('click', function () { ventana(t('ayuda'), AYUDA[RB.lang]); });

  /* ------------------------------ Idioma ------------------------------ */
  function ponerIdioma(l) {
    RB.lang = l === 'en' ? 'en' : 'es';
    document.documentElement.lang = RB.lang;
    document.querySelectorAll('[data-i]').forEach(function (el) { el.textContent = t(el.dataset.i); });
    document.querySelectorAll('[data-i-title]').forEach(function (el) { el.title = t(el.dataset.iTitle); });
    document.querySelectorAll('.langs button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === RB.lang); });
    document.title = 'RayoBlocks · ' + (RB.lang === 'en' ? 'Code at lightning speed' : 'Programa a la velocidad del rayo');
    if (ws) {
      guardarActual();
      Blockly.setLocale(BLOCKLY_MSG[RB.lang]);
      ws.updateToolbox(RBBloques.toolbox(!!(actual && actual.esEscenario)));
      if (actual) { cargarWs(actual); pintarTodo(); }
      pintarPractica();
    }
  }
  document.querySelector('.langs').addEventListener('click', function (e) { var b = e.target.closest('[data-lang]'); if (b) ponerIdioma(b.dataset.lang); });

  /* ------------------------------ Inicio ------------------------------ */
  iniciarBlockly();
  ponerIdioma('es');
  abrirProyecto(EJEMPLOS['ejemplo-gato']());
  cambios = false;
  window.RBApp = { motor: motor, ws: function () { return ws; }, proyectoJSON: proyectoJSON, abrirProyecto: abrirProyecto, seleccionar: seleccionar, ejemplos: EJEMPLOS,
    practicas: PRACTICAS, abrirPractica: function (k) { cambios = false; abrirPractica(k); }, cargarSolucion: cargarSolucion };
})();
