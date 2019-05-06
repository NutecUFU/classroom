import { IUser } from './model';

export function alterUserListControl(id: any, userList: IUser[]) {
  userList.map(
    (user: IUser) => user.id === id 
      ? user.control = true 
      : user.control = false
  )
}

export function isUserAccess(user: IUser, id: string): IUser {
  const { isSchedule } = user;
  const notScheduleName = `Guest-${id.slice(0, 6)}`;
  const isScheduleUser = () => isSchedule ? user.name : notScheduleName;
  const userMount = {  
    id,
    ...user,
    name: isScheduleUser()
  }

  return userMount;
}