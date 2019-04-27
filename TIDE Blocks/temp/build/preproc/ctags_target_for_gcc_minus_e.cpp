# 1 "C:\\Users\\Andres\\Documents\\GitHub\\TideBlocksUCT\\TIDE\\compilers\\temp\\temp.ino"
# 1 "C:\\Users\\Andres\\Documents\\GitHub\\TideBlocksUCT\\TIDE\\compilers\\temp\\temp.ino"
# 2 "C:\\Users\\Andres\\Documents\\GitHub\\TideBlocksUCT\\TIDE\\compilers\\temp\\temp.ino" 2

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
 pinMode(LED_G, 0x1);
 pinMode(LED_Y, 0x1);
 pinMode(LED_R, 0x1);
 pinMode(LED_W, 0x1);
 SERVO1.attach(S1);
 SERVO2.attach(S2);
}

void loop() {
 val = analogRead(SOUND);
 if ((val < 128)) {
  digitalWrite(LED_R, 0x1);
  digitalWrite(LED_Y, 0x0);
  digitalWrite(LED_G, 0x0);
 }
 else if ((val < 512)) {
  digitalWrite(LED_R, 0x0);
  digitalWrite(LED_Y, 0x1);
  digitalWrite(LED_G, 0x0);
 }
 else {
  digitalWrite(LED_R, 0x0);
  digitalWrite(LED_Y, 0x0);
  digitalWrite(LED_G, 0x1);
 }
}
