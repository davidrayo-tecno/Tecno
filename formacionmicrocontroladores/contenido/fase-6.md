---
titulo: Fase 6 · Proyecto final de envergadura
fase: 6
meses: Meses 17–20
horas: 270 horas
---

# Fase 6 · Proyecto final de envergadura

Al terminar esta fase tienes **un sistema completo, fabricado, probado en uso real y documentado** que puedes enseñar a un cliente o a una empresa como prueba de que diseñas proyectos profesionales con microcontroladores.

| | |
| --- | --- |
| **Duración** | 18 semanas · unas 270 horas |
| **Placas** | Las tuyas: diseño propio basado en ESP32 (y ATmega328P donde convenga) |
| **Proyecto** | P23 · Proyecto final |
| **Examen** | Defensa ante tribunal |

---

## P23 · El proyecto final {#p23}

### Requisitos mínimos

Sea cual sea el proyecto que elijas, debe cumplir todo esto:

- [ ] **R1.** Sistema distribuido de **3 nodos o más** que se comunican entre sí (WiFi, ESP-NOW, LoRa, RS-485 o BLE).
- [ ] **R2.** **PCB propia** en todos los nodos, con el diseño revisado conmigo.
- [ ] **R3.** **Caja** adecuada al entorno de uso.
- [ ] **R4.** Firmware con arquitectura en capas, FreeRTOS donde haga falta, **actualización OTA** y pruebas automáticas.
- [ ] **R5.** **Panel de usuario** (web o app) con datos actuales, histórico y control.
- [ ] **R6.** **5 unidades** del nodo principal fabricadas y pasadas por un banco de pruebas.
- [ ] **R7.** **30 días** funcionando en uso real, con registro de incidencias.
- [ ] **R8.** Expediente técnico completo: requisitos, diseño, pruebas, BOM y costes, manual, análisis de riesgos y de normativa.
- [ ] **R9.** Presupuesto de materiales cerrado al principio y cumplido (±15 %).

### Elige tu proyecto

Propón el tuyo si tienes una idea mejor; lo valoramos juntos con los mismos requisitos. Estas son tres propuestas pensadas para tu situación:

#### Opción A · Monitor de energía de la vivienda

Mide el consumo eléctrico por circuitos (cocina, aire acondicionado, termo, resto) y muestra en tiempo real y en histórico cuánto gasta cada uno, con avisos de consumo anormal y estimación de la factura.

- **Nodos:** un medidor por grupo de circuitos con pinzas amperimétricas no invasivas, una pasarela WiFi y el panel.
- **Lo difícil:** medir corriente alterna con precisión (muestreo rápido, cálculo de valor eficaz y potencia real), calibración y aislamiento.
- **Seguridad:** las pinzas no invasivas no tocan los cables de 230 V, pero **la instalación en el cuadro eléctrico la hace un electricista autorizado**. La tensión de red se mide, si hace falta, con un transformador aislado, nunca directamente.

#### Opción B · Control de huerto o invernadero multizona

Varios nodos a batería o solares con sensores de suelo y ambiente, válvulas por zona y una pasarela que decide el riego con datos de todos los nodos y la previsión meteorológica. Es la evolución natural de tu riego del patio.

- **Nodos:** sensores de zona (bajo consumo, a batería con placa solar), actuadores de válvulas y una pasarela WiFi.
- **Lo difícil:** comunicación de largo alcance y bajo consumo (ESP-NOW alcanza decenas o cientos de metros; LoRa en 868 MHz, kilómetros, con limitación legal del tiempo de emisión), energía solar y robustez en exterior.

#### Opción C · Producto para un cliente real

Un negocio de Sevilla con un problema concreto: control de temperatura de cámaras frigoríficas con alarmas, contador de aforo de un local, gestión de un taller o de una academia.

- **Lo difícil:** requisitos de un cliente real, que cambian; plazos; formar al cliente; dar soporte.
- **Lo valioso:** es la mejor carta de presentación profesional, sobre todo si el cliente te da una referencia.

### Etapas e hitos

Cada hito termina con una revisión conmigo. No se pasa al siguiente sin cerrarla.

| Semanas | Etapa | Hito y entregable |
| --- | --- | --- |
| 1–2 | Requisitos y presupuesto | Documento de requisitos medibles, arquitectura general, presupuesto y plan |
| 3–6 | Diseño | Esquemas y PCB de todos los nodos, arquitectura del firmware y del panel. **Revisión de diseño** antes de encargar |
| 7–10 | Prototipo | Primera versión de todos los nodos comunicándose; lista de fallos y cambios |
| 11–13 | Preserie | 5 unidades del nodo principal fabricadas, probadas en el banco, con trazabilidad |
| 14–17 | Prueba de campo | 30 días en uso real, con informe semanal de incidencias y actualizaciones OTA |
| 18 | Cierre y defensa | Expediente técnico, vídeo de 3 minutos y defensa |

### Teoría según tu opción

Te daré la teoría específica al cerrar la etapa de requisitos. Como orientación:

- **Opción A:** muestreo y cálculo de valor eficaz (RMS), potencia activa y factor de potencia; transformadores de corriente y su resistencia de carga; precisión y calibración.
- **Opción B:** ESP-NOW o LoRa y sus límites legales de emisión; energía solar y carga de baterías; protección contra humedad y rayos UV.
- **Opción C:** toma de requisitos con un cliente, gestión de cambios, contrato y responsabilidad, soporte.

### Cómo se evalúa el proyecto final

| Criterio | Peso | Para el máximo |
| --- | --- | --- |
| Cumplimiento de requisitos | 25 % | R1–R9 y los requisitos propios del proyecto, demostrados con pruebas |
| Calidad de ingeniería | 25 % | Hardware y firmware que un profesional firmaría |
| Fiabilidad en campo | 20 % | 30 días con incidencias resueltas y documentadas |
| Gestión del proyecto | 10 % | Plazos y presupuesto cumplidos o desvíos justificados |
| Documentación | 20 % | Expediente que permitiría a otro ingeniero fabricarlo y mantenerlo |

---

## Defensa final {#examen}

Una sesión de unas 2 horas conmigo como tribunal:

- [ ] **Presentación técnica de 20 minutos:** el problema, la solución, las decisiones de diseño y los resultados.
- [ ] **Demostración en vivo** del sistema (en vídeo si está instalado lejos).
- [ ] **Preguntas** sobre cualquier decisión de hardware, firmware, pruebas y costes. Por ejemplo: ¿qué cambiarías para fabricar 1.000 unidades? ¿Cuál es el punto más débil del diseño?
- [ ] **Vídeo de 3 minutos** del proyecto para tu portafolio.

### Después del plan

Con el proyecto final aprobado tienes un portafolio de 23 proyectos documentados en GitHub, varios de ellos con PCB propia y uno de nivel producto. Desde ahí:

- **Empleo:** diseño electrónico, firmware embebido o integración IoT en empresas de automatización, energía, agricultura o domótica.
- **Por cuenta propia:** proyectos a medida para negocios y particulares.
- **Docencia:** materiales y proyectos para tus clases de Tecnología.
