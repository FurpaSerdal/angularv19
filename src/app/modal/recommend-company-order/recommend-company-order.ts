import { Component, signal } from '@angular/core';
import { UserService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirmaOSDto, OnerilenFirmaSiparisCT } from '../../models/RecommendOrder';
import { CariHesapAraCT, EvrakKaydetDto } from '../../models/documentSave';
import { CompanyService } from '../../../services/company.service';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-recommend-company-order',
  imports: [CommonModule,FormsModule],
  templateUrl: './recommend-company-order.html',
  styleUrl: './recommend-company-order.css',
})
export class RecommendCompanyOrder {

 data = signal<any>(null); // başta null, sonra değer atanabilir
  onerilen: OnerilenFirmaSiparisCT [] = [];
  payload!: FirmaOSDto ;
  gorevid: number = 0;
  firma: string = "" // default seçili depo
  stokkodu: string = "";
  yukleniyor:boolean=false


   // Search State
    searchInput: string = '';
    arananUrun: string = '';
    bulunanFirmalar: CariHesapAraCT[] = [];
  
    // Selection State
    seciliFirma: CariHesapAraCT | null = null;
  //sip kaydetme
    postorder: EvrakKaydetDto = this.initializeForm();

  

  constructor(private companyorderService: CompanyService,     private crudservice:CrudService,
  private dataService: UserService) {}
  private initializeForm(): EvrakKaydetDto {
  return {
   // siparisEvrakNoSeri: null,
    //siparisEvrakNoSira: null,
    evrakNoSeri: null,
    evrakNoSira: null,

    depo: {
      depoNo: 109,
      depoIsmi: null,
          sofor: {
      adi: null,
      soyAdi: null,
      aracPlakasi: null,
      tcknVkn: null
    },
    },

    muhatapDepo: {
       depoNo: 0,
      depoIsmi: null,
          sofor: {
      adi: null,
      soyAdi: null,
      aracPlakasi: null,
      tcknVkn: null
    },
      
    },

    muhatapFirma: {
      cariKodu: null,
      tcknVkn: null,
       sofor: {
      adi: null,
      soyAdi: null,
      aracPlakasi: null,
      tcknVkn: null
    },
    },

    kalemler: [],



    aciklama: null
  };
}

  ngOnInit() {
    this.dataService.SeçiliGörevid$.subscribe(data => this.gorevid = data);
  }

  getonerien() {
    this.yukleniyor=true
    this.payload = {
      CariKod:  this.seciliFirma?.cariKod ?? "",
      StokKodu: this.stokkodu ?? null
    };

    this.companyorderService.getcompanyRecommend(28, this.payload)
      .subscribe({
        next: (res: OnerilenFirmaSiparisCT []) => {
          this.onerilen = res; // tabloya bağlamak için array'e atıyoruz
          console.log('Önerilen siparişler:', res);
          this.yukleniyor=false
        },
        error: (err) => {
          console.error('Önerilen siparişler getirilemedi', err);
          this.onerilen = [];
        }
      });
  }
  deleteitem(index: number): void {
  // Kalemleri filtreleyerek seçili satırı kaldırıyoruz
  this.onerilen = this.onerilen.filter((_, i) => i !== index);
}

 // === FIRMA OPERATIONS ===
  firmaAra(): void {
    const query = this.searchInput.trim();

    if (!query) {
      this.bulunanFirmalar = [];
      this.seciliFirma = null;
      return;
    }

    // çok kısa query'lerde istek atma
    if (query.length < 2) {
      this.bulunanFirmalar = [];
      return;
    }

    this.companyorderService.cariAra(query).subscribe({
      next: (res) => {
        this.bulunanFirmalar = res;
        console.log(this.bulunanFirmalar ,"bulunan fırmalar",res,"res")
   
      },
      error: (err) => {
        console.error('Cari arama hatası', err);
        this.bulunanFirmalar = [];
      }
    });
  }

  firmaSec(firma: CariHesapAraCT): void {
    this.seciliFirma = firma;

    this.postorder.muhatapFirma.cariKodu = firma.cariKod;
    this.searchInput = `${firma.cariKod} - ${firma.cariUnvan}`;
    this.bulunanFirmalar = [];
  }

private onerilentoorder() {
this.postorder.kalemler = this.onerilen.map(item => ({
  stok: {
    depoNo: 109,          // istersen kendi depo numaranı buraya al
    barKodu: item.bar_kodu,         // boş bırakabilir veya API’den al
    stokKod: item.sto_kod,
    stokIsim: item.sto_isim,
    fiyati: 0,           // fiyat gerekiyorsa buraya al
    birimAd: '',
    birimKatsayisi: item.sto_birim2_katsayi,
    satisDursun: 0,
    sipDursun: 0,
    malKabulDursun: 0,
    urunSorumlusu: null
  },
  siparisGuid: null,
  siparisMiktari: item.siparis_miktari,
  sevkMiktari: null,
  malKabulMiktari: null,
  sevkMalKabulFarkMiktari: null,
  aciklama: null
}));}


sipariskaydet(){
  this.onerilentoorder()
 this.data.set(this.postorder)
localStorage.setItem('data', JSON.stringify(this.postorder));
console.log(this.postorder)
// this.crudservice.documentSave(29,this.postorder).subscribe(res=>
//   console.log(res)
// )
}

  trackByIndex(index: number, _item: any): number {
  return index;
}
}
