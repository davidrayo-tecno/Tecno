/*
 * Simulador mínimo de Google Apps Script para el «modo de prueba».
 * Permite ejecutar el mismo servidor (apps-script/Codigo.js) dentro del navegador,
 * guardando los datos en este navegador en lugar de en la hoja de Google.
 * También se usa en las pruebas automáticas (Node).
 */
(function (global) {
  var CLAVE_LS = 'tareas-modo-prueba';
  var hayLS = false;
  try { hayLS = typeof localStorage !== 'undefined' && !!localStorage; } catch (e) {}

  var estado = { hojas: {}, props: {} };
  function cargar() {
    if (!hayLS) return;
    try { var s = JSON.parse(localStorage.getItem(CLAVE_LS) || 'null'); if (s) estado = s; } catch (e) {}
  }
  function guardar() {
    if (!hayLS) return;
    try { localStorage.setItem(CLAVE_LS, JSON.stringify(estado)); } catch (e) {}
  }
  cargar();

  function Hoja(nombre) { this.nombre = nombre; }
  Hoja.prototype.filas = function () { return estado.hojas[this.nombre] || (estado.hojas[this.nombre] = []); };
  Hoja.prototype.getLastRow = function () { return this.filas().length; };
  Hoja.prototype.setFrozenRows = function () { return this; };
  Hoja.prototype.appendRow = function (v) { this.filas().push(v.slice()); guardar(); return this; };
  Hoja.prototype.deleteRow = function (r) { this.filas().splice(r - 1, 1); guardar(); return this; };
  Hoja.prototype.getRange = function (r, c, nr, nc) {
    var hoja = this; nr = nr || 1; nc = nc || 1;
    return {
      getValues: function () {
        var out = [];
        for (var i = 0; i < nr; i++) {
          var f = hoja.filas()[r - 1 + i] || [];
          var fila = [];
          for (var j = 0; j < nc; j++) fila.push(f[c - 1 + j] === undefined ? '' : f[c - 1 + j]);
          out.push(fila);
        }
        return out;
      },
      setValues: function (v) {
        for (var i = 0; i < v.length; i++) {
          var f = hoja.filas()[r - 1 + i] || (hoja.filas()[r - 1 + i] = []);
          for (var j = 0; j < v[i].length; j++) {
            var x = v[i][j];
            f[c - 1 + j] = x instanceof Date ? x.toISOString() : x;
          }
        }
        guardar();
        return this;
      },
      setFontWeight: function () { return this; }
    };
  };

  var libro = {
    getName: function () { return 'Modo de prueba'; },
    getSheetByName: function (n) { return estado.hojas[n] ? new Hoja(n) : null; },
    insertSheet: function (n) { estado.hojas[n] = []; guardar(); return new Hoja(n); }
  };

  var archivos = {};

  global.SpreadsheetApp = { getActiveSpreadsheet: function () { return libro; } };
  global.PropertiesService = {
    getScriptProperties: function () {
      return {
        getProperty: function (k) { return estado.props[k] === undefined ? null : estado.props[k]; },
        setProperty: function (k, v) { estado.props[k] = String(v); guardar(); }
      };
    }
  };
  global.LockService = { getScriptLock: function () { return { waitLock: function () {}, releaseLock: function () {} }; } };
  global.Session = { getScriptTimeZone: function () { return 'Europe/Madrid'; } };
  global.Logger = { log: function () {} };
  global.ContentService = {
    MimeType: { JSON: 'json' },
    createTextOutput: function (t) { return { contenido: t, setMimeType: function () { return this; } }; }
  };
  global.Utilities = {
    getUuid: function () {
      return 'xxxxxxxxxxxxxxxx'.replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); });
    },
    base64Decode: function (b64) {
      var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
      var a = new Array(bin.length);
      for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
      return a;
    },
    newBlob: function (bytes, tipo, nombre) { return { bytes: bytes, tipo: tipo, nombre: nombre }; },
    formatDate: function (d) {
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
  };
  function Carpeta(nombre) { this.nombre = nombre; this.hijas = {}; }
  Carpeta.prototype.getId = function () { return 'carpeta-prueba'; };
  Carpeta.prototype.getFoldersByName = function (n) {
    var c = this.hijas[n], dada = false;
    return { hasNext: function () { return !!c && !dada; }, next: function () { dada = true; return c; } };
  };
  Carpeta.prototype.createFolder = function (n) { return (this.hijas[n] = new Carpeta(n)); };
  Carpeta.prototype.createFile = function (blob) {
    var url = '#archivo-de-prueba';
    try {
      if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
        url = URL.createObjectURL(new Blob([new Uint8Array(blob.bytes)], { type: blob.tipo }));
      }
    } catch (e) {}
    archivos[url] = blob;
    return { getUrl: function () { return url; } };
  };
  var raiz = new Carpeta('raiz');
  global.DriveApp = {
    createFolder: function (n) { return raiz.createFolder(n); },
    getFolderById: function () { return raiz; }
  };

  global.GAS_SIMULADO = {
    borrarTodo: function () { estado = { hojas: {}, props: {} }; guardar(); },
    estado: function () { return estado; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
