export interface IMediaContent {
  trackName?: string;
  artistName?: string;
  albumName?: string;
}

export class MediaContent implements IMediaContent {
  constructor(public trackName?: string, public artistName?: string, public albumName?: string) {
  }
}
