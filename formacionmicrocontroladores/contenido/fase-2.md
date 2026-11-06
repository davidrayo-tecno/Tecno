---
titulo: Fase 2 · Sensores, actuadores y comunicaciones
fase: 2
meses: Meses 4–6
horas: 180 horas
---

# Fase 2 · Sensores, actuadores y comunicaciones

Al terminar esta fase sabes **leer cualquier sensor a partir de su hoja de datos, mover motores de forma segura y hacer que varios dispositivos se comuniquen sin perder datos**.

| | |
| --- | --- |
| **Duración** | 12 semanas · unas 180 horas |
| **Placa** | Arduino Uno |
| **Proyectos** | P5 Estación meteorológica · P6 Banco de motores · P7 Robot · P8 Comunicación entre placas |
| **Examen** | Inclinómetro con un sensor leído sin librería, en 8 horas |

> **Regla de seguridad de esta fase:** los motores nunca se alimentan desde el pin de 5 V del Arduino. Siempre fuente separada y GND común.

---

## P5 · Estación meteorológica con registro {#p5}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★☆☆☆

### El encargo

> Un huerto escolar quiere saber cómo evolucionan la temperatura, la humedad y la presión a lo largo del día para decidir cuándo regar. Necesita un aparato que guarde los datos en una tarjeta, con la hora exacta, y que funcione días sin vigilancia.

### Requisitos

- [ ] **R1.** Mide temperatura, humedad relativa y presión con un sensor BME280 por I2C.
- [ ] **R2.** Guarda una línea cada 60 s en una tarjeta microSD: fecha, hora, temperatura, humedad, presión.
- [ ] **R3.** Un fichero por día, con nombre `AAAAMMDD.CSV`.
- [ ] **R4.** La hora la da un reloj de tiempo real DS3231 con pila: no se pierde al desconectar.
- [ ] **R5.** Si falta la tarjeta o falla la escritura, un LED rojo lo indica y el sistema sigue intentándolo sin bloquearse.
- [ ] **R6.** Funciona **48 horas seguidas** sin perder ninguna medida.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | Módulo BME280 | Comprueba si tu módulo admite 5 V o solo 3,3 V |
| 1 | Módulo de tarjeta microSD | Con regulador y adaptación de niveles |
| 1 | Tarjeta microSD de 32 GB o menos | Formateada en FAT32 |
| 1 | Módulo RTC DS3231 con pila CR2032 | |
| 2 | LED (verde y rojo) y resistencias | |

### Teoría que necesitas

**Leer una hoja de datos.** Antes de conectar, busca en la hoja de datos: tensión de alimentación, consumo, dirección I2C, precisión y rango de medida. El BME280 mide la humedad con ±3 % y la presión con ±1 hPa, y su dirección es 0x76 o 0x77 según un pin.

**3,3 V y 5 V.** Muchos sensores modernos funcionan a 3,3 V y se dañan con señales de 5 V. Los módulos para Arduino suelen llevar un regulador y un adaptador de niveles, pero no todos. Compruébalo en el módulo antes de conectarlo.

**Varios dispositivos I2C.** El BME280 y el DS3231 comparten los mismos dos cables, cada uno con su dirección. Ejecuta el escáner I2C: deben aparecer las dos.

**Bus SPI.** Más rápido que el I2C. Usa cuatro señales: MOSI, MISO, SCK y CS (selección de chip). En el Uno son los pines 11, 12, 13 y normalmente el 10 como CS.

**Ficheros en la tarjeta.** La librería `SD` del Uno solo admite nombres cortos de 8 caracteres más extensión (formato 8.3). Cada escritura debe cerrar el fichero o llamar a `flush()`: si se corta la corriente con datos sin guardar, se pierden.

**La memoria del Uno es muy pequeña.** Solo tiene 2 KB de RAM, y la librería `SD` usa unos 512 bytes. Guarda los textos fijos en la memoria de programa con la macro `F()`: `Serial.println(F("Iniciando"));`

