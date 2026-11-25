/*
 * Cuestionario de 1.º Bachillerato · Prácticas de sistemas automáticos (Arduino)
 * Banco de preguntas compartido por la página del alumno y el panel del profesor.
 *
 * Basado en las prácticas de Tecnología e Ingeniería I:
 *   02 Secuencias de luces · 03 y 05 Iluminación con 10 LEDs en protoboard · 04 Encendido alternativo de dos LEDs
 *   06 Control de luz con pulsador · 08 Temporizador 0 a 9 · 09 Temporizador de 0 a 99 con funciones
 * Además: el LED (ánodo y cátodo), la resistencia del LED, la protoboard y las funciones pinMode, digitalWrite, digitalRead y delay.
 *
 * Para cambiar los grupos, edita GRUPOS.
 * Cada pregunta: k = tipo (test | vf | cerrada | abierta | reflexion | critico), s = segundos,
 * test → o (opciones) y a (índice correcto) · vf → a (true/false) · cerrada → ok (respuestas válidas).
 * codigo → el alumno escribe una línea de código; ok = líneas válidas (no cuentan los espacios; las funciones van en camelCase exacto —pinMode, digitalWrite…—; en variables y constantes no importan las mayúsculas; el «;» es obligatorio).
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

  var PL = 'El LED: ánodo y cátodo', PR = 'La resistencia del LED', PB = 'La protoboard',
      P2 = 'Práctica 02 · Secuencias de luces', P35 = 'Prácticas 03 y 05 · 10 LEDs en protoboard',
      P4 = 'Práctica 04 · Encendido alternativo', P6 = 'Práctica 06 · Control de luz con pulsador',
      P8 = 'Práctica 08 · Temporizador 0 a 9', P9 = 'Práctica 09 · Temporizador 0 a 99 con funciones', PF = 'Funciones de Arduino';

  var PINES_SEG = 'int c = 7;\nint d = 8;\nint e = 9;\nint g = 10;\nint f = 11;\nint a = 12;\nint b = 13;\n';

  var KIND = { test: 'Test', vf: 'Verdadero o falso', cerrada: 'Respuesta cerrada', codigo: 'Respuesta abierta · código', abierta: 'Respuesta abierta', reflexion: 'Reflexión', critico: 'Pensamiento crítico' };
  var AUTO = { test: 1, vf: 1, cerrada: 1, codigo: 1 };
  var Q = [
    /* ---------- El LED: ánodo y cátodo ---------- */
    { id: 1, p: PL, k: 'test', s: 35, q: '¿Cómo se reconoce el <b>ánodo</b> de un LED?',
      o: ['Es la patilla más larga, y se conecta al positivo', 'Es la patilla más corta, y se conecta a GND', 'Es la patilla del lado plano de la cápsula', 'Las dos patillas son iguales: no importa'], a: 0 },
    { id: 2, p: PL, k: 'test', s: 40, q: 'En tus montajes, ¿cómo se conecta un LED a Arduino?',
      o: ['El ánodo al pin digital (a través de la resistencia) y el cátodo a GND', 'El cátodo al pin digital y el ánodo a GND', 'Las dos patillas al mismo pin', 'El ánodo a 5 V y el cátodo al pin digital, sin resistencia'], a: 0 },
    { id: 3, p: PL, k: 'vf', s: 25, q: 'Si se coloca un LED al revés (ánodo a GND y cátodo al pin), no se enciende, porque solo deja pasar la corriente en un sentido.', a: true },
    { id: 4, p: PL, k: 'cerrada', s: 35, q: '¿Cómo se llama la patilla <b>negativa</b> de un LED, la más corta? Escribe una palabra.',
      ph: 'Escribe una palabra', ok: ['catodo', 'el catodo', 'katodo'] },

    /* ---------- La resistencia del LED ---------- */
    { id: 5, p: PR, k: 'test', s: 35, q: '¿Por qué se pone una <b>resistencia en serie</b> con cada LED?',
      o: ['Para limitar la corriente y que no se dañe el LED ni el pin de Arduino', 'Para que el LED brille más', 'Para que el LED parpadee', 'Para que el LED funcione aunque esté al revés'], a: 0 },
    { id: 6, p: PR, k: 'cerrada', s: 75, q: 'Un pin de Arduino da <b>5 V</b>. El LED necesita <b>2 V</b> y <b>20 mA</b>. ¿Qué resistencia hay que poner? Escribe solo el número, en ohmios.',
      ph: 'Número en Ω', ok: ['150', '150 ohmios', '150ω', '150 ω', '150 ohm', '150 ohms'] },
    { id: 7, p: PR, k: 'vf', s: 30, q: 'Cuanto mayor es el valor de la resistencia que se pone con el LED, más corriente pasa y más brilla.', a: false },
    { id: 8, p: PR, k: 'abierta', s: 120, q: 'Explica qué pasaría si conectaras un LED directamente a un pin de Arduino <b>sin resistencia</b>. ¿Por qué es necesaria?',
      rb: [
        { t: 'Dice que pasaría demasiada corriente', w: ['mucha corriente', 'demasiada corriente', 'mucha intensidad', 'demasiada intensidad', 'exceso', 'sin limite', 'mas corriente', 'mas intensidad', 'corriente muy alta', 'demasiado'] },
        { t: 'Dice que el LED (o el pin de Arduino) se puede quemar o estropear', w: ['quem', 'fund', 'romp', 'estrope', 'dan', 'rompe', 'averi', 'muere'] },
        { t: 'Explica que la resistencia limita o reduce la corriente', w: ['limit', 'reduc', 'disminu', 'controla', 'regula', 'se opone', 'oposicion', 'baja la corriente', 'baja la intensidad'] },
        { t: 'Lo relaciona con la ley de Ohm o con los valores del LED (V, mA)', w: ['ohm', 'v=i', 'r=v', 'i=v', '20 ma', '20ma', 'voltio', 'tension', 'miliamperio', 'ma '] }
      ] },

    /* ---------- La protoboard ---------- */
    { id: 9, p: PB, k: 'test', s: 35, q: '¿Para qué sirve la <b>placa protoboard</b>?',
      o: ['Para montar y probar circuitos sin soldar, y poder cambiarlos y reutilizar los componentes', 'Para programar Arduino', 'Para dar más voltaje al circuito', 'Para guardar el programa cuando se apaga Arduino'], a: 0 },
    { id: 10, p: PB, k: 'test', s: 40, q: 'En una protoboard, ¿cómo están conectados los orificios de la zona central?',
      o: ['En columnas de 5 orificios, y las dos mitades separadas por el canal central no están unidas', 'Todos los orificios de una misma fila larga están unidos', 'Cada orificio está aislado de los demás', 'Las dos mitades están unidas a través del canal central'], a: 0 },
    { id: 11, p: PB, k: 'vf', s: 25, q: 'Las líneas largas de los laterales de la protoboard, marcadas con + y −, se usan para repartir la alimentación (5 V y GND).', a: true },
    { id: 12, p: PB, k: 'vf', s: 30, q: 'Si pones las dos patillas de un LED en la misma columna de 5 orificios, el LED queda en cortocircuito y no se enciende.', a: true },

    /* ---------- Práctica 02 · Secuencias de luces ---------- */
    { id: 13, p: P2, k: 'test', s: 40, q: 'En la práctica 02, los LEDs están en los pines ' + c('led1 = 9') + ' … ' + c('led5 = 13') + ', en fila. ¿Qué LEDs se encienden en el paso <b>t = 1</b>?',
      e: cod('// t=1\ndigitalWrite(led1, HIGH);\ndigitalWrite(led2, LOW);\ndigitalWrite(led3, LOW);\ndigitalWrite(led4, LOW);\ndigitalWrite(led5, HIGH);\ndelay(1000);'),
      o: ['led1 y led5, los de los dos extremos (pines 9 y 13)', 'led1 y led2 (pines 9 y 10)', 'Solo led3, el del centro (pin 11)', 'Todos menos led1'], a: 0 },
    { id: 14, p: P2, k: 'test', s: 40, q: 'En la práctica 02, la secuencia es: t=0 todos apagados; t=1 led1 y led5; t=2 led2 y led4; t=3 led3. ¿Qué efecto se ve?',
      o: ['Las luces avanzan desde los extremos hacia el centro', 'Las luces avanzan de izquierda a derecha', 'Todos los LEDs parpadean a la vez', 'Las luces avanzan desde el centro hacia los extremos'], a: 0 },
    { id: 15, p: P2, k: 'cerrada', s: 45, q: 'El ' + c('loop()') + ' de la práctica 02 tiene 4 pasos (t=0 a t=3), cada uno con ' + c('delay(1000)') + '. ¿Cuántos segundos dura una vuelta completa? Escribe solo el número.',
      ph: 'Segundos', ok: ['4', 'cuatro', '4 s', '4s', '4 segundos'] },
    { id: 16, p: P2, k: 'vf', s: 25, q: 'En todas las prácticas, el código de ' + c('setup()') + ' se ejecuta una sola vez y el de ' + c('loop()') + ' se repite sin parar.', a: true },

    /* ---------- Prácticas 03 y 05 · 10 LEDs ---------- */
    { id: 17, p: P35, k: 'test', s: 55, q: 'En las prácticas 03 y 05 se declaran así los LEDs. ¿Qué <b>pines</b> quedan en HIGH en este paso?',
      e: cod('int led1 = 13;  int led2 = 12;  int led3 = 11;\nint led4 = 8;   int led5 = 7;   int led6 = 6;\nint led7 = 5;   int led8 = 4;   int led9 = 9;\nint led10 = 10;\n\ndigitalWrite(led1, LOW);   digitalWrite(led6, LOW);\ndigitalWrite(led2, LOW);   digitalWrite(led7, LOW);\ndigitalWrite(led3, HIGH);  digitalWrite(led8, HIGH);\ndigitalWrite(led4, HIGH);  digitalWrite(led9, HIGH);\ndigitalWrite(led5, LOW);   digitalWrite(led10, LOW);'),
      o: ['11, 8, 4 y 9', '3, 4, 8 y 9', '11, 12, 4 y 5', '13, 8, 7 y 10'], a: 0 },
    { id: 18, p: P35, k: 'vf', s: 30, q: 'En la práctica 05, la variable ' + c('led4') + ' está conectada al pin 4.', a: false },
    { id: 19, p: P35, k: 'cerrada', s: 45, q: 'En la práctica 05 cada paso de la secuencia escribe una línea ' + c('digitalWrite') + ' por cada uno de los 10 LEDs. Si la secuencia tuviera <b>6 pasos</b>, ¿cuántas líneas ' + c('digitalWrite') + ' tendrías que escribir?',
      ph: 'Escribe un número', ok: ['60', 'sesenta'] },
    { id: 20, p: P35, k: 'test', s: 40, q: '¿Para qué sirven las líneas ' + c('pinMode(led1, OUTPUT);') + ' … ' + c('pinMode(led10, OUTPUT);') + ' en el ' + c('setup()') + '?',
      o: ['Configuran los pines de los LEDs como salidas', 'Encienden los 10 LEDs', 'Leen el estado de los LEDs', 'Dicen cuánto tiempo está encendido cada LED'], a: 0 },

    /* ---------- Práctica 04 · Encendido alternativo ---------- */
    { id: 21, p: P4, k: 'test', s: 45, q: '¿Qué hace el programa de la práctica 04?',
      e: cod('int led1 = 8;\nint led2 = 7;\n\nvoid loop() {\n  digitalWrite(led1, HIGH);\n  digitalWrite(led2, LOW);\n  delay(1000);\n\n  digitalWrite(led1, LOW);\n  digitalWrite(led2, HIGH);\n  delay(1000);\n}'),
      o: ['Los LEDs se alternan: un segundo se enciende uno y al siguiente el otro', 'Los dos LEDs se encienden y se apagan a la vez', 'El led1 se queda siempre encendido', 'Los LEDs se encienden una sola vez'], a: 0 },
    { id: 22, p: P4, k: 'cerrada', s: 45, q: 'En la práctica 04, ¿cada cuántos segundos vuelve a encenderse el <b>led1</b>? Escribe solo el número.',
      ph: 'Segundos', ok: ['2', 'dos', '2 s', '2s', '2 segundos'] },

    /* ---------- Práctica 06 · Control de luz con pulsador ---------- */
    { id: 23, p: P6, k: 'test', s: 45, q: 'En la práctica 06, el pulsador va entre el pin 7 y GND, <b>sin resistencia</b>. ¿Por qué funciona?',
      e: cod('pinMode(led, OUTPUT);\npinMode(pulsador, INPUT_PULLUP);'),
      o: ['Porque INPUT_PULLUP activa una resistencia interna de Arduino que mantiene el pin en HIGH', 'Porque el pin 7 no necesita resistencia', 'Porque el LED hace de resistencia', 'No funciona: falta una resistencia externa'], a: 0 },
    { id: 24, p: P6, k: 'vf', s: 30, q: 'Con ' + c('INPUT_PULLUP') + ', al pulsar el pulsador, ' + c('digitalRead(pulsador)') + ' devuelve LOW.', a: true },
    { id: 25, p: P6, k: 'test', s: 45, q: 'Con el programa de la práctica 06, ¿qué hace el LED cuando <b>no</b> se pulsa?',
      e: cod('estadoPulsador = digitalRead(pulsador);\n\nif (estadoPulsador == LOW) {\n  digitalWrite(led, HIGH);\n} else {\n  digitalWrite(led, LOW);\n}'),
      o: ['Está apagado, porque el pin lee HIGH y se ejecuta el else', 'Está encendido, porque el pin lee LOW', 'Parpadea', 'Se queda como estuviera antes'], a: 0 },
    { id: 26, p: P6, k: 'test', s: 45, q: 'Un compañero escribió así la condición y el LED no responde bien al pulsador. ¿Cuál es el error?',
      e: cod('if (estadoPulsador = LOW) {\n  digitalWrite(led, HIGH);\n}'),
      o: ['Usa = (asignar) en lugar de == (comparar)', 'Falta un delay dentro del if', 'LOW debe ir entre comillas', 'estadoPulsador debe declararse dentro del if'], a: 0 },

    /* ---------- Práctica 08 · Temporizador 0 a 9 ---------- */
    { id: 27, p: P8, k: 'test', s: 50, q: 'En la práctica 08 los segmentos están conectados así. ¿Qué número se ve en el display con este bloque?',
      e: cod(PINES_SEG + '\ndigitalWrite(c, HIGH);\ndigitalWrite(d, LOW);\ndigitalWrite(e, LOW);\ndigitalWrite(g, LOW);\ndigitalWrite(f, LOW);\ndigitalWrite(a, HIGH);\ndigitalWrite(b, HIGH);\ndelay(1000);'),
      o: ['7', '1', '4', '3'], a: 0 },
    { id: 28, p: P8, k: 'test', s: 40, q: 'En la práctica 08 los segmentos se encienden con <b>HIGH</b>. ¿Qué tipo de display es y a dónde va su pin común?',
      o: ['Cátodo común, con el común a GND', 'Ánodo común, con el común a 5 V', 'Cátodo común, con el común a 5 V', 'Ánodo común, con el común a GND'], a: 0 },
    { id: 29, p: P8, k: 'cerrada', s: 45, q: 'En la práctica 08, ¿cuántos segmentos se ponen en HIGH para mostrar el número <b>0</b>? Escribe solo el número.',
      ph: 'Escribe un número', ok: ['6', 'seis'] },
    { id: 30, p: P8, k: 'vf', s: 30, q: 'Cada segmento del display es un LED, así que también necesita su resistencia.', a: true },

    /* ---------- Práctica 09 · Temporizador 0 a 99 con funciones ---------- */
    { id: 31, p: P9, k: 'test', s: 40, q: 'En la práctica 09 se usan <b>funciones</b>. ¿Qué ventaja tiene escribir una función como ' + c('mostrarNumero(int n)') + '?',
      o: ['Se escribe una sola vez el código que enciende los segmentos y se usa con cualquier número, sin repetirlo', 'El programa se ejecuta más rápido que sin funciones', 'Sin funciones no se puede usar el display', 'Las funciones ocupan menos pines'], a: 0 },
    { id: 34, p: P9, k: 'abierta', s: 160, q: 'Explica cómo funciona tu <b>temporizador de 0 a 99 con funciones</b> (práctica 09): qué funciones creaste, qué hace cada una y cómo consigues que la cuenta llegue hasta 99.',
      rb: [
        { t: 'Dice que crea una o varias funciones para mostrar los números', w: ['funcion', 'void', 'mostrar', 'llam'] },
        { t: 'Explica qué hace la función: encender los segmentos de cada cifra', w: ['segmento', 'digitalwrite', 'high', 'enciende', 'encender', 'cifra', 'digito'] },
        { t: 'Usa dos displays: uno para las decenas y otro para las unidades', w: ['decena', 'unidad', 'dos display', 'segundo display', 'otro display'] },
        { t: 'Explica cómo avanza la cuenta (bucle, contador, delay…)', w: ['for', 'bucle', 'contador', 'cuenta', 'delay', 'segundo', 'suma', '++', 'hasta 99'] }
      ] },

    /* ---------- Funciones de Arduino: pinMode, digitalWrite, digitalRead, delay ---------- */
    { id: 37, p: PF, k: 'test', s: 40, q: '¿Qué hace la instrucción ' + c('pinMode(13, OUTPUT);') + '?',
      o: ['Configura el pin 13 como salida, para poder encender o apagar lo que se conecte a él', 'Enciende el LED del pin 13', 'Lee el valor del pin 13', 'Espera 13 milisegundos'], a: 0 },
    { id: 38, p: PF, k: 'test', s: 40, q: '¿Con qué modo hay que configurar el pin de un <b>pulsador</b> en ' + c('pinMode') + '?',
      o: ['INPUT o INPUT_PULLUP, porque el pulsador es una entrada', 'OUTPUT, porque el pulsador manda la señal', 'HIGH', 'Da igual: pinMode solo se usa con LEDs'], a: 0 },
    { id: 39, p: PF, k: 'test', s: 40, q: '¿Qué hace ' + c('digitalWrite(led, HIGH);') + '?',
      o: ['Pone el pin del LED a 5 V, y el LED se enciende', 'Pone el pin a 0 V, y el LED se apaga', 'Lee si el LED está encendido', 'Configura el pin del LED como salida'], a: 0 },
    { id: 40, p: PF, k: 'test', s: 40, q: '¿Qué valores puede devolver ' + c('digitalRead(pulsador)') + '?',
      o: ['HIGH o LOW', 'Cualquier número entre 0 y 1023', 'OUTPUT o INPUT', 'Los milisegundos que se ha pulsado'], a: 0 },
    { id: 42, p: PF, k: 'vf', s: 30, q: 'Mientras se ejecuta un ' + c('delay(1000)') + ', Arduino se queda esperando y no lee el pulsador ni ejecuta otras instrucciones.', a: true },
    { id: 43, p: PF, k: 'vf', s: 30, q: c('digitalWrite') + ' sirve para leer si un pulsador está pulsado.', a: false },

    /* ---------- Más sobre el código ---------- */
    { id: 45, p: P4, k: 'test', s: 35, q: 'En la práctica 04, ¿qué es ' + c('int led1 = 8;') + '?',
      o: ['Una variable que guarda el número del pin donde está conectado el led1', 'Una instrucción que enciende el LED 8 veces', 'Una función que configura el pin 8', 'Un comentario'], a: 0 },
    { id: 46, p: P6, k: 'test', s: 40, q: 'En la práctica 06, ¿para qué sirve la variable ' + c('estadoPulsador') + '?',
      o: ['Para guardar lo que lee digitalRead (HIGH o LOW) y usarlo después en el if', 'Para encender el LED', 'Para indicar el pin del pulsador', 'Para contar cuántas veces se ha pulsado'], a: 0 },
    { id: 48, p: P35, k: 'test', s: 45, q: 'En la práctica 05, ¿qué pasaría si borraras el ' + c('delay(1000)') + ' del <b>último</b> paso del loop?',
      o: ['El último paso no se llegaría a ver: el loop volvería enseguida al primer paso', 'Los LEDs se quedarían encendidos para siempre', 'El programa daría error al compilar', 'Todos los pasos irían más rápido'], a: 0 },
    { id: 49, p: P2, k: 'vf', s: 25, q: 'Las líneas que empiezan por ' + c('//') + ', como ' + c('// t=1') + ', son comentarios: Arduino no las ejecuta.', a: true },
    { id: 50, p: P2, k: 'vf', s: 25, q: 'En Arduino, cada instrucción debe terminar en punto y coma ' + c(';') + '.', a: true },

    /* ---------- Escribe una línea de código ---------- */
    { id: 51, p: P4, k: 'codigo', s: 50, q: 'Escribe la línea de código que configura el pin del <b>led1</b> como salida (práctica 04).',
      ph: 'pinMode(…', ok: ['pinMode(led1, OUTPUT);', 'pinMode(8, OUTPUT);'] },
    { id: 52, p: P4, k: 'codigo', s: 50, q: 'Escribe la línea de código que <b>enciende</b> el <b>led2</b> (práctica 04).',
      ph: 'Una línea de código', ok: ['digitalWrite(led2, HIGH);', 'digitalWrite(7, HIGH);'] },
    { id: 53, p: PF, k: 'codigo', s: 50, q: 'Escribe la línea de código que hace que el programa espere <b>2 segundos</b>.',
      ph: 'Una línea de código', ok: ['delay(2000);'] },
    { id: 54, p: P6, k: 'codigo', s: 65, q: 'Escribe la línea de código que guarda en la variable <b>estadoPulsador</b> lo que lee el pin del <b>pulsador</b> (práctica 06).',
      ph: 'estadoPulsador = …', ok: ['estadoPulsador = digitalRead(pulsador);', 'estadoPulsador = digitalRead(7);'] },
    { id: 55, p: P6, k: 'codigo', s: 65, q: 'Escribe la línea de código que configura el pin del <b>pulsador</b> como entrada con la <b>resistencia interna</b> de Arduino (práctica 06).',
      ph: 'pinMode(…', ok: ['pinMode(pulsador, INPUT_PULLUP);', 'pinMode(7, INPUT_PULLUP);'] },

    /* ---------- Reflexión y pensamiento crítico ---------- */
    { id: 35, p: P35, k: 'reflexion', s: 120, q: 'La práctica 05 es un <b>sistema de iluminación navideña</b>. Piensa en otro sistema automático de tu entorno que use luces o un display (semáforo, cartel luminoso, ascensor, microondas…). ¿Qué entradas y salidas tendría y cómo lo programarías con lo que has aprendido?',
      rb: [
        { t: 'Nombra un sistema real', w: ['semaforo', 'cartel', 'ascensor', 'microondas', 'reloj', 'despertador', 'horno', 'lavadora', 'marcador', 'turno', 'parking', 'cronometro', 'temporizador', 'escaparate', 'faro', 'farola', 'alarma', 'paso de peatones'] },
        { t: 'Identifica alguna entrada (pulsador, botón, sensor…)', w: ['entrada', 'pulsador', 'boton', 'sensor', 'tecla', 'interruptor'] },
        { t: 'Identifica alguna salida (LED, display, zumbador…)', w: ['salida', 'led', 'display', 'luz', 'luces', 'zumbador', 'pantalla', 'motor', 'sonido'] },
        { t: 'Lo relaciona con la programación de las prácticas', w: ['digitalwrite', 'digitalread', 'delay', 'if', 'funcion', 'loop', 'setup', 'secuencia', 'program', 'arduino', 'pinmode', 'variable'] }
      ] },
    { id: 36, p: P8, k: 'critico', s: 145, q: 'En las prácticas 03, 05 y 08 el código repite muchísimas líneas ' + c('digitalWrite') + '. Un compañero dice: «Da igual, funciona; no hace falta usar funciones». ¿Estás de acuerdo? Razona ventajas e inconvenientes, pensando en lo que hiciste en la práctica 09.',
      rb: [
        { t: 'Toma postura y la razona', w: ['de acuerdo', 'no estoy', 'depende', 'no tiene razon', 'tiene razon', 'mejor', 'prefiero', 'creo que'] },
        { t: 'Señala que repetir código lo hace largo y propenso a errores', w: ['largo', 'repet', 'error', 'equivoc', 'lineas', 'copiar', 'pegar', 'lioso', 'dificil de leer'] },
        { t: 'Explica que las funciones permiten reutilizar código y cambiarlo en un solo sitio', w: ['reutiliz', 'una sola vez', 'un solo sitio', 'cambiar', 'modificar', 'llamar', 'ordenad', 'mas corto', 'menos lineas', 'legible', 'claro'] },
        { t: 'Reconoce algún inconveniente o el caso en que no compensa (programa corto, hay que aprender…)', w: ['corto', 'sencillo', 'aprender', 'complic', 'pocas lineas', 'facil', 'al principio', 'mas dificil'] }
      ] }
  ];
  // Todas las preguntas valen lo mismo: 1 punto cada una (50 en total → nota sobre 10 con centésimas)
  Q.forEach(function (q) { q.pt = 1; });

  /** ¿Es correcta la respuesta v? (null si la corrige el profesor) */
  function correcta(q, v) {
    var norm = function (x) { return String(x).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:!¡¿?]/g, '').replace(/\s+/g, ' '); };
    if (q.k === 'test' || q.k === 'vf') return v === q.a;
    if (q.k === 'cerrada') return q.ok.map(norm).indexOf(norm(v == null ? '' : v)) >= 0;
    if (q.k === 'codigo') {
      // Los nombres de las funciones de Arduino deben ir exactamente así (camelCase); en variables y constantes no importan las mayúsculas
      var FUN = ['pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead', 'delay'];
      var FUNmin = FUN.map(function (f) { return f.toLowerCase(); });
      var cod = function (x) {
        return String(x == null ? '' : x).replace(/\s+/g, '').replace(/[A-Za-z_]\w*/g, function (id) {
          if (FUN.indexOf(id) >= 0) return id;
          if (FUNmin.indexOf(id.toLowerCase()) >= 0) return '#mal#' + id;
          return id.toLowerCase();
        });
      };
      return q.ok.map(cod).indexOf(cod(v)) >= 0;
    }
    return null;
  }

  window.CUESTIONARIO = {
    id: '1bach-sistemas', titulo: 'Cuestionario prácticas de sistemas automáticos', grupos: GRUPOS,
    descripcion: 'Es un cuestionario sobre tus <b>prácticas de Arduino</b>: el LED (ánodo y cátodo), la resistencia del LED, la protoboard y las funciones pinMode, digitalWrite, digitalRead y delay, y el código de las prácticas (secuencias de luces, 10 LEDs en protoboard, encendido alternativo, control de luz con pulsador, temporizador de 0 a 9 y temporizador de 0 a 99 con funciones). Son <b>50 preguntas</b> y <b>todas valen lo mismo</b>; la nota final es sobre 10, con centésimas. En las preguntas de escribir código, escribe las <b>funciones</b> exactamente con sus mayúsculas (<code>pinMode</code>, <code>digitalWrite</code>, <code>digitalRead</code>…) y no olvides el <b>punto y coma</b>. Hay preguntas de varios tipos:',
    preguntas: Q, KIND: KIND, AUTO: AUTO, correcta: correcta
  };
})();
