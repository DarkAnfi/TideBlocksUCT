int LED_G=4;
int LED_Y=5;
int LED_R=6;
int LED_W=13;

void setup(){
  pinMode(LED_G,OUTPUT);  
  pinMode(LED_Y,OUTPUT);  
  pinMode(LED_R,OUTPUT);  
  pinMode(LED_W,OUTPUT);  
}

void loop(){
  digitalWrite(LED_G,HIGH); 
  delay(500);
  digitalWrite(LED_G,LOW); 
  delay(500);

  digitalWrite(LED_Y,HIGH); 
  delay(500);
  digitalWrite(LED_Y,LOW); 
  delay(500);
 
  digitalWrite(LED_R,HIGH); 
  delay(500);
  digitalWrite(LED_R,LOW); 
  delay(500);

  digitalWrite(LED_W,HIGH); 
  delay(500);
  digitalWrite(LED_W,LOW); 
  delay(500);
}
