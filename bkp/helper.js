"use strict";
exports.__esModule = true;
function alterUserListControl(id, userList) {
    userList.map(function (user) { return user.id === id
        ? user.control = true
        : user.control = false; });
}
exports.alterUserListControl = alterUserListControl;
