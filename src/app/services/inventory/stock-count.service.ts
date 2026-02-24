import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockCountService extends BaseApiService {

  getResults(taskId: number,schedule:string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }
  detailsResult(taskId: number, tarih: string, sym_evrakno: number):Observable<any> {
    return this.get(`ayrinti/${taskId}/sayim-sonuclari/${tarih}/${sym_evrakno}`);
  }

  createResult(taskId: number, payload: any) {
    return this.post(`ekle/${taskId}`, payload);
  }
}
