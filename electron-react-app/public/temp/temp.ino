#include <Servo.h>

Servo SERVO1;
Servo SERVO2;
int sonido;

void repeat(int _NR, void (*_CR)()) {
   for (int _IR = 0; _IR < _NR; _IR++) {
       _CR();
   }
}

void setup() {
    pinMode(4, OUTPUT);
    pinMode(5, OUTPUT);
    pinMode(6, OUTPUT);
    pinMode(13, OUTPUT);
    SERVO1.attach(12);
    SERVO2.attach(11);
}

void loop() {
    sonido = analogRead(0);
    if ((sonido > 1000)) {
        digitalWrite(4, HIGH);
        digitalWrite(5, LOW);
        digitalWrite(6, LOW);
    }
    else {
        if ((sonido > 100)) {
            digitalWrite(4, LOW);
            digitalWrite(5, HIGH);
            digitalWrite(6, LOW);
        }
        else {
            digitalWrite(4, LOW);
            digitalWrite(5, LOW);
            digitalWrite(6, HIGH);
        }
    }
}
