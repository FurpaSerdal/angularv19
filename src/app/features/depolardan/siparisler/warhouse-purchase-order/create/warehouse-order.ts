import { CommonModule } from '@angular/common';
import { Component,computed,OnInit,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { KalemDto } from '../../../../../models/ayrinti-dtolari.model';
import { VerilenDepoSiparisleriEkleDto } from '../../../../../models/ekle-dtolari.model';
import { listProducts } from '../../../../../models/listProduct';
import { DepoCari,StokAraCT } from '../../../../../models/ortakModeller';
import { MeService } from '../../../../../services/meservice.service';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { Subject, takeUntil } from 'rxjs';
import { Cart, CartLine } from '../../../../../models/eski-product.models';


@Component({
  selector: 'app-warehouse-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-order.html',
  styleUrls: ['./warehouse-order.css'],
})
export class WarehouseOrderComponent implements OnInit {
searchCancel$ = new Subject<void>();

manunelDepolar : DepoCari[] = [
    {
        "yetkiliAdSoyad": "Serdal Özsoy",
        "isim": "MANAV DEPO",
        "depoNo": 56,
        "cariKod": "3880115910",
        "unvan": "FURPA GIDA TEKSTİL KUYUM.İTH.İHR.SAN.VE TİC.LTD.ŞTİ. MUTFAK YEMEKHANE",
        "vknTckn": "3880115910",
        "vergiDairesi": "ERTUĞRULGAZİ VERGİ DAİRESİ MÜD.",
        "temsilciAdSoyad": "Serdal Özsoy",
        "adres": "YOLÇATI KÖYÜ BURSA TARIM HALİ",
        "ilce": "NİLÜFER",
        "il": "BURSA"
    },
           {
        "yetkiliAdSoyad": "Serdal Özsoy",
        "isim": "UNLU ÜRETİM ",
        "depoNo": 55,
        "cariKod": "3880115910",
        "unvan": "FURPA GIDA TEKSTİL KUYUM.İTH.İHR.SAN.VE TİC.LTD.ŞTİ. MUTFAK YEMEKHANE",
        "vknTckn": "3880115910",
        "vergiDairesi": "ERTUĞRULGAZİ VERGİ DAİRESİ MÜD.",
        "temsilciAdSoyad": "Serdal Özsoy",
        "adres": "ÇALI MAH. GÜMÜŞ CAD. NO:25B ",
        "ilce": "NİLÜFER",
        "il": "BURSA"
    }
]


  // ===================== SIGNAL STATE =====================
  listProducts = signal<listProducts[]>([]);
  postorder = signal<VerilenDepoSiparisleriEkleDto>(this.createEmptyForm());

  arananUrun = signal('');
  depoAramaGirdisi = signal('');
  seciliDepoBilgisi = signal<DepoCari | null>(null);
  depoSecimAcik = signal(false);
  depoSecimYontemi = signal<'manuel' | 'hızlı' | null>(null);


  bulunanUrunler = signal<StokAraCT[]>([]);
  bulunanDepolar = signal<DepoCari[]>([]);

  isSaving = signal(false);
  saveError = signal<string | null>(null);
  saveSuccess = signal(false);

  // 🔥 GÖREV ID artık türetiliyor
  gorevid = computed(() =>
    this.meservice.selectedGorev()?.id ?? 0
  );
  eskiApiLogin = computed(() =>
    this.meservice.userSignal()?.eskiApiLogin ?? ''
  );

  constructor(
    private warehouseService: WarehouseService,
    private purchaseOrdersService: PurchaseOrdersService,
    private meservice: MeService,
    private dialogRef: MatDialogRef<WarehouseOrderComponent>,
  ) 
  {}

  ngOnInit() { }

  // ===================== COMPUTED =====================

  toplamKalemSayisi = computed(() =>
    this.listProducts().length
  );

  toplamTutar = computed(() =>
    this.listProducts().reduce((sum, k) => {
      return sum + (k?.fiyat ?? 0) * (k?.miktar ?? 0);
    }, 0)
  );

  toplamMiktar = computed(() =>
    this.listProducts().reduce((sum, k) => sum + (k?.miktar ?? 0), 0)
  );

  seciliDepo = computed(() =>
    this.postorder().muhatapDepoNo
  );

  // 👉 API DTO tek yerden üretiliyor
  mappedPostOrder = computed(() => this.mapToPostOrder());

  // ===================== INIT =====================

  private createEmptyForm(): VerilenDepoSiparisleriEkleDto {
    return {
      muhatapDepoNo: 0,
      siparisAlanAdSoyad: '',
      kalemler: []
   
    };
  }

  // ===================== DEPO =====================

  depoAra(searchTerm: string) {
    this.saveError.set(null);
    this.warehouseService.searchWarehouse(searchTerm).subscribe({
      next: res => this.bulunanDepolar.set(res),
      error: err => console.error(err)
    });
  }

  onDepoChange(depo: DepoCari, yontem: 'manuel' | 'hızlı' = 'manuel') {
    this.postorder.update(p => ({
      ...p,
      muhatapDepoNo: depo.depoNo
    }));

    this.depoAramaGirdisi.set(`${depo.depoNo} - ${depo.isim}`);
    this.seciliDepoBilgisi.set(depo);
    this.depoSecimYontemi.set(yontem);
    this.depoSecimAcik.set(false);

    this.bulunanDepolar.set([]);
    this.bulunanUrunler.set([]);
    this.arananUrun.set('');

    if (yontem === 'hızlı') {
      this.depoUrunleriniYukle(depo.depoNo);
    }
  }

  manuelDepoSec(depo: DepoCari | null) {
    if (!depo) {
      this.postorder.update(p => ({
        ...p,
        muhatapDepoNo: 0
      }));
      this.seciliDepoBilgisi.set(null);
      this.depoSecimYontemi.set(null);
      this.depoAramaGirdisi.set('');
      this.listProducts.set([]);
      return;
    }

    this.onDepoChange(depo, 'hızlı');
  }

  toggleManuelDepoSecim() {
    this.depoSecimAcik.update(v => !v);
  }

  // ===================== ÜRÜN =====================

  onSearchChange(term: string) {
    this.saveError.set(null);
    
    // Elle arama hızlı depo seçimi sonrasında çalışmaz
    if (this.depoSecimYontemi() === 'hızlı') {
      return;
    }

    if (this.seciliDepoBilgisi() === null || this.seciliDepoBilgisi() === undefined) {
      this.saveError.set('Önce depo seçmelisiniz.');
      return;
    }
    this.arananUrun.set(term);
    this.urunAra();
  }

  urunAra() {
    const query = this.arananUrun().trim();
    if (query.length < 2) {
      this.bulunanUrunler.set([]);
      return;
    }
    this.searchCancel$.next(); // Önceki aramayı iptal et
    this.warehouseService.searchStock(query).pipe(
      takeUntil(this.searchCancel$)
    ).subscribe({
      next: res => {
        const filter = res.filter(u => u.sipDursun===0);
        const isMobile = window.innerWidth <= 768;
        isMobile ? this.urunSec(filter[0]) : this.bulunanUrunler.set(filter);
      },
      error: () => this.bulunanUrunler.set([])
    });
  }

  urunSec(urun: StokAraCT) {
    const exists = this.listProducts()
      .some(k => k.stokKodu === urun.stokKod);

    if (exists) {
      this.listProducts.update(p =>
        p.map(k =>
          k.stokKodu === urun.stokKod
            ? { ...k, miktar: k.miktar + (urun.birimKatsayisi ?? 1) }
            : k
        )
      );
    } else {
      this.listProducts.update(p => [
        ...p,
        {
          stokKodu: urun.stokKod,
          stokAdi: urun.stokIsim,
          birimAd: urun.birimAd,
          birimKatSayi: urun.birimKatsayisi,
          barkod: urun.barKodu,
          miktar: urun.birimKatsayisi ?? 1,
          fiyat: urun.fiyati
        }
      ]);
    }

    this.arananUrun.set('');
    this.bulunanUrunler.set([]);
    this.saveError.set(null);
  }

  miktarArttir(index: number) { this.setMiktar(index, (this.listProducts()[index].miktar || 0) + (this.listProducts()[index].birimKatSayi ?? 1)); }
  miktarAzalt(index: number) { this.setMiktar(index, Math.max(0, (this.listProducts()[index].miktar || 0) - (this.listProducts()[index].birimKatSayi ?? 1))); }
 miktarGir(index: number, value: string | number) { const numericValue = Number(value); const next = Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0; this.setMiktar(index, next); }
 private setMiktar(index: number, miktar: number) { this.listProducts.update(p => { const validatedKalemler = [...p]; if (!validatedKalemler[index])
   return p; validatedKalemler[index] = { ...validatedKalemler[index], miktar: Math.max(0, miktar) }; return validatedKalemler; }); }

  // ===================== KALEM =====================

  kalemSil(index: number) {
    this.listProducts.update(p => p.filter((_, i) => i !== index));
  }

  tumunuTemizle() {
    this.resetFormAfterSuccess();
   

  }

  // ===================== SAVE =====================

  kaydet() {
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.isSaving.set(true);

    const dto = this.mappedPostOrder();

    if (!dto.muhatapDepoNo) {
      this.saveError.set('Depo seçmelisiniz.');
      this.isSaving.set(false);

      return;
    }

    if (dto.kalemler.length === 0) {
      this.saveError.set('En az bir ürün eklemelisiniz.');
      this.isSaving.set(false);
      return;
    }


    this.purchaseOrdersService
      .createBranchOrder(this.gorevid(), dto)
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.saveSuccess.set(true);
          this.resetFormAfterSuccess();
        },
        error: err => {
          this.isSaving.set(false);
          this.saveError.set(err.message || 'Kaydetme hatası');
        }
      });
  }

  private resetFormAfterSuccess() {
    setTimeout(() => {
      this.saveSuccess.set(false);
      this.postorder.set(this.createEmptyForm());
      this.listProducts.set([]);
      this.arananUrun.set('');
      this.bulunanUrunler.set([]);
      this.depoAramaGirdisi.set('');
      this.seciliDepoBilgisi.set(null);
      this.depoSecimYontemi.set(null);
    }, 1000);
  }

  kapat() {
    this.dialogRef.close();
  }

  private mapToPostOrder(): VerilenDepoSiparisleriEkleDto {
    return {
      ...this.postorder(),

      siparisAlanAdSoyad: this.postorder().siparisAlanAdSoyad,
      kalemler: this.listProducts().filter(k => (k.miktar ?? 0) > 0).map(k => ({
        stokKodu: k.stokKodu,
        siparisMiktari: k.miktar
      }))
    };
  }

  private depoUrunleriniYukle(depoNo: number) {
    if (!this.eskiApiLogin()) {
      return;
    }

    if (depoNo === 56) {
      this.purchaseOrdersService.GetGreenGrocerProducts(this.eskiApiLogin()).subscribe({
        next: (res: Cart) => {
          this.listProducts.set(this.cartToListProducts(res));
        },
        error: err => console.error(err)
      });
      return;
    }

    if (depoNo === 55) {
      this.purchaseOrdersService.GetBakeryProducts(this.eskiApiLogin()).subscribe({
        next: (res: Cart) => {
          this.listProducts.set(this.cartToListProducts(res));
        },
        error: err => console.error(err)
      });
      return;
    }

    this.listProducts.set([]);
  }

  private cartToListProducts(cart: Cart): listProducts[] {
    return cart.cartLines.map((line: CartLine) => ({
      stokKodu: line.product.productCode,
      stokAdi: line.product.productName,
      birimAd: line.product.unitName,
      birimKatSayi: (line.product.unitPriceFactor && line.product.unitPriceFactor > 0) ? line.product.unitPriceFactor : 1,
      barkod: line.product.barcode ?? '',
      miktar: 0,
      fiyat: line.product.price
    }));
  }
}

