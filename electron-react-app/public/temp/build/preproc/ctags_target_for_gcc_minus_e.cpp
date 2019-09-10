# 1 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
# 1 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
# 2 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino" 2

Servo SERVO1;
Servo SERVO2;
int sonido;

void repeat(int _NR, void (*_CR)()) {
   for (int _IR = 0; _IR < _NR; _IR++) {
       _CR();
   }
}

void setup() {
    pinMode(4, 0x1);
    pinMode(5, 0x1);
    pinMode(6, 0x1);
    pinMode(13, 0x1);
    SERVO1.attach(12);
    SERVO2.attach(11);
}

void loop() {
    sonido = analogRead(0);
    if ((sonido > 1000)) {
        digitalWrite(4, 0x1);
        digitalWrite(5, 0x0);
        digitalWrite(6, 0x0);
    }
    else {
        if ((sonido > 100)) {
            digitalWrite(4, 0x0);
            digitalWrite(5, 0x1);
            digitalWrite(6, 0x0);
        }
        else {
            digitalWrite(4, 0x0);
            digitalWrite(5, 0x0);
            digitalWrite(6, 0x1);
        }
    }
}
