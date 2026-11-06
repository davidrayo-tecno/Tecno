---
titulo: Fase 4 · ESP32 e Internet de las cosas
fase: 4
meses: Meses 10–13
horas: 240 horas
---

# Fase 4 · ESP32 e Internet de las cosas

Al terminar esta fase haces **dispositivos conectados que se controlan desde el móvil, se actualizan a distancia y funcionan meses sin tocarlos**. El proyecto central es un sistema de riego real para tu patio.

| | |
| --- | --- |
| **Duración** | 16 semanas · unas 240 horas |
| **Placa** | ESP32 (por ejemplo, ESP32-DevKitC con módulo WROOM) |
| **Proyectos** | P14 Panel web · P15 Sensor IoT a batería · P16 Riego inteligente · P17 Bluetooth · P18 FreeRTOS |
| **Examen** | El riego funcionando 30 días en el patio, con defensa de su arquitectura |

> **El salto de Arduino a ESP32:** el ESP32 trabaja a **3,3 V**. Sus pines no toleran 5 V. Revisa cada sensor y módulo antes de conectarlo.

---

## P14 · Panel de control web en ESP32 {#p14}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★★☆☆

### El encargo

> Quieres controlar las luces del patio y ver su temperatura desde el móvil, sin instalar ninguna app: solo abriendo una página web en la red de casa.

### Requisitos

- [ ] **R1.** El ESP32 se conecta a la WiFi de casa y se le encuentra por nombre (`patio.local`) gracias a mDNS.
- [ ] **R2.** Sirve una página web adaptada al móvil con: temperatura actual, 2 interruptores para 2 LED (las «luces») y un deslizador de brillo.
- [ ] **R3.** La página se actualiza sola cada 2 s sin recargar entera.
- [ ] **R4.** La primera vez, si no conoce ninguna WiFi, crea su propia red para que le des la contraseña desde el móvil (modo punto de acceso).
- [ ] **R5.** La contraseña de la WiFi no está escrita en el código.
- [ ] **R6.** Si se cae la WiFi, se reconecta solo sin reiniciarse.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 3 | Placas de desarrollo ESP32 | Una para cada proyecto en paralelo |
| 1 | Sensor de temperatura de 3,3 V | El DS18B20 funciona a 3,3 V |
| 2 | LED y resistencias | Recalcula: ahora la tensión es 3,3 V |

### Teoría que necesitas

**Diferencias con el Arduino Uno.** Dos núcleos a 240 MHz, 520 KB de RAM, WiFi y Bluetooth. Pines a 3,3 V. El ADC tiene 12 bits pero no es lineal en los extremos, y los pines del ADC2 no funcionan con la WiFi activa: usa los del ADC1. Algunos pines tienen funciones especiales al arrancar (0, 2, 5, 12, 15) y los 6 a 11 están ocupados por la memoria flash.

**Preparar el entorno.** Instala el soporte de placas ESP32 de Espressif en el IDE de Arduino o, mejor, usa PlatformIO como en el P13.

**Servidor web.** El ESP32 responde a peticiones HTTP: a `/` devuelve la página HTML y a rutas como `/api/estado` devuelve datos en JSON que la página lee con JavaScript (`fetch`). Guarda la página como fichero en el sistema de archivos LittleFS en lugar de dentro del código.

**Guardar ajustes.** La librería `Preferences` guarda datos (como la contraseña de la WiFi) en la memoria flash, y se conservan al apagar.

**Reconexión.** Comprueba periódicamente `WiFi.status()` y reconecta si hace falta; no esperes en un bucle infinito.

### Plan de trabajo

1. Ejemplo de conexión WiFi y de servidor web sencillo.
2. API en JSON y página que la consulta.
3. Modo punto de acceso para configurar la WiFi y guardado en `Preferences`.
4. Pruebas: apaga el router 2 minutos y vuelve a encenderlo; prueba desde dos móviles a la vez.

### Pistas

<details markdown="1">
<summary>Pista 1 · No me deja subir el programa</summary>

Muchas placas necesitan que mantengas pulsado el botón BOOT al empezar la subida. Si el puerto no aparece, instala el controlador del chip USB de tu placa (CP210x o CH340).

</details>

<details markdown="1">
<summary>Pista 2 · ¿Cómo configuro la WiFi desde el móvil?</summary>

Puedes programarlo tú (el ESP32 en modo punto de acceso y una página con un formulario) o usar una librería como WiFiManager. Hazlo tú primero: entenderás cómo funciona.

</details>

### Entrega

- [ ] Esquema, código y ficheros de la página web.
- [ ] Vídeo usando el panel desde el móvil y de la reconexión tras apagar el router.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 40 % | R1–R6 |
| Robustez de red | 25 % | Reconexión sin reinicios ni bloqueos |
| Código y web | 15 % | Página separada del firmware, API clara |
| Documentación | 20 % | Instrucciones de configuración para un usuario |

