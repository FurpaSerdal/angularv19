import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockCountService extends BaseApiService {

  getResults(taskId: number,schedule:string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }
  detailsResult(taskId: number,  sym_evrakno: number,seri:string | null = null):Observable<any> {
    console.log('API çağrısı için gönderilen parametreler:', { taskId, seri, sym_evrakno });
    return this.get(`ayrinti/${taskId}/${seri}/${sym_evrakno}`);
  }

  createResult(taskId: number, payload: any) {
    return this.post(`ekle/${taskId}`, payload);
  }
}
