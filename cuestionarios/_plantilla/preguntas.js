/*
 * PLANTILLA de cuestionario. Para crear uno nuevo:
 *   1. Copia la carpeta _plantilla con otro nombre (por ejemplo, 1Bach-cuestionario).
 *   2. Cambia aquí id, titulo, descripcion, GRUPOS y las preguntas.
 *   3. Añádelo a cuestionarios/lista.js y pon su tarjeta en cuestionarios/index.html.
 * No toques index.html: todas las normas del examen (ver LEEME.md) las pone el motor común ../examen.js.
 *
 * Cada pregunta: k = tipo (test | vf | cerrada | abierta | reflexion | critico), s = segundos para responderla,
 * p = tema o apartado, q = enunciado (admite HTML), e = dibujo o código opcional bajo el enunciado,
 * test → o (opciones) y a (índice de la correcta) · vf → a (true/false) · cerrada → ok (respuestas válidas).
 * Puntos: 1 en las de corrección automática y 2 en las que corrige el profesor (se puede cambiar con «pt»).
 * Conviene que haya preguntas de todos los tipos.
 */
(function () {
  'use strict';
  var GRUPOS = ['1º Bachillerato A', '1º Bachillerato B'];
  var KIND = { test: 'Test', vf: 'Verdadero o falso', cerrada: 'Respuesta cerrada', abierta: 'Respuesta abierta', reflexion: 'Reflexión', critico: 'Pensamiento crítico' };
  var AUTO = { test: 1, vf: 1, cerrada: 1 };
  var Q = [
    { id: 1, p: 'Tema 1', k: 'test', s: 60, q: 'Pregunta de test', o: ['Correcta', 'Incorrecta', 'Incorrecta', 'Incorrecta'], a: 0 },
    { id: 2, p: 'Tema 1', k: 'vf', s: 30, q: 'Afirmación de verdadero o falso.', a: true },
    { id: 3, p: 'Tema 1', k: 'cerrada', s: 60, q: 'Pregunta de respuesta corta (un número o una palabra).', ph: 'Escribe un número', ok: ['12', 'doce'] },
    { id: 4, p: 'Tema 1', k: 'abierta', s: 180, q: 'Pregunta de respuesta abierta.' },
    { id: 5, p: 'Tema 1', k: 'reflexion', s: 180, q: 'Pregunta de reflexión.' },
    { id: 6, p: 'Tema 1', k: 'critico', s: 210, q: 'Pregunta de pensamiento crítico.' }
  ];
  Q.forEach(function (q) { if (q.pt === undefined) q.pt = AUTO[q.k] ? 1 : 2; });

  function correcta(q, v) {
    var norm = function (x) { return String(x).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:!¡¿?]/g, '').replace(/\s+/g, ' '); };
    if (q.k === 'test' || q.k === 'vf') return v === q.a;
    if (q.k === 'cerrada') return q.ok.map(norm).indexOf(norm(v == null ? '' : v)) >= 0;
    return null;
  }

  window.CUESTIONARIO = {
    id: 'plantilla', titulo: 'Cuestionario de ejemplo', grupos: GRUPOS,
    descripcion: 'Explica aquí de qué trata el cuestionario. Hay preguntas de varios tipos:',
    preguntas: Q, KIND: KIND, AUTO: AUTO, correcta: correcta
  };
})();
