// P1 · Semáforo con pulsador de peatones
// Esqueleto de partida: tiene la estructura, no la solución.
// Completa cada TODO siguiendo tu diagrama de estados.

// ---------- Pines (cámbialos según tu esquema) ----------
const int PIN_COCHE_ROJO    = 2;
const int PIN_COCHE_AMBAR   = 3;
const int PIN_COCHE_VERDE   = 4;
const int PIN_PEATON_ROJO   = 5;
const int PIN_PEATON_VERDE  = 6;
const int PIN_PULSADOR      = 7;

// ---------- Tiempos en milisegundos (requisitos R3 y R4) ----------
const unsigned long VERDE_COCHES_MINIMO = 10000;
const unsigned long AMBAR_COCHES        = 3000;
const unsigned long SEGURIDAD           = 1000;
const unsigned long VERDE_PEATONES      = 8000;
const unsigned long PARPADEO_PEATONES   = 4000;

// ---------- Estados (uno por caja de tu diagrama) ----------
enum Estado {
  COCHES_VERDE,
  COCHES_AMBAR,
  // TODO: añade el resto de estados de tu diagrama
};

Estado estado = COCHES_VERDE;
unsigned long inicioEstado = 0;    // momento en que entramos en el estado actual
bool peticionPeaton = false;       // alguien ha pulsado y está esperando

// Prototipos (el IDE los genera solo, pero declararlos es buena práctica)
void leerPulsador();
void cambiarA(Estado nuevo);
unsigned long tiempoEnEstado();

void setup() {
  Serial.begin(9600);
  // TODO: configura los pines de los LED como salida
  // TODO: configura el pulsador con la resistencia de pull-up interna
  inicioEstado = millis();
}

void loop() {
  leerPulsador();

  switch (estado) {
    case COCHES_VERDE:
      // TODO: enciende los LED de este estado
      // TODO: si hay petición y han pasado al menos 10 s, cambia al siguiente estado
      break;

    case COCHES_AMBAR:
      // TODO
      break;

    // TODO: un case por cada estado
  }
}

// Lee el pulsador con antirrebote y anota la petición (requisito R5).
void leerPulsador() {
  // TODO: recuerda que con INPUT_PULLUP el pulsador pulsado lee LOW
  // TODO: ignora las pulsaciones durante el ciclo de peatones
}

// Cambia de estado y apunta cuándo ha empezado.
void cambiarA(Estado nuevo) {
  estado = nuevo;
  inicioEstado = millis();
  Serial.print(F("Estado: "));
  Serial.println(nuevo);
}

// Devuelve cuántos milisegundos llevamos en el estado actual.
unsigned long tiempoEnEstado() {
  return millis() - inicioEstado;
}
