import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../shared/base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PurchaseOrdersService extends BaseApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  
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
  

GetGreenGrocerProducts(token: string): Observable<any> {
  const url = 'http://10.0.0.100:5001/api/products/GetGreenGrocerProducts';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  return this.http.get(url, { headers });
}
GetBakeryProducts(token: string): Observable<any> {
  const url = 'http://10.0.0.100:5001/api/products/GetBakeryProducts';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  return this.http.get(url, { headers });
}


}

