/**
 * Plataforma de tareas · IES Palomares · David Rayo Torres
 * Servidor en Google Apps Script. Guarda tareas y entregas en esta hoja de cálculo
 * y los archivos que suben los alumnos en una carpeta de tu Google Drive.
 *
 * Instalación (detallada en LEEME.md):
 *   1. Crea una hoja de cálculo de Google → Extensiones → Apps Script.
 *   2. Pega este archivo (Codigo.js) como «Code.gs» y correccion.js como «Correccion.gs».
 *   3. Cambia CLAVE_INICIAL aquí abajo y ejecuta la función «instalar» una vez.
 *   4. Implementar → Nueva implementación → Aplicación web
 *      (Ejecutar como: yo · Quién tiene acceso: cualquier usuario).
 *   5. Copia la URL que termina en /exec en tareas/config.js de la web.
 */

// ⚠️ Cambia esta contraseña antes de ejecutar «instalar». Es la que usarás en el panel del profesor.
var CLAVE_INICIAL = 'cambia-esta-clave';

// Dominios de correo admitidos para los alumnos.
var DOMINIOS_ALUMNOS = ['g.educaand.es'];

// Tamaño máximo de cada archivo subido (MB).
var MAX_MB = 10;

var HOJA_TAREAS = 'Tareas';
var HOJA_ENTREGAS = 'Entregas';
var COL_TAREAS = ['id', 'grupo', 'titulo', 'descripcion', 'fechaLimite', 'visible', 'preguntas', 'creada', 'actualizada'];
var COL_ENTREGAS = ['id', 'tareaId', 'tituloTarea', 'grupo', 'apellidos', 'nombre', 'correo', 'fecha',
  'respuestas', 'detalle', 'puntos', 'maximo', 'notaAuto', 'notaFinal', 'estado', 'comentario', 'revisada'];

/* ------------------------------------------------------------------ */
/* Instalación                                                         */
/* ------------------------------------------------------------------ */

function instalar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  prepararHoja_(ss, HOJA_TAREAS, COL_TAREAS);
  prepararHoja_(ss, HOJA_ENTREGAS, COL_ENTREGAS);
  var props = PropertiesService.getScriptProperties();
  if (CLAVE_INICIAL === 'cambia-esta-clave') {
    throw new Error('Antes de instalar, cambia CLAVE_INICIAL por una contraseña tuya.');
  }
  props.setProperty('CLAVE_PROFESOR', CLAVE_INICIAL);
  if (!props.getProperty('CARPETA_ID')) {
    var carpeta = DriveApp.createFolder('Entregas de alumnos · ' + ss.getName());
    props.setProperty('CARPETA_ID', carpeta.getId());
  }
  Logger.log('Instalado. Ahora: Implementar → Nueva implementación → Aplicación web.');
}

function prepararHoja_(ss, nombre, columnas) {
  var h = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  h.getRange(1, 1, 1, columnas.length).setValues([columnas]).setFontWeight('bold');
  h.setFrozenRows(1);
  return h;
}

/* ------------------------------------------------------------------ */
/* Entrada de peticiones                                               */
/* ------------------------------------------------------------------ */

function doGet() {
  return json_({ ok: true, servicio: 'Tareas IES Palomares' });
}

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents || '{}');
    var acciones = {
      // Alumno
      grupos: accGrupos_, tareas: accTareas_, entregar: accEntregar_, misEntregas: accMisEntregas_,
      // Profesor (necesitan clave)
      login: accLogin_, todasTareas: accTodasTareas_, guardarTarea: accGuardarTarea_,
      borrarTarea: accBorrarTarea_, entregas: accEntregas_, revisar: accRevisar_
    };
    var f = acciones[req.accion];
    if (!f) throw new Error('Acción desconocida');
    return json_({ ok: true, datos: f(req) });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */
/* Acceso a las hojas                                                  */
/* ------------------------------------------------------------------ */

function hoja_(nombre) {
  var h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!h) throw new Error('Falta la hoja «' + nombre + '». Ejecuta «instalar».');
  return h;
}

function leer_(nombre, columnas) {
  var h = hoja_(nombre);
  var n = h.getLastRow() - 1;
  if (n < 1) return [];
  var filas = h.getRange(2, 1, n, columnas.length).getValues();
  return filas.map(function (f, i) {
    var o = { _fila: i + 2 };
    columnas.forEach(function (c, j) { o[c] = f[j]; });
    return o;
  });
}

