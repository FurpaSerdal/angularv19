import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({ providedIn: 'root' })
export class SalesOrdersService extends BaseApiService {

  /** Firmalardan alınan siparişler */
  getCompanyOrders(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

    /** Firmadan sipariş al */
  createCompanyOrder(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }


  //firma sipariş detay
    detailsCompanyOrder(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }


  //*************************************************************************** */


  /** Şubelerden alınan siparişler */
  getBranchOrders(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

  // Şube sipariş detay
  detailsBranchOrder(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }


  /** Şubeden sipariş al */
  createBranchOrder(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }}