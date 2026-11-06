// Formación en microcontroladores: casillas guardadas en el navegador, progreso y botones de copiar.
(function () {
  var CLAVE = 'fmc-progreso-v1';
  var estado = {};
  try { estado = JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { estado = {}; }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} }

  // Casillas
  document.querySelectorAll('li.tarea input[data-id]').forEach(function (c) {
    var id = c.getAttribute('data-id');
    c.checked = !!estado[id];
    c.parentNode.classList.toggle('hecha', c.checked);
    c.addEventListener('change', function () {
      if (c.checked) estado[id] = 1; else delete estado[id];
      c.parentNode.classList.toggle('hecha', c.checked);
      guardar();
    });
  });

  // Progreso en la portada
  function contar(pagina) {
    return Object.keys(estado).filter(function (k) { return k.indexOf(pagina + ':') === 0; }).length;
  }
  var tarjetas = document.querySelectorAll('.fase[data-pagina]');
  if (tarjetas.length) {
    var hechas = 0, total = 0;
    tarjetas.forEach(function (t) {
      var n = contar(t.getAttribute('data-pagina'));
      var tot = parseInt(t.getAttribute('data-total'), 10) || 1;
      n = Math.min(n, tot);
      hechas += n; total += tot;
      var pct = Math.round(n / tot * 100);
      t.querySelector('.barra i').style.width = pct + '%';
      t.querySelector('.fase-pct').textContent = pct + ' % · ' + n + ' de ' + tot;
    });
    var pctTotal = total ? Math.round(hechas / total * 100) : 0;
    var barra = document.getElementById('barra-total');
    if (barra) barra.style.width = pctTotal + '%';
    var txt = document.getElementById('pct-total');
    if (txt) txt.textContent = pctTotal + ' %';
    var borrar = document.getElementById('borrar-progreso');
    if (borrar) {
      var armado = false;
      borrar.addEventListener('click', function () {
        if (!armado) {
          armado = true;
          borrar.textContent = '¿Seguro? Pulsa otra vez para borrarlo todo';
          setTimeout(function () { armado = false; borrar.textContent = 'Borrar mi progreso'; }, 4000);
          return;
        }
        estado = {}; guardar(); location.reload();
      });
    }
  }

  // Botón «Copiar» en los bloques de código
  document.querySelectorAll('.doc pre').forEach(function (pre) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'copiar'; b.textContent = 'Copiar';
    b.addEventListener('click', function () {
      var texto = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      var ok = function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(ok, function () { b.textContent = 'Selecciona y copia'; });
      } else { b.textContent = 'Selecciona y copia'; }
    });
    pre.appendChild(b);
  });

  // Al imprimir, abre todas las pistas
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details').forEach(function (d) { d.setAttribute('open', ''); });
  });
})();
