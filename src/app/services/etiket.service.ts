import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { etiket } from '../models/etiket';
import { LabelDocuments } from '../models/lastDocuments';
import { MeService } from './meservice.service';
import { Product, Tag } from '../models/eskiAngular';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class EtiketService {

  private apiPath = environment.eskipath;

  warehouseNo: number = 0;

  etiketTipleri: etiket[] = [
    { etiketIsmi: 'Raf Etiketi', etiketTipi: 'rack_label', ozelCss: '/assets/css/rafEtiketi.css' },
    { etiketIsmi: 'Raf Etiketi A5', etiketTipi: 'rack_label_a4', ozelCss: '/assets/css/rack-label-style-a4.css' },

    { etiketIsmi: 'A4 Fiyat Etiketi', etiketTipi: 'a4_pricelabel', ozelCss: '/assets/a4Label.css' },
    { etiketIsmi: 'A4 Furpara Kart Etiketi', etiketTipi: 'a4_cardlabel', ozelCss: '/assets/a4Label.css' },

    { etiketIsmi: 'A5 İkili Fiyat Etiketi', etiketTipi: 'a5_pricelabel', ozelCss: '/assets/css/a5Label.css' },
    { etiketIsmi: 'A5 İkili Ayın Ürünü Fiyat Etiketi', etiketTipi: 'a5_pricelabel_advantage', ozelCss: '/assets/a5Label.css' },
    { etiketIsmi: 'A5 İkili Furpara Kart Etiketi', etiketTipi: 'a5_cardlabel', ozelCss: '/assets/a5Label.css' },

    { etiketIsmi: 'A5 Tekli Fiyat Etiketi', etiketTipi: 'a5_single_pricelabel', ozelCss: '/assets/a5Label.css' },
    { etiketIsmi: 'A5 Tekli Furpara Kart Etiketi', etiketTipi: 'a5_single_cardlabel', ozelCss: '/assets/a5Label.css' }
  ];

  constructor(
    private http: HttpClient,
    private meservice: MeService
  ) {
    this.warehouseNo = this.meservice.getUserSignal()()?.subeNo || 0;
  }

  // -------------------------
  // HEADER BUILDER
  // -------------------------
  private getHeaders(): HttpHeaders {
    const token = this.meservice.getUserSignal()()?.eskiApiLogin || '';
    console.log('Kullanıcı tokenı:', token); // Token'ı konsola yazdırarak kontrol edin

    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
  }

  // -------------------------
  // ETIKET TIPLERI
  // -------------------------
  etiketTip() {
    return this.etiketTipleri;
  }

  // -------------------------
  // DOCUMENT GET
  // -------------------------
  getDocument(documentNo: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiPath + 'LabelDocuments/Get/' + documentNo,
      {
        headers: this.getHeaders()
      }
    );
  }

  // -------------------------
  // LAST DOCUMENTS
  // -------------------------
  getLastDocuments(warehouseNo?: number): Observable<LabelDocuments[]> {

    const depoNo = warehouseNo || this.warehouseNo;

    return this.http.get<LabelDocuments[]>(
      this.apiPath + 'LabelDocuments/GetLastDocument/' + depoNo,
      {
        headers: this.getHeaders()
      }
    );
  }

  // -------------------------
  // RAF ETIKETI – DATE
  // -------------------------
  getByDateForLabel(dateTimeFilter: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiPath +
        'products/GetByDateForLabel?dateTimeFilter=' +
        dateTimeFilter +
        '&warehouseNo=' +
        this.warehouseNo,
      {
        headers: this.getHeaders()
      }
    );
  }

  // -------------------------
  // KUNYE TAGS
  // -------------------------
  getTags(dateToGet: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(
      this.apiPath +
        'LabelDocuments/Tags?dateToGet=' +
        dateToGet +
        '&warehouseNo=' +
        this.warehouseNo,
      {
        headers: this.getHeaders()
      }
    );
  }

  // -------------------------
  // FILTER ILE ETIKET
  // -------------------------
  getByFilterForLabel(filterString: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiPath +
        'products/GetByFilterForLabel?filterString=' +
        filterString +
        '&warehouseNo=' +
        this.warehouseNo,
      {
        headers: this.getHeaders()
      }
    );
  }
}
