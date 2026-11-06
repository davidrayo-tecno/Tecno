---
titulo: Fase 1 · Fundamentos con Arduino Uno
fase: 1
meses: Meses 1–3
horas: 180 horas
---

# Fase 1 · Fundamentos con Arduino Uno

Al terminar esta fase entiendes **lo que conectas y por qué funciona**: calculas resistencias, lees entradas digitales y analógicas, controlas salidas con PWM y escribes programas que hacen varias cosas a la vez sin bloquearse.

| | |
| --- | --- |
| **Duración** | 12 semanas · unas 180 horas |
| **Placa** | Arduino Uno (original o compatible) |
| **Proyectos** | P1 Semáforo · P2 Luz nocturna · P3 Termómetro · P4 Juego tipo Simón |
| **Examen** | Alarma de puerta con código, en 6 horas |

## Semana 0 · Preparación {#semana-0}

Antes del primer proyecto deja listo tu puesto de trabajo. Dedica unas 10 horas.

- [ ] Instala **Arduino IDE 2** y comprueba que subes el ejemplo *Blink* a la placa.
- [ ] Instala **Git**, crea una cuenta de GitHub y un repositorio llamado `proyectos-microcontroladores` para tus entregas.
- [ ] Aprende a usar el **multímetro**: tensión continua, resistencia, continuidad y corriente (en serie, con la punta en el borne de mA).
- [ ] Mide con el multímetro las resistencias del kit y compáralas con su código de colores.
- [ ] Monta en la protoboard un LED con su resistencia alimentado desde los 5 V del Arduino, sin programa. Mide la tensión en el LED y en la resistencia: deben sumar unos 5 V.
- [ ] Lee las normas de seguridad de la portada del curso.

**Entrega de la semana 0:** foto de tu puesto de trabajo, captura de *Blink* funcionando y las medidas del LED en una tabla.

---

## P1 · Semáforo con pulsador de peatones {#p1}

**Duración:** 3 semanas · unas 40 horas · **Nivel:** ★☆☆☆☆

### El encargo

> El ayuntamiento quiere una maqueta de un paso de peatones para explicar a los niños de un colegio cómo funciona. El semáforo de coches está en verde hasta que un peatón pulsa el botón. Entonces, cuando sea seguro, el semáforo cambia y deja pasar a los peatones.

### Requisitos

- [ ] **R1.** Semáforo de coches con LED rojo, ámbar y verde; semáforo de peatones con LED rojo y verde.
- [ ] **R2.** En reposo: coches en verde, peatones en rojo.
- [ ] **R3.** Al pulsar el botón, los coches siguen en verde hasta completar **al menos 10 s** de verde desde el último cambio.
- [ ] **R4.** Secuencia: ámbar de coches 3 s → rojo de coches → 1 s de seguridad → verde de peatones 8 s → verde de peatones parpadeando 4 s (medio segundo encendido, medio apagado) → rojo de peatones → 1 s de seguridad → verde de coches.
- [ ] **R5.** Una pulsación en cualquier momento del verde de coches se atiende. Las pulsaciones durante el ciclo de peatones se ignoran.
- [ ] **R6.** Ningún LED consume más de **15 mA**, medido con el multímetro.
- [ ] **R7.** Los tiempos tienen un error menor de 0,2 s (compruébalo con el cronómetro del móvil o grabando un vídeo).

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | Arduino Uno y cable USB | |
| 1 | Protoboard y cables | |
| 2 | LED rojo de 5 mm | |
| 1 | LED ámbar o amarillo de 5 mm | |
| 2 | LED verde de 5 mm | |
| 5 | Resistencias (valor a calcular por ti) | Pista: entre 150 Ω y 330 Ω |
| 1 | Pulsador de 4 patas | |

### Teoría que necesitas

**Ley de Ohm.** La tensión en una resistencia es proporcional a la corriente que la atraviesa: *V = I · R*. Si conoces dos de los tres valores, calculas el tercero.

**El LED no es una resistencia.** Un LED encendido tiene una caída de tensión casi fija, la *tensión directa* (Vf): unos 2 V en rojo y ámbar, y entre 2 y 3,2 V en verde según el modelo (mira su hoja de datos). La resistencia en serie se lleva el resto de la tensión y es la que limita la corriente:

```
R = (Vcc − Vf) / I
```

