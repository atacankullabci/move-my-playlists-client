import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {IUserInfo} from "./shared/user-info.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  checkUser(userId: string) {
    //const dev = 'http://localhost:8080/api/users';
    const prod = 'https://imovin.club/api/users';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<IUserInfo>(prod, {headers: headers, observe: 'response'});
  }

  getUserProgress(userId: string): Observable<HttpResponse<boolean>> {
    //const dev = 'http://localhost:8080/api/progress';
    const prod = 'https://imovin.club/api/progress';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<boolean>(prod, {headers: headers, observe: 'response'});
  }
}
