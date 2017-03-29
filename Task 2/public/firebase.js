// Initialize Firebase
var config = {
        apiKey: "AIzaSyBEbKIjSUgBV8WQQnBaYpsrWqBfDObJVxU",
        authDomain: "beaglebone-ad06e.firebaseapp.com",
        databaseURL: "https://beaglebone-ad06e.firebaseio.com",
        storageBucket: "beaglebone-ad06e.appspot.com",
        messagingSenderId: "225676518667"
      };
      firebase.initializeApp(config);

      var test = document.getElementById('testData');
      var dbRef = firebase.database().ref().child('testText');
      dbRef.on('value', snap => test.innerText = snap.val());