Ejemplo con un LED rojo a 15 mA: R = (5 − 2) / 0,015 = 200 Ω. Como 200 Ω no es un valor comercial, se elige el siguiente de la serie E12: **220 Ω**, que da algo menos de corriente.

**Límites del Arduino Uno.** Cada pin de salida da como mucho 20 mA de forma segura (40 mA es el máximo absoluto, que daña el microcontrolador) y el chip entero no debe pasar de unos 200 mA. Nunca conectes un LED a un pin sin resistencia.

**Entradas digitales y resistencia de pull-up.** Un pin configurado como entrada sin nada conectado está «flotando» y lee valores al azar. Con `pinMode(pin, INPUT_PULLUP)` se activa una resistencia interna a 5 V: el pin lee `HIGH` en reposo y `LOW` cuando el pulsador lo une a GND. La lógica queda invertida.

**Rebote.** Al pulsar, los contactos metálicos rebotan durante unos milisegundos y el Arduino ve varias pulsaciones. En este proyecto basta con ignorar cambios durante unos 30 ms tras el primero.

**Diagrama de estados.** Antes de programar, dibuja cada situación del semáforo (estado) como una caja y cada cambio (transición) como una flecha con su condición: «han pasado 3 s», «se ha pulsado el botón». El programa será la traducción de ese dibujo.

### Plan de trabajo

1. **Requisitos:** léelos y escribe con tus palabras cualquier duda. ¿Qué pasa si el peatón pulsa 5 veces?
2. **Diseño:**
    - Calcula la resistencia de cada color de LED con su tensión directa real.
    - Dibuja el esquema a mano: Arduino, cinco LED con su resistencia y el pulsador.
    - Dibuja el diagrama de estados completo.
3. **Prototipo:**
    - Monta un solo LED y haz que parpadee. Mide su corriente con el multímetro en serie.
    - Monta los cinco LED y prueba que cada uno enciende con un programa sencillo.
    - Añade el pulsador y muestra su estado por el monitor serie.
    - Programa la secuencia completa siguiendo tu diagrama de estados.
4. **Pruebas:** comprueba cada requisito y anota el resultado. Graba un vídeo del ciclo completo.
5. **Documentación:** README con esquema, diagrama de estados, cálculos, tabla de pruebas y vídeo.

### Pistas

<details markdown="1">
<summary>Pista 1 · No sé por dónde empezar el programa</summary>

Guarda el estado actual en una variable, por ejemplo `int estado = 0;`, y numera los estados de tu diagrama. En `loop()`, usa un `switch (estado)` con un `case` por estado. Cada `case` enciende sus LED y decide si toca pasar al siguiente.

</details>

<details markdown="1">
<summary>Pista 2 · Las pulsaciones durante el verde se pierden</summary>

Si usas `delay(10000)`, el Arduino se queda «dormido» 10 segundos y no lee el botón. Una salida sencilla para este proyecto: en lugar de una espera larga, haz un bucle que espere 10 ms muchas veces y que lea el botón en cada vuelta. En el P4 aprenderás la forma profesional, con `millis()`.

</details>

<details markdown="1">
<summary>Pista 3 · ¿Cómo cuento los 10 s mínimos de verde?</summary>

Guarda el momento en que los coches pasan a verde (`unsigned long inicioVerde = millis();`). Cuando alguien pulse, comprueba si `millis() - inicioVerde` es menor de 10000 y, si lo es, espera la diferencia.

</details>

### Retos extra

- Añade un zumbador que pite al ritmo del parpadeo del verde de peatones, como los semáforos sonoros para personas ciegas.
- Haz que de noche (un segundo pulsador que simula un interruptor horario) el semáforo de coches quede en ámbar intermitente.

### Entrega

- [ ] Esquema eléctrico (dibujado a mano y fotografiado, vale).
- [ ] Cálculo de las resistencias con la tensión directa de cada LED.
- [ ] Diagrama de estados.
- [ ] Código completo en tu repositorio.
- [ ] Tabla con la comprobación de R1 a R7 y la corriente medida de cada LED.
- [ ] Vídeo del ciclo completo con una pulsación.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 40 % | Cumple R1–R7 sin excepciones |
| Cálculos y medidas | 20 % | Resistencias calculadas y corriente medida en todos los LED |
| Código | 20 % | Organizado en estados, con nombres claros y comentarios útiles |
| Documentación | 20 % | Otra persona podría montarlo solo con tu README |

---

## P2 · Luz nocturna automática {#p2}

