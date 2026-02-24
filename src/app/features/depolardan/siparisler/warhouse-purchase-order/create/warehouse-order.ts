import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { MeService } from '../../../../../services/meservice.service';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DepoCari, StokAraCT } from '../../../../../models/ortakModeller';
import { listProducts } from '../../../../../models/listProduct';
import {  VerilenDepoSiparisleriEkleDto } from '../../../../../models/ekle-dtolari.model';
import { KalemDto } from '../../../../../models/ayrinti-dtolari.model';


@Component({
  selector: 'app-warehouse-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-order.html',
  styleUrls: ['./warehouse-order.css'],
})
export class WarehouseOrderComponent implements OnInit {


  // ===================== SIGNAL STATE =====================
  listProducts = signal<listProducts[]>([]);
  postorder = signal<VerilenDepoSiparisleriEkleDto>(this.createEmptyForm());

  arananUrun = signal('');
  depoAramaGirdisi = signal('');

  bulunanUrunler = signal<StokAraCT[]>([]);
  bulunanDepolar = signal<DepoCari[]>([]);

  isSaving = signal(false);
  saveError = signal<string | null>(null);
  saveSuccess = signal(false);

  // 🔥 GÖREV ID artık türetiliyor
  gorevid = computed(() =>
    this.meservice.selectedGorev()?.id ?? 0
  );

  constructor(
    private warehouseService: WarehouseService,
    private purchaseOrdersService: PurchaseOrdersService,
    private meservice: MeService,
    private dialogRef: MatDialogRef<WarehouseOrderComponent>,
  ) { }

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

  onDepoChange(depo: DepoCari) {
    console.log('Seçilen depo:', depo);
    this.postorder.update(p => ({
      ...p,
      muhatapDepoNo: depo.depoNo
    }));

    console.log('Güncellenmiş postorder:', this.postorder());
    this.depoAramaGirdisi.set(`${depo.depoNo} - ${depo.isim}`);

    this.bulunanDepolar.set([]);
  }

  // ===================== ÜRÜN =====================

  onSearchChange(term: string) {
    this.saveError.set(null);
     if (this.seciliDepo() === null || this.seciliDepo() === undefined) {
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

    this.warehouseService.searchStock(query).subscribe({
      next: res => {
        const isMobile = window.innerWidth <= 768;
        isMobile ? this.urunSec(res[0]) : this.bulunanUrunler.set(res);
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

  miktarArttir(index: number) { this.setMiktar(index, (this.listProducts()[index].miktar || 0) + 1); }
  miktarAzalt(index: number) { this.setMiktar(index, Math.max(1, (this.listProducts()[index].miktar || 1) - 1)); } 
 miktarGir(index: number, value: string | number) { const numericValue = Number(value); const next = Number.isFinite(numericValue) ? Math.max(1, numericValue) : 1; this.setMiktar(index, next); } 
 private setMiktar(index: number, miktar: number) { this.listProducts.update(p => { const validatedKalemler = [...p]; if (!validatedKalemler[index]) return p; validatedKalemler[index] = { ...validatedKalemler[index], miktar: Math.max(1, miktar) }; return validatedKalemler; }); }


  trackByKalem = (_: number, kalem: KalemDto) => kalem.stokKodu;

  // ===================== KALEM =====================

  kalemSil(index: number) {
    this.listProducts.update(p => p.filter((_, i) => i !== index));
  }

  tumunuTemizle() {
    this.listProducts.set([]);
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
    }, 3000);
  }

  kapat() {
    this.dialogRef.close();
  }

  private mapToPostOrder(): VerilenDepoSiparisleriEkleDto {
    return {
      ...this.postorder(),

      siparisAlanAdSoyad: this.postorder().siparisAlanAdSoyad,
      kalemler: this.listProducts().map(k => ({
        stokKodu: k.stokKodu,
        siparisMiktari: k.miktar
      }))
    };
  }
}

