import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';

@Injectable({ providedIn: 'root' })
export class StockOutService extends BaseApiService {

  getReceipts(taskId: number, schedule: string) {
    return this.get(`/StokCikisFisleri/${API_PATHS.STOCK_OUT}/${taskId}/cikis/fisleri/${schedule}`);
  }
  detailsReceipt(taskId: number, seri: string, sira: number) {
    return this.get(`/StokCikisFisleri/${API_PATHS.STOCK_OUT}/${taskId}/cikis/fisi/${seri}/${sira}`);
  }


  createReceipt(taskId: number, payload: any) {
    return this.post(`/StokCikisFisleri/${API_PATHS.STOCK_OUT}/${taskId}/cikis/fisi/ekle`, payload);
  }
}
