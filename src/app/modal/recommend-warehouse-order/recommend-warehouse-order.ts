import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { warehouse } from '../../../services/warehouse.service';
import { DepoOSDto, OnerilenDepoSiparisleriCT } from '../../models/RecommendOrder';
import { EvrakKaydetDto } from '../../models/documentSave';
import { UserService } from '../../../services/data.service';
import { CrudService } from '../../../services/crud.service';


@Component({
  selector: 'app-recommend-warehouse-order',
  imports: [CommonModule,FormsModule],
  templateUrl: './recommend-warehouse-order.html',
  styleUrl: './recommend-warehouse-order.css',
})
export class RecommendWarehouseOrder {
  data = signal<any>(null); // başta null, sonra değer atanabilir
  onerilen: OnerilenDepoSiparisleriCT[] = [];
  payload!: DepoOSDto;
  gorevid: number = 0;
  karsidepo: number = 0 // default seçili depo
  stokkodu: string = "";
  yukleniyor:boolean=false

  //sip kaydetme
    postorder: EvrakKaydetDto = this.initializeForm();

  

  constructor(private warehouseService: warehouse,     private crudservice:CrudService,
  private dataService: UserService) {}
  private initializeForm(): EvrakKaydetDto {
  return {
   //siparisEvrakNoSeri: null,
    //siparisEvrakNoSira: null,
    evrakNoSeri: null,
    evrakNoSira: null,

    depo: {
      depoNo: 0,
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
      KarsiDepo: this.karsidepo,
      StokKodu: this.stokkodu ?? null
    };

    this.warehouseService.getwarehouseRecommend(27, this.payload)
      .subscribe({
        next: (res: OnerilenDepoSiparisleriCT[]) => {
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
private onerilentoorder() {
this.postorder.kalemler = this.onerilen.map(item => ({
  stok: {
    depoNo: 0,          // istersen kendi depo numaranı buraya al
    barKodu: item.barkod,         // boş bırakabilir veya API’den al
    stokKod: item.stokKodu,
    stokIsim: item.stokAdi,
    fiyati: 0,           // fiyat gerekiyorsa buraya al
    birimAd: '',
    birimKatsayisi: item.birim2Katsayi,
    satisDursun: 0,
    sipDursun: 0,
    malKabulDursun: 0,
    urunSorumlusu: null
  },
  siparisGuid: null,
  siparisMiktari: item.siparisMiktari,
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
// this.crudservice.documentSave(27,this.postorder).subscribe(res=>
//   console.log(res)
// )
}

  trackByIndex(index: number, _item: any): number {
  return index;
}
}