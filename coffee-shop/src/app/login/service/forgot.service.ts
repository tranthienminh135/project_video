import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ForgotService {
  private SEND_MAIL_URL = environment.apiUrl + "/sendSimpleEmail";
  private FIND_PASSWORD_URL = environment.apiUrl + "/findPassword";

  constructor(private httpClient: HttpClient) {
  }

  onForgot(username: string): Observable<any> {
    return this.httpClient.post(this.SEND_MAIL_URL, {username: username});
  }

  onFindPassword(value: any): Observable<any> {
    console.log(value)
    return  this.httpClient.post(this.FIND_PASSWORD_URL, {
      password: value.pass.password,
      confirmPassword: value.pass.confirmPassword,
      token: value.token
    })
  }
}
