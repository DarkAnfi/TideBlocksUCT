#include <Arduino.h>
#line 1 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
#line 1 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
#include <Servo.h>

Servo SERVO1;
Servo SERVO2;

#line 6 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void SETA(int _out);
#line 11 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
int GETA();
#line 16 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void Monitorear(float _exp, String _name);
#line 30 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void repeat(int _NR, void (*_CR)());
#line 36 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void setup();
#line 46 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void loop();
#line 6 "C:\\Users\\aflores\\Documents\\GitHub\\TideBlocksUCT\\electron-react-app\\public\\temp\\temp.ino"
void SETA(int _out) {
    pinMode(3, OUTPUT);
    analogWrite(3, (int)((float)(_out)/100.0*255.0));
}

int GETA() {
    pinMode(3, INPUT);
    return(digitalRead(3));
}

void Monitorear(float _exp, String _name) {
    int l_name = _name.length() + 1;
    char c_name[l_name];
    String s_exp = String(_exp);
    int l_exp = s_exp.length() + 1;
    char c_exp[l_exp];
    _name.toCharArray(c_name, l_name);
    s_exp.toCharArray(c_exp, l_exp);
    Serial.write(c_name);
    Serial.write(':');
    Serial.write(c_exp);
    Serial.write(";");
}

void repeat(int _NR, void (*_CR)()) {
    for (int _IR = 0; _IR < _NR; _IR++) {
        _CR();
    }
}

void setup() {
    Serial.begin(9600);
    pinMode(4, OUTPUT);
    pinMode(5, OUTPUT);
    pinMode(6, OUTPUT);
    pinMode(13, OUTPUT);
    SERVO1.attach(12);
    SERVO2.attach(11);
}

void loop() {
    Monitorear((float)analogRead(3), "Sonido");
    Monitorear((float)analogRead(4), "Luz");
    Monitorear((float)analogRead(5), "Temperatura");
    Monitorear((float)analogRead(0), "Puerto B");
    Monitorear((float)analogRead(2), "Puerto D");
}

