# Plataforma de tareas · IES Palomares

Plataforma para publicar tareas y que el alumnado las haga en la web.

- **Alumnado:** `tareas/`. Se identifica con su nombre, sus apellidos y su correo de Educaand (`@g.educaand.es`) y elige su grupo.
- **Profesor:** `tareas/profesor.html`. Entra con su contraseña.

Las tareas y las entregas se guardan en **una hoja de cálculo de Google tuya**. Los archivos que suben los alumnos van a **una carpeta de tu Google Drive**. No hace falta ningún servidor ni pagar nada.

## Qué hace

| | |
|---|---|
| **Tipos de pregunta** | Test (una respuesta correcta), respuesta abierta y subir archivo (foto, PDF, `.ino`, `.sb3`…). |
| **Corrección automática** | El test se corrige al momento. En la respuesta abierta puedes poner «ideas clave»: la plataforma da una nota provisional según cuántas aparecen. Los archivos los corriges tú. |
| **Revisión del profesor** | Para cada entrega ves las respuestas y el archivo. Ajustas los puntos de cada pregunta, escribes comentarios y guardas la nota final. |
| **El alumno ve** | La nota (provisional o definitiva), la valoración de cada pregunta y tus comentarios. Nunca ve las respuestas correctas: se corrige en el servidor. |
| **Reentregas** | El alumno puede volver a entregar (se sustituye la entrega anterior) hasta la fecha límite o hasta que la corrijas tú. |
| **Exportar** | Las entregas se descargan en CSV, que se abre en Excel. También están siempre en la hoja de Google. |

## Probarla ya (modo de prueba)

Mientras `config.js` no tenga una URL, la plataforma funciona en **modo de prueba**: todo se guarda solo en el navegador donde la abres. La contraseña del profesor es `prueba` y hay una tarea de ejemplo para el grupo «1º ESO A».

## Conectarla a tu hoja de Google (unos 10 minutos)

1. Entra en **script.google.com** con la cuenta que vayas a usar y pulsa **Nuevo proyecto**. No hace falta crear la hoja: «instalar» la crea sola en tu Drive con el nombre «Resultados Tecnología». Desde el móvil, abre la web en el navegador con el modo «Sitio de escritorio».
2. (Opcional) Si prefieres usar una hoja que ya tienes, ábrela y entra en **Extensiones → Apps Script** en lugar del paso 1.
3. En el editor que se abre:
   - Borra lo que haya en `Code.gs` y pega todo el contenido de [`apps-script/Codigo.js`](apps-script/Codigo.js).
   - Pulsa **+ → Secuencia de comandos**, llámalo `Correccion` y pega el contenido de [`correccion.js`](correccion.js).
4. En `Code.gs`, cambia la línea `var CLAVE_INICIAL = 'cambia-esta-clave';` por tu contraseña de profesor. Guarda con el icono del disquete.
5. Arriba, elige la función **`instalar`** y pulsa **Ejecutar**. Google te pedirá permisos para la hoja y para Drive: acéptalos. Si aparece «Google no ha verificado esta aplicación», pulsa **Configuración avanzada → Ir a… (no seguro)**. Es tu propio script.
   Esto crea la hoja (si no la tenías), sus pestañas `Tareas`, `Entregas` y `Cuestionarios`, y la carpeta «Entregas de alumnos» en tu Drive. En **Registro de ejecución** aparece el enlace a la hoja.
6. Pulsa **Implementar → Nueva implementación**, elige el tipo **Aplicación web** y rellena:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**

   Si con la cuenta del centro no aparece la opción «Cualquier usuario» (la puede bloquear el administrador), repite los pasos con una cuenta de Gmail personal: con «Solo usuarios de…» la web no puede conectarse.

   Pulsa **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).
7. Abre `tareas/config.js` y pega esa URL entre las comillas:
   ```js
   window.TAREAS_CONFIG = {
     url: 'https://script.google.com/macros/s/XXXXXXXX/exec'
   };
   ```
8. Sube el cambio a GitHub. A partir de ese momento la plataforma usa tu hoja.

### Si cambias el código de Apps Script más adelante

Hay que volver a publicarlo: **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva versión → Implementar**. La URL no cambia.

### Cambiar la contraseña

Edita `CLAVE_INICIAL` en `Code.gs` y vuelve a ejecutar `instalar`. Se conservan las tareas y las entregas.

