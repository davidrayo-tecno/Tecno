// P4 · Juego de reflejos tipo Simón
// Esqueleto de partida: tiene la estructura, no la solución.
// Regla del proyecto: ningún delay() (R5).

#include <EEPROM.h>

const int NUM_COLORES = 4;
const int PINES_LED[NUM_COLORES]      = {2, 4, 6, 8};
const int PINES_BOTON[NUM_COLORES]    = {3, 5, 7, 12};
const int NOTAS[NUM_COLORES]          = {262, 330, 392, 523};  // Do, Mi, Sol, Do agudo (Hz)
const int PIN_ZUMBADOR = 10;           // ojo: tone() usa el temporizador del PWM de los pines 3 y 11

const int MAX_RONDAS = 20;
const unsigned long TIEMPO_RESPUESTA = 3000;  // R4
const unsigned long ANTIRREBOTE      = 30;    // R6
const int DIRECCION_RECORD = 0;               // posición en la EEPROM (R7)

enum Estado { ESPERANDO_INICIO, MOSTRANDO_SECUENCIA, ESCUCHANDO_JUGADOR, ERROR_JUEGO };
Estado estado = ESPERANDO_INICIO;

int secuencia[MAX_RONDAS];
int ronda = 0;           // longitud actual de la secuencia
int pasoActual = 0;      // posición que se muestra o se espera
unsigned long inicioFase = 0;

// Antirrebote: un registro por botón
int estadoEstable[NUM_COLORES];
int ultimaLectura[NUM_COLORES];
unsigned long momentoCambio[NUM_COLORES];

// Prototipos (el IDE los genera solo, pero declararlos es buena práctica)
void estadoEsperando();
void estadoMostrando();
void estadoEscuchando();
void estadoError();
int botonPulsado();
void encenderColor(int color);
void apagarTodo();
void cambiarA(Estado nuevo);

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(A0));  // A0 al aire: ruido como semilla
  for (int i = 0; i < NUM_COLORES; i++) {
    pinMode(PINES_LED[i], OUTPUT);
    pinMode(PINES_BOTON[i], INPUT_PULLUP);
    estadoEstable[i] = HIGH;
    ultimaLectura[i] = HIGH;
    momentoCambio[i] = 0;
  }
  // TODO: lee el récord de la EEPROM y muéstralo (R7)
}

void loop() {
  switch (estado) {
    case ESPERANDO_INICIO:   estadoEsperando();   break;
    case MOSTRANDO_SECUENCIA: estadoMostrando();  break;
    case ESCUCHANDO_JUGADOR: estadoEscuchando();  break;
    case ERROR_JUEGO:        estadoError();       break;
  }
}

void estadoEsperando() {
  // TODO: espera a que se pulse cualquier botón, prepara la partida y cambia de estado
}

void estadoMostrando() {
  // TODO: muestra la secuencia paso a paso alternando "encendido" y "pausa" con millis()
  // TODO: más rápido a partir de la ronda 5 (R3)
}

void estadoEscuchando() {
  // TODO: espera el botón correcto; controla los 3 s de límite (R4)
}

void estadoError() {
  // TODO: melodía de error, puntuación con parpadeos y récord en la EEPROM (con EEPROM.update)
}

// Devuelve el índice del botón recién pulsado (0–3) o -1 si no hay pulsación nueva.
int botonPulsado() {
  // TODO: antirrebote con millis(): solo cuenta si la lectura lleva estable más de ANTIRREBOTE ms
  return -1;
}

void encenderColor(int color) {
  digitalWrite(PINES_LED[color], HIGH);
  tone(PIN_ZUMBADOR, NOTAS[color]);
}

void apagarTodo() {
  for (int i = 0; i < NUM_COLORES; i++) digitalWrite(PINES_LED[i], LOW);
  noTone(PIN_ZUMBADOR);
}

void cambiarA(Estado nuevo) {
  estado = nuevo;
  inicioFase = millis();
}