### Plan de trabajo

1. **Requisitos:** decide qué pasa si la tarjeta se llena y qué pasa a medianoche.
2. **Diseño:** esquema con los dos buses (I2C y SPI). Calcula cuánto ocupa un día de datos.
3. **Prototipo:** escáner I2C, ejemplo del BME280, poner en hora el DS3231, ejemplo de escritura en SD. Después, todo junto con `millis()`.
4. **Pruebas:** quita la tarjeta en marcha y vuelve a ponerla. Desconecta la alimentación y comprueba la hora. Deja la estación 48 horas y cuenta las líneas: deben ser 2.880.
5. **Documentación:** README con gráficas de las 48 horas.

### Pistas

<details markdown="1">
<summary>Pista 1 · El sensor no aparece en el escáner</summary>

Prueba las dos direcciones (0x76 y 0x77) y revisa si el módulo necesita 3,3 V. Si usas cables largos, acórtalos: el I2C está pensado para distancias de centímetros.

</details>

<details markdown="1">
<summary>Pista 2 · El programa se reinicia solo o hace cosas raras</summary>

Probablemente te has quedado sin RAM. Mira el mensaje del IDE al compilar («Global variables use…»): si pasa del 75 %, usa `F()` en todos los textos y evita la clase `String`.

</details>

<details markdown="1">
<summary>Pista 3 · ¿Cómo formo el nombre del fichero?</summary>

Usa `snprintf(nombre, sizeof(nombre), "%04d%02d%02d.CSV", anio, mes, dia);` con un `char nombre[13];`.

</details>

### Retos extra

- Calcula la presión a nivel del mar a partir de la altitud de tu casa.
- Añade un pulsador que muestre por el monitor serie el resumen del día: mínima, máxima y media.

### Entrega

- [ ] Esquema con los dos buses.
- [ ] Código.
- [ ] Ficheros CSV de las 48 horas y gráficas.
- [ ] Pruebas de fallo de la tarjeta y de corte de corriente documentadas.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 40 % | 48 horas sin perder datos, R1–R6 cumplidos |
| Robustez | 25 % | Se recupera de fallos de la tarjeta sin bloquearse |
| Código | 15 % | Uso de RAM controlado, sin `String` |
| Documentación | 20 % | Gráficas y análisis de los datos |

---

## P6 · Banco de control de motores {#p6}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★★☆☆

### El encargo

> Un taller de robótica necesita un banco de pruebas para enseñar a sus alumnos los tres tipos de motor: de continua, servo y paso a paso. Cada motor se controla desde un panel con potenciómetros y botones, de forma segura.

### Requisitos

- [ ] **R1.** Motor de continua con velocidad regulable por potenciómetro (PWM) mediante un **MOSFET**, sin cambio de sentido.
- [ ] **R2.** Segundo motor de continua con velocidad y **sentido** mediante un puente H (driver TB6612FNG).
- [ ] **R3.** Servo que sigue la posición de un potenciómetro de 0 a 180°.
- [ ] **R4.** Motor paso a paso que gira un número exacto de vueltas al pulsar un botón y vuelve a su posición inicial con otro.
- [ ] **R5.** Los motores se alimentan de una fuente separada; el Arduino solo da las señales. GND común.
- [ ] **R6.** Mides la corriente de cada motor en vacío y frenándolo con la mano, y dimensionas la fuente con un margen del 30 %.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 2 | Motores de continua pequeños (3–6 V) | |
| 1 | MOSFET de nivel lógico | Por ejemplo, IRLZ44N |
| 1 | Diodo 1N4007 o Schottky 1N5819 | Diodo de protección |
| 1 | Driver de puente H TB6612FNG | |
| 1 | Servo SG90 | |
| 1 | Motor paso a paso 28BYJ-48 con placa ULN2003, o NEMA 17 con driver A4988 | |
| 1 | Fuente de 5–9 V y 2 A o portapilas | Según tus motores |
| 3 | Potenciómetros de 10 kΩ y 2 pulsadores | |

