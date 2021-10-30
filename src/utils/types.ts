export interface IUser {
  name: string;
  id: string;
}

export interface IMessage {
  message: string;
  date: string;
  user: IUser;
}