---

## P15 · Sensor IoT a batería con MQTT {#p15}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★★☆☆

### El encargo

> Quieres medir la temperatura y la humedad del dormitorio, el salón y el patio, y verlas juntas en un panel con gráficas históricas. Los sensores deben ir a pilas o batería y durar meses.

### Requisitos

- [ ] **R1.** Un servidor MQTT (Mosquitto) en tu ordenador o en una Raspberry Pi.
- [ ] **R2.** El sensor se despierta cada 5 minutos, mide, publica en MQTT y vuelve a **reposo profundo**.
- [ ] **R3.** Un panel (Home Assistant o Node-RED) muestra el valor actual y la gráfica de las últimas 24 horas.
- [ ] **R4.** El sensor publica también la tensión de su batería.
- [ ] **R5.** Tiempo despierto menor de 2 segundos por ciclo, medido.
- [ ] **R6.** Autonomía calculada de al menos 3 meses con una batería de 18650.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 1 | ESP32 con bajo consumo en reposo | Algunas placas gastan mucho dormidas; mira el P11 |
| 1 | Sensor BME280 | Del P5 |
| 1 | Batería 18650 con protección y regulador de 3,3 V de bajo consumo | Por ejemplo, un regulador LDO tipo HT7333 o MCP1700 |
| 1 | Raspberry Pi u ordenador para el servidor | |

### Teoría que necesitas

**MQTT.** Protocolo ligero de mensajes con un servidor central (*broker*). Los dispositivos **publican** en temas (`casa/patio/temperatura`) y otros se **suscriben** a esos temas. Quien publica no necesita saber quién escucha.

**Calidad de servicio y mensajes retenidos.** Con *retain*, el broker guarda el último valor y se lo da a quien se conecte después. Útil para estados.

**Reposo profundo (deep sleep).** El ESP32 apaga casi todo y gasta unos 10 µA (el módulo; la placa de desarrollo suele gastar más). Al despertar, el programa empieza desde `setup()`. Las variables que deban sobrevivir se marcan con `RTC_DATA_ATTR`.

**Conectar rápido.** La WiFi es lo que más gasta. Para reducir el tiempo despierto: IP fija, guardar el canal de la WiFi y desactivar todo lo que no uses.

### Plan de trabajo

1. Instala Mosquitto y prueba publicar y suscribirte desde el ordenador.
2. ESP32 despierto publicando cada 5 s.
3. Añade el reposo profundo y mide el tiempo despierto con un pin que se enciende al despertar y se apaga al dormir (o con el multímetro).
4. Panel con gráficas. Calcula la autonomía.

### Pistas

<details markdown="1">
<summary>Pista 1 · Tarda 4 o 5 segundos en conectar</summary>

La petición de IP por DHCP y la búsqueda del canal tardan. Configura IP fija y guarda el canal y el identificador del router en memoria RTC tras la primera conexión.

</details>

### Entrega

- [ ] Esquema, código y configuración del broker y del panel.
- [ ] Captura del panel con 24 horas de datos.
- [ ] Medida del tiempo despierto y cálculo de autonomía.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 35 % | R1–R6 |
| Consumo | 30 % | Tiempo despierto optimizado y medido |
| Integración | 15 % | Panel útil y temas MQTT bien organizados |
| Documentación | 20 % | Cálculo de autonomía con datos reales |

---

## P16 · Riego inteligente para tu patio {#p16}

**Duración:** 5 semanas · unas 75 horas · **Nivel:** ★★★★☆

### El encargo

> En Sevilla, en verano, regar a la hora equivocada desperdicia agua y quema las plantas. Quieres un sistema que riegue las jardineras de las dos paredes soleadas a la mejor hora, que no riegue si va a llover o la tierra está húmeda, y que se controle desde el móvil.

### Requisitos

- [ ] **R1.** Dos zonas de riego, cada una con una electroválvula de 12 V normalmente cerrada.
- [ ] **R2.** Un sensor de humedad del suelo capacitivo por zona, calibrado en seco y en agua.
- [ ] **R3.** Programación horaria por zona desde una página web: hora de inicio, duración y días de la semana. Hora exacta por internet (NTP).
- [ ] **R4.** No riega si la humedad del suelo supera un umbral o si la previsión meteorológica da más de 2 mm de lluvia en las próximas 12 horas (consultando un servicio gratuito como Open-Meteo).
- [ ] **R5.** Riego manual desde la web con un tiempo máximo.
- [ ] **R6.** **Seguridad del agua:** ninguna válvula puede estar abierta más de 30 minutos seguidos pase lo que pase, y al reiniciarse todas arrancan cerradas.
- [ ] **R7.** Registro de los últimos 100 eventos (riegos, omisiones y motivo, errores) visible en la web.
- [ ] **R8.** Actualización del firmware por WiFi (OTA).
- [ ] **R9.** Electrónica en caja estanca para exterior, con conectores de exterior para válvulas y sensores.

