import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { DepoCari, StokAraCT } from "../models/ortakModeller";
import { DepoEIrsaliyesiGonderDto } from "../models/e-IrsaliyeGonderModel";


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
  
  searchWarehouse(search: string): Observable<DepoCari[]> {
    return this.http.get<DepoCari[]>(
      `${this.apiUrl}/subeler/sube-bilgileri/ara/${search}`,
   
    );
  }

  SendOutboxShippingDespatch(shipmentData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/EIrsaliye/gonder/depo-irsaliyesi`,
      shipmentData
    );
  }

  // ırsalıye pdf görme
  getEWaybillPdf(İttn:string): Observable<Blob> {

    return this.http.get(`${this.apiUrl}/EIrsaliye/ayrinti/giden/pdf/${İttn}`, { responseType: 'blob' });

  }
  }