import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesOrdersService extends BaseApiService {

  /** Firmalardan alınan siparişler */
  getCompanyOrders(taskId: number, schedule: string):Observable<any> {
    return this.get(`${API_PATHS.SALES_ORDERS}/${taskId}/firmalara/siparisler/${schedule}`);
  }

    /** Firmadan sipariş al */
  createCompanyOrder(taskId: number, payload: any): Observable<any> {
    return this.post(`${API_PATHS.SALES_ORDERS}/${taskId}/firmalara/siparis-al`, payload);
  }


  //firma sipariş detay
    detailsCompanyOrder(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`${API_PATHS.SALES_ORDERS}/${taskId}/firmalara/siparis/${seri}/${sira}`);
  }


  //*************************************************************************** */


  /** Şubelerden alınan siparişler */
  getBranchOrders(taskId: number, schedule: string):Observable<any> {
    return this.get(`${API_PATHS.SALES_ORDERS}/${taskId}/subelerden/siparisler/${schedule}`);
  }

  // Şube sipariş detay
  detailsBranchOrder(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`${API_PATHS.SALES_ORDERS}/${taskId}/subelerden/siparis/${seri}/${sira}`);
  }


  /** Şubeden sipariş al */
  createBranchOrder(taskId: number, payload: any): Observable<any> {
    return this.post(`${API_PATHS.SALES_ORDERS}/${taskId}/subelerden/siparis-al`, payload);
  }}