### Material

| Cantidad | Componente | Nota |
| --- | --- | --- |
| 2 | Electroválvulas de 12 V normalmente cerradas | Comprueba su corriente en la hoja de datos |
| 1 | Fuente de 12 V | Con margen para las dos válvulas a la vez |
| 1 | Regulador de 12 V a 5 V o 3,3 V | Conmutado, para no calentarse |
| 2 | MOSFET que conduzcan bien con 3,3 V en la puerta, y diodos | Revisa la curva de la hoja de datos a 3,3 V |
| 2 | Sensores de humedad capacitivos | |
| 1 | Caja estanca y prensaestopas | |

### Teoría que necesitas

**MOSFET a 3,3 V.** Muchos MOSFET «de nivel lógico» están pensados para 5 V y con 3,3 V conducen a medias y se calientan. Busca en la hoja de datos la R<sub>DS(on)</sub> garantizada con V<sub>GS</sub> = 2,5 V o 3,3 V, o usa un transistor previo como excitador.

**Electroválvulas.** Son bobinas: necesitan diodo de protección como los motores. Las normalmente cerradas cortan el agua si falla la corriente: el modo de fallo seguro.

**Sensores capacitivos de humedad.** No se corroen como los resistivos, pero su lectura depende del suelo y la temperatura. Calibra: valor en seco y valor en agua, y conviértelo a un porcentaje relativo. Los hay de calidad muy variable; comprueba que el tuyo da valores estables.

**Peticiones a una API.** El ESP32 hace una petición HTTPS a un servicio meteorológico y recibe un JSON con la previsión. La librería ArduinoJson lo convierte en datos.

**Hora por internet (NTP).** `configTime()` sincroniza el reloj con servidores de hora y aplica la zona horaria de España con sus cambios de horario de verano.

**Actualización OTA.** La memoria se divide en dos particiones de programa: la nueva versión se escribe en la que no está en uso y, si arranca bien, pasa a ser la principal. Protege la actualización con contraseña.

**Perro guardián (watchdog).** Un temporizador que reinicia el chip si el programa se cuelga. Combinado con R6, garantiza que una válvula nunca se quede abierta por un error.

### Plan de trabajo

1. **Requisitos:** mide tu patio, decide la longitud de tubería y goteros por zona, y estima el caudal.
2. **Diseño:** esquema completo y caja; diagrama de estados de cada zona; lista de eventos del registro.
3. **Prototipo:** primero en mesa con LED en lugar de válvulas; después con válvulas y un cubo; por último en el patio.
4. **Pruebas:** simula fallos: corta la WiFi a mitad de un riego, desenchufa un sensor, cuelga el programa a propósito.
5. **Documentación:** manual de usuario de una página y documentación técnica.

### Pistas

<details markdown="1">
<summary>Pista 1 · ¿Cómo garantizo los 30 minutos máximos?</summary>

Guarda la hora de apertura de cada válvula y compruébala en cada vuelta del programa, independientemente de la lógica de riego. Si se pasa, ciérrala y registra un error. El watchdog cubre el caso de que el programa se cuelgue.

</details>

<details markdown="1">
<summary>Pista 2 · La petición a la API falla a veces</summary>

Es normal en internet. Si falla, reintenta más tarde y, mientras tanto, decide con la humedad del suelo. Nunca bloquees el riego entero por un fallo de la previsión: registra el error.

</details>

### Entrega

- [ ] Esquema, caja y lista de materiales.
- [ ] Código y página web.
- [ ] Pruebas de fallo documentadas.
- [ ] Manual de usuario.
- [ ] Fotos de la instalación en el patio.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 30 % | R1–R9 |
| Seguridad y fiabilidad | 30 % | Pasa todas las pruebas de fallo; nunca deja agua corriendo |
| Diseño | 20 % | MOSFET y fuente bien elegidos, caja apta para exterior |
| Documentación | 20 % | Manual de usuario que entiende cualquiera |

---

## P17 · Mando por Bluetooth de baja energía {#p17}

**Duración:** 2 semanas · unas 30 horas · **Nivel:** ★★★☆☆

### El encargo

> Si se cae la WiFi de casa, quieres poder abrir el riego desde el móvil o desde un pequeño mando con botones, sin depender de internet.

### Requisitos

- [ ] **R1.** El ESP32 ofrece un servicio BLE con: humedad de cada zona (notificaciones cada 5 s) y orden de riego manual (escritura).
- [ ] **R2.** Lo pruebas con una app genérica (por ejemplo, nRF Connect).
- [ ] **R3.** Un segundo ESP32 con 2 botones hace de mando: se conecta solo y manda las órdenes.
- [ ] **R4.** Las órdenes por BLE requieren emparejamiento con código.
- [ ] **R5.** BLE y WiFi funcionan a la vez en el ESP32 del riego.

