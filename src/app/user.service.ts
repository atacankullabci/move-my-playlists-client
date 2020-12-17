import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {IUserInfo} from "./shared/user-info.model";
import {Observable} from "rxjs";
import {PROD_SERVICE_URL} from "./app.constants";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private serviceUrl = LOCAL_SERVICE_URL;
  private serviceUrl = PROD_SERVICE_URL;

  constructor(private http: HttpClient) {
  }

  getRandomState() {
    const url = this.serviceUrl + '/api/state';

    return this.http.get(url, {responseType: 'text'});
  }

  checkUser(userId: string) {
    const url = this.serviceUrl + '/api/users';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<IUserInfo>(url, {headers: headers, observe: 'response'});
  }

  getUserProgress(userId: string): Observable<HttpResponse<boolean>> {
    const url = this.serviceUrl + '/api/progress';

    const headers = new HttpHeaders({
      'id': userId
    });

    return this.http.get<boolean>(url, {headers: headers, observe: 'response'});
  }
}
