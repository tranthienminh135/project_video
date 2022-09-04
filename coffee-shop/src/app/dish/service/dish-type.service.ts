import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DishType} from "../model/dish-type";
import {Observable} from "rxjs";
import {CookieService} from "../../login/service/cookie.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DishTypeService {

  private API_URL = environment.apiUrl + "/dishType"

  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');
  constructor(private http: HttpClient,private cookieService: CookieService) {
  }

  getAll(): Observable<DishType[]> {
    return this.http.get<DishType[]>(this.API_URL + '/list_dish_type',{headers: new HttpHeaders({'authorization': this.header})}).pipe()
  }
}