### Teoría que necesitas

**BLE.** Diseñado para gastar muy poco. Un dispositivo (servidor) ofrece **servicios**, y cada servicio tiene **características**: valores que se leen, se escriben o que avisan cuando cambian (notificaciones). Cada uno se identifica con un UUID.

**Librería NimBLE.** Más ligera que la librería BLE por defecto: deja más memoria para la WiFi.

**Seguridad.** Por defecto, cualquiera cerca puede conectarse. El emparejamiento con código y el cifrado lo evitan.

### Entrega

- [ ] Tabla de servicios y características con sus UUID.
- [ ] Código del riego ampliado y del mando.
- [ ] Vídeo usando el mando con la WiFi apagada.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 45 % | R1–R5 |
| Seguridad | 20 % | Emparejamiento real |
| Diseño del servicio | 15 % | Características bien definidas |
| Documentación | 20 % | Tabla de UUID y uso |

---

## P18 · El riego, reescrito con FreeRTOS {#p18}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★★★☆

### El encargo

> El código del riego ha crecido: web, previsión, sensores, válvulas y Bluetooth en un solo `loop()`. Cuando la previsión tarda, todo se retrasa. Toca reorganizarlo como un sistema profesional, con tareas independientes.

### Requisitos

- [ ] **R1.** Al menos 4 tareas de FreeRTOS: sensores, válvulas (lógica de riego y seguridad), red (web y MQTT) y previsión.
- [ ] **R2.** Las tareas se comunican con **colas** y protegen los datos compartidos con **mutex**; ninguna variable global se toca desde dos tareas sin protección.
- [ ] **R3.** La tarea de válvulas tiene la máxima prioridad: una petición web lenta no retrasa el cierre de una válvula.
- [ ] **R4.** El watchdog de tareas vigila que todas sigan vivas.
- [ ] **R5.** Mides y documentas la pila (memoria) que usa cada tarea y la ajustas.
- [ ] **R6.** Haces una pequeña prueba con **ESP-IDF** (el entorno oficial de Espressif): compilas un ejemplo, usas `menuconfig` y los mensajes de registro `ESP_LOGI`.

### Teoría que necesitas

**Sistema operativo en tiempo real.** FreeRTOS reparte el procesador entre tareas según su prioridad, muchas veces por segundo. Cada tarea es como un pequeño `loop()` independiente. El ESP32 ya lo usa por debajo en el entorno de Arduino.

**Colas.** Una tarea deja mensajes y otra los recoge en orden. Es la forma segura de pasar datos entre tareas.

**Mutex.** Un candado: solo una tarea a la vez puede usar un recurso compartido (una variable, el bus I2C). Si se olvida soltar, el sistema se bloquea.

**Pila de cada tarea.** Cada tarea tiene su propia memoria para variables locales. Si se queda corta, el chip se reinicia. `uxTaskGetStackHighWaterMark()` dice cuánta le ha sobrado como mínimo.

### Plan de trabajo

1. Dibuja la arquitectura: tareas, colas, mutex y quién envía qué.
2. Migra una tarea cada vez, empezando por la de válvulas.
3. Prueba de estrés: muchas peticiones web seguidas mientras riega; comprueba los tiempos de cierre.
4. Pequeño proyecto de prueba en ESP-IDF.

### Entrega

- [ ] Diagrama de arquitectura.
- [ ] Código.
- [ ] Tabla de prioridades y memoria de cada tarea.
- [ ] Resultado de la prueba de estrés.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Arquitectura | 40 % | Tareas con una sola responsabilidad, comunicación solo por colas o con mutex |
| Tiempo real | 25 % | El cierre de válvulas no se retrasa nunca en la prueba de estrés |
| Medidas | 15 % | Memoria de pila medida y ajustada |
| Documentación | 20 % | Diagrama que coincide con el código |

---

## Examen de salida de la fase 4 {#examen}

### Prueba de campo (30 días)

- [ ] El riego del P18 funciona **30 días seguidos** en el patio, sin reinicios inesperados (el registro lo demuestra).
- [ ] Haces al menos una actualización OTA durante esos días, sin tocar el aparato.
- [ ] Me envías el registro completo y un resumen: riegos hechos, omitidos (y por qué) y agua estimada.

### Defensa (1 hora conmigo)

- [ ] Dibujas la arquitectura de memoria (tareas, colas, servicios) y defiendes cada decisión.
- [ ] Respondes preguntas como: ¿qué pasa si se va la luz a mitad de un riego? ¿Y si la API devuelve datos absurdos? ¿Y si alguien de la calle se conecta por Bluetooth?
