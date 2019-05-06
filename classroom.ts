import remove from 'lodash/remove';
import { IUser } from './model';
import { alterUserListControl, isUserAccess } from "./helper";

enum SOCKET_TYPES {
  USER_JOIN = 'user.join',
  USER_CHANGE_CONTROL = 'user.change_control',
  USER_LIST = 'user.list',
  USER_ADDED = 'user.added',
  USER_REMOVE_CONTROL = 'user.remove_control',
  USER_RECEIVED_CONTROL = 'user.received_control',
  USER_DISCONNECT = 'user.disconnect'
}

let USER_LIST: IUser[] = [];
let USER_CONTROL_ID = '';

export class Classroom {

  initialize(io: SocketIO.Server, socket: any) {
    this.handleUserJoin(socket, io);
    this.handleUserChangeControl(socket, io);
    this.handleUserDisconnect(socket);
  }

  handleUserJoin(socket: any, io: SocketIO.Server) {
    socket.on(SOCKET_TYPES.USER_JOIN, (user: IUser) => {
      USER_LIST = [...USER_LIST, isUserAccess(user, socket.id)];
      socket.emit(SOCKET_TYPES.USER_ADDED, user);
      io.emit(SOCKET_TYPES.USER_LIST, USER_LIST);
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

  handleUserDisconnect(socket: any) {
    socket.on(SOCKET_TYPES.USER_DISCONNECT, () => {
      remove(USER_LIST,
        (user: IUser) => user.id === socket.id
      );
    })
  }

}