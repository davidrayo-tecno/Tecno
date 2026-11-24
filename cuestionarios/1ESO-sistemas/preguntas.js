/*
 * Cuestionario de 1.º ESO · Tema 1: Sistemas de computación
 * Basado en los apuntes del tema: introducción a los sistemas de computación, partes de un ordenador
 * (hardware y software) y estructura básica de un programa informático (entrada, proceso y salida).
 * 25 preguntas, todas con el mismo valor (pt: 1 → 0,4 puntos sobre 10).
 * Corrección: todas se corrigen solas. Las abiertas llevan una rúbrica «rb» con sus ideas clave (ver ../correccion.js);
 * el profesor puede cambiar sus puntos en el panel.
 * Las normas del examen las pone el motor común ../examen.js (ver ../LEEME.md).
 */
(function () {
  'use strict';
  var GRUPOS = ['1º ESO A', '1º ESO B', '1º ESO C', '1º ESO D'];

  // Carpeta de este archivo, para que las imágenes se vean también desde el panel del profesor
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/[^\/]*$/, '');
  function img(nombre, alto) {
    return '<img src="' + BASE + 'img/' + nombre + '.webp" alt="Imagen de la pregunta" style="display:block;max-width:100%;max-height:' + (alto || 170) +
      'px;margin:6px 0;border-radius:10px;background:#fff;padding:6px;border:1px solid var(--line)">';
  }

  // Palabras para reconocer ejemplos de hardware y de software en las respuestas abiertas
  // (expresiones regulares: \\b obliga a que la palabra empiece ahí, para que «ram» no coincida dentro de «programa»)
  var HW = '\\b(teclado|raton|monitor|pantalla|impresora|disco duro|memoria|ram|cpu|procesador|pendrive|usb|altavo|placa|tarjeta madre|microfono|camara|torre|portatil|tablet|movil|ventilador|fuente)';
  var SW_EJ = 'windows|linux|macos|android|word|excel|powerpoint|chrome|navegador|canva|classroom|blender|roblox|minecraft|tiktok|whatsapp|youtube|gmail|discord|juego|videojuego|aplicacion|app|sistema operativo|scratch|rayoblocks';
  var SW = '\\b(' + SW_EJ + '|programa)', SW_SOLO_EJ = '\\b(' + SW_EJ + ')';

  var KIND = { test: 'Test', vf: 'Verdadero o falso', cerrada: 'Respuesta cerrada', abierta: 'Respuesta abierta', reflexion: 'Reflexión', critico: 'Pensamiento crítico' };
  var AUTO = { test: 1, vf: 1, cerrada: 1 };
  var T1 = '1 · Introducción a los sistemas de computación', T2 = '2 · Hardware y software', T3 = '3 · Estructura de un programa';
  var Q = [
    { id: 1, p: T1, k: 'test', s: 45, q: '¿Qué es la <b>informática</b>?',
      o: ['El uso automático y racional de la información por medio de ordenadores', 'El conjunto de piezas que forman un ordenador', 'Un programa para escribir textos', 'La forma de conectar un ordenador a internet'], a: 0 },
    { id: 2, p: T2, k: 'abierta', s: 150, q: 'Explica con tus palabras la diferencia entre <b>hardware</b> y <b>software</b>. Pon dos ejemplos de cada uno.',
      rb: [
        { t: 'Dice que el hardware es físico: se puede ver y tocar', w: ['tocar', 'tangible', 'fisic', 'material', 'pieza', 'se ve'] },
        { t: 'Dice que el software son programas o instrucciones', w: ['programa', 'instruccion', 'aplicacion', 'app', 'sistema operativo', 'intangible', 'no se puede tocar', 'no se toca'] },
        { t: 'Pone algún ejemplo de hardware', re: HW },
        { t: 'Pone algún ejemplo de software', re: SW_SOLO_EJ }
      ] },
    { id: 3, p: T1, k: 'vf', s: 30, q: 'Las palabras «ordenador» y «computadora» significan lo mismo.', a: true },
    { id: 4, p: T1, k: 'test', s: 45, q: 'La palabra <b>ordenador</b>, que es la más habitual en España, viene…',
      o: ['Del francés <i>ordinateur</i>', 'Del inglés <i>computer</i>', 'Del latín <i>ordo</i>', 'Del alemán <i>Rechner</i>'], a: 0 },
    { id: 5, p: T1, k: 'test', s: 45, q: 'La imagen muestra cómo ha evolucionado la forma de tratar la información: lenguaje hablado, lenguaje escrito, imprenta, máquina de escribir… ¿Qué invento aparece justo <b>antes del ordenador</b>?',
      e: img('evolucion', 150), o: ['La calculadora', 'La máquina de escribir', 'La imprenta', 'El teléfono'], a: 0 },
    { id: 6, p: T1, k: 'vf', s: 30, q: 'El ser humano ha desarrollado nuevas máquinas y métodos por la necesidad y el deseo de mejorar su calidad de vida.', a: true },
    { id: 7, p: T1, k: 'test', s: 45, q: '¿Qué es un <b>sistema computacional</b>?',
      o: ['Un conjunto organizado de hardware, software y personal técnico que trabajan juntos para almacenar, procesar y transmitir información', 'Un ordenador sin programas', 'Un programa que hace cálculos', 'El conjunto de cables de un ordenador'], a: 0 },
    { id: 8, p: T1, k: 'cerrada', s: 60, q: 'Los tres componentes de un sistema computacional son el hardware, el software y el…',
      ph: 'Escribe la palabra que falta', ok: ['personal', 'personal humano', 'personal tecnico', 'el personal', 'el personal humano', 'el personal tecnico', 'personas', 'usuario', 'usuarios'] },
    { id: 9, p: T1, k: 'test', s: 45, q: '¿Quiénes forman el <b>personal humano</b> de un sistema computacional?',
      o: ['Los usuarios y los profesionales de la informática (analistas, programadores y técnicos)', 'Solo los que fabrican ordenadores', 'Los programas y los sistemas operativos', 'Los componentes que se pueden tocar'], a: 0 },
    { id: 10, p: T2, k: 'test', s: 45, q: '¿Qué es el <b>hardware</b>?',
      o: ['El conjunto de componentes materiales y tangibles que puedes ver y tocar', 'El conjunto de programas que no se pueden tocar', 'Las personas que usan el ordenador', 'Los errores de un programa'], a: 0 },
    { id: 11, p: T2, k: 'vf', s: 30, q: 'El software se puede ver y tocar, como un teclado.', a: false },
    { id: 12, p: T2, k: 'test', s: 45, q: '¿Cómo se desgasta el <b>software</b>?',
      o: ['No se deteriora físicamente, pero puede quedarse obsoleto o tener errores que se arreglan con actualizaciones', 'Se rompe con los golpes', 'Se desgasta igual que el hardware y hay que cambiar sus piezas', 'Nunca cambia ni necesita actualizaciones'], a: 0 },
    { id: 13, p: T2, k: 'cerrada', s: 60, q: 'Los errores de código de un programa se llaman con una palabra inglesa que significa «bichos». ¿Cuál es?',
      ph: 'Escribe la palabra', ok: ['bugs', 'bug', 'los bugs'] },
    { id: 14, p: T2, k: 'test', s: 45, q: '¿Qué componente de hardware es este?', e: img('memoria-ram', 90),
      o: ['La memoria RAM', 'El microprocesador', 'El disco duro', 'La fuente de alimentación'], a: 0 },
    { id: 15, p: T2, k: 'test', s: 45, q: '¿Qué componente de hardware es este?', e: img('microprocesador', 140),
      o: ['El microprocesador (CPU)', 'La memoria RAM', 'Un pendrive', 'La tarjeta gráfica'], a: 0 },
    { id: 16, p: T2, k: 'test', s: 45, q: '¿Qué componente es este y para qué sirve?', e: img('disco-duro', 150),
      o: ['Un disco duro: sirve para almacenar información', 'Un microprocesador: sirve para hacer cálculos', 'Un ventilador: sirve para enfriar', 'Una impresora: sirve para imprimir'], a: 0 },
    { id: 17, p: T2, k: 'test', s: 45, q: '¿Cómo se llama esta pieza, donde se conectan todos los componentes del ordenador?', e: img('placa-base', 150),
      o: ['La tarjeta madre (placa base)', 'La memoria RAM', 'La fuente de poder', 'El disipador de calor'], a: 0 },
    { id: 18, p: T2, k: 'cerrada', s: 60, q: 'Windows, macOS y Linux, ¿son hardware o software?',
      ph: 'Escribe una palabra', ok: ['software', 'es software', 'son software', 'sistema operativo', 'sistemas operativos', 'un sistema operativo'] },
    { id: 19, p: T3, k: 'test', s: 45, q: 'Este componente es un periférico. ¿Para qué parte de un programa sirve?', e: img('teclado', 120),
      o: ['Para la entrada: introducir información', 'Para el proceso: hacer los cálculos', 'Para la salida: mostrar el resultado', 'Para almacenar los programas'], a: 0 },
    { id: 20, p: T2, k: 'vf', s: 30, q: 'El disco duro, la memoria RAM y el pendrive son ejemplos de almacenamiento.', a: true },
    { id: 21, p: T3, k: 'test', s: 45, q: '¿Qué es un <b>programa informático</b>?',
      o: ['Un conjunto de instrucciones que le dicen a un ordenador qué tiene que hacer y en qué orden', 'Una pieza del ordenador', 'Una persona que arregla ordenadores', 'Un tipo de pantalla'], a: 0 },
    { id: 22, p: T3, k: 'cerrada', s: 60, q: 'Las tres partes fundamentales de un programa son la entrada, el proceso y la…',
      ph: 'Escribe la palabra que falta', ok: ['salida', 'la salida'] },
    { id: 23, p: T3, k: 'test', s: 45, q: 'Usas una calculadora para sumar 5 + 3. ¿A qué parte del programa corresponde <b>la operación 5 + 3</b>?',
      o: ['Al proceso', 'A la entrada', 'A la salida', 'Al almacenamiento'], a: 0 },
    { id: 24, p: T2, k: 'critico', s: 180, q: 'Un compañero dice: «El software no se estropea nunca, porque no se puede tocar». ¿Estás de acuerdo? Razona tu respuesta con lo que has aprendido sobre el desgaste del software.',
      rb: [
        { t: 'No está de acuerdo, o lo matiza', w: ['no estoy de acuerdo', 'no es cierto', 'no es verdad', 'falso', 'no tiene razon', 'se equivoca', 'en parte', 'no del todo', 'pero'] },
        { t: 'Explica que puede quedarse obsoleto o anticuado', w: ['obsolet', 'anticuad', 'desactualiz', 'viejo', 'antiguo'] },
        { t: 'Habla de los errores (bugs)', w: ['error', 'bug', 'fallo', 'falla'] },
        { t: 'Dice que se arregla con actualizaciones', w: ['actualiz'] }
      ] },
    { id: 25, p: T1, k: 'reflexion', s: 150, q: '¿Qué uso haces del ordenador en tu vida diaria? Pon un ejemplo y di qué hardware y qué software utilizas en él.',
      rb: [
        { t: 'Cuenta para qué usa el ordenador', w: ['uso', 'utilizo', 'sirve', 'hago', 'para jugar', 'para estudiar', 'jugar', 'estudi', 'tarea', 'deberes', 'buscar', 'trabaj', 'ver ', 'escribir', 'hablar'] },
        { t: 'Nombra algún hardware que utiliza', re: HW },
        { t: 'Nombra algún software que utiliza', re: SW },
        { t: 'Lo explica con al menos 20 palabras', min: 20 }
      ] }
  ];
  // Todas las preguntas valen igual
  Q.forEach(function (q) { q.pt = 1; });

  function correcta(q, v) {
    var norm = function (x) { return String(x).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:!¡¿?«»"]/g, '').replace(/\s+/g, ' '); };
    if (q.k === 'test' || q.k === 'vf') return v === q.a;
    if (q.k === 'cerrada') return q.ok.map(norm).indexOf(norm(v == null ? '' : v)) >= 0;
    return null;
  }

  window.CUESTIONARIO = {
    id: '1eso-sistemas', titulo: 'Cuestionario 1.º ESO · Sistemas de computación', grupos: GRUPOS,
    descripcion: 'Es un cuestionario sobre el <b>Tema 1: Sistemas de computación</b>: la informática y los sistemas computacionales, el hardware y el software, y las partes de un programa (entrada, proceso y salida). Son <b>25 preguntas y todas valen lo mismo: 0,4 puntos</b>. Hay preguntas de varios tipos:',
    preguntas: Q, KIND: KIND, AUTO: AUTO, correcta: correcta
  };
})();
