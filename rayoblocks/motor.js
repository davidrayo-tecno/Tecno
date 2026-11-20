/*
 * RayoBlocks · motor de ejecución.
 * Ejecuta directamente el formato JSON de Blockly (serialization.blocks), así que funciona
 * con los programas de todos los objetos aunque en el editor solo se vea uno.
 * Cada programa es un «hilo» (función generadora); en cada fotograma avanza cada hilo
 * hasta que espera, como en la programación por bloques clásica.
 */
(function () {
  'use strict';

  var W = 480, H = 360, MAX_CLONES = 300;

  function Parar() {}                                   // «detener este programa»
  function num(v) {
    if (typeof v === 'number') return isNaN(v) ? 0 : v;
    if (v === true) return 1;
    if (v === false || v === null || v === undefined) return 0;
    var n = Number(v);
    return isNaN(n) ? 0 : n;
  }
  function str(v) {
    if (v === true) return 'true';
    if (v === false) return 'false';
    if (typeof v === 'number') {
      if (Math.abs(v) < 1e-10 && v !== 0) return '0';
      var r = Math.round(v * 1e10) / 1e10;               // evita 0.30000000000000004
      return String(r);
    }
    return v === null || v === undefined ? '' : String(v);
  }
  function bool(v) {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0 && !isNaN(v);
    var s = str(v).toLowerCase();
    return !(s === '' || s === '0' || s === 'false');
  }
  function esNumero(v) {
    if (typeof v === 'number') return !isNaN(v);
    if (typeof v === 'boolean') return false;
    var s = str(v).trim();
    return s !== '' && !isNaN(Number(s));
  }
  function comparar(a, b) {
    if (esNumero(a) && esNumero(b)) return num(a) - num(b);
    var x = str(a).toLowerCase(), y = str(b).toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  }
  function envolverDir(d) {
    d = ((d + 180) % 360 + 360) % 360 - 180;
    return d === -180 ? 180 : d;
  }
  function hexAHsv(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { h: h / 3.6, s: mx ? d / mx * 100 : 0, v: mx * 100 };
  }
  function hsvACss(c) {
    var h = ((c.h % 100) + 100) % 100 * 3.6, s = Math.max(0, Math.min(100, c.s)) / 100, v = Math.max(0, Math.min(100, c.v)) / 100;
    var k = function (n) { var kk = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(kk, 4 - kk, 1)); };
    return 'rgb(' + Math.round(k(5) * 255) + ',' + Math.round(k(3) * 255) + ',' + Math.round(k(1) * 255) + ')';
  }

  var TECLAS = { ' ': 'space', ArrowUp: 'up arrow', ArrowDown: 'down arrow', ArrowLeft: 'left arrow', ArrowRight: 'right arrow' };

  function Motor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lapiz = document.createElement('canvas');
    this.lapiz.width = W; this.lapiz.height = H;
    this.lctx = this.lapiz.getContext('2d');
    this.lctx.lineCap = 'round';
    this.objetos = [];          // [escenario, objeto1, objeto2…] en orden de capas
    this.hilos = [];
    this.variables = {};        // id → { id, nombre, valor }
    this.monitores = {};        // id → true
    this.teclas = {};
    this.raton = { x: 0, y: 0, abajo: false };
    this.respuesta = '';
    this.pregunta = null;
    this.colaPreguntas = [];
    this.t0 = performance.now();
    this.redibujar = true;
    this.nClones = 0;
    this.sonidos = [];
    this.alCambiar = function () {};
    this.alPreguntar = function () {};
    this.alEstado = function () {};
    this.recorte = document.createElement('canvas');
    this.ajustarTamano();
    var self = this;
    requestAnimationFrame(function bucle(t) { self.fotograma(t); requestAnimationFrame(bucle); });
  }

  var P = Motor.prototype;

  /* ---------------------------- Proyecto ---------------------------- */
  P.escenario = function () { return this.objetos[0]; };
  P.porNombre = function (n) {
    for (var i = 1; i < this.objetos.length; i++) { var o = this.objetos[i]; if (!o.esClon && o.nombre === n) return o; }
    return null;
  };
  P.prepararDisfraz = function (d) {
    if (d.img) return d;
    var img = new Image(), self = this;
    img.onload = function () {
      d.w = d.w || img.naturalWidth || 100; d.h = d.h || img.naturalHeight || 100;
      if (d.cx === undefined) d.cx = d.w / 2;
      if (d.cy === undefined) d.cy = d.h / 2;
      self.redibujar = true; self.alCambiar('disfraz');
    };
    img.src = d.src;
    d.img = img;
    return d;
  };
  P.cargar = function (objetos, variables) {
    this.pararTodo();
    var self = this;
    this.objetos = objetos;
    objetos.forEach(function (o) { o.disfraces.forEach(function (d) { self.prepararDisfraz(d); }); });
    this.variables = {};
    (variables || []).forEach(function (v) { self.variables[v.id] = { id: v.id, nombre: v.nombre, valor: v.valor === undefined ? 0 : v.valor }; if (v.monitor) self.monitores[v.id] = true; });
    this.lctx.clearRect(0, 0, W, H);
    this.redibujar = true;
  };
  P.variable = function (campo) {
    var id = campo && (campo.id || campo);
    if (!this.variables[id]) this.variables[id] = { id: id, nombre: (campo && campo.name) || '?', valor: 0 };
    return this.variables[id];
  };

  /* ----------------------------- Hilos ------------------------------ */
  P.programas = function (o) {
    var b = o.bloques && o.bloques.blocks && o.bloques.blocks.blocks;
    return b || [];
  };
  P.iniciarHilo = function (o, top, reiniciar) {
    var clave = o.id + '|' + top.id;
    for (var i = 0; i < this.hilos.length; i++) {
      var h = this.hilos[i];
      if (h.clave === clave && !h.hecho) {
        if (!reiniciar) return h;
        h.hecho = true;
      }
    }
    var hilo = { objeto: o, top: top, clave: clave, hecho: false };
    var cuerpo = top.next && top.next.block;
    // Un bloque suelto que no es sombrero (clic en el editor) se ejecuta él mismo
    if (!/^(event_when|control_start_as_clone)/.test(top.type)) cuerpo = top;
    hilo.gen = this.ejecutar(cuerpo, hilo);
    this.hilos.push(hilo);
    this.alEstado(true);
    return hilo;
  };
  P.disparar = function (tipo, filtro, objetivo) {
    var self = this, iniciados = [];
    var lista = objetivo ? [objetivo] : this.objetos.slice();
    lista.forEach(function (o) {
      self.programas(o).forEach(function (top) {
        if (top.type === tipo && (!filtro || filtro(top))) iniciados.push(self.iniciarHilo(o, top, true));
      });
    });
    return iniciados;
  };
  P.banderaVerde = function () {
    this.pararTodo();
    this.audio();
    this.t0 = performance.now();
    this.disparar('event_whenflagclicked');
  };
  P.pararTodo = function () {
    this.hilos.forEach(function (h) { h.hecho = true; });
    this.hilos = [];
    this.objetos = this.objetos.filter(function (o) { return !o.esClon; });
    this.nClones = 0;
    this.objetos.forEach(function (o) { o.decir = null; });
    this.pararSonidos();
    if (this.pregunta) { this.pregunta = null; this.alPreguntar(null); }
    this.colaPreguntas = [];
    this.redibujar = true;
    this.alEstado(false);
  };
  P.ejecutarPila = function (o, json) {
    // Clic en un programa del editor: si ya está en marcha, se detiene
    var clave = o.id + '|' + json.id;
    var enMarcha = this.hilos.filter(function (h) { return h.clave === clave && !h.hecho; });
    if (enMarcha.length) { enMarcha.forEach(function (h) { h.hecho = true; }); return; }
    this.audio();
    this.iniciarHilo(o, json, true);
  };
  P.fotograma = function () {
    var inicio = performance.now();
    this.inicioFotograma = inicio;
    this.redibujarEnPaso = false;
    var vivos = this.hilos;
    for (var i = 0; i < vivos.length; i++) {
      var h = vivos[i];
      if (h.hecho) continue;
      try {
        var r = h.gen.next();
        if (r.done) h.hecho = true;
      } catch (e) {
        h.hecho = true;
        if (!(e instanceof Parar)) console.error('RayoBlocks:', e);
      }
    }
    var antes = this.hilos.length;
    this.hilos = this.hilos.filter(function (h) { return !h.hecho; });
    if (antes && !this.hilos.length) this.alEstado(false);
    this.dibujar();
  };

  /* -------------------------- Intérprete ---------------------------- */
  P.ejecutar = function* (bloque, hilo) {
    var b = bloque;
    while (b) {
      if (hilo.hecho) return;
      yield* this.paso(b, hilo);
      b = b.next && b.next.block;
    }
  };
  // Al final de cada vuelta de un bucle: cede el turno si algo ha cambiado en pantalla
  // o si este fotograma ya va largo (así los cálculos sin dibujo van rápidos).
  P.finVuelta = function () {
    return this.redibujarEnPaso || performance.now() - this.inicioFotograma > 12;
  };
  function entrada(b, nombre) {
    var e = b.inputs && b.inputs[nombre];
    return e ? (e.block || e.shadow) : null;
  }
  function campo(b, nombre) { return b.fields ? b.fields[nombre] : undefined; }
  function* esperar(seg, hilo) {
    var fin = performance.now() + seg * 1000;
    yield;
    while (performance.now() < fin && !hilo.hecho) yield;
  }

  P.paso = function* (b, hilo) {
    var o = hilo.objeto, self = this, v = function (n) { return self.valor(entrada(b, n), hilo); }, f = function (n) { return campo(b, n); };
    var sub = entrada(b, 'SUBSTACK'), i, n;
    switch (b.type) {
      /* Movimiento */
      case 'motion_move': {
        var pasos = num(v('STEPS')), rad = o.dir * Math.PI / 180;
        this.mover(o, o.x + pasos * Math.sin(rad), o.y + pasos * Math.cos(rad)); break;
      }
      case 'motion_turnright': this.girar(o, o.dir + num(v('DEGREES'))); break;
      case 'motion_turnleft': this.girar(o, o.dir - num(v('DEGREES'))); break;
      case 'motion_gotoxy': this.mover(o, num(v('X')), num(v('Y'))); break;
      case 'motion_goto': { var p = this.punto(f('TO'), o); if (p) this.mover(o, p.x, p.y); break; }
      case 'motion_glidesecstoxy':
      case 'motion_glideto': {
        var seg = num(v('SECS')), destino = b.type === 'motion_glideto' ? this.punto(f('TO'), o) : { x: num(v('X')), y: num(v('Y')) };
        if (!destino) break;
        var x0 = o.x, y0 = o.y, t0 = performance.now();
        if (seg <= 0) { this.mover(o, destino.x, destino.y); break; }
        while (!hilo.hecho) {
          var fr = Math.min(1, (performance.now() - t0) / (seg * 1000));
          this.mover(o, x0 + (destino.x - x0) * fr, y0 + (destino.y - y0) * fr);
          if (fr >= 1) break;
          yield;
        }
        break;
      }
      case 'motion_pointindirection': this.girar(o, num(v('DIRECTION'))); break;
      case 'motion_pointtowards': {
        var q = this.punto(f('TOWARDS'), o);
        if (q) { var dx = q.x - o.x, dy = q.y - o.y; if (dx || dy) this.girar(o, 90 - Math.atan2(dy, dx) * 180 / Math.PI); }
        break;
      }
      case 'motion_changexby': this.mover(o, o.x + num(v('DX')), o.y); break;
      case 'motion_setx': this.mover(o, num(v('X')), o.y); break;
      case 'motion_changeyby': this.mover(o, o.x, o.y + num(v('DY'))); break;
      case 'motion_sety': this.mover(o, o.x, num(v('Y'))); break;
      case 'motion_ifonedgebounce': this.rebotar(o); break;
      case 'motion_setrotationstyle': o.estiloRot = f('STYLE'); this.cambio(o); break;

      /* Apariencia */
      case 'looks_say': case 'looks_think':
        this.decir(o, str(v('MESSAGE')), b.type === 'looks_think' ? 'pensar' : 'decir'); break;
      case 'looks_sayforsecs': case 'looks_thinkforsecs': {
        var marca = this.decir(o, str(v('MESSAGE')), b.type === 'looks_thinkforsecs' ? 'pensar' : 'decir');
        yield* esperar(num(v('SECS')), hilo);
        if (o.decir && o.decir.marca === marca) { o.decir = null; this.cambio(o); }
        break;
      }
      case 'looks_switchcostumeto': this.ponerDisfraz(o, f('COSTUME')); break;
      case 'looks_nextcostume': this.ponerDisfraz(o, o.disfraz + 1, true); break;
      case 'looks_switchbackdropto': this.ponerFondo(f('BACKDROP')); break;
      case 'looks_nextbackdrop': this.ponerFondo('_next_'); break;
      case 'looks_changesizeby': this.tamano(o, o.tam + num(v('CHANGE'))); break;
      case 'looks_setsizeto': this.tamano(o, num(v('SIZE'))); break;
      case 'looks_changeeffectby': o.efectos[f('EFFECT')] = (o.efectos[f('EFFECT')] || 0) + num(v('CHANGE')); this.cambio(o); break;
      case 'looks_seteffectto': o.efectos[f('EFFECT')] = num(v('VALUE')); this.cambio(o); break;
      case 'looks_cleargraphiceffects': o.efectos = {}; this.cambio(o); break;
      case 'looks_show': o.visible = true; this.cambio(o); break;
      case 'looks_hide': o.visible = false; this.cambio(o); break;
      case 'looks_gotofrontback': {
        var k = this.objetos.indexOf(o);
        this.objetos.splice(k, 1);
        if (f('FRONT_BACK') === 'front') this.objetos.push(o); else this.objetos.splice(1, 0, o);
        this.cambio(o); break;
      }

      /* Sonido */
      case 'sound_play': this.tocar(f('SOUND'), o); break;
      case 'sound_playuntildone': { var dur = this.tocar(f('SOUND'), o); yield* esperar(dur, hilo); break; }
      case 'sound_playnote': {
        var pulsos = num(v('BEATS'));
        this.nota(num(v('NOTE')), pulsos, o);
        yield* esperar(pulsos, hilo); break;
      }
      case 'sound_stopallsounds': this.pararSonidos(); break;
      case 'sound_changevolumeby': o.volumen = Math.max(0, Math.min(100, o.volumen + num(v('VOLUME')))); break;
      case 'sound_setvolumeto': o.volumen = Math.max(0, Math.min(100, num(v('VOLUME')))); break;

      /* Eventos */
      case 'event_broadcast': {
        var m = f('BROADCAST');
        this.disparar('event_whenbroadcastreceived', function (t) { return t.fields && t.fields.BROADCAST === m; });
        break;
      }
      case 'event_broadcastandwait': {
        var m2 = f('BROADCAST');
        var hs = this.disparar('event_whenbroadcastreceived', function (t) { return t.fields && t.fields.BROADCAST === m2; });
        yield;
        while (!hilo.hecho && hs.some(function (h) { return !h.hecho; })) yield;
        break;
      }

      /* Control */
      case 'control_wait': yield* esperar(num(v('DURATION')), hilo); break;
      case 'control_repeat':
        n = Math.round(num(v('TIMES')));
        for (i = 0; i < n && !hilo.hecho; i++) {
          if (sub) yield* this.ejecutar(sub, hilo);
          if (this.finVuelta()) yield;
        }
        break;
      case 'control_forever':
        while (!hilo.hecho) {
          if (sub) yield* this.ejecutar(sub, hilo);
          if (this.finVuelta()) yield; else if (!sub) yield;
        }
        break;
      case 'control_repeat_until':
        while (!hilo.hecho && !bool(v('CONDITION'))) {
          if (sub) yield* this.ejecutar(sub, hilo);
          if (this.finVuelta()) yield; else if (!sub) yield;
        }
        break;
      case 'control_if':
        if (bool(v('CONDITION')) && sub) yield* this.ejecutar(sub, hilo);
        break;
      case 'control_if_else':
        if (bool(v('CONDITION'))) { if (sub) yield* this.ejecutar(sub, hilo); }
        else { var sub2 = entrada(b, 'SUBSTACK2'); if (sub2) yield* this.ejecutar(sub2, hilo); }
        break;
      case 'control_wait_until':
        while (!hilo.hecho && !bool(v('CONDITION'))) yield;
        break;
      case 'control_stop': {
        var op = f('STOP_OPTION');
        if (op === 'all') { this.pararTodo(); throw new Parar(); }
        if (op === 'this script') { hilo.hecho = true; throw new Parar(); }
        this.hilos.forEach(function (h) { if (h.objeto === o && h !== hilo) h.hecho = true; });
        break;
      }
      case 'control_create_clone_of': {
        var opc = f('CLONE_OPTION');
        var base = opc === '_myself_' ? o : this.porNombre(opc);
        if (base && !base.esEscenario) this.clonar(base);
        break;
      }
      case 'control_delete_this_clone':
        if (o.esClon) { this.borrarClon(o); throw new Parar(); }
        break;

      /* Sensores */
      case 'sensing_askandwait': {
        var yo = { texto: str(v('QUESTION')), objeto: o, hecha: false };
        this.colaPreguntas.push(yo);
        while (!hilo.hecho && this.colaPreguntas[0] !== yo) yield;
        if (hilo.hecho) { this.colaPreguntas = this.colaPreguntas.filter(function (x) { return x !== yo; }); break; }
        this.pregunta = yo;
        if (!o.esEscenario && o.visible) this.decir(o, yo.texto, 'decir');
        this.alPreguntar(o.esEscenario || !o.visible ? yo.texto : '');
        while (!hilo.hecho && !yo.hecha) yield;
        if (o.decir && o.decir.texto === yo.texto) { o.decir = null; this.cambio(o); }
        this.colaPreguntas.shift();
        if (this.pregunta === yo) { this.pregunta = null; this.alPreguntar(null); }
        break;
      }
      case 'sensing_resettimer': this.t0 = performance.now(); break;

      /* Variables */
      case 'data_setvariableto': this.variable(f('VARIABLE')).valor = v('VALUE'); this.redibujar = true; break;
      case 'data_changevariableby': { var vv = this.variable(f('VARIABLE')); vv.valor = num(vv.valor) + num(v('VALUE')); this.redibujar = true; break; }
      case 'data_showvariable': this.monitores[this.variable(f('VARIABLE')).id] = true; this.redibujar = true; this.alCambiar('monitor'); break;
      case 'data_hidevariable': delete this.monitores[this.variable(f('VARIABLE')).id]; this.redibujar = true; this.alCambiar('monitor'); break;

      /* Lápiz */
      case 'pen_clear': this.lctx.clearRect(0, 0, W, H); this.cambio(o); break;
      case 'pen_stamp': this.dibujarObjeto(this.lctx, o); this.cambio(o); break;
      case 'pen_penDown': o.lapiz.abajo = true; this.trazo(o, o.x, o.y, o.x, o.y); break;
      case 'pen_penUp': o.lapiz.abajo = false; break;
      case 'pen_setPenColorTo': { var c = hexAHsv(f('COLOR')); o.lapiz.color = c; break; }
      case 'pen_changePenColorBy': o.lapiz.color.h = ((o.lapiz.color.h + num(v('COLOR'))) % 100 + 100) % 100;
        if (o.lapiz.color.s < 20) { o.lapiz.color.s = 100; o.lapiz.color.v = Math.max(o.lapiz.color.v, 60); } break;
      case 'pen_setPenSizeTo': o.lapiz.tam = Math.max(1, Math.min(1200, num(v('SIZE')))); break;
      case 'pen_changePenSizeBy': o.lapiz.tam = Math.max(1, Math.min(1200, o.lapiz.tam + num(v('SIZE')))); break;

      default:
        // Un bloque de valor suelto: al hacer clic se muestra su resultado
        if (b.type && /^(operator_|sensing_|motion_(x|y)position|motion_direction|looks_(size|costume|backdrop)|data_variable|sound_volume)/.test(b.type) && !b.next) {
          this.alCambiar('resultado', str(this.valor(b, hilo)));
        }
    }
  };

  P.valor = function (b, hilo) {
    if (!b) return '';
    var o = hilo.objeto, self = this, v = function (n) { return self.valor(entrada(b, n), hilo); }, f = function (n) { return campo(b, n); };
    switch (b.type) {
      case 'rb_num': return f('NUM');
      case 'rb_text': return f('TEXT');
      case 'motion_xposition': return Math.round(o.x * 1e8) / 1e8;
      case 'motion_yposition': return Math.round(o.y * 1e8) / 1e8;
      case 'motion_direction': return o.dir;
      case 'looks_size': return Math.round(o.tam);
      case 'looks_costumenumbername': return f('NUMBER_NAME') === 'name' ? o.disfraces[o.disfraz].nombre : o.disfraz + 1;
      case 'looks_backdropnumbername': { var e = this.escenario(); return f('NUMBER_NAME') === 'name' ? e.disfraces[e.disfraz].nombre : e.disfraz + 1; }
      case 'sound_volume': return o.volumen;
      case 'sensing_touchingobject': return this.tocando(o, f('TOUCHINGOBJECTMENU'));
      case 'sensing_distanceto': {
        var p = this.punto(f('DISTANCETOMENU'), o);
        return p ? Math.sqrt((p.x - o.x) * (p.x - o.x) + (p.y - o.y) * (p.y - o.y)) : 10000;
      }
      case 'sensing_answer': return this.respuesta;
      case 'sensing_keypressed': {
        var t = f('KEY_OPTION');
        return t === 'any' ? Object.keys(this.teclas).some(function (k) { return self.teclas[k]; }) : !!this.teclas[t];
      }
      case 'sensing_mousedown': return this.raton.abajo;
      case 'sensing_mousex': return Math.round(this.raton.x);
      case 'sensing_mousey': return Math.round(this.raton.y);
      case 'sensing_timer': return Math.round((performance.now() - this.t0) / 10) / 100;
      case 'sensing_of': {
        var prop = f('PROPERTY'), nom = f('OBJECT');
        var obj = nom === '_stage_' ? this.escenario() : this.porNombre(nom);
        if (!obj) return 0;
        if (obj.esEscenario) return prop === 'backdrop #' ? obj.disfraz + 1 : 0;
        return { 'x position': obj.x, 'y position': obj.y, direction: obj.dir, 'costume #': obj.disfraz + 1, size: Math.round(obj.tam), 'backdrop #': this.escenario().disfraz + 1 }[prop];
      }
      case 'sensing_current': {
        var d = new Date();
        return { YEAR: d.getFullYear(), MONTH: d.getMonth() + 1, DATE: d.getDate(), DAYOFWEEK: d.getDay() + 1, HOUR: d.getHours(), MINUTE: d.getMinutes(), SECOND: d.getSeconds() }[f('CURRENTMENU')];
      }
      case 'operator_add': return num(v('NUM1')) + num(v('NUM2'));
      case 'operator_subtract': return num(v('NUM1')) - num(v('NUM2'));
      case 'operator_multiply': return num(v('NUM1')) * num(v('NUM2'));
      case 'operator_divide': { var dv = num(v('NUM2')); return dv === 0 ? (num(v('NUM1')) === 0 ? 'NaN' : (num(v('NUM1')) > 0 ? 'Infinity' : '-Infinity')) : num(v('NUM1')) / dv; }
      case 'operator_random': {
        var a = v('FROM'), c = v('TO'), lo = Math.min(num(a), num(c)), hi = Math.max(num(a), num(c));
        var enteros = Number.isInteger(num(a)) && Number.isInteger(num(c)) && str(a).indexOf('.') < 0 && str(c).indexOf('.') < 0;
        return enteros ? lo + Math.floor(Math.random() * (hi - lo + 1)) : lo + Math.random() * (hi - lo);
      }
      case 'operator_gt': return comparar(v('OPERAND1'), v('OPERAND2')) > 0;
      case 'operator_lt': return comparar(v('OPERAND1'), v('OPERAND2')) < 0;
      case 'operator_equals': return comparar(v('OPERAND1'), v('OPERAND2')) === 0;
      case 'operator_and': return bool(v('OPERAND1')) && bool(v('OPERAND2'));
      case 'operator_or': return bool(v('OPERAND1')) || bool(v('OPERAND2'));
      case 'operator_not': return !bool(v('OPERAND'));
      case 'operator_join': return str(v('STRING1')) + str(v('STRING2'));
      case 'operator_letter_of': { var s = str(v('STRING')), k = Math.floor(num(v('LETTER'))) - 1; return k >= 0 && k < s.length ? s.charAt(k) : ''; }
      case 'operator_length': return str(v('STRING')).length;
      case 'operator_contains': return str(v('STRING1')).toLowerCase().indexOf(str(v('STRING2')).toLowerCase()) >= 0;
      case 'operator_mod': { var x = num(v('NUM1')), m = num(v('NUM2')); var r = x % m; if (r / m < 0) r += m; return r; }
      case 'operator_round': return Math.round(num(v('NUM')));
      case 'operator_mathop': {
        var nn = num(v('NUM')), op = f('OPERATOR'), rad = nn * Math.PI / 180;
        switch (op) {
          case 'abs': return Math.abs(nn);
          case 'floor': return Math.floor(nn);
          case 'ceiling': return Math.ceil(nn);
          case 'sqrt': return Math.sqrt(nn);
          case 'sin': return Math.round(Math.sin(rad) * 1e10) / 1e10;
          case 'cos': return Math.round(Math.cos(rad) * 1e10) / 1e10;
          case 'tan': return Math.round(Math.tan(rad) * 1e10) / 1e10;
        }
        return 0;
      }
      case 'data_variable': return this.variable(f('VARIABLE')).valor;
    }
    return '';
  };

  /* ------------------------ Acciones de objetos ---------------------- */
  P.cambio = function (o) {
    this.redibujar = true;
    if (o && o.visible !== false) this.redibujarEnPaso = true;
    this.alCambiar('objeto', o);
  };
  P.mover = function (o, x, y) {
    if (o.esEscenario) return;
    var x0 = o.x, y0 = o.y;
    o.x = x; o.y = y;
    this.vallar(o);
    if (o.lapiz.abajo) this.trazo(o, x0, y0, o.x, o.y);
    this.cambio(o);
  };
  P.girar = function (o, d) { if (o.esEscenario) return; o.dir = envolverDir(d); this.cambio(o); };
  P.tamano = function (o, t) {
    if (o.esEscenario) return;
    var d = o.disfraces[o.disfraz] || {}, lado = Math.min(d.w || 100, d.h || 100);
    var min = Math.min(1, Math.max(5 / lado, 0.05)) * 100, max = Math.min(1.5 * W / (d.w || 100), 1.5 * H / (d.h || 100)) * 100;
    o.tam = Math.max(min, Math.min(Math.max(max, 100), t));
    this.cambio(o);
  };
  P.decir = function (o, texto, tipo) {
    o.decir = texto === '' ? null : { texto: texto, tipo: tipo, marca: Math.random() };
    this.cambio(o);
    return o.decir && o.decir.marca;
  };
  P.ponerDisfraz = function (o, valor, esIndice) {
    var n = o.disfraces.length, k;
    if (esIndice) k = ((valor % n) + n) % n;
    else {
      k = -1;
      for (var i = 0; i < n; i++) if (o.disfraces[i].nombre === valor) k = i;
      if (k < 0 && esNumero(valor)) k = ((Math.round(num(valor)) - 1) % n + n) % n;
      if (k < 0) return;
    }
    o.disfraz = k;
    this.cambio(o);
  };
  P.ponerFondo = function (valor) {
    var e = this.escenario(), n = e.disfraces.length;
    if (valor === '_next_') this.ponerDisfraz(e, e.disfraz + 1, true);
    else if (valor === '_random_') this.ponerDisfraz(e, n > 1 ? (e.disfraz + 1 + Math.floor(Math.random() * (n - 1))) % n : 0, true);
    else this.ponerDisfraz(e, valor);
    var nombre = e.disfraces[e.disfraz].nombre;
    this.disparar('event_whenbackdropswitchesto', function (t) { return t.fields && t.fields.BACKDROP === nombre; });
  };
  P.punto = function (valor, o) {
    if (valor === '_mouse_') return { x: this.raton.x, y: this.raton.y };
    if (valor === '_random_') return { x: Math.round(Math.random() * W - W / 2), y: Math.round(Math.random() * H - H / 2) };
    var otro = this.porNombre(valor);
    return otro ? { x: otro.x, y: otro.y } : null;
  };
  P.clonar = function (base) {
    if (this.nClones >= MAX_CLONES) return null;
    var c = {
      id: 'clon' + Math.random().toString(36).slice(2), nombre: base.nombre, esEscenario: false, esClon: true, original: base.original || base,
      x: base.x, y: base.y, dir: base.dir, tam: base.tam, visible: base.visible, estiloRot: base.estiloRot, disfraz: base.disfraz,
      disfraces: base.disfraces, bloques: base.bloques, efectos: Object.assign({}, base.efectos), volumen: base.volumen,
      lapiz: { abajo: base.lapiz.abajo, color: Object.assign({}, base.lapiz.color), tam: base.lapiz.tam }, decir: null
    };
    this.objetos.splice(this.objetos.indexOf(base), 0, c);
    this.nClones++;
    this.disparar('control_start_as_clone', null, c);
    this.cambio(c);
    return c;
  };
  P.borrarClon = function (c) {
    this.hilos.forEach(function (h) { if (h.objeto === c) h.hecho = true; });
    var k = this.objetos.indexOf(c);
    if (k >= 0) { this.objetos.splice(k, 1); this.nClones--; }
    this.redibujar = true;
  };

  /* ------------------------ Geometría y choques ---------------------- */
  P.transformar = function (ctx, o, dx, dy) {
    var d = o.disfraces[o.disfraz];
    ctx.translate(W / 2 + o.x + (dx || 0), H / 2 - o.y + (dy || 0));
    if (o.estiloRot === 'left-right') { if (o.dir < 0) ctx.scale(-1, 1); }
    else if (o.estiloRot !== "don't rotate") ctx.rotate((o.dir - 90) * Math.PI / 180);
    var s = o.tam / 100;
    ctx.scale(s, s);
    return d;
  };
  P.limites = function (o) {
    var d = o.disfraces[o.disfraz];
    if (!d || !d.w) return { izq: o.x, der: o.x, arr: o.y, aba: o.y };
    var s = o.tam / 100, ang = 0, fx = 1;
    if (o.estiloRot === 'left-right') { if (o.dir < 0) fx = -1; }
    else if (o.estiloRot !== "don't rotate") ang = (o.dir - 90) * Math.PI / 180;
    var cs = Math.cos(ang), sn = Math.sin(ang);
    var esq = [[-d.cx, -d.cy], [d.w - d.cx, -d.cy], [-d.cx, d.h - d.cy], [d.w - d.cx, d.h - d.cy]];
    var xs = [], ys = [];
    esq.forEach(function (p) {
      var px = p[0] * s * fx, py = p[1] * s;
      var rx = px * cs - py * sn, ry = px * sn + py * cs;   // en coordenadas de pantalla (y hacia abajo)
      xs.push(o.x + rx); ys.push(o.y - ry);
    });
    return { izq: Math.min.apply(null, xs), der: Math.max.apply(null, xs), arr: Math.max.apply(null, ys), aba: Math.min.apply(null, ys) };
  };
  P.vallar = function (o) {
    var l = this.limites(o), anchoMedio = (l.der - l.izq) / 2, altoMedio = (l.arr - l.aba) / 2;
    var m = Math.min(15, Math.floor(Math.min(anchoMedio, altoMedio)));
    var dx = 0, dy = 0;
    if (l.der < -W / 2 + m) dx = -W / 2 + m - l.der;
    if (l.izq > W / 2 - m) dx = W / 2 - m - l.izq;
    if (l.arr < -H / 2 + m) dy = -H / 2 + m - l.arr;
    if (l.aba > H / 2 - m) dy = H / 2 - m - l.aba;
    o.x += dx; o.y += dy;
  };
  P.rebotar = function (o) {
    var l = this.limites(o);
    var dIzq = Math.max(0, W / 2 + l.izq), dDer = Math.max(0, W / 2 - l.der), dArr = Math.max(0, H / 2 - l.arr), dAba = Math.max(0, H / 2 + l.aba);
    var minimo = Math.min(dIzq, dDer, dArr, dAba);
    if (minimo > 0) return;
    var rad = (90 - o.dir) * Math.PI / 180, dx = Math.cos(rad), dy = Math.sin(rad);
    if (minimo === dIzq) dx = Math.max(0.2, Math.abs(dx));
    else if (minimo === dArr) dy = -Math.max(0.2, Math.abs(dy));
    else if (minimo === dDer) dx = -Math.max(0.2, Math.abs(dx));
    else dy = Math.max(0.2, Math.abs(dy));
    o.dir = envolverDir(90 - Math.atan2(dy, dx) * 180 / Math.PI);
    // devolverlo dentro del escenario
    l = this.limites(o);
    var mx = 0, my = 0;
    if (l.izq < -W / 2) mx = -W / 2 - l.izq;
    if (l.der > W / 2) mx = W / 2 - l.der;
    if (l.arr > H / 2) my = H / 2 - l.arr;
    if (l.aba < -H / 2) my = -H / 2 - l.aba;
    var x0 = o.x, y0 = o.y;
    o.x += mx; o.y += my;
    if (o.lapiz.abajo) this.trazo(o, x0, y0, o.x, o.y);
    this.cambio(o);
  };
  P.tocaPunto = function (o, x, y) {
    if (!o.visible || o.esEscenario) return false;
    var l = this.limites(o);
    if (x < l.izq || x > l.der || y < l.aba || y > l.arr) return false;
    var c = this.recorte; c.width = 1; c.height = 1;
    var ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1, 1);
    ctx.translate(-(W / 2 + x), -(H / 2 - y));
    this.dibujarObjeto(ctx, o, true);
    return ctx.getImageData(0, 0, 1, 1).data[3] > 10;
  };
  P.tocando = function (o, que) {
    if (o.esEscenario || !o.visible) return false;
    if (que === '_mouse_') return this.tocaPunto(o, this.raton.x, this.raton.y);
    var l = this.limites(o);
    if (que === '_edge_') return l.izq < -W / 2 || l.der > W / 2 || l.arr > H / 2 || l.aba < -H / 2;
    var self = this;
    return this.objetos.some(function (otro) {
      if (otro === o || otro.esEscenario || !otro.visible || otro.nombre !== que) return false;
      var m = self.limites(otro);
      var izq = Math.max(l.izq, m.izq), der = Math.min(l.der, m.der), aba = Math.max(l.aba, m.aba), arr = Math.min(l.arr, m.arr);
      if (izq >= der || aba >= arr) return false;
      var ancho = Math.min(W, Math.ceil(der - izq)) || 1, alto = Math.min(H, Math.ceil(arr - aba)) || 1;
      var c = self.recorte; c.width = ancho; c.height = alto;
      var ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.save(); ctx.translate(-(W / 2 + izq), -(H / 2 - arr)); self.dibujarObjeto(ctx, o, true); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'source-in'; ctx.translate(-(W / 2 + izq), -(H / 2 - arr)); self.dibujarObjeto(ctx, otro, true); ctx.restore();
      var datos = ctx.getImageData(0, 0, ancho, alto).data;
      for (var i = 3; i < datos.length; i += 4) if (datos[i] > 10) return true;
      return false;
    });
  };
  P.objetoEn = function (x, y) {
    for (var i = this.objetos.length - 1; i > 0; i--) if (this.tocaPunto(this.objetos[i], x, y)) return this.objetos[i];
    return null;
  };

  /* ------------------------------ Lápiz ------------------------------ */
  P.trazo = function (o, x0, y0, x1, y1) {
    var c = this.lctx;
    c.strokeStyle = hsvACss(o.lapiz.color);
    c.fillStyle = c.strokeStyle;
    c.lineWidth = o.lapiz.tam;
    if (x0 === x1 && y0 === y1) {
      c.beginPath(); c.arc(W / 2 + x0, H / 2 - y0, o.lapiz.tam / 2, 0, Math.PI * 2); c.fill();
    } else {
      c.beginPath(); c.moveTo(W / 2 + x0, H / 2 - y0); c.lineTo(W / 2 + x1, H / 2 - y1); c.stroke();
    }
    this.redibujar = true; this.redibujarEnPaso = true;
  };

  /* ------------------------------ Sonido ----------------------------- */
  P.audio = function () {
    if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (this.ac.state === 'suspended') this.ac.resume();
    return this.ac;
  };
  P.salida = function (o) {
    var ac = this.audio(); if (!ac) return null;
    var g = ac.createGain(); g.gain.value = (o ? o.volumen : 100) / 100 * 0.5; g.connect(ac.destination);
    this.sonidos.push(g);
    var self = this;
    setTimeout(function () { var k = self.sonidos.indexOf(g); if (k >= 0) self.sonidos.splice(k, 1); }, 3000);
    return g;
  };
  P.pararSonidos = function () {
    this.sonidos.forEach(function (g) { try { g.disconnect(); } catch (e) {} });
    this.sonidos = [];
  };
  function tono(ac, dest, tipo, f0, f1, t, dur, vol) {
    var os = ac.createOscillator(), g = ac.createGain();
    os.type = tipo; os.frequency.setValueAtTime(f0, t);
    if (f1) os.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.8, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    os.connect(g); g.connect(dest); os.start(t); os.stop(t + dur + 0.05);
  }
  function ruido(ac, dest, t, dur, vol, filtro) {
    var n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = ac.createBufferSource(), g = ac.createGain(), bq = ac.createBiquadFilter();
    s.buffer = buf; bq.type = 'bandpass'; bq.frequency.value = filtro || 1500;
    g.gain.setValueAtTime(vol || 0.8, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(bq); bq.connect(g); g.connect(dest); s.start(t);
  }
  P.tocar = function (nombre, o) {
    var def = (window.RBBiblioteca.SONIDOS.filter(function (s) { return s.nombre === nombre; })[0]) || window.RBBiblioteca.SONIDOS[0];
    var g = this.salida(o); if (!g) return def.dur;
    var ac = this.ac, t = ac.currentTime + 0.01, i;
    switch (def.tipo) {
      case 'pop': tono(ac, g, 'sine', 900, 300, t, 0.12); break;
      case 'campana': [880, 1320, 1760].forEach(function (f, k) { tono(ac, g, 'sine', f, 0, t, 1.2 - k * .3, .5 / (k + 1)); }); break;
      case 'tambor': tono(ac, g, 'sine', 160, 50, t, 0.35, 1); ruido(ac, g, t, 0.08, .4, 800); break;
      case 'laser': tono(ac, g, 'sawtooth', 1800, 120, t, 0.3, .4); break;
      case 'moneda': tono(ac, g, 'square', 988, 0, t, 0.08, .3); tono(ac, g, 'square', 1319, 0, t + .08, 0.25, .3); break;
      case 'salto': tono(ac, g, 'square', 300, 900, t, 0.25, .3); break;
      case 'aplausos': for (i = 0; i < 16; i++) ruido(ac, g, t + i * 0.08 + Math.random() * .04, 0.06, .6, 2000 + Math.random() * 1500); break;
      case 'fanfarria': [523, 659, 784, 1047].forEach(function (f, k) { tono(ac, g, 'triangle', f, 0, t + k * .14, k === 3 ? .6 : .16, .5); }); break;
    }
    return def.dur;
  };
  P.nota = function (n, pulsos, o) {
    var g = this.salida(o); if (!g) return;
    var f = 440 * Math.pow(2, (Math.max(0, Math.min(130, n)) - 69) / 12);
    tono(this.ac, g, 'triangle', f, 0, this.ac.currentTime + 0.01, Math.max(0.05, pulsos), .7);
  };

  /* ---------------------------- Teclado y ratón --------------------------- */
  P.tecla = function (ev, abajo) {
    var k = TECLAS[ev.key] || (ev.key && ev.key.length === 1 ? ev.key.toLowerCase() : null);
    if (!k) return false;
    var antes = this.teclas[k];
    this.teclas[k] = abajo;
    if (abajo && !antes) {
      this.disparar('event_whenkeypressed', function (t) { return t.fields && (t.fields.KEY === k || t.fields.KEY === 'any'); });
    }
    return true;
  };
  P.clicEn = function (o) {
    if (o) this.disparar('event_whenthisspriteclicked', null, o);
    else this.disparar('event_whenstageclicked', null, this.escenario());
  };
  P.responder = function (texto) {
    if (!this.pregunta) return;
    this.respuesta = texto;
    this.pregunta.hecha = true;
  };

  /* ------------------------------ Dibujo ----------------------------- */
  P.ajustarTamano = function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var r = this.canvas.getBoundingClientRect();
    var escala = Math.max(1, (r.width || W) / W) * dpr;
    this.canvas.width = Math.round(W * escala); this.canvas.height = Math.round(H * escala);
    this.escala = escala;
    this.redibujar = true;
  };
  P.dibujarObjeto = function (ctx, o, sinEfectos) {
    var d = o.disfraces[o.disfraz];
    if (!d || !d.img || !d.img.complete || !d.w) return;
    ctx.save();
    this.transformar(ctx, o);
    if (!sinEfectos) {
      var ef = o.efectos || {};
      ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (ef.ghost || 0) / 100));
      var filtros = [];
      if (ef.color) filtros.push('hue-rotate(' + (ef.color * 1.8) + 'deg)');
      if (ef.brightness) filtros.push('brightness(' + Math.max(0, 100 + ef.brightness) + '%)');
      if (filtros.length) ctx.filter = filtros.join(' ');
    }
    ctx.drawImage(d.img, -d.cx, -d.cy, d.w, d.h);
    ctx.restore();
  };
  P.dibujar = function () {
    if (!this.redibujar) return;
    this.redibujar = false;
    var ctx = this.ctx, self = this;
    ctx.setTransform(this.escala, 0, 0, this.escala, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    var e = this.escenario();
    if (!e) return;
    var fd = e.disfraces[e.disfraz];
    if (fd && fd.img && fd.img.complete && fd.w) {
      // los fondos se ajustan al escenario
      var s = Math.max(W / fd.w, H / fd.h);
      ctx.drawImage(fd.img, (W - fd.w * s) / 2, (H - fd.h * s) / 2, fd.w * s, fd.h * s);
    }
    ctx.drawImage(this.lapiz, 0, 0, W, H);
    for (var i = 1; i < this.objetos.length; i++) { var o = this.objetos[i]; if (o.visible) this.dibujarObjeto(ctx, o); }
    for (i = 1; i < this.objetos.length; i++) { var b = this.objetos[i]; if (b.visible && b.decir) this.bocadillo(ctx, b); }
    this.dibujarMonitores(ctx);
  };
  function envolver(ctx, texto, ancho) {
    var palabras = texto.split(/\s+/), lineas = [], linea = '';
    palabras.forEach(function (p) {
      while (ctx.measureText(p).width > ancho && p.length > 1) {
        var k = p.length; while (k > 1 && ctx.measureText(p.slice(0, k)).width > ancho) k--;
        if (linea) { lineas.push(linea); linea = ''; }
        lineas.push(p.slice(0, k)); p = p.slice(k);
      }
      var prueba = linea ? linea + ' ' + p : p;
      if (ctx.measureText(prueba).width > ancho && linea) { lineas.push(linea); linea = p; } else linea = prueba;
    });
    if (linea) lineas.push(linea);
    return lineas.slice(0, 12);
  }
  function rectRedondo(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  P.bocadillo = function (ctx, o) {
    var texto = o.decir.texto.slice(0, 330);
    ctx.save();
    ctx.font = '600 14px Nunito, "IBM Plex Sans", system-ui, sans-serif';
    var lineas = envolver(ctx, texto, 170);
    var ancho = Math.max(50, Math.min(186, Math.max.apply(null, lineas.map(function (l) { return ctx.measureText(l).width; })) + 20));
    var alto = lineas.length * 18 + 14;
    var l = this.limites(o);
    var x = W / 2 + l.der - 6, y = H / 2 - l.arr - alto - 14, izquierda = false;
    if (x + ancho > W - 2) { x = W / 2 + l.izq - ancho + 6; izquierda = true; }
    x = Math.max(2, Math.min(W - ancho - 2, x));
    y = Math.max(2, Math.min(H - alto - 16, y));
    ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2;
    rectRedondo(ctx, x, y, ancho, alto, 14); ctx.fill(); ctx.stroke();
    var cx = izquierda ? x + ancho - 22 : x + 22;
    if (o.decir.tipo === 'pensar') {
      [[cx, y + alto + 7, 5], [cx + (izquierda ? 6 : -6), y + alto + 15, 3]].forEach(function (c) {
        ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
    } else {
      ctx.beginPath(); ctx.moveTo(cx - 8, y + alto - 1); ctx.lineTo(cx + (izquierda ? 6 : -6), y + alto + 12); ctx.lineTo(cx + 8, y + alto - 1);
      ctx.fill(); ctx.stroke();
      ctx.fillRect(cx - 9, y + alto - 4, 18, 4);
    }
    ctx.fillStyle = '#1B2140'; ctx.textBaseline = 'top';
    lineas.forEach(function (ln, i) { ctx.fillText(ln, x + 10, y + 8 + i * 18); });
    ctx.restore();
  };
  P.dibujarMonitores = function (ctx) {
    var self = this, y = 6;
    ctx.save();
    ctx.font = '700 12px Nunito, "IBM Plex Sans", system-ui, sans-serif';
    Object.keys(this.monitores).forEach(function (id) {
      var v = self.variables[id]; if (!v) return;
      var valor = str(v.valor).slice(0, 40);
      ctx.font = '700 12px Nunito, "IBM Plex Sans", system-ui, sans-serif';
      var wn = ctx.measureText(v.nombre).width, wv = Math.max(28, ctx.measureText(valor).width + 14);
      var w = wn + wv + 22;
      ctx.fillStyle = '#E6F0FF'; ctx.strokeStyle = '#C3CCDB'; ctx.lineWidth = 1;
      rectRedondo(ctx, 6, y, w, 24, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1B2140'; ctx.textBaseline = 'middle'; ctx.fillText(v.nombre, 13, y + 12.5);
      ctx.fillStyle = '#FF8C1A'; rectRedondo(ctx, 13 + wn + 6, y + 4, wv, 16, 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(valor, 13 + wn + 6 + wv / 2, y + 12.5); ctx.textAlign = 'left';
      y += 30;
    });
    ctx.restore();
  };

  window.RBMotor = Motor;
  window.RBMotor.util = { num: num, str: str, bool: bool, comparar: comparar };
})();
