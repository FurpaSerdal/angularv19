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

  
}
