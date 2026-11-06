# Formación en microcontroladores

Plan de formación exigente y basado en proyectos para llegar a diseñar proyectos profesionales con **Arduino Uno, Arduino Nano y ESP32**: 6 fases, 23 proyectos y unos 20 meses a 15 horas por semana, con tutor.

Se lee como web en `formacionmicrocontroladores/index.html` (con GitHub Pages activado, en `…/formacionmicrocontroladores/`).

## Contenido

| Fase | Página | Proyectos |
| --- | --- | --- |
| 1 · Fundamentos con Arduino Uno | `fase-1.html` | P1 Semáforo · P2 Luz nocturna · P3 Termómetro · P4 Simón |
| 2 · Sensores, actuadores y comunicaciones | `fase-2.html` | P5 Estación meteorológica · P6 Motores · P7 Robot · P8 Comunicación |
| 3 · Hardware propio con Nano y KiCad | `fase-3.html` | P9 Soldadura · P10 Primera PCB · P11 Bajo consumo · P12 Caja · P13 Código modular |
| 4 · ESP32 e IoT | `fase-4.html` | P14 Panel web · P15 Sensor MQTT · P16 Riego · P17 Bluetooth · P18 FreeRTOS |
| 5 · Ingeniería profesional | `fase-5.html` | P19 Placa ESP32 · P20 Banco de pruebas · P21 Fiabilidad · P22 Expediente técnico |
| 6 · Proyecto final | `fase-6.html` | P23 Proyecto final y defensa |

Además: `plantillas.html` (entrega, informe semanal, README, requisitos y revisión de diseño) y `codigo/` (esqueletos de la fase 1, sin solución).

## Cómo se edita

El texto está en Markdown en `contenido/`. Las páginas HTML se generan con:

```bash
pip install markdown
python3 construir.py
```

No edites los `.html` a mano: se sobrescriben al construir. Las casillas `- [ ]` del Markdown se convierten en casillas que se guardan en el navegador del alumno.
