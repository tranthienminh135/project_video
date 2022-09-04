import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Order} from '../model/order';
import {CookieService} from 'src/app/login/service/cookie.service';
import {Dish} from 'src/app/dish/model/dish';
import {DishType} from 'src/app/dish/model/dish-type';
import {CoffeeTable} from '../model/CoffeeTable';
import {environment} from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private urlGetDishes = API_URL + '/dish/getDishFindIdDishType';
  private urlGetDishHasOrder = API_URL + '/dish-order/get-order-have-code';
  private urlGetDish = API_URL + '/dish/findById';
  private urlGetDishType = API_URL + '/dishType/getDishTypeList';
  private urlCreateOrder = API_URL + '/dish-order/create-dishOrder';
  private urlUpdateTable = API_URL + '/api/payment/table/';
  private urlGetTable = API_URL + '/api/payment/getTable/';
  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');

  constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  getAllDish(id: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.urlGetDishes + `/${id}`, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  redirect(id: number, page): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.urlGetDishes + `/${id}` + `?page=${page}`, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  getAllDishType(): Observable<DishType[]> {
    return this.http.get<DishType[]>(this.urlGetDishType, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(this.urlGetDish + `/${id}`, {headers: new HttpHeaders({'authorization': this.header})}).pipe()
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.urlCreateOrder, order, {headers: new HttpHeaders({'authorization': this.header})});
  }

  updateTable(id: string): Observable<CoffeeTable> {
    return this.http.get<CoffeeTable>(this.urlUpdateTable + `${id}`, {headers: new HttpHeaders({'authorization': this.header})});
  }

  getTable(code: string): Observable<CoffeeTable> {
    return this.http.get<CoffeeTable>(this.urlGetTable + `${code}`, {headers: new HttpHeaders({'authorization': this.header})});
  }

  getAllDishHasOrder(codeTable: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.urlGetDishHasOrder + `/${codeTable}`, {headers: new HttpHeaders({'authorization': this.header})});
  }

}
