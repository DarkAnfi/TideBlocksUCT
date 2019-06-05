#include <Servo.h>

Servo SERVO1;
Servo SERVO2;

void setup() {
    pinMode(4, OUTPUT);
    pinMode(5, OUTPUT);
    pinMode(6, OUTPUT);
    pinMode(13, OUTPUT);
    SERVO1.attach(12);
    SERVO2.attach(11);
}

void loop() {
    if (analogRead(3) > 512) {
        digitalWrite(4, HIGH);
        digitalWrite(5, LOW);
        digitalWrite(6, LOW);
    }
    if (analogRead(3) <=512 && analogRead(3) > 256) {
        digitalWrite(4, LOW);
        digitalWrite(5, HIGH);
        digitalWrite(6, LOW);
    }
    if (analogRead(3) <= 256) {
        digitalWrite(4, LOW);
        digitalWrite(5, LOW);
        digitalWrite(6, HIGH);
    }
}
