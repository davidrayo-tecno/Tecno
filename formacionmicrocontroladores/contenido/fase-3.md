---
titulo: Fase 3 · Hardware propio con Arduino Nano y KiCad
fase: 3
meses: Meses 7–9
horas: 180 horas
---

# Fase 3 · Hardware propio con Arduino Nano y KiCad

Al terminar esta fase **sales de la protoboard**: sueldas con calidad, diseñas y encargas tus propias placas de circuito impreso, haces dispositivos que duran meses con pilas y los metes en una caja diseñada por ti.

| | |
| --- | --- |
| **Duración** | 12 semanas · unas 180 horas |
| **Placas** | Arduino Nano y ATmega328P sin placa |
| **Proyectos** | P9 Soldadura · P10 Primera PCB · P11 Registrador de bajo consumo · P12 Caja · P13 Código modular |
| **Examen** | Diseño y fabricación de una placa nueva, en 2 semanas |

> **Planifica los envíos:** un pedido de PCB tarda de 1 a 3 semanas en llegar. Diseña el P10 pronto y trabaja en el P11 mientras esperas.

---

## P9 · El termómetro del P3, soldado en placa perforada {#p9}

**Duración:** 2 semanas · unas 25 horas · **Nivel:** ★★☆☆☆

### El encargo

> La bodega del P3 está contenta, pero un montaje en protoboard no aguanta en un almacén: los cables se sueltan. Quiere el mismo termómetro, soldado y fiable.

### Requisitos

- [ ] **R1.** Practica primero con un kit de soldadura o con restos: al menos 50 soldaduras revisadas con lupa.
- [ ] **R2.** El termómetro del P3 con un Arduino Nano, soldado en placa perforada (de tiras o de islas).
- [ ] **R3.** Nano, pantalla y sensores van en **conectores**, no soldados directamente: se pueden cambiar.
- [ ] **R4.** Antes de alimentar, compruebas con el multímetro en continuidad que no hay cortocircuito entre 5 V y GND.
- [ ] **R5.** Cada soldadura es brillante y con forma de cono, sin bolas ni puentes.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | Estación de soldadura con temperatura regulable | |
| 1 | Estaño de 0,8 mm con flux, malla desoldadora y flux en pasta | |
| 1 | Kit de práctica de soldadura | |
| 1 | Placa perforada de unos 7 × 9 cm | |
| 1 | Arduino Nano, tiras de pines hembra y bornas de tornillo | |

### Teoría que necesitas

**Temperatura.** Para estaño sin plomo, la punta suele ir a unos 330–370 °C; con estaño con plomo, algo menos. Demasiado calor quema las pistas; demasiado poco hace soldaduras frías y grises.

**La técnica.** Calienta a la vez la pista y la patilla (1–2 s), acerca el estaño a la unión (no a la punta), retira el estaño y luego el soldador. Total: 3–4 segundos.

**Soldadura buena y mala.** Buena: cono cóncavo que moja la patilla y la pista. Fría: bola gris que no se adhiere. Puente: estaño que une dos pistas. Se corrigen con malla y flux.

**Seguridad.** Ventila: el humo del flux irrita. Lávate las manos después, sobre todo con estaño con plomo. El soldador siempre en su soporte. Gafas al cortar patillas.

### Plan de trabajo

1. **Diseño:** dibuja en papel cuadriculado la distribución de los componentes en la placa perforada, con las pistas y los cortes.
2. **Prototipo:** kit de práctica primero; después la placa, componente a componente, comprobando continuidad.
3. **Pruebas:** continuidad antes de alimentar; después el programa del P3 sin cambios.
4. **Documentación:** fotos de la placa por las dos caras, con macro o lupa.

### Pistas

<details markdown="1">
<summary>Pista 1 · El estaño no se pega</summary>

Limpia la punta en la esponja o el estropajo de latón y estáñala. Añade flux. Comprueba que calientas también la pista, no solo la patilla.

</details>

### Entrega

