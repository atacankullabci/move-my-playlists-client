import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IUserInfo} from "./shared/user-info.model";
import {IUserImage} from "./shared/user-image.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  checkUser(user: IUserInfo) {
    const endpointDev = 'http://localhost:8080/api/users';
    const endpointProd = 'http://imovin.club/api/users';

    const headers = new HttpHeaders({
      'username': user.username,
      'external-url': user.externalUrl,
      'code': user.code
    });

    return this.http.get<IUserImage>(endpointProd, {headers: headers, observe: 'response'});
  }

}
