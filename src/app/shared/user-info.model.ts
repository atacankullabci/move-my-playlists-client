export interface IUserInfo {
  username?: string;
  externalUrl?: string;
  code?: string;
}

export class UserInfo implements IUserInfo {
  constructor(public username?: string, public externalUrl?: string, public code?: string) {
  }
}
