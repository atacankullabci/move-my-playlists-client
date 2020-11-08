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
    const prod = 'https://imovin.club/api/map';

    const headers = new HttpHeaders({
      'client-ip': clientIp,
      'id': id,
      'parse-playlist': playlistOption
    });

    const formData: FormData = new FormData();
    formData.append('file', fileContent);

    return this.http.post<any>(dev, formData, {headers: headers});
  }

  migrate(id: string) {
    const dev = 'http://localhost:8080/api/migrate';
    const prod = 'https://imovin.club/api/migrate';

    const headers = new HttpHeaders({
      'id': id
    });

    return this.http.post<boolean>(prod, null, {headers: headers});
  }
}
