#!/usr/bin/env python3
"""Genera las páginas HTML del curso a partir de los ficheros Markdown de `contenido/`.

Uso:  python3 construir.py
Requiere la librería Markdown:  pip install markdown
"""
import html
import re
from pathlib import Path

import markdown

RAIZ = Path(__file__).resolve().parent
CONTENIDO = RAIZ / "contenido"

PAGINAS = ["index", "fase-1", "fase-2", "fase-3", "fase-4", "fase-5", "fase-6", "plantillas"]

FASES = [
    # (página, nombre corto, meses, placa, línea 1, línea 2, proyectos)
    ("fase-1", "Fundamentos", "Meses 1–3", "Arduino Uno", "Ley de Ohm, entradas y salidas,", "PWM, máquinas de estados", "P1–P4"),
    ("fase-2", "Sensores y buses", "Meses 4–6", "Arduino Uno", "I2C, SPI, UART, MOSFET,", "motores, robot, baterías", "P5–P8"),
    ("fase-3", "Hardware propio", "Meses 7–9", "Arduino Nano", "Soldadura, KiCad, PCB,", "bajo consumo, caja 3D", "P9–P13"),
    ("fase-4", "ESP32 e IoT", "Meses 10–13", "ESP32", "WiFi, MQTT, BLE, OTA,", "FreeRTOS, riego del patio", "P14–P18"),
    ("fase-5", "Ingeniería", "Meses 14–16", "ESP32", "PCB con SMD, banco de pruebas,", "fiabilidad, normativa, costes", "P19–P22"),
    ("fase-6", "Proyecto final", "Meses 17–20", "Diseño propio", "3 o más nodos, 5 unidades,", "30 días de prueba de campo", "P23"),
]

EXTENSIONES = ["tables", "fenced_code", "attr_list", "md_in_html", "sane_lists", "toc"]


def leer(nombre):
    texto = (CONTENIDO / f"{nombre}.md").read_text(encoding="utf-8")
    meta = {}
    if texto.startswith("---"):
        cabecera, texto = texto[3:].split("---", 1)
        for linea in cabecera.strip().splitlines():
            clave, valor = linea.split(":", 1)
            meta[clave.strip()] = valor.strip()
    return meta, texto


def casillas(cuerpo, pagina):
    """Convierte `[ ]` al inicio de un elemento de lista en una casilla con identificador estable."""
    seccion = "inicio"
    contador = {}
    salida = []
    patron = re.compile(r'(<h[23][^>]*\bid="([^"]+)")|(<li>\[ \]\s*)')
    pos = 0
    for m in patron.finditer(cuerpo):
        salida.append(cuerpo[pos:m.start()])
        if m.group(1):
            seccion = m.group(2)
            salida.append(m.group(0))
        else:
            contador[seccion] = contador.get(seccion, 0) + 1
            ident = f"{pagina}:{seccion}:{contador[seccion]}"
            salida.append(f'<li class="tarea"><input type="checkbox" data-id="{ident}" aria-label="Hecho"> ')
        pos = m.end()
    salida.append(cuerpo[pos:])
    total = sum(contador.values())
    return "".join(salida), total


def hoja_de_ruta(totales):
    tarjetas = []
    for i, (pag, nombre, meses, placa, l1, l2, proy) in enumerate(FASES, 1):
        final = " final" if i == 6 else ""
        tarjetas.append(f"""
      <li><a class="fase{final}" href="{pag}.html" data-pagina="{pag}" data-total="{totales.get(pag, 0)}">
        <span class="fase-num">Fase {i}</span>
        <span class="fase-nombre">{nombre}</span>
        <span class="fase-meta">{meses} · {placa}</span>
        <span class="fase-desc">{l1} {l2}</span>
        <span class="fase-proy">Proyectos {proy}</span>
        <span class="barra"><i></i></span>
        <span class="fase-pct">0 %</span>
      </a></li>""")
    return f"""<section class="ruta" aria-label="Hoja de ruta">
  <ol class="fases">{''.join(tarjetas)}
  </ol>
  <p class="nota-ruta">Cada fase termina con un examen de salida: sin aprobarlo no se pasa a la siguiente.</p>
</section>"""


def progreso_global():
    return """<section class="progreso" aria-label="Tu progreso">
  <div class="progreso-cab"><strong>Tu progreso</strong><span id="pct-total">0 %</span></div>
  <span class="barra grande"><i id="barra-total"></i></span>
  <p class="nota">Cuenta las casillas marcadas en todas las fases. <button type="button" class="enlace" id="borrar-progreso">Borrar mi progreso</button></p>
</section>"""


