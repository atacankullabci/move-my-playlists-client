import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {IPlaylist} from "./shared/playlist.model";
import {IMediaContent} from "./shared/media-content.model";
import {LOCAL_SERVICE_URL} from "./app.constants";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private playlist = new BehaviorSubject<IPlaylist[]>([]);
  private tracks = new BehaviorSubject<IMediaContent[]>([]);

  private serviceUrl = LOCAL_SERVICE_URL;

  setPlaylists(content) {
    this.playlist.next(content);
  }

  getPlaylists() {
    return this.playlist.asObservable();
  }

  setMediaContent(content) {
    this.tracks.next(content);
  }

  getMediaContent() {
    return this.tracks.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  sendFile(fileContent: File, clientIp: string, id: string, playlistOption: string) {
    debugger;
    const url = this.serviceUrl + '/api/map';

    const headers = new HttpHeaders({
      'client-ip': clientIp,
      'id': id,
      'parse-playlist': playlistOption
    });

    const formData: FormData = new FormData();
    formData.append('file', fileContent);

    return this.http.post<any>(url, formData, {headers: headers});
  }

  migrateTracks(id: string) {
    const url = this.serviceUrl + '/api/migrate/tracks';

    const headers = new HttpHeaders({
      'id': id
    });

    return this.http.post<boolean>(url, null, {headers: headers});
  }

  migratePlaylists(id: string, playlist: IPlaylist[]) {
    const url = this.serviceUrl + '/api/migrate/playlists';

    const headers = new HttpHeaders({
      'id': id
    });

    return this.http.post<IPlaylist[]>(url, playlist, {headers: headers});
  }
}
