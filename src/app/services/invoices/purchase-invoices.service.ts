import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({ providedIn: 'root' })
export class PurchaseInvoicesService extends BaseApiService {

  getInvoices(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

  createInvoice(taskId: number, payload: any): Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }
}