**Duración:** 2 semanas · unas 30 horas · **Nivel:** ★☆☆☆☆

### El encargo

> Una familia quiere una luz de pasillo que se encienda sola al anochecer, con más intensidad cuanto más oscuro esté, y que no parpadee cuando la luz está justo en el límite.

### Requisitos

- [ ] **R1.** Un sensor de luz (LDR) mide la luz ambiente.
- [ ] **R2.** Por debajo de un umbral, el LED se enciende; su brillo aumenta cuanto más oscuro está, en 256 niveles (PWM).
- [ ] **R3.** El umbral se ajusta con un potenciómetro, sin reprogramar.
- [ ] **R4.** Con la luz justo en el umbral, el LED no parpadea: usa **histéresis** de al menos un 5 % del rango.
- [ ] **R5.** Las lecturas se suavizan: un cambio brusco de una décima de segundo (pasar la mano por encima) no apaga ni enciende la luz.
- [ ] **R6.** El monitor serie muestra cada 200 ms la luz, el umbral y el brillo, en un formato que entienda el trazador serie del IDE.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | LDR (fotorresistencia) | Por ejemplo, GL5528 |
| 1 | Resistencia fija para el divisor | Valor a elegir midiendo tu LDR |
| 1 | Potenciómetro de 10 kΩ | |
| 1 | LED blanco o de alto brillo y su resistencia | |

### Teoría que necesitas

**Divisor de tensión.** Dos resistencias en serie entre 5 V y GND reparten la tensión. La tensión en el punto medio es:

```
Vsalida = Vcc · R2 / (R1 + R2)
```

Una LDR cambia mucho su resistencia con la luz (de unos pocos kΩ con luz a cerca de 1 MΩ a oscuras). Si la pones como una de las dos resistencias, la tensión del punto medio sigue a la luz.

**Elegir la resistencia fija.** Mide la LDR con el multímetro con la luz que te interesa distinguir (el anochecer). Una resistencia fija de un valor parecido deja la salida cerca de 2,5 V justo en esa zona, donde el divisor es más sensible.

**Convertidor analógico-digital (ADC).** `analogRead()` convierte 0–5 V en un número de 0 a 1023 (10 bits). Cada paso son unos 4,9 mV.

**PWM.** El Arduino no da tensiones intermedias: enciende y apaga el pin muy rápido. `analogWrite(pin, valor)` con un valor de 0 a 255 fija qué fracción del tiempo está encendido (ciclo de trabajo). El ojo ve un brillo intermedio. En el Uno solo funciona en los pines marcados con `~`: 3, 5, 6, 9, 10 y 11.

**Histéresis.** Usa dos umbrales: se enciende por debajo del umbral bajo y se apaga por encima del alto. Entre los dos, mantiene lo que estaba haciendo. Así funciona un termostato.

**Media móvil.** Guarda las últimas N lecturas y usa su media. Filtra el ruido y los cambios bruscos.

### Plan de trabajo

1. **Requisitos:** decide qué es «oscuro» para ti y cómo lo vas a comprobar.
2. **Diseño:** mide tu LDR con luz y a oscuras, elige la resistencia fija y calcula la tensión de salida en los dos casos. Dibuja el esquema.
3. **Prototipo:** primero lee la LDR y el potenciómetro y muéstralos en el trazador serie; después controla el LED; por último añade histéresis y suavizado.
4. **Pruebas:** tapa la LDR poco a poco y comprueba R2, R4 y R5. Graba la pantalla del trazador mientras lo haces.
5. **Documentación:** README con cálculos, esquema, gráfica del trazador y vídeo.

### Pistas

<details markdown="1">
<summary>Pista 1 · El brillo va al revés</summary>

Puede que tu divisor dé más tensión a oscuras o con luz, según dónde pusiste la LDR. La función `map(valor, deMin, deMax, aMin, aMax)` acepta rangos invertidos, por ejemplo `map(luz, 0, umbral, 255, 0)`.

</details>

<details markdown="1">
<summary>Pista 2 · ¿Cómo hago la media móvil?</summary>

Un array de 10 lecturas y un índice que da vueltas: cada lectura nueva sustituye a la más antigua (`indice = (indice + 1) % 10;`). Mantén también la suma, restando la lectura que sale y sumando la que entra.

</details>

<details markdown="1">
<summary>Pista 3 · El trazador no dibuja varias líneas</summary>

