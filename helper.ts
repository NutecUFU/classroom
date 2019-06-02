import { IUser } from './model';

export function alterUserListControl(id: any, userList: IUser[]) {
  userList.map(
    (user: IUser) => user.id === id 
      ? user.control = true 
      : user.control = false
  )
}

export function getIndexNextUser(list: IUser[], id: string) {
  const nextIndex = list.findIndex((user: IUser) => user.id == id) + 1;
  console.log('NEXT INDEX', nextIndex);
  console.log('USER_LIST', list);
  console.log('NEXT_USER_IN_LIST', list[nextIndex]);
  return nextIndex <= list.length - 1 ? nextIndex : 0;
}

export function isFirstUserControl(user: IUser, userList: IUser[]) {
  console.log(userList.length <= 0)
  return { ...user, control: !user.isSchedule && userList.length <= 0 }
}

export function isUserAccess(user: IUser, id: string): IUser {
  const { isSchedule } = user;
  const notScheduleName = `Guest-${id.slice(0, 6)}`;
  const isScheduleUser = () => isSchedule ? user.name : notScheduleName;
  const userMount = {  
    ...user,
    id,
    name: isScheduleUser()
  }

  return userMount;
}