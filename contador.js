/*
 * Contador de visitas del pie de página.
 * Usa Abacus (https://abacus.jasoncameron.dev), un contador gratuito sin registro.
 * Se cuenta una visita por sesión del navegador (no cada página que se abre).
 * El contador de Abacus empezó en 0; se le suma INICIO para que la web empiece en 2720.
 */
(function () {
  var INICIO = 2719;                       // 1ª visita contada = 2720
  var BASE = 'https://abacus.jasoncameron.dev';
  var CLAVE = 'davidrayo-tecno.github.io/tecno-visitas';
  var MARCA = 'tecno-visita-contada';

  var caja = document.getElementById('visitas');
  var num = document.getElementById('contador-visitas');
  if (!caja || !num || !window.fetch) return;

  // Solo se suman visitas en la web publicada (no al probarla en local).
  var publicada = /\.github\.io$/.test(location.hostname);
  var contada = false;
  try { contada = sessionStorage.getItem(MARCA) === '1'; } catch (e) {}
  var accion = publicada && !contada ? 'hit' : 'get';

  fetch(BASE + '/' + accion + '/' + CLAVE)
    .then(function (r) { return r.ok ? r.json() : (r.status === 404 ? { value: 0 } : Promise.reject()); })
    .then(function (d) {
      if (typeof d.value !== 'number' || d.value < 0) return;
      if (accion === 'hit') { try { sessionStorage.setItem(MARCA, '1'); } catch (e) {} }
      num.textContent = Math.max(d.value + INICIO, INICIO + 1).toLocaleString('es-ES');
      caja.hidden = false;
    })
    .catch(function () { /* si el servicio no responde, el contador no se muestra */ });
})();