- [ ] Plano de distribución en papel.
- [ ] Fotos de las dos caras de la placa.
- [ ] Vídeo del termómetro funcionando en la placa.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Calidad de soldadura | 50 % | Todas las uniones correctas en las fotos |
| Funcionamiento | 30 % | Igual que en el P3 |
| Planificación | 20 % | Distribución ordenada y conectores |

---

## P10 · Tu primera PCB: placa base para Arduino Nano {#p10}

**Duración:** 4 semanas (más el envío) · unas 50 horas · **Nivel:** ★★★☆☆

### El encargo

> Quieres una placa propia para todos tus prototipos con Nano: alimentación protegida, conectores cómodos y lo que siempre acabas montando con cables.

### Requisitos

- [ ] **R1.** Zócalo para un Arduino Nano.
- [ ] **R2.** Entrada de alimentación de 7 a 12 V por borna de tornillo, con **protección contra polaridad inversa**, hacia el pin VIN del Nano.
- [ ] **R3.** 2 LED, 2 pulsadores, un conector I2C de 4 pines, un conector para el DS18B20 con su resistencia y 4 pines libres a bornas.
- [ ] **R4.** Placa de 2 capas de como mucho 80 × 60 mm, con 4 taladros de montaje de 3,2 mm.
- [ ] **R5.** Serigrafía con el nombre de cada conector, la polaridad y tu nombre y versión.
- [ ] **R6.** Comprobación de reglas eléctricas (ERC) y de diseño (DRC) **sin errores**.
- [ ] **R7.** Revisión de diseño conmigo **antes** de encargarla.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | KiCad, última versión estable | Gratuito |
| 1 | Pedido de 5 placas a un fabricante | Por ejemplo, JLCPCB, PCBWay o Aisler |
| — | Componentes de agujero pasante | Según tu lista de materiales |

### Teoría que necesitas

**Flujo de trabajo en KiCad.**

1. **Esquema:** colocas símbolos, los conectas y das valores. El ERC busca errores como pines sin conectar o salidas unidas.
2. **Huellas:** a cada símbolo le asignas su huella real (el tamaño físico de sus pads). Comprueba las medidas con la hoja de datos o con el componente y un calibre.
3. **PCB:** dibujas el contorno, colocas componentes, trazas pistas y añades un plano de masa. El DRC comprueba distancias y anchos.
4. **Fabricación:** exportas los ficheros Gerber y de taladros, los revisas en un visor y los subes al fabricante.

**Ancho de pista.** Depende de la corriente: para señales bastan 0,25 mm; para alimentación de hasta 1 A, unos 0,5–1 mm en cobre normal. KiCad tiene una calculadora integrada.

**Plano de masa.** Rellenar con GND las zonas libres reduce el ruido y facilita el ruteo.

**Protección contra polaridad inversa.** Un diodo en serie es lo más sencillo (pierde unos 0,7 V; uno Schottky, unos 0,3 V). Otra opción es un MOSFET de canal P, que casi no pierde tensión.

**Colocación antes que ruteo.** Agrupa por función, conectores en los bordes, y piensa en cómo vas a montar la placa en una caja.

### Plan de trabajo

1. **Requisitos:** lista de materiales con referencias reales y enlaces.
2. **Diseño:** esquema, huellas, colocación, ruteo, plano de masa, ERC y DRC. Imprime la PCB a escala 1:1 y pincha los componentes en el papel para comprobar las huellas.
3. **Revisión:** envíame las capturas del esquema, de las capas y la vista 3D.
4. **Fabricación y montaje:** encarga, suelda los componentes de menor a mayor altura y comprueba continuidad antes de alimentar.
5. **Pruebas y documentación:** prueba cada función, apunta los errores de diseño para la versión 2.

### Pistas

<details markdown="1">
<summary>Pista 1 · ¿Qué huella tiene el Nano?</summary>

Dos filas de 15 pines con paso de 2,54 mm y 15,24 mm (600 mil) entre filas. Puedes usar dos conectores de 1×15 o buscar una huella de Arduino Nano en las librerías de KiCad.