function escribir_(nombre, columnas, obj, fila) {
  var h = hoja_(nombre);
  var valores = [columnas.map(function (c) { return obj[c] === undefined ? '' : obj[c]; })];
  if (fila) h.getRange(fila, 1, 1, columnas.length).setValues(valores);
  else h.appendRow(valores[0]);
}

function tareaDeFila_(t) {
  return {
    id: String(t.id), grupo: String(t.grupo), titulo: String(t.titulo), descripcion: String(t.descripcion),
    fechaLimite: t.fechaLimite ? fechaISO_(t.fechaLimite) : '', visible: t.visible === true || t.visible === 'TRUE',
    preguntas: parse_(t.preguntas, [])
  };
}

function fechaISO_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm");
  return String(v);
}

function parse_(s, defecto) {
  try { return s ? JSON.parse(s) : defecto; } catch (e) { return defecto; }
}

function nuevoId_() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 10);
}

function comprobarClave_(req) {
  var clave = PropertiesService.getScriptProperties().getProperty('CLAVE_PROFESOR');
  if (!clave || req.clave !== clave) throw new Error('Contraseña de profesor incorrecta');
}

function plazoCerrado_(t) {
  if (!t.fechaLimite) return false;
  var lim = new Date(t.fechaLimite);
  return !isNaN(lim) && new Date() > lim;
}

/* ------------------------------------------------------------------ */
/* Alumno                                                              */
/* ------------------------------------------------------------------ */

function accGrupos_() {
  var g = {};
  leer_(HOJA_TAREAS, COL_TAREAS).map(tareaDeFila_).forEach(function (t) { if (t.visible && t.grupo) g[t.grupo] = 1; });
  return { grupos: Object.keys(g).sort(), dominios: DOMINIOS_ALUMNOS, maxMb: MAX_MB };
}

function accTareas_(req) {
  var correo = String(req.correo || '').trim().toLowerCase();
  var hechas = {};
  if (correo) {
    leer_(HOJA_ENTREGAS, COL_ENTREGAS).forEach(function (e) {
      if (String(e.correo).toLowerCase() === correo) hechas[e.tareaId] = String(e.estado);
    });
  }
  return leer_(HOJA_TAREAS, COL_TAREAS).map(tareaDeFila_)
    .filter(function (t) { return t.visible && t.grupo === req.grupo; })
    .map(function (t) {
      return {
        id: t.id, grupo: t.grupo, titulo: t.titulo, descripcion: t.descripcion, fechaLimite: t.fechaLimite,
        cerrada: plazoCerrado_(t), preguntas: preguntasParaAlumno(t.preguntas), estado: hechas[t.id] || ''
      };
    });
}

function validarAlumno_(req) {
  var nombre = String(req.nombre || '').trim(), apellidos = String(req.apellidos || '').trim();
  var correo = String(req.correo || '').trim().toLowerCase();
  if (nombre.length < 2 || apellidos.length < 2) throw new Error('Escribe tu nombre y tus apellidos');
  if (!correoValido(correo, DOMINIOS_ALUMNOS)) throw new Error('Usa tu correo de Educaand (@' + DOMINIOS_ALUMNOS.join(', @') + ')');
  return { nombre: nombre, apellidos: apellidos, correo: correo };
}

function accEntregar_(req) {
  var alumno = validarAlumno_(req);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var t = leer_(HOJA_TAREAS, COL_TAREAS).map(tareaDeFila_).filter(function (x) { return x.id === req.tareaId && x.visible; })[0];
    if (!t) throw new Error('La tarea no existe o ya no está publicada');
    if (plazoCerrado_(t)) throw new Error('El plazo de entrega ha terminado');

    var previas = leer_(HOJA_ENTREGAS, COL_ENTREGAS).filter(function (e) {
      return e.tareaId === t.id && String(e.correo).toLowerCase() === alumno.correo;
    });
    var previa = previas[previas.length - 1];
    if (previa && previa.estado === 'revisada') throw new Error('Tu profesor ya ha corregido esta tarea; no se puede volver a entregar');

    // Respuestas: solo las de preguntas que existen. Los archivos se guardan en Drive.
    var resp = {}, entrada = req.respuestas || {};
    t.preguntas.forEach(function (p) {
      if (p.tipo === 'archivo') {
        var a = entrada[p.id];
        if (a && a.base64) resp[p.id] = guardarArchivo_(a, alumno, t, p);
        else {
          // Conserva el archivo de una entrega anterior (solo si es el mismo que ya estaba guardado)
          var ant = previa ? parse_(previa.respuestas, {})[p.id] : null;
          resp[p.id] = (a && ant && a.url === ant.url) ? ant : null;
        }
      } else if (p.tipo === 'test') {
        resp[p.id] = (entrada[p.id] === '' || entrada[p.id] === undefined || entrada[p.id] === null) ? '' : Number(entrada[p.id]);
      } else {
        resp[p.id] = String(entrada[p.id] || '').slice(0, 20000);
      }
    });

    var c = corregirEntrega(t.preguntas, resp);
    var ent = {
      id: previa ? previa.id : nuevoId_(), tareaId: t.id, tituloTarea: t.titulo, grupo: t.grupo,
      apellidos: alumno.apellidos, nombre: alumno.nombre, correo: alumno.correo, fecha: new Date(),
      respuestas: JSON.stringify(resp), detalle: JSON.stringify(c.detalle), puntos: c.puntos, maximo: c.maximo,
      notaAuto: c.nota10, notaFinal: c.completa ? c.nota10 : '', estado: c.completa ? 'corregida' : 'pendiente',
      comentario: '', revisada: ''
    };
    escribir_(HOJA_ENTREGAS, COL_ENTREGAS, ent, previa ? previa._fila : null);
    return resumenAlumno_(ent, t);
  } finally {
    lock.releaseLock();
  }
}

