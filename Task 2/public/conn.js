$(function () {
    var socket = io()

    //sending to server
    $('#OnLED').on('click', function () {
        socket.emit('toggleLED')
    })

    $('#OnMotion').on('click', function () {
        socket.emit('toggleSensor');
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