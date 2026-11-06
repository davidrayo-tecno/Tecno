---
titulo: Fase 5 · Ingeniería profesional
fase: 5
meses: Meses 14–16
horas: 180 horas
---

# Fase 5 · Ingeniería profesional

Al terminar esta fase diseñas **como en una empresa**: tu propia placa con ESP32 y componentes de montaje superficial, un banco que prueba cada unidad en un minuto, un análisis serio de fallos y el expediente técnico que pide un producto para venderse.

| | |
| --- | --- |
| **Duración** | 12 semanas · unas 180 horas |
| **Placa** | Tu propia placa con módulo ESP32-S3 (o ESP32 WROOM) |
| **Proyectos** | P19 Placa ESP32 propia · P20 Banco de pruebas · P21 Auditoría de fiabilidad · P22 Expediente técnico |
| **Examen** | Revisión de diseño formal, firmware con pruebas automáticas y coste por unidad |

> **Nuevo material en esta fase:** osciloscopio, analizador lógico, fuente de laboratorio y placa calefactora para soldar SMD. Te preparo la lista de compra con precios actuales cuando llegues aquí.

**En paralelo durante toda la fase:** el firmware pasa a ser profesional.

- [ ] Arquitectura en capas: el código que toca el hardware (pines, buses) separado de la lógica de la aplicación.
- [ ] Pruebas unitarias de la lógica con PlatformIO (`pio test`), que se ejecutan en el ordenador sin placa.
- [ ] GitHub Actions compila el firmware y pasa las pruebas en cada cambio.

---

## P19 · Tu propia placa con módulo ESP32 {#p19}

**Duración:** 4 semanas (más el envío) · unas 60 horas · **Nivel:** ★★★★★

### El encargo

> El riego y los sensores funcionan, pero con placas de desarrollo, cables y adaptadores. Quieres tu propia placa: compacta, con USB-C, batería recargable y todo lo necesario, lista para fabricar en serie.

### Requisitos

- [ ] **R1.** Módulo ESP32-S3 (USB nativo, sin chip conversor) o ESP32-WROOM con su conversor USB.
- [ ] **R2.** Conector **USB-C** que carga desde cualquier cargador (resistencias de 5,1 kΩ en los pines CC) y permite programar.
- [ ] **R3.** Cargador de batería de litio de una celda y circuito de alimentación que funciona con o sin batería.
- [ ] **R4.** Regulador de 3,3 V que aguanta los picos de consumo de la WiFi (al menos 500 mA).
- [ ] **R5.** Botones de arranque (BOOT) y reinicio (EN), LED de estado, conector I2C y 6 pines de uso general.
- [ ] **R6.** **Zona libre de cobre bajo la antena** según la hoja de datos del módulo, con la antena en el borde de la placa.
- [ ] **R7.** Componentes SMD de tamaño 0805 o 0603, soldados por ti con pasta y placa calefactora (o montados por el fabricante).
- [ ] **R8.** Puntos de prueba para el P20 en 3,3 V, GND, batería y los pines de programación.
- [ ] **R9.** Revisión de diseño formal conmigo antes de encargarla (es el examen de la fase).

### Teoría que necesitas

**Condensadores de desacoplo.** Cerca de cada pin de alimentación del módulo: uno de 10–22 µF y otro de 100 nF. Suministran los picos de corriente rápidos que la fuente no puede dar a tiempo. Sin ellos, el ESP32 se reinicia al transmitir.

**USB-C.** Para que un cargador USB-C dé 5 V, el dispositivo debe poner una resistencia de 5,1 kΩ a GND en cada pin CC. Sin ellas, los cargadores modernos no dan corriente.

**Gestión de batería.** Un circuito cargador integrado (como el MCP73831 o el TP4056) carga la celda con corriente constante y luego tensión constante hasta 4,2 V. Un circuito de *power path* permite usar el USB y cargar a la vez.

**Antena.** La antena impresa del módulo necesita espacio libre: nada de cobre, pistas ni componentes debajo ni muy cerca. Si no, el alcance cae mucho.

**Soldadura SMD.** Se aplica pasta de soldar con una plantilla (stencil), se colocan los componentes con pinzas y se calienta en una placa calefactora hasta que la pasta se funde. Los puentes entre pines se corrigen con flux y malla.

**Diseño para fabricación (DFM).** Reglas del fabricante (anchos y separaciones mínimos), componentes de un tamaño que puedas soldar, todos en una cara si es posible, y marcas de referencia (fiduciales) si lo va a montar una máquina.

### Plan de trabajo

1. **Requisitos:** elige cada circuito integrado leyendo su hoja de datos y su circuito de aplicación recomendado.
2. **Diseño:** esquema por bloques (alimentación, USB, módulo, periféricos), colocación cuidando la antena y el desacoplo, ruteo y plano de masa.
3. **Revisión:** usa la lista de comprobación de revisión de diseño de las plantillas y envíamela con el diseño.
4. **Fabricación y montaje:** encarga placas y plantilla; suelda por bloques: primero alimentación y prueba; después el resto.
5. **Pruebas:** tensiones, consumo, carga de la batería, alcance WiFi frente a una placa de desarrollo.

