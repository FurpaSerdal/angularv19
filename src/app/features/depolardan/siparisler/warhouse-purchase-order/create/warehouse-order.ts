import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WarehouseService } from '../../../../../services/warehouse.service';
import { SubeSiparisiVerDto } from '../../../../../models/depoSipVerModel';
import { MeService } from '../../../../../services/meservice.service';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Kalem, StokAraCT } from '../../../../../models/ortakModeller';

@Component({
  selector: 'app-warehouse-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-order.html',
  styleUrls: ['./warehouse-order.css'],
})
export class WarehouseOrderComponent implements OnInit {

  // ===================== SIGNAL STATE =====================
  postorder = signal<SubeSiparisiVerDto>(this.createEmptyForm());
  arananUrun = signal('');
  bulunanUrunler = signal<StokAraCT[]>([]);
  isSaving = signal(false);
  saveError = signal<string | null>(null);
  altmenu = signal(0);
  saveSuccess = signal(false);

  readonly depolar = [
    { no: 50, isim: 'Merkez' },
    { no: 2, isim: 'Depo 2' },
    { no: 3, isim: 'Depo 3' }
  ];

  constructor(
    private warehouseService: WarehouseService,
    private purchaseOrdersService: PurchaseOrdersService,
    private meservice: MeService,
    private dialogRef: MatDialogRef<WarehouseOrderComponent>,
  ) {
    effect(() => {
      this.altmenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });

    effect(() => {
      console.log('Kalem sayısı:', this.toplamKalemSayisi());
    });
  }

  ngOnInit() {
    // Başlangıçta ilk depoyu seç (isteğe bağlı)
    if (this.depolar.length > 0) {
      this.onDepoChange(this.depolar[0].no);
    }
  }

  // ===================== COMPUTED =====================
  toplamKalemSayisi = computed(() =>
    this.postorder().kalemler.length
  );

  toplamTutar = computed(() =>
    this.postorder().kalemler.reduce((sum, k) => {
      const fiyat = k?.stok?.fiyat?.fiyati ?? 0;
      const miktar = k?.siparisMiktari ?? 0;
      return sum + fiyat * miktar;
    }, 0)
  );

  toplamMiktar = computed(() =>
    this.postorder().kalemler.reduce((sum, k) => {
      return sum + (k?.siparisMiktari ?? 0);
    }, 0)
  );

  seciliDepo = computed(() => this.postorder().muhatapDepoNo);

  // ===================== INIT =====================
  private createEmptyForm(): SubeSiparisiVerDto {
    return {
      muhatapDepoNo: 0,
      kalemler: []
    };
  }

  // ===================== DEPO =====================
  onDepoChange(depoNo: number) {
    const depo = this.depolar.find(d => d.no === +depoNo);
    if (!depo) return;

    this.postorder.update(p => ({
      ...p,
      muhatapDepoNo: depo.no
    }));
  }

  // ===================== URUN =====================
  onSearchChange(term: string) {
    this.arananUrun.set(term);
    this.urunAra();
  }

  urunAra() {
    const query = this.arananUrun().trim();

    if (query.length < 2) {
      this.bulunanUrunler.set([]);
      return;
    }

    this.warehouseService.searchStock(query).subscribe({
      next: res => {const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        this.urunSec(res[0]);
      }
      else {

      this.bulunanUrunler.set(res);
      }},
      error: () => this.bulunanUrunler.set([])
    });
  }

  urunSec(urun: StokAraCT) {
    const exists = this.postorder()
      .kalemler
      .some(k => k.stok?.stokKod === urun.stokKod);

    if (exists) {
      this.saveError.set('Bu ürün zaten sipariş listesinde mevcut!');
      setTimeout(() => this.saveError.set(null), 3000);
      return;
    }

    const kalem: Kalem = {
      id: crypto.randomUUID(),
      aciklama: "",
      siparisMiktari: 1,
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
          depoNo: this.postorder().muhatapDepoNo ?? 0,
          fiyati: urun.fiyati ?? 0,
          satisDursun: 0,
          sipDursun: 0,
          malKabulDursun: 0
        }
      }
    };

    this.postorder.update(p => ({
      ...p,
      kalemler: [...p.kalemler, kalem]
    }));

    this.arananUrun.set('');
    this.bulunanUrunler.set([]);
    this.saveError.set(null);
  }

  // ===================== KALEM =====================
  kalemSil(index: number) {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      this.postorder.update(p => ({
        ...p,
        kalemler: p.kalemler.filter((_, i) => i !== index)
      }));
    }
  }

  miktarArttir(index: number) {
    this.setMiktar(index, (this.postorder().kalemler[index].siparisMiktari || 0) + 1);
  }

  miktarAzalt(index: number) {
    this.setMiktar(index, Math.max(1, (this.postorder().kalemler[index].siparisMiktari || 1) - 1));
  }

  miktarGir(index: number, value: string | number) {
    const numericValue = Number(value);
    const next = Number.isFinite(numericValue) ? Math.max(1, numericValue) : 1;
    this.setMiktar(index, next);
  }

  private setMiktar(index: number, miktar: number) {
    this.postorder.update(p => {
      const validatedKalemler = [...p.kalemler];
      if (!validatedKalemler[index]) return p;

      validatedKalemler[index] = {
        ...validatedKalemler[index],
        siparisMiktari: Math.max(1, miktar)
      };

      return {
        ...p,
        kalemler: validatedKalemler
      };
    });
  }

  tumunuTemizle() {
    if (confirm('Tüm sipariş kalemlerini silmek istediğinize emin misiniz?')) {
      this.postorder.update(p => ({
        ...p,
        kalemler: []
      }));
    }
  }
  kapat() { 
    this.dialogRef.close();
  }

  // ===================== SAVE =====================
  kaydet() {
    this.saveError.set(null);
    this.saveSuccess.set(false);

    // Validasyon
    if (!this.postorder().muhatapDepoNo || this.postorder().muhatapDepoNo === 0) {
      this.saveError.set('Depo seçmelisiniz.');
      return;
    }

    if (this.postorder().kalemler.length === 0) {
      this.saveError.set('En az bir ürün eklemelisiniz.');
      return;
    }

    // Miktar kontrolü
    const invalidKalem = this.postorder().kalemler.find(k => !k.siparisMiktari || k.siparisMiktari < 1);
    if (invalidKalem) {
      this.saveError.set('Lütfen tüm ürünler için geçerli miktar girin.');
      return;
    }

    this.isSaving.set(true);

    this.purchaseOrdersService.createBranchOrder(this.altmenu(), this.postorder()).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        this.resetFormAfterSuccess();
      },
      error: (error) => {
        this.isSaving.set(false);
        this.saveError.set(error.message || 'Kaydetme hatası');
      }
    });
  }

  trackByKalem = (_: number, kalem: Kalem) => kalem.id;

  private resetFormAfterSuccess() {
    setTimeout(() => {
      this.saveSuccess.set(false);
      this.postorder.set(this.createEmptyForm());
      this.arananUrun.set('');
      this.bulunanUrunler.set([]);
    }, 3000);
  }
}