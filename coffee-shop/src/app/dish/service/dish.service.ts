

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Dish} from "../model/dish";
import {Observable} from "rxjs";
import {CookieService} from "../../login/service/cookie.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private API_URL = environment.apiUrl+'/dish';
  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');

  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  saveDish(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(this.API_URL + '/create', dish,{headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  findById(id: number): Observable<Dish> {
    return this.http.get<Dish>(this.API_URL + `/${id}`,{headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  editDish(id: number, dish: Dish): Observable<Dish> {
    return this.http.patch<Dish>(this.API_URL + "/edit"+`/${id}`, dish,{headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

}