### Teoría que necesitas

**El transistor como interruptor.** Un pin del Arduino da como mucho 20 mA; un motor pequeño pide entre 100 mA y más de 1 A al arrancar. El transistor deja que una señal pequeña controle una corriente grande. Un **MOSFET de nivel lógico** se activa del todo con 5 V en la puerta; uno normal necesita 10 V y con 5 V se calienta.

**Diodo de protección (flyback).** Un motor es una bobina: al cortar la corriente genera un pico de tensión que puede destruir el transistor. Un diodo en paralelo con el motor, en inverso, le da un camino a esa corriente.

**Puente H.** Cuatro interruptores que permiten invertir la polaridad del motor y, por tanto, su sentido. El TB6612FNG integra dos puentes H con protección.

**Servo.** Lleva motor, reductora y control dentro. Recibe un pulso cada 20 ms; su anchura (aproximadamente de 1 a 2 ms) fija el ángulo. La librería `Servo` lo genera por ti.

**Paso a paso.** Gira en pasos exactos sin necesidad de sensor: un NEMA 17 típico tiene 200 pasos por vuelta. El 28BYJ-48 lleva una reductora y necesita unos 2.048 pasos por vuelta. Con el A4988 hay que ajustar el límite de corriente con su potenciómetro antes de conectar el motor.

**Fuente y GND común.** Los motores meten ruido eléctrico y caídas de tensión que reinician el Arduino. Fuente separada para los motores, pero con las masas (GND) unidas para que las señales tengan la misma referencia.

### Plan de trabajo

1. **Requisitos:** busca la hoja de datos de cada motor y del MOSFET. Anota tensión, corriente y par.
2. **Diseño:** esquema completo con fuentes separadas. Calcula la potencia que disipa el MOSFET con la corriente de tu motor y su resistencia de conducción (R<sub>DS(on)</sub>).
3. **Prototipo:** un motor cada vez, con el multímetro en serie para medir la corriente. Después, el panel completo.
4. **Pruebas:** mide corrientes, toca el MOSFET tras 5 minutos a máxima velocidad (¿se calienta?), cuenta vueltas del paso a paso.
5. **Documentación:** tabla de corrientes, cálculo de la fuente y vídeo de cada motor.

### Pistas

<details markdown="1">
<summary>Pista 1 · El Arduino se reinicia al arrancar el motor</summary>

Es la caída de tensión por el pico de corriente del arranque. Comprueba que el motor no toma corriente del Arduino, pon un condensador electrolítico de 100–470 µF en la alimentación de los motores y uno cerámico de 100 nF en bornes del motor.

</details>

<details markdown="1">
<summary>Pista 2 · El servo tiembla</summary>

Suele ser falta de corriente o ruido en el potenciómetro. Alimenta el servo desde la fuente de motores, añade un condensador y filtra la lectura del potenciómetro con una media móvil.

</details>

<details markdown="1">
<summary>Pista 3 · El paso a paso pierde pasos</summary>

Estás pidiendo demasiada velocidad o el límite de corriente es bajo. Baja la velocidad o añade una rampa de aceleración al arrancar y frenar.

</details>

### Retos extra

- Mide la velocidad del motor de continua con un sensor de herradura (óptico) y una rueda ranurada, y muéstrala en rpm.
- Haz que el motor de continua mantenga la velocidad aunque lo frenes un poco (control en lazo cerrado sencillo).

### Entrega

- [ ] Esquema con fuentes separadas y diodos.
- [ ] Cálculos de MOSFET y fuente.
- [ ] Tabla de corrientes medidas.
- [ ] Código.
- [ ] Vídeo de los cuatro motores.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 35 % | R1–R6, sin reinicios |
| Diseño eléctrico seguro | 35 % | Diodos, fuentes y GND correctos, cálculos justificados |
| Código | 10 % | Panel sin bloqueos |
| Documentación | 20 % | Medidas completas |

