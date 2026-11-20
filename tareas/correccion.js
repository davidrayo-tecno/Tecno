/*
 * Corrección automática de tareas · IES Palomares
 *
 * Este mismo archivo se usa en dos sitios:
 *   1. En Google Apps Script (péguelo como «Correccion.gs»): allí se corrige de verdad,
 *      sin que el alumno pueda ver las respuestas correctas.
 *   2. En el navegador, solo en el «modo de prueba» (sin hoja de Google conectada).
 * Por eso está escrito en JavaScript sencillo, sin módulos.
 */

/** Quita tildes, mayúsculas y signos para comparar textos. */
function normalizarTexto(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contarPalabras(s) {
  var t = normalizarTexto(s);
  return t ? t.split(' ').length : 0;
}

/** Redondea a 2 decimales. */
/** Comprueba el correo del alumno. Por defecto, cuentas de Educaand (@g.educaand.es). */
function correoValido(correo, dominios) {
  dominios = dominios || ['g.educaand.es'];
  var c = String(correo || '').trim().toLowerCase();
  var m = /^[a-z0-9._%+-]+@([a-z0-9.-]+\.[a-z]{2,})$/.exec(c);
  return !!m && dominios.indexOf(m[1]) >= 0;
}

function redondear2(x) {
  return Math.round(x * 100) / 100;
}

/**
 * Corrige una entrega.
 * @param {Array} preguntas  Preguntas de la tarea (con soluciones).
 * @param {Object} respuestas  { idPregunta: valor }. Test: índice de la opción;
 *        abierta: texto; archivo: { nombre, url } o null.
 * @return {Object} { puntos, maximo, nota10, completa, detalle: [...] }
 *   «completa» es true si todo se ha podido corregir sin el profesor.
 */
function corregirEntrega(preguntas, respuestas) {
  respuestas = respuestas || {};
  var puntos = 0, maximo = 0, completa, detalle = [];

  for (var i = 0; i < preguntas.length; i++) {
    var p = preguntas[i];
    var max = Number(p.puntos) || 0;
    var r = respuestas[p.id];
    var d = { id: p.id, tipo: p.tipo, maximo: max, puntos: 0, revisar: false, nota: '' };
    maximo += max;

    if (p.tipo === 'test') {
      var elegida = (r === '' || r === null || r === undefined) ? -1 : Number(r);
      if (elegida === Number(p.correcta)) {
        d.puntos = max; d.nota = 'Correcta';
      } else if (elegida < 0) {
        d.nota = 'Sin responder';
      } else {
        d.nota = 'Incorrecta';
      }

    } else if (p.tipo === 'abierta') {
      var texto = String(r || '');
      var claves = (p.palabrasClave || []).map(normalizarTexto).filter(function (k) { return k; });
      var minimo = Number(p.minPalabras) || 0;
      var n = contarPalabras(texto);
      d.revisar = true;
      if (!n) {
        d.nota = 'Sin responder';
        d.revisar = false;
      } else if (claves.length) {
        var t = ' ' + normalizarTexto(texto) + ' ';
        var halladas = claves.filter(function (k) { return t.indexOf(' ' + k + ' ') >= 0 || (k.length > 4 && t.indexOf(k) >= 0); });
        var frac = halladas.length / claves.length;
        if (minimo && n < minimo) frac = frac * n / minimo;
        d.puntos = redondear2(max * frac);
        d.nota = 'Nota provisional: ' + halladas.length + ' de ' + claves.length + ' ideas clave' +
          (minimo && n < minimo ? ' (texto más corto de lo pedido: ' + n + ' de ' + minimo + ' palabras)' : '');
      } else {
        d.nota = 'Pendiente de corregir por el profesor';
      }

    } else if (p.tipo === 'archivo') {
      if (r && r.url) {
        d.revisar = true;
        d.nota = 'Archivo entregado: pendiente de corregir por el profesor';
      } else {
        d.nota = 'Sin archivo';
      }
    }

    puntos += d.puntos;
    detalle.push(d);
  }

  // Si quedan preguntas por revisar, la entrega no está completa.
  completa = detalle.every(function (d) { return !d.revisar; });

  return {
    puntos: redondear2(puntos),
    maximo: redondear2(maximo),
    nota10: maximo ? redondear2(10 * puntos / maximo) : 0,
    completa: completa,
    detalle: detalle
  };
}

/** Copia de las preguntas sin las soluciones, para enviársela al alumno. */
function preguntasParaAlumno(preguntas) {
  return preguntas.map(function (p) {
    var q = { id: p.id, tipo: p.tipo, enunciado: p.enunciado, puntos: p.puntos };
    if (p.tipo === 'test') q.opciones = p.opciones;
    if (p.tipo === 'abierta' && p.minPalabras) q.minPalabras = p.minPalabras;
    if (p.tipo === 'archivo') q.formatos = p.formatos || '';
    return q;
  });
}