def navegacion(actual):
    enlaces = [("index", "Plan")] + [(p, f"Fase {i}") for i, (p, *_) in enumerate(FASES, 1)] + [("plantillas", "Plantillas")]
    items = "".join(
        f'<a href="{p}.html"{" aria-current=\"page\"" if p == actual else ""}>{t}</a>' for p, t in enlaces
    )
    return f'<nav class="nav" aria-label="Secciones del curso">{items}</nav>'


def indice_fase(cuerpo):
    """Chips con los proyectos y el examen de la página."""
    chips = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', cuerpo)
    if len(chips) < 2:
        return ""
    def etiqueta(t):
        t = re.sub(r"<[^>]+>", "", t)
        return "Examen" if t.startswith(("Examen", "Defensa")) else t.split(" · ")[0]

    enlaces = "".join(f'<a href="#{i}">{etiqueta(t)}</a>' for i, t in chips)
    return f'<nav class="chips" aria-label="En esta página">{enlaces}</nav>'


def pie(actual):
    if not actual.startswith("fase-"):
        return ""
    n = int(actual.split("-")[1])
    ant = f'<a href="fase-{n-1}.html">← Fase {n-1}</a>' if n > 1 else '<a href="index.html">← Plan</a>'
    sig = f'<a href="fase-{n+1}.html">Fase {n+1} →</a>' if n < 6 else '<a href="plantillas.html">Plantillas →</a>'
    return f'<nav class="pasos" aria-label="Fases">{ant}{sig}</nav>'


PLANTILLA = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo} · Formación en microcontroladores</title>
<meta name="description" content="Plan de formación basado en proyectos para diseñar proyectos profesionales con Arduino Uno, Nano y ESP32.">
<link rel="icon" href="../logo-ies-palomares.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="estilo.css">
</head>
<body data-pagina="{pagina}">
<a class="salto" href="#contenido">Saltar al contenido</a>
<header class="barra-sup">
  <div class="contenedor barra-in">
    <a class="marca" href="index.html"><span class="chip-logo" aria-hidden="true">μC</span><span>Formación en microcontroladores</span></a>
  </div>
  <div class="contenedor">{nav}</div>
</header>
<main id="contenido" class="contenedor doc{clase}">
{chips}
{cuerpo}
{pie}
</main>
<footer class="contenedor pie">Plan de formación con tutor · Arduino Uno, Nano y ESP32 · <a href="https://github.com/davidrayo-tecno/Tecno/tree/main/formacionmicrocontroladores">Fuente en GitHub</a></footer>
<script src="curso.js"></script>
</body>
</html>
"""


def construir():
    paginas = {}
    totales = {}
    for nombre in PAGINAS:
        meta, texto = leer(nombre)
        md = markdown.Markdown(extensions=EXTENSIONES, extension_configs={"toc": {"slugify": slug}})
        cuerpo = md.convert(texto)
        cuerpo, total = casillas(cuerpo, nombre)
        totales[nombre] = total
        paginas[nombre] = (meta, cuerpo)

    for nombre, (meta, cuerpo) in paginas.items():
        if nombre == "index":
            cuerpo = cuerpo.replace("<p>[[HOJA_DE_RUTA]]</p>", hoja_de_ruta(totales))
            cuerpo = cuerpo.replace("<p>[[PROGRESO]]</p>", progreso_global())
        # Las tablas anchas se desplazan en el móvil sin romper la página
        cuerpo = cuerpo.replace("<table>", '<div class="tabla"><table>').replace("</table>", "</table></div>")
        salida = PLANTILLA.format(
            titulo=html.escape(meta.get("titulo", "Curso")),
            pagina=nombre,
            nav=navegacion(nombre),
            clase=" portada" if nombre == "index" else "",
            chips=indice_fase(cuerpo) if nombre.startswith("fase-") else "",
            cuerpo=cuerpo,
            pie=pie(nombre),
        )
        (RAIZ / f"{nombre}.html").write_text(salida, encoding="utf-8")
        print(f"{nombre}.html · {totales[nombre]} casillas")


def slug(valor, separador):
    valor = valor.lower()
    for a, b in zip("áéíóúüñ", "aeiouun"):
        valor = valor.replace(a, b)
    valor = re.sub(r"[^a-z0-9]+", separador, valor).strip(separador)
    return valor


if __name__ == "__main__":
    construir()
