import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseOrdersService extends BaseApiService {

  
  // firma verilen siparişler
  getCompanyOrders(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }
    //firma sipariş detay
  detailsCompanyOrder(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }
    /** Firmaya sipariş ver */
  createCompanyOrder(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }


  //********************************************************************************************* */


  //şube verilen siparişler
  getBranchOrders(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

  // Şubeden sipariş detay
  detailsBranchOrder(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }

  /** Şubeye sipariş ver */
  createBranchOrder(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }
}