---

## P7 · Robot que esquiva obstáculos y sigue líneas {#p7}

**Duración:** 4 semanas · unas 60 horas · **Nivel:** ★★★☆☆

### El encargo

> Una feria de ciencia quiere un robot de demostración con dos modos: explorar una habitación sin chocar y recorrer un circuito marcado en el suelo.

### Requisitos

- [ ] **R1.** Chasis de dos ruedas motrices con el driver TB6612FNG.
- [ ] **R2.** **Modo explorador:** avanza y, si detecta un obstáculo a menos de 20 cm, frena, gira y busca el camino más libre.
- [ ] **R3.** **Modo seguidor:** sigue una línea negra de 2 cm sobre fondo claro con un control PID.
- [ ] **R4.** Completa **3 vueltas seguidas** al circuito de prueba sin salirse y 5 minutos de exploración sin chocar.
- [ ] **R5.** Mide la tensión de la batería con un divisor y avisa con un LED cuando baje del 20 %.
- [ ] **R6.** Un botón de parada de emergencia detiene los motores en menos de 100 ms, haga lo que haga el programa.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | Chasis 2WD con motores y ruedas | |
| 1 | Driver TB6612FNG | Del P6 |
| 1 | Sensor de ultrasonidos HC-SR04 | |
| 1 | Barra de 3 a 5 sensores infrarrojos de línea | Tipo TCRT5000 |
| 1 | Batería de litio 2S (7,4 V) con placa de protección (BMS) y cargador adecuado, o portapilas de 6 AA | |
| 2 | Resistencias para el divisor de batería | |
| 1 | Interruptor general y pulsador de emergencia | |

### Teoría que necesitas

**Ultrasonidos.** El HC-SR04 envía un pulso de sonido y mide cuánto tarda en volver. Distancia = tiempo × velocidad del sonido (unos 343 m/s) / 2. En la práctica: **distancia en cm ≈ microsegundos / 58**. `pulseIn()` mide el tiempo, pero bloquea; ponle un tiempo máximo.

**Sensores de línea.** Un LED infrarrojo y un fototransistor: el negro refleja poco y el blanco mucho. Calibra los umbrales con tu suelo y tu luz.

**Control PID.** El error es lo lejos que está la línea del centro. La corrección suma tres términos:

- **P (proporcional):** corrige más cuanto mayor es el error.
- **I (integral):** corrige errores pequeños que duran mucho. En un seguidor de línea casi nunca hace falta.
- **D (derivativo):** frena la corrección si el error ya está bajando rápido. Evita los zigzags.

Se ajusta a mano: primero solo P hasta que oscile, después D hasta que deje de oscilar.

**Baterías de litio.** Dan mucha corriente y son peligrosas si se cortocircuitan, se descargan del todo o se cargan mal. Úsalas siempre con placa de protección (BMS), cárgalas solo con su cargador y nunca sin vigilancia. Una celda va de unos 4,2 V (llena) a unos 3,3 V (vacía).

**Divisor para medir tensiones altas.** El pin analógico solo admite hasta 5 V. Con un divisor, 8,4 V se convierten en algo menor de 5 V. Usa resistencias altas (decenas de kΩ) para no gastar batería.

**Interrupciones.** `attachInterrupt()` en los pines 2 o 3 ejecuta una función en el instante en que cambia la señal, aunque el programa esté ocupado. Las variables compartidas se declaran `volatile`.

### Plan de trabajo

1. **Requisitos:** dibuja el circuito de prueba en cartulina o con cinta aislante.
2. **Diseño:** esquema, cálculo del divisor de batería, diagrama de estados de cada modo.
3. **Prototipo:** motores primero, después ultrasonidos, después sensores de línea, después PID. Cada paso en una rama de Git.
4. **Pruebas:** cronometra las vueltas, anota cada ajuste de PID y su efecto.
5. **Documentación:** README con tabla de ajustes PID y vídeos.

