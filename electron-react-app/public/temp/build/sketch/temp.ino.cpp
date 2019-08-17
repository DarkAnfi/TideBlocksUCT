#include <Arduino.h>
#line 1 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
#line 1 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
#include <Servo.h>

Servo SERVO1;
Servo SERVO2;

#line 6 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void repeat(int _NR, void (*_CR)());
#line 12 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void setup();
#line 21 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void loop();
#line 6 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
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
    if (1) {
    }
}

