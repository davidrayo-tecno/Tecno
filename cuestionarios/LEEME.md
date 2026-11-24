# Cuestionarios

Cuestionarios de Tecnología en formato examen. **Todos** comparten el mismo motor (`examen.js` y `examen.css`), así que cumplen siempre las mismas directrices. Cada cuestionario solo aporta sus preguntas (`preguntas.js`).

## Directrices de todos los cuestionarios

1. **Antes de empezar:** se explica en qué consiste el cuestionario y sus normas. El alumno escribe su **nombre y apellidos** y elige su **grupo**. Sin esos datos no puede empezar.
2. **Orden aleatorio:** al pulsar «Iniciar», las preguntas y las opciones salen en un orden distinto para cada alumno, para que los que se sientan juntos no se copien.
3. **Preguntas de todo tipo:** test, verdadero o falso, respuesta cerrada, respuesta abierta, reflexión y pensamiento crítico.
4. **Tiempo por pregunta:** cada pregunta tiene su propio tiempo. Al agotarse, se bloquea con lo que haya respondido el alumno.
5. **Dejar para después:** se puede saltar una pregunta y volver más tarde desde el mapa de preguntas. Su tiempo se guarda.
6. **Cuenta atrás siempre visible:** arriba se ven siempre el tiempo total y el de la pregunta abierta.
7. **Pantalla completa obligatoria:** si el alumno sale de la pantalla completa o cambia de ventana, se tapan las preguntas y la salida queda registrada. A la **3.ª salida** el cuestionario se entrega solo. Se cambia con `MAX_SALIDAS` en `examen.js`.
8. **Sin copiar:** no se puede pegar texto ni usar el menú contextual o los atajos de copiar, buscar o imprimir.
9. **Final:** el cuestionario termina cuando el alumno pulsa **«Entregar»** o cuando se acaba el **tiempo total**.
10. **Entrega:** las respuestas se envían al panel del profesor (`profesor.html`). Después se **borran del ordenador** y vuelve a salir el inicio vacío, listo para el siguiente alumno. Si el envío falla, se conservan para reintentarlo o guardarlas en PDF.
11. **Resultados solo para el profesor:** `profesor.html`, protegido con contraseña y sin enlaces públicos.

## Crear un cuestionario nuevo

1. Copia la carpeta `_plantilla` con el nombre del curso (por ejemplo, `1Bach-cuestionario`).
2. En su `preguntas.js` cambia `id`, `titulo`, `descripcion`, `GRUPOS` y escribe las preguntas, mejor de todos los tipos. No toques su `index.html`.
3. Añádelo a `lista.js` para que aparezca en el panel del profesor.
4. Pon su tarjeta en `index.html`.

Las entregas se guardan en la hoja de Google de la plataforma de Tareas (ver `../tareas/LEEME.md`).
