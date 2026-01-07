import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';

@Injectable({ providedIn: 'root' })
export class PurchaseInvoicesService extends BaseApiService {

  getInvoices(taskId: number, schedule: string) {
    return this.get(`/${API_PATHS.PURCHASE_INVOICES}/${taskId}/alis/faturalari/${schedule}`);
  }

  createInvoice(taskId: number, payload: any) {
    return this.post(`/${API_PATHS.PURCHASE_INVOICES}/${taskId}/alis/faturasi/ekle`, payload);
  }
}
