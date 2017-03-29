var config = {
        apiKey: "AIzaSyBEbKIjSUgBV8WQQnBaYpsrWqBfDObJVxU",
        authDomain: "beaglebone-ad06e.firebaseapp.com",
        databaseURL: "https://beaglebone-ad06e.firebaseio.com",
        storageBucket: "beaglebone-ad06e.appspot.com",
        messagingSenderId: "225676518667"
      };
      firebase.initializeApp(config);

      var motionRef = firebase.database().ref().child('Motion');


$(function () {
    var socket = io()

    //sending to server
    $('#OnLED').on('click', function () {
        socket.emit('toggleLED')
    })

    $('#OnMotion').on('click', function () {
        socket.emit('toggleSensor');
    })

    //get data from firebase
    $('#OldData').on('click', function () {
        //long motion
        motionRef.child('long').once('value', snap => {
            document.getElementById('lmotion').innerText = snap.val();
        });

        //short motion
        motionRef.child('short').once('value', snap => {
            document.getElementById('smotion').innerText = snap.val();
        });

        //total motion
        motionRef.child('total').once('value', snap => {
            document.getElementById('tmotion').innerText = snap.val();
        });
    })

    $('#ClearData').on('click', function () {
        motionRef.set({
            long: 0,
            short: 0,
            total: 0
        });
        $('#lmotion').html();
        $('#smotion').html();
        $('#tmotion').html();
    })

    // receiving from server
    socket.on('shortMotion', function (data) {
        $('#short_motion').html(data)
    })

    socket.on('longMotion', function (data) {
        $('#long_motion').html(data)
    })

    socket.on('totalMotion', function (data) {
        $('#total_motion').html(data)
    })
});