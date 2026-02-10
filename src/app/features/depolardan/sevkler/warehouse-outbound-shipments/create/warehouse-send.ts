import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { SevkIrsaliyeleriEkleDto } from '../../../../../models/ekleModels';
import { listProducts } from '../../../../../models/listProduct';
import { DepoCari, StokAraCT } from '../../../../../models/ortakModeller';
import { MeService } from '../../../../../services/meservice.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { WarehouseService } from '../../../../../services/warehouse.service';

@Component({
  selector: 'app-warehouse-send',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './warehouse-send.html',
})
export class WarehouseSend {
  // ================= STATE =================
  depoAramaGirdisi = signal('');
  bulunanDepolar = signal<DepoCari[]>([]);
  selectedDepo: DepoCari | null = null;
  plaka = signal('');

  aramaGirdisi = signal('');
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);

  listProducts = signal<listProducts[]>([]);

  iade = signal(false);
  duzeltme = signal(false);

  gorevId = signal(0);
  gorevAdi = signal('Depo');

  gonderiliyor = signal(false);

  saveError = signal<string | null>(null);
  saveSuccess = signal(false);

  // ================= COMPUTED =================
  toplamKalemSayisi = computed(() =>
    this.listProducts().length
  );

  toplamMiktar = computed(() =>
    this.listProducts().reduce(
      (sum, k) => sum + (k.miktar ?? 0),
      0
    )
  );

  toplamTutar = computed(() =>
    this.listProducts().reduce(
      (sum, k) =>
        sum + (k.miktar ?? 0) * (k.fiyat ?? 0),
      0
    )
  );

  constructor(
    private warehouseService: WarehouseService,
    private meService: MeService,
    private shipmentService: ShipmentNotesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WarehouseSend>,
  ) {
    // görev dinle
    effect(() => {
      const gorev = this.meService.selectedGorev();
      this.gorevId.set(gorev?.id ?? 0);
      this.gorevAdi.set(gorev?.isim ?? 'Depo');
    });
  }

  // ================= DEPO =================
  depoAra(term: string) {
    if (!term.trim()) return;

    this.warehouseService.searchWarehouse(term).subscribe({
      next: res => this.bulunanDepolar.set(res),
      error: () =>
        this.toastr.error('Depo aranırken hata oluştu'),
    });
  }

  onDepoChange(depo: DepoCari) {
    this.selectedDepo = depo;
    this.bulunanDepolar.set([]);
    this.depoAramaGirdisi.set(depo.isim || '');
  }

  // ================= ÜRÜN =================
  urunAra(term: string) {
    if (!term.trim()) return;

    this.warehouseService
      .searchStock(term.toLowerCase())
      .subscribe({
        next: res => this.bulunanUrunler.set(res),
        error: () =>
          this.toastr.error('Ürün aranırken hata oluştu'),
      });
  }

  urunSec(urun: StokAraCT) {
    this.secilenUrun.set(urun);
    this.urunEkle();
    this.bulunanUrunler.set([]);
    this.aramaGirdisi.set('');
  }

  urunEkle() {
    const urun = this.secilenUrun();
    if (!urun) return;

    const yeni: listProducts = {
      stokAdi: urun.stokIsim,
      stokKodu: urun.stokKod,
      barkod: urun.barKodu,
      fiyat: urun.fiyati,
      birimAd: urun.birimAd,
      birimKatSayi: urun.birimKatsayisi,
      miktar: 1,
    };

    const index = this.listProducts().findIndex(
      u => u.stokKodu === yeni.stokKodu
    );

    if (index > -1) {
      this.listProducts.update(list =>
        list.map((k, i) =>
          i === index
            ? {
                ...k,
                miktar: (k.miktar ?? 0) + 1,
              }
            : k
        )
      );
    } else {
      this.listProducts.update(list => [
        ...list,
        yeni,
      ]);
    }
  }

  miktarArttir(index: number) {
    this.setMiktar(
      index,
      (this.listProducts()[index].miktar || 0) + 1
    );
  }

  miktarAzalt(index: number) {
    this.setMiktar(
      index,
      Math.max(
        1,
        (this.listProducts()[index].miktar || 1) - 1
      )
    );
  }

  miktarGir(index: number, value: string | number) {
    const numericValue = Number(value);
    const next = Number.isFinite(numericValue)
      ? Math.max(1, numericValue)
      : 1;

    this.setMiktar(index, next);
  }

  private setMiktar(index: number, miktar: number) {
    this.listProducts.update(list => {
      const next = [...list];
      if (!next[index]) return list;

      next[index] = {
        ...next[index],
        miktar: Math.max(1, miktar),
      };

      return next;
    });
  }

  urunSil(i: number) {
    this.listProducts.update(list =>
      list.filter((_, idx) => idx !== i)
    );
  }

  trackByKalem = (_: number, kalem: listProducts) =>
    kalem.stokKodu;

  // ================= KAYDET =================
  kaydet() {
    if (!this.selectedDepo?.depoNo) {
      this.toastr.warning('Depo seçiniz');
      return;
    }

    if (!this.listProducts().length) {
      this.toastr.warning('Ürün ekleyiniz');
      return;
    }

    this.gonderiliyor.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    const dto: SevkIrsaliyeleriEkleDto = {
      sevkTarihi: new Date(),
      iadedir: this.iade(),
      muhatapFirma: null,
      muhatapSube: {
        depoNo: this.selectedDepo?.depoNo || 0,
        cariKod: '',
      },
      nakliyeDeposu: {
        depoNo: this.selectedDepo?.depoNo || 0,
        plaka: this.plaka() || '',
        soforAdSoyad: '',
      },
      kalemler: this.listProducts().map(k => ({
        stokKodu: k.stokKodu,
        sevkMiktari: k.miktar,
        duzeltmedir: this.duzeltme(),
      })),
    };

    this.shipmentService
      .createBranchShipment(this.gorevId(), dto)
      .subscribe({
        next: () => {
          this.toastr.success(
            'Sevk başarıyla kaydedildi'
          );
          this.saveSuccess.set(true);
          this.gonderiliyor.set(false);
          this.temizle();
        },
        error: () => {
          this.saveError.set(
            'Kaydetme sırasında hata oluştu'
          );
          this.gonderiliyor.set(false);
        },
      });
  }

  temizle() {
    this.listProducts.set([]);
    this.bulunanUrunler.set([]);
    this.selectedDepo = null;

    this.depoAramaGirdisi.set('');
    this.aramaGirdisi.set('');

    this.iade.set(false);
    this.duzeltme.set(false);
  }

  kapat() {
    this.dialogRef.close();
  }
}