## Cuestionarios

Los cuestionarios (`cuestionarios/`) usan **este mismo servidor**: con la misma hoja y la misma URL de `config.js` se guardan también sus entregas, en la pestaña **«Cuestionarios»**.

- **Alumnado:** al empezar escribe su nombre, sus apellidos y elige su grupo. Al entregar, las respuestas se envían solas. Si falla la conexión, puede reintentar el envío.
- **Profesor:** `cuestionarios/profesor.html`, con la **misma contraseña** que Tareas (mínimo 8 caracteres). No hay ningún enlace a esta página en la web: guárdala en tus marcadores. La sesión se cierra al cerrar la pestaña o tras 20 minutos sin actividad, y cada contraseña incorrecta tarda unos segundos en responder para dificultar que se adivine. Muestra el resumen de cada grupo, la tabla del alumnado, las preguntas más falladas y permite corregir las preguntas abiertas y exportar a Excel. Al borrar una entrega, el alumno puede repetir el cuestionario.
- Los grupos de cada cuestionario están al principio de su archivo `preguntas.js` (por ejemplo, `cuestionarios/1ESO-cuestionario/preguntas.js`).
- En **modo de prueba** (sin URL en `config.js`) todo se guarda solo en el navegador y la contraseña es `prueba`.

**Si ya tenías Tareas instalada antes de los cuestionarios:** sustituye el código de `Code.gs` por el nuevo [`apps-script/Codigo.js`](apps-script/Codigo.js) (conservando tu `CLAVE_INICIAL`) y vuelve a publicar: **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva versión → Implementar**. La pestaña «Cuestionarios» se crea sola con la primera entrega.

## Juegos (RayoMan)

El juego «RayoMan atrapa rayos» se juega en `rayoblocks/rayoman.html`. La opción del menú Archivo de RayoBlocks también lleva a esa página.

- **Alumnado:** escribe su nombre, sus apellidos y su grupo antes de jugar. La página le avisa de que el profesor puede ver lo que juega.
- **Registro:** cada sesión de juego es una fila de la pestaña **«Juegos»** de la hoja, con el día y la hora, el tiempo jugado (solo cuenta con la página a la vista), las partidas y la mejor puntuación. Se actualiza cada 30 segundos y al salir.
- **Profesor:** en `cuestionarios/profesor.html`, pestaña **🎮 Juegos**. Muestra quién juega y cuánto, quién está jugando ahora mismo y qué sesiones caen en horario de clase. Se puede filtrar por grupo y periodo y exportar a Excel. El horario de clase se cambia en `HORARIO`, dentro de `profesor.html`.

**Para activarlo hay que actualizar Apps Script:** sustituye el código de `Code.gs` por el nuevo [`apps-script/Codigo.js`](apps-script/Codigo.js), vuelve a poner tu `CLAVE_INICIAL` y publica una versión nueva: **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva versión → Implementar**. La URL no cambia. La pestaña «Juegos» se crea sola con la primera partida.

## Privacidad y buenas prácticas

- Solo tú tienes acceso a la hoja y a la carpeta de Drive. Los archivos de los alumnos no se comparten con nadie.
- Para consultar sus notas, el alumno tiene que escribir su nombre, sus apellidos y su correo exactamente igual que al entregar.
- La plataforma no comprueba que el correo sea realmente del alumno: solo exige que sea de Educaand. Para algo más estricto haría falta iniciar sesión con Google.
- Los datos del alumno solo se recuerdan mientras la pestaña está abierta. En ordenadores compartidos conviene pulsar «Salir» al terminar.
- Si cambias las respuestas correctas de una tarea que ya tiene entregas, esas entregas no se recalculan. Corrígelas a mano desde «Entregas».
- No se puede borrar una tarea que ya tiene entregas: despublícala desmarcando «Publicada».

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página del alumno |
| `profesor.html` | Panel del profesor |
| `config.js` | URL de tu aplicación web de Google |
| `api.js` | Conexión con el servidor (o con el modo de prueba) |
| `comun.js`, `tareas.css` | Utilidades y estilos comunes |
| `correccion.js` | Corrección automática (se usa también en Apps Script) |
| `apps-script/Codigo.js` | Servidor: pégalo en Apps Script como `Code.gs` |
| `gas-simulado.js` | Simula Google en el modo de prueba |
