// services/company.service.ts
import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { CariHesapAraCT,StokAraCT,StokBulDto } from '../models/ortakModeller';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  // Backend base api url
  private readonly apiUrl = environment.apiurl;

  constructor(private http: HttpClient) { }

  // =====================================================
  // CARI HESAP ARAMA
  // =====================================================

  /**
   * Cari kod veya cari adına göre cari hesap araması yapar
   * @param query Aranacak cari bilgisi
   */
  searchCustomerAccount(
    query: string
  ): Observable<CariHesapAraCT[]> {
    const params = new HttpParams().set('cari', query.trim());
    return this.http.get<CariHesapAraCT[]>(
      `${this.apiUrl}/cari-hesaplar/cari`,
      { params }
    );
  }

  // =====================================================
  // STOK ARAMA (GET)
  // =====================================================

  /**
   * Stok kodu veya stok adına göre stok araması yapar
   * @param query Aranacak stok bilgisi
   */
  searchStock(
    query: string
  ): Observable<StokAraCT[]> {
    const params = new HttpParams().set('bul', query.trim());
    return this.http.get<StokAraCT[]>(
      `${this.apiUrl}/stoklar/ara`,
      { params }
    );
  }

  // =====================================================
  // CARI KODU İLE STOK ARAMA (POST)
  // =====================================================

  /**
   * Seçilen cari koduna göre ilgili stokları getirir
   * @param dto Cari ve stok filtre bilgileri
   */
  searchStockByCustomerCode(
    dto: StokBulDto
  ): Observable<StokAraCT[]> {
    return this.http.post<StokAraCT[]>(
      `${this.apiUrl}/stoklar/cari-stok-ara`,
      dto
    );
  }

   // ırsalıye pdf görme
  getEWaybillPdf(İttn:string): Observable<Blob> {

    return this.http.get(`${this.apiUrl}/EIrsaliye/ayrinti/giden/pdf/${İttn}`, { responseType: 'blob' });

  }
  
}

