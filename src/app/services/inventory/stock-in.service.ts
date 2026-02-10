import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({ providedIn: 'root' })
export class StockInService extends BaseApiService {

  getReceipts(taskId: number, schedule: string) {
    return this.get(`/liste/${taskId}/${schedule}`);
  }
  detailsReceipt(taskId: number, seri: string, sira: number) {
    return this.get(`/ayrinti/${taskId}/${seri}/${sira}`);
  }

  createReceipt(taskId: number, payload: any) {
    return this.post(`/ekle/${taskId}`, payload);
  }
}
