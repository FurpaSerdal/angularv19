import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { MeService } from '../../../../../services/meservice.service';
import { StokAraCT } from '../../../../../models/genelModel';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warehouse-send',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './warehouse-send.html',
})
export class WarehouseSend {
  karsiDepo: number = 0;
  seciliAltMenu = signal<number>(0);
  iade = signal<boolean>(false);
  gorevAdi = signal<string>('Depo');
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private warehouseservice: WarehouseService,
    private meservice: MeService,
    private shipmentnoteservice: ShipmentNotesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WarehouseSend>,

    
  
  ) {
    effect(() => {
      this.seciliAltMenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });
  }

  urunAra(aranacak: string) {
    if (!aranacak.trim()) return;
    
    const aranacakKelime = aranacak.toLocaleLowerCase();
    this.warehouseservice.searchStock(aranacakKelime).subscribe({
      next: (value) => this.bulunanUrunler.set(value),
      error: (err) => {
        console.error('Stok arama hatası:', err);
        this.toastr.error('Ürün aranırken hata oluştu');
      }
    });
  }

  urunSec(urun: StokAraCT) {
    this.secilenUrun.set(urun);
    this.urunEkle();
    this.bulunanUrunler.set([]);
    this.aramaGirdisi.set('');
  }

  urunEkle() {
    const secilenUrun = this.secilenUrun();
    if (!secilenUrun) return;

    const eklenecekUrun: any = {
      UrunAdi: secilenUrun.stokIsim,
      UrunKodu: secilenUrun.stokKod,
      barkodu: secilenUrun.barKodu,
      fiyat: secilenUrun.fiyati,
      birimkatsayisi: secilenUrun.birimKatsayisi,
      sto_birim_ad: secilenUrun.birimAd,
      sevkMiktari: 1,
      tedarikciStokKod: '',
      aciklama: '',
    };

    const existingIndex = this.urunListesi().findIndex(
      u => u.UrunKodu === eklenecekUrun.UrunKodu
    );

    if (existingIndex !== -1) {
      const updatedList = this.urunListesi().map((item, index) =>
        index === existingIndex
          ? { ...item, sevkMiktari: (item.sevkMiktari ?? 0) + 1 }
          : item
      );
      this.urunListesi.set(updatedList);
    } else {
      this.urunListesi.set([...this.urunListesi(), eklenecekUrun]);
    }

    this.dataSource.data = this.urunListesi();
  }

  urunSil(index: number) {
    const newList = [...this.urunListesi()];
    newList.splice(index, 1);
    this.urunListesi.set(newList);
    this.dataSource.data = this.urunListesi();
  }

  kaydet() {
    if (this.karsiDepo === 0) {
      this.toastr.warning('Lütfen bir depo seçin');
      return;
    }

    if (this.dataSource.data.length === 0) {
      this.toastr.warning('Lütfen en az bir ürün ekleyin');
      return;
    }

    this.gonderiliyor.set(true);

    const shipmentData = {
      iadedir: this.iade(),
      muhatapDepoNo: this.karsiDepo,
      kalemler: this.urunListesi().map(k => ({
        sevkMiktari: k.sevkMiktari,
        aciklama: this.iade() ? 'Fazla mal iade sevkiyatı' : 'Normal sevkiyat',
        barkodlar: [k.barkodu],
        fiyat: k.fiyat,
        birimkatsayisi: k.birimkatsayisi,
        stok: {
          stokKod: k.UrunKodu,
          stokIsim: k.UrunAdi,
          birimAd: k.sto_birim_ad,
        }
      }))
    };

    this.shipmentnoteservice
      .createBranchShipment(this.seciliAltMenu(), shipmentData)
      .subscribe({
        next: (res) => {
          this.toastr.success('Başarıyla kaydedildi!');
          this.gonderiliyor.set(false);
          this.temizle();
        },
        error: (err) => {
          this.toastr.error('Kaydedilirken hata oluştu!');
          console.error(err);
          this.gonderiliyor.set(false);
        }
      });
  }

  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.karsiDepo = 0;
    this.iade.set(false);
    this.aramaGirdisi.set('');
  }

  kapat() {
    this.dialogRef.close();
   
  }
}