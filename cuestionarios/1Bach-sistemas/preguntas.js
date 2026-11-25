/*
 * Cuestionario de 1.º Bachillerato · Prácticas de sistemas automáticos (Arduino)
 * Banco de preguntas compartido por la página del alumno y el panel del profesor.
 *
 * Prácticas: protoboard y LED, pulsadores, display de 7 segmentos (contador 0-9),
 * contador 0-99 con dos displays y funciones.
 *
 * Para cambiar los grupos, edita GRUPOS.
 * Cada pregunta: k = tipo (test | vf | cerrada | abierta | reflexion | critico), s = segundos,
 * test → o (opciones) y a (índice correcto) · vf → a (true/false) · cerrada → ok (respuestas válidas).
 * Todas las preguntas valen 1 punto (nota sobre 10 con centésimas).
 */
(function () {
  'use strict';
  var GRUPOS = ['1º Bachillerato A', '1º Bachillerato B'];

  /* Código Arduino bajo el enunciado */
  function cod(t) {
    return '<pre style="margin:12px 0 0;padding:14px 16px;border-radius:10px;background:var(--bg);border:1px solid var(--line);' +
      'font:15px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-x:auto;white-space:pre">' +
      t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
  }
  function c(t) { return '<code>' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</code>'; }

  var P1 = '1 · Protoboard y LED', P2 = '2 · Pulsadores', P3 = '3 · Display de 7 segmentos (0-9)',
      P4 = '4 · Contador 0-99 con dos displays', P5 = '5 · Funciones';

  var KIND = { test: 'Test', vf: 'Verdadero o falso', cerrada: 'Respuesta cerrada', abierta: 'Respuesta abierta', reflexion: 'Reflexión', critico: 'Pensamiento crítico' };
  var AUTO = { test: 1, vf: 1, cerrada: 1 };
  var Q = [
    /* ---------- 1 · Protoboard y LED ---------- */
    { id: 1, p: P1, k: 'test', s: 50, q: 'En una <b>protoboard</b>, ¿cómo están conectados los orificios de la zona central?',
      o: ['En columnas de 5 orificios, y las dos mitades separadas por el canal central no están unidas', 'Todos los orificios de una misma fila larga están unidos', 'Cada orificio está aislado de los demás', 'Las dos mitades están unidas a través del canal central'], a: 0 },
    { id: 2, p: P1, k: 'vf', s: 30, q: 'Las líneas largas de los laterales de la protoboard, marcadas con + y −, se usan normalmente para la alimentación (5 V y GND).', a: true },
    { id: 3, p: P1, k: 'test', s: 45, q: '¿Por qué se pone una <b>resistencia en serie</b> con cada LED?',
      o: ['Para limitar la corriente y que no se dañe el LED ni el pin de Arduino', 'Para que el LED brille más', 'Para que el LED parpadee', 'Porque sin ella el LED no tiene polaridad'], a: 0 },
    { id: 4, p: P1, k: 'cerrada', s: 120, q: 'Un pin de Arduino da <b>5 V</b>. El LED necesita <b>2 V</b> y <b>20 mA</b>. ¿Qué resistencia hay que poner? Escribe solo el número, en ohmios.',
      ph: 'Número en Ω', ok: ['150', '150 ohmios', '150ω', '150 ω', '150 ohm', '150 ohms'] },
    { id: 5, p: P1, k: 'test', s: 45, q: '¿Qué instrucción configura el pin 13 para encender un LED?',
      o: [c('pinMode(13, OUTPUT);'), c('pinMode(13, INPUT);'), c('digitalRead(13);'), c('digitalWrite(13, OUTPUT);')], a: 0 },
    { id: 6, p: P1, k: 'test', s: 60, q: '¿Qué hace este programa?', e: cod('void setup() {\n  pinMode(8, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(8, HIGH);\n  delay(500);\n  digitalWrite(8, LOW);\n  delay(500);\n}'),
      o: ['El LED del pin 8 parpadea: medio segundo encendido y medio segundo apagado, sin parar', 'El LED del pin 8 se enciende una sola vez durante 500 segundos', 'El LED se enciende 500 veces y se para', 'El LED se queda siempre encendido'], a: 0 },
    { id: 7, p: P1, k: 'vf', s: 30, q: 'El código de ' + c('setup()') + ' se ejecuta una sola vez y el de ' + c('loop()') + ' se repite sin parar.', a: true },

    /* ---------- 2 · Pulsadores ---------- */
    { id: 8, p: P2, k: 'test', s: 50, q: '¿Para qué sirve la resistencia <b>pull-down</b> de un pulsador?',
      o: ['Para que el pin lea LOW cuando el pulsador no está pulsado, y no quede «al aire»', 'Para que el pulsador consuma menos', 'Para que el pin lea HIGH cuando no se pulsa', 'Para encender un LED al pulsar'], a: 0 },
    { id: 9, p: P2, k: 'vf', s: 40, q: 'Con ' + c('pinMode(2, INPUT_PULLUP);') + ' el pin lee HIGH cuando el pulsador NO está pulsado y LOW cuando se pulsa.', a: true },
    { id: 10, p: P2, k: 'test', s: 60, q: 'Este programa tiene un error y el LED no responde bien al pulsador. ¿Cuál es?', e: cod('void loop() {\n  estado = digitalRead(2);\n  if (estado = HIGH) {\n    digitalWrite(13, HIGH);\n  } else {\n    digitalWrite(13, LOW);\n  }\n}'),
      o: ['En el if se usa = (asignar) en lugar de == (comparar)', 'digitalRead no puede leer el pin 2', 'Falta un delay dentro del if', 'El else sobra'], a: 0 },
    { id: 11, p: P2, k: 'cerrada', s: 45, q: '¿Qué función de Arduino se usa para <b>leer</b> si un pulsador está pulsado? Escribe solo su nombre.',
      ph: 'Nombre de la función', ok: ['digitalread', 'digitalread()', 'digitalread( )'] },
    { id: 12, p: P2, k: 'abierta', s: 180, q: 'Al pulsar una vez, a veces el contador sube 2 o 3 números en vez de 1. Explica <b>por qué pasa</b> y <b>cómo lo solucionarías</b> en el programa.',
      rb: [
        { t: 'Lo atribuye a los rebotes del pulsador (contactos que vibran)', w: ['rebot', 'vibra', 'oscila', 'varios contactos', 'varias veces', 'ruido'] },
        { t: 'Explica que el loop lee el pulsador muchas veces mientras se mantiene pulsado', w: ['muy rapido', 'muchas veces', 'mientras&pulsad', 'mantien', 'se repite', 'cada vuelta', 'lee varias'] },
        { t: 'Propone un retardo (delay) o un antirrebote', w: ['delay', 'retardo', 'esperar', 'espera', 'antirrebote', 'debounce', 'millis'] },
        { t: 'Propone detectar el cambio de estado o esperar a que se suelte', w: ['estado anterior', 'anterior', 'flanco', 'cambio de estado', 'cuando cambia', 'solt', 'while', 'deje de pulsar', 'hasta que'] }
      ] },

    /* ---------- 3 · Display de 7 segmentos (0-9) ---------- */
    { id: 13, p: P3, k: 'test', s: 50, q: 'En un display de <b>cátodo común</b>, ¿qué hay que hacer para encender un segmento?',
      o: ['Conectar el común a GND y poner el pin del segmento en HIGH', 'Conectar el común a 5 V y poner el pin del segmento en LOW', 'Conectar el común a GND y poner el pin en LOW', 'Poner todos los pines en INPUT'], a: 0 },
    { id: 14, p: P3, k: 'vf', s: 40, q: 'En un display de <b>ánodo común</b>, un segmento se enciende cuando su pin está en LOW.', a: true },
    { id: 15, p: P3, k: 'cerrada', s: 60, q: 'Los segmentos se llaman <b>a, b, c, d, e, f y g</b>. ¿Cuántos segmentos hay que encender para mostrar el número <b>1</b>? Escribe solo el número.',
      ph: 'Escribe un número', ok: ['2', 'dos'] },
    { id: 16, p: P3, k: 'test', s: 60, q: '¿Qué número se ve en el display si se encienden los segmentos <b>a, b, c</b>?',
      o: ['7', '1', '4', '3'], a: 0 },
    { id: 17, p: P3, k: 'test', s: 70, q: 'Para el contador 0-9 guardamos los segmentos de cada número en una tabla. ¿Qué devuelve ' + c('numeros[3][6]') + '?',
      e: cod('byte numeros[10][7] = {\n//  a  b  c  d  e  f  g\n  { 1, 1, 1, 1, 1, 1, 0 },  // 0\n  { 0, 1, 1, 0, 0, 0, 0 },  // 1\n  { 1, 1, 0, 1, 1, 0, 1 },  // 2\n  { 1, 1, 1, 1, 0, 0, 1 },  // 3\n  ...\n};'),
      o: ['1: el segmento g del número 3 está encendido', '0: el segmento g del número 3 está apagado', '1: el segmento f del número 3 está encendido', 'Da error, porque los índices empiezan en 1'], a: 0 },
    { id: 18, p: P3, k: 'test', s: 50, q: '¿Qué bucle recorre los números del <b>0 al 9</b>?',
      o: [c('for (int n = 0; n < 10; n++)'), c('for (int n = 0; n <= 10; n++)'), c('for (int n = 1; n < 10; n++)'), c('for (int n = 0; n < 9; n++)')], a: 0 },

    /* ---------- 4 · Contador 0-99 con dos displays ---------- */
    { id: 19, p: P4, k: 'cerrada', s: 60, q: 'En el contador 0-99, si ' + c('n = 47') + ', ¿cuánto vale ' + c('n / 10') + ' con variables ' + c('int') + '? Escribe solo el número.',
      ph: 'Escribe un número', ok: ['4', 'cuatro'] },
    { id: 20, p: P4, k: 'cerrada', s: 60, q: 'Si ' + c('n = 47') + ', ¿cuánto vale ' + c('n % 10') + '? Escribe solo el número.',
      ph: 'Escribe un número', ok: ['7', 'siete'] },
    { id: 21, p: P4, k: 'test', s: 60, q: 'Con dos displays y <b>multiplexado</b>, los siete segmentos se comparten. ¿Cómo se consigue que cada display muestre su cifra?',
      o: ['Se enciende un display cada vez, alternándolos tan rápido que el ojo ve los dos encendidos', 'Se encienden los dos a la vez con la misma cifra', 'Se usa un pin distinto para cada segmento de cada display', 'Se pone un delay de 1 segundo entre las decenas y las unidades'], a: 0 },
    { id: 22, p: P4, k: 'cerrada', s: 60, q: 'Si conectaras dos displays <b>sin multiplexar</b>, cada segmento a su propio pin (sin contar el punto), ¿cuántos pines de Arduino necesitarías? Escribe solo el número.',
      ph: 'Escribe un número', ok: ['14', 'catorce'] },
    { id: 23, p: P4, k: 'vf', s: 40, q: 'En el multiplexado, si se pone un ' + c('delay(1000)') + ' entre el display de las decenas y el de las unidades, se ve un parpadeo en lugar de los dos números fijos.', a: true },

    /* ---------- 5 · Funciones ---------- */
    { id: 24, p: P5, k: 'test', s: 50, q: '¿Qué ventaja tiene escribir una función ' + c('mostrarNumero(int n)') + ' en el programa del display?',
      o: ['Se escribe una vez el código que enciende los segmentos y se usa con cualquier número, sin repetirlo', 'El programa se ejecuta más rápido que sin funciones', 'Sin funciones no se puede usar el display', 'Las funciones ocupan menos pines'], a: 0 },
    { id: 25, p: P5, k: 'test', s: 60, q: '¿Qué significa ' + c('void') + ' en ' + c('void mostrarNumero(int n)') + '?',
      o: ['Que la función no devuelve ningún valor', 'Que la función no tiene parámetros', 'Que la función está vacía', 'Que la función solo se ejecuta en setup()'], a: 0 },
    { id: 26, p: P5, k: 'test', s: 70, q: 'Observa la función. ¿Qué se ve en el display al llamar a ' + c('mostrarNumero(2);') + '?',
      e: cod('int seg[7] = {2, 3, 4, 5, 6, 7, 8};  // a, b, c, d, e, f, g\n\nvoid mostrarNumero(int n) {\n  for (int i = 0; i < 7; i++) {\n    digitalWrite(seg[i], numeros[n][i]);\n  }\n}'),
      o: ['El número 2, porque la función escribe en cada pin el valor de la fila 2 de la tabla', 'Solo se enciende el segmento conectado al pin 2', 'Se encienden los pines del 2 al 8 a la vez', 'Nada, porque falta un return'], a: 0 },
    { id: 27, p: P5, k: 'vf', s: 40, q: 'Una función con un parámetro, como ' + c('mostrarNumero(int n)') + ', puede llamarse con números distintos: ' + c('mostrarNumero(5)') + ', ' + c('mostrarNumero(decenas)') + '…', a: true },
    { id: 28, p: P5, k: 'abierta', s: 240, q: 'Explica cómo hiciste el <b>contador de 0 a 99</b> con dos displays: cómo separas las decenas de las unidades y cómo usas la función para mostrarlas.',
      rb: [
        { t: 'Obtiene las decenas dividiendo entre 10', w: ['/10', 'entre 10', 'dividi'] },
        { t: 'Obtiene las unidades con el resto (%10)', w: ['%10', '% 10', 'resto', 'modulo'] },
        { t: 'Usa la función para mostrar cada cifra', w: ['funcion', 'mostrarnumero', 'mostrar numero', 'llam'] },
        { t: 'Alterna los displays (multiplexado) o usa un bucle que cuenta de 0 a 99', w: ['multiplex', 'altern', 'uno y luego', 'primero&despues', 'rapido', 'for', 'bucle', 'hasta 99', '99'] }
      ] },

    /* ---------- Reflexión y pensamiento crítico ---------- */
    { id: 29, p: 'Sistemas automáticos', k: 'reflexion', s: 180, q: 'Piensa en un aparato de tu casa o de la calle que tenga un <b>display de 7 segmentos</b> o un <b>contador</b> (microondas, ascensor, semáforo, despertador…). ¿Qué entradas y qué salidas tiene? ¿Cómo lo programarías con lo que has aprendido?',
      rb: [
        { t: 'Nombra un aparato o sistema real', w: ['microondas', 'ascensor', 'semaforo', 'despertador', 'reloj', 'horno', 'lavadora', 'marcador', 'gasolin', 'turno', 'parking', 'cronometro', 'temporizador', 'vitro', 'radio', 'cafetera', 'termostato', 'bascula'] },
        { t: 'Identifica alguna entrada (pulsador, botón, sensor…)', w: ['entrada', 'pulsador', 'boton', 'sensor', 'tecla', 'teclado'] },
        { t: 'Identifica alguna salida (display, LED, zumbador, motor…)', w: ['salida', 'display', 'led', 'pantalla', 'zumbador', 'motor', 'luz', 'pitido', 'sonido'] },
        { t: 'Lo relaciona con la programación (contador, función, if, bucle…)', w: ['contador', 'funcion', 'if', 'bucle', 'for', 'variable', 'program', 'codigo', 'arduino', 'resta', 'suma', 'cuenta'] }
      ] },
    { id: 30, p: P4, k: 'critico', s: 210, q: 'Un compañero dice: «Para el contador 0-99 es mejor conectar cada segmento de los dos displays a su propio pin; el multiplexado solo complica el programa». ¿Estás de acuerdo? Razona ventajas e inconvenientes de cada opción.',
      rb: [
        { t: 'Toma postura y la razona', w: ['de acuerdo', 'no estoy', 'depende', 'no tiene razon', 'tiene razon', 'mejor', 'prefiero', 'creo que'] },
        { t: 'Indica que sin multiplexar se gastan muchos pines (14)', w: ['pines', 'pin', '14', 'catorce', 'cables', 'conexiones'] },
        { t: 'Indica que el multiplexado ahorra pines y permite más displays', w: ['ahorra', 'menos pin', 'menos cable', 'mas display', 'cuatro display', 'compart', 'ampliar'] },
        { t: 'Reconoce que el multiplexado complica el programa (refresco, tiempos)', w: ['complic', 'dificil', 'rapido', 'refresc', 'parpade', 'delay', 'tiempo', 'altern'] }
      ] }
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
    id: '1bach-sistemas', titulo: 'Cuestionario prácticas de sistemas automáticos', grupos: GRUPOS,
    descripcion: 'Es un cuestionario sobre las <b>prácticas de Arduino</b>: la protoboard y los LED, los pulsadores, el display de 7 segmentos para contar de 0 a 9, el contador de 0 a 99 con dos displays y las funciones. Son <b>30 preguntas</b> y <b>todas valen lo mismo</b>; la nota final es sobre 10, con centésimas. Hay preguntas de varios tipos:',
    preguntas: Q, KIND: KIND, AUTO: AUTO, correcta: correcta
  };
})();