</details>

<details markdown="1">
<summary>Pista 2 · No consigo rutear sin cruzar pistas</summary>

Cambia de capa con una vía, o mueve componentes. A menudo girar un conector 180° deshace los cruces.

</details>

### Retos extra

- Añade un conector para programar el ATmega328P por ICSP.
- Haz la versión 2 corrigiendo los errores de la primera.

### Entrega

- [ ] Proyecto de KiCad completo en tu repositorio.
- [ ] Esquema en PDF y capturas de las capas y de la vista 3D.
- [ ] Ficheros de fabricación.
- [ ] Fotos de la placa montada y vídeo funcionando.
- [ ] Lista de errores encontrados y cómo los corregirías.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funciona a la primera | 30 % | Sin correcciones o con 1 corrección documentada |
| Calidad del diseño | 30 % | Esquema claro, colocación lógica, anchos correctos, plano de masa |
| Fabricabilidad | 20 % | DRC limpio, serigrafía útil, taladros de montaje |
| Documentación | 20 % | Lista de errores y mejoras honesta |

---

## P11 · Registrador de datos de bajo consumo {#p11}

**Duración:** 3 semanas · unas 50 horas · **Nivel:** ★★★★☆

### El encargo

> Un viticultor quiere saber la temperatura en distintos puntos de su viña durante toda la temporada. Los aparatos deben funcionar **al menos 6 meses con 3 pilas AA**, sin cables y sin tocarlos.

### Requisitos

- [ ] **R1.** Mide la temperatura cada 10 minutos y la guarda con fecha y hora en una memoria EEPROM I2C externa.
- [ ] **R2.** Entre medidas, el microcontrolador y los periféricos duermen. Lo despierta la alarma del reloj DS3231.
- [ ] **R3.** Consumo en reposo **menor de 50 µA**, medido.
- [ ] **R4.** Autonomía calculada **de 6 meses o más** con 3 pilas AA, con el consumo medido en reposo y durante la medida.
- [ ] **R5.** Al pulsar un botón, vuelca todos los datos por el puerto serie en CSV.
- [ ] **R6.** Si las pilas bajan de un nivel, guarda un aviso y deja de medir antes de corromper datos.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | Arduino Nano para desarrollar | |
| 1 | ATmega328P sin placa con cristal de 8 MHz o un Arduino Pro Mini de 3,3 V | Versión final |
| 1 | Memoria EEPROM I2C AT24C256 | |
| 1 | RTC DS3231 | |
| 1 | Sensor de temperatura de bajo consumo | Por ejemplo, el BME280 en modo forzado |
| 1 | Portapilas de 3 AA | |

### Teoría que necesitas

**Dónde se va la energía.** En una placa Arduino el microcontrolador es solo una parte: el LED de encendido, el regulador y el chip USB consumen varios miliamperios aunque el micro duerma. Por eso la versión final usa el microcontrolador sin placa o una placa modificada (sin LED ni regulador).

**Modos de reposo.** El ATmega328P en *power-down* consume menos de 1 µA. Se despierta con una interrupción externa (como la alarma del DS3231 en el pin 2) o con el perro guardián (*watchdog*). Antes de dormir, apaga el ADC y los periféricos que no uses.

**Consumo medio y autonomía.**

```
I media = (I activa · t activa + I reposo · t reposo) / (t activa + t reposo)
Autonomía (h) = Capacidad (mAh) / I media (mA)
```

Ejemplo: 5 mA durante 200 ms cada 10 minutos y 20 µA el resto da una media de unos 0,022 mA. Con 2.000 mAh, la autonomía teórica es de unas 90.000 horas; en la práctica se aplica un margen por autodescarga y temperatura.

**Medir microamperios.** Pon el multímetro en el rango de µA, en serie. Ojo: en ese rango el multímetro mete una resistencia que puede reiniciar el micro al despertar. Mide el reposo y el pico por separado.

