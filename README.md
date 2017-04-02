# Intruder Counter Project (assignment 2)

This project makes use of a simple motion sensor, LED, Beaglebone Black and Firebase in order to build a real time intruder detection application.


# Required Libraries for this project

  - express (version 4.15.2. and up)
  - path (version 0.12.7 and up)
  - socket.io (version 1.7.3 and up)
  - bonescript (version 0.6.1)
  - firebase admin SDK
  
Note: Version 0.12 or later of Nodejs is required 


# Hardware Structure
### PIR Motion Sensor
- The VCC pin is connected to P9_3
- The OUT pin to P8_19
- The GND pin to P9_1

### LED 
- Anode (+) to P8_13
- Cathode (-) to P8_2


# Known Bugs
There are no known bugs