function guardarArchivo_(a, alumno, t, p) {
  var bytes = Utilities.base64Decode(a.base64);
  if (bytes.length > MAX_MB * 1024 * 1024) throw new Error('El archivo supera ' + MAX_MB + ' MB');
  var carpeta = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('CARPETA_ID'));
  var sub = carpeta.getFoldersByName(t.titulo);
  var dest = sub.hasNext() ? sub.next() : carpeta.createFolder(t.titulo);
  var limpio = String(a.nombre || 'archivo').replace(/[\\/:*?"<>|]/g, '_');
  var nombre = alumno.apellidos + ', ' + alumno.nombre + ' · ' + p.id + ' · ' + limpio;
  var f = dest.createFile(Utilities.newBlob(bytes, a.tipo || 'application/octet-stream', nombre));
  return { nombre: limpio, url: f.getUrl(), tam: bytes.length };
}

/** Lo que ve el alumno de una entrega: nota y comentarios, nunca las soluciones. */
function resumenAlumno_(e, t) {
  var detalle = typeof e.detalle === 'string' ? parse_(e.detalle, []) : e.detalle;
  var revisada = e.estado === 'revisada';
  return {
    id: e.id, tareaId: e.tareaId, titulo: e.tituloTarea, grupo: e.grupo,
    fecha: e.fecha instanceof Date ? fechaISO_(e.fecha) : String(e.fecha),
    estado: String(e.estado),
    nota: e.notaFinal === '' ? null : Number(e.notaFinal),
    notaProvisional: Number(e.notaAuto),
    comentario: String(e.comentario || ''),
    detalle: detalle.map(function (d) {
      return { id: d.id, tipo: d.tipo, puntos: d.puntos, maximo: d.maximo, nota: d.nota, revisar: !revisada && d.revisar, comentario: d.comentario || '' };
    })
  };
}

function accMisEntregas_(req) {
  var alumno = validarAlumno_(req);
  var tareas = {};
  leer_(HOJA_TAREAS, COL_TAREAS).forEach(function (t) { tareas[t.id] = t; });
  return leer_(HOJA_ENTREGAS, COL_ENTREGAS)
    .filter(function (e) {
      // Se pide nombre, apellidos y correo para que nadie consulte notas ajenas con solo un correo.
      return String(e.correo).toLowerCase() === alumno.correo &&
        normalizarTexto(e.apellidos) === normalizarTexto(alumno.apellidos) &&
        normalizarTexto(e.nombre) === normalizarTexto(alumno.nombre);
    })
    .map(function (e) { return resumenAlumno_(e, tareas[e.tareaId]); })
    .reverse();
}

/* ------------------------------------------------------------------ */
/* Profesor                                                            */
/* ------------------------------------------------------------------ */

function accLogin_(req) {
  comprobarClave_(req);
  return { ok: true };
}

function accTodasTareas_(req) {
  comprobarClave_(req);
  var cuenta = {};
  leer_(HOJA_ENTREGAS, COL_ENTREGAS).forEach(function (e) {
    var c = cuenta[e.tareaId] || (cuenta[e.tareaId] = { total: 0, pendientes: 0 });
    c.total++;
    if (e.estado === 'pendiente') c.pendientes++;
  });
  return leer_(HOJA_TAREAS, COL_TAREAS).map(tareaDeFila_).map(function (t) {
    t.entregas = cuenta[t.id] || { total: 0, pendientes: 0 };
    return t;
  }).reverse();
}

function accGuardarTarea_(req) {
  comprobarClave_(req);
  var t = req.tarea || {};
  if (!String(t.titulo || '').trim()) throw new Error('La tarea necesita un título');
  if (!String(t.grupo || '').trim()) throw new Error('Indica el grupo (por ejemplo, 1º ESO A)');
  if (!t.preguntas || !t.preguntas.length) throw new Error('Añade al menos una pregunta');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var filas = leer_(HOJA_TAREAS, COL_TAREAS);
    var previa = t.id ? filas.filter(function (x) { return String(x.id) === t.id; })[0] : null;
    var obj = {
      id: previa ? previa.id : nuevoId_(), grupo: String(t.grupo).trim(), titulo: String(t.titulo).trim(),
      descripcion: String(t.descripcion || ''), fechaLimite: t.fechaLimite || '', visible: !!t.visible,
      preguntas: JSON.stringify(t.preguntas), creada: previa ? previa.creada : new Date(), actualizada: new Date()
    };
    escribir_(HOJA_TAREAS, COL_TAREAS, obj, previa ? previa._fila : null);
    return { id: obj.id };
  } finally {
    lock.releaseLock();
  }
}

