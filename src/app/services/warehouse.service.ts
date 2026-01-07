import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";

import { DepoOSDto, OnerilenDepoSiparisleriCT } from "../models/RecommendOrder";
import { StokAraCT } from "../models/evrakKaydet";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  // Backend base api url
  private apiUrl = environment.apiurl;

  constructor(private http: HttpClient) {}

  // =====================================================
  // WAREHOUSE – ÖNERİLEN SİPARİŞLER
  // =====================================================

  /**
   * Depo için sistem tarafından önerilen siparişleri getirir
   * @param taskId Görev ID
   * @param payload Sipariş öneri kriterleri
   */
  getRecommendedWarehouseOrders(
    taskId: number,
    payload: DepoOSDto
  ): Observable<OnerilenDepoSiparisleriCT[]> {
    return this.http.post<OnerilenDepoSiparisleriCT[]>(
      `${this.apiUrl}/gorevlerim/${taskId}/depo-onerilen-siparis`,
      payload
    );
  }

  /**
   * Depoya ait mal kabul siparişlerini listeler
   * @param taskId Görev ID
   */
  getWarehouseReceiptOrders(
    taskId: number
  ): Observable<OnerilenDepoSiparisleriCT[]> {
    return this.http.get<OnerilenDepoSiparisleriCT[]>(
      `${this.apiUrl}/gorevlerim/${taskId}/depo-mal-kabul-siparis`
    );
  }

  // =====================================================
  // STOK ARAMA
  // =====================================================

  /**
   * Stok kodu veya stok adına göre arama yapar
   * @param query Aranacak kelime
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
  // ŞUBELERDEN ALINAN SİPARİŞLER
  // =====================================================

  /**
   * Şubelerden alınan siparişleri zamanlamaya göre listeler
   * @param taskId Görev ID
   * @param schedule Zamanlama (daily, weekly vb.)
   */
  getBranchPurchaseOrders(
    taskId: number,
    schedule: string
  ) {
    return this.http.get(
      `${this.apiUrl}/AlinanSiparisler/${taskId}/subelerden/siparisler/${schedule}`
    );
  }

  /**
   * Seri ve sıra numarasına göre şube siparişini getirir
   * @param taskId Görev ID
   * @param serial Evrak seri
   * @param sequence Evrak sıra
   */
  getBranchPurchaseOrderBySerial(
    taskId: number,
    serial: string,
    sequence: number
  ) {
    return this.http.get(
      `${this.apiUrl}/AlinanSiparisler/${taskId}/subelerden/siparis/${serial}/${sequence}`
    );
  }

  /**
   * Şubeden yeni sipariş alır (kayıt oluşturur)
   * @param taskId Görev ID
   * @param payload Sipariş bilgileri
   */
  createBranchPurchaseOrder(
    taskId: number,
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/AlinanSiparisler/${taskId}/subelerden/siparis-al`,
      payload
    );
  }

  // =====================================================
  // ŞUBELERDEN MAL KABUL İRSALİYELERİ
  // =====================================================

  /**
   * Seri ve sıra numarasına göre mal kabul irsaliyesini getirir
   * @param taskId Görev ID
   * @param serial Evrak seri
   * @param sequence Evrak sıra
   */
  getBranchGoodsReceiptBySerial(
    taskId: number,
    serial: string,
    sequence: number
  ) {
    return this.http.get(
      `${this.apiUrl}/MalKabulIrsaliyeleri/${taskId}/subelerden/mal-kabul/${serial}/${sequence}`
    );
  }

  /**
   * Şubelerden gelen mal kabul irsaliyelerini listeler
   * @param taskId Görev ID
   * @param schedule Zamanlama
   */
  getBranchGoodsReceipts(
    taskId: number,
    schedule: string
  ) {
    return this.http.get(
      `${this.apiUrl}/MalKabulIrsaliyeleri/${taskId}/subelerden/mal-kabuller/${schedule}`
    );
  }

  // =====================================================
  // ŞUBELERE SEVK İRSALİYELERİ
  // =====================================================

  /**
   * Seri ve sıra numarasına göre sevk irsaliyesini getirir
   * @param taskId Görev ID
   * @param serial Evrak seri
   * @param sequence Evrak sıra
   */
  getShipmentBySerial(
    taskId: number,
    serial: string,
    sequence: number
  ) {
    return this.http.get(
      `${this.apiUrl}/SevkIrsaliyeleri/${taskId}/subelere/sevk/${serial}/${sequence}`
    );
  }

  /**
   * Şubelere yapılan sevkleri zamanlamaya göre listeler
   * @param taskId Görev ID
   * @param schedule Zamanlama
   */
  getShipments(
    taskId: number,
    schedule: string
  ) {
    return this.http.get(
      `${this.apiUrl}/SevkIrsaliyeleri/${taskId}/subelere/sevkler/${schedule}`
    );
  }

  /**
   * Şubelere yeni sevk irsaliyesi oluşturur
   * @param taskId Görev ID
   * @param payload Sevk bilgileri
   */
  createShipment(
    taskId: number,
    payload: any
  ) {
    return this.http.post(
      `${this.apiUrl}/api/v13/SevkIrsaliyeleri/${taskId}/subelere/sevket`,
      payload
    );
  }
}
