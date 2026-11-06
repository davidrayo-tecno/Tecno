// P2 · Luz nocturna automática
// Esqueleto de partida: tiene la estructura, no la solución.

const int PIN_LDR      = A0;   // punto medio del divisor con la LDR
const int PIN_UMBRAL   = A1;   // cursor del potenciómetro
const int PIN_LED      = 9;    // debe ser un pin con PWM (~)

const int NUM_MUESTRAS = 10;   // tamaño de la media móvil (R5)
const int HISTERESIS   = 50;   // en unidades del ADC: TODO justifica el valor (R4)
const unsigned long PERIODO_SERIE = 200;  // ms entre envíos al trazador (R6)

int muestras[NUM_MUESTRAS];
int indiceMuestra = 0;
long sumaMuestras = 0;

bool luzEncendida = false;
unsigned long ultimoEnvio = 0;

// Prototipos (el IDE los genera solo, pero declararlos es buena práctica)
int leerLuzSuavizada();
void actualizarEstado(int luz, int umbral);
int calcularBrillo(int luz, int umbral);
void enviarAlTrazador(int luz, int umbral, int brillo);

void setup() {
  Serial.begin(9600);
  pinMode(PIN_LED, OUTPUT);
  // TODO: rellena el array de muestras con una primera lectura para que la media empiece bien
}

void loop() {
  int luz = leerLuzSuavizada();
  int umbral = analogRead(PIN_UMBRAL);

  actualizarEstado(luz, umbral);
  int brillo = calcularBrillo(luz, umbral);
  analogWrite(PIN_LED, brillo);

  if (millis() - ultimoEnvio >= PERIODO_SERIE) {
    ultimoEnvio = millis();
    enviarAlTrazador(luz, umbral, brillo);
  }
}

// Media móvil de las últimas NUM_MUESTRAS lecturas.
int leerLuzSuavizada() {
  // TODO: resta la muestra más antigua, lee una nueva, súmala y avanza el índice
  return 0;
}

// Decide si la luz debe estar encendida usando dos umbrales (histéresis).
void actualizarEstado(int luz, int umbral) {
  // TODO
}

// Brillo de 0 a 255: más oscuro, más brillo. 0 si la luz debe estar apagada.
int calcularBrillo(int luz, int umbral) {
  // TODO: usa map() y constrain()
  return 0;
}

void enviarAlTrazador(int luz, int umbral, int brillo) {
  Serial.print(F("luz:"));    Serial.print(luz);
  Serial.print(F(",umbral:")); Serial.print(umbral);
  Serial.print(F(",brillo:")); Serial.println(brillo);
}
