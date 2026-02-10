import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';
import { DetayResponse } from '../../models/detay';

@Injectable({ providedIn: 'root' })
export class GoodsReceiptNotesService extends BaseApiService {

  // firmalardan mal kabul işlemleri
  getCompanyReceipts(taskId: number, schedule: string): Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

    detailsCompanyReceipt(taskId: number, seri: string, sira: number): Observable<DetayResponse> {
    return this.get(`/ayrinti/${taskId}/${seri}/${sira}`);
  }

   createCompanyReceipt(taskId: number,payload: any): Observable<any> {
    return this.post(`/ekle/${taskId}`, payload);
  }

  // subelerden mal kabul işlemleri

  getBranchReceipts(taskId: number, schedule: string): Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }


  detailsBranchReceipt(taskId: number, seri: string, sira: number): Observable<DetayResponse> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }

 
  createBranchReceipt(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }

  findshipmentnote(taskId: number, evrakNo?: string, qrData?: string): Observable<DetayResponse> {
    return this.post(`evrak-bul/${taskId}`, { evrakNo, qrData });

  }
}