El trazador serie del IDE 2 separa variables por comas o espacios y admite etiquetas: `Serial.print("luz:"); Serial.print(luz); Serial.print(",umbral:"); Serial.println(umbral);`

</details>

### Retos extra

- Enciende y apaga la luz con un fundido suave de 2 segundos en lugar de golpe.
- Añade un sensor de movimiento PIR: la luz solo se enciende de noche **y** si hay alguien.

### Entrega

- [ ] Medidas de la LDR y cálculo del divisor.
- [ ] Esquema.
- [ ] Código.
- [ ] Captura o vídeo del trazador serie mostrando la histéresis.
- [ ] Tabla de comprobación de R1–R6.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 40 % | Cumple R1–R6, sin parpadeos |
| Diseño del divisor | 20 % | Resistencia elegida con medidas y justificada |
| Código | 20 % | Histéresis y media móvil claras y en funciones |
| Documentación | 20 % | Gráfica que demuestra la histéresis |

---

## P3 · Termómetro con pantalla {#p3}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★☆☆☆

### El encargo

> Una pequeña bodega quiere controlar la temperatura de su almacén. Necesita ver la temperatura actual, la mínima y la máxima del día, un aviso si se pasa de un límite y poder llevarse los datos a una hoja de cálculo.

### Requisitos

- [ ] **R1.** Mide la temperatura con dos sensores distintos: uno analógico (TMP36) y uno digital (DS18B20). Compara su precisión.
- [ ] **R2.** Una pantalla LCD de 16×2 muestra la temperatura actual, la mínima y la máxima, con un decimal.
- [ ] **R3.** Un pulsador pone a cero la mínima y la máxima.
- [ ] **R4.** Por encima de un límite (por ejemplo, 18 °C), se enciende un LED rojo y suena un aviso corto cada 10 s.
- [ ] **R5.** Cada segundo envía por el puerto serie una línea en formato CSV: tiempo en segundos, temperatura TMP36, temperatura DS18B20.
- [ ] **R6.** Si el sensor digital se desconecta, la pantalla muestra «ERROR SENSOR» en lugar de un valor falso.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | Sensor TMP36 | Analógico |
| 1 | Sensor DS18B20 | Digital, bus 1-Wire. Mejor la versión sumergible con cable |
| 1 | Resistencia de 4,7 kΩ | Pull-up del bus 1-Wire |
| 1 | Pantalla LCD 16×2 con adaptador I2C | Adaptador con chip PCF8574 |
| 1 | Zumbador activo | |
| 1 | LED rojo, resistencia y pulsador | |

### Teoría que necesitas

**Sensor analógico TMP36.** Da 0,5 V a 0 °C y sube 10 mV por grado:

```
T (°C) = (V − 0,5) × 100
```

Con el ADC de 10 bits del Uno, cada paso de 4,9 mV equivale a casi medio grado. Además, si los 5 V del USB son en realidad 4,85 V, el error crece. Por eso los sensores digitales son más fiables.

**Bus 1-Wire.** El DS18B20 se comunica por un solo cable de datos con una resistencia de 4,7 kΩ a 5 V. Hace la medida él mismo y envía el número, con una precisión de ±0,5 °C. Necesitas las librerías `OneWire` y `DallasTemperature`.

**Bus I2C.** Dos cables, SDA (datos) y SCL (reloj), conectan muchos dispositivos, cada uno con una dirección. En el Uno van a los pines A4 (SDA) y A5 (SCL). El adaptador de la LCD suele tener la dirección 0x27 o 0x3F: averígualo con un programa «escáner I2C».

**Librerías.** Código escrito por otros que se instala desde el gestor de librerías del IDE. Lee siempre su ejemplo básico antes de usarla.

**Formato CSV.** Valores separados por comas, una línea por medida. Se abre directamente en una hoja de cálculo.

### Plan de trabajo

1. **Requisitos:** decide qué mostrar en cada línea de la pantalla (solo hay 16 caracteres).
2. **Diseño:** esquema con los dos sensores, la LCD por I2C, el zumbador, el LED y el pulsador. Calcula la resolución en grados del TMP36.
3. **Prototipo:** cada pieza por separado y con su ejemplo: escáner I2C, LCD con «Hola», DS18B20 por el monitor serie, TMP36 por el monitor serie. Después, júntalo todo.
4. **Pruebas:** registra 30 minutos de datos, ábrelos en una hoja de cálculo y haz una gráfica comparando los dos sensores. Prueba a desconectar el DS18B20.
5. **Documentación:** README con esquema, gráfica, conclusión sobre qué sensor es mejor y por qué.

