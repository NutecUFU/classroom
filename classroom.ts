import remove from 'lodash/remove';
import { IUser } from './model';
import { alterUserListControl, isUserControl, isUserAccess } from "./helper";

enum SOCKET_TYPES {
  USER_JOIN = 'user.join',
  USER_CHANGE_CONTROL = 'user.change_control',
  USER_LIST = 'user.list',
  USER_ADDED = 'user.added',
  USER_REMOVE_CONTROL = 'user.remove_control',
  USER_END_TIME = 'user.end_time',
  USER_RECEIVED_CONTROL = 'user.received_control',
  USER_DISCONNECT = 'disconnect'
}

let USER_LIST: IUser[] = [];
let USER_CONTROL_ID = '';

export class Classroom {

  initialize(io: SocketIO.Server, socket: any) {
    this.handleUserJoin(socket, io);
    this.handleUserChangeControl(socket, io);
    this.handleUserDisconnect(socket, io);
    this.handleUserEndTime(socket, io);
  }

  handleUserJoin(socket: any, io: SocketIO.Server) {
    socket.on(SOCKET_TYPES.USER_JOIN, (user: IUser) => {
      const controlUser = isUserControl(user, USER_LIST);
      USER_CONTROL_ID = socket.id;
      USER_LIST = [...USER_LIST, isUserAccess(controlUser, socket.id)];
      socket.emit(SOCKET_TYPES.USER_ADDED, isUserAccess(controlUser, socket.id));
      io.emit(SOCKET_TYPES.USER_LIST, USER_LIST);
    })
  }

  handleUserEndTime(socket: any, io: SocketIO.Server) {
    socket.on(SOCKET_TYPES.USER_END_TIME, (id: string) => {
      const currentUser = USER_LIST.find((user: IUser) => user.id === id);
      const newUser = USER_LIST[USER_LIST.findIndex((user: IUser) => user.id == id) + 1];

      if (USER_CONTROL_ID && io.sockets.sockets[USER_CONTROL_ID]) {
        io.sockets.sockets[USER_CONTROL_ID].emit(SOCKET_TYPES.USER_ADDED, {...currentUser, control: false})
      }
      USER_CONTROL_ID = newUser.id;
      alterUserListControl(newUser.id, USER_LIST)
      io.emit(SOCKET_TYPES.USER_LIST, USER_LIST);
      io.sockets.sockets[USER_CONTROL_ID].emit(SOCKET_TYPES.USER_ADDED, {...newUser, control: true});
    })
  }

  handleUserChangeControl(socket: any, io: SocketIO.Server) {
    socket.on(SOCKET_TYPES.USER_CHANGE_CONTROL, (id: string) => {
      USER_CONTROL_ID = id;
      alterUserListControl(id, USER_LIST);
      io.emit(SOCKET_TYPES.USER_LIST, USER_LIST);
      io.sockets.sockets[id].emit(SOCKET_TYPES.USER_RECEIVED_CONTROL);
    })
  }

  handleUserDisconnect(socket: any, io: SocketIO.Server) {
    socket.on(SOCKET_TYPES.USER_DISCONNECT, () => {
      console.log(USER_LIST)
      USER_LIST = USER_LIST.filter((user: IUser) => user.id !== socket.id)
      io.emit(SOCKET_TYPES.USER_LIST, USER_LIST);
    })
  }

}