import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  sendFile(fileContent: File) {
    const endpointDev = 'http://localhost:8080/api/map';
    const endpointProd = 'http://imovin.club/api/map';

    const formData: FormData = new FormData();
    formData.append('file', fileContent);

    return this.http.post<any>(endpointDev, formData);
  }

  checkHealth() {
    const endpointDev = 'http://localhost:8080/api/health';
    const endpointProd = 'http://imovin.club/api/health';

    return this.http.get<string>(endpointProd)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