### Pistas

<details markdown="1">
<summary>Pista 1 · La pantalla se enciende pero no muestra nada</summary>

Gira el potenciómetro azul del adaptador I2C: ajusta el contraste. Si sigue sin verse, comprueba la dirección con el escáner I2C.

</details>

<details markdown="1">
<summary>Pista 2 · El TMP36 da valores que bailan varios grados</summary>

Haz la media de varias lecturas y separa el cable del sensor de los cables del zumbador. Mide con el multímetro la tensión real del pin de 5 V y úsala en la fórmula en lugar de 5,0.

</details>

<details markdown="1">
<summary>Pista 3 · ¿Cómo sé que el DS18B20 está desconectado?</summary>

La librería `DallasTemperature` devuelve una constante especial cuando no hay sensor. Búscala en su documentación y compárala con lo que lees.

</details>

### Retos extra

- Guarda la mínima y la máxima en la EEPROM para que no se pierdan al quitar la alimentación.
- Muestra en la pantalla una pequeña flecha que indique si la temperatura sube o baja.

### Entrega

- [ ] Esquema.
- [ ] Código.
- [ ] Fichero CSV de 30 minutos y gráfica comparativa.
- [ ] Conclusión escrita sobre los dos sensores.
- [ ] Vídeo con la alarma y el error de sensor.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 35 % | Cumple R1–R6 |
| Análisis de sensores | 25 % | Gráfica y conclusión con números (diferencia media, ruido) |
| Código | 20 % | Uso correcto de librerías, sin código repetido |
| Documentación | 20 % | Completa y clara |

---

## P4 · Juego de reflejos tipo Simón {#p4}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★☆☆☆

### El encargo

> Una juguetería quiere un prototipo del clásico juego de memoria: el aparato enseña una secuencia de luces y sonidos cada vez más larga y el jugador debe repetirla.

### Requisitos

- [ ] **R1.** 4 LED de colores, 4 pulsadores y un zumbador. Cada color tiene su nota musical.
- [ ] **R2.** La secuencia es aleatoria y distinta en cada partida, y crece en un paso cada ronda hasta 20.
- [ ] **R3.** A partir de la ronda 5, la secuencia se muestra más rápido.
- [ ] **R4.** El jugador tiene 3 segundos para cada pulsación; si se pasa o se equivoca, suena una melodía de error y se muestra la puntuación con parpadeos.
- [ ] **R5.** **El programa no usa `delay()`.** Mientras suena una nota o espera, el Arduino sigue atento a todo.
- [ ] **R6.** Rebote de los pulsadores resuelto por software: una pulsación cuenta una sola vez.
- [ ] **R7.** El récord se guarda en la EEPROM y se muestra al encender.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 4 | LED de colores distintos y sus resistencias | |
| 4 | Pulsadores | Mejor de colores a juego |
| 1 | Zumbador pasivo | Pasivo: puede tocar notas |

### Teoría que necesitas

**`millis()` y el fin de `delay()`.** `millis()` devuelve los milisegundos desde que arrancó la placa. En lugar de esperar, se pregunta: «¿han pasado ya 300 ms desde que encendí este LED?». Así el `loop()` da miles de vueltas por segundo y puede atender varias cosas a la vez.

```
if (millis() - momentoAnterior >= intervalo) {
  momentoAnterior = millis();
  // toca hacer algo
}
```

Usa siempre `unsigned long` y la resta: así el código sigue funcionando cuando `millis()` se desborda, a los 49 días.

**Máquina de estados.** El juego tiene estados claros: ESPERANDO_INICIO, MOSTRANDO_SECUENCIA, ESCUCHANDO_JUGADOR, ERROR. Cada vuelta de `loop()` hace un poco del trabajo del estado actual y decide si cambia.

**Arrays y funciones.** La secuencia es un array de 20 números entre 0 y 3. Escribe funciones pequeñas con nombres claros: `encenderColor(c)`, `leerPulsador()`, `mostrarPuntuacion(n)`.

**Números aleatorios.** `random(4)` da un número de 0 a 3, pero sin semilla repite la misma secuencia al encender. `randomSeed(analogRead(A0))` con A0 al aire usa el ruido eléctrico como semilla.

**`tone()`.** Genera una nota en el zumbador pasivo sin bloquear el programa. Cuidado: en el Uno usa el mismo temporizador que el PWM de los pines 3 y 11.

