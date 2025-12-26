// pages/company-order/company-order.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CariHesapAraCT, EvrakaKalemEkleDto, EvrakKaydetDto, StokAraCT, StokBulDto } from '../../models/documentSave';
import { CompanyService } from '../../../services/company.service';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-company-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-order.html',
  styleUrl: './company-order.css',
})
export class CompanyOrder {
  // Form State
  postorder: EvrakKaydetDto = this.initializeForm();

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

  constructor(public companyService: CompanyService,    private crudservice:CrudService,
  ) {}

private initializeForm(): EvrakKaydetDto {
  return {
    //siparisEvrakNoSeri: null,
   // siparisEvrakNoSira: null,
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
  // === CALCULATED ===
  get toplamKalemSayisi(): number {
    return this.postorder.kalemler.length;
  }

  get toplamTutar(): number {
    return this.postorder.kalemler
      .reduce((sum, k) => sum + (k.stok.fiyati * k.stok.fiyati), 0);
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

    this.companyService.cariAra(query).subscribe({
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
    console.log(this.seciliFirma)
    this.postorder.muhatapFirma.cariKodu = firma.cariKod;
    this.searchInput = `${firma.cariKod} - ${firma.cariUnvan}`;
    this.bulunanFirmalar = [];
  }

  // === URUN OPERATIONS ===
  urunAra(): void {
    const query = this.arananUrun.trim();

    if (!query || !this.postorder.muhatapFirma.cariKodu) {
      this.bulunanUrunler = [];
      return;
    }

    if (query.length < 2) {
      this.bulunanUrunler = [];
      return;
    }

    const dto: StokBulDto = {
      CariKod: this.postorder.muhatapFirma.cariKodu,
      Bul: query
    };

    this.companyService.stokCariKodIleAra(dto).subscribe({
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
const yeniKalem: EvrakaKalemEkleDto = {
  stok:urun,
  siparisGuid: null,
  siparisMiktari: null,
  sevkMiktari: null,
  malKabulMiktari: null,
  sevkMalKabulFarkMiktari: null,
  aciklama: null,
  SonKullanimTarihi:null
};
    this.postorder.kalemler = [...this.postorder.kalemler, yeniKalem];
    this.arananUrun = '';
    this.bulunanUrunler = [];
  }

  // === KALEM OPERATIONS ===
  kalemSil(index: number): void {
    this.postorder.kalemler = this.postorder.kalemler.filter((_, i) => i !== index);
  }

  trackByKalemIndex(index: number, _item: EvrakaKalemEkleDto): number {
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

    const payload: EvrakKaydetDto = {
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
