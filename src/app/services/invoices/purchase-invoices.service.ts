import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseInvoicesService extends BaseApiService {

  getInvoices(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

  createInvoice(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }
}
