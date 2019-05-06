"use strict";
exports.__esModule = true;
var express = require("express");
var classroom_1 = require("./classroom");
var app = express();
var port = process.env.PORT || 4000;
var server = app.listen(port, function () {
    console.log("Classroom server listening at: " + port);
});
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    var classroom = new classroom_1.Classroom(io, socket);
});
