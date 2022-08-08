import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FindOrderReq } from '../../models/find-order-req';
import { OrderListReq } from '../../models/order-list-req';
import { OrderListAnsw } from '../../models/order-list-answ';
import { OrderBodyReq } from '../../models/order-body-req';
import { OrderBodyAnsw } from '../../models/order-body-answ';
import { ToCassa } from '../../models/to-cassa';
import { PauseOrderReq } from '../../models/pause-order-req';
import { BelPostReq } from '../../models/bel-post-req';
import { BelPostAnsw } from '../../models/bel-post-answ';
import { Status } from 'src/app/common/models/status';
import { Changer } from '../../models/changer';
import { DelPostRequest } from '../../models/del-post-request';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  urlOrder = environment.apiUrl + '/ishop';
  urlGetOders = this.urlOrder + '/orderlist/';
  urlOrderSearch = this.urlOrder + '/findorder/';
  urlGetSuborder = this.urlOrder + '/suborder/';
  urlToCassa = this.urlOrder + '/cassa/';
  urlPause = this.urlOrder + '/pause/';
  urlBelpost = this.urlOrder + '/belpost/';
  urlReturn = this.urlOrder + '/back/';
  urlReturnToAssembly = this.urlOrder + '/backorder/';
  urlDlete = this.urlOrder + '/delete/';
  urlToBitrix = this.urlOrder + '/oms/';
  urlSaveChange = this.urlOrder + '/change/';
  urlDelpost = this.urlOrder + '/delpost/';
  urlEndOrder = this.urlOrder + '/endOrder/';

  constructor(private http: HttpClient) { }

  getOrders(data: OrderListReq): Observable<Array<OrderListAnsw>> {
    return this.http.post<any>(`${this.urlGetOders}`, data);
  }

  orderSearch(data: FindOrderReq): Observable<Array<OrderListAnsw>> {
    return this.http.post<any>(`${this.urlOrderSearch}`, data);
  }

  getSuborder(data: OrderBodyReq): Observable<OrderBodyAnsw> {
    return this.http.post<any>(`${this.urlGetSuborder}`, data);
  }

  orderPause(data: PauseOrderReq): Observable<any> {
    return this.http.post<any>(`${this.urlPause}`, data);
  }

  orderGo(data): Observable<any> {
    return this.http.post<any>(`${this.urlOrder}`, data);
  }

  orderShow(data): Observable<any> {
    return this.http.post<any>(`${this.urlOrder}`, data);
  }

  orderWriteToCashbox(data: ToCassa): Observable<any> {
    return this.http.post<any>(`${this.urlToCassa}`, data);
  }

  orderReturnToAssembly(data: PauseOrderReq): Observable<Status> {
    return this.http.post<Status>(`${this.urlReturnToAssembly}`, data);
  }

  getBarcode(data: BelPostReq): Observable<BelPostAnsw> {
    return this.http.post<BelPostAnsw>(`${this.urlBelpost}`, data);
  }

  orderReturn(data: PauseOrderReq): Observable<Status> {
    return this.http.post<Status>(`${this.urlReturn}`, data);
  }

  orderDelete(data: PauseOrderReq): Observable<Status> {
    return this.http.post<Status>(`${this.urlDlete}`, data);
  }

  orderSendToBitrix(data: FindOrderReq): Observable<Status> {
    return this.http.post<Status>(`${this.urlToBitrix}`, data);
  }

  orderSaveChange(data: Changer): Observable<Status> {
    return this.http.post<Status>(`${this.urlSaveChange}`, data);
  }

  orderDeleteBelpostBarcode(data: DelPostRequest): Observable<Status> {
    return this.http.post<Status>(`${this.urlDelpost}`, data);
  }

  orderCompliteOrder(data:FindOrderReq): Observable<Status>{
    return this.http.post<Status>(`${this.urlEndOrder}`, data);
  }
}