**EEPROM.** Memoria que no se borra al quitar la alimentación. Con `EEPROM.update()` solo se escribe si el valor cambia, lo que alarga su vida (unos 100.000 ciclos de escritura).

### Plan de trabajo

1. **Requisitos:** juega a una versión del Simón en el móvil y apunta cómo se comporta.
2. **Diseño:** esquema y diagrama de estados con todas las transiciones y sus condiciones.
3. **Prototipo:** empieza por una función de lectura de pulsadores con antirrebote por `millis()`. Después, mostrar una secuencia fija. Luego, escuchar al jugador. Por último, aleatoriedad, velocidad y EEPROM.
4. **Pruebas:** juega 10 partidas. Pide a otra persona que juegue e intente «romperlo» pulsando dos botones a la vez o muy rápido.
5. **Documentación:** README con diagrama de estados, esquema y vídeo de una partida.

### Pistas

<details markdown="1">
<summary>Pista 1 · Antirrebote con millis()</summary>

Para cada pulsador guarda su último estado leído y el momento en que cambió. Solo das por buena una pulsación si el estado lleva estable más de 30 ms.

</details>

<details markdown="1">
<summary>Pista 2 · ¿Cómo muestro la secuencia sin delay()?</summary>

Necesitas dos variables: qué paso de la secuencia estás mostrando y si ahora toca «encendido» o «pausa». En cada vuelta, si ha pasado el tiempo de la fase actual, cambias de fase y, si toca, avanzas de paso.

</details>

<details markdown="1">
<summary>Pista 3 · Código muy largo dentro del switch</summary>

Saca cada estado a su propia función: `void estadoMostrando()`, `void estadoEscuchando()`. El `switch` del `loop()` solo llama a la función del estado actual.

</details>

### Retos extra

- Modo de dos jugadores: cada uno añade un color a la secuencia del otro.
- Mide y muestra por el monitor serie cuántas vueltas da el `loop()` por segundo. Compáralo con una versión que use `delay()`.

### Entrega

- [ ] Diagrama de estados.
- [ ] Esquema.
- [ ] Código sin ningún `delay()`.
- [ ] Vídeo de una partida de al menos 8 rondas y del récord guardado tras desconectar.
- [ ] Tabla de comprobación de R1–R7.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 35 % | Cumple R1–R7, imposible de bloquear |
| Arquitectura del código | 35 % | Máquina de estados limpia, funciones cortas, sin `delay()` |
| Pruebas | 10 % | Pruebas de otra persona documentadas |
| Documentación | 20 % | Diagrama de estados que coincide con el código |

---

## Examen de salida de la fase 1 {#examen}

El examen tiene dos partes y se hace cuando hayas entregado los cuatro proyectos. Avísame con «Estoy listo para el examen de la fase 1».

### Parte A · Teoría (1 hora, sin apuntes)

Te enviaré 10 preguntas como estas:

1. Calcula la resistencia para un LED verde de Vf = 3,0 V a 12 mA con 5 V. Elige el valor comercial.
2. Un divisor tiene R1 = 10 kΩ arriba y R2 = 4,7 kΩ abajo, a 5 V. ¿Qué tensión hay en el punto medio? ¿Qué devuelve `analogRead()`?
3. ¿Por qué un pin de entrada sin pull-up da lecturas al azar?
4. ¿Qué ciclo de trabajo produce `analogWrite(9, 64)`?
5. Explica por qué `delay()` impide atender un pulsador y cómo lo resuelve `millis()`.

### Parte B · Proyecto en 6 horas

**Alarma de puerta con código.** Un interruptor magnético (o un pulsador que lo simula) detecta si la puerta se abre. La alarma se arma y desarma con un código de 4 pulsaciones en 3 botones. Si la puerta se abre con la alarma armada, hay 10 s para meter el código antes de que suene. LED de estado: verde desarmada, rojo armada, rojo parpadeando en cuenta atrás.

Entrega en las 6 horas: esquema, diagrama de estados, código y vídeo de todas las situaciones.

### Para aprobar

- [ ] Parte A: 7 de 10 o más.
- [ ] Parte B: funciona en todos los casos, sin `delay()`, con máquina de estados.
- [ ] Código legible: lo entiendo sin que me lo expliques.

Si no apruebas, repasas dos semanas lo que falló y repites con otro enunciado.
