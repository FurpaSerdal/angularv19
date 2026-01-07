import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { environment } from '../../environment';
export interface dto  {
carikod:string ,
bul : string
}
@Injectable({
  providedIn: 'root'
})
export class GenelİslemService {

  private readonly apiUrl = environment.apiurl; // API temel URL'si


  constructor(private http: HttpClient) { }


  listele(görevid: number, zamanlama: string = 'bugun'): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/gorevlerim/${görevid}/liste/${zamanlama}`
    );
  }

  detay(görevid: number, seri: string, sira: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/gorevlerim/${görevid}/ayrinti/${seri}/${sira}`
    );
  }


  StokAra(aramaKelimesi?: string): Observable<any[]> {
    const url = `${this.apiUrl}/stoklar/ara`;

    let params = new HttpParams();
    if (aramaKelimesi) {
      params = params.append('bul', aramaKelimesi);
    }
    return this.http.get<any[]>(url, { params });
  }

CariStokAra(aramaKelimesi?: string, carikod?: string): Observable<any[]> {
  const dto:dto= {
    carikod: carikod ?? "",
    bul: aramaKelimesi ?? ""
  };

  const url = `${this.apiUrl}/stoklar/cari-stok-ara`;


  return this.http.post<any[]>(url, dto);
}


evrakekle(gorevid: number, data: any): Observable<any> {
 
  return this.http.post<any>(`${this.apiUrl}/Gorevlerim/${gorevid}/ekle`, data);
}



 projeler(görevid: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/gorevlerim/${görevid}/projeler`
    );
  }
projelerDetay(
  gorevid: number,
  projeId: number,
  ittn?: string,
  belgeNo?: string,
  carikod?: string
): Observable<any> {
  
  const data = {
    projectId:projeId,
    ittn: ittn,
    belgeNo: belgeNo,
    carikod: carikod,
  };

  return this.http.post<any[]>(
    `${this.apiUrl}/gorevlerim/${gorevid}/projeler/ayrinti`,
    data
  );
}
  evrakayrinti(görevid:number,seri:string,sira:number){
        return this.http.get<any[]>(
      `${this.apiUrl}/gorevlerim/${görevid}/ayrinti/${seri}/${sira}`
    );
  }


 PDFİndir(belgeid: string,gorevadi:string): Observable<string> {
    const url = `${this.apiUrl}/${gorevadi}/e-irsaliye-pdf/${belgeid}`;
    return of(url);  // Örnek olarak Observable döndürüyoruz
  }


  önerilenListele(görevid: number, depono: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/v1/gorevlerim/6/taslak/depo-onerilen-siparis/${depono}`
    );
  }


  firmaönerilenListele(görevid: number, carihesapno: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/v1/gorevlerim/${görevid}/detay/${carihesapno}`
    );
  }

  depoListele(depono: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ara/${depono}`);
  }
  firmaListele(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cari-hesaplar/ara`, {
      params: { ara: query }
    });
  }
  firmaSiparisListele(gorevid: number, cariId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/gorevlerim/${gorevid}/firma-onerilen-siparisler/${cariId}`
    );
  }






  bekleyeEbelgeListele(görevid: number,zamanlama: string = 'bugun',issent:boolean,isEfaura:boolean): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/gorevlerim/${görevid}/liste/${zamanlama}/e-belge-gonderildi/${issent}/${isEfaura}`
    );
  }
topluEvrakCevir(gorevid: number, evraklar: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/gorevlerim/${gorevid}/gorevden/${gorevid}/goreve-toplu-cevir`,
    evraklar // <-- artık direkt DTO gönderiyoruz, sarmal yok
  );
}

sorguCalistir(): Observable<any[]> {
  const url = `${this.apiUrl}/NecipAbiSorguyuCalistir`;
 
  return this.http.get<any[]>(url);  
}
 
createPdf(gorevid: number, pendingInvoice: any): Observable<Blob> {
  return this.http.post(`${this.apiUrl}/gorevlerim/${gorevid}/ayrinti-pdf`, pendingInvoice, {
    responseType: 'blob'  
  });
}

getPdfFromUyumsoft(gorevid:Number,belgeId: string): Observable<string> {
  const url = `${this.apiUrl}/gorevlerim/${gorevid}/ayrinti-pdf/giden/${belgeId}`;
  const pdf =this.http.get(url)
  return of(url);
}



// createCariHareket(): Observable<string> {
//  private apiUrl1= 'https://192.168.254.214:7172/api/CariHesapHareketleri/create';

//   const headers = new HttpHeaders({
//     'accept': '*/*',
//     'Content-Type': 'application/json'
//   });

//   const body = {
//     faturaBilgileri: {
//       fatGuid: 'd2e86712-0da4-46ca-b0dc-3eda319cd3fb',
//       evrakTip: 63,
//       evrakNo: 'FEF25 - 8379',
//       tarih: '2025-11-04T00:00:00',
//       iade: 0,
//       belgeTarihi: '2025-11-04T00:00:00',
//       aciklama: 'KOSKA KASIM AYI KASA AKTİVİTE BEDELİ',
//       belgeNo: '',
//       araToplam: 50000,
//       tutar: 60000,
//       eBelgeTuru: 1,
//       musteriAdi: 'ENDERER GIDA SATIŞ DAĞITIM SANAYİ VE TİCARET ANONİM ŞİRKETİ',
//       musteriKodu: '32000378',
//       vdNo: '3341252397',
//       cariHareketCins: 8,
//       vergiDairesi: 'ULUDAĞ VERGİ DAİRESİ MÜD.',
//       cadde: 'KÜÇÜKBALIKLI MAH. SEMİH ODMAN SK. EN PA 7/1',
//       sokak: '',
//       ilce: 'OSMANGAZİ',
//       il: 'BURSA',
//       mail: 'enderer.gida@enderer.com.tr',
//       miktar: 1,
//       rusum: 0,
//       postaKodu: '16000',
//       faturaMail: 'urn:mail:defaultpk@enderergidaas.com.tr',
//       cariTel: '',
//       istisnaKodu: '',
//       istisnaAciklama: '',
//       ozelMatrahKodu: '',
//       ozelMatrahAciklama: '',
//       irsaliyeTarihi: '2025-11-04T00:00:00',
//       irsaliyeNo: '',
//       eFaturaMukellefiMi: true,
//       depo: ''
//     },
//     efatura: true,
//     firmInfo: {
//       customerTaxNo: 'string',
//       customerName: 'string',
//       customerAddress: 'string',
//       customerDistrict: 'string',
//       customerProvince: 'string',
//       customerEmail: 'string',
//       customerTaxOffice: 'string'
//     }
//   };

//   // 🔹 responseType: 'blob' --> PDF dosyası alabilmek için
//   return this.http.post(this.apiUrl1, body, {
//     headers,
//     responseType: 'text'
//   });
// }

}

