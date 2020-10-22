import {IUserImage} from "./user-image.model";

export interface IUserInfo {
  username?: string;
  externalUrl?: string;
  userImage?: IUserImage;
}

export class UserInfo implements IUserInfo {
  constructor(public username?: string, public externalUrl?: string, public code?: string, public userImage?: IUserImage) {
  }
}
