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

  getRandomState() {
    //const dev = 'http://localhost:8080/api/state';
    const prod = 'https://movemyplaylists.com/api/state';

    return this.http.get(prod, {responseType: 'text'});
  }

  checkUser(userId: string) {
    //const dev = 'http://localhost:8080/api/users';
    const prod = 'https://movemyplaylists.com/api/users';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<IUserInfo>(prod, {headers: headers, observe: 'response'});
  }

  getUserProgress(userId: string): Observable<HttpResponse<boolean>> {
    //const dev = 'http://localhost:8080/api/progress';
    const prod = 'https://movemyplaylists.com/api/progress';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<boolean>(prod, {headers: headers, observe: 'response'});
  }
}
