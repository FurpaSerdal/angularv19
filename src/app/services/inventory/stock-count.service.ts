import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockCountService extends BaseApiService {

  getResults(taskId: number,schedule:string):Observable<any[]> {
    return this.get(`${API_PATHS.STOCK_COUNTS}/${taskId}/sayim-sonuclari/sonuclar/${schedule}`);
  }
  detailsResult(taskId: number,  sym_evrakno: number,schedule:string):Observable<any> {
    return this.get(`${API_PATHS.STOCK_COUNTS}/${taskId}/sayim-sonuclari/sonuc/${sym_evrakno}/${schedule}`);
  }

  createResult(taskId: number, payload: any) {
    return this.post(`${API_PATHS.STOCK_COUNTS}/${taskId}/sayim-sonuclari/sonuc/ekle`, payload);
  }
}
