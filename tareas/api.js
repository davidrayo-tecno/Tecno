/*
 * Conexión con el servidor de tareas.
 * - Con URL en config.js: habla con la aplicación web de Google Apps Script.
 * - Sin URL: «modo de prueba», ejecuta el mismo servidor dentro del navegador.
 */
(function () {
  var cfg = window.TAREAS_CONFIG || {};
  var url = String(cfg.url || '').trim();
  var modoPrueba = !url;
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
    var base = (document.currentScript && document.currentScript.src) || '';
    listo = cargarScript('gas-simulado.js')
      .then(function () { return cargarScript('correccion.js'); })
      .then(function () { return cargarScript('apps-script/Codigo.js'); })
      .then(function () {
        window.CLAVE_INICIAL = 'prueba';
        if (!SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tareas')) {
          instalar();
          sembrarEjemplo();
        }
      });
    return listo;
  }

  function sembrarEjemplo() {
    accGuardarTarea_({
      clave: 'prueba',
      tarea: {
        grupo: '1º ESO A', titulo: 'Ejemplo · El ordenador y sus partes', visible: true,
        descripcion: 'Tarea de ejemplo del modo de prueba. Responde a las preguntas y entrega tu esquema.',
        fechaLimite: '',
        preguntas: [
          { id: 'p1', tipo: 'test', enunciado: '¿Qué componente ejecuta las instrucciones de un programa?', puntos: 2,
            opciones: ['La memoria RAM', 'El procesador (CPU)', 'El disco duro', 'La pantalla'], correcta: 1 },
          { id: 'p2', tipo: 'test', enunciado: 'Un teclado es un dispositivo de…', puntos: 2,
            opciones: ['Entrada', 'Salida', 'Almacenamiento'], correcta: 0 },
          { id: 'p3', tipo: 'abierta', enunciado: 'Explica con tus palabras qué es un algoritmo y pon un ejemplo de la vida diaria.', puntos: 3,
            palabrasClave: ['pasos', 'orden', 'problema'], minPalabras: 20 },
          { id: 'p4', tipo: 'archivo', enunciado: 'Sube una foto o un PDF con el esquema de las partes del ordenador.', puntos: 3,
            formatos: 'image/*,.pdf' }
        ]
      }
    });
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
      throw new Error('No hay conexión con el servidor de tareas. Comprueba tu conexión a internet.');
    }).then(function (r) {
      if (!r.ok) throw new Error(r.error);
      return r.datos;
    });
  }

  /** Lee un archivo como base64 (sin el prefijo data:). */
  function leerArchivo(file) {
    return new Promise(function (ok, mal) {
      var fr = new FileReader();
      fr.onload = function () { ok({ nombre: file.name, tipo: file.type, base64: String(fr.result).split(',')[1] || '' }); };
      fr.onerror = function () { mal(new Error('No se pudo leer el archivo')); };
      fr.readAsDataURL(file);
    });
  }

  window.TareasAPI = {
    modoPrueba: modoPrueba,
    llamar: llamar,
    leerArchivo: leerArchivo,
    reiniciarPrueba: function () {
      return prepararPrueba().then(function () { GAS_SIMULADO.borrarTodo(); instalar(); sembrarEjemplo(); });
    }
  };
})();
