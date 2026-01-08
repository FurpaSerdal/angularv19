// pages/company-order/company-order.ts
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../../../../services/company.service';
import { CariHesapAraCT, StokAraCT, StokBulDto } from '../../../../../models/genelModel';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { FirmaSiparisiVerDto } from '../../../../../models/firmaSiparisverModel';
import { Kalem } from '../../../../../models/ortakModeller';
import { ToastrService } from 'ngx-toastr';
import { MeService } from '../../../../../services/meservice.service';


@Component({
  selector: 'app-company-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-order.html',
  styleUrl: './company-order.css',
})
export class CompanyOrder {
  // Form State
  postorder: FirmaSiparisiVerDto = this.initializeForm();
   gorev: number = 0;
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

  constructor(
    private toastr: ToastrService,
    private  meservice: MeService,
    public companyService: CompanyService,
    private purchaseOrderService: PurchaseOrdersService
  ) {
    effect(() => {
      this.gorev = this.meservice.selectedAltMenu()?.id ?? 0;
    });
  }

  private initializeForm(): FirmaSiparisiVerDto {
    return {
      gorevKimlik: 0,
      cari_kod: '',
      teslimTarihi: new Date().toISOString().split('T')[0],
      noksanFazlaIadesi: 0,
      kalemler: [],
      siparisEden: '',
      siparisAlan: '',
    };
  }

  // === FIRMA OPERATIONS ===
  firmaAra(): void {
    const query = this.searchInput.trim();

    if (!query) {
      this.bulunanFirmalar = [];
      this.seciliFirma = null;
      return;
    }

    if (query.length < 2) {
      this.bulunanFirmalar = [];
      return;
    }

    this.companyService.searchCustomerAccount(query).subscribe({
      next: (res) => {
        this.bulunanFirmalar = res;
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
    this.postorder.cari_kod = firma.cariKod;
    this.searchInput = `${firma.cariKod} - ${firma.cariUnvan}`;
    this.bulunanFirmalar = [];
  }

  // === URUN OPERATIONS ===
  urunAra(): void {
    const query = this.arananUrun.trim();

    if (!query || !this.postorder.cari_kod) {
      this.bulunanUrunler = [];
      return;
    }

    if (query.length < 2) {
      this.bulunanUrunler = [];
      return;
    }

    const dto: StokBulDto = {
      CariKod: this.postorder.cari_kod,
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
      id: crypto.randomUUID(), // Veya başka bir UUID üretici
      aciklama: "",
      siparisMiktari: urun.birimKatsayisi || 1, // Varsayılan miktar 1
      stok: {
        stokKod: urun.stokKod,
        stokIsim: urun.stokIsim,
        birimAd: urun.birimAd,
        barkodlar: urun.barKodu ? [{
          barKodu: urun.barKodu,
          stokKod: urun.stokKod,
          birimAd: urun.birimAd,
          birimKatSayisi: urun.birimKatsayisi ?? 1
        }] : [],
        fiyat: {
          depoNo: 0,
          fiyati: urun.fiyati ?? 0,
          satisDursun: 0,
          sipDursun: 0,
          malKabulDursun: 0
        }
      }
      // Diğer opsiyonel alanlar otomatik olarak undefined kalacak
    };

    this.postorder.kalemler = [...this.postorder.kalemler, yeniKalem];
    this.arananUrun = '';
    this.bulunanUrunler = [];
  }

  // === KALEM OPERATIONS ===
  kalemSil(index: number): void {
    this.postorder.kalemler = this.postorder.kalemler.filter((_, i) => i !== index);
  }

  kalemMiktarArttir(index: number): void {
    const kalem = this.postorder.kalemler[index];
    if (kalem) {
      kalem.siparisMiktari = (kalem.siparisMiktari || 0) + 1;
    }
  }

  kalemMiktarAzalt(index: number): void {
    const kalem = this.postorder.kalemler[index];
    if (kalem && (kalem.siparisMiktari || 0) > 1) {
      kalem.siparisMiktari = (kalem.siparisMiktari || 0) - 1;
    }
  }

  kalemMiktarDegistir(index: number, miktar: number): void {
    const kalem = this.postorder.kalemler[index];
    if (kalem && miktar >= 1) {
      kalem.siparisMiktari = miktar;
    }
  }

  getKalemTutar(kalem: Kalem): number {
    const miktar = kalem.siparisMiktari || 0;
    const fiyat = kalem.stok?.fiyat?.fiyati || 0;
    return miktar * fiyat;
  }

  getToplamTutar(): number {
    return this.postorder.kalemler.reduce((toplam, kalem) => {
      return toplam + this.getKalemTutar(kalem);
    }, 0);
  }

  trackByKalemIndex(index: number, item: Kalem): string {
    return item.id || index.toString();
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

    // Tüm miktarları kontrol et
    const gecersizKalem = this.postorder.kalemler.find(k => !k.siparisMiktari || k.siparisMiktari < 1);
    if (gecersizKalem) {
      this.saveError = 'Tüm kalemlerin miktarı en az 1 olmalıdır.';
      return;
    }

    this.isSaving = true;
    
    this.purchaseOrderService.createCompanyOrder(this.gorev,this.postorder).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.temizle();
      },
      error: (error) => {
        this.isSaving = false;
        this.saveError = error.message || 'Sipariş kaydedilirken bir hata oluştu.';
      }
    });

    setTimeout(() => {
      this.isSaving = false;
      this.saveSuccess = true;
      console.log('Gönderilen veri:', this.postorder);
    }, 1000);
  }

  // === CLEAR OPERATION ===
  temizle(): void {
    this.postorder = this.initializeForm();
    this.seciliFirma = null;
    this.searchInput = '';
    this.arananUrun = '';
    this.bulunanFirmalar = [];
    this.bulunanUrunler = [];
    this.saveError = null;
    this.saveSuccess = false;
  }
}