import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  addPost(fileContent: File) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'text/xml');

    return this.http.post<any>('http://localhost:8080/api/map', fileContent, {headers})
      .subscribe((response) => {
        console.log(response)
      });
  }

}