function accBorrarTarea_(req) {
  comprobarClave_(req);
  var f = leer_(HOJA_TAREAS, COL_TAREAS).filter(function (x) { return String(x.id) === req.id; })[0];
  if (!f) throw new Error('No existe esa tarea');
  var tiene = leer_(HOJA_ENTREGAS, COL_ENTREGAS).some(function (e) { return e.tareaId === req.id; });
  if (tiene) throw new Error('Esta tarea ya tiene entregas. Despublícala en lugar de borrarla.');
  hoja_(HOJA_TAREAS).deleteRow(f._fila);
  return { ok: true };
}

function accEntregas_(req) {
  comprobarClave_(req);
  return leer_(HOJA_ENTREGAS, COL_ENTREGAS)
    .filter(function (e) { return !req.tareaId || e.tareaId === req.tareaId; })
    .map(function (e) {
      return {
        id: e.id, tareaId: e.tareaId, titulo: e.tituloTarea, grupo: e.grupo, apellidos: e.apellidos, nombre: e.nombre,
        correo: e.correo, fecha: e.fecha instanceof Date ? fechaISO_(e.fecha) : String(e.fecha),
        respuestas: parse_(e.respuestas, {}), detalle: parse_(e.detalle, []), puntos: Number(e.puntos), maximo: Number(e.maximo),
        notaAuto: Number(e.notaAuto), notaFinal: e.notaFinal === '' ? null : Number(e.notaFinal),
        estado: String(e.estado), comentario: String(e.comentario || '')
      };
    });
}

/**
 * Revisión del profesor: puntos por pregunta (opcional), comentarios por pregunta
 * y comentario general. La nota final se recalcula sobre 10.
 */
function accRevisar_(req) {
  comprobarClave_(req);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var e = leer_(HOJA_ENTREGAS, COL_ENTREGAS).filter(function (x) { return x.id === req.id; })[0];
    if (!e) throw new Error('No existe esa entrega');
    var detalle = parse_(e.detalle, []);
    var cambios = req.preguntas || {};
    var puntos = 0, maximo = 0;
    detalle.forEach(function (d) {
      var c = cambios[d.id];
      if (c) {
        if (c.puntos !== undefined && c.puntos !== '') d.puntos = Math.max(0, Math.min(Number(d.maximo), Number(c.puntos)));
        d.comentario = String(c.comentario || '');
      }
      if (d.revisar) d.nota = 'Corregida por el profesor';
      d.revisar = false;
      puntos += Number(d.puntos);
      maximo += Number(d.maximo);
    });
    var nota = req.notaFinal !== undefined && req.notaFinal !== null && req.notaFinal !== ''
      ? Math.max(0, Math.min(10, Number(req.notaFinal)))
      : (maximo ? redondear2(10 * puntos / maximo) : 0);
    e.detalle = JSON.stringify(detalle);
    e.puntos = redondear2(puntos);
    e.notaFinal = redondear2(nota);
    e.estado = 'revisada';
    e.comentario = String(req.comentario || '');
    e.revisada = new Date();
    escribir_(HOJA_ENTREGAS, COL_ENTREGAS, e, e._fila);
    return { notaFinal: e.notaFinal };
  } finally {
    lock.releaseLock();
  }
}
