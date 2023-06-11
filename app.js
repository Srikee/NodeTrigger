const express = require('express');
const socketio = require('socket.io');
const app = express();

const server = app.listen(3000, () => { });
const io = socketio(server);
io.on('connection', (socket) => {
    socket.on('join', (room) => {
        console.log("join", socket.id);
        socket.join(room);
    });
    socket.on('disjoin', (room) => {
        console.log("disjoin", socket.id);
        socket.leave(room);
    });
    socket.on('trigger', (room, data) => {
        console.log(room, data);
        io.to(room).emit("trigger", data);
    });
    socket.on('disconnect', () => {
        console.log("Disconnect.");
    });
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/:room", (req, res) => {
    let room = req.params.room;
    let data = req.query.data;
    console.log(room, data);
    io.to(room).emit("trigger", data);
    res.send({ "room": room, "data": data });
});

