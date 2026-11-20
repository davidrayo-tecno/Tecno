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

1. Entra en Google Drive con la cuenta que vayas a usar (por ejemplo, la del centro) y crea una **hoja de cálculo nueva**. Llámala, por ejemplo, «Tareas Tecnología».
2. En la hoja: **Extensiones → Apps Script**.
3. En el editor que se abre:
   - Borra lo que haya en `Code.gs` y pega todo el contenido de [`apps-script/Codigo.js`](apps-script/Codigo.js).
   - Pulsa **+ → Secuencia de comandos**, llámalo `Correccion` y pega el contenido de [`correccion.js`](correccion.js).
4. En `Code.gs`, cambia la línea `var CLAVE_INICIAL = 'cambia-esta-clave';` por tu contraseña de profesor. Guarda con el icono del disquete.
5. Arriba, elige la función **`instalar`** y pulsa **Ejecutar**. Google te pedirá permisos para la hoja y para Drive: acéptalos. Si aparece «Google no ha verificado esta aplicación», pulsa **Configuración avanzada → Ir a… (no seguro)**. Es tu propio script.
   Esto crea las pestañas `Tareas` y `Entregas` y la carpeta «Entregas de alumnos» en tu Drive.
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
