#include <Servo.h>

int LED_G = 4;
int LED_Y = 5;
int LED_R = 6;
int LED_W = 13;
int S1 = 12;
int S2 = 11;
int IOA = 3;
int IOB = 0;
int IOC = 1;
int IOD = 2;
int SOUND = 3;
int LIGHT = 4;
int TEMP = 5;
Servo SERVO1;
Servo SERVO2;
int val = 0;

void setup() {
	pinMode(LED_G, OUTPUT);
	pinMode(LED_Y, OUTPUT);
	pinMode(LED_R, OUTPUT);
	pinMode(LED_W, OUTPUT);
	SERVO1.attach(S1);
	SERVO2.attach(S2);
}

void loop() {
	val = analogRead(SOUND);
	if ((val < 128)) {
		digitalWrite(LED_R, HIGH);
		digitalWrite(LED_Y, LOW);
		digitalWrite(LED_G, LOW);
	}
	else if ((val < 512)) {
		digitalWrite(LED_R, LOW);
		digitalWrite(LED_Y, HIGH);
		digitalWrite(LED_G, LOW);
	}
	else {
		digitalWrite(LED_R, LOW);
		digitalWrite(LED_Y, LOW);
		digitalWrite(LED_G, HIGH);
	}
}