### Pistas

<details markdown="1">
<summary>Pista 1 · ¿Por dónde empiezo el esquema?</summary>

Copia el circuito de referencia de la hoja de datos del módulo (Espressif publica esquemas de sus placas de desarrollo). Entiende cada componente antes de copiarlo y adapta solo lo que necesites.

</details>

<details markdown="1">
<summary>Pista 2 · Monta por bloques</summary>

Suelda primero solo la alimentación y comprueba 3,3 V sin carga. Así, si algo está mal, no se queman el módulo ni la batería.

</details>

### Entrega

- [ ] Proyecto de KiCad, esquema en PDF y capturas.
- [ ] Lista de comprobación de revisión de diseño cumplimentada.
- [ ] Fotos de la placa montada (con lupa) y medidas de prueba.
- [ ] Comparación de alcance WiFi.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 30 % | Todo funciona con 2 correcciones como máximo |
| Calidad del diseño | 30 % | Desacoplo, antena, alimentación y protecciones correctos |
| Fabricabilidad | 20 % | Cumple las reglas del fabricante, puntos de prueba, serigrafía |
| Documentación | 20 % | Revisión de diseño y lista de errores honestas |

---

## P20 · Banco de pruebas automático {#p20}

**Duración:** 2,5 semanas · unas 40 horas · **Nivel:** ★★★★☆

### El encargo

> Vas a fabricar 5 unidades (y quizá 100 algún día). No puedes probar cada placa a mano durante media hora: necesitas un banco que diga «correcto» o «defectuosa» en un minuto.

### Requisitos

- [ ] **R1.** Utillaje con agujas de prueba (pogo pins) que hace contacto con los puntos de prueba de tu placa del P19, sin soldar nada.
- [ ] **R2.** Un controlador de pruebas (otro ESP32 o un Arduino) mide las tensiones de la placa y su consumo (por ejemplo, con un sensor INA219).
- [ ] **R3.** Un script de Python en el ordenador graba el firmware de prueba con `esptool`, lanza las pruebas y lee los resultados por el puerto serie.
- [ ] **R4.** El firmware de prueba comprueba cada periférico (LED, botones, I2C, WiFi) y devuelve los resultados.
- [ ] **R5.** Resultado final: **CORRECTA** o **DEFECTUOSA** con el motivo, en menos de 60 segundos por placa.
- [ ] **R6.** Cada prueba se guarda en un CSV con el número de serie de la placa, la fecha y todas las medidas.

### Teoría que necesitas

**Pruebas de producción.** No buscan errores de diseño (eso ya se hizo), sino defectos de fabricación: soldaduras abiertas, puentes, componentes al revés. Cada prueba debe tener un límite (por ejemplo, 3,3 V ± 3 %).

**Utillaje de agujas.** Una base (impresa en 3D o de metacrilato) con agujas con muelle colocadas exactamente sobre los puntos de prueba. Se diseña a partir de las coordenadas que exporta KiCad.

**Automatización con Python.** La librería `pyserial` habla con las placas; `esptool` graba el firmware desde un script.

### Entrega

- [ ] Diseño del utillaje y del controlador.
- [ ] Script y firmware de prueba.
- [ ] CSV con las pruebas de tus placas.
- [ ] Vídeo probando una placa buena y una con un defecto provocado.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Funcionamiento | 35 % | R1–R6, menos de 60 s |
| Cobertura | 30 % | Detecta los defectos provocados (cada periférico) |
| Trazabilidad | 15 % | Registro completo por número de serie |
| Documentación | 20 % | Otra persona puede usar el banco con tus instrucciones |

---

## P21 · Auditoría de fiabilidad {#p21}

**Duración:** 3 semanas · unas 45 horas · **Nivel:** ★★★★☆

### El encargo

> Antes de instalar el riego en casa de otras personas, quieres saber cómo puede fallar y estar seguro de que, si falla, lo hace de forma segura.

### Requisitos

- [ ] **R1.** Con el **osciloscopio**: mide el rizado de la alimentación de 3,3 V y la caída de tensión durante los picos de la WiFi.
- [ ] **R2.** Con el **analizador lógico** y PulseView: decodifica el tráfico I2C de tus sensores y mide los tiempos de subida de las señales.
- [ ] **R3.** Provoca fallos y documenta qué pasa: tensión bajando poco a poco con la fuente de laboratorio, corte de WiFi, sensor desconectado, motor o relé ruidoso cerca, alimentación con polaridad invertida (con protección).
- [ ] **R4.** Tabla de análisis de modos de fallo (AMFE): cada fallo, su efecto, su gravedad, su probabilidad y su solución.
- [ ] **R5.** Añade las protecciones que falten: detector de caída de tensión (*brown-out*), fusible rearmable, diodo TVS, comprobación CRC de la configuración guardada.
- [ ] **R6.** Repite las pruebas con las protecciones y compara.

