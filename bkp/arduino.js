const moment = require('moment')

const components = {
    led: null,
    sensor1: null,
    sensor2: null,
    lcd: null
}

function lcdInitialConfiguration() {
    return {
        pins: [12, 11, 5, 4, 3, 2],
        backlight: 6,
        rows: 2,
        cols: 20
    };
}

function initializeComponents(five) {
    components.led = new five.Led(13);
    // components.sensor1 = new five.Sensor({
    //     pin: "A6", 
    //     freq: 1000
    // });
    // components.sensor2 = new five.Sensor({
    //     pin: "A7",
    //     freq: 1000
    // });
    components.lcd = new five.LCD(lcdInitialConfiguration());
}

function initialize(socket, five) {
    initializeComponents(five);
    onReadyBoard(socket);
}

function changeLcd(lcd, time, sensor1, sensor2) {
    lcd.home().print(`Tempo: ${time}`)
    lcd.cursor(1, 0);
    lcd.useChar('sbox')
    lcd.print(`${sensor1}:sbox:C ${sensor2}:sbox:C`)
}

function initializeLcd(lcd, time, sensor1, sensor2) {
    lcd.clear();
    changeLcd(lcd, time, sensor1, sensor2);
}

function setTime(time, seconds) {
    time = moment().hour(0).minute(0).second(seconds).format('HH:mm:ss')
}

function onReadyBoard(socket) {
    const { led, sensor1, sensor2, lcd } = components
    let sensor1Currrent, sensor2Current = 0.00;
    let time = null;
    let ledState = false;
    let seconds = 0;

    setTime(time, 0);
    initializeLcd(lcd, seconds, sensor1Currrent, sensor2Current);

    socket.on('high_lamp', function() {
        led.on();
    });

    socket.on('low_lamp', function() {
        led.off();
    });

    socket.on('toggle_lamp', function() {
        console.log('OI')
        // ledState = !ledState;
        // ledState ? led.on() : led.off();
        led.on();
    })

    socket.on('user_change_control', function(id) {
        initializeLcd(lcd, time, sensor1Currrent, sensor2Current);
    })

    setInterval(() => {
        seconds++;
        changeLcd(lcd, seconds, sensor1Currrent, sensor2Current);
    }, 1000)

    // sensor1.on('data', function(data) {
    //     const temperatureSensorConstant = 0.4887585532746823069403714565;
    //     const realTemperature = (data * temperatureSensorConstant).toFixed(2);
    //     sensor1Currrent = realTemperature;
    //     socket.emit('read_sensor1', {x: seconds, y: sensor1Currrent});
    // });

    // sensor2.on('data', function(data) {
    //     const temperatureSensorConstant = 0.4887585532746823069403714565;
    //     const realTemperature = (data * temperatureSensorConstant).toFixed(2);
    //     sensor2Current = realTemperature;
    //     socket.emit('read_sensor2', {x: seconds, y: sensor2Current});
    // })
}

module.exports = {
    initialize
}