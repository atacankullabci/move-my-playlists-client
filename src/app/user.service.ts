import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IUserInfo} from "./shared/user-info.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  checkUser(userId: string) {
    const dev = 'http://localhost:8080/api/users';
    const prod = 'https://imovin.club/api/users';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<IUserInfo>(dev, {headers: headers, observe: 'response'});
  }

}
