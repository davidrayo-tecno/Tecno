/*
 * Motor común de examen de TODOS los cuestionarios · IES Palomares
 * Cada cuestionario solo aporta su preguntas.js; aquí están las directrices que todos cumplen
 * (ver cuestionarios/LEEME.md):
 *  - Inicio: explicación del cuestionario y de las normas; nombre, apellidos y grupo obligatorios.
 *  - Orden aleatorio de preguntas y de opciones para cada alumno.
 *  - Tipos: test, verdadero o falso, respuesta cerrada, abierta, reflexión y pensamiento crítico.
 *  - Tiempo propio por pregunta, «Dejar para después» y cuenta atrás siempre visible (total y pregunta).
 *  - Pantalla completa obligatoria; las salidas tapan las preguntas, se registran y a la 3.ª se entrega solo.
 *  - Sin pegar texto, sin menú contextual ni atajos de copiar o buscar.
 *  - Termina con «Entregar» o al acabarse el tiempo total.
 *  - Envía las respuestas al panel del profesor, borra los datos del ordenador y vuelve al inicio vacío.
 * Necesita antes: preguntas.js (window.CUESTIONARIO), ../../tareas/config.js y ../api.js.
 */
document.body.insertAdjacentHTML('afterbegin', "<header class=\"bar\"><div class=\"container\">\n  <a href=\"../../\" aria-label=\"Volver al inicio\"><img src=\"../../logo-ies-palomares.png\" alt=\"\"><b>Tecnología · IES Palomares</b></a>\n</div></header>\n\n<!-- Temporizadores: visibles durante todo el cuestionario -->\n<div class=\"clock\" id=\"clock\" hidden>\n  <div class=\"container\">\n    <div class=\"t\" id=\"tTotal\"><small>Tiempo total</small><b id=\"total\">--:--</b></div>\n    <div class=\"t q\" id=\"tPreg\"><small>Esta pregunta</small><b id=\"preg\">--:--</b></div>\n    <div class=\"who\" id=\"who\"></div>\n  </div>\n  <div class=\"qbar\" id=\"qbar\"><i id=\"qbarI\"></i></div>\n</div>\n\n<main class=\"container\">\n  <a class=\"back\" href=\"../\">← Cuestionarios</a>\n\n  <!-- 1. Inicio -->\n  <section id=\"intro\">\n    <h1 id=\"tit\"></h1>\n    <div class=\"card\">\n      <h2>¿En qué consiste?</h2>\n      <p style=\"margin:0\" id=\"desc\"></p>\n      <ul class=\"types\">\n        <li>Test</li><li>Verdadero o falso</li><li>Respuesta cerrada</li><li>Respuesta abierta</li><li>Reflexión</li><li>Pensamiento crítico</li>\n      </ul>\n      <div class=\"facts\">\n        <div><b id=\"fN\"></b><small>preguntas</small></div>\n        <div><b id=\"fT\"></b><small>tiempo total</small></div>\n        <div><b id=\"fR\"></b><small>tiempo por pregunta</small></div>\n      </div>\n      <h2 style=\"margin-top:20px\">Normas</h2>\n      <ul class=\"rules\">\n        <li>Las preguntas salen en un <b>orden distinto para cada alumno</b>, y también las opciones de cada pregunta.</li>\n        <li>Cada pregunta tiene <b>su propio tiempo</b>. Arriba verás siempre dos relojes: el <b>tiempo total</b> que te queda y el de <b>la pregunta</b> que tienes abierta.</li>\n        <li>Puedes pulsar <b>«Dejar para después»</b> y volver más tarde desde el mapa de preguntas. El tiempo de esa pregunta se para y se guarda el que le quede.</li>\n        <li>Si se acaba el tiempo de una pregunta, se <b>bloquea</b> con lo que hayas respondido hasta ese momento.</li>\n        <li>En las preguntas de respuesta abierta, reflexión y pensamiento crítico explica tus ideas con frases completas. <span id=\"fCorr\">Las corrige el profesor.</span></li>\n        <li>El cuestionario termina cuando pulses <b>«Entregar»</b> o cuando se acabe el <b>tiempo total</b>. Al acabar el tiempo se entrega solo.</li>\n        <li>Al iniciar, la página se pone en <b>pantalla completa</b> y debe seguir así hasta que entregues. No puedes cambiar de ventana, de pestaña ni de programa.</li>\n        <li>Si sales de la pantalla completa o cambias de ventana, <b>se tapan las preguntas</b>, la salida queda anotada en tu hoja de entrega y el reloj <b>sigue corriendo</b>. <b id=\"fMax\"></b></li>\n        <li>No recargues ni cierres la página: también cuenta como salida.</li>\n      </ul>\n    </div>\n    <form class=\"card\" id=\"fStart\" autocomplete=\"off\">\n      <h2>Tus datos</h2>\n      <div class=\"two\">\n        <div><label for=\"nom\">Nombre</label><input type=\"text\" id=\"nom\" maxlength=\"40\" required></div>\n        <div><label for=\"ape\">Apellidos</label><input type=\"text\" id=\"ape\" maxlength=\"60\" required></div>\n      </div>\n      <label for=\"gru\">Grupo</label>\n      <select id=\"gru\" required><option value=\"\">Elige tu grupo…</option></select>\n      <p class=\"muted\" style=\"font-size:14px;margin:10px 0 16px\">Escribe tu nombre y tus dos apellidos y elige tu grupo para poder empezar.</p>\n      <p class=\"note\" id=\"prueba\" hidden>Modo de prueba: las respuestas se guardan solo en este navegador hasta que el profesor conecte la plataforma con su hoja de Google.</p>\n      <button class=\"btn go big\" id=\"bStart\" type=\"submit\" disabled>▶ Iniciar el cuestionario</button>\n    </form>\n  </section>\n\n  <!-- 2. Cuestionario -->\n  <section id=\"quiz\" hidden>\n    <div class=\"card\">\n      <div class=\"map\" id=\"map\" aria-label=\"Mapa de preguntas\"></div>\n      <div class=\"legend\"><span class=\"d\">Respondida</span><span class=\"l\">Para después</span><span class=\"x\">Tiempo agotado</span></div>\n      <div class=\"tags\"><span class=\"tag\" id=\"qNum\"></span><span class=\"tag k\" id=\"qKind\"></span><span class=\"tag\" id=\"qPrac\"></span></div>\n      <div class=\"q\" id=\"qText\"></div>\n      <div id=\"qExtra\"></div>\n      <div id=\"qAns\"></div>\n      <div id=\"qNote\"></div>\n      <div class=\"nav\">\n        <button class=\"btn alt\" id=\"bPrev\" type=\"button\">← Anterior</button>\n        <button class=\"btn warn\" id=\"bLater\" type=\"button\">⏭ Dejar para después</button>\n        <button class=\"btn alt\" id=\"bNext\" type=\"button\">Siguiente →</button>\n        <span class=\"sp\"></span>\n        <button class=\"btn go\" id=\"bSend\" type=\"button\">📤 Entregar</button>\n      </div>\n    </div>\n  </section>\n\n  <!-- 3. Hoja de entrega -->\n  <section id=\"end\" hidden>\n    <div class=\"card\">\n      <h2 id=\"eTitle\">✅ Cuestionario entregado</h2>\n      <div class=\"sheet-head\" id=\"eHead\"></div>\n      <p class=\"muted\" style=\"margin:14px 0 0;font-size:15px\" id=\"eScoreL\">Preguntas de corrección automática (test, verdadero o falso y respuesta cerrada):</p>\n      <div class=\"score\" id=\"eScore\"></div>\n      <p class=\"muted\" style=\"margin:0;font-size:15px\" id=\"eScoreN\">Las preguntas de respuesta abierta, reflexión y pensamiento crítico las corrige el profesor.</p>\n      <div class=\"note\" id=\"eSend\"></div>\n      <div class=\"nav noprint\">\n        <button class=\"btn warn\" id=\"bRetry\" type=\"button\" hidden>↻ Reintentar el envío</button>\n        <button class=\"btn\" id=\"bPrint\" type=\"button\">🖨️ Imprimir o guardar en PDF</button>\n        <button class=\"btn alt\" id=\"bNew\" type=\"button\">Salir (nuevo alumno)</button>\n      </div>\n    </div>\n    <div class=\"card\" id=\"eList\"></div>\n  </section>\n</main>\n\n<div class=\"modal\" id=\"modal\" hidden role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"mTitle\">\n  <div class=\"card\">\n    <h2 id=\"mTitle\">¿Entregar el cuestionario?</h2>\n    <p id=\"mText\" style=\"margin:0\"></p>\n    <div class=\"nav\">\n      <button class=\"btn alt\" id=\"mNo\" type=\"button\">Seguir respondiendo</button>\n      <button class=\"btn go\" id=\"mYes\" type=\"button\">📤 Sí, entregar</button>\n    </div>\n  </div>\n</div>\n<div class=\"lock\" id=\"lock\" hidden role=\"alertdialog\" aria-modal=\"true\" aria-labelledby=\"lTitle\">\n  <div class=\"card\">\n    <div class=\"big-ico\" aria-hidden=\"true\">🚫</div>\n    <h2 id=\"lTitle\">Has salido del cuestionario</h2>\n    <p id=\"lText\" style=\"margin:0\">Has salido de la pantalla completa o has cambiado de ventana. Esta salida ha quedado anotada en tu hoja de entrega.</p>\n    <div class=\"cnt\" id=\"lCnt\"></div>\n    <p class=\"muted\" style=\"font-size:15px;margin:0 0 14px\">El reloj sigue corriendo. Vuelve ya al cuestionario.</p>\n    <button class=\"btn go big\" id=\"bBack\" type=\"button\">⛶ Volver al cuestionario</button>\n  </div>\n</div>\n<div class=\"toast\" id=\"toast\" hidden></div>\n");
(function(){
  'use strict';
  var CLAVE='cuestionario-'+window.CUESTIONARIO.id+'-v3';
  /* Número de salidas de la pantalla completa con las que el cuestionario se entrega solo (0 = nunca). */
  var MAX_SALIDAS=3;

  var C=window.CUESTIONARIO, Q=C.preguntas, KIND=C.KIND, AUTO=C.AUTO;
  /* Corrección común (../correccion.js): si todas las preguntas se corrigen solas, la nota es la de todo el cuestionario */
  var CORR=window.Correccion, TODO_AUTO=!!(CORR&&CORR.todoAutomatico(C));
  function nota10(){ // → { pts, max, nota } con la nota sobre 10 redondeada a centésimas
    var pts=0,max=0;
    Q.forEach(function(q){ if(!TODO_AUTO&&!AUTO[q.k]) return; max+=q.pt; pts+=CORR?CORR.puntos(C,q,st.ans[q.id]).pts:(C.correcta(q,st.ans[q.id])?q.pt:0); });
    return {pts:Math.round(pts*100)/100,max:max,nota:max?Math.round(1000*pts/max)/100:0};
  }
  function coma2(n){ return n.toFixed(2).replace('.',','); }
  var TOTAL=Q.reduce(function(s,q){return s+q.s;},0);

  /* ---------- Utilidades ---------- */
  var $=function(id){return document.getElementById(id);};
  if(TODO_AUTO) $('fCorr').textContent='Se corrigen automáticamente según las ideas clave que expliques.';
  document.title=C.titulo+' · IES Palomares'; $('tit').textContent=C.titulo; $('desc').innerHTML=C.descripcion;
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function shuffle(a){ a=a.slice(); for(var j=a.length-1;j>0;j--){ var r=Math.floor(Math.random()*(j+1)); var t=a[j]; a[j]=a[r]; a[r]=t; } return a; }
  function mmss(ms){ var s=Math.max(0,Math.ceil(ms/1000)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
  function dur(s){ var m=Math.floor(s/60), r=s%60; return m?m+' min'+(r?' '+r+' s':''):r+' s'; }
  function hora(ts){ return new Date(ts).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}); }
  function words(s){ return (String(s).trim().match(/\S+/g)||[]).length; }
  function guardar(){ try{ st.saved=Date.now(); localStorage.setItem(CLAVE,JSON.stringify(st)); }catch(e){} }
  function leer(){ try{ return JSON.parse(localStorage.getItem(CLAVE)||'null'); }catch(e){ return null; } }
  function borrar(){ try{ localStorage.removeItem(CLAVE); }catch(e){} }
  var toastT;
  function toast(msg){ var t=$('toast'); t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(function(){t.hidden=true;},3500); }

  /* ---------- Estado ---------- */
  var st=null, timer=null, last=0;
  function byId(id){ for(var i=0;i<Q.length;i++) if(Q[i].id===id) return Q[i]; }
  function answered(id){ var v=st.ans[id]; return v!==undefined && v!==null && String(v).trim()!==''; }
  function curQ(){ return byId(st.order[st.cur]); }

  /* ---------- Inicio ---------- */
  $('fN').textContent=Q.length;
  $('fMax').textContent=MAX_SALIDAS?'Si sales '+MAX_SALIDAS+' veces, el cuestionario se entrega automáticamente.':'';
  $('fT').textContent=dur(TOTAL);
  var ss=Q.map(function(q){return q.s;});
  $('fR').textContent=dur(Math.min.apply(null,ss))+' – '+dur(Math.max.apply(null,ss));
  C.grupos.forEach(function(g){ var o=document.createElement('option'); o.value=g; o.textContent=g; $('gru').appendChild(o); });
  $('prueba').hidden=!window.CuestAPI.modoPrueba;
  function okNombre(){ $('bStart').disabled=!($('nom').value.trim().length>=2 && $('ape').value.trim().length>=3 && $('gru').value); }
  $('nom').addEventListener('input',okNombre); $('ape').addEventListener('input',okNombre); $('gru').addEventListener('change',okNombre);
  $('fStart').addEventListener('submit',function(ev){
    ev.preventDefault(); if($('bStart').disabled) return;
    pedirFS();
    var now=Date.now(), opt={}, rem={};
    Q.forEach(function(q){
      rem[q.id]=q.s*1000;
      if(q.k==='test') opt[q.id]=shuffle(q.o.map(function(_,i){return i;}));
    });
    st={nom:$('nom').value.trim(),ape:$('ape').value.trim(),grupo:$('gru').value,intentoId:(Date.now().toString(36)+Math.random().toString(36).slice(2,10)).replace(/[^a-z0-9]/g,'').slice(0,20),order:shuffle(Q.map(function(q){return q.id;})),opt:opt,
        ans:{},later:{},locked:{},rem:rem,cur:0,start:now,deadline:now+TOTAL*1000,blur:0,ended:false};
    guardar(); empezar();
  });

  function empezar(){
    $('intro').hidden=true; $('end').hidden=true; $('quiz').hidden=false; $('clock').hidden=false;
    document.body.classList.add('examen');
    $('who').textContent=st.nom+' '+st.ape+' · '+st.grupo;
    pintarMapa(); mostrar();
    last=Date.now(); clearInterval(timer); timer=setInterval(tick,250); tick();
    window.scrollTo(0,0);
  }

  /* ---------- Reloj ---------- */
  function tick(){
    if(!st||st.ended) return;
    var now=Date.now(), dt=now-last; last=now;
    var q=curQ();
    if(!st.locked[q.id]) st.rem[q.id]=Math.max(0,st.rem[q.id]-dt);
    var g=st.deadline-now;
    $('total').textContent=mmss(g);
    $('tTotal').classList.toggle('low',g<=60000);
    var r=st.rem[q.id];
    $('preg').textContent=st.locked[q.id]?'0:00':mmss(r);
    $('tPreg').classList.toggle('low',r<=10000);
    $('qbar').classList.toggle('low',r<=10000);
    $('qbarI').style.width=(r/(q.s*1000)*100)+'%';
    if(g<=0){ entregar('tiempo'); return; }
    if(!st.locked[q.id] && r<=0){
      st.locked[q.id]=true; delete st.later[q.id];
      toast('⏱ Se acabó el tiempo de esta pregunta. Tu respuesta se ha guardado.');
      var n=siguiente(st.cur,false);
      if(n<0){ entregar('tiempo'); return; }
      st.cur=n; pintarMapa(); mostrar();
    }
    if(now-(st.saved||0)>2000) guardar();
  }

  /* Siguiente pregunta que aún se puede responder. Con «pendiente», prefiere las no respondidas. */
  function siguiente(from,pendiente){
    var n=st.order.length, i, id;
    if(pendiente) for(i=1;i<=n;i++){ id=st.order[(from+i)%n]; if(!st.locked[id] && !answered(id) && !st.later[id]) return (from+i)%n; }
    if(pendiente) for(i=1;i<=n;i++){ id=st.order[(from+i)%n]; if(!st.locked[id] && !answered(id)) return (from+i)%n; }
    for(i=1;i<=n;i++){ id=st.order[(from+i)%n]; if(!st.locked[id]) return (from+i)%n; }
    return st.locked[st.order[from]]?-1:from;
  }
  function anterior(from){
    var n=st.order.length;
    for(var i=1;i<n;i++){ var j=(from-i+n)%n; if(!st.locked[st.order[j]]) return j; }
    return from;
  }

  /* ---------- Mapa y pregunta ---------- */
  function pintarMapa(){
    var m=$('map'); m.innerHTML='';
    st.order.forEach(function(id,i){
      var b=document.createElement('button'); b.type='button'; b.textContent=i+1;
      var est=st.locked[id]?'Tiempo agotado':st.later[id]?'Para después':answered(id)?'Respondida':'Sin responder';
      b.className=(st.locked[id]?'locked':st.later[id]?'later':answered(id)?'done':'')+(i===st.cur?' cur':'');
      b.setAttribute('aria-label','Pregunta '+(i+1)+': '+est);
      b.addEventListener('click',function(){ ir(i); });
      m.appendChild(b);
    });
  }
  function ir(i){ tick(); guardar(); st.cur=i; pintarMapa(); mostrar(); tick(); }

  function mostrar(){
    var q=curQ(), lock=!!st.locked[q.id], v=st.ans[q.id];
    $('qNum').textContent='Pregunta '+(st.cur+1)+' de '+st.order.length;
    $('qKind').textContent=KIND[q.k]; $('qKind').className='tag k k-'+q.k;
    $('qPrac').textContent=q.p+' · '+dur(q.s);
    $('qText').innerHTML=q.q;
    $('qExtra').innerHTML=q.e||'';
    var box=$('qAns'); box.innerHTML='';
    if(q.k==='test'||q.k==='vf'){
      var ul=document.createElement('ul'); ul.className='opts'+(q.k==='vf'?' vf':'');
      var items=q.k==='vf'?[[true,'Verdadero'],[false,'Falso']]:st.opt[q.id].map(function(i){return [i,q.o[i]];});
      items.forEach(function(it,n){
        var li=document.createElement('li'), b=document.createElement('button');
        b.type='button'; b.disabled=lock;
        b.innerHTML='<span class="l">'+(q.k==='vf'?(it[0]?'V':'F'):'ABCD'[n])+'</span><span>'+it[1]+'</span>';
        if(v===it[0]) b.classList.add('sel');
        b.addEventListener('click',function(){
          st.ans[q.id]=it[0]; delete st.later[q.id];
          ul.querySelectorAll('button').forEach(function(x){x.classList.remove('sel');}); b.classList.add('sel');
          guardar(); pintarMapa();
        });
        li.appendChild(b); ul.appendChild(li);
      });
      box.appendChild(ul);
    } else {
      var linea=q.k==='codigo', larga=q.k!=='cerrada'&&!linea, f=document.createElement(larga?'textarea':'input');
      if(!larga){ f.type='text'; f.maxLength=linea?80:40; f.style.maxWidth=linea?'560px':'260px'; f.placeholder=q.ph||''; }
      if(linea){ f.style.fontFamily='ui-monospace,SFMono-Regular,Menlo,Consolas,monospace'; f.setAttribute('autocapitalize','off'); f.setAttribute('autocorrect','off'); }
      else f.placeholder='Escribe aquí tu respuesta con frases completas…';
      f.value=v||''; f.disabled=lock; f.setAttribute('aria-label','Tu respuesta');
      f.setAttribute('autocomplete','off'); f.spellcheck=larga;
      var wc=document.createElement('div'); wc.className='wc';
      var upd=function(){ if(larga) wc.textContent=words(f.value)+' palabras'; };
      f.addEventListener('input',function(){
        st.ans[q.id]=f.value; if(f.value.trim()) delete st.later[q.id];
        upd(); pintarMapa(); if(Date.now()-(st.saved||0)>1500) guardar();
      });
      f.addEventListener('paste',function(ev){ ev.preventDefault(); toast('En este cuestionario no se puede pegar texto.'); });
      upd(); box.appendChild(f); if(larga) box.appendChild(wc);
      if(!lock) setTimeout(function(){ try{ f.focus({preventScroll:true}); }catch(e){} },0);
    }
    $('qNote').innerHTML=lock?'<div class="note x">⏱ Se acabó el tiempo de esta pregunta. Tu respuesta se guardó tal como estaba.</div>':
      st.later[q.id]?'<div class="note">⏭ Marcaste esta pregunta para después. Cuando la respondas, desaparecerá la marca.</div>':'';
    $('bLater').disabled=lock;
  }

  $('bNext').addEventListener('click',function(){ ir(siguiente(st.cur,false)); });
  $('bPrev').addEventListener('click',function(){ ir(anterior(st.cur)); });
  $('bLater').addEventListener('click',function(){
    var q=curQ(); if(st.locked[q.id]) return;
    st.later[q.id]=true;
    var n=siguiente(st.cur,true);
    if(n===st.cur) toast('No quedan otras preguntas: responde esta o entrega.');
    ir(n);
  });

  /* ---------- Entregar ---------- */
  $('bSend').addEventListener('click',function(){
    var sin=st.order.filter(function(id){return !answered(id);}).length;
    var tarde=Object.keys(st.later).length;
    $('mText').innerHTML=(sin?'Te quedan <b>'+sin+'</b> pregunta'+(sin>1?'s':'')+' sin responder'+(tarde?' (<b>'+tarde+'</b> marcada'+(tarde>1?'s':'')+' para después)':'')+'. ':'Has respondido todas las preguntas. ')+
      'Cuando entregues ya no podrás cambiar nada.';
    $('modal').hidden=false; $('mNo').focus();
  });
  $('mNo').addEventListener('click',function(){ $('modal').hidden=true; });
  $('mYes').addEventListener('click',function(){ $('modal').hidden=true; entregar('boton'); });

  var correcta=C.correcta;

  function entregar(motivo){
    if(st.ended) return;
    clearInterval(timer);
    st.ended=true; st.end=Math.min(Date.now(),st.deadline); st.motivo=motivo;
    if(st.fuera) cerrarSalida();
    guardar(); document.body.classList.remove('examen'); $('lock').hidden=true; salirFS(); hoja(); enviar();
  }

  /* ---------- Envío al profesor ---------- */
  var enviando=false;
  function estadoEnvio(){
    var e=$('eSend'); if(!e||!st) return;
    $('eList').hidden=enviando; // las respuestas solo se muestran si el envío falla (para guardarlas en PDF)
    if(!enviando && !st.enviado) $('eTitle').textContent='⚠️ Tus respuestas aún no se han enviado';
    if(st.enviado){ e.className='note ok'; e.innerHTML='✅ Tus respuestas han llegado al profesor.'; $('bRetry').hidden=true; }
    else if(enviando){ e.className='note'; e.innerHTML='⏳ Enviando tus respuestas al profesor…'; $('bRetry').hidden=true; }
    else { e.className='note x'; e.innerHTML='⚠️ No se han podido enviar tus respuestas'+(st.errEnvio?' ('+esc(st.errEnvio)+')':'')+'. Pulsa «Reintentar el envío». Si sigue fallando, avisa al profesor y guarda la hoja en PDF.'; $('bRetry').hidden=false; }
  }
  function enviar(){
    if(!st||!st.ended||st.enviado||enviando) return;
    enviando=true; estadoEnvio();
    var aut=0,bien=0,resp={};
    Q.forEach(function(q){ if(AUTO[q.k]){ aut++; if(correcta(q,st.ans[q.id])) bien++; } if(answered(q.id)) resp[q.id]=st.ans[q.id]; });
    window.CuestAPI.llamar('entregarCuestionario',{
      cuestionario:C.id, intentoId:st.intentoId, grupo:st.grupo, nombre:st.nom, apellidos:st.ape,
      inicio:new Date(st.start).toISOString(), entrega:new Date(st.end).toISOString(), duracion:Math.round((st.end-st.start)/1000),
      motivo:st.motivo, respondidas:st.order.filter(answered).length, aciertos:bien, autoTotal:aut, notaAuto:nota10().nota,
      salidas:st.salidas||[], respuestas:resp, bloqueadas:Object.keys(st.locked).map(Number)
    }).then(function(){ st.enviado=true; st.errEnvio=''; },function(err){ st.errEnvio=err.message; })
      .then(function(){ enviando=false; if(st.enviado){ limpiar(); return; } guardar(); estadoEnvio(); });
  }

  /* Tras un envío correcto no queda ningún dato del alumno y el cuestionario vuelve a estar listo para el siguiente */
  function limpiar(){
    borrar();
    try{ sessionStorage.clear(); }catch(e){}
    st=null;
    ['eList','eHead','eScore','qText','qExtra','qAns','map','who'].forEach(function(id){ $(id).innerHTML=''; });
    $('nom').value=''; $('ape').value=''; $('gru').value=''; okNombre();
    ['quiz','end'].forEach(function(id){ $(id).hidden=true; }); $('clock').hidden=true; $('modal').hidden=true;
    $('intro').hidden=false;
    // Sustituye la entrada del historial: «Atrás» no devuelve al cuestionario del alumno anterior
    try{ history.replaceState(null,'',location.pathname); }catch(e){}
    window.scrollTo(0,0);
  }

  function hoja(){
    $('intro').hidden=true; $('quiz').hidden=true; $('clock').hidden=true; $('modal').hidden=true; $('end').hidden=false;
    $('eTitle').textContent=!st.enviado&&!st.errEnvio?'⏳ Enviando tus respuestas…':st.motivo==='tiempo'?'⏱ Se acabó el tiempo: cuestionario entregado':st.motivo==='salidas'?'🚫 Entregado automáticamente por salir '+MAX_SALIDAS+' veces de la pantalla completa':'✅ Cuestionario entregado';
    var usado=Math.round((st.end-st.start)/1000);
    $('eHead').innerHTML=[
      ['Alumno/a',esc(st.nom+' '+st.ape)],
      ['Grupo',esc(st.grupo||'')],
      ['Fecha',new Date(st.start).toLocaleDateString('es-ES')],
      ['Inicio y entrega',hora(st.start)+' – '+hora(st.end)+' ('+dur(usado)+')'],
      ['Forma de entrega',st.motivo==='tiempo'?'Fin del tiempo':st.motivo==='salidas'?'Automática por salidas':'Botón «Entregar»'],
      ['Respondidas',st.order.filter(answered).length+' de '+st.order.length],
      ['Salidas de la pantalla completa',String((st.salidas||[]).length)]
    ].map(function(x){return '<div><small>'+x[0]+'</small><b>'+x[1]+'</b></div>';}).join('')+
    ((st.salidas||[]).length?'<div style="grid-column:1/-1"><small>Registro de salidas</small><b style="font-weight:500;font-size:15px">'+
      st.salidas.map(function(x){return hora(x.t)+' · '+x.m+(x.d!=null?' ('+dur(x.d)+' fuera)':'');}).join('<br>')+'</b></div>':'');
    var aut=0, bien=0;
    var html='<h2>Respuestas</h2>';
    st.order.forEach(function(id,i){
      var q=byId(id), v=st.ans[id], r=AUTO[q.k]?correcta(q,v):null, txt, rub=!AUTO[q.k]&&CORR?CORR.rubrica(q,v):null;
      if(AUTO[q.k]){ aut++; if(r) bien++; }
      if(!answered(id)) txt='<i class="muted">Sin responder</i>';
      else if(q.k==='test') txt=q.o[v];
      else if(q.k==='vf') txt=v?'Verdadero':'Falso';
      else txt=esc(v);
      var stt=AUTO[q.k]?(r?'<div class="st ok">✅ Correcta</div>':'<div class="st ko">❌ Incorrecta</div>'):
        rub?'<div class="st '+(rub.pts>=q.pt?'ok':rub.pts>0?'prof':'ko')+'">🤖 Corregida automáticamente · '+coma2(rub.pts)+' de '+q.pt+' pt</div>':'<div class="st prof">📝 La corrige el profesor</div>';
      html+='<div class="ans"><div class="tags"><span class="tag">'+(i+1)+'</span><span class="tag k k-'+q.k+'">'+KIND[q.k]+'</span><span class="tag">'+q.p+'</span>'+
        (st.locked[id]?'<span class="tag">⏱ Tiempo agotado</span>':'')+'</div><div class="q" style="font-size:17px">'+q.q+'</div>'+(q.e||'')+
        '<div class="r">'+txt+'</div>'+stt+'</div>';
    });
    $('eList').innerHTML=html;
    var n=nota10();
    if(TODO_AUTO){
      $('eScoreL').textContent='Nota del cuestionario (todas las preguntas valen lo mismo):';
      $('eScore').textContent=coma2(n.pts)+' / '+n.max+' puntos  ·  '+coma2(n.nota);
      $('eScoreN').textContent='Todas las preguntas se han corregido automáticamente. El profesor puede revisar las de respuesta abierta, reflexión y pensamiento crítico.';
    } else $('eScore').textContent=bien+' / '+aut+'  ·  '+coma2(n.nota);
    estadoEnvio();
    window.scrollTo(0,0);
  }

  $('bRetry').addEventListener('click',enviar);
  $('bPrint').addEventListener('click',function(){ window.print(); });
  var avisoSalir=0;
  $('bNew').addEventListener('click',function(){
    if(st && !st.enviado && Date.now()-avisoSalir>4000){ avisoSalir=Date.now(); toast('Tus respuestas aún no se han enviado. Pulsa otra vez «Salir» para salir igualmente.'); return; }
    borrar(); $('gru').value=''; st=null; $('nom').value=''; $('ape').value=''; okNombre();
    $('end').hidden=true; $('intro').hidden=false; window.scrollTo(0,0);
  });

  /* ---------- Pantalla completa y salidas ---------- */
  var DE=document.documentElement;
  var FS_OK=!!(DE.requestFullscreen||DE.webkitRequestFullscreen);
  function enFS(){ return !!(document.fullscreenElement||document.webkitFullscreenElement); }
  function pedirFS(){
    var f=DE.requestFullscreen||DE.webkitRequestFullscreen;
    if(!f) return Promise.resolve();
    try{ var r=f.call(DE,{navigationUI:'hide'}); return (r&&r.then)?r.catch(function(){}):Promise.resolve(); }catch(e){ return Promise.resolve(); }
  }
  function salirFS(){ if(!enFS()) return; var f=document.exitFullscreen||document.webkitExitFullscreen; try{ var r=f.call(document); if(r&&r.catch) r.catch(function(){}); }catch(e){} }
  function enCurso(){ return st && !st.ended && !$('quiz').hidden; }

  function salida(motivo){
    if(!st||st.ended||st.fuera) return;
    st.salidas=st.salidas||[];
    st.salidas.push({t:Date.now(),m:motivo});
    st.fuera=Date.now(); guardar();
    if(MAX_SALIDAS && st.salidas.length>=MAX_SALIDAS){ entregar('salidas'); return; }
    mostrarBloqueo();
  }
  function mostrarBloqueo(){
    var n=(st.salidas||[]).length;
    $('lCnt').textContent=MAX_SALIDAS?'Salida '+n+' de '+MAX_SALIDAS+(MAX_SALIDAS-n===1?' · ¡A la próxima se entrega solo!':''):'Salidas: '+n;
    $('lock').hidden=false; $('bBack').focus();
  }
  function cerrarSalida(){ var s=st.salidas[st.salidas.length-1]; if(s && s.d==null) s.d=Math.round((Date.now()-st.fuera)/1000); st.fuera=0; }
  $('bBack').addEventListener('click',function(){
    pedirFS().then(function(){
      if(FS_OK && !enFS()){ $('lText').textContent='No se ha podido activar la pantalla completa. Pulsa otra vez el botón.'; return; }
      if(st && st.fuera){ cerrarSalida(); guardar(); }
      $('lock').hidden=true;
    });
  });
  function alSalirFS(){ if(enCurso() && FS_OK && !enFS()) salida('Salió de la pantalla completa'); }
  document.addEventListener('fullscreenchange',alSalirFS);
  document.addEventListener('webkitfullscreenchange',alSalirFS);
  document.addEventListener('visibilitychange',function(){ if(document.hidden && enCurso()) salida('Cambió de pestaña o de programa'); });
  window.addEventListener('blur',function(){ setTimeout(function(){ if(enCurso() && !document.hasFocus()) salida('Cambió a otra ventana'); },300); });
  window.addEventListener('pagehide',function(){ if(enCurso()) salida('Recargó o cerró la página'); });
  /* Durante el cuestionario: sin menú contextual, sin copiar y sin buscar en la página */
  ['contextmenu','copy','cut'].forEach(function(t){ document.addEventListener(t,function(ev){ if(enCurso()) ev.preventDefault(); }); });
  document.addEventListener('keydown',function(ev){
    if(!enCurso()) return;
    var k=(ev.key||'').toLowerCase();
    if((ev.ctrlKey||ev.metaKey) && 'fpsugc'.indexOf(k)>=0 && !(k==='c' && /^(input|textarea)$/i.test(ev.target.tagName))){ ev.preventDefault(); }
    if(k==='f12'||k==='f3'){ ev.preventDefault(); }
  });

  /* ---------- Reanudar si se recarga la página ---------- */
  var prev=leer();
  if(prev && prev.order && prev.order.length===Q.length){
    st=prev;
    if(st.ended){ hoja(); enviar(); }
    else {
      var cq=st.order[st.cur];
      if(!st.locked[cq]) st.rem[cq]=Math.max(0,st.rem[cq]-(Date.now()-(st.saved||Date.now())));
      if(Date.now()>=st.deadline){ entregar('tiempo'); }
      else { empezar(); if(st.fuera) mostrarBloqueo(); else salida('Recargó o cerró la página'); }
    }
  }
})();
