/*
 * Análisis de resultados de un cuestionario para el panel del profesor (profesor.html).
 *
 *   AnalisisCuest.calcular(B, L, CORR, calc) → datos del análisis
 *   AnalisisCuest.html(datos)                → HTML del informe
 *
 * B: banco de preguntas (preguntas.js) · L: entregas del grupo elegido · CORR: correccion.js
 * calc(e, B): la función del panel que corrige una entrega (nota automática, nota final, pendientes…).
 * Todo se calcula en el navegador con las respuestas guardadas: no envía ni guarda nada.
 */
(function () {
  'use strict';

  var TRAMOS = [['Menos de 5', 0, 5], ['5 a 6', 5, 6], ['6 a 7', 6, 7], ['7 a 8', 7, 8], ['8 a 9', 8, 9], ['9 a 10', 9, 10.001]];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plano(h) { return String(h == null ? '' : h).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim(); }
  function norm(x) { return String(x).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:!¡¿?«»"]/g, '').replace(/\s+/g, ' '); }
  function hay(v) { return v !== undefined && v !== null && String(v).trim() !== ''; }
  function media(a) { return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }
  function mediana(a) { if (!a.length) return null; a = a.slice().sort(function (x, y) { return x - y; }); var n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; }
  function desv(a) { var m = media(a); return a.length > 1 ? Math.sqrt(media(a.map(function (x) { return (x - m) * (x - m); }))) : 0; }
  function pearson(x, y) {
    if (x.length < 4) return null;
    var mx = media(x), my = media(y), sxy = 0, sx = 0, sy = 0;
    x.forEach(function (v, i) { sxy += (v - mx) * (y[i] - my); sx += (v - mx) * (v - mx); sy += (y[i] - my) * (y[i] - my); });
    return sx && sy ? sxy / Math.sqrt(sx * sy) : null;
  }
  function coma(n, d) { if (n == null || isNaN(n)) return '—'; var p = Math.pow(10, d == null ? 1 : d); return (Math.round(n * p) / p).toString().replace('.', ','); }
  function pc(n) { return n == null || isNaN(n) ? '—' : Math.round(n) + ' %'; }
  function alumnos(n) { return n + (n === 1 ? ' alumno' : ' alumnos'); }
  function lista(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]; }

  /* Texto de una respuesta, para contar los errores repetidos */
  function etiqueta(q, v) {
    if (!hay(v)) return 'En blanco';
    if (q.k === 'test') return q.o && q.o[v] != null ? plano(q.o[v]) : String(v);
    if (q.k === 'vf') return v ? 'Verdadero' : 'Falso';
    return '«' + norm(v) + '»';
  }
  function correctaTexto(q) {
    if (q.k === 'test') return q.o ? plano(q.o[q.a]) : '';
    if (q.k === 'vf') return q.a ? 'Verdadero' : 'Falso';
    if (q.k === 'cerrada') return (q.ok || [])[0] || '';
    return '';
  }

  function calcular(B, L, CORR, calc) {
    var tot = B.preguntas.reduce(function (s, q) { return s + (q.s || 0); }, 0);
    L.forEach(function (e) { if (!e._c) e._c = calc(e, B); });
    var finales = L.filter(function (e) { return e._c.final != null; });
    var notas = finales.map(function (e) { return e._c.final; });
    var pend = L.length - finales.length;

    /* Por pregunta */
    var P = B.preguntas.map(function (q) {
      var auto = !!B.AUTO[q.k], n = 0, suma = 0, blanco = 0, bloq = 0, err = {}, nAbiertas = 0;
      L.forEach(function (e) {
        var v = e.respuestas[q.id];
        if (!hay(v)) blanco++;
        if ((e.bloqueadas || []).indexOf(q.id) >= 0) bloq++;
        if (auto) {
          n++;
          if (B.correcta(q, v)) suma++;
          else { var k = etiqueta(q, v); err[k] = (err[k] || 0) + 1; }
        } else {
          var r = CORR.puntos(B, q, v, ((e.revision || {}).pts || {})[q.id]);
          if (r.modo !== 'pendiente') { n++; nAbiertas++; suma += q.pt ? r.pts / q.pt : 0; }
        }
      });
      var tops = Object.keys(err).sort(function (a, b) { return err[b] - err[a] || a.localeCompare(b); });
      return {
        q: q, id: q.id, apartado: q.p || '', tipo: B.KIND[q.k] || q.k, k: q.k, auto: auto, enunciado: plano(q.q) || 'Pregunta con imagen',
        correcta: correctaTexto(q), n: n, acierto: n ? 100 * suma / n : null, blanco: blanco, bloqueadas: bloq,
        error: tops[0] || '', vecesError: tops[0] ? err[tops[0]] : 0, error2: tops[1] || '', vecesError2: tops[1] ? err[tops[1]] : 0
      };
    });

    var agrupar = function (clave) {
      var g = {};
      P.forEach(function (p) { if (p.acierto != null) (g[p[clave]] = g[p[clave]] || []).push(p); });
      return Object.keys(g).map(function (k) { return { nombre: k, preguntas: g[k].length, acierto: media(g[k].map(function (p) { return p.acierto; })) }; });
    };
    var apartados = agrupar('apartado').sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es', { numeric: true }); });
    var tipos = agrupar('tipo').sort(function (a, b) { return a.acierto - b.acierto; });

    /* Por grupo */
    var G = {};
    L.forEach(function (e) { (G[e.grupo] = G[e.grupo] || []).push(e); });
    var grupos = Object.keys(G).sort().map(function (g) {
      var A = G[g], N = A.filter(function (e) { return e._c.final != null; }).map(function (e) { return e._c.final; });
      return {
        grupo: g, n: A.length, media: media(N), minima: N.length ? Math.min.apply(null, N) : null, maxima: N.length ? Math.max.apply(null, N) : null,
        aprobados: N.filter(function (x) { return x >= 5; }).length, corregidas: N.length, minutos: media(A.map(function (e) { return (e.duracion || 0) / 60; }))
      };
    });

    var autoPct = media(P.filter(function (p) { return p.auto && p.acierto != null; }).map(function (p) { return p.acierto; }));
    var abiertasPct = media(P.filter(function (p) { return !p.auto && p.acierto != null; }).map(function (p) { return p.acierto; }));
    var minutos = L.map(function (e) { return (e.duracion || 0) / 60; });
    var conSal = L.filter(function (e) { return (e.salidas || []).length; });
    var conBloq = L.filter(function (e) { return (e.bloqueadas || []).length; });
    var r = pearson(finales.map(function (e) { return (e.duracion || 0) / 60; }), notas);

    return {
      titulo: B.titulo || '', total: L.length, corregidas: finales.length, pendientes: pend,
      media: media(notas), mediana: mediana(notas), desv: desv(notas), minima: notas.length ? Math.min.apply(null, notas) : null, maxima: notas.length ? Math.max.apply(null, notas) : null,
      aprobados: notas.filter(function (x) { return x >= 5; }).length, notables: notas.filter(function (x) { return x >= 7; }).length, sobresalientes: notas.filter(function (x) { return x >= 9; }).length,
      tramos: TRAMOS.map(function (t) { return { nombre: t[0], desde: t[1], n: notas.filter(function (x) { return x >= t[1] && x < t[2]; }).length }; }),
      minutos: media(minutos), minutosMax: minutos.length ? Math.max.apply(null, minutos) : null, disponibles: tot / 60, porTiempo: L.filter(function (e) { return e.motivo === 'tiempo'; }).length,
      salidas: conSal.map(function (e) { return { alumno: e.apellidos + ', ' + e.nombre, n: e.salidas.length }; }),
      bloqueadas: conBloq.reduce(function (s, e) { return s + e.bloqueadas.length; }, 0), conBloqueo: conBloq.length,
      autoPct: autoPct, abiertasPct: abiertasPct, hayAbiertas: P.some(function (p) { return !p.auto; }),
      preguntas: P, apartados: apartados, tipos: tipos, grupos: grupos, r: r,
      puntos: finales.map(function (e) { return { alumno: e.apellidos + ', ' + e.nombre, grupo: e.grupo, min: (e.duracion || 0) / 60, nota: e._c.final }; }),
      refuerzo: finales.filter(function (e) { return e._c.final < 5; }).sort(function (a, b) { return a._c.final - b._c.final; })
        .map(function (e) { return { alumno: e.apellidos + ', ' + e.nombre, grupo: e.grupo, nota: e._c.final, blancas: B.preguntas.filter(function (q) { return !hay(e.respuestas[q.id]); }).length }; }),
      cerca: finales.filter(function (e) { return e._c.final >= 5 && e._c.final < 6; }).length
    };
  }

  /* Observaciones automáticas a partir de los datos */
  function observaciones(d) {
    var o = [];
    if (!d.corregidas) return o;
    var nivel = d.media >= 7 ? 'bueno' : d.media >= 6 ? 'aceptable' : d.media >= 5 ? 'justo' : 'flojo';
    var susp = d.corregidas - d.aprobados;
    o.push(['Resultado global ' + nivel, 'La media es ' + coma(d.media, 2) + ' y la mediana ' + coma(d.mediana, 2) + '. ' +
      (susp ? 'Suspenden ' + alumnos(susp) + ' de ' + d.corregidas + '.' : 'No suspende nadie.') +
      ' Las notas van de ' + coma(d.minima, 2) + ' a ' + coma(d.maxima, 2) + (d.desv < 1.2 ? ', un grupo bastante homogéneo.' : d.desv > 2 ? ', con mucha diferencia entre alumnos.' : '.')]);

    if (d.hayAbiertas && d.autoPct != null && d.abiertasPct != null && d.autoPct - d.abiertasPct >= 15)
      o.push(['Las preguntas abiertas cuestan más', 'Se acierta un ' + pc(d.autoPct) + ' de las preguntas automáticas, pero en las abiertas la puntuación media es del ' + pc(d.abiertasPct) +
        '. Reconocen la respuesta cuando la ven, pero les cuesta explicarla con sus palabras. Conviene practicar respuestas razonadas con un esquema fijo, como «idea + motivo + ejemplo».']);
    else if (d.hayAbiertas && d.abiertasPct != null && d.autoPct != null && d.abiertasPct - d.autoPct >= 15)
      o.push(['Mejor en las preguntas abiertas', 'En las abiertas obtienen un ' + pc(d.abiertasPct) + ' de media, más que en las automáticas (' + pc(d.autoPct) + '). Puede haber detalles concretos o vocabulario que no dominan.']);

    var dificiles = d.preguntas.filter(function (p) { return p.acierto != null && p.acierto < 50; }).sort(function (a, b) { return a.acierto - b.acierto; });
    if (dificiles.length)
      o.push(['Preguntas que no se han entendido', dificiles.slice(0, 6).map(function (p) {
        var e = p.error === 'En blanco' ? (p.vecesError2 > 1 ? p.error2 : '') : p.error;
        return 'P' + p.id + ' (' + pc(p.acierto) + ')' + (p.auto && e ? ': lo más repetido es «' + e.replace(/^«|»$/g, '') + '»' + (p.correcta ? ' en vez de «' + p.correcta + '»' : '') : '');
      }).join('; ') + '. Son las primeras que conviene repasar en clase.']);

    var confusiones = d.preguntas.filter(function (p) { return p.auto && p.n && p.error && p.error !== 'En blanco' && p.vecesError / p.n >= 0.25; });
    if (confusiones.length)
      o.push(['Confusiones repetidas', 'En ' + lista(confusiones.slice(0, 5).map(function (p) { return 'P' + p.id; })) + ' al menos una cuarta parte del grupo elige la misma respuesta equivocada. No son despistes: es una idea mal aprendida que hay que corregir de forma explícita.']);

    var blancas = d.preguntas.filter(function (p) { return d.total && p.blanco / d.total >= 0.15; });
    if (blancas.length)
      o.push(['Preguntas sin contestar', lista(blancas.slice(0, 6).map(function (p) { return 'P' + p.id + ' (' + p.blanco + ')'; })) + ' se dejan en blanco con frecuencia. Puede ser falta de estudio de ese punto o que el enunciado no se entiende.']);

    if (d.apartados.length > 1) {
      var ap = d.apartados.filter(function (a) { return a.acierto != null; }).slice().sort(function (a, b) { return a.acierto - b.acierto; });
      if (ap.length > 1 && ap[ap.length - 1].acierto - ap[0].acierto >= 10)
        o.push(['El apartado más flojo', '«' + ap[0].nombre + '» se queda en un ' + pc(ap[0].acierto) + ' de acierto, frente al ' + pc(ap[ap.length - 1].acierto) + ' de «' + ap[ap.length - 1].nombre + '».']);
    }

    if (d.grupos.length > 1) {
      var gs = d.grupos.filter(function (g) { return g.media != null; }).slice().sort(function (a, b) { return a.media - b.media; });
      if (gs.length > 1) {
        var dif = gs[gs.length - 1].media - gs[0].media;
        o.push(['Comparación entre grupos', dif >= 1 ? gs[gs.length - 1].grupo + ' saca ' + coma(dif, 2) + ' puntos más de media que ' + gs[0].grupo + ' (' + coma(gs[gs.length - 1].media, 2) + ' frente a ' + coma(gs[0].media, 2) + '). Merece la pena ver si el tema se trabajó igual en los dos.'
          : 'Los grupos rinden de forma parecida (diferencia de ' + coma(dif, 2) + ' puntos entre la media más alta y la más baja), así que las dificultades son del tema y no de una clase concreta.']);
      }
    }

    var t = 'De media han tardado ' + coma(d.minutos) + ' minutos de los ' + coma(d.disponibles) + ' disponibles.';
    if (d.porTiempo) t += ' ' + alumnos(d.porTiempo) + ' agotaron el tiempo total y se les entregó solo.';
    if (d.conBloqueo) {
      var top = d.preguntas.filter(function (p) { return p.bloqueadas; }).sort(function (a, b) { return b.bloqueadas - a.bloqueadas; }).slice(0, 3);
      t += ' ' + alumnos(d.conBloqueo) + ' agotaron el tiempo de alguna pregunta (' + d.bloqueadas + ' en total), sobre todo en ' + lista(top.map(function (p) { return 'P' + p.id; })) + '.';
      if (d.minutos < d.disponibles * 0.7) t += ' Como les sobró tiempo, parece que se atascaron en esas preguntas: recuérdales el botón «Dejar para después».';
    }
    if (d.r != null) t += Math.abs(d.r) < 0.3 ? ' Tardar más no ha dado mejor ni peor nota.' : d.r >= 0.3 ? ' Los que dedicaron más tiempo sacaron mejor nota.' : ' Los que tardaron más sacaron peor nota: probablemente dudaban más.';
    o.push(['El tiempo', t]);

    o.push(['Comportamiento durante la prueba', d.salidas.length ? alumnos(d.salidas.length) + ' salieron de la pantalla completa o cambiaron de ventana: ' + lista(d.salidas.map(function (s) { return s.alumno + ' (' + s.n + ')'; })) + '. Revisa sus hojas de entrega antes de dar la nota por buena.'
      : 'Nadie salió de la pantalla completa ni cambió de ventana. La prueba se hizo con normalidad.']);

    if (d.refuerzo.length)
      o.push(['Alumnos que necesitan refuerzo', lista(d.refuerzo.map(function (a) { return a.alumno + ' (' + coma(a.nota, 2) + (a.blancas ? ', ' + a.blancas + ' en blanco' : '') + ')'; })) + '.' + (d.cerca ? ' Además, ' + alumnos(d.cerca) + ' aprueban con menos de un 6.' : '')]);
    else if (d.cerca)
      o.push(['Alumnos en el límite', alumnos(d.cerca) + ' aprueban con menos de un 6. Conviene seguirlos de cerca en el próximo tema.']);

    if (d.pendientes)
      o.push(['Faltan correcciones', 'Hay ' + d.pendientes + (d.pendientes === 1 ? ' entrega' : ' entregas') + ' con preguntas sin corregir. No cuentan en las notas finales de este análisis hasta que las corrijas.']);
    return o;
  }

  /* ---------- Gráficos sencillos en SVG ---------- */
  function barrasTramos(d) {
    var W = 560, H = 190, m = { t: 22, b: 30, l: 8, r: 8 }, max = Math.max(1, Math.max.apply(null, d.tramos.map(function (t) { return t.n; })));
    var bw = (W - m.l - m.r) / d.tramos.length;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="an-svg" role="img" aria-label="Alumnos por tramo de nota">';
    d.tramos.forEach(function (t, i) {
      var h = (H - m.t - m.b) * t.n / max, x = m.l + i * bw + bw * 0.15, y = H - m.b - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw * 0.7 + '" height="' + Math.max(h, t.n ? 2 : 0) + '" rx="4" fill="' + (t.desde < 5 ? 'var(--ko)' : 'var(--brand)') + '"><title>' + esc(t.nombre) + ': ' + alumnos(t.n) + '</title></rect>';
      s += '<text x="' + (x + bw * 0.35) + '" y="' + (y - 6) + '" text-anchor="middle" class="an-v">' + t.n + '</text>';
      s += '<text x="' + (x + bw * 0.35) + '" y="' + (H - 9) + '" text-anchor="middle" class="an-l">' + esc(t.nombre) + '</text>';
    });
    return s + '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + (H - m.b) + '" y2="' + (H - m.b) + '" stroke="var(--line)"/></svg>';
  }
  function dispersion(d) {
    var W = 560, H = 230, m = { t: 12, b: 34, l: 30, r: 12 }, maxX = Math.max(d.disponibles || 1, Math.max.apply(null, d.puntos.map(function (p) { return p.min; }).concat([1])));
    var X = function (v) { return m.l + (W - m.l - m.r) * v / maxX; }, Y = function (v) { return H - m.b - (H - m.t - m.b) * v / 10; };
    var grupos = []; d.puntos.forEach(function (p) { if (grupos.indexOf(p.grupo) < 0) grupos.push(p.grupo); }); grupos.sort();
    var col = ['var(--brand)', 'var(--warn)', 'var(--ok)', 'var(--turn)', 'var(--pen)', 'var(--if)'];
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="an-svg" role="img" aria-label="Minutos empleados y nota de cada alumno">';
    [0, 5, 10].forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--line)"' + (v === 5 ? ' stroke-dasharray="4 4"' : '') + '/><text x="' + (m.l - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" class="an-l">' + v + '</text>'; });
    var paso = maxX > 40 ? 10 : 5;
    for (var v = 0; v <= maxX + 0.01; v += paso) s += '<text x="' + X(v) + '" y="' + (H - 16) + '" text-anchor="middle" class="an-l">' + v + '</text>';
    s += '<text x="' + (W - m.r) + '" y="' + (H - 2) + '" text-anchor="end" class="an-l">minutos</text>';
    d.puntos.forEach(function (p) { s += '<circle cx="' + X(p.min) + '" cy="' + Y(p.nota) + '" r="5" fill="' + col[grupos.indexOf(p.grupo) % col.length] + '" fill-opacity=".85"><title>' + esc(p.alumno) + ' · ' + esc(p.grupo) + ' · nota ' + coma(p.nota, 2) + ' · ' + coma(p.min) + ' min</title></circle>'; });
    s += '</svg>';
    if (grupos.length > 1) s += '<div class="an-ley">' + grupos.map(function (g, i) { return '<span><i style="background:' + col[i % col.length] + '"></i>' + esc(g) + '</span>'; }).join('') + '</div>';
    return s;
  }
  function barra(p) {
    var c = p.acierto == null ? 'var(--line)' : !p.auto ? 'var(--muted)' : p.acierto < 50 ? 'var(--ko)' : p.acierto < 75 ? 'var(--warn)' : 'var(--ok)';
    return '<div class="an-bar"><i style="width:' + (p.acierto || 0) + '%;background:' + c + '"></i></div>';
  }

  function html(d) {
    if (!d.total) return '<p class="empty">Todavía no hay entregas de este cuestionario en el grupo elegido.</p>';
    var h = '';
    h += '<div class="tiles">' + [
      [d.total, 'entregas'],
      [coma(d.media, 2), 'nota media' + (d.pendientes ? ' (' + d.corregidas + ' corregidas)' : '')],
      [coma(d.mediana, 2), 'mediana'],
      [d.corregidas ? d.aprobados + ' / ' + d.corregidas : '—', 'aprueban'],
      [d.notables, 'con notable o más (≥ 7)'],
      [coma(d.minutos) + ' min', 'tiempo medio de ' + coma(d.disponibles) + ' min'],
      [d.salidas.length, 'con salidas de pantalla']
    ].map(function (t) { return '<div class="tile"><b>' + t[0] + '</b><small>' + t[1] + '</small></div>'; }).join('') + '</div>';

    var obs = observaciones(d);
    h += '<div class="card"><h2>Valoración</h2><p class="muted an-ayuda">Observaciones generadas a partir de los datos. Revísalas con lo que sabes de tu grupo.</p>' +
      (obs.length ? obs.map(function (x) { return '<div class="an-obs"><b>' + esc(x[0]) + '</b><p>' + esc(x[1]) + '</p></div>'; }).join('') : '<p class="muted">Aún no hay entregas corregidas.</p>') + '</div>';

    h += '<div class="an-two"><div class="card"><h2>Reparto de notas</h2>' + (d.corregidas ? barrasTramos(d) : '<p class="muted">Sin notas finales todavía.</p>') + '</div>';
    h += '<div class="card"><h2>Tiempo y nota</h2><p class="muted an-ayuda">Cada punto es un alumno. Pasa el ratón por encima para ver quién es.</p>' + (d.puntos.length ? dispersion(d) : '<p class="muted">Sin notas finales todavía.</p>') + '</div></div>';

    if (d.grupos.length > 1)
      h += '<div class="card"><h2>Por grupo</h2><div class="tw"><table class="an-t"><thead><tr><th>Grupo</th><th class="num">Entregas</th><th class="num">Media</th><th class="num">Más baja</th><th class="num">Más alta</th><th class="num">Aprueban</th><th class="num">Minutos</th></tr></thead><tbody>' +
        d.grupos.map(function (g) { return '<tr><td>' + esc(g.grupo) + '</td><td class="num">' + g.n + '</td><td class="num"><b>' + coma(g.media, 2) + '</b></td><td class="num">' + coma(g.minima, 2) + '</td><td class="num">' + coma(g.maxima, 2) + '</td><td class="num">' + g.aprobados + ' / ' + g.corregidas + '</td><td class="num">' + coma(g.minutos) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';

    h += '<div class="an-two"><div class="card"><h2>Por apartado del tema</h2>' + d.apartados.map(function (a) {
      return '<div class="an-fila"><span>' + esc(a.nombre) + ' <small class="muted">(' + a.preguntas + ')</small></span>' + barra({ acierto: a.acierto, auto: true }) + '<b>' + pc(a.acierto) + '</b></div>';
    }).join('') + '</div>';
    h += '<div class="card"><h2>Por tipo de pregunta</h2>' + d.tipos.map(function (a) {
      return '<div class="an-fila"><span>' + esc(a.nombre) + ' <small class="muted">(' + a.preguntas + ')</small></span>' + barra({ acierto: a.acierto, auto: true }) + '<b>' + pc(a.acierto) + '</b></div>';
    }).join('') + '<p class="muted an-ayuda" style="margin-top:8px">En las preguntas abiertas es la puntuación media sobre el máximo.</p></div></div>';

    var P = d.preguntas.slice().sort(function (a, b) { return (a.acierto == null ? 999 : a.acierto) - (b.acierto == null ? 999 : b.acierto) || a.id - b.id; });
    h += '<div class="card"><h2>Pregunta a pregunta</h2><p class="muted an-ayuda">De la más difícil a la más fácil. «Error más repetido» es la respuesta equivocada que más alumnos han dado. En las preguntas abiertas se muestra la puntuación media.</p>' +
      '<div class="tw"><table class="an-t an-p"><thead><tr><th>Pregunta</th><th>Tipo</th><th>Acierto</th><th class="num"></th><th>Respuesta correcta</th><th>Error más repetido</th><th class="num">En blanco</th><th class="num">Sin tiempo</th></tr></thead><tbody>' +
      P.map(function (p) {
        return '<tr><td class="an-q"><b>P' + p.id + '</b> ' + esc(p.enunciado) + '<br><small class="muted">' + esc(p.apartado) + '</small></td><td><span class="tag k k-' + esc(p.k) + '">' + esc(p.tipo) + '</span></td>' +
          '<td style="min-width:110px">' + barra(p) + '</td><td class="num"><b>' + pc(p.acierto) + '</b></td><td class="an-w">' + esc(p.correcta || (p.auto ? '' : '—')) + '</td>' +
          '<td class="an-w">' + (p.error ? esc(p.error) + ' <small class="muted">(' + p.vecesError + ')</small>' + (p.error2 && p.vecesError2 > 1 ? '<br><small class="muted">' + esc(p.error2) + ' (' + p.vecesError2 + ')</small>' : '') : (p.auto ? '<span class="muted">—</span>' : '')) + '</td>' +
          '<td class="num">' + (p.blanco || '<span class="muted">0</span>') + '</td><td class="num">' + (p.bloqueadas || '<span class="muted">0</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
    return h;
  }

  var API = { calcular: calcular, html: html, observaciones: observaciones };
  if (typeof window !== 'undefined') window.AnalisisCuest = API;
  if (typeof module !== 'undefined') module.exports = API;
})();
