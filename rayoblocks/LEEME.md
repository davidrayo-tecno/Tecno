# RayoBlocks

Programación por bloques en el navegador para Computación y Robótica (1º ESO), al estilo de un Scratch básico.
Autor: David Rayo Torres · IES Palomares.

- **Bloques:** Movimiento, Apariencia, Sonido, Eventos, Control (incluidos clones), Sensores, Operadores, Variables y Lápiz.
- **Objetos y fondos:** biblioteca propia (mascota *Chispa*) y posibilidad de subir imágenes.
- **Idiomas:** español e inglés.
- **10 prácticas guiadas** (botón «Prácticas»): título, enunciado, reto extra y tres ayudas (dos pistas y la solución). Las ayudas usadas quedan anotadas dentro del archivo `.rayo` que entrega el alumno.
- **Proyectos:** se guardan y se abren como archivo `.rayo` en el equipo. RayoBlocks no guarda nada en el navegador.
- **Juego «RayoMan atrapa rayos»** (Archivo → Juego: RayoMan atrapa rayos, o el archivo `proyectos/rayoman-atrapa-rayos.rayo`): RayoMan se mueve con las flechas ← →, atrapa los rayos que caen (+1 punto) y esquiva los nubarrones (−1 vida). Cuantos más puntos, más rápido caen. Guarda el récord de la sesión. Usa clones, mensajes, variables, sensores y operadores. Para jugar se usa `rayoman.html`, que pide nombre, apellidos y grupo y registra el tiempo de juego para el profesor (ver `../tareas/LEEME.md`, apartado «Juegos»).

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html`, `rayoblocks.css` | Página y estilos |
| `bloques.js` | Definición de los bloques (es/en) y de la caja de herramientas |
| `motor.js` | Motor que ejecuta los programas (hilos, eventos, clones, choques, lápiz, sonido) |
| `practicas.js` | Las 10 prácticas (enunciados, ayudas, proyecto inicial y solución) |
| `biblioteca.js` | Objetos, fondos y sonidos originales |
| `app.js` | Interfaz: editor, escenario, objetos, archivos, ejemplos e idioma |
| `vendor/` | [Blockly](https://github.com/google/blockly) 12.5.1 de Google |

## Licencias

- Blockly © Google LLC, con licencia Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0). Se incluye sin modificar en `vendor/`.
- «Scratch» es una marca del MIT. RayoBlocks no está relacionado con Scratch ni con el MIT, ni cuenta con su aval.