### Teoría que necesitas

**Osciloscopio.** Muestra cómo cambia una tensión en el tiempo. Aprende a ajustar la escala vertical y horizontal, el disparo (*trigger*) y el acoplamiento AC para ver el rizado. Conecta siempre la pinza de masa de la sonda a GND.

**Analizador lógico.** Captura muchas señales digitales a la vez y las decodifica (I2C, SPI, UART). Uno barato con el programa libre PulseView basta para estas velocidades.

**AMFE (análisis modal de fallos y efectos).** Método estándar de la industria: se puntúan la gravedad, la ocurrencia y la detectabilidad de cada fallo, y se atiende primero a los de mayor puntuación.

**Fallar de forma segura.** El diseño debe llevar el sistema a un estado inofensivo ante cualquier fallo: válvulas cerradas, motores parados.

### Entrega

- [ ] Capturas del osciloscopio y del analizador lógico, explicadas.
- [ ] Tabla AMFE.
- [ ] Cambios de hardware y firmware hechos, con las pruebas antes y después.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Medidas | 30 % | Bien hechas e interpretadas |
| Análisis | 30 % | AMFE completo y priorizado |
| Mejoras | 20 % | Las mejoras corrigen lo encontrado, demostrado con pruebas |
| Documentación | 20 % | Clara, con capturas |

---

## P22 · Expediente técnico de producto {#p22}

**Duración:** 2,5 semanas · unas 35 horas · **Nivel:** ★★★★☆

### El encargo

> Un vivero de Sevilla está interesado en vender tu sistema de riego. Antes de hablar de precios, necesitas saber cuánto cuesta fabricarlo y qué hace falta legalmente para venderlo en Europa.

### Requisitos

- [ ] **R1.** **Lista de materiales (BOM)** completa con referencia de fabricante, proveedor y precio para 10 y para 100 unidades.
- [ ] **R2.** Coste total por unidad para 10 y 100 unidades: placa, montaje, componentes, caja, embalaje y pruebas.
- [ ] **R3.** **Ficha técnica** de una página: características, alimentación, consumo, conectividad, condiciones de uso.
- [ ] **R4.** **Manual de usuario** con instalación, uso, mantenimiento y avisos de seguridad.
- [ ] **R5.** **Análisis de normativa** para el marcado CE: qué directivas y normas aplican, qué pruebas harían falta y su coste estimado (no se certifica, se estudia).
- [ ] **R6.** Análisis de riesgos del producto (puedes partir de tu AMFE del P21).

### Teoría que necesitas

**Marcado CE.** Para vender un aparato electrónico en la Unión Europea, el fabricante declara que cumple las directivas que le aplican. Un dispositivo con WiFi o Bluetooth entra en la **Directiva de equipos radioeléctricos (RED, 2014/53/UE)**, que incluye los requisitos de compatibilidad electromagnética y seguridad eléctrica. Usar un módulo de radio ya certificado simplifica mucho, pero el producto final también debe evaluarse.

**Ciberseguridad.** Desde agosto de 2025, los equipos radio conectados a internet deben cumplir requisitos de ciberseguridad de la RED (Reglamento Delegado (UE) 2022/30, normas EN 18031): contraseñas no por defecto, actualizaciones seguras, protección de datos. El Reglamento de Ciberresiliencia de la UE ampliará estas obligaciones en los próximos años. Compruébalo cuando llegues aquí: esta normativa cambia.

**RoHS y RAEE.** RoHS limita sustancias peligrosas (como el plomo) en los componentes. RAEE regula la recogida y el reciclaje de los aparatos al final de su vida.

**Coste de producto.** El precio de venta suele ser varias veces el coste de fabricación: hay que cubrir garantía, soporte, certificación, distribución y margen.

### Entrega

- [ ] BOM en hoja de cálculo.
- [ ] Ficha técnica, manual de usuario y análisis de normativa en PDF.
- [ ] Análisis de riesgos.

### Cómo se evalúa

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| BOM y costes | 35 % | Completa, con precios reales y costes ocultos incluidos |
| Normativa | 30 % | Directivas y normas correctas, plan de pruebas realista |
| Documentación de usuario | 20 % | Manual y ficha profesionales |
| Riesgos | 15 % | Coherentes con el AMFE |

---

## Examen de salida de la fase 5 {#examen}

- [ ] **Revisión de diseño formal** de la placa del P19, antes de fabricarla, con la lista de comprobación de las plantillas. Te haré las preguntas que haría un ingeniero jefe; si hay errores graves, se corrigen y se repite.
- [ ] **Firmware con pruebas automáticas:** las pruebas unitarias pasan en GitHub Actions en cada cambio, y cubren la lógica de riego y de seguridad.
- [ ] **Coste por unidad** calculado para 10 y para 100 unidades, y defendido.
- [ ] **AMFE** con al menos 15 modos de fallo y sus soluciones aplicadas.
