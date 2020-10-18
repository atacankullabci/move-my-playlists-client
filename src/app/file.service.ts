import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IMediaContent} from "./shared/media-content.model";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  sendFile(fileContent: File, clientIp: string, username: string, externalUrl: string) {
    //const endpointDev = 'http://localhost:8080/api/map';
    const endpointProd = 'http://imovin.club/api/map';

    const headers = new HttpHeaders({
      'client-ip': clientIp,
      'username': username,
      'external-url': externalUrl
    });

    const formData: FormData = new FormData();
    formData.append('file', fileContent);

    return this.http.post<IMediaContent[]>(endpointProd, formData, {headers: headers});
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
