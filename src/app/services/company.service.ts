// services/company.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { CariHesapAraCT, StokAraCT, StokBulDto } from '../models/evrakKaydet';
import { FirmaOSDto, OnerilenFirmaSiparisCT } from '../models/RecommendOrder';

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

  // =====================================================
  // FİRMA – ÖNERİLEN SİPARİŞLER
  // =====================================================

  /**
   * Firma için sistem tarafından önerilen siparişleri getirir
   * @param taskId Görev ID
   * @param payload Sipariş öneri kriterleri
   */
  getRecommendedCompanyOrders(
    taskId: number,
    payload: FirmaOSDto
  ): Observable<OnerilenFirmaSiparisCT[]> {
    return this.http.post<OnerilenFirmaSiparisCT[]>(
      `${this.apiUrl}/gorevlerim/${taskId}/firma-onerilen-siparis`,
      payload
    );
  }

  // =====================================================
  // FİRMALARDAN ALINAN SİPARİŞLER
  // =====================================================

  /**
   * Firmalardan alınan siparişleri zamanlamaya göre listeler
   * @param taskId Görev ID
   * @param schedule Zamanlama (daily, weekly vb.)
   */
  getCompanyPurchaseOrders(
    taskId: number,
    schedule: string
  ) {
    return this.http.get(
      `${this.apiUrl}/AlinanSiparisler/${taskId}/firmalardan/siparisler/${schedule}`
    );
  }

  /**
   * Seri ve sıra numarasına göre firma siparişini getirir
   * @param taskId Görev ID
   * @param serial Evrak seri
   * @param sequence Evrak sıra
   */
  getCompanyPurchaseOrderBySerial(
    taskId: number,
    serial: string,
    sequence: number
  ) {
    return this.http.get(
      `${this.apiUrl}/AlinanSiparisler/${taskId}/firmalardan/siparis/${serial}/${sequence}`
    );
  }

  /**
   * Firmadan yeni sipariş alır (kayıt oluşturur)
   * @param taskId Görev ID
   * @param payload Sipariş bilgileri
   */
  createCompanyPurchaseOrder(
    taskId: number,
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/AlinanSiparisler/${taskId}/firmalardan/siparis-al`,
      payload
    );
  }

  // =====================================================
  // FİRMALARDAN MAL KABUL İRSALİYELERİ
  // =====================================================

  /**
   * Seri ve sıra numarasına göre mal kabul irsaliyesini getirir
   * @param taskId Görev ID
   * @param serial Evrak seri
   * @param sequence Evrak sıra
   */
  getCompanyGoodsReceiptBySerial(
    taskId: number,
    serial: string,
    sequence: number
  ) {
    return this.http.get(
      `${this.apiUrl}/MalKabulIrsaliyeleri/${taskId}/firmalardan/mal-kabul/${serial}/${sequence}`
    );
  }

  /**
   * Firmalardan gelen mal kabul irsaliyelerini listeler
   * @param taskId Görev ID
   * @param schedule Zamanlama
   */
  getCompanyGoodsReceipts(
    taskId: number,
    schedule: string
  ) {
    return this.http.get(
      `${this.apiUrl}/MalKabulIrsaliyeleri/${taskId}/firmalardan/mal-kabuller/${schedule}`
    );
  }

  /**
   * Firmadan mal kabul işlemini gerçekleştirir
   * @param payload Mal kabul bilgileri
   */
  createCompanyGoodsReceipt(
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/MalKabulIrsaliyeleri/firmalardan/mal-kabul/yap`,
      payload
    );
  }

  // =====================================================
  // FİRMALARA SEVK İRSALİYELERİ
  // =====================================================

  /**
   * Firmalara sevk işlemi oluşturur
   * @param taskId Görev ID
   * @param payload Sevk bilgileri
   */
  createCompanyShipment(
    taskId: number,
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/SevkIrsaliyeleri/${taskId}/firmalara/sevket`,
      payload
    );
  }

  /**
   * Seri ve sıra numarasına göre sevk irsaliyesini getirir
   * @param taskId Görev ID
   * @param serial Evrak seri
   * @param sequence Evrak sıra
   */
  getCompanyShipmentBySerial(
    taskId: number,
    serial: string,
    sequence: number
  ) {
    return this.http.get(
      `${this.apiUrl}/SevkIrsaliyeleri/${taskId}/firmalara/sevk/${serial}/${sequence}`
    );
  }

  /**
   * Firmalara yapılan sevkleri zamanlamaya göre listeler
   * @param taskId Görev ID
   * @param schedule Zamanlama
   */
  getCompanyShipments(
    taskId: number,
    schedule: string
  ) {
    return this.http.get(
      `${this.apiUrl}/SevkIrsaliyeleri/${taskId}/firmalara/sevkler/${schedule}`
    );
  }
}
