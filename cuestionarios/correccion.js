/*
 * Corrección automática común a la página del alumno (examen.js) y al panel del profesor (profesor.html).
 *
 * Las preguntas de test, verdadero o falso y respuesta cerrada las corrige cada preguntas.js (función «correcta»).
 * Las de respuesta abierta, reflexión y pensamiento crítico se corrigen solas si llevan una rúbrica «rb»:
 *
 *   rb: [
 *     { t: 'Dice que en serie hay un solo camino', w: ['un solo camino', 'detras', 'misma intensidad'] },
 *     { t: 'Pone un ejemplo con números',          re: '\\d' },
 *     { t: 'Lo explica con al menos 20 palabras',  min: 20 }
 *   ]
 *
 *   · w   → la idea se da por buena si aparece cualquiera de esas expresiones. Con «&» se exigen varias a la vez
 *           ('apag&todos'). No importan mayúsculas, tildes ni signos de puntuación. Sirve escribir raíces
 *           ('limit' vale para limita, limitar, limitando…).
 *   · re  → expresión regular sobre el texto normalizado.
 *   · min → número mínimo de palabras.
 *
 * Puntos de la pregunta = (ideas que cumple / ideas de la rúbrica) × puntos de la pregunta, redondeado a centésimas.
 * El profesor puede cambiar esa puntuación en su panel.
 */
(function () {
  'use strict';

  function norm(x) {
    return (' ' + String(x == null ? '' : x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[«»"'“”‘’()\[\]{}¡!¿?.,;:]/g, ' ').replace(/\s*([=\/·*])\s*/g, '$1').replace(/\s+/g, ' ').trim() + ' ');
  }
  function palabras(v) { return (String(v == null ? '' : v).trim().match(/\S+/g) || []).length; }
  function r2(n) { return Math.round(n * 100) / 100; }

  function cumple(c, t, v) {
    if (c.min) return palabras(v) >= c.min;
    if (c.re) return new RegExp(c.re).test(t);
    return (c.w || []).some(function (alt) {
      return alt.split('&').every(function (parte) { return t.indexOf(norm(parte).trim()) >= 0; });
    });
  }

  /** Corrige una respuesta abierta con su rúbrica → { pts, crit: [{ t, ok }] } (null si la pregunta no tiene rúbrica). */
  function rubrica(q, v) {
    if (!q.rb || !q.rb.length) return null;
    var hay = v !== undefined && v !== null && String(v).trim() !== '';
    var t = norm(v);
    var crit = q.rb.map(function (c) { return { t: c.t, ok: hay && cumple(c, t, v) }; });
    var n = crit.filter(function (c) { return c.ok; }).length;
    return { pts: r2(q.pt * n / crit.length), crit: crit };
  }

  /**
   * Puntos de una pregunta para el banco B.
   * manual: puntos que ha puesto el profesor (si los hay, mandan).
   * → { pts, modo: 'auto' | 'rubrica' | 'profesor' | 'pendiente' | 'vacia' }
   */
  function puntos(B, q, v, manual) {
    if (B.AUTO[q.k]) return { pts: B.correcta(q, v) ? q.pt : 0, modo: 'auto' };
    if (manual !== undefined && manual !== null && manual !== '') return { pts: Math.max(0, Math.min(q.pt, Number(manual))), modo: 'profesor' };
    var r = rubrica(q, v);
    if (r) return { pts: r.pts, modo: 'rubrica', crit: r.crit };
    var hay = v !== undefined && v !== null && String(v).trim() !== '';
    return { pts: 0, modo: hay ? 'pendiente' : 'vacia' };
  }

  /** ¿Se corrige sola cada pregunta del banco? */
  function todoAutomatico(B) { return B.preguntas.every(function (q) { return B.AUTO[q.k] || (q.rb && q.rb.length); }); }

  window.Correccion = { norm: norm, palabras: palabras, rubrica: rubrica, puntos: puntos, todoAutomatico: todoAutomatico, r2: r2 };
})();
