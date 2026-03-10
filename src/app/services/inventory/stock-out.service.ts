import { Injectable } from '@angular/core';
import { catchError,Observable } from 'rxjs';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({ providedIn: 'root' })
export class StockOutService extends BaseApiService {

  getReceipts(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }
  detailsReceipt(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }


  createReceipt(taskId: number, payload: any):Observable<any> {
    return this.post(`ekle/${taskId}`, payload).pipe(
      // map(response => response) // Gerekirse yanıtı işleyebilirsiniz
      catchError(error => {
        console.error('Sevk irsaliyesi oluşturulurken hata oluştu:', error);
        throw error; // Hatanın üst katmanlara iletilmesi
      })
    );
  }
}
