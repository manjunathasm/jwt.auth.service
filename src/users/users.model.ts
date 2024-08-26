export class User {
  id: number;
  username: string;
  password: string;
  lastLoggedIn: number;
}

export interface IUser extends User {}
