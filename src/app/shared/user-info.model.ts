export interface IUserInfo {
  username?: string;
  externalUrl?: string;
}

export class UserInfo implements IUserInfo {
  constructor(public username?: string, public externalUrl?: string) {
  }
}
