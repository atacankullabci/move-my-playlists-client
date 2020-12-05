import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {IPlaylist} from "./shared/playlist.model";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private playlist = new BehaviorSubject<IPlaylist[]>([]);

  setMediaContents(content) {
    this.playlist.next(content);
  }

  getMediaContents() {
    return this.playlist.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  sendFile(fileContent: File, clientIp: string, id: string, playlistOption: string) {
    const dev = 'http://localhost:8080/api/map';
    //const prod = 'https://movemyplaylists.com/api/map';

    const headers = new HttpHeaders({
      'client-ip': clientIp,
      'id': id,
      'parse-playlist': playlistOption
    });

    const formData: FormData = new FormData();
    formData.append('file', fileContent);

    return this.http.post<any>(dev, formData, {headers: headers});
  }

  migrateTracks(id: string) {
    const dev = 'http://localhost:8080/api/migrate/tracks';
    //const prod = 'https://movemyplaylists.com/api/migrate/tracks';

    const headers = new HttpHeaders({
      'id': id
    });

    return this.http.post<boolean>(dev, null, {headers: headers});
  }

  migratePlaylists(id: string, playlist: IPlaylist[]) {
    const dev = 'http://localhost:8080/api/migrate/playlists';
    //const prod = 'https://movemyplaylists.com/api/migrate/playlists';

    const headers = new HttpHeaders({
      'id': id
    });

    return this.http.post(dev, playlist, {headers: headers});
  }
}
