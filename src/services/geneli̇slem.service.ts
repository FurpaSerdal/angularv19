import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { environment } from '../environment';

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
      `${this.apiUrl}/gorevlerim/${görevid}/ayrintilari/${seri}/${sira}`
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


  bekleyeEbelgeListele(görevid: number,zamanlama: string = 'bugun',issent:boolean): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/gorevlerim/${görevid}/liste/${zamanlama}/e-belge-gonderildi/${issent}`
    );
  }
topluEvrakCevir(gorevid: number, evraklar: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/gorevlerim/${gorevid}/gorevden/${gorevid}/goreve-toplu-cevir`,
    evraklar // <-- artık direkt DTO gönderiyoruz, sarmal yok
  );
}
 
}

