// pages/company-order/company-order.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CariHesapAraCT, EvrakEkleDto, Kalem, StokAraCT, StokBulDto } from '../../../../../models/evrakKaydet';
import { CompanyService } from '../../../../../services/company.service';



@Component({
  selector: 'app-company-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-order.html',
  styleUrl: './company-order.css',
})
export class CompanyOrder {
  // Form State
  postorder: EvrakEkleDto = this.initializeForm();

  // Search State
  searchInput: string = '';
  arananUrun: string = '';
  bulunanFirmalar: CariHesapAraCT[] = [];
  bulunanUrunler: StokAraCT[] = [];

  // Selection State
  seciliFirma: CariHesapAraCT | null = null;
  seciliUrun: StokAraCT | null = null;

  // UI State
  isSaving = false;
  saveError: string | null = null;
  saveSuccess = false;

  constructor(public companyService: CompanyService
  ) {}

private initializeForm(): EvrakEkleDto {
    return {
      kareKod: null,
      kareKodIrsaliyenindir: null,
      evrakNoSeri: null,
      evrakNoSira: null,
      teslimTarihi: null,
      belgeNo: "",
      iadedir: null,
      teslimAlan: null,
      teslimEden: null,
      muhatabiFirmadir: null,
      sfdsEvrakidir:null,

      depo: {
        no: null,
        isim: ""
      },

      muhatapDepo: {
        no: null,
        isim: "",
      },

      muhatapFirma: {
        no: "",
        isim: "",
        adresi: ""
      },

      aciklama: null,
      kalemler: []
    };
  }
  // === CALCULATED ===
  get toplamKalemSayisi(): number {
    return this.postorder.kalemler.length;
  }
  // get toplamMiktar(): number {
  //   return this.postorder.kalemler.reduce((sum, kalem) => sum + (kalem.miktar || 0), 0);
  // }
get toplamTutar(): number {
  return this.postorder.kalemler.reduce((sum, k) => {
    const fiyat = k.stok?.fiyat?.fiyati ?? 0;
    const miktar = k.miktar ?? 0;
    return sum + (fiyat * miktar);
  }, 0);
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

    this.companyService.searchCustomerAccount(query).subscribe({
      next: (res) => {
        this.bulunanFirmalar = res;
        console.log(this.bulunanFirmalar ,"bulunan fırmalar",res,"res")
        this.saveSuccess = false;
        this.saveError = null;
      },
      error: (err) => {
        console.error('Cari arama hatası', err);
        this.bulunanFirmalar = [];
      }
    });
  }

firmaSec(firma: CariHesapAraCT): void {
  this.seciliFirma = firma;

  if (this.postorder.muhatapFirma) {
    this.postorder.muhatapFirma.no = firma.cariKod;
  }

  this.searchInput = `${firma.cariKod} - ${firma.cariUnvan}`;
  this.bulunanFirmalar = [];
}
  // === URUN OPERATIONS ===
  urunAra(): void {
    const query = this.arananUrun.trim();

    if (!query || !this.postorder.muhatapFirma?.no) {
      this.bulunanUrunler = [];
      return;
    }

    if (query.length < 2) {
      this.bulunanUrunler = [];
      return;
    }

    const dto: StokBulDto = {
      CariKod: this.postorder.muhatapFirma.no,
      Bul: query
    };

    this.companyService.searchStockByCustomerCode(dto).subscribe({
      next: (urunler) => {
        this.bulunanUrunler = urunler;
      },
      error: (err) => {
        console.error('Ürün arama hatası', err);
        this.bulunanUrunler = [];
      }
    });
  }


urunSec(urun: StokAraCT): void {
  this.seciliUrun = urun;

  const yeniKalem: Kalem = {
    aciklama: null,
    evrak: null,
    evrakId: null,

    faturaGuid: null,
    sevkGuid: null,
    siparisGuid: null,
    iadeyeKonuIrsaliyeGuidi: null,

    miktar: 0,
    sonKullanimTarihi: null,

    eFaturaEttn: null,
    eIrsaliyeEttn: null,

    stok: {
      stokKod: urun.stokKod,
      stokIsim: urun.stokIsim,
      birimAd: urun.birimAd,
      birimKatSayisi: urun.birimKatsayisi ?? 1,

      barkodlar: urun.barKodu
        ? [{
            barKodu: urun.barKodu,
            stokKod: urun.stokKod,
            birimAd: urun.birimAd,
            birimKatSayisi: urun.birimKatsayisi ?? 1
          }]
        : [],

      fiyat: {
        depoNo: 0,
        fiyati: 0,
        satisDursun: 0,
        sipDursun: 0,
        malKabulDursun: 0
      }
    }
  };

  this.postorder.kalemler = [...this.postorder.kalemler, yeniKalem];
  this.arananUrun = '';
  this.bulunanUrunler = [];
}

  // === KALEM OPERATIONS ===
  kalemSil(index: number): void {
    this.postorder.kalemler = this.postorder.kalemler.filter((_, i) => i !== index);
  }

  trackByKalemIndex(index: number, _item: Kalem): number {
    return index;
  }

  // === SAVE OPERATION ===
  kaydet(): void {
    this.saveError = null;
    this.saveSuccess = false;

    if (!this.seciliFirma) {
      this.saveError = 'Lütfen bir firma seçin.';
      return;
    }

    if (this.postorder.kalemler.length === 0) {
      this.saveError = 'En az bir ürün eklemelisiniz.';
      return;
    }

    const payload: EvrakEkleDto = {
      ...this.postorder
    };

    this.isSaving = true;
    console.log(payload)

    // this.crudservice.documentSave(28, payload).subscribe({
    //   next: (res) => {
    //     this.isSaving=false
    //     console.log('Kaydet response:', res);
    //   },
    //   error: (err) => {
    //     this.isSaving = false;
    //     this.saveError = 'Kaydetme sırasında bir hata oluştu.';
    //     console.error('Kaydet hatası', err);
    //   }
    // });
  }
}
