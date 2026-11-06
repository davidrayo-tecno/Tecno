---
titulo: Plantillas
fase: 0
---

# Plantillas

Copia la que necesites con el botón **Copiar**, rellénala y pégala en el chat o en tu repositorio.

## Plantilla de entrega {#entrega}

Úsala cada vez que termines un proyecto. Súbela al chat con las fotos y el vídeo.

```text
ENTREGA · P__ · Nombre del proyecto
Fecha:
Horas dedicadas:

1. Repositorio o código:
   (enlace o código completo)

2. Esquema:
   (foto o PDF adjunto)

3. Cálculos principales:
   -

4. Comprobación de requisitos:
   R1: cumple / no cumple · cómo lo he comprobado:
   R2:
   R3:

5. Medidas tomadas:
   (tensiones, corrientes, consumos, tiempos)

6. Fotos y vídeo:
   (adjuntos: montaje desde arriba con buena luz, vídeo funcionando)

7. Qué falló y cómo lo resolví:
   -

8. Dudas para el tutor:
   -
```

## Informe semanal {#informe}

Cada domingo, 5 minutos.

```text
INFORME SEMANAL · Semana __ · Fase __
Horas reales esta semana:
Proyecto en curso:

Qué terminé:
-

Dónde me atasqué:
-

Qué aprendí:
-

Plan para la semana que viene:
-

Material que me falta:
-
```

## README de un proyecto {#readme}

Estructura del `README.md` de cada proyecto en tu repositorio.

```markdown
# P__ · Nombre del proyecto

![Foto del proyecto](fotos/portada.jpg)

## Qué hace
Una o dos frases.

## Requisitos
| Requisito | Resultado | Cómo se comprobó |
| --- | --- | --- |
| R1 … | Cumple | … |

## Esquema
![Esquema](esquema.png)

## Cálculos
…

## Material
| Cantidad | Componente | Referencia |
| --- | --- | --- |

## Cómo montarlo y programarlo
1. …

## Pruebas y medidas
…

## Problemas encontrados y lecciones aprendidas
- …

## Vídeo
[Enlace]
```

## Documento de requisitos {#requisitos}

Para los proyectos de la fase 4 en adelante, y obligatorio en el proyecto final.

```text
REQUISITOS · Nombre del proyecto · versión __

1. Problema que resuelve y para quién:

2. Requisitos funcionales (qué hace), medibles:
   RF1:
   RF2:

3. Requisitos no funcionales:
   - Alimentación y autonomía:
   - Entorno (interior, exterior, temperatura, humedad):
   - Tamaño y peso:
   - Fiabilidad (cuánto tiempo sin fallos):
   - Seguridad (qué no puede pasar nunca):
   - Coste máximo por unidad:

4. Fuera de alcance (qué NO hará):

5. Cómo se comprobará cada requisito:

6. Riesgos principales y plan B:
```

## Lista de comprobación de revisión de diseño {#revision}

Repásala tú antes de enviarme un esquema o una PCB. En la revisión formal la recorremos juntos.

### Esquema

- [ ] Cada circuito integrado tiene sus condensadores de desacoplo junto a sus pines de alimentación.
- [ ] Todas las tensiones son compatibles (3,3 V frente a 5 V) en cada conexión entre componentes.
- [ ] Ningún pin de entrada queda flotando: tiene pull-up, pull-down o una señal que lo fija.
- [ ] Las cargas inductivas (motores, relés, válvulas) tienen diodo de protección.
- [ ] La entrada de alimentación tiene protección contra polaridad inversa y fusible.
- [ ] Los reguladores aguantan el pico de consumo con margen y no se calientan (potencia calculada).
- [ ] Los pines especiales del microcontrolador (arranque, programación, flash) se usan como dice la hoja de datos.
- [ ] El ERC no da errores, o los que da están justificados.
- [ ] Cada componente tiene referencia real, disponible y con su huella comprobada.

### PCB

- [ ] Los conectores están en los bordes y la placa encaja en su caja (medidas comprobadas).
- [ ] Los anchos de pista corresponden a la corriente de cada una.
- [ ] Hay plano de masa y las pistas de retorno son cortas.
- [ ] Los condensadores de desacoplo están lo más cerca posible de sus pines.
- [ ] La antena (si la hay) tiene su zona libre de cobre y está en el borde.
- [ ] Las zonas de potencia están separadas de las señales sensibles (sensores analógicos).
- [ ] Hay puntos de prueba para alimentación, masa y programación.
- [ ] La serigrafía indica nombres, polaridades, versión y fecha, y no queda sobre los pads.
- [ ] Hay taladros de montaje.
- [ ] El DRC no da errores con las reglas del fabricante elegido.
- [ ] La impresión a escala 1:1 encaja con los componentes reales.

### Firmware

- [ ] Al arrancar o reiniciarse, todas las salidas quedan en un estado seguro.
- [ ] No hay esperas bloqueantes en la lógica principal.
- [ ] Un perro guardián (watchdog) reinicia el sistema si se cuelga.
- [ ] Los errores (sensor desconectado, fallo de red) se detectan, se registran y no bloquean.
- [ ] No hay contraseñas ni claves escritas en el código.
- [ ] El código está en módulos con una sola responsabilidad, en Git y con versión.
