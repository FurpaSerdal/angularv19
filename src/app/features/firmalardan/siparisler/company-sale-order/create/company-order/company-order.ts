// pages/company-order/company-order.ts
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { listProducts } from '../../../../../../models/listProduct';
import { AlinanSiparislerEkleDto, KalemDto } from '../../../../../../models/ekleModels';
import { CariHesapAraCT, StokAraCT, StokBulDto } from '../../../../../../models/ortakModeller';
import { ToastrService } from 'ngx-toastr';
import { MeService } from '../../../../../../services/meservice.service';
import { CompanyService } from '../../../../../../services/company.service';
import { SalesOrdersService } from '../../../../../../services/orders/sales-orders.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-company-sale-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-order.html',
  styleUrl: './company-order.css',
})
export class CompanyOrder {
  // Form State

    listProducts = signal<listProducts[]>([]);

  postorder: AlinanSiparislerEkleDto = this.initializeForm();

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

  // Computed state from MeService
  readonly gorevid = computed(() => 
    this.meservice.selectedGorev()?.id ?? 0
  );

  constructor(
    private toastr: ToastrService,
    private  meservice: MeService,
    public companyService: CompanyService,
    private salesOrdersService: SalesOrdersService,
      public dialogRef: MatDialogRef<CompanyOrder>,
 
  ) {}

  private initializeForm(): AlinanSiparislerEkleDto {
    return {
      kalemler: [],
      muhatapFirma: {cariKod: '',unvan:''},
      muhatapSube: null,
   
  
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
    console.log('Seçilen Firma:', this.seciliFirma);
    this.postorder.muhatapFirma = {
      cariKod: firma.cariKod,unvan: firma.cariUnvan
    };
    console.log('Güncellenen Sipariş Formu:', this.postorder);
    this.searchInput = `${firma.cariKod} - ${firma.cariUnvan}`;
    this.bulunanFirmalar = [];
  }

  // === URUN OPERATIONS ===
  urunAra(): void {
    const query = this.arananUrun.trim();

    if (!query || !this.postorder.muhatapFirma) {
      this.bulunanUrunler = [];
      return;
    }

    if (query.length < 2) {
      this.bulunanUrunler = [];
      return;
    }

    const dto: StokBulDto = {
      CariKod: this.postorder.muhatapFirma?.cariKod || '',
      Bul: query
    };

    this.companyService.searchStockByCustomerCode(dto).subscribe({
        next: value =>{
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        
        this.seciliUrun = value[0];
        if (this.seciliUrun) {
          this.urunSec(this.seciliUrun);
        }
      }
      else {

      this.bulunanUrunler = value;
      }
    },
      error: (err) => {
        console.error('Ürün arama hatası', err);
        this.bulunanUrunler = [];
      }
    });
  }

   urunSec(urun: StokAraCT) {
    const exists = this.listProducts()
      .some(k => k.stokKodu === urun.stokKod);
    if (exists) {
      console.log('Ürün zaten listede, miktar artırılıyor:', urun.stokKod);
      this.listProducts.set(this.listProducts().map(k => {
        if (k.stokKodu === urun.stokKod) {
          return {
            ...k,
            miktar: k.miktar + (urun.birimKatsayisi ?? 1)
          };
        }
        return k;
      }));
    }
    else {
      console.log('Yeni ürün listeye ekleniyor:', urun.stokKod);
      this.listProducts.set([...this.listProducts(), {
        stokKodu: urun.stokKod,
        stokAdi: urun.stokIsim,
        birimAd: urun.birimAd,
        birimKatSayi: urun.birimKatsayisi,
        barkod: urun.barKodu,
        miktar: urun.birimKatsayisi ?? 1,
        fiyat: urun.fiyati
      }]);
      console.log('Güncellenmiş Ürün Listesi:', this.listProducts());
    }


    this.arananUrun = '';
    this.bulunanUrunler = [];
    this.saveError = null;
  }

  // === KALEM OPERATIONS ===
  kalemSil(index: number): void {
    this.listProducts.set(this.listProducts().filter((_, i) => i !== index));
  }

  kalemMiktarArttir(index: number): void {
    const kalem = this.listProducts()[index];
    if (kalem) {
      kalem.miktar = (kalem.miktar || 0) + 1;
    }
  }

  kalemMiktarAzalt(index: number): void {
    const kalem = this.listProducts()[index];
    if (kalem && (kalem.miktar || 0) > 1) {
      kalem.miktar = (kalem.miktar || 0) - 1;
    }
  }

  kalemMiktarDegistir(index: number, miktar: number): void {
    const kalem = this.listProducts()[index];
    if (kalem && miktar >= 1) {
      kalem.miktar = miktar;
    }
  }

  getKalemTutar(kalem: listProducts): number {
    const miktar = kalem.miktar || 0;
    const fiyat = kalem.fiyat || 0;
    return miktar * fiyat;
  }

  getToplamTutar(): number {
    return this.listProducts().reduce((toplam, kalem) => {
      return toplam + this.getKalemTutar(kalem);
    }, 0);
  }

  trackByKalemIndex(index: number, item: listProducts): string {
    return item.stokKodu || index.toString();
  }
  kapat()  {
 this.dialogRef.close();
  }
  private maptopostorder(): AlinanSiparislerEkleDto {
    return {
      ...this.postorder,
      kalemler: this.listProducts().map(kalem => ({
        stokKodu: kalem.stokKodu,
        siparisMiktari: kalem.miktar || 0,
        birimAd: kalem.birimAd,
        fiyat: kalem.fiyat || 0,
      }))
    };

 
  }

  // === SAVE OPERATION ===
  kaydet(): void {
    this.saveError = null;
    this.saveSuccess = false;

    if (!this.seciliFirma) {
      this.saveError = 'Lütfen bir firma seçin.';
      return;
    }

    if (this.listProducts().length === 0) {
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
    this.maptopostorder();
    this.salesOrdersService.createCompanyOrder(this.gorevid(),this.maptopostorder()).subscribe({
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
      console.log('Gönderilen veri:', this.maptopostorder());
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