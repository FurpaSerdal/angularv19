import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({ providedIn: 'root' })
export class SalesInvoicesService extends BaseApiService {


  addInvoice(taskId: number, payload: any): Observable<any> {
    return this.post(`${this.apiUrl}/EFatura/${taskId}/giden/ekle`, payload);
  }

  listPendingInvoices(taskId: number, schedule: string = 'bugun', isSent: boolean, isEInvoice: boolean): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/EFatura/${taskId}/giden/liste/${schedule}/${isSent}/${isEInvoice}`
    );
  }

  convertInvoicesBatch(taskId: number, invoices: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/EFatura/${taskId}/toplu-gonder`,
      invoices
    );
  }

  executeCustomQuery(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EFatura/${taskId}/necip-abi-sorguyu-calistir`);
  }

  generateInvoicePdf(taskId: number, pendingInvoice: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/EFatura/${taskId}/ayrinti/gidecek/pdf`, pendingInvoice, {
      responseType: 'blob'  
    });
  }

  downloadPdfFromUyumsoft(taskId: number, documentId: string): Observable<string> {
    const url = `${this.apiUrl}/EFatura/${taskId}/ayrinti/giden/pdf/${documentId}`;
    console.log('PDF URL:', url);
    return of(url);
  }
}

