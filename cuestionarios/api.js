/*
 * Conexión de los cuestionarios con el servidor de Tareas (Google Apps Script).
 * - Usa la misma URL que tareas/config.js: una sola instalación sirve para Tareas y Cuestionarios.
 * - Sin URL: «modo de prueba». El servidor se ejecuta dentro del navegador y los datos
 *   se guardan solo en este navegador (contraseña del modo de prueba en tareas/LEEME.md).
 * Antes de este archivo hay que cargar tareas/config.js.
 */
(function () {
  var cfg = window.TAREAS_CONFIG || {};
  var url = String(cfg.url || '').trim();
  var modoPrueba = !url;
  var base = ((document.currentScript && document.currentScript.src) || '').replace(/[^\/]*$/, '');
  var tareas = base + '../tareas/';
  var listo = null;

  function cargarScript(src) {
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = function () { mal(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }

  function prepararPrueba() {
    if (listo) return listo;
    listo = cargarScript(tareas + 'gas-simulado.js')
      .then(function () { return cargarScript(tareas + 'correccion.js'); })
      .then(function () { return cargarScript(tareas + 'apps-script/Codigo.js'); })
      .then(function () {
        var p = PropertiesService.getScriptProperties();
        if (!p.getProperty('CLAVE_PROFESOR')) p.setProperty('CLAVE_PROFESOR', 'prueba');
      });
    return listo;
  }

  function llamar(accion, datos) {
    var cuerpo = Object.assign({ accion: accion }, datos || {});
    if (modoPrueba) {
      return prepararPrueba().then(function () {
        var r = JSON.parse(doPost({ postData: { contents: JSON.stringify(cuerpo) } }).contenido);
        if (!r.ok) throw new Error(r.error);
        return r.datos;
      });
    }
    return fetch(url, {
      method: 'POST',
      // text/plain evita la comprobación previa (CORS) que Apps Script no admite
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(cuerpo),
      redirect: 'follow'
    }).then(function (res) {
      if (!res.ok) throw new Error('El servidor ha respondido con un error (' + res.status + ')');
      return res.json();
    }, function () {
      throw new Error('No hay conexión con el servidor. Comprueba la conexión a internet.');
    }).then(function (r) {
      if (!r.ok) throw new Error(r.error);
      return r.datos;
    });
  }

  window.CuestAPI = { modoPrueba: modoPrueba, llamar: llamar };
})();
