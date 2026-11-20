/* Utilidades comunes de la plataforma de tareas */
(function () {
  var root = document.documentElement;
  try { var t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.querySelector('.theme');
    if (b) b.addEventListener('click', function () {
      var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = dark ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    });
    if (window.TareasAPI && TareasAPI.modoPrueba) {
      document.querySelectorAll('[data-modo-prueba]').forEach(function (el) { el.hidden = false; });
    }
  });

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fecha(s, conHora) {
    if (!s) return '';
    var d = new Date(s);
    if (isNaN(d)) return String(s);
    var o = { day: 'numeric', month: 'short', year: 'numeric' };
    if (conHora !== false) { o.hour = '2-digit'; o.minute = '2-digit'; }
    return d.toLocaleString('es-ES', o);
  }

  function num(x) {
    if (x === null || x === undefined || x === '' || isNaN(x)) return '—';
    return (Math.round(Number(x) * 100) / 100).toLocaleString('es-ES');
  }

  var ETIQUETAS = {
    '': ['nueva', 'Sin entregar'],
    pendiente: ['pendiente', 'Pendiente de corregir'],
    corregida: ['corregida', 'Corregida'],
    revisada: ['revisada', 'Corregida por el profesor']
  };
  function etiqueta(estado) {
    var e = ETIQUETAS[estado || ''] || ['nueva', estado];
    return '<span class="tag ' + e[0] + '">' + esc(e[1]) + '</span>';
  }

  function aviso(el, tipo, html) {
    el.innerHTML = html ? '<div class="aviso ' + tipo + '" role="' + (tipo === 'error' ? 'alert' : 'status') + '">' + html + '</div>' : '';
  }

  function ocupado(btn, si, texto) {
    if (si) { btn.dataset.txt = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin" aria-hidden="true"></span> ' + (texto || 'Un momento…'); }
    else { btn.disabled = false; if (btn.dataset.txt) btn.innerHTML = btn.dataset.txt; }
  }

  window.T = { esc: esc, fecha: fecha, num: num, etiqueta: etiqueta, aviso: aviso, ocupado: ocupado };
})();
