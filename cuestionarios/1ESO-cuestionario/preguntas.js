/*
 * Cuestionario de 1.º ESO · Prácticas del robot (Computación y Robótica)
 * Banco de preguntas compartido por la página del alumno y el panel del profesor.
 *
 * Para cambiar los grupos, edita GRUPOS.
 * Cada pregunta: k = tipo (test | vf | cerrada | abierta | reflexion | critico), s = segundos,
 * test → o (opciones) y a (índice correcto) · vf → a (true/false) · cerrada → ok (respuestas válidas).
 * Puntos: 1 en las de corrección automática y 2 en las que corrige el profesor (se puede cambiar con «pt»).
 */
(function () {
  'use strict';
  var GRUPOS = ['1º ESO A', '1º ESO B', '1º ESO C', '1º ESO D'];

  /* ---------- Bloques del robot ---------- */
  var B={
    fwd:['⬆ Avanzar','move'], izq:['↺ Girar izquierda','turn'], der:['↻ Girar derecha','turn'],
    pin:['🖌️ Pintar casilla','pen'], coger:['✋ Coger paquete','act'], dejar:['📦 Dejar paquete','act'],
    regar:['💧 Regar','act'], recoger:['🧺 Recoger manzana','act'], barrer:['🧹 Barrer','act']
  };
  var COL={loop:'var(--loop)',until:'var(--until)',if:'var(--if)'};
  function blk(x){
    if(typeof x==='string'){ var d=B[x]; return '<span class="blk '+d[1]+'">'+d[0]+'</span>'; }
    var h='<span class="blk '+x.t+'">'+x.b+'</span>';
    if(x.c) h+='<div class="nest" style="--c:'+COL[x.t]+'">'+x.c.map(blk).join('')+'</div>';
    if(x.e) h+='<span class="blk '+x.t+'">si no</span><div class="nest" style="--c:'+COL[x.t]+'">'+x.e.map(blk).join('')+'</div>';
    return h;
  }
  function prog(list){ return '<div class="prog">'+list.map(blk).join('')+'</div>'; }
  var rep=function(n,c){return {b:'🔁 Repetir '+n+' veces',t:'loop',c:c};};
  var hasta=function(c){return {b:'🔁 Repetir hasta llegar a la meta 🏁',t:'until',c:c};};
  var mientras=function(c){return {b:'🔁 Mientras haya camino delante',t:'until',c:c};};
  var si=function(cond,c,e){return {b:'📡 Si '+cond,t:'if',c:c,e:e};};

  /* ---------- Preguntas ---------- (ver la cabecera del archivo)
     k: test | vf | cerrada | abierta | reflexion | critico
     s: segundos para responderla
     test → o (opciones), a (índice correcto) · vf → a (true/false) · cerrada → ok (respuestas válidas) */
  var KIND={test:'Test',vf:'Verdadero o falso',cerrada:'Respuesta cerrada',abierta:'Respuesta abierta',reflexion:'Reflexión',critico:'Pensamiento crítico'};
  var AUTO={test:1,vf:1,cerrada:1};
  var Q=[
    {id:1,p:'Práctica 1 · Primeros pasos',k:'test',s:60,q:'¿En qué orden ejecuta el ordenador las instrucciones de un programa?',
     o:['Una detrás de otra, de arriba abajo','Todas a la vez','De abajo arriba','En el orden que él prefiera'],a:0},
    {id:2,p:'Práctica 2 · La esquina',k:'test',s:60,q:'El robot mira hacia <b>abajo</b> de la pantalla (↓). Si ejecuta <span class="blk turn">↺ Girar izquierda</span>, ¿hacia dónde mirará?',
     o:['Hacia la derecha de la pantalla (→)','Hacia la izquierda de la pantalla (←)','Hacia arriba (↑)','Seguirá mirando hacia abajo (↓)'],a:0},
    {id:3,p:'Práctica 3 · El pasillo largo',k:'cerrada',s:60,q:'Quieres recorrer un pasillo de 6 casillas con solo 2 bloques: <span class="blk loop">🔁 Repetir … veces</span> y <span class="blk move">⬆ Avanzar</span>. ¿Qué número tienes que poner en el bloque Repetir?',
     ph:'Escribe un número',ok:['6','seis']},
    {id:4,p:'Práctica 4 · La escalera',k:'test',s:75,q:'Este programa sube una escalera. ¿Cómo lo escribirías con menos bloques?',
     e:prog(['fwd','izq','fwd','der','fwd','izq','fwd','der','fwd','izq','fwd','der']),
     o:[prog([rep(3,['fwd','izq','fwd','der'])]),prog([rep(12,['fwd'])]),prog([rep(3,['fwd']),rep(3,['izq'])]),'No se puede escribir más corto'],a:0},
    {id:5,p:'Práctica 5 · Cazaestrellas',k:'cerrada',s:90,q:'¿Cuántas veces avanza el robot en total con este programa?',
     e:prog([rep(4,[rep(3,['fwd']),'der'])]),ph:'Escribe un número',ok:['12','doce']},
    {id:6,p:'Práctica 6 · Atrapa al gusano 🐛',k:'reflexion',s:240,q:'En «Atrapa al gusano» tuviste que arreglar un programa escrito por otra persona. Cuenta cómo buscaste los errores. ¿Te resultó más fácil arreglar un programa ajeno o escribir uno desde cero? ¿Por qué?'},
    {id:7,p:'Práctica 7 · El robot aspirador',k:'abierta',s:180,q:'Explica con tus palabras qué hace este programa y por qué funciona aunque el laberinto sea muy largo y solo tenga 4 bloques.',
     e:prog([hasta([si('hay pared delante',['der']),'fwd'])])},
    {id:8,p:'Práctica 8 · Pasillos misteriosos 🎲',k:'test',s:60,q:'¿Cuál es la diferencia entre <span class="blk loop">🔁 Repetir 5 veces</span> y <span class="blk until">🔁 Mientras haya camino delante</span>?',
     o:['«Mientras» repite sin saber de antemano cuántas veces: lo hace mientras se cumpla la condición','No hay ninguna diferencia','«Mientras» repite siempre 5 veces','«Repetir» solo funciona con giros'],a:0},
    {id:9,p:'Práctica 9 · Pinta la fila 🖌️',k:'test',s:60,q:'El robot pinta la casilla en la que está. ¿Qué programa pinta 5 casillas seguidas?',
     o:[prog([rep(5,['pin','fwd'])]),prog([rep(5,['fwd']),'pin']),prog(['pin',rep(5,['fwd'])]),prog([rep(5,['pin'])])],a:0},
    {id:10,p:'Práctica 10 · La letra L',k:'vf',s:30,q:'Para pintar la letra L basta con un único bucle, sin ningún giro.',a:false},
    {id:11,p:'Práctica 11 · El marco',k:'cerrada',s:90,q:'Para pintar el marco, cada lado es <i>3 × (pintar + avanzar)</i> y el marco completo es <i>4 × (lado + girar)</i>. ¿Cuántas casillas pinta el robot en total?',
     ph:'Escribe un número',ok:['12','doce']},
    {id:12,p:'Práctica 12 · Una sí, una no',k:'test',s:60,q:'Quieres pintar una casilla sí y otra no a lo largo de una fila. ¿Qué patrón va dentro del bucle?',
     o:[prog(['pin','fwd','fwd']),prog(['pin','fwd']),prog(['pin','pin','fwd']),prog(['fwd','izq'])],a:0},
    {id:13,p:'Práctica 13 · Pinta hasta la pared 🎲',k:'critico',s:240,q:'Un compañero resuelve «Pinta hasta la pared» contando las casillas que ve en su pantalla y usa <span class="blk loop">🔁 Repetir 5 veces</span>. Dice que su programa está bien porque en su pantalla funciona. ¿Estás de acuerdo? Razona tu respuesta y explica qué pasaría en los 3 mapas de prueba y qué bloque le recomendarías.'},
    {id:14,p:'Práctica 14 · El repartidor 📦',k:'vf',s:30,q:'El ordenador guarda en su memoria si el robot lleva un paquete o no (es el «estado» del robot).',a:true},
    {id:15,p:'Práctica 15 · Reparto en cadena',k:'vf',s:30,q:'En «Reparto en cadena» el robot puede llevar dos paquetes a la vez.',a:false},
    {id:16,p:'Práctica 16 · El paquete del fondo 🎲',k:'cerrada',s:60,q:'¿Cuántos giros hacia el mismo lado necesita el robot para dar media vuelta?',ph:'Escribe un número',ok:['2','dos']},
    {id:17,p:'Práctica 17 · La escalera de la bandera 🎲',k:'test',s:60,q:'El número de escalones cambia en cada mapa. ¿Qué bloque usas para repetir el escalón?',
     o:['<span class="blk until">🔁 Repetir hasta llegar a la meta 🏁</span>','<span class="blk loop">🔁 Repetir 5 veces</span>','<span class="blk move">⬆ Avanzar</span> muchas veces','<span class="blk pen">🖌️ Pintar casilla</span>'],a:0},
    {id:18,p:'Práctica 18 · La espiral al revés 🎲',k:'abierta',s:180,q:'El programa del robot aspirador gira a la derecha cuando encuentra una pared. ¿Qué cambiarías para recorrer la espiral que gira hacia la izquierda? Explica por qué basta con ese cambio aunque la espiral cambie de tamaño.',
     e:prog([hasta([si('hay pared delante',['der']),'fwd'])])},
    {id:19,p:'Práctica 19 · El jardinero 🎲',k:'test',s:60,q:'Hay que regar solo las macetas con planta 🌱. ¿Qué programa va dentro del bucle?',
     o:[prog([si('debajo hay una planta 🌱',['regar']),'fwd']),prog(['regar','fwd']),prog([si('hay pared delante',['regar']),'fwd']),prog(['fwd','fwd'])],a:0},
    {id:20,p:'Práctica 20 · El barrendero 🎲',k:'vf',s:30,q:'En «El barrendero» se puede usar <span class="blk loop">🔁 Repetir 6 veces</span> porque la valla 🚧 siempre está en el mismo sitio.',a:false},
    {id:21,p:'Práctica 21 · La cosecha 🎲',k:'test',s:60,q:'Con este bloque, ¿qué hace el robot si la manzana está <b>verde 🍏</b>?',
     e:prog([si('debajo hay una manzana madura 🍎',['recoger'],['regar'])]),
     o:['La riega','La recoge','La recoge y la riega','Nada'],a:0},
    {id:22,p:'Práctica 22 · Reparto por la calle 🎲',k:'test',s:60,q:'¿Qué hace el robot en cada casilla con este programa?',
     e:prog([si('debajo hay un paquete 📦',['coger']),si('debajo hay una casa 🏠',['dejar']),'fwd']),
     o:['Hace dos preguntas seguidas: si hay paquete lo coge; si hay casa, lo deja','Solo pregunta si hay pared','Nada: solo avanza','Coge y deja el paquete en la misma casilla siempre'],a:0},
    {id:23,p:'Práctica 23 · Arregla el repartidor 🐞🎲',k:'test',s:75,q:'Este programa debería coger los paquetes y dejarlos en las casas, pero falla. ¿Dónde está el error?',
     e:prog([mientras([si('debajo hay un paquete 📦',['dejar']),si('debajo hay una casa 🏠',['dejar']),'fwd'])]),
     o:['En el primer «Si»: debería ser Coger paquete, no Dejar paquete','En el bloque Avanzar','En el segundo «Si»','No tiene ningún error'],a:0},
    {id:24,p:'Práctica 24 · Gran final 🏆',k:'critico',s:240,q:'Los robots aspiradores de verdad usan sensores parecidos a los de la práctica final. ¿Crees que un robot con sensores toma siempre buenas decisiones? Piensa en un caso en el que el sensor podría equivocarse, qué consecuencias tendría y cómo lo mejorarías.'},
    {id:25,p:'Reflexión final',k:'reflexion',s:240,q:'¿Qué práctica de las 24 te costó más y qué hiciste para superarla? ¿Qué has aprendido programando el robot que puedas usar fuera de la clase de Tecnología?'}
  ];

  Q.forEach(function (q) { if (q.pt === undefined) q.pt = AUTO[q.k] ? 1 : 2; });

  /** ¿Es correcta la respuesta v? (null si la corrige el profesor) */
  function correcta(q, v) {
    var norm = function (s) { return String(s).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.,;:!¡¿?]/g, '').replace(/\s+/g, ' '); };
    if (q.k === 'test' || q.k === 'vf') return v === q.a;
    if (q.k === 'cerrada') return q.ok.map(norm).indexOf(norm(v == null ? '' : v)) >= 0;
    return null;
  }

  window.CUESTIONARIO = {
    id: '1eso-robot', titulo: 'Cuestionario 1.º ESO · Prácticas del robot', grupos: GRUPOS,
    descripcion: 'Es un cuestionario sobre las <b>24 prácticas del robot</b> de Computación y Robótica: secuencias, giros, bucles, sensores, condiciones, estado y depuración de errores. Hay preguntas de varios tipos:',
    preguntas: Q, KIND: KIND, AUTO: AUTO, correcta: correcta
  };
})();