**EEPROM externa.** Gasta mucho menos que una tarjeta SD y guarda decenas de miles de medidas. Se escribe por páginas de 64 bytes.

### Plan de trabajo

1. **Requisitos:** calcula cuánta memoria necesitas para 6 meses y qué consumo medio máximo puedes permitirte.
2. **Diseño:** esquema; cálculo de autonomía con datos de las hojas de datos.
3. **Prototipo:** primero funciona despierto con el Nano; después añade el reposo; mide el consumo; pasa a la versión final y vuelve a medir.
4. **Pruebas:** registra 72 horas; compara el consumo medido con el calculado.
5. **Documentación:** tabla de consumos de cada versión y lo que ahorró cada cambio.

### Pistas

<details markdown="1">
<summary>Pista 1 · El Nano sigue gastando 15 mA dormido</summary>

Es lo esperado: lo gasta la placa, no el micro. Anótalo como primera medida y pasa a la versión sin placa. Esa diferencia es la lección del proyecto.

</details>

<details markdown="1">
<summary>Pista 2 · No se despierta</summary>

La alarma del DS3231 pone su pin SQW/INT a nivel bajo y no lo suelta hasta que borras la bandera de alarma por I2C. Bórrala al despertar o no habrá segunda interrupción.

</details>

### Retos extra

- Mide la tensión de las pilas sin gastar energía en el divisor (con un MOSFET que lo conecta solo al medir).
- Lleva la autonomía a 2 años.

### Entrega

- [ ] Esquema y cálculo de autonomía.
- [ ] Tabla de consumos medidos por versión.
- [ ] Código.
- [ ] Datos de 72 horas en CSV.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Consumo | 35 % | Reposo menor de 50 µA, medido |
| Cálculo de autonomía | 25 % | Coincide con lo medido con un margen de ±20 % |
| Fiabilidad | 20 % | 72 horas sin perder datos y protección de pilas bajas |
| Documentación | 20 % | Cada ahorro explicado y medido |

---

## P12 · Caja a medida {#p12}

**Duración:** 1,5 semanas · unas 25 horas · **Nivel:** ★★☆☆☆

### El encargo

> El registrador del P11 va a pasar meses a la intemperie. Necesita una caja que proteja la electrónica, deje respirar al sensor y permita cambiar las pilas.

### Requisitos

- [ ] **R1.** Diseño en 3D (FreeCAD o Fusion) con las medidas reales de tu placa, tomadas con calibre.
- [ ] **R2.** La placa se fija con tornillos M3, no con pegamento.
- [ ] **R3.** El sensor queda expuesto al aire pero protegido del sol directo y de la lluvia.
- [ ] **R4.** Las pilas se cambian sin desmontar la placa.
- [ ] **R5.** Impresa en PETG o ASA (aguantan mejor el sol y el calor que el PLA), por ti o por un servicio.
- [ ] **R6.** Etiqueta con nombre, versión y fecha de cambio de pilas.

### Teoría que necesitas

**Tolerancias de impresión 3D.** Deja 0,2–0,4 mm de holgura en los encajes: las piezas impresas salen algo más gordas de lo dibujado.

**Diseño para imprimir.** Evita voladizos de más de 45° sin soporte, usa paredes de al menos 1,6 mm y pon insertos roscados de latón para los tornillos que se abren a menudo.

**Protección.** El código IP indica la protección contra polvo y agua (IP54, IP65…). En una caja impresa casera no se garantiza, pero se mejora con juntas y con las aberturas hacia abajo.

### Plan de trabajo

1. Mide la placa, el portapilas y el sensor.
2. Dibuja la caja, imprime una prueba rápida solo de la base para comprobar los taladros.
3. Imprime la versión final y monta.
4. Prueba: 1 semana en exterior; comprueba humedad dentro.

### Entrega

