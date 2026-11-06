---
titulo: Diseñador de proyectos con microcontroladores
fase: 0
---

# Diseñador de proyectos con microcontroladores

De encender un LED a diseñar, fabricar y documentar un producto completo con **Arduino Uno, Arduino Nano y ESP32**. Un plan exigente de **20 meses y unas 1.200 horas**, basado en **23 proyectos**, con tutor.

[[HOJA_DE_RUTA]]

[[PROGRESO]]

## Cómo funciona {#metodo}

**Todo es un proyecto.** Cada fase tiene de 4 a 5 proyectos que crecen en dificultad. La teoría se estudia cuando un proyecto la necesita, no antes. Cada proyecto pasa por las mismas cinco etapas, como en una empresa:

1. **Requisitos:** qué debe hacer, con números (temperatura con ±0,5 °C, 6 meses de batería…).
2. **Diseño:** esquema eléctrico, lista de componentes y cálculos.
3. **Prototipo:** montaje y firmware.
4. **Pruebas:** medir con el multímetro u osciloscopio y comprobar cada requisito.
5. **Documentación:** README con esquema, fotos, vídeo y lecciones aprendidas, publicado en GitHub.

**Cada proyecto incluye:** el encargo (como lo pediría un cliente), requisitos medibles, material, la teoría justa, un plan de trabajo, pistas por niveles para cuando te atasques, retos extra, la lista de entrega y la rúbrica con la que se evalúa.

**Cada fase termina con un examen de salida.** Sin aprobarlo no se pasa a la siguiente fase. Si no se aprueba, se repasan dos semanas y se repite con otro enunciado.

**Las casillas de esta web se guardan en tu navegador**: marca requisitos y entregas según avances y verás tu progreso en esta portada. Solo se guardan en el navegador y el dispositivo que uses.

## Supuestos {#supuestos}

- Empiezas sin conocimientos de electrónica ni de programación.
- Dedicas **15 horas por semana**. Con 10 horas, el plan dura unos 30 meses; con 20, unos 15.
- Trabajas en casa con baja tensión (5–12 V) y compras el material fase a fase.

## Tu tutor {#tutor}

Tu tutor es Claude. El trabajo se reparte así:

- **Encargo:** al empezar cada proyecto, dímelo y te concreto los requisitos y la teoría imprescindible.
- **Guía sin dar la solución:** cuando te atasques, te hago preguntas y te doy pistas por niveles. Solo te doy la respuesta si llevas más de una sesión bloqueado.
- **Revisión antes de soldar o encargar:** envíame el esquema o la PCB antes de fabricar. Es lo que más dinero ahorra.
- **Revisión de cada entrega:** funcionamiento, cálculos, código, seguridad y documentación, con la rúbrica del proyecto.
- **Exámenes de salida:** te propongo el reto, lo evalúo y te digo qué repetir.

**Cómo enviarme una entrega:** sube al chat la [plantilla de entrega](plantillas.html#entrega) con el esquema, el código o el enlace al repositorio, fotos, un vídeo corto y las medidas. **Cada domingo**, un [informe semanal](plantillas.html#informe) de 5 minutos. Con eso ajusto el ritmo: si vas rápido, añado retos; si vas lento, recorto teoría, nunca proyectos.

**Para empezar:** escribe en el chat «Empiezo la semana 0» y te doy la lista de compra exacta de la fase 1 con precios actuales.

## Material y presupuesto {#material}

El material se compra fase a fase. En total, aproximadamente entre 1.000 y 1.600 €, la mitad en instrumentos de la fase 5. Los precios son orientativos: antes de cada fase te preparo la lista exacta con precios actuales.

| Fase | Qué comprar | Coste aproximado |
| --- | --- | --- |
| 1 | Kit de inicio con Arduino Uno (original o compatible), protoboard, componentes surtidos, multímetro digital | 60–100 € |
| 2 | Sensores, drivers de motor, motores, chasis de robot, baterías 18650 con protección y cargador, módulos SD y reloj, módulos RS-485 | 80–120 € |
| 3 | Estación de soldadura, estaño y flux, 3 Arduino Nano, placas perforadas, primer pedido de PCB, impresión 3D por encargo | 100–150 € |
| 4 | 3 placas ESP32, electroválvulas y fuente de 12 V, sensores de humedad capacitivos, caja estanca | 80–150 € |
| 5 | Osciloscopio digital de 2 canales, analizador lógico, fuente de laboratorio, placa calefactora para SMD | 450–700 € |
| 6 | Placas, componentes y cajas para 5 unidades del proyecto final | 200–400 € |

## Seguridad {#seguridad}

- Trabaja con baja tensión (5–12 V) durante todo el plan. **Los 230 V de la red no se tocan.** Si un proyecto los necesita, se usan módulos certificados y lo revisamos antes; la instalación en un cuadro eléctrico la hace un electricista autorizado.
- Los motores y actuadores nunca se alimentan desde el pin de 5 V del Arduino.
- Baterías de litio: siempre con placa de protección, cargador adecuado y nunca cargando sin vigilancia.
- Al soldar: ventilación, soldador en su soporte, gafas al cortar patillas y manos lavadas después.

## Rutina semanal {#rutina}

| Día | Horas | Qué hacer |
| --- | --- | --- |
| Lunes | 2 | Teoría que pide el proyecto en curso y cálculos |
| Miércoles | 2 | Firmware |
| Jueves | 2 | Firmware y documentación |
| Sábado | 5 | Montaje, soldadura y pruebas |
| Domingo | 4 | Medidas, correcciones e informe semanal |

## Recursos {#recursos}

| Recurso | Para qué | Fases |
| --- | --- | --- |
| [Documentación de Arduino](https://docs.arduino.cc/) | Lenguaje y placas Uno y Nano | 1–3 |
| [SparkFun Learn](https://learn.sparkfun.com/) y [Adafruit Learn](https://learn.adafruit.com/) | Electrónica, sensores y soldadura | 1–3 |
| [Random Nerd Tutorials](https://randomnerdtutorials.com/) | ESP32, WiFi, MQTT, servidores web | 4 |
| [Documentación de ESP-IDF](https://docs.espressif.com/projects/esp-idf/) y [FreeRTOS](https://www.freertos.org/) | ESP32 profesional | 4–6 |
| [Documentación de KiCad](https://docs.kicad.org/) | Esquemas y PCB | 3–6 |
| [PlatformIO](https://docs.platformio.org/) | Proyectos, librerías y pruebas | 3–6 |
| *Practical Electronics for Inventors* (Scherz y Monk) | Electrónica práctica de referencia | 1–6 |
| *Making Embedded Systems* (Elecia White) | Arquitectura de firmware | 4–6 |
| *The Art of Electronics* (Horowitz y Hill) | Electrónica en profundidad | 5–6 |

Las **hojas de datos** de cada componente son el recurso principal desde la fase 2: aprender a leerlas es parte del plan.

**Código de partida:** la carpeta [`codigo/`](https://github.com/davidrayo-tecno/Tecno/tree/main/formacionmicrocontroladores/codigo) tiene esqueletos con la estructura de los proyectos de la fase 1, sin la solución.