### Pistas

<details markdown="1">
<summary>Pista 1 · El robot no va recto</summary>

Dos motores nunca son iguales. Añade un factor de corrección a la velocidad de uno de ellos y ajústalo a ojo en una línea recta de 2 metros.

</details>

<details markdown="1">
<summary>Pista 2 · ¿Cómo calculo el error con varios sensores?</summary>

Asigna una posición a cada sensor (por ejemplo −2, −1, 0, 1, 2) y calcula la media ponderada de las posiciones de los sensores que ven negro. Ese número es el error.

</details>

<details markdown="1">
<summary>Pista 3 · La parada de emergencia tarda</summary>

Conecta el botón a un pin con interrupción. En la función de interrupción, pon los pines de habilitación del driver a LOW directamente, sin esperar al `loop()`.

</details>

### Retos extra

- Añade un servo que gire el sensor de ultrasonidos para «mirar» a los lados antes de decidir.
- Muestra por Bluetooth (módulo HC-05) los valores del PID y cámbialos desde el móvil sin reprogramar.

### Entrega

- [ ] Esquema y cálculo del divisor.
- [ ] Diagramas de estados.
- [ ] Código.
- [ ] Tabla de ajustes PID.
- [ ] Vídeo de 3 vueltas seguidas y de 5 minutos de exploración (puede ser acelerado).

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 40 % | R1–R6 en la primera grabación |
| Control | 20 % | PID ajustado con método y documentado |
| Seguridad | 20 % | Batería protegida, parada de emergencia real |
| Documentación | 20 % | Proceso de ajuste explicado |

---

## P8 · Dos Arduinos que se comunican {#p8}

**Duración:** 2 semanas · unas 30 horas · **Nivel:** ★★★☆☆

### El encargo

> Una nave industrial necesita leer la temperatura de una cámara que está a 15 metros del cuadro de control y poder encender su ventilador desde allí. Los cables largos meten ruido, así que la comunicación debe detectar y corregir errores.

### Requisitos

- [ ] **R1.** El Arduino A mide la temperatura y controla un LED (el «ventilador»). El Arduino B muestra la temperatura y tiene un botón para encender y apagar el ventilador de A.
- [ ] **R2.** Protocolo propio con trama: byte de inicio, longitud, comando, datos y **suma de comprobación**.
- [ ] **R3.** El receptor responde con confirmación (ACK) o rechazo (NACK); el emisor repite hasta 3 veces si no hay respuesta en 200 ms.
- [ ] **R4.** Primero por UART con 1 metro de cable; después con módulos **RS-485** y al menos 10 metros de cable.
- [ ] **R5.** Prueba de 1.000 mensajes: cuenta cuántos llegan bien, cuántos se repiten y cuántos se pierden.
- [ ] **R6.** Si se desconecta el cable, B muestra «SIN CONEXIÓN» en menos de 3 segundos y se recupera solo al reconectar.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 2 | Arduino Uno o Nano | |
| 2 | Módulos RS-485 (MAX485) | |
| 10–15 m | Cable de par trenzado | Un cable de red viejo sirve |
| 1 | Sensor de temperatura del P3 | |

### Teoría que necesitas

**UART.** Comunicación serie con dos cables cruzados (TX de uno al RX del otro) y GND común. Ambos lados deben usar la misma velocidad (baudios). El Uno tiene un solo UART por hardware, ocupado por el USB; para el segundo usa `SoftwareSerial` en otros pines.

**Tramas.** Los bytes llegan uno a uno y pueden perderse o corromperse. Una trama con un byte de inicio conocido permite saber dónde empieza cada mensaje; la longitud dice cuántos bytes esperar; la suma de comprobación (por ejemplo, el XOR de todos los bytes) detecta errores.

