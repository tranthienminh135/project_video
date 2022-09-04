import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Dish} from "../dish/model/dish";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DishTypeService {
  private header = 'Bearer ' + localStorage.getItem('jwToken');

  private URL_DISH_TYPE = environment.apiUrl + "/dishType"

  constructor(private httpClient: HttpClient) {
  }


  getDishTypePage(): Observable<Dish[]> {
    return this.httpClient.get<Dish[]>(this.URL_DISH_TYPE + "/getDishTypePage", {headers: new HttpHeaders({'authorization': this.header})}).pipe()
  }
}
