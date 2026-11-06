// P3 · Termómetro con pantalla
// Esqueleto de partida: tiene la estructura, no la solución.
// Librerías necesarias (gestor de librerías del IDE):
//   OneWire, DallasTemperature, LiquidCrystal I2C

#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>

const int PIN_TMP36       = A0;
const int PIN_ONEWIRE     = 4;   // DS18B20, con resistencia de 4,7 kΩ a 5 V
const int PIN_PULSADOR    = 7;   // pone a cero mínima y máxima (R3)
const int PIN_LED_ALARMA  = 8;
const int PIN_ZUMBADOR    = 9;

const uint8_t DIRECCION_LCD = 0x27;  // TODO: compruébala con un escáner I2C
const float LIMITE_ALARMA   = 18.0;  // °C (R4)
const float VCC_REAL        = 5.0;   // TODO: mide tu pin de 5 V con el multímetro

LiquidCrystal_I2C lcd(DIRECCION_LCD, 16, 2);
OneWire bus(PIN_ONEWIRE);
DallasTemperature ds18b20(&bus);

float minima = 1000;
float maxima = -1000;
unsigned long ultimaMedida = 0;
unsigned long ultimoAviso = 0;

// Prototipos (el IDE los genera solo, pero declararlos es buena práctica)
float leerTMP36();
float leerDS18B20();

void setup() {
  Serial.begin(9600);
  Serial.println(F("tiempo_s,tmp36_C,ds18b20_C"));  // cabecera del CSV (R5)
  lcd.init();
  lcd.backlight();
  ds18b20.begin();
  // TODO: configura pulsador, LED y zumbador
}

void loop() {
  // TODO: si se pulsa el botón, reinicia mínima y máxima

  if (millis() - ultimaMedida >= 1000) {
    ultimaMedida = millis();
    float tA = leerTMP36();
    float tD = leerDS18B20();
    // TODO: si tD indica sensor desconectado, muestra "ERROR SENSOR" (R6)
    // TODO: actualiza mínima y máxima
    // TODO: muestra en la LCD (R2) y envía la línea CSV (R5)
  }

  // TODO: gestiona la alarma (R4) sin bloquear
}

// Temperatura del TMP36 en °C: T = (V − 0,5) · 100
float leerTMP36() {
  // TODO: convierte la lectura del ADC a voltios con VCC_REAL y aplica la fórmula
  return 0;
}

// Temperatura del DS18B20 en °C.
float leerDS18B20() {
  ds18b20.requestTemperatures();
  return ds18b20.getTempCByIndex(0);
}
