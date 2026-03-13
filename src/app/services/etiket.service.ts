import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { Product,Promotion,Tag } from '../models/eskiAngular';
import { etiket } from '../models/etiket';
import { LabelDocuments } from '../models/lastDocuments';
import { MeService } from './meservice.service';

@Injectable({
  providedIn: 'root'
})
export class EtiketService {

  private apiPath = environment.eskipath;
  private apiUrl = environment.apiurl;

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
  ) {}

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
  getDocument(taskid: number, documentNo: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiUrl + '/etiket/' + taskid + '/etiketbelgesi/' + documentNo,
   
    );
  }

  // -------------------------
  // LAST DOCUMENTS
  // -------------------------
  getLastDocuments(taskid: number, warehouseNo: number): Observable<LabelDocuments[]> {



    return this.http.get<LabelDocuments[]>(
      this.apiUrl + '/Etiket/'+taskid+'/EklenenSonOnBelge/' + warehouseNo,

    );}

  // -------------------------
  // RAF ETIKETI – DATE
  // -------------------------
getByDateForLabel(taskid: number, dateTimeFilter: string): Observable<Product[]> {
  return this.http.get<Product[]>(
    `${this.apiUrl}/etiket/${taskid}/urunetiketleri/${dateTimeFilter}`
  );
}

  // -------------------------
  // KUNYE TAGS
  // -------------------------
  getTags(dateToGet: string, warehouseNo: number,taskid:number): Observable<Tag[]> {
    return this.http.get<Tag[]>(
      this.apiUrl +
        '/Etiket/'+taskid+'/Kunyeler/'+
        dateToGet,
  
    );
  }

  // -------------------------
  // FILTER ILE ETIKET
  // -------------------------
  getByFilterForLabel(filterString: string,taskid:number): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiUrl +
        '/Stoklar/' + taskid + '/EtiketUrunuAra/' + filterString,
    );
  }

   searchPromotionProducts(taskid: number,pluNo:number): Observable<Promotion> {
    return this.http.get<Promotion>(
      this.apiUrl + '/Promosyonlar/' + taskid + '/UrunPluNoPromosyonu/' + pluNo,
    );
  }
}

