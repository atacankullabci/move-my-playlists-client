import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IMediaContent} from "./shared/media-content.model";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  sendFile(fileContent: File, clientIp: string, id: string) {
    const dev = 'http://localhost:8080/api/map';
    const prod = 'http://imovin.club/api/map';

    const headers = new HttpHeaders({
      'client-ip': clientIp,
      'id': id
    });

    const formData: FormData = new FormData();
    formData.append('file', fileContent);

    return this.http.post<IMediaContent[]>(dev, formData, {headers: headers});
  }

  migrate(id: string) {
    const dev = 'http://localhost:8080/api/migrate';
    const prod = 'http://imovin.club/api/migrate';

    const headers = new HttpHeaders({
      'id': id
    });

    return this.http.post<IMediaContent[]>(dev, null, {headers: headers});
  }

  checkHealth() {
    //const endpointDev = 'http://localhost:8080/api/health';
    const endpointProd = 'http://imovin.club/api/health';

    return this.http.get<string>(endpointProd)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
