import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { WarehouseService } from '../../../../../services/warehouse.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';
import { MeService } from '../../../../../services/meservice.service';
import { MatDialogRef } from '@angular/material/dialog';
import {  DepoCari, StokAraCT } from '../../../../../models/ortakModeller';
import { AlinanDepoSiparisleriEkleDto, KalemDto } from '../../../../../models/ekleModels';
import { listProducts } from '../../../../../models/listProduct';



@Component({
  selector: 'app-warehouse-sale-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './warehouse-order.html',
  styleUrls: ['./warehouse-order.css'],
})
export class WarehouseOrderComponent implements OnInit {

  /// ===================== SIGNAL STATE =====================
  depoAramaGirdisi = signal('');
  listProducts = signal<listProducts[]>([]);
  postorder = signal<AlinanDepoSiparisleriEkleDto>(this.createEmptyForm());
  arananUrun = signal('');
  bulunanUrunler = signal<StokAraCT[]>([]);
  bulunanDepolar = signal<DepoCari[]>([]);
  isSaving = signal(false);
  saveError = signal<string | null>(null);
  saveSuccess = signal(false);



  constructor(
    private warehouseService: WarehouseService,
    private salesOrdersService: SalesOrdersService,
    private meservice: MeService,
    private dialogRef: MatDialogRef<WarehouseOrderComponent>,
  ) { }

  ngOnInit() {
  
  }
  

  // ===================== COMPUTED =====================
  toplamKalemSayisi = computed(() =>
    this.listProducts().length ?? 0
  );
  readonly gorevid = computed(() =>
    this.meservice.selectedGorev()?.id ?? 0
  );


  toplamMiktar = computed(() =>
    this.listProducts().reduce((sum, k) => {
      return sum + (k?.miktar ?? 0);
    }, 0)
  );
  toplamTutar = computed(() =>
    this.listProducts().reduce((sum, k) => {
      return sum + ((k?.miktar ?? 0) * (k?.fiyat ?? 0));
    }, 0)
  );

  seciliDepo = computed(() => this.postorder(). muhatapSube?.depoNo);

  // ===================== INIT =====================
  private createEmptyForm(): AlinanDepoSiparisleriEkleDto {
    return {
       muhatapSube: null,
        muhatapFirma: null,
       kalemler: []
     
    };
  }

  // ===================== DEPO =====================


  depoAra(searchTerm: string) {
    this.warehouseService.searchWarehouse(searchTerm).subscribe({
      next: (depolar) => {
        this.bulunanDepolar.set(depolar);
      },
      error: () => {
        this.bulunanDepolar.set([]);
      }
    });


  }



    onDepoChange(depo:DepoCari) {
    this.postorder.update(p => ({
      ...p,
      muhatapSube: { depoNo: depo.depoNo, cariKod: depo.cariKod ,adres:depo.adres,il:depo.il,ilce:depo.ilce,temsilciAdSoyad:depo.temsilciAdSoyad,isim:depo.isim,unvan:depo.unvan,vergiDairesi:depo.vergiDairesi,vknTckn:depo.vknTckn,yetkiliAdSoyad:depo.yetkiliAdSoyad}
    }));
    this.bulunanDepolar.set([]);
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
      next: value => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {

          this.urunSec(this.bulunanUrunler()[0]);
        }
        else {

          this.bulunanUrunler.set(value);
        }
      }, error: () => this.bulunanUrunler.set([])
    });
  }

  urunSec(urun: StokAraCT) {
    console.log('Seçilen Ürün:', urun);
    const exists = this.listProducts()
      .some(k => k.stokKodu === urun.stokKod);
    if (exists) {
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


    this.arananUrun.set('');
    this.bulunanUrunler.set([]);
    this.saveError.set(null);
  }

  // ===================== KALEM =====================
  kalemSil(index: number) {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      this.listProducts.set(this.listProducts().filter((_, i) => i !== index));
  
    }
  }

  miktarArttir(index: number) {
    this.setMiktar(index, (this.listProducts()[index].miktar || 0) + 1);
  }

  miktarAzalt(index: number) {
    this.setMiktar(index, Math.max(1, (this.listProducts()[index].miktar || 1) - 1));
  }

  miktarGir(index: number, value: string | number) {
    const numericValue = Number(value);
    const next = Number.isFinite(numericValue) ? Math.max(1, numericValue) : 1;
    this.setMiktar(index, next);
  }

  private setMiktar(index: number, miktar: number) {
    this.listProducts.update(p => {
      const validatedKalemler = [...p];
      if (!validatedKalemler[index]) return p;

      validatedKalemler[index] = {
        ...validatedKalemler[index],
        miktar: Math.max(1, miktar)
      };

      return validatedKalemler;
    });
  }

  tumunuTemizle() {
    if (confirm('Tüm sipariş kalemlerini silmek istediğinize emin misiniz?')) {
      this.listProducts.set([]);
    }
  }
  kapat() {
    this.dialogRef.close();
  }

  private mapToPostOrder(): AlinanDepoSiparisleriEkleDto {
    return {
      ...this.postorder(),
      muhatapSube: this.postorder().muhatapSube,
      muhatapFirma: null,
      kalemler: this.listProducts().map(k => ({
        stokKodu: k.stokKodu,
        siparisMiktari: k.miktar,
      }))
    };
  }

  // ===================== SAVE =====================
  kaydet() {
    this.saveError.set(null);
    this.saveSuccess.set(false);

    // Validasyon
    if (!this.postorder().muhatapSube || this.postorder().muhatapSube?.depoNo === 0) {
      this.saveError.set('Depo seçmelisiniz.');
      return;
    }

    if (this.listProducts().length === 0) {
      this.saveError.set('En az bir ürün eklemelisiniz.');
      return;
    }

    // Miktar kontrolü
    const invalidKalem = this.listProducts().find(k => !k.miktar || k.miktar < 1);
    if (invalidKalem) {
      this.saveError.set('Lütfen tüm ürünler için geçerli miktar girin.');
      return;
    }

    this.isSaving.set(true);

    this.salesOrdersService.createBranchOrder(this.gorevid(), this.mapToPostOrder()).subscribe({
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

  trackByKalem = (_: number, kalem: KalemDto) => kalem.stokKodu;

  private resetFormAfterSuccess() {
    setTimeout(() => {
      this.saveSuccess.set(false);
      this.postorder.set(this.createEmptyForm());
      this.listProducts.set([]);
      this.arananUrun.set('');
      this.bulunanUrunler.set([]);
    }, 3000);
  }
}