**RS-485.** Transmite la señal como diferencia de tensión entre dos cables trenzados, así el ruido afecta a los dos por igual y se anula. Llega a cientos de metros. Es semidúplex: solo uno habla a la vez, y un pin del módulo elige si se transmite o se recibe.

**Tiempo de espera y reintentos.** Si no llega respuesta en un tiempo, se reenvía. Hay que limitar los reintentos y evitar ejecutar dos veces la misma orden si lo que se perdió fue la confirmación: numera los mensajes.

### Plan de trabajo

1. **Requisitos:** define todos los comandos y su formato en una tabla.
2. **Diseño:** esquema de ambos Arduinos y diagrama de secuencia (quién envía qué y cuándo).
3. **Prototipo:** primero envía un byte; después tramas sin comprobación; después con suma, ACK y reintentos; por último cambia a RS-485.
4. **Pruebas:** la prueba de 1.000 mensajes con 1 m y con 10 m; desconexiones.
5. **Documentación:** especificación del protocolo como si otro equipo tuviera que programar el otro extremo.

### Pistas

<details markdown="1">
<summary>Pista 1 · ¿Cómo recibo una trama sin bloquear?</summary>

Usa una pequeña máquina de estados para la recepción: ESPERANDO_INICIO, LEYENDO_LONGITUD, LEYENDO_DATOS, LEYENDO_COMPROBACION. Cada vez que haya un byte disponible, avanza un estado.

</details>

<details markdown="1">
<summary>Pista 2 · Con RS-485 no llega nada</summary>

Revisa el pin que cambia entre transmitir y recibir: hay que ponerlo en transmisión antes de enviar, esperar a que salga el último byte (`Serial.flush()` en hardware; en `SoftwareSerial` envía y espera) y volver a recepción. Cruza A con A y B con B, no al revés.

</details>

### Retos extra

- Añade un tercer Arduino y haz que B pregunte a A y a C por turnos, cada uno con su dirección (bus maestro-esclavo).
- Implementa el protocolo estándar Modbus RTU en lugar del tuyo.

### Entrega

- [ ] Especificación del protocolo.
- [ ] Esquema y diagrama de secuencia.
- [ ] Código de los dos extremos.
- [ ] Resultados de la prueba de 1.000 mensajes con 1 m y con 10 m.
- [ ] Vídeo de desconexión y recuperación.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 35 % | R1–R6 |
| Protocolo | 30 % | Bien especificado, robusto ante errores y repeticiones |
| Pruebas | 15 % | Estadísticas de errores con conclusiones |
| Documentación | 20 % | Otro programador podría implementarlo |

---

## Examen de salida de la fase 2 {#examen}

### Parte A · Teoría (1 hora)

Preguntas como estas:

1. ¿Por qué hace falta un diodo en paralelo con un motor controlado por transistor?
2. Un motor consume 400 mA y el MOSFET tiene 0,03 Ω de R<sub>DS(on)</sub>. ¿Qué potencia disipa?
3. Diferencias entre I2C, SPI y UART: cables, velocidad y número de dispositivos.
4. ¿Qué hace cada término de un PID?
5. ¿Por qué RS-485 aguanta cables largos y UART no?

### Parte B · Proyecto en 8 horas

**Inclinómetro con aguja.** Lee el acelerómetro MPU-6050 **sin librería**, solo con `Wire` y su hoja de datos de registros: despiértalo, lee la aceleración en los tres ejes, calcula el ángulo de inclinación y muévelo en un servo que hace de aguja. Muestra el ángulo en la LCD.

Entrega: esquema, tabla de registros usados con su función, código y vídeo comparando con el inclinómetro del móvil.

### Para aprobar

- [ ] Parte A: 7 de 10 o más.
- [ ] Parte B: error menor de 3° frente al móvil entre −60° y +60°.
- [ ] Explicas cada registro que lees y escribes.
