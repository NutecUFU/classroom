
const userList = [];
let userIdControl = null;

function handleUserjoin() {

}

function alterUserListControl(id) {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            userList[i].control = true;
        } else {
            userList[i].control = false
        }
        
    }
}

function emitUserList(io) {
    io.emit('user_list', userList);
}

function initialize(io, socket) {
    socket.on('user_join', function(user) {
        if (user.isMaestro) {
            userIdControl = socket.id;
        }

        user.id = socket.id;
        userList.push(user);
        socket.emit('user_added', user);
        emitUserList(io);
    })

   

    socket.on('user_change_control', function(id) {
        if (userIdControl && io.sockets.sockets[userIdControl]) {
            io.sockets.sockets[userIdControl].emit('remove_control')
        }

        userIdControl = id
        alterUserListControl(id);
        emitUserList(io);
        io.sockets.sockets[id].emit('received_control')
    })

    socket.on('disconnect', function() {
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id === socket.id) {
                userList.splice(i, 1);
            }
        }
    })
}

module.exports = {
    initialize
}