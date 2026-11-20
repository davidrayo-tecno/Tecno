/*
 * RayoBlocks · 10 prácticas guiadas (español / inglés).
 * Cada práctica tiene: título, enunciado, reto extra, dos ayudas con pistas y una tercera que carga la solución.
 * «inicio» y «sol» construyen el proyecto de partida y el proyecto resuelto con las funciones de app.js (h).
 */
window.RBPracticas = function (h) {
  'use strict';
  var L = h.L, blk = h.blk, n = h.n, tx = h.tx, sub = h.sub, programa = h.programa, estado = h.estado, obj = h.obj, esc = h.esc, nom = h.nom;
  function proyecto(objetos, variables, mensajes) {
    return { formato: 'rayoblocks', version: 1, objetos: objetos, variables: variables || [], mensajes: mensajes || [] };
  }
  var cond = function (b) { return { block: b }; };

  return [
    /* 1 ─────────────────────────────────────────────── */
    {
      t: { es: '¡Hola, Chispa!', en: 'Hello, Chispa!' },
      d: {
        es: 'Haz que Chispa se presente cuando pulses la <b>bandera verde</b>: primero dice <b>«¡Hola!»</b> durante 2 segundos, luego <b>«Me llamo Chispa»</b> durante 2 segundos y al final <b>piensa</b> «¿Qué aprenderé hoy?» durante 2 segundos.',
        en: 'Make Chispa introduce itself when you click the <b>green flag</b>: first it says <b>“Hello!”</b> for 2 seconds, then <b>“My name is Chispa”</b> for 2 seconds and finally it <b>thinks</b> “What will I learn today?” for 2 seconds.'
      },
      extra: { es: 'Haz que, al hacer clic sobre Chispa, cambie al siguiente disfraz y suene «Pop».', en: 'When you click on Chispa, make it switch to the next costume and play “Pop”.' },
      h: [
        { es: 'Todo programa empieza con un bloque amarillo de <b>Eventos</b>. Los bloques para hablar y pensar están en <b>Apariencia</b> (morados).',
          en: 'Every script starts with a yellow <b>Events</b> block. The blocks to speak and think are in <b>Looks</b> (purple).' },
        { es: 'Encaja, uno debajo de otro: «al hacer clic en 🚩» → «decir … durante 2 segundos» → otro «decir … durante 2 segundos» → «pensar … durante 2 segundos». Escribe los textos dentro de los huecos blancos.',
          en: 'Stack these blocks: “when 🚩 clicked” → “say … for 2 seconds” → another “say … for 2 seconds” → “think … for 2 seconds”. Type the texts inside the white slots.' }
      ],
      inicio: function () { return proyecto([esc(['Cielo']), obj('Chispa', { y: -40 })]); },
      sol: function () {
        return proyecto([esc(['Cielo']), obj('Chispa', { y: -40, bloques: estado([programa(30, 30, [blk('event_whenflagclicked'),
          blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Hola!', 'Hello!')), SECS: n(2) }),
          blk('looks_sayforsecs', null, { MESSAGE: tx(L('Me llamo Chispa', 'My name is Chispa')), SECS: n(2) }),
          blk('looks_thinkforsecs', null, { MESSAGE: tx(L('¿Qué aprenderé hoy?', 'What will I learn today?')), SECS: n(2) })])]) })]);
      }
    },

    /* 2 ─────────────────────────────────────────────── */
    {
      t: { es: 'Viaje por las coordenadas', en: 'A trip across the coordinates' },
      d: {
        es: 'El escenario es una cuadrícula: el centro es <b>x: 0, y: 0</b>. Al pulsar la bandera, Chispa debe colocarse en <b>x: -150, y: -100</b>, decir «¡Allá voy!» 1 segundo y <b>deslizarse en 2 segundos</b> hasta <b>x: 150, y: 100</b>. Al llegar dice «¡Llegué!».',
        en: 'The stage is a grid: the centre is <b>x: 0, y: 0</b>. When the flag is clicked, Chispa must go to <b>x: -150, y: -100</b>, say “Here I go!” for 1 second and <b>glide in 2 seconds</b> to <b>x: 150, y: 100</b>. When it arrives it says “I made it!”.'
      },
      extra: { es: 'Haz que recorra las cuatro esquinas de la cuadrícula y vuelva al punto de partida.', en: 'Make it visit the four corners of the grid and return to the start.' },
      h: [
        { es: 'Pasa el ratón por el escenario: abajo a la derecha verás las coordenadas x e y del puntero. Los bloques para colocar y deslizar están en <b>Movimiento</b> (azules).',
          en: 'Move the mouse over the stage: the x and y of the pointer appear at the bottom right. The blocks to place and glide are in <b>Motion</b> (blue).' },
        { es: '«al hacer clic en 🚩» → «ir a x: -150 y: -100» → «decir ¡Allá voy! durante 1 segundos» → «deslizar en 2 segs a x: 150 y: 100» → «decir ¡Llegué! durante 2 segundos».',
          en: '“when 🚩 clicked” → “go to x: -150 y: -100” → “say Here I go! for 1 seconds” → “glide 2 secs to x: 150 y: 100” → “say I made it! for 2 seconds”.' }
      ],
      inicio: function () { return proyecto([esc(['Cuadrícula XY']), obj('Chispa', { tam: 60 })]); },
      sol: function () {
        return proyecto([esc(['Cuadrícula XY']), obj('Chispa', { tam: 60, bloques: estado([programa(30, 30, [blk('event_whenflagclicked'),
          blk('motion_gotoxy', null, { X: n(-150), Y: n(-100) }),
          blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Allá voy!', 'Here I go!')), SECS: n(1) }),
          blk('motion_glidesecstoxy', null, { SECS: n(2), X: n(150), Y: n(100) }),
          blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Llegué!', 'I made it!')), SECS: n(2) })])]) })]);
      }
    },

    /* 3 ─────────────────────────────────────────────── */
    {
      t: { es: 'El pez nadador', en: 'The swimming fish' },
      d: {
        es: 'Anima al pez: al pulsar la bandera debe nadar <b>sin parar</b> de un lado a otro del mar. En cada paso avanza 6 pasos, <b>rebota</b> si toca un borde, cambia al <b>siguiente disfraz</b> (así mueve la cola) y espera 0,15 segundos. Que no nade boca abajo al darse la vuelta.',
        en: 'Animate the fish: when the flag is clicked it must swim <b>non-stop</b> from one side of the sea to the other. Each time it moves 6 steps, <b>bounces</b> if it touches an edge, switches to the <b>next costume</b> (so its tail moves) and waits 0.15 seconds. It must not swim upside down when it turns.'
      },
      extra: { es: 'Añade un segundo pez más pequeño que nade más rápido y con otro color (efecto color).', en: 'Add a second, smaller fish that swims faster and has another colour (colour effect).' },
      h: [
        { es: 'Para repetir algo sin fin se usa el bloque <b>«por siempre»</b> de Control: los bloques que metas dentro se repiten una y otra vez. Para que no se ponga boca abajo, mira el bloque «fijar estilo de rotación».',
          en: 'To repeat something endlessly use the <b>“forever”</b> block from Control: the blocks inside it repeat again and again. So it does not turn upside down, look at the “set rotation style” block.' },
        { es: '«al hacer clic en 🚩» → «fijar estilo de rotación a izquierda-derecha» → «por siempre» con dentro: «mover 6 pasos», «si toca un borde, rebotar», «siguiente disfraz», «esperar 0.15 segundos».',
          en: '“when 🚩 clicked” → “set rotation style left-right” → “forever” containing: “move 6 steps”, “if on edge, bounce”, “next costume”, “wait 0.15 seconds”.' }
      ],
      inicio: function () { return proyecto([esc(['Mar']), obj('Pez', { y: 20 })]); },
      sol: function () {
        return proyecto([esc(['Mar']), obj('Pez', { y: 20, bloques: estado([programa(30, 30, [blk('event_whenflagclicked'),
          blk('motion_setrotationstyle', { STYLE: 'left-right' }),
          blk('control_forever', null, { SUBSTACK: sub([blk('motion_move', null, { STEPS: n(6) }), blk('motion_ifonedgebounce'),
            blk('looks_nextcostume'), blk('control_wait', null, { DURATION: n(0.15) })]) })])]) })]);
      }
    },

    /* 4 ─────────────────────────────────────────────── */
    {
      t: { es: 'Dibuja un cuadrado', en: 'Draw a square' },
      d: {
        es: 'Usa el <b>lápiz</b> para que la flecha dibuje un <b>cuadrado de 100 pasos de lado</b> al pulsar la bandera. Antes de empezar debe borrar lo dibujado, colocarse en <b>x: -50, y: -50</b> y apuntar hacia la derecha (dirección 90). Usa un bloque <b>«repetir»</b>: no escribas cuatro veces lo mismo.',
        en: 'Use the <b>pen</b> so that the arrow draws a <b>square with 100-step sides</b> when the flag is clicked. Before starting it must erase the drawing, go to <b>x: -50, y: -50</b> and point right (direction 90). Use a <b>“repeat”</b> block: do not write the same thing four times.'
      },
      extra: { es: 'Dibuja también un triángulo y un hexágono. Pista: el ángulo de giro es 360 entre el número de lados.', en: 'Also draw a triangle and a hexagon. Hint: the turning angle is 360 divided by the number of sides.' },
      h: [
        { es: 'Un cuadrado son 4 veces «avanzar y girar 90 grados». Los bloques verdes de <b>Lápiz</b> sirven para borrar, bajar y subir el lápiz: mientras está bajado, el objeto pinta al moverse.',
          en: 'A square is “move and turn 90 degrees” 4 times. The green <b>Pen</b> blocks erase, put the pen down and lift it up: while it is down, the sprite paints as it moves.' },
        { es: '«al hacer clic en 🚩» → «borrar todo» → «ir a x: -50 y: -50» → «apuntar en dirección 90» → «bajar lápiz» → «repetir 4» con dentro «mover 100 pasos» y «girar ↺ 90 grados» → «subir lápiz».',
          en: '“when 🚩 clicked” → “erase all” → “go to x: -50 y: -50” → “point in direction 90” → “pen down” → “repeat 4” containing “move 100 steps” and “turn ↺ 90 degrees” → “pen up”.' }
      ],
      inicio: function () { return proyecto([esc(['Cuadrícula XY']), obj('Flecha', { tam: 50, x: -50, y: -50 })]); },
      sol: function () {
        return proyecto([esc(['Cuadrícula XY']), obj('Flecha', { tam: 50, x: -50, y: -50, bloques: estado([programa(30, 30, [blk('event_whenflagclicked'),
          blk('pen_clear'), blk('pen_penUp'), blk('motion_gotoxy', null, { X: n(-50), Y: n(-50) }), blk('motion_pointindirection', null, { DIRECTION: n(90) }),
          blk('pen_setPenColorTo', { COLOR: '#1E88E5' }), blk('pen_setPenSizeTo', null, { SIZE: n(3) }), blk('pen_penDown'),
          blk('control_repeat', null, { TIMES: n(4), SUBSTACK: sub([blk('motion_move', null, { STEPS: n(100) }), blk('motion_turnleft', null, { DEGREES: n(90) }),
            blk('control_wait', null, { DURATION: n(0.3) })]) }),
          blk('pen_penUp')])]) })]);
      }
    },

    /* 5 ─────────────────────────────────────────────── */
    {
      t: { es: 'Robot teledirigido', en: 'Remote-controlled robot' },
      d: {
        es: 'Controla el robot con las <b>flechas del teclado</b>: con la flecha derecha avanza 10 pasos hacia la derecha, con la izquierda 10 hacia la izquierda, con la de arriba sube 10 y con la de abajo baja 10. Al pulsar la bandera, el robot vuelve al centro.',
        en: 'Control the robot with the <b>arrow keys</b>: the right arrow moves it 10 steps right, the left arrow 10 steps left, the up arrow 10 up and the down arrow 10 down. When the flag is clicked, the robot goes back to the centre.'
      },
      extra: { es: 'Haz que el robot cambie de disfraz cada vez que se mueve y que suene «Salto» al pulsar la barra espaciadora.', en: 'Make the robot switch costume every time it moves and play “Jump” when you press the space bar.' },
      h: [
        { es: 'Necesitas varios programas pequeños, uno por cada tecla, cada uno empezando con <b>«al presionar tecla …»</b> (Eventos). Para la x usa «sumar … a x» y para la y «sumar … a y». Hacia la izquierda o hacia abajo el número es negativo.',
          en: 'You need several small scripts, one per key, each starting with <b>“when … key pressed”</b> (Events). For x use “change x by …” and for y “change y by …”. Left or down means a negative number.' },
        { es: '«al presionar tecla flecha derecha» → «sumar 10 a x». «flecha izquierda» → «sumar -10 a x». «flecha arriba» → «sumar 10 a y». «flecha abajo» → «sumar -10 a y». Y otro programa: «al hacer clic en 🚩» → «ir a x: 0 y: 0».',
          en: '“when right arrow key pressed” → “change x by 10”. “left arrow” → “change x by -10”. “up arrow” → “change y by 10”. “down arrow” → “change y by -10”. Plus: “when 🚩 clicked” → “go to x: 0 y: 0”.' }
      ],
      inicio: function () { return proyecto([esc(['Campo']), obj('Robot', { tam: 70 })]); },
      sol: function () {
        var tecla = function (y, k, tipo, v) { return programa(30, y, [blk('event_whenkeypressed', { KEY: k }), blk(tipo, null, tipo === 'motion_changexby' ? { DX: n(v) } : { DY: n(v) })]); };
        return proyecto([esc(['Campo']), obj('Robot', { tam: 70, bloques: estado([
          programa(30, 30, [blk('event_whenflagclicked'), blk('motion_gotoxy', null, { X: n(0), Y: n(0) })]),
          tecla(170, 'right arrow', 'motion_changexby', 10), tecla(290, 'left arrow', 'motion_changexby', -10),
          tecla(410, 'up arrow', 'motion_changeyby', 10), tecla(530, 'down arrow', 'motion_changeyby', -10)]) })]);
      }
    },

    /* 6 ─────────────────────────────────────────────── */
    {
      t: { es: 'Conversación con mensajes', en: 'A conversation with messages' },
      d: {
        es: 'Chispa y el robot van a charlar <b>por turnos</b>. Al pulsar la bandera, Chispa dice «¡Hola, Robot!» y después <b>envía el mensaje «saludo»</b>. Cuando el robot lo recibe, contesta «¡Hola, Chispa! ¿Jugamos?» y envía el mensaje «respuesta». Cuando Chispa recibe la respuesta, dice «¡Vale!».',
        en: 'Chispa and the robot will chat <b>taking turns</b>. When the flag is clicked, Chispa says “Hello, Robot!” and then <b>broadcasts the message “greeting”</b>. When the robot receives it, it answers “Hello, Chispa! Shall we play?” and broadcasts “answer”. When Chispa receives the answer, it says “OK!”.'
      },
      extra: { es: 'Alarga la conversación con un tercer mensaje y cambia el fondo cuando empiecen a jugar.', en: 'Make the conversation longer with a third message and switch the backdrop when they start playing.' },
      h: [
        { es: 'Cada objeto tiene <b>sus propios programas</b>: elige a Chispa o al robot abajo a la derecha para ver los suyos. Los mensajes (Eventos) sirven para avisar a otro objeto: uno usa «enviar …» y el otro empieza con «al recibir …». Crea los mensajes con la opción «Nuevo mensaje…».',
          en: 'Each sprite has <b>its own scripts</b>: select Chispa or the robot at the bottom right to see theirs. Messages (Events) let one sprite tell another: one uses “broadcast …” and the other starts with “when I receive …”. Create messages with the “New message…” option.' },
        { es: 'Chispa: «al hacer clic en 🚩» → «decir ¡Hola, Robot! durante 2 segundos» → «enviar saludo». Robot: «al recibir saludo» → «decir ¡Hola, Chispa! ¿Jugamos? durante 2 segundos» → «enviar respuesta». Chispa: «al recibir respuesta» → «decir ¡Vale! durante 2 segundos».',
          en: 'Chispa: “when 🚩 clicked” → “say Hello, Robot! for 2 seconds” → “broadcast greeting”. Robot: “when I receive greeting” → “say Hello, Chispa! Shall we play? for 2 seconds” → “broadcast answer”. Chispa: “when I receive answer” → “say OK! for 2 seconds”.' }
      ],
      inicio: function () { return proyecto([esc(['Campo']), obj('Chispa', { x: -120, y: -40 }), obj('Robot', { x: 120, y: -40 })], [], []); },
      sol: function () {
        var m1 = L('saludo', 'greeting'), m2 = L('respuesta', 'answer');
        return proyecto([esc(['Campo']),
          obj('Chispa', { x: -120, y: -40, bloques: estado([
            programa(30, 30, [blk('event_whenflagclicked'), blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Hola, Robot!', 'Hello, Robot!')), SECS: n(2) }), blk('event_broadcast', { BROADCAST: m1 })]),
            programa(30, 230, [blk('event_whenbroadcastreceived', { BROADCAST: m2 }), blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Vale!', 'OK!')), SECS: n(2) })])]) }),
          obj('Robot', { x: 120, y: -40, bloques: estado([
            programa(30, 30, [blk('event_whenbroadcastreceived', { BROADCAST: m1 }), blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Hola, Chispa! ¿Jugamos?', 'Hello, Chispa! Shall we play?')), SECS: n(2) }),
              blk('event_broadcast', { BROADCAST: m2 })])]) })], [], [m1, m2]);
      }
    },

    /* 7 ─────────────────────────────────────────────── */
    {
      t: { es: 'Adivina el número', en: 'Guess the number' },
      d: {
        es: 'Chispa piensa un número <b>al azar del 1 al 10</b> y lo guarda en una variable llamada <b>secreto</b>. Después te <b>pregunta</b> «Adivina mi número del 1 al 10». <b>Si</b> tu respuesta es igual al secreto, dice «¡Acertaste!»; <b>si no</b>, dice «Era el» seguido del número secreto.',
        en: 'Chispa thinks of a <b>random number from 1 to 10</b> and stores it in a variable called <b>secret</b>. Then it <b>asks</b> “Guess my number from 1 to 10”. <b>If</b> your answer equals the secret, it says “You got it!”; <b>else</b> it says “It was” followed by the secret number.'
      },
      extra: { es: 'Haz que siga preguntando hasta que aciertes y que te diga «Más alto» o «Más bajo» en cada intento.', en: 'Make it keep asking until you get it right and tell you “Higher” or “Lower” after each try.' },
      h: [
        { es: 'Crea la variable en <b>Variables → Crear una variable</b>. El número al azar está en <b>Operadores</b>, igual que el «=» y «unir». «preguntar … y esperar» y «respuesta» están en <b>Sensores</b>. Para decidir, usa «si … entonces / si no» de Control.',
          en: 'Create the variable in <b>Variables → Make a Variable</b>. The random number is in <b>Operators</b>, as are “=” and “join”. “ask … and wait” and “answer” are in <b>Sensing</b>. To decide, use “if … then / else” from Control.' },
        { es: '«al hacer clic en 🚩» → «dar a secreto el valor (número aleatorio entre 1 y 10)» → «preguntar Adivina mi número del 1 al 10 y esperar» → «si (respuesta = secreto) entonces: decir ¡Acertaste! / si no: decir (unir Era el  secreto)».',
          en: '“when 🚩 clicked” → “set secret to (pick random 1 to 10)” → “ask Guess my number from 1 to 10 and wait” → “if (answer = secret) then: say You got it! / else: say (join It was  secret)”.' }
      ],
      inicio: function () { return proyecto([esc(['Pizarra']), obj('Chispa', { y: -60 })]); },
      sol: function () {
        var s = { id: 'var-secreto' };
        return proyecto([esc(['Pizarra']), obj('Chispa', { y: -60, bloques: estado([programa(30, 30, [blk('event_whenflagclicked'),
          blk('data_setvariableto', { VARIABLE: s }, { VALUE: tx(0, blk('operator_random', null, { FROM: n(1), TO: n(10) })) }),
          blk('sensing_askandwait', null, { QUESTION: tx(L('Adivina mi número del 1 al 10', 'Guess my number from 1 to 10')) }),
          blk('control_if_else', null, {
            CONDITION: cond(blk('operator_equals', null, { OPERAND1: tx('', blk('sensing_answer')), OPERAND2: tx('', blk('data_variable', { VARIABLE: s })) })),
            SUBSTACK: sub([blk('looks_sayforsecs', null, { MESSAGE: tx(L('¡Acertaste!', 'You got it!')), SECS: n(2) })]),
            SUBSTACK2: sub([blk('looks_sayforsecs', null, { MESSAGE: tx('', blk('operator_join', null, { STRING1: tx(L('Era el ', 'It was ')), STRING2: tx('', blk('data_variable', { VARIABLE: s })) })), SECS: n(2) })])
          })])]) })], [{ id: 'var-secreto', nombre: L('secreto', 'secret'), valor: 0, monitor: false }]);
      }
    },

    /* 8 ─────────────────────────────────────────────── */
    {
      t: { es: 'Atrapa la pelota', en: 'Catch the ball' },
      d: {
        es: 'Un juego de puntería con el ratón. Al pulsar la bandera, la variable <b>puntos</b> vale 0 y la pelota va a una <b>posición aleatoria</b>. Cada vez que <b>hagas clic en la pelota</b>, ganas un punto, suena «Pop» y la pelota salta a otra posición aleatoria. Los puntos se ven en el escenario.',
        en: 'An aiming game with the mouse. When the flag is clicked, the variable <b>points</b> is 0 and the ball goes to a <b>random position</b>. Every time you <b>click the ball</b> you score a point, “Pop” plays and the ball jumps to another random position. The points are shown on the stage.'
      },
      extra: { es: 'Añade un tiempo límite: a los 20 segundos (usa el cronómetro) la pelota se esconde y Chispa dice cuántos puntos has conseguido.', en: 'Add a time limit: after 20 seconds (use the timer) the ball hides and Chispa says how many points you scored.' },
      h: [
        { es: 'Necesitas dos programas en la pelota: uno que empieza con la bandera y otro que empieza con <b>«al hacer clic en este objeto»</b>. La posición aleatoria está en el bloque «ir a …» de Movimiento.',
          en: 'The ball needs two scripts: one starting with the flag and another starting with <b>“when this sprite clicked”</b>. The random position is in the “go to …” block in Motion.' },
        { es: 'Crea la variable «puntos». Programa 1: «al hacer clic en 🚩» → «dar a puntos el valor 0» → «ir a posición aleatoria». Programa 2: «al hacer clic en este objeto» → «sumar a puntos 1» → «iniciar sonido Pop» → «ir a posición aleatoria».',
          en: 'Create the variable “points”. Script 1: “when 🚩 clicked” → “set points to 0” → “go to random position”. Script 2: “when this sprite clicked” → “change points by 1” → “start sound Pop” → “go to random position”.' }
      ],
      inicio: function () { return proyecto([esc(['Campo']), obj('Pelota')]); },
      sol: function () {
        var p = { id: 'var-puntos' };
        return proyecto([esc(['Campo']), obj('Pelota', { bloques: estado([
          programa(30, 30, [blk('event_whenflagclicked'), blk('data_setvariableto', { VARIABLE: p }, { VALUE: tx(0) }), blk('motion_goto', { TO: '_random_' })]),
          programa(30, 220, [blk('event_whenthisspriteclicked'), blk('data_changevariableby', { VARIABLE: p }, { VALUE: n(1) }), blk('sound_play', { SOUND: 'Pop' }), blk('motion_goto', { TO: '_random_' })])]) })],
          [{ id: 'var-puntos', nombre: L('puntos', 'points'), valor: 0, monitor: true }]);
      }
    },

    /* 9 ─────────────────────────────────────────────── */
    {
      t: { es: 'Lluvia de estrellas', en: 'Star shower' },
      d: {
        es: 'Crea una lluvia de estrellas con <b>clones</b>. Al pulsar la bandera, la estrella original se esconde y, <b>sin parar</b>, crea un clon de sí misma cada medio segundo. Cada clon aparece arriba (y: 170) en una <b>x al azar</b> entre -220 y 220, se muestra y cae girando hasta que su y es menor que -170; entonces <b>se elimina</b>.',
        en: 'Create a star shower with <b>clones</b>. When the flag is clicked, the original star hides and, <b>non-stop</b>, creates a clone of itself every half second. Each clone appears at the top (y: 170) at a <b>random x</b> between -220 and 220, shows itself and falls spinning until its y is less than -170; then it <b>deletes itself</b>.'
      },
      extra: { es: 'Haz que cada clon tenga un tamaño al azar y caiga a una velocidad distinta.', en: 'Give each clone a random size and make it fall at a different speed.' },
      h: [
        { es: 'Un <b>clon</b> es una copia del objeto con los mismos programas. Lo que hace cada clon empieza con <b>«al comenzar como clon»</b> (Control). Para caer, resta a la y dentro de un «repetir hasta que …».',
          en: 'A <b>clone</b> is a copy of the sprite with the same scripts. What each clone does starts with <b>“when I start as a clone”</b> (Control). To fall, decrease y inside a “repeat until …”.' },
        { es: 'Programa 1: «al hacer clic en 🚩» → «esconder» → «por siempre»: «crear clon de mí mismo», «esperar 0.5». Programa 2: «al comenzar como clon» → «ir a x: (aleatorio entre -220 y 220) y: 170» → «mostrar» → «repetir hasta que (posición en y < -170)»: «sumar -4 a y», «girar 5 grados» → «eliminar este clon».',
          en: 'Script 1: “when 🚩 clicked” → “hide” → “forever”: “create clone of myself”, “wait 0.5”. Script 2: “when I start as a clone” → “go to x: (pick random -220 to 220) y: 170” → “show” → “repeat until (y position < -170)”: “change y by -4”, “turn 5 degrees” → “delete this clone”.' }
      ],
      inicio: function () { return proyecto([esc(['Espacio']), obj('Estrella', { tam: 60 })]); },
      sol: function () {
        return proyecto([esc(['Espacio']), obj('Estrella', { tam: 60, bloques: estado([
          programa(30, 30, [blk('event_whenflagclicked'), blk('looks_hide'),
            blk('control_forever', null, { SUBSTACK: sub([blk('control_create_clone_of', { CLONE_OPTION: '_myself_' }), blk('control_wait', null, { DURATION: n(0.5) })]) })]),
          programa(30, 260, [blk('control_start_as_clone'),
            blk('motion_gotoxy', null, { X: n(0, blk('operator_random', null, { FROM: n(-220), TO: n(220) })), Y: n(170) }), blk('looks_show'),
            blk('control_repeat_until', null, { CONDITION: cond(blk('operator_lt', null, { OPERAND1: tx('', blk('motion_yposition')), OPERAND2: tx(-170) })),
              SUBSTACK: sub([blk('motion_changeyby', null, { DY: n(-4) }), blk('motion_turnright', null, { DEGREES: n(5) })]) }),
            blk('control_delete_this_clone')])]) })]);
      }
    },

    /* 10 ─────────────────────────────────────────────── */
    {
      t: { es: 'Proyecto final: atrapa las estrellas', en: 'Final project: catch the stars' },
      d: {
        es: 'Une todo lo aprendido en un juego. Chispa está abajo (y: -140) y <b>sigue al ratón</b> de izquierda a derecha. Caen estrellas (clones) desde arriba en posiciones al azar. Si una estrella <b>toca a Chispa</b>, suma 1 a <b>puntos</b>, suena «Moneda» y desaparece. La partida dura <b>30 segundos</b> (cronómetro): al terminar dejan de caer estrellas y Chispa dice «¡Fin! Puntos:» y tu puntuación.',
        en: 'Put everything together in a game. Chispa is at the bottom (y: -140) and <b>follows the mouse</b> left and right. Stars (clones) fall from the top at random positions. If a star <b>touches Chispa</b>, add 1 to <b>points</b>, play “Coin” and the star disappears. The game lasts <b>30 seconds</b> (timer): then no more stars fall and Chispa says “Game over! Points:” and your score.'
      },
      extra: { es: 'Añade un enemigo que reste puntos o haz que las estrellas caigan cada vez más rápido.', en: 'Add an enemy that takes points away, or make the stars fall faster and faster.' },
      h: [
        { es: 'Divide el problema. <b>Chispa:</b> con la bandera reinicia el cronómetro y los puntos, y por siempre pone su x igual a la x del ratón; otro programa espera a que el cronómetro pase de 30. <b>Estrella:</b> como en la práctica 9, pero crea clones solo mientras el cronómetro no pase de 30, y cada clon comprueba si toca a Chispa.',
          en: 'Break the problem down. <b>Chispa:</b> on the flag it resets the timer and the points, and forever sets its x to the mouse x; another script waits until the timer is over 30. <b>Star:</b> like practice 9, but it only creates clones while the timer is not over 30, and each clone checks whether it touches Chispa.' },
        { es: 'Chispa: «🚩» → «reiniciar cronómetro» → «dar a puntos el valor 0» → «ir a x: 0 y: -140» → «por siempre: dar a x el valor (posición x del ratón)». Chispa (2): «🚩» → «esperar hasta que (cronómetro > 30)» → «decir (unir ¡Fin! Puntos:  puntos)». Estrella: «🚩» → «esconder» → «repetir hasta que (cronómetro > 30)»: «crear clon de mí mismo», «esperar 0.7». Clon: «ir a x: (aleatorio -220 a 220) y: 170» → «mostrar» → «repetir hasta que (¿tocando Chispa? o (posición en y < -170))»: «sumar -5 a y» → «si ¿tocando Chispa? entonces: sumar a puntos 1, iniciar sonido Moneda» → «eliminar este clon».',
          en: 'Chispa: “🚩” → “reset timer” → “set points to 0” → “go to x: 0 y: -140” → “forever: set x to (mouse x)”. Chispa (2): “🚩” → “wait until (timer > 30)” → “say (join Game over! Points:  points)”. Star: “🚩” → “hide” → “repeat until (timer > 30)”: “create clone of myself”, “wait 0.7”. Clone: “go to x: (pick random -220 to 220) y: 170” → “show” → “repeat until (touching Chispa? or (y position < -170))”: “change y by -5” → “if touching Chispa? then: change points by 1, start sound Coin” → “delete this clone”.' }
      ],
      inicio: function () { return proyecto([esc(['Espacio']), obj('Chispa', { tam: 70, y: -140 }), obj('Estrella', { tam: 50, x: 0, y: 150 })]); },
      sol: function () {
        var p = { id: 'var-puntos' }, chispa = nom('Chispa');
        var tiempo = function () { return blk('operator_gt', null, { OPERAND1: tx('', blk('sensing_timer')), OPERAND2: tx(30) }); };
        var toca = function () { return blk('sensing_touchingobject', { TOUCHINGOBJECTMENU: chispa }); };
        return proyecto([esc(['Espacio']),
          obj('Chispa', { tam: 70, y: -140, bloques: estado([
            programa(30, 30, [blk('event_whenflagclicked'), blk('sensing_resettimer'), blk('data_setvariableto', { VARIABLE: p }, { VALUE: tx(0) }),
              blk('motion_gotoxy', null, { X: n(0), Y: n(-140) }),
              blk('control_forever', null, { SUBSTACK: sub([blk('motion_setx', null, { X: n(0, blk('sensing_mousex')) })]) })]),
            programa(30, 300, [blk('event_whenflagclicked'), blk('control_wait_until', null, { CONDITION: cond(tiempo()) }),
              blk('looks_say', null, { MESSAGE: tx('', blk('operator_join', null, { STRING1: tx(L('¡Fin! Puntos: ', 'Game over! Points: ')), STRING2: tx('', blk('data_variable', { VARIABLE: p })) })) })])]) }),
          obj('Estrella', { tam: 50, x: 0, y: 150, bloques: estado([
            programa(30, 30, [blk('event_whenflagclicked'), blk('looks_hide'),
              blk('control_repeat_until', null, { CONDITION: cond(tiempo()), SUBSTACK: sub([blk('control_create_clone_of', { CLONE_OPTION: '_myself_' }), blk('control_wait', null, { DURATION: n(0.7) })]) })]),
            programa(30, 280, [blk('control_start_as_clone'),
              blk('motion_gotoxy', null, { X: n(0, blk('operator_random', null, { FROM: n(-220), TO: n(220) })), Y: n(170) }), blk('looks_show'),
              blk('control_repeat_until', null, { CONDITION: cond(blk('operator_or', null, { OPERAND1: cond(toca()),
                OPERAND2: cond(blk('operator_lt', null, { OPERAND1: tx('', blk('motion_yposition')), OPERAND2: tx(-170) })) })),
                SUBSTACK: sub([blk('motion_changeyby', null, { DY: n(-5) })]) }),
              blk('control_if', null, { CONDITION: cond(toca()), SUBSTACK: sub([blk('data_changevariableby', { VARIABLE: p }, { VALUE: n(1) }), blk('sound_play', { SOUND: 'Moneda' })]) }),
              blk('control_delete_this_clone')])]) })],
          [{ id: 'var-puntos', nombre: L('puntos', 'points'), valor: 0, monitor: true }]);
      }
    }
  ];
};
