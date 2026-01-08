import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoodsReceiptNotesService extends BaseApiService {

  // firmalardan mal kabul işlemleri
  getCompanyReceipts(taskId: number, schedule: string): Observable<any> {
    return this.get(`${API_PATHS.GOODS_RECEIPTS}/${taskId}/firmalardan/mal-kabuller/${schedule}`);
  }

    detailsCompanyReceipt(taskId: number, seri: string, sira: number): Observable<any> {
    return this.get(`${API_PATHS.GOODS_RECEIPTS}/${taskId}/firmalardan/mal-kabul/${seri}/${sira}`);
  }

   createCompanyReceipt(taskId: number,payload: any): Observable<any> {
    return this.post(`${API_PATHS.GOODS_RECEIPTS}/${taskId}/firmalardan/mal-kabul/yap`, payload);
  }

  // subelerden mal kabul işlemleri

  getBranchReceipts(taskId: number, schedule: string): Observable<any> {
    return this.get(`${API_PATHS.GOODS_RECEIPTS}/${taskId}/subelerden/mal-kabuller/${schedule}`);
  }


  detailsBranchReceipt(taskId: number, seri: string, sira: number): Observable<any> {
    return this.get(`${API_PATHS.GOODS_RECEIPTS}/${taskId}/subelerden/mal-kabul/${seri}/${sira}`);
  }

 
  createBranchReceipt(taskId: number, payload: any): Observable<any> {
    return this.post(`${API_PATHS.GOODS_RECEIPTS}/${taskId}/subelerden/mal-kabul/yap`, payload);
  }
}
