import {IMediaContent} from "./media-content.model";

export interface IPlaylist {
  name?: string;
  mediaContents?: IMediaContent[];
}

export class Playlist implements IPlaylist {
  constructor(public name?: string, public mediaContents?: IMediaContent[]) {
  }
}
