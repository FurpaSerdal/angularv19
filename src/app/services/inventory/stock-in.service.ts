import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';

@Injectable({ providedIn: 'root' })
export class StockInService extends BaseApiService {

  getReceipts(taskId: number, schedule: string) {
    return this.get(`/StokGirisFisleri/${API_PATHS.STOCK_IN}/${taskId}/giris/fisleri/${schedule}`);
  }
  detailsReceipt(taskId: number, seri: string, sira: number) {
    return this.get(`/StokGirisFisleri/${API_PATHS.STOCK_IN}/${taskId}/giris/fisi/${seri}/${sira}`);
  }

  createReceipt(taskId: number, payload: any) {
    return this.post(`/StokGirisFisleri/${API_PATHS.STOCK_IN}/${taskId}/giris/fisi/ekle`, payload);
  }
}
