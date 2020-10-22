export interface IUserImage {
  height?: string;
  width?: string;
  url?: string;
}

export class UserImage implements IUserImage {
  constructor(public height?: string, public width?: string, public url?: string) {
  }
}
