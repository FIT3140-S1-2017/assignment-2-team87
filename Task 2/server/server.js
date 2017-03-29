//load required modules
var express = require('express')
var app = express()
var path = require('path')
var bone = require('bonescript')
//listen to port
var server = app.listen(3001, function () { console.log('Listening on port 3001!') }) 
var io = require('socket.io')(server)
//firebase setup
var admin = require("firebase-admin");
var serviceAccount = require("./beaglebone-ad06e-firebase-adminsdk-ld6xo-89553811e8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://beaglebone-ad06e.firebaseio.com"
});

var db = admin.database();
var ref = db.ref();
ref.once("value", function(snapshot) {
  console.log("snap: " + snapshot.val());
});

//server
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'))
})

//initialize led
var led = "P8_13";
bone.pinMode(led, bone.OUTPUT);
//motion sensor
var sensor = "P8_19"
bone.pinMode(sensor, bone.INPUT);

//global variables
var interval;           //interval ID
var lenState = false;   //short or long motion state
var mctr = 0;           //motion counter
var lMotion = 0;        //long motion counter
var sMotion = 0;        //short motion counter
var bool = false;       //motion sensor state


//detect motion
function updatePage(x, socket) {
    if (x === 0) {
        bone.digitalWrite(led, 1);
        console.log("Motions detected");
        lenState = true;
        mctr++;
    }
    else {
        bone.digitalWrite(led, 0);
        console.log("No motion detected");
        motionLen(lenState, mctr, socket);
        lenState = false;
        mctr = 0;
    }
}


//check whether pin is turned on
function checkSensor(y, callback, socket) {
    bone.digitalRead(y, function (data) {
        callback(data.value, socket)
    });
}


//check motion length
function motionLen(state, mctr, socket) {
    if ((mctr > 2)) {
        console.log("long motion");
        lMotion++;
        socket.emit('longMotion', lMotion);
    }
    else if (lenState) {
        console.log("short motion");
        sMotion++;
        socket.emit('shortMotion', sMotion);
    }
    //total motions
    socket.emit('totalMotion', sMotion + lMotion);
    //database reference to read and write data
    console.log("firebase stuff");
	var motionRef = ref.child("Motion");
	motionRef.update({
		"long" : lMotion,
		"short" : sMotion,
		"total" : lMotion + sMotion
	});
}


//write to LED
function writeToLED(state, socket) {
    if (state === 0) {
        bone.digitalWrite(led, 1);
    }
    else {
        bone.digitalWrite(led, 0);
    }
}


//write to motion sensor
function writeToMotion(state, socket) {
    if (state === true) {
        //set interval when sensor is on
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(function () {
            checkSensor(sensor, updatePage, socket);
        }, 500);
        console.log("start interval ")
    }
    else {
        //turn off sensor
        clearInterval(interval);
        console.log("stop interval ")
        bone.digitalWrite(led, 0);
    }
}


//socket function
io.on('connection', function (socket) {

    console.log('client connected')

    //toggle LED
    socket.on('toggleLED', function () {
        checkSensor(led, writeToLED, socket)
    })

    //toggle motion sensor
    socket.on('toggleSensor', function () {
        bool = !bool;
        writeToMotion(bool, socket);
    })
})
