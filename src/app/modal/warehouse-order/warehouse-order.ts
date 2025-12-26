import { Component } from '@angular/core';
import { warehouse } from '../../../services/warehouse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvrakaKalemEkleDto, EvrakKaydetDto, StokAraCT } from '../../models/documentSave';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-warehouse-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-order.html',
  styleUrls: ['./warehouse-order.css'],
})
export class WarehouseOrder {
  // Form State
  postorder: EvrakKaydetDto = this.initializeForm();

  // Search State
  searchInput: string = '';
  arananUrun: string = '';
  bulunanUrunler: StokAraCT[] = [];

  // Selection State
  seciliUrun: StokAraCT | null = null;

  // UI State
  isSaving = false;
  saveError: string | null = null;
  saveSuccess = false;

  constructor(public warehouseService: warehouse,    private crudservice:CrudService,
  ) {}

  private initializeForm(): EvrakKaydetDto {
    return {
      //siparisEvrakNoSeri: null,
      //siparisEvrakNoSira: null,
      evrakNoSeri: null,
      evrakNoSira: null,

      depo: {
        depoNo: 0,
        depoIsmi: '',
        sofor: {
          adi: '',
          soyAdi: '',
          aracPlakasi: '',
          tcknVkn: ''
        },
      },

      muhatapDepo: {
        depoNo: 0,
        depoIsmi: '',
        sofor: {
          adi: '',
          soyAdi: '',
          aracPlakasi: '',
          tcknVkn: ''
        },
      },

      muhatapFirma: {
        cariKodu: null,
        tcknVkn: null,
        sofor: {
          adi: '',
          soyAdi: '',
          aracPlakasi: '',
          tcknVkn: ''
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
      .reduce((sum, k) => sum + ((k.siparisMiktari || 0) * k.stok.fiyati), 0);
  }

  // === URUN OPERATIONS ===
  urunAra(): void {
    const query = this.arananUrun.trim();


    this.warehouseService.stokAra(query).subscribe({
      next: (urunler) => this.bulunanUrunler = urunler,
      error: (err) => {
        console.error('Ürün arama hatası', err);
        this.bulunanUrunler = [];
      }
    });
  }

  urunSec(urun: StokAraCT): void {
    this.seciliUrun = urun;
    const yeniKalem: EvrakaKalemEkleDto = {
      stok: urun,
      siparisGuid: null,
      siparisMiktari: 1,
      sevkMiktari: null,
      malKabulMiktari: null,
      sevkMalKabulFarkMiktari: null,
      aciklama: null
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

    if (this.postorder.kalemler.length === 0) {
      this.saveError = 'En az bir ürün eklemelisiniz.';
      return;
    }

    const payload: EvrakKaydetDto = { ...this.postorder };

    this.isSaving = true;
    // this.crudservice.documentSave(27, payload).subscribe({
    //   next: (res) => {
    //     this.isSaving = false;
    //     this.saveSuccess = true;
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