- [ ] Ficheros del diseño 3D y ficheros para imprimir.
- [ ] Fotos de la caja montada y abierta.
- [ ] Resultado de la semana en exterior.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Encaje y montaje | 40 % | Todo encaja a la primera o a la segunda impresión |
| Protección y uso | 40 % | Sensor bien ventilado, pilas accesibles, interior seco |
| Documentación | 20 % | Ficheros editables incluidos |

---

## P13 · Código modular y profesional {#p13}

**Duración:** 1,5 semanas · unas 30 horas · **Nivel:** ★★★☆☆

### El encargo

> Tus programas crecen y cada proyecto copias trozos del anterior. Toca organizarlo como lo haría una empresa: módulos reutilizables, control de versiones serio y un entorno profesional.

### Requisitos

- [ ] **R1.** Pasa el proyecto del P11 a **PlatformIO** en VS Code.
- [ ] **R2.** Divide el código en módulos `.h` / `.cpp`: sensor, memoria, reloj, energía y botón.
- [ ] **R3.** Crea una clase `Boton` con antirrebote que puedas reutilizar, y úsala también en una versión nueva del P4.
- [ ] **R4.** Ningún fichero pasa de 200 líneas; ninguna función, de 40.
- [ ] **R5.** Git con ramas por funcionalidad, mensajes de commit claros y una etiqueta de versión (`v1.0`).
- [ ] **R6.** Un README técnico explica la arquitectura con un diagrama de módulos.

### Teoría que necesitas

**Clases en C++.** Agrupan datos y funciones relacionados. Una clase `Boton` guarda su pin, su último estado y el momento del último cambio, y ofrece métodos como `pulsado()`. Cada botón es un objeto.

**Cabeceras y ficheros de código.** El `.h` declara qué ofrece un módulo (su interfaz); el `.cpp` lo implementa. El resto del programa solo necesita el `.h`.

**PlatformIO.** Gestiona placas, librerías y versiones en un fichero `platformio.ini`, de forma que el proyecto compila igual en cualquier ordenador.

**Versiones.** Etiquetas como `v1.0.0` (versionado semántico: mayor.menor.corrección) marcan qué código lleva cada aparato.

### Plan de trabajo

1. Crea el proyecto en PlatformIO y haz que compile el código actual tal cual.
2. Extrae un módulo cada vez y comprueba que todo sigue funcionando tras cada cambio.
3. Escribe la clase `Boton` y úsala en dos proyectos.
4. Revisa con el diagrama de módulos que no hay dependencias cruzadas.

### Entrega

- [ ] Repositorio con historial de ramas y la etiqueta `v1.0`.
- [ ] Diagrama de módulos.
- [ ] El P4 reescrito usando la clase `Boton`.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Estructura | 40 % | Módulos con una sola responsabilidad, sin variables globales compartidas |
| Reutilización | 25 % | La clase `Boton` funciona sin cambios en dos proyectos |
| Git | 15 % | Historial limpio y etiquetado |
| Documentación | 20 % | Arquitectura clara |

---

## Examen de salida de la fase 3 {#examen}

### Encargo (2 semanas, más el envío)

**Controlador de tira LED de 12 V.** Diseña, fabrica y monta una placa con un Arduino Nano (o ATmega328P) que controle una tira LED RGB de 12 V y hasta 2 A por canal:

- Entrada de 12 V por borna, con fusible y protección contra polaridad inversa.
- Regulación a 5 V para el microcontrolador.
- 3 canales con MOSFET de nivel lógico y PWM.
- 2 pulsadores y un conector I2C para ampliaciones.
- Pistas dimensionadas para la corriente.

Esta vez **no hay revisión previa conmigo**: me envías el diseño ya encargado, y lo reviso después junto con la placa montada.

### Para aprobar

- [ ] La placa funciona a la primera o con 2 correcciones como máximo, documentadas.
- [ ] Con los tres canales al máximo durante 15 minutos, ningún MOSFET ni pista se calienta de forma peligrosa (mídelo o tócalo con cuidado y documéntalo).
- [ ] Ancho de pistas y disipación justificados por escrito.
- [ ] Código modular en PlatformIO con efectos de color controlados por los botones.
